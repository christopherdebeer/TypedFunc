// Setup 

// if Node else Browser
if (typeof require === "function") {
	var TypedFunc = require('../TypedFunc.js');
	var assert = require('assert');
}
var count = 0;


// Change settings for next series of tests
// Throw Errors

TypedFunc({
	errors: "Throw",
	trace: true
})

var test1 = new TypedFunc({x: {default: "A"}}, function(x){
	return x;
})



assert.equal(test1(), "A" , "Test 1a: Should return default value."); count ++;
assert.doesNotThrow(function(){ test1(); }, "Test 1b: Should not throw any errors."); count ++;
assert.doesNotThrow(function(){ test1("B"); }, "Test 1c: Should not thow any errors."); count ++;
assert.doesNotThrow(function(){ test1(12); }, "Test 1d: Should not throw any errors."); count ++;

console.log("1: "+ count + "/" + count+ " Basic classical argument defaults. ");

var test2 = new TypedFunc({x: {default: "A", type: "string"}}, function(x){
	return x;
})

count = 0;
assert.equal(test1(), "A" , "Test 2a: Should return default value."); count ++;
assert.doesNotThrow(function(){ test2(); }, "Test 2b: Should not throw any errors."); count ++;
assert.doesNotThrow(function(){ test2("C"); }, "Test 2c: Should not throw any errors"); count ++;
assert.throws(function(){ test2(42); }, "Test 2d: Should throw an error - Invalid argument type."); count ++;

console.log("2: "+ count + "/" + count+ " Basic classical argument defaults /w Type. ");


var test3 = new TypedFunc("string", {}, function(a, b){
	return a + b;
})

count = 0;
assert.throws(function(){ test3(); }, "Test 3a: Should throw an error - Invalid function return type.");  count ++;
assert.throws(function(){ test3(1, 2); }, "Test 3b: Should thow an error - Invalid return type."); count ++;
assert.doesNotThrow(function(){ test3("Hello", " World"); }, "Test 3c: Should not throw any errors."); count ++;

console.log("3: "+ count + "/" + count+ " Basic function Return Type. ");


// test arrays of typed function returns (ie: options)

var test4 = new TypedFunc(["string", "number"], {}, function(a){
	return a
})

count = 0;
assert.doesNotThrow( function(){ test4(2); }, "Test 4a: Should not throw an error."); count ++;
assert.equal(typeof test4(2), "number", "Test 4b: Should return typeof 'number'."); count ++;

assert.doesNotThrow( function(){ test4(2); }, "Test 4c: Should not throw an error."); count ++;
assert.equal(typeof test4(2), "number", "Test 4d: Should return typeof 'number'."); count ++;

assert.throws( function(){ test4({an: "object"}); }, "Test 4e: Should throw an error - Invalid function return type."); count ++;
assert.throws( function(){ test4(["an", "array"]); }, "Test 4f: Should throw an error - Invalid function return type."); count ++;

console.log("4: "+ count + "/" + count+ " Multiple calassical Return Types. ");



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

count = 0;

assert.throws( function(){ test5(new CustomType(2)); }, "Test 5a: Should throw an error - Invalid function return type."); count ++;
assert.doesNotThrow( function(){ test5(new CustomTypeII(57)); }, "Test 5b: Should not throw an arror."); count ++;

// arrays of types and instancesof checks for arguments

var test5c = new TypedFunc({a: {type: ["string", CustomType]}, b: {default: new CustomTypeII(34)}}, function(a, b){
	return {a: a, b: b}
})

assert.doesNotThrow(function(){ test5c(new CustomType("A")); }, "Test 5c: Should not throw an error"); count ++;
assert.doesNotThrow(function(){ test5c("Hello World"); }, "Test 5d: Should not throw an error"); count ++;
assert.doesNotThrow(function(){ test5c(new CustomType("B"), "overideDef"); }, "Test 5e: Should not throw an error"); count ++;

assert.throws(function(){ test5c(new CustomTypeII("A")); }, "Test 5f: Should throw an error - Invalid argument type"); count ++;
assert.throws(function(){ test5c(5,2); }, "Test 5g: Should throw an error - Invalid argument type"); count ++;
assert.throws(function(){ test5c({an: "object"}, "overideDef"); }, "Test 5h: Should throw an error - Invalid argument type"); count ++;

console.log("5: "+ count + "/" + count+ " Multi Classical returns with Custom Instances. ");

// Change settings for next series of tests
// pass errors to callback functions

TypedFunc({
	errors: "Node",
	trace: false
})

var test6 = new TypedFunc({a: {type: "string"}}, function(a, callback){
	callback(null, "success : " + a);
})

count = 0;

test6("Hi", function(err, returns){
	assert.equal(err, null, "Test 6a: Should return null error to the callback."); count ++;
	assert.notEqual(returns, null, "Test 6b: Should return a non null returns to the callback."); count ++;
});

test6(23, function(err, returns){
	assert.notEqual(err, null, "Test 6c: Should return a non null error to the callback."); count ++;
	assert.equal(returns, null, "Test 6d: Should not return anthing other than an error to the callback."); count ++;
});

test6(null, function(err, returns){
	assert.notEqual(err, null, "Test 6e: Should return a non null error to the callback.");
	assert.equal(returns, null, "Test 6f: Should not return anthing other than an error to the callback.");
});


console.log("6: "+ count + "/" + count+ " Basic Node Convention Argument Types. ");




var test7 = new TypedFunc("string", {a: {type: "string"}}, function(a, callback){
	callback(null, "success : " + a);
})

count = 0;
test7("Hi", function(err, returns){
	assert.equal(err, null, "Test 7a: Should return null error to the callback."); count ++;
	assert.notEqual(returns, null, "Test 7b: Should return a non null returns to the callback."); count ++;
});

test7(23, function(err, returns){
	assert.notEqual(err, null, "Test 7c: Should return a non null error to the callback."); count ++;
	assert.equal(returns, null, "Test 7d: Should not return anthing other than an error to the callback."); count ++;
});

test7(null, function(err, returns){
	assert.notEqual(err, null, "Test 7e: Should return a non null error to the callback."); count ++;
	assert.equal(returns, null, "Test 7f: Should not return anthing other than an error to the callback."); count ++;
});


console.log("7: "+ count + "/" + count+ " Node Argument & Return Types. ");



var test8 = new TypedFunc(["string", "number"], {a: {type: ["string", "number", "object"]}}, function(a, callback){
	callback(null, a);
})

count = 0;
test8("Hi", function(err, returns){
	assert.equal(err, null, "Test 8a: Should return null error to the callback."); count ++;
	assert.equal(typeof returns, "string", "Test 8b: Should return a string to the callback."); count ++;
});

test8(23, function(err, returns){
	assert.equal(err, null, "Test 8c: Should return a null error to the callback."); count ++;
	assert.equal(typeof returns, "number", "Test 8d: Should return a number to the callback."); count ++;
});

test8(null, function(err, returns){
	assert.notEqual(err, null, "Test 8e: Should return a non null error to the callback."); count ++;
	assert.equal(returns, null, "Test 8f: Should return the input to the callback."); count ++;
});


test8({an: "object"}, function(err, returns){
	assert.notEqual(err, null, "Test 8g: Should return an error - Invalid return type"); count ++;
	assert.notEqual(returns, null, "Test 8h: Should still return invalid type"); count ++;
})


console.log("8: "+ count + "/" + count+ " Multi Node convention argument & return types. ");











console.log("All OK")

