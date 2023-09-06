/**
 * @preserve Personetics processor
 * API version: v2.0
 * Client version: 2023.story-client.1.0.1
 * Generated on: 05-18-23
 */

// Enable debug mode in backend
//@ sourceURL=src/main/resources/personetics-block-processor.js
// implicitly defining window since it's not defined in Java
var window = window || {};

(function (window, Personetics, undefined) {
    Personetics.utils = Personetics.utils ? Personetics.utils : {};
    Personetics.utils.assert = {};
    Personetics.utils.assert.isUndefined = function isUndefined(obj) {
        return typeof obj === "undefined";
    };

    Personetics.utils.assert.isNullOrUndefined = function isNullOrUndefined(obj) {
        return typeof obj === "undefined" || obj == null;
    };

    Personetics.utils.assert.isTrue = function isTrue(obj) {
        var result = !Personetics.utils.assert.isUndefined(obj);
        return result && obj == true;
    };

    Personetics.utils.assert.isDefined = function isDefined(obj, nullable) {
        var result = !Personetics.utils.assert.isUndefined(obj);
        if (result && !Personetics.utils.assert.isUndefined(nullable) && nullable != null) {
            if (!nullable) result = obj != null;
        }
        return result;
    };

    Personetics.utils.assert.AssertIsDefined = function AssertIsDefined(obj, errorMessage) {
        if (Personetics.utils.assert.isNullOrUndefined(obj)) {
            if (errorMessage) Personetics.error(errorMessage, true);
            else Personetics.error("Object is undefined", true);
        }
    };

    Personetics.utils.assert.assignDefaultValue = function assignDefaultValue(variable, defaultValueToSet) {
        var result = null;
        if (Personetics.utils.assert.isUndefined(variable)) result = defaultValueToSet;
        else result = variable;
        return result;
    };

    Personetics.utils.assert.isObject = function isObject(obj) {
        return typeof obj === "object";
    };

    Personetics.utils.assert.isString = function isString(obj) {
        return typeof obj === "string";
    };

    Personetics.utils.assert.isArray = function isArray(obj) {
        return Object.prototype.toString.call(obj) === "[object Array]";
    };

    Personetics.utils.assert.isFunction = function isFunction(obj) {
        return typeof obj === "function";
    };

    Personetics.utils.assert.exists = function (first, namespace) {
        var tokens = namespace.split(".");

        var obj = first;

        for (var i = 1; i < tokens.length; i++) {
            obj = obj == "undefined" ? obj : obj[tokens[i]];
        }

        return obj;
    };

    Personetics.utils.assert.AssertIsNullOrUndefined = function (obj, message) {};
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics, undefined) {
    Personetics.utils = Personetics.utils || {};

    Personetics.PLoggerModes = {
        VERBOSE: {
            name: "VERBOSE",
            value: 1,
        },
        LOG: {
            name: "LOG",
            value: 2,
        },
        DEBUG: {
            name: "DEBUG",
            value: 3,
        },
        ERROR: {
            name: "ERROR",
            value: 4,
        },
        PRODUCTION: {
            name: "PRODUCTION",
            value: 5,
        },
    };

    var logger = function logger() {
        this.mode = Personetics.PLoggerModes.PRODUCTION.value;
        this.mode = Personetics.PLoggerModes.PRODUCTION.value;

        if (typeof jsServerContextObj !== "undefined") {
            this.mode = jsServerContextObj.getLogLevel();
        }
    };

    logger.prototype.setDebugMode = function setDebugMode(mode) {
        if (typeof mode !== "undefined" && mode !== null && mode.hasOwnProperty("name") && Personetics.PLoggerModes.hasOwnProperty(mode.name))
            this.mode = mode.value;
    };

    logger.prototype.log = function log(msg) {
        if (this.mode <= Personetics.PLoggerModes.LOG.value)
            console.log(msg);
    };
    logger.prototype.verbose = function verbose(msg) {
        if (this.mode <= Personetics.PLoggerModes.VERBOSE.value)
            console.log(msg);
    };
    logger.prototype.debug = function debug(msg) {
        if (this.mode <= Personetics.PLoggerModes.DEBUG.value)
            console.log(msg);
    };
    logger.prototype.error = function (msg, throwException, errorObject, options) {
        if (typeof personetics !== "undefined" && personetics !== null && personetics.hasOwnProperty('notifyReportEvent')) {
            var params = {
                type: "errorOccured",
                value: msg,
            };
            personetics.notifyReportEvent(params, true);
        }
        if (this.mode <= Personetics.PLoggerModes.ERROR.value) {
            var shouldDisplayError =
                typeof options !== "undefined" && options.hasOwnProperty("shouldDisplayError") && typeof options.shouldDisplayError !== "undefined"
                    ? options.shouldDisplayError
                    : true;
            if (shouldDisplayError) {
                var context = Personetics.processor.PStoryConfig.getConfig("context");
                var isPermutations = Personetics.processor.PStoryConfig.getConfig("isPermutations");
                if (isPermutations) {
                    console.log("<< Permutation Not Available >>: " + msg);
                } else if (context === "server") {
                    throw msg;
                } else if (
                    typeof personetics !== "undefined" &&
                    personetics !== null &&
                    personetics.config &&
                    personetics.config.persoEBMode === true
                ) {
                    if (errorObject && typeof errorObject !== "undefined") {
                        errorObject.msg = msg;
                        throw errorObject;
                    }
                    throw msg;
                } else if (throwException) {
                    console.error("<< ERROR >>: " + msg);
                }
            }
            if (Personetics.utils.assert.isDefined(errorObject, false)) throw errorObject;
        }
    };

    Personetics.utils.PLogger = new logger();
    // Do not use this function, it's only for compatibility of older versions.
    Personetics.verbose = Personetics.utils.PLogger.verbose.bind(Personetics.utils.PLogger);
    // Do not use this function, it's only for compatibility of older versions.
    Personetics.debug = Personetics.utils.PLogger.debug.bind(Personetics.utils.PLogger);

    Personetics.log = Personetics.utils.PLogger.log.bind(Personetics.utils.PLogger);
    Personetics.error = Personetics.utils.PLogger.error.bind(Personetics.utils.PLogger);
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics, undefined) {
    Personetics.utils = Personetics.utils ? Personetics.utils : {};
    Personetics.utils.persoHelper = {};

    Personetics.utils.persoHelper.constants = {
        ANDROID_VERSIONS: {
            OLD_VERSION_MIN_TARGET: 4.4,
            OLD_VERSION_MAX_TARGET: 5.0,
        },
    };
    Personetics.utils.persoHelper.getAndroidVersionNumber = function getAndroidVersionNumber() {
        var androidVersionNumber;
        var androidVersionString = getAndroidVersion();
        if (androidVersionString) {
            androidVersionNumber = parseFloat(getAndroidVersion());
        }
        return androidVersionNumber;
    };

    Personetics.utils.persoHelper.isOldAndroidVersion = function isOldAndriodVersion() {
        var androidVersion = this.getAndroidVersionNumber();
        var isOldAndroidVersion = false;

        if (typeof androidVersion !== "undefined" && androidVersion > 0) {
            if (
                androidVersion < this.constants.ANDROID_VERSIONS.OLD_VERSION_MAX_TARGET &&
                androidVersion >= this.constants.ANDROID_VERSIONS.OLD_VERSION_MIN_TARGET
            ) {
                isOldAndroidVersion = true;
            }
        }
        return isOldAndroidVersion;
    };

    Personetics.utils.persoHelper.deepObjectExtend = function (out) {
        var self = this;
        out = out || {};
        for (var i = 1; i < arguments.length; i++) {
            var obj = arguments[i];

            if (!obj) continue;

            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === "object") {
                        if (Array.isArray(obj[key])) out[key] = obj[key].slice(0);
                        else out[key] = self.deepObjectExtend(out[key], obj[key]);
                    } else out[key] = obj[key];
                }
            }
        }
        return out;
    };

    var getAndroidVersion = function getAndroidVersion() {
        var userAgent = navigator.userAgent.toLowerCase();
        var match = userAgent.match(/android\s([0-9\.]*)/);
        return match ? match[1] : false;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.utils = Personetics.utils ? Personetics.utils : {};
    Personetics.utils.emojisHelper = {};
    Personetics.utils.emojisHelper.parseEmoji = function parseEmoji(text) {
        var emojisCodes = extractEmojis(text);
        for (var i = 0; i < emojisCodes.length; i++) {
            var emojiSymbol = parseHexToEmoji(emojisCodes[i]);
            var emojiRegExp = new RegExp(emojisCodes[i], "g");
            text = text.replace(emojiRegExp, "<span>" + emojiSymbol + "</span>");
        }
        text = text.replace(/Emoji/g, "").replace(/{{|}}/g, "");
        var parsedText = text;
        return parsedText;
    };

    /**
     * extractEmojis
     * Input: text - for example ("You may want to pay close attention {{Emoji 1F470 1F3FF}} to your spending this week.")
     * Output: text - emojis codes (1F470 1F3FF)
     * */
    var extractEmojis = function (str) {
        var emojisCodes = [];
        var emojiExp = extractEmojiExp(str);
        for (var i = 0; i < emojiExp.length; i++) {
            if (emojiExp[i].length) {
                var emojiCode = emojiExp[i];
                emojiCode = emojiCode.replace("Emoji", "");
                emojiCode = emojiCode.replace(/{{|}}/g, "");
                emojiCode = emojiCode.trim();
                if (emojisCodes.indexOf(emojiCode) === -1) {
                    emojisCodes.push(emojiCode);
                }
            }
        }
        return emojisCodes;
    };

    /**
     * parseHexToEmoji
     * Input: emojis codes
     * Output: emoji symbol in hex (&#x1F470&#x1F3FF)
     * */
    var parseHexToEmoji = function (emojisCodes) {
        var emojisCodesArr = emojisCodes.split(" ");
        var emoji = "";
        if (emojisCodesArr.length) {
            for (var i = 0; i < emojisCodesArr.length; i++) {
                emoji += "&#x" + emojisCodesArr[i];
            }
        }
        return emoji;
    };
    /**
     * Input: text
     * Output: text - for example"{{Emoji 1F470 1F3FF}}"*/
    var extractEmojiExp = function (str) {
        var emojiExpArr = [];
        var emojiExpOccurrence = (str.match(/{{Emoji/g) || []).length;
        var emojiOpenBrace = "{{Emoji";
        var emojiCloseBrace = "}}";
        for (var i = 0; i < emojiExpOccurrence; i++) {
            var expressionStartIndex = str.indexOf(emojiOpenBrace);
            var expressionEndIndex = str.indexOf(emojiCloseBrace) + emojiCloseBrace.length;
            var emojiExp = str.slice(expressionStartIndex, expressionEndIndex);
            str = str.replace(emojiExp, "");
            emojiExpArr.push(emojiExp);
        }
        return emojiExpArr;
    };
})(window, (window.Personetics = window.Personetics || {}));

!function(a){"use strict";var b="Compound",c="Identifier",d="MemberExpression",e="Literal",f="ThisExpression",g="CallExpression",h="UnaryExpression",i="BinaryExpression",j="LogicalExpression",k="ConditionalExpression",l="ArrayExpression",m=46,n=44,o=39,p=34,q=40,r=41,s=91,t=93,u=63,v=59,w=58,x=function(a,b){var c=new Error(a+" at character "+b);throw c.index=b,c.description=a,c},y=!0,z={"-":y,"!":y,"~":y,"+":y},A={"||":1,"&&":2,"|":3,"^":4,"&":5,"==":6,"!=":6,"===":6,"!==":6,"<":7,">":7,"<=":7,">=":7,"<<":8,">>":8,">>>":8,"+":9,"-":9,"*":10,"/":10,"%":10},B=function(a){var b,c=0;for(var d in a)(b=d.length)>c&&a.hasOwnProperty(d)&&(c=b);return c},C=B(z),D=B(A),E={"true":!0,"false":!1,"null":null},F="this",G=function(a){return A[a]||0},H=function(a,b,c){var d="||"===a||"&&"===a?j:i;return{type:d,operator:a,left:b,right:c}},I=function(a){return a>=48&&57>=a},J=function(a){return 36===a||95===a||a>=65&&90>=a||a>=97&&122>=a},K=function(a){return 36===a||95===a||a>=65&&90>=a||a>=97&&122>=a||a>=48&&57>=a},L=function(a){for(var i,j,y=0,B=a.charAt,L=a.charCodeAt,M=function(b){return B.call(a,b)},N=function(b){return L.call(a,b)},O=a.length,P=function(){for(var a=N(y);32===a||9===a;)a=N(++y)},Q=function(){var a,b,c=S();return P(),N(y)!==u?c:(y++,a=Q(),a||x("Expected expression",y),P(),N(y)===w?(y++,b=Q(),b||x("Expected expression",y),{type:k,test:c,consequent:a,alternate:b}):void x("Expected :",y))},R=function(){P();for(var b=a.substr(y,D),c=b.length;c>0;){if(A.hasOwnProperty(b))return y+=c,b;b=b.substr(0,--c)}return!1},S=function(){var a,b,c,d,e,f,g,h;if(f=T(),b=R(),!b)return f;for(e={value:b,prec:G(b)},g=T(),g||x("Expected expression after "+b,y),d=[f,e,g];(b=R())&&(c=G(b),0!==c);){for(e={value:b,prec:c};d.length>2&&c<=d[d.length-2].prec;)g=d.pop(),b=d.pop().value,f=d.pop(),a=H(b,f,g),d.push(a);a=T(),a||x("Expected expression after "+b,y),d.push(e,a)}for(h=d.length-1,a=d[h];h>1;)a=H(d[h-1].value,d[h-2],a),h-=2;return a},T=function(){var b,c,d;if(P(),b=N(y),I(b)||b===m)return U();if(b===o||b===p)return V();if(J(b)||b===q)return Y();if(b===s)return $();for(c=a.substr(y,C),d=c.length;d>0;){if(z.hasOwnProperty(c))return y+=d,{type:h,operator:c,argument:T(),prefix:!0};c=c.substr(0,--d)}return!1},U=function(){for(var a,b,c="";I(N(y));)c+=M(y++);if(N(y)===m)for(c+=M(y++);I(N(y));)c+=M(y++);if(a=M(y),"e"===a||"E"===a){for(c+=M(y++),a=M(y),("+"===a||"-"===a)&&(c+=M(y++));I(N(y));)c+=M(y++);I(N(y-1))||x("Expected exponent ("+c+M(y)+")",y)}return b=N(y),J(b)?x("Variable names cannot start with a number ("+c+M(y)+")",y):b===m&&x("Unexpected period",y),{type:e,value:parseFloat(c),raw:c}},V=function(){for(var a,b="",c=M(y++),d=!1;O>y;){if(a=M(y++),a===c){d=!0;break}if("\\"===a)switch(a=M(y++)){case"n":b+="\n";break;case"r":b+="\r";break;case"t":b+="	";break;case"b":b+="\b";break;case"f":b+="\f";break;case"v":b+=""}else b+=a}return d||x('Unclosed quote after "'+b+'"',y),{type:e,value:b,raw:c+b+c}},W=function(){var b,d=N(y),g=y;for(J(d)?y++:x("Unexpected "+M(y),y);O>y&&(d=N(y),K(d));)y++;return b=a.slice(g,y),E.hasOwnProperty(b)?{type:e,value:E[b],raw:b}:b===F?{type:f}:{type:c,name:b}},X=function(a){for(var c,d,e=[];O>y;){if(P(),c=N(y),c===a){y++;break}c===n?y++:(d=Q(),d&&d.type!==b||x("Expected comma",y),e.push(d))}return e},Y=function(){var a,b;for(a=N(y),b=a===q?Z():W(),P(),a=N(y);a===m||a===s||a===q;)y++,a===m?(P(),b={type:d,computed:!1,object:b,property:W()}):a===s?(b={type:d,computed:!0,object:b,property:Q()},P(),a=N(y),a!==t&&x("Unclosed [",y),y++):a===q&&(b={type:g,arguments:X(r),callee:b}),P(),a=N(y);return b},Z=function(){y++;var a=Q();return P(),N(y)===r?(y++,a):void x("Unclosed (",y)},$=function(){return y++,{type:l,elements:X(t)}},_=[];O>y;)i=N(y),i===v||i===n?y++:(j=Q())?_.push(j):O>y&&x('Unexpected "'+M(y)+'"',y);return 1===_.length?_[0]:{type:b,body:_}};if(L.version="0.3.0",L.toString=function(){return"JavaScript Expression Parser (JSEP) v"+L.version},L.addUnaryOp=function(a){return z[a]=y,this},L.addBinaryOp=function(a,b){return D=Math.max(a.length,D),A[a]=b,this},L.removeUnaryOp=function(a){return delete z[a],a.length===C&&(C=B(z)),this},L.removeBinaryOp=function(a){return delete A[a],a.length===D&&(D=B(A)),this},"undefined"==typeof exports){var M=a.jsep;a.jsep=L,L.noConflict=function(){return a.jsep===L&&(a.jsep=M),L}}else"undefined"!=typeof module&&module.exports?window.jsep=exports=module.exports=L:exports.parse=L}(this);

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};
    var templateDateRegex = /Date\s+([A-Za-z\.\[\]\(\)\'\,\_\-0-9]*)(?:\s+format='(.*)')?/;
    var templateEmojiRegex = /Emoji\s+([A-Za-z\.\[\]\(\)\'\,\_\-0-9]*)?/;
    var templateAmountRegex =
        /Amount\s+([A-Za-z\d\.\[\]\(\)\'\,\_\/\*\+\-\=]*)(?:\s+format='([#0,\.\+ \-@]*)')?(?:\s+currency='(.*)')?/; /**space for support space in the format */
    var templateStringRegex = /String\s+([A-Za-z\d\.\[\]\(\)\'\,\/\*\+\-]*)?(?:\s+maxLength='(.*)')?/;
    var nodeTypes = ["BinaryExpression", "UnaryExpression", "Identifier", "Literal", "ArrayExpression", "MemberExpression", "CallExpression"];

    Personetics.processor.PExp = function PExp(expStr) {
        this.str = this.compile(expStr);
        try {
            this.exp = jsep(this.str);
        } catch (e) {
            Personetics.error("PExp('" + this.str + "') Error -Invalid expression: '" + expStr + " '" + e.stack, false, e);
        }
    };
    Personetics.processor.PExp.prototype.binops = {
        "+": function (a, b) {
            return a + b;
        },
        "-": function (a, b) {
            return a - b;
        },
        "*": function (a, b) {
            return a * b;
        },
        "/": function (a, b) {
            if (b == 0) return 0;
            return a / b;
        },
        "%": function (a, b) {
            return a % b;
        },
        "==": function (a, b) {
            return a == b;
        },
        "!=": function (a, b) {
            return a != b;
        },
        "<": function (a, b) {
            return a < b;
        },
        "<=": function (a, b) {
            return a <= b;
        },
        ">": function (a, b) {
            return a > b;
        },
        ">=": function (a, b) {
            return a >= b;
        },
    };
    Personetics.processor.PExp.prototype.logicOps = {
        "||": function (a, b) {
            return a || b;
        },
        "&&": function (a, b) {
            return a && b;
        },
    };
    Personetics.processor.PExp.prototype.unops = {
        "-": function (a) {
            return -a;
        },
        "+": function (a) {
            return a;
        },
    };

    Personetics.processor.PExp.prototype.compile = function compile(exp) {
        var originalExp = exp;
        var dateMatch = exp.match(templateDateRegex);
        var value;
        var format;

        if (dateMatch) {
            value = dateMatch[1];
            format = null;

            if (dateMatch.length > 2 && dateMatch[2]) format = "'" + dateMatch[2] + "'";
            exp = "utils.formatDate(" + value + "," + format + ")";
        }

        var amountMatch = exp.match(templateAmountRegex);
        if (amountMatch) {
            value = amountMatch[1];
            format = null;
            var currency = null;

            var amountMatch2 = amountMatch[2];
            if (typeof amountMatch2 !== "undefined" && amountMatch2 !== null && amountMatch2.length > 0) format = "'" + amountMatch[2] + "'";

            if (typeof amountMatch[3] !== "undefined" && amountMatch[3] !== null)
                //this string  " ' $ " is problematic with replace so
                //currency must be wraped with "" instead of ''
                // currency = '"' + amountMatch[3] + '"';
                // currency symbol evaluated as expression
                currency = amountMatch[3];
            if (typeof currency == "string") {
                //trim
                currency = currency.replace(/^\s+|\s+$/g, "");
                if (currency === "") {
                    currency = '""';
                }
            }
            exp = "utils.formatAmount(" + value + ", " + currency + ", " + format + ")";
            // exp = originalExp.replace(templateAmountRegex, exp);
            exp = originalExp.replace(templateAmountRegex, function () {
                return exp;
            });
        }

        //match emojis
        var emojiMatch = exp.match(templateEmojiRegex);
        if (emojiMatch) {
            exp = "'{{" + exp + "}}'";
        }

        /**
         * String Format match
         * */
        var stringMatch = exp.match(templateStringRegex);
        var maxLength = null;
        if (stringMatch) {
            value = stringMatch[1];
            var stringMatch2 = stringMatch[2];
            if (typeof stringMatch2 !== "undefined" && stringMatch2 !== null && stringMatch2.length > 0)
                maxLength = /*"'" +*/ stringMatch[2] /*+ "'"*/;

            exp = "utils.limitString(" + value + "," + maxLength + ")";
            exp = originalExp.replace(templateStringRegex, exp);
        }
        return exp;
    };

    Personetics.processor.PExp.prototype.eval = function (ctx, parentCtx, options) {
        var hasError = false;
        var errorObj = null;
        try {
            Personetics.log("PExp: attempting to evaluate expression: '" + this.str + "'");
            Personetics.log(this.str);
            var d = new Date();
            var result = this.evalNode(this.exp, ctx, parentCtx, options);
            var t = new Date();
            Personetics.log("Exp in ms" + (t - d));
            if (typeof result === "undefined" || result === null) {
                hasError = true;
                errorObj = new Error("PExp.eval('" + this.str + "') Error - Invalid result after evaluating expression: '" + result + "'");
            }
        } catch (e) {
            hasError = true;
            errorObj = { message: "PExp.eval('" + this.str + "') Error - Could not evaluate expression Error Message: " + e.message, stack: e.stack };
        }

        if (hasError) {
            Personetics.error(errorObj.message, false, errorObj);
        } else {
            return result;
        }
    };

    Personetics.processor.PExp.prototype.evalNode = function (node, ctx, parentCtx, options) {
        var me = this;
        var val;
        var leftArg;
        var rightArg;
        if (node.type === "BinaryExpression") {
            leftArg = this.evalNode(node.left, ctx, parentCtx, options);
            rightArg = this.evalNode(node.right, ctx, parentCtx, options);
            val = this.binops[node.operator](leftArg, rightArg);
        } else if (node.type === "LogicalExpression") {
            leftArg = this.evalNode(node.left, ctx, parentCtx, options);
            rightArg = this.evalNode(node.right, ctx, parentCtx, options);
            val = this.logicOps[node.operator](leftArg, rightArg);
        } else if (node.type === "UnaryExpression") {
            val = this.unops[node.operator](this.evalNode(node.argument, ctx, parentCtx, options));
        } else if (node.type === "Identifier") {
            val = Personetics.processor.PUtils.getUtilsInstance(node.name, ctx, parentCtx);
            if (typeof val === "undefined" || val === null) val = this.getChild(ctx, node.name, ctx, parentCtx, options);

            // try to get value from parent context
            if (typeof parentCtx !== "undefined" && parentCtx !== null) {
                if (typeof val === "undefined" || val === null) {
                    val = this.getChild(parentCtx, node.name, ctx, parentCtx, options);
                }
                // removed: this special case breaks other cases, where val is a string
                // else {
                // 	// special case: value in child context is NaN. Check if parent context has a similar value. If
                // 	// it doesn't, return child value
                // 	if (isNaN(val)) {
                // 		var oldVal = val;
                //
                // 		try {
                // 			val = this.getChild(parentCtx, node.name, options);
                // 			if (typeof val === 'undefined' || val === null)
                // 				val = oldVal;
                // 		}
                // 		catch(e){
                // 			// do nothing
                // 		}
                // 	}
                // }
            }
        } else if (node.type === "Literal") {
            val = node.value;
        } else if (node.type === "ArrayExpression") {
            var arr = [];
            for (key in node.elements) {
                var item = node.elements[key];
                var arrVal = me.evalNode(item, ctx, parentCtx, options);
                arr.push(arrVal);
            }
            val = arr;
        } else if (node.type === "MemberExpression") {
            var obj = this.evalNode(node.object, ctx, parentCtx, options);
            if (node.property.type == "Identifier") val = this.getChild(obj, node.property.name, ctx, parentCtx, options);
            else {
                var prop = this.evalNode(node.property, obj, parentCtx, options);
                val = this.getChild(obj, prop, options, ctx, parentCtx, options);
            }
            if (typeof val == "function") {
                var bfunc = new PBoundFunction(obj, val);
                val = bfunc;
            }
        } else if (node.type === "CallExpression") {
            var callee = this.evalNode(node.callee, ctx, parentCtx, options);
            var args = [];
            var errorObj = null;
            for (var key in node.arguments) {
                var arg = node.arguments[key];
                var argVal = me.evalNode(arg, ctx, parentCtx, options);
                args.push(argVal);
            }
            if (!callee || !Object.prototype.isPrototypeOf.call(PBoundFunction.prototype, callee)) {
                errorObj = new Error(
                    "TypeError: evalNode function - Cannot find function '" + node.callee.property.name + "' of '" + node.callee.object.name + "'"
                );
                Personetics.error(errorObj.message, false, errorObj);
            }

            val = callee.call(args);
        }
        return val;
    };

    /**
     * evaluate an object's member property
     * @param obj the parent object
     * @param prop the property's name
     * @param ctx the current context
     * @param parentCtx the current parent context
     * @param options custom options
     * @returns the property's value
     */
    Personetics.processor.PExp.prototype.getChild = function (obj, prop, ctx, parentCtx, options) {
        if (!obj) return obj;

        // try to get the value using the parent object's get() method
        var child;
        if (Object.prototype.isPrototypeOf.call(Personetics.processor.PDataSource.prototype, obj)) child = obj.get(prop, options);

        // try to get as a JavaScript object's property
        if (typeof child == "undefined" || child == null) child = obj[prop];

        return child;
    };

    Personetics.processor.PExp.prototype.isNode = function (node) {
        var isNode = false;
        if (node && Object.prototype.hasOwnProperty.call(node, "type")) {
            var type = node.type;
            isNode = nodeTypes.indexOf(type) >= 0;
        }
        return isNode;
    };

    var PExpCtx = function PExpCtx(parent) {
        this.parent = parent;
    };

    PExpCtx.prototype.get = function () {};

    PExpCtx.prototype.getParent = function () {};

    var PObjWrapper = function PObjWrapper(obj) {
        this.obj = obj;
    };

    PObjWrapper.get = function () {};

    var PBoundFunction = function PBoundFunction(obj, func) {
        if (!obj) {
            var errorObject = new Error("No obj provided to bound function");
            Personetics.error(errorObject.message, false, errorObject);
        }
        this.obj = obj;
        this.func = func;
    };

    PBoundFunction.prototype.call = function (args) {
        return this.func.apply(this.obj, args);
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    var persoDict = function persoDict() {
        this.monthNames = {
            "en-short": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            he: ["ינואר", "פברואר", "מרץ", "אפריל", "מאי", "יוני", "יולי", "אוגוסט", "ספטמבר", "אוקטובר", "נובמבר", "דצמבר"],
            "he-short": ["ינו'", "פבר'", "מרץ", "אפר'", "מאי", "יונ'", "יול'", "אוג'", "ספט'", "אוק'", "נוב'", "דצמ'"],
            "es-short": ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
            es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            fr: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
            "fr-short": ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"],
            th: [
                "มกราคม",
                "กุมภาพันธ์",
                "มีนาคม",
                "เมษายน",
                "พฤษภาคม",
                "มิถุนายน",
                "กรกฎาคม",
                "สิงหาคม",
                "กันยายน",
                "ตุลาคม",
                "พฤศจิกายน",
                "ธันวาคม",
            ],
            "th-short": ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
            de: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
            "de-short": ["Jan.", "Feb.", "März", "Apr.", "Mai", "Jun.", "Jul.", "Aug.", "Sept.", "Okt.", "Nov.", "Dez."],
            zh: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            "zh-short": ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            ko: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
            "ko-short": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
            ja: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            "ja-short": ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
            it: ["gennaio", "febbraio", "marzo", "aprile", " maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"],
            "it-short": ["GEN", "FEB", "MAR", "APR", "MAG", "GIU", "LUG", "AGO", "SET", "OTT", "NOV", "DIC"],
            pt: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
            "pt-short": ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        };

        this.weekDays = {
            en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "en-short": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            "en-short-default": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            he: ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"],
            "he-short": ["א", "ב", "ג", "ד", "ה", "ו", "ש"],
            es: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            de: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
            fr: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"],
            zh: ["星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
            "zh-short": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
            ko: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
            "ko-short": ["일", "월", "화", "수", "목", "금", "토"],
            ja: ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"],
            "ja-short": ["日", "月", "火", "水", "木", "金", "土"],
            it: ["lunedì", "martedì", "mercoledì", "giovedì", "venerdì", "sabato", "domenica"],
            "it-short": ["lun", "mar", "mer", "gio", "ven", "sab", "do"],
            pt: ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado", "Domingo"],
            "pt-short": ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"],
        };
    };

    Personetics.pstoryDictionary = new persoDict();
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    var pUtils = function () {
        this._instance = {};

        this.utilsFactory = {
            utils: utils,
            dateUtils: date,
            amountUtils: amount,
        };
    };

    pUtils.prototype.getUtilsInstance = function (instanceName, context, parentContext) {
        if (Object.prototype.hasOwnProperty.call(this.utilsFactory, instanceName)) {
            if (!Object.prototype.hasOwnProperty.call(this._instance, instanceName)) {
                var clazz = this.utilsFactory[instanceName];
                this._instance[instanceName] = new clazz(context, parentContext);
            } else {
                var myUtils = this._instance[instanceName];
                if (typeof myUtils.context == "undefined" || myUtils.context == null) myUtils.setContext(context, parentContext);
            }
        }
        return this._instance[instanceName];
    };

    var amount = function (context, parentContext) {
        this.context = context;
        this.parentContext = parentContext;
    };

    amount.prototype.setContext = function (context, parentContext) {
        this.context = context || this.context;
        this.parentContext = parentContext || this.parentContext;
    };

    var date = function (context, parentContext) {
        this.context = context;
        this.parentContext = parentContext;
        this.monthNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        this.monthNames = Personetics.pstoryDictionary.monthNames;
    };
    date.prototype.getMonthName = function (lang) {
        var names = this.monthNames[lang];
        if (!names) {
            names = this.monthNames["en"];
        }

        return names;
    };
    date.prototype.getMonthNumber = function (lang, monthName) {
        if (!this.monthNames[lang]) {
            lang = Personetics.UI.PWidgetsTextsFactory.defaultLang;
        }
        return this.monthNames[lang] && this.monthNames[lang].indexOf(monthName.replace(/'/gi, ""));
    };
    date.prototype.setContext = function (context, parentContext) {
        this.context = context || this.context;
        this.parentContext = parentContext || this.parentContext;
    };

    date.prototype.getday = function (dateStr, modifier) {
        return this.getDay(dateStr, modifier);
    };

    date.prototype.getDay = function (dateStr, modifier) {
        var result;
        Personetics.log("Calling dateUtils.getDay(" + dateStr + ", " + modifier + ")");
        var parsedDateStr = dateStr.split(".")[0].replace(/T/g, " ");
        parsedDateStr = parsedDateStr.split("-").join("/");
        dateStr = isNaN(Date.parse(parsedDateStr)) ? dateStr : parsedDateStr;
        var d = new Date(dateStr);
        var day = d.getDate();
        var parsedModifier = parseInt(modifier);
        if (!isNaN(parsedModifier)) {
            d.setDate(day + parsedModifier);
            result = d.getDate();
        } else {
            result = day;
        }

        Personetics.log("Result: " + result);

        return result;
    };

    date.prototype.getmonth = function (dateStr, modifier) {
        return this.getMonth(dateStr, modifier);
    };
    date.prototype.getMonth = function (dateStr, modifier) {
        var result;
        Personetics.log("Calling dateUtils.getMonth(" + dateStr + ", " + modifier + ")");
        var parsedDateStr = dateStr.split(".")[0].replace(/T/g, " ");
        parsedDateStr = parsedDateStr.split("-").join("/");
        dateStr = isNaN(Date.parse(parsedDateStr)) ? dateStr : parsedDateStr;

        var d = new Date(dateStr);
        var month = d.getMonth();
        if (typeof month != "undefined" && month != null && !isNaN(month)) {
            month = d.getMonth() + 1;
        } else {
            try {
                if (typeof dateStr === "string") {
                    if (!isNaN(dateStr)) {
                        month = parseInt(dateStr);
                    }
                } else month = dateStr;
            } catch (e) {
                Personetics.log("dateUtils.getMonth(): invalid input + '" + dateStr + "'");
                return dateStr;
            }
        }

        if (modifier) {
            var place = month + modifier;
            var monthNumbersLength = this.monthNumbers.length;
            if (place >= monthNumbersLength) {
                place -= monthNumbersLength;
            } else if (place <= 0) {
                place = monthNumbersLength + place;
            }
            result = place;
        } else {
            result = month;
        }

        Personetics.log("Result: " + result);

        return result;
    };

    date.prototype.getdatemonth = function (dateStr, modifier) {
        return this.getDateMonth(dateStr, modifier);
    };
    date.prototype.getDateMonth = function (dateStr, modifier) {
        var result;
        Personetics.log("Calling dateUtils.getDateMonth(" + dateStr + ", " + modifier + ")");
        var parsedDateStr = dateStr.split(".")[0].replace(/T/g, " ");
        parsedDateStr = parsedDateStr.split("-").join("/");
        dateStr = isNaN(Date.parse(parsedDateStr)) ? dateStr : parsedDateStr;

        var d = new Date(dateStr);
        var month = d.getMonth() + 1;
        var year = d.getFullYear();
        var day = d.getDate();
        if (typeof month == "undefined" && month == null && isNaN(month)) {
            Personetics.log("dateUtils.getDateMonth(): invalid input + '" + dateStr + "'");
            return dateStr;
        }

        if (modifier) {
            var newMonth = month + modifier;
            var monthNumbersLength = this.monthNumbers.length;
            if (newMonth >= monthNumbersLength) {
                newMonth -= monthNumbersLength;
                year = year + 1;
            } else if (newMonth <= 0) {
                newMonth = monthNumbersLength + newMonth;
                year = year - 1;
            }
            if (newMonth < 10) newMonth = "0" + newMonth;
            if (day < 10) day = "0" + day;
            var newDate = year + "-" + newMonth + "-" + day;
            result = newDate;
        } else {
            result = dateStr;
        }

        Personetics.log("Result: " + result);

        return result;
    };

    date.prototype.offsetDate = function (dateStr, offsetAmount) {
        var tempDate = new Date(dateStr);
        return new Date(tempDate.setDate(tempDate.getDate() + offsetAmount));
    };

    date.prototype.dateDiff = function (dateStr, subDateStr, timeParam) {
        var dateObj = new Date(dateStr);
        var subDateObj = new Date(subDateStr);
        var diff = Math.floor(dateObj.getTime() - subDateObj.getTime());
        var day = 1000 * 60 * 60 * 24;
        var days = Math.floor(diff / day);
        var weeks = Math.floor(days / 7);
        var months = Math.floor(days / 31);
        var years = Math.floor(days / 365);
        switch (timeParam) {
            case "w":
                return weeks;
            case "m":
                return months;
            case "y":
                return years;
            default:
                return days;
        }
    };

    var utils = function (context, parentContext) {
        this.context = context;
        this.parentContext = parentContext;
        this.monthNames = Personetics.pstoryDictionary.monthNames;
        this.weekDays = Personetics.pstoryDictionary.weekDays;
        this.defaultCurrency = "";
        this.tableJoinTypes = {
            INNER: "INNER",
            LEFT: "LEFT",
        };
    };
    utils.prototype.setContext = function (context, parentContext) {
        this.context = context || this.context;
        this.parentContext = parentContext || this.parentContext;
    };

    utils.prototype.monthname = function (dateStr, short, lowerCase) {
        return this.monthName(dateStr, short, lowerCase);
    };

    utils.prototype.monthName = function (dateStr, short, lowerCase) {
        var result;
        Personetics.log("Calling utils.monthName(" + dateStr + ", " + short + "," + lowerCase + ")");

        if (!(parseInt(dateStr) == dateStr)) {
            /**safari bug */
            var d = new Date(dateStr);
            var month = d.getMonth();
            if (typeof month != "undefined" && month != null && !isNaN(month)) {
                month = d.getMonth();
            }
        } else {
            try {
                var dn = parseInt(dateStr);
                if (dn >= 1 && dn <= 12) {
                    month = dn - 1;
                } else {
                    Personetics.log("utils.monthName(): invalid month number + '" + dateStr + "'");
                    return dateStr;
                }
            } catch (e) {
                Personetics.log("utils.monthName(): invalid input + '" + dateStr + "'");
                return dateStr;
            }
        }
        var lang = Personetics.processor.PStoryConfig.getConfig("lang");
        if (short == true || short == "MMM")
            // added temporary for RBC
            lang = lang + "-short";
        var names = this.monthNames[lang];
        if (!names) {
            Personetics.log("utils.monthName(): month names not available + '" + names + "'");
            return dateStr;
        }

        result = names[month];
        if (lowerCase == true) {
            result = result.toLowerCase();
        }

        Personetics.log("Result: " + result);

        return result;
    };

    utils.prototype.dayname = function (dateStr, short) {
        return this.dayName(dateStr, short);
    };

    utils.prototype.dayName = function (dateStr) {
        var result = "";
        if (!(parseInt(dateStr) == dateStr)) {
            /**safari bug */
            var d = new Date(dateStr);
            var weekday = d.getDay();
            if (typeof weekday == "undefined" || weekday == null || isNaN(weekday)) {
                Personetics.log("utils.dayName(): invalid weekday");
                return result;
            }
        } else {
            Personetics.log("utils.dayName(): invalid date + '" + dateStr + "'");
        }
        var lang = Personetics.processor.PStoryConfig.getConfig("lang");
        var names = this.weekDays[lang];
        if (!names) {
            Personetics.log("utils.dayName(): weekdays names are not available for " + lang);
            return result;
        }
        result = names[weekday];
        return result;
    };

    utils.prototype.formatdate = function (dateStr, format, isAccessibilityFormat) {
        return this.formatDate(dateStr, format, isAccessibilityFormat);
    };

    utils.prototype.formatDate = function formatDate(dateStr, format, isAccessibilityFormat) {
        Personetics.log("Calling utils.formatDate(" + dateStr + ", " + format + ")");

        dateStr = dateStr.toString();
        if (typeof dateStr === "undefined" || dateStr === null || dateStr.length <= 0) {
            var errorObject = new Error("utils.formatDate(" + dateStr + ", " + format + ") Error: invalid dateStr parameter");
            var errorMessage = " Error message: " + errorObject.message + " Error stack: " + errorObject.stack;
            Personetics.error(errorMessage, false, errorObject);
        }
        if (typeof format === "undefined" || format == null) format = Personetics.processor.PStoryConfig.getConfig("dateFormat");
        /**safari bug */
        var parsedDateStr = dateStr.split(".")[0].replace(/T/g, " ");
        parsedDateStr = parsedDateStr.split("-").join("/");
        dateStr = isNaN(Date.parse(parsedDateStr)) ? dateStr : parsedDateStr;
        var date;
        if (isNaN(dateStr)) date = new Date(dateStr);
        else date = new Date(null, dateStr - 1);
        var result = format;
        var arr = format.split(/[\s\/\\\-\:]/);
        arr = format.match(/(Cdd|CMMM|CM|Cm|dd|DD|d|mmmm|mmm|Lm|LMMM|LM|MMMMM|MMMM|MMM|mm|MM|m|M|YYYY|yy|YY|y|weekday)/g);

        var me = this;

        arr.forEach(function (dateFormatItem) {
            var dateFormatValue = me.dateFormatToDate(dateFormatItem, date, dateStr);
            if (dateFormatValue) {
                result = result.replace(dateFormatItem, dateFormatValue);
            }
        });
        if (isAccessibilityFormat) {
            result = this.createAccessibleDateText(result, dateStr, format);
        }

        Personetics.log("Result: " + result);

        return result;
    };
    utils.prototype.calcPmt = function calcPmt(loanAmount, intrestRate, timeFrame) {
        var numerator = (loanAmount * intrestRate) / 12;
        var powerOutcome = Math.pow(1 + intrestRate / 12, -timeFrame);
        var denominator = 1 - powerOutcome;
        return numerator / denominator;
    };
    utils.prototype.dateFormatToDate = function (formatItem, date, dateStr) {
        var result = null;
        var day;
        var monthNum;
        var suffix;
        switch (formatItem) {
            case "d":
                day = date.getDate() + "";
                result = day;
                break;
            case "dd":
                day = date.getDate() + "";
                suffix = day.substring(day.length - 1);
                if (suffix == "1") result = day + "st";
                else if (suffix == "2") result = day + "nd";
                else if (suffix == "3") result = day + "rd";
                else result = day + "th";
                if (day == "11" || day == "12" || day == "13") result = day + "th";
                break;
            case "DD":
                day = date.getDate();
                if (day < 10) day = "0" + day;
                result = day;
                break;
            case "mmmm":
                result = this.monthName(dateStr, true, true);
                break;
            case "Lm":
                result = this.monthName(dateStr).toLowerCase();
                break;
            case "m":
            case "MMMM":
            case "MMMMM":
                result = this.monthName(dateStr);
                break;
            case "M":
            case "MMM":
                result = this.monthName(dateStr, true);
                break;
            case "LM":
            case "LMMM":
                result = this.monthName(dateStr, true).toLowerCase();
                break;
            case "mm":
                monthNum = date.getMonth() + 1;
                result = monthNum;
                break;
            case "MM":
                monthNum = date.getMonth() + 1;
                result = monthNum;
                if (monthNum < 10) result = "0" + result;
                break;
            case "mmm":
                monthNum = date.getMonth() + 1;
                monthNum = monthNum + "";
                result = this.monthName(monthNum);
                break;
            case "y":
            case "YY":
            case "YYYY":
                result = date.getFullYear();
                break;
            case "yy":
                var fullYear = date.getFullYear().toString();
                result = fullYear.substring(2);
                break;
            case "weekday":
                result = this.dayName(dateStr);
                break;
            case "CM":
            case "CMMM":
                result = this.monthName(dateStr, true).toUpperCase();
                break;
            case "Cm":
                result = this.monthName(dateStr).toUpperCase();
                break;
            case "Cdd":
                day = date.getDate() + "";
                suffix = day.substring(day.length - 1);
                if (suffix == "1") result = day + "st";
                else if (suffix == "2") result = day + "nd";
                else if (suffix == "3") result = day + "rd";
                else result = day + "th";
                if (day == "11" || day == "12" || day == "13") result = day + "th";
                result = result.toUpperCase();
                break;
            default:
                break;
        }

        return result;
    };

    utils.prototype.createAccessibleDateText = function createAccessibleDateText(result, dateStr, format) {
        var accFormat = format.replace(/(mmm|MMM|mm|MM|m|M)/g, "m");
        accFormat = accFormat.replace(/DD/g, "dd");
        accFormat = accFormat.split(/[\/\\]/).join(" ");
        if (format === accFormat) return result;
        var accText = this.formatdate(dateStr, accFormat);
        var res =
            "<span class='perso-accessibility-wrapper' role='text'><span class='perso-accessibility-no-read' " +
            "aria-hidden='true'>" +
            result +
            "</span><span class='perso-accessibility-read'>" +
            accText +
            "</span></span>";
        return res;
    };

    utils.prototype.numberWithCommas = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    utils.prototype.toFixed = function (value, digitsLimitation) {
        if (value == "undefined" || value == null) {
            return 0;
        }
        return +value.toFixed(digitsLimitation);
    };

    utils.prototype.getMax = function getMax() {
        var args = Array.prototype.slice.call(arguments);
        return Math.max.apply(null, args);
    };

    utils.prototype.getMin = function getMin() {
        var args = Array.prototype.slice.call(arguments);
        return Math.min.apply(null, args);
    };
    /**format amount functions */
    var formatDefaultAmount = function formatDefaultAmount(amountStr) {
        var formatObj = {
            minus: "",
            accessibilityMinus: "",
            number: "",
            dot: "",
            decimals: "",
            currency: "",
        };
        var value = amountStr.replace(/\,/g, "");
        value = parseFloat(value).toFixed(2);
        if (value < 0) {
            value = Math.abs(value);
            value = value.toString();
            formatObj.minus = "-";
            formatObj.accessibilityMinus = "minus ";
        }
        formatObj.number = parseInt(value);
        if (formatObj.number != value) {
            formatObj.decimals = value.slice(-2);
            formatObj.dot = ".";
        }
        return formatObj;
    };

    var wrapAmountWithSpan = function wrapAmountWithSpan(formatObj) {
        var objWithSpan = {
            minus: "<span class='perso-minus-sign'>" + formatObj.minus + "</span>",
            number: "<span class='perso-int-num'>" + formatObj.number + "</span>",
            dot: "<span class='perso-decimals-dot'>" + formatObj.dot + "</span>",
            decimals: "<span class='perso-decimals'>" + formatObj.decimals + "</span>",
            currency: "<span class='perso-currency'>" + formatObj.currency + "</span>",
        };
        var amount = formatObj.number + formatObj.dot + formatObj.decimals;
        var currencyLabel = Personetics.processor.PStoryConfig.currencySymbolLabel[formatObj.currency];
        if (amount > "1") {
            currencyLabel = currencyLabel + "s";
        }
        var amountAccessibilityString = formatObj.accessibilityMinus + amount + " " + currencyLabel;
        if (amount && amount.indexOf("0") === 0) {
            //patch for IE 11 - $0 exception
            amountAccessibilityString = formatObj.accessibilityMinus + amount + " " + currencyLabel;
        }
        objWithSpan.amountAccessibilityString = "<span class='perso-amount' role='text' aria-label='" + amountAccessibilityString + "'>";
        objWithSpan.endSpan = "</span>";
        return objWithSpan;
    };

    var formatAmountOrderParts = function formatAmountOrderParts(fullformat, formatObj) {
        var result;
        var amount = formatObj.number + formatObj.dot + formatObj.decimals;
        if (typeof fullformat == "undefined" || fullformat == null || fullformat.indexOf("@") == -1) {
            if (Personetics.processor.PStoryConfig.isRtl()) result = formatObj.currency + formatObj.minus + amount;
            else result = formatObj.minus + formatObj.currency + amount;
        } else {
            fullformat = fullformat.replace(/\-/g, formatObj.minus);
            fullformat = fullformat.replace("@", formatObj.currency);
            fullformat = fullformat.replace(/(#((.)*(#|0))?)/g, amount);
            fullformat = fullformat.replace("+", "");
            result = fullformat;
        }
        if (typeof formatObj.amountAccessibilityString != "undefined" && formatObj.amountAccessibilityString != null) {
            result = formatObj.amountAccessibilityString + result + formatObj.endSpan;
        }
        return result;
    };
    utils.prototype.formatamount = function (amountStr, currency, fullformat) {
        return this.formatAmount(amountStr, currency, fullformat);
    };
    /**
     * if there is no format or currency by default take it from the config. (for currency also useProjectDefaultCurrency)
     * if there is no configuration for them the default format is #########.00 and the default currency is ''(empty string)
     * examples of support formats:
     * '@-###.###.###,00', '+### ### ###.00', '@#########', '-###,###,###.0'
     * optional wrap the result with html span
     * the @ and - signs in the format are optionals and define the
     * @param {* - amount value for example 123.45} amountStr
     * @param {* - optional, the bank currency for example $, USD} currency
     * @param {* - optional, for example '###,###,###.00'} fullformat
     * @returns {}formmated number for example formatAmount('123456.78', '$', '###,###,###.0') will return 'USD123,456.7'.
     */
    utils.prototype.formatAmount = function (amountStr, currency, fullformat) {
        Personetics.log("Calling utils.formatAmount(" + amountStr + ", " + currency + ", " + fullformat + ")");
        if (typeof amountStr === "undefined" || amountStr == null) return null;
        /**parse amountStr to string*/
        amountStr = amountStr + "";
        if (typeof fullformat === "undefined" || fullformat === null) {
            fullformat = Personetics.processor.PStoryConfig.getConfig("amountFormat");
        }

        // Amount have 5 parts: dot, currency, minus, number, decimals
        if (
            typeof currency === "undefined" ||
            currency === null ||
            Personetics.processor.PStoryConfig.getConfig("useProjectDefaultCurrency") == true
        ) {
            currency = Personetics.processor.PStoryConfig.getConfig("currencySymbol");
        }
        var formatObj = {
            minus: "", //minus is empty for positive value;
            accessibilityMinus: "",
            number: "",
            dot: "",
            decimals: "",
            currency: currency,
        };
        if (typeof fullformat == "undefined" || fullformat == null || fullformat.length == 0) {
            formatObj = formatDefaultAmount(amountStr);
        } else {
            var format = fullformat.match(/(#((.)*(#|0))?)/g)[0];
            //support use in full format with currency sign but without minus sign
            //we don't support minus sign place without currency sign
            if (fullformat.indexOf("-") == -1 && fullformat.indexOf("@") > -1) {
                if (Personetics.processor.PStoryConfig.isRtl()) fullformat = fullformat.replace("@", "@-");
                else fullformat = fullformat.replace("@", "-@");
            }

            /**set the decimals part */
            var matches = format.match(/0/g);
            var formatHelper = format;
            var fixed = matches ? matches.length : 0;
            var value = parseFloat(amountStr).toFixed(fixed);
            if (fixed > 0) {
                formatObj.dot = format[format.length - 1 - fixed]; /**take the sign from the format and not always dot */
                fixed = fixed * -1;
                formatObj.decimals = value.slice(fixed);
                value = value.slice(0, fixed - 1); /*remove dot and decimals*/
                formatHelper = format.slice(0, fixed - 1); /*remove the decimals and the dot*/
            }

            /**check if the  format contain '+' we return absolute value */
            if (fullformat.indexOf("+") > -1) {
                value = Math.abs(value);
                value = value + ""; //parse to string
            }
            if (value.indexOf("-") > -1) {
                value = value.substring(1);
                if (value !== "0" || (value === "0" && fixed != 0 && formatObj.decimals !== "00")) {
                    formatObj.minus = "-";
                    formatObj.accessibilityMinus = "minus ";
                }
            }

            /**add the commas to the value */
            matches = formatHelper.match(/[,/. ]/g); /**space for support space in the format */
            var srcFormat = formatHelper;
            if (Array.isArray(matches)) {
                matches.reverse();
                matches.forEach(function (item) {
                    var valueLength = value.length;
                    var formatLength = formatHelper.length;
                    var helperIndex = formatHelper.lastIndexOf(item);
                    var index = formatLength - helperIndex - 1;
                    index = index + (srcFormat.length - formatLength);
                    if (index >= valueLength) {
                        return false;
                    }
                    index = index * -1;
                    value = [value.slice(0, index), item, value.slice(index)].join("");
                    formatHelper = formatHelper.slice(0, helperIndex);
                });
            }
            formatObj.number = value;
        }
        var supportHtmlTagInProcessor = Personetics.processor.PStoryConfig.getConfig("supportHtmlTagInProcessor");
        if (supportHtmlTagInProcessor === "true" || supportHtmlTagInProcessor === true) {
            formatObj = wrapAmountWithSpan(formatObj);
        }
        var resultStr = formatAmountOrderParts(fullformat, formatObj);
        Personetics.log("Result: " + resultStr);
        return resultStr;
    };
    /**end format amount functions*/
    utils.prototype.formatAmountInteger = function (amountStr, currency, format) {
        Personetics.log("Calling utils.formatAmountInteger(" + amountStr + ", " + currency + ", " + format + ")");

        amountStr = amountStr + "";
        currency = typeof currency === "undefined" || currency === null ? Personetics.processor.PStoryConfig.getConfig("currencySymbol") : currency;
        if (typeof currency === "undefined" || currency == null) currency = "";

        var value = amountStr.replace(/\,/g, "");
        value = parseInt(value);

        var resultStr;

        var unformattedStr = this.numberWithCommas(value);

        if (value < 0) resultStr = "-" + currency + unformattedStr.substring(1);
        //value = "-" + currency + Math.abs(value);
        else resultStr = currency + unformattedStr;

        Personetics.log("Result: " + resultStr);

        return resultStr;
    };

    utils.prototype.formatpercent = function formatpercent(amountStr) {
        return this.formatPercent(amountStr);
    };

    utils.prototype.formatPercent = function formatPercent(amountStr) {
        Personetics.log("Calling utils.formatPercent(" + amountStr + ")");
        var result = parseFloat(amountStr);
        result = result * 100;
        result = Math.round(result);
        result += "%";

        Personetics.log("Result: " + amount);

        return result;
    };

    utils.prototype.limitstring = function limitstring(string, maxLength) {
        return this.limitString(string, maxLength);
    };
    utils.prototype.limitString = function limitString(string, maxLength) {
        Personetics.log("Calling utils.limitString(" + string + "," + maxLength + ")");
        var _numOfChars = maxLength || parseInt(Personetics.processor.PStoryConfig.getConfig("stringMaxLength"));
        var _ellipsisString = "...";
        var result = string;
        if (string.length > _numOfChars) result = string.substring(0, _numOfChars - _ellipsisString.length) + _ellipsisString;
        return result;
    };

    utils.prototype.round = function round(amount) {
        Personetics.log("Calling utils.round(" + amount + ")");
        var numb = parseFloat(amount);
        numb = Math.round(numb);
        Personetics.log("Result: " + numb);
        return numb;
    };

    utils.prototype.abs = function abs(x) {
        Personetics.log("Calling utils.abs(" + x + ")");
        var result = null;
        if (typeof x !== "undefined" && x !== null) {
            if (typeof x == "string") result = x.replace("-", "");
            else result = x;
            result = Math.abs(result);
        }

        Personetics.log("Result: " + result);

        return result;
    };

    utils.prototype.highlighttext = function (value) {
        return this.highlightText(value);
    };
    utils.prototype.highlightText = function (value) {
        return '<span class="perso-highlight">' + value + "</span>";
    };

    utils.prototype.join = function join(leftTable, rightTable, conditionExpStr, type) {
        var joinType = type || this.tableJoinTypes.INNER;

        var regexp = /(\w*)\.(\w*)([\=\!]+)(\w*)\.(\w*)/;

        var matches = conditionExpStr.match(regexp);
        if (matches) {
            var leftColName = matches[2];
            var middlePart = matches[3];
            var rightColName = matches[5];

            var newExp =
                "_JoinLeftTable.getValue(leftIndex,'" +
                leftColName +
                "')" +
                middlePart +
                "_JoinRightTable.getValue(rightIndex,'" +
                rightColName +
                "')";
            var leftSize = leftTable.size();
            var rightSize = rightTable.size();

            var cols = leftTable.data.cols;
            var colMap = leftTable.colMap;
            var colMapIndex = cols.length;
            if (Array.isArray(rightTable.data.cols)) {
                var ar = rightTable.data.cols;
                ar.forEach(function (col) {
                    if (cols.indexOf(col) < 0) {
                        cols.push(col);
                        colMap[col] = colMapIndex;
                        colMapIndex++;
                    }
                });
            }

            var result = {
                type: "PTable",
                cols: cols,
                rows: [],
            };
            var _context, _parentContext;
            var joinTables = {
                _JoinLeftTable: leftTable,
                _JoinRightTable: rightTable,
            };
            if (typeof this.parentContext !== "undefined" && this.parentContext != null) {
                _parentContext = this.parentContext;
                _context = this.context;
                _context._JoinLeftTable = leftTable;
                _context._JoinRightTable = rightTable;
            } else {
                _parentContext = this.context;
                _context = joinTables;
            }
            for (var leftIndex = 0; leftIndex < leftSize; leftIndex++) {
                var foundValue = false;
                var newRow;
                var colName;
                var colIndex;
                var value;
                for (var rightIndex = 0; rightIndex < rightSize; rightIndex++) {
                    var exp = newExp.replace("leftIndex", leftIndex).replace("rightIndex", rightIndex);

                    var conditionExp = new Personetics.processor.PExp(exp);
                    try {
                        var conditionValue = conditionExp.eval(_context, _parentContext);
                    } catch (e) {
                        var errorMessage = "utils.join() - Error: failed to evaluate join expression." + " Error message: " + e.message;
                        var errorObject = { message: errorMessage, stack: e.stack };
                        Personetics.error(errorMessage, false, errorObject);
                    }
                    if (conditionValue) {
                        foundValue = true;
                        newRow = new Array(cols.length);
                        for (colName in colMap) {
                            if (Object.prototype.hasOwnProperty.call(colMap, colName)) {
                                colIndex = colMap[colName];
                                value = leftTable.getValue(leftIndex, colName);
                                if (!value && typeof value !== "number") value = rightTable.getValue(rightIndex, colName);
                                newRow[colIndex] = value;
                            }
                        }
                        result.rows.push(newRow);
                    }
                }

                if (!foundValue && joinType == this.tableJoinTypes.LEFT) {
                    newRow = new Array(cols.length);
                    for (colName in colMap) {
                        if (Object.prototype.hasOwnProperty.call(colMap, colName)) {
                            colIndex = colMap[colName];
                            value = leftTable.getValue(leftIndex, colName);
                            if (!value && typeof value !== "number") value = null;
                            newRow[colIndex] = value;
                        }
                    }
                    result.rows.push(newRow);
                }
            }

            var ptable = new Personetics.processor.PTable(result);

            return ptable;
        } else return leftTable;
    };

    pUtils.prototype.createSchemaFacts = function createSchemaFacts(factObj) {
        var schemaFacts = factObj.factsConfiguration.schemaFacts;
        var _parentContext = new Personetics.processor.PModel(this, factObj);
        var result = {
            newFacts: {},
        };
        schemaFacts.forEach(function (schemaFact) {
            var fact = schemaFact.fact;
            var cols = [];
            var colsExp = [];
            var attributesTypes = [];
            fact.cols.forEach(function (col) {
                cols.push(col.name);
                var exp = new Personetics.processor.PExp(col.expression);
                colsExp.push(exp);
                attributesTypes.push(col.type);
            });
            var factResult = {
                type: fact.type,
                cols: cols,
                rows: [],
                attributesTypes: attributesTypes,
            };

            var src = fact.source;
            var srcExp = new Personetics.processor.PExp(src);
            try {
                var sourceTable = srcExp.eval(_parentContext);
            } catch (e) {
                var errorMessage =
                    "utils.createSchemaFacts() - Error: failed to evaluate schemaFact source expression." +
                    " Error message: " +
                    e.message +
                    " Error stack: " +
                    e.stack;
                var errorObject = { message: errorMessage, stack: e.stack };
                Personetics.error(errorMessage, false, errorObject);
            }
            if (sourceTable) {
                var table = sourceTable.getObjArray();
                table.forEach(function (row) {
                    var newRow = [];
                    colsExp.forEach(function (colExp) {
                        var objRow = new Personetics.processor.POptionModel(row, _parentContext);
                        try {
                            var value = colExp.eval(objRow, _parentContext);
                        } catch (e) {
                            var errorMessage =
                                "utils.createSchemaFacts() - Error: failed to evaluate schemaFact column expression." +
                                " Error message: " +
                                e.message +
                                " Error stack: " +
                                e.stack;
                            var errorObject = { message: errorMessage, stack: e.stack };
                            Personetics.error(errorMessage, false, errorObject);
                        }
                        if (typeof value != "undefined" && value != null) {
                            newRow.push(value);
                        }
                    });
                    factResult.rows.push(newRow);
                });
            }
            result.newFacts[fact.name] = factResult;
        });
        return result;
    };

    Personetics.processor = Personetics.processor || {};
    Personetics.processor.PUtils = new pUtils();
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.PStoryCache = {};

    Personetics.processor.PStoryConfig = new (function () {
        this.configMap = {
            dateFormat: "MM/DD/YY",
            amountFormat: "###,###,###",
            currencySymbol: "$",
            useProjectDefaultCurrency: false,
            lang: "en",
            supportHtmlTagInProcessor: "false",
            stringMaxLength: "15",
            context: "",
            serverCallBack: "",
            calendarSunFirst: true,
        };

        this.getConfig = function (configId) {
            if (Object.prototype.hasOwnProperty.call(this.configMap, configId)) {
                return this.configMap[configId];
            }
            return null;
        };

        this.setConfig = function (configId, configValue) {
            if (Object.prototype.hasOwnProperty.call(this.configMap, configId) && configValue != "undefined" && configValue != null) {
                this.configMap[configId] = configValue;
            }
        };

        this.rtlMap = {
            en: false,
            he: true,
        };

        this.currencySymbolLabel = {
            $: "dollar",
            "€": "euro",
        };

        this.isRtl = function () {
            var lang = this.configMap["lang"];
            if (Object.prototype.hasOwnProperty.call(this.rtlMap, lang)) {
                return this.rtlMap[lang];
            }
            return false;
        };
    })();
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.PDataSource = function PDataSource(data) {
        this.data = data;
    };

    Personetics.processor.PDataSource.prototype.getType = function () {
        return this.type;
    };

    Personetics.processor.PDataSource.prototype.getData = function () {
        return this.data;
    };

    Personetics.processor.PDataSource.prototype.get = function (name) {
        var obj = this.data[name];
        if (!obj || !obj.type) return obj;

        //		if (obj.type == "Personetics.processor.PTable")
        //			return new Personetics.processor.PTable(obj)

        return obj;
    };

    Personetics.processor.PDataSource.prototype.getChild = function (obj, prop) {
        if (Object.prototype.isPrototypeOf.call(Personetics.processor.PDataSource.prototype, obj)) return obj.get(prop);
        return obj[prop];
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.PFuture = function PFuture() {
        Personetics.processor.PDataSource.call(this, { type: "future", future: true });

        this.type = "future";
        this.future = true;
    };

    Personetics.processor.PFuture.prototype = Object.create(Personetics.processor.PDataSource.prototype);

    Personetics.processor.Future = new Personetics.processor.PFuture();
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.POptionModel = function POptionModel(data, parentDataSource) {
        Personetics.processor.PDataSource.call(this, data);

        this.filteredFields = data.whiteListFields;
        this.parentDataSource = parentDataSource;
    };

    Personetics.processor.POptionModel.prototype = Object.create(Personetics.processor.PDataSource.prototype);

    Personetics.processor.POptionModel.prototype.get = function (name) {
        // only properties in the white field are allowed. If no white field is specified, anything goes
        if (!this.filteredFields || Object.prototype.hasOwnProperty.call(this.filteredFields, name)) {
            // get the name specified by the filter, if filter exists
            var filterName = this.filteredFields ? this.filteredFields[name] : name;
            var value = Personetics.processor.PDataSource.prototype.get.call(this, filterName);

            //get value from ctx
            if (typeof value == "undefined" || value == null) {
                value = this[name];
            }

            // append parent context value, if exists
            if (typeof value == "undefined" || value == null) value = this.parentDataSource.get(name);

            return value;
        } else {
            return "NOPE";
        }
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    var PTableMappingMethods = {
        sum: {
            startValue: 0,
            method: function (group, newValue) {
                return group.value + newValue;
            },
        },
        avg: {
            startValue: 0,
            method: function (group, newValue) {
                var oldSize = group.size - 1;
                var oldAvg = group.value;
                var oldSum = oldSize * oldAvg;
                return (oldSum + newValue) / group.size;
            },
        },
        count: {
            startValue: 0,
            method: function (group) {
                return group.size;
            },
        },
        standardDeviation: {
            startValue: 0,
            method: function (group, newValue, index, tableSize) {
                if (group.size == 1)
                    group.mem = {
                        items: [],
                    };

                group.mem.items.push(newValue);

                if (index == tableSize - 1) {
                    var variance;
                    var dev;
                    var avg;
                    var sum = 0;
                    group.mem.items.forEach(group.mem.items, function (item) {
                        sum += item;
                    });
                    avg = sum / group.mem.items.length;

                    group.mem.items.forEach(group.mem.items, function (item) {
                        var x = item - avg;
                        dev += Math.pow(x, 2);
                    });
                    variance = dev / group.mem.items.length;
                    return Math.sqrt(variance);
                } else {
                    return null;
                }
            },
        },
        min: {},
        max: {},
    };
    var PTableTypes = {
        PText: "PText",
        PNumber: "PNumber",
        PAmount: "PAmount",
    };
    Personetics.processor.PTable = function PTable(data) {
        Personetics.processor.PDataSource.call(this, data);
        this.name = data.name;
        this.colMap = {};
        this.data = { cols: [], rows: [] };
        this.attributesTypes = data.attributesTypes;
        this.filter.bind(this);
        this.loadTable(data);
    };

    Personetics.processor.PTable.prototype = Object.create(Personetics.processor.PDataSource.prototype);

    Personetics.processor.PTable.prototype.toString = function toString() {
        var result = {
            name: this.name,
            cols: this.data.cols,
            rows: this.data.rows,
            attributesTypes: this.data.attributesTypes,
            type: this.data.type,
        };

        return JSON.stringify(result);
    };

    Personetics.processor.PTable.prototype.loadTable = function loadTable(data) {
        if (!data || data.future) return;

        this.data = data;
        var colMap = {};
        data.cols.forEach(function (header, i) {
            colMap[header] = i;
        });
        this.colMap = colMap;
    };

    Personetics.processor.PTable.prototype.loadObjArray = function loadObjArray(objArray) {
        if (!objArray) return;

        var colMap = {};
        var rows = [];
        var i = 0;

        // Collect cols
        objArray.forEach(function (obj) {
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var colIndex = colMap[key];
                    if (!colIndex) {
                        colIndex = i++;
                        colMap[key] = colIndex;
                    }
                }
            }
        });
        this.colMap = colMap;

        // Create cols array
        var numCols = colMap.length;
        var cols = new Array(numCols);
        for (var key in colMap) {
            if (Object.prototype.hasOwnProperty.call(colMap, key)) {
                var index = colMap[key];
                cols[index] = key;
            }
        }

        // Collect rows
        objArray.forEach(function (obj) {
            var row = new Array(numCols);
            for (var key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    var value = obj[key];
                    var colIndex = colMap[key];
                    row[colIndex] = value;
                }
            }
            rows.push(row);
        });

        this.data = { cols: cols, rows: rows };
    };

    Personetics.processor.PTable.prototype.getObjArray = function getObjArray() {
        var arr = [];
        for (var row = 0; row < this.getRowCount(); row++) {
            var obj = {};
            for (var col = 0; col < this.data.cols.length; col++) {
                obj[this.data.cols[col]] = getResultByType(this.data, col, row);
            }
            arr.push(obj);
        }
        return arr;
    };

    Personetics.processor.PTable.prototype.getColIndex = function getColIndex(name) {
        return this.colMap[name];
    };

    Personetics.processor.PTable.prototype.size = function size() {
        var result;
        if (!Object.prototype.hasOwnProperty.call(this.data, "rows")) {
            result = 0;
        } else {
            result = this.data.rows.length;
        }
        return result;
    };

    Personetics.processor.PTable.prototype.getrowcount = function getrowcount() {
        return this.getRowCount();
    };
    Personetics.processor.PTable.prototype.getRowCount = function getRowCount() {
        var result = this.data && this.data.rows ? this.data.rows.length : 0;
        return result;
    };

    Personetics.processor.PTable.prototype.getrow = function getrow(rowIndex) {
        return this.getRow(rowIndex);
    };
    Personetics.processor.PTable.prototype.getRow = function getRow(rowIndex) {
        var result = [];
        for (var i = 0; i < this.data.rows[rowIndex].length; i++) {
            result[i] = getResultByType(this.data, i, rowIndex);
        }
        return result;
    };

    Personetics.processor.PTable.prototype.getfirstrows = function getfirstrows(numOfRows) {
        return this.getFirstRows(numOfRows);
    };
    Personetics.processor.PTable.prototype.getFirstRows = function getFirstRows(numOfRows) {
        var table = this;
        if (table.getRowCount() > numOfRows) {
            var rows = table.data.rows.slice(0, numOfRows);
            var resultTable = new Personetics.processor.PTable({
                cols: table.data.cols,
                rows: rows,
                name: this.name + ".getFirstRows(" + numOfRows + ")",
                attributesTypes: table.data.attributesTypes,
                type: table.data.type,
            });

            return resultTable;
        } else {
            return table;
        }
    };

    Personetics.processor.PTable.prototype.getlastrows = function getlastrows(numOfRows) {
        return this.getLastRows(numOfRows);
    };
    Personetics.processor.PTable.prototype.getLastRows = function getLastRows(numOfRows) {
        Personetics.log("Calling '" + this.name + "'.getLastRows(" + numOfRows + ")");
        var table = this;
        if (table.getRowCount() > numOfRows) {
            var rows = table.data.rows.slice(0 - numOfRows);
            var resultTable = new Personetics.processor.PTable({
                cols: table.data.cols,
                rows: rows,
                name: this.name + ".getLastRows(" + numOfRows + ")",
                attributesTypes: this.data.attributesTypes,
                type: this.data.type,
            });
            return resultTable;
        } else {
            return table;
        }
    };

    Personetics.processor.PTable.prototype.getrowasobject = function getrowasobject(rowIndex) {
        return this.getRowAsObject(rowIndex);
    };
    Personetics.processor.PTable.prototype.getRowAsObject = function getRowAsObject(rowIndex) {
        if (rowIndex < this.data.rows.length) {
            var row = this.data.rows[rowIndex];
            var result = {};
            for (var colName in this.colMap) {
                if (Object.prototype.hasOwnProperty.call(this.colMap, colName)) {
                    var index = this.colMap[colName];
                    result[colName] = row[index];
                }
            }
            return result;
        } else {
            return "";
        }
    };

    Personetics.processor.PTable.prototype.getcolumn = function getcolumn(columnName) {
        return this.getColumn(columnName);
    };
    Personetics.processor.PTable.prototype.getColumn = function getColumn(columnName) {
        Personetics.log("Calling '" + this.name + "'.getColumn(" + columnName + ")");
        var rows = this.data.rows;
        var cols = [];
        var indexCol = this.colMap[columnName];
        if (typeof indexCol != "undefined") {
            rows.forEach(function (row) {
                cols.push(row[indexCol]);
            });
            return cols;
        } else {
            Personetics.log("Result: null");
            return null;
        }
    };

    Personetics.processor.PTable.prototype.getvalue = function getvalue(rowIndex, colName) {
        return this.getValue(rowIndex, colName);
    };
    Personetics.processor.PTable.prototype.getValue = function getValue(rowIndex, colName) {
        Personetics.log("Calling '" + this.name + "'.getValue(" + rowIndex + ", " + colName + ")");
        if (
            Personetics.processor.PStoryCache["getValue." + this.name + "." + rowIndex + "." + colName] &&
            window.Personetics.processor.PStoryConfig.configMap.isPermutations
        ) {
            return Personetics.processor.PStoryCache["getValue." + this.name + "." + rowIndex + "." + colName];
        } else {
            var size = this.size();
            if (Object.prototype.hasOwnProperty.call(this.colMap, colName) && size > rowIndex) {
                var result = getResultByType(this.data, this.colMap[colName], rowIndex);
                Personetics.log("Result: " + result);
                Personetics.processor.PStoryCache["getValue." + this.name + "." + rowIndex + "." + colName] = result;
                return result;
            } else {
                Personetics.log("Result: null");
                return null;
            }
        }
    };

    var getResultByType = function getResultByType(data, colIndex, rowIndex) {
        var type =
            Object.prototype.hasOwnProperty.call(data, "attributesTypes") &&
            typeof data.attributesTypes !== "undefined" &&
            data.attributesTypes !== null
                ? data.attributesTypes[colIndex]
                : "";
        switch (type) {
            case PTableTypes.PText:
                return Personetics.processor.BlockProcessor.prototype.getTextByLanguage(data.rows[rowIndex][colIndex]);
            case PTableTypes.PAmount:
            case PTableTypes.PNumber:
                return getNumberValue(data.rows[rowIndex][colIndex]);
            default:
                return data.rows[rowIndex][colIndex];
        }
    };

    var getNumberValue = function getNumberValue(value) {
        var result = parseFloat(value);
        if (isNaN(result) || !isFinite(result)) {
            result = value;
        }
        return result;
    };

    Personetics.processor.PTable.prototype.filter = function filter(colName, validValue) {
        Personetics.log("Calling '" + this.name + "'.filter(" + colName + ", " + validValue + ")");
        // edge cases: "all" or "undefined" - for "all", return all rows
        // for "undefined" - the requirement specifies that it is better to return irrelevant results rather than no results
        if (!validValue || validValue == "all") {
            return this;
        }
        if (
            Personetics.processor.PStoryCache["filter." + this.name + "." + colName + "." + validValue] &&
            window.Personetics.processor.PStoryConfig.configMap.isPermutations
        ) {
            return Personetics.processor.PStoryCache["filter." + this.name + "." + colName + "." + validValue];
        } else {
            var rows = [];
            var i;
            for (i = 0; i < this.getRowCount(); i++) {
                var val = this.getValue(i, colName);
                if (val == validValue) rows.push(this.getRow(i));
            }

            var table = new Personetics.processor.PTable({
                cols: this.data.cols,
                rows: rows,
                name: this.name + ".filter(" + colName + ", " + validValue + ")",
                attributesTypes: this.data.attributesTypes,
                type: this.data.type,
            });

            Personetics.processor.PStoryCache["filter." + this.name + "." + colName + "." + validValue] = table;
            return table;
        }
    };

    Personetics.processor.PTable.prototype.exclude = function exclude(colName, values) {
        const stringifiedValues = JSON.stringify(Array.isArray(values) ? values.sort(): values)

        Personetics.log("Calling '" + this.name + "'.exclude(" + colName + ", " + stringifiedValues + ")");
        if (!values) {
            return this;
        }
        if (
            Personetics.processor.PStoryCache["exclude." + this.name + "." + colName + "." + stringifiedValues] &&
            window.Personetics.processor.PStoryConfig.configMap.isPermutations
        ) {
            return Personetics.processor.PStoryCache["exclude." + this.name + "." + colName + "." + stringifiedValues];
        } else {
            var rows = [];
            var i;
            for (i = 0; i < this.getRowCount(); i++) {
                var val = this.getValue(i, colName);
                var isValidValue;

                if(Array.isArray(values)) {
                    isValidValue = values.every(function (value) {
                        return value != val
                    });
                } else {
                    isValidValue = val != values;
                }

                if (isValidValue) rows.push(this.getRow(i));
            }

            var table = new Personetics.processor.PTable({
                cols: this.data.cols,
                rows: rows,
                name: this.name + ".exclude(" + colName + ", " + stringifiedValues + ")",
                attributesTypes: this.data.attributesTypes,
                type: this.data.type,
            });

            Personetics.processor.PStoryCache["exclude." + this.name + "." + colName + "." + stringifiedValues] = table;
            return table;
        }
    };

    /**
     * Filter In/Out rows from table, by column name and array from values to filter
     * @param {string} colName The column name
     * @param {Array} values All values to filter
     * @param {string} filterType Can contains "In" or "Out" to filter
     */
    Personetics.processor.PTable.prototype.specialFilter = function specialFilter(colName, values, filterType) {
        Personetics.log("Calling '" + this.name + "'.filter" + filterType + "(" + colName + ", " + values + ")");
        if (!values) {
            return this;
        }
        var rows = [];
        var i;
        var rowLength = this.getRowCount();
        for (i = 0; i < rowLength; i++) {
            var val = this.getValue(i, colName);
            var isValidVal;
            isValidVal = !Array.isArray(values)
                ? val == values
                : values.find(function (value) {
                    return value == val;
                });
            isValidVal = filterType == "Out" ? !isValidVal : isValidVal;
            if (isValidVal) rows.push(this.getRow(i));
        }
        var table = new Personetics.processor.PTable({
            cols: this.data.cols,
            rows: rows,
            name: this.name + ".filter" + filterType + "(" + colName + ", " + values + ")",
            attributesTypes: this.data.attributesTypes,
            type: this.data.type,
        });
        return table;
    };
    Personetics.processor.PTable.prototype.filterIn = function filterIn(colName, values) {
        return this.specialFilter(colName, values, "In");
    };

    Personetics.processor.PTable.prototype.filterOut = function filterOut(colName, values) {
        return this.specialFilter(colName, values, "Out");
    };

    var getBackdate = function getBackDate(currentDate, numOfDaysBack) {
        var backdate = new Date(currentDate);
        var _numOfDaysBack = numOfDaysBack ? numOfDaysBack : 0;
        backdate = new Date(backdate.setDate(backdate.getDate() + _numOfDaysBack));
        //Set hours to 00:00:00
        var backdateObj = new Date(backdate.setHours(0, 0, 0, 0));
        return backdateObj;
    };

    Personetics.processor.PTable.prototype.filterByDays = function filterByDays(colName, currentDate, fromDate, toDate) {
        currentDate = getJsFormattedDate(currentDate);
        Personetics.log("Calling '" + this.name + "'.filterByDays(" + colName + ", " + currentDate + ", " + fromDate + ", " + toDate + ")");
        var _toDate = typeof toDate !== "undefined" && toDate !== null ? getBackdate(currentDate, toDate) : getBackdate(currentDate, 0);
        var _fromDate = getBackdate(currentDate, fromDate);
        var rows = [];
        for (var i = 0; i < this.getRowCount(); i++) {
            var val = this.getValue(i, colName);
            var dateVal = new Date(getJsFormattedDate(val));
            // to compare date without hours
            dateVal.setHours(0, 0, 0, 0);
            if (typeof dateVal === "object" && dateVal <= _toDate && dateVal >= _fromDate) {
                rows.push(this.getRow(i));
            }
        }

        var table = new Personetics.processor.PTable({
            cols: this.data.cols,
            rows: rows,
            name: this.name + ".filterByDays(" + colName + ", " + currentDate + ", " + fromDate + ", " + toDate + ")",
            attributesTypes: this.data.attributesTypes,
            type: this.data.type,
        });
        return table;
    };

    Personetics.processor.PTable.prototype.groupby = function groupby(keyFieldNames, valueFieldName, mappingMethod) {
        return this.groupBy(keyFieldNames, valueFieldName, mappingMethod);
    };

    Personetics.processor.PTable.prototype.groupBy = function groupBy(keyFieldNames, valueFieldName, mappingMethod) {
        Personetics.log("Calling '" + this.name + "'.groupBy(" + keyFieldNames + ", " + valueFieldName + ", " + mappingMethod + ")");
        if (
            Personetics.processor.PStoryCache["groupBy." + this.name + "." + keyFieldNames + "." + valueFieldName] &&
            window.Personetics.processor.PStoryConfig.configMap.isPermutations
        ) {
            return Personetics.processor.PStoryCache["groupBy." + this.name + "." + keyFieldNames + "." + valueFieldName];
        } else {
            var mapping;
            if (mappingMethod && Object.prototype.hasOwnProperty.call(PTableMappingMethods, mappingMethod)) {
                mapping = PTableMappingMethods[mappingMethod];
            } else {
                mapping = PTableMappingMethods.sum;
            }

            if (!Array.isArray(keyFieldNames)) keyFieldNames = [keyFieldNames];

            var table = this;
            var cols = [];
            cols = cols.concat(keyFieldNames);
            cols.push(valueFieldName);

            var groupMap = {};
            var tableSize = table.getRowCount();
            for (var i = 0; i < tableSize; i++) {
                var key = "";
                var keyFieldValues = [];

                // get values of all keys fields for this row
                for (var keyField in keyFieldNames) {
                    if (Object.prototype.hasOwnProperty.call(keyFieldNames, keyField)) {
                        keyField = keyFieldNames[keyField];
                        var keyFieldValue = table.getValue(i, keyField);
                        keyFieldValues.push(keyFieldValue);
                        key += JSON.stringify(keyFieldValue) + ",";
                    }
                }

                // create group if not exist
                var group = groupMap[key];
                if (!group) {
                    group = {
                        key: key,
                        keyValues: keyFieldValues,
                        value: mapping.startValue,
                        size: 0,
                    };
                    groupMap[key] = group;
                }

                group.size++;

                // add value of value field to group value
                var value = table.getValue(i, valueFieldName);
                value = Number(value);
                group.value = mapping.method(group, value, i, tableSize);
            }

            var rows = [];
            for (group in groupMap) {
                if (Object.prototype.hasOwnProperty.call(groupMap, group)) {
                    var row = [];
                    var groupValue = groupMap[group];
                    for (var j = 0; j < keyFieldNames.length; j++) {
                        row.push(groupValue.keyValues[j]);
                    }
                    row.push(groupValue.value);
                    rows.push(row);
                }
            }

            var resultTable = new Personetics.processor.PTable({
                cols: cols,
                rows: rows,
                name: this.name + ".groupBy(" + keyFieldNames + ", " + valueFieldName + ", " + mappingMethod + ")",
                attributesTypes: this.data.attributesTypes,
                type: this.data.type,
            });

            Personetics.processor.PStoryCache["groupBy." + this.name + "." + keyFieldNames + "." + valueFieldName] = resultTable;
            return resultTable;
        }
    };

    Personetics.processor.PTable.prototype.groupByExpression = function groupByExpression(expression) {
        Personetics.log("Calling '" + this.name + "'.groupByExpression(" + expression + ")");
        var exp = new Personetics.processor.PExp(expression);

        var objArray = this.getObjArray();
        var rows = this.data.rows;
        var cols = this.data.cols;
        var groups = {};

        var me = this;
        if (Array.isArray(rows)) {
            rows.forEach(function (row, index) {
                var context = objArray[index];
                //TODO: pass parent context as well
                try {
                    var key = exp.eval(context);

                    if (!Object.prototype.hasOwnProperty.call(groups, key)) {
                        groups[key] = [];
                    }
                    groups[key].push(row);
                } catch (e) {
                    e.message =
                        me.name +
                        "'.groupByExpression(" +
                        expression +
                        ") Error: Failed to evaluate row " +
                        index +
                        ", ignoring row " +
                        " Error message: " +
                        e.message;
                    Personetics.error(e.message, false, e);
                }
            });
        }

        var tables = [];

        for (var key in groups) {
            if (Object.prototype.hasOwnProperty.call(groups, key)) {
                var group = groups[key];
                var table = new Personetics.processor.PTable({
                    cols: cols,
                    rows: group,
                    name: this.name + ".groupByExpression(" + expression + ")",
                    attributesTypes: this.data.attributesTypes,
                    type: this.data.type,
                });
                var resultTable = {
                    table: table,
                    groupedKey: key,
                };
                tables.push(resultTable);
            }
        }

        // //TODO: only do this code if debugging mode is on
        // var res = "[";
        // var sep = "";
        // for(var k = 0; k < tables; k++){
        // 	sep = ",";
        // 	res += sep + tables[k].toString();
        // }
        // res += "]";
        // Personetics.log("Result: " + res);
        return tables;
    };

    Personetics.processor.PTable.prototype.sortbydate = function sortbydate(colNames, direction) {
        return this.sortByDate(colNames, direction);
    };
    Personetics.processor.PTable.prototype.sortByDate = function sortByDate(colNames, direction) {
        Personetics.log("Calling '" + this.name + "'.sortByDate(" + colNames + ", " + direction + ")");
        var asc = 1;
        if (direction) {
            if (direction.toLowerCase() == "asc") {
                asc = 1;
            } else if (direction.toLowerCase() == "desc") {
                asc = -1;
            }
        }

        var table = this;
        if (!Array.isArray(colNames)) colNames = [colNames];
        var cols = [];
        colNames.forEach(function (name) {
            var col = table.colMap[name];
            cols.push(col);
        });

        var newRows = this.data.rows.slice(0);
        newRows.sort(function (a, b) {
            for (var i = 0; i < cols.length; i++) {
                var col = cols[i];
                var valA = new Date(getJsFormattedDate(a[col])).getTime();
                var valB = new Date(getJsFormattedDate(b[col])).getTime();
                var val = valA - valB;
                if (val != 0) {
                    return asc * val;
                }
            }
            return 0;
        });

        var resultTable = new Personetics.processor.PTable({
            cols: table.data.cols,
            rows: newRows,
            attributesTypes: table.data.attributesTypes,
            type: table.data.type,
        });

        return resultTable;
    };
    Personetics.processor.PTable.prototype.sortbymonth = function sortbymonth(colNames, direction) {
        return this.sortByMonth(colNames, direction);
    };
    Personetics.processor.PTable.prototype.sortByMonth = function sortByMonth(colNames, direction) {
        Personetics.log("Calling '" + this.name + "'.sortByMonth(" + colNames + ", " + direction + ")");
        if (
            Personetics.processor.PStoryCache["sortByMonth." + this.name + "." + colNames + "." + direction] &&
            window.Personetics.processor.PStoryConfig.configMap.isPermutations
        ) {
            return Personetics.processor.PStoryCache["sortByMonth." + this.name + "." + colNames + "." + direction];
        } else {
            var table = this;
            if (!Array.isArray(colNames)) colNames = [colNames];
            var cols = [];
            colNames.forEach(function (name) {
                var col = table.colMap[name];
                cols.push(col);
            });
            var newRows = this.data.rows.slice(0);
            var range;
            newRows.sort(function (a, b) {
                for (var i = 0; i < cols.length; i++) {
                    var col = cols[i];
                    var valA = parseInt(a[col]);
                    var valB = parseInt(b[col]);
                    return valA - valB;
                }
                return 0;
            });
            var index = 0;
            for (var i = 1; i < newRows.length; i++) {
                range = Math.abs(newRows[i][0] - newRows[i - 1][0]);
                if (range > 1) {
                    index = i;
                    break;
                }
            }
            var finalRows;
            if (index > 0) {
                finalRows = newRows.slice(index);
                finalRows = finalRows.concat(newRows.slice(0, index));
            } else {
                finalRows = newRows;
            }
            if (direction && direction.toLowerCase() == "desc") {
                finalRows.reverse();
            }
            var resultTable = new Personetics.processor.PTable({
                cols: table.data.cols,
                rows: finalRows,
                name: this.name + ".sortByMonth(" + colNames + ", " + direction + ")",
                attributesTypes: table.data.attributesTypes,
                type: table.data.type,
            });

            Personetics.processor.PStoryCache["sortByMonth." + this.name + "." + colNames + "." + direction] = resultTable;
            return resultTable;
        }
    };

    Personetics.processor.PTable.prototype.sortby = function sortby(colNames, direction, type) {
        return this.sortBy(colNames, direction, type);
    };
    Personetics.processor.PTable.prototype.sortBy = function sortBy(colNames, direction, type) {
        Personetics.log("Calling '" + this.name + "'.sortBy(" + colNames + ", " + direction + ", " + type + ")");
        if (
            typeof this.attributesTypes != "undefined" &&
            Personetics.processor.PStoryCache["sortBy." + this.name + "." + colNames + "." + direction] &&
            window.Personetics.processor.PStoryConfig.configMap.isPermutations
        ) {
            return Personetics.processor.PStoryCache["sortBy." + this.name + "." + colNames + "." + direction];
        } else {
            var asc = 1;
            if (direction) {
                if (direction.toLowerCase() == "asc") {
                    asc = 1;
                } else if (direction.toLowerCase() == "desc") {
                    asc = -1;
                }
            }

            var table = this;
            if (!Array.isArray(colNames)) colNames = [colNames];
            var cols = [];
            colNames.forEach(function (name) {
                var col = table.colMap[name];
                cols.push(col);
            });

            var newRows = this.data.rows.slice(0);
            newRows.sort(function (a, b) {
                for (var i = 0; i < cols.length; i++) {
                    var col = cols[i];
                    var valA = !isNaN(a[col]) ? parseFloat(a[col]) : a[col];
                    var valB = !isNaN(b[col]) ? parseFloat(b[col]) : b[col];
                    if (valA > valB) return asc;
                    if (valA < valB) return -asc;
                }
                return 0;
            });

            var resultTable = new Personetics.processor.PTable({
                cols: table.data.cols,
                rows: newRows,
                attributesTypes: table.data.attributesTypes,
                type: table.data.type,
            });

            Personetics.processor.PStoryCache["sortBy." + this.name + "." + colNames + "." + direction] = resultTable;
            return resultTable;
        }
    };
    Personetics.processor.PTable.prototype.getasgroupedTable = function getasgroupedTable(valueFunc) {
        return this.getAsGroupedTable(valueFunc);
    };
    Personetics.processor.PTable.prototype.getAsGroupedTable = function getAsGroupedTable(valueFunc) {
        Personetics.log("Calling '" + this.name + "'.getAsGroupedTable(" + valueFunc + ")");
        var groups = [];
        var curGroup;
        var valToIndices = {};
        if (Array.isArray(this.data.rows)) {
            this.data.rows.forEach(function (row) {
                var val = valueFunc(row).trim();
                var valIndex = valToIndices[val];
                if (typeof valIndex === "undefined" || valIndex === null) {
                    curGroup = {
                        encValue: Personetics.utils.string.stripSpecialChars(val),
                        value: val,
                        rows: [],
                    };
                    groups.push(curGroup);
                    var index = groups.length - 1;
                    valToIndices[val] = index;
                } else {
                    curGroup = groups[valIndex];
                }
                var newRow = jQuery.extend({}, row);
                curGroup.rows.push(newRow);
            });
        }

        Personetics.log("Result: " + groups);

        return groups;
    };

    Personetics.processor.PTable.prototype.max = function max(colName) {
        Personetics.log("Calling '" + this.name + "'.max(" + colName + ")");
        var result = this.extremum(
            colName,
            function (extremeVal, val) {
                return extremeVal < val;
            },
            "max"
        );
        Personetics.log("Result: " + result);
        return result;
    };

    Personetics.processor.PTable.prototype.min = function min(colName) {
        Personetics.log("Calling '" + this.name + "'.min(" + colName + ")");
        var result = this.extremum(
            colName,
            function (extremeVal, val) {
                return extremeVal > val;
            },
            "min"
        );
        Personetics.log("Result: " + result);
        return result;
    };

    Personetics.processor.PTable.prototype.extremum = function extremum(colName, isNewExtremeFunc, callingMethodName) {
        if (this.getRowCount() == 0) return this;

        var colIndex = this.getColIndex(colName);
        var extremRow = this.data.rows[0];
        var extremVal = extremRow[colIndex];
        for (var i = 0; i < this.getRowCount(); i++) {
            var row = this.data.rows[i];
            var val = row[colIndex];
            var floatExtremVal = typeof extremVal == "string" ? parseFloat(extremVal) : extremVal;
            var floatVal = typeof val == "string" ? parseFloat(val) : val;
            if (isNewExtremeFunc(floatExtremVal, floatVal)) {
                extremVal = val;
                extremRow = row;
            }
        }

        // BUG: when changing i to j (duplicate var), model variable is not found?!
        // var extremRowObj = {};
        // for (var i=0;i<this.data.cols.length;i++)
        // 	extremRowObj[this.data.cols[i]] = extremRow[i];
        //
        // return extremRowObj;

        var resultTable = new Personetics.processor.PTable({
            cols: this.data.cols,
            rows: [extremRow],
            name: this.name + "." + callingMethodName + "(" + colName + ", " + isNewExtremeFunc + ")",
            attributesTypes: this.data.attributesTypes,
            type: this.data.type,
        });
        return resultTable;
    };

    Personetics.processor.PTable.prototype.addComputedCol = function addComputedCol(colName, expStr) {
        var exp = new Personetics.processor.PExp(expStr);
        var newCols = this.data.cols.slice(0);
        newCols.push(colName);
        var newRows = [];
        var me = this;
        for (var i = 0; i < this.getRowCount(); i++) {
            var row = this.data.rows[i];
            //TODO: pass parent context as well
            try {
                var val = exp.eval(row);
                var newRow = row.slice(0);
                newRow.push(val);
                newRows.push(newRow);
            } catch (e) {
                Personetics.error(
                    me.name +
                    "'.addComputedCol(" +
                    colName +
                    ", " +
                    expStr +
                    ") Error: Failed to " +
                    "valuate row " +
                    i +
                    ", ignoring row " +
                    " Error message: " +
                    e.message,
                    false,
                    e
                );
            }
        }

        var resultTable = new Personetics.processor.PTable({
            cols: newCols,
            rows: newRows,
            name: this.name + ".addComputedCol(" + colName + ", " + expStr + ")",
            attributesTypes: this.data.attributesTypes,
            type: this.data.type,
        });

        return resultTable;
    };

    Personetics.processor.PTable.prototype.map = function map(colName, mappingMethod, optStartVal) {
        if (this.getRowCount() == 0) return typeof optStartVal != "undefined" ? optStartVal : {};

        var returnValue = optStartVal || 0;
        for (var i = 0; i < this.getRowCount(); i++) {
            returnValue = mappingMethod(returnValue, this.getValue(i, colName));
        }

        return returnValue;
    };

    Personetics.processor.PTable.prototype.sum = function (colName) {
        Personetics.log("Calling '" + this.name + "'.sum(" + colName + ")");
        var result = this.map(
            colName,
            function (oldValue, newValue) {
                var oldValueNum = oldValue;
                if (typeof oldValue === "string") oldValueNum = parseFloat(oldValue);

                var newValueNum = newValue;
                if (typeof newValue === "string") newValueNum = parseFloat(newValue);

                return oldValueNum + newValueNum;
            },
            0
        );

        Personetics.log("Result: " + result);

        return result;
    };

    Personetics.processor.PTable.prototype.avg = function (colName) {
        Personetics.log("Calling '" + this.name + "'.avg(" + colName + ")");
        var result = 0;
        if (this.getRowCount() > 0) {
            var sum = this.sum(colName);
            result = sum / this.getRowCount();
        }

        Personetics.log("Result: " + result);

        return result;
    };

    Personetics.processor.PTable.prototype.first = function first(colName) {
        Personetics.log("Calling '" + this.name + "'.first(" + colName + ")");
        var result;
        var count = this.getRowCount();
        if (count > 0) {
            if (colName) result = this.getValue(0, colName);
            else {
                var rows = [];
                rows.push(this.getRow(0));
                var table = new Personetics.processor.PTable({
                    cols: this.data.cols,
                    rows: rows,
                    name: this.name + ".first(" + colName + ")",
                    attributesTypes: this.data.attributesTypes,
                    type: this.data.type,
                });
                result = table.getObjArray()[0];
            }
        } else result = this;

        Personetics.log("Result: " + result);

        return result;
    };

    Personetics.processor.PTable.prototype.last = function (colName) {
        Personetics.log("Calling '" + this.name + "'.last(" + colName + ")");
        var result;
        var count = this.getRowCount();
        if (count > 0) {
            if (colName) result = this.getValue(count - 1, colName);
            else {
                var rows = [];
                rows.push(this.getRow(count - 1));
                var table = new Personetics.processor.PTable({
                    cols: this.data.cols,
                    rows: rows,
                    name: this.name + ".last(" + colName + ")",
                    attributesTypes: this.data.attributesTypes,
                    type: this.data.type,
                });
                result = table.getObjArray()[0];
            }
        } else {
            if (colName) {
                if (colName == "month" || colName == "amount") return 0;
                else result = null;
            } else {
                result = null;
            }
        }

        Personetics.log("Result: " + result);

        return result;
    };

    Personetics.processor.PTable.prototype.abs = function (colName) {
        Personetics.log("Calling '" + this.name + "'.last(" + colName + ")");
        var i;
        var absRows = [];
        var colIndex = this.colMap[colName];
        for (i = 0; i < this.getRowCount(); i++) {
            var currentRow = this.getRow(i);
            var absRow = [];
            for (var j = 0; j < currentRow.length; j++) {
                var value = currentRow[j];
                if (j == colIndex) value = Math.abs(value);
                absRow.push(value);
            }
            absRows.push(absRow);
        }

        var result = new Personetics.processor.PTable({
            cols: this.data.cols,
            rows: absRows,
            name: this.name + ".abs(" + colName + ")",
            attributesTypes: this.data.attributesTypes,
            type: this.data.type,
        });

        return result;
    };

    Personetics.processor.PTable.prototype.mod = function (colName, modNumber) {
        Personetics.log("Calling '" + this.name + "'.last(" + colName + ")");
        var i;
        var modRows = [];
        var colIndex = this.colMap[colName];
        for (i = 0; i < this.getRowCount(); i++) {
            var currentRow = this.getRow(i);
            var modRow = [];
            for (var j = 0; j < currentRow.length; j++) {
                var value = currentRow[j];
                if (j == colIndex) value = value % modNumber;
                modRow.push(value);
            }
            modRows.push(modRow);
        }

        var result = new Personetics.processor.PTable({
            cols: this.data.cols,
            rows: modRows,
            name: this.name + ".mod(" + colName + "," + modNumber + ")",
            attributesTypes: this.data.attributesTypes,
            type: this.data.type,
        });

        return result;
    };

    Personetics.processor.PTable.prototype.floor = function (colName, floorNumber) {
        Personetics.log("Calling '" + this.name + "'.last(" + colName + ")");
        var i;
        var modRows = [];
        var colIndex = this.colMap[colName];
        for (i = 0; i < this.getRowCount(); i++) {
            var currentRow = this.getRow(i);
            var modRow = [];
            for (var j = 0; j < currentRow.length; j++) {
                var value = currentRow[j];
                if (j == colIndex) value = value - (value % floorNumber);
                modRow.push(value);
            }
            modRows.push(modRow);
        }

        var result = new Personetics.processor.PTable({
            cols: this.data.cols,
            rows: modRows,
            name: this.name + ".floor(" + colName + "," + floorNumber + ")",
            attributesTypes: this.data.attributesTypes,
            type: this.data.type,
        });

        return result;
    };

    Personetics.processor.PTable.prototype.selectcolumns = function selectcolumns() {
        return this.selectColumns.apply(this, arguments);
    };

    Personetics.processor.PTable.prototype.selectColumns = function () {
        var colNamesArray = Array.prototype.slice.call(arguments);
        if (colNamesArray && colNamesArray.length) {
            var cols = [];
            var rows = [];
            var attributesTypes = [];

            for (var i = 0; i < colNamesArray.length; i++) {
                if (colNamesArray[i]) {
                    cols.push(colNamesArray[i]);
                    attributesTypes.push(this.getColAttrType(colNamesArray[i]));
                }
            }

            for (var k = 0; k < this.getRowCount(); k++) {
                var newRow = [];
                for (var j = 0; j < colNamesArray.length; j++) {
                    if (colNamesArray[j]) {
                        newRow.push(this.getValue(k, colNamesArray[j]));
                    }
                }
                rows.push(newRow);
            }

            var result = new Personetics.processor.PTable({
                cols: cols,
                rows: rows,
                name: this.name + ".selectColumns(" + colNamesArray.toString() + ")",
                attributesTypes: attributesTypes,
                type: this.data.type,
            });
            return result;
        }
    };

    Personetics.processor.PTable.prototype.getColAttrType = function (colName) {
        if (colName) {
            var colNameIndex = this.data.cols.indexOf(colName);
            return this.data.attributesTypes[colNameIndex];
        }
    };

    /**
     * getJsFormattedDate(dateStr) -> convert JAVA format date to supported JS format
     * */
    var getJsFormattedDate = function getJsFormattedDate(dateStr) {
        var parsedDateStr = dateStr.split(".")[0].replace(/T/g, " ");
        parsedDateStr = parsedDateStr.split("-").join("/");
        var formattedDate = isNaN(Date.parse(parsedDateStr)) ? dateStr : parsedDateStr;
        return formattedDate;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    var PrimitiveFactTypes = ["PNumber", "PAmount", "PDate", "PString"];
    Personetics.processor.PFact = function PFact(data, dataType, formats) {
        Personetics.processor.PTable.call(this, data);
        this.dataType = dataType;
        this.formats = formats;
        this.name = data.name;

        this.isPrimitive = PrimitiveFactTypes.indexOf(dataType) >= 0;
    };

    Personetics.processor.PFact.prototype = Object.create(Personetics.processor.PTable.prototype);

    Personetics.processor.PFact.prototype.get = function (key) {
        var colName = key;
        if (this.isPrimitive) colName = "value";

        var value = this.getValue(0, colName);

        return value;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.PQuery = function PQuery(cfg, model) {
        this.queryName = cfg.queryName;
        this.model = model;
        this.preQueryParams = cfg.queryParams;
        this.queryParams = {};
        this.data = null;

        this.evalParams();
    };

    Personetics.processor.PQuery.prototype.evalParams = function () {
        var me = this;

        this.preQueryParams.forEach(function (paramObject) {
            var paramName = paramObject.paramName;
            var varName = paramObject.varName;
            var exp = new Personetics.processor.PExp(varName);
            var val = exp.eval(me.model);
            if (val) {
                me.queryParams[paramName] = val;
            }
        });
    };

    Personetics.processor.PQuery.prototype.getCacheKey = function () {
        var cacheKey = this.queryName + "?";
        for (var key in this.queryParams) {
            if (Object.prototype.hasOwnProperty.call(this.queryParams, key)) {
                cacheKey += key + "=" + this.queryParams[key] + "&";
            }
        }
        return cacheKey;
    };

    Personetics.processor.PQuery.prototype.getData = function (block) {
        if (this.data) return this.data;

        if (!personetics.pserverProxy) return null;

        personetics.getQueryData(
            {
                id: block.story.insight.id,
                queryName: this.queryName,
                queryParams: this.queryParams,
            },
            Personetics.bind(this, this.handleQuery)
        );

        return Personetics.processor.Future;
    };

    Personetics.processor.PQuery.prototype.handleQuery = function (data) {
        this.model.handleQuery(this, data);
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.PModel = function PModel(parent, options) {
        Personetics.processor.PDataSource.call(this, options.facts);
        this.initPModel(options.facts, options.expressions, options.externalParams);
        this.parent = parent;
    };

    Personetics.processor.PModel.prototype = Object.create(Personetics.processor.PDataSource.prototype);

    Personetics.processor.PModel.prototype.initPModel = function initPModel(facts, expressions, externalParams) {
        this.factsConfigs = {};
        this.facts = facts;

        this.expressionsConfigs = {};
        this.expressions = expressions;

        this.varCfgs = {};
        this.varValues = {};
        this.externalParams = externalParams || {};

        /*varValues stay also after pevius dialog click*/
        this.varValuesForSave = {};
        this.varDlgMapping = {};
        this.queryCfgs = {};
        this.queryCache = {};

        this.exps = {};
        this.cache = {};
        this.staticCache = {};

        this.setupObjFactory();

        mapObjects(this.facts, this.factsConfigs);
        mapObjects(this.expressions, this.expressionsConfigs);

        this.listeners = [];
    };

    Personetics.processor.PModel.prototype.setFormats = function (formats) {
        this.formats = formats;
    };

    Personetics.processor.PModel.prototype.setupObjFactory = function () {
        var model = this;

        this.objFactory = {};
        this.objFactory["PTable"] = function (data) {
            return new Personetics.processor.PTable(data);
        };
        this.objFactory["PObjList"] = function (data) {
            var table = new Personetics.processor.PTable();
            table.loadObjArray(data);
            return table;
        };

        this.objFactory["PFact"] = function (data, type) {
            return new Personetics.processor.PFact(data, type, model.formats);
        };
    };

    Personetics.processor.PModel.prototype.createObj = function (type, data) {
        var obj = data;
        var modelType = type;
        if (type != "PTable" && type != "PObjList") modelType = "PFact";
        var creator = this.objFactory[modelType];
        if (creator) obj = creator(data, type);
        if (obj.isPrimitive) obj = obj.get();
        return obj;
    };

    Personetics.processor.PModel.prototype.test = function (id) {
        var val = this.get(id, { test: true });
        return {
            success: val ? true : false,
            value: val,
        };
    };

    Personetics.processor.PModel.prototype.get = function (id, options) {
        var errorObject = null;

        // try to get from cache
        var val = this.cache[id];
        if (typeof val !== "undefined" && val !== null) return val;

        // try to get from static cache
        val = this.staticCache[id];
        if (typeof val !== "undefined" && val !== null) return val;

        // try to evaluate using var
        var varCfg = this.varCfgs[id];
        if (!val && varCfg) {
            val = this.getVarValue(id);
        }

        // try to evaluate widget var
        var externalParams = this.externalParams[id];
        if ((val === null || typeof val === "undefined") && externalParams) {
            val = externalParams;
        }

        // try to evaluate from story data - facts
        var dataCfg = this.factsConfigs[id];
        if ((val === null || typeof val === "undefined") && dataCfg) {
            val = dataCfg;
            if (typeof val === "undefined" || val === null) {
                Personetics.log(
                    "PStoryModel.get('" + id + "') - Error: fact exists but is invalid: '" + val + "'. " + "Trying to evaluate as expression"
                );
            } else {
                if (dataCfg.type) {
                    val.name = id;
                    val = this.createObj(dataCfg.type, val);
                }
            }
        }

        // try to get from expressions
        var expDataCfg = this.expressionsConfigs[id];
        var exp;
        if ((val === null || typeof val === "undefined") && expDataCfg) {
            exp = new Personetics.processor.PExp(expDataCfg);
            try {
                val = exp.eval(this);
            } catch (e) {
                Personetics.log("PStoryModel.get('" + id + "') Error - Invalid expression string: '" + expDataCfg + "'");
                Personetics.error(errorMessage, true, options);
            }
            if (typeof val === "undefined" || val === null) {
                Personetics.log(
                    "PStoryModel.get('" + id + "') - Error: expression exists but is invalid: '" + val + "'. " + "Trying to evaluate as expression"
                );
            }
        }

        // this is problematic and can cause infinite loops
        if (typeof val === "undefined" || val === null) {
            if (this.lastGetValue && this.lastGetValue == id) {
                // break endless loop of PModel calling PExp calling model on a variable which can't be found in facts
                // or evaluated as expression
                // not logging because this code should return to the PModel.get method a few lines below
                this.lastGetValue = null;
                return null;
            }
            this.lastGetValue = id;
            exp = new Personetics.processor.PExp(id);
            try {
                val = exp.eval(this, null, options);
                if (typeof val === "undefined" || val === null) {
                    errorObject = new Error(
                        "PStoryModel.get('" + id + "') - Error: Evaluating as expression returned an invalid result: '" + val + "'"
                    );
                }
            } catch (e) {
                val = null;
                errorObject = {
                    message: "PStoryModel.get('" + id + "') Error: Failed to evaluate as expression: \n\t Error: " + e.message,
                    stack: e.stack,
                };
            }
        }

        if (typeof val !== "undefined" && val !== null) {
            this.cache[id] = val;
        } else {
            Personetics.error(errorObject.message, false, errorObject, options);
        }

        return val;
    };

    Personetics.processor.PModel.prototype.fetchFromSrc = function (block, src) {
        var errorObject = null;
        var hasError = false;
        var result = null;
        if (src == "query") {
            var queryObj = new Personetics.processor.PQuery(
                {
                    queryName: block.config.queryName,
                    queryParams: block.config.queryParams,
                },
                this
            );

            this.currentQueryBlock = block;
            return queryObj.getData(block);
        } else {
            var exp = new Personetics.processor.PExp(src);
            try {
                result = exp.eval(this);
                if (typeof result === "undefined" || result === null) {
                    errorObject = new Error(
                        "PStoryModel.fetchFromSrc('" + src + "') - Error: Evaluating as " + "expression returned an invalid result: '" + result + "'"
                    );
                    hasError = true;
                }
            } catch (e) {
                errorObject = {
                    message:
                        "PStoryModel.fetchFromSrc('" + src + "') - Error: Failed to evaluate " + "source as expression \n\t" + " Error: " + e.message,
                    stack: e.stack,
                };
                hasError = true;
                // throw "Source is not available: '" + src + "' - " + e || e.message;
            }
            if (hasError) {
                Personetics.error(errorObject.message, false, errorObject);
            }
            return result;
        }
    };

    Personetics.processor.PModel.prototype.getData = function () {
        return this.facts;
    };

    Personetics.processor.PModel.prototype.setVarValue = function (key, value) {
        var me = this;
        if (!Object.prototype.hasOwnProperty.call(this.varCfgs, key)) this.varCfgs[key] = key;
        this.cache = {};
        var valueToSet = value ? value : null;
        this.varValues[key] = valueToSet;

        this.listeners.forEach(function (listenerObj) {
            var listener = listenerObj.listener;
            var callback = listenerObj.callback;

            callback.call(listener, me.varValues);
        });
    };

    Personetics.processor.PModel.prototype.setDlgVarMapping = function (dlgId, blockType, blockVar) {
        if (!Object.prototype.hasOwnProperty.call(this.varDlgMapping, dlgId)) this.varDlgMapping[dlgId] = { dialogId: dlgId, variables: {} };
        if (blockType && blockVar) {
            this.varDlgMapping[dlgId]["variables"][blockType] = blockVar;
        }
    };

    Personetics.processor.PModel.prototype.getDlgVarMapping = function () {
        var me = this;
        return this.varDlgMapping
            ? Object.keys(this.varDlgMapping).map(function (index) {
                return me.varDlgMapping[index];
            })
            : [];
    };

    Personetics.processor.PModel.prototype.getVarValue = function (key) {
        return this.varValues[key];
    };

    Personetics.processor.PModel.prototype.handleQuery = function (query, queryData) {
        var params;
        if (typeof queryData !== "undefined" && queryData !== null && Object.prototype.hasOwnProperty.call(queryData, "story")) {
            if (Object.prototype.hasOwnProperty.call(queryData.story, "insightFacts")) params = queryData.story.insightFacts.query;
            else params = queryData.story.facts.query;

            params.name = "query";
            var dataObj = this.createObj(queryData.type, params);
            query.data = dataObj;

            var cacheKey = query.getCacheKey();
            this.queryCfgs[cacheKey] = query;
            this.factsConfigs["query"] = dataObj;
            if (this.currentQueryBlock) this.parent.handleQueryData(this.currentQueryBlock, dataObj);
        }
        var errorObj = new Error("Personetics.processor.PModel.prototype.handleQuery - Invalid query params: " + JSON.stringify(queryData));
        Personetics.error(errorObj.message, true);
    };

    Personetics.processor.PModel.prototype.addListener = function (listener, callback) {
        this.listeners.push({
            listener: listener,
            callback: callback,
        });
    };

    var mapObjects = function mapObjects(obj, objConfig) {
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                objConfig[key] = obj[key];
            }
        }
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    var TemplateStartToken = "{{";
    var TemplateEndToken = "}}";
    var TemlateTokenRegex = /{{([^\n\t\v{}]*)}}/g;

    Personetics.processor.PTextTemplate = function PTextTemplate(textTemplate, globalContext) {
        this.textTemplate = textTemplate;
        this.globalContext = globalContext;
        this.tokens = {};

        this.compile();
    };

    Personetics.processor.PTextTemplate.prototype.compile = function () {
        if (this.textTemplate && this.textTemplate.length > 0) {
            var me = this;

            var matches = this.textTemplate.match(TemlateTokenRegex);
            if (matches) {
                matches.forEach(function (match) {
                    if (!Object.prototype.hasOwnProperty.call(me.tokens, match)) {
                        var exp = match.replace(TemplateStartToken, "").replace(TemplateEndToken, "");
                        if (
                            me.globalContext.expressions &&
                            Object.prototype.hasOwnProperty.call(me.globalContext.expressions, exp) &&
                            me.globalContext.expressions[exp]
                        ) {
                            exp = me.globalContext.expressions[exp];
                        }
                        var token = {};

                        token.str = exp;
                        token.exp = new Personetics.processor.PExp(exp);

                        me.tokens[match] = token;
                    }
                });
            }
        }
    };

    Personetics.processor.PTextTemplate.prototype.process = function (context, parentContext) {
        var textTemplate = this.textTemplate;
        var tokens = this.tokens;
        var me = this;

        for (var tokenName in tokens) {
            if (Object.prototype.hasOwnProperty.call(tokens, tokenName)) {
                var token = tokens[tokenName];
                var value;

                var data = context ? context : me.globalContext;
                /*
                    in case eval function with data as a parameter throws error,
                    eval is invoked again with sending parentContext object.
                */
                try {
                    value = token.exp.eval(data, parentContext);
                } catch (e) {
                    Personetics.error(
                        "PTextTemplate.process('" +
                        this.textTemplate +
                        "') - Error: Failed to evaluate " +
                        "token '" +
                        token.str +
                        ". Error message: " +
                        e.message,
                        false,
                        e
                    );
                    value = "{{" + token.str + "}}";
                }

                // // escape tokens which have special regex characters in them
                // // TODO: create utility method
                // var tokenNameEscaped = tokenName.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");

                // var regexp = new RegExp(tokenNameEscaped, "g");
                textTemplate = textTemplate.split(tokenName).join(value);
            }
        }

        return textTemplate;
    };

    Personetics.processor.PTextTemplate.prototype.getTextTemplate = function () {
        return this.textTemplate;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.BlockProcessor = function BlockProcessor(parent, config, texts, model, dlgId, index) {
        this.parent = parent;
        this.config = config;
        this.model = model;
        this.texts = texts;
        this.dlgId = dlgId;
        this.index = index;
    };

    // special code which should run before data procession
    Personetics.processor.BlockProcessor.prototype.initProcessor = function () {};

    // create the json object which will be rendered by block layout renderer
    Personetics.processor.BlockProcessor.prototype.processData = function () {
        this.layoutInstructions = this.copyConfig(this.config);
        delete this.layoutInstructions.showIf;
        this.setDefaultSelectedValue();
        return this.layoutInstructions;
    };

    Personetics.processor.BlockProcessor.prototype.processText = function (textId, context, parentContext) {
        var pTxt = this.getText(textId);
        if (!pTxt) return "-";
        return pTxt.process(context, parentContext, this);
    };

    Personetics.processor.BlockProcessor.prototype.getText = function (textId) {
        var txt;
        if (this.texts && Object.prototype.hasOwnProperty.call(this.texts, textId) && this.texts[textId]) {
            txt = new Personetics.processor.PTextTemplate(this.texts[textId], this.model);
        }
        return txt;
    };

    Personetics.processor.BlockProcessor.prototype.getRealValue = function (simpleValue) {
        return simpleValue;
    };

    Personetics.processor.BlockProcessor.prototype.setSelectedValue = function (value) {
        this.config.selected = value;
    };

    Personetics.processor.BlockProcessor.prototype.handleQueryData = function handleQueryData(data) {
        this.doProcessData(data);
    };

    Personetics.processor.BlockProcessor.doProcessData = function doProcessData() {
        throw "Personetics.processor.BlockProcessor.doProcessData - Not implemented for block class '" + this.config.type + "'";
    };

    Personetics.processor.BlockProcessor.prototype.setDefaultSelectedValue = function () {
        var value = this.getRealValue(this.config.selected);
        this.parent.setBlockVarValue(this.config, value);
        this.parent.setDlgVarMapping(this.dlgId, this.config);
    };

    Personetics.processor.BlockProcessor.prototype.copyConfig = function copyConfig(obj) {
        var result = {};
        for (var key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                var valueObj = obj[key];
                if (typeof valueObj !== "undefined" && valueObj !== null) {
                    if (valueObj.constructor === [].constructor) {
                        var newAr = [];
                        valueObj.forEach(function (item) {
                            newAr.push(item);
                        });
                        result[key] = newAr;
                    } else if (valueObj.constructor == {}.constructor) {
                        var newObj = this.copyConfig(valueObj);
                        result[key] = newObj;
                    } else {
                        result[key] = valueObj;
                    }
                } else {
                    result[key] = valueObj;
                }
            }
        }
        return result;
    };

    Personetics.processor.BlockProcessor.prototype.getTextByLanguage = function getTextByLanguage(value) {
        var lang = Personetics.processor.PStoryConfig.getConfig("lang");
        if (value === null) return value;
        if (Object.prototype.hasOwnProperty.call(value, lang)) {
            return value[lang];
        } else {
            if (typeof value !== "object") {
                return value;
            }
            var firstKey = (function getFirstKey(pTextObj) {
                for (var key in pTextObj) return key;
            })(value);
            if (firstKey) {
                return value[firstKey];
            }
        }
    };

    Personetics.processor.BlockProcessor.prototype.getValueType = function getValueType(table, colIndex) {
        var type =
            Object.prototype.hasOwnProperty.call(table, "attributesTypes") &&
            typeof table.attributesTypes !== "undefined" &&
            table.attributesTypes !== null
                ? table.attributesTypes[colIndex]
                : "";
        return type;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.TextBlockProcessor = function TextBlockProcessor(parent, config, texts, model, dlgId, index) {
        Personetics.processor.BlockProcessor.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.TextBlockProcessor.prototype = Object.create(Personetics.processor.BlockProcessor.prototype);

    Personetics.processor.TextBlockProcessor.prototype.processData = function () {
        this.layoutInstructions = Personetics.processor.BlockProcessor.prototype.processData.call(this);
        var config = this.config;
        var textConfig = config.txt || config.text;

        if (Object.prototype.hasOwnProperty.call(config, "txt")) delete this.layoutInstructions.txt;

        if (Object.prototype.hasOwnProperty.call(config, "text")) delete this.layoutInstructions.text;

        var txt = this.processText(textConfig, this.model);
        this.layoutInstructions.text = txt;

        if (typeof config.text2 !== "undefined") {
            var text2 = config.text2;
            this.layoutInstructions.text2 = this.processText(text2, this.model);
        }
        return this.layoutInstructions;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.NumberBlockProcessor = function NumberBlockProcessor(parent, config, texts, model, dlgId, index) {
        Personetics.processor.BlockProcessor.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.NumberBlockProcessor.prototype = Object.create(Personetics.processor.BlockProcessor.prototype);

    Personetics.processor.NumberBlockProcessor.prototype.processData = function () {
        this.layoutInstructions = Personetics.processor.BlockProcessor.prototype.processData.call(this);
        var number = this.config.value;
        var valueExp = new Personetics.processor.PExp(number);
        var value;
        try {
            value = valueExp.eval(this.model);
        } catch (e) {
            Personetics.error("NumberBlockProcessor.processData() Error: Failed to evaluate number value. Error message: " + e.message, false, e);
        }
        this.layoutInstructions.value = parseFloat(value);
        return this.layoutInstructions;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.AmountBlockProcessor = function AmountBlockProcessor(parent, config, texts, model, dlgId, index) {
        Personetics.processor.BlockProcessor.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.AmountBlockProcessor.prototype = Object.create(Personetics.processor.BlockProcessor.prototype);

    Personetics.processor.AmountBlockProcessor.prototype.processData = function () {
        this.layoutInstructions = Personetics.processor.BlockProcessor.prototype.processData.call(this);

        var amount = this.config.value;
        var currency = this.config.currency;

        var amountExp = new Personetics.processor.PExp(amount);
        var currencyExp = new Personetics.processor.PExp(currency);

        var amountValue;
        var currencyValue;
        try {
            amountValue = amountExp.eval(this.model);
        } catch (e) {
            Personetics.error(
                "AmountBlockProcessor.processData() Error: Failed to evaluate amount value. " + " Error message: " + e.message,
                false,
                e
            );
        }
        try {
            currencyValue = currencyExp.eval(this.model);
        } catch (e) {
            Personetics.error(
                "AmountBlockProcessor.processData() Error: Failed to evaluate currency value. " + " Error message: " + e.message,
                false,
                e
            );
        }

        this.layoutInstructions.value = parseFloat(amountValue);
        this.layoutInstructions.currency = currencyValue;

        return this.layoutInstructions;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.ImageBlock = function ImageBlock(parent, config, texts, model, dlgId, index) {
        Personetics.processor.BlockProcessor.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.ImageBlock.prototype = Object.create(Personetics.processor.BlockProcessor.prototype);

    Personetics.processor.ImageBlock.prototype.processData = function () {
        this.layoutInstructions = Personetics.processor.BlockProcessor.prototype.processData.call(this);

        var imageSrc = this.processText(this.config.url, this.model);
        var altText = this.processText(this.config.alt, this.model);
        this.layoutInstructions.url = imageSrc;
        this.layoutInstructions.alt = altText;
        this.layoutInstructions.fileType = this.config.fileType;

        return this.layoutInstructions;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};
    var TYPES = {
        STATIC: "static",
        NAVIGATE_TO_PAGE: "navigateToPage",
        DATA: "data",
        DYNAMIC: "dynamic",
    };
    Personetics.processor.OptionsProcessorBlock = function (parent, config, texts, model, dlgId, index) {
        Personetics.processor.BlockProcessor.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.OptionsProcessorBlock.prototype = Object.create(Personetics.processor.BlockProcessor.prototype);

    /**
     * Builds the option models
     */
    Personetics.processor.OptionsProcessorBlock.prototype.processData = function () {
        this.layoutInstructions = Personetics.processor.BlockProcessor.prototype.processData.call(this);

        var me = this;

        this.layoutInstructions.options = [];
        this.processShowIf();
        var opts = this.config.options;

        if (!opts || opts.length == 0) return;
        this.selectedOptId = null;

        if (this.config.selected) {
            if (Object.prototype.hasOwnProperty.call(this.config.selected, "id")) this.selectedOptId = this.config.selected.id;
            else this.selectedOptId = this.config.selected;
        }

        this.hasSelected = false;

        //this.handleOption(opts);
        opts.forEach(function (opt) {
            if (!Object.prototype.hasOwnProperty.call(opt, "type")) {
                opt.type = "static";
            }
            if (Object.prototype.hasOwnProperty.call(opt, "type") && opt.type === "dynamic") {
                opt.src = me.layoutInstructions.src;
            }
            me.handleOption(opt);
        });
        this.setDefaultSelectedValue();
        return this.layoutInstructions;
    };
    Personetics.processor.OptionsProcessorBlock.prototype.processShowIf = function () {
        var opts = [];
        var me = this;
        if (typeof this.config.options != "undefined") {
            this.config.options.forEach(function (opt) {
                var show = true;
                if (Object.prototype.hasOwnProperty.call(opt, "showIf") && opt.showIf !== null && opt.showIf.length > 0) {
                    var showIfExp = new Personetics.processor.PExp(opt.showIf);
                    try {
                        show = showIfExp.eval(me.model);
                    } catch (e) {
                        show = false;
                        Personetics.error(
                            "OptionsProcessorBlock.processData() Error: Failed to evaluate showIf property, not showing block. Error Message: " +
                            e.message,
                            false,
                            e
                        );
                    }
                }
                if (show) {
                    opts.push(opt);
                }
            });
        }
        this.config.options = opts;
    };
    Personetics.processor.OptionsProcessorBlock.prototype.addStaticOption = function (opt, selectedOptId) {
        var optObj = {};
        optObj.id = this.getOptId(opt.id);
        optObj = this.addProperties(opt, optObj, selectedOptId);
        this.layoutInstructions.options.push(optObj);
    };
    Personetics.processor.OptionsProcessorBlock.prototype.addProperties = function (opt, optObj, selectedOptId) {
        //id, selected
        optObj.id = typeof optObj.id === "undefined" || optObj.id === "-" ? opt.id : optObj.id;
        optObj.selected = false;

        //selected, hasSelected
        if (optObj.id == selectedOptId) {
            optObj.selected = true;
            this.hasSelected = true;
        }

        //class
        if (Object.prototype.hasOwnProperty.call(opt, "class")) {
            optObj.class = opt.class;
        }

        //text
        var optModelObj = new Personetics.processor.POptionModel(opt, this.model);
        var optText = opt.txt || opt.text;
        optObj.text = this.processText(optText, optModelObj, this.model);

        //other
        if (typeof opt !== "undefined" && opt !== null) {
            for (var key in opt)
                if (Object.prototype.hasOwnProperty.call(opt, key) && !Object.prototype.hasOwnProperty.call(optObj, key)) optObj[key] = opt[key];
        }

        return optObj;
    };
    Personetics.processor.OptionsProcessorBlock.prototype.getOptId = function (optId) {
        return this.processText(optId, this.model);
    };

    Personetics.processor.OptionsProcessorBlock.prototype.addDynamicOption = function (opt, selectedOptId) {
        var me = this;

        if (opt.type == TYPES.DATA && opt.src && opt.src.length > 0) {
            var table = this.model.fetchFromSrc(this, opt.src);
            if (typeof table !== "undefined" && table !== null) {
                table = table.getObjArray();
                table.forEach(function (dataOpt) {
                    dataOpt.text = opt.text || opt.txt;
                    dataOpt.text2 = opt.text2 || opt.txt2;
                    if (opt.action) dataOpt.action = opt.action;
                    var optObj = {};
                    optObj = me.addProperties(dataOpt, optObj, selectedOptId, opt);
                    me.layoutInstructions.options.push(optObj);
                });
            }
        }
    };
    Personetics.processor.OptionsProcessorBlock.prototype.addDynamicOptionById = function (opt, selectedOptId) {
        var me = this;
        if (opt.type == TYPES.DYNAMIC && opt.src && opt.src.length > 0) {
            var tables = this.model.fetchFromSrc(this, opt.src);
            if (typeof tables !== "undefined" && tables !== null) {
                tables = tables.getObjArray();
                var optObj = {};
                var table = tables.filter(function (currentValue) {
                    return currentValue.id === selectedOptId;
                })[0];
                if (table) {
                    me.replaceValueNull(table);
                    optObj = me.addProperties(table, optObj, selectedOptId, opt);
                    me.layoutInstructions.options.push(optObj);
                }
            }
        }
    };
    Personetics.processor.OptionsProcessorBlock.prototype.replaceValueNull = function (table) {
        for (var key in table) {
            if (table[key] == null) {
                table[key] = "-";
            }
        }
    };
    Personetics.processor.OptionsProcessorBlock.prototype.getRealValue = function (simpleValue) {
        var realValue = simpleValue;
        this.layoutInstructions.options.forEach(function (optObj) {
            if (optObj.id == simpleValue) {
                realValue = optObj;
                return false;
            }
        });
        return realValue;
    };

    /**
     * Mark all options as not selected, mark option for specified option id as selected
     * @param optId
     */
    Personetics.processor.OptionsProcessorBlock.prototype.setSelectedValue = function (opt) {
        var block = this;
        this.layoutInstructions.options.forEach(function (optObj) {
            if (optObj.id == opt.id) {
                optObj.selected = true;
                block.config.selected = optObj;
            } else {
                optObj.selected = false;
            }
        });
    };

    Personetics.processor.OptionsProcessorBlock.prototype.handleOption = function (opt) {
        var me = this;
        var typeHandled = false;
        switch (opt.type) {
            case TYPES.STATIC:
                me.addStaticOption(opt, me.selectedOptId);
                typeHandled = true;
                break;
            case TYPES.DATA:
                me.addDynamicOption(opt, me.selectedOptId);
                typeHandled = true;
                break;
            case TYPES.DYNAMIC:
                me.addDynamicOptionById(opt, me.selectedOptId);
                typeHandled = true;
                break;
            default:
                typeHandled = false;
        }

        return typeHandled;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};
    var TYPES = {
        NAVIGATE_TO_PAGE: "navigateToPage",
        TOGGLE: "toggle",
        PAYLOAD: "payload",
    };

    Personetics.processor.ButtonsProcessorBlock = function (parent, config, texts, model, dlgId, index) {
        Personetics.processor.OptionsProcessorBlock.call(this, parent, config, texts, model, dlgId, index);

        this.isAllNavigateTo = false;
    };

    Personetics.processor.ButtonsProcessorBlock.prototype = Object.create(Personetics.processor.OptionsProcessorBlock.prototype);

    Personetics.processor.ButtonsProcessorBlock.prototype.processData = function () {
        if (Object.prototype.hasOwnProperty.call(this.config, "buttonType")) {
            var buttonType = this.config.buttonType;
            if (buttonType == "navigateTo" || buttonType == "perso-trivia") {
                this.isAllNavigateTo = true;
            }
        }

        this.layoutInstructions = Personetics.processor.OptionsProcessorBlock.prototype.processData.call(this);

        this.layoutInstructions.id = this.config.id;

        if (Object.prototype.hasOwnProperty.call(this.layoutInstructions, "default")) delete this.layoutInstructions["default"];
        if (Object.prototype.hasOwnProperty.call(this.layoutInstructions, "selected")) delete this.layoutInstructions["selected"];

        return this.layoutInstructions;
    };

    Personetics.processor.ButtonsProcessorBlock.prototype.addProperties = function addProperties(opt, optObj, selectedOptId) {
        optObj = Personetics.processor.OptionsProcessorBlock.prototype.addProperties.call(this, opt, optObj, selectedOptId);

        if (opt.type == TYPES.NAVIGATE_TO_PAGE && opt.navigateTarget != null && opt.navigateTarget.length > 0) {
            if (typeof optObj !== "undefined" && optObj !== null) {
                optObj.navigateTarget = this.evalNavigateTarget(opt.navigateTarget);
                addPayloadToNavigateTo.call(this, opt, optObj);
            }
        }
        var txt1;
        if (typeof optObj.txt1 != "undefined") {
            txt1 = optObj.txt1;
            optObj.txt1 = this.processText(txt1, optObj, this.model);
        }

        if (typeof optObj.txt2 != "undefined") {
            txt1 = optObj.txt2;
            optObj.txt2 = this.processText(txt1, optObj, this.model);
        }

        if (this.isAllNavigateTo) {
            if (typeof optObj !== "undefined" && optObj !== null) {
                optObj.navigateTarget = this.evalNavigateTarget(opt.id);
                addPayloadToNavigateTo.call(this, opt, optObj);
            }
        }
        return optObj;
    };

    function addPayloadToNavigateTo(preProccessOpt, newOpt) {
        if (Object.prototype.hasOwnProperty.call(preProccessOpt, "payload") && preProccessOpt.payload) {
            var supportHtmlTagInProcessor = Personetics.processor.PStoryConfig.getConfig("supportHtmlTagInProcessor");
            Personetics.processor.PStoryConfig.setConfig("supportHtmlTagInProcessor", false);
            newOpt.payload = {};
            for (var key in preProccessOpt.payload) {
                if (typeof preProccessOpt.payload[key] === "string") {
                    newOpt.payload[key] = this.processText(preProccessOpt.payload[key], this.model);
                } else {
                    newOpt.payload[key] = {};
                    processObjTexts.call(this, preProccessOpt.payload[key], newOpt.payload[key]);
                }
            }
            Personetics.processor.PStoryConfig.setConfig("supportHtmlTagInProcessor", supportHtmlTagInProcessor);
        }
    }

    function processObjTexts(currentObj, newObj) {
        for (var key in currentObj) {
            if (typeof currentObj[key] === "string") {
                newObj[key] = this.processText(currentObj[key], this.model);
            } else {
                newObj[key] = {};
                processObjTexts.call(this, currentObj[key], newObj[key]);
            }
        }
    }

    Personetics.processor.ButtonsProcessorBlock.prototype.addToggleOption = function (opt, selectedOptId) {
        if (typeof selectedOptId === "undefined" || selectedOptId === null || selectedOptId.length == 0) selectedOptId = "off";
        this.hasSelected = true;
        this.prepareToggleButton(opt, selectedOptId);
    };

    Personetics.processor.ButtonsProcessorBlock.prototype.addNavigateToOption = function (opt, selectedOptId) {
        var optObj = {};
        optObj.id = this.processText(opt.id, this.model);
        optObj = this.addProperties(opt, optObj, selectedOptId);
        this.layoutInstructions.options.push(optObj);
    };

    Personetics.processor.ButtonsProcessorBlock.prototype.evalNavigateTarget = function evalNavigateTarget(navIdExpStr) {
        var navIdExp = new Personetics.processor.PExp(navIdExpStr);
        var navId;
        try {
            navId = navIdExp.eval(this.model, null, { shouldDisplayError: false });
        } catch (e) {
            navId = navIdExpStr;
        }
        return navId;
    };

    Personetics.processor.ButtonsProcessorBlock.prototype.prepareToggleButton = function (opt, selectedOptId) {
        var txt;
        var toggleClass = "perso-toggle";
        var onObj = {
            type: opt.type,
        };
        var offObj = {
            type: opt.type,
        };
        // need to add class
        onObj.id = "on";
        onObj.class = toggleClass;
        onObj.on = true;
        onObj.off = false;
        onObj.selected = selectedOptId == "on";
        var optionObj = new Personetics.processor.POptionModel(onObj, this.model);

        var onTxtId = opt.onTxt || opt.onText;
        txt = this.processText(onTxtId, optionObj);
        onObj.text = txt;
        this.layoutInstructions.options.push(onObj);

        offObj.id = "off";
        offObj.class = toggleClass;
        offObj.on = false;
        offObj.off = true;
        offObj.selected = selectedOptId == "off";

        optionObj = new Personetics.processor.POptionModel(offObj, this.model);
        var offTxtId = opt.offTxt || opt.offText;
        txt = this.processText(offTxtId, optionObj);
        offObj.text = txt;
        this.layoutInstructions.options.push(offObj);

        /**stay open/close also if the previous dialog click */
        this.model.varValuesForSave[this.config.var] = true;
    };

    Personetics.processor.ButtonsProcessorBlock.prototype.handleOption = function (option) {
        var me = this;
        var isTypeHandled = false;
        isTypeHandled = Personetics.processor.OptionsProcessorBlock.prototype.handleOption.call(this, option);
        if (!isTypeHandled) {
            switch (option.type) {
                case TYPES.TOGGLE:
                    me.addToggleOption(option, me.selectedOptId);
                    isTypeHandled = true;
                    break;
                case TYPES.NAVIGATE_TO_PAGE:
                case TYPES.PAYLOAD:
                    me.addNavigateToOption(option, me.selectedOptId);
                    isTypeHandled = true;
                    break;
                default:
                    isTypeHandled = false;
            }
        }
        return isTypeHandled;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.AccountSelectorProcessorBlock = function AccountSelectorProcessorBlock(parent, config, texts, model, dlgId, index) {
        Personetics.processor.OptionsProcessorBlock.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.AccountSelectorProcessorBlock.prototype = Object.create(Personetics.processor.OptionsProcessorBlock.prototype);

    Personetics.processor.AccountSelectorProcessorBlock.prototype.addProperties = function (opt, optObj, selectedOptId) {
        optObj = Personetics.processor.OptionsProcessorBlock.prototype.addProperties.call(this, opt, optObj, selectedOptId);
        //text2
        if (typeof opt.text2 != "undefined") {
            var optModelObj = new Personetics.processor.POptionModel(opt, this.model);
            var optText2 = opt.text2;
            optObj.text2 = this.processText(optText2, optModelObj, this.model);
        }
        return optObj;
    };

    Personetics.processor.AccountSelectorProcessorBlock.prototype.processData = function () {
        this.config.options = [
            {
                type: "data",
                src: this.config.src,
                text: this.config.accountText,
                text2: this.config.accountText2,
            },
        ];
        if (this.config.showAll) {
            var all = {
                text: this.config.allAccountsText,
                text2: this.config.allAccountsText2,
                id: "all" /*for we can process the id*/,
                type: "static",
            };
            this.config.options.push(all);
        }

        this.layoutInstructions = Personetics.processor.OptionsProcessorBlock.prototype.processData.call(this);

        delete this.layoutInstructions.src;
        delete this.layoutInstructions.allAccountsText;
        delete this.layoutInstructions.allAccountsText2;
        delete this.layoutInstructions.accountText;
        delete this.layoutInstructions.showAll;
        if (Object.prototype.hasOwnProperty.call(this.layoutInstructions, "default")) delete this.layoutInstructions.default;
        if (Object.prototype.hasOwnProperty.call(this.layoutInstructions, "selected")) delete this.layoutInstructions.selected;

        this.layoutInstructions.id = this.config.id;

        return this.layoutInstructions;
    };

    Personetics.processor.AccountSelectorProcessorBlock.prototype.getOptId = function (optId) {
        return optId;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.EntitySelectorProcessorBlock = function EntitySelectorProcessorBlock(parent, config, texts, model, dlgId, index) {
        Personetics.processor.OptionsProcessorBlock.call(this, parent, config, texts, model, dlgId, index);
    };
    Personetics.processor.EntitySelectorProcessorBlock.prototype = Object.create(Personetics.processor.OptionsProcessorBlock.prototype);
    Personetics.processor.EntitySelectorProcessorBlock.prototype.addProperties = function (opt, optObj, selectedOptId, currentOpt) {
        optObj = Personetics.processor.OptionsProcessorBlock.prototype.addProperties.call(this, opt, optObj, selectedOptId, currentOpt);
        var optModelObj = new Personetics.processor.POptionModel(opt, this.model);
        currentOpt = currentOpt || optObj;
        if (typeof currentOpt != "undefined") {
            if (typeof currentOpt.text != "undefined" && currentOpt.type && currentOpt.type !== "static") {
                optObj.text = this.getDataTextVal(currentOpt, optModelObj, optObj, currentOpt.text);
            }
            if (typeof currentOpt.text2 != "undefined") {
                optObj.text2 = this.getDataTextVal(currentOpt, optModelObj, optObj, currentOpt.text2);
            }
            if (typeof currentOpt.text3 != "undefined") {
                optObj.text3 = this.getDataTextVal(currentOpt, optModelObj, optObj, currentOpt.text3);
            }
            if (typeof currentOpt.text4 != "undefined") {
                optObj.text4 = this.getDataTextVal(currentOpt, optModelObj, optObj, currentOpt.text4);
            }
            if (typeof currentOpt.text5 != "undefined") {
                optObj.text5 = this.getDataTextVal(currentOpt, optModelObj, optObj, currentOpt.text5);
            }
            if (typeof currentOpt.text6 != "undefined") {
                optObj.text6 = this.getDataTextVal(currentOpt, optModelObj, optObj, currentOpt.text6);
            }
            if (typeof currentOpt.text7 != "undefined") {
                optObj.text7 = this.getDataTextVal(currentOpt, optModelObj, optObj, currentOpt.text7);
            }
            if (typeof currentOpt.spendingPercentage != "undefined" && currentOpt.type && currentOpt.type !== "static") {
                var spendingPercentageExp = new Personetics.processor.PExp(currentOpt.spendingPercentage);
                try {
                    var subType = this.layoutInstructions.subType;
                    if (subType === "goals") {
                        optObj.spendingPercentage = Object.hasOwnProperty.call(optObj, currentOpt.spendingPercentage)
                            ? optObj[currentOpt.spendingPercentage]
                            : null;
                    } else {
                        optObj.spendingPercentage = spendingPercentageExp.eval(optModelObj, this.model);
                    }
                } catch (e) {
                    Personetics.error(
                        "EntitySelectorProcessorBlock.addProperties() Error: Failed to evaluate spendingPercentage property. Error Message: " +
                        e.message +
                        " Error Stack: " +
                        e.stack,
                        false,
                        e
                    );
                }
            }
            if (optObj.spendingPercentage && optObj.spendingPercentage > 1) {
                optObj.spendingPercentage = 1;
            }
            if (typeof currentOpt.spendingLevel != "undefined" && currentOpt.type && currentOpt.type !== "static") {
                var spendingLevelExp = new Personetics.processor.PExp(currentOpt.spendingLevel);
                try {
                    optObj.spendingLevel = spendingLevelExp.eval(optModelObj, this.model);
                } catch (e) {
                    Personetics.error(
                        "EntitySelectorProcessorBlock.addProperties() Error: Failed to evaluate spendingLevel property. Error Message: " + e.message,
                        false,
                        e
                    );
                }
            }
            if (typeof currentOpt.icon != "undefined" && typeof optObj.icon == "undefined") {
                var iconExp = new Personetics.processor.PExp(currentOpt.icon);
                var icon = null;
                try {
                    if (subType === "goals") {
                        icon = Object.hasOwnProperty.call(optObj, currentOpt.icon) ? optObj[currentOpt.icon] : null;
                    } else {
                        icon = iconExp.eval(optModelObj, this.model);
                    }
                } catch (e) {
                    Personetics.error(
                        "EntitySelectorProcessorBlock.addProperties() Error: Failed to evaluate icon property. Error Message: " + e.message,
                        false,
                        e
                    );
                }
                optObj.icon = icon;
            }
            if (typeof currentOpt.action != "undefined") {
                optObj.action = currentOpt.action;
            }
            if (typeof currentOpt.amountLabel != "undefined") {
                var amountLabel = currentOpt.amountLabel;
                optObj.amountLabel = this.processText(amountLabel, optModelObj, this.model);
            }
        }
        return optObj;
    };
    Personetics.processor.EntitySelectorProcessorBlock.prototype.getDataTextVal = function (currentOpt, optModelObj, optObj, text) {
        var subType = this.layoutInstructions.subType;
        var textVal = this.processText(text, optModelObj, this.model);
        var isDataEntityGoals = currentOpt.type === "data" && subType === "goals";
        var optTextVal = isDataEntityGoals && Object.hasOwnProperty.call(optObj, textVal) ? optObj[textVal] : null;
        textVal = subType === "goals" && textVal === "-" ? "" : textVal;
        return isDataEntityGoals ? optTextVal : textVal;
    };
    Personetics.processor.EntitySelectorProcessorBlock.prototype.processData = function () {
        this.layoutInstructions = Personetics.processor.OptionsProcessorBlock.prototype.processData.call(this);
        delete this.layoutInstructions.selected;
        return this.layoutInstructions;
    };
    Personetics.processor.EntitySelectorProcessorBlock.prototype.getOptId = function (optId) {
        return optId;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.EntityListProcessorBlock = function EntitySelectorProcessorBlock(parent, config, texts, model, dlgId, index) {
        Personetics.processor.OptionsProcessorBlock.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.EntityListProcessorBlock.prototype = Object.create(Personetics.processor.OptionsProcessorBlock.prototype);

    Personetics.processor.EntityListProcessorBlock.prototype.addProperties = function (opt, optObj, selectedOptId, currentOpt) {
        optObj = Personetics.processor.OptionsProcessorBlock.prototype.addProperties.call(this, opt, optObj, selectedOptId, currentOpt);
        var optModelObj = new Personetics.processor.POptionModel(opt, this.model);
        currentOpt = currentOpt || optObj;
        // var newObj = {};
        if (typeof currentOpt != "undefined") {
            if (typeof currentOpt.entityTitle != "undefined") {
                var entityTitle = currentOpt.entityTitle;
                optObj.entityTitle = this.processText(entityTitle, optModelObj, this.model);
            }

            if (typeof currentOpt.entityLabel1 != "undefined") {
                var entityLabel1 = currentOpt.entityLabel1;
                optObj.entityLabel1 = this.processText(entityLabel1, optModelObj, this.model);
            }

            if (typeof currentOpt.entityLabel2 != "undefined") {
                var entityLabel2 = currentOpt.entityLabel2;
                optObj.entityLabel2 = this.processText(entityLabel2, optModelObj, this.model);
            }

            if (typeof currentOpt.buttonLabel != "undefined") {
                var buttonLabel = currentOpt.buttonLabel;
                optObj.buttonLabel = this.processText(buttonLabel, optModelObj, this.model);
            }

            if (typeof currentOpt.buttonLink !== "undefined") {
                var buttonLink = null;
                var buttonLinkLabel = this.processText(currentOpt.buttonLink, optModelObj, this.model);
                buttonLink = buttonLinkLabel === "-" ? currentOpt.buttonLink : buttonLinkLabel;
                if (currentOpt.type === "data") {
                    optObj.buttonLink = Object.hasOwnProperty.call(optObj, buttonLink) ? optObj[buttonLink] : null;
                } else {
                    optObj.buttonLink = buttonLink;
                }
            }

            if (typeof currentOpt.icon !== "undefined") {
                var icon = null;
                var iconLabel = this.processText(currentOpt.icon, optModelObj, this.model);
                icon = iconLabel === "-" ? currentOpt.icon : iconLabel;
                if (currentOpt.type === "data") {
                    optObj.icon = Object.hasOwnProperty.call(optObj, icon) ? optObj[icon] : null;
                } else {
                    optObj.icon = icon;
                }
            }
            if (typeof currentOpt.editable != "undefined") {
                optObj.editable = currentOpt.editable;
            }
            if (typeof currentOpt.action != "undefined") {
                optObj.action = currentOpt.action;
            } else {
                optObj.buttonLink = null;
            }
            if (typeof currentOpt.id != "undefined") {
                optObj.id = currentOpt.id;
            }
        }
        return optObj;
    };

    Personetics.processor.EntityListProcessorBlock.prototype.processData = function () {
        this.layoutInstructions = Personetics.processor.OptionsProcessorBlock.prototype.processData.call(this);
        return this.layoutInstructions;
    };

    Personetics.processor.EntityListProcessorBlock.prototype.getOptId = function (optId) {
        return optId;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.TextBoxesProcessorBlock = function (parent, config, texts, model, dlgId, index) {
        Personetics.processor.OptionsProcessorBlock.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.TextBoxesProcessorBlock.prototype = Object.create(Personetics.processor.OptionsProcessorBlock.prototype);

    Personetics.processor.TextBoxesProcessorBlock.prototype.processData = function () {
        this.config.options = this.config.boxes;
        this.layoutInstructions = Personetics.processor.OptionsProcessorBlock.prototype.processData.call(this);
        this.layoutInstructions.options.forEach(function (opt) {
            if (opt.selected) {
                delete opt.selected;
            }
        });

        delete this.layoutInstructions.boxes;

        return this.layoutInstructions;
    };

    Personetics.processor.TextBoxesProcessorBlock.prototype.handleOption = function (opt) {
        this.addStaticOption(opt, this.selectedOptId);
    };

    Personetics.processor.TextBoxesProcessorBlock.prototype.addStaticOption = function (opt) {
        var optObj = {};

        var optModelObj = new Personetics.processor.POptionModel(optObj, this.model);

        optObj.label = this.processText(opt.label, optModelObj, this.model);

        if (opt.image) {
            optObj.image = this.processText(opt.image, optModelObj, this.model);
            if (!Object.prototype.hasOwnProperty.call(this.layoutInstructions, "hasImage")) {
                this.layoutInstructions.hasImage = true;
            }
        }

        if (Object.prototype.hasOwnProperty.call(opt, "label2") && typeof opt.label2 !== "undefined" && opt.label2 !== null) {
            optObj.value = this.processText(opt.label2, optModelObj, this.model);
        } else {
            var optionObj = new Personetics.processor.POptionModel(opt, this.model);
            var valueExp = new Personetics.processor.PExp(opt.value);
            var value;
            try {
                value = valueExp.eval(optionObj);
            } catch (e) {
                Personetics.error(
                    "TextBoxesProcessorBlock.addStaticOption() Error: Failed to evaluate textBox value. " + " Error message: " + e.message,
                    false,
                    e
                );
                value = opt.value;
            }
            optObj.value = value;
        }

        if (opt.action) {
            optObj.action = opt.action;
        }
        if (opt.buttonLabel) {
            optObj.buttonLabel = this.processText(opt.buttonLabel, optModelObj, this.model);
        }

        this.layoutInstructions.options.push(optObj);
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};
    Personetics.processor.TabsProcessorBlock = function (parent, config, texts, model, dlgId, index) {
        Personetics.processor.OptionsProcessorBlock.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.TabsProcessorBlock.prototype = Object.create(Personetics.processor.OptionsProcessorBlock.prototype);

    Personetics.processor.TabsProcessorBlock.prototype.processData = function () {
        this.config.options = this.config.tabs;

        this.layoutInstructions = Personetics.processor.OptionsProcessorBlock.prototype.processData.call(this);
        this.layoutInstructions.id = this.config.id;
        this.layoutInstructions.class = this.config.class || "perso-tabs";

        return this.layoutInstructions;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.DateBoxBlockProcessor = function DateBoxBlockProcessor(parent, config, texts, model, dlgId, index) {
        Personetics.processor.BlockProcessor.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.DateBoxBlockProcessor.prototype = Object.create(Personetics.processor.BlockProcessor.prototype);

    Personetics.processor.DateBoxBlockProcessor.prototype.processData = function () {
        this.layoutInstructions = Personetics.processor.BlockProcessor.prototype.processData.call(this);
        var txt = this.processText(this.config.date, this.model);
        this.layoutInstructions.date = txt;

        return this.layoutInstructions;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};
    Personetics.processor.TableBlockProcessor = function TableBlockProcessor(parent, config, texts, model, dlgId, index) {
        Personetics.processor.BlockProcessor.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.TableBlockProcessor.prototype = Object.create(Personetics.processor.BlockProcessor.prototype);

    Personetics.processor.TableBlockProcessor.prototype.processData = function processData() {
        var config = this.config;
        var src = config.src;
        var table = this.model.fetchFromSrc(this, src);
        var autoRefresh = config.autoRefresh || false;
        var layoutInstructions;

        if (table == Personetics.processor.Future) {
            layoutInstructions = {
                type: config.type,
                future: true,
            };
        } else {
            layoutInstructions = this.doProcessData(table);
        }
        layoutInstructions.autoRefresh = autoRefresh;
        layoutInstructions.srcExp = src;
        return layoutInstructions;
    };

    Personetics.processor.TableBlockProcessor.prototype.doProcessData = function doProcessData(table) {
        this.layoutInstructions = Personetics.processor.BlockProcessor.prototype.processData.call(this);
        delete this.layoutInstructions.src;

        if (typeof table !== "undefined" && table !== null && Object.prototype.hasOwnProperty.call(table, "data")) {
            this.layoutInstructions.parsedData = this.parseTableToObj(table.data);
            this.layoutInstructions.rows = table.data.rows;
            this.layoutInstructions.cols = table.data.cols;
            this.layoutInstructions.attributesTypes = table.data.attributesTypes;
        }

        return this.layoutInstructions;
    };
    Personetics.processor.TableBlockProcessor.prototype.parseTableToObj = function parseTableToObj(table) {
        var data = [];
        var self = this;
        table.rows.forEach(function (row, i) {
            var newRow = {};
            table.cols.forEach(function (colName, j) {
                var type = self.getValueType(table, j);
                if (type === "PText") {
                    newRow[colName] = self.getTextByLanguage(row[j]);
                } else {
                    newRow[colName] = row[j];
                }
            });
            var showAmount = self.processShowIf("amountCommentShowif", newRow);
            var showDate = self.processShowIf("dateCommentShowif", newRow);

            if (
                showAmount &&
                Object.prototype.hasOwnProperty.call(self.layoutInstructions, "amountComment") &&
                self.layoutInstructions.amountComment
            ) {
                var amountCommentTxt = self.getText(self.layoutInstructions.amountComment);
                var amountCommentTmpl = amountCommentTxt && amountCommentTxt.textTemplate;
                newRow.amountComment = self.parseRowComment(self.layoutInstructions.amountComment, amountCommentTmpl, newRow);
            }
            if (showDate && Object.prototype.hasOwnProperty.call(self.layoutInstructions, "dateComment") && self.layoutInstructions.dateComment) {
                var dateCommentTxt = self.getText(self.layoutInstructions.dateComment);
                var dateCommentTmpl = dateCommentTxt && dateCommentTxt.textTemplate;
                newRow.dateComment = self.parseRowComment(self.layoutInstructions.dateComment, dateCommentTmpl, newRow);
            }

            data.push(newRow);
        });
        return data;
    };
    Personetics.processor.TableBlockProcessor.prototype.processShowIf = function processShowIf(showIfId, transactionRow) {
        var show = true;
        if (Object.prototype.hasOwnProperty.call(this.layoutInstructions, showIfId)) {
            var showIfExp = new Personetics.processor.PExp(this.layoutInstructions[showIfId]);
            try {
                show = showIfExp.eval(transactionRow);
            } catch (e) {
                Personetics.error(
                    "PBlockProcessorManager.processBlock() Error: Failed to evaluate showIf property, not showing block. Error Message: " + e.message,
                    false,
                    e
                );
            }
        }
        return show;
    };
    Personetics.processor.TableBlockProcessor.prototype.parseRowComment = function parseRowComment(commentTxtId, comment, newRow) {
        var text = comment || "";
        if (text.indexOf("{{Emoji") !== -1) {
            text = Personetics.utils.emojisHelper.parseEmoji(text);
        } else {
            text = this.processText(commentTxtId, newRow);
        }
        return text;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.BarBlockProcessor = function BarBlockProcessor(parent, config, texts, model, dlgId, index) {
        Personetics.processor.BlockProcessor.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.BarBlockProcessor.prototype = Object.create(Personetics.processor.BlockProcessor.prototype);

    Personetics.processor.BarBlockProcessor.prototype.processData = function () {
        this.layoutInstructions = Personetics.processor.BlockProcessor.prototype.processData.call(this);

        var blockProcessor = this;
        var config = this.config;
        var src = config.src;
        var data = this.model.fetchFromSrc(this, src);
        this.persoUtils = Personetics.processor.PUtils.getUtilsInstance("utils");

        if (config.indicator) {
            if (config.indicator.indicatorSrc) {
                this.indicatorData = this.model.fetchFromSrc(this, config.indicator.indicatorSrc);
                this.indicatorDataRows = this.indicatorData.getObjArray();
            }
            if (config.indicator.indicatorLegend) {
                this.layoutInstructions.indicatorLegend = this.processText(config.indicator.indicatorLegend, this.model);
            }
        }
        this.layoutInstructions.direction = config.direction || "vertical";

        if (typeof data !== "undefined" && data !== null) {
            var categories = this.getCategories();
            var accessibilityCategories = this.getCategories();
            /** multi series */
            var series = config.series;
            if (series) {
                var table = data.groupByExpression(Object.prototype.hasOwnProperty.call(categories, "key") ? categories.key : config.varSource);
                var seriesIndicatorsTable =
                    config.indicator && config.indicator.indicatorSrc
                        ? this.indicatorData.groupByExpression(
                            Object.prototype.hasOwnProperty.call(categories, "key") ? categories.key : config.varSource
                        )
                        : [];
                var categoriesArray = categories.categoriesArray;
                var seriesLabels = this.getSeries();
                this.seriesLabels = seriesLabels;
                if (typeof this.config.seriesNamesForDisplay !== "undefined" && this.config.seriesNamesForDisplay !== null) {
                    this.layoutInstructions.seriesNamesForDisplay = this.getSeriesNamesForDisplay();
                }

                var arr = [];

                // If seriesNames expression result is valid, sort the table grouping to match the order fiven in
                // seriesNames expression result
                if (typeof categoriesArray !== "undefined" && categoriesArray !== null && categoriesArray.length > 0) {
                    categoriesArray.forEach(function (month) {
                        var item = table.filter(function (tableRow) {
                            return tableRow.groupedKey == month;
                        })[0];
                        if (seriesIndicatorsTable.length) {
                            var filterdIndicatorTable = seriesIndicatorsTable.filter(function (row) {
                                return row.groupedKey == month;
                            })[0];
                        }
                        var row = [];
                        if (typeof item !== "undefined") {
                            row = item.table.getObjArray();
                            if (seriesIndicatorsTable.length) {
                                row = blockProcessor.mergeIndicatorRowsIntoRows(row, filterdIndicatorTable.table.getObjArray());
                            }
                        }
                        var newItem = blockProcessor.prepareDataByMode(row, seriesLabels, month);
                        arr.push(newItem);
                    });
                }
                // If seriesNames expression result is not valid, just add the groups in the order they came
                else {
                    table.forEach(function (tableItem) {
                        var row = tableItem.table.getObjArray();
                        if (blockProcessor.indicatorDataRows.length) {
                            row = blockProcessor.mergeIndicatorRowsIntoRows(row, blockProcessor.indicatorDataRows);
                        }
                        var newItem = blockProcessor.prepareDataByMode(row, seriesLabels);
                        arr.push(newItem);
                    });
                }
                this.layoutInstructions.series = arr;
            } else {
                /** single series*/
                var rows = data.getObjArray();
                if (this.indicatorDataRows) {
                    rows = blockProcessor.mergeIndicatorRowsIntoRows(rows, this.indicatorDataRows);
                }
                var newData;
                if (categories != null) {
                    newData = this.prepareDataByCategories(rows, categories);
                } else {
                    newData = this.prepareData(rows);
                }
                this.layoutInstructions.series = newData;
                this.seriesLabels = [""];
                if (Object.prototype.hasOwnProperty.call(config, "mode") && config.mode.length) {
                    var mode = this.getMode();
                    this.layoutInstructions.mode = mode.length > 0 ? mode : "";
                }
            }
        }

        if (Object.prototype.hasOwnProperty.call(this.layoutInstructions, "varSource")) delete this.layoutInstructions["varSource"];
        if (Object.prototype.hasOwnProperty.call(this.layoutInstructions, "default")) delete this.layoutInstructions["default"];
        if (Object.prototype.hasOwnProperty.call(this.layoutInstructions, "selected")) delete this.layoutInstructions["selected"];
        if (Object.prototype.hasOwnProperty.call(this.layoutInstructions, "seriesNames")) delete this.layoutInstructions["seriesNames"];
        if (Object.prototype.hasOwnProperty.call(this.layoutInstructions, "indicator")) delete this.layoutInstructions["indicator"];

        delete this.layoutInstructions["x"];
        delete this.layoutInstructions["y"];
        delete this.layoutInstructions["label"];
        delete this.layoutInstructions["src"];

        this.layoutInstructions.categories = this.categories;
        this.layoutInstructions.seriesLabels = this.seriesLabels;
        if (accessibilityCategories != null) {
            accessibilityCategories["categoriesArray"].forEach(function (item, index) {
                var i = parseInt(item) - 1;
                accessibilityCategories[index] = Personetics.processor.PUtils.getUtilsInstance("dateUtils").getMonthName(
                    Personetics.processor.PStoryConfig.getConfig("lang")
                )[i];
            });
        } else {
            accessibilityCategories = this.layoutInstructions.categories;
        }
        var accessCat = Object.keys(accessibilityCategories).map(function (key) {
            return accessibilityCategories[key];
        });
        this.layoutInstructions.accessibilityCategories = accessCat;

        if (typeof config.benchmarkLines != "undefined") {
            var benchmarkLines = blockProcessor.prepareBenchmarkLines();
            this.layoutInstructions.benchmarkLines = benchmarkLines;
        }

        return this.layoutInstructions;
    };

    Personetics.processor.BarBlockProcessor.prototype.prepareDataByCategories = function prepareDataByCategories(rows, categories) {
        var blockProcessor = this;
        var config = this.config;
        var yFieldExp = new Personetics.processor.PExp(config.y);
        var xFieldExp = new Personetics.processor.PExp(config.x);

        var newData = [];
        this.categories = [];
        var categoriesKey = categories.key;
        categories.categoriesArray.forEach(function (category) {
            var newItem = {};
            var rowExist = false;
            newItem[categoriesKey] = category;
            newItem["amount"] = 0;
            newItem["carbonAmount"] = 0;
            newItem["sum"] = 0;

            rows.forEach(function (row) {
                if (row[categoriesKey] == category) {
                    newItem = row;
                    rowExist = true;
                    return false;
                }
            });
            if (blockProcessor.config.indicator && blockProcessor.config.indicator.indicatorSrc && rowExist === false) {
                newItem["indicator"] = 0;
            }
            var newRow = blockProcessor.prepareRow(newItem, xFieldExp, yFieldExp);
            newData.push(newRow);
        });

        return newData;
    };

    Personetics.processor.BarBlockProcessor.prototype.prepareDataByMode = function prepareDataByMode(rows, modes, month) {
        var blockProcessor = this;
        var config = this.config;

        var yFieldExp = new Personetics.processor.PExp(config.y);
        var xFieldExp = new Personetics.processor.PExp(config.x);

        var newData = [];
        this.categories = this.categories || [];
        var seriesMode = config.series;
        modes.forEach(function (mode) {
            var newItem = {};
            var rowExist = false;
            newItem["month"] = month;
            newItem[seriesMode] = mode;
            newItem["amount"] = 0;
            newItem["carbonAmount"] = 0;
            newItem["sum"] = 0;
            rows.forEach(function (row) {
                if (row[seriesMode] == mode) {
                    newItem = row;
                    rowExist = true;
                    return false;
                }
            });
            if (blockProcessor.config.indicator && blockProcessor.config.indicator.indicatorSrc && rowExist === false) {
                newItem["indicator"] = 0;
            }
            var newRow = blockProcessor.prepareRow(newItem, xFieldExp, yFieldExp);
            newData.push(newRow);
        });

        return newData;
    };

    Personetics.processor.BarBlockProcessor.prototype.prepareData = function prepareData(rows) {
        var blockProcessor = this;
        var config = this.config;

        var yFieldExp = new Personetics.processor.PExp(config.y);
        var xFieldExp = new Personetics.processor.PExp(config.x);

        var newData = [];
        this.categories = [];
        rows.forEach(function (row) {
            var newRow = blockProcessor.prepareRow(row, xFieldExp, yFieldExp);
            newData.push(newRow);
        });

        return newData;
    };

    Personetics.processor.BarBlockProcessor.prototype.prepareRow = function prepareRow(row, xFieldExp, yFieldExp) {
        var config = this.config;
        var newRow = {};
        if (Object.prototype.hasOwnProperty.call(this.config, "label")) {
            var label = this.processText(config.label, row, this.model);
            if (label != "-") {
                newRow.label = label.replace(/span/g, "tspan");
            }
        }
        try {
            var yValue = yFieldExp.eval(row, this.model);
            newRow.value = this.persoUtils.toFixed(yValue, 2);
        } catch (e) {
            Personetics.error("BarBlockProcessor.prepareRow() Error: failed to evaluate block.y expression. Error message: " + e.message, false, e);
            newRow.value = null;
        }

        var xValue = null;
        try {
            xValue = xFieldExp.eval(row, this.model);
        } catch (e) {
            Personetics.error("BarBlockProcessor.prepareRow() Error: failed to evaluate block.x expression. Error message: " + e.message, false, e);
        }
        if (config.series) {
            if (this.categories.indexOf(xValue) == -1) this.categories.push(xValue);
        } else {
            this.categories.push(xValue);
        }
        if (typeof row.indicator !== "undefined" && row.indicator !== null) {
            newRow.indicator = row.indicator;
            newRow.indicatorDisplay = true;
        }
        if (Object.prototype.hasOwnProperty.call(config, "series") && typeof config.series !== "undefined") {
            newRow.mode = row[config.series];
        }
        /** properties required for item selection **/
        if (Object.prototype.hasOwnProperty.call(config, "var") && Object.prototype.hasOwnProperty.call(config, "default")) {
            newRow.category = row[config.varSource];

            newRow.selected = false;
            if (typeof config.selected !== "undefined" && row[config.varSource] == config.selected) {
                newRow.selected = true;
            }
        }
        return newRow;
    };

    Personetics.processor.BarBlockProcessor.prototype.getCategories = function getCategories() {
        var result = null;
        if (Object.prototype.hasOwnProperty.call(this.config, "categories")) {
            var configCategories = this.config.categories;
            var categories = this.model.fetchFromSrc(this, configCategories);
            if (typeof categories !== "undefined" && categories !== null) {
                var categoriesArray = categories.getObjArray();
                var key = categories.data.cols[0];
                var seriesNamesValues = categoriesArray.map(function (a) {
                    return a[key];
                });
                result = {
                    categoriesArray: seriesNamesValues,
                    key: key,
                };
            }
        }
        return result;
    };

    Personetics.processor.BarBlockProcessor.prototype.getSeries = function getSeries() {
        var result = null;
        if (!Object.prototype.hasOwnProperty.call(this.config, "seriesNames")) {
            Personetics.log("Personetics.processor.BarBlockProcessor - Error: missing 'seriesNames' block property");
        } else {
            var seriesNames = this.model.fetchFromSrc(this, this.config.seriesNames);
            var seriesNamesArray = seriesNames.getObjArray();
            var key = seriesNames.data.cols[0];
            result = seriesNamesArray.map(function (a) {
                return a[key];
            });
        }
        return result;
    };

    Personetics.processor.BarBlockProcessor.prototype.getMode = function getMode() {
        var result = null;
        if (!Object.prototype.hasOwnProperty.call(this.config, "mode")) {
            Personetics.log("Personetics.processor.BarBlockProcessor - Error: missing 'mode' block property");
        } else {
            result = this.model.fetchFromSrc(this, this.config.mode);
        }
        return result;
    };

    Personetics.processor.BarBlockProcessor.prototype.getSeriesNamesForDisplay = function getSeriesNamesForDisplay() {
        var blockProcessor = this;
        var seriesNamesForDisplay = this.config.seriesNamesForDisplay;
        var result = seriesNamesForDisplay.map(function (seriesName) {
            return blockProcessor.processText(seriesName, blockProcessor.model);
        });
        return result;
    };

    Personetics.processor.BarBlockProcessor.prototype.prepareBenchmarkLines = function prepareBenchmarkLines() {
        var blockProcessor = this;
        var benchmarkLines = [];
        this.config.benchmarkLines.forEach(function (benchmark) {
            var newBenchmark = {
                benchmarks: [],
            };
            newBenchmark.label = blockProcessor.processText(benchmark.label, blockProcessor.model);
            if (benchmark.value) {
                var valueExp = new Personetics.processor.PExp(benchmark.value);
                var value = valueExp.eval(blockProcessor.model);
                if (typeof value != "undefined") {
                    value.forEach(function (row) {
                        var obj = {};
                        obj.label = blockProcessor.processText(benchmark.innerLabel, blockProcessor.model);
                        obj.value = row;
                        newBenchmark.benchmarks.push(obj);
                    });
                }
            }
            benchmarkLines.push(newBenchmark);
        });
        return benchmarkLines;
    };

    Personetics.processor.BarBlockProcessor.prototype.mergeIndicatorRowsIntoRows = function (dataRows, indicatorDataRaws) {
        var block = this;
        dataRows.forEach(function (row) {
            indicatorDataRaws.forEach(function (indicatorRow) {
                if (block.config.series) {
                    if (row.month == indicatorRow.month && row.mode == indicatorRow.mode) {
                        row.indicator = indicatorRow.amount || (indicatorRow.carbonAmount !== undefined ? indicatorRow.carbonAmount : 0);
                    }
                } else {
                    if (row.month == indicatorRow.month) {
                        row.indicator = indicatorRow.amount || (indicatorRow.carbonAmount !== undefined ? indicatorRow.carbonAmount : 0);
                    }
                }
            });
        });
        return dataRows;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.PieBlockProcessor = function PieBlockProcessor(parent, config, texts, model, dlgId, index) {
        Personetics.processor.BlockProcessor.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.PieBlockProcessor.prototype = Object.create(Personetics.processor.BlockProcessor.prototype);

    Personetics.processor.PieBlockProcessor.prototype.processData = function () {
        this.layoutInstructions = Personetics.processor.BlockProcessor.prototype.processData.call(this);

        var blockProcessor = this;
        var config = this.config;
        var src = config.src;
        var data = this.model.fetchFromSrc(this, src);
        this.persoUtils = Personetics.processor.PUtils.getUtilsInstance("utils");

        if (Object.prototype.hasOwnProperty.call(config, "centerText")) var centerText = this.processText(config.centerText, this.model);
        if (centerText.length > 0) {
            this.layoutInstructions.centerText = centerText.replace(/span/g, "tspan");
        }

        var selected = config.selected;

        if (typeof data !== "undefined" && data !== null) {
            var slices = data.getObjArray();
            slices.forEach(function (slice, index) {
                /**default select */
                slice.highlight = false;
                /**should be before delete values */
                if (
                    typeof selected !== "undefined" &&
                    selected !== null &&
                    Object.prototype.hasOwnProperty.call(config, "varSource") &&
                    (slice[config.varSource] == selected ||
                        (typeof slice[config.varSource] != "undefined" && slice[config.varSource] == selected[config.varSource]))
                ) {
                    slice.highlight = true;
                }

                if (Object.prototype.hasOwnProperty.call(config, "label")) {
                    var label = blockProcessor.processText(config.label, slice, blockProcessor.model);
                    if (label.length > 0 && label != "-") slice.label = label.replace(/span/g, "tspan");
                }

                if (Object.prototype.hasOwnProperty.call(slice, "category")) {
                    slice.categoryId = slice.category;
                    delete slice.category;
                }

                if (Object.prototype.hasOwnProperty.call(slice, config.sliceName)) {
                    var category = slice[config.sliceName];
                    delete slice[config.sliceName];
                    slice.category = category;
                }
                var sliceValueExp = new Personetics.processor.PExp(config.sliceValue);
                try {
                    sliceValueExp.eval(slice, this.model);
                } catch (e) {
                    Personetics.error(
                        "PieBlockProcessor.processData() Error: failed to evaluate block.sliceValue expression. Error message: " + e.message,
                        false,
                        e
                    );
                }

                var value = slice[config.sliceValue] || slice.amount;
                slice.value = blockProcessor.persoUtils.toFixed(value, 2);
                slice.index = ++index;

                delete slice[config.sliceValue];
                delete slice.amount;
            });
            this.layoutInstructions.slices = slices;
            if (Object.prototype.hasOwnProperty.call(config, "mode") && config.mode.length) {
                var mode = config.mode.toLowerCase();
                if (mode !== "out" && mode !== "in" && mode !== "basic") {
                    mode = this.model.fetchFromSrc(this, this.config.mode);
                    this.layoutInstructions.mode = mode.length > 0 ? mode : "";
                }
            }
        }

        if (Object.prototype.hasOwnProperty.call(this.layoutInstructions, "varSource")) delete this.layoutInstructions["varSource"];
        if (Object.prototype.hasOwnProperty.call(this.layoutInstructions, "default")) delete this.layoutInstructions["default"];
        if (Object.prototype.hasOwnProperty.call(this.layoutInstructions, "selected")) delete this.layoutInstructions["selected"];
        if (Object.prototype.hasOwnProperty.call(this.layoutInstructions, "seriesNames")) delete this.layoutInstructions["seriesNames"];

        delete this.layoutInstructions["sliceName"];
        delete this.layoutInstructions["sliceValue"];
        delete this.layoutInstructions["label"];
        delete this.layoutInstructions["src"];

        return this.layoutInstructions;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.PinBlockProcessor = function PinBlockProcessor(parent, config, texts, model, dlgId, index) {
        Personetics.processor.BarBlockProcessor.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.PinBlockProcessor.prototype = Object.create(Personetics.processor.BarBlockProcessor.prototype);

    // Personetics.processor.PinBlockProcessor.prototype.processData = function(){
    //     this.layoutInstructions = Personetics.processor.BarBlockProcessor.prototype.processData.call(this);
    //
    //     return this.data;
    // };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.LineBlockProcessor = function LineProcessor(parent, config, texts, model, dlgId, index) {
        Personetics.processor.BarBlockProcessor.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.LineBlockProcessor.prototype = Object.create(Personetics.processor.BarBlockProcessor.prototype);

    Personetics.processor.LineBlockProcessor.prototype.processData = function () {
        this.layoutInstructions = Personetics.processor.BarBlockProcessor.prototype.processData.call(this);
        var config = this.config;
        var highlightedCategories = null;
        if (config.highlightedCategory) {
            var highlightedCategoriesExp = new Personetics.processor.PExp(config.highlightedCategory);

            try {
                highlightedCategories = highlightedCategoriesExp.eval(this.model);
            } catch (e) {
                Personetics.error(
                    "LineBlockProcessor.processData() Error: failed to evaluate block.highlightedCategory expression. Error message: " + e.message,
                    false,
                    e
                );
            }
        }

        delete this.layoutInstructions.label2;
        this.layoutInstructions.highlightedCategories = [highlightedCategories];
        return this.layoutInstructions;
    };
    Personetics.processor.LineBlockProcessor.prototype.prepareDataByCategories = function prepareDataByCategories(rows, categories) {
        var blockProcessor = this;
        var config = this.config;

        var yFieldExp = new Personetics.processor.PExp(config.y);
        var xFieldExp = new Personetics.processor.PExp(config.x);

        var newData = [];
        this.categories = [];
        var categoriesKey = categories.key;
        categories.categoriesArray.forEach(function (category) {
            var newItem = {};
            newItem[categoriesKey] = category;
            newItem["amount"] = 0;

            rows.forEach(function (row) {
                if (row[categoriesKey] == category) {
                    newItem = row;
                    return false;
                }
            });

            blockProcessor.prepareCategoryRow(newItem, xFieldExp, yFieldExp, categoriesKey);
        });

        rows.forEach(function (row) {
            var newRow = blockProcessor.prepareSeriesRow(row, xFieldExp, yFieldExp, categoriesKey);
            newData.push(newRow);
        });

        return newData;
    };

    Personetics.processor.LineBlockProcessor.prototype.prepareSeriesRow = function prepareSeriesRow(row, xFieldExp, yFieldExp, key) {
        var config = this.config;
        var newRow = {};
        if (Object.prototype.hasOwnProperty.call(this.config, "label")) {
            var label = this.processText(config.label, row, this.model);
            if (label != "-") {
                newRow.label = label.replace(/span/g, "tspan");
            }
        }
        if (Object.prototype.hasOwnProperty.call(this.config, "label2")) {
            var label2 = this.processText(config.label2, row, this.model);
            if (label2 != "-") {
                newRow.label2 = label2.replace(/span/g, "tspan");
            }
        }

        try {
            xFieldExp.eval(row);
        } catch (e) {
            Personetics.error("LineBlockProcessor.prepareRow() Error: failed to evaluate block.x expression. Error message: " + e.message, false, e);
        }

        try {
            var yValue = yFieldExp.eval(row);
            var format = Personetics.processor.PStoryConfig.getConfig("amountFormat").match(/\+*(#((.)*(#|0))?)/g)[0];
            var matches = format.match(/0/g);
            var fixed = matches ? matches.length : 0;
            newRow.value = parseFloat(yValue.toFixed(fixed));
        } catch (e) {
            Personetics.error("LineBlockProcessor.prepareRow() Error: failed to evaluate block.y expression. Error message: " + e.message, false, e);
            newRow.value = null;
        }

        newRow.category = row[key];

        return newRow;
    };

    Personetics.processor.LineBlockProcessor.prototype.prepareCategoryRow = function prepareCategoryRow(row, xFieldExp, yFieldExp, key) {
        var category = {};
        var xValue = null;
        try {
            xValue = xFieldExp.eval(row);
            category.label = xValue;
            category.value = row[key];
        } catch (e) {
            Personetics.error("LineBlockProcessor.prepareRow() Error: failed to evaluate block.x expression. Error message: " + e.message, false, e);
        }

        this.categories.push(category);
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.CalendarBlock = function CalendarBlock(parent, config, texts, model, dlgId, index) {
        Personetics.processor.BlockProcessor.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.CalendarBlock.prototype = Object.create(Personetics.processor.BlockProcessor.prototype);

    Personetics.processor.CalendarBlock.prototype.processData = function () {
        this.layoutInstructions = Personetics.processor.BlockProcessor.prototype.processData.call(this);
        var config = this.config;
        var actionableSrc = config.actionableSrc;
        var highlightedSrc = config.highlightedSrc;
        var table = this.model.fetchFromSrc(this, actionableSrc);
        this.layoutInstructions.highlightedSrc = this.model.fetchFromSrc(this, highlightedSrc);
        if (typeof table !== "undefined" && table !== null && Object.prototype.hasOwnProperty.call(table, "data")) {
            this.layoutInstructions.actionableSrc = table.data.rows.map(function (item) {
                return {
                    id: item[table.colMap["id"]],
                    date: item[table.colMap["date"]],
                    type: item[table.colMap["debitOrCredit"]] === "C" ? "In" : item[table.colMap["debitOrCredit"]] === "D" ? "Out" : null,
                };
            });
        }

        if (Object.prototype.hasOwnProperty.call(config, "startDate") && config.startDate != null && config.startDate.length > 0) {
            var blockStartDateValue = null;
            var startDateStr = config.startDate;
            var startDateExp = new Personetics.processor.PExp(startDateStr);
            try {
                blockStartDateValue = startDateExp.eval(this.model);
            } catch (e) {
                Personetics.error(
                    "PBlockProcessorManager.evaluateDefault() Error: Failed to evaluate " +
                    config.type +
                    " block's default expression" +
                    " Error message: " +
                    e.message,
                    false,
                    e
                );
            }
            if (blockStartDateValue) {
                this.layoutInstructions.startDate = blockStartDateValue;
            }
        }

        if (Object.prototype.hasOwnProperty.call(config, "endDate") && config.endDate != null && config.endDate.length > 0) {
            var blockEndDateValue = null;
            var endDateStr = config.endDate;
            var endDateExp = new Personetics.processor.PExp(endDateStr);
            try {
                blockEndDateValue = endDateExp.eval(this.model);
            } catch (e) {
                Personetics.error(
                    "PBlockProcessorManager.evaluateDefault() Error: Failed to evaluate " +
                    config.type +
                    " block's default expression" +
                    " Error message: " +
                    e.message,
                    false,
                    e
                );
            }
            if (blockEndDateValue) {
                this.layoutInstructions.endDate = blockEndDateValue;
            }
        }

        if (Object.prototype.hasOwnProperty.call(config, "default") && config.default != null && config.default.length > 0) {
            var blockDefaultValue = null;
            var defaultStr = config.default;
            var defaultExp = new Personetics.processor.PExp(defaultStr);
            try {
                blockDefaultValue = defaultExp.eval(this.model);
            } catch (e) {
                Personetics.error(
                    "PBlockProcessorManager.evaluateDefault() Error: Failed to evaluate " +
                    config.type +
                    " block's default expression" +
                    " Error message: " +
                    e.message,
                    false,
                    e
                );
            }
            if (blockDefaultValue) {
                this.layoutInstructions.default = blockDefaultValue;
            }
        }

        var lang = Personetics.processor.PStoryConfig.getConfig("lang");
        var calendarSunFirst = Personetics.processor.PStoryConfig.getConfig("calendarSunFirst");
        var langShort = calendarSunFirst || lang !== "en" ? "-short" : "-short-default";
        var daysName = Personetics.pstoryDictionary.weekDays;
        this.layoutInstructions.weekDays = [];
        if (daysName[lang]) {
            this.layoutInstructions.weekDays = daysName[lang].map(function (item, index) {
                if (daysName[lang + langShort] && daysName[lang + langShort].length > index) {
                    return { dayName: item, shortDayName: daysName[lang + langShort][index] };
                }
                return { dayName: item };
            });
        }

        if (Object.prototype.hasOwnProperty.call(this.config, "bottomText") && config.bottomText != null && config.bottomText.length > 0) {
            var bottomText = this.processText(config.bottomText, this.model);
            this.layoutInstructions.bottomText = bottomText;
        }

        delete this.layoutInstructions.src;

        return this.layoutInstructions;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.TriviaProcessorBlock = function (parent, config, texts, model, dlgId, index) {
        Personetics.processor.OptionsProcessorBlock.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.TriviaProcessorBlock.prototype = Object.create(Personetics.processor.OptionsProcessorBlock.prototype);

    Personetics.processor.TriviaProcessorBlock.prototype.addProperties = function (opt, optObj, selectedOptId, currentOpt) {
        optObj = Personetics.processor.OptionsProcessorBlock.prototype.addProperties.call(this, opt, optObj, selectedOptId, currentOpt);
        var optModelObj = new Personetics.processor.POptionModel(opt, this.model);
        if (typeof optObj != "undefined") {
            if (typeof optObj.txt != "undefined") {
                var answerText = optObj.txt;
                optObj.txt = this.processText(answerText, optModelObj, this.model);
            }
            if (optObj.text && typeof optObj.txt == "undefined") {
                optObj.txt = optObj.text;
            }
        }
        return optObj;
    };
    Personetics.processor.TriviaProcessorBlock.prototype.processData = function () {
        this.config.options = this.config.answers;
        this.layoutInstructions = Personetics.processor.OptionsProcessorBlock.prototype.processData.call(this);
        if (typeof this.config.icon != "undefined" && this.config.icon) {
            var icon = this.processText(this.config.icon, this.model);
            this.layoutInstructions.icon = icon;
        }
        if (typeof this.config.questionText != "undefined" && this.config.questionText) {
            var questionText = this.processText(this.config.questionText, this.model);
            this.layoutInstructions.questionText = questionText;
        }
        if (typeof this.config.pageNumber != "undefined" && this.config.pageNumber) {
            var pageNumber = this.processText(this.config.pageNumber, this.model);
            this.layoutInstructions.pageNumber = pageNumber;
        }

        if (typeof this.config.backgroundImage != "undefined" && this.config.backgroundImage) {
            var backgroundImage = this.processText(this.config.backgroundImage, this.model);
            this.layoutInstructions.backgroundImage = backgroundImage;
        }
        if (
            typeof this.config.questionNumber !== "undefined" &&
            this.config.questionNumber &&
            typeof this.config.totalNumberOfQuestions !== "undefined" &&
            this.config.totalNumberOfQuestions
        ) {
            this.layoutInstructions.pageNavigation = true;
        }

        this.layoutInstructions.answers = this.layoutInstructions.options;
        delete this.layoutInstructions.options;

        return this.layoutInstructions;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.CounterProcessorBlock = function (parent, config, texts, model, dlgId, index) {
        Personetics.processor.BlockProcessor.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.CounterProcessorBlock.prototype = Object.create(Personetics.processor.BlockProcessor.prototype);

    Personetics.processor.CounterProcessorBlock.prototype.processData = function () {
        this.layoutInstructions = Personetics.processor.BlockProcessor.prototype.processData.call(this);

        if (typeof this.config.id != "undefined" && this.config.id) {
            this.layoutInstructions.id = this.config.id;
        }

        if (typeof this.config.txt != "undefined" && this.config.txt) {
            var txt = this.processText(this.config.txt, this.model);
            this.layoutInstructions.txt = txt;
        }

        if (typeof this.config.iconURL != "undefined" && this.config.iconURL) {
            var iconURL = this.processText(this.config.iconURL, this.model);
            this.layoutInstructions.iconURL = iconURL;
        }

        if (typeof this.config.sumTotal != "undefined" && this.config.sumTotal) {
            var sumTotal = this.processText(this.config.sumTotal, this.model);
            this.layoutInstructions.sumTotal = sumTotal;
        }

        if (typeof this.config.sumCounter != "undefined" && this.config.sumCounter) {
            var sumCounter = this.processText(this.config.sumCounter, this.model);
            this.layoutInstructions.sumCounter = sumCounter;
        }

        return this.layoutInstructions;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.DateInput = function (parent, config, texts, model, dlgId, index) {
        Personetics.processor.BlockProcessor.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.DateInput.prototype = Object.create(Personetics.processor.BlockProcessor.prototype);

    Personetics.processor.DateInput.prototype.processData = function () {
        this.layoutInstructions = Personetics.processor.BlockProcessor.prototype.processData.call(this);

        if (typeof this.config.promptText !== "undefined" && this.config.promptText) {
            var promptText = this.processText(this.config.promptText, this.model);
            if (promptText === "-") {
                this.layoutInstructions.promptText = null;
            } else {
                this.layoutInstructions.promptText = promptText;
            }
        }

        if (typeof this.config.title !== "undefined" && this.config.title) {
            var title = this.processText(this.config.title, this.model);
            this.layoutInstructions.title = title;
        }

        if (typeof this.config.label !== "undefined" && this.config.label) {
            var label = this.processText(this.config.label, this.model);
            this.layoutInstructions.label = label;
        }

        if (typeof this.config.minDate !== "undefined" && this.config.minDate) {
            var minDate = this.processText(this.config.minDate, this.model);
            this.layoutInstructions.minDate = minDate;
        }

        if (typeof this.config.maxDate !== "undefined" && this.config.maxDate) {
            var maxDate = this.processText(this.config.maxDate, this.model);
            this.layoutInstructions.maxDate = maxDate;
        }

        return this.layoutInstructions;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.NumberInput = function (parent, config, texts, model, dlgId, index) {
        Personetics.processor.BlockProcessor.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.NumberInput.prototype = Object.create(Personetics.processor.BlockProcessor.prototype);

    Personetics.processor.NumberInput.prototype.processData = function () {
        this.layoutInstructions = Personetics.processor.BlockProcessor.prototype.processData.call(this);

        if (typeof this.config.promptText !== "undefined" && this.config.promptText) {
            var promptText = this.processText(this.config.promptText, this.model);
            if (promptText === "-") {
                this.layoutInstructions.promptText = null;
            } else {
                this.layoutInstructions.promptText = promptText;
            }
        }
        if (typeof this.config.title !== "undefined" && this.config.title) {
            var title = this.processText(this.config.title, this.model);
            this.layoutInstructions.title = title;
        }
        if (typeof this.config.label !== "undefined" && this.config.label) {
            var label = this.processText(this.config.label, this.model);
            this.layoutInstructions.label = label;
        }
        if (typeof this.config.minNumber !== "undefined" && this.config.minNumber) {
            var minNumber = this.processText(this.config.minNumber, this.model);
            if (minNumber === "-") {
                this.layoutInstructions.minNumber = 0;
            } else {
                this.layoutInstructions.minNumber = minNumber;
            }
        }
        if (typeof this.config.maxNumber !== "undefined" && this.config.maxNumber) {
            var maxNumber = this.processText(this.config.maxNumber, this.model);
            if (maxNumber === "-") {
                this.layoutInstructions.maxNumber = 0;
            } else {
                this.layoutInstructions.maxNumber = maxNumber;
            }
        }
        if (typeof this.config.initialValue !== "undefined" && this.config.initialValue) {
            var initialValue = this.processText(this.config.initialValue, this.model);
            if (initialValue === "-") {
                this.layoutInstructions.initialValue = this.config.initialValue;
            } else {
                this.layoutInstructions.initialValue = initialValue;
            }
        }
        return this.layoutInstructions;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.TextInput = function (parent, config, texts, model, dlgId, index) {
        Personetics.processor.BlockProcessor.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.TextInput.prototype = Object.create(Personetics.processor.BlockProcessor.prototype);

    Personetics.processor.TextInput.prototype.processData = function () {
        this.layoutInstructions = Personetics.processor.BlockProcessor.prototype.processData.call(this);
        if (typeof this.config.promptText !== "undefined" && this.config.promptText) {
            var promptText = this.processText(this.config.promptText, this.model);
            this.layoutInstructions.promptText = (promptText !== "-") ? promptText: null;
        }
        if (typeof this.config.title !== "undefined" && this.config.title) {
            var title = this.processText(this.config.title, this.model);
            this.layoutInstructions.title = title;
        }
        if (typeof this.config.specialCharValid !== "undefined" && this.config.specialCharValid) {
            var specialCharValid = this.processText(this.config.specialCharValid, this.model);
            this.layoutInstructions.specialCharValid = specialCharValid;
        }
        if (typeof this.config.longStringValid !== "undefined" && this.config.longStringValid) {
            var longStringValid = this.processText(this.config.longStringValid, this.model);
            this.layoutInstructions.longStringValid = longStringValid;
        }
        return this.layoutInstructions;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};

    Personetics.processor.Filter = function (parent, config, texts, model, dlgId, index) {
        Personetics.processor.BlockProcessor.call(this, parent, config, texts, model, dlgId, index);
    };

    Personetics.processor.Filter.prototype = Object.create(Personetics.processor.BlockProcessor.prototype);

    Personetics.processor.Filter.prototype.processData = function () {
        this.layoutInstructions = Personetics.processor.BlockProcessor.prototype.processData.call(this);

        if (typeof this.config.text !== "undefined" && this.config.text) {
            var text = this.processText(this.config.text, this.model);
            this.layoutInstructions.text = text;
        }
        if (typeof this.config.tooltipText !== "undefined" && this.config.tooltipText) {
            var tooltipText = this.processText(this.config.tooltipText, this.model);
            if (tooltipText === "-") {
                this.layoutInstructions.tooltipText = null;
            } else {
                this.layoutInstructions.tooltipText = tooltipText;
            }
        }
        if (typeof this.config.filters !== "undefined" && this.config.filters.length) {
            this.layoutInstructions.showToggle = true;
        } else {
            this.layoutInstructions.showToggle = false;
        }
        return this.layoutInstructions;
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    Personetics.processor = Personetics.processor || {};
    Personetics.processor.PAction = function () {
        var processAction = function (action, context, parentContext) {
            var processedActionResult = actionCompiler(action, context, parentContext);
            return processedActionResult;
        };

        var actionCompiler = function (action, context, parentContext) {
            var processedObj = Personetics.utils.persoHelper.deepObjectExtend({}, action, true);
            for (var keys in processedObj) {
                var actionExpression;
                if (typeof processedObj[keys] == "object" && processedObj[keys] !== null) {
                    if (Array.isArray(processedObj[keys])) {
                        processedObj[keys] = actionCompiler(processedObj[keys], context, parentContext);
                        processedObj[keys] = objectValuesToArray(processedObj[keys]);
                    } else {
                        processedObj[keys] = actionCompiler(processedObj[keys], context, parentContext);
                    }
                } else {
                    actionExpression = compileActionExpression(processedObj[keys], parentContext);
                    processedObj[keys] =
                        actionExpression !== null && isNaN(actionExpression) ? actionExpression.eval(context, parentContext) : actionExpression;
                }
            }
            return processedObj;
        };

        var objectValuesToArray = function (action) {
            var valuesArray = [];
            for (var i in action) {
                if (Object.prototype.hasOwnProperty.call(action, i)) {
                    valuesArray.push(action[i]);
                }
            }
            return valuesArray;
        };

        var handleStaticText = function (actionValue) {
            if (actionValue && actionValue.charAt(0) !== "'" && actionValue.charAt(actionValue.length - 1) !== "'") {
                actionValue = actionValue.replace(/'/g, '"');
                actionValue = "'" + actionValue + "'";
            }
            return actionValue;
        };

        var compileActionExpression = function (actionExp, parentContext) {
            var compiledExp;
            if (actionExp && isNaN(actionExp)) {
                var processedActionExpText = processActionExpText(actionExp);
                processedActionExpText = getExpressionFromExpressionsObject(processedActionExpText, parentContext);
                compiledExp = new Personetics.processor.PExp(processedActionExpText);
            } else {
                compiledExp = actionExp;
            }
            return compiledExp;
        };

        var processActionExpText = function (actionExpText) {
            var TemplateStartToken = "{{";
            var TemplateEndToken = "}}";
            var TemplateTokenRegex = /{{([^\n\t\v{}]*)}}/g;
            var processedText;
            if (isNaN(actionExpText) && actionExpText.match(TemplateTokenRegex) && actionExpText.match(TemplateTokenRegex).length) {
                processedText = actionExpText.replace(TemplateStartToken, "").replace(TemplateEndToken, "");
            } else if (!isNaN(actionExpText)) {
                processedText = actionExpText;
            } else {
                processedText = isExpression(actionExpText) ? actionExpText : handleStaticText(actionExpText);
            }
            return processedText;
        };

        var isExpression = function (exp) {
            if (exp) {
                var entity = exp.split(".")[0];
                var isExpression = lookForEntity(entity);
                return isExpression;
            }
        };

        var lookForEntity = function (entity) {
            var model = window.PBlockProcessorManager.getInstance().getModel();
            var found = Object.prototype.hasOwnProperty.call(model.cache, entity) && model.cache[entity] ? true : false;
            var targetModel;
            if (model) {
                targetModel = Personetics.utils.persoHelper.deepObjectExtend(
                    {},
                    {
                        data: model.data,
                        expressions: model.expressions,
                        expressionsConfigs: model.expressionsConfigs,
                        exps: model.exps,
                        facts: model.facts,
                        factsConfigs: model.factsConfigs,
                    },
                    true
                );
            }
            if (!found) {
                for (var modelObj in targetModel) {
                    if (
                        targetModel[modelObj] &&
                        typeof targetModel[modelObj] === "object" &&
                        Object.prototype.hasOwnProperty.call(targetModel[modelObj], entity) &&
                        targetModel[modelObj][entity]
                    ) {
                        found = true;
                        break;
                    }
                }
            }
            return found;
        };

        var getExpressionFromExpressionsObject = function (actionExpression, parentContext) {
            var expression = actionExpression;
            if (parentContext && actionExpression && parentContext.expressions) {
                expression = parentContext.expressions[actionExpression] ? parentContext.expressions[actionExpression] : actionExpression;
            }
            return expression;
        };

        return {
            processAction: processAction,
        };
    };
})(window, (window.Personetics = window.Personetics || {}));

(function (window, Personetics) {
    window.PBlockProcessorManager = new (function () {
        var instance = null;

        this.getInstance = function getInstance() {
            if (instance == null) {
                instance = new manager();
            }
            return instance;
        };

        this.getNewInstance = function getNewInstance() {
            instance = new manager();
            return instance;
        };
    })();

    var manager = function manager() {
        this.dialogsToBlocksMap = {};
        this.actionsMap = {};

        this.processorFactory = {
            txt: Personetics.processor.TextBlockProcessor,
            text: Personetics.processor.TextBlockProcessor,
            number: Personetics.processor.NumberBlockProcessor,
            amount: Personetics.processor.AmountBlockProcessor,
            image: Personetics.processor.ImageBlock,
            buttons: Personetics.processor.ButtonsProcessorBlock,
            "radio-button": Personetics.processor.ButtonsProcessorBlock,
            tabs: Personetics.processor.TabsProcessorBlock,
            "account-selector": Personetics.processor.AccountSelectorProcessorBlock,
            "entity-selector": Personetics.processor.EntitySelectorProcessorBlock,
            "entity-list": Personetics.processor.EntityListProcessorBlock,
            textboxes: Personetics.processor.TextBoxesProcessorBlock,
            "date-box": Personetics.processor.DateBoxBlockProcessor,
            tranList: Personetics.processor.TableBlockProcessor,
            "bar-chart": Personetics.processor.BarBlockProcessor,
            "new-bar-chart": Personetics.processor.BarBlockProcessor,
            "pie-chart": Personetics.processor.PieBlockProcessor,
            "arc-chart": Personetics.processor.PieBlockProcessor,
            "pin-graph": Personetics.processor.PinBlockProcessor,
            "pin-chart": Personetics.processor.PinBlockProcessor,
            "new-pin-chart": Personetics.processor.PinBlockProcessor,
            "line-chart": Personetics.processor.LineBlockProcessor,
            calendar: Personetics.processor.CalendarBlock,
            trivia: Personetics.processor.TriviaProcessorBlock,
            counter: Personetics.processor.CounterProcessorBlock,
            dateInput: Personetics.processor.DateInput,
            numberInput: Personetics.processor.NumberInput,
            textInput: Personetics.processor.TextInput,
            filter: Personetics.processor.Filter,
        };
    };

    manager.prototype.start = function start(options) {
        this.storyDefinition = options.story;

        this.defaultLang = "en";

        if (typeof options.customizationOptions !== "undefined" && options.customizationOptions !== null) {
            for (var key in options.customizationOptions) {
                if (Object.prototype.hasOwnProperty.call(options.customizationOptions, key)) {
                    Personetics.processor.PStoryConfig.setConfig(key, options.customizationOptions[key]);
                }
            }
        }

        this.texts = options.texts || options.text;
        this.model = new Personetics.processor.PModel(this, options);
        this.PAction = new Personetics.processor.PAction();
        window.model = this.model;

        // create processor list and evaluate default values
        this.initProcessors();
        this.initActions();
    };

    manager.prototype.initProcessors = function initProcessors() {
        var me = this;

        this.storyDefinition.dialogs.forEach(function (dlgConfig) {
            var dlgId = dlgConfig.id;

            me.dialogsToBlocksMap[dlgId] = {};

            if (Object.prototype.hasOwnProperty.call(dlgConfig, "class")) {
                me.dialogsToBlocksMap[dlgId]["class"] = dlgConfig.class;
            }

            dlgConfig.blocks.forEach(function (config, jndex) {
                var processor = me.createProcessor(config, dlgId, jndex);

                if (processor) {
                    me.dialogsToBlocksMap[dlgId][jndex] = {
                        processor: processor,
                        previousData: null,
                    };
                }
            });
        });
    };

    manager.prototype.createProcessor = function createProcessor(config, dlgId, blockIndex) {
        var type = config.type;
        var processorClass = this.processorFactory[type];
        if (processorClass) {
            var texts = null;
            if (Object.prototype.hasOwnProperty.call(this.texts, dlgId)) {
                // take default language texts as baseline
                texts = this.texts[dlgId][this.defaultLang] || {};

                // if dialog has texts for project language, merge into baseline (override existing texts
                var lang = Personetics.processor.PStoryConfig.getConfig("lang");
                if (Object.prototype.hasOwnProperty.call(this.texts[dlgId], lang)) {
                    var langTexts = this.texts[dlgId][lang];
                    for (var textId in langTexts) {
                        if (Object.prototype.hasOwnProperty.call(langTexts, textId)) texts[textId] = langTexts[textId];
                    }
                }
            }
            var processor = new processorClass(this, config, texts, this.model, dlgId, blockIndex);
            processor.initProcessor();
            return processor;
        } else {
            Personetics.log("createProcessor() - invalid processor type '" + type + "'");
            return null;
        }
    };

    /**
     * Creates layout instructions for all dialogs. Converts dialogs into h-box blocks with a single column
     * @returns {Array}
     */

    manager.prototype.process = function process() {
        var result = [];
        for (var dlgId in this.dialogsToBlocksMap) {
            if (Object.prototype.hasOwnProperty.call(this.dialogsToBlocksMap, dlgId)) {
                var dialogBlocks = this.dialogsToBlocksMap[dlgId];

                var blocks = [];

                var dialogClass = null;
                if (Object.prototype.hasOwnProperty.call(dialogBlocks, "class")) {
                    dialogClass = dialogBlocks.class;
                    delete dialogBlocks.class;
                }

                for (var index in dialogBlocks) {
                    if (Object.prototype.hasOwnProperty.call(dialogBlocks, index)) {
                        var processorObj = dialogBlocks[index].processor;
                        var processor = processorObj;
                        var data = this.processBlock(processorObj, processor);
                        if (data) blocks.push(data);
                    }
                }

                var hbox = {
                    type: "h-box",
                    class: "pstory-dialog-frame",
                    columns: [
                        {
                            width: 12,
                            blocks: blocks,
                        },
                    ],
                };

                if (dialogClass !== null) hbox.class = dialogClass;

                result.push(hbox);
            }
        }
        return result;
    };

    manager.prototype.processPermutations = function processPermutations(blocksMap, permutationItem, varsArray) {
        for (var dlgId in this.dialogsToBlocksMap) {
            var dialogBlocks = this.dialogsToBlocksMap[dlgId];
            var dialogClass = null;
            if (Object.prototype.hasOwnProperty.call(dialogBlocks, "class") && typeof dialogBlocks.class !== "undefined") {
                dialogClass = dialogBlocks.class;
            }
            for (var index in dialogBlocks) {
                if (index != "class" && Object.prototype.hasOwnProperty.call(dialogBlocks, index) && typeof dialogBlocks[index] !== "undefined") {
                    var processorObj = dialogBlocks[index].processor;
                    var processor = processorObj;
                    var data = this.processBlock(processorObj, processor);
                    if (data) {
                        try {
                            var stringData = JSON.stringify(data);
                            var blockKey = dlgId + "," + dialogClass + "," + data.id;
                            var selectorRow = [];

                            for (var i = 0; i < varsArray.length; i++) {
                                selectorRow.push(permutationItem[i]);
                            }
                            if (Object.prototype.hasOwnProperty.call(blocksMap, blockKey)) {
                                var includes = false;
                                var includeIndex = null;
                                var block = blocksMap[blockKey];
                                for (var j = 0; j < block.length; j++) {
                                    if (block[j].value == stringData) {
                                        includes = true;
                                        includeIndex = j;
                                    }
                                }
                                if (!includes) {
                                    block.push({ selectorValues: [selectorRow], value: stringData });
                                } else {
                                    block[includeIndex].selectorValues.push(selectorRow);
                                }
                            } else {
                                blocksMap[blockKey] = [{ selectorValues: [selectorRow], value: stringData }];
                            }
                        } catch (e) {
                            window.Personetics.log("<< Permutation Not Available >>: ", e);
                        }
                    }
                }
            }
        }
    };

    manager.prototype.processBlocks = function processBlocks(dialogConfig) {
        var result = [];
        var me = this;
        dialogConfig.blocks.forEach(function (blockCfg, index) {
            var data = me.processBlockConfig(dialogConfig.id, index);
            if (data) result.push(data);
        });
        return result;
    };

    manager.prototype.processBlockConfig = function processBlockConfig(dlgId, blockIndex) {
        if (
            Object.prototype.hasOwnProperty.call(this.dialogsToBlocksMap, dlgId) &&
            Object.prototype.hasOwnProperty.call(this.dialogsToBlocksMap[dlgId], blockIndex)
        ) {
            var processorObj = this.dialogsToBlocksMap[dlgId][blockIndex];
            var processor = processorObj.processor;

            return this.processBlock(processorObj, processor);
        }
    };

    manager.prototype.processBlock = function processBlock(processorObj, processor) {
        var result = null;
        var config = processor.config;
        var show = true;
        if (config.showIf) {
            var showIfExp = new Personetics.processor.PExp(config.showIf);

            try {
                show = showIfExp.eval(this.model);
            } catch (e) {
                show = false;
                Personetics.error(
                    "PBlockProcessorManager.processBlock() Error: Failed to evaluate showIf property, not showing block. Error Message: " + e.message,
                    false,
                    e
                );
            }
        }
        if (show) {
            this.evaluateDefault(config);
            result = processor.processData();
            processorObj.previousData = result;
        }

        return result;
    };

    manager.prototype.evaluateDefault = function evaluateDefault(config) {
        // try to get block's variable's value from model
        var blockDefaultValue = this.getBlockVarValue(config);

        // if found a value, set as block's "selected" property
        if (typeof blockDefaultValue !== "undefined" && blockDefaultValue !== null) {
            config.selected = blockDefaultValue;
        }
        // if no value was found, evaluate default expression and set this as "selected" property
        else {
            if (Object.prototype.hasOwnProperty.call(config, "default") && config.default != null && config.default.length > 0) {
                var defaultStr = config.default;
                var defaultExp = new Personetics.processor.PExp(defaultStr);
                try {
                    blockDefaultValue = defaultExp.eval(this.model);
                } catch (e) {
                    e.message =
                        "PBlockProcessorManager.evaluateDefault() Error: Failed to evaluate " +
                        config.type +
                        " block's default expression" +
                        " Error message: " +
                        e.message;
                    Personetics.error(e.message, false, e);
                }
                if (blockDefaultValue) {
                    config.selected = blockDefaultValue;
                    this.setBlockVarValue(config, blockDefaultValue);
                }
            }
        }
    };

    manager.prototype.resetVariables = function resetVariables(block) {
        if (block.var && !this.model.varValuesForSave[block.var]) {
            this.model.varValues[block.var] = null;
        }
    };

    manager.prototype.getBlockVarValue = function getBlockVarValue(blockConfig) {
        var varKey = blockConfig.var;
        if (typeof varKey !== "undefined" && varKey !== null && varKey.length > 0) return this.model.getVarValue(varKey);
    };

    manager.prototype.setBlockVarValue = function setBlockVarValue(blockConfig, value) {
        var varKey = blockConfig.var;
        if (typeof varKey !== "undefined" && varKey !== null && varKey.length > 0) this.model.setVarValue(varKey, value);
    };

    manager.prototype.setDlgVarMapping = function setDlgVarMapping(dlgId, blockConfig) {
        var varKey = blockConfig.var;
        var varType = blockConfig.type;
        this.model.setDlgVarMapping(dlgId, varType, varKey);
    };

    manager.prototype.getModel = function getModel() {
        return this.model;
    };

    manager.prototype.handleQueryData = function handleQueryData(data, block) {
        var processedData = block.doProcessData(data);
        this.story.handleQueryData(processedData, block);
    };

    manager.prototype.initActions = function initActions() {
        var me = this;
        this.actionsMap = {};
        var actions = me.storyDefinition.actions;
        if (actions) {
            actions.forEach(function (action) {
                var actionObj = Personetics.utils.persoHelper.deepObjectExtend({}, action, true);
                me.actionsMap[action.actionId] = actionObj;
            });
        }
    };

    manager.prototype.getAction = function getAction(params) {
        if (this.actionsMap && Object.prototype.hasOwnProperty.call(this.actionsMap, params.actionId)) {
            var action = this.actionsMap[params.actionId];
            return this.PAction.processAction(action, params.context, this.model);
        } else {
            var errorObj = new Error("PBlockProcessorManager.getAction() Error: action " + params.actionId + "doesn't exist.");
            Personetics.error(errorObj.message, false, errorObj);
        }
    };

    manager.prototype.processActions = function processActions(processedBlocks) {
        var actionsArray = [];
        var i = 0;
        for (var key in this.actionsMap) {
            var action = this.actionsMap[key];
            var actionResult = this.PAction.processAction(action, processedBlocks[i], this.model);
            actionsArray.push(actionResult);
            i++;
        }
        return actionsArray;
    };
})(window, (window.Personetics = window.Personetics || {}));

function getParsedOptions(options) {
    var _options = JSON.parse(options);

    _options.customizationOptions = typeof _options.customizationOptions === "undefined" ? null : _options.customizationOptions;
    _options.expressions = typeof _options.expressions === "undefined" ? null : _options.expressions;

    var parsedOptions = {
        story: _options.story,
        texts: _options.texts,
        facts: _options.facts,
        expressions: _options.expressions,
        customizationOptions: _options.customizationOptions,
    };

    return parsedOptions;
}

function processBlocks(options) {
    // implicitly calling window object since it's not defined in Java
    var manager = window.PBlockProcessorManager.getInstance();
    var parsedOptions = getParsedOptions(options);
    manager.start(parsedOptions);

    var ar = [];

    parsedOptions.story.dialogs.forEach(function (dialogConfig, index) {
        var processedBlocksJson = manager.processBlocks(dialogConfig);
        ar = ar.concat(processedBlocksJson);
    });

    return JSON.stringify(ar);
}

function processBlocksAndActions(options) {

    window.Personetics.processor.PStoryCache = {};

    // implicitly calling window object since it's not defined in Java
    var manager = window.PBlockProcessorManager.getInstance();
    var parsedOptions = getParsedOptions(options);

    manager.start(parsedOptions);

    this.processedBlocks = [];


    parsedOptions.story.dialogs.forEach(function (dialogConfig, index) {
        const start = new Date().getTime();
        var processedBlocksJson = manager.processBlocks(dialogConfig);
        this.processedBlocks = this.processedBlocks.concat(processedBlocksJson);
    });

    var actionsArray = manager.processActions(this.processedBlocks);

    return JSON.stringify({ blocks: this.processedBlocks, actions: actionsArray });
}

//##PERMUTATIONS CODE

function getAllPermutations(options) {
    try {
        window.Personetics.processor.PStoryCache = {};
        window.Personetics.processor.PStoryConfig.configMap.isPermutations = true;
        var parsedOptions = getParsedOptionsPermutations(options);
        changeConditionalDialog(parsedOptions);
        var blocksPermutations;
        var blocksSituationsList = [];
        var manager = window.PBlockProcessorManager.getNewInstance();

        manager.start(parsedOptions);
        var actionsArray = manager.processActions();
        blocksSituationsList = getSituationsTable(parsedOptions, manager);

        blocksPermutations = blocksSituationsList.map(function (item, i) {
            return item.props;
        });

        var allPermutations = processAllPermutations(blocksPermutations);
        var blocksMap = {};
        var varsArray = blocksSituationsList.map(function (el) {
            return el.key;
        });
        for (var i = 0; i < allPermutations.length; i++) {
            executePermutation(allPermutations[i], blocksSituationsList, parsedOptions, blocksMap, varsArray);
        }
        var ans = createFinalStructure(blocksMap, allPermutations.length, actionsArray, varsArray);
        ans.title = getTitleForPermutations(parsedOptions.texts);
        return JSON.stringify(ans);
    } catch (e) {
        window.Personetics.log("<< Permutation Not Available >>: ", e);
    }
}

function getTitleForPermutations(texts) {
    var txt;
    var textString = texts["title"][window.Personetics.processor.PStoryConfig.getConfig("lang")].txt;
    if (texts && texts.hasOwnProperty("title")) {
        txt = new window.Personetics.processor.PTextTemplate(textString, window.model);
    }
    return txt.process(window.model, undefined, this);
}

function cleanUpBlock(blocks) {
    for (var index = 0; index < blocks.length; index++) {
        var block = blocks[index];
        switch (block.value.type) {
            case "pie-chart":
                break;
            case "buttons":
                if (block.value.class === "perso-radio-buttons") {
                    blocks[index] = block.value;
                    break;
                }
            default:
                return;
        }
    }
}

function changeConditionalDialog(parsedOptions) {
    parsedOptions.story.dialogs.forEach(function (el) {
        if (Array.isArray(el.next)) {
            el.next.forEach(function (nextObj) {
                var dlgWithCond = parsedOptions.story.dialogs.filter(function (dlg) {
                    return dlg.id == nextObj.target;
                })[0];
                condToShowif(dlgWithCond, nextObj.cond);
            });
        }
    });
}

function condToShowif(dlg, cond) {
    dlg.blocks.forEach(function (block) {
        if (block.hasOwnProperty("showIf")) {
            block.showIf += " && " + cond;
        } else {
            block.showIf = cond;
        }
    });
}

function createFinalStructure(storyMap, numOfPermutations, actionsArray, varsArray) {
    var story = [];
    var dlgIds = [];
    for (blockKey in storyMap) {
        storyMap[blockKey].forEach(function (permutation) {
            permutation.value = JSON.parse(permutation.value);
        });
        var keysArray = blockKey.split(",");
        var dlgId = keysArray[0];
        var dlgClass = keysArray[1];
        if (storyMap[blockKey].length === 1 && storyMap[blockKey][0].selectorValues.length === numOfPermutations) {
            var block = storyMap[blockKey][0].value;
        } else {
            cleanUpBlock(storyMap[blockKey]);
            var block = storyMap[blockKey];
        }
        if (!(dlgIds.indexOf(dlgId) > -1)) {
            dlgIds.push(dlgId);
            var dlg = {
                type: "perso-dialog",
                class: dlgClass !== "null" ? dlgClass : "",
                blocks: [block],
                dialogId: dlgId,
            };
            story.push(dlg);
        } else {
            var dialogEl = story.filter(function (el) {
                return el.dialogId === dlgId;
            })[0];
            dialogEl.blocks.push(block);
        }
    }

    return { story: story, actions: actionsArray, selectorKeys: varsArray };
}

function getSituationsTable(options, manager) {
    var blocksSituationsList = [];
    options.story.dialogs.forEach(function (dialogConfig, i) {
        dialogConfig.blocks.forEach(function (blockConfig, j) {
            if (blockConfig.hasOwnProperty("var")) {
                switch (blockConfig.type) {
                    case "account-selector":
                        getSituationsTableAccountSelector(dialogConfig, blockConfig, blocksSituationsList, options);
                        break;
                    case "entity-selector":
                        getSituationsTableEntitySelector(dialogConfig, blockConfig, blocksSituationsList, options);
                        break;
                    case "bar-chart":
                        getSituationsTableBarChart(dialogConfig, blockConfig, blocksSituationsList, options);
                        break;
                    case "tabs":
                        getSituationsTableTabs(dialogConfig, blockConfig, blocksSituationsList, options);
                        break;
                    case "pie-chart":
                        getSituationsTablePieChart(dialogConfig, blockConfig, blocksSituationsList, options);
                        break;
                    case "buttons":
                        getSituationsTableButtons(dialogConfig, blockConfig, blocksSituationsList, options);
                        break;
                    default:
                        break;
                }
            }
        });
    });
    return blocksSituationsList;
}

function getSituationsTableAccountSelector(dialogConfig, blockConfig, blocksSituationsList, options) {
    var accounts = window.model
        .fetchFromSrc(window, blockConfig.src)
        .getObjArray()
        .map(function (account, i) {
            return account.id;
        });
    if (blockConfig.hasOwnProperty("showAll") && blockConfig.showAll) {
        accounts.unshift("all");
    }
    var situationItem = {
        blockId: blockConfig.id,
        blockType: blockConfig.type,
        props: accounts,
        key: dialogConfig.id + "." + blockConfig.id,
    };
    if (permutationsAlreadyIn(situationItem, blocksSituationsList)) {
        blocksSituationsList.push(situationItem);
    }
}

function getSituationsTableEntitySelector(dialogConfig, blockConfig, blocksSituationsList, options) {
    if (blockConfig.hasOwnProperty("options")) {
        blockConfig.options.forEach(function (opt) {
            if (opt.type == "data") {
                var budgets = window.model
                    .fetchFromSrc(window, opt.src)
                    .getObjArray()
                    .map(function (account, i) {
                        return account.id;
                    });
                var situationItem = {
                    blockId: blockConfig.id,
                    blockType: blockConfig.type,
                    props: budgets,
                    key: dialogConfig.id + "." + blockConfig.id,
                };
                if (permutationsAlreadyIn(situationItem, blocksSituationsList)) {
                    blocksSituationsList.push(situationItem);
                }
            }
        });
    }
}

function getSituationsTableBarChart(dialogConfig, blockConfig, blocksSituationsList, options) {
    if (blockConfig.hasOwnProperty("categories") && blockConfig.hasOwnProperty("varSource")) {
        if (options.facts[blockConfig.categories.split(".")[0]].rows && options.facts[blockConfig.categories.split(".")[0]].rows.length > 0) {
            var categories = window.model
                .fetchFromSrc(window, blockConfig.categories)
                .getObjArray()
                .map(function (item, i) {
                    return item[blockConfig.varSource];
                });
            var situationItem = {
                blockId: blockConfig.id,
                blockType: blockConfig.type,
                props: categories,
                key: dialogConfig.id + "." + blockConfig.id,
            };
            if (permutationsAlreadyIn(situationItem, blocksSituationsList)) {
                blocksSituationsList.push(situationItem);
            }
        }
    }
}

function getSituationsTableTabs(dialogConfig, blockConfig, blocksSituationsList, options) {
    var tabsNames = blockConfig.tabs.map(function (tab, index) {
        var texts = options.text || options.texts || null;
        if (texts) {
            var lang = window.Personetics.processor.PStoryConfig.getConfig("lang");
            return texts[dialogConfig.id][lang][tab.id];
        }
    });
    var situationItem = {
        blockId: blockConfig.id,
        blockType: blockConfig.type,
        props: tabsNames,
        key: dialogConfig.id + "." + blockConfig.id,
    };
    if (permutationsAlreadyIn(situationItem, blocksSituationsList)) {
        blocksSituationsList.push(situationItem);
    }
}

function getSituationsTablePieChart(dialogConfig, blockConfig, blocksSituationsList, options) {
    if (blockConfig.hasOwnProperty("varSource")) {
        var pieCategories = window.model
            .fetchFromSrc(window, blockConfig.src)
            .getObjArray()
            .map(function (item, i) {
                return item[blockConfig.varSource];
            });
        var situationItem = {
            blockId: blockConfig.id,
            blockType: blockConfig.type,
            props: pieCategories,
            key: dialogConfig.id + "." + blockConfig.id,
        };
        if (permutationsAlreadyIn(situationItem, blocksSituationsList)) {
            blocksSituationsList.push(situationItem);
        }
    }
}

function getSituationsTableButtons(dialogConfig, blockConfig, blocksSituationsList, options) {
    if (
        blockConfig.hasOwnProperty("buttonType") &&
        blockConfig.hasOwnProperty("class") &&
        blockConfig.buttonType === "button" &&
        blockConfig.class === "perso-radio-buttons"
    ) {
        if (blockConfig.hasOwnProperty("options")) {
            blockConfig.options.forEach(function (opt) {
                if (opt.type === "data") {
                    var ranges = window.model
                        .fetchFromSrc(window, opt.src)
                        .getObjArray()
                        .map(function (answer, i) {
                            return answer.id;
                        });
                    var situationItem = {
                        blockId: blockConfig.id,
                        blockType: blockConfig.type,
                        props: ranges,
                        key: dialogConfig.id + "." + blockConfig.id,
                    };
                    if (permutationsAlreadyIn(situationItem, blocksSituationsList)) {
                        blocksSituationsList.push(situationItem);
                    }
                }
            });
        }
    }
}

function permutationsAlreadyIn(newItem, permArr) {
    for (var i = 0; i < permArr.length; i++) {
        if (permArr[i].blockType === newItem.blockType) {
            return false;
        }
    }
    return true;
}

function executePermutation(permutationItem, blocksSituationsList, newOptions, blocksMap, varsArray) {
    for (var i = 0; i < blocksSituationsList.length; i++) {
        newOptions = changeBlockDefault(newOptions, blocksSituationsList[i].blockType, permutationItem[i]);
    }
    try {
        processStory(newOptions, blocksMap, permutationItem, varsArray);
    } catch (e) {
        window.Personetics.log("<< Permutation Not Available >>: ", e);
    }
}

function changeBlockDefault(options, blockType, index) {
    var newOptionsStory = options.story;
    newOptionsStory.dialogs.forEach(function (dialogConfig, i) {
        dialogConfig.blocks.forEach(function (blockConfig, j) {
            if (blockConfig.type === blockType) {
                blockConfig.default = "'" + index + "'";
            }
        });
    });
    options.story = newOptionsStory;
    return options;
}

function processAllPermutations() {
    return Array.prototype.reduce.call(
        arguments[0],
        function (a, b) {
            var ret = [];
            a.forEach(function (a) {
                b.forEach(function (b) {
                    var itemToPush = a.concat([b]);
                    itemToPush.size = a.length;
                    ret.push(itemToPush);
                });
            });
            return ret;
        },
        [[]]
    );
}

function processStory(options, blocksMap, permutationItem, varsArray) {
    // implicitly calling window object since it's not defined in Java
    var manager = window.PBlockProcessorManager.getNewInstance();
    var _options = {
        story: options.story || null,
        texts: options.text || options.texts || null,
        facts: options.facts || null,
        expressions: options.expressions || null,
        customizationOptions: options.customizationOptions || null,
    };
    manager.start(_options);
    manager.processPermutations(blocksMap, permutationItem, varsArray);
}

function getParsedOptionsPermutations(options) {
    var _options = JSON.parse(options);
    _options.customizationOptions = typeof _options.customizationOptions === "undefined" ? null : _options.customizationOptions;
    _options.expressions = typeof _options.expressions === "undefined" ? null : _options.expressions;
    return {
        story: _options.story || _options.storyDefinition,
        texts: _options.texts || _options.text || _options.storyText,
        facts: _options.facts || _options.insightFacts,
        expressions: _options.expressions || _options.storyExpressions,
        customizationOptions: _options.customizationOptions,
    };
}

//##END OF PERMUTATIONS CODE
/**createSchemaFacts  */
function createSchemaFacts(obj) {
    var _obj = JSON.parse(obj);
    var ar = window.Personetics.processor.PUtils.createSchemaFacts(_obj);
    return JSON.stringify(ar);
}

function processDialogsAndActions(options) {
    try {
        var parsedOptions = getParsedOptions(options);
        var dialogs = parsedOptions.story.dialogs;
        var processedDialogsAndActions = {};
        dialogs.forEach(function (dialog) {
            var storyDialogs = [dialog];
            parsedOptions.story.dialogs = storyDialogs;
            var processBlocksAndActionsObj = JSON.parse(processBlocksAndActions(JSON.stringify(parsedOptions)));
            dialog.blocks = processBlocksAndActionsObj.blocks;
            processedDialogsAndActions.dialogs = processedDialogsAndActions.dialogs || [];
            processedDialogsAndActions.dialogs.push(dialog);
            if (processBlocksAndActionsObj.actions && processBlocksAndActionsObj.actions.length) {
                processedDialogsAndActions.actions = processedDialogsAndActions.actions || [];
                processedDialogsAndActions.actions = processBlocksAndActionsObj.actions;
            }
        });
    } catch (err) {
        throw new Error(err);
    }
    return processedDialogsAndActions;
}

function processDialogsAndActionsStringified(options) {
    try {
        var manager = window.PBlockProcessorManager.getInstance();
        var parsedOptions = getParsedOptions(options);
        var dialogs = parsedOptions.story.dialogs;
        var processedDialogs = [];

        dialogs.forEach(function (dialog) {
            var storyDialolgs = [dialog];
            parsedOptions.story.dialogs = storyDialolgs;
            var processBlocksObj = JSON.parse(processBlocks(JSON.stringify(parsedOptions)));
            dialog.blocks = processBlocksObj;
            processedDialogs.push(dialog);
        });
        var processActionsObj = manager.processActions([]);
        var processedDialogsAndActions = {
            data: processedDialogs,
            actions: processActionsObj,
        };
    } catch (err) {
        throw new Error(err);
    }
    return JSON.stringify(processedDialogsAndActions);
}

function processDialogs(options) {
    window.Personetics.log("5651561546156");
    try {
        var parsedOptions = getParsedOptions(options);
        var dialogs = parsedOptions.story.dialogs;
        var processedDialogs = [];

        dialogs.forEach(function (dialog) {
            var storyDialolgs = [dialog];
            parsedOptions.story.dialogs = storyDialolgs;
            var processBlocksObj = JSON.parse(processBlocksAndActions(JSON.stringify(parsedOptions)));
            dialog.blocks = processBlocksObj.blocks;
            dialog.actions = processBlocksObj.actions || [];
            processedDialogs = processedDialogs || [];
            processedDialogs.push(dialog);
        });
    } catch (err) {
        throw new Error(err);
    }
    return JSON.stringify(processedDialogs);
}

if (typeof module !== "undefined" && module.exports) {
    var jsep = require("jsep");
    module.exports = processDialogsAndActions;
}
