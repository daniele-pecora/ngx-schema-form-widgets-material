import { FormProperty } from "ngx-schema-form"
// TODO this may be organized in a class later on
/**
 * Autocomplete date-format separator so they must not be typed.<br/>
 * @param srcElement
 * @param formProperty 
<<<<<<< HEAD
 * @param defaultDateFormat `dd.MM.yyyy` default date-format
 */
export const inputDateAutoComplete = (srcElement: any, formProperty: FormProperty, defaultDateFormat: string = 'dd.MM.yyyy') => {
=======
 */
export const inputDateAutoComplete = (srcElement: any, formProperty: FormProperty) => {
>>>>>>> master
    if (!formProperty['dateFormatSettings']
        /** check if 'dateFormat' property has changed */
        || (formProperty.schema.widget.dateFormat && formProperty.schema.widget.dateFormat !== formProperty['dateFormatSettings'].dateFormat)) {

        const insertAt = (str, sub, pos) => {
            return [...str.slice(0, pos), sub, ...str.slice(pos)]
        }
        const matchAll = (str: string, regex: RegExp) => {
            const found = []
            let curr
            let count = 0
            while (!!(curr = regex.exec(str))) {
                found.push(curr)
                if (count > 100)
                    break
                count++
            }
            return found
        }
<<<<<<< HEAD

=======
        const defaultDateFormat = 'dd.mm.yy'
>>>>>>> master
        const dateFormat = formProperty.schema.widget.dateFormat || defaultDateFormat
        const formatMaxSize = dateFormat.length
        const separatorMeta = matchAll(dateFormat, new RegExp('[^YMDHSA]', 'gi'))
        const separatorChars = []
        const separatorPositions = []
        for (const sMeta of separatorMeta) {
            separatorChars.push(sMeta[0])
            separatorPositions.push(sMeta['index'])
        }
        const transformValue = (formProperty: FormProperty, srcElement: any) => {
            if (srcElement.value &&
                /** check type because it may be a 'Date' object that we don't care about */
                typeof (srcElement.value) === 'string') {
                if (srcElement.value.length > formatMaxSize) {
                    /** remove max length exceeded  */
                    srcElement.value = srcElement.value.substring(0, formatMaxSize)
                    return srcElement.value
                }
                /* BEGIN - filter only allowed characters */
                const lastChar = `${srcElement.value}`.slice(-1)
                if (-1 === separatorChars.indexOf(lastChar) && !lastChar.match(new RegExp('[0-9]'))) {
                    /** don't do anything if typed character is not allowed */
                    srcElement.value = srcElement.value.substring(0, srcElement.value.length - 1)
                    return srcElement.value
                }
                /* END - filter only allowed characters */

                let _posOfSep
                if (
                    // last character is a separator position
                    -1 !== (_posOfSep = separatorPositions.indexOf(srcElement.value.length - 1))
                ) {
                } else {
                    if (
                        // last character is a known separator itself
                        -1 !== separatorChars.indexOf(srcElement.value.slice(-1))) {
                        /** remove separator char when not in expected position */
                        srcElement.value = srcElement.value.substring(0, srcElement.value.length - 1)
                    }
                    return srcElement.value
                }
                if (-1 !== separatorChars.indexOf(srcElement.value.slice(-1))) {
                    /** don't do anything if separator character was typed */
                    return srcElement.value
                }

                /* BEGIN - check for separator at right position */
                let hasChanges = false
                let val = srcElement.value.split('')
                let count = 0
                for (const p of separatorPositions) {
                    if (val[p] && val[p] !== separatorChars[count]) {
                        val = insertAt(val, separatorChars[count], p)
                        hasChanges = true
                    }
                    count++
                }
                /* END - check for separator at right position */

                if (hasChanges) {
                    srcElement.value = val.join('')
                }
                if (srcElement.value.length === formatMaxSize) {
                    /* just in case any listener is bound */
                    srcElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
                    /** update value in model */
                    formProperty.setValue(srcElement.value, false)
                    formProperty.updateValueAndValidity(false, false)
                }
            }
            return srcElement.value
        }
        const dateFormatSettings = {
            insertAt: insertAt,
            matchAll: matchAll,
            separatorChars: separatorChars,
            separatorPositions: separatorPositions,
            formatMaxSize: formatMaxSize,
            dateFormat: dateFormat,
            transformValue: transformValue
        }
        formProperty['dateFormatSettings'] = dateFormatSettings
    }
    formProperty['dateFormatSettings'].transformValue(formProperty, srcElement)
}