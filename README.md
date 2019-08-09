# simple-graphs

[![Build Status](https://travis-ci.org/5orenso/fast-type-check.svg?branch=master)](https://travis-ci.org/5orenso/fast-type-check)
[![Coverage Status](https://coveralls.io/repos/github/5orenso/fast-type-check/badge.svg?branch=master)](https://coveralls.io/github/5orenso/fast-type-check?branch=master)
[![GitHub version](https://badge.fury.io/gh/5orenso%2Ffast-type-check.svg)](https://badge.fury.io/gh/5orenso%2Ffast-type-check)

A nice and light graph module for use on your website.

### Howto to get started

```html

    <div data-widget-host="simpleGraph">
        <script type="text/props">
            {
                "jsonData": "[{\"x\":0, \"y\":10},{\"x\":1, \"y\":15},{\"x\":2, \"y\":5}]",
                "width": 600,
                "height": 200,
                "yMax": 30,
                "showYTicks": 1,
                "yTicks": "[\"30°C\",\"15°C\",\"0°C\"]",
                "showXTicks": 1,
            }
        </script>
    </div>
    <script type="text/javascript" src="simple-graphs-0.1.0.js"></script>
```


### Howto upgrade modules
```bash
$ npm install -g npm-check-updates
$ ncu --upgrade
$ npm install --no-optional
```
