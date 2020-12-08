import React from "react";
import ReactDOM from 'react-dom';
import SideBar from "../Component/SideBar";
import Sidebar2 from "../Component/Sidebar2";
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
import {message,Modal,Input,Tag} from 'antd';
import RegisterForm from "../Component/RegisterForm";
import Help from "../Component/Help";
import FileOperation from "../Component/FileOperation";
import UserState from "../Component/UserState";
import Bus from "../Controller/eventBus";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import InfoBar from "../Component/InfoBar"
import { Select } from 'antd';
import * as TaskHandler from '../Component/Taskhandler';
import Compiler from "../Component/Compiler";
import Debugtool from "../Component/DebugTool";
import {offConnection} from "../Services/doubleService";
import "../CSS/MainView.css";
import FreeScrollBar from 'react-free-scrollbar';

const { Option } = Select;
const { confirm } = Modal;

export default class MainView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            login:false,
            username:"",
            uid:undefined,
            turtle:1,
            task:1,
            email:"",
            projects:[],

            login_visible:false,
            register_visible:false,
            selected:'file',

            help_visible:false,
            battle_visible:false,
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

            fake:false,
            debug:false




        }
    }

    componentDidMount=() =>{
        console.log(window.screen.width,window.screen.height);
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
                if(!result.success){
                    return false;
                }
                else{
                    await this.setState({
                        login:true,
                        username:result.data.Username,
                        uid:result.data.Uid,
                        turtle:result.data.Turtle,
                        email:result.data.Email,
                        task:result.data.Task,
                        projects:result.data.Projects
                    })
                    switch (result.data.Turtle) {
                        case 1:
                            Bus.emit("changeimg","turtle");
                            break;
                        case 2:
                            Bus.emit("changeimg","level2");
                            break;
                        case 3:
                            Bus.emit("changeimg","level3");
                            break;
                        case 4:
                            Bus.emit("changeimg","level4");
                            break;
                        case 5:
                            Bus.emit("changeimg","level5");
                            break;
                        case 6:
                            Bus.emit("changeimg","level6");
                            break;
                        default:
                            break;
                    }
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
                await this.setState({
                    login_visible:false,
                    login:true,
                    username:result.data.info.Username,
                    uid:result.data.info.Uid,
                    turtle:result.data.info.Turtle,
                    task:result.data.info.Task,
                    email:result.data.Email,
                    projects:result.data.info.Projects
                });
                switch (result.data.info.Turtle) {
                    case 1:
                        Bus.emit("changeimg","turtle");
                        break;
                    case 2:
                        Bus.emit("changeimg","level2");
                        break;
                    case 3:
                        Bus.emit("changeimg","level3");
                        break;
                    case 4:
                        Bus.emit("changeimg","level4");
                        break;
                    case 5:
                        Bus.emit("changeimg","level5");
                        break;
                    case 6:
                        Bus.emit("changeimg","level6");
                        break;
                    default:
                        break;
                }
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
        let callback=async(result)=> {
            if (result.success) {
                message.success("注册成功");
                await this.setState({
                    register_visible: false,
                });
            } else {
                message.error("注册失败")
                this.setState({
                    register_visible: false
                })
            }
        }
        console.log({username:username,password:password,email:email})
        userService.register({username:username,password:password,email:email},callback)
    }

    enterdebug=async()=>{

        await this.setState({
            debug:true
        })
        Bus.emit("debugcontent",this.state.editorcontent);
    }

    exitdebug(){
        if(this.state.debug){
            this.setState({
                debug:false
            })
        }
    }

    importfile=(content)=>{
        if(!this.state.login){
            this.setState({
                editorcontent:content
            })
            return;
        }
        if(this.state.login){
            if(this.state.currentfid>=0 && this.state.currentpid>=0 && this.lookupcontent(this.state.currentfid,this.state.currentpid)==this.state.editorcontent){
                this.setState({
                    currentfid:-1,
                    currentpid:-1,
                    editorcontent:content
                })
                return;
            }
            if(this.state.currentfid<0 && this.state.editorcontent==""){
                return;
            }
            let op=()=>{
                this.setState({
                    currentfid:-1,
                    currentpid:-1,
                    editorcontent:content
                })
            }
            this.savecurrent(op)
        }
    }

    exportfile=()=>{
        let FileSaver=require('file-saver');
        let data=this.state.editorcontent;
        let blob = new Blob([data], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "my.logo");
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
        // this.setState({
        //     help_visible:true
        // })
            Modal.info({
                title: "帮助",
                bodyStyle:{TextAlign:"center"},
                content:
                    <ul>
                        <li>本系统旨在帮助儿童学习logo语言</li>
                        <li>您可以通过在命令行或命令文件中输入代码来控制小乌龟的移动，命令文件可以保存在云端或本地，同时也可从本地导入文件</li>
                        <li>您可以通过创建双人房间与远方的小伙伴一起控制小乌龟</li>
                        <li>在通过书写代码完成任务的过程中，您可以累积经验值，解锁更漂亮的小乌龟，让写代码的过程更加愉悦</li>
                    </ul>,
                onOk(){
                    return;
                },
                onCancel() {
                    return;
                },
            });
    }
    openbattle=()=>{
        this.setState({
            battle_visible:true
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

    logout=()=>{
        offConnection(()=>{})
        localStorage.removeItem("token")
        this.setState({
            login:false,
            currentfid:-1,
            currentpid:-1,
            remotedata:[],
            turtle:1,
            treedata:{
                name: 'root',
                toggled: true,
                type:"root"
            }
        })
        Bus.emit("changeimg","turtle")
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
            console.log(result);
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
            if(olddata[i].pid===pid){
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

        this.setState({
            remotedata:olddata,
            treedata: this.generatetreedata(olddata),
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
    modifyuser=(turtle,task,callback)=>{
        let token=localStorage.getItem("token");
        let data={username:this.state.username,email:this.state.username,token:token,turtle:turtle,task:task};
        userService.modifyuser(data,callback)
    }

    updatecontent(content){
        this.setState({
            editorcontent:content
        })

    }

    editorsave=()=>{
        if(!this.state.login){
            message.warn("用户未登录");
            return
        }
        if(this.state.currentfid>=0 && this.state.currentpid>=0 && this.lookupcontent(this.state.currentfid,this.state.currentpid)==this.state.editorcontent){
            return;
        }
        if(this.state.currentfid>=0 && this.state.currentpid>=0 && this.lookupcontent(this.state.currentfid,this.state.currentpid)!=this.state.editorcontent){
            this.savecurrent(()=> {
                return;
            })
            return;
        }
        if(this.state.currentfid<0){
            this.savecurrent(()=> {
                return;
            })
            return;
        }

    }

    editornew=()=>{
        if(!this.state.login){
            this.setState({
                editorcontent:""
            })
            return;
        }
        if(this.state.login){
            if(this.state.currentfid>=0 && this.state.currentpid>=0 && this.lookupcontent(this.state.currentfid,this.state.currentpid)==this.state.editorcontent){
                this.setState({
                    currentfid:-1,
                    currentpid:-1,
                    editorcontent:""
                })
                return;
            }
            if(this.state.currentfid<0 && this.state.editorcontent==""){
                return;
            }
            let op=()=>{
                this.setState({
                    currentfid:-1,
                    currentpid:-1,
                    editorcontent:""
                })
            }
            this.savecurrent(op)
        }
    }

    editorrun=()=>{
        if(!this.state.debug){
            let lines=this.state.editorcontent.split("\r\n");
            let compiler=new Compiler();
            compiler.append("CLEAN");
            setTimeout(()=>{compiler.append(lines.join(" "))},10)
        }
        else{
            message.warn("请先退出debug模式")
        }

    }

    setturtle=(turtle)=>{
        let callback=(result)=>{
            console.log(message)

            if(result.success){
                this.setState({
                    turtle:turtle
                })
                switch (turtle) {
                    case 1:
                        Bus.emit("changeimg","turtle");
                        break;
                    case 2:
                        Bus.emit("changeimg","level2");
                        break;
                    case 3:
                        Bus.emit("changeimg","level3");
                        break;
                    case 4:
                        Bus.emit("changeimg","level4");
                        break;
                    case 5:
                        Bus.emit("changeimg","level5");
                        break;
                    case 6:
                        Bus.emit("changeimg","level6");
                        break;
                    default:
                        break;
                }

                message.success("更换皮肤成功");
            }
            else{
                message.warn("更换皮肤失败");
            }
        }
        this.modifyuser(turtle,this.state.task,callback)
    }

    savecurrent=(nextop)=>{
        if(this.state.debug){
            message.warn("请先退出debug模式");
            return;
        }
        let pid=this.state.currentpid;
        let fid=this.state.currentfid;
        let content=this.state.editorcontent;
        if(pid>=0&&fid>=0){
            let callback=(result)=>{
                if(result.success){
                    message.success("文件已保存至远端")
                    this.state.remotedata.map((project)=>{
                        if(project.pid==pid){
                            project.files.map((file)=>{
                                if(fid==file.fid){
                                    file.content=content;
                                }
                            })
                        }
                    })
                    nextop();
                }
                else{
                    message.error("保存失败")

                }
            }
            let filename=this.lookupname("file",{pid:pid,fid:fid})
            this.modifyfile(fid,filename,content,callback)

            return;
        }

        if(fid<0){
            let tmpstr="";
            let pid=-1;
            let content=this.state.editorcontent;
            let newfilewithcontent=(pid,tmpstr,content,op)=>this.newfilewithcontent(pid,tmpstr,content,op);
            let onChange=({ target: { value } }) => {
                tmpstr=value;
            };
            let handleChange=(value)=> {
                console.log(value)
                pid=value
            }
            let options=[];
            let remotedata=this.state.remotedata;
            console.log(remotedata)
            for(let i=0;i<remotedata.length;i++){
                let option=<Option key={remotedata[i].pid} value={remotedata[i].pid}>{remotedata[i].name}</Option>
                options.push(option)
            }
            if(options==[]){
                message.warn("未创建项目")
                return;
            }

            confirm({
                title: "选择新建项目的位置",
                bodyStyle:{TextAlign:"center"},
                content:
                    <div>
                        <Select placeholder="选择文件位置" style={{ width: 120 }} onChange={handleChange}>
                            {options}
                        </Select>
                        <Input onChange={onChange}/>
                    </div>,
                onOk(){
                        let op=()=>{
                            nextop()
                        }
                        newfilewithcontent(pid,tmpstr,content,op)

                },
                onCancel() {
                    message.success("操作已取消")
                },
            });
        }

    }

    addfiletoremotedata=(pid,filename,fid,content)=>{
        this.state.remotedata.map((proj)=>{
            if(proj.pid==pid){
                proj.files.push({fid:fid,name:filename,content:content})
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

    newfilewithcontent=(pid,filename,content,op)=>{
        let token=localStorage.getItem("token");
        let data={pid:pid,name:filename,token:token,content:content};
        let setstate=(data)=>this.setState(data);

        let callback=async(result)=>{
            if(result.success){
                this.addfiletoremotedata(pid,filename,result.data,content);
                this.setState({
                    currentpid:pid,
                    currentfid:result.data,
                    treedata:this.generatetreedata(this.state.remotedata),
                })
                message.success("保存文件成功")
                op();
                return;
                }
            else{
                message.error("文件保存失败")
            }
        }
        fileService.newfile(data,callback)
    }

    newfile=(pid,filename,content)=>{
        let token=localStorage.getItem("token");
        let data={pid:pid,name:filename,token:token,content:""};
        let setstate=(data)=>this.setState(data);
        let callback=async(result)=>{
            if(result.success){
                if(this.state.currentfid>=0 && this.state.currentpid>=0 && this.lookupcontent(this.state.currentfid,this.state.currentpid)==this.state.editorcontent){
                    this.addfiletoremotedata(pid,filename,result.data,"");
                    await this.setState({
                        currentpid:pid,
                        currentfid:result.data
                    })
                    this.setState({
                        treedata:this.generatetreedata(this.state.remotedata),
                        editorcontent:"",
                    })
                    message.success("新建文件成功")
                    return;

                }
                if(this.state.currentfid<0 && this.state.editorcontent==""){
                    this.addfiletoremotedata(pid,filename,result.data,"");
                    await this.setState({
                        currentpid:pid,
                        currentfid:result.data
                    })
                    this.setState({
                        treedata:this.generatetreedata(this.state.remotedata),
                        editorcontent:"",
                    })
                    message.success("新建文件成功")
                    return;
                }
                confirm({
                    title: '是否保存当前项目',
                    icon: <ExclamationCircleOutlined />,
                    onOk() {
                        let nextop=async()=>{
                            this.addfiletoremotedata(pid,filename,result.data,"");
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
                        this.savecurrent(nextop);
                    },
                    onCancel() {
                        let op=async()=>{
                            this.addfiletoremotedata(pid,filename,result.data,"");
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
                        op();
                    },
                });


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
                currentpid:pid,
                editorcontent:content
            })
            return;
        }
        if(this.state.currentfid<0 && this.state.editorcontent==""){
            this.setState({
                currentfid:fid,
                currentpid:pid,
                editorcontent:content
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

    updatetasklevel=(level)=>{
        this.setState({
            task:level
        })
    }

    registerlisteners(){
        Bus.addListener('exitdebug', () => {
            this.exitdebug()
        });
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
            <div >
            <div id="mainview-body" style={{position:'absolute'}}>
                    <div id="header-pane">
                        <Header
                            setturtle={(turtle)=>{this.setturtle(turtle)}}
                            openlogin={()=>this.openlogin()}
                            logout={()=>this.logout()}
                            openregister={()=>this.openregister()}
                            openhelp={()=>this.openhelp()}
                            openfileoperation={()=>this.openfileoperation()}
                            task={this.state.task}
                            username={this.state.username}
                            login={this.state.login}
                            importfile={(content)=>this.importfile(content)}
                            exportfile={()=>this.exportfile()}
                            run={()=>this.editorrun()}
                            cleardrawingpanel={()=>{let compiler=new Compiler(); compiler.append("CLEAN")}}
                        />
                    </div>

                    <div id="body-pane">
                            <div id="left-sidebar-pane" >
                                {/*<SideBar*/}
                                {/*    onSelected={(select)=>{*/}
                                {/*        this.setState({*/}
                                {/*            selected:(!this.state.login)&&select=='online'*/}
                                {/*                ?this.state.select:select*/}
                                {/*        })*/}
                                {/*    }}*/}
                                {/*    debug={this.state.debug}*/}
                                {/*    enterdebug={()=>this.enterdebug()}*/}
                                {/*/>*/}
                                <Sidebar2
                                    onSelected={(select)=>{
                                        this.setState({
                                            selected:(!this.state.login)&&select=='online'
                                                ?this.state.select:select
                                        })
                                    }}
                                    debug={this.state.debug}
                                    enterdebug={()=>this.enterdebug()}
                                    openhelp={()=>this.openhelp()}
                                />
                            </div>

                            <div id="left-pane">
                                <div style={{ height:'100%', width: '100%'}}>
                                    <FreeScrollBar>
                                    <SideBarPane treedata={this.state.treedata} style={{ height:'100%', width: '100%' }} visible={this.state.filepanel_visible}/>
                                    </FreeScrollBar>
                                </div>
                            </div>

                            {/*<div propagate={true}/>*/}

                            <div id="mid-pane">

                                <div style={{height:"50%"}}>
                                        <MonacoEditor
                                            language="LOGO"
                                            options={{
                                                selectOnLineNumbers: true,
                                                roundedSelection: false,
                                                cursorStyle: 'line',
                                                automaticLayout: false,
                                                theme: 'vs',
                                            }}
                                            value={this.state.editorcontent}
                                            updatecontent={(content)=>this.updatecontent(content)}
                                            save={()=>this.editorsave()}
                                            new={()=>{this.editornew()}}
                                            run={()=>this.editorrun()}
                                            debug={this.state.debug}
                                        />
                                </div>



                                <div style={{height:"50%"}}>
                                    <Console />
                                </div>

                            </div>

                            <div id="right-pane"  >
                                <FreeScrollBar>
                                    <DrawingPanel />
                                    </FreeScrollBar>
                            </div>
                    </div>

                    <div id="footer-pane">
                        <div className="footer-pane-content" style={{height:"100%",width:"100%"}}>
                            <InfoBar
                                login={this.state.login}
                                task={this.state.task}
                                fid={this.state.currentfid}
                                pid={this.state.currentpid}
                                lookup={(type,data)=>this.lookupname(type,data)}
                                getcurrenttask={(level)=>TaskHandler.Lookupcurrentask(level)}
                            />
                        </div>
                    </div>
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
                    {this.state.login?(
                    <DoubleRoom
                        onVisible={this.state.selected=="online"}
                        onReturn={e=>this.setState({selected:"file"})}
                        owner={{uid:this.state.uid,username:this.state.username,turtle:this.state.turtle}}
                    />
                    ):null}
                </div>
                <div style={{position:'relative'}}>
                    <FileOperation closefileoperation={()=>this.closefileoperation()} visible={this.state.fileoperation_visible}/>
                </div>
                <div style={{position:'relative'}}>
                    <UserState closeuserstate={()=>this.closeuserstate()} visible={this.state.userstate_visible}/>
                </div>
                <div style={{position:'relative'}}>
                    <Debugtool debug={this.state.debug} />
                </div>
                <TaskHandler.Taskhandler login={this.state.login} task={this.state.task} update={(level)=>this.updatetasklevel(level)}/>

            </div>
        )
    }
}
