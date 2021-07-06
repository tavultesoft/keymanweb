/*
  Copyright:        Copyright (C) 2003-2018 SIL International.
  Authors:          mcdurdin
*/
#include <kmx/kmx_processevent.h>
#include <keyman/keyboardprocessor_consts.h>

using namespace km::kbp;
using namespace kmx;

/*
* PRIVATE void ResetCapsLock(KMX_DWORD &modifiers);
*
* Parameters: modifiers    The modifier keys
*
*   Called by:  ProcessEvent
*
* Turn off caps lock if it is on and CapsAlwaysOff is set
*/
void KMX_ProcessEvent::ResetCapsLock(KMX_DWORD &modifiers)
{
  DebugLog("ResetCapsLock: enter");

  if (m_keyboard.Keyboard->dwFlags & KF_CAPSALWAYSOFF)
  {
    DebugLog("ResetCapsLock: caps lock should be always off");
    if (m_environment.capsLock())
    {
      DebugLog("ResetCapsLock: caps lock is on, switching off caps lock");
      m_actions.QueueAction(QIT_CAPSLOCK, false);
      m_environment.Set(KM_KBP_KMX_ENV_CAPSLOCK, u"0");
      modifiers &= ~CAPITALFLAG;
    }
  }
  DebugLog("ResetCapsLock: exit");
}

/*
 * PRIVATE void KeyCapsLockPress(KMX_BOOL isKeyDown);
 *
 * Parameters: isKeyDown    TRUE if this is called on KeyDown event, FALSE if
 *                          called on KeyUp event
 *
 *   Called by:  ProcessEvent
 *
 * Deal with CapsLock store options on CapsLock key press
 */
void KMX_ProcessEvent::KeyCapsLockPress(KMX_BOOL isKeyDown) {
  if (m_keyboard.Keyboard->dwFlags & KF_CAPSONONLY)
  {
    if (!isKeyDown && !m_environment.capsLock()) {
      m_actions.QueueAction(QIT_CAPSLOCK, true);
      m_environment.Set(KM_KBP_KMX_ENV_CAPSLOCK, u"1");
    }
  }
  else if (m_keyboard.Keyboard->dwFlags & KF_CAPSALWAYSOFF)
  {
    if (isKeyDown && m_environment.capsLock()) {
      m_actions.QueueAction(QIT_CAPSLOCK, false);
      m_environment.Set(KM_KBP_KMX_ENV_CAPSLOCK, u"0");
    }
  }
}

/*
 * PRIVATE void KeyShiftPress(KMX_BOOL isKeyDown);
 *
 * Parameters: isKeyDown    TRUE if this is called on KeyDown event, FALSE if called
 *                          on KeyUp event
 *
 *   Called by:  ProcessEvent
 *
 * Deal with CapsLock store options on Shift key press
 */
void KMX_ProcessEvent::KeyShiftPress(KMX_BOOL isKeyDown) {
  if (!m_environment.capsLock())
    return;

  if (m_keyboard.Keyboard->dwFlags & KF_SHIFTFREESCAPS)
  {
    if (isKeyDown) {
      m_actions.QueueAction(QIT_CAPSLOCK, false);
    }
  }
}
