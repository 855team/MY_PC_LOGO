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

    componentDidUpdate(prevProps, prevState, snapshot){
        const {dataSource} = this.props;

        if((prevProps.dataSource!==dataSource&&dataSource.length>0&&dataSource[dataSource.length-1].isMine)
            ||this.state.isBottom)
            this.scrollToBottom()
    }

    componentWillUnmount() {
        if (this.contentNode) {
            this.contentNode.removeEventListener('scroll',this.onScrollHandle.bind(this));
        }
    }

    scrollToBottom=()=>{
        const clientHeight = this.contentNode.clientHeight;
        const scrollHeight = this.contentNode.scrollHeight;
        this.contentNode.scrollTop=scrollHeight-clientHeight;
        if(!this.state.isBottom)
            this.setState({isBottom:true})
    }

    renderMessage=()=>{
        const {dataSource}=this.props;
        let codelist=dataSource.map((item)=>
            <CodeMessage coder={item.username} code={item.code} color={item.isMine?"#0ebeff":"#ffa4a4"}/>
        )
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
