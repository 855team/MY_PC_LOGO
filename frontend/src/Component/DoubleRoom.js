import React from "react";
import "../CSS/DoubleRoom.css"
import DrawingPanel from "./DrawingPanel";
import CodeBox from "./CodeBox";
import {Avatar, Button, Input} from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';

class DoubleRoom extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            resize:false,
            startY:null,
            messageH:320,

            me:{
                turtleType: 2,
                username:"草苗龟"
            },
            partner:{
                turtleType: 1,
                username: "杰尼龟"
            },
            codes:[]
        }
    }

    componentDidMount() {
        this.test();
    }

    startResize=(e)=>{
        this.setState({resize:true,startY:e.clientY}
            ,()=>console.log(this.state));
    }

    Resize=(e)=>{
        if(this.state.resize)
            this.setState({messageH:this.state.messageH+e.clientY-this.state.startY,startY:e.clientY})
    }

    test=()=>{
        let testcodes = this.state.codes;
        testcodes.push({username:this.state.partner.username, code:"FL 123", isMine:false});
        testcodes.push({username:this.state.partner.username, code:"TL 90", isMine:false});
        this.setState({codes:testcodes});
    }

    sendMessage=()=>{
        var myInput=document.getElementById('console-input')
        let newcodes = this.state.codes;

        newcodes.push({username:this.state.me.username,code:myInput.value,isMine:true});
        myInput.value="";

        this.setState({codes:newcodes});
    }

    render() {
        return (
            <div className="doubleroom-body">
                <div className={this.props.onVisible?"doubleroom-mask":"unvisible-mask"} />
                {this.props.onVisible?(
                    <div className="doubleroom-wrap">
                        <div style={{width:"60%",height:"100%"}}>
                            <div className="doubleroom-header">
                                <Button
                                    type="primary"
                                    shape="circle"
                                    style={{background:"#ffc870",border:"none",marginLeft:10}}
                                    icon={<ArrowLeftOutlined/>}
                                    onClick={this.props.onReturn}
                                />
                                <div className="header-partnerinfo">
                                    <span>{this.state.partner.username}</span>
                                    <Avatar src={require("../Image/Turtle"+this.state.partner.turtleType+".jpg")} size={35}/>
                                </div>
                            </div>

                            <div
                                 onMouseUp={(e)=>this.setState({resize:false})}
                                 onMouseLeave={(e)=>this.setState({resize:false})}
                                 onMouseMove={this.Resize}
                                 style={{height:320+2+110}}
                            >
                                <div className="code-message" style={{height:this.state.messageH}}>
                                    <CodeBox dataSource={this.state.codes}/>
                                </div>
                                <div className="splitter"
                                     onMouseDown={this.startResize}
                                />
                                <div className="console" style={{height:430-this.state.messageH}}>
                                    <textarea id="console-input" onKeyUp={(e)=>{
                                        if(e.keyCode==13)
                                            this.sendMessage()
                                    }}/>
                                </div>
                            </div>

                            <div>
                                <Button
                                    className="console-button"
                                    onClick={this.sendMessage}
                                >发送</Button>
                            </div>
                        </div>

                        <div style={{width:"40%",height:"100%",borderLeft:"2px solid #ffc870"}}>
                            这里是双人房间小乌龟
                        </div>
                    </div>
                ):null}
            </div>
        )
    }
}

export default DoubleRoom;
