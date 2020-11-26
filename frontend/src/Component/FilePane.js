import React from "react";
import Treebeard from '../Treebeard/index';
import { getTheme } from "../utils/theme";
import "../CSS/react-filepane.css";
import {Fileheaderbar} from "./InfoBar";
import {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {VelocityComponent} from 'velocity-react';


const data = {
    name: 'root',
    toggled: true,
    type:"root",
    children: [
        {
            name: 'parent',
            id:5,
            type:"project",
            children: [
                { name: 'child1',id:2,type:"file",parentid:5 },
                { name: 'child2',id:3,type:"file",parentid:5 }
            ]
        },
    ]
};

class FilePane extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: data
        }

        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(node, toggled) {
        const {cursor, data} = this.state;
        if (cursor) {
            this.setState(() => ({cursor, active: false}));
        }
        node.active = true;
        if (node.children) {
            console.log(node.children)
            node.toggled = toggled;
        }
        this.setState(() => ({cursor: node, data: Object.assign({}, data)}));
    }



    render() {
        let theme = getTheme();
        return (
            <div
                // style={theme.filePane}
                style={{background:"linear-gradient(#82cbff,#ffffff)",width:"100%",height:"100%"}}
            >
                <div style={{height: '0.4em'}} />
                <Treebeard data={data} onToggle={this.onToggle} />
            </div>
        );
    }
}



export default FilePane;
