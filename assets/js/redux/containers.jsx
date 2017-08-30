import React from 'react';
import ReactDOM from 'react-dom';
var $  = require('jquery');
import { Menubar, StandardSetOfComponents, ErrorReporter } from '../accounts'
import { Provider, connect, dispatch } from 'react-redux'
import { setCurrentUser, showSidebar, setOpenThreads, setCurrentThreads, reduxLogout, isMessageWindowVisible } from '../redux/actions'




const mapStateToProps = (state) => {
  if (state != undefined) {
  return {
      storeRoot:{
        user:state.user,
        goals:state.goals,
        plans:state.plans,
        contacts:state.contacts,
        programs:state.programs,
        stepOccurrences:state.stepOccurrences,
        messageThreads:state.messageThreads,
        gui: {
          shouldReload:state.shouldReload,
          isSidebarVisible:state.isSidebarVisible,
          isMessageWindowVisible: state.isMessageWindowVisible,
          currentThread: state.currentThread,
          openThreads: state.openThreads,
          currentContact:state.currentContact


        }


}
  }}
  else {
    return {
      storeRoot:{
        gui:{isSidebarVisible:false,
          isMessageWindowVisible: false}}
    }
  }

};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentUser: (theUser) => {
      dispatch(setCurrentUser(theUser))
    },

    setCurrentContact: (theContact) => {
      dispatch(setCurrentContact(theContact))
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
    deleteContact: (theContactId) => {
      dispatch(deleteContact(theContactId))
    },
    setContacts: (theContacts) => {
      dispatch(setContacts(theContacts))
    },
    addContact: (theContact) => {
      dispatch(addContact(theContact))
    },
    setPlans: (thePlans) => {
      dispatch(setPlans(thePlans))
    },
    addPlan: (thePlan) => {
      dispatch(addPlan(thePlan))
    },
    removePlan: (thePlanId) => {
      dispatch(removePlan(thePlanId))
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

    reduxLogin: () => {
      dispatch(reduxLogin())
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

    addOpenThread: (theThread) => {
      dispatch(addOpenThread(theThread))
    },

    closeOpenThread: (theThreadId) => {
      dispatch(closeOpenThread(theThreadId))
    },

    addThread: (theThread) => {
      dispatch(addThread(theThread))
    },

    addMessage: (theThreadId, theMessage) => {
      dispatch(addMessage(theThreadId, theMessage))
    },

    setCurrentThread: (theCurrentThread) => {
      dispatch(setCurrentThread(theCurrentThread))
    },
    setMessageWindowVisibility: (isMessageWindowVisible) => {
      dispatch(setMessageWindowVisibility(isMessageWindowVisible))
    }




  }
};


//const StandardSetOfComponentsContainer = connect(mapStateToProps, mapDispatchToProps)(StandardSetOfComponents)

module.exports = { mapDispatchToProps, mapStateToProps };
