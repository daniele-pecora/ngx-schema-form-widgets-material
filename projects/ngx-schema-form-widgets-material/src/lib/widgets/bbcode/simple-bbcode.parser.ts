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
  '\\[hr( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]': '<hr$1$2$3>',
  // default
  '\\[br\\]': '<br>',
  '\\[b( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/b\\]': '<strong$1$2$3>$4</strong>',
  '\\[i( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/i\\]': '<em$1$2$3>$4</em>',
  '\\[u( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/u\\]': '<u$1$2$3>$4</u>',

  // extra codes for jump marks
  '\\[h1a( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h1a\\]': '<h11$1$2$3><a rel="noopener noreferrer" href="$4" name="$4">$4</a></h1>',
  '\\[h2a( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h2a\\]': '<h21$1$2$3><a rel="noopener noreferrer" href="$4" name="$4">$4</a></h2>',
  '\\[h3a( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h3a\\]': '<h31$1$2$3><a rel="noopener noreferrer" href="$4" name="$4">$4</a></h3>',
  '\\[h4a( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h4a\\]': '<h41$1$2$3><a rel="noopener noreferrer" href="$4" name="$4">$4</a></h4>',
  '\\[h5a( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h5a\\]': '<h51$1$2$3><a rel="noopener noreferrer" href="$4" name="$4">$4</a></h5>',
  '\\[h6a( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h6a\\]': '<h61$1$2$3><a rel="noopener noreferrer" href="$4" name="$4">$4</a></h6>',

  '\\[h1( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h1\\]': '<h1$1$2$3>$4</h1>',
  '\\[h2( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h2\\]': '<h2$1$2$3>$4</h2>',
  '\\[h3( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h3\\]': '<h3$1$2$3>$4</h3>',
  '\\[h4( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h4\\]': '<h4$1$2$3>$4</h4>',
  '\\[h5( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h5\\]': '<h5$1$2$3>$4</h5>',
  '\\[h6( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h6\\]': '<h6$1$2$3>$4</h6>',

  '\\[p( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/p\\]': '<p$1$2$3>$4</p>',
  '\\[p\\](.+?)\\[/p\\]': '<p$1$2>$</p>',

  '\\[color=(.+?)( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/color\\]': '<span style="color:$1"$2$3>$4</span>',
  '\\[size=([0-9]+)( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/size\\]': '<span style="font-size:$1px"$2$3>$4</span>',

  '\\[img( class=.+?)?( alt=.+?)?( title=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*( width=.+?)?( height=.+?)?\\](.+?)\\[/img\\]': '<img src="$8" $1$2$3$4$5$6$7>',
  '\\[img=(.+?)( class=.+?)?( alt=.+?)?( title=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*( width=.+?)?( height=.+?)?\\]': '<img src="$1" $2$3$4$5$6$7$8>',

  '\\[email( class=.+?)?( target=[\\S]+?)?( title=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/email\\]': '<a rel="noopener noreferrer" href="mailto:$6" $1$2$3$4$5>$6</a>',
  '\\[email=(.+?)( class=.+?)?( target=[\\S]+?)?( title=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/email\\]': '<a rel="noopener noreferrer" href="mailto:$1" $2$3$4$5$6>$7</a>',

  '\\[url( class=.+?)?( target=[\\S]+?)?( title=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\](.+?)\\[/url\\]': '<a href="$6" rel="noopener noreferrer" $1$2$3$4$5>$6</a>',
  '\\[url=(.+?)\\|onclick\\](.+?)\\[/url\\]': '<a rel="noopener noreferrer" href="#" onclick="$1;return false;">$2</a>',
  '\\[url=(.+?)\\|onclick( class=.+?)?( target=[\\S]+?)?( title=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/url\\]': '<a rel="noopener noreferrer" href="#" onclick="$1;return false;"$2$3$4$5$6>$7</a>',
  '\\[url=([\\S]+?)\\starget=([\\S]+?)( title=.+?)?( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/url\\]': '<a rel="noopener noreferrer" href="$1" target="$2"$3$4$5$6>$7</a>',
  '\\[url=([\\S]+?)( class=.+?)?( target=[\\S]+?)?( title=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/url\\]': '<a rel="noopener noreferrer" href="$1"$2$3$4$5$6>$7</a>',

  '\\[a( class=.+?)?( target=[\\S]+?)?( title=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\](.+?)\\[/a\\]': '<a href="$6" rel="noopener noreferrer" $1$2$3$4$5>$6</a>',
  '\\[a=(.+?)( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*( target=[\\S]+?)?( title=.+?)?\\](.+?)\\[/a\\]': '<a rel="noopener noreferrer" href="$1" name="$7"$2$3$4$5$6>$7</a>',

  '\\[list( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/list\\]': '<ul$1$2$3>$4</ul>',
  '\\[\\*( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/\\*\\]': '<li$1$2$3>$4</li>'
})

export default simpleParser
