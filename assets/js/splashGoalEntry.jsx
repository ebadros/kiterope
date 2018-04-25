var React = require('react');
let ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {Sidebar, ProgramViewEditDeleteItem, Header } from './base'
var Datetime = require('react-datetime');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
//var MaskedInput = require('react-maskedinput');
var classNames = require('classnames');
import validator from 'validator';
var UpdatesList = require('./update');
var Modal = require('react-modal');
var DatePicker = require('react-datepicker');
var moment = require('moment');
require('react-datepicker/dist/react-datepicker.css');
import TinyMCE from 'react-tinymce';
import ValidatedInput from './app'
import Dimensions from 'react-dimensions'
import TextTruncate from 'react-text-truncate';
import autobind from 'class-autobind'
import {GoalList } from './goal'
import {PlanList} from './plan'
import { GoalSMARTForm } from './goalSmartForm'
import Pagination from "react-js-pagination";
import { ProgramList, SubscribeableProgramList } from './program'
import { Provider, connect,  dispatch } from 'react-redux'
import  {store} from "./redux/store";
import { mapStateToProps, mapDispatchToProps } from './redux/containers2'

import Measure from 'react-measure'
import {timeCommitmentOptions} from './step'
import { setSmartGoalFormData, updateStep, setPublicGoals, setRehydrated, setDisplayAlert, removePlan, setGoalSearchQuery, setSearchQuery, setSearchHitsVisibility, deleteContact, setMessageWindowVisibility, setCurrentContact, addPlan, addStep, updateProgram, deleteStep, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, addGoal, updateGoal, deleteGoal, setContacts, setStepOccurrences } from './redux/actions'

import {
    SearchBox,
    RefinementListFilter,
    Hits,
    NoHits,
    HitsStats,
    SearchkitComponent,
    SelectedFilters,
    MenuFilter,
    HierarchicalMenuFilter,

    ResetFilters,
InitialLoader,
    } from "searchkit";

import { theServer, elasticSearchDomain } from './constants'
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'
import {SearchHitsGrid} from './search'
var Searchkit = require('searchkit');
var imageDirectory = "https://kiterope-static.s3.amazonaws.com/";

const host = "http://127.0.0.1:8000/api/plan/search";
//const searchkit = new Searchkit.SearchkitManager("http://127.0.0.1:9200/")
const searchkit = new Searchkit.SearchkitManager("https://search-kiterope-es-ghpxj2v7tzo6yzryzyfiyeof4i.us-west-1.es.amazonaws.com");


function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

import CallManager from './call'

import { Menubar, StandardSetOfComponents, Footer } from './accounts'


$.ajaxSetup({

crossDomain: true,

// Helps in setting cookie
xhrFields: {
    withCredentials: false
},

beforeSend: function (xhr, type) {
    // Set the CSRF Token in the header for security
    if (type.type !== "GET") {
        //var token = Cookies.get("X-CSRFToken");
        //xhr.setRequestHeader('X-CSRFToken', token);
                //xhr.setRequestHeader('Access-Control-Request-Headers', 'x-csrftoken');

    }
}



});



const placeholderText = [
    "run a mile in under 6 minutes",
    "learn to play the guitar",
    "learn to speak Chinese",
    "increase my income by 80% this year",
    "become a better parent",
    "take the best vacation of my life",
    "get a better job",
    "get into my first-choice college",


];


@connect(mapStateToProps, mapDispatchToProps)
export default class SplashGoalEntry extends React.Component {

    constructor(props) {
      super(props);
        autobind(this);

        this.state = {
            query:"",
            placeholder:"",
            queryUrl:"",
            placeholderIterator:0,
            placeholder:placeholderText[0],
            signInOrSignUpModalFormIsOpen:false,
            user:"",
            displayLoader: false
        }




    }

    componentDidMount = () => {
        this.setState({displayLoader:false})




        var intervalID = setInterval(this.changePlaceholderText, 2000);
        this.setState({intervalID:intervalID});
        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.gui.goalSearchQuery != undefined)
            this.setState({
                query: this.props.storeRoot.gui.goalSearchQuery,
                queryUrl:this.props.storeRoot.gui.goalSearchQuery,
            })
        }
        //this.loadPublicGoalData()



    };

    loadPublicGoalData () {
        var theUrl = "/api/publicGoals/";
                        $.ajax({
                            url: theUrl,
                            dataType: 'json',
                            cache: false,
                            success: function (data) {

                                store.dispatch(setPublicGoals(data))

                            }.bind(this),
                            error: function (xhr, status, err) {
                                console.error(theUrl, status, err.toString());

                            }.bind(this),

                        });
                    }


    componentWillReceiveProps = (nextProps) => {
        if (nextProps.storeRoot != undefined) {
            if (nextProps.storeRoot.gui.goalSearchQuery != undefined) {
                this.setState({
                    query: nextProps.storeRoot.gui.goalSearchQuery,
                    queryUrl: nextProps.storeRoot.gui.goalSearchQuery,
                })
            }
        }

    }



    componentWillUnmount = () => {
        clearInterval(this.state.intervalID)
    };

    changePlaceholderText = () => {
        if ( this.state.placeholderIterator > (placeholderText.length - 1)) {
            this.setState({ placeholderIterator: 0})
        }
        this.setState({
            placeholder:placeholderText[this.state.placeholderIterator],
            placeholderIterator: (this.state.placeholderIterator + 1),

        })

    };


    handleSubmit = (e) => {
        e.preventDefault()
        this.setState({displayLoader:true})

        setTimeout(() => {
            store.dispatch(setSmartGoalFormData({modalIsOpen: true, data: {title: "I will " + this.state.query}}))
            $(this.refs['setGoalInterface']).slideUp()
                    this.setState({displayLoader:false})

        }, 1000)
        store.dispatch(setGoalSearchQuery(this.state.query))

        //store.dispatch(push("/search/" + this.state.query + "/"));

        this.setState({
            queryUrl: this.state.query,
        });

//        var theQuery = this.state.query;


  //      this.props.onFormSubmit({
    //        query: theQuery,

      //  });
    };

    handleCancelClicked() {
        this.setState({query:""})
                    store.dispatch(setSmartGoalFormData({modalIsOpen: false, data:{} }))

            scroll(0,0)
                    $(this.refs['setGoalInterface']).slideDown()


    }

    handleCloseButtonClicked = () => {

         store.dispatch(setSmartGoalFormData({modalIsOpen:false, data:{}}))
                 store.dispatch(setGoalSearchQuery(""))

        //store.dispatch(setSearchHitsVisibility(false))
                    //store.dispatch(push("/search/") )


    };
    handleNeedsLogin = () => {
            this.setState({
                signInOrSignUpModalFormIsOpen: true
            },)

  };

  handleModalClosed = () => {
      this.setState({
                signInOrSignUpModalFormIsOpen: false
            })
  };

handleChangeQuery = (e) => {
    this.setState({
        query: e.target.value,
    })

};
_handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();


      this.handleSubmit(e)
    }
  };


    render () {

        if (this.state.query == "") {
            $(this.refs["ref_closeButton"]).hide();

        } else {
            $(this.refs["ref_closeButton"]).show();

        }

        if (this.state.displayLoader == true) {
            var loaderStyle ={
                display: 'block'
            }
        } else {
            var loaderStyle = {
                display: 'none'
            }
        }




        if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



                        if (!forMobile) {

    return (
        <div>
            <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen}
                                     modalShouldClose={this.handleModalClosed}/>
           <div className="ui page container">
                                       <div className="spacer">&nbsp;</div>

    <div ref="setGoalInterface">

                    <div className="ui one column grid">


                        <div className="ui row ">&nbsp;</div>

                        <div className="ui centered row  massiveType">What's your goal?</div>
                        <div className="ui row">&nbsp;</div>
                    </div>

                    <div className="ui grid">

    <div className="ui  row">

                        <div className="ui three wide column noRightPadding">
                            <input value="I will" className="searchLabel "
                                   type="text" disabled/>
                        </div>


                        <div className="ui eight wide column">
                            <div className="ui one column grid ">
                                <div className="column searchInputColumn">

                                    <input placeholder={this.state.placeholder} className="searchInput"
                                           type="text" value={this.state.query} onKeyPress={this._handleKeyPress}
                                           onChange={this.handleChangeQuery}/>
                                    <div className="searchCloseButton" ref="ref_closeButton"
                                         onClick={this.handleCloseButtonClicked}>
                                        <i className="large close icon"></i></div>

                                </div>

                            </div>
                        </div>
                        <div className="ui four wide column noBottomPadding">
                            <div className="ui fluid purple left floated medium button"
                                 onClick={this.handleSubmit} style={{paddingBottom: "0 !important"}}>Set Goal
                            </div>
                        </div>
        </div></div>
        <div className="ui spacer">&nbsp;</div>
                            <div className="ui spacer">&nbsp;</div>


                        <div style={loaderStyle} className="ui centered row">
        <div className="ui sixteen wide column">

            <div className="ui active indeterminate large text loader">Searching...</div>

                    </div>

               </div>

        </div>


                                       <GoalSMARTForm  cancelClicked={this.handleCancelClicked} serverErrors={this.state.serverErrors}/>








                </div>


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
                                <div className="column mediumResponsiveText">Offers detailed, step-by-step plans and
                                    access to domain-experts to make
                                    sure you know what you're supposed to be doing and that it's the right thing
                                </div>
                                <div className="column mediumResponsiveText">Tracks your progress to let you know when
                                    you're encountering an
                                    obstacle and revises your plan to help you improve
                                </div>
                                <div className="column mediumResponsiveText">Keeps you motivated by making you
                                    accountable and connecting you with people invested in your success
                                </div>
                            </div>
                    </div>


                </div>                    <div className="spacer">&nbsp;</div>

                    </div>
                            <div className="spacer">&nbsp;</div>

                    <div className="ui page container">
                        <Header headerLabel="Recent Public Goals"/>
                                <GoalList data={this.props.storeRoot.publicGoals} />
                        <div className="spacer">&nbsp;</div>
                                                <Header headerLabel="Recent Public Programs"/>

                                                        <SubscribeableProgramList data={this.props.storeRoot.publicPrograms} />

                </div>


<Footer />
        </div>



    )} else {
                            return (
        <div>
            <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen}
                                     modalShouldClose={this.handleModalClosed}/>
            <div className="ui page container">
                <div className="ui mobileSpacer">&nbsp;</div>
                    <div ref="setGoalInterface">


                    <div className="ui grid">

                        <div className="ui centered row header"><h2>What's your goal?</h2></div>


                        <div className="ui centered row">
                            <div className="ui column">


                                    <input placeholder={this.state.placeholder} className="mobileSearchInput"
                                           type="text" value={this.state.query} onKeyPress={this._handleKeyPress}
                                           onChange={this.handleChangeQuery}/>
                                    <div className="mobileSearchCloseButton" ref="ref_closeButton"
                                         onClick={this.handleCloseButtonClicked}>
                                        <i className="large close icon"></i></div>

                                </div>
                            </div>
                        <div className="ui row">&nbsp;</div>

                        <div className="ui row">
                                                        <div className="ui column">

                            <div className="ui fluid purple left floated medium button"
                                 onClick={this.handleSubmit} style={{paddingBottom: "0 !important"}}>Set Goal
                            </div>
                                                            </div>
                        </div>







</div><div className="ui spacer">&nbsp;</div>
                            <div className="ui spacer">&nbsp;</div>
                    </div>




                        <div style={loaderStyle} className="ui centered row">

        <div className="ui sixteen wide column">

            <div className="ui active indeterminate large text loader">Searching...</div>

                    </div>

               </div>
                </div>


        <GoalSMARTForm  cancelClicked={this.handleCancelClicked} serverErrors={this.state.serverErrors}/>







<div className="spacer">&nbsp;</div>


                <div className="blue">
                    <div className="centered header topPadding"><h3>Kiterope helps you get things done</h3></div>

                    <div className="ui page container">
                        <div className="ui center aligned four column grid">
                            <div className="ui row">&nbsp;</div>
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

                                <div className="column mediumResponsiveText">Keeps you focused on achieving your goals
                                </div>
                                <div className="column mediumResponsiveText">Offers step-by-step plans
                                </div>
                                <div className="column mediumResponsiveText">Tracks your progress
                                </div>
                                <div className="column mediumResponsiveText">Keeps you motivated
                                </div>
                            </div>
                    </div>


                </div>
                            <div className="ui row">&nbsp;</div>

            </div>

            <div className="spacer">&nbsp;</div>

                    <div className="ui page container">
                        <Header headerLabel="Recent Public Goals"/>
                                <GoalList data={this.props.storeRoot.publicGoals} />
                                                <div className="spacer">&nbsp;</div>

                         <Header headerLabel="Recent Public Programs"/>

                                                        <SubscribeableProgramList data={this.props.storeRoot.publicPrograms} />
                </div>
            <Footer />
        </div>



    )
                        }
    }

}

module.exports = {SplashGoalEntry }