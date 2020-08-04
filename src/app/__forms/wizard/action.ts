import { FormProperty } from 'ngx-schema-form'

/*
 * define here the form actions
 */

export const actions = {
    "wizard_action_prev": function (property, params) {
        console.log('wizard_action_prev', params)
    },
    "wizard_action_next": function (property, params) {
        console.log('wizard_action_next', params)
    },
    "wizard_action_finish": function (property, params) {
        console.log('wizard_action_finish', params)
    },
    "___before_action___schema_form_final": function (property, params) {
        console.log('___before_action___schema_form_final', params)
    }, 'action_toggle_wizard_view': (property: FormProperty, parameters: any) => {
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
    }
}