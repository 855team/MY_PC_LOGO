import React from 'react';
import { Form, Input, Button, Checkbox ,Card} from 'antd';
import 'antd/dist/antd.css';


class WrappedLoginForm extends React.Component {

    constructor(props){
        super(props)
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.login(values.username,values.password);
            }
        });
    };

    render() {
        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },

        };
        const tailLayout = {
            wrapperCol: { offset: 0, span: 0 },
        };

        const onFinish = values => {
            this.props.login(values.username,values.password)
        };

        const onFinishFailed = errorInfo => {
            alert("填写有误")
        };

        if(this.props.visible){
            return (
                <Card style={{width:"350px",height:"230px",left:"40%",top:"300px",zIndex:100,shape:"round",borderRadius:"8px",backgroundColor:" #ffffb3",textAlign:"center"}}>
                <Form
                    {...layout}
                    name="basic"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}
                    >
                        <Input className="inputusername"/>
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password className="inputpassword"/>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" style={{top:0}} htmlType="submit" className="loginbutton">
                            登录
                        </Button>
                        <br/>

                        <Button shape="round" style={{top:10}} onClick={()=>this.props.closelogin()}>
                            关闭本界面
                        </Button>
                    </Form.Item>
                </Form>
                </Card>
            );
        }
        else{
            return null;
        }

    }
}



export default WrappedLoginForm
