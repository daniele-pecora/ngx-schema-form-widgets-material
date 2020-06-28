import { ButtonTypeTransformerService } from './button-type-transformer.service'

/**
 * Converts button types to Angular Material button types directive names<br/>
 */
export class ButtonTypeTransformerMaterialService extends ButtonTypeTransformerService {
  types = {
    'mini-fab': 'mat-mini-fab',
    'fab': 'mat-fab',
    'raised': 'mat-raised-button',
    'flat': 'mat-flat-button',
    'stroked': 'mat-stroked-button',
    '': 'mat-button'
  }
  transform(value: string): string {
    return this.types[value || '']
  }
}
