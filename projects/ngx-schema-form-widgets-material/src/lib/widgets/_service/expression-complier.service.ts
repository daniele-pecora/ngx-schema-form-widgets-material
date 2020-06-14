export abstract class ExpressionCompiler {
    public abstract evaluate(expression: string, context: object): any
}

import * as JEXL from 'jexl'
import { Injectable } from "@angular/core";

@Injectable()
export class JEXLExpressionCompiler implements ExpressionCompiler {
    evaluate(expression: string, context: object = {}): any {
        return new JEXL.Jexl().evalSync(expression, context)
    }
}