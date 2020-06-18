import { Converter, DataTransform } from './data-converter-registry.pipe';
import { FormProperty } from 'ngx-schema-form';
import simpleParser from '../../../widgets/bbcode/simple-bbcode.parser'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { SecurityContext } from '@angular/core'

export const escapeHTMLInBBCode = (bbcodeValue: string | string[]): string => {
    return (Array.isArray(bbcodeValue) ? bbcodeValue.join('') : bbcodeValue)
        .replace(new RegExp('<', 'gi'), '&lt;')
        .replace(new RegExp('>', 'gi'), '&gt;')
}

export class BBCodeTransform implements DataTransform {
    constructor(protected sanitizer: DomSanitizer) { }

    transform(value: string, formProperty: FormProperty, converter: BBCodeMappingConverter): SafeHtml {
        if (converter) {
            return this.getSaveContent(value)
        }
        return value
    }

    getSaveContent(bbcodeValue: string): SafeHtml {
        if (bbcodeValue) {
            const bbcode = escapeHTMLInBBCode(bbcodeValue)
            return simpleParser.parse(this.sanitizer.sanitize(SecurityContext.HTML, `${bbcode}`))
        }
    }
}

export interface BBCodeMappingConverter extends Converter {

}
