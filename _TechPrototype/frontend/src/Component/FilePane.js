import React from "react";
import { Treebeard } from 'react-treebeard';
import { getTheme } from "../utils/theme";
import "../CSS/react-filepane.css";

const data = {
    name: 'root',
    toggled: true,
    children: [
        {
            name: 'parent',
            children: [
                { name: 'child1' },
                { name: 'child2' }
            ]
        },
        {
            name: 'loading parent',
            loading: true,
            children: []
        },
        {
            name: 'parent',
            children: [
                {
                    name: 'nested parent',
                    children: [
                        { name: 'nested child 1' },
                        { name: 'nested child 2' }
                    ]
                }
            ]
        }
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
                <Treebeard data={data} onToggle={this.onToggle}/>
            </div>
        );
    }
}

export default FilePane;
