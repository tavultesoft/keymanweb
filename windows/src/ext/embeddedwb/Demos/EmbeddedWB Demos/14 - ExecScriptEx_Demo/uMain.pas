//***************************************************************
//                  EmbeddedWB ExecScriptEx Demo                *
//                                                              *
//                     Freeware Demo                            *
//                        by                                    *
//         Thomas Stutz (smot) -(smot777@yahoo.com)             *
//                                                              *
//                                                              *
//***************************************************************
{LICENSE:
THIS SOFTWARE IS PROVIDED TO YOU "AS IS" WITHOUT WARRANTY OF ANY KIND,
EITHER EXPRESSED OR IMPLIED INCLUDING BUT NOT LIMITED TO THE APPLIED
WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A PARTICULAR PURPOSE.
YOU ASSUME THE ENTIRE RISK AS TO THE ACCURACY AND THE USE OF THE SOFTWARE
AND ALL OTHER RISK ARISING OUT OF THE USE OR PERFORMANCE OF THIS SOFTWARE
AND DOCUMENTATION. BSALSA PRODUCTIONS DOES NOT WARRANT THAT THE SOFTWARE IS ERROR-FREE
OR WILL OPERATE WITHOUT INTERRUPTION. THE SOFTWARE IS NOT DESIGNED, INTENDED
OR LICENSED FOR USE IN HAZARDOUS ENVIRONMENTS REQUIRING FAIL-SAFE CONTROLS,
INCLUDING WITHOUT LIMITATION, THE DESIGN, CONSTRUCTION, MAINTENANCE OR
OPERATION OF NUCLEAR FACILITIES, AIRCRAFT NAVIGATION OR COMMUNICATION SYSTEMS,
AIR TRAFFIC CONTROL, AND LIFE SUPPORT OR WEAPONS SYSTEMS. BSALSA PRODUCTIONS SPECIFICALLY
DISCLAIMS ANY EXPRESS OR IMPLIED WARRANTY OF FITNESS FOR SUCH PURPOSE.

You may use/ change/ modify the component under 4 conditions:
1. In your website, add a link to "http://www.bsalsa.com"
2. In your application, add credits to "Embedded Web Browser"
3. Mail me  (bsalsa@bsalsa.com) any code change in the unit  for the benefit
   of the other users.
4. Please, consider donation in our web site!
{*******************************************************************************}

unit uMain;

{$I EWB_jedi.inc}

interface

uses
  Windows, StdCtrls, OleCtrls, SHDocVw_EWB, EwbCore, EmbeddedWB, Dialogs, Forms, SysUtils,
  Classes, ExtCtrls, Controls;

type
  TForm1 = class(TForm)
    Panel1: TPanel;
    Button1: TButton;
    edPara: TEdit;
    Label1: TLabel;
    Panel2: TPanel;
    Memo1: TMemo;
    Panel3: TPanel;
    EmbeddedWB1: TEmbeddedWB;
    Panel4: TPanel;
    Panel5: TPanel;
    procedure Button1Click(Sender: TObject);
    procedure FormCreate(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  Form1: TForm1;

implementation

{$R *.dfm}

procedure TForm1.Button1Click(Sender: TObject);
var
  vResult: OleVariant;
  Para1: string;
begin
  Para1 := edPara.Text;
  vResult := EmbeddedWB1.ExecScriptEx('evaluate', [Para1]);
  ShowMessage('Result from the Script: ' + IntToStr(vResult));
end;

procedure TForm1.FormCreate(Sender: TObject);
begin
  EmbeddedWB1.HTMLCode.Assign(Memo1.Lines);
end;

end.

