import { HostBinding } from "@angular/core";
import { ControlWidget } from "ngx-schema-form";


/**
 * Allow to remove the space below the input field, checkbox etc.
 * via property `noSpacer`
 * when no helpertext or error message is present.
 */
export class NoHelperTextSpacer extends ControlWidget {
    static RELATIVE_STYLE_URL = '../_component-helper/no-helpertext-spacer.widget.scss'

    @HostBinding('class') get classNoSpacer() {
        const _formComponent = this
        const noSpacer = _formComponent.schema
            && _formComponent.schema.widget
            && _formComponent.schema.widget.noSpacer
        if (noSpacer) {
            if ('always' === noSpacer) {
                return 'noSpacerAlways'
            }
            if (!_formComponent.control.errors && !_formComponent.schema.description)
                return 'noSpacer'
            return 'noSpacerSet'
        }
        return ''
    }

    constructor() {
        super()
    }
}