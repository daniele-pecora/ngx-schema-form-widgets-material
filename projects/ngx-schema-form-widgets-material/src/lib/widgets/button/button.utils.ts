/**
 * Supported states values:<br/>
 * <table width="100%" cellspacing="2" cellpadding="1" border="1" align="center">
 *  <tr><th width="40%">Value</th><th>Description</th></tr>
 *  <tr><td><code>true</code></td><td>Positive result</td></tr>
 *  <tr><td><code>&quot;true&quot;</code></td><td>Positive result</td></tr>
 *  <tr><td><code>false</code></td><td>Negative result</td></tr>
 *  <tr><td><code>&quot;false&quot;</code></td><td>Negative result</td></tr>
 *  <tr><td><code>&quot;valid&quot;</code></td><td>Positive result only if the corresponding <code>&quot;FormProperty&quot;</code> is valid</td></tr>
 *  <tr><td><code>&quot;invalid&quot;</code></td><td>Positive result only if the corresponding <code>&quot;FormProperty&quot;</code> is invalid</td></tr>
 *  <tr><td><code>&quot;$ANY&quot;</code></td><td>Positive result only if the corresponding <code>&quot;FormProperty&quot;</code> has any value set</td></tr>
 *  <tr><td><code>&quot;$EMPTY&quot;</code></td><td>Positive result only if the corresponding <code>&quot;FormProperty&quot;</code> has no value set</td></tr>
 *  <tr><td><code>&quot;$VAL:&lt;a-value&gt;&quot;</code></td><td>Positive result only if the corresponding <code>&quot;FormProperty&quot;</code> has the value set described after the colon <code>&quot;:&quot;</code></td></tr>
 *  <tr><td><code>&quot;$NOT:&lt;a-value&gt;&quot;</code></td><td>Positive result only if the corresponding <code>&quot;FormProperty&quot;</code> has not the value set described after the colon <code>&quot;:&quot;</code></td></tr>
 * </table>
 * @param propertyName The name of the property to read from <code>propertyObject</code>.<br/>
 * @param propertyObject The object containing the property given in argument <code>propertyName</code> (mostly the property <code>schema.widget</code>).<br/>
 *                   A <code>hasOwnProperty</code> will check for existence of that <code>propertyName</code>.
 * @param validityState The validity state of the <code>FormProperty</code>
 * @param defaultValue The value to return if no property with the name <code>propertyName</code> exists in <code>propertyObject</code> or the <code>propertyObject</code> is undefined.
 * @param value The value of the <code>FormProperty</code>
 */
export function buttonState(propertyName: string, propertyObject, validityState, defaultValue: boolean, value?): boolean {
  if (propertyObject && propertyObject.hasOwnProperty(propertyName)) {
    switch (propertyObject[propertyName]) {
      case true :
        return true
      case false:
        return false
      case 'true':
        return true
      case 'false':
        return false
      case 'valid':
        return validityState
      case 'invalid':
        return !validityState
      case '$ANY':
        return !((typeof (value) === 'undefined') || value.length <= 0)
      case '$EMPTY':
        return ((typeof (value) === 'undefined') || value.length <= 0)
    }
    // strip of marker and compare values
    const _d_val = (propertyObject[propertyName] || '')
    let index = -1
    if (-1 !== (index = _d_val.indexOf('$VAL:'))) {
      if (_d_val.substring(index + '$VAL:'.length, _d_val.length) === value) {
        return true
      }
    } else if (-1 !== (index = _d_val.indexOf('$NOT:'))) {
      if (_d_val.substring(index + '$NOT:'.length, _d_val.length) !== value) {
        return true
      }
    }
  }
  return defaultValue
}

/**
 * Returns the state value for the property <code>disabled</code>
 * @see buttonState
 */
export function clickableDisabledState(propertyObject, validityState, value?): boolean {
  return buttonState('disabled', propertyObject, validityState, false, value)
}

/**
 * Returns the state value for the property <code>visible</code>
 * @see buttonState
 */
export function clickableVisibilityState(propertyObject, validityState, value?): boolean {
  return buttonState('visible', propertyObject, validityState, true, value)
}
