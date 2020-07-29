import { FormProperty } from "ngx-schema-form"
import { Converter, DataTransform } from "./data-converter-registry.pipe"

export class TransformerUtils {

    public transform(transformerRegistry: { [key: string]: DataTransform }, value: any, formProperty: FormProperty, converter: Converter, ...args: any[]): any {
        if (converter) {
            const transformer: DataTransform = transformerRegistry[`${converter.type}`]
            if (transformer) {
                return transformer.transform(value, formProperty, converter, args)
            } else {
                console.warn('No converter registered with id: `${converter.type}` ')
            }
        }
        return value
    }
}