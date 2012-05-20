TypedFunc
=========

Allows creating Typed Functions in Javascript with Typed Arguments and default argument values. All Optional.

[![Build Status](https://secure.travis-ci.org/christopherdebeer/TypedFunc.png)](http://travis-ci.org/christopherdebeer/TypedFunc)

Convensions
===========

This library is split in two, basically divided by convension, so whether you hate callbacks ([Classical convension](#classical)), or love to Node ([Node callback convension](#node)). This library caters for your taste. Its core features are applied splightly differently for each convention (as appropriate). But Both conventions will allow you to declare Types for your arguments, as well as default values if arguments are `undefined` .

* *Classical Convension* - Will throw errors when invalid argument types are passed, or if a function returns an invalid type.
	* Typed Functions
	* Typed Arguments
	* Argument Defaults

* *Node Callback Convension* - Will pass the relivant error as the first parameter of your callback, if an argument type is invalid, or if values passed to your callback are of an invalid type.
	* Typed Functions
	* Typed Arguments
	* Argument Defaults

Setup
-----

	TypedFunc({
		errors: "Throw" // 
	})

The classical Thrown Error
	
	// Create TypedFunc
	var classical = new TypedFunc({x: {type: string"}}, function(x){
		return x
	})

	// Call TypedFuncs

	classical()
	// throws error invalid argument type

	classical(23)
	// throws error invalid argument type

	classical("Hello World")
	// returns "Hello World"

The Node Callback Error
	
	// Create TypedFunc
	var nodeJSConv = new TypedFunc({a: {type: "string"}}, function(a, callback){
		callback(null, "success : " + a)
	})

	// Call TypedFuncs

	nodeJSConv(23 ,function(err, data){
		if (err) console.log("Error: ", err)
		else console.log("Success: ", data)
	});
	// outputs Error: invalid argument type

	nodeJSConv("Hello World", function(err, data){
		if (err) console.log("Error: ", err)
		else console.log("Success: ", data)
	});
	// outputs Success: Hello World

Typed Functions
===============
	
Classical

	// Create TypedFunc
	var classical = new TypedFunc("string", function(a){
		return a
	})

	// Call typedFunc
	classical(23)
	// throws error invalid function return type

NodeJS Convention
	
	// Create TypedFunc
	var nodeJSConv("number", function(a, callback) {
		callback(null, "Success: " + a)
	})

	// Call TypedFunc
	nodeJSConv("Test", function(err, data) {
		if (err) console.log("Error: ", err)
		else console.log("Success: ", data)
	})  
	// outputs Error: Invalid function return type



Typed Arguments
===============

	

Argument Defaults
==================

	// Classical

	// Create TypedFunc
	var classical = new TypedFunc({a {default: "A"}}, function(a){
		return a
	})

	// Call TypedFunc
	classical()
	// returns "A"

	// NodeJS Convention

	// Create TypedFunc
	var nodeJSConv({a: {default: "B"}}, function(a, callback) {
		callback(null, "Success: " + a)
	})

	// Call TypedFunc
	nodeJSConv("Test", function(err, data) {
		if (err) console.log("Error: ", err)
		else console.log("Success: ", data)
	})  
	// ouputs Success: B




MIT Licenced
by Christopher de Beer
@christopherdb

