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
        goals:state.goals,
        contacts:state.contacts,
        programs:state.programs,
        stepOccurrences:state.stepOccurrences,
        openThreads: state.openThreads,
        gui: {
          isSidebarVisible:state.isSidebarVisible,
          isMessageWindowVisible: state.isMessageWindowVisible,
          currentThread: state.currentThread,

        }


}
  }

}

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentUser: (theUser) => {
      dispatch(setCurrentUser(theUser))
    },
    setGoals: (theGoals) => {
      dispatch(setGoals(theGoals))
    },
      addGoal: (theGoal) => {
      dispatch(addGoal(theGoal))
    },
      updateGoal: (theGoal) => {
      dispatch(updateGoal(theGoal))
    },
      deleteGoal: (theGoalId) => {
      dispatch(deleteGoal(theGoalId))
    },
    setContacts: (theContacts) => {
      dispatch(setContacts(theContacts))
    },

    setPrograms: (thePrograms) => {
      dispatch(setPrograms(thePrograms))
    },
      addProgram: (theProgram) => {
      dispatch(addProgram(theProgram))
    },
    updateProgram: (theProgram) => {
      dispatch(updateProgram(theProgram))
    },
      deleteProgram: (theProgramId) => {
      dispatch(deleteProgram(theProgramId))
    },
    addStep: (theProgramId, theStep) => {
      dispatch(addStep(theProgramId, theStep))
    },
    updateStep: (theProgramId, theStep) => {
      dispatch(updateStep(theProgramId, theStep))
    },
      deleteStep: (theProgramId, theStepId) => {
      dispatch(deleteStep(theProgramId, theStepId))
    },


    setStepOccurrences: (theStepOccurrences) => {
      dispatch(setStepOccurrences(theStepOccurrences))
    },
      reduxLogout: () => {
      dispatch(reduxLogout())
    },
    showSidebar: (isSidebarVisible) => {
      dispatch(showSidebar(isSidebarVisible))
    },


    setMessageThreads: (theMessageThreads) => {
      dispatch(setMessageThreads(theMessageThreads))
    },

    setOpenThreads: (theOpenThreads) => {
      dispatch(setOpenThreads(theOpenThreads))
    },

    addThread: (theThread) => {
      dispatch(addThread(theThread))
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
