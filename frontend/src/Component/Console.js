import React, {createRef} from "react";
import ReactConsole from 'react-console-component';

import '../CSS/react-console.css';

class Console extends React.Component {
    constructor(props) {
        super(props);

        this.ref = createRef();

        this.handle = this.handle.bind(this);
    }

    handle(line) {
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