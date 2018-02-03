var React = require('react');
let ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {FormAction, ItemControlBar , ItemControlBarButton } from './base'
var Datetime = require('react-datetime');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
//var MaskedInput = require('react-maskedinput');
var classNames = require('classnames');
import validator from 'validator';
import { ValidatedInput } from './app'
import { IconLabelCombo } from './elements'

import Modal from 'react-modal'
import autobind from 'class-autobind'
import Select from 'react-select'

import { Provider, connect, dispatch } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './redux/containers2'
import  {store} from "./redux/store";

import { theServer, s3IconUrl, updateModalStyle, formats, s3ImageUrl, customStepModalStyles, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, metricFormatOptions} from './constants'
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'

import { setUpdates, setUpdateModalData, addUpdateWithoutStep, addUpdate, addStepToUpdate, removeStepFromUpdate, editUpdate, setCurrentUser, setSearchHitsVisibility, setSearchQuery, setSettings, setDailyPeriod, shouldReload, setProfile, deleteContact, setForMobile, setPlans, addContact, addPlan, removePlan, setMessageWindowVisibility, setCurrentContact, reduxLogout, addOpenThread, addMessage, closeOpenThread, reduxLogin, showSidebar, addThread, setMessageThreads, setOpenThreads, updateProgram, setCurrentThread, setPrograms, addProgram, deleteProgram, addStep, updateStep, deleteStep, setGoals, addGoal, deleteGoal, updateGoal, setContacts, setStepOccurrences } from './redux/actions'




$.ajaxSetup({
    // This traditional setting takes off the bracket on the variable name that can cause problems. This makes steps_ids[] => steps_ids
    traditional: true,
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    }
});

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

function removeItem(array, item){
    for(var i in array){
        if(array[i]==item){
            array.splice(i,1);
            break;
        }
    }
}


@connect(mapStateToProps, mapDispatchToProps)
export class UpdatesList extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: {},
            modalIsOpen: false,
            stepId: "",
        }
    }

    componentDidMount = () => {
        this.setState({stepId: this.props.stepId});
        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.updates != undefined) {
                if (this.state.data != this.props.storeRoot.updates) {
                    this.setState({
                        data: this.props.storeRoot.updates
                    })
                }
            }
        }
    };


    componentWillReceiveProps = (nextProps) => {
        if (this.state.stepId != nextProps.stepId) {
            this.setState({stepId: nextProps.stepId});

        }

        if (nextProps.storeRoot != undefined) {

            if (nextProps.storeRoot.updates != undefined) {
                if (this.state.data != nextProps.storeRoot.updates) {
                    this.setState({
                        data: nextProps.storeRoot.updates
                    })
                }
            }
        }
    }

    add = (update) => {
        store.dispatch(addUpdate(update))
    };


/*handleFormSubmit = (update, callback) => {
        console.log("handleFormSbumit in updatesList ")
        if (update.id) {
            var theUrl = "/api/updates/" + update.id + "/";
            var theType = 'PATCH';

        }
        else {
            var theUrl = "/api/updates/";
            var theType = 'POST';
        }
        $.ajax({
            url: theUrl,
            dataType: 'json',
            type: theType,
            data: update,
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                if (update.id) {
                    store.dispatch(addUpdate(data))
                }
                else {
                    store.dispatch(editUpdate(data))
                }


                //this.props.updateAdded(data);

            }.bind(this),
            error: function (xhr, status, err) {

                console.error(theUrl, status, err.toString());
                var serverErrors = xhr.responseJSON;
                this.setState({
                    serverErrors: serverErrors,
                })

            }.bind(this)
        })
    };*/


    loadObjectsFromServer = (theStepId) => {

        if (theStepId != undefined) {
            var theUrl = "/api/steps/" + theStepId + "/updates/";

            $.ajax({
                url: theUrl,
                dataType: 'json',
                cache: false,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    this.setState({
                        data: data
                    })

                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }.bind(this)
            });
        }
    };




    render = () => {
//TODO: Clean this up
        if (this.state.data) {
            var theStepId = this.state.stepId

            if (theStepId != undefined) {
                var theData = this.state.data;

                if (theData != undefined) {
                    var values = Object.keys(theData).map(function (key) {
                        return theData[key];
                    });


                    var objectNodes = values.map(function (objectData) {
                        if (objectData != undefined) {

                            var updateStepIds = objectData.steps_ids

                            if (updateStepIds != undefined) {

                                if (updateStepIds.indexOf(theStepId) >= 0) {

                                    return (
                                        <UpdateItem programId={this.props.programId} ref={`ref_update_${objectData.id}`}
                                                    key={objectData.id} updateData={objectData}
                                                    stepId={theStepId}
                                        />

                                    )
                                }
                        }
                    }}.bind(this));
                }

            } else {
                var theData = this.state.data.tempStep
                if (theData != undefined) {
                    var values = Object.keys(theData).map(function (key) {
                        return theData[key];
                    });


                    var objectNodes = values.map(function (objectData) {
                        if (objectData != undefined) {


                                    return (
                                        <UpdateItem programId={this.props.programId} ref={`ref_update_${objectData.id}`}
                                                    key={objectData.id} updateData={objectData}
                                                    stepId={theStepId}

                                                    />

                                    )

                                }


                    }.bind(this));
                }
            }


        }


        return (
            <div className="ui grid">
                <div className="ui row">
                    <div className="ui header eight wide column">Updates</div>
                    <div className="four wide column">&nbsp;</div>
                    <div className="four wide column">
                        <UpdateAddAndEditItemForm programId={this.props.programId}
                                                  programUpdates={this.state.programUpdates} edit="true"
                                                  currentView="UpdateBasic" stepId={this.state.stepId}

                                                  />

                    </div>
                </div>

                {objectNodes}


            </div>

        )
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class UpdateModalForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            id: "",
            currentView: "",
            editable: false,
            serverErrors: "",
            data: "",
            modalIsOpen: false,
            name: "",
            units: "",
            metricLabel: "",
            measuringWhat: "",
            format: "",
            updateData: "",
            programUpdates: [],
            existingUpdate:"",
            steps_ids:[],
            stepId:"",
                        nonDefaultProgramUpdates: [],

            updateModalData:{}


        }
    }

    componentDidMount() {
        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.updateModalData != undefined) {

                this.setState({
                    updateModalData: this.props.storeRoot.updateModalData,
                    existingUpdate:this.props.storeRoot.updateModalData.id,

                    name: this.props.storeRoot.updateModalData.name,
                    units: this.props.storeRoot.updateModalData.units,
                    metricLabel: this.props.storeRoot.updateModalData.metricLabel,
                    measuringWhat: this.props.storeRoot.updateModalData.measuringWhat,
                    format: this.props.storeRoot.updateModalData.format,
                    steps_ids: this.props.storeRoot.updateModalData.steps_ids,
                    stepId: this.props.storeRoot.updateModalData.stepId,
                    modalIsOpen: this.props.storeRoot.updateModalData.modalIsOpen,


                })
            }
             if (this.props.storeRoot.programs != undefined) {
                 if (this.props.storeRoot.programs.updates != undefined) {


                     var theProgramUpdates = []
                     theProgramUpdates = this.props.storeRoot.programs[this.props.programId].updates.slice()

                     theProgramUpdates.unshift({id: "CREATE_NEW", name: "Create New Update", default: false})

                     this.setState({
                         programUpdates: theProgramUpdates
                     }, () => {
                         this.createNonDefaultProgramUpdates()
                     })
                 }
             }


        }
    }

    createNonDefaultProgramUpdates() {
        var programUpdates = this.state.programUpdates
        var nonDefaultProgramUpdates = []
        programUpdates.map((theUpdate) =>{
            if (!theUpdate.default) {
                nonDefaultProgramUpdates.push(theUpdate)
            }


        })
        this.setState({nonDefaultProgramUpdates: nonDefaultProgramUpdates})
    }



    componentWillReceiveProps(nextProps) {
        if (nextProps.storeRoot != undefined) {
                                if (nextProps.storeRoot.updateModalData != undefined) {

            if (this.state.updateModalData != nextProps.storeRoot.updateModalData) {
                this.setState({
                    updateModalData: nextProps.storeRoot.updateModalData,
                    existingUpdate:nextProps.storeRoot.updateModalData.id,
                    name: nextProps.storeRoot.updateModalData.name,
                    units: nextProps.storeRoot.updateModalData.units,
                    metricLabel: nextProps.storeRoot.updateModalData.metricLabel,
                    measuringWhat: nextProps.storeRoot.updateModalData.measuringWhat,
                    format: nextProps.storeRoot.updateModalData.format,
                    steps_ids: nextProps.storeRoot.updateModalData.steps_ids,
                    stepId: nextProps.storeRoot.updateModalData.stepId,
                    modalIsOpen: nextProps.storeRoot.updateModalData.modalIsOpen,



                })
            }
                                }
                                if (this.props.storeRoot.programs != undefined) {
                                    if (this.props.storeRoot.programs.updates != undefined) {
                                        var theProgramUpdates = []
                                        theProgramUpdates = nextProps.storeRoot.programs[this.props.programId].updates.slice()
                                        theProgramUpdates.unshift({
                                            id: "CREATE_NEW",
                                            name: "Create New Update",
                                            default: false
                                        })

                                        this.setState({
                                            programUpdates: theProgramUpdates
                                        }, () => {
                                            this.createNonDefaultProgramUpdates()
                                        })
                                    }
                                }
        }



    }

    openModal() {
        this.setState({
            modalIsOpen: true
        });

        if (this.state.data) {
            this.setState({
                modalIsOpen: true,

                existingUpdate: this.state.data.id,
                id: this.state.data.id,
                name: this.state.data.name,
                units: this.state.data.units,
                format: this.state.data.format,
                metricLabel: this.state.data.metricLabel,
                measuringWhat: this.state.data.measuringWhat,
                steps_ids: this.state.data.steps_ids,

            })
        }

    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        //this.refs.subtitle.style.color = '#f00';
    }

    closeModal() {
        //TODO: Clean this up
        if (this.props.edit == "true") {
            this.setState({modalIsOpen: false});
            this.setState({
                existingUpdate:"",

                name: "",
                format: "",
                modalIsOpen: false,
                units: "",
                metricLabel: "",
                measuringWhat: "",
                steps_ids:[],
            }, () => {store.dispatch(setUpdateModalData(this.state))});
        }
        else {
            this.setState({
                existingUpdate:"",
                name: "",
                format: "",
                modalIsOpen: false,
                units: "",
                metricLabel: "",
                measuringWhat: "",
                                steps_ids:[],

            }, () => {store.dispatch(setUpdateModalData(this.state))});
        }


    }


    handleNameChange(value) {
        this.setState({name: value});

    }

    handleMeasuringWhatChange(value) {
        this.setState({measuringWhat: value});
    }

    handleMetricLabelChange(value) {

        this.setState({metricLabel: value});
    }

    handleUnitsChange(value) {

        this.setState({units: value});
    }

    handleFormatChange(option) {

        this.setState({format: option.value});
    }

    handleExistingUpdateChange(option) {

        this.setState({existingUpdate: option.value});
    }

    handleSubmit(e) {
        var name = this.state.name;
        var measuringWhat = this.state.measuringWhat;
        var metricLabel = this.state.metricLabel;
        var units = this.state.units;
        var format = this.state.format;
        var program = this.props.programId;

        //If the update is being edited
        if (this.state.data != undefined) {
            var steps_ids = []
            steps_ids = this.state.updateModalData.steps_ids.slice()


            if(steps_ids.indexOf(this.state.stepId) < 0) {
                steps_ids.push(this.state.stepId)

            }


        }
        //If this is a new update
        else {
            // If this is for an existing step
            if (this.state.stepId != "") {
                var steps_ids = this.state.stepId
            }

        }
        var existingUpdate = this.state.existingUpdate


////FIGURE OUT HOW TO EDIT AN UPDATE WITHOUT THE OTHER UPDATES NOT DISAPPEARING

        // If this is an entirely new update that's been created from scratch
        if (this.state.existingUpdate == "CREATE_NEW") {
            this.submitToServer({
                    name: name,
                    measuringWhat: measuringWhat,
                    metricLabel: metricLabel,
                    units: units,
                    format: format,
                    steps_ids: steps_ids,
                    program: program

                },
                this.finishSubmit());
        }
        // If this is an existing update that's being revised for all steps
        // TODO: make sure there's a dialog that pops up that lets everyone know that this is going to change all of them
        else if (this.state.id != "") {
            this.submitToServer({
                id: this.state.id,
                name: name,
                measuringWhat: measuringWhat,
                metricLabel: metricLabel,
                units: units,
                format: format,
                steps_ids: steps_ids,
                program: program


            }, this.finishSubmit());
        }
        // If this is an existing update that's just being added to a specific step
        else {
            this.submitToServer({
                id: existingUpdate,
                steps_ids: steps_ids,
                program: program


            }, this.finishSubmit());
        }


    }

     submitToServer = (update, callback) => {
             if (update.id) {
                 var theUrl = "/api/updates/" + update.id + "/";
                 var theType = 'PATCH';

             }
             else {
                 var theUrl = "/api/updates/";
                 var theType = 'POST';
             }
             $.ajax({
                 url: theUrl,
                 dataType: 'json',
                 type: theType,
                 data: update,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     if (this.state.stepId == undefined) {
                         store.dispatch(addUpdateWithoutStep(data))

                     }
                     else if (update.id) {
                         store.dispatch(editUpdate(data.id, data))
                     }
                     else {
                         store.dispatch(addUpdate(data))
                     }


                     //this.props.updateAdded(data);

                 }.bind(this),
                 error: function (xhr, status, err) {

                     console.error(theUrl, status, err.toString());
                     var serverErrors = xhr.responseJSON;
                     this.setState({
                         serverErrors: serverErrors,
                     })

                 }.bind(this)
             })
         }

    finishSubmit = () => {
        this.closeModal();
        //this.props.reloadItem()
    };

    render() {
         if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if ((this.props.isListNode) || (forMobile)) {
             var updateModal = customStepModalStyles

           } else {


                         var updateModal = updateModalStyle

        }
        return(




    <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={updateModal}>

                    <div className="ui grid">
                        <div className="header sixteen wide column"><h2>Update</h2></div>

                            {this.state.id != "" ? <div></div>:
                                                        <div className="ui sixteen wide column form">

                                <div className="ui row">
                                    <div className="sixteen wide column">
                                        <div className="field">
                                            <label htmlFor="format">Choose an Update:</label>
                                            <Select value={this.state.existingUpdate} valueKey="id" labelKey="name"
                                                    onChange={this.handleExistingUpdateChange} name="existingUpdate"
                                                    options={ this.state.nonDefaultProgramUpdates} clearable={false}/>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        }</div>
                    {this.state.existingUpdate == "CREATE_NEW" || this.state.id != "" ?
                    <div ref="ref_create_update" className="ui grid">
                                                <div className="ui sixteen wide column form">

                                <div className="ui row">
                                    <div className="sixteen wide column">
                                        <ValidatedInput
                                            type="text"
                                            name="name"
                                            label="Name of Update"
                                            id="id_name"
                                            placeholder="Distance x Date"
                                            value={this.state.name || ''}
                                            initialValue={this.state.name}
                                            validators='"!isEmpty(str)"'
                                            onChange={this.validate}
                                            stateCallback={this.handleNameChange}
                                        />

                                    </div>
                                </div>
                                                                                                        <div className="ui row">&nbsp;</div>

                                <div className="ui row">
                                    <div className="sixteen wide column">
                                        <ValidatedInput
                                            type="text"
                                            name="measuringWhat"
                                            label="What are you measuring?"
                                            id="id_measuringWhat"
                                            placeholder="distance, weight, time, etc"
                                            value={this.state.measuringWhat || ''}
                                            initialValue={this.state.measuringWhat}
                                            validators='"!isEmpty(str)"'
                                            onChange={this.validate}
                                            stateCallback={this.handleMeasuringWhatChange}
                                        />
                                    </div>
                                </div>
                                 <div className="ui row">&nbsp;</div>

                                                    <div className="ui row">
                                    <div className="sixteen wide column">
                                        <ValidatedInput
                                            type="text"
                                            name="units"
                                            placeholder="miles, pounds, hours, etc"
                                            label="What units are you measuring?"
                                            id="id_metricLabel"
                                            value={this.state.units || ''}
                                            initialValue={this.state.units}
                                            validators='"!isEmpty(str)"'
                                            onChange={this.validate}
                                            stateCallback={this.handleUnitsChange}
                                        />

                                    </div>
                                </div>

                                <div className="ui row">&nbsp;</div>

                                <div className="ui row">
                                    <div className="sixteen wide column">
                                        <div className="field">
                                            <label htmlFor="format">What type of input?</label>
                                            <Select value={this.state.format} onChange={this.handleFormatChange}
                                                    name="format" options={metricFormatOptions} clearable={false}/>


                                        </div>
                                    </div>
                                </div>
                                <div className="ui row">&nbsp;</div>

                                <div className="ui row">
                                    <div className="sixteen wide column">
                                        <ValidatedInput
                                            type="text"
                                            name="metricLabel"
                                            label="How do you want to label this measurement?"
                                            placeholder="How far did you run today?, How many pounds did you lift?, How long did you practice today?, etc."
                                            id="id_metricLabel"
                                            value={this.state.metricLabel}
                                            initialValue={this.state.metricLabel}
                                            validators='"!isEmpty(str)"'
                                            onChange={this.validate}
                                            stateCallback={this.handleMetricLabelChange}
                                        />
                                    </div>
                                </div>
                                <div className="ui row">&nbsp;</div>
                                                    </div>
                                                </div>:null}




                                <div className="ui two column stackable grid">
                                    <div className="ui row">
                                        <div className="ui column">
                                            <div className="ui fluid button" onClick={this.closeModal}>Cancel</div>
                                        </div>
                                        <div className="ui  column">
                                            <div className="ui primary fluid button" onClick={this.handleSubmit}>Save
                                            </div>
                                        </div>
                                        <div className="ui row">&nbsp;</div>
                                    </div>
                                </div>



                </Modal>
        )}


}

@connect(mapStateToProps, mapDispatchToProps)
export class UpdateAddAndEditItemForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            id: "",
            currentView: "",
            editable: false,
            serverErrors: "",
            data: "",
            modalIsOpen: false,
            name: "",
            units: "",
            metricLabel: "",
            measuringWhat: "",
            format: "",
            updateData: "",
            programUpdates: [],
            existingUpdate:"",
            steps_ids:[],
            stepId:"",


        }
    }

    componentDidMount() {


        this.setState({
            data: this.props.updateData,
        });

        this.setState({stepId: this.props.stepId})
        if (this.props.updateData != undefined) {
            this.setState({
                id: this.props.updateData.id,
                name: this.props.updateData.name,
                units: this.props.updateData.units,
                format: this.props.updateData.format,
                metricLabel: this.props.updateData.metricLabel,
                measuringWhat: this.props.updateData.measuringWhat,
                steps_ids: this.props.updateData.steps_ids,
                currentView: this.props.currentView,

            })


        }

    }


    componentWillReceiveProps = (nextProps) => {
        if (this.state.data != nextProps.updateData) {
            this.setState({data: nextProps.updateData});
            if (nextProps.updateData != undefined) {
                this.setState({
                    id: nextProps.updateData.id,
                    name: nextProps.updateData.name,

                    units: nextProps.updateData.units,
                    format: nextProps.updateData.format,
                    metricLabel: nextProps.updateData.metricLabel,
                    measuringWhat: nextProps.updateData.measuringWhat,
                    steps_ids: nextProps.updateData.steps_ids,

                })
            }
        }



        if (this.state.currentView != nextProps.currentView) {
            this.setState({currentView: nextProps.currentView})
        }
        if (this.state.stepId != nextProps.stepId) {
            this.setState({stepId: nextProps.stepId})
        }


    };


openModal() {
        this.setState({
            modalIsOpen: true
        }, () => { store.dispatch(setUpdateModalData(this.state))});

        if (this.state.data) {
            this.setState({
                modalIsOpen: true,

                existingUpdate: this.state.data.id,
                id: this.state.data.id,
                name: this.state.data.name,
                units: this.state.data.units,
                format: this.state.data.format,
                metricLabel: this.state.data.metricLabel,
                measuringWhat: this.state.data.measuringWhat,
                steps_ids: this.state.data.steps_ids,

            }, () => { store.dispatch(setUpdateModalData(this.state))})
        }

    }





    deleteUpdate() {

        var theUrl = "/api/updates/" + this.state.data.id + "/";

        $.ajax({
            url: theUrl,
            dataType: 'json',
            type: 'DELETE',
            success: () => {
                //$(this.refs['ref_update_form_' + this.state.data.id]).slideUp();

                //this.props.reloadItem()

            },
            error: function (xhr, status, err) {
                console.error(theUrl, status, err.toString());
            }
        });


    }

    removeUpdateFromStep() {

        var theUrl = "/api/updates/" + this.state.data.id + "/";
        var steps_ids
        steps_ids = this.state.data.steps_ids.slice()
        var program = this.props.updateData.program
        removeItem(steps_ids, this.state.stepId)
        if (steps_ids.length == 0) {
            steps_ids = []
        }

        var updatedSteps = {program:program, steps_ids: steps_ids}
        $.ajax({
            url: theUrl,
            dataType: 'json',
            type: 'PATCH',
            data: updatedSteps,
            headers: {
                'Authorization': 'Token ' + localStorage.token
                },

            success: (data) => {
                store.dispatch(removeStepFromUpdate(this.state.data.id, this.state.stepId))
                //$(this.refs['ref_update_form_' + this.state.data.id]).slideUp();

                //this.props.reloadItem()

            },
            error: function (xhr, status, err) {
                console.error(theUrl, status, err.toString());
            }
        });


    }

    handleClick(theClick) {
        switch (theClick) {
            case ("Edit"):
                this.openModal();

                break;
            case ("Delete"):
                this.removeUpdateFromStep();
                break;
            case ("Remove from Step"):
                this.removeUpdateFromStep();
                break;
        }

    }


    getAdditionalUI() {
        if (this.state.data) {
            return (
                <div>

                    <ItemControlBar myRef="ref_itemControlBar"
                                    label="Update" click={this.handleClick}
                                    currentView="UpdateBasic"
                                    editable={true}
                                    showCloseButton={false}/>


                    <div className="ui noTopMargin segment">
                         <div className="field">
                            <label>Name:</label>
                            <div>{this.state.data.name}</div>
                        </div>

                        <div className="field">
                            <label>Label:</label>
                            <div>{this.state.data.metricLabel}</div>
                        </div>
                        <div className="field">

                            <label>Metric:</label>

                            <div>{this.state.data.measuringWhat}{this.state.data.units != "" ? " in " + this.state.data.units : null} using {this.state.data.format}</div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className="ui orange fluid button plus icon" onClick={this.openModal}>+</div>

            )
        }
    }

    render() {
        var additionalUI = this.getAdditionalUI()

        if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if ((this.props.isListNode) || (forMobile)) {
             var updateModal = customStepModalStyles

           } else {


                         var updateModal = updateModalStyle

        }

        return (
            <div>
                {additionalUI}


                </div>

        )
    }
}



var MetricSelectButton = React.createClass({
    loadObjectsFromServer: function () {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({data: data.results});

          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },

    componentDidMount: function() {
        var self = this;
    },

    getInitialState: function() {
        return {data: []};

    },

  render: function () {
      var htmlToRender = "<div className='field'><label htmlFor='" + this.props.id + "'>" + this.props.label + "</label>";
      htmlToRender += "<select id='" + this.props.id + "' name='" + this.props.initialValue + "' >" ;

      for(var i=0; i < this.props.numberOfItems ; i++) {
          if (this.props.initialValue == i){
              htmlToRender += "<option selected='selected' value='";
          }
          else {
              htmlToRender += "<option value='";
          }
          htmlToRender += "<option value='";
          htmlToRender += String(i + 1);
          htmlToRender += "'>";
          htmlToRender += "Week ";
          htmlToRender += String(i+1);
          htmlToRender += "</option>";

      }
      htmlToRender += "</select>";
    htmlToRender += "</div>";
    return (

        <div dangerouslySetInnerHTML={{__html: htmlToRender}} />
      );

  }
});

export class UpdateItemMenu extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
     }

     handleClick = (callbackData) => {
         this.props.click(callbackData)
     };

     getProfileMenu () {

     }

     render () {
         var myStyle = { display: "block"};
         return(

                  <div className="ui simple  dropdown item" >
                      <div className="ui extramini image controlButtonMargin">
                      <img src={`${s3IconUrl}menuDark.svg`} /></div>
                      <div className="menu" style={{right: '0',left: 'auto'}}>

                          <div className="ui item">
                              <IconLabelCombo size="extramini" orientation="left" text="Remove from Step" icon="trash" background="Light" click={this.handleClick} />
                              </div>

                      </div>
                  </div>


         )
     }

}



export class UpdateItem extends React.Component{
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            id: "",
            name:"",
            measuringWhat: "",
            units: "",
            format: "",
            metricLabel: "",
            stepId: "",
            updateData:{}
        }
    }

    componentDidMount () {
            this.setState({updateData: this.props.updateData});

        this.setState({
            id: this.props.updateData.id,
            name: this.props.updateData.name,
            measuringWhat:this.props.updateData.measuringWhat,
            units:this.props.updateData.units,
            format: this.props.updateData.format,
            metricLabel: this.props.updateData.metricLabel,
            stepId: this.props.stepId,
        })

    }




    handleReloadItem() {
        this.props.reloadItem()
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.state.updateData != nextProps.updateData ) {
            this.setState({updateData: nextProps.updateData})
        }

        if (this.state.stepId != nextProps.stepId) {
            this.setState({
                stepId:nextProps.stepId
            })
        }

    };



    render () {
        return (
            <div ref={`ref_update_${this.state.stepId}`} className="ui tinyPadding row">
                    <div className="sixteen wide column">

                        {/*<div className="ui top attached orange large button " >*/}


                        <UpdateAddAndEditItemForm edit="true" currentView="UpdateBasic" updateData={this.state.updateData} stepId={this.state.stepId} />

                        {/*</div>*/}






                    </div>
                 </div>


        )
    }
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

module.exports = { UpdatesList, UpdateItemMenu, setUpdateModalData, UpdateModalForm};