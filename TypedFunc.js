

// this is a work in progress, but it Works.

function TypedFunc() {

    // The Intercept
    var fn = function () {
        
        var passedArgs = Array.prototype.slice.call(arguments);
        //console.log(this.args);
        var count = 0;
        for (var key in this.args) {
            var typedArg = this.args[key];
            if (typeof typedArg.type !== 'undefined'){
                if (typeof passedArgs[count] !== 'undefined'&&  typedArg.type !== typeof passedArgs[count]) {
                    throw new Error("Invalid type. <" + key + "> should be " + typedArg.type + " but was " + typeof passedArgs[count] + ".");
                }
            }
            //console.log("["+count+"] has default: ",typeof typedArg.default !== 'undefined'," value: ", passedArgs[count]);
            if (typeof typedArg.default !== 'undefined' && typeof passedArgs[count] === 'undefined') {
                //console.log("apply default ["+typedArg.default+"] to arguments[" + count +"]");
                passedArgs[count] = typedArg.default;
            }            
            count++;
        }
        //console.log("ARGS:", passedArgs);
        // console.log("running typedFunc");
        this.func.apply( this, passedArgs );
    };

    // Init
    // console.log("created typedFunc2");
    this.args = Array.prototype.slice.call(arguments);
	this.func = this.args.pop();
	this.args = this.args[0];
	//console.log(this.args);

    // Return the main function     
    return fn;
}