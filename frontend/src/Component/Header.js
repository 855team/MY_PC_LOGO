import React from "react";
import "../CSS/react-header.css"
import {Button} from 'antd'
import { Menu, Dropdown,Upload,message } from 'antd';
import { DownOutlined } from '@ant-design/icons';

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
        let importfile=this.props.importfile;
        let uploadconfig = {
            name: 'file',
            beforeUpload(file){
                if (file.name.indexOf(".logo")===-1) {
                    message.error(`${file.name} is not a logo file`);
                    return false;
                }
                const reader=new FileReader();
                reader.readAsText(file);
                reader.onload=(result)=>{
                    importfile(result.target.result)
                }
                return true;
            },
            showUploadList:false


        };
        let menu = (
            <Menu>
                <Menu.Item>
                    <Upload {...uploadconfig} accept=".logo" id="uploader">
                    <a target="_blank" rel="noopener noreferrer" >
                        导入文件
                    </a>
                    </Upload>
                </Menu.Item>
                <Menu.Item>
                    <a target="_blank" rel="noopener noreferrer" onClick={()=>this.props.exportfile()}>
                        导出文件
                    </a>
                </Menu.Item>
            </Menu>
        );
        return (
            <div className="header-content">
                <img src={require("../assets/logo.png")} className="logo"/>
                <ul className="toolbar">
                    <li className="toolbar-item">
                        <Dropdown overlay={menu}>
                            <a className="toolbar-item-clicked" onClick={e => e.preventDefault()}>
                                文件 <DownOutlined />
                            </a>
                        </Dropdown>
                    </li>
                    <li className="toolbar-item">
                        <a className="toolbar-item-clicked"
                           onClick={()=>{this.props.run()}}>运行</a>
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
