// Generated file - generated by MakeStockKCT at 28/10/2003 06:38:39
unit MessageIdentifiers;
interface

type TMessageIdentifier = (

  {Application-wide strings}

  SKApplicationTitle,
  SKFailureToRestart,

  {Keyman installation strings}

  SKApplicationFiles,

  {Message boxes - Keyman installation}

  SKMRedistInfMissing,
  SKMLicenceMissing,
  SKNeedValidDirectoryName,
  SKExitSetupQuery,
  SKOlderKeymanInPackage,
  SKNewerKeymanInPackage,
  SKPackageInstallFailure,
  SKErrorVerifyingKeyman32Dll,
  SKKeymanAlreadyRunning,
  SKKeyman32DLLLocked,
  SKErrorDisplayingLicence,
  SKErrorDisplayingReadme,

  {Application uninstallation}

  SKKeymanAlreadyRunningUninstall,

  {Start Menu error messages}

  SErrStartMenu_CouldNotFindStartMenu,
  SErrStartMenu_CouldNotCreateFolder,
  SErrStartMenu_CouldNotCreateLinks,

  {Help File}

  SKOnlineHelpFile,

  {Assorted strings}

  SKDamagedKeyboard,
  SKANSIEncoding,
  SKUnicodeEncoding,

  {Message boxes}

  SKRestartKeymanAfterDebuggingOptionChange,
  SKKeyman32NotFound,

  {Program startup messages}

  SKKeymanAlreadyRegistered,
  SKKMShellAlreadyRunning,
  SKInstallRuntimeQuery,
  SKInstallOnlyAsAdmin,
  SKOSNotSupported,

  {File installation messages}

  SKMNError,
  SKPSError,
  SXXXError,
  SErrCannotInstallFromKeyboards,
  SKInvalidKeyboardFile,

  {Status dialogs}

  SKKbdInstallSuccess,
  SKKbdInstallFailure,
  SKPackageUninstallSuccess,
  SKKbdUninstallSuccess,

  {InstallKeyboard strings}

  SKAdminKeyboardInstalled,
  SKKeyboardAlreadyInstalled,
  SKUninstallFailContinueAnywayQuery,
  SKOldKeyboardFile,
  SKNewKeyboardFile,
  SKNewKeyboardFileUnknown,

  {Uninstall strings}

  SKUninstallFileNotFound,
  SKAddinFileNotFound,
  SKKeyboardInstallNotFound,
  SKKeyboardCorruptUninstallQuery,
  SKKeyboardPartOfPackage,
  SKAdminToUninstallRequired,
  SKUninstallSuccess,
  SKFontInUse
);

function MsgFromId(const msgid: TMessageIdentifier): string;
function MsgFromIdFormat(const msgid: TMessageIdentifier; const args: array of const): string;

implementation

uses SysUtils;

const MessageIdentifierNames: array[TMessageIdentifier] of string = (

  {Application-wide strings}

  'SKApplicationTitle',
  'SKFailureToRestart',

  {Keyman installation strings}

  'SKApplicationFiles',

  {Message boxes - Keyman installation}

  'SKMRedistInfMissing',
  'SKMLicenceMissing',
  'SKNeedValidDirectoryName',
  'SKExitSetupQuery',
  'SKOlderKeymanInPackage',
  'SKNewerKeymanInPackage',
  'SKPackageInstallFailure',
  'SKErrorVerifyingKeyman32Dll',
  'SKKeymanAlreadyRunning',
  'SKKeyman32DLLLocked',
  'SKErrorDisplayingLicence',
  'SKErrorDisplayingReadme',

  {Application uninstallation}

  'SKKeymanAlreadyRunningUninstall',

  {Start Menu error messages}

  'SErrStartMenu_CouldNotFindStartMenu',
  'SErrStartMenu_CouldNotCreateFolder',
  'SErrStartMenu_CouldNotCreateLinks',

  {Help File}

  'SKOnlineHelpFile',

  {Assorted strings}

  'SKDamagedKeyboard',
  'SKANSIEncoding',
  'SKUnicodeEncoding',

  {Message boxes}

  'SKRestartKeymanAfterDebuggingOptionChange',
  'SKKeyman32NotFound',

  {Program startup messages}

  'SKKeymanAlreadyRegistered',
  'SKKMShellAlreadyRunning',
  'SKInstallRuntimeQuery',
  'SKInstallOnlyAsAdmin',
  'SKOSNotSupported',

  {File installation messages}

  'SKMNError',
  'SKPSError',
  'SXXXError',
  'SErrCannotInstallFromKeyboards',
  'SKInvalidKeyboardFile',

  {Status dialogs}

  'SKKbdInstallSuccess',
  'SKKbdInstallFailure',
  'SKPackageUninstallSuccess',
  'SKKbdUninstallSuccess',

  {InstallKeyboard strings}

  'SKAdminKeyboardInstalled',
  'SKKeyboardAlreadyInstalled',
  'SKUninstallFailContinueAnywayQuery',
  'SKOldKeyboardFile',
  'SKNewKeyboardFile',
  'SKNewKeyboardFileUnknown',

  {Uninstall strings}

  'SKUninstallFileNotFound',
  'SKAddinFileNotFound',
  'SKKeyboardInstallNotFound',
  'SKKeyboardCorruptUninstallQuery',
  'SKKeyboardPartOfPackage',
  'SKAdminToUninstallRequired',
  'SKUninstallSuccess',
  'SKFontInUse'
);

const MessageIdentifierValues: array[TMessageIdentifier] of string = (

  {Application-wide strings}

  'SKApplicationTitle',
  'SKFailureToRestart',

  {Keyman installation strings}

  'SKApplicationFiles',

  {Message boxes - Keyman installation}

  'SKMRedistInfMissing',
  'SKMLicenceMissing',
  'SKNeedValidDirectoryName',
  'SKExitSetupQuery',
  'SKOlderKeymanInPackage',
  'SKNewerKeymanInPackage',
  'SKPackageInstallFailure',
  'SKErrorVerifyingKeyman32Dll',
  'SKKeymanAlreadyRunning',
  'SKKeyman32DLLLocked',
  'SKErrorDisplayingLicence',
  'SKErrorDisplayingReadme',

  {Application uninstallation}

  'SKKeymanAlreadyRunningUninstall',

  {Start Menu error messages}

  'SErrStartMenu_CouldNotFindStartMenu',
  'SErrStartMenu_CouldNotCreateFolder',
  'SErrStartMenu_CouldNotCreateLinks',

  {Help File}

  'SKOnlineHelpFile',

  {Assorted strings}

  'SKDamagedKeyboard',
  'SKANSIEncoding',
  'SKUnicodeEncoding',

  {Message boxes}

  'SKRestartKeymanAfterDebuggingOptionChange',
  'SKKeyman32NotFound',

  {Program startup messages}

  'SKKeymanAlreadyRegistered',
  'SKKMShellAlreadyRunning',
  'SKInstallRuntimeQuery',
  'SKInstallOnlyAsAdmin',
  'SKOSNotSupported',

  {File installation messages}

  'SKMNError',
  'SKPSError',
  'SXXXError',
  'SErrCannotInstallFromKeyboards',
  'SKInvalidKeyboardFile',

  {Status dialogs}

  'SKKbdInstallSuccess',
  'SKKbdInstallFailure',
  'SKPackageUninstallSuccess',
  'SKKbdUninstallSuccess',

  {InstallKeyboard strings}

  'SKAdminKeyboardInstalled',
  'SKKeyboardAlreadyInstalled',
  'SKUninstallFailContinueAnywayQuery',
  'SKOldKeyboardFile',
  'SKNewKeyboardFile',
  'SKNewKeyboardFileUnknown',

  {Uninstall strings}

  'SKUninstallFileNotFound',
  'SKAddinFileNotFound',
  'SKKeyboardInstallNotFound',
  'SKKeyboardCorruptUninstallQuery',
  'SKKeyboardPartOfPackage',
  'SKAdminToUninstallRequired',
  'SKUninstallSuccess',
  'SKFontInUse'
);

function MsgFromId(const msgid: TMessageIdentifier): string;
begin
  Result := MessageIdentifierValues[msgid];
end;

function MsgFromIdFormat(const msgid: TMessageIdentifier; const args: array of const): string;
begin
  try
    Result := Format(MessageIdentifierValues[msgid], args);
  except
    Result := MessageIdentifierValues[msgid] + ' (error displaying message parameters)';
  end;
end;

end.
