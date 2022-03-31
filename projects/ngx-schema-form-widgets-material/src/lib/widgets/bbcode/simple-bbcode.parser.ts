
/** BBCODE parser from */
export class BBCode {
  /**
   * @param {Object} codes
   * @param {Object} convert_codes
   */
  constructor(private codes, private convert_codes) {
    this.codes = []
    this.convert_codes = []
    //this.setCodes(codes)
    this.codes = this.codesToRegexModel(codes)
    this.convert_codes = this.codesToRegexModel(convert_codes)
  }

  /**
   * parse bbcode to html
   *
   * @param {String} bbcode text
   * @returns {String}
   */
  parse(text: string) {
    return this.codes.reduce((text, code) => text.replace(code.regexp, code.replacement), text)
  }

  /**
   * convert html to bbcode
   * @param {String} content html text
   * @returns {String}
   */
  convert(text: string) {
    return this.convert_codes.reduce((text, code) => text.replace(code.regexp, code.replacement), text)
  }

  private codesToRegexModel(codes) {
    return Object.keys(codes).map(function (regex) {
      const replacement = codes[regex]
      return {
        regexp: new RegExp(regex, 'igm'),
        replacement: replacement
      }
    }, this)
  }

  /**
   * add bb codes
   *
   * @param {String} regex
   * @param {String} replacement
   * @returns {BBCode}
   *
  add(regex, replacement) {
    this.codes.push({
      regexp: new RegExp(regex, 'igm'),
      replacement: replacement
    })
    return this
  }
  */

  /**
   * set bb codes
   *
   * @param {Object} codes
   * @returns {BBCode}
   *
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
  */
}


const parse_codes = {
  // hr
  '\\[hr( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]': '<hr$1$2$3$4$5>',

  // default
  '\\[br\\]': '<br>',
  '\\[b( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/b\\]': '<strong$1$2$3$4$5>$6</strong>',
  '\\[i( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/i\\]': '<em$1$2$3$4$5>$6</em>',
  '\\[em( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/em\\]': '<em$1$2$3$4$5>$6</em>',
  '\\[u( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/u\\]': '<u$1$2$3$4$5>$6</u>',

  // jump marks
  '\\[h1a( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/h1a\\]': '<h1$1$2$3$4$5><a rel="noopener noreferrer" href="" name="$6">$6</a></h1>',
  '\\[h2a( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/h2a\\]': '<h2$1$2$3$4$5><a rel="noopener noreferrer" href="" name="$6">$6</a></h2>',
  '\\[h3a( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/h3a\\]': '<h3$1$2$3$4$5><a rel="noopener noreferrer" href="" name="$6">$6</a></h3>',
  '\\[h4a( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/h4a\\]': '<h4$1$2$3$4$5><a rel="noopener noreferrer" href="" name="$6">$6</a></h4>',
  '\\[h5a( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/h5a\\]': '<h5$1$2$3$4$5><a rel="noopener noreferrer" href="" name="$6">$6</a></h5>',
  '\\[h6a( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/h6a\\]': '<h6$1$2$3$4$5><a rel="noopener noreferrer" href="" name="$6">$6</a></h6>',

  // header
  '\\[h1( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/h1\\]': '<h1$1$2$3$4$5>$6</h1>',
  '\\[h2( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/h2\\]': '<h2$1$2$3$4$5>$6</h2>',
  '\\[h3( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/h3\\]': '<h3$1$2$3$4$5>$6</h3>',
  '\\[h4( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/h4\\]': '<h4$1$2$3$4$5>$6</h4>',
  '\\[h5( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/h5\\]': '<h5$1$2$3$4$5>$6</h5>',
  '\\[h6( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/h6\\]': '<h6$1$2$3$4$5>$6</h6>',

  // paragrah
  '\\[p( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/p\\]': '<p$1$2$3$4$5>$6</p>',

  // span with color
  '\\[color=["\']?([\\s\\S]+?)["\']?( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/color\\]': '<span style="color:$1"$2$3$4$5$6>$7</span>',
  // span with font-size
  '\\[size=["\']?([0-9]+)["\']?( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/size\\]': '<span style="font-size:$1px"$2$3$4$5$6>$7</span>',

  // img
  '\\[img( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( alt=[\\s\\S]+?)?( title=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*( width=[\\s\\S]+?)?( height=[\\s\\S]+?)?\\]([\\s\\S]+?)\\[/img\\]': '<img src="$10"$1$2$3$4$5$6$7$8$9>',
  '\\[img=([\\s\\S]+?)( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( alt=[\\s\\S]+?)?( title=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*( width=[\\s\\S]+?)?( height=[\\s\\S]+?)?\\]': '<img src="$1"$2$3$4$5$6$7$8$9$10>',

  // email
  '\\[email( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( target=[\\S]+?)?( title=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/email\\]': '<a rel="noopener noreferrer" href="mailto:$8"$1$2$3$4$5$6$7>$8</a>',
  '\\[email=["\']?([\\s\\S]+?)["\']?( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( target=[\\S]+?)?( title=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/email\\]': '<a rel="noopener noreferrer" href="mailto:$1"$2$3$4$5$6$7$8>$9</a>',

  // link
  '\\[url( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( target=[\\S]+?)?( title=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/url\\]': '<a rel="noopener noreferrer" href=$8 $1$2$3$4$5$6$7>$8</a>',
  '\\[a( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( target=[\\s\\S]+?)?( title=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\]([\\s\\S]+?)\\[/a\\]': '<a rel="noopener noreferrer" href="$8" $1$2$3$4$5$6$7>$8</a>',
  '\\[url=["\']?([\\s\\S]+?)["\']?\\|onclick\\]([\\s\\S]+?)\\[/url\\]': '<a rel="noopener noreferrer" href="#" onclick="$1;return false;">$2</a>',
  '\\[url=["\']?([\\s\\S]+?)["\']?\\|onclick( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( target=[\\S]+?)?( title=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/url\\]': '<a rel="noopener noreferrer" href="#" onclick="$1;return false;"$2$3$4$5$6$7$8>$9',
  '\\[url=["\']?([\\s\\S]+?)["\']?( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( target=[\\s\\S]+?)?( title=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/url\\]': '<a rel="noopener noreferrer" href="$1"$2$3$4$5$6$7$8>$9</a>',
  '\\[a=["\']?([\\s\\S]+?)["\']?( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( target=[\\S]+?)?( title=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/a\\]': '<a rel="noopener noreferrer" href="#$1" name="$1"$2$3$4$5$6$7$8>$9</a>',

  // list / listitem
  '\\[list( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\][,]?([\\s\\S]+?)[,]?\\[/list\\]': '<ul$1$2$3$4$5>$6</ul>',
  '\\[\\*( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]([\\s\\S]+?)\\[/\\*\\][\\s]?[,]?[\\s]?': '<li$1$2$3$4$5>$6</li>'
}
const convert_codes = {
  // hr
  '\\<hr( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>': '[hr$1$2$3$4$5]',
  // default
  '\\<br\\>': '[br]',
  '\\<strong( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</strong\\>': '[b$1$2$3$4$5]$6[/b]',
  '\\<b( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</b\\>': '[b$1$2$3$4$5]$6[/b]',
  '\\<em( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</em\\>': '[i$1$2$3$4$5]$6[/i]',
  '\\<i( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</i\\>': '[i$1$2$3$4$5]$6[/i]',
  '\\<u( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</u\\>': '[u$1$2$3$4$5]$6[/u]',

  // jump marks
  '\\<h1( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>(\\s+?)?\\<a rel="noopener noreferrer"( href="")? name="([\\s\\S]+?)"\\>([\\s\\S]+?)(\\s+?)?\\</a\\>\\</h1\\>': '[h1a$1$2$3$4$5]$8[/h1a]',
  '\\<h2( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>(\\s+?)?\\<a rel="noopener noreferrer"( href="")? name="([\\s\\S]+?)"\\>([\\s\\S]+?)(\\s+?)?\\</a\\>\\</h2\\>': '[h2a$1$2$3$4$5]$8[/h2a]',
  '\\<h3( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>(\\s+?)?\\<a rel="noopener noreferrer"( href="")? name="([\\s\\S]+?)"\\>([\\s\\S]+?)(\\s+?)?\\</a\\>\\</h3\\>': '[h3a$1$2$3$4$5]$8[/h3a]',
  '\\<h4( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>(\\s+?)?\\<a rel="noopener noreferrer"( href="")? name="([\\s\\S]+?)"\\>([\\s\\S]+?)(\\s+?)?\\</a\\>\\</h4\\>': '[h4a$1$2$3$4$5]$8[/h4a]',
  '\\<h5( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>(\\s+?)?\\<a rel="noopener noreferrer"( href="")? name="([\\s\\S]+?)"\\>([\\s\\S]+?)(\\s+?)?\\</a\\>\\</h5\\>': '[h5a$1$2$3$4$5]$8[/h5a]',
  '\\<h6( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>(\\s+?)?\\<a rel="noopener noreferrer"( href="")? name="([\\s\\S]+?)"\\>([\\s\\S]+?)(\\s+?)?\\</a\\>\\</h6\\>': '[h6a$1$2$3$4$5]$8[/h6a]',

  // header
  '\\<h1( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</h1\\>': '[h1$1$2$3$4$5]$6[/h1]',
  '\\<h2( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</h2\\>': '[h2$1$2$3$4$5]$6[/h2]',
  '\\<h3( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</h3\\>': '[h3$1$2$3$4$5]$6[/h3]',
  '\\<h4( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</h4\\>': '[h4$1$2$3$4$5]$6[/h4]',
  '\\<h5( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</h5\\>': '[h5$1$2$3$4$5]$6[/h5]',
  '\\<h6( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</h6\\>': '[h6$1$2$3$4$5]$6[/h6]',

  // p
  '\\<p( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</p\\>': '[p$1$2$3$4$5]$6[/p]',

  // span
  '\\<span style="color:[\\s]?([\\s\\S]+?)[\\;]?"( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</span\\>': '[color=$1$4$5$6]$7[/color]',
  '\\<span style="font-size:[\\s]?([0-9]+)px[\\;]?"( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</span\\>': '[size=$1$4$5$6]$7[/size]',

  // image
  '\\<img( src=["\']?([\\s\\S]+?)["\']?)?( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( alt=[\\s\\S]+?)?( title=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*(( width=)["\']?([\\s\\S]+?)["\']?)?(( height=)["\']?([\\s\\S]+?)["\']?)?(\\s)*(/)?\\>': '[img=$2$3$4$5$6$7$8$9$11$12$14$15]',


  // email
  '\\<a href=["\']?mailto\\:([\\s\\S]+?)["\']?( rel=["\']?noopener noreferrer["\']?)?( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( target=[\\s\\S]+?)?( title=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>\\1\\</a\\>': '[email$3$4$5$6$7$8$9]$1[/email]',
  '\\<a href=["\']?mailto\\:([\\s\\S]+?)["\']?( rel=["\']?noopener noreferrer["\']?)?( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( target=[\\s\\S]+?)?( title=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</a\\>': '[email=$1$3$4$5$6$7$8$9]$10[/email]',

  // link
  '\\<a href=["\']?([\\s\\S]+?)["\']?( rel=[\\s\\S]+?)?( rel=["\']?noopener noreferrer["\']?)?( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( target=[\\S]+?)?( title=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>\\1\\</a\\>': '[url$3$4$5$6$7$8$9$10]$1[/url]',
  '\\<a href=["\']?#([\\s\\S]+?)["\']?( rel=["\']?noopener noreferrer["\']?)?( name=["\']?\\1["\']?)?( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( target=[\\s\\S]+?)?( title=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</a\\>': '[a=$1$4$5$6$7$8$9$10]$11[/a]',
  '\\<a( href="#")?( rel=["\']?noopener noreferrer["\']?)? onclick=["\']?(([\\s\\S]+?)(\\;return false\\;)?["\']?)?( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( target=[\\S]+?)?( title=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</a\\>': '[url=$3|onclick$5$6$7$8$9$10$11]$12[/url]',
  '\\<a href=["\']?([\\s\\S]+?)["\']?( rel=["\']?noopener noreferrer["\']?)?( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( target=[\\s\\S]+?)?( title=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</a\\>': '[url=$1$3$4$5$6$7$8]$10[/url]',

  // list / listitem
  '\\<ul( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</ul\\>': '[list$1$2$3$4$5]$6[/list]',
  '\\<li( class=[\\s\\S]+?)?( role=[\\s\\S]+?)?( tabindex=[\\s\\S]+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\>([\\s\\S]+?)\\</li\\>': '[*$1$2$3$4$5]$6[/*]',
}
export const simpleParser = new BBCode(parse_codes, convert_codes)

export default simpleParser
