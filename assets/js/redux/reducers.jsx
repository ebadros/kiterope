
import { createStore, combineReducers } from 'redux';



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
  switch(action.type) {

      case 'SET_UPDATE_MODAL_DATA':
          return Object.assign({}, state, {updateModalData: action.updateModalData});
          break;
      case 'SET_STEP_MODAL_DATA':
          return Object.assign({}, state, {stepModalData: action.stepModalData});
          break;

      case 'SET_VISUALIZATION_MODAL_DATA':
          return Object.assign({}, state, {visualizationModalData: action.visualizationModalData});
          break;

  case 'SET_CURRENT_USER':
    return Object.assign({}, state, { user: action.user });
    break;

      case 'SET_PROFILE':
    return Object.assign({}, state, { profile: action.profile });
    break;

      case 'SET_SETTINGS':
    return Object.assign({}, state, { settings: action.settings });
    break;


    case 'SET_CURRENT_CONTACT':
    return Object.assign({}, state, { currentContact: action.contact });
    break;

      case 'SHOULD_RELOAD':
          return Object.assign({}, state, { shouldReload: action.shouldReload });
         break;

  case 'SET_GOALS':
    return Object.assign({}, state, { goals: action.goals });
    break;

    case 'ADD_GOAL':

        var theGoals = state.goals;
        theGoals[action.goal.id] = action.goal;
      return Object.assign({}, state, { goals: theGoals });
      break;

    case 'UPDATE_GOAL':
      var theGoals = state.goals;
        theGoals[action.goal.id] = action.goal;



      return Object.assign({}, state, { goals: theGoals });
      break;

    case 'DELETE_GOAL':
      var initialGoals = state.goals;

       delete initialGoals[action.goalId];
          return Object.assign({}, state,  {goals : initialGoals});
      break;

      case 'SET_DAILY_PERIOD':
              return Object.assign({}, state, { dailyPeriod: action.dailyPeriod });

case 'SET_SEARCH_QUERY':
              return Object.assign({}, state, { searchQuery: action.searchQuery });

    case 'SET_SEARCH_HITS_VISIBILITY':
              return Object.assign({}, state, { searchHitsVisibility: action.searchHitsVisibility });



  case 'SET_PROGRAMS':
    return Object.assign({}, state, { programs: action.programs });
    break;

    case 'ADD_PROGRAM':

        var thePrograms = state.programs;
        thePrograms[action.program.id] = action.program;
      return Object.assign({}, state, { programs: thePrograms });
      break;
    case 'UPDATE_PROGRAM':

        var thePrograms = state.programs;
        thePrograms[action.program.id] = action.program;
      return Object.assign({}, state, { programs: thePrograms });
      break;

    case 'DELETE_PROGRAM':
      var initialPrograms = state.programs;
       delete initialPrograms[action.programId];

      return Object.assign({}, state,  {programs : initialPrograms});
      break;

    case 'ADD_STEP':

        var thePrograms = state.programs;
        var theProgram = thePrograms[action.programId];
        var theSteps = theProgram.steps;
        theSteps[action.step.id] = action.step;
      return Object.assign({}, state, { programs: thePrograms });
      break;

    case 'ADD_MESSAGE':

        var theThreads = state.messageThreads;
        theThreads[action.threadId].messages.push(action.message);
      return Object.assign({}, state, { messageThreads: theThreads });
      break;

    case 'UPDATE_STEP':

        var thePrograms = state.programs;
        thePrograms[action.programId].steps[action.step.id] = action.step;
      return Object.assign({}, state, { programs: thePrograms });
      break;

    case 'DELETE_STEP':
      var initialPrograms = state.programs;
       delete initialPrograms[action.programId].steps[action.stepId];

      return Object.assign({}, state,  {programs : initialPrograms});
      break;

  case 'SET_STEP_OCCURRENCES':
    return Object.assign({}, state, { stepOccurrences: action.stepOccurrences });
    break;

      case 'SET_VISUALIZATIONS':
    return Object.assign({}, state, { visualizations: action.visualizations });
    break;

      case 'SET_UPDATE_OCCURRENCES':
    return Object.assign({}, state, { updateOccurrences: action.updateOccurrences });
    break;

      case 'SET_UPDATES':
    return Object.assign({}, state, { updates: action.updates });
    break;
      case 'CLEAR_TEMP_STEP':
          var theUpdates = state.updates
          delete theUpdates["tempStep"]

    return Object.assign({}, state, { updates: theUpdates });
    break;

      case 'ADD_STEP_TO_UPDATE':
       var theUpdates = state.updates
          var theUpdate = theUpdates[action.updateId]
            theUpdate.steps_ids.push(action.stepId)
    return Object.assign({}, state, { updates: theUpdate });
            break;


      case 'REMOVE_STEP_FROM_UPDATE':
      var theUpdates = state.updates;
          var theUpdate = theUpdates[action.updateId]
          removeItem(theUpdate.steps_ids, action.stepId)

          if (state.updates["tempStep"] != undefined) {

              var theTempStepUpdates = state.updates["tempStep"]
              delete theTempStepUpdates[action.updateId]
              theUpdates["tempStep"] = theTempStepUpdates
          }

      return Object.assign({}, state,  {updates : theUpdates});
      break;

      case 'EDIT_UPDATE':
          var theUpdates = state.updates;
          console.log("edit update " + action.updateId + " " + action.update)
          theUpdates[action.updateId] = action.update
          return Object.assign({}, state,  {updates : theUpdates});
      break;

      case 'ADD_UPDATE':

        var theUpdates = state.updates;

        theUpdates[action.update.id] = action.update;

          var thePrograms = state.programs

          var theProgram = thePrograms[action.update.program]
          var theProgramUpdates = theProgram.updates
          theProgramUpdates.push(action.update)



      return Object.assign({}, state, { updates: theUpdates, programs:thePrograms });
      break;

      case 'ADD_UPDATE_WITHOUT_STEP':

        var theUpdates = state.updates;
          var tempStepUpdates = {}
          if (theUpdates["tempStep"] != undefined) {
              tempStepUpdates = theUpdates["tempStep"]
          }
          tempStepUpdates[action.update.id] = action.update

        theUpdates["tempStep"] = tempStepUpdates
      return Object.assign({}, state, { updates: theUpdates });
      break;

      case 'ADD_VISUALIZATION':
          var theVisualization = action.visualization

          var thePrograms = state.programs
          var theVisualizations = state.programs[action.visualization.program].visualizations
        theVisualizations[action.visualization.id] = action.visualization;
      return Object.assign({}, state, { programs:thePrograms });
      break;

      case 'EDIT_VISUALIZATION':
          var thePrograms = state.programs
          var theVisualizations = thePrograms[action.visualization.program].visualizations
        theVisualizations[action.visualizationId] = action.visualization;
      return Object.assign({}, state, { programs:thePrograms });
      break;

      case 'DELETE_VISUALIZATION':
          var thePrograms = state.programs
          var theProgram = thePrograms[action.visualization.program]
          var theVisualizations = theProgram.visualizations

         delete theVisualizations[action.visualizationId]

      return Object.assign({}, state, { programs:thePrograms });
      break;



  case 'SET_CONTACTS':
    return Object.assign({}, state, { contacts: action.contacts });
    break;

    case 'SET_PLANS':
    return Object.assign({}, state, { plans: action.plans });
    break;
    case 'ADD_PLAN':
       var thePlans = state.plans;
        thePlans[action.plan.id] = action.plan;
    return Object.assign({}, state, { plans: thePlans });
    break;

    case 'ADD_CONTACT':
       var theContacts = state.contacts;
        theContacts[action.contact.id] = action.contact;
    return Object.assign({}, state, { contacts: theContacts });
    break;
case 'DELETE_CONTACT':
      var theContacts = state.contacts;
           delete theContacts[action.contactId];


    return Object.assign({}, state, { contacts: theContacts });
    break;

    case 'REMOVE_PLAN':
      var initialPlans = state.plans;

       initialPlans[action.planId].isSubscribed = false;

    return Object.assign({}, state, { plans: initialPlans });
    break;
  case 'SHOW_SIDEBAR':
    return Object.assign({}, state, { isSidebarVisible: action.visibility });
    break;

    case 'SET_MESSAGE_THREADS':
    return Object.assign({}, state, { messageThreads: action.threads });
    break;

    case 'SET_OPEN_THREADS':
    return Object.assign({}, state, { openThreads: action.threads });
    break;

    case 'ADD_OPEN_THREAD':

      var theOpenThreads = state.openThreads;
        theOpenThreads[action.thread.id] = action.thread;
      return Object.assign({}, state, { openThreads: theOpenThreads , });
    break;

    case 'CLOSE_OPEN_THREAD':
      var theOpenThreads = state.openThreads;
       delete theOpenThreads[action.threadId];

      return Object.assign({}, state,  {openThreads : theOpenThreads});
      break;



    case 'ADD_THREAD':

      var theOpenThreads = state.openThreads;
        theOpenThreads[action.thread.id] = action.thread;

        var theMessageThreads = state.messageThreads;
        theMessageThreads[action.thread.id] = action.thread;
      return Object.assign({}, state, { openThreads: theOpenThreads , messageThreads: theMessageThreads});
    break;

    case 'SET_CURRENT_THREAD':
    return Object.assign({}, state, { currentThread: action.thread });
    break;

    case 'SET_MESSAGE_WINDOW_VISIBILITY':
    return Object.assign({}, state, { isMessageWindowVisible: action.visibility });
    break;

      case 'SET_FOR_MOBILE':
    return Object.assign({}, state, { forMobile: action.forMobile });
    break;




case 'LOGIN':
    return Object.assign({}, state, { user: action.user });
    break;



  case 'LOGOUT':
    state = {};
    return state;
    break;
  }
  return state;
};



module.exports = { rootReducer };