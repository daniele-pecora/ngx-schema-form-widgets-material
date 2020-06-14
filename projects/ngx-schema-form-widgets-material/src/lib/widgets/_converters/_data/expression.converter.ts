import { Converter, DataTransform } from './data-converter-registry.pipe'
import { FormProperty } from 'ngx-schema-form'
import { JEXLExpressionCompiler } from '../../_service/expression-complier.service'

export class ExpressionTransform implements DataTransform {
    constructor(private expressionCompiler: JEXLExpressionCompiler) {

    }
    transform(value: string, formProperty: FormProperty, converter: ExpressionConverter): string {
        if (converter) {
            const root = formProperty.findRoot()
            const prop = root.searchProperty(converter.path) 
            const p = converter.path ? prop : root
            let context = p.value
            if (converter.name) {
                context = {}
                context[converter.name] = p.value
            }
            let res
            try {
                res = this.expressionCompiler.evaluate(value, context)
            } catch (error) {
                console.warn('The value couldn\'t be parsed as an expression.'
                    + ' If it is a string literal then you must enclose it in single or double quotes.',
                    'We did this for you now.',
                    'Expression:', '"' + value + '"'
                    , error)
                res = `${value}`
            }
            return res
        }
        return value
    }
}

export interface ExpressionConverter extends Converter {
    /**
     * The path of the value to be set as context for the expression parser.
     * <br/>
     * E.g:<br/>
     * If you have an expression <code>cars[0].name + ' - Speed' + cars[0].speed + ' mph'</code><br/>
     * on path <code>form/garage</code><br/>
     * to create a string like <code>Maserati - Speed 177 mph</code>
     */
    path: string
    /**
     * The name of the object to be set in context.<br/>
     * If empty only the object defined in <code>path</code> will be set as context.<br/>
     */
    name: string
}