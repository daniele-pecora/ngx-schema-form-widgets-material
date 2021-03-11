#!/usr/bin/env node
/**
 * Create attribute list for BBCODE tags
 */

// MAKE SURE!!! to update this attributes from `var simpleParser = new BBCode({...})`
const rules = {
    // custom
    '\\[hr( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\]': '<hr$1$2$3$4>',
    // default
    '\\[br\\]': '<br>',
    '\\[b( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/b\\]': '<strong$1$2$3$4>$5</strong>',
    '\\[i( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/i\\]': '<em$1$2$3$4>$5</em>',
    '\\[u( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/u\\]': '<u$1$2$3$4>$5</u>',
  
    // extra codes for jump marks
    '\\[h1a( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h1a\\]': '<h11$1$2$3$4><a rel="noopener noreferrer" href="$5" name="$5">$5</a></h1>',
    '\\[h2a( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h2a\\]': '<h21$1$2$3$4><a rel="noopener noreferrer" href="$5" name="$5">$5</a></h2>',
    '\\[h3a( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h3a\\]': '<h31$1$2$3$4><a rel="noopener noreferrer" href="$5" name="$5">$5</a></h3>',
    '\\[h4a( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h4a\\]': '<h41$1$2$3$4><a rel="noopener noreferrer" href="$5" name="$5">$5</a></h4>',
    '\\[h5a( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h5a\\]': '<h51$1$2$3$4><a rel="noopener noreferrer" href="$5" name="$5">$5</a></h5>',
    '\\[h6a( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h6a\\]': '<h61$1$2$3$4><a rel="noopener noreferrer" href="$5" name="$5">$5</a></h6>',
  
    '\\[h1( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h1\\]': '<h1$1$2$3$4>$5</h1>',
    '\\[h2( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h2\\]': '<h2$1$2$3$4>$5</h2>',
    '\\[h3( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h3\\]': '<h3$1$2$3$4>$5</h3>',
    '\\[h4( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h4\\]': '<h4$1$2$3$4>$5</h4>',
    '\\[h5( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h5\\]': '<h5$1$2$3$4>$5</h5>',
    '\\[h6( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/h6\\]': '<h6$1$2$3$4>$5</h6>',
  
    '\\[p( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/p\\]': '<p$1$2$3$4>$5</p>',
  
    '\\[color=(.+?)( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/color\\]': '<span style="color:$1"$2$3$4$5>$6</span>',
    '\\[size=([0-9]+)( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/size\\]': '<span style="font-size:$1px"$2$3$4$5>$6</span>',
  
    '\\[img( class=.+?)?( tabindex=.+?)?( alt=.+?)?( title=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*( width=.+?)?( height=.+?)?\\](.+?)\\[/img\\]': '<img src="$9" $1$2$3$4$5$6$7$8>',
    '\\[img=(.+?)( class=.+?)?( tabindex=.+?)?( alt=.+?)?( title=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*( width=.+?)?( height=.+?)?\\]': '<img src="$1" $2$3$4$5$6$7$8$9>',
  
    '\\[email( class=.+?)?( tabindex=.+?)?( target=[\\S]+?)?( title=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/email\\]': '<a rel="noopener noreferrer" href="mailto:$7" $1$2$3$4$5$6>$7</a>',
    '\\[email=(.+?)( class=.+?)?( tabindex=.+?)?( target=[\\S]+?)?( title=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/email\\]': '<a rel="noopener noreferrer" href="mailto:$1" $2$3$4$5$6$7>$8</a>',
  
    '\\[url( class=.+?)?( tabindex=.+?)?( target=[\\S]+?)?( title=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\](.+?)\\[/url\\]': '<a href="$7" rel="noopener noreferrer" $1$2$3$4$5$6>$7</a>',
    '\\[url=(.+?)\\|onclick\\](.+?)\\[/url\\]': '<a rel="noopener noreferrer" href="#" onclick="$1;return false;">$2</a>',
    '\\[url=(.+?)\\|onclick( class=.+?)?( tabindex=.+?)?( target=[\\S]+?)?( title=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/url\\]': '<a rel="noopener noreferrer" href="#" onclick="$1;return false;"$2$3$4$5$6$7>$8</a>',
    '\\[url=([\\S]+?)\\starget=([\\S]+?)( title=.+?)?( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/url\\]': '<a rel="noopener noreferrer" href="$1" target="$2"$3$4$5$6$7>$8</a>',
    '\\[url=([\\S]+?)( class=.+?)?( tabindex=.+?)?( target=[\\S]+?)?( title=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/url\\]': '<a rel="noopener noreferrer" href="$1"$2$3$4$5$6$7>$8</a>',
  
    '\\[a( class=.+?)?( tabindex=.+?)?( target=[\\S]+?)?( title=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\](.+?)\\[/a\\]': '<a href="$7" rel="noopener noreferrer" $1$2$3$4$5$6>$7</a>',
    '\\[a=(.+?)( class=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*( target=[\\S]+?)?( title=.+?)?\\](.+?)\\[/a\\]': '<a rel="noopener noreferrer" href="$1" name="$8"$2$3$4$5$6$7>$8</a>',
  
    '\\[list( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/list\\]': '<ul$1$2$3$4>$5</ul>',
    '\\[\\*( class=.+?)?( tabindex=.+?)?( data-[\\S]+?=??.*?)*( aria-[\\S]+?=??.*?)*\\](.+?)\\[/\\*\\]': '<li$1$2$3$4>$5</li>'
  }


const printAttr = (value) => {
    const name = value.replace(new RegExp('^\\\\\\[([A-Za-z0-9\\\\*]*).*', 'ig'), '$1').replace('\\', '')

    const attrString = value
        .replace(new RegExp('^\\\\\\[([a-z]+)+?(=?\())(.*)', 'ig'), '$4')
        .replace(new RegExp('\([\\S]?([a-z]+)+?\)=[ ]?', 'ig'), '#{$1}#')
        .replace(new RegExp('\([\\S]?([a-z]+)+?-\)[ ]?', 'ig'), '#{$1*}#')
        .replace(new RegExp('#{\\\\s', 'ig'), '#{')
        
    const attr = []
    const all = attrString.split('#{')
    for (const a of all) {
        if (-1 !== a.indexOf('}#')) {
            const n = a.split('}#')[0]
            if (-1 === attr.indexOf(n))
                attr.push(n)
        }
    }
    return {
        name: name,
        attr: attr
    }
}

const all = {}
for (const k of Object.keys(rules)) {
    const el = printAttr(k)
    if (all[el.name]) {
        all[el.name] = all[el.name] || []
        all[el.name] = all[el.name].concat(el.attr.filter((item) => { return -1 == all[el.name].indexOf(item) }))
    } else {
        all[el.name] = el.attr
    }
}

/**
 * Create the markdown table
 */
let table = ''
table += `\n`
table += `BBCODE  | ATTRIBUTES\n`
table += `--------|-------------------------\n`
for (const k of Object.keys(all)) {
    table += `${k}\t| ${all[k].join(', ')}\n`
    .replace(new RegExp('\\*','ig'),'\\*')
}
console.log(table)