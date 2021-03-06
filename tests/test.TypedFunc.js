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

var test1 = TypedFunc({x: {default: "A"}}, function(x){
	return x;
})



assert.equal(test1(), "A" , "Test 1a: Should return default value."); count ++;
assert.doesNotThrow(function(){ test1(); }, "Test 1b: Should not throw any errors."); count ++;
assert.doesNotThrow(function(){ test1("B"); }, "Test 1c: Should not thow any errors."); count ++;
assert.doesNotThrow(function(){ test1(12); }, "Test 1d: Should not throw any errors."); count ++;

console.log("1: "+ count + "/" + count+ " Basic classical argument defaults. ");

var test2 = TypedFunc({x: {default: "A", type: "string"}}, function(x){
	return x;
})

count = 0;
assert.equal(test1(), "A" , "Test 2a: Should return default value."); count ++;
assert.doesNotThrow(function(){ test2(); }, "Test 2b: Should not throw any errors."); count ++;
assert.doesNotThrow(function(){ test2("C"); }, "Test 2c: Should not throw any errors"); count ++;
assert.throws(function(){ test2(42); }, "Test 2d: Should throw an error - Invalid argument type."); count ++;

console.log("2: "+ count + "/" + count+ " Basic classical argument defaults /w Type. ");


var test3 = TypedFunc("string", {}, function(a, b){
	return a + b;
})

count = 0;
assert.throws(function(){ test3(); }, "Test 3a: Should throw an error - Invalid function return type.");  count ++;
assert.throws(function(){ test3(1, 2); }, "Test 3b: Should thow an error - Invalid return type."); count ++;
assert.doesNotThrow(function(){ test3("Hello", " World"); }, "Test 3c: Should not throw any errors."); count ++;

console.log("3: "+ count + "/" + count+ " Basic function Return Type. ");


// test arrays of typed function returns (ie: options)

var test4 = TypedFunc(["string", "number"], {}, function(a){
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

var test5 = TypedFunc(CustomTypeII, {}, function(a){
	return a
})

count = 0;

assert.throws( function(){ test5(new CustomType(2)); }, "Test 5a: Should throw an error - Invalid function return type."); count ++;
assert.doesNotThrow( function(){ test5(new CustomTypeII(57)); }, "Test 5b: Should not throw an arror."); count ++;

// arrays of types and instancesof checks for arguments

var test5c = TypedFunc({a: {type: ["string", CustomType]}, b: {default: new CustomTypeII(34)}}, function(a, b){
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
	errors: "Pass",
	trace: false
})

var test6 = TypedFunc({a: {type: "string"}}, function(a, callback){
	callback(null, "success : " + a);
})

count = 0;

test6("Hi", function(err, returns){
	assert.equal(err, null, "Test 6a: Should return null error to the callback."); count ++;
	assert.notEqual(returns, null, "Test 6b: Should return a non null returns to the callback."); count ++;
});

test6(23, function(err, returns){
	assert.notEqual(err, null, "Test 6c: Should return a non null error to the callback."); count ++;
	assert.equal(returns, null, "Test 6d: Should not return anything other than an error the callback."); count ++;
});

test6(null, function(err, returns){
	assert.notEqual(err, null, "Test 6e: Should return a non null error to the callback.");
	assert.equal(returns, null, "Test 6f: Should not return anything other than an error the callback.");
});


console.log("6: "+ count + "/" + count+ " Basic Node Convention Argument Types. ");




var test7 = TypedFunc("string", {a: {type: "string"}}, function(a, callback){
	callback(null, "success : " + a);
})

count = 0;
test7("Hi", function(err, returns){
	assert.equal(err, null, "Test 7a: Should return null error to the callback."); count ++;
	assert.notEqual(returns, null, "Test 7b: Should return a non null returns to the callback."); count ++;
});

test7(23, function(err, returns){
	assert.notEqual(err, null, "Test 7c: Should return a non null error to the callback."); count ++;
	assert.equal(returns, null, "Test 7d: Should not return anything other than an error the callback."); count ++;
});

test7(null, function(err, returns){
	assert.notEqual(err, null, "Test 7e: Should return a non null error to the callback."); count ++;
	assert.equal(returns, null, "Test 7f: Should not return anything other than an error the callback."); count ++;
});


console.log("7: "+ count + "/" + count+ " Node Argument & Return Types. ");



var test8 = TypedFunc(["string", "number"], {a: {type: ["string", "number", "object"]}}, function(a, callback){
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
	assert.equal(returns, null, "Test 8f: Should not return anything other than an error to the callback."); count ++;
});


test8({an: "object"}, function(err, returns){
	assert.notEqual(err, null, "Test 8g: Should return an error - Invalid return type."); count ++;
	assert.equal(returns, null, "Test 8h: Should not return anything other than an error to the callback."); count ++;
})


console.log("8: "+ count + "/" + count+ " Multi Node convention argument & return types. ");




/// instance specific settings


var test9 = (new TypedFunc()).throws({x: {type: "string"}, y: {default: "B"}}, function(x, y){
	return {x: x, y: y};
})


count = 0;

assert.equal(test9("x").y, "B" , "Test 9a: Should return default value."); count ++;
assert.doesNotThrow(function(){ test9("Test"); }, "Test 9b: Should not throw any errors."); count ++;
assert.doesNotThrow(function(){ test9("B", "A"); }, "Test 9c: Should not thow any errors."); count ++;
assert.doesNotThrow(function(){ test9("C", 12); }, "Test 9d: Should not throw any errors."); count ++;

console.log("9: "+ count + "/" + count+ " Instance specific settings Classical Arg Types & Defaults. ");




var test10 = (new TypedFunc()).throws(["string", Date], {x: {type: "string"}, y: {default: "B"}}, function(x, y){
	if (y === "B") return new Date();
	else return x;
})


count = 0;

assert.equal(test10("x") instanceof Date, true , "Test 10a: Should return a Date."); count ++;
assert.doesNotThrow(function(){ test10("Test"); }, "Test 10b: Should not throw any errors."); count ++;
assert.equal(typeof test10("B", "A"), "string", "Test 10c: Should return a string"); count ++;
assert.throws(function(){ test10(12, 12); }, "Test 10d: Should throw an error - invalid input type."); count ++;

console.log("10: "+ count + "/" + count+ " Instance specific settings Classical Arg Types & Defaults. ");




var test11 = (new TypedFunc()).passes({x: {type: ["string", "number", Date]},y: {default: "B"}}, function(x, y, callback){
	callback(null, [x, y])
})


count = 0;

test11("A", function(err, returns){
	assert.equal(err, null, "Test 11a: Should return null error to the callback."); count ++;
	assert.equal(typeof returns[1], "string", "Test 11b: Should return a string to the callback."); count ++;
});

test11(23, "C", function(err, returns){
	assert.equal(err, null, "Test 11c: Should return a null error to the callback."); count ++;
	assert.equal(typeof returns[0], "number", "Test 11d: Should return a number to the callback."); count ++;
});

test11(null, "D", function(err, returns){
	assert.notEqual(err, null, "Test 11e: Should return a non null error to the callback."); count ++;
	assert.equal(returns, null, "Test 11f: Should not return anything other than an error to the callback."); count ++;
});


test11(new Date(), function(err, returns){
	assert.equal(err, null, "Test 11g: Should return a null errorto the callabck"); count ++;
	assert.notEqual(returns, null, "Test 11h: Should not return null to the callback."); count ++;
	assert.equal(returns[0] instanceof Date, true, "Test 11i: Should return an instanceof Date as the first in returned array."); count ++
	
})

console.log("11: "+ count + "/" + count+ " Instance specific settings Node pass Arg Types & Defaults. ");



console.log("All OK")

