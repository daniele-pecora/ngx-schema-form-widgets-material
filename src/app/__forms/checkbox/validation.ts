import { FormProperty } from 'ngx-schema-form'
import { Validators } from 'ngx-schema-form-view'
import { PropertyGroup } from 'ngx-schema-form/lib/model'

export const validations: Validators = {
    /**/
    '/_models__DE_1954_1970': (value: any, formProperty?: FormProperty, form?: PropertyGroup) => {
        if (form['-___bootstrap'])
            form['___bootstrap'].___updateTitlesAll()
        console.log('models__DE_1954_1970.schema', formProperty.schema)
    },
    '/_models__DE_1970_1999': (value: any, formProperty?: FormProperty, form?: PropertyGroup) => {
        if (form['-___bootstrap'])
            form['___bootstrap'].___updateTitlesAll()
        console.log('models__DE_1970_1999.schema', formProperty.schema)
    },

    '/_': (value: any, formProperty?: FormProperty, form?: PropertyGroup) => {
        /**
         * bootstrap
         */
        if (!formProperty['___bootstrap']) {
            /**
             * init functions
             */
            const ___bootstrap = {
                ___models: {
                    // absolute fantasy year here
                    models__DE_1954_1970: {
                        title: [
                            'X', 'Y', 'Z'
                        ]
                    },
                    models__DE_1970_1999: {
                        title: [
                            'A', 'B', 'C', 'D'
                        ]
                    }
                },
                ___updateTitles: (name: string) => {
                    console.log('__name', name)
                    const p: PropertyGroup = formProperty.searchProperty(`/${name}`) as PropertyGroup
                    const properties: FormProperty[] = (p && p.properties) as FormProperty[]
                    if (properties) {
                        for (let i = 0; i < properties.length; i++) {
                            console.log(`formProperty['___bootstrap'].___models[name].title`, formProperty['___bootstrap'].___models[name].title, i)
                            // must copy schema becaus every child uses the schema of the array.items definition
                            properties[i]['schemat'] = Object.assign({}, properties[i].schema)
                            console.log('properties[i].schema',properties[i].schema)
                            properties[i].schema.title = formProperty['___bootstrap'].___models[name].title[i]
                            console.log(`properties[i].schema`, properties[i].schema, i)
                        }
                        // p.updateValueAndValidity()
                    }
                },
                ___updateTitlesAll: () => {
                    const ___bootstrap = formProperty['___bootstrap']
                    Object.keys(___bootstrap.___models)
                        .forEach((item, index, all) => {
                            ___bootstrap.___updateTitles(item)
                        })
                }
            }
            formProperty['___bootstrap'] = ___bootstrap

            ___bootstrap.___updateTitlesAll()
        }
    }
}