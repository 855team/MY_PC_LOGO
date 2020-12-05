import React from 'react';
import { Form, Input, Button, Card} from 'antd';



class RegisterForm extends React.Component {

    constructor(props){
        super(props)
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                //this.props.register(values.username,values.password,values.email);
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
            this.props.register(values.username,values.password,values.email)
        };

        const onFinishFailed = errorInfo => {
            alert("填写有误")
        };

        if(this.props.visible){
            return (
                <Card style={{width:"350px",height:"280px",left:"40%",top:"300px",zIndex:100,shape:"round",borderRadius:"8px",backgroundColor:" #ffffb3",textAlign:"center"}}>
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
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true,type: 'email', message: 'Please input your email!' }]}
                    >
                        <Input className="inputemail"/>
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Button type="primary" style={{top:0}} htmlType="submit" className="loginbutton">
                            注册
                        </Button>
                        <br/>

                        <Button shape="round" style={{top:10}} onClick={()=>this.props.closeregister()}>
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



export default RegisterForm
