import React from "react";
import Draggable from 'react-draggable';
import { StopOutlined,ArrowDownOutlined,RedoOutlined,PlayCircleOutlined } from '@ant-design/icons';
import {Button, message} from 'antd'
import Bus from "../Controller/eventBus";
import Compiler from "./Compiler";

class Debugtool extends React.Component{
    constructor(props) {
        super(props);
        this.compiler=new Compiler();
        this.content=[];
        this.breakpoints=[];
        this.currentline=0;
    }

    componentDidMount() {
        this.registerlisteners();
    }

    registerlisteners(){
        Bus.addListener("debugcontent",(content)=>{
            this.content=content.split("\r\n");
            for(let i=0;i<this.content.length;i++){
                this.breakpoints.push(false)
            }
            this.compiler.append("CLEAN")
            Bus.emit("currentdebugpoint",0) //从0开始
        })
        Bus.addListener("addbreakpoint",(line)=>{
            this.breakpoints[line-1]=true
        })
        Bus.addListener("deletebreakpoint",(line)=>{
            this.breakpoints[line-1]=false
        })
    }

    runnextline=()=>{
        this.compiler.append(this.content[this.currentline])
        Bus.emit("deletecurrentdebugpoint",this.currentline)
        if(this.currentline==this.content.length-1){
            this.currentline=0;
        }
        else{
            this.currentline+=1;
        }
        Bus.emit("currentdebugpoint",this.currentline)
    }
    runtonextpoint=()=>{
        let flag=false;
        let nextline=0;
        for(let i=this.currentline+1;i<this.content.length;i++){
            if(this.breakpoints[i]==true){
                flag=true;
                nextline=i;
                break;
            }
        }
        if(flag){
            Bus.emit("deletecurrentdebugpoint",this.currentline)
            let lines=this.content.slice(this.currentline,nextline);
            this.compiler.append(lines.join(" "));
            this.currentline=nextline;
            Bus.emit("currentdebugpoint",this.currentline)
        }
        else{
            message.error("找不到下一个断点")
        }
    }
    restart=()=>{
        this.compiler.append("CLEAN");
        Bus.emit("deletecurrentdebugpoint",this.currentline)    //从0开始
        Bus.emit("deletebreakpoints",this.breakpoints)
        this.breakpoints=[];
        for(let i=0;i<this.content.length;i++){
            this.breakpoints.push(false);
        }
        this.currentline=0;
        Bus.emit("currentdebugpoint",0)
    }
    exit=()=>{
        Bus.emit("deletecurrentdebugpoint",this.currentline)    //从0开始
        Bus.emit("deletebreakpoints",this.breakpoints)  //从0开始
        Bus.emit("exitdebug",null)
    }

    render(){
        if(this.props.debug){
            return(
                <div style={{width:"480px"}}>
                <Draggable
                    bounds={{top: 0, left: 0, right: 800, bottom: 600}}
                    axis="both"
                    defaultPosition={{x: 100, y: 400}}
                    onStart={()=>{return;}}
                    onDrag={()=>{return;}}
                    onStop={()=>{return;}}>
                    <div style={{shape:"round",borderRadius:"8px",zIndex:100,}}>
                        <Button type="primary" shape="round" icon={<ArrowDownOutlined />} onClick={()=>this.runnextline()}>
                            Next Line
                        </Button>
                        &nbsp;
                        <Button type="primary" shape="round" icon={<PlayCircleOutlined />} onClick={()=>this.runtonextpoint()}>
                            Next Breakpoint
                        </Button>
                        &nbsp;
                        <Button type="primary" shape="round" icon={<RedoOutlined />} onClick={()=>this.restart()}>
                            Restart
                        </Button>
                        &nbsp;
                        <Button type="primary" shape="round" icon={<StopOutlined />} onClick={()=>this.exit()}>
                            Exit
                        </Button>

                    </div>
                </Draggable>
                </div>
            )
        }
        else{
            return(
                <div className="debugtool"></div>
            )

        }
    }
}

export default Debugtool;

