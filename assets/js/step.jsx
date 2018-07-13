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
import 'react-select/dist/react-select.css';
var MaskedInput = require('react-maskedinput');
import {convertDate, convertFromDateString, daysBetweenDates, daysBetween} from './dateConverter'
import {SaveButton} from './settings'
import {ImageUploader,  NewImageUploader, Breadcrumb, PlanForm2, ViewEditDeleteItem, StepViewEditDeleteItem, PlanViewEditDeleteItem, FormAction, Sidebar, Header, FormHeaderWithActionButton, DetailPage} from './base';
import { Menubar, StandardSetOfComponents, Footer, ErrorReporter } from './accounts'
import { ValidatedInput } from './app'
import { IconLabelCombo, ClippedImage, ContextualMenuItem, ChoiceModal, ChoiceModalButtonsList } from './elements'
import { makeEditable,  ProgramCalendar } from './calendar'
import { UpdatesList, UpdateModalForm } from './update'
import { ReversedRadioButton, RadioGroup, RadioButton } from 'react-radio-buttons'

import { defaultStepCroppableImage, mobileModalStyle, endRecurrenceOptions, dayOptions, monthlyDayOptions, monthlySpecificityOptions, TINYMCE_CONFIG, theServer, s3IconUrl, s3BaseUrl, stepModalStyle, updateModalStyle, customStepModalStyles, formats, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, times, durations, stepTypeOptions, } from './constants'
import Measure from 'react-measure'
BigCalendar.momentLocalizer(moment);

import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'
import { Provider, connect, dispatch } from 'react-redux'
import  {store} from "./redux/store";
import { mapStateToProps, mapDispatchToProps } from './redux/containers2'
import { addStep, deleteStep, clearTempStep, addUpdate, updateStep, setUpdateModalData, setStepModalData, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, setContacts, setStepOccurrences } from './redux/actions'
import 'react-datepicker/dist/react-datepicker.css';
moment.locale('en')
var momentDurationFormatSetup = require("moment-duration-format");

momentDurationFormatSetup(moment);
typeof moment.duration.fn.format === "function";
// true
typeof moment.duration.format === "function";
 true


$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Connection', 'keep-alive');
        xhr.setRequestHeader('Authorization', 'Token ' + localStorage.token);

    }
});


var stepCalendarComponent = "";


function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

@connect(mapStateToProps, mapDispatchToProps)
export class StepList extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:{},
            programId:"",
            activePage:1,
        }
    }

    handleReloadItem = () => {
        this.props.reloadItem()
    };


    componentDidMount () {
        this.setState({
            data:this.props.data
        });
        //this.loadFromServer()
    }

     handlePageChange = (pageNumber) => {
        this.setState({activePage: pageNumber}, () => this.loadFromServer());

    };

    getPagination()  {
          if (this.state.next != null || this.state.previous != null) {
              return (
                  <div className="ui center aligned one column grid">
                  <Pagination activePage={this.state.activePage}
                              itemsCountPerPage={9}
                              totalItemsCount={this.state.count}
                              pageRangeDisplayed={5}
                              onChange={this.handlePageChange}/>
                      </div>
              )
          } else {
          return ("")
          }
      }

    loadFromServer = () => {
        //if (this.state.activePage != 1) {
          //      var theUrl = theServer + "api/programs/" + this.props.programId + "/steps/?page=" + this.state.activePage
      //}  else {
                var theUrl = "/api/programs/" + this.props.programId + "/steps";
      //}

      $.ajax({
      url: theUrl,
      dataType: 'json',
      cache: false,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
      success: function(data) {
        this.setState({
            count: data.count,
            next:data.next,
            previous:data.previous,
            data: data.results
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(theUrl, status, err.toString());
      }.bind(this),

    });
  };

    componentWillReceiveProps(nextProps) {
        if (this.state.data != nextProps.data) {
            this.setState({
                data:nextProps.data
            })
        }
        if (this.state.programId != nextProps.programId) {
            this.setState({programId: nextProps.programId})

        }

    }
    handleCurrentViewChanged = (currentView) => {

      this.setState({currentView:currentView})

  };



    render () {
                      //var pagination = this.getPagination()
        if (this.state.data) {
             var theData = this.state.data;
        var values = Object.keys(theData).map(function(key){
        return theData[key];
        });

        var stepList = values.map((step) => {
            return (
                    <StepViewEditDeleteItem closeClicked={this.handleCloseClicked}
                                            parentId={this.props.programId}
                                            key={step.id}
                                            isListNode={true}
                                            showCloseButton={false}
                                            apiUrl="/api/steps/"
                                            id={step.id}
                                            data={step}
                                            currentViewChanged={this.handleCurrentViewChanged}

                                            reloadItem={this.handleReloadItem}
                                            currentView="Basic"
                    />


);

            //return (<PlanListNode key={plan.id} plan={plan}/>)
        })
    }


    return (
        <div className="centeredContent">
          <div className='ui three column doubling stackable grid'>
        {stepList}
              </div>
            <div className="spacer">&nbsp;</div>

      </div>
    );
  }

}




{/*
TopFrame
    StepFormAction
    StepList

BottomFrame
        WeekView
            DayView
                StepItem
                */}



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


export class StepDetailView extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:"",
        }
    }

    componentDidMount() {
        this.setState({
            data:this.props.data,
        }, this.setDateAndTimeInfo())
    }
    componentWillReceiveProps (nextProps) {
        if (this.state.data != nextProps.data) {
            this.setState({
                data:nextProps.data
            });
                        this.setDateAndTimeInfo()

        }
         if (this.state.currentView != nextProps.currentView) {
            this.setDateAndTimeInfo()

        }
    }
     findLabel (theValue, theArray) {
        var returnValue = "Not available";
        if (theValue) {
            for (var i = 0; i < theArray.length; i++) {
                if (theValue == theArray[i].value) {
                    returnValue =  theArray[i].label;
                    return returnValue
                }
            }
            return returnValue
        }
        else {
            return returnValue
        }
    }

    getWeeklyDays() {
        var theDaysPerWeek = "";
        if (this.state.data.day01) {
            theDaysPerWeek = theDaysPerWeek + "Mon, "
        }
        if (this.state.data.day02) {
            theDaysPerWeek = theDaysPerWeek + "Tue, "
        }
        if (this.state.data.day03) {
            theDaysPerWeek = theDaysPerWeek + "Wed, "
        }
        if (this.state.data.day04) {
            theDaysPerWeek = theDaysPerWeek + "Thu, "
        }
        if (this.state.data.day05) {
            theDaysPerWeek = theDaysPerWeek + "Fri, "
        }
        if (this.state.data.day06) {
            theDaysPerWeek = theDaysPerWeek + "Sat, "
        }
        if (this.state.data.day07) {
            theDaysPerWeek = theDaysPerWeek + "Sun, "
        }

        theDaysPerWeek.slice(0, theDaysPerWeek.length - 2)
    }

setDateAndTimeInfo() {
        this.setDateInfo();
        this.setTimeInfo()
    }





    setDateInfo = () => {
        var theAbsoluteStartDateTime = this.state.data.absoluteStartDateTime;
        theAbsoluteStartDateTime = moment(theAbsoluteStartDateTime).format("MM/DD/YY");
        var theAbsoluteEndDateTime = this.state.data.absoluteEndDateTime;
        theAbsoluteEndDateTime = moment(theAbsoluteEndDateTime).format("MM/DD/YY");

        switch (this.state.data.frequency) {
            case("ONCE"):
                this.setState({
                    dateInfo: theAbsoluteStartDateTime
                });
                break;
            case("HOURLY"):
                this.setState({
                    dateInfo: "Hourly, " +  theAbsoluteStartDateTime + " to " + theAbsoluteEndDateTime,
                });
                break;
            case("DAILY"):
                this.setState({
                    dateInfo: "Daily, " +  theAbsoluteStartDateTime + " to " + theAbsoluteEndDateTime,
                });
                break;
            case("WEEKLY"):
                this.setState({
                    dateInfo: "Weekly, " + this.getWeeklyDays() + theAbsoluteStartDateTime + " to " + theAbsoluteEndDateTime
                });
                break;
            case("MONTHLY"):
                this.setState({
                    dateInfo:  this.state.data.monthlyDates + " Monthly, " + theAbsoluteStartDateTime + " to " + theAbsoluteEndDateTime
                });
                break;
        }


};
    setTimeInfo = () => {
        var duration = this.findLabel(this.state.data.duration, durations);
        var startTime = this.findLabel(this.state.data.startTime, times);
        if ((duration != "Not available") && (startTime != "Not available")) {
            var timeInfo = duration + ", starting at " + startTime

        } else if ((startTime == "Not available") && (duration == "Not available")) {
            var timeInfo = ""

        } else if ((startTime != "Not available") && (duration == "Not available")) {
            var timeInfo = startTime

        } else if ((startTime == "Not available") && (duration != "Not available")) {
            var timeInfo = duration


        }

        this.setState({
            timeInfo: timeInfo
        })
    };
        render() {

            var theTitle = this.state.data.title;


            if (this.props.isListNode) {
                return (
                        <div className="fluid row" dangerouslySetInnerHTML={{__html: this.state.data.description}} />


                )
            }
            else {
                return (
                     <div className="ui grid">
                    <div className="two wide column">
                        <img className="ui image" src={s3ImageUrl + this.state.data.image}></img>
                    </div>
                    <div className="eight wide column">
<div className="fluid row">
                            <h3>{this.state.data.title}</h3>
                        </div>                        <div className="fluid row" dangerouslySetInnerHTML={{__html: this.state.data.description}}/>
                    </div>
                    <div className="right aligned six wide column">
                                    <IconLabelCombo size="extramini" orientation="right" text={this.state.dateInfo} icon="calendar" background="Light" link="/goalEntry" />
                                    {this.state.timeInfo ? <IconLabelCombo size="extramini" orientation="right" text={this.state.timeInfo} icon="timeCommitment" background="Light" link="/goalEntry" /> :<div></div>}
</div>

                </div>

                )
            }
        }

}



export class StepBasicView extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:"",
        }
    }

    componentDidMount() {
        this.setState({
            data:this.props.data,
            currentView: this.props.currentView
        }, this.setDateAndTimeInfo(this.props.data))

    }
    componentWillReceiveProps (nextProps) {
        if (this.state.data != nextProps.data) {
            this.setState({
                data:nextProps.data
            }, this.setDateAndTimeInfo(nextProps.data));



        }
        if (this.state.currentView != nextProps.currentView) {
            this.setState({
                currentView: nextProps.currentView
            });
            this.setDateAndTimeInfo(nextProps.data)

        }
    }

    findLabel (theValue, theArray) {
        var returnValue = "Not available";
        if (theValue) {
            for (var i = 0; i < theArray.length; i++) {
                if (theValue == theArray[i].value) {
                    returnValue =  theArray[i].label;
                    return returnValue
                }
            }
            return returnValue
        }
        else {
            return returnValue
        }
    }

    getWeeklyDays(theData) {
        var theDaysPerWeek = "";
        if (theData.day01) {
            theDaysPerWeek = theDaysPerWeek + "Mon, "
        }
        if (theData.day02) {
            theDaysPerWeek = theDaysPerWeek + "Tue, "
        }
        if (theData.day03) {
            theDaysPerWeek = theDaysPerWeek + "Wed, "
        }
        if (theData.day04) {
            theDaysPerWeek = theDaysPerWeek + "Thu, "
        }
        if (theData.day05) {
            theDaysPerWeek = theDaysPerWeek + "Fri, "
        }
        if (theData.day06) {
            theDaysPerWeek = theDaysPerWeek + "Sat, "
        }
        if (theData.day07) {
            theDaysPerWeek = theDaysPerWeek + "Sun, "
        }

        return theDaysPerWeek
    }


    setDateAndTimeInfo(theData) {
        this.setDateInfo(theData);
        this.setTimeInfo(theData)
    }


    setDateInfo = (theData) => {
        var theAbsoluteStartDateTime = theData.absoluteStartDateTime;
        theAbsoluteStartDateTime = moment(theAbsoluteStartDateTime).format("MM/DD/YY");
        var theAbsoluteEndDateTime = theData.absoluteEndDateTime;
        theAbsoluteEndDateTime = moment(theAbsoluteEndDateTime).format("MM/DD/YY");

        switch (theData.frequency) {

            case("ONCE"):
                this.setState({
                    dateInfo: "Once, " + theAbsoluteStartDateTime
                });
                break;
            case("HOURLY"):
                this.setState({
                    dateInfo: "Hourly, " +  theAbsoluteStartDateTime + " to " + theAbsoluteEndDateTime,
                });
                break;

            case("DAILY"):
                this.setState({
                    dateInfo: "Daily, " +  theAbsoluteStartDateTime + " to " + theAbsoluteEndDateTime,
                });
                break;
            case("WEEKLY"):
                this.setState({
                    dateInfo: "Weekly, " + this.getWeeklyDays(theData) + theAbsoluteStartDateTime + " to " + theAbsoluteEndDateTime
                });
                break;
            case("MONTHLY"):
                this.setState({
                    dateInfo:  this.state.data.monthlyDates + ", Monthly, " + theAbsoluteStartDateTime + " to " + theAbsoluteEndDateTime
                });
                break;



        }


};
    setTimeInfo = (theData) => {
        var duration = this.findLabel(theData.duration, durations);
        var startTime = this.findLabel(theData.startTime, times);
        if ((duration != "Not available") && (startTime != "Not available")) {
            var timeInfo = duration + ", starting at " + startTime

        } else if ((startTime == "Not available") && (duration == "Not available")) {
            var timeInfo = ""

        } else if ((startTime != "Not available") && (duration == "Not available")) {
            var timeInfo = startTime

        } else if ((startTime == "Not available") && (duration != "Not available")) {
            var timeInfo = duration


        }

        this.setState({
            timeInfo: timeInfo
        })
    };

    goToDetail() {
         if (this.state.data.id) {
             store.dispatch(push("/steps/" + this.state.data.id + "/"))
         }
     }
    render() {

            var theTitle = this.state.data.title;
        var theImage = s3BaseUrl + this.state.data.image
        if (this.state.data.croppableImageData != undefined) {
            if (this.state.data.croppableImageData.image != "") {
                theImage = this.state.data.croppableImageData.image

            }
        }


            if (this.props.isListNode) {
                return (
                                    <div onClick={this.goToDetail}>
                                        <ClippedImage item="plan" src={theImage} />



                    <div className="ui grid">
                        <div className="sixteen wide column">
                            <div className="planTitle"> {theTitle}</div>

                        <div className="row" >
                            <div className="ui one column grid">
                                <div className="ui left aligned column">
                                    {this.state.data.type == 'TIME' && this.state.dateInfo != undefined ? <IconLabelCombo size="extramini" orientation="left" text={this.state.dateInfo} icon="calendar" background="Light" link="/goalEntry" />: null}
                                    {this.state.data.type == 'COMPLETION' ? <IconLabelCombo size="extramini" orientation="left" text="COMPLETION" icon="calendar" background="Light" link="/goalEntry" />: null}

</div>

</div></div>
                            </div>



                    </div></div>

                )
            }
            else {
                return (
                     <div className="ui grid">
                    <div className="two wide column">
                        <img className="ui image" src={theImage}></img>
                    </div>
                    <div className="eight wide column">
<div className="fluid row">
                            <h3>{this.state.data.title}</h3>
                        </div>                        <div className="fluid row" dangerouslySetInnerHTML={{__html: this.state.data.description}}/>
                    </div>
                    <div className="right aligned six wide column">
                                    <IconLabelCombo size="extramini" orientation="right" text={this.state.dateInfo} icon="calendar" background="Light" link="/goalEntry" />
</div>

                </div>

                )
            }
        }

}







export class ToggleButton extends React.Component {

    constructor (props) {
        super(props);
        autobind(this);
        this.state = {
            checked: false
        }
    }

    componentDidMount () {
            this.setState({
            checked: this.props.value,
        })

    }

    componentWillReceiveProps = (nextProps) => {
        if (this.state.checked != nextProps.value) {
            this.state.checked = nextProps.value
        }

};



    handleToggleChange = (e) => {
                    e.preventDefault();

        if (!this.props.disabled) {
            var currentState = this.state.checked;

            if (currentState == true) {
                //this.setState({ checked: false});
                var callbackValue = false;
                this.props.callback(callbackValue)
            } else {
                //this.setState({ checked: true});
                var callbackValue = true;
                this.props.callback(callbackValue)

            }
        }
    };


  render = () => {
    var btnClass = 'ui toggle button';
    if (this.state.checked == true) btnClass += ' active';
    return <button className={btnClass}  style={this.props.style} onClick={this.handleToggleChange} >{this.props.label}</button>;
  }
}

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



export class StepItemMenu extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
     }

     handleClick = (callbackData) => {
         this.props.click(callbackData)
     };

     render () {
         var myStyle = { display: "block"};
         return(

                  <div className="ui simple  dropdown item" >
                      <div className="ui extramini image controlButtonMargin">
                      <img src={`${s3IconUrl}menuDark.svg`} /></div>
                      <div className="menu" style={{right: '0',left: 'auto'}}>
                          <div className="ui item">
                              <IconLabelCombo size="extramini" orientation="left" text="Duplicate" icon="duplicate" background="Light" click={this.handleClick} />
                              </div>

                          <div className="ui item">
                            <IconLabelCombo size="extramini" orientation="left" text="Delete" icon="trash" background="Light" click={this.handleClick} />
                            </div>

                      </div>
                  </div>


         )
     }

}

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

@connect(mapStateToProps, mapDispatchToProps)
export class StepDetailPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[],

        }
    }




    loadStep() {
    $.ajax({
      url: "/api/steps/" + this.props.params.step_id + "/",
      dataType: 'json',
        type: 'GET',

      cache: false,
      success: function(data) {
        this.setState({
            data: data});

      }.bind(this),
      error: function(xhr, status, err) {
        console.error( "/api/steps/" + this.props.params.step_id + "/", status, err.toString());
      }.bind(this),

    });
  };


    componentWillUnmount = () => {
        //clearInterval(this.state.stepsIntervalId);

    };






  componentDidMount() {
      this.loadStep()

  }




handleCurrentViewChanged = (currentView) => {

      this.setState({currentView:currentView})

  };








    render() {
        if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }

        if (forMobile){

                var listNodeOrMobile = true
        }

        if (this.state.data != "") {
            return (
                <div>
                    <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen}/>

                    <div className="ui container footerAtBottom">
                        <div className="spacer">&nbsp;</div>
                        <div className="ui alert"></div>
                        <Breadcrumb values={[
                            {url: "/steps/" + this.props.params.step_id +"/", label: "Step Detail"},

                        ]}/>
                        <div>&nbsp;</div>
                                              <div className="ui one column stackable grid">


                        <StepViewEditDeleteItem closeClicked={this.handleCloseClicked}
                                            parentId={this.props.programId}
                                            key={this.props.params.step_id}
                                            isListNode={true}
                                            showCloseButton={false}
                                            apiUrl="/api/steps/"
                                            id={this.props.params.step_id}
                                            data={this.state.data}
                                            currentViewChanged={this.handleCurrentViewChanged}

                                            reloadItem={this.handleReloadItem}
                                            currentView="Detail"
                    />
                                                  </div>


                    </div>
                    <Footer />
                </div>

            )
        } else {
            return (<div>
                    <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen}/>
                <div className="ui container footerAtBottom">
                        <div className="spacer">&nbsp;</div>
                        <div className="ui alert"></div>
                        <Breadcrumb values={[
                            {url: "/steps/" + this.props.params.step_id +"/", label: "Step Detail"},

                        ]}/>
                        <div>&nbsp;</div>
                                              <div className="ui segment">
  <div className="ui active inverted dimmer">
    <div className="ui text loader">Loading</div>
  </div>
  <p></p>
</div>
                                                  </div>
                                                  <Footer />
                </div>)
        }
    }
}


@connect(mapStateToProps, mapDispatchToProps)
export class StepModalForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
           files:[],
            id:"",
            image:defaultStepCroppableImage.image,
            croppableImage: defaultStepCroppableImage,
            description:" ",
            type:"COMPLETION",
            frequency:"ONCE",
            day01:false,
            day02:false,
            day03:false,
            day04:false,
            day05:false,
            day06:false,
            day07:false,
            monthlyDates:"",
            absoluteStartDateTime:moment(),
            absoluteEndDateTime:moment(),
            relativeStartDateTime:moment.duration(),
            relativeEndDateTime:moment.duration(),
            useAbsoluteTime:false,
            program:this.props.parentId,
            data:"",
            serverErrors:{},
            updates:[],
            modalIsOpen:false,
            endRecurrence:"NEVER",
            monthlySpecificity:"SPECIFIC_DAYS",
            monthlyDay: "MONDAY",
            monthlyDayOption: "FIRST",
            interval: 1,
            numberOfOccurrences:1,
            recurrenceRule:"",
        }
    }



    /*handleFinishedUpload (value) {
            var fullUrl = value.signedUrl;
            var urlForDatabase = fullUrl.split("?")[0];
            urlForDatabase = urlForDatabase.replace(s3BaseUrl, "");
            this.setState({image: urlForDatabase});

    }*/

    showAndHideFrequencyUIElements (frequencyValue) {
        if (frequencyValue == "WEEKLY") {
            $(this.refs['weeklyUI']).show();
            $(this.refs['monthlyUI']).hide();
            $(this.refs['dailyUI']).hide();
            $(this.refs['hourlyUI']).hide();
            $(this.refs['onceUI']).hide();
        $(this.refs['afterUI']).hide();

    } else if (frequencyValue == "" ) {
            $(this.refs['weeklyUI']).hide();
            $(this.refs['monthlyUI']).hide();
            $(this.refs['hourlyUI']).hide();
            $(this.refs['onceUI']).hide();
            $(this.refs['dailyUI']).hide();



        } else if (frequencyValue == "ONCE" ) {
            $(this.refs['weeklyUI']).hide();
            $(this.refs['monthlyUI']).hide();
            $(this.refs['hourlyUI']).hide();
            $(this.refs['onceUI']).show();
            $(this.refs['dailyUI']).hide();







        } else if (frequencyValue == "MONTHLY") {
            $(this.refs['weeklyUI']).hide();
            $(this.refs['monthlyUI']).show();
            $(this.refs['dailyUI']).hide();
            $(this.refs['hourlyUI']).hide();
            $(this.refs['onceUI']).hide();


        $(this.refs['afterUI']).hide();
             $(this.refs['specificDatesUI']).hide();
            $(this.refs['specificDaysUI']).hide();




        } else if (frequencyValue == "DAILY") {
            $(this.refs['onceUI']).hide();
            $(this.refs['weeklyUI']).hide();
            $(this.refs['monthlyUI']).hide();
            $(this.refs['hourlyUI']).hide();
            $(this.refs['dailyUI']).show();





        }
        else if (frequencyValue == "HOURLY") {
            $(this.refs['onceUI']).hide();
            $(this.refs['weeklyUI']).hide();
            $(this.refs['monthlyUI']).hide();
            $(this.refs['hourlyUI']).show();
            $(this.refs['dailyUI']).hide();





        }
    }

    showAndHideTypeUIElements (typeValue) {
         if (typeValue == "COMPLETION" || typeValue == "" || typeValue == undefined) {
             $(this.refs['timeBasedUI']).hide();




        } else if (typeValue == "TIME" ) {
             $(this.refs['timeBasedUI']).show();




        } else if (typeValue == "ORDERED_COMPLETION") {
             $(this.refs['ref_dateUI']).hide();
         }

    }

    showAndHideEndRecurrenceUIElements (endRecurrenceValue) {
        switch(endRecurrenceValue) {
            case('END_DATE'):
                $(this.refs['afterUI']).hide();
                $(this.refs['endOnUI']).show();

            case('NEVER'):
                $(this.refs['afterUI']).hide();
                $(this.refs['endOnUI']).hide();

            case('AFTER_NUMBER_OF_OCCURRENCES'):
                $(this.refs['afterUI']).show();
                $(this.refs['endOnUI']).hide();





        }



    }


    loadParentFromServer = () => {
     var theUrl = "/api/programs/" + this.props.parentId;

      $.ajax({
      url: theUrl,
      dataType: 'json',
      cache: false,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
      success: function(data) {
        this.setState({
            parentData: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(theUrl, status, err.toString());
      }.bind(this),

    });
  };


    componentDidMount() {

        $(this.refs['weeklyUI']).hide();
         $(this.refs['endOnUI']).hide();
        $(this.refs['afterUI']).hide();
        $(this.refs['specificDatesUI']).hide();
        $(this.refs['specificDaysUI']).hide();
        $(this.refs['monthlyUI']).hide();
        $(this.refs['hourlyUI']).hide();
        $(this.refs['dailyUI']).hide();

        $(this.refs['onceUI']).hide();


        this.resetForm();
        this.setState({
            serverErrors:this.props.serverErrors,
        });




        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.stepModalData != undefined) {
                this.setState({stepModalData:this.props.storeRoot.stepModalData})
                    this.setStateToData(this.props.storeRoot.stepModalData)


            }
        }
    }

    setStateToData (stepModalData) {
        this.setState({
            modalIsOpen: stepModalData.modalIsOpen,

        })
        if (stepModalData.data != undefined ) {

            var data = stepModalData.data
            var relativeStartDateTime = moment.duration(data.relativeStartDateTime);

            var relativeEndDateTime = moment.duration(data.relativeEndDateTime);


            var programStartDateInStringForm = data.programStartDateTime;


            var programStartDateInMomentForm = moment(programStartDateInStringForm);



            var absoluteStartDateTime = programStartDateInMomentForm.clone().add(relativeStartDateTime)
            var absoluteEndDateTime = programStartDateInMomentForm.clone().add(relativeEndDateTime)








            //var absoluteStartDateTime = moment(absoluteStartDateTime)

            //var calculatedStartDate = convertDate(programStartDateInMomentForm, startDate, "momentFormat", "relativeTime").format("YYYY-MM-DD");
            //var calculatedEndDate = convertDate(programStartDateInMomentForm, endDate, "momentFormat", "relativeTime").format("YYYY-MM-DD");
            //calculatedStartDate = moment(calculatedStartDate);
            //calculatedEndDate = moment(calculatedEndDate);
            var description = ""
            var type="COMPLETION"
            var frequency="ONCE"

             if (data.description != undefined) {
                description=data.description
            }

            if (data.frequency != undefined) {
               frequency=data.frequency
            }
            if (data.type != undefined) {
                type = data.type
            }

            if (data.id != undefined) {
                this.setState({
                    id: data.id,
                    saved:"Saved"
                })
            } else {
                this.setState({
                    id:"",
                    saved:"Create"
                })
            }

            if (data.croppableImageData != undefined) {
                this.setState({
                    croppableImage: data.croppableImageData
                })
            }



            this.setState({
                id: data.id,

                image: data.image,


                title: data.title,
                description: description,
                type: type,
                frequency: frequency,
                day01: data.day01,
                day02: data.day02,
                day03: data.day03,
                day04: data.day04,
                day05: data.day05,
                day06: data.day06,
                day07: data.day07,
                //startDate: startDate,
                //endDate: endDate,
                useAbsoluteTime: data.useAbsoluteTime,
                //absoluteStartDate: calculatedStartDate,
                //absoluteEndDate: calculatedEndDate,
                absoluteStartDateTime: absoluteStartDateTime,
                absoluteEndDateTime: absoluteEndDateTime,
                startTime: data.startTime,
                duration: data.duration,
                monthlyDates: data.monthlyDates,
                programStartDateTime: moment(data.programStartDateTime),
                updates: data.updates,
                 endRecurrence:data.endRecurrence,
            monthlySpecificity:data.monthlySpecificity,
            monthlyDay: data.monthlyDay,
            monthlyDayOption: data.monthlyDayOption,
            interval: data.interval,
            numberOfOccurrences:data.numberOfOccurrences,
            },() => {
                this.showAndHideTypeUIElements(this.state.type)
                this.showAndHideFrequencyUIElements(this.state.frequency)
                this.showAndHideEndRecurrenceUIElements(this.state.endRecurrence)
            });



        }
    }

    componentWillReceiveProps(nextProps) {

        if (this.state.serverErrors != nextProps.serverErrors) {
            this.setState({serverErrors: nextProps.serverErrors})
        }

        if (nextProps.storeRoot.stepModalData != undefined ) {
            if (this.state.stepModalData != nextProps.storeRoot.stepModalData) {
                this.setState({stepModalData:nextProps.storeRoot.stepModalData })

                    this.setStateToData(nextProps.storeRoot.stepModalData)

                }


            }



    }

    handleFrequencyChange = (e) => {
        this.setState({frequency: e.value,
                            saved: "Save"
});
        this.showAndHideFrequencyUIElements(e.value)

    };

    handleTypeChange = (e) => {
        this.setState({type: e.value,
                            saved: "Save"});
        this.showAndHideTypeUIElements(e.value)

    };


    handleTitleChange = (value) => {
        //if (validator.isEmail(e.target.value)) {
        //} else {
            this.setState({title: value,
                            saved: "Save"});

        //}
    };

    handleDescriptionChange(value) {
        this.setState({description: value,
                            saved: "Save"});
    }





  handleUseAbsoluteTimeChange = (e) =>  {

        this.setState({useAbsoluteTime: true,
                            saved: "Save"});
    };


    handleUseRelativeTimeChange = (e) =>  {

        this.setState({useAbsoluteTime: false,
                            saved: "Save"});
    };


    handleAbsoluteStartDateTimeChange(date) {

        this.setState({
            absoluteStartDateTime: date,
                            saved: "Save"
        }, () => this.updateRelativeDates());

        if (this.state.frequency == 'ONCE') {
            this.setState({
                absoluteEndDateTime: date,
                            saved: "Save"
            }, () => this.updateRelativeDates())
        }
        if (this.state.absoluteEndDateTime < date) {
            this.setState({
                absoluteEndDateTime: date,
                            saved: "Save"
            }, () => this.updateRelativeDates())
        }


  }

  updateRelativeDates () {
      console.log("updateRelativeDates")
    var relativeStartDateTime = moment.duration(this.state.absoluteStartDateTime.diff(this.state.programStartDateTime)).format("d hh:mm:ss.SS")
        var relativeEndDateTime = moment.duration(this.state.absoluteEndDateTime.diff(this.state.programStartDateTime)).format("d hh:mm:ss.SS")
        this.setState({
            relativeStartDateTime:relativeStartDateTime,
            relativeEndDateTime:relativeEndDateTime
        })

}
    handleAbsoluteEndDateTimeChange(date) {
    this.setState({
            absoluteEndDateTime: date,
                            saved: "Save"
        }, () => this.updateRelativeDates());

        if (this.state.absoluteStartDateTime > date) {
            this.setState({
                absoluteStartDateTime: date,

            }, () => this.updateRelativeDates())
        }
  }
    setTitle(stateValueFromChild) {
        this.state.title = stateValueFromChild;
    }

    handleEditorChange(e)  {

        this.setState({description: e,
                            saved: "Save"});
  }
    handleDay01Change = (e) =>  {

        this.setState({day01: e,
                            saved: "Save"});
    };

    handleDay02Change = (e) =>  {

        this.setState({day02: e,
                            saved: "Save"});
    };

    handleDay03Change = (e) =>  {

        this.setState({day03: e,
                            saved: "Save"});
    };

    handleDay04Change = (e) =>  {

        this.setState({day04: e,
                            saved: "Save"});
    };

    handleDay05Change = (e) =>  {


        this.setState({day05: e,
                            saved: "Save"});
    };

    handleDay06Change = (e) => {

        this.setState({day06: e,
                            saved: "Save"});
    };

    handleDay07Change = (e) => {


        this.setState({day07: e,
                            saved: "Save"});
    };

    handleStartTimeChange = (e) =>  {

        this.setState({startTime:e.value,
                            saved: "Save"});
    };
    handleDurationChange(e) {

        this.setState({duration: e.value,
                            saved: "Save"});
    }



    handleMonthlyDatesChange(e) {
        this.setState({monthlyDates: e.target.value,
                            saved: "Save"});
    }


    handleCancelClicked() {
        this.closeModal()
    }

    getServerErrors(fieldName) {
        if (this.state.serverErrors == undefined) {
            return ""
        } else {
            return this.state.serverErrors[fieldName]
        }
    }

    handleIntervalChange(value) {
        this.setState({interval:value,
        saved: "Save"})
    }

    handleFormatDuration (theDuration) {
        var returnDuration = theDuration.get('days') + " " + theDuration.get('hours') + ":" + theDuration.get('minutes') + ":" + theDuration.get('seconds') + "." + theDuration.get('milliseconds')
        return returnDuration
    }

    buildRecurrenceRuleAndSubmit() {
        var recurrenceRule = this.buildRecurrenceRule
        this.setState({recurrenceRule: recurrenceRule}, () => this.handleSubmit())

    }

    handleSubmit() {
        this.setState({saved:"Saving..."})

    if (this.props.storeRoot.user) {

        var title = this.state.title;
        if (this.state.image != undefined) {
            var image = this.state.image
        } else {
            var image = defaultStepCroppableImage.image
        }
        var image = this.state.image;
        if (this.state.croppableImage.id != undefined) {
            var croppableImage = this.state.croppableImage.id;
        } else {
            var croppableImage = defaultStepCroppableImage.id
        }
        var description = this.state.description;
        var type = this.state.type;
        var frequency = this.state.frequency;
        var day01 = this.state.day01;
        var day02 = this.state.day02;
        var day03 = this.state.day03;
        var day04 = this.state.day04;
        var day05 = this.state.day05;
        var day06 = this.state.day06;
        var day07 = this.state.day07;
        var startTime = this.state.startTime;
        var monthlyDates = this.state.monthlyDates;
        var theProgram = this.props.parentId;

        //var absoluteStartDateTime = convertDate(this.state.absoluteStartDateTime, 0, "stringFormatComputer", "relativeTime");
        //var absoluteEndDateTime = convertDate(this.state.absoluteEndDateTime, 0, "stringFormatComputer", "relativeTime");
        //var programStartDateTime = convertDate(this.state.programStartDateTime, 0 , "dateFormat", "relativeTime");
        var useAbsoluteTime = this.state.useAbsoluteTime;

        //relativeStartDateTime = this.handleFormatDuration(relativeStartDateTime)
        //relativeEndDateTime = this.handleFormatDuration(relativeEndDateTime)



        var updates = this.state.updates;
        var updatesIds = [];

        var i;
        if ( updates != undefined ) {
            for (i = 0; i < updates.length; i++) {
                updatesIds.push(updates[i].id)
            }
        }



        var stepData = {
            id:"",
            image:image,
            croppableImage:croppableImage,
            title: title,
            description:description,
            type: type,
            frequency:frequency,
            day01:day01,
            day02:day02,
            day03:day03,
            day04:day04,
            day05:day05,
            day06:day06,
            day07:day07,
            monthlyDates:monthlyDates,
            absoluteStartDateTime:moment(this.state.absoluteStartDateTime).format('YYYY-MM-DD HH:mm'),
            absoluteEndDateTime:moment(this.state.absoluteEndDateTime).format('YYYY-MM-DD HH:mm'),
            relativeStartDateTime: this.state.relativeStartDateTime,
            relativeEndDateTime: this.state.relativeEndDateTime,
            useAbsoluteTime: useAbsoluteTime,
            program:theProgram,
            endRecurrence:this.state.endRecurrence,
            recurrenceRule:this.state.recurrenceRule,
            monthlySpecificity:this.state.monthlySpecificity,
            monthlyDay: this.state.monthlyDay,
            monthlyDayOption: this.state.monthlyDayOption,
            interval: this.state.interval,
            programStartDateTime: this.state.programStartDateTime,
            numberOfOccurrences:this.state.numberOfOccurrences,
            'updatesIds[]': updatesIds,
        };

        if (this.state.id != undefined )  {
            stepData.id = this.state.id
        }

        this.handleStepSubmit(stepData)


        }
    else {
            this.setState({
                    signInOrSignUpModalFormIsOpen: true,
                }
            )

            }
        }

        resetForm = () => {
            this.setState({
                    id: "",
                    title: "",
                    description: "",
                    type: "COMPLETION",
                    frequency: "",
                    image: defaultStepCroppableImage.image,
                croppableImage:defaultStepCroppableImage,
                    day01: false,
                    day02: false,
                    day03: false,
                    day04: false,
                    day05: false,
                    day06: false,
                    day07: false,
                    monthlyDates: "",
                    absoluteStartDateTime: moment(),
                    absoluteEndDateTime: moment(),
                    useAbsoluteTime: false,
                    program: this.props.parentId,
                    updates: [],
                endRecurrence:"NEVER",
            monthlySpecificity:"SPECIFIC_DAYS",
            monthlyDay: "MONDAY",
            monthlyDayOption: "FIRST",
            interval: 1,
            numberOfOccurrences:1,
            recurrenceRule:"",

                    modalIsOpen: false,
                },            () =>        { store.dispatch(setStepModalData(this.state))}


            );
        };


        handleImageChange = (callbackData) => {
        this.setState({
            image: callbackData.image,
            saved: "Save",
            croppableImage: callbackData

        })
    }

    handleEndRecurrenceChange (option) {
        this.setState({endRecurrence: option.value})
        this.showAndHideEndRecurrenceUIElements(option.value)


    }

    handleMonthlySpecificityChange (option) {
        this.setState({monthlySpecificity: option.value})



    }

    handleNumberOfOccurrencesChange (value) {
        this.setState({numberOfOccurrences:value})
    }
    handleMonthlyDayOptionChange (option) {
        this.setState({monthlyDayOption: option.value})
    }

    handleMonthlyDayChange (option) {
        this.setState({monthlyDay: option.value})
    }


        getDescriptionEditor () {
            if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if (forMobile) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";

           } else {


            var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }


                if (this.state.description == null) {
                    return ("")
                } else {
                    return (<div className="ui row">
                        <div className={mediumColumnWidth}>
                            <div className="field fluid">
                                <label htmlFor="id_description">Description:</label>
                                <TinyMCEInput name="description"
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

    getDailyUI = () => {
                var startAndEndRecurrenceUI = this.getStartAndEndRecurrenceUI()

                if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if (forMobile) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";

           } else {


            var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }
                return (
                    <div ref="dailyUI" className="ui grid">
                         <div className="ui row">
                            <div className={smallColumnWidth}>
                                <div className="field">
                                            <label htmlFor="id_frequency">Repeat?:</label>
                                    <Select value={this.state.frequency}  onChange={this.handleFrequencyChange} name="frequency" options={frequencyOptions} clearable={false}/>


                                        </div>
                            </div>
                            <div className="one wide middle aligned column noLabel">every</div>

                            <div className="one wide column noLabel">

                                <ValidatedInput
                                        type="text"
                                        name="interval"
                                        label=""
                                        id="id_interval"
                                        value={this.state.interval}
                                        initialValue={this.state.interval}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleIntervalChange}


                                    />
                                </div>
                                <div className="two wide middle aligned column noLabel">day(s)</div>







                        </div>
                        {startAndEndRecurrenceUI}
                        </div>
                )

            }
            getHourlyUI = () => {
                var startAndEndRecurrenceUI = this.getStartAndEndRecurrenceUI()

                if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if (forMobile) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";

           } else {


            var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }
                return (
                    <div ref="hourlyUI" className="ui grid">
                         <div className="ui row">
                            <div className={smallColumnWidth}>
                                <div className="field">
                                            <label htmlFor="id_frequency">Repeat?:</label>
                                    <Select value={this.state.frequency}  onChange={this.handleFrequencyChange} name="frequency" options={frequencyOptions} clearable={false}/>


                                        </div>
                            </div>
                            <div className="one wide middle aligned column noLabel">every</div>

                            <div className="one wide column noLabel">

                                <ValidatedInput
                                        type="text"
                                        name="interval"
                                        label=""
                                        id="id_interval"
                                        value={this.state.interval}
                                        initialValue={this.state.interval}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleIntervalChange}


                                    />
                                </div>
                                <div className="two wide middle aligned column noLabel">hour(s)</div>







                        </div>
                        {startAndEndRecurrenceUI}
                        </div>
                )

            }

            getOnceUI = () => {
                            var startAndEndRecurrenceUI = this.getStartAndEndRecurrenceUI()

                if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if (forMobile) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";

           } else {


            var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }
                return (
                    <div ref="onceUI" className="ui grid">
                        
                         <div className="ui row">
                            <div className={smallColumnWidth}>
                                <div className="field">
                                            <label htmlFor="id_frequency">Repeat?:</label>
                                    <Select value={this.state.frequency}  onChange={this.handleFrequencyChange} name="frequency" options={frequencyOptions} clearable={false}/>


                                        </div>
                            </div>
                             </div>
                        <div className="ui row">
                                    <div className={smallColumnWidth}>
                                        <div className="field fluid">
                                            <label className="tooltip" htmlFor="id_startDate">Start Date/Time:<i
                          className="info circle icon"></i>
                          <span className="tooltiptext">This is relative to your program start date/time: {`${moment(this.state.programStartDateTime).format('MMMM Do YYYY, h:mm a')}`}</span>
                      </label>

                                            <DatePicker showTimeSelect
                                                        showTime = {{ use12hours: true }}
                                                        allowClear={false}
                                                        timeFormat="HH:mm"
                                                        timeIntervals={15}
                                                        dateFormat="LLL"
                                                        timeCaption="time"
                                                        highlightDates={[this.state.programStartDateTime]}
                                                        selected={this.state.absoluteStartDateTime}
                                                        onChange={this.handleAbsoluteStartDateTimeChange} />
                                            </div>
                                        </div>
                            </div>


                        </div>
                             )
                             }
//TODO: Validate that this is a number


            getWeeklyUI = () => {
                            var startAndEndRecurrenceUI = this.getStartAndEndRecurrenceUI()

                if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if (forMobile) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";

           } else {


            var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }
                return (
                    <div ref="weeklyUI" className="ui grid">
                         <div className="ui row">
                            <div className={smallColumnWidth}>
                                <div className="field">
                                            <label htmlFor="id_frequency">Repeat?:</label>
                                    <Select value={this.state.frequency}  onChange={this.handleFrequencyChange} name="frequency" options={frequencyOptions} clearable={false}/>


                                        </div>
                            </div>
                            <div className="one wide middle aligned column noLabel">every</div>

                            <div className="one wide column noLabel">

                                <ValidatedInput
                                        type="text"
                                        name="interval"
                                        label=""
                                        id="id_interval"
                                        value={this.state.interval}
                                        initialValue={this.state.interval}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleIntervalChange}


                                    />
                                </div>
                                <div className="two wide middle aligned column noLabel">week(s)</div>







                        </div>
                        <div className="ui row">


                                <div className={mediumColumnWidth}>
                                <div className="field fluid">                                        <label htmlFor="id_absoluteStartDate">on these days:</label>

                                    <div className="ui equal width tiny buttons ">
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

                                                 {startAndEndRecurrenceUI}












</div>
                )

        }

        buildRecurrenceRule = () => {
            console.log("buildrecurrence rule")
            var recurrenceRule = "RRULE:"

            if (this.state.frequency == 'ONCE') {
                recurrenceRule += "FREQ=HOURLY;"
                recurrenceRule += "INTERVAL=1;"

                recurrenceRule += "COUNT=1;"
                //recurrenceRule += "DTSTART=" + this.state.absoluteStartDateTime + ";"



            } else {


                recurrenceRule += "FREQ=" + this.state.frequency + ";"
                if (this.state.interval != "") {
                    recurrenceRule += "INTERVAL=" + this.state.interval + ";"
                }
                //recurrenceRule += "DTSTART=" + this.state.absoluteStartDateTime + ";"
            }

            switch (this.state.endRecurrence) {
                case "END_DATE":
                    //recurrenceRule += "UNTIL=" + this.state.absoluteEndDateTime + ";"
                    break;
                case "AFTER_NUMBER_OF_OCCURRENCES":
                    recurrenceRule += "COUNT=" + this.state.numberOfOccurrences + ";"

            }
            var theDays = ""

            switch (this.state.frequency) {
                case "WEEKLY":
                    if (this.state.day01) {
                        theDays += "MO,"

                    }
                    if (this.state.day02) {
                        theDays += "TU,"

                    }
                    if (this.state.day03) {
                        theDays += "WE,"

                    }
                    if (this.state.day04) {
                        theDays += "TH,"

                    }
                    if (this.state.day05) {
                        theDays += "FR,"

                    }
                    if (this.state.day06) {
                        theDays += "SA,"

                    }
                    if (this.state.day07) {
                        theDays += "SU,"

                    }
                    if (theDays != "") {
                        theDays = theDays.slice(0, -1)
                    }
                    recurrenceRule += "BYDAY=" + theDays + ";"
                    break


                case "MONTHLY":
                    if (this.state.monthlySpecificity = "SPECIFIC_DATES") {
                        recurrenceRule += "BYMONTHDAY=" + this.state.monthlyDates + ";"
                    } else if (this.state.monthlySpecificity = "SPECIFIC_DAYS") {
                        switch(this.state.monthlyDayOption) {
                            case "FIRST":
                                recurrenceRule += "BYSETPOS=1;"
                                break
                            case "FIRST":
                                recurrenceRule += "BYSETPOS=2;"
                                break
                            case "FIRST":
                                recurrenceRule += "BYSETPOS=3;"
                                break
                            case "FIRST":
                                recurrenceRule += "BYSETPOS=4;"
                                break
                            case "FIRST":
                                recurrenceRule += "BYSETPOS=-1;"
                                break


                        }
                        switch(this.state.monthlyDay) {
                            case "MONDAY":
                                recurrenceRule += "BYDAY=MO;"
                                break
                            case "TUESDAY":
                                recurrenceRule += "BYDAY=TU;"
                                break
                            case "WEDNESDAY":
                                recurrenceRule += "BYDAY=WE;"
                                break
                            case "THURSDAY":
                                recurrenceRule += "BYDAY=TH;"
                                break
                            case "FRIDAY":
                                recurrenceRule += "BYDAY=FR;"
                                break
                            case "SATURDAY":
                                recurrenceRule += "BYDAY=SA;"
                                break

                            case "SUNDAY":
                                recurrenceRule += "BYDAY=SU;"
                                break



                        }
                    }

            }

            var recurrenceRuleWithoutSemicolon = recurrenceRule.slice(0, -1)
            return recurrenceRuleWithoutSemicolon






        }

        getStartAndEndRecurrenceUI = () => {
            if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }

             if (forMobile) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";

           } else {


            var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }
    return (
    <div className="ui row">
                                    <div className={smallColumnWidth}>
                                        <div className="field fluid">
<label className="tooltip" htmlFor="id_startDate">Start Date/Time:<i
                          className="info circle icon"></i>
                          <span className="tooltiptext">This is relative to your program start date/time: {`${moment(this.state.programStartDateTime).format('MMMM Do YYYY, h:mm a')}`}</span>
                      </label>
                                            <DatePicker showTimeSelect
                                                        showTime = {{ use12hours: true }}
                                                        allowClear={false}
                                                        timeFormat="HH:mm"
                                                        timeIntervals={15}
                                                        dateFormat="LLL"
                                                        timeCaption="time"
                                                        highlightDates={[this.state.programStartDateTime]}

                                                        selected={this.state.absoluteStartDateTime}
                                                        onChange={this.handleAbsoluteStartDateTimeChange} />
                                            </div>
                                        </div>



                            <div className={smallColumnWidth}>
                                <div className="field fluid">
                                            <label htmlFor="id_frequency">and ending:</label>
                                    <Select value={this.state.endRecurrence}  onChange={this.handleEndRecurrenceChange} name="endRecurrence" options={endRecurrenceOptions} clearable={false}/>


                                        </div>
                            </div>
                        {this.state.endRecurrence == "AFTER_NUMBER_OF_OCCURRENCES" ?  <div><div className="one wide column">
                                            <label htmlFor="id_frequency">&nbsp;</label>

                                <ValidatedInput
                                        type="text"
                                        name="interval"
                                        label=""
                                        id="id_interval"
                                        value={this.state.numberOfOccurrences}
                                        initialValue={this.state.numberOfOccurrences}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleNumberOfOccurrencesChange}


                                    />
                                </div>                                <div className="two wide column middle aligned">occurrence(s)</div></div>
 : null}

                        {this.state.endRecurrence == "END_DATE" ?
                            <div ref="endOnUI" className={smallColumnWidth}>
                                        <div className="field">
                                            <label htmlFor="id_frequency">&nbsp;</label>

                                            <DatePicker showTimeSelect
                                                        showTime = {{ use12hours: true }}
                                                        use12Hours = {true}
                                                        timeFormat="HH:mm"
                                                        timeIntervals={15}
                                                        dateFormat="LLL"
                                                        timeCaption="time"
                                                        highlightDates={[this.state.programStartDateTime]}

                                                        selected={this.state.absoluteEndDateTime}
                                                        onChange={this.handleAbsoluteEndDateTimeChange} />
                                            </div>
                                        </div> : null}

                        </div>
)


}

        getMonthlyUI = () => {
            var startAndEndRecurrenceUI = this.getStartAndEndRecurrenceUI()
                if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if (forMobile) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";

           } else {


            var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }
                return (
                    <div ref="monthlyUI" className="ui grid">
                         <div className="ui row">
                            <div className={smallColumnWidth}>
                                <div className="field">
                                            <label htmlFor="id_frequency">Repeat?:</label>
                                    <Select value={this.state.frequency}  onChange={this.handleFrequencyChange} name="frequency" options={frequencyOptions} clearable={false}/>


                                        </div>
                            </div>
                            <div className="one wide middle aligned column noLabel">every</div>

                            <div className="one wide column noLabel">

                                <ValidatedInput
                                        type="text"
                                        name="interval"
                                        label=""
                                        id="id_interval"
                                        value={this.state.interval}
                                        initialValue={this.state.interval}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleIntervalChange}


                                    />
                                </div>
                                <div className="two wide middle aligned column noLabel">month(s)</div>







                        </div>
                         <div className="ui row">
                             <div className={smallColumnWidth}>
                                <div className="field">
                                            <label htmlFor="id_frequency">Schedule event to occur on:</label>
                                    <Select value={this.state.monthlySpecificity}  onChange={this.handleMonthlySpecificityChange} name="monthlySpecificity" options={monthlySpecificityOptions} clearable={false}/>


                                        </div>
                            </div>
                             {this.state.monthlySpecificity == "SPECIFIC_DATES" ?

                            <div  className={smallColumnWidth}>

                                <div className="field fluid">


                                    <label htmlFor="id_date">&nbsp;</label>
                                    <input type="text" placeholder="1, 6, 9-10, 15" name="monthlyDates" id="id_monthlyDates" value={this.state.monthlyDates} onChange={this.handleMonthlyDatesChange}/>

                                </div>

                            </div> :
                                 <div className={mediumColumnWidth}>
                             <div className="ui two column grid" >
                             <div  className="column">
                                <div className="field">
                                    <label htmlFor="id_frequency">&nbsp;</label>
                                    <Select value={this.state.monthlyDayOption}  onChange={this.handleMonthlyDayOptionsChange} name="monthlyDayOption" options={monthlyDayOptions} clearable={false}/>

                                        </div>
                            </div>
                             <div className="column">
                                <div className="field">
                                            <label htmlFor="id_frequency">&nbsp;</label>
                                    <Select value={this.state.monthlyDay}  onChange={this.handleMonthlyDayChange} name="monthlyDay" options={dayOptions} clearable={false}/>


                                        </div>
                            </div>
                                 </div>
                                     </div>
                             }
                             </div>
                             {startAndEndRecurrenceUI}













</div>
                )

        }





        getForm = () => {
            var hourlyUI = this.getHourlyUI()
                        var dailyUI = this.getDailyUI()
                                    var onceUI = this.getOnceUI()



            var weeklyUI = this.getWeeklyUI()
                        var monthlyUI = this.getMonthlyUI()


                        if (this.state.image) {
                var imageUrl = this.state.image


            } else {
                var imageUrl = this.props.defaultImage
            }


        var descriptionEditor = this.getDescriptionEditor();

   if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if (forMobile) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";

           } else {


            var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }
          return (
              <div  className="ui page container form">
                  <div>{this.props.programHeaderErrors}</div>
                  <div className="ui row">&nbsp;</div>
                                            <Header headerLabel={this.state.id != ""? "Edit Step": "Create Step"} />



                      <div className="ui grid">
                          <div className="ui row">

<div className={wideColumnWidth}>


<NewImageUploader imageReturned={this.handleImageChange}
                  defaultImage={defaultStepCroppableImage.image}
                  forMobile={forMobile}
                  label="Select an image that will help motivate you."
                  croppableImage={this.state.croppableImage}
                  serverErrors={this.getServerErrors("croppableImage")}

/></div></div>
                          <div className="ui row">
                            <div className={mediumColumnWidth}>
                                              <input type="hidden" name="program" id="id_program" value={this.props.parentId}/>

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
                        </div>
                          { descriptionEditor }
                          <div className="ui row">
                            <div className={mediumColumnWidth}>
                                <div className="field">
                                            <label htmlFor="id_frequency">What type of step is this?</label>
                                    <Select value={this.state.type}  onChange={this.handleTypeChange} name="type" options={stepTypeOptions} clearable={false}/>


                                        </div>
                            </div>
                        </div>
                          </div>
                  <fieldset  ref="timeBasedUI" style={{marginTop: '25px', marginBottom: '25px', marginLeft:'0px', borderRadius:'4px', border: '1px solid #aaa'}}>
    <legend>Recurrence Rules</legend>
                       <div style={{display:'none'}} className="ui grid">

                         <div className="ui row">&nbsp;

                             </div>
                        </div>

                      {onceUI}
                                        {dailyUI}

                      {hourlyUI}
                      {weeklyUI}
                      {monthlyUI}



<div  className="ui grid">
                                                    <div className="ui row">

                            <div className={mediumColumnWidth}>
                                                                <div className="fluid field">

                                                                                    <label>Subscribers on same schedule?</label>

                                                                                    <div className="ui equal width buttons ">
                                                                 <ToggleButton  id="id_useRelativeTime" label="Personalized Schedule" value={!this.state.useAbsoluteTime} callback={this.handleUseRelativeTimeChange.bind(this)} />
<ToggleButton  id="id_useAbsoluteTime" label="Same Schedule" value={this.state.useAbsoluteTime} callback={this.handleUseAbsoluteTimeChange.bind(this)} />

</div>
                                                                                    </div>
                        </div></div>







</div>
                          </fieldset>



                    <UpdatesList programId={this.props.parentId} stepId={this.state.id}/>



                      <div className="ui three column stackable grid">
                                                    <div className="ui row">&nbsp;</div>

                          <div className="column">&nbsp;</div>
                          <div className="column">
                              <div className="ui large fluid button" onClick={this.handleCancelClicked}>Cancel</div>
                          </div>
                          <div className="column">

                              <SaveButton saved={this.state.saved} clicked={this.buildRecurrenceRuleAndSubmit} />
                          </div>
                      </div>

              </div>
          )

    };

    openModal() {
        this.setState({
            modalIsOpen: true
        });

        if (this.state.data) {
            this.setState({
                modalIsOpen: true,


            })
        }

    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        //this.refs.subtitle.style.color = '#f00';
    }

    closeModal() {
            this.setState({modalIsOpen: false});
            this.resetForm()
        store.dispatch(clearTempStep());


        }

        handleStepSubmit = (step) => {

        if (step.id != "") {

            var theUrl = "/api/steps/" + step.id + "/";
            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'PATCH',
                data: step,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    console.log("succcess of handle step submit")
                    this.setState({
                        updates:[],
                         saved: "Saved"
                    });
                    store.dispatch(updateStep(data.program, data));



                    this.closeModal();


                }.bind(this),
                error: function (xhr, status, err) {
                                        console.log("errror in here")

                    var serverErrors = xhr.responseJSON;
                    console.log("server Errors")
                    console.log(serverErrors)
                    this.setState({
                        serverErrors: serverErrors,
                         saved: "Save"
                    })

                }.bind(this)
            });
        }
        else {

            $.ajax({
                url: "/api/steps/",
                dataType: 'json',
                type: 'POST',
                data: step,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    store.dispatch(addStep(data.program, data));
                    this.submitUpdates(data.id)
                    this.closeModal();


                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                         saved: "Save"
                    })

                }.bind(this)
            });
        }


    };

    submitUpdates(theStepId) {
        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.updates != undefined) {
                if (this.props.storeRoot.updates.tempStep != undefined) {
                    var theData = this.props.storeRoot.updates.tempStep

                    var values = Object.keys(theData).map(function (key) {
                        return theData[key];
                    });
                    values.map(function (update) {
                            var steps_ids = []
                            steps_ids = update.steps_ids.slice()


                            if (steps_ids.indexOf(theStepId) < 0) {
                                steps_ids.push(theStepId)

                            }
                            if (update.id) {
                                var theUrl = "/api/updates/" + update.id + "/";
                                var theType = 'PATCH';

                            }
                            else {
                                var theUrl = "/api/updates/";
                                var theType = 'POST';
                            }
                            update.steps_ids = steps_ids
                            $.ajax({
                                url: theUrl,
                                dataType: 'json',
                                type: theType,
                                data: update,
                                headers: {
                                    'Authorization': 'Token ' + localStorage.token
                                },
                                success: function (data) {
                                    if (update.id) {
                                        store.dispatch(addUpdate(data))
                                    }
                                    else {
                                        store.dispatch(editUpdate(data))
                                    }


                                    //this.props.updateAdded(data);

                                }.bind(this),
                                error: function (xhr, status, err) {

                                    console.error(theUrl, status, err.toString());
                                    var serverErrors = xhr.responseJSON;
                                    this.setState({
                                        serverErrors: serverErrors,
                                    })

                                }.bind(this)
                            })
                        }
                    )


                }
            }
        }
    }









    render() {
    var theForm = this.getForm();

        if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if (forMobile) {
             var modalStyle = mobileModalStyle

           } else {


                var modalStyle = stepModalStyle

        }

            return(
                <div>
                    <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={modalStyle}>
                        {theForm}

                    </Modal>
                </div>

            )
        }



}


module.exports = {StepModalForm, TimeInput, ToggleButton, StepList, StepDetailView, StepBasicView, StepItemMenu, StepDetailPage};