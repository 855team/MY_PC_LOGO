/*
按照目前的设计，画布canvas的大小是不可更改的。如果画布大小可以更改，就会遇到一个问题：你在边缘画了一个圆，缩小画布尺寸，再将画布尺寸改回原来大小，那个圆会被吃掉一部分。
这是一个糟糕的体验，linton没法解决这个问题，就放弃了这个功能。（已经能做到拖拽和缩放、画布大小随layout变化，但解决不了上述问题，很可惜）
乌龟不属于canvas，是一个独立的漂浮组件。

请通过commangds来控制画布！！！！！！！
在任意componennt里，import commands，
```
let commands=new Commands()
commands.func()
```
即可控制画布
Attention!!!!!!异步执行，密集的命令可能出错
 */

import React from 'react';
import ReactDom from 'react-dom'
import Bus from '../Controller/eventBus'
import Commands from "../Controller/Commands";
const initpos={x:400,y:400};

class DrawingPanel extends React.Component{

    constructor(props) {
        super(props);
        this.state={
            pos:initpos,
            orientation:0,
            bgcolor:'#F0FFFF',
            pencolor:'#000000',
            height:0,
            width:0,
            penstate:0
        }
    }

    render(){
        return(
            <div id="drawingpanel" style={{height:"100%",width:"100%",position: 'relative'}}>
                <canvas id='mycanvas'   style={{backgroundColor:'#F0FFFF',position:'absolute'}}>
                    Your browser does not support the canvas element.
                </canvas>
                <img id="turtle" ref="turtle"  src={require("../assets/turtle.png")} style={{position:'relative',width:'40px',height:'40px',marginLeft:400,
                    marginTop:400,transform:'rotate(0deg)'}}/>
            </div>
        )
    }
    componentDidMount() {
        this.registerlisteners();
        //canvas元素
        let c=document.getElementById('mycanvas');
        c.width=document.getElementById('drawingpanel').clientWidth;
        c.height=document.getElementById('drawingpanel').clientHeight;
        this.setState({
            height:c.height,
            width:c.width
        })
        let ctx=c.getContext('2d');

        this.drawtest(ctx);
        //this.drawline({x:200,y:200},{x:500,y:500},"red");
        //this.drawcircle({x:500,y:500},{x:200,y:300},"red",Math.PI/4)
        //document.getElementById("turtle").style.transform="rotate(135deg)"
        //this.setsource("../assets/turtle_copy.png")

    }

    drawtest(ctx){
        // draw a smile on the canvas,just for test


        let path=new Path2D();
        path.arc(75, 75, 55, 0, Math.PI*2, true);
        path.moveTo(110,75);
        path.arc(75, 75, 35, 0, Math.PI, false);
        path.moveTo(65, 65);
        path.arc(60, 65, 5, 0, Math.PI*2, true);
        path.moveTo(95, 65);
        path.arc(90, 65, 5, 0, Math.PI*2, true);
        ctx.strokeStyle = '#000000';
        ctx.stroke(path);
    }

    changebgcolor(color){
        //改变画布的背景颜色
        document.getElementById("mycanvas").style.backgroundColor=color;
    }

    drawline(start,end,color){
        //画线
        let canvas=document.getElementById("mycanvas");
        let ctx =canvas.getContext("2d");
        ctx.strokeStyle = color;
        let path=new Path2D();
        path.moveTo(start.x,start.y);
        path.lineTo(end.x,end.y);
        ctx.stroke(path);
    }

    drawcircle(center,radius,color,angle){
        //画椭圆
        let canvas=document.getElementById("mycanvas");
        let ctx =canvas.getContext("2d");
        ctx.strokeStyle = color;
        let path=new Path2D();
        path.ellipse(center.x, center.y, radius.x,radius.y,angle, 0,Math.PI*2, true);
        ctx.stroke(path);
    }

    clear(){
        //清除canvas中的内容，乌龟回到初始位置
        this.setorientation(0);
        this.setposition(initpos);

        let canvas=document.getElementById("mycanvas");
        canvas.width=canvas.width;
    }

    setorientation(angle){
        //设置乌龟的旋转角度，角度为顺时针绝对值
        ReactDom.findDOMNode(document.getElementById("turtle")).style.transform=`rotate(${angle}deg)`;
    }
    setposition(position){
        //设置乌龟在canvas上的位置
        //position为xy的键值对
        let positionX=position.x;
        let positionY=position.y;
        ReactDom.findDOMNode(document.getElementById("turtle")).style.marginLeft=`${positionX}px`;
        ReactDom.findDOMNode(document.getElementById("turtle")).style.marginTop=`${positionY}px`;
    }

    setsource(src){
        //设置乌龟的图像源，src为文件名
        //图像建议长与宽相近，压缩成40*40时不会失真
        ReactDom.findDOMNode(document.getElementById("turtle")).src=require(`../assets/${src}.png`);
    }



    registerlisteners(){
        Bus.addListener('clear', () => {
            this.clear();
        });
        Bus.addListener('changeimg', (src) => {
            this.setsource(src);
        });
        Bus.addListener('changepencolor', (color) => {
            this.setState({
                pencolor:color
            })
        });
        Bus.addListener('changebgcolor', (color) => {
            this.changebgcolor(color);
            this.setState({
                bgcolor:color
            })
        });
        Bus.addListener('changepenstate', (state) => {
            this.setState({
                penstate:state
            })
        });
        Bus.addListener('changeposition', (position) => {
            this.setposition(position)
            this.setState({
                pos:position
            })
        });
        Bus.addListener('turn', async (angle) => {
            let newangle=this.state.orientation+angle
            await this.setorientation(newangle)
            await this.setState({
                orientation:newangle
            })
        });
        Bus.addListener('gostrait', async (length) => {
            let oldpos=this.state.pos;
            let endposX=oldpos.x+length*Math.sin(Math.PI*this.state.orientation/180);
            let endposY=oldpos.y-length*Math.cos(Math.PI*this.state.orientation/180);
            await this.setState({
                pos:{x:endposX,y:endposY}
            })
            this.setposition({x:endposX,y:endposY})
            if(this.state.penstate){
                oldpos.x=(oldpos.x+20);
                oldpos.y=(oldpos.y+20);
                endposX=(endposX+20);
                endposY=(endposY+20);
                this.drawline(oldpos,{x:endposX,y:endposY},this.state.pencolor)
            }
        });
        Bus.addListener('drawcircle', (radius) => {
            if(this.state.penstate){
                let pos={x:this.state.pos.x+20,y:this.state.pos.y+20}
                this.drawcircle(pos,radius,this.state.pencolor,this.state.orientation)
            }
        });


    }




}

export default DrawingPanel;