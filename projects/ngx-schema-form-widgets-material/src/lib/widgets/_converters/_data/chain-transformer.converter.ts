import { Converter, DataTransform, DataConverterRegistryPipe } from './data-converter-registry.pipe'
import { FormProperty } from 'ngx-schema-form'
import { TransformerUtils } from './transformer.utils'

/**
 * Processes multiple transformers.<br/>
 * The result will be passed as value for the next transformer in chain.<br/>
 */
export class ChainTransform implements DataTransform {
    transformerUtils: TransformerUtils = new TransformerUtils()

    constructor(private transformerRegistry: { [key: string]: DataTransform }) {
    }

    transform(value: string, formProperty: FormProperty, converter: SequenceConverter, ...args: any[]): string {
        if (converter) {
            if (!converter.transformers)
                console.warn(`Property 'transformers' not set for ${converter.type} converter`)

            const converters = Array.isArray(converter.transformers) ? converter.transformers : [converter.transformers]
            if (!converters.length)
                console.warn(`Property 'transformers' is empty for ${converter.type} converter`)

            let itValue = value
            for (const currentConverter of converters) {
                itValue = this.transformerUtils.transform(this.transformerRegistry, itValue, formProperty, currentConverter, args)
            }
            return itValue
        }
        return value
    }
}

export interface SequenceConverter extends Converter {
    transformers: Converter | Converter[]
}