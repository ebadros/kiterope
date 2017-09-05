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
import {PlanHeader, StepList , ToggleButton, SimpleStepForm} from './step';
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

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

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
        var theUrl = "api/programs/" + this.props.planId + "/";
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
        $(this.refs["ref_create"]).hide();
        $(this.refs["ref_edit"]).hide();
        this.getProgramStartDate()

    };


    // I need to switch StepViewEditDeleteItem so that it gets a stepId and gets its own data and also gets its own eventInfo



    selectEvent = (event) => {

        this.setState({
            currentView: "Edit",
            currentStepId: event.id,
            currentStepData: event,

        },
            () => this.showEdit())

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
                currentView: "Edit",
            currentStepData:{programStartDate: this.state.programStartDate, startDate:startDate, endDate: endDate},
            currentStepId:""


        },
            () => this.showCreate())
    };

    convertToSameTimeInCurrentTimezoneInDateForm (theDate) {
        var todaysDate = new Date();
        var tzDifference = todaysDate.getTimezoneOffset();
        var theConvertedDate = new Date(theDate.getTime() + tzDifference * 60 * 1000);
        return theConvertedDate
    }

    showCreate = () => {
        $(this.refs["ref_edit"]).hide();
        $(this.refs["ref_create"]).slideDown()
    };

    showEdit = () => {
        $(this.refs["ref_create"]).hide();
        $(this.refs["ref_edit"]).slideDown()
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



    handleFormSubmit = (step, callback) => {
        if (this.state.stepMethod == 'edit') {
            $.ajax({
                url: ("api/steps/" + step.id + "/"),
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
                url: ("api/steps/"),
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
  };
  handleCurrentViewChanged = (currentView) => {

      this.setState({currentView:currentView})

  };


    render = () => {
        return (
            <div>

                <div className="ui row">&nbsp;</div>
                <div ref="ref_edit">
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
                                            closeClicked={this.handleStepEditCloseWindowClick}
                                            reloadItem={this.handleReloadItem}
                                            serverErrors={this.state.serverErrors}

                                            />


            </div>
                <div ref="ref_create">
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

                    {/*
                <StepCalendarComponent
                    planStartDate={this.state.planStartDate}
                    planId={this.props.planId}
                    eventInfo={this.state.eventInfo}
                    onFormSubmit={this.handleFormSubmit}
                    stepMethod="create"
                    methodChange={this.handleStepCloseWindowClick}

            />*/}

            </div>


                <div className="ui row">&nbsp;</div>

                <div className="calendarContainer">

                    <BigCalendar
                        className="calendarPadding"
                        popup
                        selectable
                        events={this.state.events}
                        startAccessor='absoluteStartDateForCalendar'
                        endAccessor='absoluteEndDateForCalendar'
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




export class StepCalendarComponent extends React.Component {
  constructor(props) {
      super(props);
      autobind(this);
      this.state = {
          title: '',
                description: "",
                frequency:'ONCE',
                day01:"false",
                day02:"false",
                day03:"false",
                day04:"false",
                day05:"false",
                day06:"false",
                day07:"false",
                monthlyDates:"",
                absoluteStartDate:moment(this.props.programStartDate, "YYYY-MM-DD"),
                absoluteEndDate: moment(this.props.programStartDate, "YYYY-MM-DD"),
                stepData:[],
                startTime: moment("09:00", "HH:mm"),

                duration:"1",
                durationMetric:"Hour",
                editFormButtonText:"Edit"}



  }

  componentWillMount () {
      this.setState({
                title: '',
                description: "",
                frequency:'ONCE',
                day01:"false",
                day02:"false",
                day03:"false",
                day04:"false",
                day05:"false",
                day06:"false",
                day07:"false",
                monthlyDates:"",
                absoluteStartDate:moment(this.props.programStartDate, "YYYY-MM-DD"),
                absoluteEndDate: moment(this.props.programStartDate, "YYYY-MM-DD"),
                stepData:[],
                startTime: moment("09:00", "HH:mm"),

                duration:"1",
                durationMetric:"Hour",
                editFormButtonText:"Edit"

            })
  }


      getStepForm() {
          var descriptionEditor = this.getDescriptionEditor();

          return (<div ref={`ref_stepForm_${this.props.method}`} className="ui form">
                <form onSubmit={this.handleSubmit}>

                    <div className="ui grid">

                    <div className="ui row">
                            <div className="ten wide column">
                                <input type="hidden" name="plan" id="id_plan" value={this.props.planId}/>

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
                        {/*  <div className="ui row">
                            <div className="ten wide column">
                                <div className="field fluid">
                                    <label htmlFor="id_description">Description:</label>
                                    <TinyMCE name="description"
                                             value={this.state.myDescription}
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

                                        </div> */}


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

                         <div ref="ref_dateSet" className="ui row">
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

                                            <DatePicker selected={this.state.absoluteStartDate} onChange={this.handleAbsoluteStartDateChange} />
                                            </div>
                                        </div>
                                    </div>
                        <div className="ui row">
                            <div className="three wide column">
                                <div className="field">
                                    <label htmlFor="id_startTime">Start Time:</label>
                                    <Select value={this.state.startTime}  onChange={this.handleStartTimeChange} name="startTime" options={times} />

                                    {/*<TimePicker value={this.state.startTime} defaultValue={moment("09:00", "HH:mm")}  showSecond={false} onChange={this.handleStartTimeChange} />
                                    <TimeInput value={this.state.startTime} className="ui small input" name="startTime" id="id_startTimeNumber"
                                               onChange={this.handleStartTimeChange}/>*/}
                                </div>
                            </div>

                            <div className="five wide column">
                                <div className="field">
                                    <label htmlFor="id_duration">For how long:</label>

                                    {/* <input value={this.state.duration} className="ui mini input" name="duration" id="id_duration"
                                           onChange={this.handleDurationChange}/>
                                </div>
                                                            </div>

                                <div className="three wide column">
                                    <div className="field">
                                        <label>&nbsp;</label>

                                       <select className="ui massive input middle aligned" value={this.state.durationMetric} name="durationMetric" id="id_durationMetric"
                                                onChange={this.handleDurationMetricChange}>

                                            <option value="MINUTES">Minutes</option>
                                            <option value="HOURS">Hours</option>
                                        </select>*/}
                                                                <Select value={this.state.duration}  name="duration" options={durations} onChange={this.handleDurationChange} />

                                    </div>
                                </div>


                            </div>
                        <div ref="ref_whichDays" className="ui row">

                            <div className="ten wide column">
                                <div className="field fluid">
                                    <label>Select which days to schedule each week (based on
                                        a Monday start):</label>

                                    <div className="ui equal width fluid buttons ">
                                        <ToggleButton id="id_day01" label="M" value={this.state.day01} callback={this.handleDay01Change.bind(this)} />
                                        <ToggleButton id="id_day02" label="T" value={this.state.day02} callback={this.handleDay02Change.bind(this)} />
                                        <ToggleButton id="id_day03" label="W" value={this.state.day03} callback={this.handleDay03Change.bind(this)} />
                                        <ToggleButton id="id_day04" label="Th" value={this.state.day04} callback={this.handleDay04Change.bind(this)} />
                                        <ToggleButton id="id_day05" label="F" value={this.state.day05} callback={this.handleDay05Change.bind(this)} />
                                        <ToggleButton id="id_day06" label="Sa" value={this.state.day06} callback={this.handleDay06Change.bind(this)} />
                                        <ToggleButton id="id_day07" label="Su" value={this.state.day07} callback={this.handleDay07Change.bind(this)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div ref="ref_whichDate" className="ui row">

                            <div className="six wide column">

                                <div className="field fluid">

                                    <label htmlFor="id_monthlyDates">What date(s) in a month would you like this to occur
                                        (1-30)?</label>
                                    <input type="text" name="monthlyDates" id="id_monthlyDates" value={this.state.monthlyDates} onChange={this.handleMonthlyDatesChange}/>

                                </div>

                            </div>
                        </div>


                        </div>



                                        <UpdatesList stepId={this.state.id} updates={this.state.updates}/>

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
      }

    componentWillReceiveProps = (nextProps) => {
                if (this.props.eventInfo != nextProps.eventInfo ) {
                    this.setState ({
                        eventInfo: nextProps.eventInfo,
                        absoluteStartDate: moment(nextProps.eventInfo.start, "YYYY-MM-DD"),
                        absoluteEndDate: moment(nextProps.eventInfo.start, "YYYY-MM-DD"),
                    })
                }
        };

    cancelButtonClicked = () => {
       this.closeWindowButtonClicked()
    };

    componentDidMount() {
    //$(this.refs["ref_menubar_" + this.props.method]).slideDown();
        //$(this.refs["ref_step_"  + this.props.method]).slideDown();

        this.showAndHideUIElements(this.state.frequency)

    }



    clearState = () => {
            this.setState({
                title: '',
                description: "",
                frequency:'ONCE',
                day01:"false",
                day02:"false",
                day03:"false",
                day04:"false",
                day05:"false",
                day06:"false",
                day07:"false",
                monthlyDates:"",
                absoluteStartDate:moment(this.props.programStartDate, "YYYY-MM-DD"),
                absoluteEndDate: moment(this.props.programStartDate, "YYYY-MM-DD"),
                stepData:[],
                startTime:moment("900", "hmm").format("HH:mm") ,
                duration:"1",
                durationMetric:"Hour",

            })


        };

        getDescriptionEditor() {
                if (this.state.description == null) {
                    return ("")
                } else {
                    return (<div className="ui row">
                        <div className="ten wide column">
                            <div className="field fluid">
                                <label htmlFor="id_description">Description:</label>
                                <TinyMCE name="description"
                                         value={this.state.description}
                                         tinymceConfig={TINYMCE_CONFIG}
                                         onChange={this.handleEditorChange}
                                />


                            </div>
                        </div>
                        <div className="six wide column">&nbsp;</div>

                    </div>)
                }
            }





    handleSubmit = (event) => {

        event.preventDefault();


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

        var absoluteStartDate = moment(this.state.absoluteStartDate).format("MMM DD, YYYY");
        var absoluteEndDate = moment(this.state.absoluteEndDate).format("MMM DD, YYYY");
        //var absoluteStartDate = this.state.absoluteStartDate
        //var absoluteEndDate = this.state.absoluteEndDate

        var absoluteStartDateInMomentForm = moment(absoluteStartDate);
        var absoluteEndDateInMomentForm = moment(absoluteEndDate);

        var programStartDateInDateForm = this.props.programStartDate;
        var programStartDateInMomentForm = moment(programStartDateInDateForm);
        var startDate = absoluteStartDateInMomentForm.diff(programStartDateInMomentForm, 'days');
        var endDate = absoluteEndDateInMomentForm.diff(programStartDateInMomentForm, 'days');

        //var startDate = absoluteStartDate.diff(planStartDateInMomentForm, 'days') + 2;
        //var endDate = absoluteEndDate.diff(planStartDateInMomentForm, 'days') + 2;



        var formData = {
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
                plan:this.props.planId,
            };


        if (this.props.method=="edit") {
            formData.id = this.state.id
        }


        this.props.onFormSubmit(
            formData,
            function(data){
                console.log("callback received");
                this.props.methodChange({isVisible:false});

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
                        absoluteStartDate:this.props.programStartDate,
                        absoluteEndDate:this.props.programStartDate,
                        startTime:"",
                        duration:"1",
                        durationMetric:"Hour",
                    });

                if (this.props.method=="edit") {
                    this.setState({editFormButtonText: "Edit"});
                }
        }.bind(this));

    };


    showAndHideUIElements = () => {
        var frequencyValue = this.state.frequency;


        if (frequencyValue == "WEEKLY") {
            $(this.refs['ref_whichDays']).show();
            $(this.refs['ref_whichDate']).hide();
            $(this.refs['ref_dateSet']).show();
            $(this.refs['ref_date']).hide();



        } else if (frequencyValue == "ONCE") {
            $(this.refs['ref_whichDays']).hide();
            $(this.refs['ref_whichDate']).hide();
            $(this.refs['ref_dateSet']).hide();
            $(this.refs['ref_date']).show();


        } else if (frequencyValue == "MONTHLY") {
            $(this.refs['ref_whichDays']).hide();
            $(this.refs['ref_whichDate']).show();
            $(this.refs['ref_dateSet']).show();
            $(this.refs['ref_date']).hide();


        } else if (frequencyValue == "DAILY") {
            $(this.refs['ref_whichDays']).hide();
            $(this.refs['ref_whichDate']).hide();
            $(this.refs['ref_dateSet']).show();
            $(this.refs['ref_date']).hide();


        }
    };

    handleFrequencyChange = (e) => {
        this.setState({frequency: e.target.value});


    };

    handleTitleChange = (value) => {
        console.log("handleTitleChange " + this.state.description);

            this.setState({title: value})

    };




    handleAbsoluteStartDateChange = (date) =>  {
        this.setState({absoluteStartDate: date});
  };

    handleAbsoluteEndDateChange = (date) => {

        this.setState({absoluteEndDate: date});
  };


   handleEditorChange = (e) => {
        this.setState({description: e});
  };

    handleDay01Change = (e) => {
        this.setState({day01: e.target.value});
    };

    handleDay02Change = (e) => {
        this.setState({day02: e.target.value});
    };

    handleDay03Change = (e) => {
        this.setState({day03: e.target.value});
    };

    handleDay04Change = (e) => {
        this.setState({day04: e.target.value});
    };

    handleDay05Change = (e) => {

        this.setState({day05: e.target.value});
    };

    handleDay06Change = (e) => {

        this.setState({day06: e.target.value});
    };

    handleDay07Change = (e) => {

        this.setState({day07: e.target.value});
    };

    handleStartTimeChange = (e) => {

        this.setState({startTime:e});
    };

    handleDurationChange = (e) => {

        this.setState({duration: e});
    };

    handleDurationMetricChange = (e) => {
        this.setState({durationMetric: e.target.value});
    };

    handleMonthlyDatesChange = (e) => {
        this.setState({monthlyDates: e.target.value});
    };


     clearPage(plan_id) {
        $(".fullPageDiv").slideToggle("slow", function () {
        history.push('/plans/' + this.props.stepId + '/steps')
            });

    }

    closeWindowButtonClicked = () => {

        this.props.methodChange({isVisible:false});


        this.clearState();
        //$(this.refs["ref_step_" + this.props.method]).slideUp();

    };



    componentDidUpdate(){

        let selectNode = $(this.refs["ref_frequency"]);
        selectNode.value = this.state.frequency;
                this.showAndHideUIElements();

    }



    revealUIElements = () => {



    };


    getMenubar = () => {
        return(
            <div ref="ref_menubar_create" className="ui top attached purple large button" >
                            <div  className="ui grid">

                            <div className="left aligned eleven wide column">Step</div>
                                <div className="ui two wide column small smallPadding middle aligned" >&nbsp;</div>

                            <div ref="ref_cancelButton" className="ui two wide column small smallPadding middle aligned raspberry-inverted button"  onClick={this.closeWindowButtonClicked}> Cancel</div>
                                <div className="ui closeWindow" onClick={this.closeWindowButtonClicked}><i className="remove icon"></i></div>


                                </div>
                            </div>
        )

    };


    getExistingInfo = () => {
        return ""
    };

    render() {
        var menubar = this.getMenubar();
        var existingInfo = this.getExistingInfo();
                var stepForm = this.getStepForm();




        var planScheduleMetric = "Week";


        //if (this.state.formSubmittedSuccessfully == true ){
        //    this.toggleForm();

        //}
        let renderUpdatesList=React.createElement("");


        return (
            <div ref={`ref_step_${this.props.method}`} key="stepComponent" >
                {menubar}


                    <div className="ui segment noBottomMargin noTopMargin">
                        {existingInfo}

                    <div className="sixteen wide row">

                    <div>

                        {stepForm}
                        </div>
                </div>

                        </div>


                        </div>

        )
    }


}
export class StepEditCalendarComponent extends StepCalendarComponent {
    constructor(props) {
        super(props);
        autobind(this);
         this.state = {
                title: '',
                description: "",
                frequency:'ONCE',
                day01:"false",
                day02:"false",
                day03:"false",
                day04:"false",
                day05:"false",
                day06:"false",
                day07:"false",
                monthlyDates:"",
                absoluteStartDate:moment(this.props.programStartDate, "YYYY-MM-DD"),
                absoluteEndDate: moment(this.props.programStartDate, "YYYY-MM-DD"),
                stepData:[],
                startTime:"",
                duration:"1",
                durationMetric:"Hour",
                editFormButtonText:"Edit",

            }
    }

    cancelButtonClicked = () => {
        if($(this.refs["ref_stepForm_edit"]).is(":visible"))  {
            $(this.refs["ref_stepForm_edit"]).slideUp();
            $(this.refs["ref_stepExistingInfo"]).slideDown();
            this.setState ({ editFormButtonText: "Edit"});
            this.setStepData(this.props.stepData)


        }
    };



    setStepData(stepData) {
            var startDateInIntegerForm = stepData.startDate;
            var endDateInIntegerForm = stepData.endDate;

            var programStartDateInDateForm = this.props.programStartDate;
            console.log("this.props.programStartDate " + programStartDateInDateForm);
            var programStartDateInMomentForm = moment(programStartDateInDateForm);

            var calculatedStartDate = moment(programStartDateInMomentForm, "MM-DD-YYYY").add(startDateInIntegerForm, 'days');
            var calculatedEndDate = moment(programStartDateInMomentForm, "MM-DD-YYYY").add(endDateInIntegerForm, 'days');

            this.setState({
                stepData: stepData,
            id: stepData.id,
            title: stepData.title,
            description: stepData.description,

            frequency: stepData.frequency,
            day01:stepData.day01,
            day02:stepData.day02,
            day03:stepData.day03,
            day04:stepData.day04,
            day05:stepData.day05,
            day06:stepData.day06,
            day07:stepData.day07,
            startDate:stepData.startDate,
            endDate:stepData.endDate,
            absoluteStartDate:calculatedStartDate,
            absoluteEndDate:calculatedEndDate,

            startTime:stepData.startTime,
            duration: stepData.duration,
            durationMetric: stepData.durationMetric,
            editFormButtonText:"Edit",
            plan: this.props.planId,
            formSubmittedSuccessfully:false,
            monthlyDates: stepData.monthlyDates
        })



      }


    componentDidMount = () => {
                $(this.refs["ref_stepForm_edit"]).hide();
        this.setState({

                title: '',
                description: "",
                frequency:'ONCE',
                day01:"false",
                day02:"false",
                day03:"false",
                day04:"false",
                day05:"false",
                day06:"false",
                day07:"false",
                monthlyDates:"",
                absoluteStartDate:moment(this.props.programStartDate, "YYYY-MM-DD"),
                absoluteEndDate: moment(this.props.programStartDate, "YYYY-MM-DD"),
                stepData:[],
                startTime:"",
                duration:"1",
                durationMetric:"Hour",
                editFormButtonText:"Edit",

            }

        )

    };


    editButtonClicked = () => {

        if($(this.refs["ref_stepForm_edit"]).is(":visible"))  {
            $(this.refs["ref_stepForm_edit"]).slideUp();
            $(this.refs["ref_stepExistingInfo"]).slideDown();
            this.setState ({ editFormButtonText: "Edit"});
            this.setStepData(this.props.stepData)



        } else {
            $(this.refs["ref_stepForm_edit"]).slideDown();
            $(this.refs["ref_stepExistingInfo"]).slideUp();

            this.setState({ editFormButtonText: "Cancel"})


        }
    };


    getExistingInfo = () => {
        return(<div ref="ref_stepExistingInfo">
                            <div className="row">
                                <h3>{this.state.title}</h3>
                            </div>
                            <div className="fluid row">Length: {this.state.durationMetric}</div>
                            <div className="fluid row" dangerouslySetInnerHTML={{__html: this.state.description}}/>

                        <div className="two wide column"><Link to={`/plans/${this.props.planId}/steps`}>

</Link></div>
                    </div>)
    };

    revealUIElements = () => {


    };


    hideComponent = () => {
        this.props.methodChange({isVisible:false})

    };

    deleteStep = () => {

            $.ajax({
                url: "/api/steps/" + this.state.id + "/",
                dataType: 'json',
                type: 'DELETE',
                //data: step,
                success: () => {
                    this.hideComponent()


                },
                error: function (xhr, status, err) {
                    console.error("https://127.0.0.1:8000/api/steps/" + this.state.id + "/", status, err.toString());
                }
            });
        };


        componentWillReceiveProps = (nextProps) => {

            if (this.props.stepData != nextProps.stepData ) {
                    this.setStepData(nextProps.stepData)
                }

    };

    getMenubar() {

                        return(<div ref="ref_menubar_edit" className="ui top attached purple large button" >

                            <div className="ui grid">

                            <div className="left aligned eleven wide column">Step</div>
                            <div ref="ref_editButton" className="ui two wide column small smallPadding middle aligned raspberry-inverted button"  onClick={this.editButtonClicked} > {this.state.editFormButtonText} </div>
                            <div ref="ref_deleteButton" className="ui two wide column  small smallPadding middle aligned raspberry-inverted button"  onClick={() => this.deleteStep()} >Delete</div>
                                <div className="ui closeWindow" onClick={this.closeWindowButtonClicked}><i className="remove icon"></i></div>


                                </div></div>)
    }



    closeWindowButtonClicked = () => {
        this.props.methodChange({isVisible:false});


        this.clearState();
         $(this.refs["ref_stepForm_edit"]).slideUp();
        $(this.refs["ref_stepExistingInfo"]).slideDown();
            this.setState ({ editFormButtonText: "Edit"})
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
module.exports = { StepCalendarComponent, StepEditCalendarComponent, ProgramCalendar };