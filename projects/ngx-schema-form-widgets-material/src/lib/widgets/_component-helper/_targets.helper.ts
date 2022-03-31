import { Injectable } from "@angular/core"
import { FormProperty } from "ngx-schema-form"
import { ExpressionCompiler } from "../_service/expression-complier.service"

@Injectable()
export class TargetsHelper {
    schema
    constructor(private formProperty: FormProperty, private expressionCompiler: ExpressionCompiler) {
        this.schema = this.formProperty.schema
    }

    setTargetValues(resultItem: any) {
        const targets = (this.schema.widget || {})['targets']
        if ((targets || []).length) {
            for (const target of targets) {
                const targetKeys = Array.isArray(target.key) ? target.key : [target.key]
                for (const targetKey of targetKeys) {
                    const destinationTarget = target.destination
                    const valueSet = this.setTargetVal(resultItem, destinationTarget, targetKey)
                    if (valueSet !== undefined && valueSet !== null) {
                        break
                    }
                }
            }
        }
    }

    private setTargetVal(resultItem: any, targetPath: string, destProperty: string): any | void {
        const targetPaths = Array.isArray(targetPath) ? targetPath : [targetPath]
        for (const _targetPath of targetPaths) {
            const target = this.formProperty.findRoot().getProperty(_targetPath) as FormProperty
            if (target) {
                let value
                try {
                    value = this.expressionCompiler.evaluate(destProperty, resultItem)
                } catch (error) {
                    console.error(
                        'Failed to process expression from targetPath:', _targetPath,
                        ' for destProperty:', destProperty,
                        ' from resultItem:', resultItem,
                        ' ERROR:', error)
                }
                target.setValue(value, false)
                if (value !== undefined && value !== null) {
                    return value
                }
            }
        }
    }
}