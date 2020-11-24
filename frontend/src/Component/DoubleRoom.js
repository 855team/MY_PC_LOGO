import React from "react";
import "../CSS/DoubleRoom.css"
import Console from "./Console";
import {Button} from "antd";
import { ArrowLeftOutlined } from '@ant-design/icons';

class DoubleRoom extends React.Component{
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
                            </div>
                            <div style={{width:"100%",height:"60%"}}/>
                            <div className="console">
                                <Console />
                            </div>
                        </div>
                        <div style={{width:"40%",height:"100%",borderLeft:"5px solid #ffc870"}}>
                            这里是双人房间小乌龟
                        </div>
                    </div>
                ):null}
            </div>
        )
    }
}

export default DoubleRoom;
