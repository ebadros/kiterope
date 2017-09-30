
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
    console.log("themobbile is " + forMobile);
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
    console.log("updateStep called");
    return {
        type: 'UPDATE_STEP',
        programId: theProgramId,
        step: theStep,
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






export const setStepOccurrences = (theStepOccurrences) => {
    return {
        type: 'SET_STEP_OCCURRENCES',
        stepOccurrences: theStepOccurrences,
    }
};

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





module.exports = { setCurrentUser, setSettings, shouldReload, setProfile, deleteContact, setForMobile, setPlans, addContact, addPlan, removePlan, setMessageWindowVisibility, setCurrentContact, reduxLogout, addOpenThread, addMessage, closeOpenThread, reduxLogin, showSidebar, addThread, setMessageThreads, setOpenThreads, updateProgram, setCurrentThread, setPrograms, addProgram, deleteProgram, addStep, updateStep, deleteStep, setGoals, addGoal, updateGoal, deleteGoal, updateGoal, setContacts, setStepOccurrences };