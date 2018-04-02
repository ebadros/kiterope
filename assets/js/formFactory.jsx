var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import autobind from 'class-autobind'
import DatePicker  from 'react-datepicker';
import moment from 'moment';
import Pagination from "react-js-pagination";
import Select from 'react-select'
import TinyMCE from 'react-tinymce';
import TinyMCEInput from 'react-tinymce-input';
import CurrencyInput from 'react-currency-input';
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router';
import { Textfit } from 'react-textfit';
import ShowMore from 'react-show-more';
import ScrollArea from 'react-scrollbar'
import Rnd from 'react-rnd';
var Modal = require('react-modal');
var Datetime = require('react-datetime');
import Dropzone from 'react-dropzone';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'
var BigCalendar = require('react-big-calendar');
var classNames = require('classnames');
import validator from 'validator';
require('react-datepicker/dist/react-datepicker.css');
import 'react-select/dist/react-select.css';
var MaskedInput = require('react-maskedinput');
import {convertDate, convertFromDateString, daysBetweenDates, daysBetween} from './dateConverter'
import {SaveButton} from './settings'
import {ImageUploader,  NewImageUploader, PlanForm2, ViewEditDeleteItem, StepViewEditDeleteItem, PlanViewEditDeleteItem, FormAction, Sidebar, Header, FormHeaderWithActionButton, DetailPage} from './base';
import { Menubar, StandardSetOfComponents, ErrorReporter } from './accounts'
import { ValidatedInput } from './app'
import { IconLabelCombo, ClippedImage, ContextualMenuItem, ChoiceModal, ChoiceModalButtonsList } from './elements'
import { makeEditable,  ProgramCalendar } from './calendar'
import { UpdatesList, UpdateModalForm } from './update'


import { defaultStepCroppableImage, TINYMCE_CONFIG, theServer, s3IconUrl, s3BaseUrl, stepModalStyle, updateModalStyle, customStepModalStyles, formats, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, times, durations, stepTypeOptions, } from './constants'
import Measure from 'react-measure'
BigCalendar.momentLocalizer(moment);

import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'
import { Provider, connect, dispatch } from 'react-redux'
import  {store} from "./redux/store";
import { mapStateToProps, mapDispatchToProps } from './redux/containers2'
import { addStep, deleteStep, clearTempStep, addUpdate, updateStep, setUpdateModalData, setStepModalData, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, setContacts, setStepOccurrences } from './redux/actions'


$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Connection', 'keep-alive');
        xhr.setRequestHeader('Authorization', 'Token ' + localStorage.token);

    }
});

const testForm = {
    formName: "theFormName",
    formFields: {
        title: {
            fieldType: ValidatedInput,
            fieldValidation: '"!isEmpty(str)"',
        },
        deadline: {
            fieldType: DateInput,
            fieldValidation: '"!isEmpty(str)"',
        },
        description: {
            fieldType: TinyMCEInput,
            fieldValidation: '"!isEmpty(str)"',
        },
        metric: {
            fieldType: KSSelect,
            fieldValidation: '"!isEmpty(str)"',
            options:
        },
        why: {
            fieldType: TinyMCEInput,
            fieldValidation: '"!isEmpty(str)"',
        },
        obstacles: {
            fieldType: TinyMCEInput,
            fieldValidation: '"!isEmpty(str)"',
        },
        croppableImage: {
            fieldType: NewImageUploader,
            fieldValidation: '"!isEmpty(str)"',
        },
        coreValues: {
            fieldType: TinyMCEInput,
            fieldValidation: '"!isEmpty(str)"',
        },
        image: {},


        viewableBy: viewableBy,
        coaches: [],
        updates: [],
        wasAchieved: false,
        plans: []

    },
    order: []
    formSubmissionUrl: "api/newForm/"
}


export class FormFactory extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:{},
            programId:"",
            activePage:1,
        }
    }

    componentDidMount() {

    }

}