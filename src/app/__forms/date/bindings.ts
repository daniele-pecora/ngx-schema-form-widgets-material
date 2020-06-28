import { FormProperty } from "ngx-schema-form";

export const bindings = {
    '/date-picker':[{
      'input': function (event: any, formProperty?: FormProperty) {
        console.log('### input event target value: ', event.srcElement.value)
      },
      'change': function (event: any, formProperty?: FormProperty) {
        console.log('### change event target value: ', event.srcElement.value)
      },
      'select': function (event: any, formProperty?: FormProperty) {
        console.log('### select event target value: ', event.srcElement.value)
      },
      /** 
       * date format auto complete :
       * when typing the date separator character are added automatically
       */
    '_input': function (event: any, formProperty?: FormProperty) {
      console.log('### event target value: ', event.srcElement.value)
      
      if(!formProperty['dateFormatSettings']){
        formProperty['dateFormatSettings'] = {}

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
        const defaultDateFormat = 'dd.mm.yy'
        const dateFormat = formProperty.schema.widget.dateFormat || defaultDateFormat
        const formatMaxSize = dateFormat.length
        const separatorMeta = matchAll(dateFormat, new RegExp('[^YMDHSA]', 'gi'))
        const separatorChars = []
        const separatorPositions = []
        for (const sMeta of separatorMeta) {
          separatorChars.push(sMeta[0])
          separatorPositions.push(sMeta['index'])
        }

        formProperty['dateFormatSettings'].insertAt = insertAt
        formProperty['dateFormatSettings'].matchAll = matchAll
        formProperty['dateFormatSettings'].chars = separatorChars
        formProperty['dateFormatSettings'].positions = separatorPositions
        formProperty['dateFormatSettings'].formatMaxSize = formatMaxSize
        formProperty['dateFormatSettings'].dateFormat = dateFormat
      } 


      const insertAt = formProperty['dateFormatSettings'].insertAt
      const separatorChars = formProperty['dateFormatSettings'].chars
      const separatorPositions = formProperty['dateFormatSettings'].positions
      const formatMaxSize = formProperty['dateFormatSettings'].formatMaxSize

      if (event.srcElement.value) {

        if (event.srcElement.value.length > formatMaxSize) {
          /** remove max length exceeded  */
          event.srcElement.value = event.srcElement.value.substring(0, formatMaxSize)
          return
        }

        let _posOfSep
        if (
          // last character is a separator position
          -1 !== (_posOfSep = separatorPositions.indexOf(event.srcElement.value.length - 1))
          ) {

        } else {
            if (
              // last character is a known separator itself
              -1 !== separatorChars.indexOf(event.srcElement.value.slice(-1))) {
                /** remove separator char when not in expected position */
              event.srcElement.value = event.srcElement.value.substring(0, event.srcElement.value.length - 1)
            }
            return
        }

        if (-1 !== separatorChars.indexOf(event.srcElement.value.slice(-1))) {
          /** don't do anything if separator character was typed */
          return
        }

        let hasChanges = false
        let val = event.srcElement.value.split('')
        let count = 0
        for (const p of separatorPositions) {
          if (val[p] && val[p] !== separatorChars[count]) {
            val = insertAt(val, separatorChars[count], p)
            hasChanges = true
          }
          count++
        }
        if (hasChanges) {
          event.srcElement.value = val.join('')
        }
        if (event.srcElement.value.length === formatMaxSize) {
          /* just in case any listener is bound */
          event.srcElement.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
          /** update value in model */
          formProperty.setValue(event.srcElement.value, false)
          formProperty.updateValueAndValidity(false, false)
        }
      }
    }
  }]
}