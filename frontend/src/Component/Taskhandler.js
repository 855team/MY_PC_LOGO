import React from 'react'
import Bus from '../Controller/eventBus'

const tasks=[
    {name:"查看使用帮助",type:"openwindow",content:"help",tip:"点击菜单中帮助按钮"},
    {name:"执行Console中的命令",type:"console",content:"execute",tip:"在中间的命令行中随意输入点什么,敲入回车试着执行这段命令"},
    {name:"执行编辑器中的命令",type:"editor",content:"execute",tip:"在编辑器中输入内容，点击菜单栏中的运行"},
    {name:"上传一个文件",type:"files",content:"import",tip:"点击菜单中的文件按钮"},
    {name:"导出当前文件",type:"files",content:"export",tip:"点击菜单中的文件按钮"},
    {name:"新建一个项目",type:"files",content:"newproject",tip:"在文件树中新建项目"},
    {name:"新建一个文件",type:"files",content:"newfile",tip:"在文件树中新建文件"},
    {name:"保存当前文件",type:"files",content:"save",tip:"通过右键菜单或快捷键保存编辑区中的文件"},
    {name:"已完成所有任务",type:"finished",content:"",tip:"已解锁所有皮肤，快去体验一下吧"}
]
class Taskhandler extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <div id="taskhandler" level={this.props.task}></div>
        )
    }

    componentDidMount() {
        this.registerlisteners();
    }

    registerlisteners() {
        Bus.addListener('openwindow', (content) => {
            if(this.props.login&&this.props.task===1&&content==="help"){
                this.props.update(2)
            }
        });
        Bus.addListener('console', (content) => {
            if(this.props.login&&this.props.task===2&&content==="execute"){
                this.props.update(3)
            }
        });
        Bus.addListener('editor', (content) => {
            if(this.props.login&&this.props.task===3&&content==="execute"){
                this.props.update(4)
            }
        });
        Bus.addListener('files', (content) => {
            if(this.props.login&&this.props.task===4&&content==="import"){
                this.props.update(5)
            }
        });
        Bus.addListener('files', (content) => {
            if(this.props.login&&this.props.task===5&&content==="export"){
                this.props.update(6)
            }
        });
        Bus.addListener('files', (content) => {
            if(this.props.login&&this.props.task===6&&content==="newproject"){
                this.props.update(7)
            }
        });
        Bus.addListener('files', (content) => {
            if(this.props.login&&this.props.task===7&&content==="newfile"){
                this.props.update(8)
            }
        });
        Bus.addListener('files', (content) => {
            if(this.props.login&&this.props.task===8&&content==="save"){
                this.props.update(16)
            }
        });

    }
}

let Lookupcurrentask= (level) =>{

    if(level>tasks.length){
        return {status:false}
    }
    else{
        return {status:true,name:tasks[level-1].name,tip:tasks[level-1].tip}
    }
}

export {Lookupcurrentask,Taskhandler};
