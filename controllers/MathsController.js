const fs = require('fs');

module.exports = class MathsController extends require('./Controller'){





    get(id){
        var params = this.HttpContext.path.params;
        if(!params || Object.keys(params).length == 0){
            console.log(process.cwd());
            let content = fs.readFileSync(`${process.cwd()}\\wwwroot\\MathsHelp.html`);
            this.HttpContext.response.HTML(content)
        }
        else if(!("op" in params))
            this.responseMissingParameter("op");
        else
            this.processOperator(params);
    }


    processOperator(params){
        if (params.op in this.operatorProcessors)
            this.operatorProcessors[params.op](params);
        else
            this.responseUnknownOperator(params.op);
    }

    validateNumParam(params, key = "n"){
        if (!isNaN(params[key])) return true;
        this.responseInvalidParameterType(key, "number", params);
        return false;
    }

    validateXY(params){
        return this.validateNumParam(params, "x") && 
        this.validateNumParam(params, "y");
    }

    validateParameters(params, expectedNums){
        for (let key in params){
            if (key != "op" && !expectedNums.includes(key)){
                this.responseError(`Unexpected parameter: ${key}`, params);
                return false;
            }
        }
        
        for (let i in expectedNums){
            let key = expectedNums[i];
            if (!params[key]){
                this.responseError(`Missing parameter: ${key}`);
                return false;
            } else if (!this.validateNumParam(params, key)){
                return false;
            }
        }
        
        return true;
    }

    validatePositiveInt(params, key, zeroOK = false){
        let value = Number(params[key]);
        if (value % 1 == 0 && (value > 0 || (zeroOK && value == 0)))
            return true;
        this.responseError(`'${key}' is not an integer >${zeroOK ? "=" : ""} 0`, params)
    }

    processAddition(params){
        params.op = "+"
        if(this.validateParameters(params, ['x', 'y']))
            this.responseOK(Number(params.x) + Number(params.y), params);
        
    }

    processSubstraction(params){
        if(this.validateParameters(params, ['x', 'y']))
            this.responseOK(Number(params.x) - Number(params.y), params);
    }

    processMultiplication(params){
        if(this.validateXY(params))
            this.responseOK(Number(params.x) * Number(params.y), params);
    }

    processDivision(params){
        if(this.validateParameters(params, ['x', 'y']))
            this.responseOK(Number(params.x) / Number(params.y), params);
    }

    processModulo(params){
        if(this.validateParameters(params, ['x', 'y']))
            this.responseOK(Number(params.x) % Number(params.y), params);
    }

    processFactorial(params){
        if(this.validateParameters(params, ['n']) && this.validatePositiveInt(params, 'n', true))
            this.responseOK(this.factorial(Number(params.n)), params);
    }

    processIsPrime(params){
        if(this.validateParameters(params, ['n']))
            this.responseOK(this.isPrime(Number(params.n)), params, false);
    }

    processNthPrime(params){
        if(this.validateParameters(params, ['n']))
            this.responseOK(this.findPrime(Number(params.n)), params);
    }


    factorial(n){
        if(n===0||n===1){
          return 1;
        }
        return n*this.factorial(n-1);
    }
    isPrime(value) {
        for(var i = 2; i < value; i++) {
            if(value % i === 0) {
                return false;
            }
        }
        return value > 1;
    }
    findPrime(n){
        let primeNumer = 0;
        for ( let i=0; i < n; i++){
            primeNumer++;
            while (!this.isPrime(primeNumer)){
                primeNumer++;
            }
        }
        return primeNumer;
    }
    



    responseUnknownOperator(operator, params){
        this.responseError(`Unknown operator: '${operator}'`, params)
    }

    responseMissingParameter(parameter, params){
        this.responseError(`Missing parameter: '${parameter}'`, params)
    }
    
    responseInvalidParameterType(parameter, expectedType, params){
        this.responseError(`'${parameter}' is not a ${expectedType}`, params)
    }
    
    responseError(errorText, params){
        if (!params)
            params = {};
        params.error = errorText;
        this.HttpContext.response.JSON(params);
    }

    responseOK(value, params, asString = true){
        params.value = asString ? value.toString() : value
        this.HttpContext.response.JSON(params)
    }

    constructor(HttpContext) {
        super(HttpContext);
        this.operatorProcessors = {
            "+": p => this.processAddition(p),
            " ": p => this.processAddition(p),
            "-": p => this.processSubstraction(p),
            "*": p => this.processMultiplication(p),
            "/": p => this.processDivision(p),
            "%": p => this.processModulo(p),
            "!": p => this.processFactorial(p),
            "p": p => this.processIsPrime(p),
            "np": p => this.processNthPrime(p)
        }
    }
}