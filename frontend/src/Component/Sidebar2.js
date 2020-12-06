import React from "react";
import {getTheme} from "../utils/theme";
import "../CSS/Sidebar.css"
import SideNav, {Nav, NavIcon, NavItem} from "@trendmicro/react-sidenav";
import {IconContext} from "react-icons";
import {IoIosDocument, IoMdPeople, IoMdSettings} from "react-icons/io";
import {GoBug} from "react-icons/go";
import {HiLightBulb} from "react-icons/hi";
import {Dropdown} from "antd";

class Sidebar2 extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            active: 'file'
        };
    }
    select=(selected)=>{
        this.props.onSelected(selected);
        this.setState(
            {active:selected},
            // ()=>console.log(this.state)
        );
        if(selected=='debug'&&!this.props.debug)
            this.props.enterdebug();
    }
    render() {
        let theme = getTheme();
        return (
            <div className="sidebar-body">
                <ul className="sidebar-list">
                    <li className={this.state.active=='file'?"sidebar-item-selected":"sidebar-item"}>
                        <a className="sidebar-item-clicked"
                           onClick={e => this.select('file')}
                        >
                            <IoIosDocument className="sidebar-item-icon"/>
                        </a>
                    </li>
                    <li className={this.state.active=='debug'?"sidebar-item-selected":"sidebar-item"}>
                        <a className="sidebar-item-clicked"
                           onClick={e => this.select('debug')}
                        >
                            <GoBug className="sidebar-item-icon"/>
                        </a>
                    </li>
                    <li className={this.state.active=='settings'?"sidebar-item-selected":"sidebar-item"}>
                        <a className="sidebar-item-clicked"
                           onClick={e => this.select('settings')}
                        >
                            <IoMdSettings className="sidebar-item-icon"/>
                        </a>
                    </li>
                    <li className={this.state.active=='tutorials'?"sidebar-item-selected":"sidebar-item"}>
                        <a className="sidebar-item-clicked"
                           onClick={e => this.select('tutorials')}
                        >
                            <HiLightBulb className="sidebar-item-icon"/>
                        </a>
                    </li>
                    <li className={this.state.active=='online'?"sidebar-item-selected":"sidebar-item"}>
                        <a className="sidebar-item-clicked"
                           onClick={e => this.select('online')}
                        >
                            <IoMdPeople className="sidebar-item-icon"/>
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Sidebar2;
