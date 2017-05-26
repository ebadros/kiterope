
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
  case 'SHOW_SIDEBAR':
    return Object.assign({}, state, { isSidebarVisible: action.isSidebarVisible });
    break;

    case 'SET_OPEN_THREADS':
    return Object.assign({}, state, { openThreads: action.openThreads });
    break;

    case 'SET_CURRENT_THREAD':
    return Object.assign({}, state, { currentThread: action.currentThread });
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