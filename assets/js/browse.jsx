var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {ImageUploader, Breadcrumb,  ProgramViewEditDeleteItem, FormAction, Sidebar, FormHeaderWithActionButton, DetailPage} from './base';
import {PlanHeader, StepList, ToggleButton, StepForm, SimpleStepForm} from './step';
import {ProgramCalendar } from './calendar'
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router';
import { Menubar, StandardSetOfComponents, ErrorReporter, Footer } from './accounts'
import autobind from 'class-autobind'
import {StandardSetOfComponentsContainer} from './redux/containers'
import Measure from 'react-measure'


import { ValidatedInput, KSSelect } from './app'
import DatePicker  from 'react-datepicker';
import moment from 'moment';
import Pagination from "react-js-pagination";
import Select from 'react-select'
import TinyMCEInput from 'react-tinymce-input';
import CurrencyInput from 'react-currency-input';
import { Test , IconLabelCombo , ItemMenu, ClippedImage, ChoiceModal, ChoiceModalButton, ContextualMenuItem, ChoiceModalButtonsList,  } from './elements'
import { Textfit } from 'react-textfit';
import ShowMore from 'react-show-more';
import Modal from 'react-modal';
import Phone from 'react-phone-number-input'
import rrui from 'react-phone-number-input/rrui.css'
import rpni from 'react-phone-number-input/style.css'



import { makeEditable, StepCalendarComponent, StepEditCalendarComponent,  } from './calendar'
import { MessageWindowContainer } from './message'

import { Provider, connect, dispatch } from 'react-redux'
import  {store} from "./redux/store";

import { mapStateToProps, mapDispatchToProps } from './redux/containers'

import { addPlan, removePlan, setPlan, addStep, deleteStep, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, setContacts, setStepOccurrences } from './redux/actions'

import { theServer, times, s3IconUrl, formats, s3ImageUrl, programCategoryOptions, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, programScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, viewableByOptions, customStepModalStyles, notificationSendMethodOptions, TINYMCE_CONFIG } from './constants'
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'

function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
        const key = keyGetter(item);
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

function findLabel (theValue, theArray) {
        for (var i=0; theArray.length; i++ ) {
            if (theArray[i].value == theValue) {
                return theArray[i].label
            }
        }
    }



function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

export class IndividualProgram extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

    }



    render() {
        return (
            <Link to={`/plan/view/${this.props.id}/`}>{this.props.title}</Link>

        )
    }

}

export class ProgramCategory extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            programs: []
        }

    }
    componentDidMount () {
        this.setState({programs: this.props.programs})
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.programs != nextProps.programs) {
            this.setState({programs: nextProps.programs})
        }
}

    render() {
        var thePrograms = this.state.programs.map((program) => {
            return ( <IndividualProgram key={`program_${program.id}`} id={program.id} title={program.title}/>

            )
        });

        var theCategoryReadable = findLabel (this.props.category, programCategoryOptions);

        return (
            <div>
        <div className="column header"><h1>{theCategoryReadable}</h1></div>
        {thePrograms}
                </div>

        )
    }

}
export class BrowseProgramsPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: [],
            browseablePrograms:""



        }
    }

    componentDidMount() {
        this.loadExistingProgramsFromServer()
    }

    loadExistingProgramsFromServer () {
        var theUrl = "/api/browseablePrograms/";

      $.ajax({
      url: theUrl,
      dataType: 'json',
          type:'GET',
      cache: false,
        headers: {
               // 'Authorization': 'Token ' + localStorage.token
            },
      success: function(data) {
        this.setState({data: data}, this.getBrowseablePrograms(data)
)
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(theUrl, status, err.toString());
      }.bind(this),

    });

    }



    getBrowseablePrograms(data) {
        var theGlobalPrograms = {};
    if (data != undefined) {

        var thePrograms = data;


        for (var i=0; i < thePrograms.length; i++) {
            var theProgram = thePrograms[i];
            console.log(theProgram.category);
            if (theGlobalPrograms[theProgram.category] == undefined) {
                theGlobalPrograms[theProgram.category] = [];
                theGlobalPrograms[theProgram.category].push(theProgram)


            } else {
                theGlobalPrograms[theProgram.category].push(theProgram)
            }
        }
        this.setState({browseablePrograms: theGlobalPrograms})
    }
}








    render() {
        var theNodes ="";
        var theNumberOfPlans = this.state.data.length;

        if (this.state.browseablePrograms != undefined ) {
            var theData = this.state.browseablePrograms;
            var values = Object.keys(theData).map(function (key) {
                return theData[key];
            });

            var theNodes = values.map((theProgramCategory) => {
                return (

                    <ProgramCategory key={theProgramCategory[0].category} programs={theProgramCategory} category={theProgramCategory[0].category}/>
                )
            })
        }

        return (
        <div>
        <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen} modalShouldClose={this.handleModalClosed}/>
        <div className="">
            <div className="ui page container">
                <div className="spacer">&nbsp;</div>
                <div className="spacer">&nbsp;</div>

                <div className="massiveType">We currently feature {theNumberOfPlans} plans</div>
                <div className="spacer">&nbsp;</div>

                <div className="ui six column grid">
                {theNodes}
                    </div>


                <div className="ui alert"></div>


            </div>
                <div className="spacer">&nbsp;</div>
                            <div className="spacer">&nbsp;</div>


            <div className="blue">
                <div className="centered hugeType topPadding">Kiterope helps you get things done</div>
                <div className="spacer">&nbsp;</div>

                <div className="ui page container">
                    <div className="ui center aligned four column grid">
                        <div className="ui row">
                            <div className="column">
                                <img width="70%" src="/static/images/goal.svg"></img>
                                </div>
                            <div className="column">
                                <img width="70%" src="/static/images/strategy.svg"></img>
                                </div>
                            <div className="column">
                                <img width="70%" src="/static/images/bar-chart.svg"></img>
                                </div>
                            <div className="column">
                                <img width="70%" src="/static/images/checked.svg"></img>
                                </div>
                            </div>

                                                    <div className="ui row">

                        <div className="column mediumResponsiveText">Helps you set SMART goals and keeps you
                            focused on the process of achieving those goals
                        </div>
                        <div className="column mediumResponsiveText">Offers detailed, step-by-step plans and access to domain-experts to make
                            sure you know what you're supposed to be doing and that it's the right thing
                        </div>
                        <div className="column mediumResponsiveText">Tracks your progress to let you know when you're encountering an
                            obstacle and revises your plan to help you improve
                        </div>
                        <div className="column mediumResponsiveText">Keeps you motivated by making you accountable and connecting you with people invested in your success
                        </div>
                    </div>
                        </div>
                </div>


            </div>

        </div>
            </div>



    )
    }
}



module.exports = { BrowseProgramsPage};