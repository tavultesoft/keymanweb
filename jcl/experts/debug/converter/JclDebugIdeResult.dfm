object JclDebugResultForm: TJclDebugResultForm
  Left = 305
  Top = 243
  ActiveControl = OkBtn
  BorderIcons = [biSystemMenu]
  Caption = 'JCL Debug data information'
  ClientHeight = 303
  ClientWidth = 772
  Color = clBtnFace
  Constraints.MinHeight = 300
  Constraints.MinWidth = 700
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'MS Sans Serif'
  Font.Style = []
  KeyPreview = True
  OldCreateOrder = False
  Position = poScreenCenter
  ShowHint = True
  OnDestroy = FormDestroy
  OnKeyDown = FormKeyDown
  OnResize = FormResize
  OnShow = FormShow
  Width = 772
  Height = 303
  PixelsPerInch = 96
  TextHeight = 13
  object OkBtn: TButton
    Left = 348
    Top = 271
    Width = 75
    Height = 25
    Anchors = [akLeft, akBottom]
    Caption = 'RsOk'
    Default = True
    ModalResult = 1
    TabOrder = 0
  end
  object ResultListView: TListView
    Left = 10
    Top = 6
    Width = 751
    Height = 254
    Hint = 'Use Ctrl+C to copy the report to the clipboard'
    Anchors = [akLeft, akTop, akRight, akBottom]
    Columns = <
      item
        Caption = 'Project'
        Width = 110
      end
      item
        Alignment = taRightJustify
        Caption = 'MAP file size'
        Width = 75
      end
      item
        Alignment = taRightJustify
        Caption = 'JCLDebug size'
        Width = 85
      end
      item
        Alignment = taRightJustify
        Caption = 'Ratio'
      end
      item
        Caption = 'Executable file name'
        Width = 310
      end
      item
        Caption = 'Linker bug'
        Width = 65
      end
      item
        Alignment = taRightJustify
        Caption = 'Line errors'
      end>
    ColumnClick = False
    ReadOnly = True
    RowSelect = True
    SmallImages = ImageList1
    TabOrder = 1
    ViewStyle = vsReport
  end
  object ImageList1: TImageList
    Left = 16
    Top = 264
    Bitmap = {
      494C010102000400040010001000FFFFFFFFFF10FFFFFFFFFFFFFFFF424D3600
      0000000000003600000028000000400000001000000001001000000000000008
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      000000000000000000000000000000000000000000000000007C007C007C007C
      007C007C007C00000000000000000000000000000000007C007C007C00000000
      EF3D0000EF3D00000000007C007C007C00000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      00000000000000000000000000000000000000000000007C007C007C007C007C
      007C007C007C000000400000000000000000000000000000007C007C007C0000
      0000000000000000007C007C007C000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000400040004000400040
      0040004000400000004000400000000000000000000000000000007C007C007C
      EF3D0000EF3D007C007C007C0000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      00000000000000000000004000400000000000000000000000000000007C007C
      007C0000007C007C007C00000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      00000000000000000000000000000000000000000000EF3D0000FF7FFF7FFF7F
      FF7FFF7FFF7F0000FF7F0000004000400000000000000000000000000000007C
      007C0000007C007C000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000FF7FFF7FFF7F
      FF7FFF7FFF7F0000FF7F00000000004000000000000000000000000000000000
      0040000000400000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000FF7FFF7FEF3D
      0000000000000000FF7F0000FF7F00000000000000000000000000000000007C
      004000000040007C000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      FF7FFF7FFF7FFF7FFF7F0000FF7F0000000000000000000000000000007C007C
      000000000000007C007C00000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      000000000000000000000000000000000000000000000000000000000000FF7F
      FF7FEF3D0000000000000000FF7F000000000000000000000000007C007C007C
      000000000000007C007C007C0000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      00000000FF7FFF7FFF7FFF7FFF7F00000000000000000000007C007C007C0000
      0000000000000000007C007C007C000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000FF7FFF7FEF3D0000000000000000000000000000007C007C007C00000000
      EF3D0000EF3D00000000007C007C007C00000000000000000000000000000000
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
      000000000000000000000000000000000000424D3E000000000000003E000000
      2800000040000000100000000100010000000000800000000000000000000000
      000000000000000000000000FFFFFF00FFFFFFFF00000000E01FFFFF00000000
      C00FC631000000008007E223000000000003F007000000000001F88F00000000
      8000FC1F00000000C000FE3F00000000E000FC1F00000000F000F80F00000000
      F801F00700000000FC01E22300000000FE01C63100000000FF1FFFFF00000000
      FFFFFFFF00000000FFFFFFFF0000000000000000000000000000000000000000
      000000000000}
  end
end
