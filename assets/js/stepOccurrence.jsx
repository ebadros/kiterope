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
import {UpdateOccurrenceList } from './updateOccurrence'
import {SaveButton } from './settings'


import {ImageUploader,   ViewEditDeleteItem, StepViewEditDeleteItem, PlanViewEditDeleteItem, FormAction, Sidebar, Header, FormHeaderWithActionButton, DetailPage} from './base';
import { Menubar, StandardSetOfComponents, ErrorReporter } from './accounts'
import { ValidatedInput } from './app'
import { IconLabelCombo, ClippedImage, ContextualMenuItem, ChoiceModal, ChoiceModalButtonsList } from './elements'
import { makeEditable, ProgramCalendar } from './calendar'
import { UpdatesList } from './update'
import { Provider, connect, dispatch } from 'react-redux'
import  {store} from "./redux/store";

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

export class StepOccurrenceList extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: []


        }
    }

    componentDidMount() {
        this.setState({data: this.props.data})


    }

    componentWillReceiveProps(nextProps) {
        if (this.state.data != nextProps.data) {
            this.setState({data: nextProps.data})
        }
    }

    render() {
        if ((this.state.data != undefined) && (this.state.data.length != 0 )){

            var objectNodes = this.state.data.map(function (objectData) {

                return (
                        <StepOccurrenceItem key={`ref_stepOccurrenceItem_${objectData.id}`} stepOccurrenceData={objectData}/>
                )
            }.bind(this));
        } else {
            var objectNodes = <div><div className="largeItalic">You don't have any steps to accomplish today.<Link to={"/search/"}> Find a program that fits your needs.</Link></div>
                </div>
        }
        return (
            //<div className="ui divided link items">
                    <div className="centeredContent">

                      <div className='ui three column  stackable grid'>

                {objectNodes}
            </div>
                        </div>
        )
    }
}

export class StepOccurrenceItem extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[],
            showingDetail:false,
            description:"",
            image:"",
            title:"",
            id:"",
            date:"",
            updateOccurrences:[],
            doneSaving: true,
            stepOccurrenceDoneSaving:true,
            updateOccurrenceDoneSaving:true,
            saved: "Saved",




        }
    }

    toggleDetail () {
        if (this.state.showingDetail) {
            $(this.refs["ref_detail"]).slideUp();

            this.setState({showingDetail:false})

        } else {
            $(this.refs["ref_detail"]).slideDown();

            this.setState({showingDetail:true})


        }
    }


    componentDidMount = () => {
        this.setState({
            id: this.props.stepOccurrenceData.id,
            title: this.props.stepOccurrenceData.step.title,
            image:this.props.stepOccurrenceData.step.image,
            description: this.props.stepOccurrenceData.step.description,
                            date: moment(this.props.stepOccurrenceData.date).format("MM/DD/YYYY HH:mm:SS"),

            updateOccurrences: this.props.stepOccurrenceData.updateOccurrences,
            data:this.props.stepOccurrenceData,

            showingDetail:false,
        },       () =>  {$(this.refs["ref_detail"]).hide()}
)




    };



    componentWillReceiveProps(nextProps) {
        if (this.state.data != nextProps.stepOccurrenceData) {
            this.setState({data: nextProps.stepOccurrenceData,
            id: nextProps.stepOccurrenceData.id,
            title: nextProps.stepOccurrenceData.step.title,
                date: moment(nextProps.stepOccurrenceData.date).format("MM/DD/YYYY hh:mm:ss"),
            image:nextProps.stepOccurrenceData.step.image,
            description: nextProps.stepOccurrenceData.step.description,
                updateOccurrences: nextProps.stepOccurrenceData.updateOccurrences,

            })
        }
    }








    handleSubmit(updateOccurrence) {
        this.setState({doneSaving:false});
        this.setState({
            saved: "Saving"
        });
        /*var stepOccurrence = {
            id:this.state.id,
            wasCompleted: this.state.wasCompleted
        };

        var theUrl = "/api/stepOccurrences/" + this.state.id + "/";
            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'PUT',
                data: stepOccurrence,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    this.setState({
                        stepOccurrenceDoneSaving:true,
                    saved: "Saved"});
                    if (this.state.updateOccurrenceDoneSaving) {
                        this.setState({doneSaving:true})
                    }




                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                        saved:"Unsaved",
                    })

                }.bind(this)
            });*/
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
                    this.setState({
                        updateOccurrenceDoneSaving: true,
                        saved: "Saved",
                        doneSaving: true
                    });
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

    getInputs() {
        if ((this.state.updateOccurrences != undefined) && (this.state.updateOccurrences.length != 0)){

            return (
                <div>
<UpdateOccurrenceList data={this.state.updateOccurrences} />
                    </div>)
        } else {
            return(
            <div>
            </div>
            )

        }
    }



    render () {

        var theInputs = this.getInputs()
            return (
                <div key={`ref_stepOccurrenceItem_${this.state.data.id}`}
                     className="column">

                    <div className="ui segment noBottomMargin noTopMargin">
                        <div onClick={this.toggleDetail} ><ClippedImage item="plan" src={s3ImageUrl + this.state.image} /></div>

                        <div className="stepOccurrenceTitle" onClick={this.toggleDetail}>{this.state.title}{this.state.showingDetail ? <i className="chevron up icon" style={{float:"right"}}></i>: <i className="chevron down icon" style={{float:"right"}}></i>}
</div>
                        <div ref="ref_detail">
                            {this.state.data.type == "TIME" ? <div>{this.state.date}</div>:null}
                            <div className="itemDetailSmall">
                                <div dangerouslySetInnerHTML={{__html: this.state.description}}></div>
                            </div>
                        </div>
                        {theInputs}


                </div></div>
            )
        }


}


module.exports = { StepOccurrenceItem, StepOccurrenceList };