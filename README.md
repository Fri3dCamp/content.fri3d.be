# content.fri3d.be

## Introduction

This is the Fri3d Content webapp collection, including an implementation for the Call For Participation.

## Create a (local) Mongo instance

```bash
$ mongo
MongoDB shell version v3.4.5
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.4.5
> use admin
switched to db admin
> db.auth("admin", "admin" )
1
> use fri3d
switched to db fri3d
> db.createUser({ user: "fri3d", pwd: "fri3d", roles: [ { role: "readWrite", db: "fri3d" }] } )
Successfully added user: {
	"user" : "fri3d",
	"roles" : [
		{
			"role" : "readWrite",
			"db" : "fri3d"
		}
	]
}
> use fri3d
switched to db fri3d
> db.auth("fri3d", "fri3d")
1
```

## Run the Content site

```bash
$ virtualenv venv
$ . venv/bin/activate
(venv) $ pip install -r requirements.txt
(venv) $ python run.py
```

## Generate CSS

CSS is generated from the *.less files in fri3d/static/less, which are translated to *.css files and placed in fri3d/static/css via a Gulp task.

Gulp is used to parse LESS, Gulp can be installed through npm. All the required packages in package.json are related to CSS generation.

Installing gulp and necessary dependencies, from the root of the project:
```bash
$ npm install
```

Generate readable css, from the root of the project:
```bash
$ gulp dev
```

Generate compact css, from the root of the project:
```bash
$ gulp
```

## Dependencies

* [Bootstrap](http://getbootstrap.com)
* [Bootstrap Dialog](https://nakupanda.github.io/bootstrap3-dialog/)
* [Bootstrap Toggle](http://www.bootstraptoggle.com)
* [Font Awesome](http://fontawesome.io)
* [Notify JS](https://notifyjs.com)
* [Bootstrap Validator](http://1000hz.github.io/bootstrap-validator/)
