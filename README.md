TypedFunc
=========

Allows creating functions in Javascript with Typed arguments and defaults.

[![Build Status](https://secure.travis-ci.org/christopherdebeer/TypedFunc.png)](http://travis-ci.org/christopherdebeer/TypedFunc)


Convensions
===========

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
	
	// Classical

	// Create TypedFunc
	var classical = new TypedFunc("string", function(a){
		return a
	})

	// Call typedFunc
	classical(23)
	// throws error invalid function return type

	// NodeJS Convention
	
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

