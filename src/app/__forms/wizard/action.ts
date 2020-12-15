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
        if (params.fromPage === 0)
            throw `You shall not pass page 0`
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
    'action_wizard_toggle_readOnly': (property: FormProperty, parameters: any) => {
        const root = property.findRoot()
        root.schema.readOnly = !root.schema.readOnly
        console.log('action_wizard_toggle_readOnly after', root, root.schema.readOnly, property)
        const buttons = (property.schema.buttons || [])
        for (const button of buttons) {
            if (button.id === 'action_wizard_toggle_readOnly') {
                const suff = root.schema.readOnly ? 'on' : 'off'

                button.icon = parameters[`icon-${suff}`]
                button.label = parameters[`label-${suff}`]
                button.description = parameters[`description-${suff}`]

                break
            }
        }
    },
    "action_wizard_show_invalid_fields": (property: FormProperty, parameters: any) => {
        console.log('action_wizard_show_invalid_fields', property)
        property['__toggle_invalid_fields'] = !property['__toggle_invalid_fields']
        let setStyleForInvalid = (enable) => {
            let style = document.querySelector('#style-invalid-wizard')
            if (!style) {
                style = document.createElement('style')
                document.body.appendChild(style)
                style.id = 'style-invalid-wizard'
                style['type'] = 'text/css'
            }
            if (enable) {
                style.innerHTML = `
/*
.ng-invalid { color: red !important; background-color: #f44336;}
.has-error { color: red !important; background-color: #9c27b0;}
.ng-untouched.ng-invalid { color: red !important; background-color: #03a9f4;}
*/

/* field group container */
.has-error div.has-error {
    __outline: solid 4px red;
}

/* field group label */
/*.has-error ngx-ui-widget-required-mark:after {*/
.has-error ngx-ui-widget-required-mark:not(:empty):after {
    content: "!";
    display: inline-block;
    text-align: right;
    height: 1em;
    width: 1em;
    line-height: 1em;
    border-radius: 50%;
    background: red;
    color: white;
    text-align: center;
    margin-left: 0.2em;
}

/* single field container*/
.has-error /* skip root container */ .has-error .ng-untouched.ng-invalid {
    __color: lime !important;
    __background-color: #9c27b0 !important;
}

/** labels */
.has-error .has-error .ng-untouched.ng-invalid label {
    x-font-weight: 700;
    x-text-decoration: underline;
}
/* lable prefix icon */
/*.has-error .has-error .ng-untouched.ng-invalid label:before {*/
.has-error .has-error /*.ng-untouched*/.ng-invalid label:after {
    content: "!";
    color: white;
    font-weight: 700;
    background: red;
    border-radius: 50%;
    height: 1em;
    width: 1em;
    line-height: 1em;
    margin-right: 0.2em;
    display: inline-block;
    text-align: center;
    /*padding: 0.2em;*/
}
`
            } else {
                style.innerHTML = ''
            }
            document.getElementsByTagName('head')[0].appendChild(style)
        }
        setStyleForInvalid(property['__toggle_invalid_fields'])
        const buttons = (property.schema.buttons || [])
        for (const button of buttons) {
            if (button.id === 'action_wizard_show_invalid_fields') {
                const suff = property['__toggle_invalid_fields'] ? 'on' : 'off'

                button.icon = parameters[`icon-${suff}`]
                button.label = parameters[`label-${suff}`]
                button.description = parameters[`description-${suff}`]

                break
            }
        }
    }
}