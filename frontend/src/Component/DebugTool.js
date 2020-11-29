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
        this.currentline=0;
    }

    componentDidMount() {
        this.registerlisteners();
    }

    registerlisteners(){
        Bus.addListener("debugcontent",(content)=>{
            this.content=content.split("\r\n")
            Bus.emit("currentdebugpoint",1)
        })
    }

    runnextline=()=>{

    }
    runtonextpoint=()=>{

    }
    restart=()=>{

    }
    exit=()=>{
        Bus.emit("exitdebug","")
    }

    render(){
        if(this.props.debug){
            return(
                <Draggable
                    axis="both"
                    defaultPosition={{x: 150, y: 600}}
                    position={null}
                    grid={[1, 1]}
                    scale={1}
                    onStart={()=>{return;}}
                    onDrag={()=>{return;}}
                    onStop={()=>{return;}}>
                    <div style={{width:"100px",shape:"round",borderRadius:"8px",zIndex:100}}>

                        <Button type="primary" shape="round" icon={<ArrowDownOutlined />} onClick={()=>this.runnextline()}>
                            Next Line
                        </Button>
                        <Button type="primary" shape="round" icon={<PlayCircleOutlined />} onClick={()=>this.runtonextpoint()}>
                            Next Breakpoint
                        </Button>
                        <Button type="primary" shape="round" icon={<RedoOutlined />} onClick={()=>this.restart()}>
                            Restart
                        </Button>
                        <Button type="primary" shape="round" icon={<StopOutlined />} onClick={()=>this.exit()}>
                            Exit
                        </Button>

                    </div>
                </Draggable>
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

