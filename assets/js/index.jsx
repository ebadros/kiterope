var React = require('react');
var ReactDOM = require('react-dom');

var $ = require('jquery');
var $ui = require('jquery-ui');

var ObjectCreationPage = require('./plan');
import { DailyList } from './daily'
import {LoginPage, JoinPage, PasswordResetPage, PasswordConfirmPage, PasswordConfirmForm} from './accounts'
import {App, TestPage} from './app'
import {ProfileViewPage, ProfileViewAndEditPage, ProfileListPage, ProfileDetailPage, ContactDetailPage} from './profile'
import {ClientListPage, ClientDetailPage} from './client'
import {Test} from './elements'
import {MessagePage} from './message'
import {Provider, connect, dispatch} from 'react-redux'
import {SearchPage} from './search'
import {SettingsPage} from './settings'
import {StepOccurrenceDetailPage} from './stepOccurrence'

import {Page404} from './Page404'

import {SplashPage} from './splash'
import {BlogPage} from './blog'

import { SplashGoalEntry } from './splashGoalEntry'


import {VisualizationsPage} from './visualization'


import {GoalListPage, GoalEntryPage, GoalDetailPage} from './goal'
import {PlanDetailPage} from './plan'
import {StepDetailPage} from './step'

import {ProgramListPage, ProgramDetailPage, ProgramDetailPageNoSteps} from'./program'


import {BrowseProgramsPage } from './browse'

import auth from './auth'

import  {store} from "./redux/store";
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'
import {rootReducer} from './redux/reducers'
import {Router, Route, Link, hashHistory, browserHistory} from 'react-router'
import {createStore, combineReducers, applyMiddleware} from "redux";
const history = syncHistoryWithStore(browserHistory, store);
import ReduxDataGetter from './reduxDataGetter'
import { setCurrentUser, setPlans,  setDisplayAlert, setSignInOrSignupModalData, setUpdateOccurrences, setUpdates, setVisualizations, removeStepFromUpdate, addStepToUpdate, editUpdate, reduxLogout, setProfile, setSettings, setForMobile, showSidebar, setContacts, setMessageWindowVisibility, setOpenThreads, setGoals, setPrograms, setMessageThreads,  setStepOccurrences } from './redux/actions'



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
import {TermsOfServicePage} from './tos'

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

        <Router history={history}>
            <div>

                <Route path="/" component={ SplashPage }  />
                <Route path="/blog" component={ BlogPage } />

                <Route path="/daily" component={DailyList} onEnter={requireAuth}/>

                <Route path="/goalEntry" component={ GoalEntryPage }/>
                <Route path="/browse" component={BrowseProgramsPage} />
                <Route path="/settings/" component={ SettingsPage }/>
                <Route path="/visualizations/" component={ VisualizationsPage } />


                <Route path="/joinKiterope" component={ JoinPage } />
                <Route path="/account/login"  component={LoginPage} />

                <Route path="/account/password/reset" component={ PasswordResetPage }/>
                <Route path="/account/password/reset/confirm/:uid/:token/" component={PasswordConfirmPage}/>


                <Route path="/app" component={ App } onEnter={requireAuth}/>


                <Route path="/period/:periodRangeStart/:periodRangeEnd" component={() => (<DailyList />)}
                       onEnter={requireAuth}/>
                <Route path="/messages" component={MessagePage} onEnter={requireAuth}/>
                <Route path="/messages/:sender_id" component={MessagePage} onEnter={requireAuth}/>


                <Route path="/goals" component={GoalListPage} onEnter={requireAuth}/>
                <Route path="/programs/:program_id/steps" component={ProgramDetailPage} onEnter={requireAuth}/>
                <Route path="/plan/view/:program_id" component={ProgramDetailPageNoSteps} />

                <Route path="/programs" component={ProgramListPage} onEnter={requireAuth}/>

                <Route path="/goals/:goal_id/plans" component={GoalDetailPage} onEnter={requireAuth}/>

                <Route path="/plans/:plan_id/steps" component={PlanDetailPage} onEnter={requireAuth}/>
                                <Route path="/steps/:step_id/" component={StepDetailPage} onEnter={requireAuth}/>

                <Route path="/stepOccurrences/:stepOccurrence_id/" component={StepOccurrenceDetailPage} onEnter={requireAuth}/>



                <Route path="/profiles/:profile_id" component={ProfileDetailPage}/>

                <Route path="/clients" component={ClientListPage} onEnter={requireAuth}/>
                <Route path="/contacts" component={() => (<ProfileListPage myContacts={true}/>)} onEnter={requireAuth}/>
                <Route path="/tos" component={TermsOfServicePage} />


                <Route path="/profiles" component={() => (<ProfileListPage myContacts={false}/>)}
                       onEnter={requireAuth}/>

                <Route path="/search/:search_query/" component={SearchPage}/>

                <Route path="/search" component={SearchPage}/>
                <Route path="/splashGoal" component={SplashGoalEntry} />
                                <Route path="/test" component={TestPage} />

                <Route path="/:path" component={Page404} />



            </div>
        </Router></Provider>), document.getElementById('react-app')
);

