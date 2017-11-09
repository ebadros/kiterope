import React from 'react';
import ReactDOM from 'react-dom';
var $  = require('jquery');
import { Menubar, StandardSetOfComponents, ErrorReporter } from '../accounts'
import { Provider, connect, dispatch } from 'react-redux'
import { setCurrentUser, showSidebar, setOpenThreads, setCurrentThreads, reduxLogout, isMessageWindowVisible } from '../redux/actions'




const mapStateToProps = (state, ownProps) => {
  if (state != undefined) {
  return {

      storeRoot:{
        user:state.rootReducer.user,
        profile:state.rootReducer.profile,
        settings:state.rootReducer.settings,
        goals:state.rootReducer.goals,
        plans:state.rootReducer.plans,
        contacts:state.rootReducer.contacts,
        programs:state.rootReducer.programs,
        stepOccurrences:state.rootReducer.stepOccurrences,
        updateOccurrences:state.rootReducer.updateOccurrences,
        visualizations:state.rootReducer.visualizations,
        messageThreads:state.rootReducer.messageThreads,
        updates: state.rootReducer.updates,
        updateModalData: state.rootReducer.updateModalData,
        stepModalData: state.rootReducer.stepModalData,
        visualizationModalData:state.rootReducer.visualizationModalData,
        gui: {
          searchQuery:state.rootReducer.searchQuery,
          searchHitsVisibility:state.rootReducer.searchHitsVisibility,
          forMobile:state.rootReducer.forMobile,
          shouldReload:state.rootReducer.shouldReload,
          isSidebarVisible:state.rootReducer.isSidebarVisible,
          isMessageWindowVisible: state.rootReducer.isMessageWindowVisible,
          currentThread: state.rootReducer.currentThread,
          openThreads: state.rootReducer.openThreads,
          currentContact:state.rootReducer.currentContact,
          dailyPeriod:state.rootReducer.dailyPeriod


        }


}
  }}
  else {
    return {
      storeRoot: {
        gui: {
          searchQuery:state.rootReducer.searchQuery,
          searchHitsVisibility:state.rootReducer.searchHitsVisibility,

          forMobile: false,
          isSidebarVisible: false,
          isMessageWindowVisible: false
        },
        dailyPeriod: {
          selection: 'TODAY',
          periodStart: "",
          periodEnd: "",
        },
      }
    }
  }

};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentUser: (theUser) => {
      dispatch(setCurrentUser(theUser))
    },

    setProfile: (theProfile) => {
            dispatch(setProfile(theProfile))


    },
    setSettings: (theSettings) => {
            dispatch(setSettings(theSettings))


    },

    setDailyPeriod: (theDailyPeriod) => {
            dispatch(setDailyPeriod(theDailyPeriod))


    },



    setSearchQuery: (theSearchQuery) => {
            dispatch(setSearchQuery(theSearchQuery))


    },
    //setUpdateModalData: (theUpdateModalData) => {
    //  dispatch(setUpdateModalData(theUpdateModalData))
    //},



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
    },

    setForMobile: (forMobile) => {
      dispatch(setForMobile(forMobile))
    }




  }
};


//const StandardSetOfComponentsContainer = connect(mapStateToProps, mapDispatchToProps)(StandardSetOfComponents)

module.exports = { mapDispatchToProps, mapStateToProps };
