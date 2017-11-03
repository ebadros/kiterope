var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
// require `react-d3-core` for Chart component, which help us build a blank svg and chart title.
import { VictoryBar, VictoryLine, VictoryChart, VictoryAxis, VictoryTheme, VictoryTooltip } from 'victory';
import  ReactDataGrid  from 'react-data-grid';
import { ReactDataGridPlugins } from 'react-data-grid-addons';


import autobind from 'class-autobind'

import { Provider, connect, dispatch } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './redux/containers'
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
export class VisualizationChartForm extends React.Component {
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
            visualization: {}

        }
    }

    componentDidMount() {


        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.updateOccurrences != undefined) {
                if (this.state.updateOccurrences != this.props.storeRoot.updateOccurrences) {
                    this.setState({updateOccurrences: this.props.storeRoot.updateOccurrences})

                    this.setState({stringifiedUpdateOccurrences: JSON.parse(JSON.stringify(this.props.storeRoot.updateOccurrences))})

                    this.buildDataOptions(this.props.storeRoot.updateOccurrences)
                }
            }
        }

    }

    componentWillReceiveProps(nextProps) {


         if (nextProps.storeRoot != undefined) {
             if (nextProps.storeRoot.updateOccurrences != undefined) {

                 if (this.state.updateOccurrences != nextProps.storeRoot.updateOccurrences) {
                     this.setState({stringifiedUpdateOccurrences: JSON.parse(JSON.stringify(nextProps.storeRoot.updateOccurrences))})

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
                    console.log("theKey is " + theKey)
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


    render() {
        return (
            <div>
                 <Select value={this.state.kind} onChange={this.handleKindChange} name="kind"
                                                options={visualizationChoices} clearable={false}/>

             <Select value={this.state.dependentVariable}
                                                onChange={this.handleDependentVariableChange} name="dependentVariable"
                                                options={this.state.dataOptions} clearable={false}/>
             <Select value={this.state.independentVariable}
                                                onChange={this.handleIndependentVariableChange} name="independentVariable"
                                                options={this.state.dataOptions} clearable={false}/>
                 <Select value={this.state.mediatorVariable}
                                                onChange={this.handleMediatorVariableChange} name="mediatorVariable"
                                                options={this.state.dataOptions} clearable={false}/>
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

                    this.setState({stringifiedUpdateOccurrences: JSON.parse(JSON.stringify(this.props.storeRoot.updateOccurrences))})

                    this.buildDataOptions(this.props.storeRoot.updateOccurrences)
                }
            }
        }

    }

    componentWillReceiveProps(nextProps) {


         if (nextProps.storeRoot != undefined) {
             if (nextProps.storeRoot.updateOccurrences != undefined) {

                 if (this.state.updateOccurrences != nextProps.storeRoot.updateOccurrences) {
                     this.setState({stringifiedUpdateOccurrences: JSON.parse(JSON.stringify(nextProps.storeRoot.updateOccurrences))})

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
                    console.log("theKey is " + theKey)
                        theDataOptionsUnique.push(theKey)
                        theDataOptions.push({key:theKey, name:theKey})
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
                    rowsCount={this.state.updateOccurrences.length}
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
                            domainPadding={20}
                            theme={VictoryTheme.material}
                            scale={{x: "time"}}

                        >

                            <VictoryAxis

                            />
                            <VictoryAxis
                                dependentAxis
                                tickFormat={(x) => (`${x}`)}
                            />

                            <VictoryLine
                                data={this.state.updateOccurrences}
                                labelComponent={<VictoryTooltip/>}
                                sortKey="x"
                                style={{data: {opacity: 0.7}, labels: {fontSize: 8},}}
                                x="Absolute Date/Time"
                                y="pushups"

                            /></VictoryChart>
                    </div>
                </div>
            )
        } else {
            return (<div></div>)
        }
        }



}


module.exports = { LineGraph, Spreadsheet, VisualizationChartForm }

