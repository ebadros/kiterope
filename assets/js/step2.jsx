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
var DatePicker = require('react-datepicker');
var moment = require('moment')
var ValidatedInput = require('./app')

var TinyMCEInput = require('react-tinymce-input');


require('react-datepicker/dist/react-datepicker.css');

export class StepCalendarComponent2 extends React.Component {
    constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>StepCalendarComponent2</div>
    );
  }
}

export class StepCalendarComponent3 extends StepCalendarComponent2 {
    render() {
        return (
            <div>StepCalendarComponent3</div>
        )
    }
}

// Component for adding, editing, deleting, and viewing Step objects
var StepCalendarComponent = React.createClass({
    

    setStepData: function() {
            console.log("inside setStepData")
            console.log("title is " + this.props.stepData.title)
            var startDateInIntegerForm = this.props.stepData.startDate;
            var endDateInIntegerForm = this.props.stepData.endDate;

            var planStartDateInDateForm = this.props.planStartDate;
            var planStartDateInMomentForm = moment(planStartDateInDateForm)

            var calculatedStartDate = moment(planStartDateInMomentForm, "DD-MM-YYYY").add(startDateInIntegerForm, 'days');
            var calculatedEndDate = moment(planStartDateInMomentForm, "DD-MM-YYYY").add(endDateInIntegerForm, 'days');
            this.setState({
            id: this.props.stepData.id,
            title: this.props.stepData.title,
            description: this.props.stepData.description,
            frequency: this.props.stepData.frequency,
            day01:this.props.stepData.day01,
            day02:this.props.stepData.day02,
            day03:this.props.stepData.day03,
            day04:this.props.stepData.day04,
            day05:this.props.stepData.day05,
            day06:this.props.stepData.day06,
            day07:this.props.stepData.day07,
            startDate:this.props.stepData.startDate,
            endDate:this.props.stepData.endDate,
            absoluteStartDate:calculatedStartDate,
            absoluteEndDate:calculatedEndDate,

            startTime:this.props.stepData.startTime,
            duration: this.props.stepData.duration,
            durationMetric: this.props.stepData.durationMetric,
            editFormIsOpen: false,
            editFormButtonText:"Edit",
            plan: this.props.planId,
            formSubmittedSuccessfully:false,
            monthlyDates: this.props.stepData.monthlyDates
        })
            clearInterval(this.state.intervalID);



      },

    componentWillReceiveProps: function() {

        if (this.props.stepData && this.props.method=="edit") {
            if (this.props.stepData.id != this.state.id) {
                $(this.refs["ref_stepForm"]).hide();

                $(this.refs["ref_createMenuBar"]).hide();

                this.setStepData()
                $(this.refs["ref_editMenuBar"]).slideDown();

                $(this.refs["ref_stepExistingInfo"]).slideDown();



            }
        } else if (this.props.method=="create") {

            if (this.props.eventInfo != this.state.eventInfo) {

                this.getInitialState()
                this.setState({eventInfo: this.props.eventInfo})
                this.setState({
                    absoluteStartDate: moment(this.props.eventInfo.start, "YYYY-MM-DD"),
                    absoluteEndDate: moment(this.props.eventInfo.start, "YYYY-MM-DD"),
                })

                $(this.refs["ref_editMenuBar"]).hide();
                $(this.refs["ref_createMenuBar"]).show();
                $(this.refs["ref_stepExistingInfo"]).hide();
                $(this.refs["ref_stepForm"]).slideDown();




            }
        }

    },


    componentDidMount: function() {
        $(this.refs["ref_step"]).hide();

        $(this.refs["ref_stepForm"]).hide();
        $(this.refs["ref_stepExistingInfo"]).hide();
        $(this.refs["ref_createMenuBar"]).hide();
        $(this.refs["ref_editMenuBar"]).hide();





        var self = this;
        //var intervalID = setInterval(this.setStepData, 2000);

        //this.setState({ intervalID:intervalID });


        if (this.props.method=="edit") {
            var refSuffix = "_" + this.props.stepId;

        }
        else if (this.props.method=="create") {
            var refSuffix = "";


        }

        if (!this.state.editFormIsOpen) {
            //$(this.refs["ref_stepForm" + refSuffix]).hide();
            //$(this.refs['ref_whichDays' + refSuffix]).hide();
            //$(this.refs['ref_whichDate' + refSuffix]).hide();

        }
        this.showAndHideUIElements(this.state.frequency)

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
                stepData:[],

                startTime:"",
                duration:"1",
                durationMetric:"Hour",

            }
        }
    ,



    handleSubmit: function(e) {

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
            }


        if (this.props.method=="edit") {
            formData.id = this.state.id
        }


        this.props.onFormSubmit(
            formData,
            function(data){

                if (this.props.method=="create") {
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
                }

                else if (this.props.method=="edit") {
                    this.setState({editFormIsOpen: false});
                    this.setState({editFormButtonText: "Edit"});
                    this.setState({formSubmittedSuccessfully: true});
                }
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

    if (this.props.method=="edit") {
            var refSuffix = "_" + this.props.stepId;
        }
        else if (this.props.method=="create") {
            var refSuffix = "";
        }
        if (this.state.formSubmittedSuccessfully == true ){
            console.log(this.state.formSubmittedSuccessfully);
            this.setState({formSubmittedSuccessfully: false})

        }

        if (this.props.method=="edit") {
            $(this.refs["ref_stepForm" + refSuffix]).slideToggle();
            $(this.refs["ref_editButton" + refSuffix]).toggle();
            $(this.refs["ref_deleteButton" + refSuffix]).toggle();
            $(this.refs["ref_stepExistingInfo" + refSuffix]).slideToggle();
        } else if (this.props.method=="create") {
            $(this.refs["ref_stepForm"]).slideToggle();
        }
    },

    showAndHideUIElements: function() {
        var frequencyValue = this.state.frequency;

        if (this.props.method=="edit") {
            var refSuffix = "_" + this.props.stepId;
        }

        else if (this.props.method=="create") {
            var refSuffix = "";
        }
        if (frequencyValue == "WEEKLY") {
            $(this.refs['ref_whichDays' + refSuffix]).show();
            $(this.refs['ref_whichDate' + refSuffix]).hide();
            $(this.refs['ref_dateSet' + refSuffix]).show();
            $(this.refs['ref_date' + refSuffix]).hide();



        } else if (frequencyValue == "ONCE") {
            $(this.refs['ref_whichDays' + refSuffix]).hide();
            $(this.refs['ref_whichDate' + refSuffix]).hide();
            $(this.refs['ref_dateSet' + refSuffix]).hide();
            $(this.refs['ref_date' + refSuffix]).show();


        } else if (frequencyValue == "MONTHLY") {
            $(this.refs['ref_whichDays' + refSuffix]).hide();
            $(this.refs['ref_whichDate' + refSuffix]).show();
            $(this.refs['ref_dateSet' + refSuffix]).show();
            $(this.refs['ref_date' + refSuffix]).hide();


        } else if (frequencyValue == "DAILY") {
            $(this.refs['ref_whichDays' + refSuffix]).hide();
            $(this.refs['ref_whichDate' + refSuffix]).hide();
            $(this.refs['ref_dateSet' + refSuffix]).show();
            $(this.refs['ref_date' + refSuffix]).hide();


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
        this.setState({description: e});
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
        if (this.props.stepMethod=="edit") {
            $(this.refs["ref_step"]).slideToggle();

            $.ajax({
                url: (theServer + "api/steps/" + this.state.id + "/"),
                dataType: 'json',
                type: 'DELETE',
                //data: step,
                success: function () {

                },
                error: function (xhr, status, err) {
                    console.error("https://127.0.0.1:8000/api/steps/" + this.state.id + "/", status, err.toString());
                }
            });
        }


    },
     clearPage: function(plan_id) {
        $(".fullPageDiv").slideToggle("slow", function () {
        hashHistory.push('/plans/' + this.props.stepId + '/steps')
            });

    },

    closeWindowButtonClicked: function() {
        this.getInitialState();
        $(this.refs["ref_step"]).slideUp();

    },


    componentDidUpdate(){
        if (this.props.method=="edit") {
            var refSuffix = "_" + this.props.stepId;
        }
        else if (this.props.method=="create") {
            var refSuffix = "";
        }
        let selectNode = $(this.refs["ref_frequency" + refSuffix]);
        selectNode.value = this.state.frequency;
                this.showAndHideUIElements();

    },

    render: function () {

        var planScheduleMetric = "Week";


        //if (this.state.formSubmittedSuccessfully == true ){
        //    this.toggleForm();

        //}
                let renderUpdatesList=React.createElement("");


        if (this.props.method=="edit") {
            var refSuffix = "_" + this.props.stepId;
            renderUpdatesList = React.createElement(<UpdatesList stepId={this.props.stepId}/>);


        }
        else if (this.props.method=="create") {
            var refSuffix = "";
        }

        if (this.state.editFormIsOpen) {

            //$(this.refs["ref_stepForm" + refSuffix]).slideDown();
            //$(this.refs["ref_stepExistingInfo" + refSuffix]).slideUp();

        }
        else {
            //$(this.refs["ref_stepForm" + refSuffix]).slideUp();
            //$(this.refs["ref_stepExistingInfo" + refSuffix]).slideDown();
        }
        return (
            <div ref='ref_step' key={refSuffix} >


                        <div ref="ref_createMenuBar" className="ui top attached purple large button" >
                            <div  className="ui grid">

                            <div className="left aligned eleven wide column">Step</div>
                                <div className="ui two wide column small smallPadding middle aligned" >&nbsp;</div>

                            <div ref={`ref_cancelButton`} className="ui two wide column small smallPadding middle aligned purple-inverted button"  onClick={this.cancelButtonClicked} >Cancel</div>
                                <div className="ui closeWindow" onClick={this.closeWindowButtonClicked}><i className="remove icon"></i></div>


                                </div>
                            </div>
                        <div ref="ref_editMenuBar"  className="ui top attached purple large button" >

                            <div className="ui grid">

                            <div className="left aligned eleven wide column">Step</div>
                            <div ref={`ref_editButton${refSuffix}`} className="ui two wide column small smallPadding middle aligned purple-inverted button"  onClick={this.editButtonClicked} >{this.state.editFormButtonText}</div>
                            <div ref={`ref_deleteButton${refSuffix}`} className="ui two wide column  small smallPadding middle aligned purple-inverted button"  onClick={this.deleteStep} >Delete</div>
                                <div className="ui closeWindow" onClick={this.closeWindowButtonClicked}><i className="remove icon"></i></div>


                                </div></div>
                    <div className="ui segment noBottomMargin noTopMargin">

<div ref="ref_stepExistingInfo">
                            <div className="row">
                                <h3>{this.state.title}</h3>
                            </div>
                            <div className="fluid row">Length: {this.state.durationMetric}</div>
                            <div className="fluid row" dangerouslySetInnerHTML={{__html: this.state.description}}/>

                        <div className="two wide column"><Link to={`/plans/${this.props.planId}/steps`}>

</Link></div>
                    </div>
                    <div className="sixteen wide row">

                    <div>

            <div ref="ref_stepForm"  className="ui form">
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
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleTitleChange}

                                    />


                            </div>
                        <div className="six wide column">&nbsp;</div>

                        </div>

                        <div className="ui row">
                            <div className="ten wide column">
                                <div className="field fluid">
                                    <label htmlFor="id_description">Description:</label>

                                    <TinyMCEInput name="description" id="id_description"
                                            value={this.state.description}
                                            tinymceConfig={{
                                              plugins: 'link image code media',
                                              menubar: "insert",
                                              toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | media'
                                            }}
                                            onChange={this.handleEditorChange}
                                          />


                            </div>
                        </div>
                            <div className="six wide column">&nbsp;</div>

                                        </div>


                        <div className="ui row">
                            <div className="three wide column">
                                <div className="field">
                                            <label htmlFor="id_frequency">Repeat?:</label>
                                            <select ref={`ref_frequency${refSuffix}`} id="id_frequency" name="frequency" value={this.state.frequency} onChange={this.handleFrequencyChange}>
                                                <option value="ONCE">Don't repeat</option>
                                                <option value="DAILY">Daily</option>
                                                <option value="WEEKLY">Weekly</option>
                                                <option value="MONTHLY">Monthly</option>
                                            </select>
                                        </div>
                            </div>
                        </div>

                         <div ref={`ref_dateSet${refSuffix}`} className="ui row">
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
                                <div ref={`ref_date${refSuffix}`} className="ui row">
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
                                     <TimeInput value={this.state.startTime} className="ui small input" name="startTime" id="id_startTimeNumber"
                                               onChange={this.handleStartTimeChange}/>
                                </div>
                            </div>
                            <div className="two wide column">
                                <div className="field">
                                    <label>&nbsp;</label>

                                    <select className="ui massive input middle aligned" name="amOrPm" id="id_amOrPm"
                                            onChange={this.handleStartTimeChange}>
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                            </div>
                            <div className="two wide column">
                                <div className="field">
                                    <label htmlFor="id_duration">For how long:</label>

                                    <input value={this.state.duration} className="ui mini input" name="duration" id="id_duration"
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
                                        </select>
                                    </div>
                                </div>


                            </div>
                        <div ref={`ref_whichDays${refSuffix}`} className="ui row">

                            <div className="ten wide column">
                                <div className="field fluid">
                                    <label>Select which days to schedule each week (based on
                                        a Monday start):</label>

                                    <div className="ui equal width  buttons ">
                                        <ToggleButton value={this.state.day01} id="id_day01" label="M"/>
                                        <ToggleButton value={this.state.day02} id="id_day02" label="T"/>
                                        <ToggleButton value={this.state.day03} id="id_day03" label="W"/>
                                        <ToggleButton value={this.state.day04} id="id_day04" label="Th"/>
                                        <ToggleButton value={this.state.day05} id="id_day05" label="F"/>
                                        <ToggleButton value={this.state.day06}id="id_day06" label="Sa"/>
                                        <ToggleButton value={this.state.day07} id="id_day07" label="Su"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div ref={`ref_whichDate${refSuffix}`} className="ui row">

                            <div className="six wide column">

                                <div className="field fluid">

                                    <label htmlFor="id_monthlyDates">What date(s) in a month would you like this to occur
                                        (1-30)?</label>
                                    <input type="text" name="monthlyDates" id="id_monthlyDates" value={this.state.monthlyDates} onChange={this.handleMonthlyDatesChange}/>

                                </div>

                            </div>
                        </div>


                        </div>




                    <div className="ui three column grid">
                                            <div className="ui row">&nbsp;</div>

                        <div className="ui row">
                            <div className="ui column">&nbsp;</div>

                            <div className="ui column"><a className="ui fluid button" onClick={this.closeForm}>Cancel</a></div>
                            <div className="ui column">
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


module.exports = StepCalendarComponent;