var React = require('react');
let ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {Sidebar, ProgramViewEditDeleteItem } from './base'
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

import Pagination from "react-js-pagination";

import { Provider, connect, store, dispatch } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './redux/containers'

import Measure from 'react-measure'
import {timeCommitmentOptions} from './step'

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

var Searchkit = require('searchkit')
var imageDirectory = "https://kiterope-static.s3.amazonaws.com/"

const host = "http://127.0.0.1:8000/api/plan/search"
//const searchkit = new Searchkit.SearchkitManager("http://127.0.0.1:9200/")
const searchkit = new Searchkit.SearchkitManager("https://search-kiterope-es-ghpxj2v7tzo6yzryzyfiyeof4i.us-west-1.es.amazonaws.com")


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
    "learn to play the guitar like Jimmy Page",
    "learn to speak Chinese",
    "increase my income by 80% this year",
    "become a better parent",
    "take the best vacation of my life",
    "get a better job",
    "get into my first-choice college",


]


@connect(mapStateToProps, mapDispatchToProps)
export class SearchPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
    }

    handleFormSubmit(query) {
        $.ajax({
        url: ("api/searchQuery/"),
        dataType: 'json',
        type: 'POST',
        data: query,
        success: console.log("success"),
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });

    }


    render() {
        if (this.props.params.search_query) {
            return (
                <div>
                <Search query={this.props.params.search_query} onFormSubmit={this.handleFormSubmit}/>
                                        <Footer /></div>

            )
        } else {
            return (
                <div>
                <Search onFormSubmit={this.handleFormSubmit}/>
                                        <Footer /></div>

            )
        }
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
        if (this.props.query != null) {
            this.setState({
                query: this.props.query,
                queryUrl:this.props.query,
                resultsVisible: true,
            })
        }



    }



    componentWillUnmount = () => {
        clearInterval(this.state.intervalID)
    }

    changePlaceholderText = () => {
        if ( this.state.placeholderIterator > (placeholderText.length - 1)) {
            this.setState({ placeholderIterator: 0})
        }
        this.setState({
            placeholder:placeholderText[this.state.placeholderIterator],
            placeholderIterator: (this.state.placeholderIterator + 1),

        })

    }





    handleSubmit = (e) => {
        e.preventDefault();
        hashHistory.push("/search/" + this.state.query + "/")

        this.setState({
            queryUrl: this.state.query,
        })

        var theQuery = this.state.query;


        this.props.onFormSubmit({
            query: theQuery,

        });
    }

    handleCloseButtonClicked = () => {
        this.setState({
            query:"",
            queryUrl:"",
            resultsVisible:"false",

            },
                            //store.dispatch(push('/search/'))

            hashHistory.push("/search/")



        )

    }
    handleNeedsLogin = () => {
            this.setState({
                signInOrSignUpModalFormIsOpen: true
            },)

  }

  handleModalClosed = () => {
      this.setState({
                signInOrSignUpModalFormIsOpen: false
            })
  }

handleChangeQuery = (e) => {
    this.setState({
        query: e.target.value,
    })

}
    render () {
        if (this.state.query == "") {
            $(this.refs["ref_closeButton"]).hide();

        } else {
            $(this.refs["ref_closeButton"]).show();

        }
    return (
        <div>
        <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen} modalShouldClose={this.handleModalClosed}/>
        <div className="">
            <div className="ui container">
                <div className="spacer">&nbsp;</div>


                <div className="ui alert"></div>
                <form className="ui form" onSubmit={this.handleSubmit}>

                    <div className="splashPageSection">


                        <div className="ui grid ">
                            <div className="ui row">&nbsp;</div>
                            <div className="ui row">&nbsp;</div>

                            <div className="ui centered row massiveType">What do you want to do?</div>
                                                <div className="ui row">&nbsp;</div>

                            <div className="ui row noPaddingBottom">

                                <input value="I want to" className="ui two wide column right aligned  searchLabel"
                                       type="text" disabled/>


                                <input placeholder={this.state.placeholder} className="ui nine wide column searchInput"
                                       type="text" value={this.state.query} onChange={this.handleChangeQuery}/>

                                <div ref="ref_closeButton" onClick={this.handleCloseButtonClicked} ><i className="large close icon"></i></div>
                                <button type="submit"
                                        className="ui right floated fluid three wide column purple button">Search Plans
                                </button>

                            </div>
                        </div>
                    </div>
                </form>
                <SearchHitsGrid url={this.state.queryUrl} visible={this.state.resultsVisible} needsLogin={this.handleNeedsLogin}/>
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

                        <div className="column">Helps you set SMART goals and keeps you
                            focused on the process of achieving those goals
                        </div>
                        <div className="column">Offers detailed, step-by-step plans and access to domain-experts to make
                            sure you know what you're supposed to be doing and that it's the right thing
                        </div>
                        <div className="column">Tracks your progress to let you know when you're encountering an
                            obstacle and revises your plan to help you improve
                        </div>
                        <div className="column">Keeps you motivated by making you accountable and connecting you with people invested in your success
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

@connect(mapStateToProps, mapDispatchToProps)
export class SearchHitsGrid extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            data: [],
            url: "",
            visible:"false",
            activePage: 1,
            count:"",
            plans:{}
        }
    }

/*
    loadObjectsFromServerHaystack = () =>  {
        if (this.state.url != "") {
            if (this.state.activePage != 1) {
                var theUrl = elasticSearchDomain + "haystack/_search/?page=" + this.state.activePage + "&text__contains=" + this.state.url
            } else {
                var theUrl = elasticSearchDomain + "haystack/_search/?q=" + this.state.url
            }
            $.ajax({
                url: theUrl,
                dataType: 'json',
                cache: false,
                xhrFields: {
        },
                headers: {
                    'Access-Control-Allow-Origin': 'http://localhost:8000'
                },
                crossDomain: true,
                success: function (data) {
                    this.setState({

                        data: data.hits.hits,

                    }, this.showSearchHits)

                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }.bind(this)
            });

        }
      }
*/
      loadObjectsFromServer = () =>  {
        if (this.state.url != "") {
            if (this.state.activePage != 1) {
                var theUrl = elasticSearchDomain + "haystack/_search/?page=" + this.state.activePage + "&text__contains=" + this.state.url
            } else {
                var theUrl = "https://hyjeadr7z5.execute-api.us-west-1.amazonaws.com/beta/?q=" + this.state.url
            }
            $.ajax({
                url: theUrl,
                dataType: 'json',
                cache: false,
                success: function (data) {
                    this.setState({
                        count:data.hits.total,

                        data: data.hits.hits,

                    }, this.showSearchHits)

                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }.bind(this)
            });

        }
      }
/*
      loadObjectsFromServerLocal = () =>  {
        if (this.state.url != "") {
            if (this.state.activePage != 1) {
                var theUrl = "/api/program/search?page=" + this.state.activePage + "&text__contains=" + this.state.url
            } else {
                var theUrl = "/api/program/search/?text__contains=" + this.state.url
            }
            $.ajax({
                url: theUrl,
                dataType: 'json',
                cache: false,
                success: function (data) {
                    this.setState({
                        count: data.count,
                        next:data.next,
                        previous:data.previous,
                        data: data.results,

                    }, this.showSearchHits)

                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }.bind(this)
            });

        }
      }*/

      showSearchHits = () => {
          this.setState({
              visible:"true",
          })

            $(this.refs["ref_searchHits"]).slideDown();
                    //clearInterval(this.state.intervalID)

    }

      componentDidMount = () => {
          $(this.refs["ref_searchHits"]).hide();
         // this.loadObjectsFromServer
          //var intervalID = setInterval(this.loadObjectsFromServer, 2000);
        //this.setState({intervalID:intervalID});


      }

      componentWillUnmount() {
          clearInterval(this.state.intervalID)
      }

      componentWillReceiveProps(nextProps) {

            if (this.props.url != nextProps.url ) {
                this.setState({
                    url: nextProps.url,
                    visible: nextProps.visible,

                }, this.loadObjectsFromServer)

            }

            if (this.props.visible != nextProps.visible) {
                this.setState({
                    visible: nextProps.visible,
                    count:"",
                })

            }

            if (nextProps.storeRoot != undefined) {
                if (nextProps.storeRoot.plans) {
                    if (this.state.plans != this.props.storeRoot.plans) {
                        this.setState({plans: nextProps.storeRoot.plans})
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

      hashHistory.push('/goalEntry')
      }

      handleYouPlanClick() {
          //store.dispatch(push('/goalEntry'))
      hashHistory.push('/goalEntry')
      }


    handlePageChange(pageNumber) {
        this.setState({activePage: pageNumber});
    }

    handleNeedsLogin = () => {
      this.props.needsLogin()
  }

    render () {
        if (this.state.visible == 'true') {
            $(this.refs["ref_searchHits"]).slideDown();

        } else {
            $(this.refs["ref_searchHits"]).slideUp();

        }


         if (this.state.data ) {
            var objectNodes = this.state.data.map(function (objectData) {
                        var theUserPlanOccurrenceId = ""

                if (this.props.storeRoot) {
                    if (this.props.storeRoot.plans) {
                        for (var key in this.props.storeRoot.plans) {
                            console.log("key is " + key + " objectDasta source id " +  objectData._source.id)
                            if ((this.props.storeRoot.plans[key].program == objectData._source.id) && (this.props.storeRoot.plans[key].isSubscribed)) {
                                console.log("this.props.storeRoot.plans[key].program is " + this.props.storeRoot.plans[key].program + " objectDasta source id " +  objectData._source.id)

                                objectData._source.isSubscribed = this.props.storeRoot.plans[key].isSubscribed
                                 theUserPlanOccurrenceId = key

                            }
                        }

                    }
                }





                return (
                <ProgramViewEditDeleteItem key={objectData._source.id}
                                           isListNode={true}
                                           currentView="Basic"
                                           showCloseButton={false}
                                           hideControlBar={true}
                                           apiUrl="api/programs/"
                                           id={objectData._source.id}
                                           data={objectData._source}
                                           editable={false}
                                           needsLogin={this.handleNeedsLogin}
                                           userPlanOccurrenceId = {theUserPlanOccurrenceId} />

                      //  <PlanHit key={objectData.id} result={objectData} />

                )
            }.bind(this));

        }
        if (this.state.count == 0) {
            var noResultsFoundText = (
                <div className="ui grid largeType">
                    <div className="ui row">
                        <div className="ui two wide column">&nbsp;</div>
                        <div className="ui center aligned ten wide column">We didn't find any existing plans that seem to match.</div>
                        </div>
                        <div className="ui row">
                            <div className="ui two wide column">&nbsp;</div>

                    <div className="ui center aligned ten wide column">
                        <div className="ui two column grid">
                            <div className="column">

                            <div className="ui fluid  large purple button" onClick={this.handleWePlanClick}>Let Us Design a Plan for You</div>
                            </div>
                            <div className="column">

                             <div className="ui fluid  large purple button" onClick={this.handleYouPlanClick}>  Design Your Own Plan</div>
                        </div>
                        </div>    </div>   </div></div>
                    )

        }
        var pagination = this.getPagination()





        return (
            <div ref="ref_searchHits">
            <div className="ui container stackable three column grid">
                {objectNodes}
                </div>
                {noResultsFoundText}
                <div className="spacer">&nbsp;</div>
                {pagination}
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
                    <div className="ui center aligned grid">
                        <div className="ui row hugeType">
                            <SearchkitProvider searchkit={searchkit} >
                                <div className="search">

                                    <div className="search__query">
                                    </div>
                                    <label className="NLtextinput"> I want to </label>
                                    {/*Change Searchkit/Searchbox code line 101 to:
            React.createElement("div", {type: "submit", value: "search", className: "ui two column wide purple button", "data-qa": "submit"},"Search"),
*/}
                                    <SearchBox searchOnChange={false}
                                               placeholder={this.state.placeholder}
                                               queryOptions={{analyzer:"standard"}}
                                               queryFields={["title", "description", "author", "image", "cost", "scheduleLength", "costFrequencyMetric"]}/>
                        <div className="spacer">&nbsp;</div>
<div ref="search_hits">
                                    <Hits mod="ui container stackable three column grid" hitsPerPage={8} itemComponent={PlanHit}/>
<NoHits translations={{
        "NoHits.NoResultsFound":"No plans found were found for '{query}'",
        "NoHits.DidYouMean":"Search for {suggestion}",
        "NoHits.SearchWithoutFilters":"Search for {query} without filters"
      }} suggestionsField="title"/>
    </div>

                                    </div>

                            </SearchkitProvider>

                        </div>
                    </div>
                    </div>
                </div>
        )
    }


})



export class AtomicImage extends React.Component {
   constructor(props) {
        super(props);
        this.state = {dimensions: {}};
        this.onImgLoad = this.onImgLoad.bind(this);
    }


    onImgLoad({target:img}) {

        var imageAspectRatio = img.offsetWidth/img.offsetHeight
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

        var imageAspectRatio = img.offsetHeight/img.offsetWidth
        this.setState({dimensions:{height:img.offsetHeight,
                                   width:img.offsetWidth},
            imageAspectRatio:imageAspectRatio
        });
    },



    calculateFontSize: function() {
        var numberOfLetters = this.props.text.length;
        console.log("number of Letters " + numberOfLetters)

        var screenWidth = $(window).width()
        console.log("screenWidth " + screenWidth)



        var screenMultiplier = .25;
        var lettersMultiplier = -50;
        var screenRatio = screenMultiplier * screenWidth;
        var numberOfLettersRatio = lettersMultiplier  * numberOfLetters


        var ratio = numberOfLettersRatio

        var fontSize = 20 * ratio
        console.log("screenRatio " + screenRatio)
        console.log("numberOfLettersRatio " + numberOfLettersRatio)
        console.log("ratio " + ratio)
                console.log("fontSize " + fontSize)

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

})

export class PlanHit2 extends React.Component {

    render () {
        const result = this.props.result;
        let url = "/plans/" + result.id + "/steps"
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
}

var PlanHit = React.createClass({
    render: function() {
        const result = this.props.result;
        let url = "/plans/" + result.id + "/steps"
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
})

export class UserLink extends React.Component {
    constructor (props) {
        super (props)
        this.state = {
            firstName:"",
            lastName:"",
            bio:"",
            isCoach:"",
            zipCode:"",
            profilePhoto:"",
        }

    }

    componentDidMount () {
        console.log("componentDidMount")
        this.loadObjectsFromServer()

    }

    loadObjectsFromServer = () => {
        $.ajax({
          url: "api/profiles/" + this.props.userId + "/",
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  firstName:data.firstName,
                  lastName:data.lastName,
                  bio:data.bio,
                  isCoach:data.isCoach,
                  zipCode:data.zipCode,
                  profilePhoto:data.profilePhoto,

              })


          }.bind(this),
          error: function(xhr, status, err) {
            console.error(url, status, err.toString());
          }.bind(this)
        });
      }

      render() {
          return (
              <div>

                   <img className="ui avatar image" src={this.state.profilePhoto} />
<span>Designed by {this.state.firstName} {this.state.lastName}</span>
              </div>
          )
      }
}

var Searchbar = React.createClass({
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

})


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


module.exports = { SearchPage }