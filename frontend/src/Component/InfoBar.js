import React from 'react';
import {Button} from 'antd';

class Fileheaderbar extends React.Component{
    constructor(props) {
        super(props);
    }
    render(){
        return(
            <div style={{height:'30px',TextAlign:'center'}}>
                <div style={{height: '2px',background:'lightblue'}} />
                <a>title</a>
                <div style={{height: '2px',background:'lightblue'}} />
            </div>
        )
    }
}

class Editorheaderbar extends React.Component{
    constructor(props) {
        super(props);
    }
    render(){
        if(this.props.login){
            return(
                <div style={{height:'30px',TextAlign:'center'}}>
                    <a>currentfile:{this.props.currentfile.name}</a>
                    <a>&nbsp;&nbsp;</a>
                    <a>currentproject:{this.props.currentproject.name}</a>
                    <Button type="primary" shape="round">run</Button>
                </div>
            )
        }
        else{
            return(
                <div style={{height:'30px',TextAlign:'center'}}>
                    <Button type="primary" shape="round" >run</Button>
                </div>
            )
        }

    }
}

export {Fileheaderbar,Editorheaderbar};