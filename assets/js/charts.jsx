var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
// require `react-d3-core` for Chart component, which help us build a blank svg and chart title.
import { VictoryBar, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryTooltip } from 'victory';
import {VisualizationViewEditDeleteItem, ImageUploader, Breadcrumb,  ProgramViewEditDeleteItem, FormAction, Sidebar, FormHeaderWithActionButton, DetailPage} from './base';
import { setUpdates, addVisualization, setVisualizationViewerData, deleteVisualization, editVisualization, setVisualizationModalData, setUpdateModalData, addUpdateWithoutStep, addUpdate, addStepToUpdate, removeStepFromUpdate, editUpdate, setCurrentUser, setSearchHitsVisibility, setSearchQuery, setSettings, setDailyPeriod, shouldReload, setProfile, deleteContact, setForMobile, setPlans, addContact, addPlan, removePlan, setMessageWindowVisibility, setCurrentContact, reduxLogout, addOpenThread, addMessage, closeOpenThread, reduxLogin, showSidebar, addThread, setMessageThreads, setOpenThreads, updateProgram, setCurrentThread, setPrograms, addProgram, deleteProgram, addStep, updateStep, deleteStep, setGoals, addGoal, deleteGoal, updateGoal, setContacts, setStepOccurrences } from './redux/actions'

import  ReactDataGrid  from 'react-data-grid';
import { ReactDataGridPlugins } from 'react-data-grid-addons';
import {VisualizationBasicView, VisualizationChartView} from './visualization'
import {StandardInteractiveButton } from './settings'
var moment = require('moment');
import { KRInput, KRSelect, KRRichText, KRCheckBox } from './inputElements'

import autobind from 'class-autobind'

import { Provider, connect, dispatch } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './redux/containers2'
import  {store} from "./redux/store";
import {visualizationChoices} from './constants'
import Select from 'react-select'
var width = 700,
    height = 300,
    margins = {left: 100, right: 100, top: 50, bottom: 50},
    title = "User sample",
    // chart series,
    // field: is what field your data want to be selected
    // name: the name of the field that display in legend
    // color: what color is the line
    chartSeries = [
      {
        field: 'BMI',
        name: 'BMI',
        color: '#ff7f0e'
      }
    ],
    // your x accessor
    x = function(d) {
      return d.index;
    }

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}




@connect(mapStateToProps, mapDispatchToProps)
export class VisualizationChart extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            dependentVariable:"",
            independentVariable:"",
            mediatorVariable:"",
            kind:"LINE",
            dataOptions:[],

            data: [],
            visualization: {},
            saved: "View Data",
            name:""

        }
    }



    getServerErrors(fieldName) {
        if (this.state.serverErrors == undefined) {
            return ""
        } else {
            return this.state.serverErrors[fieldName]
        }
    }

    componentDidMount() {


        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.updateOccurrences != undefined) {
                if (this.state.updateOccurrences != this.props.storeRoot.updateOccurrences) {
                    this.setState({updateOccurrences: this.props.storeRoot.updateOccurrences})

                    this.buildStringifiedUpdateOccurrences(this.props.storeRoot.updateOccurrences)

                    this.buildDataOptions(this.props.storeRoot.updateOccurrences)
                }
            }
        }

    }

    buildStringifiedUpdateOccurrences(theUpdateOccurrences) {
        var theStringifiedUpdateOccurrences = []
        for (var i=0; i < theUpdateOccurrences.length ; i++) {
            var theUpdateOccurrence = theUpdateOccurrences[i]
            var theKeys = Object.keys(theUpdateOccurrence)
            var theRevisedUpdateOccurrence = {}
            for (var j=0; j< theKeys.length; j++) {
                var theKey = theKeys[j]
                var theItem = theUpdateOccurrence[theKey]
                var theRevisedItem = {[theKey]: theItem.value}
                theRevisedUpdateOccurrence[theKey] = theRevisedItem


            }
            theStringifiedUpdateOccurrences.push(theRevisedUpdateOccurrence)



        }
        this.setState({stringifiedUpdateOccurrences: theStringifiedUpdateOccurrences})

    }

    componentWillReceiveProps(nextProps) {


         if (nextProps.storeRoot != undefined) {
             if (nextProps.storeRoot.updateOccurrences != undefined) {

                 if (this.state.updateOccurrences != nextProps.storeRoot.updateOccurrences) {
                    this.buildStringifiedUpdateOccurrences(nextProps.storeRoot.updateOccurrences)

                     this.setState({updateOccurrences: nextProps.storeRoot.updateOccurrences})
                     this.buildDataOptions(nextProps.storeRoot.updateOccurrences)

                 }
             }
         }
    }

    buildDataOptions(theUpdateOccurrences) {
        var theDataOptions = []
        var theDataOptionsUnique = []
        if (theUpdateOccurrences != undefined) {
            for (var i = 0; i < theUpdateOccurrences.length; i++) {
                var theUpdateOccurrence = theUpdateOccurrences[i]
                var theKeys = Object.keys(theUpdateOccurrence)
                for (var j=0; j < theKeys.length; j++) {
                    var theKey = theKeys[j]
                    if (theDataOptionsUnique.indexOf(theKey) === -1) {
                        theDataOptionsUnique.push(theKey)
                        theDataOptions.push({value:theKey, label:theKey})
                    }

                }

            }
            this.setState({dataOptions: theDataOptions})
        }

    }

    handleKindChange(option) {

        this.setState({kind: option.value});
    }

    handleDependentVariableChange(option) {

        this.setState({dependentVariable: option.value});
    }

    handleIndependentVariableChange(option) {

        this.setState({independentVariable: option.value});
    }

    handleMediatorVariableChange(option) {


        this.setState({mediatorVariable: option.value});
    }

    handleNameChange(value) {
        this.setState({name: value})
    }

    handleViewDataClicked() {
        var theVisualizationData = {
            dependentVariable:this.state.dependentVariable,
            independentVariable: this.state.independentVariable,
            mediatorVariable: this.state.mediatorVariable,
            kind: this.state.kind,
            name: this.state.name,
        }

        var theUrl = "/api/tempVisualization/"

        $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'POST',
                data: theVisualizationData,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    this.setState({data: data})



                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    console.log(theUrl, err)
                    this.setState({
                        serverErrors: serverErrors,
                         saved: "Save"
                    })

                }.bind(this)
            });
        }





    render() {
        return (<div>
                {/*
            <div className="ui three column stackable grid">
                <div className="ui column field">
                 <label>Chart Type:</label>
                 <Select value={this.state.kind} onChange={this.handleKindChange} name="kind"
                                                options={visualizationChoices} clearable={false}/>
                    </div>
<div className="ui column  field">
                     <label>Dependent Variable:</label>

             <Select value={this.state.dependentVariable}
                                                onChange={this.handleDependentVariableChange} name="dependentVariable"
                                                options={this.state.dataOptions} clearable={false}/>
    </div>
    <div className="ui column  field">
                             <label>Independent Variable:</label>

             <Select value={this.state.independentVariable}
                                                onChange={this.handleIndependentVariableChange} name="independentVariable"
                                                options={this.state.dataOptions} clearable={false}/>
        </div>
                <div className="ui column"> <KRInput
                                        type="text"
                                        name="name"
                                        label="Visualization Name"
                                        id="id_title"
                                        value={this.state.name}
                                        initialValue={this.state.name}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleNameChange}
                                        serverErrors={this.getServerErrors("name")}


                                    /></div>
                                <div className="ui column">&nbsp;</div>
                <div className="ui column">

                <StandardInteractiveButton color="purple" initial="View Data" processing="Building..." completed="Viewing" current={this.state.saved} clicked={this.handleViewDataClicked}  />
</div>


                </div>
                                <VisualizationChartView  data={this.props.data} type={this.state.kind}/>*/}

            </div>


        )
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class Spreadsheet extends React.Component {
     constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: [],
            visualization: {},
            updateOccurrences:[]

        }
    }

    componentDidMount() {


        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.updateOccurrences != undefined) {
                if (this.state.updateOccurrences != this.props.storeRoot.updateOccurrences) {
                    this.setState({updateOccurrences: this.props.storeRoot.updateOccurrences})

                    this.buildStringifiedUpdateOccurrences(this.props.storeRoot.updateOccurrences)
                    this.buildDataOptions(this.props.storeRoot.updateOccurrences)
                }
            }
        }

    }

    componentWillReceiveProps(nextProps) {


         if (nextProps.storeRoot != undefined) {
             if (nextProps.storeRoot.updateOccurrences != undefined) {

                 if (this.state.updateOccurrences != nextProps.storeRoot.updateOccurrences) {
                     this.buildStringifiedUpdateOccurrences(nextProps.storeRoot.updateOccurrences)

                     this.setState({updateOccurrences: nextProps.storeRoot.updateOccurrences})
                     this.buildDataOptions(nextProps.storeRoot.updateOccurrences)

                 }
             }
         }
    }

    buildStringifiedUpdateOccurrences(theUpdateOccurrences) {
        var theStringifiedUpdateOccurrences = []
        for (var i=0; i < theUpdateOccurrences.length ; i++) {
            var theUpdateOccurrence = theUpdateOccurrences[i]
            var theKeys = Object.keys(theUpdateOccurrence)
            var theRevisedUpdateOccurrence = {}
            for (var j=0; j< theKeys.length; j++) {
                var theKey = theKeys[j]
                var theItem = theUpdateOccurrence[theKey]
                if (theItem.value != undefined && theItem.value != null && !isNaN(theItem.value.getTime())) {
                    theRevisedUpdateOccurrence[theKey] = theItem.value
                } else {
                                        theRevisedUpdateOccurrence[theKey] = null

                }


            }
            theStringifiedUpdateOccurrences.push(theRevisedUpdateOccurrence)



        }
        this.setState({stringifiedUpdateOccurrences: theStringifiedUpdateOccurrences})

    }

    buildDataOptions(theUpdateOccurrences) {
        var theDataOptions = []
        var theDataOptionsUnique = []
        if (theUpdateOccurrences != undefined) {
            for (var i = 0; i < theUpdateOccurrences.length; i++) {
                var theUpdateOccurrence = theUpdateOccurrences[i]
                var theKeys = Object.keys(theUpdateOccurrence)
                for (var j=0; j < theKeys.length; j++) {
                    var theKey = theKeys[j]
                    if (theDataOptionsUnique.indexOf(theKey) === -1) {
                        var theFormat = theUpdateOccurrence.format

                        theDataOptionsUnique.push(theKey)
                        theDataOptions.push({key:theKey, name:theKey,})
                    }

                }

            }
            this.setState({dataOptions: theDataOptions})
        }

    }

     createRows = () => {
    let rows = [];
    for (let i = 1; i < 1000; i++) {
      rows.push({
        id: i,
        title: 'Title ' + i,
        count: i * 1000
      });
    }

    this._rows = rows;
  };

  rowGetter = (i) => {
    return this.state.stringifiedUpdateOccurrences[i];
  };



    render () {
        if (this.state.dataOptions != undefined) {
            return (
                <ReactDataGrid
                    columns={this.state.dataOptions}
                    rowGetter={this.rowGetter}
                    rowsCount={this.state.stringifiedUpdateOccurrences.length}
                    minHeight={200}/>

            )
        } else {
            return (<div></div>)
        }
    }


}
@connect(mapStateToProps, mapDispatchToProps)
export class LineGraph extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: [],
            visualization: {}

        }
    }

    componentDidMount() {
        this.setState({visualization: this.props.visualization})


        if (this.props.storeRoot != undefined) {
            if (this.state.updateOccurrences != this.props.storeRoot.updateOccurrences) {
                this.setState({updateOccurrences: this.props.storeRoot.updateOccurrences})
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.visualization != nextProps.visualization) {
            this.setState({
                visualization: nextProps.visualization,
            })

        }

        if (nextProps.storeRoot != undefined) {
            if (this.state.updateOccurrences != nextProps.storeRoot.updateOccurrences) {
                this.setState({updateOccurrences: nextProps.storeRoot.updateOccurrences})
            }
        }
    }


    render() {
        if (this.state.updateOccurrences != undefined) {
            return (
                <div>
                    <div className="sixteen wide column">

                    </div>
                    <div className="ui column">


                        <div className="centered chart header"><h3>{this.state.visualization.name}</h3></div>
                        <VictoryChart
                            domainPadding={30}
                            height={200}

                            theme={VictoryTheme.material}

                        >
                             <VictoryAxis
                                dependentAxis
                                                            style={{tickLabels:{fontSize:6,padding:6}, axisLabel: {fontSize: 4},}}


                            />

                            <VictoryAxis
                                independentAxis
                                tickCount={2}

                                tickFormat={(x) => (`${moment(x).format("M/D")}`)}
                                style={{tickLabels:{fontSize:6,padding:6}, axisLabel: {fontSize: 4},}}


                            />


                            <VictoryLine
                                data={this.state.visualization.updateOccurrences}
                                labelComponent={<VictoryTooltip/>}
                                sortKey="x"
                                style={{data: {opacity: 0.7}, labels: {fontSize: 2},}}
                                x="stepOccurrenceDate"
                                y="integer"

                            /></VictoryChart>
                    </div>
                </div>
            )
        } else {
            return (<div></div>)
        }
        }



}


module.exports = { VisualizationChart, LineGraph, Spreadsheet }

