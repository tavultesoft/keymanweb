object Main: TMain
  Left = 413
  Top = 150
  Width = 492
  Height = 377
  Caption = 'JVCL Notepad'
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'MS Sans Serif'
  Font.Style = []
  Menu = MainMenu1
  OldCreateOrder = True
  OnCloseQuery = FormCloseQuery
  OnCreate = FormCreate
  OnDestroy = FormDestroy
  OnShow = FormShow
  PixelsPerInch = 96
  TextHeight = 13
  object RAHLEditor1: TJvHLEditor
    Left = 0
    Top = 0
    Width = 484
    Height = 311
    Cursor = crIBeam
    GutterWidth = 16
    RightMarginColor = clSilver
    Completion.ItemHeight = 13
    Completion.Interval = 800
    Completion.ListBoxStyle = lbStandard
    Completion.CaretChar = '|'
    Completion.CRLF = '/n'
    Completion.Separator = '='
    TabStops = '3 5'
    SelForeColor = clHighlightText
    SelBackColor = clHighlight
    OnChangeStatus = RAHLEditor1ChangeStatus
    OnKeyDown = RAHLEditor1KeyDown
    OnKeyPress = RAHLEditor1KeyPress
    OnKeyUp = RAHLEditor1KeyUp
    OnPaintGutter = RAHLEditor1PaintGutter
    Align = alClient
    Ctl3D = True
    Font.Charset = DEFAULT_CHARSET
    Font.Color = clWindowText
    Font.Height = -13
    Font.Name = 'Courier New'
    Font.Style = []
    ParentColor = False
    ParentFont = False
    PopupMenu = PopupMenu1
    TabStop = True
    UseDockManager = False
    Colors.Comment.Style = [fsItalic]
    Colors.Comment.ForeColor = clOlive
    Colors.Comment.BackColor = clWindow
    Colors.Number.Style = []
    Colors.Number.ForeColor = clNavy
    Colors.Number.BackColor = clWindow
    Colors.Strings.Style = []
    Colors.Strings.ForeColor = clPurple
    Colors.Strings.BackColor = clWindow
    Colors.Symbol.Style = []
    Colors.Symbol.ForeColor = clBlue
    Colors.Symbol.BackColor = clWindow
    Colors.Reserved.Style = [fsBold]
    Colors.Reserved.ForeColor = clWindowText
    Colors.Reserved.BackColor = clWindow
    Colors.Identifer.Style = []
    Colors.Identifer.ForeColor = clWindowText
    Colors.Identifer.BackColor = clWindow
    Colors.Preproc.Style = []
    Colors.Preproc.ForeColor = clGreen
    Colors.Preproc.BackColor = clWindow
    Colors.FunctionCall.Style = []
    Colors.FunctionCall.ForeColor = clWindowText
    Colors.FunctionCall.BackColor = clWindow
    Colors.Declaration.Style = []
    Colors.Declaration.ForeColor = clWindowText
    Colors.Declaration.BackColor = clWindow
    Colors.Statement.Style = [fsBold]
    Colors.Statement.ForeColor = clWindowText
    Colors.Statement.BackColor = clWindow
    Colors.PlainText.Style = []
    Colors.PlainText.ForeColor = clWindowText
    Colors.PlainText.BackColor = clWindow
  end
  object StatusBar: TStatusBar
    Left = 0
    Top = 311
    Width = 484
    Height = 20
    Panels = <
      item
        Alignment = taCenter
        Width = 66
      end
      item
        Width = 75
      end
      item
        Width = 90
      end
      item
        Width = 100
      end>
    SimplePanel = False
  end
  object RegAuto1: TJvRegAuto
    RegPath = 'Software\JVCL\RANotepad'
    IniFile = '$HOME/.RANotepad'
    Props.Strings = (
      'OpenDialog1.FileName'
      'FindDialog1.FindText'
      'ReplaceDialog1.FindText'
      'ReplaceDialog1.ReplaceText')
    SaveWindowPlace = True
    Left = 80
    Top = 64
  end
  object MainMenu1: TMainMenu
    Left = 144
    Top = 72
    object miFile: TMenuItem
      Caption = '&File'
      object miFileOpen: TMenuItem
        Caption = '&Open...'
        OnClick = miFileOpenClick
      end
      object miFileSave: TMenuItem
        Caption = '&Save'
        ShortCut = 16467
        OnClick = miFileSaveClick
      end
      object miFileSaveAs: TMenuItem
        Caption = 'Save &As...'
        OnClick = miFileSaveAsClick
      end
      object N3: TMenuItem
        Caption = '-'
      end
      object miOptions: TMenuItem
        Caption = 'O&ptions...'
        OnClick = miOptionsClick
      end
      object N1: TMenuItem
        Caption = '-'
      end
      object miExit: TMenuItem
        Caption = 'Exit'
        OnClick = miExitClick
      end
    end
    object miEdit: TMenuItem
      Caption = '&Edit'
    end
    object miSearch: TMenuItem
      Caption = '&Search'
      object Search1: TMenuItem
        Caption = '&Search...'
        ShortCut = 16454
        OnClick = Search1Click
      end
      object miSearchReplace: TMenuItem
        Caption = '&Replace'
        Enabled = False
        ShortCut = 16466
        Visible = False
        OnClick = miSearchReplaceClick
      end
      object miSearchAgain: TMenuItem
        Caption = 'Search &Again...'
        ShortCut = 114
        OnClick = miSearchAgainClick
      end
    end
    object N2: TMenuItem
      Caption = '&Help'
      object miHelpAbout: TMenuItem
        Caption = 'About...'
        OnClick = miHelpAboutClick
      end
    end
  end
  object raCommon: TJvRegAuto
    RegPath = 'Software\JVCL\RASQLEd'
    Storage = raIniFile
    IniFile = 'RASQLEd.ini'
    AutoMode = False
    AfterLoad = raCommonAfterLoad
    AfterSave = raCommonAfterSave
    Left = 80
    Top = 132
  end
  object OpenDialog1: TOpenDialog
    Left = 80
    Top = 16
  end
  object SaveDialog1: TSaveDialog
    Left = 152
    Top = 16
  end
  object FindDialog1: TFindDialog
    Options = [frDown, frHideUpDown, frDisableWholeWord]
    OnFind = FindDialog1Find
    Left = 224
    Top = 16
  end
  object ReplaceDialog1: TReplaceDialog
    Left = 224
    Top = 72
  end
  object PopupMenu1: TPopupMenu
    Left = 24
    Top = 96
    object miEditorProperties: TMenuItem
      Caption = '&Properties...'
      OnClick = miOptionsClick
    end
  end
  object JvInterpreterProgram1: TJvInterpreterProgram
    OnGetValue = JvInterpreterProgram1GetValue
    OnSetValue = JvInterpreterProgram1SetValue
    OnGetUnitSource = JvInterpreterProgram1GetUnitSource
    Left = 144
    Top = 136
  end
  object GutterImages: TImageList
    DrawingStyle = dsTransparent
    Height = 15
    Width = 15
    Left = 40
    Top = 184
    Bitmap = {
      494C01010A000F0004000F000F00FFFFFFFFFF10FFFFFFFFFFFFFFFF424D3600
      00000000000036000000280000003C0000003C0000000100100000000000201C
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      000000000000000000000000000000000000000000000000F75EEF01E001EF01
      E001EF01E001EF010000000000000000000000000000F75EEF01E001EF01E001
      EF01E001EF010000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      00000000000000000000000000000000F75EE001EF01000000000000EF01E001
      0000EF3D00000000000000000000F75EE001EF01E001EF01E0010000E0010000
      EF3D000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000F75EEF010000EF01E001EF010000EF010000EF3D00000000
      000000000000F75EEF01E001EF01E001EF010000EF010000EF3D000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      F75EE0010000E001EF01E0010000E0010000EF3D00000000000000000000F75E
      E001EF01E001EF01E0010000E0010000EF3D0000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      000000000000000000000000000000000000000000000000F75EEF010000EF01
      E001EF010000EF010000EF3D00000000000000000000F75EEF01E00100000000
      EF010000EF010000EF3D00000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      00000000000000000000000000000000F75EEF01EF01000000000000EF01E001
      0000EF3D00000000000000000000F75EE0010000E001EF0100000000E0010000
      EF3D000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000F75EEF010000EF01E001EF010000EF010000EF3D00000000
      000000000000F75EEF010000EF01E001EF010000EF010000EF3D000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      F75EE0010000E001EF01E0010000E0010000EF3D00000000000000000000F75E
      E0010000E001EF01E0010000E0010000EF3D0000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      000000000000000000000000000000000000000000000000F75EEF01E0010000
      00000000E001EF010000EF3D00000000000000000000F75EEF01E00100000000
      0000E001EF010000EF3D00000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      00000000000000000000000000000000F75EE001EF01E001EF01E001EF01E001
      0000EF3D00000000000000000000F75EE001EF01E001EF01E001EF01E0010000
      EF3D000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000EF3D00000000
      000000000000000000000000000000000000000000000000EF3D000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000F75EF75EF75EF75EF75EF75EF75EF75EEF3D000000000000000000000000
      F75EF75EF75EF75EF75EF75EF75EF75EEF3D0000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      F75EEF01E001EF01E001EF01E001EF010000000000000000000000000000F75E
      EF01E001EF01E001EF01E001EF010000000000000000000000000000F75EEF01
      E001EF01E001EF01E001EF010000000000000000000000000000F75EEF01E001
      EF01E001EF01E001EF010000000000000000000000000000F75EE001EF01E001
      EF010000EF01E0010000EF3D00000000000000000000F75EE001EF0100000000
      0000EF01E0010000EF3D00000000000000000000F75EE001EF01000000000000
      EF01E0010000EF3D00000000000000000000F75EE001EF01E0010000E001EF01
      E0010000EF3D00000000000000000000F75EEF01E001EF01E0010000E001EF01
      0000EF3D00000000000000000000F75EEF010000EF01E001EF010000EF010000
      EF3D00000000000000000000F75EEF010000EF01E001EF010000EF010000EF3D
      00000000000000000000F75EEF01E001EF010000EF01E001EF010000EF3D0000
      0000000000000000F75EE001EF01E001EF010000EF01E0010000EF3D00000000
      000000000000F75EE001EF01E001EF01E0010000E0010000EF3D000000000000
      00000000F75EE0010000E001EF01E0010000E0010000EF3D0000000000000000
      0000F75EE001EF01E0010000E001EF01E0010000EF3D00000000000000000000
      F75EEF0100000000000000000000EF010000EF3D00000000000000000000F75E
      EF01E001EF01E001EF010000EF010000EF3D00000000000000000000F75EEF01
      0000EF01E001EF010000EF010000EF3D00000000000000000000F75EEF01E001
      EF01E0010000E001EF010000EF3D00000000000000000000F75EE0010000E001
      EF010000EF01E0010000EF3D00000000000000000000F75EE001000000000000
      0000EF01E0010000EF3D00000000000000000000F75EE0010000000000000000
      EF01E0010000EF3D00000000000000000000F75EE001EF01E001EF010000EF01
      E0010000EF3D00000000000000000000F75EEF010000EF01E0010000E001EF01
      0000EF3D00000000000000000000F75EEF010000EF01E001EF01E001EF010000
      EF3D00000000000000000000F75EEF010000EF01E001EF01E001EF010000EF3D
      00000000000000000000F75EEF01E001EF01E001EF010000EF010000EF3D0000
      0000000000000000F75EE0010000E001EF010000EF01E0010000EF3D00000000
      000000000000F75EE0010000E001EF01E001EF01E0010000EF3D000000000000
      00000000F75EE0010000E001EF01E0010000E0010000EF3D0000000000000000
      0000F75EE0010000E001EF01E0010000E0010000EF3D00000000000000000000
      F75EEF010000EF01E0010000E001EF010000EF3D00000000000000000000F75E
      EF0100000000000000000000EF010000EF3D00000000000000000000F75EEF01
      E001000000000000E001EF010000EF3D00000000000000000000F75EEF010000
      0000000000000000EF010000EF3D00000000000000000000F75EE001EF01E001
      EF01E001EF01E0010000EF3D00000000000000000000F75EE001EF01E001EF01
      E001EF01E0010000EF3D00000000000000000000F75EE001EF01E001EF01E001
      EF01E0010000EF3D00000000000000000000F75EE001EF01E001EF01E001EF01
      E0010000EF3D0000000000000000000000000000000000000000000000000000
      0000EF3D00000000000000000000000000000000000000000000000000000000
      EF3D00000000000000000000000000000000000000000000000000000000EF3D
      00000000000000000000000000000000000000000000000000000000EF3D0000
      00000000000000000000F75EF75EF75EF75EF75EF75EF75EF75EEF3D00000000
      0000000000000000F75EF75EF75EF75EF75EF75EF75EF75EEF3D000000000000
      000000000000F75EF75EF75EF75EF75EF75EF75EF75EEF3D0000000000000000
      00000000F75EF75EF75EF75EF75EF75EF75EF75EEF3D00000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000F75EEF01E001EF01E001EF01E001EF010000000000000000
      000000000000F75EEF01E001EF01E001EF01E001EF0100000000000000000000
      00000000F75EEF01E001EF01E001EF01E001EF01000000000000000000000000
      0000F75EEF01E001EF01E001EF01E001EF010000000000000000000000000000
      F75EE001EF01000000000000EF01E0010000EF3D00000000000000000000F75E
      E00100000000000000000000E0010000EF3D00000000000000000000F75EE001
      00000000000000000000E0010000EF3D00000000000000000000F75EE001EF01
      000000000000EF01E0010000EF3D00000000000000000000F75EEF010000EF01
      E001EF010000EF010000EF3D00000000000000000000F75EEF01E001EF010000
      EF01E001EF010000EF3D00000000000000000000F75EEF010000EF01E001EF01
      E001EF010000EF3D00000000000000000000F75EEF010000EF01E001EF010000
      EF010000EF3D00000000000000000000F75EE0010000E001EF01E0010000E001
      0000EF3D00000000000000000000F75EE001EF01E0010000E001EF01E0010000
      EF3D00000000000000000000F75EE001EF010000EF01E001EF01E0010000EF3D
      00000000000000000000F75EE001EF01E001EF01E0010000E0010000EF3D0000
      0000000000000000F75EEF010000EF01E001EF010000EF010000EF3D00000000
      000000000000F75EEF01E001EF010000EF01E001EF010000EF3D000000000000
      00000000F75EEF01E001EF010000EF01E001EF010000EF3D0000000000000000
      0000F75EEF01E001EF01E001EF010000EF010000EF3D00000000000000000000
      F75EE0010000E001EF01E0010000E0010000EF3D00000000000000000000F75E
      E001EF01E0010000E001EF01E0010000EF3D00000000000000000000F75EE001
      EF01E001EF010000EF01E0010000EF3D00000000000000000000F75EE001EF01
      E00100000000EF01E0010000EF3D00000000000000000000F75EEF010000EF01
      E001EF010000EF010000EF3D00000000000000000000F75EEF010000EF010000
      EF01E001EF010000EF3D00000000000000000000F75EEF01E001EF01E001EF01
      0000EF010000EF3D00000000000000000000F75EEF01E001EF01E001EF010000
      EF010000EF3D00000000000000000000F75EE0010000E001EF01E0010000E001
      0000EF3D00000000000000000000F75EE001EF0100000000E001EF01E0010000
      EF3D00000000000000000000F75EE0010000E001EF01E0010000E0010000EF3D
      00000000000000000000F75EE0010000E001EF01E0010000E0010000EF3D0000
      0000000000000000F75EEF01E001000000000000E001EF010000EF3D00000000
      000000000000F75EEF01E001EF010000EF01E001EF010000EF3D000000000000
      00000000F75EEF01E001000000000000E001EF010000EF3D0000000000000000
      0000F75EEF01E001000000000000E001EF010000EF3D00000000000000000000
      F75EE001EF01E001EF01E001EF01E0010000EF3D00000000000000000000F75E
      E001EF01E001EF01E001EF01E0010000EF3D00000000000000000000F75EE001
      EF01E001EF01E001EF01E0010000EF3D00000000000000000000F75EE001EF01
      E001EF01E001EF01E0010000EF3D000000000000000000000000000000000000
      00000000000000000000EF3D0000000000000000000000000000000000000000
      0000000000000000EF3D00000000000000000000000000000000000000000000
      000000000000EF3D000000000000000000000000000000000000000000000000
      00000000EF3D000000000000000000000000F75EF75EF75EF75EF75EF75EF75E
      F75EEF3D000000000000000000000000F75EF75EF75EF75EF75EF75EF75EF75E
      EF3D000000000000000000000000F75EF75EF75EF75EF75EF75EF75EF75EEF3D
      000000000000000000000000F75EF75EF75EF75EF75EF75EF75EF75EEF3D0000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      000000000000000000000000000000000000424D3E000000000000003E000000
      280000003C0000003C0000000100010000000000E00100000000000000000000
      000000000000000000000000FFFFFF0000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000C00F801C00000000C007800C00000000C003800400000000
      C003800400000000C003800400000000C003800400000000C003800400000000
      C003800400000000C003800400000000C003800400000000C003800400000000
      C003800400000000E003C00400000000F007E00C00000000FFFFFFFC00000000
      C00F801F003E0070C007800F001E0030C0038007000E0010C0038007000E0010
      C0038007000E0010C0038007000E0010C0038007000E0010C0038007000E0010
      C0038007000E0010C0038007000E0010C0038007000E0010C0038007000E0010
      E003C007800F0010F007E00FC01F8030FFFFFFFFFFFFFFF0C00F801F003E0070
      C007800F001E0030C0038007000E0010C0038007000E0010C0038007000E0010
      C0038007000E0010C0038007000E0010C0038007000E0010C0038007000E0010
      C0038007000E0010C0038007000E0010C0038007000E0010E003C007800F0010
      F007E00FC01F8030FFFFFFFFFFFFFFF000000000000000000000000000000000
      000000000000}
  end
  object RAHLEdPropDlg1: TJvHLEdPropDlg
    JvHLEditor = RAHLEditor1
    RegAuto = raCommon
    ColorSamples.Strings = (
      '[Default]'
      'Plain text'
      'Selected text'
      ''
      '[Pascal]'
      '{ Syntax highlighting }'
      'procedure TMain.RAHLEditor1ChangeStatus(Sender: TObject);'
      'const'
      '  Modi: array[boolean] of string[10] = ('#39#39', '#39'Modified'#39');'
      '  Modes: array[boolean] of string[10] = ('#39'Overwrite'#39', '#39'Insert'#39');'
      'begin'
      '  with StatusBar, RAHLEditor1 do'
      '  begin'
      '    Panels[0].Text := IntToStr(CaretY) + '#39':'#39' + IntToStr(CaretX);'
      '    Panels[1].Text := Modi[Modified];'
      '    if ReadOnly then'
      '      Panels[2].Text := '#39'ReadOnly'#39
      '    else if Recording then'
      '      Panels[2].Text := '#39'Recording'#39
      '    else'
      '      Panels[2].Text := Modes[InsertMode];'
      '    miFileSave.Enabled := Modified;'
      '  end;'
      'end;'
      '[]'
      ''
      '[CBuilder]'
      '/* Syntax highlighting */'
      '#include "zlib.h"'
      ''
      '#define local static'
      ''
      'local int crc_table_empty = 1;'
      ''
      'local void make_crc_table()'
      '{'
      '  uLong c;'
      '  int n, k;'
      '  uLong poly;            /* polynomial exclusive-or pattern */'
      '  /* terms of polynomial defining this crc (except x^32): */'
      '  static Byte p[] = {0,1,2,4,5,7,8,10,11,12,16,22,23,26};'
      ''
      '  /* make exclusive-or pattern from polynomial (0xedb88320L) */'
      '  poly = 0L;'
      '  for (n = 0; n < sizeof(p)/sizeof(Byte); n++)'
      '    poly |= 1L << (31 - p[n]);'
      ''
      '  for (n = 0; n < 256; n++)'
      '  {'
      '    c = (uLong)n;'
      '    for (k = 0; k < 8; k++)'
      '      c = c & 1 ? poly ^ (c >> 1) : c >> 1;'
      '    crc_table[n] = c;'
      '  }'
      '  crc_table_empty = 0;'
      '}'
      '[]'
      ''
      '[Sql]'
      '/* Syntax highlighting */'
      'declare external function Copy'
      '  cstring(255), integer, integer'
      '  returns cstring(255)'
      '  entry_point "Copy" module_name "nbsdblib";'
      '[]'
      ''
      '[Python]'
      '# Syntax highlighting'
      ''
      'from Tkinter import *'
      'from Tkinter import _cnfmerge'
      ''
      'class Dialog(Widget):'
      '  def __init__(self, master=None, cnf={}, **kw):'
      '    cnf = _cnfmerge((cnf, kw))'
      '    self.widgetName = '#39'__dialog__'#39
      '    Widget._setup(self, master, cnf)'
      '    self.num = self.tk.getint('
      '      apply(self.tk.call,'
      '            ('#39'tk_dialog'#39', self._w,'
      '             cnf['#39'title'#39'], cnf['#39'text'#39'],'
      '             cnf['#39'bitmap'#39'], cnf['#39'default'#39'])'
      '            + cnf['#39'strings'#39']))'
      '    try: Widget.destroy(self)'
      '    except TclError: pass'
      '  def destroy(self): pass'
      '[]'
      ''
      '[Java]'
      '/* Syntax highlighting */'
      'public class utils {'
      
        '  public static String GetPropsFromTag(String str, String props)' +
        ' {'
      '    int bi;'
      '    String Res = "";'
      '    bi = str.indexOf(props);'
      '    if (bi > -1) {'
      '      str = str.substring(bi);'
      '      bi  = str.indexOf("\"");'
      '      if (bi > -1) {'
      '        str = str.substring(bi+1);'
      '        Res = str.substring(0, str.indexOf("\""));'
      '      } else Res = "true";'
      '    }'
      '    return Res;'
      '  }'
      '[]'
      ''
      '[Html]'
      '<html>'
      '<head>'
      '<meta name="GENERATOR" content="Microsoft FrontPage 3.0">'
      '<title>JVCLmp;A Library home page</title>'
      '</head>'
      ''
      
        '<body background="zertxtr.gif" bgcolor="#000000" text="#FFFFFF" ' +
        'link="#FF0000"'
      'alink="#FFFF00">'
      ''
      
        '<p align="left">Download last JVCLmp;A Library version now - <fo' +
        'nt face="Arial"'
      
        'color="#00FFFF"><a href="http://www.torry.ru/vcl/packs/ralib.zip' +
        '"><small>ralib110.zip</small></a>'
      
        '</font><font face="Arial" color="#008080"><small><small>(575 Kb)' +
        '</small></small></font>.</p>'
      ''
      '</body>'
      '</html>'
      '[]'
      ''
      '[Perl]'
      '#!/usr/bin/perl'
      '# Syntax highlighting'
      ''
      'require "webtester.pl";'
      ''
      '$InFile = "/usr/foo/scripts/index.shtml";'
      '$OutFile = "/usr/foo/scripts/sitecheck.html";'
      '$MapFile = "/usr/foo/scripts/sitemap.html";'
      ''
      'sub MainProg {'
      #9'require "find.pl";'
      #9'&Initialize;'
      #9'&SiteCheck;'
      #9'if ($MapFile) { &SiteMap; }'
      #9'exit;'
      '}'
      '[Ini]'
      ' ; Syntax highlighting'
      ' [drivers]'
      ' wave=mmdrv.dll'
      ' timer=timer.drv'
      ''
      ' plain text'
      ''
      '[Coco/R]'
      '(* Sample of Coco/R for Delphi syntax  *)'
      'COMPILER Calc'
      'DELPHI'
      '  PRIVATE'
      '    procedure Trace(const Msg: String);'
      '  ERRORS'
      '    200 : Result := '#39'Unexpected end of command'#39';'
      'END_DELPHI'
      ''
      'procedure T-->Grammar<--.Trace(const Msg: String);'
      'begin'
      '  _StreamLine(Msg);    '
      'end;'
      ''
      'CHARACTERS                    '
      '  eol = CHR(13) .'
      '  digit = "0123456789" .'
      '  '
      'PRODUCTIONS'
      ''
      'Calc = '
      '      Expression EOL    '
      '    .'
      ''
      'Expression = '
      '      Term { AddOp Term }  '
      
        '                       (. Trace('#39'Expression(Term { AddOp Term })' +
        ': '#39' + LexString) .)'
      '    .'
      ''
      'END Calc .'
      '[]')
    Pages = [epEditor, epColors]
    Left = 104
    Top = 200
  end
end
