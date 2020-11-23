import React from 'react';
import { Form, Input, Button, Card} from 'antd';
import 'antd/dist/antd.css';


class FileOperation extends React.Component {

    constructor(props){
        super(props)
    }

    render() {
        if(this.props.visible){
            return (
                <Card style={{width:"350px",height:"230px",left:"40%",top:"300px",zIndex:100,shape:"round",borderRadius:"8px",backgroundColor:" #ffffb3",textAlign:"center"}}>
                    <Button shape="round" style={{top:10}} onClick={()=>this.props.closefileoperation()}>
                        关闭本界面
                    </Button>
                </Card>
            );
        }
        else{
            return null;
        }

    }
}



export default FileOperation;
