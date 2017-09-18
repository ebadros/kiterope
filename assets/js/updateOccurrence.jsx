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



import {ImageUploader,   VideoUploader, AudioUploader, ViewEditDeleteItem, StepViewEditDeleteItem, PlanViewEditDeleteItem, FormAction, Sidebar, Header, FormHeaderWithActionButton, DetailPage} from './base';
import { Menubar, StandardSetOfComponents, ErrorReporter } from './accounts'
import { ValidatedInput } from './app'
import { IconLabelCombo, ClippedImage, ContextualMenuItem, ChoiceModal, ChoiceModalButtonsList } from './elements'
import { makeEditable, StepCalendarComponent, StepEditCalendarComponent, ProgramCalendar } from './calendar'
import { UpdatesList } from './update'
import { Provider, connect, store, dispatch } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './redux/containers'


import { TINYMCE_CONFIG, theServer, s3IconUrl, formats, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, times, durations,  } from './constants'
import Measure from 'react-measure'
BigCalendar.momentLocalizer(moment);
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

function convertToDecimalIfAnInteger(value) {
    if (isAnInteger(value)) {
        return value.toFixed(1);
    } else {
        if (value != undefined) {
             return value;
        } else {
            return ""

        }
    }


}

function isAnInteger(value) {
    return /^\d+$/.test(value);
}

function addZero( num ) {
    var value = Number(num);
    var res = num.split(".");
    if(num.indexOf('.') === -1) {
        value = value.toFixed(1);
        num = value.toString();
    } else if (res[1].length < 2) {
        value = value.toFixed(1);
        num = value.toString();
    }
return num
}

function intToFloat(num, decPlaces) {
    return num + '.' + Array(decPlaces + 1).join('0');
}

export const blah = [

    {value: "text", label: "text"},
    {value: "decimal", label: "decimal"},
    {value: "integer", label: "whole number"},
    {value: "time", label: "time"},
    {value: "url", label: "url"},
    {value: "picture", label: "picture"},
    {value: "video", label: "video"},
    {value: "audio", label: "audio"},
];

export class UpdateOccurrenceList extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            id: "",
            measuringWhat: "",
            units: "",
            format: "",
            metricLabel: "",
            data:[],
            doneSaving:true

        }
    }

    componentDidMount () {
        this.setState({
            data: this.props.data,
            doneSaving:true


        })
    }

    componentWillReceiveProps (nextProps) {
        if (this.state.data != nextProps.data) {
             this.setState({
            data: nextProps.data,



        })

        }

        if (this.state.doneSaving != nextProps.doneSaving) {
            this.setState({doneSaving: nextProps.doneSaving})
        }
    }


    handleSubmit(updateOccurrenceData) {
        this.props.handleSubmit(updateOccurrenceData)
    }


    render() {
        var updateOccurrences = this.state.data.map((occurrence) => {
            return (
                <UpdateOccurrenceInput key={occurrence.id} data={occurrence} handleSubmit={this.handleSubmit} ref={instance => { this.child = instance; }}/>
            )
        });

        return (<div>
            <div>
                {updateOccurrences}</div>
            <div className="ui row">
                    {this.state.doneSaving ? <div className="ui fluid purple button" onClick={() => { this.child.handleSubmit(); }}>Save</div>:<div className="ui fluid purple loading button" ></div> }

                    </div>
            </div>
        )

    }

}

export class UpdateOccurrenceInput extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            id: "",
            measuringWhat: "",
            units: "",
            format: "",
            metricLabel: "",
            data:[],
            text: "",
            decimal: "",
            longText: "",
            integer: "",
            time: "",
            url: "",
            picture: "",
            video: "",
            audio: "",
            doneSaving:true,

        }
    }

    componentDidMount () {
        this.setState({
            data: this.props.data,
            id: this.props.data.id,
            measuringWhat: this.props.data.update.measuringWhat,
            units: this.props.data.update.units,
            format: this.props.data.update.format,
            metricLabel: this.props.data.update.metricLabel,
            text: this.props.data.text,
            decimal: convertToDecimalIfAnInteger(this.props.data.decimal),
            longText: this.props.data.longText,
            integer: this.props.data.integer,
            time: this.props.data.time,
            url: this.props.data.url,
            picture: this.props.data.picture,
            video: this.props.data.video,
            audio: this.props.data.audio,

        })

    }

    componentWillReceiveProps (nextProps) {
        if (this.state.data != nextProps.data) {
             this.setState({
            data: nextProps.data,
            id: nextProps.data.id,
            measuringWhat: nextProps.data.update.measuringWhat,
            units: nextProps.data.update.units,
            format: nextProps.data.update.format,
            metricLabel: nextProps.data.update.metricLabel,
                 text: nextProps.data.update.text,
            decimal: convertToDecimalIfAnInteger(nextProps.data.decimal),
            longText: nextProps.data.longText,
            integer: nextProps.data.integer,
            time: nextProps.data.time,
            url: nextProps.data.url,
            picture: nextProps.data.picture,
            video: nextProps.data.video,
            audio: nextProps.data.audio,

        })




        }


    }

    makeSureNoValuesAreNull() {
    if (this.state.id == undefined) {
        this.setState({
            id:""
        })
    }

    if (this.state.text == undefined) {
        this.setState({
            text:""
        })
    }

    if (this.state.decimal == undefined) {
        this.setState({
            decimal:""
        })
    }

    if (this.state.longText == undefined) {
        this.setState({
            longText:""
        })
    }

    if (this.state.integer == undefined) {
        this.setState({
            integer:""
        })
    }

    if (this.state.time == undefined) {
        this.setState({
            time:""
        })
    }

    if (this.state.url == undefined) {
        this.setState({
            url:""
        })
    }

    if (this.state.picture == undefined) {
        this.setState({
            picture:""
        })
    }

    if (this.state.video == undefined) {
        this.setState({
            video:""
        })
    }

    if (this.state.audio == undefined) {
        this.setState({
            audio:""
        })
    }
}



    handleTextChange(e) {
        this.setState({text: e});
    }
    getTextInput () {

        return (
            <div className="ui form row">
                <ValidatedInput
                                      type="textarea"
                                      name="text"
                                      label={this.state.metricLabel}
                                      placeholder=""
                                      value={this.state.text || ''}
                                      initialValue={this.state.text || ''}
                                      validators='"!isEmpty(str)"'
                                      onChange={this.validate}
                                      stateCallback={this.handleTextChange}

                                  />


            </div>
        )
    }

    handleDecimalChange(e) {
        this.setState({decimal: e});

    }

    getDecimalInput () {

        return (
            <div className="ui form  row">
                <ValidatedInput
                                      type="text"
                                      name="decimal"
                                      label={this.state.metricLabel}
                                      placeholder=""
                                      value={this.state.decimal || ''}
                                      initialValue={this.state.decimal || ''}
                                      validators='"!isEmpty(str)","isDecimal(str)"'
                                      onChange={this.validate}
                                      stateCallback={this.handleDecimalChange}

                                  />


            </div>
        )
    }

    handleIntegerChange(e) {
        this.setState({integer: e});
    }

    getIntegerInput () {

        return (
            <div className="ui form  row">
                <ValidatedInput
                                      type="text"
                                      name="integer"
                                      label={this.state.metricLabel}
                                      placeholder=""
                                      value={this.state.integer || ''}
                                      initialValue={this.state.integer || ''}
                                      validators='"!isEmpty(str)","isInt(str)"'
                                      onChange={this.validate}
                                      stateCallback={this.handleIntegerChange}

                                  />


            </div>
        )
    }

    handleUrlChange(e) {
        this.setState({url: e});
    }

    getUrlInput () {


        <div className="ui form  row">
                <ValidatedInput
                                      type="text"
                                      name="value"
                                      label={this.state.metricLabel}
                                      placeholder=""
                                      value={this.state.url || ''}
                                      initialValue={this.state.url || ''}
                                      validators='"!isEmpty(str)","isURL(str)"'
                                      onChange={this.validate}
                                      stateCallback={this.handleUrlChange}

                                  />


            </div>
    }

    getPictureInput () {
    }

    handleVideoChange = (callbackData) => {
        this.setState({
            video: callbackData.video
        })
    };

    handleAudioChange = (callbackData) => {
        this.setState({
            audio: callbackData.audio
        })
    };
//! Need to deal with the validators on this
    getVideoInput () {
        return(<div className="ui form">
            <div className="field"><label>{this.state.metricLabel}</label></div>

            <Measure onMeasure={(dimensions) => {
                this.setState({dimensions})
            }}>
        <div className="ui form  row">
                            <VideoUploader video={this.state.video} videoReturned={this.handleVideoChange} dimensions={this.state.dimensions} label="Drag and Drop or Click to Add Video" />


            </div></Measure></div>
        )
    }

    getAudioInput () {
        return(<div className="ui form">
            <div className="field"><label>{this.state.metricLabel}</label></div>

            <Measure onMeasure={(dimensions) => {
                this.setState({dimensions})
            }}>
        <div className="ui row">

                            <AudioUploader audio={this.state.audio} audioReturned={this.handleAudioChange} dimensions={this.state.dimensions} label="Drag and Drop or Click to Add Audio" />


            </div></Measure></div>
        )
    }

    handleSubmit() {
        var id = this.state.id;
        var text = this.state.text;
        var decimal = this.state.decimal;
        var longText = this.state.longText;
        var integer = this.state.integer;
        var time = this.state.time;
        var url = this.state.url;
        var picture = this.state.picture;
        var video = this.state.video;
        var audio = this.state.audio;

        var updateOccurrence = {
            id: id,
            text: text,
            decimal: decimal,
            longText: longText,
            integer: integer,
            time: time,
            url: url,
            picture: picture,
            video: video,
            audio: audio,
        };
        this.props.handleSubmit(updateOccurrence)

        }


    render() {

        switch (this.state.format) {
            case("text"):
                var inputHTML = this.getTextInput();
                break;
            case("decimal"):
                var inputHTML = this.getDecimalInput();
                break;
            case("integer"):
                var inputHTML = this.getIntegerInput();
                break;
            case("time"):
                var inputHTML = this.getTimeInput();
                break;
            case("url"):
                var inputHTML = this.getUrlInput();
                break;
            case("picture"):
                var inputHTML = this.getPictureInput();
                break;
            case("video"):
                var inputHTML = this.getVideoInput();
                break;
            case("audio"):
                var inputHTML = this.getAudioInput();
                break;
            default:
                var inputHTML = () => {return (<div></div>)};
                break;

        }
        return (
            <div>                <div className="ui row">&nbsp;</div>

        {inputHTML}
                                            <div className="ui row">&nbsp;</div>


            </div>
        )
    }



}

export class VideoOrAudioUploader extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {



        }
    }

    render() {
        return (
            <div></div>
        )
    }
}


module.exports = { UpdateOccurrenceInput, UpdateOccurrenceList};