TypedFunc
=========

Allows creating functions in Javascript with Typed arguments and defaults.

[![Build Status](https://secure.travis-ci.org/christopherdebeer/TypedFunc.png)](http://travis-ci.org/christopherdebeer/[TypedFunc])


	var test = TypedFunc({a: {default: "A", type: "string"}, b: {default: 2, type: "number"}}, function(a, b){
	    console.log("A: ", a);
	    console.log("B: ", b);
	});

	test("A")
	// A: A
	// B: 2

	test("A", "B")
	// Throws Error: "Invalid type. <b> should be number but was string."

	test("C", 12);
	// A: C
	// B: 12
