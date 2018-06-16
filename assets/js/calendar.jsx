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
var MaskedInput = require('react-maskedinput');
import {convertDate, convertFromDateString, daysBetweenDates , convertStringDateFormatToDateFormat, daysBetween } from './dateConverter'

import {ImageUploader, PlanForm2, ViewEditDeleteItem, StepViewEditDeleteItem, PlanViewEditDeleteItem, FormAction, Sidebar, Header, FormHeaderWithActionButton, DetailPage} from './base';
import {PlanHeader, StepList , ToggleButton, } from './step';
import { Menubar, StandardSetOfComponents, ErrorReporter } from './accounts'
import { ValidatedInput } from './app'
import { IconLabelCombo, ClippedImage, ContextualMenuItem, ChoiceModal, ChoiceModalButtonsList } from './elements'
import { UpdatesList } from './update'


BigCalendar.setLocalizer(
  BigCalendar.momentLocalizer(moment)
);
//BigCalendar.momentLocalizer(moment);
let allViews = Object.keys(BigCalendar.views).map(k => BigCalendar.views[k]);

import {  s3IconUrl, formats, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, TINYMCE_CONFIG, times, durations, theServer, } from './constants'

import { Provider, connect, dispatch } from 'react-redux'
import  {store} from "./redux/store";

import { mapStateToProps, mapDispatchToProps } from './redux/containers2'

import { addStep, deleteStep, setUpdateModalData, setStepModalData, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, setContacts, setStepOccurrences } from './redux/actions'
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

@connect(mapStateToProps, mapDispatchToProps)
export class ProgramCalendar extends React.Component{
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            events:[],
            stepMethod:"",
            currentStepData:"",
            currentStepId:"",
            modalIsOpen: false,
            programStartDate:""
        }
    }


    getProgramStartDate = () => {
        var theUrl = "/api/programs/" + this.props.planId + "/";
        $.ajax({
          url: theUrl ,
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  programStartDate:data.startDate,

              })

          }.bind(this),
          error: function(xhr, status, err) {
            console.error(theUrl, status, err.toString());
          }.bind(this)
        });
      };

      componentWillReceiveProps = (nextProps) => {
          if (this.state.events != nextProps.events) {
              if (this.state.currentStepId != "") {
                  var newCurrentStepData = this.findObjectById(this.state.currentStepId, nextProps.events);
                  this.setState({
                      events: nextProps.events,
                      currentStepData: newCurrentStepData
                  })
              } else {
                   this.setState({ events: nextProps.events})
              }


          }
      };



        findObjectById (theId, theArray) {
        for (var i=0; theArray.length; i++ ) {
            if (theArray[i].id == theId) {
                return theArray[i]
            }
        }
    }

    componentDidMount = () => {
        //$(this.refs["ref_create"]).hide();
        //$(this.refs["ref_edit"]).hide();
        $(this.refs["ref_basic"]).hide();

        this.getProgramStartDate()

    };


    // I need to switch StepViewEditDeleteItem so that it gets a stepId and gets its own data and also gets its own eventInfo



    selectEvent = (event) => {

        this.setState({
            currentView: "Basic",
            currentStepId: event.id,
            currentStepData: event,

        },
            () => this.showBasic())

    };

    convertEventToWork = (theEvent) => {
        var convertedEvent = theEvent;
        convertedEvent.startDate = theEvent.startDate
    };



    createEvent = (slotInfo) => {
        var programStartDate = convertDate(this.state.programStartDate, 0, "dateFormat", "relativeTime");
        var eventStartDate = convertDate(slotInfo.start, 0, "dateFormat", "relativeTime" );

        var startDate = daysBetweenDates(programStartDate, eventStartDate, );
        var endDate = startDate;

        var startDate;
        this.setState({
            eventInfo:slotInfo,
                //currentView: "Edit",
            currentStepData:{programStartDate: this.state.programStartDate, startDate:startDate, endDate: endDate},
            currentStepId:""


        })

        store.dispatch(setStepModalData({modalIsOpen:true, data:{type:'TIME', frequency:'ONCE', programStartDate: this.state.programStartDate, startDate:startDate, endDate: endDate }}))
    };

    convertToSameTimeInCurrentTimezoneInDateForm (theDate) {
        var todaysDate = new Date();
        var tzDifference = todaysDate.getTimezoneOffset();
        var theConvertedDate = new Date(theDate.getTime() + tzDifference * 60 * 1000);
        return theConvertedDate
    }

    /*showCreate = () => {
        $(this.refs["ref_edit"]).hide();
        $(this.refs["ref_create"]).slideDown()
    };*/

    showEdit = () => {
        //$(this.refs["ref_create"]).hide();
        $(this.refs["ref_edit"]).slideDown()
    };

    showBasic = () => {
        //$(this.refs["ref_create"]).hide();
        $(this.refs["ref_basic"]).slideDown()
    };

    handleStepBasicCloseWindowClick = () => {
        $(this.refs["ref_basic"]).slideUp();

        this.setState({
            currentStepData:"",
            eventInfo:"",
            stepMethod:"",

        })

    };

    handleStepEditCloseWindowClick = () => {
        $(this.refs["ref_edit"]).slideUp();

        this.setState({
            currentStepData:"",
            eventInfo:"",
            stepMethod:"",

        })

    };

    handleStepCloseClick = () => {
            $(this.refs["ref_create"]).slideUp();
        this.setState({
            currentStepData:"",
            eventInfo:"",
            stepMethod:"",
        })

    };



    handleReloadItem = () => {
        this.props.reloadItem()
    };


/*
    handleFormSubmit = (step, callback) => {
        if (this.state.stepMethod == 'edit') {
            $.ajax({
                url: ("/api/steps/" + step.id + "/"),
                dataType: 'json',
                type: 'PATCH',
                data: step,
                success: callback,
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                    })
                }.bind(this)
            });
        }
        else if (this.state.stepMethod=='create') {
            $.ajax({
                url: ("/api/steps/"),
                dataType: 'json',
                type: 'POST',
                data: step,
                success: callback,
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                    })
                }.bind(this)
            });

        }
  };*/
  handleCurrentViewChanged = (currentView) => {

      this.setState({currentView:currentView})

  };


    render = () => {
        return (
            <div>

                <div className="ui row">&nbsp;</div>
                <div ref="ref_basic">
                    <StepViewEditDeleteItem parentId={this.props.planId}
                                            key={`${this.state.currentStepId}_edit`}
                                            currentView={this.state.currentView}
                                            isListNode={false}
                                            showCloseButton={true}
                                            apiUrl="/api/steps/"
                                            id={this.state.currentStepId}
                                            data={this.state.currentStepData}
                                            editable={true}
                                            currentViewChanged={this.handleCurrentViewChanged}
                                            closeClicked={this.handleStepBasicCloseWindowClick}
                                            reloadItem={this.handleReloadItem}
                                            serverErrors={this.state.serverErrors}

                                            />


            </div>
                {/*<div ref="ref_create">
                     <StepViewEditDeleteItem parentId={this.props.planId}
                                            key={`${this.state.currentStepId}_create`}
                                             currentView={this.state.currentView}

                                            isListNode={false}
                                            showCloseButton={true}
                                            apiUrl="/api/steps/"
                                            id={this.state.currentStepId}
                                            data={this.state.currentStepData}
                                            editable={true}
                                             currentViewChanged={this.handleCurrentViewChanged}
                                            closeClicked={this.handleStepCloseClick}
                                            reloadItem={this.handleReloadItem}
                                             serverErrors={this.state.serverErrors}


                                            />



            </div>*/}


                <div className="ui row">&nbsp;</div>

                <div className="calendarContainer">

                    <BigCalendar
                        className="calendarPadding"
                        popup
                        selectable
                        events={this.state.events}
                        startAccessor='absoluteStartDateTime'
                        endAccessor='absoluteEndDateTime'
                        allDayAccessor='isAllDay'
                        step={30}
                        timeslots={4}
                        formats={formats}
                        onSelectEvent={event => this.selectEvent(event)}
                        onSelectSlot={(slotInfo) => this.createEvent(slotInfo)}
                        views={["month", "week", "day", "agenda"]}
                    />

                </div>

                                </div>


        )
    }
}






export class TimeInput extends React.Component{
  constructor(props) {
    super(props);
  }

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
}
module.exports = { ProgramCalendar };