import React from 'react'
import jslex from '../utils/jslex.js'
import Commands from "../Controller/Commands";

let commands=new Commands();
class Compiler extends React.Component{

    constructor(props) {
        super(props);
        this.tokens = [];
        this.current_token = 0;
        this.current_ASTNode = 0;
        this.AST = {
            type:'program',
            exps:[]
        };
        this.state = {
        }
        commands.changepenstate(1);
    }
    tokenizer(input) {
        let lexer = new jslex({
           "start": {
               "[0-9]+": function() {
                 return {type:'INT',value:parseInt(this.text, 10)}
               },
               "FD|BK|RT|LT|PU|PD|SETXY|SETPC|SETBG|REPEAT|MAKE|STAMPOVAL": function() {
                   return {type:this.text}
               },
               "#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]": function() {
                   return {type:'COLOR', value:this.text}
               },
               "[a-zA-Z0-9]+": function() {
                   return {type:'ID',value:this.text}
               },
               '[\[]': function() {
                   return {type:'LBRACK'}
               },
               '[\]]': function() {
                   return {type:'RBRACK'}
               },
               '[ \t\n]': null,
           }
        });
        let that = this;
        function callback(token) {
 //           console.log(token);
            if (token == ']')
                token = {type:'RBRACK'};
            that.tokens.push(token);
        }
        lexer.lex(input, callback);
        console.log(this.tokens);
    }

    parser() {
        let current = this.current_token;
        let tokens = this.tokens;
        function walk() {

            let token = tokens[current];
            console.log(token);
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
                token = tokens[current];
                current++;
                console.log(token);
                if (token.type == 'INT') {
                    return {
                        type: 'FDExp',
                        value: token.value
                    }
                }
                throw 'error';
            }
            if (token.type == 'BK') {
                current ++;
                token = tokens[current];
                current++;
                if (token.type == 'INT') {
                    return {
                        type: 'BKExp',
                        value: token.value,
                    }
                }
                throw 'error';
            }
            if (token.type == 'RT') {
                current ++;
                token = tokens[current];
                current ++;
                if (token.type == 'INT') {
                    return {
                        type: 'RTExp', value: token.value,
                    }
                }
                throw 'error';
            }
            if (token.type == 'LT') {
                current ++;
                token = tokens[current];
                current++;
                if (token.type == 'INT') {
                    return {
                        type: 'LTExp', value: token.value,
                    }
                }
                throw 'error';
            }
            if (token.type == 'PU') {

                current++;
                return {
                    type: 'PUExp'
                }
            }
            if (token.type == 'PD') {

                current++;
                return {
                    type: 'PDExp'
                }
            }
            if (token.type == 'SETXY') {
                token = tokens[++current];
                let node = {
                    type: 'SETXYExp',
                    valuex: 0,
                    valuey: 0,
                }
                if (token.type != 'LBRACK') {
                    throw 'error';
                }
                token = tokens[++current];
                if (token.type != 'INT') {
                    throw 'error';
                }
                node.valuex = token.value;
                token = tokens[++current];
                if (token.type != 'INT') {
                    throw 'error';
                }
                node.valuey = token.value;
                token = tokens[++current];
                if (token.type != 'RBRACK') {
                    throw 'error';
                }
                return node;
            }
            if (token.type == 'SETPC') {
                token = tokens[++current];
                if (token.type != 'COLOR') {
                    throw 'error';
                }
                current++;
                return {
                    type:'SETPCExp',
                    value:token.value,
                }
            }
            if (token.type == 'SETBG') {
                token = tokens[++current];
                if (token.type != 'COLOR') {
                    throw 'error';
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
                token = tokens[++current];
                if (token.type != 'INT') {
                    throw 'error';
                }
                node.valuex = token.value;
                token = tokens[++current];
                if (token.type != 'INT') {
                    throw 'error';
                }
                node.valuey = token.value;
                current ++;
                return node;
            }

            if (token.type == 'REPEAT') {
                token = tokens[++current];

                let node = {
                    type: 'RepeatExp',
                    iter: 1,
                    exps: [],
                }
                if (token.type == 'INT') {
                    node.iter = token.value;
                    token = tokens[++current];
                }
                if (token.type != 'LBRACK') {
                    throw 'error';
                }
                token = tokens[++current];
                while (token.type != 'RBRACK') {
                    node.exps.push(walk());
                    token = tokens[current];
                }
                current++;
                return node;
            }

            throw 'error';
        }


        while (current < tokens.length) {
            this.AST.exps.push(walk());
        }
        console.log(this.AST);
        this.current_token = current;
    }
    traverse(node) {
        if (node.type == 'FDExp') {
     //       console.log(node);
            commands.gostrait(node.value);
        }
        if (node.type == 'BKExp') {
            commands.gostrait(-node.value);
        }
        if (node.type == 'RTExp') {
            commands.turn(node.value);
        }
        if (node.type == 'LTExp') {
            commands.turn(-node.value);
        }
        if (node.type == 'RepeatExp') {
            console.log(node);
            for (let i = 0;i < node.iter;i++) {
                for (let j = 0;j < node.exps.length;j++) {
                    console.log(node.exps[j]);
                    function sleep(numberMillis) {
                        var now = new Date();
                        var exitTime = now.getTime() + numberMillis;
                        while (true) {
                            now = new Date();
                            if (now.getTime() > exitTime)
                                return;
                        }
                    }
                    console.log('start sleep')
                    sleep(1000);
                    console.log('end sleep')
                    this.traverse(node.exps[j]);
                }
            }
        }
        if (node.type == 'PUExp') {
            commands.changepenstate(0);
        }
        if (node.type == 'PDExp') {
            commands.changepenstate(1);
        }
        if (node.type == 'SETPCExp') {
            commands.changepencolor(node.value);
        }
        if (node.type == 'SETBGExp') {
            commands.changepbgcolor(node.value);
        }
        if (node.type == 'STAMPOVAL') {
            commands.drawcircle({x:node.valuex, y:node.valuey});
        }
        if (node.type == 'SETXYExp') {
            commands.changeposition({x:node.valuex,y:node.valuey});
        }
    }
    operGenerator() {
        let current = this.current_ASTNode;
        let AST = this.AST;
        while (current < AST.exps.length) {
            this.traverse(AST.exps[current]);
            current++;
        }
        this.current_ASTNode = current;
    }

    append(input) {
        // token AST traverse operation
        this.tokenizer(input);
        this.parser();
        this.operGenerator();
    }
}



export default Compiler;
