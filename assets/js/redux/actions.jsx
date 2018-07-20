
function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

export const shouldReload = (shouldReload) => {
    return {
        type: 'SHOULD_RELOAD',
        shouldReload: shouldReload,
    }
};

export const clearModalData = () => {
    return {
        type: 'CLEAR_MODAL_DATA'
    }
}

export const setPlans = (thePlans) => {
    return {
        type: 'SET_PLANS',
        plans: thePlans,
    }
};

export const setSettings = (theSettings) => {
    return {
        type: 'SET_SETTINGS',
        settings: theSettings,
    }
};

export const setContactGroups = (theContactGroups) => {
    return {
        type: 'SET_CONTACT_GROUPS',
        contactGroups: theContactGroups,
    }
};

export const setRehydrated = (wasRehydrated) => {
    return {
        type: 'SET_REHYDRATED',
        rehydrated: wasRehydrated,
    }
};

export const addPlan = (thePlan) => {
    return {
        type: 'ADD_PLAN',
        plan: thePlan,
    }
};

export const removePlan = (thePlanId) => {
    return {
        type: 'REMOVE_PLAN',
        planId: thePlanId,
    }
};

export const setForMobile = (forMobile) => {
    return {
        type: 'SET_FOR_MOBILE',
        forMobile: forMobile
    }
};


export const setMessageWindowVisibility = (isVisible) => {
    return {
        type: 'SET_MESSAGE_WINDOW_VISIBILITY',
        visibility: isVisible
    }
};
export const setCurrentUser = (theUser) => {
    return {
        type: 'SET_CURRENT_USER',
        user: theUser
    }
};

export const setDomain = (theDomain) => {
    return {
        type: 'SET_DOMAIN',
        domain: theDomain
    }
};

export const setProfile = (theProfile) => {
    return {
        type: 'SET_PROFILE',
        profile: theProfile
    }
};

export const setCurrentContact = (theContact) => {
    return {
        type: 'SET_CURRENT_CONTACT',
        contact: theContact
    }
};

export const setGoals = (theGoals) => {
    return {
        type: 'SET_GOALS',
        goals: theGoals,
    }
};

export const setPublicGoals = (theGoals) => {
    return {
        type: 'SET_PUBLIC_GOALS',
        publicGoals: theGoals,
    }
};


export const setPublicPrograms = (thePrograms) => {
    return {
        type: 'SET_PUBLIC_PROGRAMS',
        publicPrograms: thePrograms,
    }
};

export const addGoal = (theGoal) => {
    return {
        type: 'ADD_GOAL',
        goal: theGoal,
    }
};

export const updateGoal = (theGoal) => {
    return {
        type: 'UPDATE_GOAL',
        goal: theGoal,
    }
};


export const deleteGoal = (theGoalId) => {
    return {
        type: 'DELETE_GOAL',
        goalId: theGoalId,
    }
};

export const replaceContact = (theContactsProfileId, theContact) => {
    return {
        type: 'REPLACE_CONTACT',
        contactsProfileId: theContactsProfileId,
        contact: theContact,
    }
};


export const setContacts = (theContacts) => {
    return {
        type: 'SET_CONTACTS',
        contacts: theContacts,
    }
};

export const addContact = (theContact) => {
    return {
        type: 'ADD_CONTACT',
        contact: theContact,
    }
};

export const setOpenThreads = (theOpenThreads) => {
    return {
        type: 'SET_OPEN_THREADS',
        threads: theOpenThreads,
    }
};

export const closeOpenThread = (theThreadId) => {
    return {
        type: 'CLOSE_OPEN_THREAD',
        threadId: theThreadId,
    }
};

export const addOpenThread = (theThread) => {
    return {
        type: 'ADD_OPEN_THREAD',
        thread: theThread,
    }
};

export const setMessageThreads = (theMessageThreads) => {

    return {
        type: 'SET_MESSAGE_THREADS',
        threads: theMessageThreads,
    }
};

export const addThread = (theThread) => {
    return {
        type: 'ADD_THREAD',
        thread: theThread,
    }
};

export const addMessage = (theThreadId, theMessage) => {
    return {
        type: 'ADD_MESSAGE',
        threadId: theThreadId,
        message: theMessage,
    }
};

export const setCurrentThread = (theThread) => {
    return {
        type: 'SET_CURRENT_THREAD',
        thread: theThread,
    }
};

export const setPrograms = (thePrograms) => {
    return {
        type: 'SET_PROGRAMS',
        programs: thePrograms,
    }
};


export const addProgram = (theProgram) => {
    return {
        type: 'ADD_PROGRAM',
        program: theProgram,
    }
};

export const updateProgram = (theProgram) => {
    return {
        type: 'UPDATE_PROGRAM',
        program: theProgram,
    }
};



export const deleteProgram = (theProgramId) => {
    console.log("theProgramId " + theProgramId);
    return {
        type: 'DELETE_PROGRAM',
        programId: theProgramId,
    }
};

export const addStep = (theProgramId, theStep) => {
    return {
        type: 'ADD_STEP',
        programId: theProgramId,
        step: theStep,
    }
};

export const updateStep = (theProgramId, theStep) => {
    return {
        type: 'UPDATE_STEP',
        programId: theProgramId,
        step: theStep,
    }
};

export const updateProfile = (theProfile) => {
    return {
        type: 'UPDATE_PROFILE',
        profile: theProfile,
    }
};


export const deleteStep = (theProgramId, theStepId) => {
    return {
        type: 'DELETE_STEP',
        programId: theProgramId,
        stepId: theStepId,
    }
};

export const deleteContact = (theContactId) => {
    return {
        type: 'DELETE_CONTACT',
        contactId: theContactId,
    }
};

export const setDailyPeriod = (theDailyPeriod) => {
    return {
        type: 'SET_DAILY_PERIOD',
        dailyPeriod: theDailyPeriod,
    }
};

export const setSearchQuery = (theSearchQuery) => {
    return {
        type: 'SET_SEARCH_QUERY',
        searchQuery: theSearchQuery,
    }
}

export const setGoalSearchQuery = (theSearchQuery) => {
    return {
        type: 'SET_GOAL_SEARCH_QUERY',
        goalSearchQuery: theSearchQuery,
    }
}

export const setSearchHitsVisibility = (theSearchHitsVisibility) => {
    return {
        type: 'SET_SEARCH_HITS_VISIBILITY',
        searchHitsVisibility: theSearchHitsVisibility,
    }
}

export const setUpdates = (theUpdates) => {
    return {
        type: 'SET_UPDATES',
        updates: theUpdates,
    }
}

export const removeStepFromUpdate = (theUpdateId, theStepId) => {
    return {
        type: 'REMOVE_STEP_FROM_UPDATE',
        updateId: theUpdateId,
        stepId: theStepId,
    }
}



export const addStepToUpdate = (theUpdateId, theStepId) => {
    return {
        type:'ADD_STEP_TO_UPDATE',
        updateId: theUpdateId,
        stepId: theStepId,
    }

}

export const clearTempStep = () => {
    return {
        type:'CLEAR_TEMP_STEP',
    }

}

export const clearTempProfile = () => {
    return {
        type:'CLEAR_TEMP_PROFILE',
    }

}



export const editUpdate = (theUpdateId, theUpdate) => {
    return {
        type: 'EDIT_UPDATE',
        updateId: theUpdateId,
        update: theUpdate,
    }
}

export const addUpdate = (theUpdate) => {
    return {
        type: 'ADD_UPDATE',
        update: theUpdate,
    }
}

export const addUpdateWithoutStep = (theUpdate) => {
    console.log("addUpdateWithoutStep")
    return {
        type: 'ADD_UPDATE_WITHOUT_STEP',
        update: theUpdate,
    }
}

export const setUpdateModalData = (theUpdateModalData) => {
    return {
        type: 'SET_UPDATE_MODAL_DATA',
        updateModalData: theUpdateModalData,
    }
};

export const setPlanModalData = (thePlanModalData) => {
    return {
        type: 'SET_PLAN_MODAL_DATA',
        planModalData: thePlanModalData,
    }
};

export const setStepModalData = (theStepModalData) => {
    return {
        type: 'SET_STEP_MODAL_DATA',
        stepModalData: theStepModalData,
    }
};

export const setGoalModalData = (theGoalModalData) => {
    return {
        type: 'SET_GOAL_MODAL_DATA',
        goalModalData: theGoalModalData,
    }
};

export const setSmartGoalFormData = (theSmartGoalFormData) => {
    return {
        type: 'SET_SMART_GOAL_FORM_DATA',
        smartGoalFormData: theSmartGoalFormData,
    }
};

export const setProfileModalData = (theProfileModalData) => {
    return {
        type: 'SET_PROFILE_MODAL_DATA',
        profileModalData: theProfileModalData,
    }
};

export const setProgramModalData = (theProgramModalData) => {
    return {
        type: 'SET_PROGRAM_MODAL_DATA',
        programModalData: theProgramModalData,
    }
};

export const setSubscriptionModalData = (theSubscriptionModalData) => {
    return {
        type: 'SET_SUBSCRIPTION_MODAL_DATA',
        subscriptionModalData: theSubscriptionModalData,
    }
};

export const setContactGroupModalData = (theContactGroupModalData) => {
    return {
        type: 'SET_CONTACT_GROUP_MODAL_DATA',
        contactGroupModalData: theContactGroupModalData,
    }
};

export const setSignInOrSignupModalData = (theSignInOrSignupModalData) => {
    return {
        type: 'SET_SIGN_IN_OR_SIGNUP_MODAL_DATA',
        signInOrSignupModalData: theSignInOrSignupModalData,
    }
};

export const setVisualizationModalData = (theVisualizationModalData) => {
    return {
        type: 'SET_VISUALIZATION_MODAL_DATA',
        visualizationModalData: theVisualizationModalData,
    }
};

export const setInitialCurrentFormValues = (theFormValues) => {
    return {
        type: 'SET_INITIAL_CURRENT_FORM_VALUES',
        formValues: theFormValues,
    }
};


export const setCurrentFormValue = (theFieldName, theFieldValue) => {
    console.log("setcurrentformvalue")
    return {
        type: 'SET_CURRENT_FORM_VALUE',
        fieldName: theFieldName,
        fieldValue: theFieldValue,
    }
};


export const returnServerErrors = (theServerErrors) => {
    return {
        type: 'RETURN_SERVER_ERRORS',
        serverErrors: theServerErrors
    }
}

export const editVisualization = (theVisualizationId, theVisualization) => {
    return {
        type: 'EDIT_VISUALIZATION',
        visualizationId: theVisualizationId,
        visualization: theVisualization,
    }
}

export const addVisualization = (theVisualization) => {
    return {
        type: 'ADD_VISUALIZATION',
        visualization: theVisualization,
    }
}

export const deleteVisualization = (theVisualizationId) => {
    return {
        type: 'DELETE_VISUALIZATION',
        visualizationId: theVisualizationId,
    }
}



export const setStepOccurrences = (theStepOccurrences) => {
    return {
        type: 'SET_STEP_OCCURRENCES',
        stepOccurrences: theStepOccurrences,
    }
};

export const setDisplayAlert = (theAlert) => {
    return {
        type: 'SET_DISPLAY_ALERT',
        alert: theAlert,
    }
};

export const updateStepOccurrence = (theStepOccurrence) => {
    return {
        type: 'UPDATE_STEP_OCCURRENCE',
        stepOccurrence: theStepOccurrence,
    }

}

export const updateUpdateOccurrence = (theUpdateOccurrence) => {
    return {
        type: 'UPDATE_UPDATE_OCCURRENCE',
        updateOccurrence: theUpdateOccurrence,
    }

}

export const setVisualizations = (theVisualizations) => {
    return {
        type: 'SET_VISUALIZATIONS',
        visualizations: theVisualizations,
    }
};

export const setUpdateOccurrences = (theUpdateOccurrences) => {
    return {
        type: 'SET_UPDATE_OCCURRENCES',
        updateOccurrences: theUpdateOccurrences,
    }
};

export const setDataToBeSubmittedAfterLogin = (theData) => {
    return {
        type: 'SET_DATA_TO_BE_SUBMITTED_AFTER_LOGIN',
        data: theData,
    }

}
export const reduxLogin = (theUser) => {
    return {
        type: 'LOGIN',
        user: theUser
    }
};

export const reduxLogout = () => {
    return {
        type: 'LOGOUT',
    }
};

export const showSidebar = (isSidebarVisible) => {
    return {
        type: 'SHOW_SIDEBAR',
        visibility:isSidebarVisible

    }
};

export const setDataLoaded = (theDataSetThatWasLoaded) => {
    return {
        type: 'SET_DATA_LOADED',
        dataSet:theDataSetThatWasLoaded

    }
};

export const setTimeLastReloaded = () => {
    return {
        type: 'SET_TIME_LAST_RELOADED',


    }
};

export const submitEvent = (theEventName) => {
    return {
        type: 'SUBMIT_EVENT',
        event: theEventName,

    }
};

export const setPayload = (thePayload) => {
    return {
        type: 'SET_PAYLOAD',
        payload: thePayload,

    }
};


export const setProgramRequestModalData = (programRequestModalData) => {
    return {
        type: 'SET_PROGRAM_REQUEST_MODAL_DATA',
        programRequestModalData: programRequestModalData,



    }
};

export const addContactGroup = (theContactGroup) => {
    return {
        type: 'ADD_CONTACT_GROUP',
        contactGroup: theContactGroup
    }
}

export const updateDataItem =  (theForm, theReduxKey, theDataItem) => {
    return {
        type: "UPDATE_DATA_ITEM",
        form: theForm,
        reduxKey: theReduxKey,
        dataItem: theDataItem,
    }
}

export const addDataItem = (theForm, theReduxKey, theReduxModelKey, theDataItem) => {
    return {
        type: 'ADD_DATA_ITEM',
        form:theForm,
        reduxKey: theReduxKey,
        reduxModelKey: theReduxModelKey,
        dataItem: theDataItem,
    }
}

export const deleteDataItem = (theReduxKey, theDataItemId) => {
    return {
        type: 'DELETE_DATA_ITEM',
        reduxKey: theReduxKey,
        dataItemId: theDataItemId,
    }
}

export const setModalFormData = (theFormName, theModalFormData) => {
    return {
        type: 'SET_MODAL_FORM_DATA',
        formName: theFormName,
        modalData: theModalFormData,
    }
};




export const setSelectedContactGroup = (theContactGroup) => {
    return {
        type: 'SET_SELECTED_CONTACT_GROUP',
        contactGroup: theContactGroup,
    }
}








module.exports = { replaceContact,  setDomain, setSelectedContactGroup, deleteDataItem, setDataLoaded, setContactGroupModalData, addContactGroup, setContactGroups, setInitialCurrentFormValues, setPlanModalData, setCurrentFormValue, submitEvent, clearModalData, setModalFormData, setGoalSearchQuery, updateDataItem, addDataItem, setProgramRequestModalData, setSubscriptionModalData, setTimeLastReloaded, setPublicPrograms, setPublicGoals, setRehydrated, setDisplayAlert, setSignInOrSignupModalData, setGoalModalData, setSmartGoalFormData, setProfileModalData, updateProfile, clearTempProfile, clearTempStep,  updateUpdateOccurrence, updateStepOccurrence, setUpdateOccurrences, setProgramModalData,  setVisualizations, setUpdateModalData, addVisualization, deleteVisualization, editVisualization, setVisualizationModalData, addUpdateWithoutStep, setStepModalData, setUpdates, addUpdate, addStepToUpdate, removeStepFromUpdate, editUpdate, setCurrentUser, setSearchHitsVisibility, setSearchQuery, setSettings, setDailyPeriod, shouldReload, setProfile, deleteContact, setForMobile, setPlans, addContact, addPlan, removePlan, setMessageWindowVisibility, setCurrentContact, reduxLogout, addOpenThread, addMessage, closeOpenThread, reduxLogin, showSidebar, addThread, setMessageThreads, setOpenThreads, updateProgram, setCurrentThread, setPrograms, addProgram, deleteProgram, addStep, updateStep, deleteStep, setGoals, addGoal, updateGoal, deleteGoal, updateGoal, setContacts, setStepOccurrences };