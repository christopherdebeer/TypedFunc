
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
                if (typeof passedArgs[count] !== 'undefined'&&  typedArg.type !== typeof passedArgs[count]) {
                    err = "Invalid argument type. <" + key + "> should be " + typedArg.type + " but was " + typeof passedArgs[count] + ". (Line: "+calleeLine+")";
                }
            }
            //console.log("["+count+"] has default: ",typeof typedArg.default !== 'undefined'," value: ", passedArgs[count]);
            if (typeof typedArg.default !== 'undefined' && typeof passedArgs[count] === 'undefined') {
                //console.log("apply default ["+typedArg.default+"] to arguments[" + count +"]");
                passedArgs[count] = typedArg.default;
            }            
            count++;
        }
        


        var typeofType = typeof type;

        // if error type is "Throw"
        if (TypedFuncSettings.setup.errors.toLowerCase() === "throw") {

            if (err) showError(err);
            else {
                var returned = func.apply( this, passedArgs );
                
                if (typeofType !== 'undefined') {
                    if (typeofType === 'string') {
                        if (typeof returned === type) return returned;
                        showError("Invalid Function type. Should return " + type + " but returned " + typeof returned + ". (Line: "+calleeLine+")");
                    } else {
                        if (returned instanceof type) return returned;
                        showError("Invalid Function type. Should return " + type + " but returned " + returned + ". (Line: "+calleeLine+")");
                    }
                } else return returned;
            }
        } else {

            if (typeof passedArgs[passedArgs.length -1] === "function") {
                var callback = passedArgs[passedArgs.length -1];
                if (err) callback(err, null)

            } else {
                func.apply( this, passedArgs );
            }
        }
    };

    function test () {
        console.log("Public Method TEST.");
    }
    function showError (err) {
        throw new Error(err);
    }

    // console.log("STACK: ", new Error().stack);

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