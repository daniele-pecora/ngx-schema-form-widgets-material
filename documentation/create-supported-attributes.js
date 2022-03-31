#!/usr/bin/env node
/**
 * Create attribute list for BBCODE tags
 */

// MAKE SURE to have 'typescript-require' installed as dev dependency
require('typescript-require')
const install__typescript_require = require('child_process').execSync('npm install typescript-require --save-dev', { stdio: 'inherit' })

// MAKE SURE!!! to use the rules from `var simpleParser = new BBCode({...})`
const simpleParser = require('../projects/ngx-schema-form-widgets-material/src/lib/widgets/bbcode/simple-bbcode.parser.ts').default
let rules = simpleParser.declaredRules
console.log('rules', simpleParser['codes'])
rules = {}
for (const r of simpleParser['codes']) {
    rules[r.regexp.source] = r.replacement
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
        .replace(new RegExp('\\*', 'ig'), '\\*')
}
console.log(table)