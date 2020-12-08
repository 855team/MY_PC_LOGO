import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {VelocityComponent} from 'velocity-react';
import {Dropdown,Menu} from "antd";
import Bus from '../../../Controller/eventBus'

class Container extends PureComponent {
    constructor(props) {
        super(props);
    }
    renderToggle() {
        const {animations} = this.props;


        if (!animations) {
            return this.renderToggleDecorator();
        }

        return (
            <VelocityComponent animation={animations.toggle.animation} duration={animations.toggle.duration}>
                {this.renderToggleDecorator()}
            </VelocityComponent>
        );
    }

    renderToggleDecorator() {
        const {style, decorators, onClick} = this.props;
        return <decorators.Toggle style={style.toggle} onClick={onClick}/>;
    }

    renamefile=(fid,pid)=>{
        Bus.emit("renamefile",{fid:fid,pid:pid})
    }
    renameproject=(pid)=>{
        Bus.emit("renameproject",{pid:pid})
    }
    deletefile=(fid,pid)=>{
        Bus.emit("deletefile",{fid:fid,pid:pid})
    }
    deleteproject=(pid)=>{
        Bus.emit("deleteproject",{pid:pid})
    }
    newfile=(pid)=>{
        Bus.emit("newfile",{pid:pid})
    }
    newproject=()=>{
        Bus.emit("newproject",null)
    }

    updateworkspace=(node)=>{
        if(node.type=="file"){
            Bus.emit("updateworkspace",{fid:node.id,pid:node.parentid})
        }

    }

    generatemenu=(node)=>{
        if(node.type=="file"){
            return(
                <Menu>
                    <Menu.Item key="1" onClick={()=>this.renamefile(node.id,node.parentid)}>重命名</Menu.Item>
                    <Menu.Item key="2" onClick={()=>this.deletefile(node.id,node.parentid)}>删除文件</Menu.Item>
                </Menu>
            )
        } else{
            if(node.type=="project"){
                return(
                    <Menu>
                        <Menu.Item key="1" onClick={()=>this.renameproject(node.id)}>重命名</Menu.Item>
                        <Menu.Item key="2" onClick={()=>this.newfile(node.id)}>新建文件</Menu.Item>
                        <Menu.Item key="3" onClick={()=>this.deleteproject(node.id)}>删除项目</Menu.Item>
                    </Menu>
                )
            }else{
                return(
                    <Menu>
                        <Menu.Item key="1" onClick={()=>this.newproject()}>新建项目</Menu.Item>
                    </Menu>
                )

            }
        }

    }

    render() {
        const {
            style, decorators, terminal, node, onSelect, customStyles
        } = this.props;
        return (
            <Dropdown overlay={this.generatemenu(node)} trigger={['contextMenu']} >
            <div style={node.active ? {...style.container} : {...style.link}} onDoubleClick={()=>this.updateworkspace(node)}>

                {!terminal ? this.renderToggle() : null}
                <decorators.Header node={node} style={{...style.header}} customStyles={customStyles} onSelect={onSelect}/>

            </div>
            </Dropdown>
        );
    }
}

Container.propTypes = {
    customStyles: PropTypes.object,
    style: PropTypes.object.isRequired,
    decorators: PropTypes.object.isRequired,
    terminal: PropTypes.bool.isRequired,
    onClick: PropTypes.func.isRequired,
    onSelect: PropTypes.func,
    animations: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.bool
    ]).isRequired,
    node: PropTypes.object.isRequired
};

Container.defaultProps = {
    onSelect: null,
    customStyles: {}
};

export default Container;
