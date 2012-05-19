TypedFunc
=========

Allows creating functions in Javascript with Typed arguments and defaults.

[![Build Status](https://secure.travis-ci.org/christopherdebeer/TypedFunc.png)](http://travis-ci.org/christopherdebeer/TypedFunc)


Convensions
===========

The classical Thrown Error

	var classical = new TypedFunc({x: {default: "A"}}, function(x){
		return x
	})

	classical()

	classical(23)

	classical("Hello World")

The Node Callback Error

	var nodeJSConv = new TypedFunc({a: {type: "string"}}, function(a, callback){
		callback(null, "success : " + a)
	})

	nodeJSConv(function(err, data){
		if (err) console.log(err)
		else console.log(data)
	});

	nodeJSConv(function(err, data){
		if (err) console.log(err)
		else console.log(data)
	});

Typed Functions
===============



Typed Arguments
===============

Argument Defaults
==================





