/**
 * Created by daniele on 27.09.17
 */
import {Component} from '@angular/core';
import {ControlWidget} from 'ngx-schema-form';
import { NoHelperTextSpacer } from '../_component-helper/no-helpertext-spacer.widget';

@Component({
  selector: 'ngx-ui-string-widget',
  templateUrl: './string.widget.html',
  styleUrls: ['./string.widget.scss', 
  NoHelperTextSpacer.RELATIVE_STYLE_URL]
})
export class StringWidgetComponent extends NoHelperTextSpacer {//ControlWidget {


  /**
   * Convert from PrimeNG format
   * <code>
   Mask format can be a combination of the the following built-in definitions.

   a - Alpha character (A-Z,a-z)
   9 - Numeric character (0-9)
   &#42; - Alpha numberic character (A-Z,a-z,0-9)
   </code>
   * @returns {any}
   */
  private convertFromSimpleFormat(format) {
    const rep = (val) => {
      switch (val) {
        case 'a':
          return /[A-Za-z\u00C4\u00D6\u00DC\u00E4\u00F6\u00FC\u00DF]/;
        case '9':
          return /\d/;
        case '*':
          return /[A-Za-z\u00C4\u00D6\u00DC\u00E4\u00F6\u00FC\u00DF\d]/;
        default:
          return val
      }
    };
    if (!Array.isArray(format)) {
      const newformat = [];
      const values = format.split('');
      for (const val of values) {
        newformat.push(rep(val))
      }
      return newformat
    }
    return format
  }

  /**
   * This sould be used with angular2-text-mask (https://github.com/text-mask/text-mask)
   * @returns {any}
   */
  private getMaskArray() {
    if (this.schema.widget.mask) {
      const convMask = this.convertFromSimpleFormat(this.schema.widget.mask);
      return {
        mask: convMask,
        placeholderChar: this.schema.widget.slotChar,
        guide: true,
        pipe: undefined,
        keepCharPositions: false,
        showMask: false
      }
    }
    return null
  }

  getMask() {
    return this.schema.widget.mask
  }

  getInputType() {
    if (!this.schema.widget.id || this.schema.widget.id === 'string') {
      return 'text';
    } else if (this.schema.widget.id === 'date-native'){
      return 'date'
    } else {
      return this.schema.widget.id;
    }
  }
}
