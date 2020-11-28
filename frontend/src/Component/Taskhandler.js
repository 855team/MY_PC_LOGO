import React from 'react'
import Bus from '../Controller/eventBus'

const tasks=[
    {name:"查看个人信息",type:"openwindow",content:"userinfo",tip:"提示"},
    {name:"查看使用帮助",type:"openwindow",content:"help",tip:"提示"}
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

    registerlisteners() {   //TODO
        Bus.addListener('task_openwindow', () => {
            this.clear();
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
