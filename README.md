# content.fri3d.be

## Introduction

This is the Fri3d Content webapp collection, including an implementation for the Call For Participation.

## Generate CSS

CSS is generated from the *.less files in fri3d/static/less, which are translated to *.css files and placed in fri3d/static/css via a Gulp task.

Gulp is used to parse LESS, Gulp can be installed through npm. All the required packages in package.json are related to CSS generation.

Installing gulp and necessary dependencies, from the root of the project:
```bash
$ npm install
```

Install the gulp-cli package:
```bash
$ npm install --global gulp-cli
```

Generate readable css, from the root of the project:
```bash
$ gulp dev
```

Generate compact css, from the root of the project:
```bash
$ gulp
```

## Run the Content site

```bash
$ virtualenv venv
$ . venv/bin/activate
(venv) $ pip install -r requirements.txt
(venv) $ python run.py
```

## Dependencies

* [Bootstrap](http://getbootstrap.com)
* [Bootstrap Dialog](https://nakupanda.github.io/bootstrap3-dialog/)
* [Notify JS](https://notifyjs.com)
* [Bootstrap Validator](http://1000hz.github.io/bootstrap-validator/)
