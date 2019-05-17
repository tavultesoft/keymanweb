namespace wordBreakers {
  /**
   * This code is copied from:
   * https://github.com/eddieantonio/unicode-default-word-boundary/tree/v12.0.0-alpha
   */

  export function uax29(text: string): Span[] {
    let spans = Array.from(findSpans(text));
    return spans.filter(span => isNonSpace(span.text));
  }

  // Utilities //

  /**
   * Generator that yields every successive span from the the text.
   * @param text Any valid USVString to segment.
   */
  function* findSpans(text: string): Iterable<Span> {
    // TODO: don't throw the boundaries into an array.
    let boundaries = Array.from(findBoundaries(text));
    
    if (boundaries.length == 0) {
      return;
    }

    // All non-empty strings have at least TWO boundaries at the start and end of
    // the string.
    console.assert(boundaries.length >= 2);

    for (let i = 0; i < boundaries.length - 1; i++) {
      let start = boundaries[i];
      let end = boundaries[i + 1];
      yield new LazySpan(text, start, end);
    }
  }

  /**
   * A span that does not cut out the substring until it absolutely has to!
   */
  class LazySpan implements Span {
    private _source: string;
    readonly start: number;
    readonly end: number;
    constructor(source: string, start: number, end: number) {
      this._source = source;
      this.start = start;
      this.end = end;
    }

    get text(): string {
      return this._source.substring(this.start, this.end);
    }

    get length(): number {
      return this.end - this.start;
    }
  }

  /**
   * Returns true when the chunk does not solely consiste of whitespace.
   *
   * @param chunk a chunk of text. Starts and ends at word boundaries.
   */
  function isNonSpace(chunk: string): boolean {
    return !Array.from(chunk).map(property).every(wb => (
      wb === 'CR' || wb === 'LF' || wb === 'Newline' || wb === 'WSegSpace'
    ));
  }

  /**
   * Return an array of string indicies where a word break should occur. That is,
   * there should be a break BEFORE each index returned.
   */
  function* findBoundaries(text: string): Iterable<number> {
    // WB1 and WB2: no boundaries if given an empty string.
    if (text.length === 0) {
      // There are no boundaries in an empty string.
      return;
    }
    // TODO: rewrite this code where property(char[pos]) == property(right)
    // use a simple while loop, AND advance CODE UNIT BY CODE UNIT (account for
    // surrogate pairs here directly).
    // TODO: Explicitly keep track of the parity of regional flag indicators in order
    // to implement WB15 at all (requires even number of regional flag indicators).
    // TODO: Rewrite this to handle WB4 properly...
    // Maintain a sliding window of four SCALAR VALUES.
    //
    //  - Scalar values? JavaScript strings are not actually a string of 
    //    Unicode code points; some characters are made up of TWO JavaScript indices.
    //    e.g., "💩".length === 2, "💩"[0] === '\uXXXX',   "💩"[1] === '\uXXXX'
    //    Since we don't want to be in the "middle" of a character, make sure
    //    we're always advancing by scalar values, and not indices.
    //  - Four values? Some rules look at what's left of left, and some look at
    //    what's right of right. So keep track of this!
    //let lookbehind_pos = -2; // lookbehind, one scalar value left of left
    //let left_pos = -1;
    let rightPos: number;
    let lookaheadPos = 0; // lookahead, one scalar value right of right.
    // Before the start of the string is also the start of the string. This doesn't matter much!
    let lookbehind: WordBreakProperty;
    let left: WordBreakProperty = 'sot';
    let right: WordBreakProperty = 'sot';
    let lookahead: WordBreakProperty = wordbreakPropertyAt(0);
    // To make sure we're not splitting emoji flags:
    let consecutiveRegionalIndicators = 0;
    while ( /* N.B., breaks at rule WB2. */true) {
      // Shift all positions, one scalar value to the right.
      rightPos = lookaheadPos;
      lookaheadPos = positionAfter(lookaheadPos);
      // Shift all properties, one scalar value to the right.
      [lookbehind, left, right, lookahead] =
        [left, right, lookahead, wordbreakPropertyAt(lookaheadPos)];
      debugger;
      // Break at the start and end of text, unless the text is empty.
      // WB1: Break at start of text...
      if (left === 'sot') {
        yield rightPos;
        continue;
      }
      // WB2: Break at the end of text...
      if (right === 'eot') {
        console.assert(rightPos === text.length);
        yield rightPos;
        break; // Reached the end of the string. We're done!
      }
      // WB3: Do not break within CRLF:
      if (left === 'CR' && right === 'LF')
        continue;
      // WB3b: Otherwise, break after...
      if (left === 'Newline' || left == 'CR' || left === 'LF') {
        yield rightPos;
        continue;
      }
      // WB3a: ...and before newlines
      if (right === 'Newline' || right === 'CR' || right === 'LF') {
        yield rightPos;
        continue;
      }
      // TODO: WB3c: Do not break within emoji ZWJ sequences.
      // Not implemented, because it is SUPER annoying, and of limited utility.

      // WB3d: Keep horizontal whitespace together
      if (left === 'WSegSpace' && right == 'WSegSpace')
        continue;
      // WB4: Ignore format and extend characters, except after sot, CR, LF, and Newline.
      // See: Section 6.2: https://unicode.org/reports/tr29/#Grapheme_Cluster_and_Format_Rules
      // This is to keep grapheme clusters together!
      // N.B.: The exception has already been handled above!
      while (right === 'Format' || right === 'Extend' || right === 'ZWJ') {
        // Continue advancing in the string, as if these characters do not exist.
        // DO NOT update left and right, however!
        [rightPos, lookaheadPos] = [lookaheadPos, positionAfter(lookaheadPos)];
        [right, lookahead] = [lookahead, wordbreakPropertyAt(lookaheadPos)];
      }
      // In ignoring the characters in the previous loop, we could have fallen of
      // the end of the string, so end the loop prematurely if that happens!
      if (right === 'eot') {
        console.assert(rightPos === text.length);
        yield rightPos;
        break;
      }
      // WB4 (continued): Lookahead must ALSO ignore these format, extend, zwj characters!
      while (lookahead === 'Format' || lookahead === 'Extend' || lookahead === 'ZWJ') {
        // Continue advancing in the string, as if these characters do not exist.
        // DO NOT update left and right, however!
        lookaheadPos = positionAfter(lookaheadPos);
        lookahead = wordbreakPropertyAt(lookaheadPos);
      }
      // WB5: Do not break between most letters.
      if (isAHLetter(left) && isAHLetter(right))
        continue;
      // Do not break across certain punctuation
      // WB6: (Don't break before appostrophies in contractions)
      if (isAHLetter(left) && isAHLetter(lookahead) &&
        (right === 'MidLetter' || isMidNumLetQ(right)))
        continue;
      // WB7: (Don't break after appostrophies in contractions)
      if (isAHLetter(lookbehind) && isAHLetter(right) &&
        (left === 'MidLetter' || isMidNumLetQ(left)))
        continue;
      // WB7a
      if (left === 'Hebrew_Letter' && right === 'Single_Quote')
        continue;
      // WB7b
      if (left === 'Hebrew_Letter' && right === 'Double_Quote' &&
        lookahead === 'Hebrew_Letter')
        continue;
      // WB7c
      if (lookbehind === 'Hebrew_Letter' && left === 'Double_Quote' &&
        right === 'Hebrew_Letter')
        continue;
      // Do not break within sequences of digits, or digits adjacent to letters.
      // e.g., "3a" or "A3"
      // WB8
      if (left === 'Numeric' && right === 'Numeric')
        continue;
      // WB9
      if (isAHLetter(left) && right === 'Numeric')
        continue;
      // WB10
      if (left === 'Numeric' && isAHLetter(right))
        continue;
      // Do not break within sequences, such as 3.2, 3,456.789
      // WB11
      if (lookbehind === 'Numeric' && right === 'Numeric' &&
        (left === 'MidNum' || isMidNumLetQ(left)))
        continue;
      // WB12
      if (left === 'Numeric' && lookahead === 'Numeric' &&
        (right === 'MidNum' || isMidNumLetQ(right)))
        continue;
      // WB13: Do not break between Katakana
      if (left === 'Katakana' && right === 'Katakana')
        continue;
      // Do not break from extenders (e.g., U+202F NARROW NO-BREAK SPACE)
      // WB13a
      if ((isAHLetter(left) ||
        left === 'Numeric' ||
        left === 'Katakana' ||
        left === 'ExtendNumLet') && right === 'ExtendNumLet')
        continue;
      // WB13b
      if ((isAHLetter(right) ||
        right === 'Numeric' ||
        right === 'Katakana') && left === 'ExtendNumLet')
        continue;
      // WB15 & WB16:
      // Do not break within emoji flag sequences. That is, do not break between
      // regional indicator (RI) symbols if there is an odd number of RI
      // characters before the break point.
      if (right === 'Regional_Indicator') {
        // Emoji flags are actually composed of two code points, each being a
        // "regional indicator". These indicators coorespond to Latin letters. Put
        // two of them together, and they spell out an ISO 3166-1-alpha-2 country
        // code. Since these always come in pairs, NEVER split the pairs! So, if
        // we happen to be inside the middle of an odd numbered of
        // Regional_Indicators, DON'T SPLIT!
        consecutiveRegionalIndicators += 1;
        if ((consecutiveRegionalIndicators % 2) == 1)
          continue;
      }
      else {
        consecutiveRegionalIndicators = 0;
      }
      // WB999: Otherwise, break EVERYWHERE (including around ideographs)
      yield rightPos;
    }
    return;

    ///// Internal utility functions /////

    /**
     * Returns the position of the start of the next scalar value. This jumps
     * over surrogate pairs.
     *
     * If asked for the character AFTER the end of the string, this always
     * returns the length of the string.
     */
    function positionAfter(pos: number): number {
      if (pos >= text.length) {
        return text.length;
      }
      else if (isStartOfSurrogatePair(text[pos])) {
        return pos + 2;
      }
      return pos + 1;
    }

    /**
     * Return the value of the Word_Break property at the given string index.
     * @param pos position in the text.
     */
    function wordbreakPropertyAt(pos: number) {
      if (pos < 0) {
        return 'sot'; // Always "start of string" before the string starts!
      }
      else if (pos >= text.length) {
        return 'eot'; // Always "end of string" after the string ends!
      }
      else if (isStartOfSurrogatePair(text[pos])) {
        // Surrogate pairs the next TWO items from the string!
        return property(text[pos] + text[pos + 1]);
      }
      return property(text[pos]);
    }

    // Word_Break rule macros
    // See: https://unicode.org/reports/tr29/#WB_Rule_Macros
    function isAHLetter(prop: WordBreakProperty): boolean {
      return prop === 'ALetter' || prop === 'Hebrew_Letter';
    }

    function isMidNumLetQ(prop: WordBreakProperty): boolean {
      return prop === 'MidNumLet' || prop === 'Single_Quote';
    }
  }

  function isStartOfSurrogatePair(character: string) {
    let code_unit = character.charCodeAt(0);
    return code_unit >= 0xD800 && code_unit <= 0xDBFF;
  }

  /**
   * Return the Word_Break property value for a character.
   * Note that
   * @param character a scalar value
   */
  function property(character: string): WordBreakProperty {
    // This MUST be a scalar value.
    console.assert(character.length === 1 || character.length === 2);
    // TODO: remove dependence on character.codepointAt()?
    let codepoint = character.codePointAt(0) as number;
    return searchForProperty(codepoint, 0, WORD_BREAK_PROPERTY.length);
  }

  function searchForProperty(codepoint: number, left: number, right: number): WordBreakProperty {
    // All items that are not found in the array are assigned the 'Other' property.
    if (right < left) {
      return 'Other';
    }
    let midpoint = left + ~~((right - left) / 2);
    let candidate = WORD_BREAK_PROPERTY[midpoint];
    if (codepoint < candidate.start) {
      return searchForProperty(codepoint, left, midpoint - 1);
    }
    else if (codepoint > candidate.end) {
      return searchForProperty(codepoint, midpoint + 1, right);
    }
    else {
      // We found it!
      console.assert(candidate.start <= codepoint);
      console.assert(codepoint <= candidate.end);
      return candidate.value;
    }
  }

  // Automatically generated values: DO NOT MODIFY.
  /**
   * Valid values for a word break property.
   */
  export type WordBreakProperty =
  'Other' |
  'LF' |
  'Newline' |
  'CR' |
  'WSegSpace' |
  'Double_Quote' |
  'Single_Quote' |
  'MidNum' |
  'MidNumLet' |
  'Numeric' |
  'MidLetter' |
  'ALetter' |
  'ExtendNumLet' |
  'Format' |
  'Extend' |
  'Hebrew_Letter' |
  'ZWJ' |
  'Katakana' |
  'Regional_Indicator' |
  'sot' |
  'eot';

  export interface WordBreakRange {
  start: number;
  end: number;
  value: WordBreakProperty;
  }

  export const WORD_BREAK_PROPERTY: WordBreakRange[] = [
    {start: 0xA, end: 0xA, value: 'LF'},
    {start: 0xB, end: 0xC, value: 'Newline'},
    {start: 0xD, end: 0xD, value: 'CR'},
    {start: 0x20, end: 0x20, value: 'WSegSpace'},
    {start: 0x22, end: 0x22, value: 'Double_Quote'},
    {start: 0x27, end: 0x27, value: 'Single_Quote'},
    {start: 0x2C, end: 0x2C, value: 'MidNum'},
    {start: 0x2E, end: 0x2E, value: 'MidNumLet'},
    {start: 0x30, end: 0x39, value: 'Numeric'},
    {start: 0x3A, end: 0x3A, value: 'MidLetter'},
    {start: 0x3B, end: 0x3B, value: 'MidNum'},
    {start: 0x41, end: 0x5A, value: 'ALetter'},
    {start: 0x5F, end: 0x5F, value: 'ExtendNumLet'},
    {start: 0x61, end: 0x7A, value: 'ALetter'},
    {start: 0x85, end: 0x85, value: 'Newline'},
    {start: 0xAA, end: 0xAA, value: 'ALetter'},
    {start: 0xAD, end: 0xAD, value: 'Format'},
    {start: 0xB5, end: 0xB5, value: 'ALetter'},
    {start: 0xB7, end: 0xB7, value: 'MidLetter'},
    {start: 0xBA, end: 0xBA, value: 'ALetter'},
    {start: 0xC0, end: 0xD6, value: 'ALetter'},
    {start: 0xD8, end: 0xF6, value: 'ALetter'},
    {start: 0xF8, end: 0x1BA, value: 'ALetter'},
    {start: 0x1BB, end: 0x1BB, value: 'ALetter'},
    {start: 0x1BC, end: 0x1BF, value: 'ALetter'},
    {start: 0x1C0, end: 0x1C3, value: 'ALetter'},
    {start: 0x1C4, end: 0x293, value: 'ALetter'},
    {start: 0x294, end: 0x294, value: 'ALetter'},
    {start: 0x295, end: 0x2AF, value: 'ALetter'},
    {start: 0x2B0, end: 0x2C1, value: 'ALetter'},
    {start: 0x2C2, end: 0x2C5, value: 'ALetter'},
    {start: 0x2C6, end: 0x2D1, value: 'ALetter'},
    {start: 0x2D2, end: 0x2D7, value: 'ALetter'},
    {start: 0x2DE, end: 0x2DF, value: 'ALetter'},
    {start: 0x2E0, end: 0x2E4, value: 'ALetter'},
    {start: 0x2EC, end: 0x2EC, value: 'ALetter'},
    {start: 0x2ED, end: 0x2ED, value: 'ALetter'},
    {start: 0x2EE, end: 0x2EE, value: 'ALetter'},
    {start: 0x2EF, end: 0x2FF, value: 'ALetter'},
    {start: 0x300, end: 0x36F, value: 'Extend'},
    {start: 0x370, end: 0x373, value: 'ALetter'},
    {start: 0x374, end: 0x374, value: 'ALetter'},
    {start: 0x376, end: 0x377, value: 'ALetter'},
    {start: 0x37A, end: 0x37A, value: 'ALetter'},
    {start: 0x37B, end: 0x37D, value: 'ALetter'},
    {start: 0x37E, end: 0x37E, value: 'MidNum'},
    {start: 0x37F, end: 0x37F, value: 'ALetter'},
    {start: 0x386, end: 0x386, value: 'ALetter'},
    {start: 0x387, end: 0x387, value: 'MidLetter'},
    {start: 0x388, end: 0x38A, value: 'ALetter'},
    {start: 0x38C, end: 0x38C, value: 'ALetter'},
    {start: 0x38E, end: 0x3A1, value: 'ALetter'},
    {start: 0x3A3, end: 0x3F5, value: 'ALetter'},
    {start: 0x3F7, end: 0x481, value: 'ALetter'},
    {start: 0x483, end: 0x487, value: 'Extend'},
    {start: 0x488, end: 0x489, value: 'Extend'},
    {start: 0x48A, end: 0x52F, value: 'ALetter'},
    {start: 0x531, end: 0x556, value: 'ALetter'},
    {start: 0x559, end: 0x559, value: 'ALetter'},
    {start: 0x55B, end: 0x55C, value: 'ALetter'},
    {start: 0x55E, end: 0x55E, value: 'ALetter'},
    {start: 0x560, end: 0x588, value: 'ALetter'},
    {start: 0x589, end: 0x589, value: 'MidNum'},
    {start: 0x591, end: 0x5BD, value: 'Extend'},
    {start: 0x5BF, end: 0x5BF, value: 'Extend'},
    {start: 0x5C1, end: 0x5C2, value: 'Extend'},
    {start: 0x5C4, end: 0x5C5, value: 'Extend'},
    {start: 0x5C7, end: 0x5C7, value: 'Extend'},
    {start: 0x5D0, end: 0x5EA, value: 'Hebrew_Letter'},
    {start: 0x5EF, end: 0x5F2, value: 'Hebrew_Letter'},
    {start: 0x5F3, end: 0x5F3, value: 'ALetter'},
    {start: 0x5F4, end: 0x5F4, value: 'MidLetter'},
    {start: 0x600, end: 0x605, value: 'Format'},
    {start: 0x60C, end: 0x60D, value: 'MidNum'},
    {start: 0x610, end: 0x61A, value: 'Extend'},
    {start: 0x61C, end: 0x61C, value: 'Format'},
    {start: 0x620, end: 0x63F, value: 'ALetter'},
    {start: 0x640, end: 0x640, value: 'ALetter'},
    {start: 0x641, end: 0x64A, value: 'ALetter'},
    {start: 0x64B, end: 0x65F, value: 'Extend'},
    {start: 0x660, end: 0x669, value: 'Numeric'},
    {start: 0x66B, end: 0x66B, value: 'Numeric'},
    {start: 0x66C, end: 0x66C, value: 'MidNum'},
    {start: 0x66E, end: 0x66F, value: 'ALetter'},
    {start: 0x670, end: 0x670, value: 'Extend'},
    {start: 0x671, end: 0x6D3, value: 'ALetter'},
    {start: 0x6D5, end: 0x6D5, value: 'ALetter'},
    {start: 0x6D6, end: 0x6DC, value: 'Extend'},
    {start: 0x6DD, end: 0x6DD, value: 'Format'},
    {start: 0x6DF, end: 0x6E4, value: 'Extend'},
    {start: 0x6E5, end: 0x6E6, value: 'ALetter'},
    {start: 0x6E7, end: 0x6E8, value: 'Extend'},
    {start: 0x6EA, end: 0x6ED, value: 'Extend'},
    {start: 0x6EE, end: 0x6EF, value: 'ALetter'},
    {start: 0x6F0, end: 0x6F9, value: 'Numeric'},
    {start: 0x6FA, end: 0x6FC, value: 'ALetter'},
    {start: 0x6FF, end: 0x6FF, value: 'ALetter'},
    {start: 0x70F, end: 0x70F, value: 'Format'},
    {start: 0x710, end: 0x710, value: 'ALetter'},
    {start: 0x711, end: 0x711, value: 'Extend'},
    {start: 0x712, end: 0x72F, value: 'ALetter'},
    {start: 0x730, end: 0x74A, value: 'Extend'},
    {start: 0x74D, end: 0x7A5, value: 'ALetter'},
    {start: 0x7A6, end: 0x7B0, value: 'Extend'},
    {start: 0x7B1, end: 0x7B1, value: 'ALetter'},
    {start: 0x7C0, end: 0x7C9, value: 'Numeric'},
    {start: 0x7CA, end: 0x7EA, value: 'ALetter'},
    {start: 0x7EB, end: 0x7F3, value: 'Extend'},
    {start: 0x7F4, end: 0x7F5, value: 'ALetter'},
    {start: 0x7F8, end: 0x7F8, value: 'MidNum'},
    {start: 0x7FA, end: 0x7FA, value: 'ALetter'},
    {start: 0x7FD, end: 0x7FD, value: 'Extend'},
    {start: 0x800, end: 0x815, value: 'ALetter'},
    {start: 0x816, end: 0x819, value: 'Extend'},
    {start: 0x81A, end: 0x81A, value: 'ALetter'},
    {start: 0x81B, end: 0x823, value: 'Extend'},
    {start: 0x824, end: 0x824, value: 'ALetter'},
    {start: 0x825, end: 0x827, value: 'Extend'},
    {start: 0x828, end: 0x828, value: 'ALetter'},
    {start: 0x829, end: 0x82D, value: 'Extend'},
    {start: 0x840, end: 0x858, value: 'ALetter'},
    {start: 0x859, end: 0x85B, value: 'Extend'},
    {start: 0x860, end: 0x86A, value: 'ALetter'},
    {start: 0x8A0, end: 0x8B4, value: 'ALetter'},
    {start: 0x8B6, end: 0x8BD, value: 'ALetter'},
    {start: 0x8D3, end: 0x8E1, value: 'Extend'},
    {start: 0x8E2, end: 0x8E2, value: 'Format'},
    {start: 0x8E3, end: 0x902, value: 'Extend'},
    {start: 0x903, end: 0x903, value: 'Extend'},
    {start: 0x904, end: 0x939, value: 'ALetter'},
    {start: 0x93A, end: 0x93A, value: 'Extend'},
    {start: 0x93B, end: 0x93B, value: 'Extend'},
    {start: 0x93C, end: 0x93C, value: 'Extend'},
    {start: 0x93D, end: 0x93D, value: 'ALetter'},
    {start: 0x93E, end: 0x940, value: 'Extend'},
    {start: 0x941, end: 0x948, value: 'Extend'},
    {start: 0x949, end: 0x94C, value: 'Extend'},
    {start: 0x94D, end: 0x94D, value: 'Extend'},
    {start: 0x94E, end: 0x94F, value: 'Extend'},
    {start: 0x950, end: 0x950, value: 'ALetter'},
    {start: 0x951, end: 0x957, value: 'Extend'},
    {start: 0x958, end: 0x961, value: 'ALetter'},
    {start: 0x962, end: 0x963, value: 'Extend'},
    {start: 0x966, end: 0x96F, value: 'Numeric'},
    {start: 0x971, end: 0x971, value: 'ALetter'},
    {start: 0x972, end: 0x980, value: 'ALetter'},
    {start: 0x981, end: 0x981, value: 'Extend'},
    {start: 0x982, end: 0x983, value: 'Extend'},
    {start: 0x985, end: 0x98C, value: 'ALetter'},
    {start: 0x98F, end: 0x990, value: 'ALetter'},
    {start: 0x993, end: 0x9A8, value: 'ALetter'},
    {start: 0x9AA, end: 0x9B0, value: 'ALetter'},
    {start: 0x9B2, end: 0x9B2, value: 'ALetter'},
    {start: 0x9B6, end: 0x9B9, value: 'ALetter'},
    {start: 0x9BC, end: 0x9BC, value: 'Extend'},
    {start: 0x9BD, end: 0x9BD, value: 'ALetter'},
    {start: 0x9BE, end: 0x9C0, value: 'Extend'},
    {start: 0x9C1, end: 0x9C4, value: 'Extend'},
    {start: 0x9C7, end: 0x9C8, value: 'Extend'},
    {start: 0x9CB, end: 0x9CC, value: 'Extend'},
    {start: 0x9CD, end: 0x9CD, value: 'Extend'},
    {start: 0x9CE, end: 0x9CE, value: 'ALetter'},
    {start: 0x9D7, end: 0x9D7, value: 'Extend'},
    {start: 0x9DC, end: 0x9DD, value: 'ALetter'},
    {start: 0x9DF, end: 0x9E1, value: 'ALetter'},
    {start: 0x9E2, end: 0x9E3, value: 'Extend'},
    {start: 0x9E6, end: 0x9EF, value: 'Numeric'},
    {start: 0x9F0, end: 0x9F1, value: 'ALetter'},
    {start: 0x9FC, end: 0x9FC, value: 'ALetter'},
    {start: 0x9FE, end: 0x9FE, value: 'Extend'},
    {start: 0xA01, end: 0xA02, value: 'Extend'},
    {start: 0xA03, end: 0xA03, value: 'Extend'},
    {start: 0xA05, end: 0xA0A, value: 'ALetter'},
    {start: 0xA0F, end: 0xA10, value: 'ALetter'},
    {start: 0xA13, end: 0xA28, value: 'ALetter'},
    {start: 0xA2A, end: 0xA30, value: 'ALetter'},
    {start: 0xA32, end: 0xA33, value: 'ALetter'},
    {start: 0xA35, end: 0xA36, value: 'ALetter'},
    {start: 0xA38, end: 0xA39, value: 'ALetter'},
    {start: 0xA3C, end: 0xA3C, value: 'Extend'},
    {start: 0xA3E, end: 0xA40, value: 'Extend'},
    {start: 0xA41, end: 0xA42, value: 'Extend'},
    {start: 0xA47, end: 0xA48, value: 'Extend'},
    {start: 0xA4B, end: 0xA4D, value: 'Extend'},
    {start: 0xA51, end: 0xA51, value: 'Extend'},
    {start: 0xA59, end: 0xA5C, value: 'ALetter'},
    {start: 0xA5E, end: 0xA5E, value: 'ALetter'},
    {start: 0xA66, end: 0xA6F, value: 'Numeric'},
    {start: 0xA70, end: 0xA71, value: 'Extend'},
    {start: 0xA72, end: 0xA74, value: 'ALetter'},
    {start: 0xA75, end: 0xA75, value: 'Extend'},
    {start: 0xA81, end: 0xA82, value: 'Extend'},
    {start: 0xA83, end: 0xA83, value: 'Extend'},
    {start: 0xA85, end: 0xA8D, value: 'ALetter'},
    {start: 0xA8F, end: 0xA91, value: 'ALetter'},
    {start: 0xA93, end: 0xAA8, value: 'ALetter'},
    {start: 0xAAA, end: 0xAB0, value: 'ALetter'},
    {start: 0xAB2, end: 0xAB3, value: 'ALetter'},
    {start: 0xAB5, end: 0xAB9, value: 'ALetter'},
    {start: 0xABC, end: 0xABC, value: 'Extend'},
    {start: 0xABD, end: 0xABD, value: 'ALetter'},
    {start: 0xABE, end: 0xAC0, value: 'Extend'},
    {start: 0xAC1, end: 0xAC5, value: 'Extend'},
    {start: 0xAC7, end: 0xAC8, value: 'Extend'},
    {start: 0xAC9, end: 0xAC9, value: 'Extend'},
    {start: 0xACB, end: 0xACC, value: 'Extend'},
    {start: 0xACD, end: 0xACD, value: 'Extend'},
    {start: 0xAD0, end: 0xAD0, value: 'ALetter'},
    {start: 0xAE0, end: 0xAE1, value: 'ALetter'},
    {start: 0xAE2, end: 0xAE3, value: 'Extend'},
    {start: 0xAE6, end: 0xAEF, value: 'Numeric'},
    {start: 0xAF9, end: 0xAF9, value: 'ALetter'},
    {start: 0xAFA, end: 0xAFF, value: 'Extend'},
    {start: 0xB01, end: 0xB01, value: 'Extend'},
    {start: 0xB02, end: 0xB03, value: 'Extend'},
    {start: 0xB05, end: 0xB0C, value: 'ALetter'},
    {start: 0xB0F, end: 0xB10, value: 'ALetter'},
    {start: 0xB13, end: 0xB28, value: 'ALetter'},
    {start: 0xB2A, end: 0xB30, value: 'ALetter'},
    {start: 0xB32, end: 0xB33, value: 'ALetter'},
    {start: 0xB35, end: 0xB39, value: 'ALetter'},
    {start: 0xB3C, end: 0xB3C, value: 'Extend'},
    {start: 0xB3D, end: 0xB3D, value: 'ALetter'},
    {start: 0xB3E, end: 0xB3E, value: 'Extend'},
    {start: 0xB3F, end: 0xB3F, value: 'Extend'},
    {start: 0xB40, end: 0xB40, value: 'Extend'},
    {start: 0xB41, end: 0xB44, value: 'Extend'},
    {start: 0xB47, end: 0xB48, value: 'Extend'},
    {start: 0xB4B, end: 0xB4C, value: 'Extend'},
    {start: 0xB4D, end: 0xB4D, value: 'Extend'},
    {start: 0xB56, end: 0xB56, value: 'Extend'},
    {start: 0xB57, end: 0xB57, value: 'Extend'},
    {start: 0xB5C, end: 0xB5D, value: 'ALetter'},
    {start: 0xB5F, end: 0xB61, value: 'ALetter'},
    {start: 0xB62, end: 0xB63, value: 'Extend'},
    {start: 0xB66, end: 0xB6F, value: 'Numeric'},
    {start: 0xB71, end: 0xB71, value: 'ALetter'},
    {start: 0xB82, end: 0xB82, value: 'Extend'},
    {start: 0xB83, end: 0xB83, value: 'ALetter'},
    {start: 0xB85, end: 0xB8A, value: 'ALetter'},
    {start: 0xB8E, end: 0xB90, value: 'ALetter'},
    {start: 0xB92, end: 0xB95, value: 'ALetter'},
    {start: 0xB99, end: 0xB9A, value: 'ALetter'},
    {start: 0xB9C, end: 0xB9C, value: 'ALetter'},
    {start: 0xB9E, end: 0xB9F, value: 'ALetter'},
    {start: 0xBA3, end: 0xBA4, value: 'ALetter'},
    {start: 0xBA8, end: 0xBAA, value: 'ALetter'},
    {start: 0xBAE, end: 0xBB9, value: 'ALetter'},
    {start: 0xBBE, end: 0xBBF, value: 'Extend'},
    {start: 0xBC0, end: 0xBC0, value: 'Extend'},
    {start: 0xBC1, end: 0xBC2, value: 'Extend'},
    {start: 0xBC6, end: 0xBC8, value: 'Extend'},
    {start: 0xBCA, end: 0xBCC, value: 'Extend'},
    {start: 0xBCD, end: 0xBCD, value: 'Extend'},
    {start: 0xBD0, end: 0xBD0, value: 'ALetter'},
    {start: 0xBD7, end: 0xBD7, value: 'Extend'},
    {start: 0xBE6, end: 0xBEF, value: 'Numeric'},
    {start: 0xC00, end: 0xC00, value: 'Extend'},
    {start: 0xC01, end: 0xC03, value: 'Extend'},
    {start: 0xC04, end: 0xC04, value: 'Extend'},
    {start: 0xC05, end: 0xC0C, value: 'ALetter'},
    {start: 0xC0E, end: 0xC10, value: 'ALetter'},
    {start: 0xC12, end: 0xC28, value: 'ALetter'},
    {start: 0xC2A, end: 0xC39, value: 'ALetter'},
    {start: 0xC3D, end: 0xC3D, value: 'ALetter'},
    {start: 0xC3E, end: 0xC40, value: 'Extend'},
    {start: 0xC41, end: 0xC44, value: 'Extend'},
    {start: 0xC46, end: 0xC48, value: 'Extend'},
    {start: 0xC4A, end: 0xC4D, value: 'Extend'},
    {start: 0xC55, end: 0xC56, value: 'Extend'},
    {start: 0xC58, end: 0xC5A, value: 'ALetter'},
    {start: 0xC60, end: 0xC61, value: 'ALetter'},
    {start: 0xC62, end: 0xC63, value: 'Extend'},
    {start: 0xC66, end: 0xC6F, value: 'Numeric'},
    {start: 0xC80, end: 0xC80, value: 'ALetter'},
    {start: 0xC81, end: 0xC81, value: 'Extend'},
    {start: 0xC82, end: 0xC83, value: 'Extend'},
    {start: 0xC85, end: 0xC8C, value: 'ALetter'},
    {start: 0xC8E, end: 0xC90, value: 'ALetter'},
    {start: 0xC92, end: 0xCA8, value: 'ALetter'},
    {start: 0xCAA, end: 0xCB3, value: 'ALetter'},
    {start: 0xCB5, end: 0xCB9, value: 'ALetter'},
    {start: 0xCBC, end: 0xCBC, value: 'Extend'},
    {start: 0xCBD, end: 0xCBD, value: 'ALetter'},
    {start: 0xCBE, end: 0xCBE, value: 'Extend'},
    {start: 0xCBF, end: 0xCBF, value: 'Extend'},
    {start: 0xCC0, end: 0xCC4, value: 'Extend'},
    {start: 0xCC6, end: 0xCC6, value: 'Extend'},
    {start: 0xCC7, end: 0xCC8, value: 'Extend'},
    {start: 0xCCA, end: 0xCCB, value: 'Extend'},
    {start: 0xCCC, end: 0xCCD, value: 'Extend'},
    {start: 0xCD5, end: 0xCD6, value: 'Extend'},
    {start: 0xCDE, end: 0xCDE, value: 'ALetter'},
    {start: 0xCE0, end: 0xCE1, value: 'ALetter'},
    {start: 0xCE2, end: 0xCE3, value: 'Extend'},
    {start: 0xCE6, end: 0xCEF, value: 'Numeric'},
    {start: 0xCF1, end: 0xCF2, value: 'ALetter'},
    {start: 0xD00, end: 0xD01, value: 'Extend'},
    {start: 0xD02, end: 0xD03, value: 'Extend'},
    {start: 0xD05, end: 0xD0C, value: 'ALetter'},
    {start: 0xD0E, end: 0xD10, value: 'ALetter'},
    {start: 0xD12, end: 0xD3A, value: 'ALetter'},
    {start: 0xD3B, end: 0xD3C, value: 'Extend'},
    {start: 0xD3D, end: 0xD3D, value: 'ALetter'},
    {start: 0xD3E, end: 0xD40, value: 'Extend'},
    {start: 0xD41, end: 0xD44, value: 'Extend'},
    {start: 0xD46, end: 0xD48, value: 'Extend'},
    {start: 0xD4A, end: 0xD4C, value: 'Extend'},
    {start: 0xD4D, end: 0xD4D, value: 'Extend'},
    {start: 0xD4E, end: 0xD4E, value: 'ALetter'},
    {start: 0xD54, end: 0xD56, value: 'ALetter'},
    {start: 0xD57, end: 0xD57, value: 'Extend'},
    {start: 0xD5F, end: 0xD61, value: 'ALetter'},
    {start: 0xD62, end: 0xD63, value: 'Extend'},
    {start: 0xD66, end: 0xD6F, value: 'Numeric'},
    {start: 0xD7A, end: 0xD7F, value: 'ALetter'},
    {start: 0xD82, end: 0xD83, value: 'Extend'},
    {start: 0xD85, end: 0xD96, value: 'ALetter'},
    {start: 0xD9A, end: 0xDB1, value: 'ALetter'},
    {start: 0xDB3, end: 0xDBB, value: 'ALetter'},
    {start: 0xDBD, end: 0xDBD, value: 'ALetter'},
    {start: 0xDC0, end: 0xDC6, value: 'ALetter'},
    {start: 0xDCA, end: 0xDCA, value: 'Extend'},
    {start: 0xDCF, end: 0xDD1, value: 'Extend'},
    {start: 0xDD2, end: 0xDD4, value: 'Extend'},
    {start: 0xDD6, end: 0xDD6, value: 'Extend'},
    {start: 0xDD8, end: 0xDDF, value: 'Extend'},
    {start: 0xDE6, end: 0xDEF, value: 'Numeric'},
    {start: 0xDF2, end: 0xDF3, value: 'Extend'},
    {start: 0xE31, end: 0xE31, value: 'Extend'},
    {start: 0xE34, end: 0xE3A, value: 'Extend'},
    {start: 0xE47, end: 0xE4E, value: 'Extend'},
    {start: 0xE50, end: 0xE59, value: 'Numeric'},
    {start: 0xEB1, end: 0xEB1, value: 'Extend'},
    {start: 0xEB4, end: 0xEBC, value: 'Extend'},
    {start: 0xEC8, end: 0xECD, value: 'Extend'},
    {start: 0xED0, end: 0xED9, value: 'Numeric'},
    {start: 0xF00, end: 0xF00, value: 'ALetter'},
    {start: 0xF18, end: 0xF19, value: 'Extend'},
    {start: 0xF20, end: 0xF29, value: 'Numeric'},
    {start: 0xF35, end: 0xF35, value: 'Extend'},
    {start: 0xF37, end: 0xF37, value: 'Extend'},
    {start: 0xF39, end: 0xF39, value: 'Extend'},
    {start: 0xF3E, end: 0xF3F, value: 'Extend'},
    {start: 0xF40, end: 0xF47, value: 'ALetter'},
    {start: 0xF49, end: 0xF6C, value: 'ALetter'},
    {start: 0xF71, end: 0xF7E, value: 'Extend'},
    {start: 0xF7F, end: 0xF7F, value: 'Extend'},
    {start: 0xF80, end: 0xF84, value: 'Extend'},
    {start: 0xF86, end: 0xF87, value: 'Extend'},
    {start: 0xF88, end: 0xF8C, value: 'ALetter'},
    {start: 0xF8D, end: 0xF97, value: 'Extend'},
    {start: 0xF99, end: 0xFBC, value: 'Extend'},
    {start: 0xFC6, end: 0xFC6, value: 'Extend'},
    {start: 0x102B, end: 0x102C, value: 'Extend'},
    {start: 0x102D, end: 0x1030, value: 'Extend'},
    {start: 0x1031, end: 0x1031, value: 'Extend'},
    {start: 0x1032, end: 0x1037, value: 'Extend'},
    {start: 0x1038, end: 0x1038, value: 'Extend'},
    {start: 0x1039, end: 0x103A, value: 'Extend'},
    {start: 0x103B, end: 0x103C, value: 'Extend'},
    {start: 0x103D, end: 0x103E, value: 'Extend'},
    {start: 0x1040, end: 0x1049, value: 'Numeric'},
    {start: 0x1056, end: 0x1057, value: 'Extend'},
    {start: 0x1058, end: 0x1059, value: 'Extend'},
    {start: 0x105E, end: 0x1060, value: 'Extend'},
    {start: 0x1062, end: 0x1064, value: 'Extend'},
    {start: 0x1067, end: 0x106D, value: 'Extend'},
    {start: 0x1071, end: 0x1074, value: 'Extend'},
    {start: 0x1082, end: 0x1082, value: 'Extend'},
    {start: 0x1083, end: 0x1084, value: 'Extend'},
    {start: 0x1085, end: 0x1086, value: 'Extend'},
    {start: 0x1087, end: 0x108C, value: 'Extend'},
    {start: 0x108D, end: 0x108D, value: 'Extend'},
    {start: 0x108F, end: 0x108F, value: 'Extend'},
    {start: 0x1090, end: 0x1099, value: 'Numeric'},
    {start: 0x109A, end: 0x109C, value: 'Extend'},
    {start: 0x109D, end: 0x109D, value: 'Extend'},
    {start: 0x10A0, end: 0x10C5, value: 'ALetter'},
    {start: 0x10C7, end: 0x10C7, value: 'ALetter'},
    {start: 0x10CD, end: 0x10CD, value: 'ALetter'},
    {start: 0x10D0, end: 0x10FA, value: 'ALetter'},
    {start: 0x10FC, end: 0x10FC, value: 'ALetter'},
    {start: 0x10FD, end: 0x10FF, value: 'ALetter'},
    {start: 0x1100, end: 0x1248, value: 'ALetter'},
    {start: 0x124A, end: 0x124D, value: 'ALetter'},
    {start: 0x1250, end: 0x1256, value: 'ALetter'},
    {start: 0x1258, end: 0x1258, value: 'ALetter'},
    {start: 0x125A, end: 0x125D, value: 'ALetter'},
    {start: 0x1260, end: 0x1288, value: 'ALetter'},
    {start: 0x128A, end: 0x128D, value: 'ALetter'},
    {start: 0x1290, end: 0x12B0, value: 'ALetter'},
    {start: 0x12B2, end: 0x12B5, value: 'ALetter'},
    {start: 0x12B8, end: 0x12BE, value: 'ALetter'},
    {start: 0x12C0, end: 0x12C0, value: 'ALetter'},
    {start: 0x12C2, end: 0x12C5, value: 'ALetter'},
    {start: 0x12C8, end: 0x12D6, value: 'ALetter'},
    {start: 0x12D8, end: 0x1310, value: 'ALetter'},
    {start: 0x1312, end: 0x1315, value: 'ALetter'},
    {start: 0x1318, end: 0x135A, value: 'ALetter'},
    {start: 0x135D, end: 0x135F, value: 'Extend'},
    {start: 0x1380, end: 0x138F, value: 'ALetter'},
    {start: 0x13A0, end: 0x13F5, value: 'ALetter'},
    {start: 0x13F8, end: 0x13FD, value: 'ALetter'},
    {start: 0x1401, end: 0x166C, value: 'ALetter'},
    {start: 0x166F, end: 0x167F, value: 'ALetter'},
    {start: 0x1680, end: 0x1680, value: 'WSegSpace'},
    {start: 0x1681, end: 0x169A, value: 'ALetter'},
    {start: 0x16A0, end: 0x16EA, value: 'ALetter'},
    {start: 0x16EE, end: 0x16F0, value: 'ALetter'},
    {start: 0x16F1, end: 0x16F8, value: 'ALetter'},
    {start: 0x1700, end: 0x170C, value: 'ALetter'},
    {start: 0x170E, end: 0x1711, value: 'ALetter'},
    {start: 0x1712, end: 0x1714, value: 'Extend'},
    {start: 0x1720, end: 0x1731, value: 'ALetter'},
    {start: 0x1732, end: 0x1734, value: 'Extend'},
    {start: 0x1740, end: 0x1751, value: 'ALetter'},
    {start: 0x1752, end: 0x1753, value: 'Extend'},
    {start: 0x1760, end: 0x176C, value: 'ALetter'},
    {start: 0x176E, end: 0x1770, value: 'ALetter'},
    {start: 0x1772, end: 0x1773, value: 'Extend'},
    {start: 0x17B4, end: 0x17B5, value: 'Extend'},
    {start: 0x17B6, end: 0x17B6, value: 'Extend'},
    {start: 0x17B7, end: 0x17BD, value: 'Extend'},
    {start: 0x17BE, end: 0x17C5, value: 'Extend'},
    {start: 0x17C6, end: 0x17C6, value: 'Extend'},
    {start: 0x17C7, end: 0x17C8, value: 'Extend'},
    {start: 0x17C9, end: 0x17D3, value: 'Extend'},
    {start: 0x17DD, end: 0x17DD, value: 'Extend'},
    {start: 0x17E0, end: 0x17E9, value: 'Numeric'},
    {start: 0x180B, end: 0x180D, value: 'Extend'},
    {start: 0x180E, end: 0x180E, value: 'Format'},
    {start: 0x1810, end: 0x1819, value: 'Numeric'},
    {start: 0x1820, end: 0x1842, value: 'ALetter'},
    {start: 0x1843, end: 0x1843, value: 'ALetter'},
    {start: 0x1844, end: 0x1878, value: 'ALetter'},
    {start: 0x1880, end: 0x1884, value: 'ALetter'},
    {start: 0x1885, end: 0x1886, value: 'Extend'},
    {start: 0x1887, end: 0x18A8, value: 'ALetter'},
    {start: 0x18A9, end: 0x18A9, value: 'Extend'},
    {start: 0x18AA, end: 0x18AA, value: 'ALetter'},
    {start: 0x18B0, end: 0x18F5, value: 'ALetter'},
    {start: 0x1900, end: 0x191E, value: 'ALetter'},
    {start: 0x1920, end: 0x1922, value: 'Extend'},
    {start: 0x1923, end: 0x1926, value: 'Extend'},
    {start: 0x1927, end: 0x1928, value: 'Extend'},
    {start: 0x1929, end: 0x192B, value: 'Extend'},
    {start: 0x1930, end: 0x1931, value: 'Extend'},
    {start: 0x1932, end: 0x1932, value: 'Extend'},
    {start: 0x1933, end: 0x1938, value: 'Extend'},
    {start: 0x1939, end: 0x193B, value: 'Extend'},
    {start: 0x1946, end: 0x194F, value: 'Numeric'},
    {start: 0x19D0, end: 0x19D9, value: 'Numeric'},
    {start: 0x1A00, end: 0x1A16, value: 'ALetter'},
    {start: 0x1A17, end: 0x1A18, value: 'Extend'},
    {start: 0x1A19, end: 0x1A1A, value: 'Extend'},
    {start: 0x1A1B, end: 0x1A1B, value: 'Extend'},
    {start: 0x1A55, end: 0x1A55, value: 'Extend'},
    {start: 0x1A56, end: 0x1A56, value: 'Extend'},
    {start: 0x1A57, end: 0x1A57, value: 'Extend'},
    {start: 0x1A58, end: 0x1A5E, value: 'Extend'},
    {start: 0x1A60, end: 0x1A60, value: 'Extend'},
    {start: 0x1A61, end: 0x1A61, value: 'Extend'},
    {start: 0x1A62, end: 0x1A62, value: 'Extend'},
    {start: 0x1A63, end: 0x1A64, value: 'Extend'},
    {start: 0x1A65, end: 0x1A6C, value: 'Extend'},
    {start: 0x1A6D, end: 0x1A72, value: 'Extend'},
    {start: 0x1A73, end: 0x1A7C, value: 'Extend'},
    {start: 0x1A7F, end: 0x1A7F, value: 'Extend'},
    {start: 0x1A80, end: 0x1A89, value: 'Numeric'},
    {start: 0x1A90, end: 0x1A99, value: 'Numeric'},
    {start: 0x1AB0, end: 0x1ABD, value: 'Extend'},
    {start: 0x1ABE, end: 0x1ABE, value: 'Extend'},
    {start: 0x1B00, end: 0x1B03, value: 'Extend'},
    {start: 0x1B04, end: 0x1B04, value: 'Extend'},
    {start: 0x1B05, end: 0x1B33, value: 'ALetter'},
    {start: 0x1B34, end: 0x1B34, value: 'Extend'},
    {start: 0x1B35, end: 0x1B35, value: 'Extend'},
    {start: 0x1B36, end: 0x1B3A, value: 'Extend'},
    {start: 0x1B3B, end: 0x1B3B, value: 'Extend'},
    {start: 0x1B3C, end: 0x1B3C, value: 'Extend'},
    {start: 0x1B3D, end: 0x1B41, value: 'Extend'},
    {start: 0x1B42, end: 0x1B42, value: 'Extend'},
    {start: 0x1B43, end: 0x1B44, value: 'Extend'},
    {start: 0x1B45, end: 0x1B4B, value: 'ALetter'},
    {start: 0x1B50, end: 0x1B59, value: 'Numeric'},
    {start: 0x1B6B, end: 0x1B73, value: 'Extend'},
    {start: 0x1B80, end: 0x1B81, value: 'Extend'},
    {start: 0x1B82, end: 0x1B82, value: 'Extend'},
    {start: 0x1B83, end: 0x1BA0, value: 'ALetter'},
    {start: 0x1BA1, end: 0x1BA1, value: 'Extend'},
    {start: 0x1BA2, end: 0x1BA5, value: 'Extend'},
    {start: 0x1BA6, end: 0x1BA7, value: 'Extend'},
    {start: 0x1BA8, end: 0x1BA9, value: 'Extend'},
    {start: 0x1BAA, end: 0x1BAA, value: 'Extend'},
    {start: 0x1BAB, end: 0x1BAD, value: 'Extend'},
    {start: 0x1BAE, end: 0x1BAF, value: 'ALetter'},
    {start: 0x1BB0, end: 0x1BB9, value: 'Numeric'},
    {start: 0x1BBA, end: 0x1BE5, value: 'ALetter'},
    {start: 0x1BE6, end: 0x1BE6, value: 'Extend'},
    {start: 0x1BE7, end: 0x1BE7, value: 'Extend'},
    {start: 0x1BE8, end: 0x1BE9, value: 'Extend'},
    {start: 0x1BEA, end: 0x1BEC, value: 'Extend'},
    {start: 0x1BED, end: 0x1BED, value: 'Extend'},
    {start: 0x1BEE, end: 0x1BEE, value: 'Extend'},
    {start: 0x1BEF, end: 0x1BF1, value: 'Extend'},
    {start: 0x1BF2, end: 0x1BF3, value: 'Extend'},
    {start: 0x1C00, end: 0x1C23, value: 'ALetter'},
    {start: 0x1C24, end: 0x1C2B, value: 'Extend'},
    {start: 0x1C2C, end: 0x1C33, value: 'Extend'},
    {start: 0x1C34, end: 0x1C35, value: 'Extend'},
    {start: 0x1C36, end: 0x1C37, value: 'Extend'},
    {start: 0x1C40, end: 0x1C49, value: 'Numeric'},
    {start: 0x1C4D, end: 0x1C4F, value: 'ALetter'},
    {start: 0x1C50, end: 0x1C59, value: 'Numeric'},
    {start: 0x1C5A, end: 0x1C77, value: 'ALetter'},
    {start: 0x1C78, end: 0x1C7D, value: 'ALetter'},
    {start: 0x1C80, end: 0x1C88, value: 'ALetter'},
    {start: 0x1C90, end: 0x1CBA, value: 'ALetter'},
    {start: 0x1CBD, end: 0x1CBF, value: 'ALetter'},
    {start: 0x1CD0, end: 0x1CD2, value: 'Extend'},
    {start: 0x1CD4, end: 0x1CE0, value: 'Extend'},
    {start: 0x1CE1, end: 0x1CE1, value: 'Extend'},
    {start: 0x1CE2, end: 0x1CE8, value: 'Extend'},
    {start: 0x1CE9, end: 0x1CEC, value: 'ALetter'},
    {start: 0x1CED, end: 0x1CED, value: 'Extend'},
    {start: 0x1CEE, end: 0x1CF3, value: 'ALetter'},
    {start: 0x1CF4, end: 0x1CF4, value: 'Extend'},
    {start: 0x1CF5, end: 0x1CF6, value: 'ALetter'},
    {start: 0x1CF7, end: 0x1CF7, value: 'Extend'},
    {start: 0x1CF8, end: 0x1CF9, value: 'Extend'},
    {start: 0x1CFA, end: 0x1CFA, value: 'ALetter'},
    {start: 0x1D00, end: 0x1D2B, value: 'ALetter'},
    {start: 0x1D2C, end: 0x1D6A, value: 'ALetter'},
    {start: 0x1D6B, end: 0x1D77, value: 'ALetter'},
    {start: 0x1D78, end: 0x1D78, value: 'ALetter'},
    {start: 0x1D79, end: 0x1D9A, value: 'ALetter'},
    {start: 0x1D9B, end: 0x1DBF, value: 'ALetter'},
    {start: 0x1DC0, end: 0x1DF9, value: 'Extend'},
    {start: 0x1DFB, end: 0x1DFF, value: 'Extend'},
    {start: 0x1E00, end: 0x1F15, value: 'ALetter'},
    {start: 0x1F18, end: 0x1F1D, value: 'ALetter'},
    {start: 0x1F20, end: 0x1F45, value: 'ALetter'},
    {start: 0x1F48, end: 0x1F4D, value: 'ALetter'},
    {start: 0x1F50, end: 0x1F57, value: 'ALetter'},
    {start: 0x1F59, end: 0x1F59, value: 'ALetter'},
    {start: 0x1F5B, end: 0x1F5B, value: 'ALetter'},
    {start: 0x1F5D, end: 0x1F5D, value: 'ALetter'},
    {start: 0x1F5F, end: 0x1F7D, value: 'ALetter'},
    {start: 0x1F80, end: 0x1FB4, value: 'ALetter'},
    {start: 0x1FB6, end: 0x1FBC, value: 'ALetter'},
    {start: 0x1FBE, end: 0x1FBE, value: 'ALetter'},
    {start: 0x1FC2, end: 0x1FC4, value: 'ALetter'},
    {start: 0x1FC6, end: 0x1FCC, value: 'ALetter'},
    {start: 0x1FD0, end: 0x1FD3, value: 'ALetter'},
    {start: 0x1FD6, end: 0x1FDB, value: 'ALetter'},
    {start: 0x1FE0, end: 0x1FEC, value: 'ALetter'},
    {start: 0x1FF2, end: 0x1FF4, value: 'ALetter'},
    {start: 0x1FF6, end: 0x1FFC, value: 'ALetter'},
    {start: 0x2000, end: 0x2006, value: 'WSegSpace'},
    {start: 0x2008, end: 0x200A, value: 'WSegSpace'},
    {start: 0x200C, end: 0x200C, value: 'Extend'},
    {start: 0x200D, end: 0x200D, value: 'ZWJ'},
    {start: 0x200E, end: 0x200F, value: 'Format'},
    {start: 0x2018, end: 0x2018, value: 'MidNumLet'},
    {start: 0x2019, end: 0x2019, value: 'MidNumLet'},
    {start: 0x2024, end: 0x2024, value: 'MidNumLet'},
    {start: 0x2027, end: 0x2027, value: 'MidLetter'},
    {start: 0x2028, end: 0x2028, value: 'Newline'},
    {start: 0x2029, end: 0x2029, value: 'Newline'},
    {start: 0x202A, end: 0x202E, value: 'Format'},
    {start: 0x202F, end: 0x202F, value: 'ExtendNumLet'},
    {start: 0x203F, end: 0x2040, value: 'ExtendNumLet'},
    {start: 0x2044, end: 0x2044, value: 'MidNum'},
    {start: 0x2054, end: 0x2054, value: 'ExtendNumLet'},
    {start: 0x205F, end: 0x205F, value: 'WSegSpace'},
    {start: 0x2060, end: 0x2064, value: 'Format'},
    {start: 0x2066, end: 0x206F, value: 'Format'},
    {start: 0x2071, end: 0x2071, value: 'ALetter'},
    {start: 0x207F, end: 0x207F, value: 'ALetter'},
    {start: 0x2090, end: 0x209C, value: 'ALetter'},
    {start: 0x20D0, end: 0x20DC, value: 'Extend'},
    {start: 0x20DD, end: 0x20E0, value: 'Extend'},
    {start: 0x20E1, end: 0x20E1, value: 'Extend'},
    {start: 0x20E2, end: 0x20E4, value: 'Extend'},
    {start: 0x20E5, end: 0x20F0, value: 'Extend'},
    {start: 0x2102, end: 0x2102, value: 'ALetter'},
    {start: 0x2107, end: 0x2107, value: 'ALetter'},
    {start: 0x210A, end: 0x2113, value: 'ALetter'},
    {start: 0x2115, end: 0x2115, value: 'ALetter'},
    {start: 0x2119, end: 0x211D, value: 'ALetter'},
    {start: 0x2124, end: 0x2124, value: 'ALetter'},
    {start: 0x2126, end: 0x2126, value: 'ALetter'},
    {start: 0x2128, end: 0x2128, value: 'ALetter'},
    {start: 0x212A, end: 0x212D, value: 'ALetter'},
    {start: 0x212F, end: 0x2134, value: 'ALetter'},
    {start: 0x2135, end: 0x2138, value: 'ALetter'},
    {start: 0x2139, end: 0x2139, value: 'ALetter'},
    {start: 0x213C, end: 0x213F, value: 'ALetter'},
    {start: 0x2145, end: 0x2149, value: 'ALetter'},
    {start: 0x214E, end: 0x214E, value: 'ALetter'},
    {start: 0x2160, end: 0x2182, value: 'ALetter'},
    {start: 0x2183, end: 0x2184, value: 'ALetter'},
    {start: 0x2185, end: 0x2188, value: 'ALetter'},
    {start: 0x24B6, end: 0x24E9, value: 'ALetter'},
    {start: 0x2C00, end: 0x2C2E, value: 'ALetter'},
    {start: 0x2C30, end: 0x2C5E, value: 'ALetter'},
    {start: 0x2C60, end: 0x2C7B, value: 'ALetter'},
    {start: 0x2C7C, end: 0x2C7D, value: 'ALetter'},
    {start: 0x2C7E, end: 0x2CE4, value: 'ALetter'},
    {start: 0x2CEB, end: 0x2CEE, value: 'ALetter'},
    {start: 0x2CEF, end: 0x2CF1, value: 'Extend'},
    {start: 0x2CF2, end: 0x2CF3, value: 'ALetter'},
    {start: 0x2D00, end: 0x2D25, value: 'ALetter'},
    {start: 0x2D27, end: 0x2D27, value: 'ALetter'},
    {start: 0x2D2D, end: 0x2D2D, value: 'ALetter'},
    {start: 0x2D30, end: 0x2D67, value: 'ALetter'},
    {start: 0x2D6F, end: 0x2D6F, value: 'ALetter'},
    {start: 0x2D7F, end: 0x2D7F, value: 'Extend'},
    {start: 0x2D80, end: 0x2D96, value: 'ALetter'},
    {start: 0x2DA0, end: 0x2DA6, value: 'ALetter'},
    {start: 0x2DA8, end: 0x2DAE, value: 'ALetter'},
    {start: 0x2DB0, end: 0x2DB6, value: 'ALetter'},
    {start: 0x2DB8, end: 0x2DBE, value: 'ALetter'},
    {start: 0x2DC0, end: 0x2DC6, value: 'ALetter'},
    {start: 0x2DC8, end: 0x2DCE, value: 'ALetter'},
    {start: 0x2DD0, end: 0x2DD6, value: 'ALetter'},
    {start: 0x2DD8, end: 0x2DDE, value: 'ALetter'},
    {start: 0x2DE0, end: 0x2DFF, value: 'Extend'},
    {start: 0x2E2F, end: 0x2E2F, value: 'ALetter'},
    {start: 0x3000, end: 0x3000, value: 'WSegSpace'},
    {start: 0x3005, end: 0x3005, value: 'ALetter'},
    {start: 0x302A, end: 0x302D, value: 'Extend'},
    {start: 0x302E, end: 0x302F, value: 'Extend'},
    {start: 0x3031, end: 0x3035, value: 'Katakana'},
    {start: 0x303B, end: 0x303B, value: 'ALetter'},
    {start: 0x303C, end: 0x303C, value: 'ALetter'},
    {start: 0x3099, end: 0x309A, value: 'Extend'},
    {start: 0x309B, end: 0x309C, value: 'Katakana'},
    {start: 0x30A0, end: 0x30A0, value: 'Katakana'},
    {start: 0x30A1, end: 0x30FA, value: 'Katakana'},
    {start: 0x30FC, end: 0x30FE, value: 'Katakana'},
    {start: 0x30FF, end: 0x30FF, value: 'Katakana'},
    {start: 0x3105, end: 0x312F, value: 'ALetter'},
    {start: 0x3131, end: 0x318E, value: 'ALetter'},
    {start: 0x31A0, end: 0x31BA, value: 'ALetter'},
    {start: 0x31F0, end: 0x31FF, value: 'Katakana'},
    {start: 0x32D0, end: 0x32FE, value: 'Katakana'},
    {start: 0x3300, end: 0x3357, value: 'Katakana'},
    {start: 0xA000, end: 0xA014, value: 'ALetter'},
    {start: 0xA015, end: 0xA015, value: 'ALetter'},
    {start: 0xA016, end: 0xA48C, value: 'ALetter'},
    {start: 0xA4D0, end: 0xA4F7, value: 'ALetter'},
    {start: 0xA4F8, end: 0xA4FD, value: 'ALetter'},
    {start: 0xA500, end: 0xA60B, value: 'ALetter'},
    {start: 0xA60C, end: 0xA60C, value: 'ALetter'},
    {start: 0xA610, end: 0xA61F, value: 'ALetter'},
    {start: 0xA620, end: 0xA629, value: 'Numeric'},
    {start: 0xA62A, end: 0xA62B, value: 'ALetter'},
    {start: 0xA640, end: 0xA66D, value: 'ALetter'},
    {start: 0xA66E, end: 0xA66E, value: 'ALetter'},
    {start: 0xA66F, end: 0xA66F, value: 'Extend'},
    {start: 0xA670, end: 0xA672, value: 'Extend'},
    {start: 0xA674, end: 0xA67D, value: 'Extend'},
    {start: 0xA67F, end: 0xA67F, value: 'ALetter'},
    {start: 0xA680, end: 0xA69B, value: 'ALetter'},
    {start: 0xA69C, end: 0xA69D, value: 'ALetter'},
    {start: 0xA69E, end: 0xA69F, value: 'Extend'},
    {start: 0xA6A0, end: 0xA6E5, value: 'ALetter'},
    {start: 0xA6E6, end: 0xA6EF, value: 'ALetter'},
    {start: 0xA6F0, end: 0xA6F1, value: 'Extend'},
    {start: 0xA717, end: 0xA71F, value: 'ALetter'},
    {start: 0xA720, end: 0xA721, value: 'ALetter'},
    {start: 0xA722, end: 0xA76F, value: 'ALetter'},
    {start: 0xA770, end: 0xA770, value: 'ALetter'},
    {start: 0xA771, end: 0xA787, value: 'ALetter'},
    {start: 0xA788, end: 0xA788, value: 'ALetter'},
    {start: 0xA789, end: 0xA78A, value: 'ALetter'},
    {start: 0xA78B, end: 0xA78E, value: 'ALetter'},
    {start: 0xA78F, end: 0xA78F, value: 'ALetter'},
    {start: 0xA790, end: 0xA7BF, value: 'ALetter'},
    {start: 0xA7C2, end: 0xA7C6, value: 'ALetter'},
    {start: 0xA7F7, end: 0xA7F7, value: 'ALetter'},
    {start: 0xA7F8, end: 0xA7F9, value: 'ALetter'},
    {start: 0xA7FA, end: 0xA7FA, value: 'ALetter'},
    {start: 0xA7FB, end: 0xA801, value: 'ALetter'},
    {start: 0xA802, end: 0xA802, value: 'Extend'},
    {start: 0xA803, end: 0xA805, value: 'ALetter'},
    {start: 0xA806, end: 0xA806, value: 'Extend'},
    {start: 0xA807, end: 0xA80A, value: 'ALetter'},
    {start: 0xA80B, end: 0xA80B, value: 'Extend'},
    {start: 0xA80C, end: 0xA822, value: 'ALetter'},
    {start: 0xA823, end: 0xA824, value: 'Extend'},
    {start: 0xA825, end: 0xA826, value: 'Extend'},
    {start: 0xA827, end: 0xA827, value: 'Extend'},
    {start: 0xA840, end: 0xA873, value: 'ALetter'},
    {start: 0xA880, end: 0xA881, value: 'Extend'},
    {start: 0xA882, end: 0xA8B3, value: 'ALetter'},
    {start: 0xA8B4, end: 0xA8C3, value: 'Extend'},
    {start: 0xA8C4, end: 0xA8C5, value: 'Extend'},
    {start: 0xA8D0, end: 0xA8D9, value: 'Numeric'},
    {start: 0xA8E0, end: 0xA8F1, value: 'Extend'},
    {start: 0xA8F2, end: 0xA8F7, value: 'ALetter'},
    {start: 0xA8FB, end: 0xA8FB, value: 'ALetter'},
    {start: 0xA8FD, end: 0xA8FE, value: 'ALetter'},
    {start: 0xA8FF, end: 0xA8FF, value: 'Extend'},
    {start: 0xA900, end: 0xA909, value: 'Numeric'},
    {start: 0xA90A, end: 0xA925, value: 'ALetter'},
    {start: 0xA926, end: 0xA92D, value: 'Extend'},
    {start: 0xA930, end: 0xA946, value: 'ALetter'},
    {start: 0xA947, end: 0xA951, value: 'Extend'},
    {start: 0xA952, end: 0xA953, value: 'Extend'},
    {start: 0xA960, end: 0xA97C, value: 'ALetter'},
    {start: 0xA980, end: 0xA982, value: 'Extend'},
    {start: 0xA983, end: 0xA983, value: 'Extend'},
    {start: 0xA984, end: 0xA9B2, value: 'ALetter'},
    {start: 0xA9B3, end: 0xA9B3, value: 'Extend'},
    {start: 0xA9B4, end: 0xA9B5, value: 'Extend'},
    {start: 0xA9B6, end: 0xA9B9, value: 'Extend'},
    {start: 0xA9BA, end: 0xA9BB, value: 'Extend'},
    {start: 0xA9BC, end: 0xA9BD, value: 'Extend'},
    {start: 0xA9BE, end: 0xA9C0, value: 'Extend'},
    {start: 0xA9CF, end: 0xA9CF, value: 'ALetter'},
    {start: 0xA9D0, end: 0xA9D9, value: 'Numeric'},
    {start: 0xA9E5, end: 0xA9E5, value: 'Extend'},
    {start: 0xA9F0, end: 0xA9F9, value: 'Numeric'},
    {start: 0xAA00, end: 0xAA28, value: 'ALetter'},
    {start: 0xAA29, end: 0xAA2E, value: 'Extend'},
    {start: 0xAA2F, end: 0xAA30, value: 'Extend'},
    {start: 0xAA31, end: 0xAA32, value: 'Extend'},
    {start: 0xAA33, end: 0xAA34, value: 'Extend'},
    {start: 0xAA35, end: 0xAA36, value: 'Extend'},
    {start: 0xAA40, end: 0xAA42, value: 'ALetter'},
    {start: 0xAA43, end: 0xAA43, value: 'Extend'},
    {start: 0xAA44, end: 0xAA4B, value: 'ALetter'},
    {start: 0xAA4C, end: 0xAA4C, value: 'Extend'},
    {start: 0xAA4D, end: 0xAA4D, value: 'Extend'},
    {start: 0xAA50, end: 0xAA59, value: 'Numeric'},
    {start: 0xAA7B, end: 0xAA7B, value: 'Extend'},
    {start: 0xAA7C, end: 0xAA7C, value: 'Extend'},
    {start: 0xAA7D, end: 0xAA7D, value: 'Extend'},
    {start: 0xAAB0, end: 0xAAB0, value: 'Extend'},
    {start: 0xAAB2, end: 0xAAB4, value: 'Extend'},
    {start: 0xAAB7, end: 0xAAB8, value: 'Extend'},
    {start: 0xAABE, end: 0xAABF, value: 'Extend'},
    {start: 0xAAC1, end: 0xAAC1, value: 'Extend'},
    {start: 0xAAE0, end: 0xAAEA, value: 'ALetter'},
    {start: 0xAAEB, end: 0xAAEB, value: 'Extend'},
    {start: 0xAAEC, end: 0xAAED, value: 'Extend'},
    {start: 0xAAEE, end: 0xAAEF, value: 'Extend'},
    {start: 0xAAF2, end: 0xAAF2, value: 'ALetter'},
    {start: 0xAAF3, end: 0xAAF4, value: 'ALetter'},
    {start: 0xAAF5, end: 0xAAF5, value: 'Extend'},
    {start: 0xAAF6, end: 0xAAF6, value: 'Extend'},
    {start: 0xAB01, end: 0xAB06, value: 'ALetter'},
    {start: 0xAB09, end: 0xAB0E, value: 'ALetter'},
    {start: 0xAB11, end: 0xAB16, value: 'ALetter'},
    {start: 0xAB20, end: 0xAB26, value: 'ALetter'},
    {start: 0xAB28, end: 0xAB2E, value: 'ALetter'},
    {start: 0xAB30, end: 0xAB5A, value: 'ALetter'},
    {start: 0xAB5B, end: 0xAB5B, value: 'ALetter'},
    {start: 0xAB5C, end: 0xAB5F, value: 'ALetter'},
    {start: 0xAB60, end: 0xAB67, value: 'ALetter'},
    {start: 0xAB70, end: 0xABBF, value: 'ALetter'},
    {start: 0xABC0, end: 0xABE2, value: 'ALetter'},
    {start: 0xABE3, end: 0xABE4, value: 'Extend'},
    {start: 0xABE5, end: 0xABE5, value: 'Extend'},
    {start: 0xABE6, end: 0xABE7, value: 'Extend'},
    {start: 0xABE8, end: 0xABE8, value: 'Extend'},
    {start: 0xABE9, end: 0xABEA, value: 'Extend'},
    {start: 0xABEC, end: 0xABEC, value: 'Extend'},
    {start: 0xABED, end: 0xABED, value: 'Extend'},
    {start: 0xABF0, end: 0xABF9, value: 'Numeric'},
    {start: 0xAC00, end: 0xD7A3, value: 'ALetter'},
    {start: 0xD7B0, end: 0xD7C6, value: 'ALetter'},
    {start: 0xD7CB, end: 0xD7FB, value: 'ALetter'},
    {start: 0xFB00, end: 0xFB06, value: 'ALetter'},
    {start: 0xFB13, end: 0xFB17, value: 'ALetter'},
    {start: 0xFB1D, end: 0xFB1D, value: 'Hebrew_Letter'},
    {start: 0xFB1E, end: 0xFB1E, value: 'Extend'},
    {start: 0xFB1F, end: 0xFB28, value: 'Hebrew_Letter'},
    {start: 0xFB2A, end: 0xFB36, value: 'Hebrew_Letter'},
    {start: 0xFB38, end: 0xFB3C, value: 'Hebrew_Letter'},
    {start: 0xFB3E, end: 0xFB3E, value: 'Hebrew_Letter'},
    {start: 0xFB40, end: 0xFB41, value: 'Hebrew_Letter'},
    {start: 0xFB43, end: 0xFB44, value: 'Hebrew_Letter'},
    {start: 0xFB46, end: 0xFB4F, value: 'Hebrew_Letter'},
    {start: 0xFB50, end: 0xFBB1, value: 'ALetter'},
    {start: 0xFBD3, end: 0xFD3D, value: 'ALetter'},
    {start: 0xFD50, end: 0xFD8F, value: 'ALetter'},
    {start: 0xFD92, end: 0xFDC7, value: 'ALetter'},
    {start: 0xFDF0, end: 0xFDFB, value: 'ALetter'},
    {start: 0xFE00, end: 0xFE0F, value: 'Extend'},
    {start: 0xFE10, end: 0xFE10, value: 'MidNum'},
    {start: 0xFE13, end: 0xFE13, value: 'MidLetter'},
    {start: 0xFE14, end: 0xFE14, value: 'MidNum'},
    {start: 0xFE20, end: 0xFE2F, value: 'Extend'},
    {start: 0xFE33, end: 0xFE34, value: 'ExtendNumLet'},
    {start: 0xFE4D, end: 0xFE4F, value: 'ExtendNumLet'},
    {start: 0xFE50, end: 0xFE50, value: 'MidNum'},
    {start: 0xFE52, end: 0xFE52, value: 'MidNumLet'},
    {start: 0xFE54, end: 0xFE54, value: 'MidNum'},
    {start: 0xFE55, end: 0xFE55, value: 'MidLetter'},
    {start: 0xFE70, end: 0xFE74, value: 'ALetter'},
    {start: 0xFE76, end: 0xFEFC, value: 'ALetter'},
    {start: 0xFEFF, end: 0xFEFF, value: 'Format'},
    {start: 0xFF07, end: 0xFF07, value: 'MidNumLet'},
    {start: 0xFF0C, end: 0xFF0C, value: 'MidNum'},
    {start: 0xFF0E, end: 0xFF0E, value: 'MidNumLet'},
    {start: 0xFF10, end: 0xFF19, value: 'Numeric'},
    {start: 0xFF1A, end: 0xFF1A, value: 'MidLetter'},
    {start: 0xFF1B, end: 0xFF1B, value: 'MidNum'},
    {start: 0xFF21, end: 0xFF3A, value: 'ALetter'},
    {start: 0xFF3F, end: 0xFF3F, value: 'ExtendNumLet'},
    {start: 0xFF41, end: 0xFF5A, value: 'ALetter'},
    {start: 0xFF66, end: 0xFF6F, value: 'Katakana'},
    {start: 0xFF70, end: 0xFF70, value: 'Katakana'},
    {start: 0xFF71, end: 0xFF9D, value: 'Katakana'},
    {start: 0xFF9E, end: 0xFF9F, value: 'Extend'},
    {start: 0xFFA0, end: 0xFFBE, value: 'ALetter'},
    {start: 0xFFC2, end: 0xFFC7, value: 'ALetter'},
    {start: 0xFFCA, end: 0xFFCF, value: 'ALetter'},
    {start: 0xFFD2, end: 0xFFD7, value: 'ALetter'},
    {start: 0xFFDA, end: 0xFFDC, value: 'ALetter'},
    {start: 0xFFF9, end: 0xFFFB, value: 'Format'},
    {start: 0x10000, end: 0x1000B, value: 'ALetter'},
    {start: 0x1000D, end: 0x10026, value: 'ALetter'},
    {start: 0x10028, end: 0x1003A, value: 'ALetter'},
    {start: 0x1003C, end: 0x1003D, value: 'ALetter'},
    {start: 0x1003F, end: 0x1004D, value: 'ALetter'},
    {start: 0x10050, end: 0x1005D, value: 'ALetter'},
    {start: 0x10080, end: 0x100FA, value: 'ALetter'},
    {start: 0x10140, end: 0x10174, value: 'ALetter'},
    {start: 0x101FD, end: 0x101FD, value: 'Extend'},
    {start: 0x10280, end: 0x1029C, value: 'ALetter'},
    {start: 0x102A0, end: 0x102D0, value: 'ALetter'},
    {start: 0x102E0, end: 0x102E0, value: 'Extend'},
    {start: 0x10300, end: 0x1031F, value: 'ALetter'},
    {start: 0x1032D, end: 0x10340, value: 'ALetter'},
    {start: 0x10341, end: 0x10341, value: 'ALetter'},
    {start: 0x10342, end: 0x10349, value: 'ALetter'},
    {start: 0x1034A, end: 0x1034A, value: 'ALetter'},
    {start: 0x10350, end: 0x10375, value: 'ALetter'},
    {start: 0x10376, end: 0x1037A, value: 'Extend'},
    {start: 0x10380, end: 0x1039D, value: 'ALetter'},
    {start: 0x103A0, end: 0x103C3, value: 'ALetter'},
    {start: 0x103C8, end: 0x103CF, value: 'ALetter'},
    {start: 0x103D1, end: 0x103D5, value: 'ALetter'},
    {start: 0x10400, end: 0x1044F, value: 'ALetter'},
    {start: 0x10450, end: 0x1049D, value: 'ALetter'},
    {start: 0x104A0, end: 0x104A9, value: 'Numeric'},
    {start: 0x104B0, end: 0x104D3, value: 'ALetter'},
    {start: 0x104D8, end: 0x104FB, value: 'ALetter'},
    {start: 0x10500, end: 0x10527, value: 'ALetter'},
    {start: 0x10530, end: 0x10563, value: 'ALetter'},
    {start: 0x10600, end: 0x10736, value: 'ALetter'},
    {start: 0x10740, end: 0x10755, value: 'ALetter'},
    {start: 0x10760, end: 0x10767, value: 'ALetter'},
    {start: 0x10800, end: 0x10805, value: 'ALetter'},
    {start: 0x10808, end: 0x10808, value: 'ALetter'},
    {start: 0x1080A, end: 0x10835, value: 'ALetter'},
    {start: 0x10837, end: 0x10838, value: 'ALetter'},
    {start: 0x1083C, end: 0x1083C, value: 'ALetter'},
    {start: 0x1083F, end: 0x10855, value: 'ALetter'},
    {start: 0x10860, end: 0x10876, value: 'ALetter'},
    {start: 0x10880, end: 0x1089E, value: 'ALetter'},
    {start: 0x108E0, end: 0x108F2, value: 'ALetter'},
    {start: 0x108F4, end: 0x108F5, value: 'ALetter'},
    {start: 0x10900, end: 0x10915, value: 'ALetter'},
    {start: 0x10920, end: 0x10939, value: 'ALetter'},
    {start: 0x10980, end: 0x109B7, value: 'ALetter'},
    {start: 0x109BE, end: 0x109BF, value: 'ALetter'},
    {start: 0x10A00, end: 0x10A00, value: 'ALetter'},
    {start: 0x10A01, end: 0x10A03, value: 'Extend'},
    {start: 0x10A05, end: 0x10A06, value: 'Extend'},
    {start: 0x10A0C, end: 0x10A0F, value: 'Extend'},
    {start: 0x10A10, end: 0x10A13, value: 'ALetter'},
    {start: 0x10A15, end: 0x10A17, value: 'ALetter'},
    {start: 0x10A19, end: 0x10A35, value: 'ALetter'},
    {start: 0x10A38, end: 0x10A3A, value: 'Extend'},
    {start: 0x10A3F, end: 0x10A3F, value: 'Extend'},
    {start: 0x10A60, end: 0x10A7C, value: 'ALetter'},
    {start: 0x10A80, end: 0x10A9C, value: 'ALetter'},
    {start: 0x10AC0, end: 0x10AC7, value: 'ALetter'},
    {start: 0x10AC9, end: 0x10AE4, value: 'ALetter'},
    {start: 0x10AE5, end: 0x10AE6, value: 'Extend'},
    {start: 0x10B00, end: 0x10B35, value: 'ALetter'},
    {start: 0x10B40, end: 0x10B55, value: 'ALetter'},
    {start: 0x10B60, end: 0x10B72, value: 'ALetter'},
    {start: 0x10B80, end: 0x10B91, value: 'ALetter'},
    {start: 0x10C00, end: 0x10C48, value: 'ALetter'},
    {start: 0x10C80, end: 0x10CB2, value: 'ALetter'},
    {start: 0x10CC0, end: 0x10CF2, value: 'ALetter'},
    {start: 0x10D00, end: 0x10D23, value: 'ALetter'},
    {start: 0x10D24, end: 0x10D27, value: 'Extend'},
    {start: 0x10D30, end: 0x10D39, value: 'Numeric'},
    {start: 0x10F00, end: 0x10F1C, value: 'ALetter'},
    {start: 0x10F27, end: 0x10F27, value: 'ALetter'},
    {start: 0x10F30, end: 0x10F45, value: 'ALetter'},
    {start: 0x10F46, end: 0x10F50, value: 'Extend'},
    {start: 0x10FE0, end: 0x10FF6, value: 'ALetter'},
    {start: 0x11000, end: 0x11000, value: 'Extend'},
    {start: 0x11001, end: 0x11001, value: 'Extend'},
    {start: 0x11002, end: 0x11002, value: 'Extend'},
    {start: 0x11003, end: 0x11037, value: 'ALetter'},
    {start: 0x11038, end: 0x11046, value: 'Extend'},
    {start: 0x11066, end: 0x1106F, value: 'Numeric'},
    {start: 0x1107F, end: 0x11081, value: 'Extend'},
    {start: 0x11082, end: 0x11082, value: 'Extend'},
    {start: 0x11083, end: 0x110AF, value: 'ALetter'},
    {start: 0x110B0, end: 0x110B2, value: 'Extend'},
    {start: 0x110B3, end: 0x110B6, value: 'Extend'},
    {start: 0x110B7, end: 0x110B8, value: 'Extend'},
    {start: 0x110B9, end: 0x110BA, value: 'Extend'},
    {start: 0x110BD, end: 0x110BD, value: 'Format'},
    {start: 0x110CD, end: 0x110CD, value: 'Format'},
    {start: 0x110D0, end: 0x110E8, value: 'ALetter'},
    {start: 0x110F0, end: 0x110F9, value: 'Numeric'},
    {start: 0x11100, end: 0x11102, value: 'Extend'},
    {start: 0x11103, end: 0x11126, value: 'ALetter'},
    {start: 0x11127, end: 0x1112B, value: 'Extend'},
    {start: 0x1112C, end: 0x1112C, value: 'Extend'},
    {start: 0x1112D, end: 0x11134, value: 'Extend'},
    {start: 0x11136, end: 0x1113F, value: 'Numeric'},
    {start: 0x11144, end: 0x11144, value: 'ALetter'},
    {start: 0x11145, end: 0x11146, value: 'Extend'},
    {start: 0x11150, end: 0x11172, value: 'ALetter'},
    {start: 0x11173, end: 0x11173, value: 'Extend'},
    {start: 0x11176, end: 0x11176, value: 'ALetter'},
    {start: 0x11180, end: 0x11181, value: 'Extend'},
    {start: 0x11182, end: 0x11182, value: 'Extend'},
    {start: 0x11183, end: 0x111B2, value: 'ALetter'},
    {start: 0x111B3, end: 0x111B5, value: 'Extend'},
    {start: 0x111B6, end: 0x111BE, value: 'Extend'},
    {start: 0x111BF, end: 0x111C0, value: 'Extend'},
    {start: 0x111C1, end: 0x111C4, value: 'ALetter'},
    {start: 0x111C9, end: 0x111CC, value: 'Extend'},
    {start: 0x111D0, end: 0x111D9, value: 'Numeric'},
    {start: 0x111DA, end: 0x111DA, value: 'ALetter'},
    {start: 0x111DC, end: 0x111DC, value: 'ALetter'},
    {start: 0x11200, end: 0x11211, value: 'ALetter'},
    {start: 0x11213, end: 0x1122B, value: 'ALetter'},
    {start: 0x1122C, end: 0x1122E, value: 'Extend'},
    {start: 0x1122F, end: 0x11231, value: 'Extend'},
    {start: 0x11232, end: 0x11233, value: 'Extend'},
    {start: 0x11234, end: 0x11234, value: 'Extend'},
    {start: 0x11235, end: 0x11235, value: 'Extend'},
    {start: 0x11236, end: 0x11237, value: 'Extend'},
    {start: 0x1123E, end: 0x1123E, value: 'Extend'},
    {start: 0x11280, end: 0x11286, value: 'ALetter'},
    {start: 0x11288, end: 0x11288, value: 'ALetter'},
    {start: 0x1128A, end: 0x1128D, value: 'ALetter'},
    {start: 0x1128F, end: 0x1129D, value: 'ALetter'},
    {start: 0x1129F, end: 0x112A8, value: 'ALetter'},
    {start: 0x112B0, end: 0x112DE, value: 'ALetter'},
    {start: 0x112DF, end: 0x112DF, value: 'Extend'},
    {start: 0x112E0, end: 0x112E2, value: 'Extend'},
    {start: 0x112E3, end: 0x112EA, value: 'Extend'},
    {start: 0x112F0, end: 0x112F9, value: 'Numeric'},
    {start: 0x11300, end: 0x11301, value: 'Extend'},
    {start: 0x11302, end: 0x11303, value: 'Extend'},
    {start: 0x11305, end: 0x1130C, value: 'ALetter'},
    {start: 0x1130F, end: 0x11310, value: 'ALetter'},
    {start: 0x11313, end: 0x11328, value: 'ALetter'},
    {start: 0x1132A, end: 0x11330, value: 'ALetter'},
    {start: 0x11332, end: 0x11333, value: 'ALetter'},
    {start: 0x11335, end: 0x11339, value: 'ALetter'},
    {start: 0x1133B, end: 0x1133C, value: 'Extend'},
    {start: 0x1133D, end: 0x1133D, value: 'ALetter'},
    {start: 0x1133E, end: 0x1133F, value: 'Extend'},
    {start: 0x11340, end: 0x11340, value: 'Extend'},
    {start: 0x11341, end: 0x11344, value: 'Extend'},
    {start: 0x11347, end: 0x11348, value: 'Extend'},
    {start: 0x1134B, end: 0x1134D, value: 'Extend'},
    {start: 0x11350, end: 0x11350, value: 'ALetter'},
    {start: 0x11357, end: 0x11357, value: 'Extend'},
    {start: 0x1135D, end: 0x11361, value: 'ALetter'},
    {start: 0x11362, end: 0x11363, value: 'Extend'},
    {start: 0x11366, end: 0x1136C, value: 'Extend'},
    {start: 0x11370, end: 0x11374, value: 'Extend'},
    {start: 0x11400, end: 0x11434, value: 'ALetter'},
    {start: 0x11435, end: 0x11437, value: 'Extend'},
    {start: 0x11438, end: 0x1143F, value: 'Extend'},
    {start: 0x11440, end: 0x11441, value: 'Extend'},
    {start: 0x11442, end: 0x11444, value: 'Extend'},
    {start: 0x11445, end: 0x11445, value: 'Extend'},
    {start: 0x11446, end: 0x11446, value: 'Extend'},
    {start: 0x11447, end: 0x1144A, value: 'ALetter'},
    {start: 0x11450, end: 0x11459, value: 'Numeric'},
    {start: 0x1145E, end: 0x1145E, value: 'Extend'},
    {start: 0x1145F, end: 0x1145F, value: 'ALetter'},
    {start: 0x11480, end: 0x114AF, value: 'ALetter'},
    {start: 0x114B0, end: 0x114B2, value: 'Extend'},
    {start: 0x114B3, end: 0x114B8, value: 'Extend'},
    {start: 0x114B9, end: 0x114B9, value: 'Extend'},
    {start: 0x114BA, end: 0x114BA, value: 'Extend'},
    {start: 0x114BB, end: 0x114BE, value: 'Extend'},
    {start: 0x114BF, end: 0x114C0, value: 'Extend'},
    {start: 0x114C1, end: 0x114C1, value: 'Extend'},
    {start: 0x114C2, end: 0x114C3, value: 'Extend'},
    {start: 0x114C4, end: 0x114C5, value: 'ALetter'},
    {start: 0x114C7, end: 0x114C7, value: 'ALetter'},
    {start: 0x114D0, end: 0x114D9, value: 'Numeric'},
    {start: 0x11580, end: 0x115AE, value: 'ALetter'},
    {start: 0x115AF, end: 0x115B1, value: 'Extend'},
    {start: 0x115B2, end: 0x115B5, value: 'Extend'},
    {start: 0x115B8, end: 0x115BB, value: 'Extend'},
    {start: 0x115BC, end: 0x115BD, value: 'Extend'},
    {start: 0x115BE, end: 0x115BE, value: 'Extend'},
    {start: 0x115BF, end: 0x115C0, value: 'Extend'},
    {start: 0x115D8, end: 0x115DB, value: 'ALetter'},
    {start: 0x115DC, end: 0x115DD, value: 'Extend'},
    {start: 0x11600, end: 0x1162F, value: 'ALetter'},
    {start: 0x11630, end: 0x11632, value: 'Extend'},
    {start: 0x11633, end: 0x1163A, value: 'Extend'},
    {start: 0x1163B, end: 0x1163C, value: 'Extend'},
    {start: 0x1163D, end: 0x1163D, value: 'Extend'},
    {start: 0x1163E, end: 0x1163E, value: 'Extend'},
    {start: 0x1163F, end: 0x11640, value: 'Extend'},
    {start: 0x11644, end: 0x11644, value: 'ALetter'},
    {start: 0x11650, end: 0x11659, value: 'Numeric'},
    {start: 0x11680, end: 0x116AA, value: 'ALetter'},
    {start: 0x116AB, end: 0x116AB, value: 'Extend'},
    {start: 0x116AC, end: 0x116AC, value: 'Extend'},
    {start: 0x116AD, end: 0x116AD, value: 'Extend'},
    {start: 0x116AE, end: 0x116AF, value: 'Extend'},
    {start: 0x116B0, end: 0x116B5, value: 'Extend'},
    {start: 0x116B6, end: 0x116B6, value: 'Extend'},
    {start: 0x116B7, end: 0x116B7, value: 'Extend'},
    {start: 0x116B8, end: 0x116B8, value: 'ALetter'},
    {start: 0x116C0, end: 0x116C9, value: 'Numeric'},
    {start: 0x1171D, end: 0x1171F, value: 'Extend'},
    {start: 0x11720, end: 0x11721, value: 'Extend'},
    {start: 0x11722, end: 0x11725, value: 'Extend'},
    {start: 0x11726, end: 0x11726, value: 'Extend'},
    {start: 0x11727, end: 0x1172B, value: 'Extend'},
    {start: 0x11730, end: 0x11739, value: 'Numeric'},
    {start: 0x11800, end: 0x1182B, value: 'ALetter'},
    {start: 0x1182C, end: 0x1182E, value: 'Extend'},
    {start: 0x1182F, end: 0x11837, value: 'Extend'},
    {start: 0x11838, end: 0x11838, value: 'Extend'},
    {start: 0x11839, end: 0x1183A, value: 'Extend'},
    {start: 0x118A0, end: 0x118DF, value: 'ALetter'},
    {start: 0x118E0, end: 0x118E9, value: 'Numeric'},
    {start: 0x118FF, end: 0x118FF, value: 'ALetter'},
    {start: 0x119A0, end: 0x119A7, value: 'ALetter'},
    {start: 0x119AA, end: 0x119D0, value: 'ALetter'},
    {start: 0x119D1, end: 0x119D3, value: 'Extend'},
    {start: 0x119D4, end: 0x119D7, value: 'Extend'},
    {start: 0x119DA, end: 0x119DB, value: 'Extend'},
    {start: 0x119DC, end: 0x119DF, value: 'Extend'},
    {start: 0x119E0, end: 0x119E0, value: 'Extend'},
    {start: 0x119E1, end: 0x119E1, value: 'ALetter'},
    {start: 0x119E3, end: 0x119E3, value: 'ALetter'},
    {start: 0x119E4, end: 0x119E4, value: 'Extend'},
    {start: 0x11A00, end: 0x11A00, value: 'ALetter'},
    {start: 0x11A01, end: 0x11A0A, value: 'Extend'},
    {start: 0x11A0B, end: 0x11A32, value: 'ALetter'},
    {start: 0x11A33, end: 0x11A38, value: 'Extend'},
    {start: 0x11A39, end: 0x11A39, value: 'Extend'},
    {start: 0x11A3A, end: 0x11A3A, value: 'ALetter'},
    {start: 0x11A3B, end: 0x11A3E, value: 'Extend'},
    {start: 0x11A47, end: 0x11A47, value: 'Extend'},
    {start: 0x11A50, end: 0x11A50, value: 'ALetter'},
    {start: 0x11A51, end: 0x11A56, value: 'Extend'},
    {start: 0x11A57, end: 0x11A58, value: 'Extend'},
    {start: 0x11A59, end: 0x11A5B, value: 'Extend'},
    {start: 0x11A5C, end: 0x11A89, value: 'ALetter'},
    {start: 0x11A8A, end: 0x11A96, value: 'Extend'},
    {start: 0x11A97, end: 0x11A97, value: 'Extend'},
    {start: 0x11A98, end: 0x11A99, value: 'Extend'},
    {start: 0x11A9D, end: 0x11A9D, value: 'ALetter'},
    {start: 0x11AC0, end: 0x11AF8, value: 'ALetter'},
    {start: 0x11C00, end: 0x11C08, value: 'ALetter'},
    {start: 0x11C0A, end: 0x11C2E, value: 'ALetter'},
    {start: 0x11C2F, end: 0x11C2F, value: 'Extend'},
    {start: 0x11C30, end: 0x11C36, value: 'Extend'},
    {start: 0x11C38, end: 0x11C3D, value: 'Extend'},
    {start: 0x11C3E, end: 0x11C3E, value: 'Extend'},
    {start: 0x11C3F, end: 0x11C3F, value: 'Extend'},
    {start: 0x11C40, end: 0x11C40, value: 'ALetter'},
    {start: 0x11C50, end: 0x11C59, value: 'Numeric'},
    {start: 0x11C72, end: 0x11C8F, value: 'ALetter'},
    {start: 0x11C92, end: 0x11CA7, value: 'Extend'},
    {start: 0x11CA9, end: 0x11CA9, value: 'Extend'},
    {start: 0x11CAA, end: 0x11CB0, value: 'Extend'},
    {start: 0x11CB1, end: 0x11CB1, value: 'Extend'},
    {start: 0x11CB2, end: 0x11CB3, value: 'Extend'},
    {start: 0x11CB4, end: 0x11CB4, value: 'Extend'},
    {start: 0x11CB5, end: 0x11CB6, value: 'Extend'},
    {start: 0x11D00, end: 0x11D06, value: 'ALetter'},
    {start: 0x11D08, end: 0x11D09, value: 'ALetter'},
    {start: 0x11D0B, end: 0x11D30, value: 'ALetter'},
    {start: 0x11D31, end: 0x11D36, value: 'Extend'},
    {start: 0x11D3A, end: 0x11D3A, value: 'Extend'},
    {start: 0x11D3C, end: 0x11D3D, value: 'Extend'},
    {start: 0x11D3F, end: 0x11D45, value: 'Extend'},
    {start: 0x11D46, end: 0x11D46, value: 'ALetter'},
    {start: 0x11D47, end: 0x11D47, value: 'Extend'},
    {start: 0x11D50, end: 0x11D59, value: 'Numeric'},
    {start: 0x11D60, end: 0x11D65, value: 'ALetter'},
    {start: 0x11D67, end: 0x11D68, value: 'ALetter'},
    {start: 0x11D6A, end: 0x11D89, value: 'ALetter'},
    {start: 0x11D8A, end: 0x11D8E, value: 'Extend'},
    {start: 0x11D90, end: 0x11D91, value: 'Extend'},
    {start: 0x11D93, end: 0x11D94, value: 'Extend'},
    {start: 0x11D95, end: 0x11D95, value: 'Extend'},
    {start: 0x11D96, end: 0x11D96, value: 'Extend'},
    {start: 0x11D97, end: 0x11D97, value: 'Extend'},
    {start: 0x11D98, end: 0x11D98, value: 'ALetter'},
    {start: 0x11DA0, end: 0x11DA9, value: 'Numeric'},
    {start: 0x11EE0, end: 0x11EF2, value: 'ALetter'},
    {start: 0x11EF3, end: 0x11EF4, value: 'Extend'},
    {start: 0x11EF5, end: 0x11EF6, value: 'Extend'},
    {start: 0x12000, end: 0x12399, value: 'ALetter'},
    {start: 0x12400, end: 0x1246E, value: 'ALetter'},
    {start: 0x12480, end: 0x12543, value: 'ALetter'},
    {start: 0x13000, end: 0x1342E, value: 'ALetter'},
    {start: 0x13430, end: 0x13438, value: 'Format'},
    {start: 0x14400, end: 0x14646, value: 'ALetter'},
    {start: 0x16800, end: 0x16A38, value: 'ALetter'},
    {start: 0x16A40, end: 0x16A5E, value: 'ALetter'},
    {start: 0x16A60, end: 0x16A69, value: 'Numeric'},
    {start: 0x16AD0, end: 0x16AED, value: 'ALetter'},
    {start: 0x16AF0, end: 0x16AF4, value: 'Extend'},
    {start: 0x16B00, end: 0x16B2F, value: 'ALetter'},
    {start: 0x16B30, end: 0x16B36, value: 'Extend'},
    {start: 0x16B40, end: 0x16B43, value: 'ALetter'},
    {start: 0x16B50, end: 0x16B59, value: 'Numeric'},
    {start: 0x16B63, end: 0x16B77, value: 'ALetter'},
    {start: 0x16B7D, end: 0x16B8F, value: 'ALetter'},
    {start: 0x16E40, end: 0x16E7F, value: 'ALetter'},
    {start: 0x16F00, end: 0x16F4A, value: 'ALetter'},
    {start: 0x16F4F, end: 0x16F4F, value: 'Extend'},
    {start: 0x16F50, end: 0x16F50, value: 'ALetter'},
    {start: 0x16F51, end: 0x16F87, value: 'Extend'},
    {start: 0x16F8F, end: 0x16F92, value: 'Extend'},
    {start: 0x16F93, end: 0x16F9F, value: 'ALetter'},
    {start: 0x16FE0, end: 0x16FE1, value: 'ALetter'},
    {start: 0x16FE3, end: 0x16FE3, value: 'ALetter'},
    {start: 0x1B000, end: 0x1B000, value: 'Katakana'},
    {start: 0x1B164, end: 0x1B167, value: 'Katakana'},
    {start: 0x1BC00, end: 0x1BC6A, value: 'ALetter'},
    {start: 0x1BC70, end: 0x1BC7C, value: 'ALetter'},
    {start: 0x1BC80, end: 0x1BC88, value: 'ALetter'},
    {start: 0x1BC90, end: 0x1BC99, value: 'ALetter'},
    {start: 0x1BC9D, end: 0x1BC9E, value: 'Extend'},
    {start: 0x1BCA0, end: 0x1BCA3, value: 'Format'},
    {start: 0x1D165, end: 0x1D166, value: 'Extend'},
    {start: 0x1D167, end: 0x1D169, value: 'Extend'},
    {start: 0x1D16D, end: 0x1D172, value: 'Extend'},
    {start: 0x1D173, end: 0x1D17A, value: 'Format'},
    {start: 0x1D17B, end: 0x1D182, value: 'Extend'},
    {start: 0x1D185, end: 0x1D18B, value: 'Extend'},
    {start: 0x1D1AA, end: 0x1D1AD, value: 'Extend'},
    {start: 0x1D242, end: 0x1D244, value: 'Extend'},
    {start: 0x1D400, end: 0x1D454, value: 'ALetter'},
    {start: 0x1D456, end: 0x1D49C, value: 'ALetter'},
    {start: 0x1D49E, end: 0x1D49F, value: 'ALetter'},
    {start: 0x1D4A2, end: 0x1D4A2, value: 'ALetter'},
    {start: 0x1D4A5, end: 0x1D4A6, value: 'ALetter'},
    {start: 0x1D4A9, end: 0x1D4AC, value: 'ALetter'},
    {start: 0x1D4AE, end: 0x1D4B9, value: 'ALetter'},
    {start: 0x1D4BB, end: 0x1D4BB, value: 'ALetter'},
    {start: 0x1D4BD, end: 0x1D4C3, value: 'ALetter'},
    {start: 0x1D4C5, end: 0x1D505, value: 'ALetter'},
    {start: 0x1D507, end: 0x1D50A, value: 'ALetter'},
    {start: 0x1D50D, end: 0x1D514, value: 'ALetter'},
    {start: 0x1D516, end: 0x1D51C, value: 'ALetter'},
    {start: 0x1D51E, end: 0x1D539, value: 'ALetter'},
    {start: 0x1D53B, end: 0x1D53E, value: 'ALetter'},
    {start: 0x1D540, end: 0x1D544, value: 'ALetter'},
    {start: 0x1D546, end: 0x1D546, value: 'ALetter'},
    {start: 0x1D54A, end: 0x1D550, value: 'ALetter'},
    {start: 0x1D552, end: 0x1D6A5, value: 'ALetter'},
    {start: 0x1D6A8, end: 0x1D6C0, value: 'ALetter'},
    {start: 0x1D6C2, end: 0x1D6DA, value: 'ALetter'},
    {start: 0x1D6DC, end: 0x1D6FA, value: 'ALetter'},
    {start: 0x1D6FC, end: 0x1D714, value: 'ALetter'},
    {start: 0x1D716, end: 0x1D734, value: 'ALetter'},
    {start: 0x1D736, end: 0x1D74E, value: 'ALetter'},
    {start: 0x1D750, end: 0x1D76E, value: 'ALetter'},
    {start: 0x1D770, end: 0x1D788, value: 'ALetter'},
    {start: 0x1D78A, end: 0x1D7A8, value: 'ALetter'},
    {start: 0x1D7AA, end: 0x1D7C2, value: 'ALetter'},
    {start: 0x1D7C4, end: 0x1D7CB, value: 'ALetter'},
    {start: 0x1D7CE, end: 0x1D7FF, value: 'Numeric'},
    {start: 0x1DA00, end: 0x1DA36, value: 'Extend'},
    {start: 0x1DA3B, end: 0x1DA6C, value: 'Extend'},
    {start: 0x1DA75, end: 0x1DA75, value: 'Extend'},
    {start: 0x1DA84, end: 0x1DA84, value: 'Extend'},
    {start: 0x1DA9B, end: 0x1DA9F, value: 'Extend'},
    {start: 0x1DAA1, end: 0x1DAAF, value: 'Extend'},
    {start: 0x1E000, end: 0x1E006, value: 'Extend'},
    {start: 0x1E008, end: 0x1E018, value: 'Extend'},
    {start: 0x1E01B, end: 0x1E021, value: 'Extend'},
    {start: 0x1E023, end: 0x1E024, value: 'Extend'},
    {start: 0x1E026, end: 0x1E02A, value: 'Extend'},
    {start: 0x1E100, end: 0x1E12C, value: 'ALetter'},
    {start: 0x1E130, end: 0x1E136, value: 'Extend'},
    {start: 0x1E137, end: 0x1E13D, value: 'ALetter'},
    {start: 0x1E140, end: 0x1E149, value: 'Numeric'},
    {start: 0x1E14E, end: 0x1E14E, value: 'ALetter'},
    {start: 0x1E2C0, end: 0x1E2EB, value: 'ALetter'},
    {start: 0x1E2EC, end: 0x1E2EF, value: 'Extend'},
    {start: 0x1E2F0, end: 0x1E2F9, value: 'Numeric'},
    {start: 0x1E800, end: 0x1E8C4, value: 'ALetter'},
    {start: 0x1E8D0, end: 0x1E8D6, value: 'Extend'},
    {start: 0x1E900, end: 0x1E943, value: 'ALetter'},
    {start: 0x1E944, end: 0x1E94A, value: 'Extend'},
    {start: 0x1E94B, end: 0x1E94B, value: 'ALetter'},
    {start: 0x1E950, end: 0x1E959, value: 'Numeric'},
    {start: 0x1EE00, end: 0x1EE03, value: 'ALetter'},
    {start: 0x1EE05, end: 0x1EE1F, value: 'ALetter'},
    {start: 0x1EE21, end: 0x1EE22, value: 'ALetter'},
    {start: 0x1EE24, end: 0x1EE24, value: 'ALetter'},
    {start: 0x1EE27, end: 0x1EE27, value: 'ALetter'},
    {start: 0x1EE29, end: 0x1EE32, value: 'ALetter'},
    {start: 0x1EE34, end: 0x1EE37, value: 'ALetter'},
    {start: 0x1EE39, end: 0x1EE39, value: 'ALetter'},
    {start: 0x1EE3B, end: 0x1EE3B, value: 'ALetter'},
    {start: 0x1EE42, end: 0x1EE42, value: 'ALetter'},
    {start: 0x1EE47, end: 0x1EE47, value: 'ALetter'},
    {start: 0x1EE49, end: 0x1EE49, value: 'ALetter'},
    {start: 0x1EE4B, end: 0x1EE4B, value: 'ALetter'},
    {start: 0x1EE4D, end: 0x1EE4F, value: 'ALetter'},
    {start: 0x1EE51, end: 0x1EE52, value: 'ALetter'},
    {start: 0x1EE54, end: 0x1EE54, value: 'ALetter'},
    {start: 0x1EE57, end: 0x1EE57, value: 'ALetter'},
    {start: 0x1EE59, end: 0x1EE59, value: 'ALetter'},
    {start: 0x1EE5B, end: 0x1EE5B, value: 'ALetter'},
    {start: 0x1EE5D, end: 0x1EE5D, value: 'ALetter'},
    {start: 0x1EE5F, end: 0x1EE5F, value: 'ALetter'},
    {start: 0x1EE61, end: 0x1EE62, value: 'ALetter'},
    {start: 0x1EE64, end: 0x1EE64, value: 'ALetter'},
    {start: 0x1EE67, end: 0x1EE6A, value: 'ALetter'},
    {start: 0x1EE6C, end: 0x1EE72, value: 'ALetter'},
    {start: 0x1EE74, end: 0x1EE77, value: 'ALetter'},
    {start: 0x1EE79, end: 0x1EE7C, value: 'ALetter'},
    {start: 0x1EE7E, end: 0x1EE7E, value: 'ALetter'},
    {start: 0x1EE80, end: 0x1EE89, value: 'ALetter'},
    {start: 0x1EE8B, end: 0x1EE9B, value: 'ALetter'},
    {start: 0x1EEA1, end: 0x1EEA3, value: 'ALetter'},
    {start: 0x1EEA5, end: 0x1EEA9, value: 'ALetter'},
    {start: 0x1EEAB, end: 0x1EEBB, value: 'ALetter'},
    {start: 0x1F130, end: 0x1F149, value: 'ALetter'},
    {start: 0x1F150, end: 0x1F169, value: 'ALetter'},
    {start: 0x1F170, end: 0x1F189, value: 'ALetter'},
    {start: 0x1F1E6, end: 0x1F1FF, value: 'Regional_Indicator'},
    {start: 0x1F3FB, end: 0x1F3FF, value: 'Extend'},
    {start: 0xE0001, end: 0xE0001, value: 'Format'},
    {start: 0xE0020, end: 0xE007F, value: 'Extend'},
    {start: 0xE0100, end: 0xE01EF, value: 'Extend'},
  ];
}