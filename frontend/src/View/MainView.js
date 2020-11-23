import React from "react";
import ReactDOM from 'react-dom';
import SideBar from "../Component/SideBar";
import SideBarPane from "../Component/SideBarPane";
import Console from "../Component/Console";
import Header from "../Component/Header";
import {
    ReflexContainer,
    ReflexSplitter,
    ReflexElement
} from 'react-reflex';
import MonacoEditor from "../Component/MonacoEditor";
import DrawingPanel from "../Component/DrawingPanel"
import * as userService from "../Services/userService"
import {message} from 'antd';
import WrappedLoginForm from "../Component/LoginForm";
import RegisterForm from "../Component/RegisterForm";
import Help from "../Component/Help";
import Battle from "../Component/Battle";
import Setting from "../Component/Setting";
import FileOperation from "../Component/FileOperation";

class ControlledElement extends React.Component {

    constructor(props) {
        super(props);


        this.onMinimizeClicked = this.onMinimizeClicked.bind(this);
        this.onMaximizeClicked = this.onMaximizeClicked.bind(this);

        this.state = {
            size: -1
        };
    }

    onMinimizeClicked() {
        const currentSize = this.getSize();
        const parentSize = this.getParentSize();
        const update = (size) => {
            return new Promise((resolve) => {
                this.setState(Object.assign({},
                    this.state, {
                        size: size < 25 ? 25 : size
                    }), () => resolve());
            });
        };

        const done = (from, to) => {
            return from < to;
        };

        this.animate(currentSize, (currentSize>parentSize*0.5)*parentSize*0.5, -8, done, update);
    }

    onMaximizeClicked() {
        const currentSize = this.getSize();
        const parentSize = this.getParentSize();

        const update = (size) => {
            return new Promise((resolve) => {
                this.setState(Object.assign({},
                    this.state, {
                        size
                    }), () => resolve());
            });
        };

        const done = (from, to) => {
            return from > to;
        };

        this.animate(currentSize, ((currentSize+25>parentSize*0.5)+1)*parentSize*0.5, 8, done, update);
    }

    getSize() {
        const domElement = ReactDOM.findDOMNode(this);
        switch (this.props.orientation) {
            case 'horizontal':
                return domElement.offsetHeight;
            case 'vertical':
                return domElement.offsetWidth;
            default:
                return 0;
        }
    }

    getParentSize() {
        const domElement = ReactDOM.findDOMNode(this).parentNode;
        switch (this.props.orientation) {
            case 'horizontal':
                return domElement.offsetHeight;
            case 'vertical':
                return domElement.offsetWidth;
            default:
                return 0;
        }
    }

    animate(from, to, step, done, fn) {
        const stepFn = () => {
            if (!done(from, to)) {
                fn(from += step).then(() => {
                    setTimeout(stepFn, 1)
                });
            }
        };
        stepFn();
    }

    render() {
        return (
            <ReflexElement className="ctrl-pane" size={this.state.size} {...this.props}>
                <div style={{height: '100%'}}>
                    <div style={{height: '20px', backgroundColor: 'black', overflow: 'hidden'}}>
                        <button onClick={this.onMinimizeClicked} style={{float: 'right', verticalAlign: 'center'}}>
                            <label> - </label>
                        </button>
                        <button onClick={this.onMaximizeClicked} style={{float: 'right', verticalAlign: 'center'}}>
                            <label> + </label>
                        </button>
                    </div>
                    <div style={{position: 'absolute', top: '22px', bottom: '0', width: '100%', overflow: 'hidden'}}>
                        {this.props.children}
                    </div>
                </div>
            </ReflexElement>
        )
    }
}

export default class MainView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pane1: {
                name: '命令文件',
                direction: 1,
                id: 'mid-top-panel',
                minSize: 25
            },
            pane2: {
                name: '命令行',
                direction: -1,
                id: 'mid-bot-panel',
                minSize: 25
            },
            login:false,
            username:"",
            uid:undefined,
            turtle:undefined,
            task:undefined,
            projects:[],
            login_visible:false,
            register_visible:false,
            help_visible:false,
            battle_visible:false,
            setting_visible:false,
            fileoperation_visible:false


        }
    }

    componentDidMount() {
        this.validate()
    }
    validate= ()=>{
        let token = localStorage.getItem("token")
        console.log(token)
        if(!token){
            return false;
        }
        if(token){
            const callback= async (result)=>{
                console.log(result)
                if(!result.success){
                    return false;
                }
                else{
                    await this.setState({
                        login:true,
                        username:result.data.Username,
                        uid:result.data.Uid,
                        turtle:result.data.Turtle,
                        task:result.data.Task,
                        projects:result.data.Projects
                    })
                }
            }
            userService.validate({token:token},callback)
        }
    }

    login=(username,password)=>{
        let callback=async(result)=>{

            if(result.success){
                message.success("登陆成功");
                localStorage.setItem("token",result.data.token)
                console.log(localStorage.getItem("token"))
                await this.setState({
                    login_visible:false,
                    login:true,
                    username:result.data.info.Username,
                    uid:result.data.info.Uid,
                    turtle:result.data.info.Turtle,
                    task:result.data.info.Task,
                    projects:result.data.info.Projects
                });
            }
            else{
                message.error("登陆失败")
                this.setState({
                    login_visible:false
                })
            }
        }
        userService.login({username:username,password:password},callback)
    }

    register=(username,password,email)=>{
        let callback=async(result)=>{
            if(result.success){
                message.success("注册成功");
                await this.setState({
                    register_visible:false,
                });
            }
            else{
                message.error("注册失败")
                this.setState({
                    register_visible:false
                })
            }
        }
        userService.login({username:username,password:password,email:email},callback)
    }

    openlogin=()=>{
        this.setState({
            login_visible:true
        })
    }
    openregister=()=>{
        this.setState({
            register_visible:true
        })
    }
    openhelp=()=>{
        this.setState({
            help_visible:true
        })
    }
    openbattle=()=>{
        this.setState({
            battle_visible:true
        })
    }
    opensetting=()=>{
        this.setState({
            setting_visible:true
        })
    }
    openfileoperation=()=>{
        this.setState({
            fileoperation_visible:true
        })
    }


    closelogin=()=>{
        this.setState({
            login_visible:false
        })
    }
    closeregister=()=>{
        this.setState({
            register_visible:false
        })
    }
    closehelp=()=>{
        this.setState({
            help_visible:false
        })
    }
    closebattle=()=>{
        this.setState({
            battle_visible:false
        })
    }
    closesetting=()=>{
        this.setState({
            setting_visible:false
        })
    }
    closefileoperation=()=>{
        this.setState({
            fileoperation_visible:false
        })
    }

    render() {
        return (
            <div>
            <div style={{ height: '100vh', width: '100vw',position:'absolute' }} >
                <ReflexContainer orientation="horizontal" windowResizeAware={true}>

                    <ReflexElement className="header-pane" minSize={50} maxSize={50}>
                        <Header
                            openlogin={()=>this.openlogin()}
                            openregister={()=>this.openregister()}
                            openhelp={()=>this.openhelp()}
                            opensetting={()=>this.opensetting()}
                            openfileoperation={()=>this.openfileoperation()}
                            username={this.state.username}
                            login={this.state.login}
                        />
                    </ReflexElement>

                    <ReflexElement className="body-pane">
                        <ReflexContainer orientation="vertical">

                            <ReflexElement className="left-sidebar-pane" minSize={65} maxSize={65}>
                                <SideBar openbattle={()=>{this.openbattle()}}/>
                            </ReflexElement>

                            <ReflexElement className="left-pane" flex={0.08} maxSize={380} minSize={250}>
                                <div style={{ height:'100%', width: '100%',background:"#ffffff" }}>
                                    <SideBarPane style={{ height:'100%', width: '100%' }} />
                                </div>
                            </ReflexElement>

                            <ReflexSplitter propagate={true}/>

                            <ReflexElement className="mid-pane" minSize={200}>
                                <ReflexContainer orientation="horizontal">

                                    <ControlledElement {...this.state.pane1}>
                                        <MonacoEditor
                                            language="LOGO"
                                            options={{
                                                selectOnLineNumbers: true,
                                                roundedSelection: false,
                                                cursorStyle: 'line',
                                                automaticLayout: false,
                                                theme: 'vs-dark',
                                            }}
                                        />
                                    </ControlledElement>

                                    <ReflexSplitter propagate={true}/>

                                    <ControlledElement {...this.state.pane2}>
                                        <Console />
                                    </ControlledElement>
                                </ReflexContainer>
                            </ReflexElement>

                            <ReflexSplitter propagate={true}/>


                            <ReflexElement  className="right-pane"  minSize={800} maxSize={800}  onResize={(el)=> {
                                let canvas=document.getElementById('mycanvas');
                                let data=canvas.getContext("2d").getImageData(0,0,canvas.width,canvas.height)
                                canvas.width=el.domElement.clientWidth;
                                canvas.height=el.domElement.clientHeight;
                                canvas.getContext("2d").putImageData(data,0,0);
                            }}>
                                    <DrawingPanel />
                            </ReflexElement>


                        </ReflexContainer>
                    </ReflexElement>

                    <ReflexElement className="footer-pane" minSize={30} maxSize={30}>
                        <div className="footer-pane-content"
                        style={{background:"#ffffff",height:"100%",width:"100%"}}/>
                    </ReflexElement>

                </ReflexContainer>

            </div>
                <div style={{position:'relative'}}>
                    <WrappedLoginForm login={(username,password)=>this.login(username,password)} closelogin={()=>this.closelogin()} visible={this.state.login_visible}/>
                </div>
                <div style={{position:'relative'}}>
                    <RegisterForm register={(username,password,email)=>this.register(username,password,email)} closeregister={()=>this.closeregister()} visible={this.state.register_visible}/>
                </div>
                <div style={{position:'relative'}}>
                    <Help closehelp={()=>this.closehelp()} visible={this.state.help_visible}/>
                </div>
                <div style={{position:'relative'}}>
                    <Battle closebattle={()=>this.closebattle()} visible={this.state.battle_visible}/>
                </div>
                <div style={{position:'relative'}}>
                    <Setting closesetting={()=>this.closesetting()} visible={this.state.setting_visible}/>
                </div>
                <div style={{position:'relative'}}>
                    <FileOperation closefileoperation={()=>this.closefileoperation()} visible={this.state.fileoperation_visible}/>
                </div>

            </div>
        )
    }
}
