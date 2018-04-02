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
import {SaveButton} from './settings'
import {ImageUploader,  NewImageUploader, PlanForm2, ViewEditDeleteItem, StepViewEditDeleteItem, PlanViewEditDeleteItem, FormAction, Sidebar, Header, FormHeaderWithActionButton, DetailPage} from './base';
import { Menubar, StandardSetOfComponents, ErrorReporter } from './accounts'
import { ValidatedInput } from './app'
import { IconLabelCombo, ClippedImage, ContextualMenuItem, ChoiceModal, ChoiceModalButtonsList } from './elements'
import { makeEditable,  ProgramCalendar } from './calendar'
import { UpdatesList, UpdateModalForm } from './update'


import { defaultStepCroppableImage, TINYMCE_CONFIG, theServer, s3IconUrl, s3BaseUrl, stepModalStyle, updateModalStyle, customStepModalStyles, formats, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, times, durations, stepTypeOptions, } from './constants'
import Measure from 'react-measure'
BigCalendar.momentLocalizer(moment);

import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'
import { Provider, connect, dispatch } from 'react-redux'
import  {store} from "./redux/store";
import { mapStateToProps, mapDispatchToProps } from './redux/containers2'
import { addStep, deleteStep, clearTempStep, addUpdate, updateStep, setUpdateModalData, setStepModalData, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, setContacts, setStepOccurrences } from './redux/actions'


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
            theDaysPerWeek = theDaysPerWeek + "M"
        }
        if (this.state.data.day02) {
            theDaysPerWeek = theDaysPerWeek + "T"
        }
        if (this.state.data.day03) {
            theDaysPerWeek = theDaysPerWeek + "W"
        }
        if (this.state.data.day04) {
            theDaysPerWeek = theDaysPerWeek + "R"
        }
        if (this.state.data.day05) {
            theDaysPerWeek = theDaysPerWeek + "F"
        }
        if (this.state.data.day06) {
            theDaysPerWeek = theDaysPerWeek + "Sa"
        }
        if (this.state.data.day07) {
            theDaysPerWeek = theDaysPerWeek + "Su"
        }
    }

setDateAndTimeInfo() {
        this.setDateInfo();
        this.setTimeInfo()
    }





    setDateInfo = () => {
        var theAbsoluteStartDate = this.state.data.absoluteStartDate;
        theAbsoluteStartDate = moment(theAbsoluteStartDate).format("MM/DD/YY");
        var theAbsoluteEndDate = this.state.data.absoluteEndDate;
        theAbsoluteEndDate = moment(theAbsoluteEndDate).format("MM/DD/YY");

        switch (this.state.data.frequency) {
            case("ONCE"):
                this.setState({
                    dateInfo: theAbsoluteStartDate
                });
                break;
            case("DAILY"):
                this.setState({
                    dateInfo: "Daily, " +  theAbsoluteStartDate + " to " + theAbsoluteEndDate,
                });
                break;
            case("WEEKLY"):
                this.setState({
                    dateInfo: this.getWeeklyDays() + " Weekly, " + theAbsoluteStartDate + " to " + theAbsoluteEndDate
                });
                break;
            case("MONTHLY"):
                this.setState({
                    dateInfo:  this.state.data.monthlyDates + " Montly, " + theAbsoluteStartDate + " to " + theAbsoluteEndDate
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
            });
            this.setDateAndTimeInfo(nextProps.data)


        }
        if (this.state.currentView != nextProps.currentView) {
            this.setState({
                currentView: nextProps.currentView
            });
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

    getWeeklyDays(theData) {
        var theDaysPerWeek = "";
        if (theData.day01) {
            theDaysPerWeek = theDaysPerWeek + "M"
        }
        if (theData.day02) {
            theDaysPerWeek = theDaysPerWeek + "T"
        }
        if (theData.day03) {
            theDaysPerWeek = theDaysPerWeek + "W"
        }
        if (theData.day04) {
            theDaysPerWeek = theDaysPerWeek + "R"
        }
        if (theData.day05) {
            theDaysPerWeek = theDaysPerWeek + "F"
        }
        if (theData.day06) {
            theDaysPerWeek = theDaysPerWeek + "Sa"
        }
        if (theData.day07) {
            theDaysPerWeek = theDaysPerWeek + "Su"
        }

        return theDaysPerWeek
    }


    setDateAndTimeInfo(theData) {
        this.setDateInfo(theData);
        this.setTimeInfo(theData)
    }


    setDateInfo = (theData) => {
        var theAbsoluteStartDate = theData.absoluteStartDate;
        theAbsoluteStartDate = moment(theAbsoluteStartDate).format("MM/DD/YY");
        var theAbsoluteEndDate = theData.absoluteEndDate;
        theAbsoluteEndDate = moment(theAbsoluteEndDate).format("MM/DD/YY");

        switch (theData.frequency) {

            case("ONCE"):
                this.setState({
                    dateInfo: theAbsoluteStartDate
                });
                break;

            case("DAILY"):
                this.setState({
                    dateInfo: "Daily, " +  theAbsoluteStartDate + " to " + theAbsoluteEndDate,
                });
                break;
            case("WEEKLY"):
                this.setState({
                    dateInfo: this.getWeeklyDays(theData) + ", Weekly, " + theAbsoluteStartDate + " to " + theAbsoluteEndDate
                });
                break;
            case("MONTHLY"):
                this.setState({
                    dateInfo:  this.state.data.monthlyDates + ", Monthly, " + theAbsoluteStartDate + " to " + theAbsoluteEndDate
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
             store.dispatch(push("/steps/" + this.state.data.id + "/updates"))
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
                                    <IconLabelCombo size="extramini" orientation="left" text={this.state.dateInfo} icon="calendar" background="Light" link="/goalEntry" />
                                    {this.state.timeInfo ? <IconLabelCombo size="extramini" orientation="left" text={this.state.timeInfo} icon="timeCommitment" background="Light" link="/goalEntry" /> :<div></div>}

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
                                    {this.state.timeInfo ? <IconLabelCombo size="extramini" orientation="right" text={this.state.timeInfo} icon="timeCommitment" background="Light" link="/goalEntry" /> :<div></div>}
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
            absoluteStartDate:moment(),
            absoluteEndDate:moment(),
            useAbsoluteTime:false,
            startDate:0,
            endDate:0,
            startTime:"09:00",
            duration:"",
            program:this.props.parentId,
            data:"",
            serverErrors:{},
            updates:[],
            modalIsOpen:false,
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
            $(this.refs['ref_whichDays']).show();
            $(this.refs['ref_whichDates']).hide();
            $(this.refs['ref_dateSet']).show();
            $(this.refs['ref_date']).hide();


        } else if (frequencyValue == "ONCE" || frequencyValue == "") {
            $(this.refs['ref_whichDays']).hide();
            $(this.refs['ref_whichDates']).hide();
            $(this.refs['ref_dateSet']).hide();
            $(this.refs['ref_date']).show();


        } else if (frequencyValue == "MONTHLY") {
            $(this.refs['ref_whichDays']).hide();
            $(this.refs['ref_whichDates']).show();
            $(this.refs['ref_dateSet']).show();
            $(this.refs['ref_date']).hide();


        } else if (frequencyValue == "DAILY") {
            $(this.refs['ref_whichDays']).hide();
            $(this.refs['ref_whichDates']).hide();
            $(this.refs['ref_dateSet']).show();
            $(this.refs['ref_date']).hide();

        }
    }

    showAndHideTypeUIElements (typeValue) {
         if (typeValue == "COMPLETION" || typeValue == "") {
            $(this.refs['ref_dateUI']).hide();



        } else if (typeValue == "TIME" ) {
             $(this.refs['ref_dateUI']).show();



        } else if (typeValue == "ORDERED_COMPLETION") {
             $(this.refs['ref_dateUI']).hide();
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
        $(this.refs['ref_whichDays']).hide();
            $(this.refs['ref_whichDates']).hide();
            $(this.refs['ref_dateSet']).hide();
        $(this.refs['ref_dateUI']).hide();

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
            var startDate = data.startDate;

            var endDate = data.endDate;


            var programStartDateInStringForm = data.programStartDate;
            var programStartDateInMomentForm = moment(programStartDateInStringForm);
            var calculatedStartDate = convertDate(programStartDateInMomentForm, startDate, "momentFormat", "relativeTime").format("YYYY-MM-DD");
            var calculatedEndDate = convertDate(programStartDateInMomentForm, endDate, "momentFormat", "relativeTime").format("YYYY-MM-DD");
            calculatedStartDate = moment(calculatedStartDate);
            calculatedEndDate = moment(calculatedEndDate);
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
                startDate: startDate,
                endDate: endDate,
                useAbsoluteTime: data.useAbsoluteTime,
                absoluteStartDate: calculatedStartDate,
                absoluteEndDate: calculatedEndDate,
                startTime: data.startTime,
                duration: data.duration,
                monthlyDates: data.monthlyDates,
                programStartDate: data.programStartDate,
                updates: data.updates,
            },() => {
                this.showAndHideTypeUIElements(this.state.type)
                this.showAndHideFrequencyUIElements(this.state.frequency)
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



   handleStartDateChange(date) {
        this.setState({startDate: date,
                            saved: "Save"});
  }
    handleEndDateChange(date) {
        this.setState({endDate: date,
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


    handleAbsoluteStartDateChange(date) {

        this.setState({
            absoluteStartDate: date,
            startDate: daysBetweenDates(this.state.programStartDate, date),
                            saved: "Save"
        });

        if (this.state.frequency == 'ONCE') {
            this.setState({
                absoluteEndDate: date,
                            saved: "Save"
            })
        }
        if (this.state.absoluteEndDate < date) {
            this.setState({
                absoluteEndDate: date,
                            saved: "Save"
            })
        }

  }
    handleAbsoluteEndDateChange(date) {
    this.setState({
            absoluteEndDate: date,
            endDate: daysBetweenDates(this.state.programStartDate, date),
                            saved: "Save"
        });

        if (this.state.absoluteStartDate > date) {
            this.setState({
                absoluteStartDate: date,

            })
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

    handleSubmit(e) {
        this.setState({saved:"Saving"})


    if (this.props.storeRoot.user) {

        var title = this.state.title;
        var image = this.state.image;
        var croppableImage = this.state.croppableImage.id;
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
        var duration = this.state.duration;
        var monthlyDates = this.state.monthlyDates;
        var theProgram = this.props.parentId;

        var absoluteStartDate = convertDate(this.state.absoluteStartDate, 0, "stringFormatComputer", "relativeTime");
        var absoluteEndDate = convertDate(this.state.absoluteEndDate, 0, "stringFormatComputer", "relativeTime");
        var programStartDate = convertDate(this.state.programStartDate, 0 , "dateFormat", "relativeTime");
        var useAbsoluteTime = this.state.useAbsoluteTime;

        var startDate = this.state.startDate;
        var endDate = this.state.endDate;
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
            absoluteStartDate:absoluteStartDate,
            absoluteEndDate:absoluteEndDate,
            useAbsoluteTime: useAbsoluteTime,
            startDate:startDate,
            endDate:endDate,
            startTime:startTime,
            duration:duration,
            program:theProgram,
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
                    absoluteStartDate: moment(),
                    absoluteEndDate: moment(),
                    startDate: 0,
                    useAbsoluteTime: false,
                    endDate: 0,
                    startTime: "",
                    duration: "",
                    durationMetric: "",
                    program: this.props.parentId,
                    updates: [],

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




        getForm = () => {

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
              <div className="ui page container form">
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
                  croppableImage={this.state.croppableImage} /></div></div>
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

                        <div ref="ref_dateUI" className="ui grid">


                        <div className="ui row">
                            <div className={mediumColumnWidth}>
                                <div className="field">
                                            <label htmlFor="id_frequency">Repeat?:</label>
                                    <Select value={this.state.frequency}  onChange={this.handleFrequencyChange} name="frequency" options={frequencyOptions} clearable={false}/>


                                        </div>
                            </div>
                        </div>
                         <div ref="ref_dateSet" className="ui row">
                                    <div className={smallColumnWidth}>
                                        <div className="field">
                                            <label htmlFor="id_absoluteStartDate">Start Date:</label>

                                            <DatePicker selected={this.state.absoluteStartDate} onChange={this.handleAbsoluteStartDateChange} />
                                            </div>
                                        </div>
                                    <div className={smallColumnWidth}>
                                        <div className="field">
                                            <label htmlFor="id_absoluteEndDate">End Date:</label>

                                            <DatePicker selected={this.state.absoluteEndDate} onChange={this.handleAbsoluteEndDateChange} />
                                            </div>
                                        </div>
                                    </div>
                                <div ref="ref_date" className="ui row">
                                    <div className={smallColumnWidth}>
                                        <div className="field">
                                            <label htmlFor="id_absoluteStartDate">Date:</label>

                                            <DatePicker selected={this.state.absoluteStartDate} onChange={this.handleAbsoluteStartDateChange} />
                                            </div>
                                        </div>
                                    </div>
                        <div className="ui row">
                            <div className={smallColumnWidth}>
                                <div className="field">
                                    <label>Start Time:</label>
                                    <Select value={this.state.startTime}
                                            onChange={this.handleStartTimeChange}
                                            name="startTime"
                                            options={times}
                                            clearable={false}/>


                                    {/* <select className="ui massive input middle aligned" name="amOrPm" id="id_amOrPm"
                                            onChange={this.handleStartTimeChange}>
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>*/}
                                </div>
                            </div></div>
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
                        <div className="ui row">
                            <div className={mediumColumnWidth}>
                                <div className="field">
                                    <label htmlFor="id_duration">For how long:</label>
                                    <Select value={this.state.duration}
                                            onChange={this.handleDurationChange}
                                            name="duration"
                                            options={durations}
                                            clearable={false}/>

                                </div>
                                                            </div>




                            </div>

                        <div ref="ref_whichDays" className="ui row">

                            <div className={wideColumnWidth}>
                                <div className="field fluid">
                                    <label>Select which days to schedule each week (based on
                                        a Monday start):</label>

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
                        <div ref="ref_whichDates" className="ui row">

                            <div className={smallColumnWidth}>

                                <div className="field fluid">

                                    <label htmlFor="id_date">What date(s) in a month would you like this to occur
                                        (1-30)?</label>
                                    <input type="text" name="monthlyDates" id="id_monthlyDates" value={this.state.monthlyDates} onChange={this.handleMonthlyDatesChange}/>

                                </div>

                            </div>
                        </div>



</div>

                    <UpdatesList programId={this.props.parentId} stepId={this.state.id}/>



                      <div className="ui three column stackable grid">
                                                    <div className="ui row">&nbsp;</div>

                          <div className="column">&nbsp;</div>
                          <div className="column">
                              <div className="ui large fluid button" onClick={this.handleCancelClicked}>Cancel</div>
                          </div>
                          <div className="column">
                              <SaveButton saved={this.state.saved} clicked={this.handleSubmit} />
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
                    this.setState({
                        updates:[],
                         saved: "Saved"
                    });
                    store.dispatch(updateStep(data.program, data));



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
             var modalStyle = stepModalStyle

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


module.exports = {StepModalForm, TimeInput, ToggleButton, StepList, StepDetailView, StepBasicView, StepItemMenu};