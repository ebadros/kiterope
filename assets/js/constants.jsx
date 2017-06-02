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
import BigCalendar from 'react-big-calendar';
var classNames = require('classnames');
import validator from 'validator';
require('react-datepicker/dist/react-datepicker.css');
import 'react-select/dist/react-select.css';

import {ImageUploader,PlanForm2,ViewEditDeleteItem, StepViewEditDeleteItem, PlanViewEditDeleteItem, FormAction, Sidebar, Header, FormHeaderWithActionButton, DetailPage} from './base';
import { PlanHeader, StepList , SimpleStepForm} from './step';
import { Menubar, StandardSetOfComponents, ErrorReporter } from './accounts'
import { ValidatedInput } from './app'
import { IconLabelCombo, ClippedImage, ContextualMenuItem, ChoiceModal, ChoiceModalButtonsList } from './elements'
import { makeEditable, StepCalendarComponent, StepEditCalendarComponent } from './calendar'
var UpdatesList = require('./update');

export const elasticSearchDomain = "https://search-kiterope-es-ghpxj2v7tzo6yzryzyfiyeof4i.us-west-1.es.amazonaws.com/"
export const theServer = 'http://127.0.0.1:8000/';
export const s3IconUrl = "https://kiterope.s3.amazonaws.com:443/icons/";
export const s3ImageUrl = "https://kiterope.s3.amazonaws.com:443/";


export const TINYMCE_CONFIG = {
  'language'  : 'en',
  'theme'     : 'modern',
  'toolbar'   : 'bold italic underline strikethrough hr | bullist numlist | link unlink | undo redo | spellchecker code',
  'menubar'   : true,
  'statusbar' : true,
  'resize'    : true,
  'plugins'   : 'emoticons template paste textcolor colorpicker textpattern imagetools codesample insertdatetime media nonbreaking save table contextmenu directionality advlist autolink lists link image charmap print preview hr anchor pagebreak searchreplace wordcount visualblocks visualchars code fullscreen',
  'toolbar1'  : 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image',
  'toolbar2'  : 'print preview media | forecolor backcolor emoticons | codesample ',
  'image_advtab': true,
    'theme_modern_toolbar_location' : 'top',
  'theme_modern_toolbar_align': 'left'
};

export const durations = [
    {value:'1', label: "1 minute"},
    {value:'2', label: "2 minutes"},
    {value:'3', label: "3 minutes"},
    {value:'4', label: "4 minutes"},
    {value:'5', label: "5 minutes"},
    {value:'6', label: "6 minutes"},
    {value:'7', label: "7 minutes"},
    {value:'8', label: "8 minutes"},
    {value:'9', label: "9 minutes"},
    {value:'10', label: "10 minutes"},
    {value:'15', label: "15 minutes"},
    {value:'20', label: "20 minutes"},
    {value:'30', label: "30 minutes"},
    {value:'45', label: "45 minutes"},
    {value:'60', label: "1 hour"},
    {value:'90', label: "1.5 hours"},
    {value:'120', label: "2 hours"},
    {value:'150', label: "2.5 hours"},
    {value:'180', label: "3 hours"},
    ]

export const times = [
    {value:'12:00', label: "12:00 am"},
    {value:'12:30', label: "12:30 am"},
    {value:'01:00', label: "1:00 am"},
    {value:'01:30', label: "1:30 am"},
    {value:'02:00', label: "2:00 am"},
    {value:'02:30', label: "2:30 am"},
    {value:'03:00', label: "3:00 am"},
    {value:'03:30', label: "3:30 am"},
    {value:'04:00', label: "4:00 am"},
    {value:'04:30', label: "4:30 am"},
    {value:'05:00', label: "5:00 am"},
    {value:'05:30', label: "5:30 am"},
    {value:'06:00', label: "6:00 am"},
    {value:'06:30', label: "6:30 am"},
    {value:'07:00', label: "7:00 am"},
    {value:'07:30', label: "7:30 am"},
    {value:'08:00', label: "8:00 am"},
    {value:'08:30', label: "8:30 am"},
    {value:'09:00', label: "9:00 am"},
    {value:'09:30', label: "9:30 am"},
    {value:'10:00', label: "10:00 am"},
    {value:'10:30', label: "10:30 am"},
    {value:'11:00', label: "11:00 am"},
    {value:'11:30', label: "11:30 am"},
    {value:'12:00', label: "12:00 pm"},
    {value:'12:30', label: "12:30 pm"},
    {value:'13:00', label: "1:00 pm"},
    {value:'13:30', label: "1:30 pm"},
    {value:'14:00', label: "2:00 pm"},
    {value:'14:30', label: "2:30 pm"},
    {value:'15:00', label: "3:00 pm"},
    {value:'15:30', label: "3:30 pm"},
    {value:'16:00', label: "4:00 pm"},
    {value:'16:30', label: "4:30 pm"},
    {value:'17:00', label: "5:00 pm"},
    {value:'17:30', label: "5:30 pm"},
    {value:'18:00', label: "6:00 pm"},
    {value:'18:30', label: "6:30 pm"},
    {value:'19:00', label: "7:00 pm"},
    {value:'19:30', label: "7:30 pm"},
    {value:'20:00', label: "8:00 pm"},
    {value:'20:30', label: "8:30 pm"},
    {value:'21:00', label: "9:00 pm"},
    {value:'21:30', label: "9:30 pm"},
    {value:'22:00', label: "10:00 pm"},
    {value:'22:30', label: "10:30 pm"},
    {value:'23:00', label: "11:00 pm"},
    {value:'23:30', label: "11:30 pm"},
    ]


export const customModalStyles = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)'
  },

  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    transform             : 'translate(-50%, -50%)',
      overflow                   : 'hidden',

    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '10px 10px 30px 10px',
  }
};




export const frequencyOptions = [
     {value:'ONCE', label: "Don't repeat"},
    {value:'DAILY', label: "Daily"},
    {value:'WEEKLY', label: "Weekly"},
    {value:'MONTHLY', label: "Monthly"}]

export const programScheduleLengths = [
    {value:'1w', label: "1 week"},
    {value:'2w', label: "2 weeks"},
    {value:'3w', label: "3 weeks"},
    {value:'1m', label: "1 month"},
    {value:'6w', label: "6 weeks"},
    {value:'2m', label: "2 months"},
    {value:'10w', label: "10 weeks"},
    {value:'3m', label: "3 months"},
    {value:'4m', label: "4 months"},
    {value:'5m', label: "5 months"},
    {value:'6m', label: "6 months"},
    {value:'7m', label: "7 months"},
    {value:'8m', label: "8 months"},
    {value:'9m', label: "9 months"},
    {value:'10m', label: "10 months"},
    {value:'11m', label: "11 months"},
    {value:'1y', label: "1 year"}]

export const timeCommitmentOptions = [
    {value:'10m', label: "10 minutes a day"},
    {value:'20m', label: "20 minutes a day"},
    {value:'30m', label: "30 minutes a day"},
    {value:'40m', label: "40 minutes a day"},
    {value:'50m', label: "50 minutes a day"},

    {value:'1h', label: "1 hour a day"},
    {value:'2h', label: "2 hours a day"},
    {value:'3h', label: "3 hours a day"},
    {value:'4h', label: "4 hours a day"},
    {value:'5h', label: "5 hours a day"},
    {value:'8h', label: "8 hours a day"}]

export const costFrequencyMetricOptions = [
    {value:'MONTH', label: "Per Month"},
    {value:'WEEK', label: "Per Week"},
    {value:'ONE_TIME', label: "One Time"}]

export const viewableByOptions = [
    {value:'ONLY_ME', label: "Only me"},
    {value:'ONLY_CLIENTS', label: "Only my clients"},
    {value:'ANYONE', label: "Anyone"}]

export const userSharingOptions = [
    {value:'ONLY_ME', label: "Only me"},
    {value:'ONLY_COACHES', label: "Only coaches"},
    {value:'SHARED_WITH', label: "People I've shared with specifically"},
    {value:'ANYONE', label: "Anyone"}]

export const notificationSendMethodOptions = [
    {value:'EMAIL_AND_TEXT', label: "Email and Text"},
    {value:'EMAIL', label: "Email Only"},
    {value:'TEXT', label: "Text Only"},
    {value:'NO_NOTIFICATIONS', label: "I don't want any notifications"}
]

export const metricFormatOptions = [

    {value: "text", label: "text"},
    {value: "decimal", label: "decimal"},
    {value: "integer", label: "whole number"},
    {value: "time", label: "time"},
    {value: "url", label: "url"},
    {value: "picture", label: "picture"},
    {value: "video", label: "video"},
    {value: "audio", label: "audio"},
]

export const formats = {
  dateFormat: 'DD',

    dayFormat:'ddd MM/DD'


}

export const customStepModalStyles = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)'
  },

  content : {
    top                   : '15%',
    left                  : '10%',
    right                 : '10%',
    bottom                : '10%',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '40px',
      paddingTop                :'10px',
  }
};

export const subscribeModalStyle = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)'
  },

  content : {
    top                   : '10%',
    left                  : '50%',
    right                 : '50%',
    bottom                : '5%',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '40px'
  }
};





module.exports = { React, ReactDOM, $, forms, ImageUploader, PlanForm2,
    PlanViewEditDeleteItem, FormAction, Sidebar, Header, FormHeaderWithActionButton, DetailPage,
    PlanHeader, StepList , SimpleStepForm,
    Router, Route, Link, browserHistory, hashHistory, Modal, ChoiceModal,
    Menubar, StandardSetOfComponents, ErrorReporter, autobind, customModalStyles,
    ValidatedInput, DatePicker, moment, Pagination, Select, TinyMCE, TinyMCEInput,
    CurrencyInput, IconLabelCombo, ClippedImage, Textfit, ShowMore, ScrollArea, theServer,
    s3IconUrl, s3ImageUrl, Rnd, ContextualMenuItem, ChoiceModalButtonsList,
    frequencyOptions, programScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, viewableByOptions, formats, customStepModalStyles,
    Datetime, Dropzone, DropzoneS3Uploader, BigCalendar, ViewEditDeleteItem, StepViewEditDeleteItem,
    TINYMCE_CONFIG, times, durations, userSharingOptions, notificationSendMethodOptions,metricFormatOptions, elasticSearchDomain }