import { DataTransform, Converter, ConverterType } from './data-converter-registry.pipe';
import { DateConverterTransform } from './date.converter-transform';
import { SelectionLabelTransform } from './selection-label.converter';
import { TextMappingTransform } from './text-mapping.converter';
import { DomSanitizer } from '@angular/platform-browser';
import { JEXLExpressionCompiler } from '../../_service/expression-complier.service';
import { ChainTransform } from './chain-transformer.converter';
import { BBCodeTransform } from './bbcode.converter';
import { ExpressionTransform } from './expression.converter';
import { Injectable, Inject } from '@angular/core'
import { FormProperty } from 'ngx-schema-form'
import { TransformerUtils } from './transformer.utils'

@Injectable()
export class DataConverterTransformerRegistry {
    transformerUtils: TransformerUtils = new TransformerUtils()

    transformerRegistry: { [key: string]: DataTransform } = {}
    constructor(@Inject(DomSanitizer) sanitizer: DomSanitizer, @Inject(JEXLExpressionCompiler) expressionCompiler: JEXLExpressionCompiler) {
        this.transformerRegistry['dateFormat'] = new DateConverterTransform()
        this.transformerRegistry['selectionLabel'] = new SelectionLabelTransform()
        this.transformerRegistry['textMapping'] = new TextMappingTransform()
        this.transformerRegistry['bbcode'] = new BBCodeTransform(sanitizer)
        this.transformerRegistry['expression'] = new ExpressionTransform(expressionCompiler)
        this.transformerRegistry['chain'] = new ChainTransform(this.transformerRegistry)
    }

    transform(value: any, formProperty: FormProperty, converter: Converter, ...args: any[]): any {
        return this.transformerUtils.transform(this.transformerRegistry, value, formProperty, converter, args)
    }

    public getTransformer(type: string | ConverterType): DataTransform {
        const transformer: DataTransform = this.transformerRegistry[type]
        return transformer
    }

    public findTransformer(type: string | ConverterType, transformer: any): any | Converter {
        if ((transformer.transformers || []).length < 1) {
            if (transformer.type === `${type}`) {
                return transformer
            }
        } else {
            const transformers: [] = transformer['transformers']
            for (const t of transformers) {
                const found = this.findTransformer(type, t)
                if (found) {
                    return found
                }
            }
        }
        return null
    }
}