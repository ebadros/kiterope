var React = require('react');

import { theServer, times, s3IconUrl, formats, s3BaseUrl, programCategoryOptions, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, programScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, viewableByOptions, subscribeModalStyle, customStepModalStyles, notificationSendMethodOptions, TINYMCE_CONFIG } from './constants'


import { Provider, connect, dispatch } from 'react-redux'

import  {store} from "./redux/store";

import { mapStateToProps, mapDispatchToProps } from './redux/containers2'

import { setCurrentUser, reduxLogout, setCurrentFormValue, showSidebar, setOpenThreads, submitEvent, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, setContacts, setStepOccurrences } from './redux/actions'
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'



@connect(mapStateToProps, mapDispatchToProps)
export class FormSubmitter extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {

        }
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.storeRoot.currentForm != this.state.currentForm) {
            this.setState({currentForm: nextProps.storeRoot.currentForm})
        }

        if (nextProps.storeRoot.currentEvent == "submitForm") {
            store.dispatch(submitEvent(""))
            this.submitForm(nextProps.storeRoot.currentForm)

        }

        if (nextProps.storeRoot.currentEvent == "submissionSuccess") {
            this.updateStore(nextProps.storeRoot.currentPayload)
        }


    }

    //Payload is of the form {model: 'profile', data: {fieldName: 'fieldValue',}, operation: '/api/profiles/'}

    submitForm (theFormData) {
        if (theFormData.data.id != undefined) {
            var theType = 'PATCH'
        } else {
            theType = 'POST'
        }
             $.ajax({
                 url: theFormData.operation ,
                 dataType: 'json',
                 type: theType,
                 data: theFormData,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (returnedData) {
                     store.dispatch(submitEvent("submissionSuccess"))
                     store.dispatch(setPayload({model:theFormData.model, operation: theFormData.operation, data:returnedData}))
                 }.bind(this),
                 error: function (xhr, status, err) {
                     var serverErrors = xhr.responseJSON
                     store.dispatch(submitEvent("submissionFailed"))
                     store.dispatch(setPayload(serverErrors))

                 }.bind(this),
                 complete: function (jqXHR, textStatus){

            }.bind(this)
             });
         }

         updateStore (thePayload) {
             switch(thePayload.model) {
                 case ('settings'):
                     store.dispatch(setSettings(thePayload.data))
             }

         }



}

module.exports = {FormSubmitter}