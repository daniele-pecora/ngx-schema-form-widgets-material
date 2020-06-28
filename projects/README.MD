# build libraries

Due to a bug in typescript/angular compiler there are two 
workarounds made in `tsconfig.lib.json` that may be reverted in future

Workaround:
```json
{
  ...
  "angularCompilerOptions": {
    "annotateForClosureCompiler": false,
    "fullTemplateTypeCheck": false,
  },
  ...
}
```

Regular:
```json
{
  ...
  "angularCompilerOptions": {
    "annotateForClosureCompiler": true,
    "fullTemplateTypeCheck": true,
  },
  ...
}
```



## `annotateForClosureCompiler`

When set `"annotateForClosureCompiler":true` it will throw messages like 
```
  the type annotation on @param is redundant with its TypeScript type, remove the {...} part

```

## `fullTemplateTypeCheck`

When set `"fullTemplateTypeCheck":true` it will throw messages like 
```
  ... .html(221,36): : Expected 3 arguments, but got 2.
  
```
or when you make use of unused element references like `<input #somePropertyName ...>`
```
  ... .html(55,25): : Property 'somePropertyName' does not exist on type 'MyComponent'.

  
```


## Synthetic default imports


Since `import * as moment from 'moment'` does not work anymore
we have to enable synthetic default imports in `tsconfig.json` or `tsconfig.lib.json`

```
  "compilerOptions": {
    ...
    "allowSyntheticDefaultImports": true,
    ...
  }
```


Source: https://momentjs.com/docs/


## `for of ` on objects 
`for of` loops lead to undefined because of method `___value(...)` in tslib.js
This happenend when accessing the stepper items in wizard-widget and adding an item in array-widget.
DON'T USE `for of` on objects, only for arrays.
