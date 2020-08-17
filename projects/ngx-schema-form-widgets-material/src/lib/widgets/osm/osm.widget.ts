import {Component} from '@angular/core'
import {ControlWidget} from 'ngx-schema-form'
import {FormProperty} from 'ngx-schema-form'
import {OsmViewAddressModel} from '../_osm/osm-view.component'

@Component({
  selector: 'ngx-ui-osm-widget',
  templateUrl: './osm.widget.html'
})
export class OSMWidgetComponent extends ControlWidget {

  /**
   * This invisible unicode character has the purpose to
   * keep the OSM Widget's height from getting infinitely bigger while
   * resizing the browser window.
   */
  noResizeHelper = "\u202F"

  onAddressChange(resultItem: OsmViewAddressModel) {
    const addressTargetPath = (this.schema.widget || {})['addressTarget']
    if (addressTargetPath) {
      this.setAddressTargetVal(resultItem, addressTargetPath, 'display')
    } else {
      this.control.setValue(resultItem.display)
    }

    const addressTargets = (this.schema.widget || {})['addressTargets']
    if ((addressTargets || []).length) {
      for (const addressTarget of addressTargets) {
        const addressProperty = addressTarget.key
        const destinationTarget = addressTarget.destination
        this.setAddressTargetVal(resultItem, destinationTarget, addressProperty)
      }
    }
  }

  private setAddressTargetVal(resultItem: OsmViewAddressModel, addressTargetPath: string, addressProperty: string) {
    const addressTarget = this.formProperty.findRoot().getProperty(addressTargetPath) as FormProperty
    if (addressTarget) {
      const addressString = resultItem[addressProperty] || ''
      addressTarget.setValue(addressString, false)
    }
  }

}
