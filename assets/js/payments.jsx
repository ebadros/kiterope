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
import { KRInput, KRSelect, KRRichText, KRCheckBox } from './inputElements'

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

import { mapStateToProps, mapDispatchToProps } from './redux/containers2'

import { setCurrentUser, reduxLogout, showSidebar, setOpenThreads, submitEvent, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, setContacts, setStepOccurrences } from './redux/actions'
import Measure from 'react-measure'
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'
import {StripeProvider} from 'react-stripe-elements';
import SubscriptionForm from './stripe/SubscriptionForm'

@connect(mapStateToProps, mapDispatchToProps)
export class PaymentSourceEditor extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            id: "",
            saved: "Saved",
            stripeSourceId: ""

        }
    }

    componentDidMount() {
        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.profile != undefined) {
                this.setState({stripeSourceId: this.props.storeRoot.profile.stripeSourceId})
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.storeRoot != undefined) {

            if (nextProps.storeRoot.profile != undefined) {
                this.setState({stripeSourceId: nextProps.storeRoot.profile.stripeSourceId})
            }

        }


        if (this.state.serverErrors != nextProps.serverErrors) {
            this.setState({
                serverErrors: nextProps.serverErrors
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

    getServerErrors(fieldName) {
        if (this.state.serverErrors == undefined) {
            return ""
        } else {
            return this.state.serverErrors[fieldName]
        }
    }

    handleAddCardClicked() {
        store.dispatch(submitEvent("addOrUpdateCard"))
    }

    handleDeleteCardClicked() {
        store.dispatch(submitEvent("deleteCard"))
    }

    getAddCardSection() {
        return (<div>
             <div className="ui row">

                    <div className="sixteen wide column">
                        <h3 className="ui dividing header">Payment Information</h3></div>
                </div>
                            <div className="ui three column stackable bottom aligned grid">

            <div className="ui row">


                                <div className="column">
                                    <img width="50%" src={`${s3IconUrl}creditCard_notVerified.svg`} />
</div>
                            <div className="column"> </div>

                                <div className="column">
                                    <div className="ui medium fluid blue button" onClick={this.handleAddCardClicked}>Add
                                        Card
                                    </div>
                                </div>
                        </div>
            </div>
            </div>
        )
    }

    getEditDeleteCardSection () {



        return(
            <div>
                             <div className="ui row">


                    <div className="sixteen wide column">
                        <h3 className="ui dividing header">Payment Information</h3>
                    </div>
                            <div className="ui three column stackable bottom aligned grid">

            <div className="ui  row">

                                <div className="column"><img width="50%" src={`${s3IconUrl}creditCard_Verified.svg`} /></div>
                                <div className="column">
                                    <div className="ui medium fluid  button"
                                         onClick={this.handleDeleteCardClicked}>Delete Card
                                    </div>

                                </div>

                                                                    <div className="column">
<div className="ui medium fluid button" onClick={this.handleAddCardClicked}>Update
                                        Card
                                    </div>

                                                                        </div>
                        </div>
                                </div>
                </div>
                </div>
        )
    }




    render = () => {
        var buttonText = "Save";
        var addCardSection = this.getAddCardSection()
        var editDeleteCardSection = this.getEditDeleteCardSection()


        if (this.props.storeRoot != undefined) {
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
             <div>

                {this.state.stripeSourceId == "" || this.state.stripeSourceId == undefined ? addCardSection:null}

                {this.props.hideIfVerified == false && this.state.stripeSourceId != "" && this.state.stripeSourceId != undefined ?
                    editDeleteCardSection: null }




                        <div className={wideColumnWidth}>
                        <h3 className="ui dividing header">&nbsp;</h3></div>

                <StripeProvider apiKey="pk_test_PvGr7zfPVvMOFtDo1Kbk4fTo">
                    <SubscriptionForm />
                </StripeProvider>
            </div>
        )
    }
}

module.exports = {PaymentSourceEditor}