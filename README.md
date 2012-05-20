TypedFunc
=========

Allows creating Typed Functions in Javascript with Typed Arguments and default argument values. All Optional.

[![Build Status](https://secure.travis-ci.org/christopherdebeer/TypedFunc.png)](http://travis-ci.org/christopherdebeer/TypedFunc)

Convensions
===========

This library is split in two, basically divided by convension, so whether you hate callbacks ([Classical convension](#classical)), or love to Node ([Node callback convension](#node)). This library caters for your taste. Its core features are applied splightly differently for each convention (as appropriate). But Both conventions will allow you to declare Types for your arguments, as well as default values if arguments are `undefined` .

* **Classical Convension** - Will throw errors when invalid argument types are passed, or if a function returns an invalid type.
	
	[1b Typed Arguments](#1a-typed-arguments)
	
	[1a Typed Functions](#1b-typed-functions)
	
	[1c Argument Defaults](#1c-argument-defaults)

* **Node Callback Convension** - Will pass the relivant error as the first parameter of your callback, if an argument type is invalid, or if values passed to your callback are of an invalid type.
	* [Typed Functions](#21)
	* [Typed Arguments](#22)
	* [Argument Defaults](#23)


Setup
======

You need to specify your preference of convension before using `new TypedFunc()` by doing the following:

	TypedFunc({
		errors: "Throw", // either "Throw" or "Node"
		trace: false // optional includes line limbers for debugging.
	})


The Classical Convention
========================

#1a Typed Arguments

You can define any types you like for your arguments: `{x: {type: "xxxx"}}`, a string (ie: "number", "object", "string") denotes a `typeof x === xxxx` check, and an Object - such as a `new Person()` can be defined as `{x: {type: Person}}` and will perform an `x instanceof Person` check.
	
	// Create TypedFunc
	var classical = new TypedFunc({x: {type: "string"}}, function(x){
		return x
	})

	// Call TypedFuncs

	classical()
	// throws error invalid argument type

	classical(23)
	// throws error invalid argument type

	classical("Hello World")
	// returns "Hello World"

If you'd like to be less strict, you could also specify Multiple types for an argument, by putting them in an array, like so:
	
	var classical = new TypedFunc({x: {type: ["string", "number"]}}, function(x){
		return x
	})

	// now it will accept either a "string" or an "number". neat!


#1b Typed Functions

You can define a function as a sprecific Type. This performs a check that your function returns the required type otherwise it will throw an error.

	// Create TypedFunc
	var classical = new TypedFunc("string", {}, function(x){
		return x
	})

	// Call TypedFuncs

	classical()
	// throws error invalid function return type

	classical(23)
	// throws error invalid function return type

	classical("Hello World")
	// returns "Hello World"

Agaim, you can specify Multiple Types for the return value, by providing an array, like so:

	var classical = new TypedFunc(["string", "number"], {}, function(x){
		return x
	})

	// now it will return either a "string" or an "number". and if not, will throw an error.

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

