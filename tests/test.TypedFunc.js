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


// test arrays of typed function returns (ie: options)

var test4 = new TypedFunc(["string", "number"], {}, function(a){
	return a
})

assert.doesNotThrow( function(){ test4(2); }, "Test 4a: Should not throw an error.");
assert.equal(typeof test4(2), "number", "Test 4b: Should return typeof 'number'.");

assert.doesNotThrow( function(){ test4(2); }, "Test 4c: Should not throw an error.");
assert.equal(typeof test4(2), "number", "Test 4d: Should return typeof 'number'.");

assert.throws( function(){ test4({an: "object"}); }, "Test 4e: Should throw an error - Invalid function return type.");
assert.throws( function(){ test4(["an", "array"]); }, "Test 4f: Should throw an error - Invalid function return type.");


// creating custom types / inheritance and instanceOf checking

function CustomType (x) {
	this.prop = {x: x*2}
}
function CustomTypeII (x) {
	this.prop = {x: x+2}
}

var test5 = new TypedFunc(CustomTypeII, {}, function(a){
	return a
})

assert.throws( function(){ test5(new CustomType(2)); }, "Test 5a: Should throw an error - Invalid function return type.");
assert.doesNotThrow( function(){ test5(new CustomTypeII(57)); }, "Test 5b: Should not throw an arror.");

// arrays of types and instancesof checks for arguments

var test5c = new TypedFunc({a: {type: ["string", CustomType]}, b: {default: new CustomTypeII(34)}}, function(a, b){
	return {a: a, b: b}
})

assert.doesNotThrow(function(){ test5c(new CustomType("A")); }, "Test 5c: Should not throw an error");
assert.doesNotThrow(function(){ test5c("Hello World"); }, "Test 5d: Should not throw an error");
assert.doesNotThrow(function(){ test5c(new CustomType("B"), "overideDef"); }, "Test 5e: Should not throw an error");

assert.throws(function(){ test5c(new CustomTypeII("A")); }, "Test 5f: Should throw an error - Invalid argument type");
assert.throws(function(){ test5c(5,2); }, "Test 5g: Should throw an error - Invalid argument type");
assert.throws(function(){ test5c({an: "object"}, "overideDef"); }, "Test 5h: Should throw an error - Invalid argument type");


// Change settings for next series of tests
// pass errors to callback functions

TypedFunc({
	errors: "Node",
	trace: false
})

var test6 = new TypedFunc({a: {type: "string"}}, function(a, callback){
	callback(null, "success : " + a);
})


test6("Hi", function(err, returns){
	assert.equal(err, null, "Test 6a: Should return null error to the callback.");
	assert.notEqual(returns, null, "Test 6b: Should return a non null returns to the callback.");
});

test6(23, function(err, returns){
	assert.notEqual(err, null, "Test 6c: Should return a non null error to the callback.");
	assert.equal(returns, null, "Test 6d: Should not return anthing other than an error to the callback.");
});

test6(null, function(err, returns){
	assert.notEqual(err, null, "Test 6e: Should return a non null error to the callback.");
	assert.equal(returns, null, "Test 6f: Should not return anthing other than an error to the callback.");
});





var test7 = new TypedFunc("string", {a: {type: "string"}}, function(a, callback){
	callback(null, "success : " + a);
})


test7("Hi", function(err, returns){
	assert.equal(err, null, "Test 7a: Should return null error to the callback.");
	assert.notEqual(returns, null, "Test 7b: Should return a non null returns to the callback.");
});

test7(23, function(err, returns){
	assert.notEqual(err, null, "Test 7c: Should return a non null error to the callback.");
	assert.equal(returns, null, "Test 7d: Should not return anthing other than an error to the callback.");
});

test7(null, function(err, returns){
	assert.notEqual(err, null, "Test 7e: Should return a non null error to the callback.");
	assert.equal(returns, null, "Test 7f: Should not return anthing other than an error to the callback.");
});






var test8 = new TypedFunc(["string", "number"], {a: {type: ["string", "number"]}}, function(a, callback){
	callback(null, a);
})


test8("Hi", function(err, returns){
	assert.equal(err, null, "Test 8a: Should return null error to the callback.");
	assert.equal(typeof returns, "string", "Test 8b: Should return a string to the callback.");
});

test8(23, function(err, returns){
	assert.equal(err, null, "Test 8c: Should return a null error to the callback.");
	assert.equal(typeof returns, "number", "Test 8d: Should return a number to the callback.");
});

test8(null, function(err, returns){
	assert.notEqual(err, null, "Test 8e: Should return a non null error to the callback.");
	assert.equal(returns, null, "Test 8f: Should return the input to the callback.");
});















console.log("All OK")

