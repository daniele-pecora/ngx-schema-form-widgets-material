import {SeverityNameTransformerService} from './severity-name-transformer.service'

export class SeverityNameTransformerPrimengUltimaService extends SeverityNameTransformerService {

    transform(value: string): string {
        switch (value) {
            case 'accent':
                return 'accent'
            case 'danger':
                return 'warn'
            case 'warning':
                return 'warn'
        }
        return value
    }


}