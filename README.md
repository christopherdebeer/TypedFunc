TypedFunc
=========

Allows creating Typed Functions in Javascript with Typed Arguments and default argument values. All Optional.

[![Build Status](https://secure.travis-ci.org/christopherdebeer/TypedFunc.png)](http://travis-ci.org/christopherdebeer/TypedFunc)

Conventions
===========

This library is split in two, basically divided by convention, so whether you hate callbacks ([Classical convention](#the-classical-convention)), or love to Node ([Node callback convention](#the-node-callback-convention)). This library caters for your taste. Its core features are applied splightly differently for each convention (as appropriate). But Both conventions will allow you to declare Types for your arguments, as well as default values if arguments are `undefined` .

* **Classical Convention** - Will throw errors when invalid argument types are passed, or if a function returns an invalid type.
	
	[Typed Arguments](#1a-typed-arguments)
	
	[Typed Functions](#1b-typed-functions)
	
	[Argument Defaults](#1c-argument-defaults)

* **Node Callback Convention** - Will pass the relevant error as the first parameter of your callback, if an argument type is invalid, or if values passed to your callback are of an invalid type.
	
	[Typed Arguments](#2a-typed-arguments)
	
	[Typed Functions](#2b-typed-functions)
	
	[Argument Defaults](#2c-argument-defaults)


Install & Setup
===============

**In the Browser:**

Include the script in your page before using TypedFunc():
	
	<script type="text/javascript" src="path/to/TypedFunc.js" ></script>

If you want to enable line numbers in your errors, then you need to include `stacktrace.js` before `TypedFunc.js`.

**In NodeJS**

Install with npm: `npm install TypedFunc`
And then require it in your project like so: `var TypedFunc = require("TypedFunc");`

**Setup for Both Bowser & NodeJS**

You Can specify your preference of convention before using `TypedFunc()` by doing the following:

	TypedFunc({
		errors: "Throw", // either "Throw" or "Pass"
		trace: false // optional, true - includes line numbers for debugging.
	})

	var test = TypedFunc( [return Type(s)], [attribute Types & Defaults], [function] );
	// this will follow the convention set above


Or you can do it on a per instance basis, like so: 

	var classicalErrors = (new TypedFunc()).throws( [return Type(s)], [attribute Types & Defaults], [function] );

	var continuationStyle = (new TypedFunc()).passes( [return Type(s)], [attribute Types & Defaults], [function] )


The Classical Convention
========================

###1a Typed Arguments

You can define any types you like for your arguments: `{x: {type: "xxxx"}}`, a string (ie: "number", "object", "string") denotes a `typeof x === xxxx` check, and an Object - such as a `new Person()` can be defined as `{x: {type: Person}}` and will perform an `x instanceof Person` check.
	
	// Create TypedFunc
	var classical = (new TypedFunc()).throws({x: {type: "string"}}, function(x){
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
	
	var classical = (new TypedFunc()).throws({x: {type: ["string", "number"]}}, function(x){
		return x
	})

	// now it will accept either a "string" or an "number". neat!


###1b Typed Functions

You can define a function as a sprecific Type. This performs a check that your function returns the required type otherwise it will throw an error.

	// Create TypedFunc
	var classical = (new TypedFunc()).throws("string", {}, function(x){
		return x
	})

	// Call TypedFuncs

	classical()
	// throws error invalid function return type

	classical(23)
	// throws error invalid function return type

	classical("Hello World")
	// returns "Hello World"

Again, you can specify Multiple Types for the return value, by providing an array, like so:

	var classical = (new TypedFunc()).throws(["string", "number"], {}, function(x){
		return x
	})

	// now it will return either a "string" or an "number". and if not, will throw an error.

###1c Argument Defaults

Argument defaults act the same in both conventions, and merely check for `undefined` arguments and if found replace with provided defaults.
	
	// Create TypedFunc
	var classical = (new TypedFunc()).throws({a {default: "A"}}, function(a){
		return a
	})

	// Call TypedFunc
	classical()
	// returns "A"

The Node Callback Convention
============================

The Style, follows the `function(err, data) {}` convention from NodeJS. where errors are passed to the function itself instead of being Thrown.

###2a Typed Arguments

You can define any types you like for your arguments: `{x: {type: "xxxx"}}`, a string (ie: "number", "object", "string") denotes a `typeof x === xxxx` check, and an Object - such as a `new Person()` can be defined as `{x: {type: Person}}` and will perform an `x instanceof Person` check.
	
	// Create TypedFunc
	var nodeJSConv = (new TypedFunc()).passes({a: {type: "string"}}, function(a, callback){
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

You can also specify Multiple argument types by providing them as an array, like so:

	// Create TypedFunc
	var nodeJSConv = (new TypedFunc()).passes({a: {type: ["string", Person]}}, function(a, callback){
		callback(null, a)
	})

	// Call TypedFuncs

	var x = new Person("Dave");

	nodeJSConv(x ,function(err, data){
		if (err) console.log("Error: ", err)
		else console.log("Success: ", data)
	});

	// this will output Success: [Object Person] ie: would work for both `numbers` and `Persons` 
	// and pass a non null error for all other argument types.


###2b Typed Functions

Applying the Typed Function return concept to Callback style functions is rather tricky, but TypedFunc achieves this by replacing your callback with an interceptor and evaluating the arguments passed to it. So as can be seen below if the value passed to `callback` is not of the type `number` then a non null error will be passed to the callback.
	
	// Create TypedFunc
	var nodeJSConv = (new TypedFunc()).passes("number", function(a, callback) {
		callback(null, "Success: " + a)
	})

	// Call TypedFunc
	nodeJSConv("Test", function(err, data) {
		if (err) console.log("Error: ", err)
		else console.log("Success: ", data)
	})  
	// outputs Error: Invalid function return type

###2c Argument Defaults

Argument defaults act the same in both conventions, and merely check for `undefined` arguments and if found replace with provided defaults.

	// Create TypedFunc
	var nodeJSConv = (new TypedFunc()).passes({a: {default: "B"}}, function(a, callback) {
		callback(null, "Success: " + a)
	})

	// Call TypedFunc
	nodeJSConv("Test", function(err, data) {
		if (err) console.log("Error: ", err)
		else console.log("Success: ", data)
	})  
	// ouputs Success: B



###License

Copyright (C) 2012 Christopher de Beer

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



[@christopherdb](http://twitter.com/christopherdb)

