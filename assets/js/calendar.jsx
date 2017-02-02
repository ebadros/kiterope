var React = require('react');
var $  = require('jquery');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'

//import Datepicker from './Datepicker';
var Datetime = require('react-datetime');

import DatePicker  from 'react-datepicker';
import moment from 'moment';
var ValidatedInput = require('./app')
var TinyMCE = require('react-tinymce-input');
var MaskedInput = require('react-maskedinput');
import autobind from 'class-autobind'
var validator = require('validator');
import TimePicker from 'rc-time-picker';
import DynamicSelectButton2 from './base'
var Select = require('react-select');

// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';

var UpdatesList = require('./update');

var theServer = 'https://192.168.1.156:8000/'


const TINYMCE_CONFIG = {
  'language'  : 'en',
  'theme'     : 'modern',
  'toolbar'   : 'bold italic underline strikethrough hr | bullist numlist | link unlink | undo redo | spellchecker code',
  'menubar'   : false,
  'statusbar' : true,
  'resize'    : true,
  'plugins'   : 'link,spellchecker,paste',
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
    {value:'12:00', label: "1200am"},
    {value:'12:30', label: "1230am"},
    {value:'01:00', label: "100am"},
    {value:'01:30', label: "130am"},
    {value:'02:00', label: "200am"},
    {value:'02:30', label: "230am"},
    {value:'03:00', label: "300am"},
    {value:'03:30', label: "330am"},
    {value:'04:00', label: "400am"},
    {value:'04:30', label: "430am"},
    {value:'05:00', label: "500am"},
    {value:'05:30', label: "530am"},
    {value:'06:00', label: "600am"},
    {value:'06:30', label: "630am"},
    {value:'07:00', label: "700am"},
    {value:'07:30', label: "730am"},
    {value:'08:00', label: "800am"},
    {value:'08:30', label: "830am"},
    {value:'09:00', label: "900am"},
    {value:'09:30', label: "930am"},
    {value:'10:00', label: "1000am"},
    {value:'10:30', label: "1030am"},
    {value:'11:00', label: "1100am"},
    {value:'11:30', label: "1130am"},
    {value:'12:00', label: "1200pm"},
    {value:'12:30', label: "1230pm"},
    {value:'13:00', label: "100pm"},
    {value:'13:30', label: "130pm"},
    {value:'14:00', label: "200pm"},
    {value:'14:30', label: "230pm"},
    {value:'15:00', label: "300pm"},
    {value:'15:30', label: "330pm"},
    {value:'16:00', label: "400pm"},
    {value:'16:30', label: "430pm"},
    {value:'17:00', label: "500pm"},
    {value:'17:30', label: "530pm"},
    {value:'18:00', label: "600pm"},
    {value:'18:30', label: "630pm"},
    {value:'19:00', label: "700pm"},
    {value:'19:30', label: "730pm"},
    {value:'20:00', label: "800pm"},
    {value:'20:30', label: "830pm"},
    {value:'21:00', label: "900pm"},
    {value:'21:30', label: "930pm"},
    {value:'22:00', label: "1000pm"},
    {value:'22:30', label: "1030pm"},
    {value:'23:00', label: "1100pm"},
    {value:'23:30', label: "1130pm"},
    ]





export class StepCalendarComponent extends React.Component {
  constructor(props) {
      super(props);
      autobind(this);



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
                absoluteStartDate:moment(this.props.planStartDate, "YYYY-MM-DD"),
                absoluteEndDate: moment(this.props.planStartDate, "YYYY-MM-DD"),
                stepData:[],
                startTime: moment("09:00", "HH:mm"),

                duration:"1",
                durationMetric:"Hour",
                editFormButtonText:"Edit"

            })
  }


      getStepForm() {
          var descriptionEditor = this.getDescriptionEditor()

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



                                        <UpdatesList stepId={this.state.id}/>

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
        }

    cancelButtonClicked = () => {
       this.closeWindowButtonClicked()
    }

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
                absoluteStartDate:moment(this.props.planStartDate, "YYYY-MM-DD"),
                absoluteEndDate: moment(this.props.planStartDate, "YYYY-MM-DD"),
                stepData:[],
                startTime:moment("900", "hmm").format("HH:mm") ,
                duration:"1",
                durationMetric:"Hour",

            })


        }

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

        var absoluteStartDate = moment(this.state.absoluteStartDate).format("YYYY-MM-DD");
        var absoluteEndDate = moment(this.state.absoluteEndDate).format("YYYY-MM-DD");
        //var absoluteStartDate = this.state.absoluteStartDate
        //var absoluteEndDate = this.state.absoluteEndDate

        var absoluteStartDateInMomentForm = moment(absoluteStartDate);
        var absoluteEndDateInMomentForm = moment(absoluteEndDate);

        var planStartDateInDateForm = this.props.planStartDate;
        var planStartDateInMomentForm = moment(planStartDateInDateForm)
        var startDate = absoluteStartDateInMomentForm.diff(planStartDateInMomentForm, 'days');
        var endDate = absoluteEndDateInMomentForm.diff(planStartDateInMomentForm, 'days');

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
            }


        if (this.props.method=="edit") {
            formData.id = this.state.id
        }


        this.props.onFormSubmit(
            formData,
            function(data){
                console.log("callback received")
                this.props.methodChange({isVisible:false})

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
                    })

                if (this.props.method=="edit") {
                    this.setState({editFormButtonText: "Edit"});
                }
        }.bind(this));

    }


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
    }

    handleFrequencyChange = (e) => {
        this.setState({frequency: e.target.value});


    }

    handleTitleChange = (value) => {
        console.log("handleTitleChange " + this.state.description)

            this.setState({title: value})

    }




    handleAbsoluteStartDateChange = (date) =>  {
        this.setState({absoluteStartDate: date});
  }

    handleAbsoluteEndDateChange = (date) => {

        this.setState({absoluteEndDate: date});
  }


   handleEditorChange = (e) => {
        this.setState({description: e});
  }

    handleDay01Change = (e) => {
        this.setState({day01: e.target.value});
    }

    handleDay02Change = (e) => {
        this.setState({day02: e.target.value});
    }

    handleDay03Change = (e) => {
        this.setState({day03: e.target.value});
    }

    handleDay04Change = (e) => {
        this.setState({day04: e.target.value});
    }

    handleDay05Change = (e) => {

        this.setState({day05: e.target.value});
    }

    handleDay06Change = (e) => {

        this.setState({day06: e.target.value});
    }

    handleDay07Change = (e) => {

        this.setState({day07: e.target.value});
    }

    handleStartTimeChange = (e) => {

        this.setState({startTime:e});
    }

    handleDurationChange = (e) => {

        this.setState({duration: e});
    }

    handleDurationMetricChange = (e) => {
        this.setState({durationMetric: e.target.value});
    }

    handleMonthlyDatesChange = (e) => {
        this.setState({monthlyDates: e.target.value});
    }


     clearPage(plan_id) {
        $(".fullPageDiv").slideToggle("slow", function () {
        history.push('/plans/' + this.props.stepId + '/steps')
            });

    }

    closeWindowButtonClicked = () => {

        this.props.methodChange({isVisible:false})


        this.clearState();
        //$(this.refs["ref_step_" + this.props.method]).slideUp();

    }



    componentDidUpdate(){

        let selectNode = $(this.refs["ref_frequency"]);
        selectNode.value = this.state.frequency;
                this.showAndHideUIElements();

    }



    revealUIElements = () => {



    }


    getMenubar = () => {
        return(
            <div ref="ref_menubar_create" className="ui top attached purple large button" >
                            <div  className="ui grid">

                            <div className="left aligned eleven wide column">Step</div>
                                <div className="ui two wide column small smallPadding middle aligned" >&nbsp;</div>

                            <div ref="ref_cancelButton" className="ui two wide column small smallPadding middle aligned purple-inverted button"  onClick={this.closeWindowButtonClicked}> Cancel</div>
                                <div className="ui closeWindow" onClick={this.closeWindowButtonClicked}><i className="remove icon"></i></div>


                                </div>
                            </div>
        )

    }


    getExistingInfo = () => {
        return ""
    }

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


};

export class StepEditCalendarComponent extends StepCalendarComponent {
    constructor(props) {
        super(props);
        autobind(this);
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
                absoluteStartDate:moment(this.props.planStartDate, "YYYY-MM-DD"),
                absoluteEndDate: moment(this.props.planStartDate, "YYYY-MM-DD"),
                stepData:[],
                startTime:"",
                duration:"1",
                durationMetric:"Hour",
                editFormButtonText:"Edit",

            })





    }


    cancelButtonClicked = () => {
        if($(this.refs["ref_stepForm_edit"]).is(":visible"))  {
            $(this.refs["ref_stepForm_edit"]).slideUp()
            $(this.refs["ref_stepExistingInfo"]).slideDown()
            this.setState ({ editFormButtonText: "Edit"})
            this.setStepData(this.props.stepData)


        }
    }



    setStepData(stepData) {
            var startDateInIntegerForm = stepData.startDate;
            var endDateInIntegerForm = stepData.endDate;

            var planStartDateInDateForm = this.props.planStartDate;
            console.log("this.props.planStartDate " + planStartDateInDateForm)
            var planStartDateInMomentForm = moment(planStartDateInDateForm)

            var calculatedStartDate = moment(planStartDateInMomentForm, "MM-DD-YYYY").add(startDateInIntegerForm, 'days');
            var calculatedEndDate = moment(planStartDateInMomentForm, "MM-DD-YYYY").add(endDateInIntegerForm, 'days');

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

    }


    editButtonClicked = () => {

        if($(this.refs["ref_stepForm_edit"]).is(":visible"))  {
            $(this.refs["ref_stepForm_edit"]).slideUp()
            $(this.refs["ref_stepExistingInfo"]).slideDown()
            this.setState ({ editFormButtonText: "Edit"})
            this.setStepData(this.props.stepData)



        } else {
            $(this.refs["ref_stepForm_edit"]).slideDown()
            $(this.refs["ref_stepExistingInfo"]).slideUp()

            this.setState({ editFormButtonText: "Cancel"})


        }
    }


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
    }

    revealUIElements = () => {


    }


    hideComponent = () => {
        this.props.methodChange({isVisible:false})

    }

    deleteStep = () => {

            $.ajax({
                url: theServer + "api/steps/" + this.state.id + "/",
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
        }


        componentWillReceiveProps = (nextProps) => {

            if (this.props.stepData != nextProps.stepData ) {
                    this.setStepData(nextProps.stepData)
                }

    }

    getMenubar() {

                        return(<div ref="ref_menubar_edit" className="ui top attached purple large button" >

                            <div className="ui grid">

                            <div className="left aligned eleven wide column">Step</div>
                            <div ref="ref_editButton" className="ui two wide column small smallPadding middle aligned purple-inverted button"  onClick={this.editButtonClicked} > {this.state.editFormButtonText} </div>
                            <div ref="ref_deleteButton" className="ui two wide column  small smallPadding middle aligned purple-inverted button"  onClick={() => this.deleteStep()} >Delete</div>
                                <div className="ui closeWindow" onClick={this.closeWindowButtonClicked}><i className="remove icon"></i></div>


                                </div></div>)
    }



    closeWindowButtonClicked = () => {
        this.props.methodChange({isVisible:false})


        this.clearState();
         $(this.refs["ref_stepForm_edit"]).slideUp()
        $(this.refs["ref_stepExistingInfo"]).slideDown()
            this.setState ({ editFormButtonText: "Edit"})
    }




}

export class ToggleButton  extends React.Component{

    constructor(props) {
        super(props);
        this.state = { checked: this.props.value }

  }

    componentDidMount() {
        var self = this;
    }



    handleChange (e)  {
        var currentState = this.state.checked;

        if (currentState == "true") {
            this.setState({ checked: "false"});
        } else {
            this.setState({ checked: "true"});

        }
    }


  render() {
    var btnClass = 'ui toggle button';
    if (this.state.checked == "true") btnClass += ' active';
    return <button className={btnClass}  onClick={this.handleChange}>{this.props.label}</button>;
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
};

