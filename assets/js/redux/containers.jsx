import React from 'react';
import ReactDOM from 'react-dom';
var $  = require('jquery');
import { Menubar, StandardSetOfComponents, ErrorReporter } from '../accounts'
import { Provider, connect, dispatch } from 'react-redux'
import { setCurrentUser, showSidebar, setOpenThreads, setCurrentThreads, reduxLogout, isMessageWindowVisible } from '../redux/actions'




const mapStateToProps = (state) => {
  return {
      storeRoot:{
          user:state.user,
        isSidebarVisible:state.isSidebarVisible,
        currentThread: state.currentThread,
        openThreads: state.openThreads,
        isMessageWindowVisible: state.isMessageWindowVisible,

}
  }

}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentUser: (theUser) => {
      dispatch(setCurrentUser(theUser))
    },
      reduxLogout: () => {
      dispatch(reduxLogout())
    },
    showSidebar: (isSidebarVisible) => {
      dispatch(showSidebar(isSidebarVisible))
    },
    setOpenThreads: (theOpenThreads) => {
      dispatch(setOpenThreads(theOpenThreads))
    },
    setCurrentThread: (theCurrentThread) => {
      dispatch(setCurrentThread(theCurrentThread))
    },
    showMessageWindow: (isMessageWindowVisible) => {
      dispatch(showMessageWindow(isMessageWindowVisible))
    }


  }
}


//const StandardSetOfComponentsContainer = connect(mapStateToProps, mapDispatchToProps)(StandardSetOfComponents)

module.exports = { mapDispatchToProps, mapStateToProps }
