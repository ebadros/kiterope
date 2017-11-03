import React from 'react';
import ReactDOM from 'react-dom';
var $  = require('jquery');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'

//import Datepicker from './Datepicker';
var Datetime = require('react-datetime');

import DatePicker  from 'react-datepicker';
import moment from 'moment';
var TinyMCE = require('react-tinymce-input');
var MaskedInput = require('react-maskedinput');
import autobind from 'class-autobind'
var validator = require('validator');
import TimePicker from 'rc-time-picker';
import DynamicSelectButton2 from './base'
var Select = require('react-select');
import  { ValidatedInput } from './app'
var auth = require('./auth');
var Modal = require('react-modal');
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'



import onClickOutside  from 'react-onclickoutside';
import { setCurrentUser, reduxLogout, showSidebar } from './redux/actions'
import { Provider, connect, dispatch } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './redux/containers'
import  {store} from "./redux/store";

@connect(mapStateToProps, mapDispatchToProps)
export class SidebarWithoutClickingOutside extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            visible: false,
            user:"",
            view: "User View"


        };
                this.timer = setTimeout(() => this.setState({ zIndex: 2000 }), 6000);

    }

    clickDocument (e) {
        var component = ReactDOM.findDOMNode(this.refs.ref_sidebar);
        if (e.target == component || $(component).has(e.target).length ) {
            // Inside of the component.
        } else {
                //store.dispatch(showSidebar(false))


            // Outside of the component.
        }

    }

    componentWillUnmount() {
        //$(document).unbind('click', this.clickDocument);
    }

    handleClickOutside = (e) => {

        store.dispatch(showSidebar(false));


        {/*this.props.sidebarVisibilityChange({
            sidebarVisibility:false

        })
        this.setState({
            visible:false,
        }) */}
  };

  handleClose() {
      store.dispatch(showSidebar(false))

  }
  componentWillUnmount() {
      clearTimeout(this.timer)
  }

    componentDidMount () {


             //$(document).bind('click', this.clickDocument);

        if (this.props.storeRoot.gui != undefined) {
            if (this.props.storeRoot.gui.isSidebarVisible) {
               $(this.refs["ref_sidebar"]).show()
            } else {
                $(this.refs["ref_sidebar"]).hide()
            }

            this.setState({
                visible: this.props.storeRoot.gui.isSidebarVisible
            });



            //
        } else {
            $(this.refs["ref_sidebar"]).hide()

        }

        this.setState({
            user: this.props.user,
        })


    }
    componentWillReceiveProps (nextProps) {

        if (this.state.visible != nextProps.storeRoot.gui.isSidebarVisible) {
            this.setState({
                visible: nextProps.storeRoot.gui.isSidebarVisible
            })
        }
        if (this.state.user != nextProps.user) {
            this.setState({
                user: nextProps.user,
            })
        }

    }

    handleLogout() {
        store.dispatch(reduxLogout());

        auth.logout();
                store.dispatch(push('/account/login/'))




    }

    switchView = () => {
        if (this.state.view == "Coach View") {
            this.setState({
                view: "User View"
            })
        } else {
            this.setState({
                view: "Coach View"
            })
        }
    };

    handleURLPush(theURL) {

        store.dispatch(push(theURL))
    }
    render() {
        var style = {
                zIndex: 2000,
                display:'none',

            };

        if (this.props.storeRoot.user != undefined) {
            var style = {
                zIndex: 2000,
            };

        }

        if (this.props.user != undefined) {
            if (this.props.user.isCoach) {
                var viewSwitcher = <a className="item" onClick={this.switchView}>
                    <i className="large street view icon"></i>
                    {this.state.view}
                </a>

            }
        }

         if ($(this.refs["ref_sidebar"]).is(":visible")) {
            if (!this.state.visible) {
                $(this.refs["ref_sidebar"]).hide("slide");


            }
        } else {

            if (this.state.visible) {
                $(this.refs["ref_sidebar"]).show("slide");


            }
        }


        if (this.props.user != undefined) {
            if ((this.props.user.isCoach) && (this.state.view == "User View")) {
                return (
                    <div ref="ref_sidebar"
                         className="ui right vertical inverted labeled visible icon large sidebar menu"
                         style={style}>
                        <a className="item"  style={style} onClick={this.handleClose}>
                            <i className="large close icon"></i>
                        </a>

                        <a className="item" style={style} onClick={() => this.handleURLPush('/')}>
                            <i className="large home icon"></i>
                            Home
                        </a>
                        {viewSwitcher}

                        <a className="item" style={style} onClick={() => this.handleURLPush('/programs/')}  >
                            <i className="large cubes icon"/>
                            My Programs
                        </a>
                        <a className="item" style={style} onClick={() => this.handleURLPush('/contacts/')} >
                            <i className="large users icon"/>
                            My Contacts
                        </a>

                                { this.props.user ?
                                    <a className="item" style={style} onClick={() => this.handleURLPush(`/profiles/${this.props.user.profileId}`)}  >
                                        <i className="large user icon"/>
                                        My Profile
                                    </a> : <div></div>}


                        <a className="item"  style={style} onClick={() => this.handleURLPush('/search/')}>
                            <i className="large search icon"/>
                            Search
                        </a>


                        {/*<a className="item" style={style}onClick={() => this.handleURLPush('/messages/')}>
                            <i className="large mail icon"/>
                            Messages
                        </a>*/}
                        <a className="item" style={style} onClick={() => this.handleURLPush('/settings/')}>
                            <i className="large settings icon"/>
                            Settings
                        </a>
                        <a className="item" style={style} onClick={() => this.handleURLPush('/blog/')}>
                            <i className="large heartbeat icon"/>
                            Blog
                        </a>


                    </div>
                )
            }
            else return (
                <div ref="ref_sidebar" className="ui right vertical inverted labeled visible icon large sidebar menu"
                     style={style}>
<a className="item"  style={style} onClick={this.handleClose}>
                            <i className="large close icon"></i>
                        </a>

                    <a className="item"  style={style} onClick={() => this.handleURLPush('/')}>
                        <i className="large home icon"></i>
                        Home
                    </a>
                    {viewSwitcher}

                    <a className="item" style={style} onClick={() => this.handleURLPush('/goals/')}>
                        <i className="large block layout icon"/>
                        My Goals
                    </a>
                    <a className="item" style={style} onClick={() => this.handleURLPush('/contacts/')}>
                        <i className="large users icon"/>
                        My Contacts
                    </a>
                    { this.props.user ? <a className="item" style={style} onClick={() => this.handleURLPush(`/profiles/${this.props.user.profileId}`)} >
                        <i className="large user icon"/>
                        My Profile
                    </a> : <div></div>}

                    <a className="item" style={style} onClick={() => this.handleURLPush('/search')}>
                        <i className="large search icon"/>
                        Search
                    </a>


                    {/*<a className="item" style={style} onClick={() => this.handleURLPush('/messages')}>
                        <i className="large mail icon"/>
                        Messages
                    </a>*/}
                    <a className="item" style={style} onClick={() => this.handleURLPush('/settings/')}>
                        <i className="large settings icon"/>
                        Settings
                    </a>
                    <a className="item" style={style} onClick={() => this.handleURLPush('/blog')}>
                            <i className="large heartbeat icon"/>
                            Blog
                        </a>


                </div>

            )

        } else {
            return <div></div>
        }
    }


}
//const Sidebar = SidebarWithoutClickingOutside;


export const Sidebar = SidebarWithoutClickingOutside;

module.exports = { Sidebar, SidebarWithoutClickingOutside };