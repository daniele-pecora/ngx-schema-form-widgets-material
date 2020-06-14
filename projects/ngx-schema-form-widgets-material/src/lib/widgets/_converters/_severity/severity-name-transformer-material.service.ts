import {SeverityNameTransformerService} from './severity-name-transformer.service'

export class SeverityNameTransformerMaterialService extends SeverityNameTransformerService {

    transform(value: string): string {
        switch (value) {
            case 'warning':
                return 'warn'
            case 'danger':
                return 'warn'
            case 'success':
                return 'accent'
        }
        return value
    }

}