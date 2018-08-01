var React = require('react');
var $  = require('jquery');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'

//import Datepicker from './Datepicker';
var Datetime = require('react-datetime');

import DatePicker  from 'react-datepicker';
import moment from 'moment';
var TinyMCE = require('react-tinymce-input');
var MaskedInput = require('react-maskedinput');
import autobind from 'class-autobind'
var validator = require('validator');
//import TimePicker from 'rc-time-picker';
import DynamicSelectButton2 from './base'
var Select = require('react-select');
import  { ValidatedInput, KRCheckBox } from './app'
var auth = require('./auth');
var Modal = require('react-modal');
import {MessageWindowContainer} from './message'

import { Sidebar, SidebarWithoutClickingOutside } from './sidebar'
import Global from 'react-global';

import { setCurrentUser, setTimeLastReloaded, setDomain, setContactGroups, setPublicGoals, setPublicPrograms, setPlans,setSignInOrSignupModalData, setRehydrated, setSmartGoalFormData, setDataLoaded, setUpdateOccurrences, setUpdates, setVisualizations, removeStepFromUpdate, addStepToUpdate, editUpdate, reduxLogout, setProfile, setSettings, setForMobile, showSidebar, setContacts, setMessageWindowVisibility, setOpenThreads, setGoals, setPrograms, setMessageThreads,  setStepOccurrences } from './redux/actions'
import {convertDate, convertFromDateString, daysBetweenDates, daysBetween} from './dateConverter'
//var sb = new SendBird({
//    appId: '36A8769D-9595-4CB5-B27C-47E0574CD7C7'
//});
const axios = require('axios');
axios.defaults.headers.common['Authorization'] = 'Token ' + localStorage.token;
axios.defaults.headers.common['Accept'] = 'Token ' + 'application/json';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.get['Content-Type'] = 'application/json';
axios.defaults.headers.patch['Content-Type'] = 'application/json';


var defaultAxios = axios.create({

  headers: {'Accept': 'application/json', 'Content-Type': 'application/json', 'X-CSRFToken': getCookie('csrftoken'), 'Authorization': ('Token ' + localStorage.token)},
});


function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}
var ReconnectingWebSocket = require('reconnecting-websocket');
var ws_scheme = window.location.protocol == "https:" ? "wss" : "ws";




// Be sure to include styles at some point, probably during your bootstrapping
import 'react-select/dist/react-select.css';

var UpdatesList = require('./update');

import { theServer, s3IconUrl, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions } from './constants'

import { Provider, connect, dispatch } from 'react-redux'
import { persistStore, autoRehydrate } from 'redux-persist'
import  {store} from "./redux/store"
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'
import {REHYDRATE} from 'redux-persist/constants'
import {  mapStateToProps, mapDispatchToProps } from './redux/containers2'



$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Connection', 'keep-alive');
        xhr.setRequestHeader('Authorization', 'Token ' + localStorage.token);

    }
});

var d = document.getElementsByClassName('ui fluid purple button').style = {
    backgroundColor:'black'
}



const customStyles = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)'
  },

  content : {
    top                   : '10%',
    left                  : '30%',
    right                 : '30%',
    bottom                : '10%',
    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '20px'
  }
};

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}





@connect(mapStateToProps, mapDispatchToProps)
export default class ReduxDataGetter extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            width: '0',
            height: '0',
            rehydrated: false,
            user: "",
            intervals: "",
        }

    }

    componentDidMount = () => {
        store.dispatch(setMessageWindowVisibility(false));
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);



         persistStore(store, {
         blacklist: [
         'rehydrated',
         'routing',
         'gui',
         'smartGoalFormData',
             'domain',

         ]
         }, () => {
         store.dispatch(setRehydrated(true))



         //this.setState({rehydrated: true}, () => {
           this.getAllData()
         //})


         })

    };

    stopPollingForData() {
        if (this.state.userDataLoaded &&
            this.state.stepDataLoaded &&
            this.state.programDataLoaded &&
            this.state.planDataLoaded &&
            this.state.goalDataLoaded &&
            this.state.updateOccurrenceDataLoaded &&
            this.state.visualizationDataLoaded &&
            this.state.stepOccurrenceDataLoaded &&
            this.state.updateDataLoaded &&
            this.state.profileDataLoaded &&
            this.state.settingsDataLoaded &&
            this.state.contactDataLoaded) {
            clearInterval(this.state.intervalID)

        }
    }


    getAllData() {
        this.loadDomainData()

        store.dispatch(setSmartGoalFormData({modalIsOpen: false, data: {}}))
this.loadPublicGoalData()
                        this.loadPublicProgramData()

        this.loadUserData()

        // var intervalID = setInterval(this.loadUserData, 2000);
        //this.setState({intervalID: intervalID})

    }


    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        if (this.state.intervalID != undefined) {
            clearInterval(this.state.intervalID);

        }
    }

    /*
    loadDomainData() {

        console.log("loadDomainData called")

        this.loadSpecificData("domainDataLoaded", "/api/domains/i/", (theData) => {
            console.log(theData)

            store.dispatch(setDataLoaded('domainData'))
            store.dispatch(setDomain(theData.data));



            if (this.state.intervals[theData.dataLoadedVariable] != undefined) {
                    clearInterval(this.state.intervals[theData.dataLoadedVariable]);
                }




        })
    }*/

    loadDomainData () {
        var theUrl = "/api/domains/i/";
        $.ajax({
            url: theUrl,
            dataType: 'json',
            cache: false,
            success: function (data) {

                store.dispatch(setDataLoaded('domainData'))
            store.dispatch(setDomain(data));

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(theUrl, status, err.toString());

            }.bind(this),

        });
    }


    updateWindowDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
        if (window.innerWidth >= 768) {
            store.dispatch(setForMobile(false))
        } else {
            store.dispatch(setForMobile(true))

        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.userDataLoaded != nextProps.storeRoot.userDataLoaded) {
            this.setState({userDataLoaded: nextProps.storeRoot.userDataLoaded})

        }

        if (this.state.stepDataLoaded != nextProps.storeRoot.stepDataLoaded) {
            this.setState({stepDataLoaded: nextProps.storeRoot.stepDataLoaded})
        }

        if (this.state.programDataLoaded != nextProps.storeRoot.programDataLoaded) {
            this.setState({programDataLoaded: nextProps.storeRoot.programDataLoaded})
        }

        if (this.state.planDataLoaded != nextProps.storeRoot.planDataLoaded) {
            this.setState({planDataLoaded: nextProps.storeRoot.planDataLoaded})
        }

        if (this.state.goalDataLoaded != nextProps.storeRoot.goalDataLoaded) {
            this.setState({goalDataLoaded: nextProps.storeRoot.goalDataLoaded})
        }

        if (this.state.updateOccurrenceDataLoaded != nextProps.storeRoot.updateOccurrenceDataLoaded) {
            this.setState({updateOccurrenceDataLoaded: nextProps.storeRoot.updateOccurrenceDataLoaded})
        }

        if (this.state.visualizationDataLoaded != nextProps.storeRoot.visualizationDataLoaded) {
            this.setState({visualizationDataLoaded: nextProps.storeRoot.visualizationDataLoaded})
        }

        if (this.state.stepOccurrenceDataLoaded != nextProps.storeRoot.stepOccurrenceDataLoaded) {
            this.setState({stepOccurrenceDataLoaded: nextProps.storeRoot.stepOccurrenceDataLoaded})
        }

        if (this.state.updateDataLoaded != nextProps.storeRoot.updateDataLoaded) {
            this.setState({updateDataLoaded: nextProps.storeRoot.updateDataLoaded})
        }

        if (this.state.profileDataLoaded != nextProps.storeRoot.profileDataLoaded) {
            this.setState({profileDataLoaded: nextProps.storeRoot.profileDataLoaded})
        }

        if (this.state.settingsDataLoaded != nextProps.storeRoot.settingsDataLoaded) {
            this.setState({settingsDataLoaded: nextProps.storeRoot.settingsDataLoaded})
        }

        if (this.state.contactDataLoaded != nextProps.storeRoot.contactDataLoaded) {
            this.setState({contactDataLoaded: nextProps.storeRoot.contactDataLoaded})
        }

        if (this.state.user != nextProps.storeRoot.user) {

            var currentUser = nextProps.storeRoot.user
            this.setState({user: currentUser})
            if (currentUser != undefined) {
                if (currentUser.id != null) {
                    this.loadUniversalData();


                }
            }
        }

    }

    loadSpecificData(dataLoadedVariable, theApiUrl, methodCall) {
                if (this.state[dataLoadedVariable] != true || this.state[dataLoadedVariable] != undefined) {

                    var intervalID = setInterval(this.loadSpecificDataCall(dataLoadedVariable, theApiUrl, methodCall), 3000);

                    var theInterval = {[dataLoadedVariable]: intervalID}
                    this.setState({intervals: Object.assign({}, this.state.intervals, theInterval)})
                }
    }






    loadSpecificDataCall(dataLoadedVariable, theApiUrl, methodCall) {
        /*
        defaultAxios.get(theApiUrl)

            .then(function (response) {
                methodCall({data:response.data, dataLoadedVariable: dataLoadedVariable})
                // handle success

                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
              })
            .then(function () {
                // always executed
              })
*/

            $.ajax({
                method: 'GET',
                url: theApiUrl,
                datatype: 'json',
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success:  (someData) => {

                    methodCall({data:someData, dataLoadedVariable: dataLoadedVariable})

                },
                error: function (xhr, status, err) {
                    console.error(theApiUrl, status, err.toString());

                }
            })

    }

    loadUserData() {

        this.loadSpecificData("userDataLoaded", "/api/users/i/", (theData) => {

            store.dispatch(setDataLoaded('userData'))
            store.dispatch(setCurrentUser(theData.data));
            if (theData.data.id != null) {

                this.loadUniversalData();


            }


            if (this.state.intervals[theData.dataLoadedVariable] != undefined) {
                    clearInterval(this.state.intervals[theData.dataLoadedVariable]);
                }




        })
    }



    loadProfileData() {
        this.loadSpecificData("profileDataLoaded", "/api/profiles/me/",  (theData) => {
            store.dispatch(setProfile(theData.data))
            store.dispatch(setDataLoaded('profileData'))
                                    this.setUsersTimezone(theData.data.id)


            if (this.state.intervals[theData.dataLoadedVariable] != undefined) {
            clearInterval(this.state.intervals[theData.dataLoadedVariable]);
        }
        })
    }




    loadSettingsData() {
        this.loadSpecificData("settingsDataLoaded", "/api/settings/me/",  (theData) => {
            store.dispatch(setSettings(theData.data))
            store.dispatch(setDataLoaded('settingsData'))

            if (this.state.intervals[theData.dataLoadedVariable] != undefined) {
            clearInterval(this.state.intervals[theData.dataLoadedVariable]);
        }
        })
    }



    setUsersTimezone(userProfileId) {
        var theUrl = '/api/profiles/' + userProfileId + "/";
        var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        $.ajax({
            method: 'PATCH',
            url: theUrl,
            datatype: 'json',
            data: {timezone: timezone},
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {


            }.bind(this),
            error: function (xhr, status, err) {
                console.error(theUrl, status, err.toString());
            }
        })

    }

    loadUniversalData() {
        var halfAnHourAgo = moment().subtract(.5, "hours")
        if (this.state.timeLastReloaded < halfAnHourAgo || this.props.storeRoot.timeLastReloaded == undefined) {
                        store.dispatch(setTimeLastReloaded())


            this.loadStepOccurrenceData();

            this.loadGoalData();
            this.loadProgramData()

            this.loadPlanData();
            this.loadUpdateOccurrenceData();
            this.loadVisualizationData();
            this.loadUpdateData()
            this.loadContactGroupData()




            this.loadProfileData();
            this.loadSettingsData();
            //this.loadMessageThreadData();
            this.loadContactData();

        }

    }




    loadUpdateData() {
        this.loadSpecificData("updateDataLoaded", "/api/updates/",  (theData) => {
            store.dispatch(setUpdates(theData.data))
            store.dispatch(setDataLoaded('updateData'))

            if (this.state.intervals[theData.dataLoadedVariable] != undefined) {
            clearInterval(this.state.intervals[theData.dataLoadedVariable]);
        }
        })
    }

    loadContactGroupData() {
        this.loadSpecificData("contactGroupDataLoaded", "/api/contactGroups/",  (theData) => {
            store.dispatch(setContactGroups(theData.data))
            store.dispatch(setDataLoaded('contactGroup'))

            if (this.state.intervals[theData.dataLoadedVariable] != undefined) {
            clearInterval(this.state.intervals[theData.dataLoadedVariable]);
        }
        })
    }




    loadGoalData() {
        this.loadSpecificData("goalDataLoaded", "/api/goals/",  (theData) => {
            store.dispatch(setGoals(theData.data))
            store.dispatch(setDataLoaded('goalData'))

            if (this.state.intervals[theData.dataLoadedVariable] != undefined) {
            clearInterval(this.state.intervals[theData.dataLoadedVariable]);
        }
        })
    }




    loadPlanData() {
        this.loadSpecificData("planDataLoaded", "/api/planOccurrences/",  (theData) => {
            store.dispatch(setPlans(theData.data))
            store.dispatch(setDataLoaded('planData'))

            if (this.state.intervals[theData.dataLoadedVariable] != undefined) {
            clearInterval(this.state.intervals[theData.dataLoadedVariable]);
        }
        })
    }



    loadProgramData() {
        this.loadSpecificData("programDataLoaded", "/api/programs/",  (theData) => {
            store.dispatch(setPrograms(theData.data))
            store.dispatch(setDataLoaded('programData'))

            if (this.state.intervals[theData.dataLoadedVariable] != undefined) {
            clearInterval(this.state.intervals[theData.dataLoadedVariable]);
        }
        })
    }


    loadMessageThreadData() {
        if (!this.state.messageThreadDataLoaded) {

            //sb.connect('eric@kiterope.com', '06acb152950c651a173c7c4425856ef7317281d3', function(user, error) {});

            var theUrl = '/api/messageThreads/';

            $.ajax({
                url: theUrl,
                dataType: 'json',
                cache: false,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    this.setState({messageThreadDataLoaded: true})


                    store.dispatch(setMessageThreads(data));
                    store.dispatch(setOpenThreads({}))


                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }.bind(this),

            });
        }
    }



    loadStepOccurrenceData() {
        var periodRangeStart = new Date();
        var periodRangeEnd = new Date();
        periodRangeStart = moment(periodRangeStart).format('YYYY-MM-DD');
        periodRangeEnd = moment(periodRangeEnd).format('YYYY-MM-DD');
        var theUrl = "/api/period/" + periodRangeStart + "/" + periodRangeEnd + "/";

        this.loadSpecificData("stepOccurrenceDataLoaded", theUrl,  (theData) => {
            store.dispatch(setDataLoaded('stepOccurrenceData'))
            store.dispatch(setStepOccurrences(theData.data))

            if (this.state.intervals[theData.dataLoadedVariable] != undefined) {
            clearInterval(this.state.intervals[theData.dataLoadedVariable]);
        }

        })

    }

    loadUpdateOccurrenceData() {

        this.loadSpecificData("updateOccurrenceDataLoaded", "/api/updateOccurrences/",  (theData) => {
            this.formatUpdateOccurrenceData(theData.data)
            //store.dispatch(setUpdateOccurrences(theData.data))

            store.dispatch(setDataLoaded('updateOccurrenceData'))

            if (this.state.intervals[theData.dataLoadedVariable] != undefined) {
            clearInterval(this.state.intervals[theData.dataLoadedVariable]);
        }
        })
    }




    formatUpdateOccurrenceData(theUpdateOccurrences) {
        console.log("formatUpdateOccurrenceData")
            var theData = []
            var uniqueStepOccurrenceIds = []

            for (var i=0; i < theUpdateOccurrences.length; i++) {
                                console.log("i " + i)


                //Compile all unique step occurrences
                var theStepOccurrenceId = theUpdateOccurrences[i].stepOccurrence

                if (uniqueStepOccurrenceIds.indexOf(theStepOccurrenceId) < 0) {
                                        uniqueStepOccurrenceIds.push(theStepOccurrenceId)

                }

            }


            for (var i=0; i < uniqueStepOccurrenceIds.length; i++) {
                console.log("i " + i)
                var theStepOccurrenceId = uniqueStepOccurrenceIds[i]
                                    var theStepOccurrenceSetOfData = {}

                for (var j=0; j < theUpdateOccurrences.length; j++) {
                                    console.log("j " + j)

                    var theCurrentUpdateOccurrence = theUpdateOccurrences[j]
                    var theCurrentUpdateOccurrenceStepOccurrenceId = theCurrentUpdateOccurrence.stepOccurrence
                    if (theStepOccurrenceId == theCurrentUpdateOccurrenceStepOccurrenceId) {
                        console.log("formatUpdate")
                        var measuringWhat = theCurrentUpdateOccurrence.update.measuringWhat
                        var theFormat = theCurrentUpdateOccurrence.update.format
                                                console.log("formatUpdate 2")

                        if (theFormat == 'datetime') {
                             var theConvertedTime = convertDate(theCurrentUpdateOccurrence[theFormat], 0, "dateFormat", "absoluteTime")
                            var updateOccurrenceValue = theConvertedTime

                        } else if (theFormat == 'picture') {
                            var updateOccurrenceValue = theCurrentUpdateOccurrence["pictures"]


                        }
                        else
                         {
                            var updateOccurrenceValue = theCurrentUpdateOccurrence[theFormat]

                        }
                        var theUpdateOccurrenceItem = {format: theFormat, value: updateOccurrenceValue}

                        theStepOccurrenceSetOfData[measuringWhat] = theUpdateOccurrenceItem
                                                //theStepOccurrenceSetOfData[measuringWhat] = updateOccurrenceValue


                    }
                }
                theData.push(theStepOccurrenceSetOfData)




            }
            console.log("theData")
        console.log(theData)
                                store.dispatch(setUpdateOccurrences(theData))



    }


     loadContactData() {
         this.loadSpecificData("contactDataLoaded", "/api/contacts/",  (theData) => {
             store.dispatch(setDataLoaded('contactData'))
                             store.dispatch(setContacts(theData.data))

             //this.organizeContacts(theData.data)

             if (this.state.intervals[theData.dataLoadedVariable] != undefined) {
            clearInterval(this.state.intervals[theData.dataLoadedVariable]);
        }

         })


     }


    loadVisualizationData() {
        this.loadSpecificData("visualizationDataLoaded", "/api/visualizations/",  (theData) => {
            store.dispatch(setVisualizations(theData.data))
            store.dispatch(setDataLoaded('visualizationsData'))

            if (this.state.intervals[theData.dataLoadedVariable] != undefined) {
            clearInterval(this.state.intervals[theData.dataLoadedVariable]);
        }
        })
    }

    loadPublicGoalData () {
        var theUrl = "/api/publicGoals/";
        $.ajax({
            url: theUrl,
            dataType: 'json',
            cache: false,
            success: function (data) {

                store.dispatch(setPublicGoals(data))

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(theUrl, status, err.toString());

            }.bind(this),

        });
    }

    loadPublicProgramData () {

        var theUrl = "/api/publicPrograms/";
        $.ajax({
            url: theUrl,
            dataType: 'json',
            cache: false,
            success: function (data) {

                store.dispatch(setPublicPrograms(data))

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(theUrl, status, err.toString());

            }.bind(this),

        });

    }





    organizeContacts(theContactData) {

        var theContacts = {};
            if (this.props.storeRoot.user) {
                for (var key in theContactData) {
                    if (theContactData[key].receiverProfile.user == this.props.storeRoot.user.id) {
                        var theSender = theContactData[key].senderProfile;

                        var theContactId = theContactData[key].id;
                        theContacts[theContactId] = theSender;


                        //theContacts.push({theContactId: theContactData[key].sender})

                    } else {
                        var theReceiver = theContactData[key].receiverProfile;

                        var theContactId = theContactData[key].id;
                        theContacts[theContactId] = theReceiver

                    }
                }

                store.dispatch(setContacts(theContacts))



        }

    }

    render() {
        if (!this.props.storeRoot.rehydrated) {

            return (null)

        } else {
            return (<div></div>)
        }


    }

}
