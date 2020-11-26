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
import * as userService from "../Services/userService";
import * as fileService from "../Services/fileService"
import {message,Modal,Input,Tag} from 'antd';
import WrappedLoginForm from "../Component/LoginForm";
import RegisterForm from "../Component/RegisterForm";
import Help from "../Component/Help";
import Battle from "../Component/Battle";
import Setting from "../Component/Setting";
import FileOperation from "../Component/FileOperation";
import UserState from "../Component/UserState";
import Bus from "../Controller/eventBus";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import InfoBar from "../Component/InfoBar"
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
            help_visible:false,
            battle_visible:false,
            setting_visible:false,
            userstate_visible:false,
            fileoperation_visible:false,

            editorcontent:"",
            currentpid:-1,
            currentfid:-1,

            treedata: {
                name: 'root',
                toggled: true,
                type:"root"
            },
            remotedata:[],

            filepanel_visible:true,
            fake:false



        }
    }

    componentDidMount=() =>{
        this.registerlisteners()
        this.validate()

    }

    generatetreedata=(data)=>{
        let currentproject=this.state.currentpid;
        let translate=(p)=>{
            let project={};
            project.name=p.name;
            project.type="project";
            project.id=p.pid;
            project.children=[];
            if (currentproject==p.pid){
                project.toggled=true;
            }
            for(let j=0;j<p.files.length;j++){
                let tmp= {};
                tmp.type="file";
                tmp.id=p.files[j].fid;
                tmp.parentid=p.pid;
                tmp.name=p.files[j].name;
                project.children.push(tmp);
            }
            return project;
        }
        let treedata={};
        treedata.name= 'root';
        treedata.toggled=true;
        treedata.type="root";
        treedata.children=[];
        for(let i=0;i<data.length;i++){
            treedata.children.push(translate(data[i]))
        }
        return treedata;
    }

    validate= ()=>{
        let token = localStorage.getItem("token")
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
                    this.getremotedata(result.data.Projects)
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
                this.getremotedata(result.data.info.Projects)
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
            currentfid:-1,
            currentpid:-1,
            remotedate:[],
            treedata:{
                name: 'root',
                toggled: true,
                type:"root"
            }
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
                let project=result.data;
                this.updateremotedata(pid,project)
            }
            else{
                message.error("获取远程项目失败");
            }
        }
        fileService.getproject(data,callback)
    }

    updateremotedata=async(pid,project)=>{
        let olddata=this.state.remotedata;
        let files=project.files;

        let child=[];
        for(let i=0;i<files.length;i++){
            let tmp={};
            tmp.name=files[i].Name;
            tmp.fid=files[i].Fid;
            tmp.content=files[i].Content;
            child.push(tmp);
        }
        for(let i=0;i<olddata.length;i++){
            if(olddata[i].pid==pid){
                olddata[i].name=project.name;
                olddata[i].files=child;
                await this.setState({remotedata:olddata});
                return;
            }
        }
        let newproject={};
        newproject.pid=project.pid;
        newproject.name=project.name;
        newproject.files=child;

        olddata.push(newproject);
        await this.setState({remotedata:olddata});
        await this.setState({
            treedata: this.generatetreedata(this.state.remotedata),
            filepanel_visible:true
        })
        return;
    }

    // 根据login时返回的Projects信息，获取整个远端文件信息
    // 注意，这个函数里的data是login时返回值中的Projects，Pid是大写的
    getremotedata=async (data)=>{

        for(let i=0;i<data.length;i++){
            this.getproject(data[i].Pid);
        }
    }

    modifyfile=(fid,filename,content,callback)=>{
        let token=localStorage.getItem("token");
        let data={fid:fid,name:filename,token:token,content:content};
        fileService.modifyfile(data,callback)
    }

    updatecontent(content){
        this.setState({
            editorcontent:content
        })

    }

    savecurrent=(nextop)=>{
        let pid=this.state.currentpid;
        let fid=this.state.currentfid;
        let content=this.state.editorcontent;
        if(pid>=0&&fid>=0){
            let callback=(result)=>{
                if(result.success){
                    message.success("文件已保存至远端")
                }
                else{
                    message.error("保存失败")

                }
            }
            let filename=this.lookupname("file",{pid:pid,fid:fid})
            this.modifyfile(fid,filename,content,callback)
        }
        nextop();
    }

    addfiletoremotedata=(pid,filename,fid)=>{
        this.state.remotedata.map((proj)=>{
            if(proj.pid==pid){
                proj.files.push({fid:fid,name:filename,content:""})
            }
        })
    }

    addprojecttoremotedata=(pid,projectname)=>{
        this.state.remotedata.push({
            pid:pid,
            name:projectname,
            files:[]
        })
    }

    renamefiletoremotedata=(pid,filename,fid)=>{
        this.state.remotedata.map((proj)=>{
            if(proj.pid==pid){
                proj.files.map((file)=>{
                    if(fid==file.fid){
                        file.name=filename
                    }
                })
            }
        })
    }

    renameprojecttoremotedata=(pid,projectname)=>{
        this.state.remotedata.map((proj)=>{
            if(proj.pid==pid){
                proj.name=projectname;
            }
        })
    }

    deletefiletoremotedata=(pid,fid)=>{
        let old=this.state.remotedata;
        old.map((proj)=>{
            if(proj.pid==pid){
                let tmp=proj.files.findIndex(e=>e.fid==fid);
                proj.files.splice(tmp,1)
            }
        })
        this.setState({
            remotedata:old
        })
    }

    deleteprojecttoremotedata=(pid)=>{
        let old=this.state.remotedata;
        let tmp=old.findIndex(e=>e.pid==pid);
        old.splice(tmp,1)
        this.setState({
            remotedata:old
        })
    }

    newfile=(pid,filename)=>{
        let token=localStorage.getItem("token");
        let data={pid:pid,name:filename,token:token};
        let callback=async(result)=>{
            if(result.success){
                this.savecurrent(()=>alert("ok"));
                this.addfiletoremotedata(pid,filename,result.data);
                await this.setState({
                    currentpid:pid,
                    currentfid:result.data
                })
                this.setState({
                    treedata:this.generatetreedata(this.state.remotedata),
                    editorcontent:"",
                })
                message.success("新建文件成功")
            }
            else{
                message.error("新建文件失败")
            }
        }
        fileService.newfile(data,callback)
    }

    newproject=(projectname)=>{
        let token=localStorage.getItem("token");
        let data={name:projectname,token:token};
        let callback=async(result)=>{
            if(result.success){
                this.addprojecttoremotedata(result.data,projectname);
                this.setState({
                    treedata:this.generatetreedata(this.state.remotedata),
                })
                message.success("新建项目成功")
            }
            else{
                message.error("新建项目失败")
            }
        }
        fileService.newproject(data,callback)
    }

    deletefile=(pid,fid)=>{
        let token=localStorage.getItem("token");
        let data={pid:pid,fid:fid,token:token};
        let callback=async(result)=>{
            if(result.success){
                if(pid==this.state.currentpid&&fid==this.state.currentfid){
                    this.setState({
                        editorcontent:"",
                        currentfid:-1,
                    })
                }
                this.deletefiletoremotedata(pid,fid);
                this.setState({
                    treedata:this.generatetreedata(this.state.remotedata),
                })
                message.success("删除文件成功")
            }
            else{
                message.error("删除文件失败")
            }
        }
        fileService.deletefile(data,callback)
    }

    deleteproject=(pid)=>{
        let token=localStorage.getItem("token");
        let data={pid:pid,token:token};
        let callback=async(result)=>{
            if(result.success){
                if(pid==this.state.currentpid){
                    this.setState({
                        editorcontent:"",
                        currentfid:-1,
                        currentpid:-1
                    })
                }
                this.deleteprojecttoremotedata(pid);
                this.setState({
                    treedata:this.generatetreedata(this.state.remotedata),
                })
                message.success("删除项目成功")
            }
            else{
                message.error("删除项目失败")
            }
        }
        fileService.deleteproject(data,callback)
    }

    renamefile=(pid,fid,filename)=>{
        let callback=(result)=>{
            if(result.success){
                this.renamefiletoremotedata(pid,filename,fid);
                this.setState({
                    treedata:this.generatetreedata(this.state.remotedata)
                })
                message.success("文件改名成功")
            }
            else{
                message.error("文件改名失败")
            }
        }
        let content=this.lookupcontent(fid,pid);
        this.modifyfile(fid,filename,content,callback);
    }

    renameproject=(pid,projectname)=>{
        let callback=(result)=>{
            if(result.success){
                this.renameprojecttoremotedata(pid,projectname);
                this.setState({
                    treedata:this.generatetreedata(this.state.remotedata)
                })
                message.success("项目改名成功")
            }
            else{
                message.error("项目改名失败")
            }
        }
        let token=localStorage.getItem("token");
        let data={token:token,pid:pid,name:projectname}
        fileService.modifyproject(data,callback);
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
                        renamefile(data.pid,data.fid,tmpstr)
                    }
                    if(operation=="new"){
                        newfile(data.pid,tmpstr)
                    }

                }
                if(type=="project"){
                    if(operation=="rename"){
                        renameproject(data.pid,tmpstr)
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
        let info=this.state.remotedata;
        if(type=="project"){
            for(let i=0;i<info.length;i++){
                if(info[i].pid==data.pid){
                    return info[i].name;
                }
            }
        }
        if(type=="file"){
            for(let i=0;i<info.length;i++){
                if(info[i].pid==data.pid){
                    for(let j=0;j<info[i].files.length;j++){
                        if(info[i].files[j].fid==data.fid){
                            return info[i].files[j].name;
                        }
                    }
                }
            }
        }
        return "";
    }

    lookupcontent=(fid,pid)=>{
        let info=this.state.remotedata;
        for(let i=0;i<info.length;i++){
            if(info[i].pid==pid){
                for(let j=0;j<info[i].files.length;j++){
                    if(info[i].files[j].fid==fid){
                        return info[i].files[j].content;
                    }
                }
            }
        }
    }

    updateworkspace=(fid,pid)=>{
        let content=this.lookupcontent(fid,pid);
        let setstate=(data)=>{this.setState(data)};
        if(this.state.currentfid>=0 && this.state.currentpid>=0 && this.lookupcontent(this.state.currentfid,this.state.currentpid)==this.state.editorcontent){
            this.setState({
                currentfid:fid,
                currentpid:pid
            })
            return;
        }
        if(this.state.currentfid<0 && this.state.editorcontent==""){
            this.setState({
                currentfid:fid,
                currentpid:pid
            })
            return;
        }
        else{
            confirm({
                title: '是否保存当前项目',
                icon: <ExclamationCircleOutlined />,
                onOk() {
                    let nextop=()=>{
                        setstate({
                            currentfid:fid,
                            currentpid:pid,
                            editorcontent:content
                        })
                    }
                    this.savecurrent(nextop);
                },
                onCancel() {
                    setstate({
                        currentfid:fid,
                        currentpid:pid,
                        editorcontent:content
                    })
                },
            });
        }




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
        Bus.addListener('updateworkspace', (data) => {
            this.updateworkspace(data.fid,data.pid)
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
                                <SideBar openbattle={()=>{this.openbattle()}} />
                            </ReflexElement>

                            <ReflexElement className="left-pane" flex={0.08} maxSize={380} minSize={250}>
                                <div style={{ height:'100%', width: '100%',background:"#ffffff" }}>
                                    <SideBarPane treedata={this.state.treedata} style={{ height:'100%', width: '100%' }} visible={this.state.filepanel_visible}/>
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
                                            updatecontent={(content)=>this.updatecontent(content)}
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
                        <div className="footer-pane-content" style={{background:"#ffffff",height:"100%",width:"100%"}}>
                            <InfoBar
                                login={this.state.login}
                                fid={this.state.currentfid}
                                pid={this.state.currentpid}
                                lookup={(type,data)=>this.lookupname(type,data)}
                            />
                        </div>
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
                <div style={{position:'relative'}}>
                    <UserState closeuserstate={()=>this.closeuserstate()} visible={this.state.userstate_visible}/>
                </div>

            </div>
        )
    }
}
