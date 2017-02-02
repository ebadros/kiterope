var React = require('react');
let ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {ObjectList, ObjectListAndUpdate, FormAction, Sidebar } from './base'
var Datetime = require('react-datetime');

import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
var MaskedInput = require('react-maskedinput');
var classNames = require('classnames');
import validator from 'validator';
var UpdatesList = require('./update');
var Modal = require('react-modal');
import DatePicker  from 'react-datepicker';
require('react-datepicker/dist/react-datepicker.css');
import TinyMCE from 'react-tinymce';
import TinyMCEInput from 'react-tinymce-input';

import ValidatedInput from './app'
import { makeEditable, StepCalendarComponent, StepEditCalendarComponent } from './calendar'
//import StepCalendarComponent from './step2'
import CurrencyInput from 'react-currency-input';
import Dropzone from 'react-dropzone';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'

import moment from 'moment';


var Select = require('react-select');

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';


import BigCalendar from 'react-big-calendar';


BigCalendar.momentLocalizer(moment);

var theServer = 'https://192.168.1.156:8000/'

$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    }
});
const dropzoneS3Style = {
    height: 200,
    border: 'dashed 2px #999',
    borderRadius: 5,
    position: 'relative',
    cursor: 'pointer',
  }

  const uploaderProps = {
    dropzoneS3Style,
    maxFileSize: 1024 * 1024 * 50,
    server: theServer,
    s3Url: 'https://kiterope.s3.amazonaws.com/images',
    signingUrlQueryParams: {uploadType: 'avatar'},
      uploadRequestHeaders: {'x-amz-acl': 'public-read','Access-Control-Allow-Origin':'*' },
      signingUrl: "signS3Upload",
  }

const s3ImageUrl = "https://kiterope.s3.amazonaws.com:443/"
export const planScheduleLengths = [
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
    {value:'1y', label: "1 year"},

    ]

export const timeCommitmentOptions = [
    {value:'1h', label: "1 hour a day"},
    {value:'2h', label: "2 hours a day"},
    {value:'3h', label: "3 hours a day"},
    {value:'4h', label: "4 hours a day"},
    {value:'5h', label: "5 hours a day"},
    {value:'8h', label: "8 hours a day"},

    ]

export const costFrequencyMetricOptions = [
    {value:'FREE', label: "Free"},
    {value:'MONTH', label: "Per Month"},
    {value:'ONE_TIME', label: "One Time"},
    ]

export const viewableByOptions = [
    {value:'ONLY_ME', label: "Only me"},
    {value:'ONLY_CLIENTS', label: "Only my clients"},
    {value:'ANYONE', label: "Anyone"},
    ]

let formats = {
  dateFormat: 'DD',

    dayFormat:'ddd MM/DD'


}

const customStyles = {
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
    padding                    : '40px'
  }
};

var stepCalendarComponent = "";


function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

// now test it:

var PlanCalendar = React.createClass({

    getPlanStartDate: function () {
        $.ajax({
          url: theServer + "api/plans/" + this.props.planId + "/",
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  planStartDate:data.startDate,

              })


          }.bind(this),
          error: function(xhr, status, err) {
            console.error("https://127.0.0.1:8000/api/plans/" + this.props.planId + "/", status, err.toString());
          }.bind(this)
        });
      },


    componentDidMount: function() {
        var self = this;
        $(this.refs["ref_create"]).hide();
        $(this.refs["ref_edit"]).hide();
        this.getPlanStartDate()

    },

    getInitialState: function() {
        return ({
            events:[],
            stepMethod:"",
            currentStepData:"",
            modalIsOpen: false,
        })
    },

    selectEvent:function (event) {
        console.log("selectEvent")
        this.setState({
            stepMethod: "edit",
            currentStepData: event,
        },
            () => this.showEdit())

    },

    createEvent: function(slotInfo) {
        this.setState({
            eventInfo:slotInfo,
                stepMethod: "create",


        },
            () => this.showCreate())
    },

    showCreate: function () {
                $(this.refs["ref_edit"]).hide()
        $(this.refs["ref_create"]).slideDown()
    },

    showEdit: function () {
        $(this.refs["ref_create"]).hide()
        $(this.refs["ref_edit"]).slideDown()
    },

    handleStepEditCloseWindowClick: function (toDisplay) {
        console.log("handleStepEditCloseWindowClick")
                    $(this.refs["ref_edit"]).slideUp()

        if (!toDisplay.display) {
            $(this.refs["ref_edit"]).slideUp()

        }
    },

    handleStepCloseWindowClick: function (toDisplay) {
        console.log("handleStepCloseWindowClick")
            $(this.refs["ref_create"]).slideUp()

        if (!toDisplay.display) {
            $(this.refs["ref_create"]).slideUp()


        }
    },







    handleFormSubmit: function(step, callback) {
        if (this.state.stepMethod == 'edit') {
            console.log("handleFormSubmit edit ")
            $.ajax({
                url: (theServer + "api/steps/" + step.id + "/"),
                dataType: 'json',
                type: 'PATCH',
                data: step,
                success: callback,
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        }
        else if (this.state.stepMethod=='create') {
            $.ajax({
                url: (theServer + "api/steps/"),
                dataType: 'json',
                type: 'POST',
                data: step,
                success: callback,
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });

        }
  },


    render: function() {
        return (
            <div>

                <div className="ui row">&nbsp;</div>
                <div ref="ref_edit">

                    <StepEditCalendarComponent
                planStartDate={this.state.planStartDate}
                planId={this.props.planId}
                stepData={this.state.currentStepData}
                onFormSubmit={this.handleFormSubmit}
                method="edit"
                methodChange={this.handleStepEditCloseWindowClick}
            />
            </div>
                <div ref="ref_create">
                <StepCalendarComponent
                    planStartDate={this.state.planStartDate}
                    planId={this.props.planId}
                    eventInfo={this.state.eventInfo}
                    onFormSubmit={this.handleFormSubmit}
                    stepMethod="create"
                    methodChange={this.handleStepCloseWindowClick}

            /></div>


                <div className="ui row">&nbsp;</div>

                <div className="calendarContainer">

                    <BigCalendar
                        className="calendarPadding"
                        popup
                        selectable
                        events={this.props.events}
                        startAccessor='absoluteStartDate'
                        endAccessor='absoluteEndDate'
                        step={30}
                        timeslots={4}
                        formats={formats}
                        onSelectEvent={event => this.selectEvent(event)}
                        onSelectSlot={(slotInfo) => this.createEvent(slotInfo)}
                    />

                </div>

                                </div>


        )
    }
})




{/*
TopFrame
    StepFormAction
    StepList

BottomFrame
        WeekView
            DayView
                StepItem
                */}


var ObjectPage = React.createClass({


    componentDidMount: function() {


    },

    getInitialState: function() {
        return ({data:[]});
    },

    handleFormSubmit: function(plan, callback) {
    $.ajax({
        url: (theServer + "api/plans/" + this.props.params.plan_id + "/"),
        dataType: 'json',
        type: 'PATCH',
        data: plan,
        success: callback,
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
  },



    render: function () {
        if (this.props.params.plan_id) {
            return (

                <div className="fullPageDiv">
                    <div className="ui page container">
                    <div className="spacer">&nbsp;</div>
                    <div className="ui alert"></div>
                    <div className="ui large breadcrumb">
                         <Link to={`/`}><div className="section">Home</div></Link>
                            <i className="right chevron icon divider"></i>
                            <Link to={`/`}><div className=" section">My Goals</div></Link>
                        <i className="right chevron icon divider"></i>
                            <Link to={`/plans/${this.props.params.plan_id}`}><div className="active section">Plan Detail</div></Link>

                    </div>
                    <div>&nbsp;</div>
                    <PlanHeader onFormSubmit={this.handleFormSubmit} planId={this.props.params.plan_id} />
            <div>&nbsp;</div>
                    <StepObjectListAndUpdate url={`${theServer}api/plans/${this.props.params.plan_id}/steps`} planId={this.props.params.plan_id} />

 </div>
                     </div>

        )}

    }
});

var TimeInput = React.createClass({
  render() {
    return (
      <MaskedInput
          mask="11:11"
          placeholder="     "
          size="5"
          {...this.props}

          formatCharacters={{
              'W': {
                  validate(char) {
                      return /\w/.test(char)
                  },
                  transform(char) {
                      return char.toUpperCase()
                  }
              }
          }
          }
      />

    )
  }
});

var StepObjectEditForm = React.createClass({
    componentDidMount: function() {
        var self = this;
        if (!this.state.editFormIsOpen) {
            $(this.refs["stepFormRef_" + this.props.stepData.id]).hide();
            $(this.refs['id_whichDays_' + this.props.stepData.id]).hide();
            $(this.refs['id_whichDate_' + this.props.stepData.id]).hide();

        }
        this.showAndHideUIElements(this.state.frequency)

    },


    getInitialState: function() {

        var startDateInIntegerForm = this.props.stepData.startDate;

        var endDateInIntegerForm = this.props.stepData.endDate;

        var planStartDateInDateForm = this.props.planStartDate;
        var planStartDateInMomentForm = moment(planStartDateInDateForm)

        var calculatedStartDate = moment(planStartDateInMomentForm, "DD-MM-YYYY").add(startDateInIntegerForm, 'days');
        var calculatedEndDate = moment(planStartDateInMomentForm, "DD-MM-YYYY").add(endDateInIntegerForm, 'days');



        return {
            id: this.props.stepData.id,
            title: this.props.stepData.title,
            description:this.props.stepData.description,
            frequency: this.props.stepData.frequency,
            day01:this.props.stepData.day01,
            day02:this.props.stepData.day02,
            day03:this.props.stepData.day03,
            day04:this.props.stepData.day04,
            day05:this.props.stepData.day05,
            day06:this.props.stepData.day06,
            day07:this.props.stepData.day07,
            startDate:calculatedStartDate,
            endDate:calculatedEndDate,
            absoluteStartDate:calculatedStartDate,
            absoluteEndDate:calculatedEndDate,

            startTime:this.props.stepData.startTime,
            duration:this.props.stepData.duration,
            durationMetric:this.props.stepData.durationMetric,
            editFormIsOpen: false,
            editFormButtonText:"Edit",
            plan: this.props.planId,
            formSubmittedSuccessfully:false,
            monthlyDates: this.props.stepData.monthlyDates

        }
    },



    handleSubmit: function(e) {

        e.preventDefault();

        var id = this.state.id;
        var title = this.state.title;
        var description = this.state.description;
        var frequency = this.state.frequency;
        var day01 = this.state.day01;
        var day02 = this.state.day02;
        var day03 = this.state.day03;
        var day04 = this.state.day04;
        var day05 = this.state.day05;
        var day06 = this.state.day06;
        var day07 = this.state.day07;
        var startTime = this.state.startTime;
        var duration = this.state.duration;
        var durationMetric = this.state.durationMetric;
        var plan = this.props.planId;
        var monthlyDates = this.state.monthlyDates;

        var absoluteStartDate = moment(this.state.absoluteStartDate).format("YYYY-MM-DD");
        var absoluteEndDate = moment(this.state.absoluteEndDate).format("YYYY-MM-DD");

        var absoluteStartDateInMomentForm = moment(absoluteStartDate);
        var absoluteEndDateInMomentForm = moment(absoluteEndDate);

        var planStartDateInDateForm = this.props.planStartDate;
        var planStartDateInMomentForm = moment(planStartDateInDateForm)
        var startDate = absoluteStartDateInMomentForm.diff(planStartDateInMomentForm, 'days') +2;
        var endDate = absoluteEndDateInMomentForm.diff(planStartDateInMomentForm, 'days') + 2;

        if (!description || !title ) {
        return;
        }

        this.props.onFormSubmit({
            id:id,
            title: title,
            description:description,
            frequency:frequency,
            day01:day01,
            day02:day02,
            day03:day03,
            day04:day04,
            day05:day05,
            day06:day06,
            day07:day07,
            monthlyDates:monthlyDates,
            absoluteStartDate:absoluteStartDate,
            absoluteEndDate:absoluteEndDate,
            startDate:startDate,
            endDate:endDate,
            startTime:startTime,
            duration:duration,
            durationMetric:durationMetric,
            plan:this.props.planId,},
            function(data){
                this.setState({editFormIsOpen: false});
                this.setState({editFormButtonText:"Edit"});

            this.setState({formSubmittedSuccessfully:true});
        }.bind(this));

    },

    editButtonClicked: function() {
        if (this.state.editFormIsOpen) {
            this.closeForm();
        }
        else {
            this.openForm()
        }
    },
    openForm: function() {
        this.setState({editFormIsOpen: true});
        this.setState({editFormButtonText:"Cancel"})
    },

    closeForm: function() {
        this.setState({editFormIsOpen: false});
        this.setState({editFormButtonText:"Edit"})

    },

    toggleForm: function() {


        if (this.state.formSubmittedSuccessfully == true ){
            console.log(this.state.formSubmittedSuccessfully);
            this.setState({formSubmittedSuccessfully: false})

        }


        $(this.refs["stepFormRef_" + this.state.id]).slideToggle();
        $(this.refs["editButtonRef_" + this.state.id]).toggle();
        $(this.refs["deleteButtonRef_" + this.state.id]).toggle();

        $(this.refs["ref_stepExistingInfo_" + this.state.id]).slideToggle();

    },

    showAndHideUIElements: function() {
        var frequencyValue = this.state.frequency;
        if (frequencyValue == "WEEKLY") {
            $(this.refs['id_whichDays_' + this.props.stepData.id]).show();
            $(this.refs['id_whichDate_' + this.props.stepData.id]).hide();
            $(this.refs['ref_dateSet_' + this.props.stepData.id]).show();
            $(this.refs['ref_date_' + this.props.stepData.id]).hide();



        } else if (frequencyValue == "ONCE") {
            $(this.refs['id_whichDays_' + this.props.stepData.id]).hide();
            $(this.refs['id_whichDate_' + this.props.stepData.id]).hide();
            $(this.refs['ref_dateSet_' + this.props.stepData.id]).hide();
            $(this.refs['ref_date_' + this.props.stepData.id]).show();


        } else if (frequencyValue == "MONTHLY") {
            $(this.refs['id_whichDays_' + this.props.stepData.id]).hide();
            $(this.refs['id_whichDate_' + this.props.stepData.id]).show();
            $(this.refs['ref_dateSet_' + this.props.stepData.id]).show();
            $(this.refs['ref_date_' + this.props.stepData.id]).hide();


        } else if (frequencyValue == "DAILY") {
            $(this.refs['id_whichDays_' + this.props.stepData.id]).hide();
            $(this.refs['id_whichDate_' + this.props.stepData.id]).hide();
            $(this.refs['ref_dateSet_' + this.props.stepData.id]).show();
            $(this.refs['ref_date_' + this.props.stepData.id]).hide();


        }
    },

    handleFrequencyChange: function(e) {
        this.setState({frequency: e.target.value});


    },


    handleTitleChange: function(value) {
        //if (validator.isEmail(e.target.value)) {
        //} else {
            this.setState({title: value});

        //}
    },

    handleDescriptionChange: function(value) {
        this.setState({description: value});
    },

   handleStartDateChange: function(date) {
        this.setState({startDate: date});
  },
    handleEndDateChange: function(date) {
        this.setState({endDate: date});
  },


    handleAbsoluteStartDateChange: function(date) {
        this.setState({absoluteStartDate: date});
  },
    handleAbsoluteEndDateChange: function(date) {
        this.setState({absoluteEndDate: date});
  },
    setTitle: function(stateValueFromChild) {
        this.state.title = stateValueFromChild;
    },

    handleEditorChange: function(e) {
        this.setState({description: e.target.getContent()});
  },
    handleDay01Change: function(e) {
        this.setState({day01: e.target.value});
    },

    handleDay02Change: function(e) {
        this.setState({day02: e.target.value});
    },

    handleDay03Change: function(e) {
        this.setState({day03: e.target.value});
    },

    handleDay04Change: function(e) {
        this.setState({day04: e.target.value});
    },

    handleDay05Change: function(e) {

        this.setState({day05: e.target.value});
    },

    handleDay06Change: function(e) {

        this.setState({day06: e.target.value});
    },

    handleDay07Change: function(e) {

        this.setState({day07: e.target.value});
    },


    handleStartTimeChange: function(e) {

        this.setState({startTime:e.target.value});
    },
    handleDurationChange: function(e) {

        this.setState({duration: e.target.value});
    },

    handleDurationMetricChange: function(e) {
        this.setState({durationMetric: e.target.value});
    },

    handleMonthlyDatesChange: function(e) {
        this.setState({monthlyDates: e.target.value});
    },


    deleteStep: function() {
            $(this.refs["ref_step_" + this.state.id]).slideToggle();

        $.ajax({
        url: theServer + "api/steps/" + this.state.id + "/",
        dataType: 'json',
        type: 'DELETE',
        //data: step,
        success: function() {

        },
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }
    });


    },

    componentDidUpdate(){
        let selectNode = $(this.refs["ref_frequency_" + this.state.id]);
        selectNode.value = this.state.frequency;
                this.showAndHideUIElements();

    },

    render: function () {
        var planScheduleMetric = "Week";
        //if (this.state.formSubmittedSuccessfully == true ){
        //    this.toggleForm();

        //}
        if (this.state.editFormIsOpen) {

            $(this.refs["stepFormRef_" + this.state.id]).show();
           // $(this.refs["editButtonRef_" + this.state.id]).show();
            //$(this.refs["deleteButtonRef_" + this.state.id]).show();
            $(this.refs["ref_stepExistingInfo_" + this.state.id]).hide();
        }
        else {
            $(this.refs["stepFormRef_" + this.state.id]).hide();
            //$(this.refs["editButtonRef_" + this.state.id]).hide();
            //$(this.refs["deleteButtonRef_" + this.state.id]).hide();
            $(this.refs["ref_stepExistingInfo_" + this.state.id]).show();
        }
        return (
            <div ref={`ref_step_${this.state.id}`} className="stackable column " key={this.state.id} >
                        <div className="ui top attached purple large button " onClick={this.clearPage}>
                            <div className="ui grid">

                            <div className="left aligned nine wide column">Step</div>
                            <div ref={`editButtonRef_${this.state.id}`} className="ui three wide column tiny smallPadding middle aligned purple-inverted button"  onClick={this.editButtonClicked}>{this.state.editFormButtonText}</div>
                            <div ref={`deleteButtonRef_${this.state.id}`}className="ui three wide column tiny smallPadding middle aligned purple-inverted button"  onClick={this.deleteStep}>Delete</div>

                                </div></div>
                    <div className="ui segment noBottomMargin noTopMargin">

<div ref={`ref_stepExistingInfo_${this.state.id}`}>
                            <div className="row">
                                <h3>{this.state.title}</h3>
                            </div>
                            <div className="fluid row">Length: {this.state.scheduleLength} {this.state.timeMetric}</div>
                            <div className="fluid row" dangerouslySetInnerHTML={{__html: this.state.description}} />

                        <div className="two wide column"><Link to={`/plans/${this.state.id}/steps`}>

</Link></div>
                    </div>
                    <div className="sixteen wide row">
                    <div>
            <div ref={`stepFormRef_${this.state.id}`}  className="ui form">
                <form onSubmit={this.handleSubmit}>

                    <div className="ui grid">

                    <div className="ui row">
                            <div className="sixteen wide column">
                                              <input type="hidden" name="plan" id="id_plan" value={this.props.planId}/>

                                <ValidatedInput
                                        type="text"
                                        name="title"
                                        label="Title"
                                        id="id_title"
                                        value={this.state.title}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleTitleChange}

                                    />





                            </div>
                        </div>
                        <div className="ui row">
                            <div className="sixteen wide column">
                                                                <div className="field">


                                                                            <label htmlFor="id_description">Description:</label>

                               <TinyMCE name="description" id={`id_description_${this.state.id}`}
        content={this.state.description}
        config={{
          plugins: 'link image code media',
          menubar: "insert",
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | media'
        }}
        onChange={this.handleEditorChange}
      />


                            </div>
                        </div>
                                        </div>


                        <div className="ui row">
                            <div className="sixteen wide column">
                                <div className="field">
                                            <label htmlFor="id_frequency">Repeat?:</label>
                                            <select ref={`ref_frequency_${this.state.id}`} id="id_frequency" name="frequency" value={this.state.frequency} onChange={this.handleFrequencyChange}>
                                                <option value="ONCE">Don't repeat</option>
                                                <option value="DAILY">Daily</option>
                                                <option value="WEEKLY">Weekly</option>
                                                <option value="MONTHLY">Monthly</option>
                                            </select>
                                        </div>
                            </div>
                        </div>
                         <div ref={`ref_dateSet_${this.state.id}`} className="ui row">
                                    <div className="eight wide column">
                                        <div className="field">
                                            <label htmlFor="id_absoluteStartDate">Start Date:</label>

                                            <DatePicker selected={this.state.absoluteStartDate} onChange={this.handleAbsoluteStartDateChange} />
                                            </div>
                                        </div>
                                    <div className="eight wide column">
                                        <div className="field">
                                            <label htmlFor="id_absoluteEndDate">End Date:</label>

                                            <DatePicker selected={this.state.absoluteEndDate} onChange={this.handleAbsoluteEndDateChange} />
                                            </div>
                                        </div>
                                    </div>
                                <div ref={`ref_date_${this.state.id}`} className="ui row">
                                    <div className="eight wide column">
                                        <div className="field">
                                            <label htmlFor="id_absoluteStartDate">Date:</label>

                                            <DatePicker selected={this.state.absoluteStartDate} onChange={this.handleAbsoluteStartDateChange} />
                                            </div>
                                        </div>
                                    </div>
                        <div className="ui row">
                            <div className="eight wide column">
                                <div className="field">
                                    <label htmlFor="id_startTime">Start Time:</label>

                                    <TimeInput className="ui small input" name="startTime" id="id_startTimeNumber"
                                               onChange={this.handleStartTimeChange}/>
                                </div>
                            </div>
                            <div className="eight wide column">
                                <div className="field">
                                    <label>&nbsp;</label>

                                    <select className="ui massive input middle aligned" name="amOrPm" id="id_amOrPm"
                                            onChange={this.handleStartTimeChange}>
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="ui row">
                            <div className="eight wide column">
                                <div className="field">
                                    <label htmlFor="id_duration">For how long:</label>

                                    <input value={this.state.duration} className="ui mini input" name="duration" id="id_duration"
                                           onChange={this.handleDurationChange}/>
                                </div>
                                                            </div>

                                <div className="eight wide column">
                                    <div className="field">
                                        <label>&nbsp;</label>

                                        <select className="ui massive input middle aligned" value={this.state.durationMetric} name="durationMetric" id="id_durationMetric"
                                                onChange={this.handleDurationMetricChange}>

                                            <option value="MINUTES">Minutes</option>
                                            <option value="HOURS">Hours</option>
                                        </select>
                                    </div>
                                </div>


                            </div>
                        <div ref={`id_whichDays_${this.props.stepData.id}`} className="ui row">

                            <div className="sixteen wide column">
                                <div className="field fluid">
                                    <label>Select which days to schedule each week (based on
                                        a Monday start):</label>

                                    <div className="ui equal width tiny buttons ">
                                        <ToggleButton id="id_day01" label="M"/>
                                        <ToggleButton id="id_day02" label="T"/>
                                        <ToggleButton id="id_day03" label="W"/>
                                        <ToggleButton id="id_day04" label="Th"/>
                                        <ToggleButton id="id_day05" label="F"/>
                                        <ToggleButton id="id_day06" label="Sa"/>
                                        <ToggleButton id="id_day07" label="Su"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div ref={`id_whichDate_${this.props.stepData.id}`} className="ui row">

                            <div className="sixteen wide column">

                                <div className="field fluid">

                                    <label htmlFor="id_date">What date(s) in a month would you like this to occur
                                        (1-30)?</label>
                                    <input type="text" name="monthlyDates" id="id_monthlyDates" value={this.state.monthlyDates} onChange={this.handleMonthlyDatesChange}/>

                                </div>

                            </div>
                        </div>





                        </div>
                    <UpdatesList stepId={this.state.id}/>



                    <div className="ui two column grid">
                        <div className="ui row">
                            <div className="ui column">
                                <a className="ui fluid button" onClick={this.closeForm}>Cancel</a>
                            </div>
                            <div className="ui  column">
                                <button type="submit" className="ui primary fluid button">Save</button>
                            </div>
                            <div className="ui row">&nbsp;</div>
                        </div>
                    </div>

                </form >

            </div>
                        </div>
                </div>

                        </div>


                        </div>
        )
    }


});

var StepObjectList = React.createClass({



    toggle: function(planId) {
        $(this.refs["stepFormRef_" + planId]).slideToggle()
    },

    loadObjectsFromServer: function () {
        $.ajax({
          url: theServer + "api/plans/" + this.props.planId + "/",
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  planStartDate:data.startDate,

              })


          }.bind(this),
          error: function(xhr, status, err) {
            console.error("https://127.0.0.1:8000/api/plans/" + this.props.params.plan_id, status, err.toString());
          }.bind(this)
        });
      },

    getInitialState: function() {
        return ({
           data:[],
        })

    },

    componentDidMount: function() {
        $(this.refs[this.props.actionFormRef]).slideToggle();
        this.loadObjectsFromServer();


    },

    componentDidUpdate: function() {
        $(".formForHiding").hide();

    },




    clearPage: function(plan_id) {
        $(".fullPageDiv").slideToggle("slow", function () {
        hashHistory.push('/plans/' + plan_id + '/steps')
            });

    },

    handleFormSubmit: function(step, callback) {
    $.ajax({
        url: (theServer + "api/steps/" + step.id + "/"),
        dataType: 'json',
        type: 'PATCH',
        data: step,
        success: callback,
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
  },



    render: function() {
        var planScheduleMetric = "Week";

        var theForm = new StepForm();

        if (this.props.data) {
            var objectNodes = this.props.data.map(function (objectData) {

                return (
                        <StepObjectEditForm  planStartDate={this.state.planStartDate} key={objectData.id} planId={this.props.planId} onFormSubmit={this.handleFormSubmit} stepData={objectData} />

                )
            }.bind(this));
        }
        return (
            //<div className="ui divided link items">
            <div className="ui three column grid">
                {objectNodes}
            </div>
            )
}});

var PlanHeader = React.createClass({

    loadObjectsFromServer: function () {
        $.ajax({
          url: theServer + "api/plans/" + this.props.planId + "/",
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  data:data,
                  id:this.props.planId,
                  image: data.image,
                  title: data.title,
                  description: data.description,
                  startDate:moment(data.startDate, "YYYY-MM-DD"),
                  scheduleLength:data.scheduleLength,
                  viewableBy: data.viewableBy,
                  timeCommitment: data.timeCommitment,
                  cost:data.cost,
                  costFrequencyMetric: data.costFrequencyMetric,
              })


          }.bind(this),
          error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
          }.bind(this)
        });


      },

    handleStartDateChange: function (date)   {
        this.setState({startDate: date});
  },





    handleEditorChange: function (e)  {

        this.setState({description: e});
  },

    handleCostChange: function (newValue){
        this.setState({cost: newValue});
    },

    handleScheduleLengthChange: function (value){
        this.setState({scheduleLength: value});
    },

    handleCostFrequencyMetricChange: function (value) {

            this.setState({costFrequencyMetric: value})
    },

    handleViewableByChange: function (value) {

            this.setState({viewableBy: value})
    }

,

    handleTimeCommitmentChange(selection){
        this.setState({timeCommitment: selection.value});
    },

    getDescriptionEditor: function () {
                if (this.state.description == null) {
                    return ("")
                } else {
                    return (<div className="ui row">
                        <div className="ten wide column">
                            <div className="field fluid">
                                <label htmlFor="id_description">Description:</label>
                                <TinyMCEInput name="description"
                                         value={this.state.description}
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
            },



    getImageEditSection: function() {
        if (false) {
            var theImage = this.state.image
            var theFilename = theImage.replace("https://kiterope.s3.amazonaws.com:443/images/", "");

            return (
                <div className="ui row">

                    <div className="four wide column">
                        <div className="field">
                            <label htmlFor="id_image">Plan's Poster Image:</label>
                            <DropzoneS3Uploader filename={theFilename}
                                                onFinish={this.handleFinishedUpload} {...uploaderProps} />


                        </div>
                    </div>
                </div>
            )

        } else {
            return (
                <div className="ui row">

                    <div className="four wide column">
                        <div className="field">
                            <label htmlFor="id_image">Plan's Poster Image:</label>
                            <DropzoneS3Uploader
                                                onFinish={this.handleFinishedUpload} {...uploaderProps} />


                        </div>
                    </div>
                </div>
            )
        }
    },

    handleFinishedUpload: function (value) {
            var fullUrl = value.signedUrl;
            var urlForDatabase = fullUrl.split("?")[0];
            urlForDatabase = urlForDatabase.replace(s3ImageUrl, "");
            this.setState({image: urlForDatabase});
    }
,



    handleTitleChange: function (value) {

            this.setState({title: value})
    }
,



    handlePlanSubmit: function(e) {
        e.preventDefault();

        var title = this.state.title;
        var description = this.state.description;
        var viewableBy = this.state.viewableBy;
        var image = this.state.image;

        var scheduleLength = this.state.scheduleLength
        var startDate = moment(this.state.startDate).format("YYYY-MM-DD")
        var timeCommitment = this.state.timeCommitment
        var cost = this.state.cost;
        var costFrequencyMetric = this.state.costFrequencyMetric;

        console.log("this is what the image is " + this.state.image)
        this.props.onFormSubmit({
            id: this.props.planId,
            title: title,
            image: image,
            description: description,
            viewableBy: viewableBy,
            scheduleLength: scheduleLength,
            startDate: startDate,
            timeCommitment: timeCommitment,
            cost: cost,
            costFrequencyMetric: costFrequencyMetric,
        }, function (data) {
            this.loadObjectsFromServer()
            $(this.refs['ref_planForm']).slideUp();
            $(this.refs['ref_existingInfo_plan']).slideDown();
            this.setState({editButtonText:"Edit"})
            console.log("success")


        }.bind(this));
    },

    getForm: function() {
        var descriptionEditor = this.getDescriptionEditor()
    var imageEditSection = this.getImageEditSection()


          return (<div ref="ref_planForm" className="ui form">
                  <div>{this.props.planHeaderErrors}</div>
                <form onSubmit={this.handlePlanSubmit} >

                    <div className="ui grid">

                                    {imageEditSection}


                    <div className="ui row">
                            <div className="ten wide column">

                                 <ValidatedInput
                                        type="text"
                                        name="title"
                                        label="Title"
                                        id="id_title"
                                        value={this.state.title}
                                        initialValue={this.state.title}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleTitleChange}
                                    />

                            </div>
                        <div className="six wide column">&nbsp;</div>

                        </div>

                        {descriptionEditor}




                         <div  className="ui row">
                             <div className="three wide column">
                                        <div className="field"> <label htmlFor="id_lengthOfSchedule" >Length of Schedule:</label>

                             <Select value={this.state.scheduleLength}  onChange={this.handleScheduleLengthChange} name="scheduleLength" options={planScheduleLengths} />
                                            </div>
                                 </div>

                                    <div className="three wide column">
                                       <div className="field">

                                            <label className="tooltip" htmlFor="id_startDate">Start Date:<i className="info circle icon"></i>
                                                <span className="tooltiptext">A start date for your plan makes scheduling your plan's steps easier. Your users can choose whatever start date they would like.</span>
                                           </label>

                                            <DatePicker selected={this.state.startDate} onChange={this.handleStartDateChange} />
                                            </div>
                                        </div>
                                    <div className="three wide column">&nbsp;</div>
                                    </div>
                        <div  className="ui row">
                             <div className="three wide column">
                                        <div className="field"> <label htmlFor="timeCommitment" >Time Commitment:</label>

                             <Select value={this.state.timeCommitment}  onChange={this.handleTimeCommitmentChange} name="timeCommitment" options={timeCommitmentOptions} />
                                            </div>
                                 </div>


                                    <div className="six wide column">&nbsp;</div>
                                    </div>
                        <div  className="ui row">
                             <div className="three wide column">
                                        <div className="field">
                                            <label htmlFor="id_startDate" >Cost (in US dollars):</label>

                <CurrencyInput value={this.state.cost} onChange={this.handleCostChange}/>
                                            </div>
                                 </div>

                                    <div className="three wide column">
                                       <div className="field">

                                            <label htmlFor="id_costFrequencyMetric">Frequency:</label>
                             <Select value={this.state.costFrequencyMetric} onChange={this.handleCostFrequencyMeticChange} name="costFrequencyMetric" options={costFrequencyMetricOptions} />


                                            </div>
                                        </div>
                                    <div className="three wide column">&nbsp;

                                    </div>
                            </div>

<div className="ui row">
                            <div className="six wide column">
                                 <div className='field'>
                    <label>Who should be able to see this?:</label>

                                                 <Select value={this.state.viewableBy} onChange={this.handleViewableByChange} name="viewableBy" options={viewableByOptions} />



                  </div>
                            </div>
                        </div>



                        </div>




                    <div className="ui three column grid">
                                            <div className="ui row">&nbsp;</div>

                        <div className="ui row">
                            <div className="ui column">&nbsp;</div>

                            <div className="ui column"><a className="ui fluid button" onClick={this.cancelButtonClicked}>Cancel</a></div>
                            <div className="ui column">
                                <button type="submit" className="ui primary fluid button">Save</button>
                            </div>
                            <div className="ui row">&nbsp;</div>
                        </div>
                    </div>

                </form >

            </div>
          )

    },

    editButtonClicked: function() {
                if($(this.refs["ref_existingInfo_plan"]).is(":visible")) {
                    $(this.refs['ref_planForm']).slideDown();

                    $(this.refs['ref_existingInfo_plan']).slideUp();
                    this.setState({editButtonText:"Cancel"})
                }
                else {
                    $(this.refs['ref_planForm']).slideUp();

                    $(this.refs['ref_existingInfo_plan']).slideDown();
                                        this.setState({editButtonText:"Edit"})


                }



    },

    cancelButtonClicked: function(e) {
        e.preventDefault()
         $(this.refs['ref_planForm']).slideUp();

                    $(this.refs['ref_existingInfo_plan']).slideDown();
                                        this.setState({editButtonText:"Edit"})
    },

    getInitialState: function() {
        return ({
           data:[],
            editButtonText:"Edit",
            files:[],
            id:this.props.planId,
            image: "",
            title: "",
            description: "",
            startDate:moment(),
            scheduleLength:"3m",
            viewableBy: "ONLY_ME",
            timeCommitment: "1h",
            cost:"0.0",
            costFrequencyMetric: "MONTH",
        })

    },

    componentDidMount: function() {
        this.loadObjectsFromServer();
        $(this.refs['ref_planForm']).hide();


      //var intervalID = setInterval(this.loadObjectsFromServer, 2000);
        //this.setState({intervalID:intervalID});

        var self = this;
    },

    componentWillUnmount: function() {
   // use intervalId from the state to clear the interval
   //clearInterval(this.state.intervalId);
},

    getImageSection: function () {

        if (this.state.image != null) {
            var theImageUrl = s3ImageUrl + this.state.image;
            return (<div className="two wide column">
                <img className="ui image"
                     src={theImageUrl}>
                </img>
            </div>)
        } else {
            return (
                <div className="two wide column">
                    <img className="ui image"
                         src='http://semantic-ui.com/images/avatar2/large/kristy.png'></img>
                </div>)
        }
    },

    render: function() {
        var myForm = this.getForm()
        var imageSection = this.getImageSection()

        return (

            <div>
                <div className="ui four wide column header"><h1>Plan</h1></div>
                <div className="ui top attached green button">
                    <div className="ui grid">

                        <div className="left aligned eleven wide column">Plan</div>
                        <div className="ui two wide column small smallPadding middle aligned">&nbsp;</div>

                        <div className="ui right floated two wide column">

                        <div ref="ref_editButton"
                             className="ui fluid small smallPadding right floated middle aligned purple-inverted button"
                             onClick={this.editButtonClicked}>{this.state.editButtonText}</div>
                        </div>


                    </div>
                </div>

                <div className="ui segment noTopMargin">
                    <div ref="ref_existingInfo_plan">
                        <div className="ui two column grid">
                            {imageSection}



                    <div className="fourteen wide column">
                        <div className="row">
                            <div className="sixteen wide column">
                                <h1>{this.state.data.title}</h1></div>
                        </div>


                        <div className="row">

                            <div className="sixteen wide column" dangerouslySetInnerHTML={{__html: this.state.description}}></div>


                        </div>
                        <div className="row">

                            <div className="sixteen wide column"> Start Date: {this.state.data.startDate}</div>


                        </div>
                    </div>
                    </div></div>

                    {myForm}
                    </div>
                </div>

            )
}});



var StepObjectListAndUpdate = React.createClass({

    loadObjectsFromServer: function () {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({data: data.results});

          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },

    getInitialState: function() {
        return {
            data: [],
        view:"calendar"
        };
    },

    handleFormSubmit: function(step, callback) {
    $.ajax({
        url: (theServer + "api/steps/"),
        dataType: 'json',
        type: 'POST',
        data: step,
        success: callback,
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
  },


    handleCalendarViewClick: function() {
        this.showCalendar()





    },

    showCalendar: function() {
        $(this.refs['ref_calendarView']).slideDown();
        $(this.refs['ref_listView']).slideUp();
    },

    showList: function() {
        $(this.refs['ref_calendarView']).slideUp();
        $(this.refs['ref_listView']).slideDown();
    },

    handleListViewClick: function() {
this.showList()
    },


    componentDidMount: function() {
        this.loadObjectsFromServer();
        this.showCalendar()


        $(".fullPageDiv").hide();
        $(".fullPageDiv").slideToggle();



          //var intervalID = setInterval(this.loadObjectsFromServer, 2000);
        //this.setState({intervalID:intervalID});

        var self = this;
    },

    componentWillUnmount: function() {
   // use intervalId from the state to clear the interval
   //clearInterval(this.state.intervalId);
},

    render:function() {

        var model = this.props.model;

        return (
            <div>
                <div className="ui grid">
                    <div className="ui row">
                        <div className="ui header two wide column">
                            <h1>Steps</h1>
                        </div>
                        <div className="ui thirteen wide column">&nbsp;</div>
                        <div className="two right floated wide column">
                        <div className="ui right floated menu">
                            <a className="active item" onClick={this.handleCalendarViewClick}>
                                <i className="calendar icon"></i>
                            </a>
                            <a className="item" onClick={this.handleListViewClick}>
                                <i className="tasks icon"></i>
                            </a>
                        </div>
                    </div>
            </div>

                </div>
                 <div ref="ref_calendarView">

                    <PlanCalendar planId={this.props.planId} events={this.state.data}/>
                    <div className="ui row">&nbsp;</div>

                </div>
                <div ref="ref_listView">
                <StepFormAction onFormSubmit={this.handleFormSubmit} planId={this.props.planId} pageHeadingLabel="Steps" actionButtonLabel="Add Step" actionFormRef="stepForm" modelForm="StepForm"/>
                <div>&nbsp;</div>
                <div>&nbsp;</div>

                <StepObjectList planId={this.props.planId} data={this.state.data}   />

            </div>

                </div>
        );
    }
});

var ToggleButton = React.createClass({
    componentDidMount: function() {
        var self = this;
    },

    getInitialState: function() {
        return { checked: this.props.value };
    },

    handleChange: function(e) {
        var currentState = this.state.checked;

        if (currentState == "true") {
            this.setState({ checked: "false"});
        } else {
            this.setState({ checked: "true"});

        }
    },


  render: function () {
    var btnClass = 'ui toggle button';
    if (this.state.checked == "true") btnClass += ' active';
    return <button className={btnClass}  onClick={this.handleChange}>{this.props.label}</button>;
  }
});

var DynamicSelectButton = React.createClass({
    componentDidMount: function() {
        var self = this;
    },

    getInitialState: function() {
        return {
            value: this.props.initialValue,
        }
    },

  render: function () {
      var htmlToRender = "<div className='field'><label htmlFor='" + this.props.id + "'>" + this.props.label + "</label>";
      htmlToRender += "<select id='" + this.props.id + "' name='" + this.props.initialValue + "' >" ;

      for(var i=0; i < this.props.numberOfItems ; i++) {
          if (this.props.initialValue == i){
              htmlToRender += "<option selected='selected' value='";
          }
          else {
              htmlToRender += "<option value='";
          }
          htmlToRender += "<option value='";
          htmlToRender += String(i + 1);
          htmlToRender += "'>";
          htmlToRender += "Week ";
          htmlToRender += String(i+1);
          htmlToRender += "</option>";

      }
      htmlToRender += "</select>";
    htmlToRender += "</div>";
    return (

        <div dangerouslySetInnerHTML={{__html: htmlToRender}} />
      );

  }
});

var StepFormAction = React.createClass({
    componentDidMount: function() {
        var self = this;
        this.loadObjectsFromServer();
        $(this.refs[this.props.actionFormRef]).hide();
        $(this.refs['id_whichDate']).hide();
        this.showAndHideUIElements()

    },



    loadObjectsFromServer: function () {
        $.ajax({
          url: theServer + "api/plans/" + this.props.planId + "/",
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  planStartDate:data.startDate,

              })

              console.log("planStartDate" + this.state.planStartDate)


          }.bind(this),
          error: function(xhr, status, err) {
            console.error(theServer + "api/plans/" + this.props.planId + "/", status, err.toString());
          }.bind(this)
        });
      },



    getInitialState: function() {



        return {
            title: '',
            description:'',
            frequency:'ONCE',
            day01:"false",
            day02:"false",
            day03:"false",
            day04:"false",
            day05:"false",
            day06:"false",
            day07:"false",
            monthlyDates:"",
            absoluteStartDate:moment(this.props.planStartDate, "YYYY-MM-DD"),
            absoluteEndDate: moment(this.props.planStartDate, "YYYY-MM-DD"),

            startTime:"",
            duration:"1",
            durationMetric:"Hour",

        }
    },

    handleSubmit: function(e) {
        console.log("handleSubmit clicked")
        e.preventDefault();
        var title = this.state.title;
        var description = this.state.description;
        var frequency = this.state.frequency;

        var day01 = this.state.day01;
        var day02 = this.state.day02;
        var day03 = this.state.day03;
        var day04 = this.state.day04;
        var day05 = this.state.day05;
        var day06 = this.state.day06;
        var day07 = this.state.day07;
        var monthlyDates = this.state.monthlyDates;


        var absoluteStartDate = moment(this.state.absoluteStartDate).format("YYYY-MM-DD");
        var absoluteEndDate = moment(this.state.absoluteEndDate).format("YYYY-MM-DD");

        var absoluteStartDateInMomentForm = moment(absoluteStartDate);
        var absoluteEndDateInMomentForm = moment(absoluteEndDate);

        var planStartDateInDateForm = this.props.planStartDate;
        var planStartDateInMomentForm = moment(planStartDateInDateForm)
        var startDate = absoluteStartDateInMomentForm.diff(planStartDateInMomentForm, 'days') +2;
        var endDate = absoluteEndDateInMomentForm.diff(planStartDateInMomentForm, 'days') + 2;
        var startTime = this.state.startTime;

        var duration = this.state.duration;
        var durationMetric = this.state.durationMetric;
        var plan = this.props.planId;

        this.props.onFormSubmit({
            title: title,
            description:description,
            frequency:frequency,
            day01:day01,
            day02:day02,
            day03:day03,
            day04:day04,
            day05:day05,
            day06:day06,
            day07:day07,
            monthlyDates:monthlyDates,
            startTime:startTime,
            startDate:startDate,
            endDate: endDate,
            absoluteStartDate: absoluteStartDate,
            absoluteEndDate: absoluteEndDate,
            duration:duration,
            durationMetric:durationMetric,

            plan:this.props.planId,},
            function(data){
                this.toggleForm()

                this.setState({
                    title: '',
                    description:'',
                    frequency:'ONCE',
                    day01:"false",
                    day02:"false",
                    day03:"false",
                    day04:"false",
                    day05:"false",
                    day06:"false",
                    day07:"false",
                    monthlyDates:"",
                    absoluteStartDate:this.props.planStartDate,
                    absoluteEndDate:this.props.planStartDate,
                    startTime:"",
                    duration:"1",
                    durationMetric:"Hour",
                    formSubmittedSuccessfully:true
        })
        }.bind(this));



    },


    toggleForm: function() {
        $(this.refs[this.props.actionFormRef]).slideToggle();
        $(this.refs['clickToToggleButton']).toggle();
        if (this.state.formSubmittedSuccessfully == true ){
            this.setState({formSubmittedSuccessfully:false})
        }
        this.clearForm();
    },

    clearForm: function() {
        this.setState({
                    title: '',
                    description:'',
                    frequency:'ONCE',
                    day01:"false",
                    day02:"false",
                    day03:"false",
                    day04:"false",
                    day05:"false",
                    day06:"false",
                    day07:"false",
                    monthlyDates:"",
                    absoluteStartDate:this.props.planStartDate,
                    absoluteEndDate:this.props.planStartDate,
                    endDate:"",
                    startTime:"",
                    duration:"1",
                    durationMetric:"Hour",
                    formSubmittedSuccessfully:true
        })
    },

    handleTitleChange: function(e) {

        this.setState({title: e.target.value});
    },

    handleDescriptionChange: function(e) {
        this.setState({description: e.target.value});
    },

    handleFrequencyChange: function(e) {
        this.setState({frequency: e.target.value});

    },
    showAndHideUIElements: function() {
        var frequencyValue = this.state.frequency;
        if (frequencyValue == "WEEKLY") {
            $(this.refs['id_whichDays']).show();
            $(this.refs['id_whichDate']).hide();
            $(this.refs['ref_dateSet']).show();
            $(this.refs['ref_date']).hide();



        } else if (frequencyValue == "ONCE") {
            $(this.refs['id_whichDays']).hide();
            $(this.refs['id_whichDate']).hide();
            $(this.refs['ref_dateSet']).hide();
            $(this.refs['ref_date']).show();


        } else if (frequencyValue == "MONTHLY") {
            $(this.refs['id_whichDays']).hide();
            $(this.refs['id_whichDate']).show();
            $(this.refs['ref_dateSet']).show();
            $(this.refs['ref_date']).hide();


        } else if (frequencyValue == "DAILY") {
            $(this.refs['id_whichDays']).hide();
            $(this.refs['id_whichDate']).hide();
            $(this.refs['ref_dateSet']).show();
            $(this.refs['ref_date']).hide();


        }
    },

    handleEditorChange: function(e) {
        this.setState({description: e.target.getContent()});
  },

    handleDay01Change: function(e) {
        this.state();
        this.setState({day01: e.target.value});
    },

    handleDay02Change: function(e) {
        this.setState({day02: e.target.value});
    },

    handleDay03Change: function(e) {
        this.setState({day03: e.target.value});
    },

    handleDay04Change: function(e) {
        this.setState({day04: e.target.value});
    },

    handleDay05Change: function(e) {

        this.setState({day05: e.target.value});
    },

    handleDay06Change: function(e) {

        this.setState({day06: e.target.value});
    },

    handleDay07Change: function(e) {

        this.setState({day07: e.target.value});
    },

    handleMonthlyDatesChange: function(e) {

        this.setState({monthlyDates: e.target.value});
    },


    handleStartTimeChange: function(e) {

        this.setState({startTime:e.target.value});
    },
    handleDurationChange: function(e) {

        this.setState({duration: e.target.value});
    },

    handleDurationMetricChange: function(e) {
        this.setState({durationMetric: e.target.value});
    },

    handleStartDateChange: function(date) {
        this.setState({startDate: date});
  },
    handleEndDateChange: function(date) {
        this.setState({endDate: date});
  },

     handleAbsoluteStartDateChange: function(date) {
        this.setState({absoluteStartDate: date});

  },
    handleAbsoluteEndDateChange: function(date) {
        this.setState({absoluteEndDate: date});
        console.log("absoluteEndDate " + this.state.absoluteEndDate)

  },

    componentDidUpdate(){
        let selectNode = $(this.refs["ref_frequency"]);
        selectNode.value = this.state.frequency;
        this.showAndHideUIElements();

    },


    render: function() {
        var planScheduleMetric = "Week";
        switch(this.props.modelForm) {
            case "PlanForm":
                var theForm = new PlanForm();
                break;
            case "StepForm":
                var theForm = new StepForm();
                break;
            default:
                break;
        }
        //if (this.state.formSubmittedSuccessfully == true ){
        //    this.toggleForm()
        //}
        return (
            <div>
                <div className="ui three column grid">
                    <div className="ui right floated column">
                        <button className="ui right floated purple large fluid button" ref="clickToToggleButton"
                                onClick={this.toggleForm}>{this.props.actionButtonLabel}</button>
                    </div>
                </div>

                <div ref={`${this.props.actionFormRef}`}>

                    <div className="ui form">
                        <form onSubmit={this.handleSubmit}>

                            <div className="ui grid">
                                <div className="ui row">
                                    <div className="ten wide column">
                                        <div className="field">
                                            <ValidatedInput
                                        type="text"
                                        name="title"
                                        label="Title"
                                        id="id_title"
                                        value={this.state.title}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleTitleChange}

                                    />
                                            <input type="hidden" name="plan" id="id_plan" value={this.props.planId} />
                                        </div>
                                    </div>
                                    <div className="six wide column">&nbsp;</div>
                                </div>

                                <div className="ui row">
                                    <div className="ten wide column">

                                        <div className="field fluid" data-inverted="" data-tooltip="Add users to your feed" data-position="right center">
                                            <label htmlFor="id_description">Description:</label>

                                        <TinyMCE name="description" id="id_description"
        content={this.state.description}
        config={{
          plugins: 'link image code media',
          menubar: "insert",
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | media'
        }}
        onChange={this.handleEditorChange}
      />

                                        </div>
                                    </div>
                                </div>
                                <div className="ui row">
                                    <div className="three wide column">
                                        <div className="field">
                                            <label htmlFor="id_frequency">Repeat?:</label>
                                            <select ref="ref_frequency" id="id_frequency" name="frequency" value={this.state.frequency} onChange={this.handleFrequencyChange}>
                                                <option value="ONCE">Don't repeat</option>
                                                <option value="DAILY">Daily</option>
                                                <option value="WEEKLY">Weekly</option>
                                                <option value="MONTHLY">Monthly</option>
                                            </select>
                                        </div>
                                    </div>
                                    </div>
                                <div ref="ref_dateSet"className="ui row">
                                    <div className="three wide column">
                                        <div className="field">
                                            <label htmlFor="id_absoluteStartDate">Start Date:</label>

                                            <DatePicker selected={this.state.absoluteStartDate} onChange={this.handleAbsoluteStartDateChange} />
                                            </div>
                                        </div>
                                    <div className="three wide column">
                                        <div className="field">
                                            <label htmlFor="id_absoluteEndDate">End Date:</label>

                                            <DatePicker selected={this.state.absoluteEndDate} onChange={this.handleAbsoluteEndDateChange} />
                                            </div>
                                        </div>
                                    </div>
                                <div ref="ref_date" className="ui row">
                                    <div className="four wide column">
                                        <div className="field">
                                            <label htmlFor="id_absoluteStartDate">Date:</label>

                                            <DatePicker  selected={this.state.absoluteStartDate} onChange={this.handleAbsoluteStartDateChange} />
                                            </div>
                                        </div>
                                    </div>
                                <div className="ui row">
                                    <div className="three wide column">
                                        <div className="field">
                                            <label htmlFor="id_startTime">Start Time:</label>
                                            <TimeInput value={this.state.startTime} className="ui small input" name="startTime" id="id_startTimeNumber" onChange={this.handleStartTimeChange}/>
                                        </div>
                                        </div>
                                     <div className="two wide column">
                                        <div className="field">
                                            <label>&nbsp;</label>

                                            <select className="ui massive input middle aligned" name="amOrPm" id="id_amOrPm" onChange={this.handleStartTimeChange}>
                                                <option value="AM">AM</option>
                                                <option value="PM">PM</option>
                                            </select>
                                            </div>
                                         </div>
                                    <div className="two wide column">
                                        <div className="field">
                                            <label htmlFor="id_duration">For how long:</label>
                                            <input className="ui mini input" name="duration" id="id_duration" value={this.state.duration} onChange={this.handleDurationChange}/>
                                        </div>
                                    </div>
                                    <div className="three wide column">
                                        <div className="field">
                                            <label >&nbsp;</label>

                                            <select className="ui massive input middle aligned" name="durationMetric" id="id_durationMetric" onChange={this.handleDurationMetricChange}>

                                                <option value="MINUTES">Minutes</option>
                                                <option value="HOURS">Hours</option>
                                            </select>
                                        </div>
                                    </div>


                                                                                    </div>






                                <div ref="id_whichDays" className="ui row">

                                    <div  className="ten wide column">
                                        <div  className="field fluid">
                                            <label>Select which days to schedule each week (based on
                                                a Monday start):</label>

                                            <div className="ui equal width buttons ">
                                                <ToggleButton value={this.state.day01} id="id_day01" label="Monday"/>
                                                <ToggleButton value={this.state.day02} id="id_day02" label="Tuesday"/>
                                                <ToggleButton value={this.state.day03} id="id_day03" label="Wednesday"/>
                                                <ToggleButton value={this.state.day04} id="id_day04" label="Thursday"/>
                                                <ToggleButton value={this.state.day05} id="id_day05" label="Friday"/>
                                                <ToggleButton value={this.state.day06} id="id_day06" label="Saturday"/>
                                                <ToggleButton value={this.state.day07} id="id_day07" label="Sunday"/>
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                <div ref="id_whichDate" className="ui row">

                                    <div  className="six wide column">

                                                <div  className="field fluid">

                                                <label htmlFor="id_monthlyDates">What date(s) in a month would you like this to occur
                                                (e.g. "1, 3-9, 21")?</label>
                                            <input type="text" name="monthlyDates" id="id_monthlyDates" onChange={this.handleMonthlyDatesChange}/>

                                        </div>

                                    </div>
                                </div>



                                </div>



                            <div className="ui three column grid">
                    <div className="ui row">&nbsp;</div>
                    <div className="ui row">
                        <div className="ui  column">&nbsp;</div>
                        <div className="ui  column"><a className="ui fluid button" onClick={this.toggleForm}>Cancel</a></div>
                        <div className="ui  column"><button type="submit"  className="ui primary fluid button">Save</button></div>
                                        <div className="ui row">&nbsp;</div>
</div>
                </div>

                    </form >

                                </div>




            </div>
                            </div>


        )

    }
});
var TimePicker = React.createClass({
    componentDidMount: function(e) {
        $(".rdtSwitch").hide();
    },



    render: function(){
        return <Datetime viewMode="time"
            renderDay={ this.renderDay }
            renderMonth={ this.renderMonth }
            renderYear={ this.renderYear }
        />;
    },
    renderDay: function( props, currentDate, selectedDate ){
        return <td {...props}>{ '0' + currentDate.date() }</td>;
    },
    renderMonth: function( props, month, year, selectedDate){
        return <td {...props}>{ month }</td>;
    },
    renderYear: function( props, year, selectedDate ){
        return <td {...props}>{ year % 100 }</td>;
    }
});

var StepForm = forms.Form.extend({
        rowCssClass: 'field',

        title: forms.CharField(),
        description: forms.CharField({widget: forms.Textarea()}),
        frequency: forms.ChoiceField({choices:["ONCE": "Once", "DAILY": "Daily", "WEEKLY": "Weekly","MONTHLY": "Monthly"]}),

        day01:forms.BooleanField(),
        day02:forms.BooleanField(),
        day03:forms.BooleanField(),
        day04:forms.BooleanField(),
        day05:forms.BooleanField(),
        day06:forms.BooleanField(),
        day07:forms.BooleanField(),
        monthlyDates:forms.CharField(),
        startTime:forms.DateTimeField(),
        duration: forms.IntegerField(),
        durationMetric: forms.CharField(),



    })

module.exports = ObjectPage, StepForm, TimeInput, ToggleButton;