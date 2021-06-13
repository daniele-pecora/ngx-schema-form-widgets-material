import { FormProperty } from "ngx-schema-form"
// TODO this may be organized in a class later on
/**
 * Autocomplete date-format separator so they must not be typed.<br/>
 * @param srcElement
 * @param formProperty 
 * @param defaultDateFormat `dd.MM.yyyy` default date-format
 */
export const inputDateAutoComplete = (srcElement: any, formProperty: FormProperty, defaultDateFormat: string = 'dd.MM.yyyy') => {
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

        const dateFormat = formProperty.schema.widget.dateFormat || defaultDateFormat
        const formatMaxSize = dateFormat.length
        const separatorMeta = matchAll(dateFormat, new RegExp('[^YMDHSA]', 'gi'))
        const separatorChars = []
        const separatorPositions = []
        for (const sMeta of separatorMeta) {
            separatorChars.push(sMeta[0])
            separatorPositions.push(sMeta['index'])
        }
        // separate all date format parts by their separator characters
        const dateFormatPartsRegExp = new RegExp('[' + separatorChars.filter((item, pos) => separatorChars.indexOf(item) === pos).join('') + ']', 'ig')
        const dateFormatParts = dateFormat.split(dateFormatPartsRegExp)

        const transformValue = (formProperty: FormProperty, srcElement: any) => {
            if (!srcElement /** may be null if date-picker is used */) {
                return srcElement
            }
            if (srcElement.value &&
                /** check type because it may be a 'Date' object that we don't care about */
                typeof (srcElement.value) === 'string') {
                if (srcElement.value.length > formatMaxSize) {
                    /** remove max length exceeded  */
                    srcElement.value = srcElement.value.substring(0, formatMaxSize)
                    return srcElement.value
                }

                /* BEGIN - check if separator character has been typed */
                const _lastChar = `${srcElement.value}`.slice(-1)
                if (-1 !== separatorChars.indexOf(_lastChar)) {
                    //1. find the current separator position and date format part
                    let separatorPos = -1
                    let separatorChar
                    let dateFormatPart
                    let separatorCount = -1
                    for (let i = 0; i < separatorPositions.length; i++) {
                        if (srcElement.value.length <= separatorPositions[i]) {
                            if (separatorCount !== separatorPositions.length - 1) {
                                separatorChar = separatorChars[i]
                                separatorPos = separatorPositions[i]
                                dateFormatPart = dateFormatParts[i]
                                separatorCount = i
                            }
                            break
                        }
                    }
                    // 2. fill up the string with 0 padding if necessary
                    if (-1 !== separatorPos) {
                        if (separatorCount) {
                            let datePartString = srcElement.value.substring(
                                separatorPositions[separatorCount - 1] + separatorChars[separatorCount - 1].length,
                                separatorPositions[separatorCount] - separatorChars[separatorCount].length
                            )
                            if (datePartString && -1 === separatorChars.indexOf(datePartString)) {
                                let addPadding = ''
                                dateFormatPart.split('').map(item => {
                                    if ((datePartString.length + addPadding.length) < dateFormatPart.length) {
                                        addPadding = '0' + addPadding
                                    }
                                    return item;
                                })
                                srcElement.value = srcElement.value.substring(0, separatorPositions[separatorCount - 1] + separatorChars[separatorCount - 1].length)
                                    + addPadding
                                    + srcElement.value.substring(separatorPositions[separatorCount - 1] + separatorChars[separatorCount - 1].length)
                            }
                        } else {
                            srcElement.value = '0' + srcElement.value
                        }
                    }
                    // 3. pass the value for further processing
                    // ...
                }
                /* END - check if separator character has been typed */

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
    if (srcElement)
        formProperty['dateFormatSettings'].transformValue(formProperty, srcElement)
}

export const setDateInputEditListener = (el) => {
    const useTimeout = true
    const getSelectedText = () => {
        const doc = el.ownerDocument
        const win = doc.defaultView || doc.parentWindow
        if (win.getSelection) {
            return win.getSelection().toString();
        } else if (doc.selection) {
            return doc.selection.createRange().text
        }
        return ''
    }

    const isValidPosition = () => {
        return !(el.selectionStart === el.value.length)
    }
    /**
     * Always select all content on mouseup
     */
    el.addEventListener('mouseup', (event) => {
        if (!isValidPosition())
            return
        if (event.target.value) {
            event.target.setSelectionRange(0, el.value.length)
        }
    })
    /**
     * Always select all content on click
     */
    el.addEventListener('click', (event) => {
        if (!isValidPosition())
            return
        if (useTimeout) {
            /** select all must be done timed out otherwise caret remains but text is not selected*/
            setTimeout(() => {
                if (event.target.value) {
                    event.target.setSelectionRange(0, el.value.length)
                }
            }, 0)
        } else {
            if (event.target.value) {
                event.target.setSelectionRange(0, el.value.length)
            }
        }
    })
    /**
     * Always select all content when using arrow keys or setting the cursor manually
     */
    el.addEventListener('keyup', (event) => {
        if (!isValidPosition())
            return
        const key = event.keyCode || event.charCode;
        const keys = [/*del*/8, 46 /*arrows*/, 37, 38, 39, 40]
        let selectedText
        if (-1 != keys.indexOf(key) && event.target.value) {
            event.target.setSelectionRange(0, el.value.length)
        } else if ((selectedText = getSelectedText())) {
            event.target.setSelectionRange(0, el.value.length)
        }
    })
    /**
     * Makes sure content gets all deleted when using DEL or BACKSPACE key 
     * when setting the cursor manually
     * -- not needed if 'click' listener uses timeout --
     */
    el.addEventListener('keydown', (event) => {
        if (useTimeout)
            return
        if (!isValidPosition())
            return
        const key = event.keyCode || event.charCode;
        const keys = [/*del*/8, 46 /*arrows*/, 37, 38, 39, 40]
        if (-1 != keys.indexOf(key) && event.target.value) {
            event.target.setSelectionRange(0, el.value.length)
        }
    })
}