import {ValueModelConverter} from "../_converters/_value/ValueModelConverter";
import * as moment_ from 'moment'
const moment = moment_

export abstract class BaseDateValueConverter<SourceType, TransformType> implements ValueModelConverter<SourceType, TransformType> {
  
  abstract transform(value: SourceType): TransformType

  abstract revert(value: TransformType): SourceType 
  
  static dateToString(date: Date, format: string): string {
    return moment(date).format(format);
  }

  static dateFromString(date: string, format: string): Date {
    const m = moment(date, format, true)
    if (m.isValid())
      return m.toDate()
    return null
  }

  /**
   *
   * @param {string} sourceFormat  MomentJS date format string
   * @param {string} targetFormat  MomentJS date format string
   */
  constructor(protected sourceFormat: string, protected  targetFormat: string) {

  }

  toTargetFormat(date: Date): string {
    return BaseDateValueConverter.dateToString(date, this.targetFormat)
  }

  toSourceFormat(date: Date): string {
    return BaseDateValueConverter.dateToString(date, this.sourceFormat)
  }

  fromTargetFormat(date: string): Date {
    return BaseDateValueConverter.dateFromString(date, this.targetFormat)
  }

  fromSourceFormat(date: string): Date {
    return BaseDateValueConverter.dateFromString(date, this.sourceFormat)
  }
}

export class DateValueConverter extends BaseDateValueConverter<string | Date, string | Date> {
  /**
   *
   * @param {string} sourceFormat  MomentJS date format string
   * @param {string} targetFormat  MomentJS date format string
   */
  constructor(protected sourceFormat: string, protected  targetFormat: string) {
      super(sourceFormat, targetFormat)
  }

  transform(value: string | Date): string | Date {
    return this.dateFromTo(value, this.sourceFormat, this.targetFormat);
  }

  revert(value: string | Date): string | Date {
    return this.dateFromTo(value, this.targetFormat, this.sourceFormat);
  }

  /**
   * @param dateValue
   * @param MomentJS date format string
   * @param dateFormatTo  MomentJS date format string
   * @returns
   */
  protected dateFromTo(dateValue: string | Date, dateFormatFrom: string, dateFormatTo: string): string | Date {
    const from = `${dateFormatFrom}`
    const to = `${dateFormatTo}`
    const mom = (dateValue instanceof Date) ? moment(dateValue) : moment(dateValue, from, true) // string or date
    if (mom.isValid())
      return (dateValue instanceof Date) ? mom.toDate() : mom.format(to)
    return ''
  }
}

export class DateValueToStringConverter extends BaseDateValueConverter<Date|string, string> {
  /**
   *
   * @param {string} sourceFormat  MomentJS date format string
   * @param {string} targetFormat  MomentJS date format string
   */
  constructor(protected sourceFormat: string, protected targetFormat: string) {
    super(sourceFormat, targetFormat)
  }

  transform(dateValue: Date|string): string {
    const from = `${this.sourceFormat}`
    const to = `${this.targetFormat}`
    const mom = (dateValue instanceof Date) ? moment(dateValue) : moment(dateValue, from, true) // string or date
    if (mom.isValid())
      return mom.format(to)
    return null
  }

  revert(dateValue: Date|string): Date {
    const to = `${this.targetFormat}`
    if (!(dateValue instanceof Date) && to.length !== dateValue.length)
      return null
    const mom = (dateValue instanceof Date) ? moment(dateValue) : moment(dateValue, to, true) // string or date
    if (mom.isValid())
      return mom.toDate()
    return null
  }

}