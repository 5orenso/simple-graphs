# simple-graphs

[![Build Status](https://travis-ci.org/5orenso/simple-graphs.svg?branch=master)](https://travis-ci.org/5orenso/simple-graphs)
[![Coverage Status](https://coveralls.io/repos/github/5orenso/simple-graphs/badge.svg?branch=master)](https://coveralls.io/github/5orenso/simple-graphs?branch=master)
[![GitHub version](https://badge.fury.io/gh/5orenso%2Fsimple-graphs.svg)](https://badge.fury.io/gh/5orenso%2Fsimple-graphs)

A nice and light graph module for use on your website.

### Howto to get started

1. Get the [release file](release/simple-graphs-0.1.0.js) and place it somewhere nice on your server.

2. Add this to your html:
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

Then you should have a scalable SVG graph looking like this:
![example-1](examples/example-1.jpg)


### Versioning

For transparency and insight into the release cycle, releases will be
numbered with the follow format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backwards compatibility bumps the major
* New additions without breaking backwards compatibility bumps the minor
* Bug fixes and misc changes bump the patch

For more information on semantic versioning, please visit http://semver.org/.


## Contributions and feedback:

We ❤️ contributions and feedback.

If you want to contribute, please check out the [CONTRIBUTING.md](CONTRIBUTING.md) file.

If you have any question or suggestion create an issue.

Bug reports should always be done with a new issue.


## Other Resources

* [AWS Basic setup with Cloudformation](https://github.com/5orenso/aws-cloudformation-base)
* [AWS Lambda boilerplate](https://github.com/5orenso/aws-lambda-boilerplate)
* [Automated AWS Lambda update](https://github.com/5orenso/aws-lambda-autodeploy-lambda)
* [AWS API Gateway setup with Cloudformation](https://github.com/5orenso/aws-cloudformation-api-gateway)
* [AWS IoT setup with Cloudformation](https://github.com/5orenso/aws-cloudformation-iot)


## More about the author

- Twitter: [@sorenso](https://twitter.com/sorenso)
- Instagram: [@sorenso](https://instagram.com/sorenso)
- Facebook: [@sorenso](https://facebook.com/sorenso)
