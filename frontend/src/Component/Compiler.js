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

               "#[0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f][0-9a-f]": function() {
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
            this.tokens.push(tokens[i]);
        }
        console.log(this.tokens);
        return 1;
    }

    parser() {
        let current = this.current_token;
        let tokens = this.tokens;
        function walk() {

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
                console.log(tokens,current);
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
                current ++;
                console.log("success",node);
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
            console.log(current,this.AST);
        }
        console.log(this.AST);
        this.current_token = current;
    }
    traverse(node) {
        setTimeout(Math.random() * 1000);
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
        if (node.type == 'CLEANExp') {
            commands.clear();
        }
        if (node.type == 'RepeatExp') {
            console.log(node);
            for (let i = 0;i < node.iter;i++) {
                for (let j = 0;j < node.exps.length;j++) {
                    console.log(node.exps[j]);

          //          console.log('start sleep')
                    setTimeout(() => this.traverse(node.exps[j]), (i * 10 + j) * 20)
          //          console.log('end sleep')
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
        if (node.type == 'STAMPOVALExp') {
            console.log("hello",node);
            commands.drawcircle({x:node.valuex, y:node.valuey});
        }
        if (node.type == 'SETXYExp') {
            console.log('hello')
            commands.changeposition({x:node.valuex,y:node.valuey});
        }
    }
    operGenerator() {
        console.log("last",this.AST);
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
        if (this.tokenizer(input) == 0)
            return;
        this.parser();
        this.operGenerator();
    }
}



export default Compiler;
