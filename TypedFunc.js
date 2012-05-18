
// stack traces for thrown type errors.

var typedFunctionsTrace = new printStackTrace.implementation();
typedFunctionsTrace.last = [];
typedFunctionsTrace.instrumentFunction(this, 'TypedFunc', function(stack) {
    var ln = stack.join("->").match(/:[0-9]+/)[0]
    typedFunctionsTrace.last.push(ln);
});



// this is a work in progress, but it Works.

function TypedFunc() {

    var ARGS = Array.prototype.slice.call(arguments);
    var func,type,args;

    // The Intercept    
    var interceptor = function () {
        
        var passedArgs = Array.prototype.slice.call(arguments);
        var calleeLine = typedFunctionsTrace.last[typedFunctionsTrace.last.length -1];
        var count = 0;

        for (var key in args) {
            var typedArg = args[key];
            if (typeof typedArg.type !== 'undefined'){
                if (typeof passedArgs[count] !== 'undefined'&&  typedArg.type !== typeof passedArgs[count]) {
                    showError("Invalid argument type. <" + key + "> should be " + typedArg.type + " but was " + typeof passedArgs[count] + ". (Line: "+calleeLine+")");
                }
            }
            //console.log("["+count+"] has default: ",typeof typedArg.default !== 'undefined'," value: ", passedArgs[count]);
            if (typeof typedArg.default !== 'undefined' && typeof passedArgs[count] === 'undefined') {
                //console.log("apply default ["+typedArg.default+"] to arguments[" + count +"]");
                passedArgs[count] = typedArg.default;
            }            
            count++;
        }
        
        var returned = func.apply( this, passedArgs );
        var typeofType = typeof type;

        if (typeofType !== 'undefined') {
            if (typeofType === 'string') {
                if (typeof returned === type) return returned;
                showError("Invalid Function type. Should return " + type + " but returned " + typeof returned + ". (Line: "+calleeLine+")");
            } else {
                if (returned instanceof type) return returned;
                showError("Invalid Function type. Should return " + type + " but returned " + returned + ". (Line: "+calleeLine+")");
            }
        } else return returned;
    };


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
        func = ARGS[0];
    }

    // console.log("args: ", args);
    // console.log("func: ", func);
    // console.log("type: ", type);

    // Return the Interceptor   
    return interceptor;
}