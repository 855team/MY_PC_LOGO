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
import DrawingPanel from "../Component/DrawingPanel";
import * as userService from "../Services/userService";
import WrappedLoginForm from "../Component/LoginForm";
import DoubleRoom from "../Component/DoubleRoom";
import * as fileService from "../Services/fileService"
import {message,Modal,Input} from 'antd';
import RegisterForm from "../Component/RegisterForm";
import Help from "../Component/Help";
import Battle from "../Component/Battle";
import Setting from "../Component/Setting";
import FileOperation from "../Component/FileOperation";
import {Editorheaderbar} from "../Component/InfoBar";
import UserState from "../Component/UserState";
import Bus from "../Controller/eventBus";
import { ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

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
            login:false,
            username:"",
            uid:undefined,
            turtle:undefined,
            task:undefined,
            projects:[],

            login_visible:false,
            register_visible:false,
            selected:'file',

            help_visible:false,
            battle_visible:false,
            setting_visible:false,
            userstate_visible:false,
            fileoperation_visible:false,

            editorcontent:"",
            filepanel_visible:true



        }
    }

    componentDidMount() {
        this.registerlisteners()
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
    openuserstate=()=>{
        this.setState({
            userstate_visible:true
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
    closeuserstate=()=>{
        this.setState({
            userstate_visible:false
        })
    }

    logout=async()=>{
        localStorage.removeItem("token")
        await this.setState({
            login:false,
            //TODO
        })
        message.success("退出成功")
    }

    showfilepanel(){
        this.setState({
            filepanel_visible:!this.state.filepanel_visible
        })
    }

    getproject=(pid)=>{
        let token=localStorage.getItem("token");
        let data={pid:pid,token:token}
        let callback=(result)=>{
            if(result.success){
                ; //TODO
            }
            else{
                message.error("获取远程项目失败");
            }
        }
        fileService.getproject(data,callback)
    }

    newfile=(pid,filename)=>{
        //TODO
    }

    newproject=(projectname)=>{
        //TODO
    }

    deletefile=(pid,fid)=>{
        //TODO
        return;
    }

    deleteproject=(pid)=>{
        //TODO
    }

    renamefile=(pid,fid,filename)=>{
        //TODO
    }

    renameproject=(pid,projectname)=>{
        //TODO
    }

    showConfirm=(type,name,data,deletefile,deleteproject) =>{

        confirm({
            title: `确定删除`+type+'\''+name+'\''+"吗",
            icon: <ExclamationCircleOutlined />,
            content: "一旦删除，无法撤销",
            onOk() {
                if(type=="file"){
                    deletefile(data.pid,data.fid)
                }
                if(type=="project"){
                    deleteproject(data.pid)
                }
            },
            onCancel() {
                message.success("撤销删除")
            },
        });
    }

    Askfornewname=(type,operation,data) =>{
        let newfile=this.newfile;
        let newproject=this.newproject;
        let renamefile=this.renamefile;
        let renameproject=this.renameproject;

        let tmpstr="";
        let onChange = ({ target: { value } }) => {
            tmpstr=value;
        };
        confirm({
            title: "输入一个新的名字",
            bodyStyle:{TextAlign:"center"},
            content: <Input onChange={onChange}/>,
            onOk() {
                if(type=="file"){
                    if(operation=="rename"){
                        renamefile(data.pid,data,data.fid,tmpstr)
                    }
                    if(operation=="new"){
                        newfile(data.pid,tmpstr)
                    }

                }
                if(type=="project"){
                    if(operation=="rename"){
                        renameproject(data.pid,data,tmpstr)
                    }
                    if(operation=="new"){
                        newproject(tmpstr)
                    }
                }
            },
            onCancel() {
                message.success("操作已取消")
            },
        });
    }

    lookupname=(type,data)=>{
        //TODO
        return "a"
    }


    registerlisteners(){
        Bus.addListener('newfile', (data) => {
            this.Askfornewname("file","new",{pid:data.pid})
        });
        Bus.addListener('renameproject', (data) => {
            this.Askfornewname("project","rename",{pid:data.pid})
        });
        Bus.addListener('deleteproject', (data) => {
            this.showConfirm(
                "project",
                this.lookupname("project",{pid:data.pid}),
                {pid:data.pid},
                this.deletefile,
                this.deleteproject
            )
        });
        Bus.addListener('newproject', (data) => {
            this.Askfornewname("project","new",null)
        });
        Bus.addListener('deletefile', (data) => {
            this.showConfirm(
                "file",
                this.lookupname("file",{fid:data.fid,pid:data.pid}),
                {fid:data.fid,pid:data.pid},
                this.deletefile,
                this.deleteproject
            )
        });
        Bus.addListener('renamefile', (data) => {
            this.Askfornewname("file","rename",{pid:data.pid,fid:data.fid})
        });
    }

    render() {
        return (
            <div>
                <div style={{ height: '100vh', width: '100vw',position:'absolute' }} >
                    <ReflexContainer orientation="horizontal" windowResizeAware={true}>

                        <ReflexElement className="header-pane" minSize={50} maxSize={50}>
                            <Header
                                openlogin={()=>this.openlogin()}
                                logout={()=>this.logout()}
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
                                    <SideBar onSelected={(select)=>this.setState({selected:select})} />
                                </ReflexElement>

                                <ReflexElement className="left-pane" flex={0.08} maxSize={380} minSize={250}>
                                    <div style={{ height:'100%', width: '100%',background:"#ffffff" }}>
                                        <SideBarPane style={{ height:'100%', width: '100%' }} visible={this.state.filepanel_visible}/>
                                    </div>
                                </ReflexElement>

                                <ReflexSplitter propagate={true}/>

                                <ReflexElement className="mid-pane" minSize={200}>
                                    <ReflexContainer orientation="horizontal">
                                            <MonacoEditor
                                                language="LOGO"
                                                options={{
                                                    selectOnLineNumbers: true,
                                                    roundedSelection: false,
                                                    cursorStyle: 'line',
                                                    automaticLayout: false,
                                                    theme: 'vs-dark',
                                                }}
                                                value={this.state.editorcontent}
                                            />

                                            <ReflexSplitter propagate={true}/>

                                            <Console />
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
                <div>
                    <DoubleRoom
                        onVisible={this.state.selected=="online"}
                        onReturn={e=>this.setState({selected:"file"})}
                    />
                </div>
                <div style={{position:'relative'}}>
                    <Setting closesetting={()=>this.closesetting()} visible={this.state.setting_visible}/>
                </div>
                <div style={{position:'relative'}}>
                    <FileOperation closefileoperation={()=>this.closefileoperation()} visible={this.state.fileoperation_visible}/>
                </div>
                <div style={{position:'relative'}}>
                    <UserState closeuserstate={()=>this.closeuserstate()} visible={this.state.userstate_visible}/>
                </div>

            </div>
        )
    }
}
