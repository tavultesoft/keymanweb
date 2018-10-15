/*
  Name:             k32_lowlevelkeyboardhook
  Copyright:        Copyright (C) SIL International.
  Documentation:    
  Description:      
  Create Date:      3 Aug 2014

  Modified Date:    25 Oct 2016
  Authors:          mcdurdin
  Related Files:    
  Dependencies:     

  Bugs:             
  Todo:             
  Notes:            
  History:          03 Aug 2014 - mcdurdin - I4326 - V9.0 - Switch-off hotkey not working, then keyboard hotkey stopped working (win 8.1 jeremy) [High]
                    13 Oct 2014 - mcdurdin - I4451 - V9.0 - Language hotkeys are not working
                    27 Mar 2015 - mcdurdin - I4641 - V9.0 - Keyman can crash silently on exit due to null hotkeys being addressed
                    22 Apr 2015 - mcdurdin - I4674 - V9.0 - Hotkeys do not always work consistently
                    14 May 2015 - mcdurdin - I4714 - V9.0 - Keyboard and language hotkeys don't always work
                    09 Aug 2015 - mcdurdin - I4844 - Tidy up PostDummyKeyEvent calls
                    25 Oct 2016 - mcdurdin - I5136 - Remove additional product references from Keyman Engine
*/
// I4326
#include "pch.h"
#include "serialkeyeventserver.h"

#ifdef _WIN64
#error k32_lowlevelkeyboardhook.cpp is not required for win64.
#endif

LRESULT _kmnLowLevelKeyboardProc(
  _In_  int nCode,
  _In_  WPARAM wParam,
  _In_  LPARAM lParam
);

// Local variables only used by single thread -- low level keyboard proc thread
DWORD FHotkeyShiftState = 0;

LRESULT CALLBACK kmnLowLevelKeyboardProc(
  _In_  int nCode,
  _In_  WPARAM wParam,
  _In_  LPARAM lParam
) {
  LRESULT res = 0;
#ifdef _DEBUG_EXCEPTION
	res = _kmnLowLevelKeyboardProc(nCode,wParam,lParam);
#else
  __try {
	  res = _kmnLowLevelKeyboardProc(nCode,wParam,lParam);
	}
  __except(ExceptionMessage("kmnLowLevelKeyboardProc", GetExceptionInformation())) {
	}
#endif
	return res;
}

BOOL KeyLanguageSwitchPress(WPARAM wParam, BOOL extended, BOOL isUp, DWORD ShiftState);
int ProcessLanguageSwitchShiftKey(WPARAM wParam, BOOL isUp);
BOOL IsLanguageSwitchWindowVisible();
void SendToLanguageSwitchWindow(WPARAM wParam, LPARAM lParam);

LPARAM LLKHFFlagstoWMKeymanKeyEventFlags(PKBDLLHOOKSTRUCT hs) {
  return (hs->scanCode << 16) |
    ((hs->flags & LLKHF_EXTENDED) ? KEYEVENTF_EXTENDEDKEY : 0) |
    ((hs->flags & LLKHF_UP) ? KEYEVENTF_KEYUP : 0);
}

/*
  We don't attempt to serialize input to the console windows because they 
  behave somewhat differently to normal windows. For now, this should be 
  sufficient. In the future, we may want to find a way to interrogate the 
  focused process to find out which window actually has focus for posting
  messages, because we appear to post the messages to the wrong thread
  for console windows.
*/
BOOL IsConsoleWindow(HWND hwnd) {
  static HWND last_hwnd = 0;
  static BOOL last_isConsoleWindow = FALSE;
  
  if (last_hwnd == hwnd) {
    return last_isConsoleWindow;
  }

  char buf[64];

  last_hwnd = hwnd;
  last_isConsoleWindow = GetClassName(hwnd, buf, 64) && !strcmp(buf, "ConsoleWindowClass");

  return last_isConsoleWindow;
}

LRESULT _kmnLowLevelKeyboardProc(
  _In_  int nCode, 
  _In_  WPARAM wParam, 
  _In_  LPARAM lParam
) {

  if(nCode < 0) {
    return CallNextHookEx(Globals::get_hhookLowLevelKeyboardProc(), nCode, wParam, lParam);
  }

	
  PKBDLLHOOKSTRUCT hs = (PKBDLLHOOKSTRUCT) lParam;

  BOOL extended = hs->flags & LLKHF_EXTENDED ? TRUE : FALSE;
  BOOL isUp = hs->flags & LLKHF_UP ? TRUE : FALSE;

  SendDebugMessageFormat(0, sdmAIDefault, 0, "kmnLowLevelKeyboardProc: wparam: %x  lparam: %x [vk:%s scan:%x flags:%x extra:%x]", wParam, lParam, Debug_VirtualKey((WORD) hs->vkCode), hs->scanCode, hs->flags, hs->dwExtraInfo);   // I4674

  if (hs->dwExtraInfo == EXTRAINFO_FLAG_SERIALIZED_USER_KEY_EVENT || hs->scanCode == SCAN_FLAG_KEYMAN_KEY_EVENT || hs->vkCode == VK_PROCESSKEY || hs->vkCode == VK_PACKET) {
    // This key event was generated by Keyman, so pass it through
    return CallNextHookEx(Globals::get_hhookLowLevelKeyboardProc(), nCode, wParam, lParam);
  }

  // Track shift state
  DWORD Flag = 0;
  switch(hs->vkCode) {
    case VK_LCONTROL: 
    case VK_RCONTROL: 
    case VK_CONTROL:  Flag = HK_CTRL; break;
    case VK_LMENU:    
    case VK_RMENU:    
    case VK_MENU:     Flag = HK_ALT; break;
    case VK_LSHIFT:
    case VK_RSHIFT:
    case VK_SHIFT:    Flag = HK_SHIFT; break;
  }

  if(Flag != 0) {
    if(isUp) FHotkeyShiftState &= ~Flag;
    else FHotkeyShiftState |= Flag;
  }

  if(IsLanguageSwitchWindowVisible()) {
    SendDebugMessageFormat(0, sdmAIDefault, 0, "kmnLowLevelKeyboardProc: Sending to language switch window %x %x", wParam, lParam);
    SendToLanguageSwitchWindow(hs->vkCode, hs->flags);
    return ProcessLanguageSwitchShiftKey(hs->vkCode, isUp);
  }

  if(KeyLanguageSwitchPress(hs->vkCode, extended, isUp, FHotkeyShiftState))
    return ProcessLanguageSwitchShiftKey(hs->vkCode, isUp);

  /*
  Process keyboard hotkeys
  */

  DWORD hk = (DWORD) hs->vkCode | FHotkeyShiftState;

  Hotkeys *hotkeys = Hotkeys::Instance();   // I4641

	/*
	Search for an interface or language hotkey
	*/
		
  // TODO: deprecate KeymanUIDisabled, FSingleThread

  if(hotkeys) {   // I4641
	  Hotkey *hotkey = hotkeys->GetHotkey(hk);
	  if(hotkey) {
		  if(isUp) {
        if(hotkey->HotkeyType == hktInterface) {
			    SendDebugMessageFormat(0, sdmGlobal, 0, "Hotkey matched = {HotkeyValue: %x, Target: %d}", 
				    hotkey->HotkeyValue,
				    hotkey->Target);
			    Globals::PostMasterController(wm_keyman_control, MAKELONG(KMC_INTERFACEHOTKEY, hotkey->Target), 0);
        } else {
			    SendDebugMessageFormat(0, sdmGlobal, 0, "Hotkey matched = {HotkeyValue: %x, hkl: %x}", 
				    hotkey->HotkeyValue,
				    hotkey->hkl);
          
          // Send the hotkey value to the master controller, rather than the language HKL or profile GUID, because
          // this is cheaper than constructing a string and posting it across.
          
          Globals::PostMasterController(wm_keyman_control, MAKELONG(KMC_LANGUAGEHOTKEY, 0), (LPARAM) hotkey->HotkeyValue);   // I4451
        }
		  }
	    return 1;
    }
  }

  /*
    
    Not a hotkey, so we will use the serialized input model
  
  */

  if (flag_ShouldSerializeInput) {
    GUITHREADINFO gui = { 0 };
    gui.cbSize = sizeof(GUITHREADINFO);
    if (GetGUIThreadInfo(NULL, &gui)) {
      SendDebugMessageFormat(0, sdmGlobal, 0, "LowLevelHook: Active=%x Focus=%x Key=%s flags=%x",
        gui.hwndActive, gui.hwndFocus, Debug_VirtualKey((WORD)hs->vkCode), LLKHFFlagstoWMKeymanKeyEventFlags(hs));

      HWND hwnd = gui.hwndFocus ? gui.hwndFocus : gui.hwndActive;
      if (!IsConsoleWindow(hwnd)) {
#ifdef USE_SERIALKEYEVENTSERVER
        PostMessage(ISerialKeyEventServer::GetServer()->GetWindow(), wm_keyman_keyevent, hs->vkCode, LLKHFFlagstoWMKeymanKeyEventFlags(hs));
#else
        PostThreadMessage(GetWindowThreadProcessId(GetForegroundWindow(), NULL), wm_keyman_keyevent, hs->vkCode, LLKHFFlagstoWMKeymanKeyEventFlags(hs));
#endif
        return 1;
      }
      //else SendDebugMessageFormat(0, sdmGlobal, 0, "LowLevelHook: console window, not serializing"); // too noisy 
    }
    else {
      SendDebugMessageFormat(0, sdmGlobal, 0, "LowLevelHook: Failed to get Gui thread info with error %d", GetLastError());
    }
  }

  return CallNextHookEx(Globals::get_hhookLowLevelKeyboardProc(), nCode, wParam, lParam);
}

