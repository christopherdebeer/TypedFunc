// Setup 

// if Node else Browser
if (typeof require === "function") {
	var TypedFunc = require('../TypedFunc.js');
	var assert = require('assert');
}

// Change settings for next series of tests
// Throw Errors

TypedFunc({
	errors: "Throw",
	trace: true
})

var test1 = new TypedFunc({x: {default: "A"}}, function(x){
	return x;
})

assert.equal(test1(), "A" , "Test 1a: Should return default value.");
assert.doesNotThrow(function(){ test1(); }, "Test 1b: Should not throw any errors.");
assert.doesNotThrow(function(){ test1("B"); }, "Test 1c: Should not thow any errors.");
assert.doesNotThrow(function(){ test1(12); }, "Test 1d: Should not throw any errors.");

var test2 = new TypedFunc({x: {default: "A", type: "string"}}, function(x){
	return x;
})

assert.equal(test1(), "A" , "Test 2a: Should return default value.");
assert.doesNotThrow(function(){ test2(); }, "Test 2b: Should not throw any errors.");
assert.doesNotThrow(function(){ test2("C"); }, "Test 2c: Should not throw any errors");
assert.throws(function(){ test2(42); }, "Test 2d: Should throw an error - Invalid argument type.");

var test3 = new TypedFunc("string", {}, function(a, b){
	return a + b;
})


assert.throws(function(){ test3(); }, "Test 3a: Should throw an error - Invalid function return type.");
assert.throws(function(){ test3(1, 2); }, "Test 3b: Should thow an error - Invalid return type.");
assert.doesNotThrow(function(){ test3("Hello", " World"); }, "Test 3c: Should not throw any errors.");



// Change settings for next series of tests
// pass errors to callback functions

TypedFunc({
	errors: "Node",
	trace: false
})

var test4 = new TypedFunc({a: {type: "string"}}, function(a, callback){
	callback(null, "success : " + a);
})


test4("Hi", function(err, returns){
	assert.equal(err, null, "Test 4a: Should return null error to the callback.");
	assert.notEqual(returns, null, "Test 4b: Should return a non null returns to the callback.");
});

test4(23, function(err, returns){
	assert.notEqual(err, null, "Test 4c: Should return a non null error to the callback.");
	assert.equal(returns, null, "Test 4d: Should not return anthing other than an error to the callback.");
});

test4(null, function(err, returns){
	assert.notEqual(err, null, "Test 4e: Should return a non null error to the callback.");
	assert.equal(returns, null, "Test 4f: Should not return anthing other than an error to the callback.");
});


console.log("All OK")

