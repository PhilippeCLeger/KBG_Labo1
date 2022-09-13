
module.exports = class MathsController extends require('./Controller'){





    get(id){
        var params = this.HttpContext.path.params;
        if(!params)
            this.responseError("Help!!");
        else if(!("op" in params))
            this.responseMissingParameter("op");
        else
            this.processOperator(params);
        // this.HttpContext.response.JSON(params);

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

    validatePositiveInt(params, key, zeroOK = false){
        let value = Number(params[key]);
        if (value % 1 == 0 && (value > 0 || (zeroOK && value == 0)))
            return true;
        this.responseError(`'${key}' is not an integer >${zeroOK && "="} 0`, params)
    }

    processAddition(params){
        params.op = "+"
        if(this.validateXY(params))
            this.responseOK(Number(params.x) + Number(params.y), params);
        
    }

    processSubstraction(params){
        if(this.validateXY(params))
            this.responseOK(Number(params.x) - Number(params.y), params);
    }

    processMultiplication(params){
        if(this.validateXY(params))
            this.responseOK(Number(params.x) * Number(params.y), params);
    }

    processDivision(params){
        if(this.validateXY(params))
            this.responseOK(Number(params.x) / Number(params.y), params);
    }

    processModulo(params){
        if(this.validateXY(params))
            this.responseOK(Number(params.x) % Number(params.y), params);
    }

    processFactorial(params){
        this.responseError("", params)
    }

    processIsPrime(params){
        this.responseError("", params)
    }

    processNthPrime(params){
        this.responseError("", params)
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
        params.error = errorText;
        this.HttpContext.response.res.writeHead(522, {'content-type': 'application/json'})
        this.HttpContext.response.end(JSON.stringify(params));
    }

    responseOK(value, params){
        params.value = value.toString()
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