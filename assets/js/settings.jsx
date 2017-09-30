var React = require('react');
let ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {FormAction, Sidebar } from './base'
var Datetime = require('react-datetime');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
var MaskedInput = require('react-maskedinput');
var classNames = require('classnames');
import validator from 'validator';
var UpdatesList = require('./update');
var Modal = require('react-modal');
var DatePicker = require('react-datepicker');
var moment = require('moment');
import { MessageWindowContainer } from './message'
require('react-datepicker/dist/react-datepicker.css');
import TinyMCE from 'react-tinymce';
import { ValidatedInput, KSSelect } from './app'
import autobind from 'class-autobind'
import { ClippedImage, ChoiceModal , IconLabelCombo } from './elements'
import { ImageUploader, Header, Breadcrumb, FormHeaderWithActionButton, ProfileViewEditDeleteItem, } from './base'
import { StandardSetOfComponents, ErrorReporter, Menubar, Footer } from './accounts'
import Phone from 'react-phone-number-input'
import rrui from 'react-phone-number-input/rrui.css'
import rpni from 'react-phone-number-input/style.css'

import { PlanForm, PlanList } from './plan'
import { Caller, CallManager } from './call'
import TinyMCEInput from 'react-tinymce-input';

import { theServer, times, s3IconUrl, formats, s3BaseUrl, programCategoryOptions, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, programScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, viewableByOptions, subscribeModalStyle, customStepModalStyles, notificationSendMethodOptions, TINYMCE_CONFIG } from './constants'


import { OTSession, OTPublisher, OTStreams, OTSubscriber, createSession } from 'opentok-react';

import { Provider, connect, dispatch } from 'react-redux'

import  {store} from "./redux/store";

import { mapStateToProps, mapDispatchToProps } from './redux/containers'

import { setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, setContacts, setStepOccurrences } from './redux/actions'
import Measure from 'react-measure'
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'


export class SettingsPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            signInOrSignUpModalFormIsOpen: false,
        }
    }



    render() {

    return (

<div>               <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen} />





        <div className="fullPageDiv">
            <div className="ui page container footerAtBottom">


            <div className="spacer">&nbsp;</div>
            <div className="ui large breadcrumb">
                <Link to={`/`}><div className="section">Home</div></Link>

                  <i className="right chevron icon divider"></i>
                  <Link to={`/settings/`}><div className="active section">Settings</div></Link>
            </div>
            <div>&nbsp;</div>
                        <Header headerLabel="Settings"/>
                <div className="ui grid">


                <div className="ui form">
            <SettingsForm  cancelClicked={this.handleCancelClicked} onSubmit={this.handleProfileSubmit} serverErrors={this.state.serverErrors} />
                            </div>
                    </div>
<div className="spacer">&nbsp;</div>

</div></div><Footer /></div>
    );
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export class SettingsForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            id:"",
            defaultNotificationPhone:"",
            defaultNotificationEmail:"",
            defaultNotificationMethod:"",
            defaultNotificationSendTime:"",
            saved: "Saved",

        }
    }


    componentDidMount () {
        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.settings != undefined) {
                this.setState({
                        id: this.props.storeRoot.settings.id,
                        defaultNotificationPhone: this.props.storeRoot.settings.defaultNotificationPhone,
                        defaultNotificationEmail: this.props.storeRoot.settings.defaultNotificationEmail,
                        defaultNotificationMethod: this.props.storeRoot.settings.defaultNotificationMethod,
                        defaultNotificationSendTime: this.props.storeRoot.settings.defaultNotificationSendTime,
                    }
                )
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.storeRoot != undefined) {
            if (this.props.storeRoot.settings != undefined) {

                this.setState({
                    id: nextProps.storeRoot.settings.id,
                    defaultNotificationPhone: nextProps.storeRoot.settings.defaultNotificationPhone,
                    defaultNotificationEmail: nextProps.storeRoot.settings.defaultNotificationEmail,
                    defaultNotificationMethod: nextProps.storeRoot.settings.defaultNotificationMethod,
                    defaultNotificationSendTime: nextProps.storeRoot.settings.defaultNotificationSendTime,

                })
            }
        }




        if (this.state.serverErrors != nextProps.serverErrors) {
            this.setState({
                serverErrors:nextProps.serverErrors
            })
        }
        if (nextProps.storeRoot) {
            if (nextProps.storeRoot.user != this.state.user) {
                this.setState({
                    user: nextProps.storeRoot.user
                })
            }
        }

    }

    handleProfileSubmit (profile, callback) {

            var theURL =  "/api/settings/me/";
             $.ajax({
                 url: theURL ,
                 dataType: 'json',
                 type: 'PUT',
                 data: profile,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {

                     this.setState({
                         data: data,
                         saved: "Saved"

                     });


                     callback



                 }.bind(this),
                 error: function (xhr, status, err) {
                     this.setState({
                         saved:"Save"
                     });
                                                   console.log("error");

                     console.error(theURL, status, err.toString());
                     var serverErrors = xhr.responseJSON;
            this.setState({
                serverErrors:serverErrors,
            })

                 }.bind(this),
                 complete: function (jqXHR, textStatus){

            }.bind(this)
             });
         }





    getDescriptionEditor () {
         if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if ((this.props.isListNode) || (forMobile)) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";

           } else {


            var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }
                if (this.state.bio == null) {
                    return ("")
                } else {
                    return (<div className="ui row">
                        <div className={wideColumnWidth}>
                            <div className="field fluid">
                                <label htmlFor="id_description">Bio:</label>
                                <TinyMCEInput name="bio"
                                         value={this.state.bio}
                                         config={{
          plugins: 'link image code media',
          menubar: "insert",
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | media'
        }}
                                         onChange={this.handleEditorChange}
                                />


                            </div>
                        </div>
                        <div className="six wide column">&nbsp;</div>

                    </div>)
                }
            }











    handleCancelClicked() {
        this.props.cancelClicked()
    }




    getServerErrors(fieldName) {
        if (this.state.serverErrors == undefined) {
            return ""
        } else {
            return this.state.serverErrors[fieldName]
        }
    }

    handleSubmit() {
        this.setState({
            saved: "Saving"
        });

        if (this.props.storeRoot.user) {

        var id = this.state.id;
        var defaultNotificationPhone = this.state.defaultNotificationPhone;
        var defaultNotificationEmail = this.state.defaultNotificationEmail;
        var defaultNotificationMethod = this.state.defaultNotificationMethod;
        var defaultNotificationSendTime = this.state.defaultNotificationSendTime;



        this.handleProfileSubmit({
            id: id,
            defaultNotificationPhone: defaultNotificationPhone,
            defaultNotificationEmail: defaultNotificationEmail,
            defaultNotificationMethod: defaultNotificationMethod,
            defaultNotificationSendTime: defaultNotificationSendTime,



        }, )




        }
    else {
            this.setState({
                    signInOrSignUpModalFormIsOpen: true,
                }
            )

            }
        }

        handleDefaultNotificationMethodChange(option){
        this.setState({defaultNotificationMethod: option.value,
                    saved: "Save"
});
    }

    handleDefaultNotificationPhoneChange(value){
        this.setState({
            defaultNotificationPhone: value,
            saved: "Save"
        });
    }

    handleDefaultNotificationEmailChange(value){
        this.setState({
            defaultNotificationEmail: value,
                    saved: "Save"
});
    }

    handleDefaultNotificationSendTimeChange(option){
        this.setState({defaultNotificationSendTime: option.value,
                    saved: "Save"
});
    }

    getServerErrors(fieldName) {
        if (this.state.serverErrors == undefined) {
            return ""
        } else {
            return this.state.serverErrors[fieldName]
        }
    }



        getForm = () => {
                var buttonText = "Save";



            if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if ((this.props.isListNode) || (forMobile)) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";

           } else {


            var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }
          return (
              <div className="ui page container">
                                        <div className="ui grid">
                                            <div className={wideColumnWidth}>

                    <h3 className="ui dividing header">Notifications</h3></div>

                  <div>{this.props.planHeaderErrors}</div>


<div className="ui row">
                        <div className={mediumColumnWidth}>

                <div className="fluid field">
                <KSSelect value={this.state.defaultNotificationMethod}
                                            valueChange={this.handleDefaultNotificationMethodChange}
                                            label="How would you like your notifications sent?"
                                            isClearable={false}
                                            name="notificationSendMethod"
                                            options={notificationSendMethodOptions}
                                            />

                    </div></div>
                    </div>


                                { this.state.defaultNotificationMethod.includes("EMAIL") ?

                <div className="ui row">
                            <div className={mediumColumnWidth}>
                <ValidatedInput
                                      type="text"
                                      name="title"
                                      label="At what email would you like to receive notifications?"
                                      id="id_title"
                                      placeholder="Email Address"
                                      value={this.state.defaultNotificationEmail}
                                      initialValue={this.state.defaultNotificationEmail}
                                      validators='"!isEmpty(str)"'
                                      onChange={this.validate}
                                      stateCallback={this.handleDefaultNotificationEmailChange}
                                      serverErrors={this.getServerErrors("defaultNotificationEmail")}

                                  />
                                </div>
                    </div>:<div></div>}

                                                { this.state.defaultNotificationMethod.includes("TEXT")  ?

                                <div className="ui row">
                            <div className={mediumColumnWidth}>
                                                <div className="fluid field">

                <Phone placeholder="At what mobile phone number would like to receive notification texts?"
                       value={ this.state.defaultNotificationPhone }
                       onChange={this.handleDefaultNotificationPhoneChange} />
                                </div>
                                    </div></div>:<div></div>}
                                            { this.state.defaultNotificationMethod.includes("NO") || this.state.defaultNotificationMethod == "" ? <div></div>:

                <div className="ui row">
                        <div className={mediumColumnWidth}>

                <div className="fluid field">
                <KSSelect value={this.state.defaultNotificationSendTime}
                                            valueChange={this.handleDefaultNotificationSendTimeChange}
                                            label="At what time would you like your notifications sent?"
                                            isClearable={false}
                                            name="notificationSendTime"
                                            options={times}
                                            />

                    </div></div>
                    </div>}
                                        </div>






                      <div className="ui three column stackable grid">
                          <div className="column">&nbsp;</div>
                          <div className="column">
                              <div className="ui large fluid button" onClick={this.handleCancelClicked}>Cancel</div>
                          </div>
                          <div className="column">
                              <SaveButton saved={this.state.saved} clicked={this.handleSubmit} />
                          </div>
                      </div>

              </div>
          )

    };





    render() {
    var theForm = this.getForm();

            return(

                <div >
                    <form className="ui form" onSubmit={this.handleSubmit}>
                        {theForm}
                    </form>
                </div>

            )
        }



}

export class SaveButton extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            saved:"Saved"

        }
    }

    componentWillMount() {
        this.setState({
            saved: this.props.saved
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.saved != nextProps.saved) {
            this.setState({
                saved:nextProps.saved
            })
        }
    }

    handleSubmit() {
        this.props.clicked()
    }

    render() {
        return (
            <div className={`ui large fluid ${ this.state.saved == "Saved" ? "grey": "blue"} ${ this.state.saved == "Saving" ? "loading": null} button`} onClick={this.handleSubmit}>{this.state.saved}</div>


        )
    }
}

module.exports = { SettingsPage, SettingsForm };