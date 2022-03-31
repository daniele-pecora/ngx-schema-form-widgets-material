import { HttpApiServiceOptions, WidgetComponentHttpApiService } from '../_service/widget-component-http-api.service'
import { Subscription } from 'rxjs'
import { OnDestroy } from '@angular/core'
import { FormProperty } from 'ngx-schema-form'
import { ExpressionCompiler } from '../_service/expression-complier.service'

export class AutocompleteAsyncHelper implements OnDestroy {

  constructor(private name, private formProperty, private schema, private lookupService: WidgetComponentHttpApiService
    , private expressionCompiler: ExpressionCompiler) {
    this.name = name
    this.formProperty = formProperty
    this.schema = schema
    this.lookupService = lookupService
  }

  private lookupServiceSub: Subscription

  private logExpressionError(propertyName, actionName, expressionString, result, err) {
    const ar: any[] = this.createErrorLog(propertyName, actionName, expressionString, err, result)
    console.error('AUTOCOMPLETE ERROR', ...ar)
  }

  private createErrorLog(propertyName, actionName, expressionString, result, err): any[] {
    return [
      `Failed to ${actionName} expression property "${propertyName}" in 'selection.widget' 
    for path ${this.formProperty.path} in field ${this.name}`
      , '\n'
      , `Expression: ${expressionString}`, '\n'
      , 'From context: ', result
      , err
    ]
  }

  private findPlaceholder(content: string = '', list: string[] = []): string[] {
    let sIndex
    let eIndex
    if ((-1 !== (sIndex = content.indexOf('{'))) && (-1 !== (eIndex = content.indexOf('}')))) {
      const pl = content.substring(sIndex + 1, eIndex)
      list.push(pl)
      const newContent = content.substring(0, sIndex) + content.substring(eIndex + 1, content.length)
      return this.findPlaceholder(newContent, list)
    }
    return list
  }

  private findValues(url: string): any {
    const list = this.findPlaceholder(url, [])
    const values = {}
    for (const path of list) {
      values[path] = ''
      const p: FormProperty = this.formProperty.findRoot().getProperty(path.replace(new RegExp('\\.', 'ig'), '/'))
      if (p) {// && p.value
        values[path] = p.value
      }
    }
    return values
  }

  private makeReplacement(stringValue: string, replacements: { [key: string]: string }): string {
    let generatedValue = stringValue
    for (const key of Object.keys(replacements)) {
      const _regKey = '{' + key + '}'
      generatedValue = generatedValue.replace(new RegExp(_regKey, 'g'), replacements[key]||'')
    }
    return generatedValue
  }

  private precheckExpressions() {
    if (this.schema.widget.resultExpression) {
      try {
        /**
         * just a check
         */
        const _funR = new Function('data', `return ${this.schema.widget.resultExpression}`)
      } catch (err) {
        this.logExpressionError('PRECHECK resultExpression', 'evaluate', this.schema.widget.resultExpression, null, err)
        throw new Error('Failed to evaluate expression property \'resultExpression\' in \'selection.widget\'')
      }
    }
    if (this.schema.widget.labelExpression) {
      try {
        /**
         * just a check
         */
        const _funI = new Function('item', `return ${this.schema.widget.labelExpression}`)
      } catch (err) {
        this.logExpressionError('PRECHECK labelExpression', 'evaluate', this.schema.widget.labelExpression, null, err)
        throw new Error('Failed to evaluate expression property \'labelExpression\' in \'selection.widget\'')
      }
    }
    if (this.schema.widget.valueExpression) {
      try {
        /**
         * just a check
         */
        const _funV = new Function('item', `return ${this.schema.widget.valueExpression}`)
      } catch (err) {
        this.logExpressionError('PRECHECK valueExpression', 'evaluate', this.schema.widget.valueExpression, null, err)
        throw new Error('Failed to evaluate expression property \'valueExpression\' in \'selection.widget\'')
      }
    }

  }

  search(additionalReplacements?: { [key: string]: string }, onComplete?: (keyValueMap: KeyValuePair[], keys: string[]) => void) {
    if (this.lookupServiceSub) {
      this.lookupServiceSub.unsubscribe()
    }
    const url = this.schema.widget.serviceUrl
    if (url) {
    } else {
      throw new Error('Missing property serviceUrl in selection.widget')
    }

    if (this.schema.widget.precheckExpressions) {
      this.precheckExpressions()
    }

    const onSearchReady = (data) => {
      const keyValues: KeyValuePair[] = []
      const keys: Array<string> = []

      let _results = []
      if (this.schema.widget.resultExpression) {
        try {
          _results = this.expressionCompiler.evaluate(this.schema.widget.resultExpression, { data: data })
        } catch (err) {
          this.logExpressionError('resultExpression', 'execute', this.schema.widget.resultExpression, data, err)
          throw new Error('Failed to execute expression property \'resultExpression\' in \'autocomplete.widget\'')
        }
      } else {
        _results = data
      }

      // prevent null or undefined
      _results = _results || []

      for (const _item of _results) {
        let labelValue = null
        let valueValue = null
        if (this.schema.widget.labelExpression) {
          try {
            labelValue = this.expressionCompiler.evaluate(this.schema.widget.labelExpression, { item: _item })
          } catch (err) {
            this.logExpressionError('labelExpression', 'execute', this.schema.widget.labelExpression, _item, err)
            throw new Error('Failed to execute expression property \'labelExpression\' in \'selection.widget\'')
          }
        } else {
          labelValue = _item.toString()
        }
        if (this.schema.widget.valueExpression) {
          try {
            valueValue = this.expressionCompiler.evaluate(this.schema.widget.valueExpression, { item: _item })
          } catch (err) {
            this.logExpressionError('valueExpression', 'execute', this.schema.widget.valueExpression, _item, err)
            throw new Error('Failed to execute expression property \'valueExpression\' in \'selection.widget\'')
          }
        } else {
          valueValue = _item
        }
        /**
         * No duplicates
         */
        if (-1 === keys.indexOf(labelValue)) {
          keys.push(labelValue)
          keyValues.push({ key: labelValue, value: valueValue })
        }
      }
      if (onComplete) {
        onComplete(keyValues, keys)
      }
    }

    const httpRequestOptions = Object.assign({}, (this.schema.widget || {}).serviceOptions || {})
    /**
     * Finally add the query replacement
     */
    const preparedOptions = this.updateValues(url, httpRequestOptions, additionalReplacements)
    this.lookupServiceSub = this.lookupService
      .request(preparedOptions.url, preparedOptions.options as HttpApiServiceOptions)
      .subscribe(onSearchReady,
        (error) => {
          console.error(error)
        }, () => {
          // if (onComplete) {
          //   onComplete({}, [])
          // }
        })
  }

  private updateValues(url: string, requestOptions: any, additionalReplacements: { [key: string]: string } = {}): {
    url: string,
    options: {
      params?: { [key: string]: string | string[] },
      headers?: { [key: string]: string | string[] }
    }, replacements: { [key: string]: string }
  } {

    const options = JSON.parse(JSON.stringify(requestOptions))

    let replacements = {}
    replacements = Object.assign(replacements, this.findValues(url))

    let v = []
    for (const p of Object.keys(options.params || {})) {
      v.push(null != options.params[p] ? options.params[p] : '')
    }

    for (const p of Object.keys(options.headers || {})) {
      v.push(null != options.headers[p] ? options.headers[p] : '')
    }
    if (v.length) {
      replacements = Object.assign(replacements, this.findValues(v.join(';;')))
    }
    for (const placeholder of Object.keys(additionalReplacements || {})) {
      replacements[placeholder] = null != additionalReplacements[placeholder] ? additionalReplacements[placeholder] : ''
    }

    const serviceUrl = this.makeReplacement(url, replacements)

    for (const p of Object.keys(options.params || {})) {
      options.params[p] = this.makeReplacement(options.params[p], replacements)
    }
    for (const p of Object.keys(options.headers || {})) {
      options.headers[p] = this.makeReplacement(options.headers[p], replacements)
    }
    return { url: serviceUrl, options: options, replacements: replacements }
  }

  ngOnDestroy(): void {
    if (this.lookupServiceSub) {
      this.lookupServiceSub.unsubscribe()
    }
  }

}

export interface KeyValuePair {
  key: any
  value: any
}
