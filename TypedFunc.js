
// Settings / Defaults

var TypedFuncSettings = {
    setup: {
        errors: "Throw", // Throw or Node
        trace: false
    },
    attached: false,
    attachTrace: function (func) {
        if (typeof printStackTrace !== 'undefined') {
            TypedFuncSettings.implementation = new printStackTrace.implementation();
            TypedFuncSettings.implementation.last = [];
            TypedFuncSettings.implementation.instrumentFunction(window, func, function(stack) {
                var ln = stack.join("->").match(/:[0-9]+/)[0]
                TypedFuncSettings.implementation.last.push(ln);
            });
            TypedFuncSettings.attached = true;
        }
    }, 
    detatchTrace: function(func) {
        TypedFuncSettings.implementation.deinstrumentFunction(window, func);
        TypedFuncSettings.attached = false;
    }
};

// this is a work in progress, but it Works.

function TypedFunc() {

    var ARGS = Array.prototype.slice.call(arguments);
    var func,type,args;

    // The Intercept    
    var interceptor = function () {       

        var passedArgs = Array.prototype.slice.call(arguments),
            count = 0,
            err = null,
            calleeLine;

        if (TypedFuncSettings.setup.trace && TypedFuncSettings.attached) {
            calleeLine = TypedFuncSettings.implementation.last[TypedFuncSettings.implementation.last.length -1];
        } else {
            calleeLine = undefined;
        }
        
        
        // if instance settings
        if (typeof interceptor.settings === 'undefined') {
            // then get global settings            
            interceptor.settings = TypedFuncSettings.setup;
        }

        // console.log("func: ", func);
        // console.log("type: ", type);
        // console.log("args: ", args);
        // console.log(passedArgs);

        var callabck = false;
        if (interceptor.settings.errors.toLowerCase() === "node" && typeof passedArgs[passedArgs.length -1] === "function") {
            callback = passedArgs.pop();
        }

        for (var key in args) {
            var typedArg = args[key];
            if (typeof typedArg.type !== 'undefined'){

                // if single value
                if (!isArray(typedArg.type)) {
                    // single string type
                    if (typeof typedArg.type === 'string') {
                        if (typeof passedArgs[count] !== 'undefined' &&  typedArg.type !== typeof passedArgs[count]) {
                            err = "Invalid argument type. <" + key + "> should be " + typedArg.type + " but was " + typeof passedArgs[count] + ". (Line: "+calleeLine+")";
                        }
                    } else {
                    // if single instanceof
                        cosnole.log("INSTANCE CHECK: ", !(passedArgs[count] instanceof typedArg.type))
                        if (typeof passedArgs[count] !== 'undefined' &&  !(passedArgs[count] instanceof typedArg.type)) {
                            err = "Invalid argument type. <" + key + "> should be " + typedArg.type + " but was " + typeof passedArgs[count] + ". (Line: "+calleeLine+")";
                        }
                    }                
                } else {
                // if array of optional types
                    var aMatch = false;
                    for (var y in typedArg.type) {
                        var optionalType = typedArg.type[y];

                        // x in array of optional types is a string
                        if (typeof optionalType === "string") {
                            if (typeof passedArgs[count] !== 'undefined' &&  optionalType === typeof passedArgs[count]) aMatch = true;
                        } else {
                        // x in array of optional types is an insatnceof
                            if (typeof passedArgs[count] !== 'undefined' &&  passedArgs[count] instanceof optionalType) aMatch = true;
                        }
                    }
                    // if no matches
                    if (!aMatch) err = "Invalid argument type. <" + key + "> should be one of " + typedArg.type + " but was " + typeof passedArgs[count] + ". (Line: "+calleeLine+")";

                }

            }
            //console.log("["+count+"] has default: ",typeof typedArg.default !== 'undefined'," value: ", passedArgs[count]);
            if (typeof typedArg.default !== 'undefined' && typeof passedArgs[count] === 'undefined') {
                //console.log("apply default ["+typedArg.default+"] to arguments[" + count +"]");
                passedArgs[count] = typedArg.default;
            }            
            count++;
        }
        

        var typeofType = typeof type; // the type of the requested Function return type, should be "string", "object", or "array"
        if (isArray(type)) {var typeofType = "arrayOfTypes"}

        // if error type is "Throw"

        if (interceptor.settings.errors.toLowerCase() === "throw" ) {

            if (err) showError(err);
            else {
                var returned = func.apply( this, passedArgs );
                
                if (typeofType !== 'undefined') {
                    if (typeofType === 'string') {
                        if (typeof returned === type) return returned;
                        showError("Invalid Function type. Should return " + type + " but returned " + typeof returned + ". (Line: "+calleeLine+")");
                    } else if (typeofType === 'arrayOfTypes') {
                        if (anyOf(typeof returned, type)) return returned;
                        showError("Invalid Function type. Should return " + type + " but returned " + typeof returned + ". (Line: "+calleeLine+")");
                    } else {
                        if (returned instanceof type) return returned;
                        showError("Invalid Function type. Should return " + type + " but returned " + returned + ". (Line: "+calleeLine+")");
                    }
                } else return returned;
            }
        } else {

            if (callback) {
                
                // the callback was removed just prior to checking arg types var callback

                // pass the error to the callback
                if (err) {

                    callback(err, null);

                // Replace the actual callback with the intercept function
                // and pass the actuall callback
                } else {
                    // Bind the actual callback to the intercept function
                    passedArgs.push(interceptCB.bind(this, callback, type));
                    func.apply(this, passedArgs)
                }    
            } else {
                func.apply( this, passedArgs );
            }
        }
    };


    // The callback Incterceptor
    function interceptCB () {
        var passedArgs = Array.prototype.slice.call(arguments)
        
        var originalCallback = passedArgs[0];
        var type = passedArgs[1];
        var err = passedArgs[2];

        // console.log("origCB: ", originalCallback)
        // console.log("type: ", type)
        // console.log("err: ", err)

        passedArgs.shift();
        passedArgs.shift();
        passedArgs.shift();

        // if theres already an error then pass along
        if (err) err = err;
        else if (typeof type === 'undefined') err = err;
        else if (!isArray(type)) {

            // if single type is string
            if (typeof type === "string") {
                // check each parameter
                for (var b in passedArgs) {
                    if (typeof passedArgs[b] !== type) err = "Invalid argument returned to callback. Expected argument ["+b+"] <"+passedArgs[b]+"> to be of type '"+type+"'.";
                }
            } else {
            // if single type is instance
                // check each parameter
                for (var b in passedArgs) {
                    if (!(passedArgs[b] instanceof type)) err = "Invalid argument returned to callback. Expected argument ["+b+"] <"+passedArgs[b]+"> to be of instanceof '"+type+"'.";
                }
            } 
        } else {

            for (var c in passedArgs) {

                var aMatch = false;
                for (var d in type) {
                    if (typeof type[d] === 'string') {
                        if (typeof passedArgs[c] === type[d]) aMatch = true;
                    }
                    else {
                        if (passedArgs instanceof type[d]) aMatch = true;
                    }
                }

                if (!aMatch) err = "Invalid argument type returned to callback. Expected argument ["+c+"] <"+passedArgs[c]+"> to be any of type '"+type+"'.";
            }
        }
        
        // re attach the err which if hopefully null
        passedArgs.unshift(err);

        if (err) passedArgs = [err];

        // call the original callback
        originalCallback.apply(this, passedArgs)

    }



    // Throw error
    function showError (err) {
        throw new Error(err);
    }

    var isArray = Array.isArray || function(obj) {
        return toString.call(obj) == '[object Array]';
    };


    function anyOf(value, items) {
        if (isArray(items)) {
            for (var x in items) {
                if (value === items[x]) return true;
            }
        } else {
            if (value === items) return true;
        }
        return false;
    }

    function processSetup (ARGS) {
        // Init
        if (ARGS.length === 3) {
            func = ARGS[2];
            args = ARGS[1];
            type = ARGS[0];
        } else if (ARGS.length === 2) {
            func = ARGS[1];
            args = ARGS[0];
        } else if (ARGS.length === 1) {
            if (typeof ARGS[0] === 'function') func = ARGS[0];
            if (typeof ARGS[0] === 'object') {

                // update GLOBAL settings
                TypedFuncSettings.setup.errors = ARGS[0].errors || TypedFuncSettings.setup.errors;
                TypedFuncSettings.setup.trace = ARGS[0].trace || TypedFuncSettings.setup.trace;

                // attach stack trace if required
                if (TypedFuncSettings.setup.trace && !TypedFuncSettings.attached) {
                    TypedFuncSettings.attachTrace('TypedFunc');
                }

            }
        }
    }

    processSetup(ARGS);

    // Style helper functions
    // classical - throws error
    interceptor.throws = function(){
        interceptor.settings = interceptor.settings || {};

        var ARGS = Array.prototype.slice.call(arguments);
        processSetup(ARGS);
        interceptor.settings.errors = "Throw";
        return interceptor;
    }

    // node style continuation
    interceptor.passes = function(){
        interceptor.settings = interceptor.settings || {};

        var ARGS = Array.prototype.slice.call(arguments);
        processSetup(ARGS);
        interceptor.settings.errors = "Node";
        return interceptor;
    }

    // Return the Interceptor   
    return interceptor;
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = TypedFunc;
}