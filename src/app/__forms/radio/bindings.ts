import { FormProperty } from "ngx-schema-form";

export const bindings = {
    '/radio':[{
      /** 
       * date format auto complete :
       * when typing the date separator character are added automatically
       */
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