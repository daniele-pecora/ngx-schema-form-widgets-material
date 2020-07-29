# [Opensearch](https://de.wikipedia.org/wiki/OpenSearch)

[Opensearch](https://de.wikipedia.org/wiki/OpenSearch) is a search option that appears in the browsers address bar when you type the pages domain name.

The configuration file is located at `src/assets/opensearchdescription.xml` and included in `index.html` via 

```html
<link type="application/opensearchdescription+xml"
        rel="search"
        href="assets/opensearchdescription.xml"
        title="Search in app"/>
```

It will sumbits the search-term (`{searchTerm}`) as url fragment (hash), so the page will remain.

A script should that listen on `hashchange` event and do its thing

```javascript
    window.addEventListener('hashchange',function(){console.log(arguments)})
```