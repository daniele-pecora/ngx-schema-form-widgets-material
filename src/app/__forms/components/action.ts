import { FormProperty } from 'ngx-schema-form'

export const actions = {
  'action_toggle_helper_text': (formProperty: FormProperty, parameters: any) => {
    const fields = [
      'autofill',
      'autocomplete',
      'textarea',
      'week',
      'url',
      'time',
      'text',
      'input-mask',
      'tel',
      'search',
      'range',
      'password',
      'number',
      'month',
      'email',
      'datetime-local',
      'date',
      'date-picker',
      'date-native',
      'switch',
      'select',
      'select_async_targets',
      'select_button'
    ];

    for (const field of fields) {
      const path = formProperty.path + '/' + field;
      const prop: FormProperty = formProperty.searchProperty(path);
      if (prop.schema.description) {
        prop.schema.back_up_description = `${prop.schema.description}`
        delete prop.schema.description
      } else if (prop.schema.back_up_description) {
        prop.schema.description = `${prop.schema.back_up_description}`
        delete prop.schema.back_up_description
      }
      prop.schema.widget.filled = prop.schema.widget.filled ? false : true
    }
  },
  'action_toggle_helper_text_no_space': (formProperty: FormProperty, parameters: any) => {
    const fields = [
      'autofill',
      'autocomplete',
      'textarea',
      'week',
      'url',
      'time',
      'text',
      'input-mask',
      'tel',
      'search',
      'range',
      'password',
      'number',
      'month',
      'email',
      'datetime-local',
      'date',
      'date-picker',
      'date-native',
      'switch',
      'select',
      'select_async_targets',
      'select_button'
    ];

    for (const field of fields) {
      const path = formProperty.path + '/' + field;
      const prop: FormProperty = formProperty.searchProperty(path);
      if (prop.schema.description) {
        prop.schema.back_up_description = `${prop.schema.description}`
        delete prop.schema.description
        prop.schema.description = ' '
      } else if (prop.schema.back_up_description) {
        prop.schema.description = `${prop.schema.back_up_description}`
        delete prop.schema.back_up_description
      }
      prop.schema.widget.filled = prop.schema.widget.filled ? false : true
    }
  },
  'action_set_filled': (formProperty: FormProperty, parameters: any) => {
    const fields = [
      'autofill',
      'autocomplete',
      'textarea',
      'week',
      'url',
      'time',
      'text',
      'input-mask',
      'tel',
      'search',
      'range',
      'password',
      'number',
      'month',
      'email',
      'datetime-local',
      'date',
      'date-picker',
      'date-native',
      'switch',
      'select',
      'select_async_targets',
      'select_button'
    ];

    for (const field of fields) {
      const path = formProperty.path + '/' + field;
      const prop: FormProperty = formProperty.searchProperty(path);
      console.log(field, path, prop, formProperty);
      prop.schema.widget.filled = prop.schema.widget.filled ? false : true
    }
  },
  'action_set_split': (formProperty: FormProperty, parameters: any) => {
    const simpleTypes = formProperty.searchProperty('/simpleTypes');
    simpleTypes.schema.widget.split = simpleTypes.schema.widget.split ? false : true
  },
  'action_set_size': (formProperty: FormProperty, parameters: any) => {
    const fields = [
      'autofill',
      'autocomplete',
      'textarea',
      'week',
      'url',
      'time',
      'text',
      'input-mask',
      'tel',
      'search',
      'range',
      'password',
      'number',
      'month',
      'email',
      'datetime-local',
      'date',
      'date-picker',
      'date-native',
      'switch',
      'select',
      'select_async_targets',
      'select_button'
    ];

    for (const field of fields) {
      const path = formProperty.path + '/' + field;
      const prop: FormProperty = formProperty.searchProperty(path);
      console.log(field, path, prop, formProperty);
      if (prop.schema.widget.hasOwnProperty('size')) {
        delete prop.schema.widget['size'];
        if (prop.schema.widget.hasOwnProperty('_width')) {
          prop.schema.widget['width'] = prop.schema.widget['_width'];
          delete prop.schema.widget['_width']
        }
      } else {
        prop.schema.widget['size'] = 'default';
        if (prop.schema.widget.hasOwnProperty('width')) {
          prop.schema.widget['_width'] = prop.schema.widget['width'];
          delete prop.schema.widget['width']
        }
      }
    }
  },
  'action_toggle_view': (property: FormProperty, parameters: any) => {
    const ids = [
      // 'form-default',
      // 'section-default',
      // 'section-accordion',
      'wizard-default',
      'wizard-accordion'
    ];
    const id = property.schema.widget.id + '-' + (property.schema.widget.style || 'default');
    let ix = ids.indexOf(id);
    ix = (ix + 1) % ids.length;
    const curr = ids[ix];
    const newStyle = curr.split('-');
    property.schema.widget.id = newStyle[0] || property.schema.widget.id;
    property.schema.widget.style = newStyle[1] || property.schema.widget.style;
    console.log('action_toggle_view', id, ix, curr, newStyle, property)
  },
  'action_toggle_section_view': (property: FormProperty, parameters: any) => {
    property.schema.widget.style = property.schema.widget.style !== 'tabview' ? 'tabview' : 'accordion'
  },
  'action_toggle_wizard_view': (property: FormProperty, parameters: any) => {
    property.schema.description = property.schema.widget.style !== 'accordion' ? 'mode: accordion' : 'mode: wizard';
    property.schema.widget.style = property.schema.widget.style !== 'accordion' ? 'accordion' : '';
  },
  'action_toggle_wizard_stepper_view': (property: FormProperty, parameters: any) => {
    property.schema.widget.stepperVertical = property.schema.widget.stepperVertical !== 0 ? 0 : 4
  },
  'action_wizard_page_show_hide_2': (property: FormProperty, parameters: any) => {
      console.log('action_wizard_page_show_hide_2 before', property)
      property.schema.fieldsets.map((item, index, all) => {
          if (1 === index) {
              item.hidden = !item.hidden
          }
      })
      property.updateValueAndValidity(true, false)
      console.log('action_wizard_page_show_hide_2 after', property)
  },
  'action_toggle_progress_style': (property: FormProperty, parameters: any) => {
    const currStyle = property.schema.widget.style || 'spinner'
    const nextStyle = property.schema.widget.style !== 'bar' ? 'bar' : 'spinner'
    property.schema.widget.style = nextStyle
    for (const button of property.schema.buttons) {
      if (button.id === 'action_toggle_progress_style') {
        button.icon = parameters.icons[currStyle]
        break
      }
    }
  },
  /** dialogs */
  'show_hide_dialog': (property: FormProperty) => {
    const dialog: FormProperty = property.searchProperty('/overlays/dialogs/myDialog')
    if (!dialog.visible) {
      alert('You must enable the dialog by typing the word "dialog" first')
    }
    dialog.schema.widget.show = !dialog.schema.widget.show
  },
  'show_hide_dialog_complex': (property: FormProperty) => {
    const dialog: FormProperty = property.searchProperty('/overlays/dialogs/myDialogComplex')
    dialog.schema.widget.show = !dialog.schema.widget.show
  },
  'inside_dialog_close_dialog': (property: FormProperty) => {
    const dialog: FormProperty = property.searchProperty('/overlays/dialogs/myDialogComplex')
    dialog.schema.widget.show = false
  },
  'inside_dialog_clear_form': (property: FormProperty) => {
    property.root.reset(null, false)
    const dialog: FormProperty = property.searchProperty('/overlays/dialogs/myDialogComplex')
    dialog.schema.widget.show = false
  },
  'action_toggle_disabled': (property: FormProperty) => {
    property.schema.readOnly = !property.schema.readOnly
    if (!property.schema.orgTitle) {
      property.schema.orgTitle = property.schema.title
    }
    property.schema.title = property.schema.orgTitle + (property.schema.readOnly ? ' (disabled)' : ' (enabled)')
    try {
      if ((property.schema.buttons || []).length && property.schema.buttons[0]) {
        property.schema.buttons[0].label = property.schema.readOnly ? 'Enable input field' : 'Disable input field'
      }
    } catch (er) {
      console.error('button#action_toggle_disabled()', er)
    }
    property.reset(property.value, true)
  },
  'action_toggle_all_disabled': (formProperty: FormProperty) => {
    const fields = [
      'autofill',
      'autocomplete',
      'textarea',
      'week',
      'url',
      'time',
      'text',
      'input-mask',
      'tel',
      'search',
      'range',
      'password',
      'number',
      'month',
      'email',
      'datetime-local',
      'date',
      'date-picker',
      'date-native',
      'switch',
      'select',
      'select_async_targets',
      'select_button',
      //
      'checkbox',
      'radio'
    ];

    for (const field of fields) {
      const path = formProperty.path + '/' + field;
      const prop: FormProperty = formProperty.searchProperty(path);
      prop.schema.readOnly = !prop.schema.readOnly
    }
  },
  'toggle_array_view': (property: FormProperty, parameters: any) => {
    const checkType = (fp: FormProperty) => {
      if (!fp.schema.widget.style || fp.schema.widget.style === 'default') {
        fp.schema.widget.style = 'tabview'
      } else if ('tabview' === fp.schema.widget.style) {
        fp.schema.widget.style = 'accordion'
      } else if ('accordion' === fp.schema.widget.style) {
        fp.schema.widget.style = 'default'
      }
      return fp.schema.widget.style
    }
    

    if (!property['__viewStyleTab'] || property['__viewStyleTab'] === 'default') {
      property['__viewStyleTab'] = 'tabview'
    } else if ('tabview' === property['__viewStyleTab']) {
      property['__viewStyleTab'] = 'accordion'
    } else if ('accordion' === property['__viewStyleTab']) {
      property['__viewStyleTab'] = 'default'
    }

    const keys = ['simple', 'complex']
    for (const field of keys) {
      const path = property.path + '/' + field
      const child: FormProperty = property.searchProperty(path)
      child.schema.widget.style = property['__viewStyleTab']
    }

    try {
      const widgetType = property['__viewStyleTab'] ? property['__viewStyleTab'] : 'default'
      if ((property.schema.buttons || []).length && property.schema.buttons[0]) {
        property.schema.buttons[0].icon = parameters.icons[widgetType]
        property.schema.buttons[0].label = parameters.labels[widgetType]
        property.schema.buttons[0].descriptionl = parameters.descriptions[widgetType]

        property.schema.buttons[0].icon = property.schema.buttons[0].icon.replace(new RegExp('-', 'g'), '_')
      }
    } catch (er) {
      console.error('button#toggle_array_view()', er)
    }
  },

};
