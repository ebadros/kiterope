var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import autobind from 'class-autobind'
import DatePicker  from 'react-datepicker';
import moment from 'moment';
import Pagination from "react-js-pagination";
import Select from 'react-select'
import TinyMCE from 'react-tinymce';
import TinyMCEInput from 'react-tinymce-input';
import CurrencyInput from 'react-currency-input';
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router';
import { Textfit } from 'react-textfit';
import ShowMore from 'react-show-more';
import ScrollArea from 'react-scrollbar'
import Rnd from 'react-rnd';
var Modal = require('react-modal');
var Datetime = require('react-datetime');
import Dropzone from 'react-dropzone';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'
var BigCalendar = require('react-big-calendar');
var classNames = require('classnames');
import validator from 'validator';
require('react-datepicker/dist/react-datepicker.css');
import 'react-select/dist/react-select.css';
var MaskedInput = require('react-maskedinput');
import {convertDate, convertFromDateString, daysBetweenDates, daysBetween} from './dateConverter'
import {SaveButton, StandardInteractiveButton} from './settings'
import {ImageUploader,  NewImageUploader, PlanForm2, ViewEditDeleteItem, StepViewEditDeleteItem, PlanViewEditDeleteItem, FormAction, Sidebar, Header, FormHeaderWithActionButton, DetailPage} from './base';
import { Menubar, StandardSetOfComponents, ErrorReporter } from './accounts'
import { ValidatedInput, KSSelect } from './app'
import { IconLabelCombo, ClippedImage, ContextualMenuItem, ChoiceModal, ChoiceModalButtonsList } from './elements'
import { makeEditable,  ProgramCalendar } from './calendar'
import { UpdatesList, UpdateModalForm } from './update'


import { defaultStepCroppableImage, defaultGoalCroppableImage,mobileModalStyle, TINYMCE_CONFIG, theServer, s3IconUrl, s3BaseUrl, stepModalStyle, updateModalStyle, customStepModalStyles, formats, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, times, durations, stepTypeOptions, viewableByOptions} from './constants'
import Measure from 'react-measure'
BigCalendar.momentLocalizer(moment);

import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'
import { Provider, connect, dispatch } from 'react-redux'
import  {store} from "./redux/store";
import { mapStateToProps, mapDispatchToProps } from './redux/containers2'
import { addStep, deleteStep, setModalFormData, addDataItem, deleteDataItem, updateDataItem, clearTempStep, addUpdate, updateStep, setUpdateModalData, setStepModalData, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, setContacts, setStepOccurrences } from './redux/actions'


$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Connection', 'keep-alive');
        xhr.setRequestHeader('Authorization', 'Token ' + localStorage.token);

    }
});

export const testForm = {
    formName: "bird",
    formLabel: "Bird",
    reduxKey: "birds",
    reduxModelKey: "name", //this could also be "id" or "array", if array then it creates an array
    formFields: {
        author: {
            fieldType: "UserField",
        },
        id: {
            fieldType: "IdField",

        },
        title: {
            fieldName: "title",
            fieldType: "TextField",
            fieldValidation: '"!isEmpty(str)"',
            fieldLabel:"Title",
            fieldPlaceholder: "I will win a million bucks"
        },
        deadline: {
            fieldType: "DateField",
            fieldName: "deadline",

            fieldValidation: '"!isEmpty(str)"',
        },
        description: {
            fieldType: "RichTextField",
            fieldName: "description",
            fieldLabel:"Visualize your goal",

            fieldValidation: '"!isEmpty(str)"',
        },
        metric: {
            fieldName: "metric",
            fieldType: "TextField",
            fieldValidation: '"!isEmpty(str)"',
            fieldLabel:"Metric",
            fieldPlaceholder: "miles per minute"
        },
        why: {
            fieldName: "why",
            fieldType: "RichTextField",
            fieldLabel:"Why do you want to achieve this goal?",

            fieldValidation: '"!isEmpty(str)"',
        },
        obstacles: {
            fieldName: "obstacle",
            fieldType: "RichTextField",
            fieldLabel:"What might be some obstacles?",

            fieldValidation: '"!isEmpty(str)"',
        },
        croppableImage: {
            fieldName: "croppableImage",
            fieldType: "ImageField",
            fieldDefault: defaultGoalCroppableImage,
            fieldAspectRatio: "square"
        },
        coreValues: {
            fieldName: "coreValues",
            fieldType: "RichTextField",
            fieldValidation: '"!isEmpty(str)"',
            fieldLabel:"What are your core values? What is important to you?",

        },


        viewableBy: {
            fieldName: "viewableBy",
            fieldType: "DropdownField",
            fieldLabel: "Who should be able to see this?",
            fieldOptions: viewableByOptions,
        },

    },
    order: ['author', 'id', 'title', 'deadline', 'description','metric', 'why', 'obstacles',
        'croppableImage', 'coreValues', 'viewableBy'],
    submissionUrl: "/api/goals/",
    saveStatuses:["Create", "Save", "Saving", "Saved"],
    mobileModalStyle: {stepModalStyle},
    fullscreenModalStyle: {updateModalStyle},
}

/*
types of fields in form:
DateField
TextField
RichTextField
DropdownField
MultiselectField
ImageField
CheckboxField



 */



@connect(mapStateToProps, mapDispatchToProps)
export class FormFactory extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            modalIsOpen: false,
            serverErrors: {},
            data: {},
            saveStatus: this.props.form.saveStatuses[0],
            wideColumnWidth: "sixteen wide column",
            mediumColumnWidth:"eight wide column",
            smallColumnWidth:"four wide column",
            forMobile: false,
            saveStatuses: ["Save", "Saving...", "Saved"]
    }
    }



    componentDidMount() {
        this.setState({
            serverErrors: this.props.serverErrors,

        })

        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot[this.props.form.formName + "ModalData"] != undefined) {
                this.setState({
                    data: this.props.storeRoot[this.props.form.formName + "ModalData"].data,
                })
                this.setStateToData(this.props.storeRoot[this.props.form.formName + "ModalData"])


            }

            if (this.props.storeRoot.gui != undefined) {
                this.setState({forMobile: this.props.storeRoot.gui.forMobile})
                if (this.props.storeRoot.gui.forMobile) {
                    this.setState({
                        wideColumnWidth: "sixteen wide column",
                    mediumColumnWidth:"sixteen wide column",
                    smallColumnWidth: "eight wide column",
                })
                } else {
                    this.setState({
                        wideColumnWidth: "sixteen wide column",
                    mediumColumnWidth:"eight wide column",
                    smallColumnWidth: "four wide column",
                })




                }
            }
        }





    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            serverErrors: nextProps.serverErrors,

        })

        if (nextProps.storeRoot != undefined) {
            if (nextProps.storeRoot[nextProps.form.formName + "ModalData"] != undefined) {
                this.setState({data: nextProps.storeRoot[nextProps.form.formName + "ModalData"].data})
                this.setStateToData(nextProps.storeRoot[nextProps.form.formName + "ModalData"])


            }
            if (nextProps.storeRoot.gui != undefined) {
                this.setState({forMobile: nextProps.storeRoot.gui.forMobile})
                if (nextProps.storeRoot.gui.forMobile) {
                    this.setState({
                        wideColumnWidth: "sixteen wide column",
                        mediumColumnWidth: "sixteen wide column",
                        smallColumnWidth: "eight wide column",
                    })
                } else {
                    this.setState({
                        wideColumnWidth: "sixteen wide column",
                        mediumColumnWidth: "eight wide column",
                        smallColumnWidth: "four wide column",
                    })


                }
            }
        }

    }

    setStateToData(theFormValues) {
        this.setState({
            modalIsOpen: theFormValues.modalIsOpen,
            saveStatuses:this.props.form.saveStatuses
        })


        if (theFormValues.data != undefined) {
            var data = theFormValues.data

            var theFieldOrder = this.props.form.order
            var theFields = this.props.form.formFields
            var theSaveStatuses = this.props.form.saveStatuses



            for (var i = 0; i < theFieldOrder.length; i++) {
                var theFieldName = theFieldOrder[i]
                var theCurrentField = theFields[theFieldName]

                switch (theCurrentField.fieldType) {
                    case "DateField":
                        if (data[theFieldName] != null) {
                            this.setState({[theFieldName]: moment(data[theFieldName], "YYYY-MM-DD")})
                        } else {
                            this.setState({[theFieldName]: moment()})
                        }
                    case "IdField":
                        if (data.id != undefined) {
                            this.setState({
                                id: data.id,
                                saveStatus: theSaveStatuses[2]
                            })
                        } else {
                            this.setState({
                                id: "",
                                saveStatus: theSaveStatuses[0]
                            })

                        }
                    case "ImageField":
                        if (data[theFieldName] != undefined) {
                            this.setState({[theFieldName]: data[theFieldName]})
                            //this.setState({[theFieldName + '_image']:data[theFieldName].image})
                        } else {
                            this.setState({[theFieldName]: theCurrentField.fieldDefault})
                            //this.setState({[theFieldName + '_image']:data[theFieldName].image})

                        }


                    default:
                        if (data[theFieldName] != undefined) {
                            this.setState({[theFieldName]: data[theFieldName]})
                        }

                }

            }

        }
    }

    getServerErrors(fieldName) {
        if (this.state.serverErrors == undefined) {
            return ""
        } else {
            return this.state.serverErrors[fieldName]
        }
    }



    handleFinishedUpload(value) {
        var fullUrl = value.signedUrl;
        var urlForDatabase = fullUrl.split("?")[0];
        urlForDatabase = urlForDatabase.replace(s3BaseUrl, "");
        this.setState({image: urlForDatabase});
    }

    handleImageChange = (callbackData) => {
        this.setState({
            image: callbackData.image,
            saveStatus: this.props.form.saveStatuses[1],
            croppableImage: callbackData
        })
    }


    closeModal() {
        this.setState({modalIsOpen: false}, () => this.resetForm());

    }

    handleCancelClicked() {
        this.closeModal()
    }



    handleFormSubmit = (theFormData) => {

        if ((theFormData.id != "" ) && (theFormData.id != undefined )) {
            var theUrl = this.props.form.submissionUrl + theFormData.id + "/"

            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'PATCH',
                data: theFormData,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    store.dispatch(updateDataItem(this.props.formName, this.props.form.reduxKey, this.props.form.reduxModelKey, data));
                    this.closeModal();


                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                        saveStatus: this.props.form.saveStatuses[0]
                    })

                }.bind(this)
            });
        }
        else {
            theUrl = this.props.form.submissionUrl

            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'POST',
                data: theFormData,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    store.dispatch(addDataItem(this.props.formName, this.props.form.reduxKey, this.props.form.reduxModelKey, data));
                    this.closeModal();


                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                        saveStatus: this.props.form.saveStatuses[0]
                    })

                }.bind(this)
            });
        }


    }

    handleDeleteClicked() {
          if (this.state.id != undefined) {
            var theUrl = this.props.form.submissionUrl + this.state.id + "/"

            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'DELETE',
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    store.dispatch(deleteDataItem(this.props.form.reduxKey, this.state.data[this.props.form.reduxModelKey]));
                    this.closeModal();


                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                        saveStatus: this.props.form.saveStatuses[0]
                    })

                }.bind(this)
            });
        }

    }

    handlePrepareSubmit() {
        this.setState({saveStatus: this.props.form.saveStatuses[2]})

        if ((this.props.storeRoot.user)) {
            var theFieldOrder = this.props.form.order
            var theFields = this.props.form.formFields
            var theData = {}

            for (var i = 0; i < theFieldOrder.length; i++) {

                var theFieldName = theFieldOrder[i]
                var theCurrentField = theFields[theFieldName]
                switch (theCurrentField.fieldType) {
                    case "DateField":
                        theData[theFieldName] = moment(this.state[theFieldName]).format("YYYY-MM-DD")

                    case "ImageField":
                        theData[theFieldName] = this.state[theFieldName].id

                    default:
                        theData[theFieldName] = this.state[theFieldName]


                }
            }
            if (this.props.form.overrideSaveFunction == false) {
                this.handleFormSubmit(theData)
            } else {
                this.props.overriddenSaveFunction(this.state)
            }

        } else {
            this.setState({
                    signInOrSignUpModalFormIsOpen: true,
                }
            )

        }


    }



    resetForm = () => {
        var theFieldOrder = this.props.order
        var theFields = this.props.formFields
        var theData

        for (var key in theFields) {

            var theCurrentField = theFields[key]
            this.setState({[theFieldName]: theCurrentField["default"]})


        }
        store.dispatch(setModalFormData(this.props.form.formName, this.state))
    }

    getField = (fieldProperties) => {
        switch(fieldProperties.fieldType) {
            case "DateField":
                var theField = this.getDateField(fieldProperties)
                break;
            case "TextField":
                var theField = this.getTextField(fieldProperties)
                break;
            case "RichTextField":
                var theField = this.getRichTextField(fieldProperties)
                break;
            case "DropdownField":
                var theField = this.getDropdownField(fieldProperties)
                break;
            case "MultiSelectField":
                var theField = this.getMultiSelectField(fieldProperties)
                break;
            case "ImageField":
                var theField = this.getImageField(fieldProperties)
                break;
            case "CheckboxField":
                var theField = this.getCheckboxField(fieldProperties)
                break;

            default:
                return null
                break;
        }
        return theField
    }

      handleChange = (name, date) => {
    var change = {};
    change[name] = date;
     this.setState(change);
  };





    getDateField = (fieldProperties) => {
        return (
            <div className="ui row">
            <div className={this.state.smallColumnWidth}>
                  <div className="field">
                      <label className="tooltip" htmlFor="id_startDate">Start Date:<i
                          className="info circle icon"></i>
                          <span className="tooltiptext">A start date for your program makes scheduling its steps easier. Your users can choose whatever start date they would like.</span>
                      </label>

                      <DatePicker name={fieldProperties.fieldName} selected={this.state[fieldProperties.fieldName]}
                                  onChange={this.handleChange.bind(this, fieldProperties.fieldName)}/>
                  </div>
              </div>
          </div>
        )


    }



    getTextField = (fieldProperties) => {
        return (
            <div className="ui field row">
                              <div className={this.state.wideColumnWidth}>

                                  <ValidatedInput
                                      type="text"
                                      name={fieldProperties.fieldName}
                                      label={fieldProperties.fieldLabel}
                                      id={'id_' + fieldProperties.fieldName}
                                      placeholder={fieldProperties.fieldPlaceholder}
                                      value={this.state[fieldProperties.fieldName]}
                                      initialValue={this.state[fieldProperties.fieldName]}
                                      validators={fieldProperties.fieldValidation}
                                      onChange={this.validate}
                                      stateCallback={this.handleChange.bind(this, fieldProperties.fieldName)}
                                      serverErrors={this.getServerErrors(fieldProperties.fieldName)}

                                  />
 </div>
                              </div>
        )


    }

    getRichTextField = (fieldProperties) => {

            return (<div className="ui row">
                <div className={this.state.wideColumnWidth}>
                    <div className="field fluid">
                        <label htmlFor={'id_' + fieldProperties.fieldName}>{fieldProperties.fieldLabel}</label>
                        <TinyMCEInput name={fieldProperties.fieldName}
                                      value={this.state[fieldProperties.fieldName]}
                                      tinymceConfig={TINYMCE_CONFIG}
                                      onChange={this.handleChange.bind(this, fieldProperties.fieldName)}
                        />


                    </div>
                </div>
                <div className="six wide column">&nbsp;</div>

            </div>)


    }

    getDropdownField = (fieldProperties) => {

        return (
             <div className="ui row">
                              <div className={this.state.smallColumnWidth}>
                                  <KSSelect value={this.state[fieldProperties.fieldName]}
                                            valueChange={this.handleChange.bind(this, fieldProperties.fieldName)}
                                            label={fieldProperties.fieldLabel}
                                            isClearable={false}
                                            name={fieldProperties.fieldName}
                                            options={fieldProperties.fieldOptions}
                                            />
                                  </div>
                              </div>
        )


    }

    getMultiSelectField = (fieldProperties) => {

            return (
                <div className="ui row">
                    <div className={this.state.mediumColumnWidth}>
                        <Select value={this.state[fieldProperties.fieldName]}
                                onChange={this.handleChange.bind(this, fieldProperties.fieldName)}
                                label={fieldProperties.fieldLabel}
                                clearable={false}
                                name={fieldProperties.fieldName}
                                options={this.props[fieldProperties.fieldOptions]}

                        />
                    </div>
                </div>
            )


    }

    getImageField = (theFieldProperties) =>{
        var theImage = theFieldProperties.fieldDefault.image
        return (
             <div className="ui row">

<div className={this.state.wideColumnWidth}>

<NewImageUploader imageReturned={this.handleImageChange}
                  defaultImage={theImage}
                  forMobile={this.state.forMobile}
                  aspectRatio={this.state[theFieldProperties.fieldAspectRatio]}
                  label={theFieldProperties.fieldLabel}
                  croppableImage={this.state[theFieldProperties.fieldName]} /></div></div>
        )

    }



    getCheckboxField = (fieldProperties) => {


    }



    getForm = () => {
        if (this.state.id) {
            var buttonText = "Save"

        } else {
            var buttonText = "Create"
        }



        var theFieldsOrder = this.props.form.order
        var theFields = this.props.form.formFields


        var theFieldsHtml = theFieldsOrder.map((fieldName) => {
            var currentField = theFields[fieldName]
            var theField = this.getField(currentField)
            return (theField)
        })

        var theButtons = this.getButtons()


        return (
            <div className="ui page container form">
                <div className="ui row">&nbsp;</div>
                <Header
                    headerLabel={ this.props.form.formLabel}/>
                <div className="ui three column grid">

                    {theFieldsHtml}
                </div>
                {theButtons}


            </div>


        )
    }

    getButtons() {



            return (
                <div className="ui three column stackable grid">



                    {this.props.form.includeDeleteButton == true ? <div className="column"><div className="ui large fluid button" onClick={this.handleCancelClicked}>Cancel</div></div> :<div className="column">&nbsp;</div>}
                    { this.props.form.includeDeleteButton == true ? < div className="column"><div className="ui large fluid button" onClick={this.handleDeleteClicked}>Delete</div></div> : <div className="column"><div className="ui large fluid button" onClick={this.handleCancelClicked}>Cancel</div></div>}

                     <div className="column">
                     <StandardInteractiveButton color="purple" initial={this.state.saveStatuses[0]} processing={this.state.saveStatuses[1]} completed={this.state.saveStatuses[2]} current={this.state.saveStatus} clicked={this.handlePrepareSubmit}  />

                     </div>
                </div>

            )
        }


    render() {

        var theForm = this.getForm();



        if (this.state.forMobile) {
            var modalStyle = this.props.form.mobileModalStyle

        } else {


            var modalStyle = this.props.form.fullscreenModalStyle

        }

        return (


            <div className="ui form"><Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={modalStyle}>
                {theForm}

            </Modal>
            </div>

        )
    }


}

module.exports = {testForm, FormFactory}





