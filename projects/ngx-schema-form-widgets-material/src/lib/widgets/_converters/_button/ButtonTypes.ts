import { Pipe, PipeTransform } from '@angular/core'
import { ButtonTypeTransformerService } from './button-type-transformer.service'

@Pipe({
    name: 'ButtonType'
})
export class ButtonTypeConverterPipe implements PipeTransform {
    constructor(private buttonTypeTransformerService?: ButtonTypeTransformerService) {

    }

    transform(value: string): string {
        if (this.buttonTypeTransformerService)
            return this.buttonTypeTransformerService.transform(value)
        return value
    }
}