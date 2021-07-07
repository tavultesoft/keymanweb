/*
  Copyright:        Copyright (C) 2003-2018 SIL International.
  Authors:          mcdurdin
*/
#include <keyman/keyboardprocessor_consts.h>
#include <kmx/kmx_processevent.h>

using namespace km::kbp;
using namespace kmx;

KMX_BOOL KMX_ProcessEvent::IsCapsLockOn(KMX_DWORD modifiers) {
  return modifiers & CAPITALFLAG;
}

void KMX_ProcessEvent::SetCapsLock(KMX_DWORD &modifiers, KMX_BOOL capsLockOn) {
  m_actions.QueueAction(QIT_CAPSLOCK, capsLockOn);
  if (capsLockOn) {
    modifiers |= CAPITALFLAG;
  } else {
    modifiers &= ~CAPITALFLAG;
  }
}

/*
 * PRIVATE void ResetCapsLock(KMX_DWORD &modifiers);
 *
 * Parameters: modifiers    The modifier keys
 *
 *   Called by:  ProcessEvent
 *
 * Turn off caps lock if it is on and CapsAlwaysOff is set
 */
void KMX_ProcessEvent::ResetCapsLock(KMX_DWORD &modifiers) {
  DebugLog("ResetCapsLock: enter");

  if (m_keyboard.Keyboard->dwFlags & KF_CAPSALWAYSOFF) {
    DebugLog("ResetCapsLock: caps lock should be always off");
    if (IsCapsLockOn(modifiers)) {
      DebugLog("ResetCapsLock: caps lock is on, switching off caps lock");
      SetCapsLock(modifiers, false);
    }
  }
  DebugLog("ResetCapsLock: exit");
}

/*
 * PRIVATE void KeyCapsLockPress(KMX_DWORD modifiers, KMX_BOOL isKeyDown);
 *
 * Parameters: modifiers    The modifier keys
 *             isKeyDown    TRUE if this is called on KeyDown event, FALSE if
 *                          called on KeyUp event
 *
 *   Called by:  ProcessEvent
 *
 * Deal with CapsLock store options on CapsLock key press
 */
void KMX_ProcessEvent::KeyCapsLockPress(KMX_DWORD &modifiers,
                                        KMX_BOOL isKeyDown) {
  if (m_keyboard.Keyboard->dwFlags & KF_CAPSONONLY) {
    if (!isKeyDown && !IsCapsLockOn(modifiers)) {
      SetCapsLock(modifiers, true);
    }
  } else if (m_keyboard.Keyboard->dwFlags & KF_CAPSALWAYSOFF) {
    if (isKeyDown && IsCapsLockOn(modifiers)) {
      SetCapsLock(modifiers, false);
    }
  }
}

/*
 * PRIVATE void KeyShiftPress(KMX_DWORD modifiers, KMX_BOOL isKeyDown);
 *
 * Parameters: modifiers    The modifier keys
 *             isKeyDown    TRUE if this is called on KeyDown event, FALSE if
 *                          called on KeyUp event
 *
 *   Called by:  ProcessEvent
 *
 * Deal with CapsLock store options on Shift key press
 */
void KMX_ProcessEvent::KeyShiftPress(KMX_DWORD &modifiers, KMX_BOOL isKeyDown) {
  if (!IsCapsLockOn(modifiers)) return;

  if (m_keyboard.Keyboard->dwFlags & KF_SHIFTFREESCAPS) {
    if (isKeyDown) {
      SetCapsLock(modifiers, false);
    }
  }
}
