import {IconNameTransformerService} from './icon-name-transformer.service'

/**
 * Converts Material Design Icon names to PrimeNG Icon names by adding the prefix <code>ui-icon-</code>.<br/>
 * Skips any icon that starts with a defined icon prefix to be skipped.
 */
export class IconNameTransformerMaterialService extends IconNameTransformerService {
  skipPrefix='xi-' // no prefix to be skipped for now
  transform(value: string): string {
    if (value && (this.skipPrefix && !value.startsWith(this.skipPrefix)) && -1 !== value.indexOf('ui-icon-')) {
      return value.replace('ui-icon-', '').replace(new RegExp('-','g'), '_')
    }
    return value
  }

}
