namespace com.keyman.text {
  export enum Browser {
    Chrome = 'chrome',
    Edge = 'edge',
    Firefox = 'firefox',
    Native = 'native', // Used by embedded mode
    Opera = 'opera',
    Safari = 'safari',
    Other = 'other'
  }

  export enum OperatingSystem {
    Windows = 'Windows',
    macOS = 'MacOSX',
    Linux = 'Linux',
    Android = 'Android',
    iOS = 'iOS',
    Other = 'other'
  }

  export enum FormFactor {
    Desktop = 'desktop',
    Phone = 'phone',
    Tablet = 'tablet'
  }

  /**
   * This class provides an abstract version of com.keyman.Device that is core-friendly, 
   * containing only the information needed by web-core for text processing use, devoid
   * of any direct references to the DOM.
   */
  export class EngineDeviceSpec {
    readonly browser: Browser;
    readonly formFactor: FormFactor;
    readonly OS: OperatingSystem;
    readonly touchable: boolean;

    constructor(browser: string, formFactor: string, OS: string, touchable: boolean) {
      switch(browser as Browser) {
        case Browser.Chrome:
        case Browser.Edge:
        case Browser.Firefox:
        case Browser.Native:
        case Browser.Opera:
        case Browser.Safari:
          this.browser = browser as Browser;
          break;
        default:
          this.browser = Browser.Other;
      }

      switch(formFactor.toLowerCase()) {
        case FormFactor.Desktop:
        case FormFactor.Phone:
        case FormFactor.Tablet:
          this.formFactor = formFactor as FormFactor;
          break;
        default:
          throw ("Invalid form factor specified for device!");
      }

      switch(OS.toLowerCase()) {
        case OperatingSystem.Windows.toLowerCase():
        case OperatingSystem.macOS.toLowerCase():
        case OperatingSystem.Linux.toLowerCase():
        case OperatingSystem.Android.toLowerCase():
        case OperatingSystem.iOS.toLowerCase():
          this.OS = OS as OperatingSystem;
          break;
        default:
          this.OS = OperatingSystem.Other;
      }
      
      this.touchable = touchable;
    }
  }
}