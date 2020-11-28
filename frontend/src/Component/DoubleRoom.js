import React from "react";
import "../CSS/DoubleRoom.css"
import "../CSS/HallTable.css"
import DrawingPanel from "./DrawingPanel";
import CodeBox from "./CodeBox";
import {Avatar, Button, Input,Spin,Table} from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';
import {onConnectSSE,offConnection,sendCommand,onGetRooms} from "../Services/doubleService";

class HallButton extends React.Component{
    state={
        focus:false
    }
    render() {
        return (
            <div style={{textAlign:"center",width:"40%"}}>
                <button
                    className="hall-button"
                    onClick={this.props.onClick}
                    disabled={this.props.disabled}
                    style={{background:"url("+this.props.image+") 0 0 / 100% 100%"}}
                >
                    <div className="hall-button-mask"
                         onMouseDown={(e)=>this.setState({focus:true})}
                         onMouseUp={(e)=>this.setState({focus:false})}
                         style={this.state.focus?{background:"rgba(222,222,222,0.4)",boxShadow:"inset #ffffff 0px 0px 40px"}:{}}
                    />
                </button>
                <p style={{fontSize:20,fontWeight:"bolder",fontFamily:"幼圆"}}>{this.props.text}</p>
            </div>
        )
    }
}

class HallTable extends React.Component{
    render(){
        const columns=[
            {
                title: 'RoomId',
                dataIndex: 'rid',
                key: 'rid',
                sorter: {
                    compare: (a, b) => a.rid - b.rid,
                },
                // render: text => <a>{text}</a>,
            },
            {
                title: '房主',
                dataIndex: 'username',
                key: 'username',
            },
            {
                title:'房主Id',
                dataIndex: 'uid',
                key: 'uid'
            }
        ];

        return (
            <Table
                columns={columns}
                dataSource={this.props.dataSource}
                pagination={false}
                scroll={{y:true}}
            />);
    }
}

class DoubleRoom extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            doubleRoomState:"hall",

            hallState:"none",
            /* none--初始 joinroom--选择大厅中的房间 waiting--创建房间等待另一位用户 */

            roomResize:false,
            roomStartY:null,
            roomMessageH:320,

            allRooms:[],

            rid:0,

            owner:{
                uid:1,
                username:"草苗龟",
                turtle: 2
            },
            partner:{
                uid:1,
                username: "杰尼龟",
                turtle: 1
            },
            codes:[]
        }
    }

    componentDidMount() {
        console.log(this.props.owner)
        this.setState({owner:this.props.owner})
    }

    startResize=(e)=>{
        this.setState({roomResize:true,roomStartY:e.clientY}
            ,()=>console.log(this.state));
    }

    Resize=(e)=>{
        if(this.state.roomResize)
            this.setState({roomMessageH:this.state.roomMessageH+e.clientY-this.state.roomStartY,roomStartY:e.clientY})
    }

    createRoom=()=>{
        const enterCallback=(data)=>{
            if((data.isinroom1==false)||(data.isinroom2==false))
                this.setState({rid:data.rid,hallState:"waiting"})
            if(data.isinroom1&&data.isinroom2)
                this.setState({
                    rid:data.rid,
                    partner:{
                        uid:data.uid1==this.state.owner.uid?data.uid2:data.uid1,
                        username:data.uid1==this.state.owner.uid?data.username2:data.username1,
                        turtle:2
                    },
                    hallState:"none",
                    doubleRoomState:"room"
                })
        }
        const messageCallback=(origin_json)=>{
            let newcodes=origin_json.map((item)=>{
                return {
                    username: item.uid==this.state.owner.uid?this.state.owner.username:this.state.partner.username,
                    code: item.command,
                    isMine: item.uid==this.state.owner.uid
                }
            })
            this.setState({codes:newcodes})
        }
        const partnerCallback=(data)=>{
            this.setState({
                partner:{
                    uid:data.uid,
                    username:data.username,
                    turtle:2
                },
                hallState:"none",
                doubleRoomState:"room"
            })
        }
        const leaveCallback=(data)=>{
            this.setState({
                doubleRoomState:"hall",
                hallState:"waiting",
                codes:[]
            })
        }
        onConnectSSE('new',null,enterCallback,messageCallback,partnerCallback,leaveCallback);
    }

    joinRoom=()=>{
        let rid = parseInt(document.getElementById("hall-join-input").value)
        const enterCallback=(data)=>{
            if((data.isinroom1==false)||(data.isinroom2==false))
                this.setState({rid:data.rid,hallState:"waiting"})
            if(data.isinroom1&&data.isinroom2)
                this.setState({
                    rid:data.rid,
                    partner:{
                        uid:data.uid1==this.state.owner.uid?data.uid2:data.uid1,
                        username:data.uid1==this.state.owner.uid?data.username2:data.username1,
                        turtle:2
                    },
                    hallState:"none",
                    doubleRoomState:"room"
                })
        }
        const messageCallback=(data)=>{
            let newcodes=data.map((item)=>{
                return {
                    username: item.uid==this.state.owner.uid?this.state.owner.username:this.state.partner.username,
                    code: item.command,
                    isMine: item.uid==this.state.owner.uid
                }
            })
            this.setState({codes:newcodes})
        }
        const partnerCallback=(data)=>{
            this.setState({
                partner:{
                    uid:data.uid,
                    username:data.username,
                    turtle:2
                },
                hallState:"none",
                doubleRoomState:"room"
            })
        }
        const leaveCallback=(data)=>{
            this.setState({
                doubleRoomState:"hall",
                hallState:"waiting",
                codes:[]
            })
        }
        onConnectSSE('join',rid,enterCallback,messageCallback,partnerCallback,leaveCallback);
    }

    leaveRoom=()=>{
        const callback=()=>{
            this.setState({
                hallState:"none",
                doubleRoomState:"hall",
                rid:0
            })
        }
        offConnection(callback)
    }

    sendMessage=()=>{
        let command=document.getElementById('console-input')
        sendCommand(this.state.rid,command.value)
        command.value="";
    }

    getRooms=()=>{
        const callback=(data)=>{
            if(data==null)
                data=[]
            data=data.filter((item)=>!(item.isinroom1&&item.isinroom2))
            this.setState({
                allRooms:data.map((item)=>{return {
                    key:item.rid,
                    rid:item.rid,
                    uid:item.isinroom1?item.uid1:item.uid2,
                    username:item.isinroom1?item.username1:item.username2}
                })
            })
        }
        onGetRooms(callback)
    }

    renderHall=()=>{
        return (<div style={{width:"100%",height:"100%"}}>
            <div className="hall-header">
                <Button
                    type="primary"
                    shape="circle"
                    style={{background:"#ffc870",border:"none",marginLeft:10}}
                    icon={<ArrowLeftOutlined/>}
                    onClick={this.props.onReturn}
                />
                <div style={{marginLeft:"39%",color:"white",fontSize:20}}>双人模式</div>
            </div>
            <div className="hall-choice" style={this.state.hallState!="none"?{height:"45%"}:{height:"56%"}}>
                <HallButton
                    onClick={(e)=>this.createRoom()}
                    disabled={this.state.hallState=="waiting"}
                    image={require("../Image/Newroom.png")} text={"创建房间"}/>
                <HallButton
                    onClick={(e)=>{
                        if(this.state.hallState!="joinroom")
                            this.getRooms();
                        this.setState({hallState:this.state.hallState=="joinroom"?"none":"joinroom"});
                    }}
                    disabled={this.state.hallState=="waiting"}
                    image={require("../Image/Joinroom3.png")} text={"加入房间"}/>
            </div>
            <div className="hall-more" style={this.state.hallState!="none"?{height:"45%"}:{height:"0%"}}>
                {this.state.hallState=='waiting'?(
                <div
                    id="hall-more-waiting"
                    className={this.state.hallState=='waiting'?'hall-more-visible':'hall-more-hidden'}
                >
                        <Spin size={"large"}/>
                        <div style={{color:"#ffc870"}}>Room {this.state.rid} 等待中</div>
                        <Button
                            className="hall-more-button"
                            style={{marginTop:5,width:100}}
                            onClick={(e)=>this.leaveRoom()}
                        >结束等待</Button>
                </div>
                    ):null}

                {this.state.hallState=='joinroom'?(
                <div
                    id="hall-more-joinroom"
                    className={this.state.hallState=='joinroom'?'hall-more-visible':'hall-more-hidden'}
                >
                        <div style={{width:"35%",height:"100%",textAlign:"center"}}>
                            <div style={{marginBottom:20}}>
                                <span style={{color:"#ffc870"}}>RoomId:</span>
                                <Input id="hall-join-input"/>
                            </div>
                            <div style={{marginBottom:20}}>
                                <Button className="hall-more-button" onClick={this.joinRoom}>加入</Button>
                            </div>
                            <div>
                                <Button className="hall-more-button" onClick={this.getRooms}>刷新</Button>
                            </div>
                        </div>
                        <div style={{width:"65%",height:"100%",paddingRight:5}}>
                            <HallTable dataSource={this.state.allRooms}/>
                        </div>
                    </div>):null}
            </div>
        </div>)
    }

    renderRoom=()=>{
        return (<>
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
                            <div style={{margin:"0 5px"}}>{this.state.partner.username}</div>
                            {/*<Avatar src={require("../Image/Turtle"+this.state.partner.turtle+".jpg")} size={35}/>*/}
                        </div>
                    </div>

                    <div
                        onMouseUp={(e)=>this.setState({roomResize:false})}
                        onMouseLeave={(e)=>this.setState({roomResize:false})}
                        onMouseMove={this.Resize}
                        style={{height:320+2+110}}
                    >
                        <div className="code-message" style={{height:this.state.roomMessageH}}>
                            <CodeBox dataSource={this.state.codes}/>
                        </div>
                        <div className="splitter"
                             onMouseDown={this.startResize}
                        />
                        <div className="console" style={{height:430-this.state.roomMessageH}}>
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
                        <Button
                            id="leave-button"
                            className="console-button"
                            onClick={this.leaveRoom}
                        >退出</Button>
                    </div>
                </div>

                <div style={{width:"40%",height:"100%",borderLeft:"2px solid #ffc870"}}>
                    这里是双人房间小乌龟
                </div>
        </>)
    }

    render() {
        return (
            <div className="doubleroom-body">
                <div className={this.props.onVisible?"doubleroom-mask":"unvisible-mask"} />
                {this.props.onVisible?(
                        <div className="doubleroom-wrap">
                            {this.state.doubleRoomState=="hall"?this.renderHall():this.renderRoom()}
                        </div>
                    )
                    :null}
            </div>
        )
    }
}

export default DoubleRoom;
