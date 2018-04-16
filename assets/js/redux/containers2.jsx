import React from 'react';
import ReactDOM from 'react-dom';
var $  = require('jquery');
import { Provider, connect, dispatch } from 'react-redux'




const mapStateToProps = (state, ownProps) => {

  if (state.rootReducer == undefined) {
    return {
      storeRoot: {
        rehydrated:false,
        userDataLoaded:false,
        stepDataLoaded:false,
        programDataLoaded:false,
        planDataLoaded:false,
        goalDataLoaded:false,
        updateOccurrenceDataLoaded:false,
        visualizationDataLoaded:false,
        stepOccurrenceDataLoaded:false,
        updateDataLoaded:false,
        profileDataLoaded:false,
        settingsDataLoaded:false,
        contactDataLoaded:false,
        smartGoalFormData:{modalIsOpen:false, data:{}},
        birdModalData:{modalIsOpen:false, data:{}},
        displayAlert:{showAlert:false, text:"", style:{}},
        timeLastReloaded: moment().subtract(1,"hours"),


        //searchQuery: state.rootReducer.searchQuery,
        //searchHitsVisibility: state.rootReducer.searchHitsVisibility,

        gui: {
          forMobile: false,

          isSidebarVisible: false,
          isMessageWindowVisible: false,

          dailyPeriod: {
            selection: 'TODAY',
            periodStart: "",
            periodEnd: "",
          },
        }

      }
    }

  }

  else {


    return {
      storeRoot: {
        rehydrated:state.rootReducer.rehydrated,
        user: state.rootReducer.user,
        profile: state.rootReducer.profile,

        settings: state.rootReducer.settings,
        goals: state.rootReducer.goals,
        plans: state.rootReducer.plans,
        contacts: state.rootReducer.contacts,
        programs: state.rootReducer.programs,
        stepOccurrences: state.rootReducer.stepOccurrences,
        updateOccurrences: state.rootReducer.updateOccurrences,
        visualizations: state.rootReducer.visualizations,
        messageThreads: state.rootReducer.messageThreads,
        updates: state.rootReducer.updates,
        publicGoals: state.rootReducer.publicGoals,
        updateModalData: state.rootReducer.updateModalData,
        stepModalData: state.rootReducer.stepModalData,
        profileModalData: state.rootReducer.profileModalData,
        smartGoalFormData: state.rootReducer.smartGoalFormData,
        goalModalData:state.rootReducer.goalModalData,
        programModalData: state.rootReducer.programModalData,
        visualizationModalData: state.rootReducer.visualizationModalData,
        signInOrSignupModalData: state.rootReducer.signInOrSignupModalData,
        subscriptionModalData: state.rootReducer.subscriptionModalData,
         programRequestModalData: state.rootReducer.programRequestModalData,
        birdModalData:state.rootReducer.birdModalData,



        userDataLoaded:state.rootReducer.userDataLoaded,
        stepDataLoaded:state.rootReducer.stepDataLoaded,
        programDataLoaded:state.rootReducer.userDataLoaded,
        planDataLoaded:state.rootReducer.planDataLoaded,
        goalDataLoaded:state.rootReducer.goalDataLoaded,
        updateOccurrenceDataLoaded:state.rootReducer.updateOccurrenceDataLoaded,
        visualizationDataLoaded:state.rootReducer.visualizationDataLoaded,
        stepOccurrenceDataLoaded:state.rootReducer.stepOccurrenceDataLoaded,
        updateDataLoaded:state.rootReducer.updateDataLoaded,
        profileDataLoaded:state.rootReducer.profileDataLoaded,
        settingsDataLoaded:state.rootReducer.settingsDataLoaded,
        contactDataLoaded:state.rootReducer.contactDataLoaded,
        timeLastReloaded:state.rootReducer.timeLastReloaded,
        displayAlert:state.rootReducer.displayAlert,



        gui: {
          searchQuery: state.rootReducer.searchQuery,
          searchHitsVisibility: state.rootReducer.searchHitsVisibility,
          forMobile: state.rootReducer.forMobile,
          shouldReload: state.rootReducer.shouldReload,
          isSidebarVisible: state.rootReducer.isSidebarVisible,
          isMessageWindowVisible: state.rootReducer.isMessageWindowVisible,
          currentThread: state.rootReducer.currentThread,
          openThreads: state.rootReducer.openThreads,
          currentContact: state.rootReducer.currentContact,
          dailyPeriod: state.rootReducer.dailyPeriod
        }
      }


    }


  }


}










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

module.exports = { mapDispatchToProps, mapStateToProps };
