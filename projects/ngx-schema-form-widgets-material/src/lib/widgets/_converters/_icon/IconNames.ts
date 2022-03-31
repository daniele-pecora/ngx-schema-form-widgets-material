import {Pipe, PipeTransform} from '@angular/core'
import {IconNameTransformerService} from './icon-name-transformer.service'

@Pipe({
    name: 'IconName'
})
export class IconNameConverterPipe implements PipeTransform {
    constructor(private iconNameTransformerService?: IconNameTransformerService) {

    }

    transform(value: string): string {
        if (this.iconNameTransformerService)
            return this.iconNameTransformerService.transform(value)
        return value
    }
}