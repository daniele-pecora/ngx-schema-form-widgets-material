import { ButtonTypeTransformerService } from './button-type-transformer.service'

/**
 * Converts button types to PrimeNG button style css class<br/>
 */
export class ButtonTypeTransformerPrimengUltimaService extends ButtonTypeTransformerService {
  types = {
    'mini-fab': 'ui-button-icon-only ngx-widget-button-accent ngx-widget-button-mini-fab',
    'fab': 'ui-button-icon-only ngx-widget-button-accent ngx-widget-button-fab',
    'raised': '',
    'flat': 'flat',
    '': ''
  }
  transform(value: string): string {
    return this.types[value || '']
  }
}
