import { Component, Input, Pipe, PipeTransform } from '@angular/core'
import { FormProperty } from 'ngx-schema-form'

/**
 * Global function to check if a field is required and marks it with an asterisk (&#42;).<br/>
 * The <code>FormProperty.schema.widget</code> may provide <br/>
 * a custom character or string to flag the property as required<br/>
 * by setting the property <code>schema.widget.requiredMark</code><br/>
 * .<br/>
 * This simply checks if the field name is included in the parents <code>required</code> array property.<br/>
 * <code>
 {
     "required":["state","district","local","community"]
 }
 * </code>
 * Is als checks if parent has set <code>oneOf</code> where the property is contained as <code>required</code>.
 * e.g:<br/>
 * <code>
 "oneOf": [
 {
   "required": [
     "state"
   ]
 },
 {
   "required": [
     "district"
   ]
 },
 {
   "required": [
     "local"
   ]
 },
 {
   "required": [
     "community"
   ]
 }
 ]
 * </code>
 * @param {FormProperty} val
 * @returns {boolean} <code>true</code> if the the fields is required.<br/>
 * <code>false</code> otherwise.<br/>
 */
export function isRequiredField(val: FormProperty) {
  if (val.parent && val.parent.schema) {
    const propertyName = val.path.split('/').slice(-1)[0]
    if (val.parent.schema.required
      && -1 !== (val.parent.schema.required || []).indexOf(propertyName)) {
      return true
    }
    if (val.parent.schema.oneOf) {
      for (const el of val.parent.schema.oneOf) {
        if (-1 !== (el.required || []).indexOf(propertyName)) {
          return true
        }
      }
    }
  }
  return false
}

/**
 * Angular Pipe to be used in templates :<br/>
 * <pre>
 * &lt;p-checkbox
 *     label="{{ schema.hasOwnProperty('title') ? schema.title : formProperty.path }} {{formProperty|IsRequiredAsterisk}}"
 *     value="check-this"
 *     &gt;&lt;/p-checkbox&gt;
 * </pre>
 * @see isRequiredField
 */
@Pipe({
  name: 'IsRequiredAsterisk'
})
export class IsFormPropertyRequiredAsteriskPipe implements PipeTransform {
  transform(value: FormProperty): string {
    if (isRequiredField(value)) {
      return (value.schema.widget || {}).hasOwnProperty('requiredMark') ? value.schema.widget.requiredMark : '*'
    }
    return ''
  }
}

/**
 * Angular Pipe to be used in templates:<br/>
 * <pre>
 * &lt;label&gt; Name &lt;span *ngIf="(formProperty|IsRequired)"&gt;*&lt;/span&gt; &lt;/label&gt;
 * </pre>
 * @see isRequiredField
 */
@Pipe({
  name: 'IsRequired'
})
export class IsFormPropertyRequiredPipe implements PipeTransform {
  transform(value: FormProperty): boolean {
    return isRequiredField(value)
  }

}

/**
 * Angular Pipe to be used in attributes:<br/>
 * <pre>
 * &lt;input [required]="(formProperty|IsRequiredAttr)"&gt;
 * </pre>
 * or
 * <pre>
 * &lt;input [aria-required]="(formProperty|IsRequiredAttr)"&gt;
 * </pre>
 * This differs from <code>IsRequired</code> in that that it provides a <code>null</code> value if <code>false</code><br/>
 * so the attributes will not be set if <code>null</code> is returned.<br/>
 * If a strict <code>true</code> or <code>false</code> value is required the use <code>IsRequired</code> instead.<br/>
 * @see isRequiredField
 */
@Pipe({
  name: 'IsRequiredAttr'
})
export class IsFormPropertyRequiredAttributePipe implements PipeTransform {
  transform(value: FormProperty): boolean | null {
    return isRequiredField(value) ? true : null
  }
}

/**
 * Angular Pipe to be used in attributes:<br/>
 * <pre>
 * &lt;input [required]="(formProperty|IsRequiredAttr)"&gt;
 * </pre>
 * or
 * <pre>
 * &lt;input [aria-required]="(formProperty|IsRequiredAttr)"&gt;
 * </pre>
 * This differs from <code>IsRequired</code> in that that it provides a <code>null</code> value if <code>false</code><br/>
 * so the attributes will not be set if <code>null</code> is returned and <br/>
 * it provides the string <code>required</code> if <code>true</code>.<br/>
 * If a strict <code>true</code> or <code>false</code> value is required the use <code>IsRequired</code> instead.<br/>
 * @see isRequiredField
 */
@Pipe({
  name: 'IsRequiredAttrString'
})
export class IsFormPropertyRequiredAttributeStringPipe implements PipeTransform {
  transform(value: FormProperty): string | null {
    return isRequiredField(value) ? 'required' : null
  }
}


@Component({
  selector: 'ngx-ui-widget-required-mark',
  templateUrl: './is-required-field.component.html',
})
export class RequiredMarkComponent {
  @Input()
  formProperty: FormProperty
}
