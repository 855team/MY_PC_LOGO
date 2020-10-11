import React from "react";
import "../CSS/react-header.css"

class Header extends React.Component {

    render() {
        return (
            <div className="header-content">
                <img src={require("../assets/logo.png")} className="logo"/>
                <ul className="toolbar">
                    <li className="toolbar-item">
                        <a className="toolbar-item-clicked"
                           onClick={(e)=>console.log("点击了文件")}>文件</a>
                    </li>
                    <li className="toolbar-item">
                        <a className="toolbar-item-clicked"
                           onClick={(e)=>console.log("点击了设置")}>设置</a>
                    </li>
                    <li className="toolbar-item">
                        <a className="toolbar-item-clicked"
                           onClick={(e)=>console.log("点击了帮助")}>帮助</a>
                    </li>
                </ul>
                <span className="avatar">
                    <div className="exp">
                        <div className="rank">Lv.14</div>
                        <div className="exp-bar">
                            <div className="exp-bar-current" style={{width:70}}/>
                            <div className="exp-num">
                                <span>70/100</span>
                            </div>
                        </div>
                    </div>

                    <img src={require("../assets/avatar.jpg")} className="avatar-img"/>

                    <p className="avatar-username">Sylveon</p>
                </span>

            </div>
        );
    }
}

export default Header;
