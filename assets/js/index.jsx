var React = require('react');
var ReactDOM = require('react-dom');
var App = require('./app');
var Goal = require('./goal');
var $  = require('jquery');
var $ui = require('jquery-ui');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
var ObjectCreationPage = require('./plan');
var ObjectPage = require('./step');
var DailyList = require('./daily');
var UpdatesPage = require('./update');

import { ProfileViewPage, ProfileViewAndEditPage  } from './profile'




var SearchPage = require('./search');
var SplashPage = require('./splash');
var UpdatedGoalForm = require('./goal');

var theServer = 'https://192.168.1.156:8000/';







{/*
ReactDOM.render(<App url="http://127.0.0.1:8000/api/goals/"
                       pollInterval={2000}/>, document.getElementById('react-app'))
*/}

ReactDOM.render((

    <Router history={hashHistory}>
        <Route path="/" component={SplashPage} />
            <Route path="/goalEntry" component={UpdatedGoalForm} />
            <Route path="/period/:periodRangeStart/:periodRangeEnd" component={() => (<DailyList />)} />




          <Route path="/goals" component={Goal} url={`${theServer}api/goals/`} />
          <Route path="/goals/:goal_id/plans" component={ObjectCreationPage} />

          <Route path="/plans" component={ObjectCreationPage}/>
          <Route path="/plans/:plan_id" component={ObjectCreationPage} />
            <Route path="/plans/:plan_id/steps" component={ObjectPage} />
                <Route path="/myProfile" component={ProfileViewAndEditPage} />


                    <Route path="/profiles" component={ProfileViewPage} />
        <Route path="/profiles/:profile_id" component={ProfileViewPage} />
            <Route path="/steps/:step_id/updates" component={UpdatesPage} />
                        <Route path="search/:search_query/" component={SearchPage} />

                <Route path="search" component={SearchPage} />






      </Router>), document.getElementById('react-app')
);

//<Route path="steps" component={() => (<ObjectPage url="https://127.0.0.1:8000/api/steps/"
//                                                               pageHeadingLabel="Steps"
//                                                               actionButtonLabel="Add Step"
//                                                               actionFormRef="stepForm"
//                                                               modelForm="StepForm"/>)} />
