# elasticsearch-query-builder

Utility to assist in building Elasticsearch query JSON.

Features:
* Wildcards (?, *) in string input
* Collates boolean choices into an array of keys, e.g. `{red: true, green: false}`

## Installation

```sh
$ npm install elasticsearch-query-builder
``` 

## Usage

The following example will match any Smith whose first name starts with John (e.g, John, Johnny)
who has chosen either green or blue. 

```js
var esqbuilder = require('elasticsearch-query-builder');

var q = {};

var c = {
	firstname: 'John*',
	lastname: 'Smith',
	choices: {red:false, green:true, blue:true}
};

esqbuilder.stringCriteria(c.firstname, q, 'firstname');
esqbuilder.stringCriteria(c.lastname, q, 'lastname');
esqbuilder.selectCriteria(c.choices, q, 'choices');
console.log('Elasticsearch query:', JSON.stringify(q, null, '  '));
```

The output is:
```js
Elasticsearch query: {
  "filter": {
    "and": [
      {
        "query": {
          "wildcard": {
            "firstname": "john*"
          }
        }
      },
      {
        "term": {
          "lastname": "smith"
        }
      },
      {
        "terms": {
          "choices": [
            "blue",
            "green"
          ]
        }
      }
    ]
  }
}
```

## API

#### .stringCriteria(stringValue, queryObject, queryProperty)


#### .selectCriteria(selectObjectValue, queryObject, queryProperty)


##License

(The MIT License)

Copyright (c) 2014 Leonard Wu <leonard.wu92@alumni.ic.ac.uk>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
