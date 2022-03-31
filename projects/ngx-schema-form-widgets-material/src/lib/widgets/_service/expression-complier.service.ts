export abstract class ExpressionCompiler {
    public abstract evaluate(expression: string, context: object): any
}

import * as JEXL from 'jexl'
import { Injectable } from "@angular/core";

@Injectable()
export class JEXLExpressionCompiler implements ExpressionCompiler {
    evaluate(expression: string, context: object = {}): any {
        const jexl = new JEXL.Jexl()
        jexl['addFunction']('startsWith', (val, char) => val.startsWith(char))
        jexl['addFunction']('indexOf', (val, char) => val.indexOf(char))
        jexl['addFunction']('match', (val, char) => val.match(char))
        jexl['addFunction']('toLowerCase', (val) => val.toLowerCase())
        jexl['addFunction']('trim', (val) => val.trim())
        return jexl.evalSync(expression, context)
    }
}
