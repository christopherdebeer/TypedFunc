
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
        if (TypedFuncSettings.setup.errors.toLowerCase() === "throw") {

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

            if (typeof passedArgs[passedArgs.length -1] === "function") {
                var callback = passedArgs.pop();

                // pass the error to thge callback
                if (err) callback(err, null)

                // Replace the actual callback with the intercept function
                // and pass the actuall callback
                else {
                    // Bind the actual callback to the intercept function
                    passedArgs.push(interceptCB.bind(this, callback));  
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
        var err = passedArgs[1];

        // console.log("passedArgs: ", passedArgs);
        // console.log("original callback was:", originalCallback );
        // console.log("err was: ", err)
        
        console.log("TODO: Callback types!");
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

            // update settings
            TypedFuncSettings.setup.errors = ARGS[0].errors || TypedFuncSettings.setup.errors;
            TypedFuncSettings.setup.trace = ARGS[0].trace || TypedFuncSettings.setup.trace;

            // attach stack trace if required
            if (TypedFuncSettings.setup.trace && !TypedFuncSettings.attached) {
                TypedFuncSettings.attachTrace('TypedFunc');
            }

        }
    }

    // Return the Interceptor   
    return interceptor;
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = TypedFunc;
}