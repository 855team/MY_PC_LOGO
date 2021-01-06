class VarMap {
    varMap = new Map()
    get(key) {
        if (this.varMap.has(key)) {
            return this.varMap.get(key);
        } else {
            return 0;
        }
    }

    put(key, value) {
        console.log('PUT', key, value)
        this.varMap.set(key, value);
    }

    eval(expr) {
        if (typeof expr === 'number') {
            return expr;
        } else if (typeof expr === 'string') {
            if (expr.charAt(0) === '#') {
                return expr;
            }
            let _expr_ = expr.replace(/[a-zA-Z][a-zA-Z0-9]*/g, function (str) {
                return 'this.get("' + str + '")';
            })
            return eval(_expr_);
        }
    }
}

export default new VarMap();