KeymanWeb.KR(new Keyboard_i4786());function Keyboard_i4786(){this.KI="Keyboard_i4786";this.KN="";this.KV=null;this.KH='';this.KM=0;this.KBVER="1.0";this.s7="en-US";this.s8="en-AU";this.s9="en-UK";this.s10="fr-FR";this.s11="fr-CA";this.s12="en";this.s13="fr";this.KVER="9.0.516.0";this.gs=function(t,e) {return this.g0(t,e);};this.g0=function(t,e) {var k=KeymanWeb,r=0,m=0;if(k.KKM(e,16384,8)&&k.KCM(4,t,"(US)",4)) {r=m=1;k.KO(4,t,"");}else if(k.KKM(e,16384,65)&&k.KIFS(32,this.s7,t)) {r=m=1;k.KO(0,t,"English (US)");}else if(k.KKM(e,16384,65)&&k.KIFS(32,this.s8,t)) {r=m=1;k.KO(0,t,"English (AU)");}else if(k.KKM(e,16384,65)&&k.KIFS(32,this.s9,t)) {r=m=1;k.KO(0,t,"English (UK)");}else if(k.KKM(e,16384,65)&&k.KIFS(32,this.s10,t)) {r=m=1;k.KO(0,t,"French (FR)");}else if(k.KKM(e,16384,65)&&k.KIFS(32,this.s11,t)) {r=m=1;k.KO(0,t,"French (CA)");}else if(k.KKM(e,16384,66)&&k.KIFS(32,this.s12,t)) {r=m=1;k.KO(0,t,"English");}else if(k.KKM(e,16384,66)&&k.KIFS(32,this.s13,t)) {r=m=1;k.KO(0,t,"French");}return r;};}