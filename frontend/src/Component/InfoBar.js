import React from 'react';
import {Button,Tag} from 'antd';
import { Popover } from 'antd';

class Infobar extends React.Component{

    constructor(props) {

        super(props);


    }
    render(){
        let taskdata=this.props.getcurrenttask(this.props.task);
        let tasktag;
        let tagstyle={marginLeft:"2rem",transform: "translateY(50%)"}

        if(window.innerHeight*0.045<40){
            tagstyle={marginLeft:"2rem",transform: "translateY(10%)"};
        }
        if(window.innerHeight*0.045<30){
            tagstyle={marginLeft:"2rem"};
        }
        if(!taskdata.status){
            let content=(
                <div>
                    <p>已解锁所有皮肤，快去体验一下吧</p>
                </div>
            )
            tasktag=<Popover content={content} title="Tip"><Tag style={tagstyle} color="purple">已完成所有任务</Tag></Popover>
        }
        if(taskdata.status){
            let content=(
                <div>
                    <p>{taskdata.tip}</p>
                </div>
            )
            tasktag=<Popover content={content} title="Tip"><Tag style={tagstyle} color="purple">当前任务：{taskdata.name}</Tag></Popover>

        }
        if(!this.props.login){
            return <Tag style={tagstyle } color="purple">未登录</Tag>
        }
        if(this.props.fid<=0){
            return(
                <div>
                    <Tag style={tagstyle} color="purple">已登录</Tag>
                    {tasktag}
                </div>

            )
        }

        return(
            <div>
                <Tag style={tagstyle} color="purple">已登录</Tag>
                <Tag style={tagstyle} color="purple">currentProject:{this.props.lookup("project",{pid:this.props.pid})}</Tag>
                <Tag style={tagstyle} color="purple">currentFile:{this.props.lookup("file",{pid:this.props.pid,fid:this.props.fid})}</Tag>
                {tasktag}
            </div>
        )
    }
}



export default Infobar;