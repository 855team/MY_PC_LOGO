import React from "react";
import SideNav, { Nav, NavItem, NavIcon } from '@trendmicro/react-sidenav';
import { IconContext } from "react-icons";
import { IoIosDocument, IoMdPeople, IoMdSettings } from "react-icons/io";
import { GoBug } from "react-icons/go";
import { HiLightBulb } from "react-icons/hi";
import { getTheme } from "../utils/theme";

import '../CSS/react-sidenav.css';


class SideBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            active: {
                'file': true,
                'debug': false,
                'settings': false,
                'tutorials': false,
                'online': false
            }
        };
    }

    render() {
        let theme = getTheme();
        return (
            <SideNav
                // style={theme.sidebar}
                style={{background:"linear-gradient(#82cbff,#ffffff)"}}
                onSelect={(selected) => {
                    let prev_active = this.state.active;
                    for (let k in prev_active) {
                        prev_active[k] = false;
                    }
                    prev_active[selected] = true;
                    this.setState({
                        active: prev_active
                    });
                }}
            >
                <Nav defaultSelected="file">
                    <NavItem eventKey="file" active={this.state.active['file']}>
                        <NavIcon>
                            <IconContext.Provider value={{size: '2.5em', color: 'white', className: 'sidebar-icon'}}>
                                <IoIosDocument />
                            </IconContext.Provider>
                        </NavIcon>
                    </NavItem>

                    <NavItem eventKey="debug" active={this.state.active['debug']}>
                        <NavIcon>
                            <IconContext.Provider value={{size: '2.5em', color: 'white', className: 'sidebar-icon'}}>
                                <GoBug />
                            </IconContext.Provider>
                        </NavIcon>
                    </NavItem>

                    <NavItem eventKey="settings" active={this.state.active['settings']}>
                        <NavIcon>
                            <IconContext.Provider value={{size: '2.5em', color: 'white', className: 'sidebar-icon'}}>
                                <IoMdSettings />
                            </IconContext.Provider>
                        </NavIcon>
                    </NavItem>

                    <NavItem eventKey="tutorials" active={this.state.active['tutorials']}>
                        <NavIcon>
                            <IconContext.Provider value={{size: '2.5em', color: 'white', className: 'sidebar-icon'}}>
                                <HiLightBulb />
                            </IconContext.Provider>
                        </NavIcon>
                    </NavItem>

                    <NavItem eventKey="online" active={this.state.active['online']}>
                        <NavIcon>
                            <IconContext.Provider value={{size: '2.5em', color: 'white', className: 'sidebar-icon'}}>
                                <IoMdPeople />
                            </IconContext.Provider>
                        </NavIcon>
                    </NavItem>
                </Nav>
            </SideNav>
        );
    }
}

export default SideBar;
