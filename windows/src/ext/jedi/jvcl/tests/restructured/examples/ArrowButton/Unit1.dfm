object Form1: TForm1
  Left = 503
  Top = 348
  Width = 360
  Height = 195
  Caption = 'ArrowButton Demo'
  Color = clBtnFace
  Font.Charset = DEFAULT_CHARSET
  Font.Color = clWindowText
  Font.Height = -11
  Font.Name = 'MS Sans Serif'
  Font.Style = []
  OldCreateOrder = True
  PixelsPerInch = 96
  TextHeight = 13
  object ArrowButton1: TJvArrowButton
    Left = 32
    Top = 72
    Width = 89
    Height = 44
    AllowAllUp = True
    GroupIndex = 1
    DropDown = PopupMenu1
    Caption = 'Both + Down'
    Font.Charset = DEFAULT_CHARSET
    Font.Color = clBlack
    Font.Height = -11
    Font.Name = 'MS Sans Serif'
    Font.Style = []
    FillFont.Charset = DEFAULT_CHARSET
    FillFont.Color = clWindowText
    FillFont.Height = -11
    FillFont.Name = 'MS Sans Serif'
    FillFont.Style = []
    Glyph.Data = {
      F6000000424DF600000000000000760000002800000010000000100000000100
      0400000000008000000000000000000000001000000010000000000000008484
      000084848400C6C6C600FF00FF00FFFFFF00FFFFFF00FFFFFF00FFFFFF00FFFF
      FF00FFFFFF00FFFFFF00FFFFFF00FFFFFF00FFFFFF00FFFFFF00444400444444
      4444444011004444444444403FF1004444444401FFF3310044444403F33332F1
      0044401FFF3332FFF100403F33332FFFF33001FFF3332FF3333003F33332FFFF
      330440FF3332FF3000044400FF2FFF2333044444000FF2FFFF3044444440F2FF
      00304444444400FF0F3044444444440FFF044444444444400044}
    Layout = blGlyphTop
    ParentFont = False
  end
  object ArrowButton2: TJvArrowButton
    Left = 32
    Top = 16
    Width = 89
    Height = 40
    AllowAllUp = True
    DropDown = PopupMenu1
    Caption = 'One'
    Flat = True
    Font.Charset = DEFAULT_CHARSET
    Font.Color = clWhite
    Font.Height = -11
    Font.Name = 'MS Sans Serif'
    Font.Style = []
    FillFont.Charset = DEFAULT_CHARSET
    FillFont.Color = clWindowText
    FillFont.Height = -11
    FillFont.Name = 'MS Sans Serif'
    FillFont.Style = []
    Glyph.Data = {
      F6000000424DF600000000000000760000002800000010000000100000000100
      0400000000008000000000000000000000001000000010000000000000008484
      000084848400C6C6C600FF00FF00FFFFFF00FFFFFF00FFFFFF00FFFFFF00FFFF
      FF00FFFFFF00FFFFFF00FFFFFF00FFFFFF00FFFFFF00FFFFFF00444400444444
      4444444011004444444444403FF1004444444401FFF3310044444403F33332F1
      0044401FFF3332FFF100403F33332FFFF33001FFF3332FF3333003F33332FFFF
      330440FF3332FF3000044400FF2FFF2333044444000FF2FFFF3044444440F2FF
      00304444444400FF0F3044444444440FFF044444444444400044}
    ParentFont = False
    PressBoth = False
    Spacing = 9
  end
  object PopupMenu1: TPopupMenu
    Left = 216
    Top = 24
    object Add1: TMenuItem
      Caption = 'Add'
    end
    object Delete1: TMenuItem
      Caption = 'Delete'
    end
    object Edit1: TMenuItem
      Caption = 'Edit'
    end
    object Replace1: TMenuItem
      Caption = 'Replace'
    end
    object N1: TMenuItem
      Caption = '-'
    end
    object Close1: TMenuItem
      Caption = 'Close'
    end
  end
  object ImageList1: TImageList
    Left = 168
    Top = 24
    Bitmap = {
      494C01010E000F00040010001000FFFFFFFFFF10FFFFFFFFFFFFFFFF424D3600
      0000000000003600000028000000400000004000000001001000000000000020
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
      0000000000000000000000000000000000000000000000001042104210421042
      1042104210421042104210421042104200000000000000001042104210421042
      1042104210421042104210421042104200000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000001042186318631863
      1863186318631863186318631863104200000000000000001042186318631863
      1863186318631863186318631863104200000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000001042186318631863
      1863175C175C1863186318631863104200000000000000001042186318631863
      1863186318631863186318631863104200000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000001042186318631863
      1863186318631863186318631863104200000000000000001042186318631863
      1700186318631863186318631863104200000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000001042186318631863
      1863175C175C1863186318631863104200000000000000001042186318631700
      1700170018631863186318631863104200000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000001042186318631863
      1863175C175C1863186318631863104200000000000000001042186317001700
      1700170017001863186318631863104200000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000001042186318631863
      18631863175C175C186318631863104200000000000000001042186318631700
      1863170017001700186318631863104200000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      000000000000000000000000000000000000000000000000104218631863175C
      175C18631863175C175C18631863104200000000000000001042186318631863
      1863186317001700170018631863104200000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      000000000000000000000000000000000000000000000000104218631863175C
      175C18631863175C175C18631863104200000000000000001042186318631863
      1863186318631700170017001863104200000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000001042186318631863
      175C175C175C175C186318631863104200000000000000001042186318631863
      1863186318631863170018631863104200000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000001042186318631863
      1863186318631863186318631863104200000000000000001042186318631863
      1863186318631863186318631863104200000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000001042104210421042
      1042104210421042104210421042104200000000000000001042104210421042
      1042104210421042104210421042104200000000000000000000000000000000
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
      00000000FF7FFF7F000000000000000000000000000000000000000000000000
      000000000000FF7FFF7F000000000000000000000000FF7FFF7FFF7F0000FF7F
      FF7FFF7F00000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000FF7F1F001F00FF7F00000000000000000000000010421863186318631863
      18630000FF7F1F001F00FF7F00000000000000000000FF7F007CFF7F0000FF7F
      007CFF7F00000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      FF7F1F001F001F001F00FF7F000000000000000000001042FF7FFF7FFF7FFF7F
      186300001F001F001F001F00FF7F0000000000000000FF7F007C007CFF7F007C
      007CFF7F00000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      E003FF7F1F001F00FF7F0000000000000000000000001042FF7FFF7FFF7FFF7F
      18630000FF7F1F001F00FF7F0000000000000000000000000000007C007C007C
      FF7F000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000001042186318631863186318630000
      E003FF7F1F001F00FF7F0000000000000000104218631042FF7FFF7FFF7FFF7F
      18630000FF7F1F001F00FF7F0000000000001042186318631863007C007C007C
      FF7FFF7F00000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000001042FF7FFF7FFF7FFF7F18630000
      E003FF7F1F00FF7F000000000000000000001042FF7F1042FF7FFF7F00000000
      00000000FF7F1F00FF7F00000000000000001042FF7FFF7F007C007C1863007C
      007CFF7F00000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000001042FF7FFF7FFF7FFF7F18630000
      FF7F1F00FF7F0000000000000000000000001042FF7F1042FF7FFF7F1863FF7F
      1042FF7F1F00FF7F000000000000000000001042FF7FFF7F007CFF7F18630000
      007CFF7F00000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000001042FF7FFF7FFF7FFF7F18630000
      FF7FFF7F00000000000000000000000000001042FF7F1042FF7FFF7F18631042
      00000000FF7F0000000000000000000000001042FF7FFF7FFF7FFF7F18630000
      FF7FFF7F00000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000001042FF7FFF7F0000000000000000
      0000000000000000000000000000000000001042FF7F10420000000000000000
      0000000000000000000000000000000000001042FF7FFF7F0000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000001042FF7FFF7F1863FF7F10420000
      0000000000000000000000000000000000001042FF7FFF7F1042FF7F10420000
      0000000000000000000000000000000000001042FF7FFF7F1863FF7F10420000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000001042FF7FFF7F1863104200000000
      0000000000000000000000000000000000001042FF7FFF7F1042104200000000
      0000000000000000000000000000000000001042FF7FFF7F1863104200000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000001042104210421042000000000000
      0000000000000000000000000000000000001042104210421042000000000000
      0000000000000000000000000000000000001042104210421042000000000000
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
      FF7FFF7F0000000000000000000000000000000000000000000000000000FF7F
      FF7FFF7FFF7F0000000000000000000000000000000010421042104210421042
      1042104210421042104210420000000000000000000010421042104210421042
      10421042104210421042104200000000000000000000FF7FFF7FFF7FFF7FFF7F
      00000000FF7FFF7FFF7FFF7FFF7F0000000000000000000000000000FF7F0000
      000000000000FF7FFF7F0000000000000000000000001042FF7FFF7FFF7FFF7F
      FF7FFF7FFF7FFF7FFF7F1042000000000000000000001042FF7FFF7FFF7FFF7F
      FF7FFF7FFF7FFF7FFF7F10420000000000000000FF7F00000000000000000000
      FF7F186300000000000000000000FF7F00000000000000000000FF7F0000FF7F
      FF7FFF7FFF7F00000000FF7F000000000000000000001042FF7FFF7FFF7FFF7F
      FF7FFF7FFF7FFF7FFF7F1042000000000000000000001042FF7FFF7FFF7F0000
      FF7FFF7FFF7FFF7FFF7F104200000000000000000000FF7F1042FF7FFF7FFF7F
      FF7FFF7F1863FF7F18630000FF7F00000000000000000000FF7F0000FF7F0000
      000000000000FF7FFF7FFF7F000000000000000000001042FF7FFF7FFF7FFF7F
      FF7FFF7FFF7FFF7FFF7F1042000000000000000000001042FF7FFF7F00000000
      0000FF7FFF7FFF7FFF7F1042000000000000000000000000FF7F1042FF7FFF7F
      FF7F1863FF7F18630000FF7F00000000000000000000FF7F0000FF7F00000000
      0000000000000000FF7F0000FF7F00000000000000001042FF7FFF7FFF7FFF7F
      FF7FFF7FFF7FFF7FFF7F1042000000000000000000001042FF7F000000000000
      00000000FF7FFF7FFF7F10420000000000000000FF7FFF7FFF7F1042FF7FFF7F
      FF7FFF7F1863FF7F0000FF7FFF7FFF7F00000000FF7FFF7F0000FF7FFF7F0000
      000000000000FF7F000000000000FF7F0000000000001042FF7FFF7FFF7FFF7F
      FF7FFF7FFF7FFF7FFF7F1042000000000000000000001042FF7F00000000FF7F
      000000000000FF7FFF7F1042000000000000FF7F00000000FF7F1042FF7FFF7F
      FF7F1863FF7F18630000FF7F00000000FF7FFF7F00000000000000000000FF7F
      00000000FF7F00000000000000000000FF7F000000001042FF7FFF7FFF7FFF7F
      FF7FFF7FFF7FFF7FFF7F1042000000000000000000001042FF7F0000FF7FFF7F
      FF7F000000000000FF7F10420000000000000000FF7FFF7FFF7F1042FF7FFF7F
      FF7FFF7F1863FF7F0000FF7FFF7FFF7F00000000FF7F000000000000FF7F0000
      000000000000FF7FFF7F0000FF7FFF7F0000000000001042FF7FFF7FFF7FFF7F
      FF7FFF7FFF7FFF7FFF7F1042000000000000000000001042FF7FFF7FFF7FFF7F
      FF7FFF7F00000000FF7F10420000000000000000000000000000FF7F1042FF7F
      FF7F1863FF7F0000FF7F000000000000000000000000FF7F0000FF7F00000000
      0000000000000000FF7F0000FF7F00000000000000001042FF7FFF7FFF7FFF7F
      FF7FFF7FFF7FFF7FFF7F1042000000000000000000001042FF7FFF7FFF7FFF7F
      FF7FFF7FFF7F0000FF7F10420000000000000000000000000000FF7FE0031042
      186318630000E003FF7F0000000000000000000000000000FF7FFF7FFF7F0000
      000000000000FF7F0000FF7F000000000000000000001042FF7FFF7FFF7FFF7F
      FF7FFF7FFF7FFF7FFF7F1042000000000000000000001042FF7FFF7FFF7FFF7F
      FF7FFF7FFF7FFF7FFF7F1042000000000000000000000000FF7F0000FF7FFF7F
      10420000FF7FFF7F0000FF7F000000000000000000000000FF7F00000000FF7F
      FF7FFF7FFF7F0000FF7F00000000000000000000000010421042104210421042
      1042104210421042104210420000000000000000000010421042104210421042
      10421042104210421042104200000000000000000000FF7F0000FF7F0000FF7F
      10420000FF7F0000FF7F0000FF7F000000000000000000000000FF7FFF7F0000
      000000000000FF7F000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      00000000000000000000000000000000000000000000FF7FFF7F000000000000
      FF7FFF7F000000000000FF7FFF7F00000000000000000000000000000000FF7F
      FF7FFF7FFF7F0000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      000000000000FF7FFF7F00000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000945218638810
      0000000000000000000000000000000000000000000000000000000010421042
      00000000FF7FFF7FFF7F00000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000786318637863
      1863881000000000000000000000000000000000000000000000104210421042
      0000FF7FFF7F0000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000009452FE7F1863FE7F
      7863786318630821000000000000000000000000000000001042104200000000
      00000000FF7FFF7FFF7FFF7FFF7F000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      00000000000000000000000000000000000000000000000078637863FE7F0000
      7863FE7F78637863186308210000000000000000000000000000104210421042
      104210420000FF7FFF7FFF7F0000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      000000000000000000000000000000000000000000009452FE7F1863FE7F7863
      FE7F00007863FE7F786318639452082100000000000000000000104210421042
      104200000000FF7FFF7FFF7FFF7F000000000000104218631863186318631863
      18631863186318630000000000000000000000001042FF7FFF7FFF7FFF7FFF7F
      FF7FFF7FFF7FFF7F0000000000000000000000000000FE7F7863FE7F00001863
      FE7F7863885108511062FE7F7863186388310000000000000000104210421042
      104210420000FF7FFF7FFF7FFF7FFF7F000000001042E05E1863186318630000
      186318631863E05E00000000000000000000000010421042FF7FFF7FFF7FFF7F
      FF7FFF7FFF7F10420000000000000000000000008831FE7F1863FE7F7863FE7F
      0000905190629062885198727863104210630000000000001042104210421042
      1042104210420000FF7F0000FF7F0000000000001042FF7FE05E18630000FF7F
      00001863E05EFF7F0000000000000000000000001042FF7F1042FF7FFF7FFF7F
      FF7FFF7F1042FF7F000000000000000000000000981094529452FE7F1863FE7F
      786308519872786308511062FE7F903100000000000000000000104210421042
      000010420000FF7FFF7F000000000000000000001042E07F18630000FF7FE07F
      FF7F00001863E07F0000000000000000000000001042FF7FFF7F104210421042
      10421042FF7FFF7F00000000000000000000000008009810981094529452FE7F
      7863186390610851106218631042106300000000000000000000000010421042
      00000000FF7F0000FF7FFF7FFF7F000000000000104218630000E07FFF7FFF7F
      FF7FE07F000018630000000000000000000000001042FF7F10421863FF7F1863
      FF7F18631042FF7F000000000000000000000000000008000800981098109852
      9452FE7F986290621863FE7F9031000000000000000000000000000010421042
      10420000FF7FFF7F000000000000FF7F0000000010420000FF7FFF7FFF7FE07F
      FF7FFF7FFF7F0000000000000000000000000000104210421863FF7F1863FF7F
      1863FF7F18631042000000000000000000000000000000000000080010009031
      1042945294527863786310421063000000000000000000000000000000000000
      000000001042FF7FFF7FFF7FFF7F000000000000104210421042104210421042
      104210421042104200000000000000000000000000001042FF7F1863FF7F1863
      FF7F1863FF7F1042000000000000000000000000000000000000000000008810
      0821903110429452186308210000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000001042FF7F1863FF7F
      1863FF7F10420000000000000000000000000000000000000000000000000000
      0000881008219031903110630000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000104210421042
      1042104200000000000000000000000000000000000000000000000000000000
      0000000000008810000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      0000000000000000000000000000000000000000000000000000000000000000
      000000000000000000000000000000000000424D3E000000000000003E000000
      2800000040000000400000000100010000000000000200000000000000000000
      000000000000000000000000FFFFFF00FFFFFFFF00000000FFFFFFFF00000000
      FFFFFFFF00000000E001E00100000000E001E00100000000E001E00100000000
      E001E00100000000E001E00100000000E001E00100000000E001E00100000000
      E001E00100000000E001E00100000000E001E00100000000E001E00100000000
      E001E00100000000FFFFFFFF00000000FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
      FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF9FC04FC47FFFFFFF0FC007C47F
      FFFFFE07C003C07FFFFF000F000700FFFFFF000F0007007FFFFF001F000F007F
      FFFF003F001F007FFFFF007F01BF007FFFFF01FF03FF01FFFFFF03FF03FF03FF
      FFFF07FF07FF07FFFFFF0FFF0FFF0FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF
      FFFFFFFFFFFFFFFFFFFFFFFFFE7FFC3FC007C007C003F80FC007C0078001F007
      C007C007C003E3C7C007C007E007C7E3C007C007800183C1C007C00700000180
      C007C007800183C1C007C007F00FC7E3C007C007F00FE3C7C007C007E007E00F
      C007C007C423F01FFFFFFFFFCE73FC3FFFFFFFFFFFFFFFFFF3FF5901FFFFFFFF
      E0FFB007FFFFFFFFE03F8001FFFFFFFFC00FC001FFFFFFFFC2038001800F800F
      80808001800F800F84000000800F800F01000001800F800F00010001800F800F
      00010000800F800FC0030000800F800FF0030001800FC01FFC078003FFFFE03F
      FF07C0FFFFFFF07FFFCFFFFFFFFFFFFF00000000000000000000000000000000
      000000000000}
  end
end
