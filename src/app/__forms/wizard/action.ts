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
    },
    'action_change_array_item_numeration': (property: FormProperty, parameters: any) => {
        console.log('action_change_array_item_numeration before', property)
        let typeString = 'Numeration: continous'
        if (!property.schema.widget.hasOwnProperty('itemNumeration')) {
            property.schema.widget.itemNumeration = true
        }
        if (-1 === [true, false, 'index'].indexOf(property.schema.widget.itemNumeration)) {
            property.schema.widget.itemNumeration = true
        }

        if (true === property.schema.widget.itemNumeration) {
            property.schema.widget.itemNumeration = false
            typeString = 'Numeration: OFF'
        } else if (false === property.schema.widget.itemNumeration) {
            property.schema.widget.itemNumeration = 'index'
            typeString = 'Numeration: POSITION'
        } else if ('index' === property.schema.widget.itemNumeration) {
            property.schema.widget.itemNumeration = true
            typeString = 'Numeration: CONTINOUS'
        }

        property.schema.buttons.forEach(element => {
            if ('action_change_array_item_numeration' === element.id) {
                element.label = typeString
            }
        })

        property.updateValueAndValidity(true, false)
        console.log('action_wizard_page_show_hide_2 after', property)
    },
    'action_toggle_title': (property: FormProperty, parameters: any) => {
        property['title_org'] = property['title_org'] || property.schema.title || property.schema.name

        let button = property.schema.buttons.filter(element => 'action_toggle_title' === element.id)[0]
        property['action_toggle_title'] = property['action_toggle_title'] || button['label']

        property['headings'] = property['headings'] || [1, 2, 3, 4, 5, 6, 'default', 'none', '', '1', '2', '3', '4', '5', '6']
        property['headings_titles'] = property['headings_titles'] || ['Number 1', 'Number 2', 'Number 3', 'Number 4', 'Number 5', 'Number 6', 'String "default"', 'String "none"', 'Empty string', 'String "1"', 'String "2"', 'String "3"', 'String "4"', 'String "5"', 'String "6"']
        const index = property['headings_current_index'] = property['headings_current_index'] || 0
        property.schema.widget.heading = property['headings'][index]

        // update wizard title text
        property['headings_titles_el'] = property['headings_titles_el'] || ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'default "default"', 'default "none"', 'default ""', '"H1"', '"H2"', '"H3"', '"H4"', '"H5"', '"H6"']
        property.schema.title = property['title_org'] + ' (' + property['headings_titles_el'][index] + ')'
        // update button label
        button['label'] = property['action_toggle_title'] + '. Actual: ' + property['headings_titles'][index]

        // prepare next value
        property['headings_current_index']++
        if (property['headings_current_index'] > property['headings'].length) {
            property['headings_current_index'] = 0
        }

    }
}