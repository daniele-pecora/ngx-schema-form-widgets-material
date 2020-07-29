import {IconNameTransformerService} from './icon-name-transformer.service'

/**
 * Converts PrimeNG Icon names to Material Design Icon names by removing the prefix <code>ui-icon-</code>.<br/>
 */
export class IconNameTransformerPrimengUltimaService extends IconNameTransformerService {
  skipPrefix='xi-' // no prefix to be skipped for now
  transform(value: string): string {
    if (value && !value.startsWith(this.skipPrefix) && -1 === value.indexOf('ui-icon-')) {
      return 'ui-icon-' + value.replace(new RegExp('_', 'g'), '-')
    }
    return value
  }

}
