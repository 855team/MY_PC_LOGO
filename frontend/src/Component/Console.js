import React, {createRef} from "react";
import Commands from "../Controller/Commands";
import ReactConsole from 'react-console-component';

import '../CSS/react-console.css';
let commands=new Commands();

class Console extends React.Component {
    constructor(props) {
        super(props);

        this.ref = createRef();

        this.handle = this.handle.bind(this);
    }

    handle(line) {
        commands.changepbgcolor("white");
        if(line=="a"){
            commands.turn(45);
            commands.changepenstate(1);
        }
        if(line=="b"){
            commands.gostrait(50);
        }
        if(line=="c"){
            commands.changeposition({x:600,y:600})
        }
        if(line=="d"){
            commands.drawcircle({x:200,y:300})
        }
        if(line=="f"){
            commands.clear()
        }
        if(line=="e"){
            commands.changeimg("logo")
        }
        if(line=="g"){
            commands.changepencolor("red")
        }

        this.ref.current.log(line);
        this.ref.current.return();
    }

    render() {
        return (
            <ReactConsole
                ref={this.ref}
                handler={this.handle}
                welcomeMessage="Welcome to Online MY_PC_LOGO!"
                promptLabel="> "
                autofocus={true}
                complete={(a, b, c)=> {
                    console.log(a, b, c);
                    return ["123", "456"];
                }}
            />
        );
    }
}

export default Console;