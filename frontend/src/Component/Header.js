import React from "react";
import "../CSS/react-header.css"
import {Button} from 'antd'

class UserArea extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        if(!this.props.login){
            return(
                <div>
                    <Button className="tologin" type="primary" shape="round" onClick={()=>this.props.openlogin()}>登录</Button>
                    <Button className="toregister" type="primary" shape="round" onClick={()=>this.props.openregister()}>注册</Button>
                </div>
            )
        }
        else{
            return(
                <span className="avatar">
                    <div className="exp">
                        <div className="rank">Lv.14</div>
                        <div className="exp-bar">
                            <div className="exp-bar-current" style={{width:70}}/>
                            <div className="exp-num">
                                <span>70/100</span>
                            </div>
                        </div>
                    </div>

                    <img src={require("../assets/avatar.jpg")} className="avatar-img"/>

                    <p className="avatar-username">{this.props.username}</p>
                    <Button shape="round" type="primary" onClick={()=>this.props.logout()}>logout</Button>
                </span>
            )
        }
    }
}

class Header extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="header-content">
                <img src={require("../assets/logo.png")} className="logo"/>
                <ul className="toolbar">
                    <li className="toolbar-item">
                        <a className="toolbar-item-clicked"
                           onClick={()=>{this.props.openfileoperation()}}>文件</a>
                    </li>
                    <li className="toolbar-item">
                        <a className="toolbar-item-clicked"
                           onClick={()=>{this.props.opensetting()}}>设置</a>
                    </li>
                    <li className="toolbar-item">
                        <a className="toolbar-item-clicked"
                           onClick={()=>{this.props.openhelp()}}>帮助</a>
                    </li>
                </ul>
                <UserArea logout={this.props.logout} login={this.props.login} username={this.props.username} openlogin={this.props.openlogin} openregister={this.props.openregister}/>
            </div>
        );
    }
}

export default Header;
