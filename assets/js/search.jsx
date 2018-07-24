var React = require('react');
let ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {Sidebar, ProgramViewEditDeleteItem, Header, ProfileViewEditDeleteItem } from './base'
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
import { SubscribeableProgramList, ProgramSubscriptionModalForm, ProgramList } from './program'
import { ContactList } from './contact'
import {ProfileList} from './profile'

import Pagination from "react-js-pagination";

import { Provider, connect,  dispatch } from 'react-redux'
import  {store} from "./redux/store";
import { mapStateToProps, mapDispatchToProps } from './redux/containers2'

import Measure from 'react-measure'
import {timeCommitmentOptions} from './step'
import { updateStep, removePlan, setSearchQuery, setProgramModalData, setSearchHitsVisibility, deleteContact, setMessageWindowVisibility, setCurrentContact, addPlan, addStep, updateProgram, deleteStep, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, addGoal, updateGoal, deleteGoal, setContacts, setStepOccurrences } from './redux/actions'

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

import { defaultProgramCroppableImage, theServer, elasticSearchDomain } from './constants'
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'
import {PlanSettingsForm} from './plan';

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


        //xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        //xhr.setRequestHeader('Accept', 'application/json');
        //xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        //xhr.setRequestHeader('Host', 'search-kiterope-es-ghpxj2v7tzo6yzryzyfiyeof4i.us-west-1.es.amazonaws.com');

        //xhr.setRequestHeader('X-Amz-Date', '20170601T235905Z');
        //xhr.setRequestHeader('Authorization', 'AWS4-HMAC-SHA256 Credential=AKIAJ5YZL4QGGT7IUJRA/20170601/us-west-1/es/aws4_request, SignedHeaders=content-type;host;x-amz-date, Signature=09f01b9bddb51e1781470b41ecf647416bcece793a140c0967f983b5929422d9');
//xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    //xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT ,DELETE');
    //xhr.setRequestHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');





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
export class SearchPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            searchQuery:''
        }
    }

    handleFormSubmit(query) {
                    store.dispatch(setSearchQuery(query["query"]))

        $.ajax({
        url: ("/api/searchQuery/"),
        dataType: 'json',
        type: 'POST',
        data: query,
        success:console.log("success"),
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });

    }
    componentDidMount = () => {
        if (this.props.params.search_query != undefined) {
            this.setState({searchQuery:this.props.params.search_query })
            store.dispatch(setSearchQuery(this.props.params.search_query))
            if (this.props.params.search_query != "") {
                //store.dispatch(setSearchHitsVisibility(true))


            } else {
                //store.dispatch(setSearchHitsVisibility(false))

            }

        }



    }





    render() {
            return (
                <div>
                <Search onFormSubmit={this.handleFormSubmit}/>
                                        <Footer /></div>

            )

    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class Search extends React.Component {

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
        }




    }

    componentDidMount = () => {
        var intervalID = setInterval(this.changePlaceholderText, 2000);
        this.setState({intervalID:intervalID});
        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.gui.searchQuery != undefined)
            this.setState({
                query: this.props.storeRoot.gui.searchQuery,
                queryUrl:this.props.storeRoot.gui.searchQuery,
            })
        }



    };

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.storeRoot != undefined) {
            if (nextProps.storeRoot.gui.searchQuery != undefined) {
                this.setState({
                    query: nextProps.storeRoot.gui.searchQuery,
                    queryUrl: nextProps.storeRoot.gui.searchQuery,
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
        e.preventDefault();
        store.dispatch(setSearchQuery(this.state.query))

        store.dispatch(push("/search/" + this.state.query + "/"));

        this.setState({
            queryUrl: this.state.query,
        });

        var theQuery = this.state.query;


        this.props.onFormSubmit({
            query: theQuery,

        });
    };

    handleCloseButtonClicked = () => {

        store.dispatch(setSearchQuery(""))
        store.dispatch(setSearchHitsVisibility(false))
                    store.dispatch(push("/search/") )


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
                            <ProgramSubscriptionModalForm />
            <PlanSettingsForm />
            {/*

            <div className="ui page container">

                    <div className="ui one column grid">
                        <div className="spacer">&nbsp;</div>


                        <div className="ui row ">&nbsp;</div>

                        <div className="ui centered row  massiveType">What do you want to do?</div>
                        <div className="ui row">&nbsp;</div>
                    </div>

                    <div>


                    <div className="ui grid">


                        <div className="ui three wide column noRightPadding">
                            <input value="I want to" className="searchLabel "
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
                                 onClick={this.handleSubmit} style={{paddingBottom: "0 !important"}}>Search Plans
                            </div>
                        </div>
                    </div>


                    <div className="ui grid">
                        <div className="ui eleven wide column">&nbsp;</div>
                        <div className="ui four wide column center aligned noPaddingTop">
                            <div className="ui fluid"><Link to="/browse/">Browse
                                Plans</Link></div>
                        </div>

                    </div>
                    </div>
*/}
<div>
                    <SearchHitsGrid needsLogin={this.handleNeedsLogin}/>
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


                </div>

            </div>
        </div>



    )} else {
                            return (
        <div>
            <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen}
                                     modalShouldClose={this.handleModalClosed}/>
                            <ProgramSubscriptionModalForm />

            <div className="ui page container">

                {/* <div className="ui grid">

                        <div className="ui centered row header"><h2>What do you want to do?</h2></div>


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
                                 onClick={this.handleSubmit} style={{paddingBottom: "0 !important"}}>Search Plans
                            </div>
                                                            </div>
                        </div>
                <div className="ui centered row">
                                                             <Link to="/browse/">Browse
                                Plans</Link>
                                                            </div>
                    </div>





*/}

                    <SearchHitsGrid needsLogin={this.handleNeedsLogin}/>
                </div>


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

            </div>
        </div>



    )
                        }
    }

}
@connect(mapStateToProps, mapDispatchToProps)
export class SearchBar extends React.Component {
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
            searchQuery:""
        }
    }

    componentDidMount() {
                if (this.props.params != undefined) {

                    if (this.props.params.search_query != undefined) {
                        this.setState({searchQuery: this.props.params.search_query})
                        store.dispatch(setSearchQuery(this.props.params.search_query))
                    }
                }

                    var intervalID = setInterval(this.changePlaceholderText, 2000);
        this.setState({intervalID:intervalID});
        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.gui.searchQuery != undefined)
            this.setState({
                query: this.props.storeRoot.gui.searchQuery,
                queryUrl:this.props.storeRoot.gui.searchQuery,
            })
        }

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.storeRoot != undefined) {
            if (nextProps.storeRoot.gui.searchQuery != undefined) {
                this.setState({
                    query: nextProps.storeRoot.gui.searchQuery,
                    queryUrl: nextProps.storeRoot.gui.searchQuery,
                })
            }
        }
    }

    changePlaceholderText = () => {
        if ( this.state.placeholderIterator > (placeholderText.length - 1)) {
            this.setState({ placeholderIterator: 0})
        }
        this.setState({
            placeholder:placeholderText[this.state.placeholderIterator],
            placeholderIterator: (this.state.placeholderIterator + 1),

        })

    };
    componentWillUnmount = () => {
        clearInterval(this.state.intervalID)
    };

    handleCloseButtonClicked = () => {

        store.dispatch(setSearchQuery(""))
        store.dispatch(setSearchHitsVisibility(false))
                    store.dispatch(push("/") )


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

    handleSubmit = (e) => {
        e.preventDefault();
        store.dispatch(setSearchQuery(this.state.query))

        store.dispatch(push("/search/" + this.state.query + "/"));

        this.setState({
            queryUrl: this.state.query,
        });

        var theQuery = this.state.query;


        this.handleFormSubmit({
            query: theQuery,

        });
    };

     handleFormSubmit(query) {
         store.dispatch(setSearchQuery(query["query"]))

         $.ajax({
             url: ("/api/searchQuery/"),
             dataType: 'json',
             type: 'POST',
             data: query,
             success: console.log("success"),
             error: function (xhr, status, err) {
                 console.error(this.props.url, status, err.toString());
             }.bind(this)
         });
     }

    render() {
        if (this.state.query == "") {
            var showCloseButton = false
            //$(this.refs["ref_closeButton"]).hide();

        } else {
            var showCloseButton = true
            //$(this.refs["ref_closeButton"]).show();

        }
        var forMobile = false
        if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }
            var width = 400
        if (forMobile == true) {
            var width = 250
        }



        return (
            <div className="ui sixteen wide column">
                            <div className="ui one column grid ">
                                <div className="column">

                    {showCloseButton ?
                                    <div className="ui right action left icon input">
                                        <i className="search icon"></i>

                                    <input placeholder={this.state.placeholder}  style={{width:width - 55}}
                                           type="text" value={this.state.query} onKeyPress={this._handleKeyPress}
                                           onChange={this.handleChangeQuery} />
                                    <div className="ui purple icon button"
                     ref="ref_closeButton"
                     onClick={this.handleCloseButtonClicked} >

                    <i className="large close icon"></i>
                </div></div> :<div className="ui  left icon input">
                                        <i className="search icon"></i>

                                    <input placeholder={this.state.placeholder} style={{width:width - 55}} className=""
                                           type="text" value={this.state.query} onKeyPress={this._handleKeyPress}
                                           onChange={this.handleChangeQuery} />
                                    </div>}






                                    </div>
                                </div>



                    </div>
        )
    }

}

@connect(mapStateToProps, mapDispatchToProps)
export class SearchHitsGrid extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: [],
            url: "",
            activePage: 1,
            count:"",
            plans:{},
            query:"",
            programData: [],
            contactData: [],
        }
    }


      loadObjectsFromServer = () =>  {
        if (this.state.query != "") {

            if (this.state.activePage != 1) {
                var theUrl = elasticSearchDomain + "haystack/_search/?page=" + this.state.activePage + "&text__contains=" + this.state.query
            } else {
                var theUrl = "https://hyjeadr7z5.execute-api.us-west-1.amazonaws.com/beta/?q=" + this.state.query
            }
            $.ajax({
                url: theUrl,
                dataType: 'json',
                cache: false,
                success: function (data) {
                    //console.log("succes in loading objects from server")
                    this.setState({
                        count:data.hits.total,

                        data: data.hits.hits,

                    }, ()=> this.updateSearchHitsSubscriptionStatus())
                    store.dispatch(setSearchHitsVisibility(true))

                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }.bind(this)
            });

        }
      };

      groupSearchResults = () => {
          var contactData = []
              var programData = []
          for (var key in this.state.data) {
              var theDatae = this.state.data[key]
              if (theDatae._source != undefined && this.props.storeRoot != undefined) {
                  switch (theDatae._source.model) {
                      case "Profile":
                          if (theDatae._source.id == this.props.storeRoot.profile.id) {
                              break
                          }
                          if (this.props.storeRoot.contacts[theDatae._source.id] == undefined) {
                              var aContactData = Object.assign({}, theDatae._source, {wasConfirmed:""})

                          } else {
                              var aContactData = Object.assign({}, theDatae._source, {wasConfirmed:this.props.storeRoot.contacts[theDatae._source.id].wasConfirmed})

                          }
                          contactData.push(aContactData)
                          break
                      case "Program":
                          programData.push(theDatae._source)
                          break

                  }
          }
          }

          this.setState({
              contactData:contactData,
              programData:programData,

          })
      }

      updateSearchHitsSubscriptionStatus = () => {
          //console.log("updateSearchHistsubscriptionstatus")
          if (this.state.plans) {

                  var subscribedPlans = {}


                  for (var key in this.state.plans) {
                      if (this.state.plans[key].isSubscribed) {
                          subscribedPlans[this.state.plans[key].program] = key
                      }

                  }
                  //console.log("subscribedPlans", subscribedPlans)
                  var theSearchData = Object.assign([], this.state.data)
                  for (var i=0; i < theSearchData.length; i++ ) {
                      var aSearchHit = theSearchData[i]
                      if (subscribedPlans[aSearchHit._source.id] != undefined ) {

                          var revisedSearchHit = Object.assign({}, aSearchHit )
                          var revisedSearchHitSource = Object.assign({}, revisedSearchHit._source, {isSubscribed: true, planId: subscribedPlans[aSearchHit._source.id] }, )
                          revisedSearchHit._source = revisedSearchHitSource
                          theSearchData[i] = revisedSearchHit

                      } else {
                          var revisedSearchHit = Object.assign({}, aSearchHit )
                          var revisedSearchHitSource = Object.assign({}, revisedSearchHit._source, {isSubscribed: false }, )
                          revisedSearchHit._source = revisedSearchHitSource
                          theSearchData[i] = revisedSearchHit

                      }
                  }
                                    //console.log("theSearchData", theSearchData)

                  this.setState({data: theSearchData}, () => this.groupSearchResults())
              }

      }





      componentDidMount = () => {
          $(this.refs["ref_searchHits"]).hide();
          if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.gui.searchQuery != undefined) {
                this.setState({
                    query: this.props.storeRoot.gui.searchQuery,
                    queryUrl: this.props.storeRoot.gui.searchQuery,
                    url: this.props.storeRoot.gui.searchQuery

                },          this.loadObjectsFromServer)

            }

            if (this.props.storeRoot.plans) {
                    if (this.state.plans != this.props.storeRoot.plans) {
                        this.setState({plans: this.props.storeRoot.plans}, () => this.updateSearchHitsSubscriptionStatus())
                    }
                }
        }

          //this.showOrHideSearchHits(this.props.visible)

          //var intervalID = setInterval(this.loadObjectsFromServer, 2000);
        //this.setState({intervalID:intervalID});


      };

      componentWillUnmount() {
          clearInterval(this.state.intervalID)
      }

      showOrHideSearchHits = (shouldBeVisible)=> {
          console.log("showOrHideSearchHits " + shouldBeVisible)

          if (shouldBeVisible) {
              console.log("showing ref_searchHits")
              $(this.refs["ref_searchHits"]).slideDown();
          } else {

              $(this.refs["ref_searchHits"]).slideUp();

          }

      }

      componentWillReceiveProps = (nextProps) => {
          if (nextProps.storeRoot != undefined) {
            if (nextProps.storeRoot.gui.searchQuery != undefined) {
                if (this.state.query != nextProps.storeRoot.gui.searchQuery) {

                    this.setState({
                        query: nextProps.storeRoot.gui.searchQuery,
                        queryUrl: nextProps.storeRoot.gui.searchQuery,
                        url: nextProps.storeRoot.gui.searchQuery

                    }, this.loadObjectsFromServer)
                }

            }

                        if (nextProps.storeRoot.gui.searchHitsVisibility != undefined) {

                            if (this.state.visible != nextProps.storeRoot.gui.searchHitsVisibility) {
                                this.setState({
                                    visible: nextProps.storeRoot.gui.searchHitsVisibility,
                                })
                                this.showOrHideSearchHits(nextProps.storeRoot.gui.searchHitsVisibility)
                            }
                        }







                if (nextProps.storeRoot.plans) {
                    if (this.state.plans != nextProps.storeRoot.plans) {
                        this.setState({plans: nextProps.storeRoot.plans}, () => this.updateSearchHitsSubscriptionStatus())
                    }
                }
            }

      }

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

      handleWePlanClick() {
                          //store.dispatch(push('/goalEntry'))

      store.dispatch(push('/goalEntry'))
      }

      handleYouPlanClick() {
          //store.dispatch(push('/goalEntry'))
      store.dispatch(push('/programs'))
          var theData = {modalIsOpen:true, data:{croppableImage:defaultProgramCroppableImage}}
      store.dispatch(setProgramModalData(theData))

      }


    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
    }

    handleNeedsLogin = () => {
      this.props.needsLogin()
  };

    render () {





        if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }




        {/*return (
                <ProgramViewEditDeleteItem key={objectData._source.id}
                                           isListNode={true}
                                           currentView="Basic"
                                           showCloseButton={false}
                                           hideControlBar={true}
                                           apiUrl="/api/programs/"
                                           id={objectData._source.id}
                                           data={objectData._source}
                                           editable={false}
                                           needsLogin={this.handleNeedsLogin}
                                           forSearch={true}
                                           userPlanOccurrenceId = {objectData._source.planId}
                                           extendedBasic={false} />
                )
                } else if (objectData._source.model == 'Profile') {
                    return (
                    <ProfileViewEditDeleteItem key={objectData._source.id}
                                            isListNode={true}
                                            showCloseButton={false}
                                            apiUrl="/api/profiles/"
                                            id={objectData._source.id}
                                            data={objectData._source}
                                            currentView="Basic"/>
                    )
                }
*/}

                      //  <PlanHit key={objectData.id} result={objectData} />





        if (this.state.count == 0) {
            if (!forMobile) {

            var noResultsFoundText = (
                <div className="ui grid largeType">
                    <div className="ui row">
                        <div className="ui two wide column">&nbsp;</div>
                        <div className="ui center aligned ten wide column">We didn't find any existing plans that seem
                            to match.
                        </div>
                    </div>
                    <div className="ui row">
                        <div className="ui two wide column">&nbsp;</div>

                        <div className="ui center aligned ten wide column">
                            <div className="ui two column grid">
                                <div className="column">

                                    <div className="ui fluid  large purple button" onClick={this.handleWePlanClick}>Let
                                        Us Design a Plan for You
                                    </div>
                                </div>
                                <div className="column">

                                    <div className="ui fluid  large purple button" onClick={this.handleYouPlanClick}>
                                        Design Your Own Plan
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
                var noResultsFoundText = (
                    <div>
                <div className="ui grid">
                    <div className="ui centered row header"><h4>
                        We didn't find any existing plans that
                            match.</h4>
                        </div>
                    </div>
                            <div className="ui two column grid">
                                <div className="ui column">

                                    <div className="ui fluid  medium purple button" onClick={this.handleWePlanClick}>Let
                                        Us Design a Plan for You
                                    </div>
                                </div>
                                <div className="ui column">

                                    <div className="ui fluid  medium purple button" onClick={this.handleYouPlanClick}>
                                        Design Your Own Plan
                                    </div>
                                </div>
                            </div>
                    </div>

            )
            }

        }
        var pagination = this.getPagination();





        return (
                        <div className="ui page container">
                                                <div className="spacer">&nbsp;</div>


            <div ref="ref_searchHits">
                                 {this.state.programData.length != 0 ? <div>
                                     <Header headerLabel="Matching Programs" />
<ProgramList data={this.state.programData}/><div className="ui spacer">&nbsp;</div></div>:null}


                {this.state.contactData.length != 0 ?                                   <div><Header headerLabel="Matching People" />
<ProfileList data={this.state.contactData}/></div>:null}


                {noResultsFoundText}
                <div className="spacer">&nbsp;</div>
                {pagination}
            </div>
                            </div>
            )
    }
}

var SearchPage3 = React.createClass({

    handleGoalQueryChange:function(e) {
        this.setState({goalQuery: e.target.value});


    },



    handleDateQueryChange:function(e) {
        this.setState({dateQuery: e.target.value});


    },

    componentDidMount: function () {
        var intervalID = setInterval(this.changePlaceholderText, 2000);
        this.setState({intervalID:intervalID});
        $(this.refs["search_hits"]).hide();




    },

    changePlaceholderText: function () {
        if ( this.state.placeholderIterator > (placeholderText.length - 1)) {
            this.setState({ placeholderIterator: 0})
        }
        this.setState({
            placeholder:placeholderText[this.state.placeholderIterator],
            placeholderIterator: (this.state.placeholderIterator + 1),

        })

    },

    getInitialState: function() {
        return ({
            goalQuery: "",
            dateQuery:"",
            placeholder:"",
            placeholderIterator: 0,
        })
    },

    render: function() {
                const SearchkitProvider = Searchkit.SearchkitProvider;

        return(
            <div className="fullPageDiv">
                <div className="ui page container">
                    <div className="spacer">&nbsp;</div>
                    <div className="ui alert"></div>
                                            <SearchkitProvider searchkit={searchkit}>

                    <div className="ui center aligned grid">
                            <div className="ui row hugeType">

                                <div className="search">

                                    <div className="search__query">
                                    </div>
                                    <label className="NLtextinput"> I want to </label>
                                    {/*Change Searchkit/Searchbox code line 101 to:
                                     React.createElement("div", {type: "submit", value: "search", className: "ui two column wide purple button", "data-qa": "submit"},"Search"),
                                     */}
                                    <SearchBox searchOnChange={false}
                                               placeholder={this.state.placeholder}
                                               queryOptions={{analyzer: "standard"}}
                                               queryFields={["title", "description", "author", "image", "cost", "scheduleLength", "costFrequencyMetric"]}/>
                                </div>
                            </div>

                            <div ref="search_hits" className="ui row">
                                <Hits mod="ui stackable three column grid" hitsPerPage={8}
                                      itemComponent={PlanHit}/>
                                <NoHits translations={{
                                    "NoHits.NoResultsFound": "No plans found were found for '{query}'",
                                    "NoHits.DidYouMean": "Search for {suggestion}",
                                    "NoHits.SearchWithoutFilters": "Search for {query} without filters"
                                }} suggestionsField="title"/>
                            </div>



                    </div>
                                                                        </SearchkitProvider>

                </div>
            </div>

        )
    }


});



export class AtomicImage extends React.Component {
   constructor(props) {
        super(props);
        this.state = {dimensions: {}};
        this.onImgLoad = this.onImgLoad.bind(this);
    }


    onImgLoad({target:img}) {

        var imageAspectRatio = img.offsetWidth/img.offsetHeight;
        this.setState({dimensions:{height:img.offsetHeight,
                                   width:img.offsetWidth},
            imageAspectRatio:imageAspectRatio
        });
    }
    render(){
        const {src} = this.props;
        const {width, height} = this.state.dimensions;



        return (
                <div className="image" >
                <img onLoad={this.onImgLoad} src={src} />

                    <div className="overlayText" style={{ width:this.props.containerWidth, height:this.props.containerHeight }}><span>{this.props.text}</span></div>
                </div>
               );
    }
}

var OverlayText = React.createClass({

    getInitialState: function () {
        return null
    },

    onImgLoad({target:img}) {

        var imageAspectRatio = img.offsetHeight/img.offsetWidth;
        this.setState({dimensions:{height:img.offsetHeight,
                                   width:img.offsetWidth},
            imageAspectRatio:imageAspectRatio
        });
    },



    calculateFontSize: function() {
        var numberOfLetters = this.props.text.length;
        //console.log("number of Letters " + numberOfLetters);

        var screenWidth = $(window).width();
        //console.log("screenWidth " + screenWidth);



        var screenMultiplier = .25;
        var lettersMultiplier = -50;
        var screenRatio = screenMultiplier * screenWidth;
        var numberOfLettersRatio = lettersMultiplier  * numberOfLetters;


        var ratio = numberOfLettersRatio;

        var fontSize = 20 * ratio;
        //console.log("screenRatio " + screenRatio);
        //console.log("numberOfLettersRatio " + numberOfLettersRatio);
        //console.log("ratio " + ratio);
                //console.log("fontSize " + fontSize);

        return fontSize

    },

    calculateLineHeight: function () {
        var lineHeight = this.calculateFontSize + 1;
        return lineHeight
    },





    render: function() {
        //var myFontSize = this.calculateFontSize() +"vw"
        //var myLineHeight = this.calculateLineHeight() + "vw"

        //var myStyle = {
        //    fontSize: myFontSize,
        //    lineHeight: myLineHeight
        //}


        return (
            <div className="image overlayedImage" >
                <img onLoad={this.onImgLoad} src={this.props.src} />
            <div className="overlayText">{this.props.text}</div>
                                </div>

        )
    }

});

export class PlanHit2 extends React.Component {

    render () {
        const result = this.props.result;
        let url = "/plans/" + result.id + "/steps";
        return (
                <div className="column" key={result.id}>


                    <Link to={`/plans/${result.id}/steps`}>
                    <div className="ui fluid card">


                        <div className="image" ><div className="ui purple large right ribbon label">100% Success</div>

                            <img src={imageDirectory + result.image} />
                        </div>
                        <div className="content">

                        <div className="header">{result.title}</div>
                            </div>

                              <div className="extra content">
                                            <div dangerouslySetInnerHTML={{__html: result.description}}></div>
                                  <div>&nbsp;</div>

                                        <div>Requires {result.timeCommitment} for {result.scheduleLength}</div>
<div>&nbsp;</div>
                                  <div>${result.cost} {result.costFrequencyMetric}</div>
                                  <div>&nbsp;</div>

<Link to={`/profiles/${result.author_id}/`}><UserLink userId={result.author_id} image={result.author_image} /></Link>

                              </div>



                            </div>

</Link>
            </div>

        )
    }
}

var PlanHit = React.createClass({
    render: function() {
        const result = this.props.result;
        let url = "/plans/" + result.id + "/steps";
        return (
                <div className="column" key={result.id}>


                    <Link to={`/plans/${result.id}/steps`}>
                    <div className="ui fluid card">


                        <div className="image" ><div className="ui purple large right ribbon label">100% Success</div>

                            <img src={imageDirectory + result.image} />
                        </div>
                        <div className="content">

                        <div className="header">{result.title}</div>
                            </div>

                              <div className="extra content">
                                            <div dangerouslySetInnerHTML={{__html: result.description}}></div>
                                  <div>&nbsp;</div>

                                        <div>Requires {result.timeCommitment} for {result.scheduleLength}</div>
<div>&nbsp;</div>
                                  <div>${result.cost} {result.costFrequencyMetric}</div>
                                  <div>&nbsp;</div>

<Link to={`/profiles/${result.author_id}/`}><UserLink userId={result.author_id} /></Link>

                              </div>



                            </div>

</Link>
            </div>

        )
    }
});

export class UserLink2 extends React.Component {
    constructor (props) {
        super (props);
        this.state = {
            firstName:"",
            lastName:"",
            bio:"",
            isCoach:"",
            zipCode:"",
            image:"",
        }

    }

    componentDidMount () {
        //console.log("componentDidMount");
        this.loadObjectsFromServer()

    }

    loadObjectsFromServer = () => {
        $.ajax({
          url: "/api/profiles/" + this.props.userId + "/",
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  firstName:data.firstName,
                  lastName:data.lastName,
                  bio:data.bio,
                  isCoach:data.isCoach,
                  zipCode:data.zipCode,
                  image:data.image,

              })


          }.bind(this),
          error: function(xhr, status, err) {
            console.error(url, status, err.toString());
          }.bind(this)
        });
      };

      render() {
          return (
              <div>

                   <img className="ui avatar image" src={this.state.image} />
<span>Designed by {this.state.firstName} {this.state.lastName}</span>
              </div>
          )
      }
}

var Searchbar2 = React.createClass({
    render: function() {
        const SearchkitProvider = Searchkit.SearchkitProvider;

        return (


                <SearchkitProvider searchkit={searchkit}>
                    <div className="">

                        <div className="search__query hidden"><SearchBox />
                        </div>

                            <Hits hitsPerPage={6} itemComponent={PlanHit}/>

                    </div>
                </SearchkitProvider>

        )
    }

});


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


module.exports = { SearchPage, SearchHitsGrid, SearchBar };