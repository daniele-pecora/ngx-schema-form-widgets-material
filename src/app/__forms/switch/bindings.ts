import { FormProperty } from "ngx-schema-form";

export const bindings = {
  '/switch': [{
    'change': function (event: any, formProperty?: FormProperty) {
      console.log('### change event target value: ', event, formProperty)
    },
    'click': function (event: any, formProperty?: FormProperty) {
      console.log('### click event target value: ', event, formProperty)

    },
    'input': function (event: any, formProperty?: FormProperty) {
      console.log('### input event target value: ', event, formProperty)
    }
  }]
}