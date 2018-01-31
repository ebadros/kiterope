var React = require('react');
let ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {ImageUploader, PlanForm2, VisualizationViewEditDeleteItem, ViewEditDeleteItem, StepViewEditDeleteItem, PlanViewEditDeleteItem, FormAction, Sidebar, Header, FormHeaderWithActionButton, DetailPage} from './base';
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
import {StandardSetOfComponents } from './accounts'

import { theServer, s3IconUrl, updateModalStyle, formats, s3ImageUrl, customStepModalStyles, customModalStyles, visualizationChoices, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, metricFormatOptions} from './constants'
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'

import { setUpdates, addVisualization, deleteVisualization, editVisualization, setVisualizationModalData, setUpdateModalData, addUpdateWithoutStep, addUpdate, addStepToUpdate, removeStepFromUpdate, editUpdate, setCurrentUser, setSearchHitsVisibility, setSearchQuery, setSettings, setDailyPeriod, shouldReload, setProfile, deleteContact, setForMobile, setPlans, addContact, addPlan, removePlan, setMessageWindowVisibility, setCurrentContact, reduxLogout, addOpenThread, addMessage, closeOpenThread, reduxLogin, showSidebar, addThread, setMessageThreads, setOpenThreads, updateProgram, setCurrentThread, setPrograms, addProgram, deleteProgram, addStep, updateStep, deleteStep, setGoals, addGoal, deleteGoal, updateGoal, setContacts, setStepOccurrences } from './redux/actions'

function findLabel (theValue, theArray) {
        for (var i=0; theArray.length; i++ ) {
            if (theArray[i].value == theValue) {
                return theArray[i].label
            }
        }
    }


import {LineGraph, Spreadsheet, VisualizationChartForm} from './charts'

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
export class VisualizationsPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: {},
            programs:[],
            //updateOccurrences:{}

        }
    }

    componentDidMount() {
        if (this.props.storeRoot != undefined ) {
    this.setState({
        updateOccurrences: this.props.storeRoot.updateOccurrences,
        programs:this.props.storeRoot.programs,
        visualizations: this.props.storeRoot.visualizations,
    })
        }

    }

    componentWillReceiveProps(nextProps) {
        if (this.props.storeRoot != undefined ) {
            if (this.state.updateOccurrences != nextProps.storeRoot.updateOccurrences) {
                this.setState({updateOccurrences: nextProps.storeRoot.updateOccurrences})
            }
            if (this.state.programs != nextProps.storeRoot.programs) {
                this.setState({programs: nextProps.storeRoot.programs})
            }

            if (this.state.visualizations != nextProps.storeRoot.visualizations) {
                this.setState({visualizations: nextProps.storeRoot.visualizations})
            }
        }
    }



    getVisualizations() {
                if (this.state.visualizations != undefined) {


                    var objectNodes = this.state.visualizations.map( (objectData) => {
                        if (objectData.visualizations != undefined) {
                                                    console.log("objectData " + objectData.title)


                            return (<div key={`key_programVisualization_${objectData.id}`} >

                                <VisualizationsList visualizations={objectData.visualizations}/>
                                </div>

                            )

                        }
                    });
                }
                return objectNodes

    }

    handleActionClick() {
        this.setState({
            modalIsOpen: true},() => { store.dispatch(setVisualizationModalData(this.state))});

    }



    render() {
        //var allVisualizations = this.getVisualizations()
        return(
            <div>
                                <StandardSetOfComponents />
                        <div className="fullPageDiv">
            <div className="ui page container footerAtBottom">


            <div className="spacer">&nbsp;</div>
            <div className="ui large breadcrumb">
                <Link to={`/`}><div className="section">Home</div></Link>

                  <i className="right chevron icon divider"></i>
                  <Link to={`/visualizations`}><div className="active section">My Visualizations</div></Link>
            </div>
            <div>&nbsp;</div>
                <FormHeaderWithActionButton actionClick={this.handleActionClick} headerLabel="Visualizations" color="green" buttonLabel="Add" />

                                <VisualizationsList visualizations={this.state.visualizations}/>

                {/* <Spreadsheet />*/}

            </div>
                </div>
                                        <VisualizationModalForm programId={this.props.params.program_id} />

                </div>
        )
    }
}

export class VisualizationBasicView extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:"",
        }
    }

    componentDidMount() {
        this.setState({
            data:this.props.data,
            currentView: this.props.currentView
        })

    }
    componentWillReceiveProps (nextProps) {
        if (this.state.data != nextProps.data) {
            this.setState({
                data:nextProps.data
            });



        }
        if (this.state.currentView != nextProps.currentView) {
            this.setState({
                currentView: nextProps.currentView
            });


        }
    }

    findLabel (theValue, theArray) {
        var returnValue = "Not available";
        if (theValue) {
            for (var i = 0; i < theArray.length; i++) {
                if (theValue == theArray[i].value) {
                    returnValue =  theArray[i].label;
                    return returnValue
                }
            }
            return returnValue
        }
        else {
            return returnValue
        }
    }


    render() {
            return(
                <LineGraph  visualization={this.state.data} />

            )

        }

}


@connect(mapStateToProps, mapDispatchToProps)
export class VisualizationsList extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: {},
            visualizations:{},
            updateOccurrences:{},

        }
    }
    componentDidMount() {
        this.setState({visualizations: this.props.visualizations})
         if (this.props.storeRoot != undefined ) {
    this.setState({
        updateOccurrences: this.props.storeRoot.updateOccurrences,
    })
        }
    }

    componentWillReceiveProps (nextProps) {
        if (this.state.visualizations != nextProps.visualizations) {
                    this.setState({visualizations: nextProps.visualizations})

        }

         if (this.props.storeRoot != undefined ) {
             if (this.state.updateOccurrences != nextProps.storeRoot.updateOccurrences) {
                 this.setState({updateOccurrences: nextProps.storeRoot.updateOccurrences})
             }
         }
    }




    getIndividualVisualizations() {

        if (this.state.visualizations != undefined) {
            var theVisualizations = this.state.visualizations

            var values = Object.keys(theVisualizations).map((key) => {
                        return theVisualizations[key];
                    });

                    var objectNodes = values.map( (objectData) =>{
                        if (objectData != undefined) {
                                    return (
                                        <div key={`key_visualization_${objectData.id}`} className="column">

                <VisualizationViewEditDeleteItem  data={objectData} />
                                        </div>

                                    )

                        }
                    });
                }
                return objectNodes


    }


    render() {
        var individualVisualizations = this.getIndividualVisualizations()
            return (
                                <div className="ui three column grid">
                                    {individualVisualizations}


                </div>

            )
    }
}



@connect(mapStateToProps, mapDispatchToProps)
export class VisualizationsList2 extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: {},
            modalIsOpen: false,
            programId: "",
        }
    }

    componentDidMount = () => {
        if (this.props.programId != undefined) {
            this.setState({programId: this.props.programId});
            if (this.props.storeRoot != undefined) {
                if (this.props.storeRoot.programs != undefined) {
                    if (this.state.data != this.props.storeRoot.programs[this.props.programId].visualizations) {
                        this.setState({
                            data: this.props.storeRoot.programs[this.props.programId].visualizations
                        })
                    }
                }
            }
        }
    };


    componentWillReceiveProps = (nextProps) => {
        if (this.state.programId != nextProps.programId) {
            this.setState({programId: nextProps.programId});

        }

        if ((nextProps.storeRoot != undefined) && (nextProps.programId != undefined)){

            if (nextProps.storeRoot.programs != undefined) {
                if (this.state.data != nextProps.storeRoot.programs[nextProps.programId].visualizations) {
                    this.setState({
                        data: nextProps.storeRoot.programs[nextProps.programId].visualizations
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


    loadObjectsFromServer = (theProgramId) => {

        if (theProgramId != undefined) {
            var theUrl = "/api/programs/" + theProgramId + "/visualizations/";

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
            var theProgramId = this.state.programId

            if (theProgramId != undefined) {
                var theData = this.state.data;

                if (theData != undefined) {
                    var values = Object.keys(theData).map(function (key) {
                        return theData[key];
                    });


                    var objectNodes = values.map(function (objectData) {
                        if (objectData != undefined) {



                                if (theProgramId = objectData.program) {

                                    return (
                                        <div className="ui sixteen wide column">
                                        <VisualizationAddAndEditItemForm ref={`ref_visualization_${objectData.id}`}
                                                                         currentView="UpdateBasic"
                                                    key={`visualization_${objectData.id}`} visualizationData={objectData}
                                                    programId={theProgramId}
                                        /></div>

                                    )
                                }
                        }
                    }.bind(this));
                }

            }


        }


        return (
            <div className="ui grid">
                <div className="ui row">
                    <div className="ui header eight wide column">Visualizations</div>
                    <div className="four wide column">&nbsp;</div>
                    <div className="four wide column">
                        <VisualizationAddAndEditItemForm
                                                  programUpdates={this.state.programUpdates} edit="true"
                                                  currentView="UpdateBasic" programId={this.state.programId}

                                                  />

                    </div>
                </div>

                {objectNodes}


            </div>

        )
    }
}

export class VisualizationItemMenu extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
     }

     handleClick = (callbackData) => {
         this.props.click(callbackData)
     };



     render () {
         var myStyle = { display: "block"};
         return(

                  <div className="ui simple  dropdown item" >
                      <div className="ui extramini image controlButtonMargin">
                      <img src={`${s3IconUrl}menuDark.svg`} /></div>
                      <div className="menu" style={{right: '0',left: 'auto'}}>

                          <div className="ui item">
                              <IconLabelCombo size="extramini" orientation="left" text="Remove from Program" icon="trash" background="Light" click={this.handleClick} />
                              </div>

                      </div>
                  </div>


         )
     }

}

export class VisualizationAddAndEditItemForm extends React.Component {
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

            visualizationData: "",
            name:"",
            kind:"",
            dependentVariable:"",
            independentVariable:"",
            mediatorVariable:""


        }
    }
    componentDidMount() {
        this.setState({
            data: this.props.visualizationData,
        });

        this.setState({programId: this.props.programId})
        if (this.props.visualizationData != undefined) {
            this.setState({
                id: this.props.visualizationData.id,
                name: this.props.visualizationData.name,
                kind: this.props.visualizationData.kind,
                dependentVariable: this.props.visualizationData.dependentVariable,
                independentVariable: this.props.visualizationData.independentVariable,
                mediatorVariable: this.props.visualizationData.mediatorVariable,

                currentView: this.props.currentView,

            })


        }
    }

    loadVariableOptionsFromServer () {

    }

    componentWillReceiveProps = (nextProps) => {
        if (this.state.data != nextProps.visualizationData) {
            this.setState({data: nextProps.visualizationData});
            if (nextProps.visualizationData != undefined) {
                this.setState({
                    id: nextProps.visualizationData.id,
                name: nextProps.visualizationData.name,
                kind: nextProps.visualizationData.kind,
                dependentVariable: nextProps.visualizationData.dependentVariable,
                independentVariable: nextProps.visualizationData.independentVariable,
                mediatorVariable: nextProps.visualizationData.mediatorVariable,
                })
            }
        }


            if (this.state.currentView != nextProps.currentView) {
                this.setState({currentView: nextProps.currentView})
            }
            if (this.state.programId != nextProps.programId) {
            this.setState({programId: nextProps.programId})
        }

    };

    openModal() {
        this.setState({
            modalIsOpen: true},() => { store.dispatch(setVisualizationModalData(this.state))});

        if (this.state.data) {
            this.setState({
                modalIsOpen:true,
                id: this.state.data.id,
                name: this.state.data.name,
                kind: this.state.data.kind,
                dependentVariable: this.state.data.dependentVariable,
                independentVariable: this.state.data.independentVariable,
                mediatorVariable: this.state.data.mediatorVariable,
            }, () => { store.dispatch(setVisualizationModalData(this.state))})
        }

    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        //this.refs.subtitle.style.color = '#f00';
    }

    removeVisualizationFromProgram() {

        var theUrl = "/api/visualizations/" + this.state.data.id + "/";
        var programs_ids
        programs_ids = this.state.data.programs_ids.slice()
        removeItem(programs_ids, this.state.programId)
        if (programs_ids.length == 0) {
            programs_ids = []
        }

        var updatedPrograms = {programs_ids: programs_ids}
        $.ajax({
            url: theUrl,
            dataType: 'json',
            type: 'PATCH',
            data: updatedPrograms,
            headers: {
                'Authorization': 'Token ' + localStorage.token
                },

            success: (data) => {
                store.dispatch(removeProgramFromVisualization(this.state.data.id, this.state.programId))
                //$(this.refs['ref_update_form_' + this.state.data.id]).slideUp();

                //this.props.reloadItem()

            },
            error: function (xhr, status, err) {
                console.error(theUrl, status, err.toString());
            }
        });


    }












    handleClick (theClick) {
        switch(theClick) {
            case ("Edit"):
                this.openModal();
                break;
             case ("Remove from Program"):
                this.removeVisualizationFromProgram();
                break;
        }

    }

    getAdditionalUI() {
        if (this.state.data ) {
            return (
                <div>
                    <ItemControlBar myRef="ref_itemControlBar"
                                    label="Visualization" click={this.handleClick}
                                    currentView="UpdateBasic"
                                    editable={true}
                                    showCloseButton={false}/>


                    <div className="ui noTopMargin segment">

                        <div className="field">
                            <div><strong>Name:</strong> {this.state.name}</div>
                        </div>
                        <div className="field">


                            <div><strong>Kind:</strong> {findLabel(this.state.kind, visualizationChoices)} </div>
                        </div>

                    </div>
                </div> )
        }else {
            return (
                <div className="ui raspberry fluid button plus icon" onClick={this.openModal}>+</div>


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



}}

@connect(mapStateToProps, mapDispatchToProps)
export class VisualizationModalForm extends React.Component {
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

            visualizationData: "",
            name: "",
            kind: "",
            dependentVariable: "",
            independentVariable: "",
            mediatorVariable: "",
            programUpdates: [],
            programId: "",
            planId:"ALL",
            visualizationModalData: "",
            planOptions:[],
            programOptions:[],



        }
    }

    componentDidMount() {
                    $(this.refs['ref_mediatorVariableSelect']).hide();


        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.visualizationModalData != undefined) {
                this.setState({visualizationModalData:this.props.storeRoot.visualizationModalData})
                    this.setStateToData(this.props.storeRoot.visualizationModalData)


            }
            if (this.props.storeRoot.programs != undefined) {
                var programOptions = this.buildOptionsFromList(this.props.storeRoot.programs)

                this.setState({programOptions: programOptions})
            }
 if(this.state.updates != this.props.storeRoot.updates ) {
                if (this.props.storeRoot.updates != undefined) {
                    this.setState({updates: this.props.storeRoot.updates}, () => {this.createUniqueProgramUpdates()})

                }
            }
             if (this.props.storeRoot.plans != undefined) {
                 var planOptions = this.buildOptionsFromList(this.props.storeRoot.plans)
                 var filteredPlanOptions = this.removeDisabledPlans(planOptions)
                 filteredPlanOptions.unshift({id:'ALL', programTitle:"Use All Available Data"})


                 this.setState({planOptions: filteredPlanOptions})
             }
        }
        if (this.props.programId !=  undefined) {
            $(this.refs['ref_programSelect']).hide();
             this.setState({programId: this.props.programId})
            if (this.props.storeRoot.updates != undefined) {
                this.createUniqueProgramUpdates()
            }

        } else {
            $(this.refs['ref_programSelect']).hide();
                        $(this.refs['ref_planSelect']).show();


        }
        /*if (this.state.programId != this.props.programId) {

            this.setState({programId: this.props.programId})
            if (this.props.storeRoot.updates != undefined) {
                this.createUniqueProgramUpdates()
            }

        }

        if (this.state.planId != this.props.planId) {
            this.setState({planId: this.props.planId})
        }*/

    }

    componentWillReceiveProps(nextProps) {

        if (this.state.serverErrors != nextProps.serverErrors) {
            this.setState({serverErrors: nextProps.serverErrors})
        }

        if (nextProps.storeRoot.visualizationModalData != undefined) {
            if (this.state.visualizationModalData != nextProps.storeRoot.visualizationModalData) {
                this.setState({visualizationModalData: nextProps.storeRoot.visualizationModalData})

                this.setStateToData(nextProps.storeRoot.visualizationModalData)

            }

            if (nextProps.storeRoot.programs != undefined) {
                var programOptions = this.buildOptionsFromList(nextProps.storeRoot.programs)

                this.setState({programOptions: programOptions})
            }
            if(this.state.updates != nextProps.storeRoot.updates ) {
                if (nextProps.storeRoot.updates != undefined) {
                    this.setState({updates: nextProps.storeRoot.updates}, () => {this.createUniqueProgramUpdates()})



                }
            }

            if (nextProps.storeRoot.plans != undefined) {
                 var planOptions = this.buildOptionsFromList(nextProps.storeRoot.plans)

                 var filteredPlanOptions = this.removeDisabledPlans(planOptions)
                                 filteredPlanOptions.unshift({id:'ALL', programTitle:"Use All Available Data"})



                 this.setState({planOptions: filteredPlanOptions})
             }


        }

        if (nextProps.programId != undefined) {
            $(this.refs['ref_programSelect']).hide();
            $(this.refs['ref_planSelect']).hide();

             this.setState({programId: nextProps.programId})
            if (nextProps.storeRoot.updates != undefined) {
                this.createUniqueProgramUpdates()
            }

        } else {
            $(this.refs['ref_programSelect']).hide();
                        $(this.refs['ref_planSelect']).show();


        }
        /*}
        if (this.state.programId != nextProps.programId) {
            this.setState({programId: nextProps.programId})

            if (nextProps.storeRoot.updates != undefined) {
                this.createUniqueProgramUpdates()
            }
        }


            if (this.state.planId != nextProps.planId) {
                this.setState({planId: nextProps.planId})
            }*/


        }


    buildOptionsFromList( theList) {
        var theListAsArray = Object.keys(theList).map((key) => {
            return theList[key]
        })
        return theListAsArray

    }

    removeDisabledPlans(thePlans) {
        for(var i = thePlans.length - 1; i >= 0; i--) {
    if(thePlans[i].isSubscribed == false) {
       thePlans.splice(i, 1);
    }
}
return thePlans
    }

    createUniqueProgramUpdates() {
        var programUpdates = this.state.updates
        var uniqueProgramUpdates = []
        var uniqueProgramUpdatesTester = []
        if (programUpdates != undefined ) {
            var programUpdatesArray = Object.keys(programUpdates).map((key) => {
                return programUpdates[key]
            })

            programUpdatesArray.map((theUpdate) => {
                if (this.state.programId != undefined) {
                    if (this.state.programId == theUpdate.program) {


                        if (uniqueProgramUpdatesTester.indexOf(JSON.stringify({
                                name: theUpdate.name,
                                measuringWhat: theUpdate.measuringWhat,
                                units: theUpdate.units,
                                metricLabel: theUpdate.metricLabel,
                                format: theUpdate.format
                            })) == -1) {
                            uniqueProgramUpdates.push(theUpdate)
                            uniqueProgramUpdatesTester.push(JSON.stringify({
                                name: theUpdate.name,
                                measuringWhat: theUpdate.measuringWhat,
                                units: theUpdate.units,
                                metricLabel: theUpdate.metricLabel,
                                format: theUpdate.format
                            }))

                        }
                    }
                } else if ((this.state.planId != undefined) && (this.state.planId != 'ALL')) {
                    var theProgramId
                    if (this.props.storeRoot != undefined) {
                        if (this.props.storeRoot.plans != undefined) {
                            theProgramId = this.props.storeRoot.plans[this.state.planId].program
                            if (theProgramId == theUpdate.program) {

                                if (uniqueProgramUpdatesTester.indexOf(JSON.stringify({
                                        name: theUpdate.name,
                                        measuringWhat: theUpdate.measuringWhat,
                                        units: theUpdate.units,
                                        metricLabel: theUpdate.metricLabel,
                                        format: theUpdate.format
                                    })) == -1) {
                                    uniqueProgramUpdates.push(theUpdate)
                                    uniqueProgramUpdatesTester.push(JSON.stringify({
                                        name: theUpdate.name,
                                        measuringWhat: theUpdate.measuringWhat,
                                        units: theUpdate.units,
                                        metricLabel: theUpdate.metricLabel,
                                        format: theUpdate.format
                                    }))
                                }

                            }
                        }
                    }
                } else {
                    if (uniqueProgramUpdatesTester.indexOf(JSON.stringify({
                            name: theUpdate.name,
                            measuringWhat: theUpdate.measuringWhat,
                            units: theUpdate.units,
                            metricLabel: theUpdate.metricLabel,
                            format: theUpdate.format
                        })) == -1) {
                        uniqueProgramUpdates.push(theUpdate)
                        uniqueProgramUpdatesTester.push(JSON.stringify({
                            name: theUpdate.name,
                            measuringWhat: theUpdate.measuringWhat,
                            units: theUpdate.units,
                            metricLabel: theUpdate.metricLabel,
                            format: theUpdate.format
                        }))

                    }
                }


            })
            this.setState({uniqueProgramUpdatesTester: uniqueProgramUpdatesTester})
            this.setState({programUpdates: uniqueProgramUpdates})
        }
    }




    setStateToData (visualizationModalData) {
        this.setState({
            modalIsOpen: visualizationModalData.modalIsOpen,

        })
        if (visualizationModalData.data != undefined ) {

            var data = visualizationModalData.data

            var name = data.name;
            var kind = data.kind;
            var dependentVariable = data.dependentVariable;
            var independentVariable = data.independentVariable;
            var mediatorVariable = data.mediatorVariable;
            var programUpdates = data.programUpdates;
            var programId = data.programId;
            var planId = data.planId;



            if (data.id != undefined) {
                this.setState({
                    id: data.id,
                    saved:"Saved"
                })
            } else {
                this.setState({
                    id:"",
                    saved:"Create"
                })
            }

            this.setState({
                id: data.id,
                name: name,
                kind: kind,
                dependentVariable: dependentVariable,
                independentVariable: independentVariable,
                mediatorVariable: mediatorVariable,
                programUpdates: programUpdates,
                //programId: programId,
                //planId: planId

            }, () => {this.createUniqueProgramUpdates()});



        }
    }



    openModal() {
        this.setState({
            modalIsOpen: true
        })

        if (this.state.visualizationModalData) {
            this.setState({
                modalIsOpen: true,
                id: this.state.visualizationModalData.id,
                name: this.state.visualizationModalData.name,
                kind: this.state.visualizationModalData.kind,
                program: this.state.visualizationModalData.programId,
                plan: this.state.visualizationModalData.planId,
                dependentVariable: this.state.visualizationModalData.dependentVariable,
                independentVariable: this.state.visualizationModalData.independentVariable,
                mediatorVariable: this.state.visualizationModalData.mediatorVariable,
            })
        }

    }

    closeModal() {

        this.setState({
            modalIsOpen: false,

            name: "",
            kind: "",
            dependentVariable: "",
            independentVariable: "",
            mediatorVariable: "",
            programId: "",
            planId:""

        }, () => {
            store.dispatch(setVisualizationModalData(this.state))
        });


    }

    handleProgramChange(option) {
        this.setState({programId: option.id}, () => {this.createUniqueProgramUpdates()})
        this.setState({planId:""})
    }

    handlePlanChange(option) {
            this.setState({planId: option.id})
            this.setState({programId: undefined}, () => {
                this.createUniqueProgramUpdates()
            })


    }

    handleNameChange(value) {
        this.setState({name: value});
    }

    handleKindChange(option) {

        this.setState({kind: option.value});
    }

    handleDependentVariableChange(option) {

        this.setState({dependentVariable: option.id});
    }

    handleIndependentVariableChange(option) {

        this.setState({independentVariable: option.id});
    }

    handleMediatorVariableChange(option) {


        this.setState({mediatorVariable: option.id});
    }

    handleSubmit() {
        var name = this.state.name;
        var kind = this.state.kind;
        var dependentVariable = this.state.dependentVariable;
        var independentVariable = this.state.independentVariable;
        var mediatorVariable = this.state.mediatorVariable;
        var program = this.state.programId;
        var plan = this.state.planId
        if (plan = "ALL") {
            plan=""
        }
        var visualizationData = {
            name: name,
                kind: kind,
                dependentVariable: dependentVariable,
                independentVariable: independentVariable,
                mediatorVariable: mediatorVariable,
                program: program,
                plan:plan
        }


        if (this.state.id != "") {
            visualizationData.id = this.state.id


        }
        // If this is an existing update that's just being added to a specific step
        this.submitToServer(visualizationData);

    }

    submitToServer = (visualization) => {
             if (visualization.id) {
                 var theUrl = "/api/visualizations/" + visualization.id + "/";
                 var theType = 'PATCH';

             }
             else {
                 var theUrl = "/api/visualizations/";
                 var theType = 'POST';
             }
             $.ajax({
                 url: theUrl,
                 dataType: 'json',
                 type: theType,
                 data: visualization,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {

                     if (visualization.id) {
                         store.dispatch(editVisualization(data.id, data))
                         this.closeModal()
                     }
                     else {
                         store.dispatch(addVisualization(data))
                         this.closeModal()
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



    render() {
        if (this.props.storeRoot != undefined) {
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

            <Modal
                isOpen={this.state.modalIsOpen}
                onAfterOpen={this.afterOpenModal}
                onRequestClose={this.closeModal}
                style={customModalStyles}>

                <div className="ui grid">
                    <div className="header sixteen wide column"><h2>Visualization</h2></div>


                    <div className="ui sixteen wide column form">
                        {/*<div ref="ref_programSelect">
                        <div className="ui row">
                                <div className="sixteen wide column">
                                    <div className="field">
                                        <label htmlFor="kind">Program:</label>
                                        <Select value={this.state.programId}  valueKey="id" labelKey="title"
                                                onChange={this.handleProgramChange} name="dependentVariable"
                                                options={this.state.programOptions} clearable={false}/>


                                    </div>
                                </div>
                            </div>
                        <div className="ui row">&nbsp;</div></div>*/}
                                                <div ref="ref_planSelect">

                        <div className="ui row">
                                <div className="sixteen wide column">
                                    <div className="field">
                                        <label htmlFor="kind">Use Only Data from Specific Plan:</label>
                                        <Select value={this.state.planId} valueKey="id" labelKey="programTitle"
                                                onChange={this.handlePlanChange}
                                                options={this.state.planOptions} clearable={false}/>


                                    </div>
                                </div>
                            </div>
                        <div className="ui row">&nbsp;</div></div>
                            <div className="ui row">
                                <div className="sixteen wide column">
                                    <ValidatedInput
                                        type="text"
                                        name="name"
                                        label="Name:"
                                        id="id_name"
                                        placeholder="Distance x Date Line Graph"
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
                                    <div className="field">
                                        <label htmlFor="kind">Kind of Visualization:</label>
                                        <Select value={this.state.kind} onChange={this.handleKindChange} name="kind"
                                                options={visualizationChoices} clearable={false}/>


                                    </div>
                                </div>
                            </div>

                            <div className="ui row">&nbsp;</div>
                            <div className="ui row">
                                <div className="sixteen wide column">
                                    <div className="field">
                                        <label htmlFor="kind">Dependent Variable:</label>
                                        <Select value={this.state.dependentVariable} valueKey="id" labelKey="measuringWhat"
                                                onChange={this.handleDependentVariableChange} name="dependentVariable"

                                                options={this.state.programUpdates} clearable={false}/>


                                    </div>
                                </div>
                            </div>
                            <div className="ui row">&nbsp;</div>
                            <div className="ui row">
                                <div className="sixteen wide column">
                                    <div className="field">
                                        <label htmlFor="kind">Independent Variable:</label>
                                        <Select value={this.state.independentVariable} valueKey="id" labelKey="measuringWhat"
                                                onChange={this.handleIndependentVariableChange} name="independentVariable"
                                                options={this.state.programUpdates} clearable={false}/>


                                    </div>
                                </div>
                            </div>
                            <div className="ui row">&nbsp;</div>
                        {/*<div ref="ref_mediatorVariableSelect">
                            <div className="ui row">
                                <div className="sixteen wide column">
                                    <div className="field">
                                        <label htmlFor="kind">Mediator Variable:</label>
                                        <Select value={this.state.mediatorVariable} valueKey="id" labelKey="measuringWhat"
                                                onChange={this.handleMediatorVariableChange} name="mediatorVariable"
                                                options={this.state.programUpdates} clearable={false}/>


                                    </div>
                                </div>
                            </div>

                            <div className="ui row">&nbsp;</div></div>*/}


                            <div className="ui row">&nbsp;</div>

                            <div className="ui two column grid">
                                <div className="ui row">
                                    <div className="ui column">
                                        <div className="ui fluid button" onClick={this.closeModal}>Cancel</div>
                                    </div>
                                    <div className="ui  column">
                                        <div className="ui primary fluid button" onClick={this.handleSubmit}>Save</div>
                                    </div>
                                    <div className="ui row">&nbsp;</div>
                                </div>
                            </div>


                    </div>
                </div>
            </Modal>
        )
    }
}

module.exports = {VisualizationAddAndEditItemForm, VisualizationsPage, VisualizationModalForm, VisualizationsList, VisualizationBasicView, VisualizationItemMenu}