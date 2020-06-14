import { Converter, DataTransform } from './data-converter-registry.pipe';
import { FormProperty } from 'ngx-schema-form';

export class TextMappingTransform implements DataTransform {
    transform(value: string, formProperty: FormProperty, converter: TextMappingConverter): string {
        if (converter) {
            if (!converter.mapping)
                console.warn(`Property 'mapping' not set for ${converter.type} converter`)
            if (converter.mapping[value]) {
                return converter.mapping[value]
            }
        }
        return value
    }
}

export interface TextMappingConverter extends Converter {
    mapping: {
        [key: string]: string
    }
}