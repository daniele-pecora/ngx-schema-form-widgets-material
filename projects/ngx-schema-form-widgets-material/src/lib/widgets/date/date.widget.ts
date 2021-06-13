/**
 * Created by daniele on 27.09.17
 */
import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, Injectable, Renderer2 } from '@angular/core'
import {ControlWidget} from 'ngx-schema-form';
import { DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import {DateFormatHelper} from './date-format-helper'
import {DateValueToStringConverter} from './date-value.converter'
import {DateValueConverter} from './date-value.converter'
import { inputDateAutoComplete, setDateInputEditListener } from './date.autocomplete'

import * as moment_ from 'moment'
import { NoHelperTextSpacer } from '../_component-helper/no-helpertext-spacer.widget';
const moment = moment_

@Injectable()
export class DateWidgetComponentDateAdapter extends NativeDateAdapter {
  static DATE_FORMATS = {
    parse: {
      dateInput: {month: 'numeric', year: 'numeric', day: 'numeric'},
    },
    display: {
      dateInput: 'input',
      monthYearLabel: {year: 'numeric', month: 'long'},
      dateA11yLabel: {year: 'numeric', month: 'long', day: 'numeric'},
      monthYearA11yLabel: {year: 'numeric', month: 'long'},
    }
  };

  private date_locale: any;

  getDateLocale() {
    return this.date_locale
  }

  setDateLocale(date_locale) {
    this.date_locale = date_locale;
    this.initDateLocale()
  }

  private initDateLocale() {
    if (!this.date_locale.hasOwnProperty('dayNames')) {
      this.date_locale.dayNames = super.getDayOfWeekNames('long')
    }
    if (!this.date_locale.hasOwnProperty('dayNamesShort')) {
      this.date_locale.dayNamesShort = super.getDayOfWeekNames('short')
    }
    if (!this.date_locale.hasOwnProperty('dayNamesMin')) {
      this.date_locale.dayNamesMin = super.getDayOfWeekNames('narrow')
    }
    if (!this.date_locale.hasOwnProperty('monthNames')) {
      this.date_locale.monthNames = super.getMonthNames('long')
    }
    if (!this.date_locale.hasOwnProperty('monthNamesShort')) {
      this.date_locale.monthNamesShort = super.getMonthNames('short')
    }
  }

  format(date: Date, displayFormat: Object): string {
    let value;
    if (displayFormat === 'input') {
      value = moment(date).format(this.date_locale.dateFormat)
    } else {
      let val = '';
      if (displayFormat['month']) {
        const m = this.getMonthNames(displayFormat['month'])[date.getMonth()];
        val += m
      }
      if (val) {
        val += ' '
      }
      if (displayFormat['day']) {
        const m = super.getNumDaysInMonth(date);
        val += m
      }
      if (val) {
        val += ' '
      }
      if (displayFormat['year']) {
        const m = super.getYearName(date);
        val += m
      }
      value = val || super.format(date, displayFormat)
    }
    return value
  }

  parse(value: any): Date | null {
    const m = moment(value, this.date_locale.dateFormat, true)
    if (m) {
      if (!m.isValid()) {
        return null
      }
      return m.toDate()
    }
    return super.parse(value)
  }

  getDayOfWeekNames(style): string[] {
    switch (style) {
      case 'long':
        return this.date_locale.dayNames || super.getDayOfWeekNames(style);
      case 'short':
        return this.date_locale.dayNamesShort || super.getDayOfWeekNames(style);
      case 'narrow':
        return this.date_locale.dayNamesMin || super.getDayOfWeekNames(style)
    }
    return super.getDayOfWeekNames(style)
  }

  getMonthNames(style): string[] {
    switch (style) {
      case 'long':
        return this.date_locale.monthNames || super.getMonthNames(style);
      case 'short':
        return this.date_locale.monthNamesShort || super.getMonthNames(style);
      case 'narrow':
        return this.date_locale.monthNamesShort || super.getMonthNames(style)
    }
    return super.getMonthNames(style)
  }

  getFirstDayOfWeek(): number {
    return ((typeof this.date_locale.firstDayOfWeek) !== 'undefined' && this.date_locale.firstDayOfWeek > -1)
      ? this.date_locale.firstDayOfWeek : super.getFirstDayOfWeek()
  }
}

@Component({
  selector: 'ngx-ui-date-widget',
  templateUrl: './date.widget.html',
  styleUrls: ['./date.widget.scss', '../_component-helper/no-helpertext-spacer.widget.scss'],

  providers: [{provide: DateAdapter, useClass: DateWidgetComponentDateAdapter}, {
    provide: MAT_DATE_FORMATS,
    useValue: DateWidgetComponentDateAdapter.DATE_FORMATS
  }]

})
// TODO when typing the date we must check the format to make the input match
export class DateWidgetComponent extends NoHelperTextSpacer implements OnInit, AfterViewInit {

  // TODO extend locales
  locales = {
    en: {
      firstDayOfWeek: 0,
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      dateFormat: 'MM/dd/yyyy'
    },
    de: {
      firstDayOfWeek: 0,
      dayNames: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
      dayNamesShort: ['Sonn', 'Mon', 'Die', 'Mitt', 'Donn', 'Frei', 'Sam'],
      dayNamesMin: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
      monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
      monthNamesShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
      dateFormat: 'dd.MM.yyyy'
    },
    it: {
      firstDayOfWeek: 0,
      dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdi', 'Sabato'],
      dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Giov', 'Ven', 'Sab'],
      dayNamesMin: ['Do', 'Lu', 'Ma', 'Me', 'Gi', 'Ve', 'Sa'],
      monthNames: ['Gennaio', 'Febraio', 'Marzo', 'Aprile', 'Maggio', 'Giugnio', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
      monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Gui', 'Lul', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
      dateFormat: 'dd.MM.yyyy'
    }
  };

  default_locale = this.locales.de;

  dateObject: Date;

  useLocale = null;
  useDateFormat = null;
  useModelDateFormat = null;
  useDateFormatMomentJS = null;
  useModelDateFormatMomentJS = null;
  usePrimeNGFormat = null;


  dateValueConverter: DateValueToStringConverter = null;

  @ViewChild('dateInputField') dateInputField: ElementRef
  @ViewChild('pickerToggle') pickerToggle: ElementRef
  /** testing only , see ngAfterInitView method ... **/
  disableTestDateValidation = true;

  constructor(
      private dateAdapter: DateAdapter<Date>
    , private renderer: Renderer2
    , private elRef: ElementRef) {
    super();
    this.disableTestDateValidation = false
  }
  /**
   * FIX: MAT-DATEPICKER
   * We must do the binding by ourself since
   * mat-datepicker converts invalid values still to
   * date objects instead to <code>null</code>
   */
  dateInput(eventType: string, event: any) {
    if (false !== this.formProperty.schema.widget.formatFilter) {
      inputDateAutoComplete(event.target, this.formProperty, this.dateValueConverter.getSourceFormat())
    }
    const validDate = this.dateValueConverter.fromSourceFormat(event.target.value)
    if (validDate) {
      /**
       * When we have a valid date then the value is set
       */
      this.control.setValue(validDate)
    } else {
      /**
       * Prevent from setting any value if date is invalid
       */
      this.control.setValue(null)
      if ('blur' === eventType) {
        /**
         * remove invalid value when leaving field
         */
        event.target.value = ''
      }
    }
  }

  updateDateInputField(value: string | Date, emitEvent: boolean = true) {
    // console.log('updateInputValue:', value)
    const date: Date = !(value instanceof Date) ? this.dateValueConverter.fromTargetFormat(value) : value
    if(!emitEvent){
      this.control.setValue(null, {emitEvent: false});
    }else{
      this.control.setValue(date)
    }
    this.dateInputField.nativeElement.value = value ? this.dateValueConverter.toSourceFormat(date) : ''
  }

  ngOnInit() {
    /**
     * setup all date formats
     */
    this.resolveLocale(this.schema.widget.locale || null);
    this.resolveDateFormat(this.schema.widget.locale || null);
    this.useModelDateFormat = this.resolveModelDateFormat() || this.useDateFormat;
    this.resolveConversionDateFormat();
    this.preparePrimeNGFormat(this.useDateFormat);

    if (this.useModelDateFormatMomentJS) {
      this.dateValueConverter = new DateValueToStringConverter(this.useDateFormatMomentJS, this.useModelDateFormatMomentJS)
    }

    this._ngOnInit()
  }

  ngAfterViewInit() {
    const enableDataConversion = null != this.dateValueConverter;
    if (this.disableTestDateValidation || !enableDataConversion) {
      super.ngAfterViewInit()
    } else {
      const control = this.control;
      this.formProperty.valueChanges.subscribe((newValue) => {
        if (control.value !== newValue) {
          if (!enableDataConversion || null === newValue) {
            /**
             * FIX with MAT-DATEPICKER
             * The bindinging must hop over the input field
             * ... this here would cause max stack trace ;-)
             * <code>control.setValue(newValue, {emitEvent: false});</code>
             */
            this.updateDateInputField(newValue, false)
          } else {
            try {
              const convertedValue = this.dateValueConverter.revert(newValue);
              if (convertedValue)
                /**
                 * FIX with MAT-DATEPICKER
                 * The bindinging must hop over the input field
                 * ... this here would cause max stack trace ;-)
                 * <code>control.setValue(convertedValue, {emitEvent: false});</code>
                 */
                this.updateDateInputField(convertedValue, false)
            } catch (e) {
              console.error(e);
              /**
               * FIX with MAT-DATEPICKER
               * The bindinging must hop over the input field
               * ... this here would cause max stack trace ;-)
               * <code>control.setValue(null, {emitEvent: false});</code>
               */
              this.updateDateInputField(null, false)
            }
          }
        }
      });
      this.formProperty.errorsChanges.subscribe((errors) => {
        control.setErrors(errors, {emitEvent: true});
        const messages = (errors || [])
          .filter(e => {
            return e.path && e.path.slice(1) === this.formProperty.path;
          })
          .map(e => e.message);
        this.errorMessages = messages.filter((m, i) => messages.indexOf(m) === i);
      });

      control.valueChanges.subscribe((newValue) => {
        if (!enableDataConversion || null === newValue) {
          // don't set null values in form-property
          this.formProperty.setValue(newValue || '', false);
        } else {
          try {
            const convertedValue = this.dateValueConverter.transform(newValue);
            if (convertedValue)
              this.formProperty.setValue(convertedValue, false);
          } catch (e) {
            console.error(e);
            this.formProperty.setValue('', false)
          }
        }
      });
    }

    this.setupPresetValue()

    this.__aria_setMissingAriaAttributes()

    if (false !== this.formProperty.schema.widget.formatFilter) {
      setDateInputEditListener(this.elRef.nativeElement.querySelector(`.mat-form-field-infix input`))
    }
  }
  __aria_setMissingAriaAttributes() {
    const button = this.pickerToggle && this.pickerToggle['_button'] && this.pickerToggle['_button']['_elementRef'] ? this.pickerToggle['_button']['_elementRef'].nativeElement : null
    if (button) {
        if (!this.schema.widget.iconDescription) {
          this.renderer.setAttribute(button, 'aria-hidden', 'true')
          this.renderer.setAttribute(button, 'tabindex', '-1')
        }
        const val = this.schema.widget.iconDescription || 'Open calendar'
        this.renderer.setAttribute(button, 'aria-label', val)
        this.renderer.setAttribute(button, 'title', val)
        this.renderer.setAttribute(button, 'aria-haspopup', 'dialog')
    }
  }
  setupPresetValue() {
    if (this.schema.widget['preset']) {
      const newDate = this.getDateFromAge(this.schema.widget['preset']);
      if (newDate) {
        const enableDataConversion = null != this.dateValueConverter;
        const newValue = DateValueConverter.dateToString(newDate, this.useDateFormatMomentJS);
        if (!enableDataConversion || newValue === null) {
          // don't set null values in form-property

          /**
           * FIX with MAT-DATEPICKER
           * The bindinging must hop over the input field
           * ... this here would cause max stack trace ;-)
           * <code>this.formProperty.setValue(newValue || '', false)</code>
           */
          this.updateDateInputField(newValue)
        } else {
          try {
            const convertedValue = this.dateValueConverter.transform(newValue)
            if (convertedValue)
              /**
               * FIX with MAT-DATEPICKER
               * The bindinging must hop over the input field
               * ... this here would cause max stack trace ;-)
               * <code>this.formProperty.setValue(convertedValue, false)</code>
               */
              this.updateDateInputField(convertedValue)
          } catch (e) {
            console.error(e);
            /**
             * FIX with MAT-DATEPICKER
             * The bindinging must hop over the input field
             * ... this here would cause max stack trace ;-)
             * <code>this.formProperty.setValue('', false)</code>
             */
            this.updateDateInputField(null)
          }
        }
      }
    }
  }

  _ngOnInit(): void {
    if (this.dateAdapter['setDateLocale'])
      this.dateAdapter['setDateLocale'](this.resolveLocale(this.schema.widget.locale));
    if (this.formProperty.value) {
      this.dateObject = this.dateValueConverter.fromTargetFormat(this.formProperty.value)
      this.control.setValue(this.dateObject)
    }
  }

  preparePrimeNGFormat(format: string) {
    if (null != this.usePrimeNGFormat)
      return this.usePrimeNGFormat;
    if (format)
      return DateFormatHelper.convertToFormatPrimeNG(format);
    return null
  }

  getInputType() {
    if (!this.schema.widget.id || this.schema.widget.id === 'string') {
      return 'text';
    } else {
      return this.schema.widget.id;
    }
  }

  resolveConversionDateFormat() {
    if (this.useDateFormat && this.useModelDateFormat) {
      if (this.useDateFormat)
        this.useDateFormatMomentJS = DateFormatHelper.convertToFormatMomentJS(this.useDateFormat);
      if (this.useModelDateFormat)
        this.useModelDateFormatMomentJS = DateFormatHelper.convertToFormatMomentJS(this.useModelDateFormat)
    }
  }

  resolveDateFormat(locale) {
    if (null != this.useDateFormat)
      return this.useDateFormat;

    if (this.schema.widget['dateFormat'])
      return this.useDateFormat = this.schema.widget.dateFormat;

    let _locale = this.resolveLocale(locale);
    if (_locale) {
      return this.useDateFormat = _locale.dateFormat
    }
  }

  resolveModelDateFormat() {
    if (null != this.useModelDateFormat)
      return this.useModelDateFormat;

    if (this.schema.widget['modelDateFormat'])
      return this.useModelDateFormat = this.schema.widget.modelDateFormat
  }

  resolveLocale(locale) {
    if (null != this.useLocale)
      return this.useLocale;

    let _locale = this.default_locale;
    if (locale) {
      try {
        if ('string' === (typeof locale)) {
          _locale = this.locales[locale] || this.default_locale
        }
      } catch (e) {
        console.error('DateWidgetComponent resolveLocale', e, this)
      }
      if ('string' !== (typeof  locale)) {
        _locale = locale
      }
    }
    /**
     * MomentJS requires uppercase date format
     */
    if (_locale.dateFormat) {
      _locale.dateFormat = DateFormatHelper.convertToFormatMomentJS(_locale.dateFormat)
    }

    return this.useLocale = _locale
  }

  isBoolean(value): boolean {
    return 'boolean' === typeof value
  }

  showOnFocus(event, picker: MatDatepicker<Date>): boolean {
    if (this.schema.widget.hasOwnProperty('showOnFocus')) {
      if (this.schema.widget.showOnFocus === true) {
        picker.open();
        return true
      }
    }
    return false
  }

  /**
   * Current date year + 20 years
   * @returns {string}
   */
  defaultYearRange() {
    if (true === this.schema.widget['yearNavigator']) {
      const n = new Date();
      const minDate = this.getMinDate();
      const maxDate = this.getMaxDate();
      const minYear = minDate ? minDate.getFullYear() : n.getFullYear();
      const maxYear = maxDate ? maxDate.getFullYear() : (n.getFullYear() + 20);
      return `${minYear}:${maxYear}`
    }
    return null
  }

  _convertToDate(value): Date {
    let date: any = value;
    if (date) {
      if (!(date instanceof Date)) {
        date = new Date(date.toString())
      }

    } else {
      date = null
    }
    return date
  }

  getMinDate() {
    return this.getMinDateFromMinAge() || this._convertToDate(this.schema.widget['minDate']) || null
  }

  getMaxDate() {
    return this.getMaxDateFromMaxAge() || this._convertToDate(this.schema.widget['maxDate']) || null
  }

  getDateFromAge(ageString: string): Date {
    let date: Date = null;
    if (ageString) {
      const ageStringParts = ageString.split(':');
      if (ageStringParts[0]) {
        const year = parseInt(ageStringParts[0]);
        if (!isNaN(year)) {
          date = date || new Date();
          date.setFullYear(date.getFullYear() + year)
        }
      }
      if (ageStringParts[1]) {
        const month = parseInt(ageStringParts[1]);
        if (!isNaN(month)) {
          date = date || new Date();
          date.setMonth(date.getMonth() + month)
        }
      }
      if (ageStringParts[2]) {
        const day = parseInt(ageStringParts[2]);
        if (!isNaN(day)) {
          date = date || new Date();
          date.setDate(date.getDate() + day)
        }
      }
    }
    return date
  }

  getMinDateFromMinAge(): Date {
    return this.getDateFromAge(this.schema.widget['minAge'])
  }

  getMaxDateFromMaxAge() {
    return this.getDateFromAge(this.schema.widget['maxAge'])
  }
}
