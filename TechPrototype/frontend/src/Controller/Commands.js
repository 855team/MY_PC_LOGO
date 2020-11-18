import Bus from './eventBus'
import React from 'react'

class Commands extends React.Component{
    constructor(props){
        super(props);
        this.state={
            pos: {},
            orientation:0,
            bgcolor:'#F0FFFF',
            pencolor:'#000000',
            height:0,
            width:0,
            penstate:0
        }
    }
    componentDidMount(){

    }
    turn(angle){
        //改变海龟朝向,角度制
        Bus.emit('turn',angle);
    }
    gostrait(length){
        //直线运动一段距离，length为负数表示后退
        //PENUP时不会画线，PENDOWN时会画线
        Bus.emit('gostrait',length)
    }
    clear(){
        //清屏，乌龟复原
        Bus.emit('clear');
    }
    changeposition(position){
        //改变乌龟位置，不管pendown还是penup
        //position是xy的键值对
        Bus.emit('changeposition',position);
    }
    changepenstate(state){
        //0:PU,1:PD
        //PENUP时，乌龟能移动，但不会在canvas上画线条
        Bus.emit('changepenstate',state);
    }
    changeimg(src){
        //换皮肤,src为文件名
        Bus.emit('changeimg',src);
    }
    changepencolor(pencolor){
        //改变画笔的颜色
        Bus.emit('changepencolor',pencolor);
    }
    changepbgcolor(bgcolor){
        //改变画布的颜色
        Bus.emit('changebgcolor',bgcolor);
    }
    drawcircle(ridius){
        //画一个椭圆，ridius为xy的键值对
        //ridius包括横向半径和纵向半径，横向定义为与乌龟朝向垂直的方向
        Bus.emit('drawcircle',ridius);
    }
}

export default Commands;