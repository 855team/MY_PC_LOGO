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
            isBottom:true,
            code_index:0
        }
    }

    onScrollHandle(event) {
        const clientHeight = event.target.clientHeight
        const scrollHeight = event.target.scrollHeight
        const scrollTop = event.target.scrollTop
        const isBottom = (clientHeight + scrollTop === scrollHeight)
        this.setState({isBottom:isBottom})
    }

    componentDidMount() {
        if (this.contentNode) {
            this.contentNode.addEventListener('scroll',this.onScrollHandle.bind(this));
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.scrollToBottom()
    }

    componentWillUnmount() {
        if (this.contentNode) {
            this.contentNode.removeEventListener('scroll',this.onScrollHandle.bind(this));
        }
    }

    scrollToBottom=()=>{
        const clientHeight = this.contentNode.clientHeight
        const scrollHeight = this.contentNode.scrollHeight
        if(this.state.isBottom)
            this.contentNode.scrollTop=scrollHeight-clientHeight;
    }

    renderMessage=()=>{
        const {dataSource}=this.props;
        let index=0,existMine=false;
        let codelist=dataSource.map((item)=>{
            index++;
            if(index>this.state.code_index&&item.isMine)
                existMine=true
            return <CodeMessage coder={item.username} code={item.code} color={item.isMine?"#0ebeff":"#ffa4a4"}/>
        })
        if(existMine)
        {
            if(this.contentNode)
                this.contentNode.scrollTop=this.contentNode.scrollHeight-this.contentNode.clientHeight;
            this.setState({isBottom:true,code_index:index})
        }
        return codelist;
        /*数据格式--username code isMine*/
    }

    render() {
        return (
            <div className="codebox-body" ref={ node => this.contentNode = node }>
                {this.renderMessage()}
            </div>
        )
    }
}

export default CodeBox;
