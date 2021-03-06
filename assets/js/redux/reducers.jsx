
import { createStore, combineReducers } from 'redux';
import {REHYDRATE} from 'redux-persist/constants'
var moment = require('moment');



const initialUserState = {
  user: {}
};
function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

function removeItem(array, item){
    for(var i in array){
        if(array[i]==item){
            array.splice(i,1);
            break;
        }
    }
}



export const rootReducer = (state = {}, action) => {
    switch (action.type) {

        case REHYDRATE:
            var rootReducerPayload = action.payload.rootReducer
            if (rootReducerPayload) {
                return Object.assign({}, state, rootReducerPayload)
            }

            break;

        case 'SET_DATA_LOADED':

            switch (action.dataSet) {
                case "userData":
                    return Object.assign({}, state, {userDataLoaded: true});
                    break;
                case "clientData":
                    return Object.assign({}, state, {clientDataLoaded: true});
                    break;
                case "planData":
                    return Object.assign({}, state, {planDataLoaded: true});
                    break;
                case "stepOccurrenceData":
                    return Object.assign({}, state, {stepOccurrenceDataLoaded: true});
                    break;
                case "goalData":
                    return Object.assign({}, state, {goalDataLoaded: true});
                    break;
                case "updateData":
                    return Object.assign({}, state, {updateDataLoaded: true});
                    break;
                case "updateOccurrenceData":
                    return Object.assign({}, state, {updateOccurrenceDataLoaded: true});
                    break;
                case "stepData":
                    return Object.assign({}, state, {stepDataLoaded: true});
                    break;
                case "settingsData":
                    return Object.assign({}, state, {settingsDataLoaded: true});
                    break;
                case "profileData":
                    return Object.assign({}, state, {profileDataLoaded: true});
                    break;
                case "visualizationsData":
                    return Object.assign({}, state, {visualizationDataLoaded: true});
                    break;
                case "programData":
                    return Object.assign({}, state, {programDataLoaded: true});
                    break;
                case "contactData":
                    return Object.assign({}, state, {contactDataLoaded: true});
                    break;
                case "contactGroupData":
                    return Object.assign({}, state, {contactGroupDataLoaded: true});
                    break;

            }

        case 'SET_DISPLAY_ALERT':
            return Object.assign({}, state, {displayAlert: action.alert});
            break;

        case 'SUBMIT_EVENT':
            return Object.assign({}, state, {currentEvent: action.event});
            break;

        case 'SET_PAYLOAD':
            return Object.assign({}, state, {currentPayload: action.payload});
            break;

        case 'SET_DATA_TO_BE_SUBMITTED_AFTER_LOGIN':
            return Object.assign({}, state, {data: action.data});
            break;

        case 'CLEAR_MODAL_DATA':
            return Object.assign({}, state, {
                stepModalData: {},
                goalModalData: {},
                profileModalData: {},
                visualizationModalData: {},
                updateModalData: {},
                smartGoalFormData: {},
                programModalData: {},
                subscriptionModalData: {},
                programRequestModalData: {},
                signInOrSignupModalData: {}
            });
            break;

        case 'SET_REHYDRATED':
            return Object.assign({}, state, {rehydrated: action.rehydrated})


        case 'SET_UPDATE_MODAL_DATA':
            return Object.assign({}, state, {updateModalData: action.updateModalData});
            break;
        case 'SET_STEP_MODAL_DATA':
            return Object.assign({}, state, {stepModalData: action.stepModalData});
            break;

        case 'SET_GOAL_MODAL_DATA':
            return Object.assign({}, state, {goalModalData: action.goalModalData});
            break;

        case 'SET_SMART_GOAL_FORM_DATA':
            return Object.assign({}, state, {smartGoalFormData: action.smartGoalFormData});
            break;

        case 'SET_PROGRAM_MODAL_DATA':
            return Object.assign({}, state, {programModalData: action.programModalData});
            break;

        case 'SET_PLAN_MODAL_DATA':
            return Object.assign({}, state, {planModalData: action.planModalData});
            break;

        case 'SET_SUBSCRIPTION_MODAL_DATA':
            return Object.assign({}, state, {subscriptionModalData: action.subscriptionModalData});
            break;

        case 'SET_CONTACT_GROUP_MODAL_DATA':
            return Object.assign({}, state, {contactGroupModalData: action.contactGroupModalData});
            break;

        case 'SET_PROGRAM_REQUEST_MODAL_DATA':
            return Object.assign({}, state, {programRequestModalData: action.programRequestModalData});
            break;

        case 'SET_SIGN_IN_OR_SIGNUP_MODAL_DATA':
            console.log("signin")
            return Object.assign({}, state, {signInOrSignupModalData: action.signInOrSignupModalData});
            break;

        case 'SET_PROFILE_MODAL_DATA':
            return Object.assign({}, state, {profileModalData: action.profileModalData});
            break;

        case 'SET_VISUALIZATION_MODAL_DATA':
            return Object.assign({}, state, {visualizationModalData: action.visualizationModalData});
            break;

        case 'SET_CURRENT_USER':
            return Object.assign({}, state, {user: action.user});
            break;

        case 'SET_DOMAIN':
            return Object.assign({}, state, {domain: action.domain});
            break;

        case 'SET_PROFILE':
            return Object.assign({}, state, {profile: action.profile});
            break;

        case 'SET_SETTINGS':
            return Object.assign({}, state, {settings: action.settings});
            break;
        case 'SET_CONTACT_GROUPS':
            return Object.assign({}, state, {contactGroups: action.contactGroups});
            break;


        case 'SET_CURRENT_CONTACT':
            return Object.assign({}, state, {currentContact: action.contact});
            break;

        case 'SHOULD_RELOAD':
            return Object.assign({}, state, {shouldReload: action.shouldReload});
            break;

        case 'SET_GOALS':
            return Object.assign({}, state, {goals: action.goals});
            break;
        case 'SET_PUBLIC_GOALS':
            return Object.assign({}, state, {publicGoals: action.publicGoals});
            break;

        case 'SET_PUBLIC_PROGRAMS':
            return Object.assign({}, state, {publicPrograms: action.publicPrograms});
            break;

        case 'SET_TIME_LAST_RELOADED':

            return Object.assign({}, state, {timeLastReloaded: moment()});
            break;

        case 'ADD_CONTACT':

            var theContacts = Object.assign({}, state.contacts);
            theContacts[action.contact.id] = action.contact;
            return Object.assign({}, state, {contacts: theContacts});
            break;

        case 'REPLACE_CONTACT':
            var theContacts = Object.assign({}, state.contacts);
            theContacts[action.contactsProfileId] = action.contact;
            return Object.assign({}, state, {contacts: theContacts});


            break;


        case 'ADD_GOAL':

            var theGoals = Object.assign({}, state.goals);
            theGoals[action.goal.id] = action.goal;
            return Object.assign({}, state, {goals: theGoals});
            break;
        case 'ADD_CONTACT_GROUP':

            var theContactGroups = Object.assign({}, state.contactGroups);
            theContactGroups[action.contactGroup.name] = action.contactGroup;
            return Object.assign({}, state, {contactGroups: theContactGroups});
            break;

        case 'ADD_DATA_ITEM':
            var theDataItems = Object.assign({}, state[action.reduxKey])
            theDataItems[action.dataItem[action.reduxModelKey]] = action.dataItem;
            return Object.assign({}, state, {[action.reduxKey]: theDataItems})
            break;

        case 'DELETE_DATA_ITEM':
            var theDataItems = Object.assign({}, state[action.reduxKey])
            delete theDataItems[action.dataItemId]
            return Object.assign({}, state, {[action.reduxKey]: theDataItems})
            break;


        case 'SET_INITIAL_CURRENT_FORM_VALUES':
            return Object.assign({}, state, {currentForm: action.formValues})
            break;




        case 'SET_CURRENT_FORM_VALUE':
            console.log("setcurrentformvalue", action.fieldName, action.fieldValue)
            var theCurrentFormData = Object.assign({}, state.currentForm.data)
            theCurrentFormData[action.fieldName] = action.fieldValue
            var theCurrentForm = Object.assign({}, state.currentForm)
            theCurrentForm['data'] = theCurrentFormData

            return Object.assign({}, state, {currentForm: theCurrentForm})
            break;

        case 'UPDATE_GOAL':
            var theGoals = Object.assign({},state.goals);
            theGoals[action.goal.id] = action.goal;


            return Object.assign({}, state, {goals: theGoals});
            break;

        case 'SET_MODAL_FORM_DATA':
            var theKey = action.formName + "ModalData"
            console.log(theKey)

            return Object.assign({}, state, {[theKey]: action.modalData});
            break;

        case 'DELETE_GOAL':
            var initialGoals = Object.assign({},state.goals);

            delete initialGoals[action.goalId];
            return Object.assign({}, state, {goals: initialGoals});
            break;

        case 'SET_DAILY_PERIOD':
            return Object.assign({}, state, {dailyPeriod: action.dailyPeriod});

        case 'SET_SEARCH_QUERY':
            return Object.assign({}, state, {searchQuery: action.searchQuery});

        case 'SET_GOAL_SEARCH_QUERY':
            return Object.assign({}, state, {goalSearchQuery: action.goalSearchQuery});

        case 'SET_SEARCH_HITS_VISIBILITY':
            return Object.assign({}, state, {searchHitsVisibility: action.searchHitsVisibility});


        case 'SET_PROGRAMS':

            var theNewPrograms = action.programs
            if (state.programs != undefined) {
            if (Object.keys(state.programs).length > 0 ) {
                var theExistingPrograms = Object.assign({}, state.programs)


                var theKeys = Object.keys(theNewPrograms)

                for (var i; i < theKeys.length; i++) {
                    var currentKey = theKeys[i]
                    if (theExistingPrograms[currentKey] != undefined) {
                        if (theExistingPrograms[currentKey].updates == undefined) {
                            theExistingPrograms[currentKey] = theNewPrograms[currentKey]
                        } else {

                            theExistingPrograms[currentKey] = theNewPrograms[currentKey]
                        }
                    }
                }
                return Object.assign({}, state, {programs: theExistingPrograms});

            }} else {
                return Object.assign({}, state, {programs: action.programs});

            }
            break;

        case 'SET_SELECTED_CONTACT_GROUP':
            return Object.assign({}, state, {selectedContactGroup: action.contactGroup})

        case 'ADD_PROGRAM':

            var thePrograms = Object.assign({},state.programs);
            thePrograms[action.program.id] = action.program;
            return Object.assign({}, state, {programs: thePrograms});
            break;
        case 'UPDATE_PROGRAM':

            var thePrograms = Object.assign({},state.programs);
            thePrograms[action.program.id] = action.program;
            return Object.assign({}, state, {programs: thePrograms});
            break;

        case 'DELETE_PROGRAM':
            var initialPrograms = Object.assign({},state.programs);
            delete initialPrograms[action.programId];

            return Object.assign({}, state, {programs: initialPrograms});
            break;

        case 'ADD_STEP':

            var thePrograms = Object.assign({},state.programs);
            var theProgram = thePrograms[action.programId];
            if (theProgram.steps != undefined) {
                var theSteps = theProgram.steps;
            } else {
                var theSteps = {}
            }

            theSteps[action.step.id] = action.step;
            return Object.assign({}, state, {programs: thePrograms});
            break;

        case 'ADD_MESSAGE':

            var theThreads = Object.assign({},state.messageThreads);
            theThreads[action.threadId].messages.push(action.message);
            return Object.assign({}, state, {messageThreads: theThreads});
            break;

        case 'UPDATE_STEP':

            var thePrograms = Object.assign({},state.programs);
            thePrograms[action.programId].steps[action.step.id] = action.step;
            return Object.assign({}, state, {programs: thePrograms});
            break;

        case 'UPDATE_PROFILE':

            var theProfile = Object.assign({},state.profile);
            theProfile = action.profile
            return Object.assign({}, state, {profile: theProfile});
            break;

        case 'UPDATE_STEP_OCCURRENCE':

            var theStepOccurrencesOriginal = state.stepOccurrences
            var theStepOccurrences = [...theStepOccurrencesOriginal];

            for (var i = 0; i < theStepOccurrences.length; i++) {

                if (theStepOccurrences[i].id == action.stepOccurrence.id) {
                    theStepOccurrences[i] = action.stepOccurrence
                }
            }
            return Object.assign({}, state, {stepOccurrences: theStepOccurrences});
            break;


        case 'DELETE_STEP':
            var initialPrograms = Object.assign({},state.programs);
            delete initialPrograms[action.programId].steps[action.stepId];

            return Object.assign({}, state, {programs: initialPrograms});
            break;

        case 'SET_STEP_OCCURRENCES':
            return Object.assign({}, state, {stepOccurrences: action.stepOccurrences});
            break;

        case 'SET_VISUALIZATIONS':
            return Object.assign({}, state, {visualizations: action.visualizations});
            break;

        case 'SET_UPDATE_OCCURRENCES':
            return Object.assign({}, state, {updateOccurrences: action.updateOccurrences});
            break;

        case 'SET_VISUALIZATION_VIEWER_DATA':
            return Object.assign({}, state, {visualizationViewerData: action.visualizationViewerData});
            break;

        case 'SET_UPDATES':
            return Object.assign({}, state, {updates: action.updates});
            break;
        case 'CLEAR_TEMP_STEP':
            var theUpdates = Object.assign({},state.updates)
            delete theUpdates["tempStep"]

            return Object.assign({}, state, {updates: theUpdates});
            break;


        case 'ADD_STEP_TO_UPDATE':
            var theUpdates = Object.assign({},state.updates)
            var theUpdate = theUpdates[action.updateId]
            theUpdate.steps_ids.push(action.stepId)
            return Object.assign({}, state, {updates: theUpdate});
            break;


        case 'REMOVE_STEP_FROM_UPDATE':
            var theUpdates = Object.assign({},state.updates);
            var theUpdate = theUpdates[action.updateId]
            removeItem(theUpdate.steps_ids, action.stepId)

            if (state.updates["tempStep"] != undefined) {

                var theTempStepUpdates = Object.assign({},state.updates["tempStep"])
                delete theTempStepUpdates[action.updateId]
                theUpdates["tempStep"] = theTempStepUpdates
            }

            return Object.assign({}, state, {updates: theUpdates});
            break;



        case 'EDIT_UPDATE':
            var theUpdates = Object.assign({},state.updates);
            theUpdates[action.updateId] = action.update
            return Object.assign({}, state, {updates: theUpdates});
            break;

        case 'ADD_UPDATE':

            var theUpdates = Object.assign({},state.updates);

            theUpdates[action.update.id] = action.update;

            var thePrograms = Object.assign({},state.programs)

            var theProgram = thePrograms[action.update.program]
            var theProgramUpdates = theProgram.updates
            theProgramUpdates.push(action.update)


            return Object.assign({}, state, {updates: theUpdates, programs: thePrograms});
            break;

        case 'ADD_UPDATE_WITHOUT_STEP':

            var theUpdates = Object.assign({},state.updates);
            var tempStepUpdates = {}
            if (theUpdates["tempStep"] != undefined) {
                tempStepUpdates = theUpdates["tempStep"]
            }
            tempStepUpdates[action.update.id] = action.update

            theUpdates["tempStep"] = tempStepUpdates
            return Object.assign({}, state, {updates: theUpdates});
            break;

        case 'ADD_VISUALIZATION':

            var theVisualizations = Object.assign({}, state.visualizations)
            theVisualizations[action.visualizationId] = action.visualization;
            return Object.assign({}, state, {visualizations: theVisualizations});
            break;

        case 'EDIT_VISUALIZATION':
            var theVisualizations = Object.assign({}, state.visualizations)
            theVisualizations[action.visualizationId] = action.visualization;
            return Object.assign({}, state, {visualizations: theVisualizations});
            break;

        case 'DELETE_VISUALIZATION':
            var allVisualizations = Object.assign({},state.visualizations)

            var allVisualizationProgram = allVisualizations[action.visualizationId].program

            delete allVisualizations[action.visualizationId]

            var thePrograms = Object.assign({},state.programs)
            var theProgram = thePrograms[action.p]
            var theProgramVisualizations = theProgram.visualizations





            delete theProgramVisualizations[action.visualizationId]

            return Object.assign({}, state, {programs: thePrograms, visualizations:allVisualizations});

            break;


        case 'SET_CONTACTS':
            return Object.assign({}, state, {contacts: action.contacts});
            break;

        case 'SET_PLANS':
            return Object.assign({}, state, {plans: action.plans});
            break;
        case 'ADD_PLAN':
            var thePlans = Object.assign({},state.plans);
            thePlans[action.plan.id] = action.plan;
            return Object.assign({}, state, {plans: thePlans});
            break;

        case 'ADD_CONTACT':
            var theContacts = Object.assign({},state.contacts);
            theContacts[action.contact.id] = action.contact;
            return Object.assign({}, state, {contacts: theContacts});
            break;
        case 'DELETE_CONTACT':
            var theContacts = Object.assign({},state.contacts);
            delete theContacts[action.contactId];


            return Object.assign({}, state, {contacts: theContacts});
            break;

        case 'REMOVE_PLAN':
            var initialPlans = Object.assign({},state.plans);

            initialPlans[action.planId].isSubscribed = false;

            return Object.assign({}, state, {plans: initialPlans});
            break;
        case 'SHOW_SIDEBAR':
            return Object.assign({}, state, {isSidebarVisible: action.visibility});
            break;

        case 'SET_MESSAGE_THREADS':
            return Object.assign({}, state, {messageThreads: action.threads});
            break;

        case 'SET_OPEN_THREADS':
            return Object.assign({}, state, {openThreads: action.threads});
            break;

        case 'ADD_OPEN_THREAD':

            var theOpenThreads = Object.assign({},state.openThreads);
            theOpenThreads[action.thread.id] = action.thread;
            return Object.assign({}, state, {openThreads: theOpenThreads,});
            break;

        case 'CLOSE_OPEN_THREAD':
            var theOpenThreads = Object.assign({},state.openThreads);
            delete theOpenThreads[action.threadId];

            return Object.assign({}, state, {openThreads: theOpenThreads});
            break;


        case 'ADD_THREAD':

            var theOpenThreads = Object.assign({},state.openThreads);
            theOpenThreads[action.thread.id] = action.thread;

            var theMessageThreads = Object.assign({},state.messageThreads);
            theMessageThreads[action.thread.id] = action.thread;
            return Object.assign({}, state, {openThreads: theOpenThreads, messageThreads: theMessageThreads});
            break;

        case 'SET_CURRENT_THREAD':
            return Object.assign({}, state, {currentThread: action.thread});
            break;

        case 'SET_MESSAGE_WINDOW_VISIBILITY':
            return Object.assign({}, state, {isMessageWindowVisible: action.visibility});
            break;

        case 'SET_FOR_MOBILE':
            return Object.assign({}, state, {forMobile: action.forMobile});
            break;


        case 'LOGIN':
            return Object.assign({}, state, {user: action.user});
            break;


        case 'LOGOUT':
            state = {};
            return state;
            break;

    }

            return state

}




module.exports = { rootReducer };