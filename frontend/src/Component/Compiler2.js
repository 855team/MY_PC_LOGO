import React from 'react'
import jslex from '../utils/jslex.js'
import Commands from "../Controller/Commands";
let interval=0;

let commands=new Commands();
class Compiler2 extends React.Component{

    constructor(props) {
        super(props);
        this.tokens = [];
        this.current_token = 0;
        this.current_ASTNode = 0;
        this.currentBlock = 0;
        this.ASTblock = [];
        this.ASTblock.push({name:'main',exps:[]});
        this.state = {
        }
    }
    findBlock(name) {
        if (name === 'REPEAT' || name === 'FD' || name === 'BK' || name === 'LT' || name === 'RT' ||
            name === 'PU' || name === 'PD' || name === 'SETXY' || name === 'SETPC' || name === 'SETBG' ||
            name === 'CLEAN' || name === 'TO' || name === 'END' || name === 'CALL') {
            return -2;
        }
        let size = this.ASTblock.length;
        for (let i = 0;i < size;i++) {
            if (name == this.ASTblock[i].name) {
                return i;
            }
        }
        return -1;
    }
    tokenizer(input) {
        let lexer = new jslex({
            "start": {
                "[0-9]+": function() {
                    return {type:'INT',value:parseInt(this.text, 10)}
                },
                //       "FD|BK|RT|LT|PU|PD|SETXY|SETPC|SETBG|REPEAT|MAKE|STAMPOVAL|CLEAN": function() {
                //             return {type:this.text}
                //      },
                "REPEAT": function() {
                    return {type:"REPEAT"}
                },
                "FD": function() {
                    return {type:"FD"}
                },
                "LT": function() {
                    return {type:"LT"}
                },
                "BK": function() {
                    return {type:"BK"}
                },
                "RT": function() {
                    return {type:"RT"}
                },
                "PU": function() {
                    return {type:"PU"}
                },
                "PD": function() {
                    return {type:"PD"}
                },
                "SETXY": function() {
                    return {type:"SETXY"}
                },
                "SETPC": function() {
                    return {type:"SETPC"}
                },
                "SETBG": function() {
                    return {type:"SETBG"}
                },
                "STAMPOVAL": function() {
                    return {type:"STAMPOVAL"}
                },
                "CLEAN": function() {
                    return {type:"CLEAN"}
                },
                "TO": function() {
                    return {type:"TO"}
                },
                "END": function() {
                    return {type:"END"}
                },
                "CALL": function() {
                    return {type:"CALL"}
                },
                "[a-fA-Z][a-fA-Z0-9]*": function() {
                    return {type:"STRING", value:this.text}
                },

                "#[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]": function() {
                    return {type:'COLOR', value:this.text}
                },
                // "[a-zA-Z0-9]+": function() {
                //     return {type:'ID',value:this.text}
                // },
                '[\[]': function() {
                    return {type:'LBRACK'}
                },
                '\]': function() {
                    return {type:'RBRACK'}
                },
                '[ \t\n]': null,
                '.': function() {
                    return {type:'ERROR'}
                }
            }
        });
        let that = this;
        let tokens = [];
        function callback(token) {
            //           console.log(token)
            tokens.push(token);
        }
        lexer.lex(input, callback);
        for (let i = 0;i < tokens.length;i++)
            if (tokens[i].type == 'ERROR') {
                return 0;
            }
        for (let i = 0;i < tokens.length;i++) {
            console.log(tokens[i].type, tokens[i].value);
            this.tokens.push(tokens[i]);
        }
        console.log(this.tokens);
        return 1;
    }

    parser() {
        let current = this.current_token;
        let tokens = this.tokens;
        function walk(that) {
            if (current >= tokens.length) {
                return {
                    type:'error',
                    value:'success'
                }
            }
            let token = tokens[current];
            //    console.log(token);

            if (token.type === 'INT') {
                current++;
                return {
                    type: 'NumberLiteral',
                    value: token.value,
                };
            }
            if (token.type === 'STRING') {
                current++;
                return {
                    type: 'StringLiteral',
                    value: token.value,
                };
            }
            if (token.type == 'COLOR') {
                current++;
                return {
                    type: 'ColorLiteral',
                    value: token.value
                }
            }
            if (token.type == 'FD') {
                current++;

                if (current >= tokens.length) {
                    return {
                        type:'error',
                        value:'指令参数缺失'
                    }
                }

                token = tokens[current];
                current++;
                // console.log(token);
                if (token.type == 'INT') {
                    return {
                        type: 'FDExp',
                        value: token.value
                    }
                }
                return {
                    type: 'error',
                    value: 'FD指令后应为一个整数'
                };
            }

            if (token.type === 'CALL') {
                console.log("traverse call1", current);
                current++;
                console.log("traverse call2", current);
                if (current >= tokens.length) {
                    return {
                        type:'error',
                        value:'指令参数缺失'
                    }
                }

                token = tokens[current];
                current++;
                console.log("traverse call3", current);
                if (token.type == 'STRING') {
                    let id = that.findBlock(token.value);
                    if (id < 0) {
                        return {
                            type: 'error',
                            value: '过程名不存在'
                        }
                    }
                    return {
                        type: 'CALLExp',
                        value: token.value
                    }
                }
                return {
                    type:'error',
                    value:'指令格式不正确'
                }

            }

            if (token.type == 'TO') {
                current++;
                if (current >= tokens.length) {
                    return {
                        type:'error',
                        value:'过程名缺失'
                    }
                }

                token = tokens[current];
                current++;

                if (token.type == 'STRING') {
                    let id = that.findBlock(token.value);
                    if (id >= 0) {
                        return {
                            type: 'error',
                            value: '过程名已存在'
                        }
                    }
                    if (id == -2) {
                        return {
                            type: 'error',
                            value: '过程名不合法'
                        }
                    }
                    that.ASTblock.push({name:token.value, exps:[]});
                    that.currentBlock = that.ASTblock.length - 1;
                    return {
                        type: 'defProc',
                        value: token.value
                    }
                }
                return {
                    type:'error',
                    value:'指令格式不正确'
                }
            }

            if (token.type == 'END') {
                current ++;
                if (that.currentBlock == 0) {
                    return {
                        type: 'error',
                        value: '未检测到过程定义'
                    }
                }
                that.currentBlock = 0;
                return {
                    type: 'enddef',
                    value: 'hello'
                }
            }




            if (token.type == 'BK') {
                current ++;
                if (current >= tokens.length) {
                    return {
                        type:'error',
                        value:'指令参数缺失'
                    }
                }

                token = tokens[current];
                current++;
                if (token.type == 'INT') {
                    return {
                        type: 'BKExp',
                        value: token.value,
                    }
                }
                return {
                    type: 'error',
                    value: 'BK指令后应为一个整数'
                };
            }
            if (token.type == 'RT') {
                current ++;
                if (current >= tokens.length) {
                    return {
                        type:'error',
                        value:'指令参数缺失'
                    }
                }
                token = tokens[current];
                current ++;
                if (token.type == 'INT') {
                    return {
                        type: 'RTExp', value: token.value,
                    }
                }
                return {
                    type: 'error',
                    value: 'RT指令后应为一个整数'
                };
            }
            if (token.type == 'LT') {
                current ++;
                if (current >= tokens.length) {
                    return {
                        type:'error',
                        value:'指令参数缺失'
                    }
                }

                token = tokens[current];
                current++;
                if (token.type == 'INT') {
                    return {
                        type: 'LTExp', value: token.value,
                    }
                }
                return {
                    type: 'error',
                    value: 'LT指令后应为一个整数'
                };
            }
            if (token.type == 'PU') {

                current++;
                return {
                    type: 'PUExp'
                }
            }
            if (token.type == 'CLEAN') {
                current++;
                return {
                    type: 'CLEANExp'
                }
            }
            if (token.type == 'PD') {

                current++;
                return {
                    type: 'PDExp'
                }
            }
            if (token.type == 'SETXY') {
                // console.log(tokens,current);
                if (current >= tokens.length - 1) {
                    return {
                        type:'error',
                        value:'指令参数缺失'
                    }
                }
                token = tokens[++current];
                let node = {
                    type: 'SETXYExp',
                    valuex: 0,
                    valuey: 0,
                }
                if (token.type != 'LBRACK') {
                    return {
                        type:'error',
                        value:'SETXY后应紧跟方括号'
                    }
                }
                if (current >= tokens.length - 1) {
                    return {
                        type:'error',
                        value:'指令参数缺失'
                    }
                }
                token = tokens[++current];
                if (token.type != 'INT') {
                    return {
                        type:'error',
                        value:'SETXY指令的参数应为整数'
                    }
                }
                node.valuex = token.value;
                if (current >= tokens.length - 1) {
                    return {
                        type:'error',
                        value:'指令参数缺失'
                    }
                }
                token = tokens[++current];
                if (token.type != 'INT') {
                    return {
                        type:'error',
                        value:'SETXY指令的参数应为整数'
                    }
                }
                node.valuey = token.value;
                if (current >= tokens.length - 1) {
                    return {
                        type:'error',
                        value:'指令参数缺失'
                    }
                }
                token = tokens[++current];
                if (token.type != 'RBRACK') {
                    return {
                        type:'error',
                        value:'SETXY指令缺少右括号'
                    }
                }
                current ++;
                // console.log("success",node);
                return node;
            }
            if (token.type == 'SETPC') {
                if (current >= tokens.length - 1) {
                    return {
                        type:'error',
                        value:'指令参数缺失'
                    }
                }
                token = tokens[++current];
                if (token.type != 'COLOR') {
                    return {
                        type:'error',
                        value:'SETPC颜色值不符合RGB格式'
                    }
                }
                current++;
                return {
                    type:'SETPCExp',
                    value:token.value,
                }
            }
            if (token.type == 'SETBG') {
                if (current >= tokens.length - 1) {
                    return {
                        type:'error',
                        value:'指令参数缺失'
                    }
                }
                token = tokens[++current];
                if (token.type != 'COLOR') {
                    return {
                        type:'error',
                        value:'SETBG颜色值不符合RGB格式'
                    }
                }
                current++;
                return {
                    type:'SETBGExp',
                    value:token.value,
                }
            }
            if (token.type == 'STAMPOVAL') {
                let node = {
                    type:'STAMPOVALExp',
                    valuex:0,
                    valuey:0,
                }
                if (current >= tokens.length - 1) {
                    return {
                        type:'error',
                        value:'指令参数缺失'
                    }
                }
                token = tokens[++current];
                if (token.type != 'INT') {
                    return {
                        type:'error',
                        value:'STAMPOVAL第一个参数应为整数'
                    }
                }
                node.valuex = token.value;
                if (current >= tokens.length - 1) {
                    return {
                        type:'error',
                        value:'指令参数缺失'
                    }
                }
                token = tokens[++current];
                if (token.type != 'INT') {
                    return {
                        type:'error',
                        value:'STAMPOVAL第二个参数应为整数'
                    }
                }
                node.valuey = token.value;
                current ++;
                return node;
            }

            if (token.type == 'REPEAT') {
                if (current >= tokens.length - 1) {
                    return {
                        type:'error',
                        value:'指令参数缺失'
                    }
                }
                token = tokens[++current];

                let node = {
                    type: 'RepeatExp',
                    iter: 1,
                    exps: [],
                }
                if (token.type == 'INT') {
                    node.iter = token.value;
                    if (current >= tokens.length - 1) {
                        return {
                            type:'error',
                            value:'指令参数缺失'
                        }
                    }
                    token = tokens[++current];
                }
                if (token.type != 'LBRACK') {
                    return {
                        type:'error',
                        value:'REPEAT后面应接左方括号'
                    }
                }
                if (current >= tokens.length - 1) {
                    return {
                        type:'error',
                        value:'指令参数缺失'
                    }
                }
                token = tokens[++current];
                while (token.type != 'RBRACK') {
                    let ret = walk();
                    if (ret.type == 'error')
                        return ret;
                    node.exps.push(ret);
                    token = tokens[current];
                }
                current++;
                return node;
            }

            return {
                type:'error',
                value:'指令不存在'
            }
        }

        console.log("current", current)

        while (current < tokens.length) {
            let ret = walk(this);
            if (ret.type == 'error') {
                this.current_token = current;
                return ret;
            }
            if (ret.type == 'defProc') {
                continue;
            }
            if (ret.type == 'enddef') {
                continue;
            }
            this.ASTblock[this.currentBlock].exps.push(ret);
            console.log(this.currentBlock, this.ASTblock[this.currentBlock]);
        }
        // console.log(this.AST);
        this.current_token = current;
        return {type:"success"}
    }
    traverse(node) {


        if (node.type == 'FDExp') {
            interval++;
            setTimeout(() => commands.gostrait(node.value), 10*interval)

        }
        if (node.type == 'BKExp') {
            interval++;
            setTimeout(() => commands.gostrait(-node.value), 10*interval)
        }
        if (node.type == 'RTExp') {
            interval++;
            setTimeout(() => commands.turn(node.value), 10*interval)

        }
        if (node.type == 'LTExp') {
            interval++;
            setTimeout(() => commands.turn(-node.value), 10*interval)
        }
        if (node.type == 'CLEANExp') {
            interval++;
            setTimeout(() => commands.clear(), 10*interval)
        }
        if (node.type == 'RepeatExp') {
            for (let i = 0;i < node.iter;i++) {
                for (let j = 0;j < node.exps.length;j++) {
                    this.traverse(node.exps[j])
                }
            }
        }

        if (node.type == 'CALLExp') {
            let id = this.findBlock(node.value);
            console.log("call exp", id);
            let size = this.ASTblock[id].exps.length;
            for (let i = 0;i < size;i++)
                this.traverse(this.ASTblock[id].exps[i]);
        }
        if (node.type == 'PUExp') {
            interval++;
            setTimeout(() =>commands.changepenstate(0), 10*interval)

        }
        if (node.type == 'PDExp') {
            interval++;
            setTimeout(() =>commands.changepenstate(1), 10*interval)
        }
        if (node.type == 'SETPCExp') {
            interval++;
            setTimeout(() =>commands.changepencolor(node.value), 10*interval)
        }
        if (node.type == 'SETBGExp') {
            interval++;
            setTimeout(() =>commands.changepbgcolor(node.value), 10*interval)

        }
        if (node.type == 'STAMPOVALExp') {
            interval++;
            setTimeout(() =>commands.drawcircle({x:node.valuex, y:node.valuey}), 10*interval)

        }
        if (node.type == 'SETXYExp') {
            interval++;
            setTimeout(() =>commands.changeposition({x:node.valuex,y:node.valuey}), 10*interval)

        }
    }
    operGenerator() {
        if (this.currentBlock != 0) {
            return;
        }
        console.log("last",this.AST);
        let current = this.current_ASTNode;
        let AST = this.ASTblock[this.currentBlock];
        while (current < AST.exps.length) {
            this.traverse(AST.exps[current]);
            current++;
        }
        this.current_ASTNode = current;
    }

    append(input) {
        // token AST traverse operation
        console.log(input)
        interval=0;
        if (this.tokenizer(input) == 0)
            return "该指令不存在，请重新输入";
        let ret = this.parser();
        if (ret.type != "success") {
            console.log("grammar error",ret.value);
            return ret.value;
        }
        this.operGenerator();
        return 'success';
    }
}


export default Compiler2;





