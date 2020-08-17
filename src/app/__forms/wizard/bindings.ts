import { FormProperty, PropertyGroup } from 'ngx-schema-form';


export const bindings = {
  '/property-0/*/item-prop1': [{
    'input': function (event: any, formProperty?: FormProperty) {
      const el = formProperty.parent;
      /**
       * update tab title
       */
      el.schema.title = '' + el['properties']['item-prop1'].value + ' ' + el['properties']['item-prop2'].value
      console.log('/property-0/*/item-prop1', el.schema.titleOverride)
    }
  }],
  '/property-0/*/item-prop2': [{
    'input': function (event: any, formProperty?: FormProperty) {
      const el = formProperty.parent;
      /**
       * update tab title
       */
      el.schema.title = '' + el['properties']['item-prop1'].value + ' ' + el['properties']['item-prop2'].value
      console.log('/property-0/*/item-prop2', el.schema.titleOverride)
    }
  }]
};
