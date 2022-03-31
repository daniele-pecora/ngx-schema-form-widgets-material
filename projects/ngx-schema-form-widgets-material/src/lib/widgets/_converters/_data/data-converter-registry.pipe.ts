import { Pipe, PipeTransform, Inject } from '@angular/core'
import { FormProperty } from 'ngx-schema-form'
import { DataConverterTransformerRegistry } from './data-converter-transformer.registry'

@Pipe({
    name: 'DataConverter'
})
export class DataConverterRegistryPipe implements PipeTransform {

    constructor(@Inject(DataConverterTransformerRegistry) private transformerRegistry: DataConverterTransformerRegistry) {
    }

    transform(value: any, formProperty: FormProperty, converter: Converter, ...args: any[]): any {
        return this.transformerRegistry.transform(value, formProperty, converter, args)
    }

}

export interface DataTransform extends PipeTransform {
    transform(value: any, formProperty: FormProperty, converter: Converter, ...args: any[]): any;
}

export enum ConverterType {
    dateFormat,
    choiceLabel,
    textMapping,
    chain,
    bbcode,
    expression
}

export interface Converter {
    type: ConverterType
}