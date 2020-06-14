import { Converter, DataTransform } from './data-converter-registry.pipe';
import { FormProperty } from 'ngx-schema-form';
import simpleParser from '../../bbcode/simple-bbcode.parser'
import { DomSanitizer, SafeHtml } from '@angular/platform-browser'
import { SecurityContext } from '@angular/core'

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
            const bbcode = Array.isArray(bbcodeValue) ? bbcodeValue.join('') : bbcodeValue
            return simpleParser.parse(this.sanitizer.sanitize(SecurityContext.HTML,`${bbcode}`))
        }
    }
}

export interface BBCodeMappingConverter extends Converter {

}
