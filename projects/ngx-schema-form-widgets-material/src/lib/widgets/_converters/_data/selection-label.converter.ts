import { Converter, DataTransform } from './data-converter-registry.pipe';
import { FormProperty } from 'ngx-schema-form';
/**
 * Resolves the label to show from the <code>FormProperty</code><br/>
 */
export class SelectionLabelTransform implements DataTransform {
    transform(value: string, formProperty: FormProperty, converter: SelectionLabelConverter): string {
        if (converter) {
            const targetPath = converter.path
            if (!targetPath)
                console.warn(`Property 'path' not set for ${converter.type} converter`)

            const targetProperty: FormProperty = formProperty.searchProperty(targetPath)
            if (!targetProperty)
                console.warn(`Property not found for ${converter.type} converter at path: ${targetPath}`)

            const sthngOf = targetProperty.schema.oneOf || targetProperty.schema.anyOf
            for (const s of sthngOf) {
                if (s.enum && s.enum[0] === value) {
                    return s.description || s.enum[0]
                }
            }
            return value
        }
        return value
    }
}

export interface SelectionLabelConverter extends Converter {
    /**
     * The path to the <code>FormProperty</code> containing
     * <code>oneOf</code>, <code>anyOf</code> whose <code>enum</code> description<br/>
     * will provide the label to show.<br/>
     * e.g.<br/>
     * <code>
        "oneOf": [
            {
              "enum": [
                "a"
              ],
              "description": "A"
            }
        ]
     * </code>
     */
    path: string
}