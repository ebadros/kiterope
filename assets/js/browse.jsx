var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {ImageUploader, Breadcrumb,  ProgramViewEditDeleteItem, FormAction, Sidebar, FormHeaderWithActionButton, DetailPage} from './base';
import {PlanHeader, StepList, ToggleButton, StepForm, SimpleStepForm} from './step';
import {ProgramCalendar } from './calendar'
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router';
import { Menubar, StandardSetOfComponents, ErrorReporter, Footer } from './accounts'
import autobind from 'class-autobind'
import {StandardSetOfComponentsContainer} from './redux/containers'
import Measure from 'react-measure'


import { ValidatedInput, KSSelect } from './app'
import DatePicker  from 'react-datepicker';
import moment from 'moment';
import Pagination from "react-js-pagination";
import Select from 'react-select'
import TinyMCEInput from 'react-tinymce-input';
import CurrencyInput from 'react-currency-input';
import { Test , IconLabelCombo , ItemMenu, ClippedImage, ChoiceModal, ChoiceModalButton, ContextualMenuItem, ChoiceModalButtonsList,  } from './elements'
import { Textfit } from 'react-textfit';
import ShowMore from 'react-show-more';
import Modal from 'react-modal';
import Phone from 'react-phone-number-input'
import rrui from 'react-phone-number-input/rrui.css'
import rpni from 'react-phone-number-input/style.css'



import { makeEditable, StepCalendarComponent, StepEditCalendarComponent,  } from './calendar'
import { MessageWindowContainer } from './message'

import { Provider, connect, dispatch } from 'react-redux'
import  {store} from "./redux/store";

import { mapStateToProps, mapDispatchToProps } from './redux/containers'

import { addPlan, removePlan, setPlan, addStep, deleteStep, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, setContacts, setStepOccurrences } from './redux/actions'

import { theServer, times, s3IconUrl, formats, s3ImageUrl, programCategoryOptions, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, programScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, viewableByOptions, customStepModalStyles, notificationSendMethodOptions, TINYMCE_CONFIG } from './constants'


export class BrowseProgramsPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: [],
            activePage:1,
            serverErrors:"",
            formIsOpen:false,
            headerActionButtonLabel:"Create Program"


        }
    }

    componentDidMount() {
        loadExistingPlansFromServer()
    }

    loadExistingPlansFromServer () {

    }

    render() {
        return (<div></div>

        )
    }
}

module.exports = { BrowseProgramsPage};