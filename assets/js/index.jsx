var React = require('react');
var ReactDOM = require('react-dom');

var $ = require('jquery');
var $ui = require('jquery-ui');

var ObjectCreationPage = require('./plan');
var DailyList = require('./daily');
import {LoginPage, JoinPage, PasswordResetPage, PasswordConfirmPage, PasswordConfirmForm} from './accounts'
import {App} from './app'
import {ProfileViewPage, ProfileViewAndEditPage, ProfileListPage, ProfileDetailPage} from './profile'
import {ClientListPage, ClientDetailPage} from './client'
import {Test} from './elements'
import {MessagePage} from './message'
import {Provider, connect, dispatch} from 'react-redux'
import  {store} from "./redux/store";
import {SearchPage} from './search'
import {SplashPage} from './splash'


import {GoalListPage, GoalForm, GoalEntryPage, GoalDetailPage} from './goal'
import {PlanDetailPage} from './plan'
import {ProgramListPage, ProgramDetailPage} from'./program'

import {Router, Route, Link, hashHistory} from 'react-router'
import {createStore, combineReducers, applyMiddleware} from "redux";


var auth = require('./auth')

import {
    theServer,
    s3IconUrl,
    formats,
    s3ImageUrl,
    customModalStyles,
    dropzoneS3Style,
    uploaderProps,
    frequencyOptions,
    planScheduleLengths,
    timeCommitmentOptions,
    costFrequencyMetricOptions
} from './constants'


function requireAuth(nextState, replace) {
    if (!auth.loggedIn()) {
        replace({
            pathname: '/account/login',
            state: {
                nextPathname: nextState.location.pathname
            }
        });
    }
}


ReactDOM.render((
    <Provider store={store}>


        <Router history={hashHistory}>
            <div>
                <Route path="/" component={SplashPage}/>

                <Route path="/goalEntry" component={ GoalEntryPage }/>
                <Route path="/account/login" component={ LoginPage }/>
                <Route path="/joinKiterope" component={ JoinPage }/>
                <Route path="/account/password/reset" component={ PasswordResetPage }/>
                <Route path="/account/password/reset/confirm/:uid/:token/" component={PasswordConfirmPage}/>


                <Route path="/app" component={ App } onEnter={requireAuth}/>


                <Route path="/period/:periodRangeStart/:periodRangeEnd" component={() => (<DailyList />)}
                       onEnter={requireAuth}/>
                <Route path="/messages" component={MessagePage} onEnter={requireAuth}/>
                <Route path="/messages/:sender_id" component={MessagePage} onEnter={requireAuth}/>


                <Route path="/goals" component={GoalListPage} onEnter={requireAuth}/>
                <Route path="/programs/:program_id/steps" component={ProgramDetailPage} onEnter={requireAuth}/>

                <Route path="/programs" component={ProgramListPage} onEnter={requireAuth}/>

                <Route path="/goals/:goal_id/plans" component={GoalDetailPage} onEnter={requireAuth}/>

                <Route path="/plans/:plan_id/steps" component={PlanDetailPage} onEnter={requireAuth}/>


                <Route path="/profiles/:profile_id" component={ProfileDetailPage}/>
                <Route path="/clients" component={ClientListPage} onEnter={requireAuth}/>
                <Route path="/contacts" component={() => (<ProfileListPage myContacts={true}/>)} onEnter={requireAuth}/>


                <Route path="/profiles" component={() => (<ProfileListPage myContacts={false}/>)}
                       onEnter={requireAuth}/>

                <Route path="search/:search_query/" component={SearchPage}/>

                <Route path="search" component={SearchPage}/>


            </div>
        </Router></Provider>), document.getElementById('react-app')
);

