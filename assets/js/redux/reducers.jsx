
import { createStore, combineReducers } from 'redux';



const initialUserState = {
  user: {}
}
function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

export const rootReducer = (state = {}, action) => {
  switch(action.type) {
  case 'SET_CURRENT_USER':
    return Object.assign({}, state, { user: action.user });
    break;

  case 'SET_GOALS':
    return Object.assign({}, state, { goals: action.goals });
    break;

    case 'ADD_GOAL':

        var theGoals = state.goals
        theGoals[action.goal.id] = action.goal
      return Object.assign({}, state, { goals: theGoals })
      break;

    case 'UPDATE_GOAL':
      var theGoals = state.goals
        theGoals[action.goal.id] = action.goal



      return Object.assign({}, state, { goals: theGoals });
      break;

    case 'DELETE_GOAL':
      var initialGoals = state.goals

       delete initialGoals[action.goalId]



      return Object.assign({}, state,  {goals : initialGoals});
      break;
  case 'SET_PROGRAMS':
    return Object.assign({}, state, { programs: action.programs });
    break;

    case 'ADD_PROGRAM':

        var thePrograms = state.programs
        thePrograms[action.program.id] = action.program
      return Object.assign({}, state, { programs: thePrograms })
      break;
    case 'UPDATE_PROGRAM':

        var thePrograms = state.programs
        thePrograms[action.program.id] = action.program
      return Object.assign({}, state, { programs: thePrograms })
      break;

    case 'DELETE_PROGRAM':
      var initialPrograms = state.programs
       delete initialPrograms[action.programId]

      return Object.assign({}, state,  {programs : initialPrograms});
      break;

    case 'ADD_STEP':

        var thePrograms = state.programs
        thePrograms[action.programId].steps[action.step.id] = action.step
      return Object.assign({}, state, { programs: thePrograms })
      break;

    case 'UPDATE_STEP':

        var thePrograms = state.programs
        thePrograms[action.programId].steps[action.step.id] = action.step
      return Object.assign({}, state, { programs: thePrograms })
      break;

    case 'DELETE_STEP':
      var initialPrograms = state.programs
       delete initialPrograms[action.programId].steps[action.stepId]

      return Object.assign({}, state,  {programs : initialPrograms});
      break;

  case 'SET_STEP_OCCURRENCES':
    return Object.assign({}, state, { stepOccurrences: action.stepOccurrences });
    break;
  case 'SET_CONTACTS':
    return Object.assign({}, state, { contacts: action.contacts });
    break;
  case 'SHOW_SIDEBAR':
    return Object.assign({}, state, { isSidebarVisible: action.isSidebarVisible });
    break;

    case 'SET_MESSAGE_THREADS':
    return Object.assign({}, state, { messageThreads: action.threads });
    break;

    case 'SET_OPEN_THREADS':
    return Object.assign({}, state, { openThreads: action.threads });
    break;

    case 'ADD_THREAD':

      var theOpenThreads = state.openThreads
        theOpenThreads[action.thread.id] = action.thread

        var theMessageThreads = state.messageThreads
        theMessageThreads[action.thread.id] = action.thread
      return Object.assign({}, state, { openThreads: theOpenThreads , messageThreads: theMessageThreads})
    break;

    case 'SET_CURRENT_THREAD':
    return Object.assign({}, state, { currentThread: action.thread });
    break;

    case 'SHOW_MESSAGE_WINDOW':
    return Object.assign({}, state, { isMessageWindowVisible: action.isMessageWindowVisible });
    break;







  case 'LOGOUT':
    return Object.assign({}, state, { user: action.user });
    break;
  }
  return state;
}



module.exports = { rootReducer }