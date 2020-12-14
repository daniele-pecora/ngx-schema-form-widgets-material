import { FormProperty } from "ngx-schema-form";
import { Actions } from "ngx-schema-form-view";

export const actions: Actions = {
    'switch_inline_style': (formProperty?: FormProperty, parameters?: any) => {
        /**
         * Switch style from 'block' to 'inline'
         */
        const models = [
            formProperty.root.findProperties(formProperty.root, '/models__DE_1954_1970')[0],
            formProperty.root.findProperties(formProperty.root, '/models__DE_1970_1999')[0]
        ]
        models.forEach((item)=>{
            item.schema.widget.inline = !(!!item.schema.widget.inline)
        })
        console.log('models:',models)
    }
}
