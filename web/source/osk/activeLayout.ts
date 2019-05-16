namespace com.keyman.osk {
  export class ActiveKey implements LayoutKey {

    // Defines key defaults
    static readonly DEFAULT_KEY = {
      text: '',
      width: '100',
      sp: '0',
      pad: '15'
    };

    width?: string;
    pad?: string;
    
    proportionalX: number;
    proportionalWidth: number;

    static polyfill(key: LayoutKey) {
      // Add class functions to the existing layout object, allowing it to act as an ActiveLayout.
      let dummy = new ActiveKey();
      for(let prop in dummy) {
        if(!key.hasOwnProperty(prop)) {
          key[prop] = dummy[prop];
        }
      }
    }
  }

  class ActiveRow implements LayoutRow {
    // Identify key labels (e.g. *Shift*) that require the special OSK font
    static readonly SPECIAL_LABEL=/\*\w+\*/;

    id: string;
    key: LayoutKey[];

    /**
     * Used for calculating fat-fingering offsets.
     */
    proportionalY: number;
    proportionalHeight: number;

    private constructor() {

    }
    
    static polyfill(row: LayoutRow, totalWidth: number, proportionalY: number, proportionalHeight: number) {
      // Apply defaults, setting the width and other undefined properties for each key
      let keys=row['key'];
      for(let j=0; j<keys.length; j++) {
        let key=keys[j];
        for(var tp in ActiveKey.DEFAULT_KEY) {
          if(typeof key[tp] != 'string') {
            key[tp]=ActiveKey.DEFAULT_KEY[tp];
          }
        }

        // Modify the key type for special keys with non-standard labels
        // to allow the keyboard font to ovveride the SpecialOSK font.
        // Blank keys are no longer reclassed - can use before/after CSS to add text
        switch(key['sp']) {
          case '1':
            if(!ActiveRow.SPECIAL_LABEL.test(key['text']) && key['text'] != '') {
              key['sp']='3';
            }
            break;
          case '2':
            if(!ActiveRow.SPECIAL_LABEL.test(key['text']) && key['text'] != '') {
              key['sp']='4';
            }
            break;
        }

        ActiveKey.polyfill(key);
      }

      /* The calculations here are effectively 'virtualized'.  When used with the OSK, the VisualKeyboard
       * will overwrite these values with their true runtime geometry.
       *
       * These calculations approximate those of the actual OSK (without fitting to a specific resolution)
       * and are intended for use with layout testing (while headless) in the future.
       */

      // Calculate percentage-based scalings by summing defined widths and scaling each key to %.
      // Save each percentage key width as a separate member (do *not* overwrite layout specified width!)
      var keyPercent: number, padPercent: number, totalPercent=0;
      for(let j=0; j<keys.length-1; j++) {
        keyPercent=parseInt(keys[j]['width'],10)/totalWidth;
        keys[j]['widthpc']=keyPercent;
        padPercent=parseInt(keys[j]['pad'],10)/totalWidth;
        keys[j]['padpc']=padPercent;

        // compute center's default x-coord
        (<ActiveKey> keys[j]).proportionalX = (totalPercent + padPercent + (keyPercent/2));
        (<ActiveKey> keys[j]).proportionalWidth = keyPercent;

        totalPercent += padPercent+keyPercent;
      }

      // Allow for right OSK margin (15 layout units)
      let rightMargin = 15/totalWidth;
      totalPercent += rightMargin;

      // If a single key, and padding is negative, add padding to right align the key
      if(keys.length == 1 && parseInt(keys[0]['pad'],10) < 0) {
        keyPercent=parseInt(keys[0]['width'],10)/totalWidth;
        keys[0]['widthpc']=keyPercent;
        totalPercent += keyPercent;
        keys[0]['padpc']=1-totalPercent;

        // compute center's default x-coord
        (<ActiveKey> keys[0]).proportionalX = ((totalPercent - rightMargin) -  keyPercent/2);
        (<ActiveKey> keys[0]).proportionalWidth = keyPercent;

      } else if(keys.length > 0) {
        let j=keys.length-1;
        padPercent=parseInt(keys[j]['pad'],10)/totalWidth;
        keys[j]['padpc']=padPercent;
        totalPercent += padPercent;
        keys[j]['widthpc'] = keyPercent = 1-totalPercent;

        // compute center's default x-coord // FIXME
        (<ActiveKey> keys[j]).proportionalX = (1 - rightMargin) - keyPercent/2;
        (<ActiveKey> keys[j]).proportionalWidth = keyPercent;
      }

      // Add class functions to the existing layout object, allowing it to act as an ActiveLayout.
      let dummy = new ActiveRow();
      for(let key in dummy) {
        if(!row.hasOwnProperty(key)) {
          row[key] = dummy[key];
        }
      }

      let aRow = row as ActiveRow;
      aRow.proportionalY = proportionalY;
      aRow.proportionalHeight = proportionalHeight;
    }
  }

  export class ActiveLayer implements LayoutLayer {
    row: ActiveRow[];
    id: string;

    totalWidth: number;

    defaultKeyProportionalWidth: number;

    constructor() {

    }

    static polyfill(layer: LayoutLayer, formFactor: string) {
      layer.aligned=false;

      // Create a DIV for each row of the group
      let rows=layer['row'];

      // Calculate the maximum row width (in layout units)
      var totalWidth=0;
      for(let i=0; i<layer['row'].length; i++) {
        var width=0;
        let row=rows[i];
        let keys=row['key'];
        for(let j=0; j<keys.length; j++) {
          let key=keys[j];

          // Test for a trailing comma included in spec, added as null object by IE
          if(key == null) {
            keys.length = keys.length-1;
          } else {
            var kw, kp;
            kw = (typeof key['width'] == 'string' && key['width'] != '') ? parseInt(key['width'],10) : 100;
            if(isNaN(kw) || kw == 0) kw = 100;
            key['width'] = kw.toString();
            kp = (typeof key['pad'] == 'string' && key['pad'] != '') ? parseInt(key['pad'],10) : 15;
            if(isNaN(kp) || kp == 0) kp = 15;  // KMEW-119
            key['pad'] = kp.toString();
            width += kw + kp;
            //if(typeof key['width'] == 'string' && key['width'] != '') width += parseInt(key['width'],10); else width += 100;
            //if(typeof key['pad'] == 'string' && key['pad'] != '') width += parseInt(key['pad'],10); else width += 5;
          }
        }
        if(width > totalWidth) {
          totalWidth = width;
        }
      }

      // Add default right margin
      if(formFactor == 'desktop') {
        totalWidth += 5;  // KMEW-117
      } else {
        // TODO: Not entirely clear why this needs to be 15 instead of 5 on touch layouts.  We probably have
        // a miscalculation somewhere
        totalWidth += 15;
      }

      let rowCount = layer.row.length;
      for(let i=0; i<rowCount; i++) {
        // Calculate proportional y-coord of row.  0 is at top with highest y-coord.
        let rowProportionalY = (rowCount - i - 0.5) / rowCount;
        ActiveRow.polyfill(layer.row[i], totalWidth, rowProportionalY, 1.0 / rowCount);
      }

      // Add class functions and properties to the existing layout object, allowing it to act as an ActiveLayout.
      let dummy = new ActiveLayer();
      for(let key in dummy) {
        if(!layer.hasOwnProperty(key)) {
          layer[key] = dummy[key];
        }
      }

      let aLayer = layer as ActiveLayer;
      aLayer.totalWidth = totalWidth;
      aLayer.defaultKeyProportionalWidth = parseInt(ActiveKey.DEFAULT_KEY.width, 10) / totalWidth;
    }
  }

  export class ActiveLayout implements LayoutFormFactor{
    layer: ActiveLayer[];
    font: string;

    private constructor() {

    }

    /**
     * 
     * @param layout
     * @param formFactor 
     */
    static polyfill(layout: LayoutFormFactor, formFactor: string): ActiveLayout {
      if(layout == null) {
        throw new Error("Cannot build an ActiveLayout for a null specification.");
      }

      // Create a separate OSK div for each OSK layer, only one of which will ever be visible
      var n: number, i: number;
      var layers: LayoutLayer[], layer: LayoutLayer;
      var rows: LayoutRow[];

      layers=layout['layer'];

      // ***Delete any empty rows at the end added by compiler bug...
      for(n=0; n<layers.length; n++) {
        layer=layers[n]; rows=layer['row'];
        for(i=rows.length; i>0; i--) {
          if(rows[i-1]['key'].length > 0) {
            break;
          }
        }

        if(i < rows.length) {
          rows.splice(i-rows.length,rows.length-i);
        }
      }
      // ...remove to here when compiler bug fixed ***

      for(n=0; n<layers.length; n++) {
        ActiveLayer.polyfill(layers[n], formFactor);
      }

      // Add class functions to the existing layout object, allowing it to act as an ActiveLayout.
      let dummy = new ActiveLayout();
      for(let key in dummy) {
        if(!layout.hasOwnProperty(key)) {
          layout[key] = dummy[key];
        }
      }

      return layout as ActiveLayout;
    }

    keyTouchDistribution(proportionalCoords: {x: number, y: number}, kbdDims?: {w: number, h: number}): {[keyId: string]: number} {
      // TODO:  This function.
      return null;
    }
  }
}