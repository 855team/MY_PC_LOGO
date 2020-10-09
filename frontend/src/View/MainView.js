import React from "react";
import ReactDOM from 'react-dom';
import SideBar from "../Component/SideBar";
import SideBarPane from "../Component/SideBarPane";
import {
    ReflexContainer,
    ReflexSplitter,
    ReflexElement
} from 'react-reflex';

class ControlledElement extends React.Component {

    constructor(props) {
        super(props);

        this.onMinimizeClicked = this.onMinimizeClicked.bind(this);
        this.onMaximizeClicked = this.onMaximizeClicked.bind(this);

        this.state = {
            size: -1
        };
    }

    onMinimizeClicked() {
        const currentSize = this.getSize();
        const parentSize = this.getParentSize();
        const update = (size) => {
            return new Promise((resolve) => {
                this.setState(Object.assign({},
                    this.state, {
                        size: size < 25 ? 25 : size
                    }), () => resolve());
            });
        };

        const done = (from, to) => {
            return from < to;
        };

        this.animate(currentSize, (currentSize>parentSize*0.5)*parentSize*0.5, -8, done, update);
    }

    onMaximizeClicked() {
        const currentSize = this.getSize();
        const parentSize = this.getParentSize();

        const update = (size) => {
            return new Promise((resolve) => {
                this.setState(Object.assign({},
                    this.state, {
                        size
                    }), () => resolve());
            });
        };

        const done = (from, to) => {
            return from > to;
        };

        this.animate(currentSize, ((currentSize+25>parentSize*0.5)+1)*parentSize*0.5, 8, done, update);
    }

    getSize() {
        const domElement = ReactDOM.findDOMNode(this);
        switch (this.props.orientation) {
            case 'horizontal':
                return domElement.offsetHeight;
            case 'vertical':
                return domElement.offsetWidth;
            default:
                return 0;
        }
    }

    getParentSize() {
        const domElement = ReactDOM.findDOMNode(this).parentNode;
        switch (this.props.orientation) {
            case 'horizontal':
                return domElement.offsetHeight;
            case 'vertical':
                return domElement.offsetWidth;
            default:
                return 0;
        }
    }

    animate(from, to, step, done, fn) {
        const stepFn = () => {
            if (!done(from, to)) {
                fn(from += step).then(() => {
                    setTimeout(stepFn, 1)
                });
            }
        };
        stepFn();
    }

    render() {
        return (
            <ReflexElement className="ctrl-pane" size={this.state.size} {...this.props}>
                <div>
                    <div className="ctrl-pane-header">
                        <button onClick={this.onMaximizeClicked}>
                            <label> + </label>
                        </button>
                        <button onClick={this.onMinimizeClicked}>
                            <label> - </label>
                        </button>
                    </div>
                    <div className="ctrl-pane-content">
                        {this.props.children}
                    </div>
                </div>
            </ReflexElement>
        )
    }
}

export default class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            pane1: {
                name: '命令文件',
                direction: 1,
                id: 'mid-top-panel',
                minSize: 25
            },
            pane2: {
                name: '命令行',
                direction: -1,
                id: 'mid-bot-panel',
                minSize: 25
            }
        }
    }

    render() {
        return (
            <div style={{ height: '100vh', width: '100vw' }}>
                <ReflexContainer orientation="horizontal">

                    <ReflexElement className="header-pane" size={50}>
                        <div className="header-pane-content">
                            Header Pane (fixed)
                        </div>
                    </ReflexElement>

                    <ReflexElement className="body-pane">
                        <ReflexContainer orientation="vertical">

                            <ReflexElement className="left-sidebar-pane" size={64}>
                                <SideBar />
                            </ReflexElement>

                            <ReflexElement className="left-pane" flex={0.08} maxSize={380} minSize={250}>
                                <div style={{ height:'100%', width: '100%' }}>
                                    <SideBarPane style={{ height:'100%', width: '100%' }} />
                                </div>
                            </ReflexElement>

                            <ReflexSplitter propagate={true}/>

                            <ReflexElement className="mid-pane" minSize={200}>
                                <ReflexContainer orientation="horizontal">

                                    <ControlledElement {...this.state.pane1}>
                                        <div className="mid-top-pane-content">
                                            Mid Top Pane (resizable)
                                        </div>
                                    </ControlledElement>

                                    <ReflexSplitter propagate={true}/>

                                    <ControlledElement {...this.state.pane2}>
                                        <div className="mid-bot-pane-content">
                                            Mid Bot Pane (resizable)
                                        </div>
                                    </ControlledElement>
                                </ReflexContainer>
                            </ReflexElement>

                            <ReflexSplitter propagate={true}/>

                            <ReflexElement className="right-pane" minSize={200}>
                                <div className="right-pane-content">
                                    Right Pane (resizable)
                                </div>
                            </ReflexElement>

                        </ReflexContainer>
                    </ReflexElement>

                    <ReflexElement className="footer-pane" size={30}>
                        <div className="footer-pane-content">
                            Footer Pane (fixed)
                        </div>
                    </ReflexElement>

                </ReflexContainer>
            </div>
        )
    }
}