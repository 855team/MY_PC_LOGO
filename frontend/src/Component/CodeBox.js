import React from 'react';
import {Avatar} from "antd";
import "../CSS/CodeBox.css";

class CodeMessage extends React.Component{
    render() {
        return (
            <div className="message-wrap">
                <span className="coder" style={{color:this.props.color}}>
                    {this.props.coder}:
                </span>
                <span className="code">
                    {this.props.code}
                </span>
            </div>
        );
    }

}

class CodeBox extends React.Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {}


    renderMessage=()=>{
        const {dataSource}=this.props;
        let codelist = dataSource;
        return codelist.map((item)=>
            <CodeMessage coder={item.username} code={item.code} color={item.isMine?"#0ebeff":"#ffa4a4"}/>)
        /*数据格式--username code isMine*/
    }

    render() {
        return (
            <div className="codebox-body">
                {this.renderMessage()}
            </div>
        )
    }
}

export default CodeBox;
