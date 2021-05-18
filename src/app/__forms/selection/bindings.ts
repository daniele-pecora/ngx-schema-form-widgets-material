import { FormProperty } from "ngx-schema-form";

export const bindings = {
    '/select_async': [{

    }],
    '/select': [{
        'click': function (event: any, formProperty?: FormProperty) {
            console.log('on click select_button::: ', event, formProperty)
        }
    }],
    '/select_button_readonly': [{
        'click': function (event: any, formProperty?: FormProperty) {
            console.log('on click select_button::: ', event, formProperty)
        }
    }]
}