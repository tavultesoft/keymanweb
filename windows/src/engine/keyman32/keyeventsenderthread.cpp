#include "keyman64.h"
#include "security.h"

#ifdef USE_KEYEVENTSENDERTHREAD

//
// Server application functionality
// This runs only in the host applications keyman.exe and keymanx64.exe
//

DWORD WINAPI KeyEventConsumerThread(
  _In_ LPVOID lpParameter
);
LRESULT CALLBACK KeyEventConsumerWndProc(
  _In_ HWND hwnd, 
  _In_ UINT msg, 
  _In_ WPARAM wParam, 
  _In_ LPARAM lParam);

HANDLE f_hKeyEvent = 0;
HANDLE f_hKeyMutex = 0;
DWORD idKeyEventSenderThread = 0;

class KeyEventConsumer {
  DWORD idThread;
  HANDLE hThread, hThreadExitEvent;
  HWND hwnd;

public:
  KeyEventConsumer() {
    hThreadExitEvent = CreateEvent(NULL, FALSE, FALSE, NULL);
    if (!hThreadExitEvent) {
      DebugLastError("CreateEvent");
    }
    hThread = CreateThread(NULL, 0, KeyEventConsumerThread, (LPVOID)this, 0, &idThread);
    idKeyEventSenderThread = idThread;
    if (!hThread) {
      DebugLastError("CreateThread");
    }
  }

  ~KeyEventConsumer() {
    SetEvent(hThreadExitEvent);
    CloseHandle(hThreadExitEvent);
    CloseHandle(hThread);
  }

public:
  DWORD Execute() {
    WNDCLASS wndClass = { 0 };
    wndClass.lpfnWndProc = KeyEventConsumerWndProc;
    wndClass.cbClsExtra = sizeof(this);
    wndClass.lpszClassName = "Keyman_KeyEventConsumerWnd";
    wndClass.hInstance = g_hInstance;
    if (!RegisterClass(&wndClass)) {
      DebugLastError("RegisterClass");
      return 0;
    }

    hwnd = CreateWindow("Keyman_KeyEventConsumerWnd", "", WS_OVERLAPPEDWINDOW, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, CW_USEDEFAULT, 0, 0, g_hInstance, NULL);
    if (hwnd == NULL) {
      DebugLastError("CreateWindow");
      return 0;
    }
    SetClassLongPtr(hwnd, 0, (LONG_PTR)this);

    MessageLoop();

    DestroyWindow(hwnd);
    UnregisterClass("Keyman_KeyEventConsumerWnd", g_hInstance);
    return 0;
  }

private:
  void MessageLoop() {
    HANDLE events[2] = { hThreadExitEvent, f_hKeyEvent };
    while (TRUE) {
      switch (MsgWaitForMultipleObjectsEx(2, events, INFINITE, QS_ALLINPUT, 0)) {
      case WAIT_OBJECT_0:
        // Thread has been signalled, return
        return;
      case WAIT_OBJECT_0 + 1:
        PostMessage(hwnd, WM_USER, 0, 0);
        break;
      case WAIT_OBJECT_0 + 2:
        MSG msg;
        while (PeekMessage(&msg, NULL, NULL, NULL, PM_REMOVE)) {
          DispatchMessage(&msg);
        }
        break;
      default:
        DebugLastError("MsgWaitForMultipleObjectsEx");
        return;
      }
    }
  }

public:
  BOOL ProcessQueuedKeyEvents() {
    // Read from the circular buffer and then return
    SendDebugMessage(0, sdmDebug, 0, "Processing queued key events");

    HANDLE handles[2] = { hThreadExitEvent, f_hKeyMutex };

    switch (WaitForMultipleObjects(2, handles, FALSE, INFINITE)) {
    case WAIT_OBJECT_0:
      // thread exit has been signalled, we are shutting down
      return FALSE;
    case WAIT_OBJECT_0 + 1:
      break;
    default:
      DebugLastError("WaitForMultipleObjects");
      return FALSE;
    }

    DWORD *pn = Globals::nInputBuf();
    INPUT *pi = Globals::InputBuf();
    if (*pn > 0) {
      if (SendInput(*pn, pi, sizeof(INPUT)) == 0) {
        DebugLastError("SendInput");
      }

      *pn = 0;
    }

    ReleaseMutex(f_hKeyMutex);

    return TRUE;
  }
};

DWORD WINAPI KeyEventConsumerThread(
  _In_ LPVOID lpParameter
) {
  return ((KeyEventConsumer *)lpParameter)->Execute();
}

LRESULT CALLBACK KeyEventConsumerWndProc(HWND hwnd, UINT msg, WPARAM wParam, LPARAM lParam) {
  if (msg == WM_USER) {
    KeyEventConsumer *consumer = (KeyEventConsumer *)GetClassLongPtr(hwnd, 0);
    if (consumer != NULL) {
      consumer->ProcessQueuedKeyEvents();
    }
  }
  return DefWindowProc(hwnd, msg, wParam, lParam);
}

KeyEventConsumer *consumer = NULL;

void StartupConsumer() {
  consumer = new KeyEventConsumer();
}

void ShutdownConsumer() {
  delete consumer;
}

//
// Client application functionality
//

#ifdef _WIN64
#define GLOBAL_KEY_EVENT_NAME "KeymanEngine_KeyEvent_x64"
#define GLOBAL_KEY_MUTEX_NAME "KeymanEngine_KeyMutex_x64"
#else
#define GLOBAL_KEY_EVENT_NAME "KeymanEngine_KeyEvent_x86"
#define GLOBAL_KEY_MUTEX_NAME "KeymanEngine_KeyMutex_x86"
#endif

BOOL SignalKeyEventSenderThread(PINPUT pInputs, DWORD nInputs) {
  //
  // Initialisation
  //
  if (f_hKeyEvent == 0) {
    f_hKeyEvent = OpenEvent(EVENT_MODIFY_STATE, FALSE, GLOBAL_KEY_EVENT_NAME);
    if (f_hKeyEvent == 0) {
      DebugLastError("OpenEvent");
      return FALSE;
    }
  }

  if (f_hKeyMutex == 0) {
    f_hKeyMutex = OpenMutex(MUTEX_ALL_ACCESS, FALSE, GLOBAL_KEY_MUTEX_NAME);
    if (f_hKeyMutex == 0) {
      DebugLastError("OpenMutex");
      return FALSE;
    }
  }

  //
  // Check inputs
  //
  if (nInputs > MAX_KEYEVENT_INPUTS) {
    SendDebugMessageFormat(0, sdmGlobal, 0, "Too many INPUT events for queue (%d)", nInputs);
    nInputs = MAX_KEYEVENT_INPUTS;
  }

  //
  // Capture the mutex and copy input buffer into global shared buffer
  //
  switch (WaitForSingleObject(f_hKeyMutex, 500)) {
  case WAIT_OBJECT_0:
    break;
  case WAIT_TIMEOUT:
    SendDebugMessage(0, sdmGlobal, 0, "Timed out waiting to send input to host app");
    return FALSE;
  case WAIT_ABANDONED_0:
    SendDebugMessage(0, sdmGlobal, 0, "Host app closed mutex");
    return FALSE;
  case WAIT_FAILED:
  default:
    DebugLastError("WaitForSingleObject");
    return FALSE;
  }

  memcpy(Globals::InputBuf(), pInputs, nInputs * sizeof(INPUT));
  *Globals::nInputBuf() = nInputs;

  //
  // Force CPU to complete all memory operations before we signal
  // the host
  //
  MemoryBarrier();

  //
  // Release the mutex and signal the host application to process
  // the input
  //
  if (!ReleaseMutex(f_hKeyMutex)) {
    DebugLastError("ReleaseMutex");
    return FALSE;
  }

  if (!SetEvent(f_hKeyEvent)) {
    DebugLastError("SetEvent");
    return FALSE;
  }

  return TRUE;
}

void InitKeyEventSenderThread() {
  f_hKeyEvent = CreateEvent(NULL, FALSE, FALSE, GLOBAL_KEY_EVENT_NAME);
  SetObjectToLowIntegrity(f_hKeyEvent);
  GrantPermissionToAllApplicationPackages(f_hKeyEvent, EVENT_MODIFY_STATE);

  f_hKeyMutex = CreateMutex(NULL, FALSE, GLOBAL_KEY_MUTEX_NAME);
  SetObjectToLowIntegrity(f_hKeyMutex);
  GrantPermissionToAllApplicationPackages(f_hKeyMutex, MUTEX_ALL_ACCESS);
}

#endif
