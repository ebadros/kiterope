var React = require('react');
let ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {ImageUploader, Breadcrumb,  ProgramViewEditDeleteItem, FormAction, Sidebar, FormHeaderWithActionButton, DetailPage} from './base';
import autobind from 'class-autobind'
import DatePicker  from 'react-datepicker';
require('react-datepicker/dist/react-datepicker.css');

import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'



var Datetime = require('react-datetime');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
var MaskedInput = require('react-maskedinput');
var classNames = require('classnames');
import validator from 'validator';
import { ValidatedInput, KSSelect } from './app'
import { Funnybar, SearchPage } from './search'

import { StandardSetOfComponents, ErrorReporter, Footer} from './accounts'

import { Provider, connect, dispatch } from 'react-redux'
import  {store} from "./redux/store";

import { mapStateToProps, mapDispatchToProps } from './redux/containers2'

import {StepOccurrenceItem, StepOccurrenceList } from './stepOccurrence'

import { theServer, periodOptions, stepOccurrenceTypeOptions, s3IconUrl, formats, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, programScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, viewableByOptions, customStepModalStyles, notificationSendMethodOptions, TINYMCE_CONFIG } from './constants'
var moment = require('moment');
import { updateStep, removePlan, setDailyPeriod, deleteContact, setMessageWindowVisibility, setCurrentContact, addPlan, addStep, updateProgram, deleteStep, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, addGoal, updateGoal, deleteGoal, setContacts, setStepOccurrences } from './redux/actions'

import {
  ShareButtons,
  ShareCounts,
  generateShareIcon
} from 'react-share';

const {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
  VKShareButton
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');
const LinkedinIcon = generateShareIcon('linkedin');
const PinterestIcon = generateShareIcon('pinterest');
const VKIcon = generateShareIcon('vk');

$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    }
});

Date.prototype.addDays = function(days) {
   this.setDate(this.getDate() + parseInt(days));
   return this;
 };

 Date.prototype.subtractDays = function(days) {
   this.setDate(this.getDate() - parseInt(days));
   return this;
 };
function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

@connect(mapStateToProps, mapDispatchToProps)
export class DailyList extends React.Component{
     constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[],
            startDate:moment(),
            endDate:moment(),
            period:"TODAY",
            periodRangeStartString: new Date().toDateString(),
            periodRangeEndString: new Date().toDateString(),
            loading:false,
            stepOccurrenceType:"TODO",

        }
    }

    loadObjectsFromServer (periodValue) {
                        this.setState({loading:true})


        switch (periodValue) {
            case("TODAY"):
                var periodRangeStart = new Date();
                var periodRangeEnd = new Date() ;

                break;
            case("NEXT7"):
                var periodRangeStart = new Date();
                var periodRangeEnd = new Date();
                periodRangeEnd = periodRangeEnd.addDays(7);
                break;
            case("LAST7"):
                var periodRangeEnd =   new Date();
                var periodRangeStart = new Date();
                 periodRangeStart.subtractDays(7);
                break;
            case("CUSTOM"):
                var periodRangeStart = new Date(this.state.startDate);
                var periodRangeEnd = new Date(this.state.endDate);
                break;

        }

        this.setState({
            periodRangeStartString: periodRangeStart.toDateString(),
            periodRangeEndString:periodRangeEnd.toDateString()
        });

        periodRangeStart = moment(periodRangeStart).format('YYYY-MM-DD');
        periodRangeEnd = moment(periodRangeEnd).format('YYYY-MM-DD');
        var theUrl = "/api/period/" + periodRangeStart + "/" + periodRangeEnd + "/";

                console.log("sending now " + theUrl)

        $.ajax({
            url: theUrl,
            dataType: 'json',
            cache: false,
            type:'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {

                store.dispatch(setStepOccurrences(data))


                this.setState({
                    loading:false,
                    data: data});


            }.bind(this),
            error: function (xhr, status, err) {
                this.setState({
                    loading:false
                })
                console.error(theUrl, status, err.toString());
            }.bind(this)
        });
    }

    componentDidMount () {
        this.setState({loading:true})

    this.loadObjectsFromServer(this.state.period)
        /*
        if (this.props.storeRoot.gui) {
            if(this.props.storeRoot.gui.dailyPeriod) {
                this.setState({
                    period: this.props.storeRoot.gui.dailyPeriod.selection,
                    startDate: this.props.storeRoot.gui.dailyPeriod.periodStart,
                    endDate: this.props.storeRoot.gui.dailyPeriod.periodEnd,



                },   this.loadObjectsFromServer(this.state.period))
            }
        }



        //var intervalID = setInterval(this.loadObjectsFromServer, 2000);
        //this.setState({intervalID: intervalID});
        */

    }
/*
    componentWillReceiveProps(nextProps) {
         if (nextProps.storeRoot.gui) {
            if(nextProps.storeRoot.gui.dailyPeriod) {
                this.setState({
                    period: nextProps.storeRoot.gui.dailyPeriod.selection,
                    startDate: nextProps.storeRoot.gui.dailyPeriod.periodStart,
                    endDate: nextProps.storeRoot.gui.dailyPeriod.periodEnd,



                },  this.loadObjectsFromServer(this.state.period))
            }
        }

    }*/

    handleStartDateChange(date)   {
        this.setState({startDate: date}, )
        if (date > this.state.endDate) {
            this.setState({endDate:date},  )
        }



  }
  handleEndDateChange(date)   {
        this.setState({
            endDate: date},
);
      if (date < this.state.startDate) {
            this.setState({
                    startDate:date},
)
        }

  }

  handlePeriodChange(option){
      this.setState({loading:true})

       this.setState({period: option.value});

      if (option.value != "CUSTOM") {
         this.loadObjectsFromServer(option.value)
      }

    }

    handleStepOccurrenceTypeChange(option) {
        this.setState({stepOccurrenceType: option.value}, )


    }

    handleSubmitCustom() {
        this.loadObjectsFromServer("CUSTOM")
    }



    render () {
        var dateData, dateObject, readableDate;
        dateObject = new Date();

        var readableStartDate = "";
    var readableEndDate = "";

        if (this.state.periodRangeStart != undefined) {
            readableStartDate = this.state.periodRangeStartString;
            readableEndDate = this.state.periodRangeEndString
        }

        if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }

        if (forMobile){

                var listNodeOrMobile = true
        }

                if (this.state.data != undefined) {
                return (
                    <div>
                        <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen} />

                        <div className="fullPageDiv">
                            <div className="ui page container footerAtBottom">



                                <div className="spacer">&nbsp;</div>
                                <div className="ui large breadcrumb">
                                    <Link to={`/`}>
                                        <div className="section">Home</div>
                                    </Link>

                                    <i className="right chevron icon divider"></i>
                                    <Link to={`/`}>
                                        <div className="active section">Today's Work</div>
                                    </Link>
                                </div>
                                <div>&nbsp;</div>
                                <div className="ui three column stackable grid">
                                    <div className="ui row">
                                        {listNodeOrMobile ? <div
                                            className="ui column"> {this.state.periodRangeStartString != this.state.periodRangeEndString ?
                                            <h3>{this.state.periodRangeStartString} to {this.state.periodRangeEndString}</h3> :
                                            <h3>{this.state.periodRangeStartString}</h3>}</div>
                                            :
                                            <div
                                                className="ui ten wide column header"> {this.state.periodRangeStartString != this.state.periodRangeEndString ?
                                                <h1>{this.state.periodRangeStartString} to {this.state.periodRangeEndString}</h1> :
                                                <h1>{this.state.periodRangeStartString}</h1>}</div>
                                        }
                                    <div className="ui right floated column form ">
                                                <div className="ui two column grid">
                            <div  className="column field absolutelyNoMargin">


                                        <KSSelect value={this.state.stepOccurrenceType}
                                            valueChange={this.handleStepOccurrenceTypeChange}
                                            label=""
                                            isClearable={false}
                                            name="period"
                                                  searchable={false}
                                            options={stepOccurrenceTypeOptions}
                                            />
                                </div>
                            <div  className="column field absolutelyNoMargin">


                                        <KSSelect value={this.state.period}
                                            valueChange={this.handlePeriodChange}
                                            label=""
                                            isClearable={false}
                                            name="period"
                                                  searchable={false}
                                            options={periodOptions}
                                            />
                                </div>
                                                    </div>
                                    </div></div>
                        {this.state.period == "CUSTOM" ?
<div className="ui row smallVerticalPaddingNoMargin">

    <div className="ui right floated column form">
        <div className="ui two column grid">
                            <div  className="column field absolutelyNoMargin">
                                <DatePicker  selected={this.state.startDate}
                                                  onChange={this.handleStartDateChange}/> </div>
                                    <div  className="column field absolutelyNoMargin">
                                        <DatePicker  selected={this.state.endDate}
                                                  onChange={this.handleEndDateChange}/>


                                </div></div></div></div>: <div></div>}
                                    {this.state.period == "CUSTOM" ?
<div className="ui row smallVerticalPaddingNoMargin">

    <div className="ui right floated  column form "><div className="ui fluid purple medium button" onClick={this.handleSubmitCustom}>Update</div>
       </div></div>: <div></div>}
                                                            </div>

                                <StepOccurrenceList data={this.props.storeRoot.stepOccurrences} status={this.state.stepOccurrenceType} periodStart={this.state.startDate} periodEnd={this.state.endDate} />


                        </div></div>

                        <Footer />
                            </div>


                )
                        }
        else {
                    return (
                        <div></div>
                    )
            }

    }
}



export class StepOccurrenceList2 extends React.Component {
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

        if (this.state.data) {
            var objectNodes = this.state.data.map(function (objectData) {

                return (
                    <div key={objectData.id}>
                        <StepOccurrenceItem stepOccurrenceData={objectData}/>
                        <div>&nbsp;</div>
                    </div>
                )
            }.bind(this));
        } else {

            if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }

        if (forMobile){

            var objectNodes = () => {return (<div style={{fontSize:'1.5em;'}}>You don't have any steps to accomplish today.</div>)}
        } else {
            var objectNodes = () => {return (<div>You don't have any steps to accomplish today.</div>)}


        }

        }
        return (
            //<div className="ui divided link items">
            <div className="sixteen wide column">
                {objectNodes}
            </div>
        )
    }
}



export class UpdateOccurrenceList extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[]


        }
    }

    loadObjectsFromServer () {
        //var periodRangeStart = new Date();
        //var periodRangeEnd = new Date();
        //periodRangeStart = moment(periodRangeStart).format('YYYY-MM-DD');
        //periodRangeEnd = moment(periodRangeEnd).format('YYYY-MM-DD');
        $.ajax({
            url: "/api/stepOccurrences/" + this.state.stepOccurrenceId + "/updateOccurrences/",
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data});


            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    componentDidMount () {
        this.setState({
            stepOccurrenceId: this.props.stepOccurrenceId,
        }, this.loadObjectsFromServer())


    }
    componentWillReceiveProps (nextProps) {
        if (this.state.stepOccurrenceId != nextProps.stepOccurrenceId)
            this.setState({stepOccurrenceId:nextProps.stepOccurrenceId})
    }



    render () {

        if (this.state.data) {
            var objectNodes = this.state.data.map(function (objectData) {

                return (
                        <div className="column">
                            <UpdateOccurrenceForm data={objectData}/>
                        </div>
                )
            }.bind(this));
        }
        return (
            //<div className="ui divided link items">
            <form className="ui form">

            <div className="ui one column grid">

                {objectNodes}
    <div className="ui row">
        <div className="sixteen wide column"><a className="ui orange fluid button">Update</a></div>
</div>
            </div>
                </form>

        )
}


}


var UpdateOccurrenceForm = React.createClass({



    componentDidMount: function() {
        var self = this;

    },

    getInitialState: function() {
      return {
          format:this.props.data.update.format,
          metricLabel:this.props.data.update.metricLabel,
          units:this.props.data.update.units,
          measuringWhat:this.props.data.update.measuringWhat,
      }
    },

    render: function() {

        return (
            //<div className="ui divided link items">
                <div className="ui row">
                    <ValidatedInput
                                        type="text"
                                        name="something"
                                        label={this.state.metricLabel}
                                        id="id_text"
                                        initialValue=""
                                        placeholder={this.state.measuringWhat}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleTextChange}

                                    />
                    {this.state.units}



</div>
        )
}


});

module.exports = { DailyList};