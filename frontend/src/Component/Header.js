import React from "react";
import "../CSS/react-header.css"
import {Button, Input, Select} from 'antd'
import { Menu, Dropdown,Upload,message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Progress,Modal,Image} from 'antd';
import { Radio } from 'antd';
const {confirm}=Modal;

class UserArea extends React.Component{

    state = {
        percent: 0,
    };
    constructor(props){

        super(props);
    }
    componentDidMount() {
        let task=this.props.task
        let level=parseInt((parseInt(task)+2)/3);
        let progress=(parseInt(task)+2-3*level)/3*100;
        this.setState({
            progress:progress
        })
    }
    handleclick=()=>{
        let options=[
            { label: <Image
                    width={60}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />, value: 1 },
            { label: <Image
                    width={60}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />, value: 2 },
            { label: <Image
                    width={60}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />, value: 3 },
            { label: <Image
                    width={60}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />, value: 4 },
            { label: <Image
                    width={60}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />, value: 5 },
            { label: <Image
                    width={60}
                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                />, value: 6 }
        ];
        confirm({
            title: "选择乌龟皮肤",
            bodyStyle:{TextAlign:"center"},
            content:
                <div>
                    <Radio.Group
                        options={options}
                    />
                    <br />


                </div>,
            onOk(){
                let op=()=>{

                }


            },
            onCancel() {

            },
        });
    }

    render(){

        if(!this.props.login){
            return(
                <div className="userarea">
                    <Button className="tologin" type="primary" shape="round" onClick={()=>this.props.openlogin()}>登录</Button>
                    &nbsp;
                    <Button className="toregister" type="primary" shape="round" onClick={()=>this.props.openregister()}>注册</Button>
                </div>
            )
        }
        else{
            let task=this.props.task
            let level=parseInt((parseInt(task)+2)/3);
            let progress=(parseInt(task)+2-3*level)/3*100;



            return(
                <div className="userarea" >
                    <div style={{width:window.innerHeight*0.07,float:"left",cursor:"pointer"}} onClick={()=>this.handleclick()}>
                    <Progress classname="progress" width={window.innerHeight*0.06} type="circle" percent={this.props.percent} format={() => "Lv"+level} />
                    </div>
                    <div style={{float:"left",paddingTop:window.innerHeight*0.01}}>
                    <Button shape="round" type="primary" onClick={()=>this.props.logout()}>logout</Button>
                    </div>
                </div>
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
                           onClick={()=>{this.props.cleardrawingpanel()}}>清屏</a>
                    </li>
                    <li className="toolbar-item">
                        <a className="toolbar-item-clicked"
                           onClick={()=>{this.props.openhelp()}}>帮助</a>
                    </li>
                </ul>
                <UserArea logout={this.props.logout} login={this.props.login} username={this.props.username} openlogin={this.props.openlogin} task={this.props.task} openregister={this.props.openregister}/>
            </div>
        );
    }
}

export default Header;
