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
import { makeEditable,  ProgramCalendar } from './calendar'
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
        this.children = []
        this.state = {
            id: "",
            measuringWhat: "",
            units: "",
            format: "",
            metricLabel: "",
            data:[],
            doneSaving:true,
            saved: this.props.saved,
            needsSavingArray:[],
            saved: "Saved"

        }
    }

    componentDidMount () {
        this.setState({
            data: this.props.data,
            doneSaving:true,
            saved: "Saved"

        }, () => {this.setNeedsSavingArray()})
    }



    componentWillReceiveProps (nextProps) {
        if (this.state.data != nextProps.data) {
             this.setState({
            data: nextProps.data}, () => {this.setNeedsSavingArray()}
             )}
    }

    handleNeedsSaving(theNeedsSavingIndex) {
        console.log("handleNeedsSaving " + theNeedsSavingIndex)
    this.setState({
    saved:"Save"}
    )
        var theNeedsSavingArray = this.state.needsSavingArray
        theNeedsSavingArray[theNeedsSavingIndex] = true
        this.setState({needsSavingArray: theNeedsSavingArray})

}

 handleHasBeenSaved(theNeedsSavingIndex) {
        console.log("handle has been saved " + theNeedsSavingIndex)
    this.setState({
    saved:"Save"}
    )
        var theNeedsSavingArray = this.state.needsSavingArray
        theNeedsSavingArray[theNeedsSavingIndex] = false
        this.setState({needsSavingArray: theNeedsSavingArray}, () => {this.isEverythingSaved()})

}

setNeedsSavingArray() {
    var theData = this.state.data
    var theNeedsSavingArray = []
    for (var i=0; i < theData.length; i++) {
        theNeedsSavingArray.unshift(false)

    }
    this.setState({needsSavingArray: theNeedsSavingArray})


}

isEverythingSaved() {

    if (this.state.needsSavingArray.indexOf(true) > -1) {
        this.setState({
            doneSaving:false
        })
    } else {
        this.setState({
            doneSaving:true
        })
    }
}



handleSubmit(updateOccurrence, theNeedsSavingIndex) {
        this.setState({doneSaving:false});
        this.setState({
            saved: "Saving"
        });

        if (updateOccurrence != undefined) {
            var theUrl = "/api/updateOccurrences/" + updateOccurrence.id + "/";
            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'PATCH',
                data: updateOccurrence,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    this.handleHasBeenSaved(theNeedsSavingIndex)
                    if (this.state.doneSaving) {
                        this.setState({
                        saved: "Saved",
                    })}


                    //if (this.state.stepOccurrenceDoneSaving) {
                    //    this.setState({doneSaving: true})
                    //}


                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                        saved: "Unsaved",
                    })

                }.bind(this)
            });
        }

    }
    callChildrenHandleSubmit() {

        for (var i=0; i < this.children.length; i++ ) {
            if (this.children[i] != undefined) {
                this.children[i].handleSubmit()
            }
        }
    }




    render() {
        var updateOccurrences = this.state.data.map((occurrence, index) => {
            return (
                <UpdateOccurrenceInput key={occurrence.id} needsSavingIndex={index} data={occurrence} needsSaving={this.handleNeedsSaving}
                                       handleSubmit={this.handleSubmit} ref={instance => {this.children[index] = instance}}/>
            )
        });

        return (<div>
            <div>
                {updateOccurrences}</div>
                                                                    <div className="row">&nbsp;</div>

            <div className="ui row">
                    <div className={`ui large fluid ${ this.state.saved == "Saved" ? "grey": "purple"} ${ this.state.doneSaving ? null: "loading"} button`} onClick={this.callChildrenHandleSubmit}>{this.state.saved}</div>


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
            boolean: false,
            doneSaving:true,

        }
    }

    componentDidMount () {
        this.setState({
            data: this.props.data}, () => {this.setStateToData()})




    }

    setStateToData(){
    this.setState({
        id: this.state.data.id,
        measuringWhat: this.state.data.update.measuringWhat,
        units: this.state.data.update.units,
        format: this.state.data.update.format,
        metricLabel: this.state.data.update.metricLabel,
        text: this.state.data.text,
        decimal: convertToDecimalIfAnInteger(this.props.data.decimal),
        longText: this.state.data.longText,
        integer: this.state.data.integer,
        time: this.state.data.time,
        url: this.state.data.url,
        picture: this.state.data.picture,
        video: this.state.data.video,
        audio: this.state.data.audio,
        boolean: this.state.data.boolean
    })

}

    componentWillReceiveProps (nextProps) {
        if (this.state.data != nextProps.data) {
             this.setState({data: nextProps.data}, () => {this.setStateToData()})




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
        this.props.needsSaving(this.props.needsSavingIndex)
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
        this.props.needsSaving(this.props.needsSavingIndex)

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
        this.props.needsSaving(this.props.needsSavingIndex)

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
        this.props.needsSaving(this.props.needsSavingIndex)

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
        this.props.needsSaving(this.props.needsSavingIndex)

    };

    handleAudioChange = (callbackData) => {
        this.setState({
            audio: callbackData.audio
        })
                        this.props.needsSaving(this.props.needsSavingIndex)


    };

    handleBooleanChange(e) {
        this.setState({
            boolean:e.target.checked
        },         this.props.needsSaving(this.props.needsSavingIndex)
 )



    }

    getBooleanInput () {
        return (
            <div>
             <Measure onMeasure={(dimensions) => {
                this.setState({dimensions})
            }}>
            <div className="ui center aligned middle aligned grid height-100">
                            <div className="pretty primary circle smooth huge-checkbox noRightPadding">
                                <input type="checkbox" id="id_wasCompleted" checked={this.state.boolean} onChange={this.handleBooleanChange} />
                                <label><i className="mdi mdi-check"></i> </label>
                            </div>
                        </div></Measure>
                </div>
        )
    }
//! Need to deal with the validators on this
    getVideoInput () {
        return(<div className="ui form">
            <div className="field">
                <label>{this.state.metricLabel}</label>
            </div>

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
        var theBoolean = this.state.boolean;

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
            boolean: theBoolean ,
        };
        this.props.handleSubmit(updateOccurrence, this.props.needsSavingIndex)

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
            case("boolean"):
                var inputHTML = this.getBooleanInput();
                break;
            case("datetime"):
                var inputHTML= () => {return null}
                break;
            default:
                var inputHTML = () => {return (null)};
                break;

        }
        return (
            <div>
        {inputHTML}
                {inputHTML ? <div className="ui row">&nbsp;</div>:null}


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