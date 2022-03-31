import { Converter, DataTransform } from './data-converter-registry.pipe';
import { FormProperty } from 'ngx-schema-form';
import { DateValueToStringConverter } from '../../date/date-value.converter';
import { DateFormatHelper } from '../../date/date-format-helper';
/**
 * Date converter.<br/>
 * Convertes from a date format to another.<br/>
 * Where the source format <code>Converter.from</code> and the target format <code>Converter.to</code> <br/>
 * are given as regular date format <br/>
 * like <code>yyyy.MM.dd</code>, <code>dd.MM.yyyy</code> etc...<br/>
 * or <code>moment.js</code> compatible date format.
 */
export class DateConverterTransform implements DataTransform {
    transform(value: string, formProperty: FormProperty, converter: DateConverter): string {
        if (converter) {
            const sourceFormat = DateFormatHelper.convertToFormatMomentJS(converter.from)
            const targetFormat = DateFormatHelper.convertToFormatMomentJS(converter.to)
            if (!sourceFormat)
                console.warn(`Property 'from' not set for ${converter.type} converter`)
            if (!targetFormat)
                console.warn(`Property 'to' not set for ${converter.type} converter`)
            const newVal = new DateValueToStringConverter(sourceFormat, targetFormat).transform(value) as string
            return newVal
        }
        return value
    }
}

export interface DateConverter extends Converter {
    /**
     * The source format
     * given as regular date format <br/>
     * like <code>yyyy.MM.dd</code>, <code>dd.MM.yyyy</code> etc...<br/>
     * or <code>moment.js</code> compatible date format.
     */
    from: string
    /**
     * The target format
     * given as regular date format <br/>
     * like <code>yyyy.MM.dd</code>, <code>dd.MM.yyyy</code> etc...<br/>
     * or <code>moment.js</code> compatible date format.
     */
    to: string
}