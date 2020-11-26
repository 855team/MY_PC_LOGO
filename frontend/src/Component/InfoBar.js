import React from 'react';
import {Button,Tag} from 'antd';

class Infobar extends React.Component{
    constructor(props) {
        super(props);
    }
    render(){
        if(!this.props.login){
            return <Tag style={{marginLeft:"2rem"}} color="purple">未登录</Tag>
        }
        if(this.props.fid<=0){
            return(
                <div>
                    <Tag style={{marginLeft:"2rem"}} color="purple">已登录</Tag>
                </div>
            )
        }

        return(
            <div>
                <Tag style={{marginLeft:"2rem"}} color="purple">已登录</Tag>
                <Tag style={{marginLeft:"2rem"}} color="purple">currentProject:{this.props.lookup("project",{pid:this.props.pid})}</Tag>
                <Tag style={{marginLeft:"2rem"}} color="purple">currentFile:{this.props.lookup("file",{pid:this.props.pid,fid:this.props.fid})}</Tag>
            </div>
        )
    }
}



export default Infobar;