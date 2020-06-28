import {Pipe, PipeTransform} from '@angular/core'
import {SeverityNameTransformerService} from './severity-name-transformer.service'

@Pipe({
    name: 'SeverityName'
})
export class SeverityNameConverterPipe implements PipeTransform {
    constructor(private severityNameTransformerService?: SeverityNameTransformerService) {

    }

    transform(value: string): string {
        if (this.severityNameTransformerService)
            return this.severityNameTransformerService.transform(value)
        return value
    }
}
