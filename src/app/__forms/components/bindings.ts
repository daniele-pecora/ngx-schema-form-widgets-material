import { FormProperty } from "ngx-schema-form";

export const bindings = {
  '/bindings/selectA': [{
    'change': function (event: any, formProperty?: FormProperty) {

      const value = formProperty.value

      const targetFormProperty = formProperty.findRoot().searchProperty('/bindings/selectB')

      /**
       * backup the initial source for the select options, 
       * so it can be restored any time
       */
      targetFormProperty['__initialOneOf'] = targetFormProperty['__initialOneOf'] || targetFormProperty.schema.oneOf || []

      /**
       * create a new source for the select options
       */
      const newOneOf = targetFormProperty['__initialOneOf'].filter((item) => {
        return value === 'all' || value === item.enum[0].split(' - ')[0]
      })

      /**
       * set not results option if necessary
       */
      if (newOneOf.length === 0) {
        newOneOf.push({ description: 'No results', enum: ['0'] })
      }

      /**
       * use the new options
       */
      targetFormProperty.schema.oneOf = newOneOf
    }
  }],
  '/overlays/dialogs/dialogTriggerInput/testOnClick': [{
    'click': (event?: any, formProperty?: FormProperty | any) => {
      const dialog: FormProperty = formProperty.searchProperty('/overlays/dialogs/myDialogClick')
      dialog.schema.widget.show = true
    }
  }],
  '/simpleTypes/select_button': [{
    'click': function (event: any, formProperty?: FormProperty) {
      console.log('on click select_button::: ', event, formProperty)
    }
  }],
  '/array/complex/*/property-1': [{
    'input': function (event: any, formProperty?: FormProperty) {
      const el = formProperty.parent;
      /**
       * update tab title
       */
      el.schema.title = '' + el['properties']['property-1'].value + ' ' + el['properties']['property-3'].value;
    }
  }],
  '/array/complex/*/property-3': [{
    'input': function (event: any, formProperty?: FormProperty) {
      const el = formProperty.parent;
      /**
       * update tab title
       */
      el.schema.title = '' + el['properties']['property-1'].value + ' ' + el['properties']['property-3'].value;
    }
  }]
}