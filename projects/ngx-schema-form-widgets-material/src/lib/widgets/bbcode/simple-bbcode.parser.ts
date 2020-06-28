export class BBCode {
  /**
   * @param {Object} codes
   */
  constructor(private codes) {
    this.codes = []
    this.setCodes(codes)
  }

  /**
   * parse
   *
   * @param {String} text
   * @returns {String}
   */
  parse(text) {
    return this.codes.reduce((text, code) => text.replace(code.regexp, code.replacement), text)
  }

  /**
   * add bb codes
   *
   * @param {String} regex
   * @param {String} replacement
   * @returns {BBCode}
   */
  add(regex, replacement) {
    this.codes.push({
      regexp: new RegExp(regex, 'igm'),
      replacement: replacement
    })
    return this
  }

  /**
   * set bb codes
   *
   * @param {Object} codes
   * @returns {BBCode}
   */
  setCodes(codes) {
    this.codes = Object.keys(codes).map(function (regex) {
      const replacement = codes[regex]
      return {
        regexp: new RegExp(regex, 'igm'),
        replacement: replacement
      }
    }, this)
    return this
  }

}

var simpleParser = new BBCode({
  // custom
  '\\[hr\\]': '<hr>',
  // default
  '\\[br\\]': '<br>',
  '\\[b( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/b\\]': '<strong$1$2$3>$4</strong>',
  '\\[i( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/i\\]': '<em$1$2$3>$4</em>',
  '\\[u( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/u\\]': '<u$1$2$3>$4</u>',

  // extra codes for jump marks
  '\\[h1a( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/h1a\\]': '<h11$1$2$3><a rel="noopener noreferrer" href="$4" name="$4">$4</a></h1>',
  '\\[h2a( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/h2a\\]': '<h21$1$2$3><a rel="noopener noreferrer" href="$4" name="$4">$4</a></h2>',
  '\\[h3a( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/h3a\\]': '<h31$1$2$3><a rel="noopener noreferrer" href="$4" name="$4">$4</a></h3>',
  '\\[h4a( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/h4a\\]': '<h41$1$2$3><a rel="noopener noreferrer" href="$4" name="$4">$4</a></h4>',
  '\\[h5a( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/h5a\\]': '<h51$1$2$3><a rel="noopener noreferrer" href="$4" name="$4">$4</a></h5>',
  '\\[h6a( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/h6a\\]': '<h61$1$2$3><a rel="noopener noreferrer" href="$4" name="$4">$4</a></h6>',

  '\\[h1( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/h1\\]': '<h1$1$2$3>$4</h1>',
  '\\[h2( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/h2\\]': '<h2$1$2$3>$4</h2>',
  '\\[h3( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/h3\\]': '<h3$1$2$3>$4</h3>',
  '\\[h4( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/h4\\]': '<h4$1$2$3>$4</h4>',
  '\\[h5( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/h5\\]': '<h5$1$2$3>$4</h5>',
  '\\[h6( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/h6\\]': '<h6$1$2$3>$4</h6>',

  '\\[p( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/p\\]': '<p$1$2$3>$4</p>',
  '\\[p\\](.+?)\\[/p\\]': '<p$1$2>$</p>',

  '\\[color=(.+?)( data-.*)?( aria-.*)?\\](.+?)\\[/color\\]': '<span style="color:$1"$2$3>$4</span>',
  '\\[size=([0-9]+)( data-.*)?( aria-.*)?\\](.+?)\\[/size\\]': '<span style="font-size:$1px"$2$3>$4</span>',
  '\\[img( class=.+?)?( data-.*)?( aria-.*)?( width=.+?)?( height=.+?)?\\](.+?)\\[/img\\]': '<img src="$6" $1$2$3$4$5>',
  '\\[img=(.+?)( class=.+?)?( data-.*)?( aria-.*)?( width=.+?)?( height=.+?)?\\]': '<img src="$1" $2$3$4$5$6>',
  '\\[email( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/email\\]': '<a rel="noopener noreferrer" href="mailto:$4" $1$2$3>$3</a>',
  '\\[email=(.+?)( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/email\\]': '<a rel="noopener noreferrer" href="mailto:$1" $2$3$4>$5</a>',
  '\\[url( class=.+?)?( data-.*)?( aria-.*)?\](.+?)\\[/url\\]': '<a href="$4" rel="noopener noreferrer" $1$2$3>$4</a>',
  '\\[url=(.+?)\\|onclick( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/url\\]': '<a rel="noopener noreferrer" onclick="$1"$2$3$4>$5</a>',
  '\\[url=(.+?)\\starget=(.+?)( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/url\\]': '<a rel="noopener noreferrer" href="$1" target="$2"$3$4$5>$6</a>',
  '\\[url=(.+?)( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/url\\]': '<a rel="noopener noreferrer" href="$1"$2$3$4>$5</a>',
  '\\[a=(.+?)( class=.+?)?( data-.*)?( aria-.*)?( target=.+)?\\](.+?)\\[/a\\]': '<a rel="noopener noreferrer" href="$1" name="$6"$2$3$4$5>$1</a>',
  '\\[list( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/list\\]': '<ul$1$2$3>$4</ul>',
  '\\[\\*( class=.+?)?( data-.*)?( aria-.*)?\\](.+?)\\[/\\*\\]': '<li$1$2$3>$4</li>'
})

export default simpleParser
