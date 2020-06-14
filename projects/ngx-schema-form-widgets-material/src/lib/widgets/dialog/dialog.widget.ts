import { Component } from "@angular/core"
import { ActionObjectLayoutWidgetComponent } from '../_base/action-object-layout.widget.component'
import { ActionRegistry } from "ngx-schema-form"
import { IconNameConverterPipe } from "../_converters/_icon/IconNames";
import { SeverityNameConverterPipe } from '../_converters/_severity/SeverityNames'
import { ButtonTypeTransformerService } from "../_converters/_button/button-type-transformer.service";

@Component({
    selector: 'ngx-ui-dialog-widget',
    templateUrl: './dialog.widget.html',
    styleUrls: ['./dialog.widget.scss'],
    providers: [IconNameConverterPipe, SeverityNameConverterPipe]
})
export class DialogWidgetComponent extends ActionObjectLayoutWidgetComponent {

    initialVisibilityStateChangeOccurred: boolean
    isInitiallyVisible: boolean

    constructor(actionRegistry: ActionRegistry
        , iconNameConverter: IconNameConverterPipe
        , severityNameConverter: SeverityNameConverterPipe
        , buttonTypesConverter: ButtonTypeTransformerService) {
        super(actionRegistry, iconNameConverter, severityNameConverter, buttonTypesConverter);
    }

    ngAfterViewInit() {
        super.ngAfterViewInit()
        this.isInitiallyVisible = this.schema['widget']['show']
        this.formProperty['_visibilityChanges'].subscribe(isVisible => {
            if (
                /**
                 * This will catch up when a dialog ui widget was initially
                 * not shown due to a <code>visibileIf</code> condition.
                 */
                (!this.isInitiallyVisible && this.schema.visibleIf)
                /**
                 * Initially the event <code>_visibilityChanges</code> will
                 * be emitted once on <code>ngAfterViewInit</code>.
                 * This will cause the property <code>widget.show</code>
                 * to be ignored/overridden, which is not a
                 * acceptable behavior
                 */
                || this.initialVisibilityStateChangeOccurred) {
                this.schema['widget']['show'] = isVisible
            }
            this.initialVisibilityStateChangeOccurred = true
        })
    }

    onShow(event) {

    }

    onHide(event) {

    }
}
