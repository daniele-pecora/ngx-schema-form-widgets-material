
# Static libaries

Static libraries will be used to build the demo app and compile against them.  
They are only in use when the required library version has not been released yet (e.g. `ngx-schema-form`).  

But when they are release the dependecy in the [`package.json`](../package.json) should be udpated.

Example update from 
```json
{
  "dependencies": {
    "ngx-schema-form": "file:./libs/ngx-schema-form-2.5.3.tgz"
  }
}

```

to
```json
{
  "dependencies": {
    "ngx-schema-form": "2.5.3"
  }
}

```