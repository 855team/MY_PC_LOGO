import React from "react";
import FilePane from "./FilePane";

class SideBarPane extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        if(this.props.visible){
            return (
                <FilePane />
            )
        }
        else return null

    }
}

export default SideBarPane;