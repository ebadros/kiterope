var React = require('react');
let ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {ObjectList, ObjectListAndUpdate, FormAction,  } from './base'
var Datetime = require('react-datetime');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
//var MaskedInput = require('react-maskedinput');
var classNames = require('classnames');
import validator from 'validator';
import ValidatedInput from './app'
var Modal = require('react-modal');

const customStyles = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)'
  },

  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    transform             : 'translate(-50%, -50%)',
      overflow                   : 'hidden',

    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '40px'
  }
};

var theServer = 'https://192.168.1.156:8000/'

$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    }
});

var UpdatesList = React.createClass({
    componentDidMount: function() {
        var self = this;

        self.loadObjectsFromServer();

      //var intervalID = setInterval(this.loadObjectsFromServer, 2000);
        //this.setState({intervalID:intervalID});

    },

    componentWillUnmount: function() {
   // use intervalId from the state to clear the interval
   //clearInterval(this.state.intervalId);
    },



    getInitialState: function() {
        return {
            data: [],
        modalIsOpen: false,
        };

    },

    handleFormSubmit: function (update, callback) {
        if (this.props.updateId) {
            var theUrl = theServer + "api/updates/" + this.props.updateId + "/";
            var theType = 'PATCH';

        }
        else {
            var theUrl = theServer + "api/updates/";
            var theType = 'POST';
        }
        $.ajax({
            url: theUrl,
            dataType: 'json',
            type: theType,
            data: update,
            success: callback,
            error: function (xhr, status, err) {
                console.error(theURL, status, err.toString());
            }.bind(this)
        });
    },

    loadObjectsFromServer: function () {
        $.ajax({
          url: theServer + "api/steps/" + this.props.stepId + "/updates",
          dataType: 'json',
          cache: false,
          success: function(data) {

          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },




    render: function() {

    if (this.state.data) {
        var objectNodes = this.state.data.map(function (objectData) {

            return (
                <UpdateItem ref={`ref_update_${objectData.id}`} key={objectData.id} updateData={objectData} stepId={this.props.stepId} onFormSubmit={this.handleFormSubmit} />

            )
        }.bind(this));
    }
        return (
        <div className="ui grid">
            <div className="ui row">
                <div className="ui header eight wide column">Updates</div>
                <div className="four wide column">&nbsp;</div>
                <div className="four wide column">
                     <UpdateAddAndEditItemForm edit="false" stepId={this.props.stepId} onFormSubmit={this.handleFormSubmit} />

                </div>
                </div>

                {objectNodes}



        </div>

    )
    }
});

var UpdateAddAndEditItemForm = React.createClass({
    componentDidMount: function() {
        var self = this;

    },

    openModal: function() {
        this.setState({modalIsOpen: true});
    },

    afterOpenModal: function() {
        // references are now sync'd and can be accessed.
        //this.refs.subtitle.style.color = '#f00';
    },

    closeModal: function() {
        if (this.props.edit == "true") {
            this.setState({modalIsOpen:false});
        }
        else {
            this.setState({
                format: "text",
                modalIsOpen: false,
                units: "",
                metricLabel: "",
                measuringWhat: "",
            });
        }

    },

    getInitialState: function() {
        if (this.props.edit=="true") {
            return {
                id: this.props.updateData.id,
                measuringWhat: this.props.updateData.measuringWhat,
                units: this.props.updateData.units,
                format: this.props.updateData.format,
                metricLabel: this.props.updateData.metricLabel,
                step: this.props.stepId,
                modalIsOpen: false,
            }
        } else {
        return {
            format: "text",
        modalIsOpen: false,

        }}

    },

    loadObjectsFromServer: function () {
        $.ajax({
          url: theServer + "api/steps/" + this.props.stepId + "/updates",
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

    handleMeasuringWhatChange: function(value) {
        this.setState({measuringWhat: value});
    },
    handleMetricLabelChange: function(value) {
        this.setState({metricLabel: value});
    },
    handleUnitsChange: function(value) {
        this.setState({units: value});
    },
    handleFormatChange: function(value) {
        this.setState({format: value});
    },

    handleSubmit: function(e) {


        e.preventDefault();

        var measuringWhat = this.state.measuringWhat;
        var metricLabel = this.state.metricLabel;
        var units = this.state.units;
        var format = this.state.format;

        var step = this.props.stepId;





        this.props.onFormSubmit({
            measuringWhat: measuringWhat,
            metricLabel: metricLabel,
            units: units,
            format: format,
            step:step,

        },
            function(){
                this.closeModal()
        }.bind(this));

    },

    deleteUpdate: function() {

        $(this.refs['ref_update_' + this.props.updateData.id]).slideToggle();

        $.ajax({
        url: (theServer + "api/updates/" + this.props.updateData.id + "/"),
        dataType: 'json',
        type: 'DELETE',
        //data: step,
        success: function() {

        },
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }
    });


    },

    render: function() {

        if (this.state.id) {
return (
        <div className="ui grid">

                            <div className="left aligned nine wide column">Update</div>
            <div ref={`editButtonRef_${this.state.id}`} className="ui three wide column tiny smallPadding middle aligned purple-inverted button"  onClick={this.openModal}>Edit</div>
            <div ref={`deleteButtonRef_${this.state.id}`} className="ui three wide column tiny smallPadding middle aligned purple-inverted button"  onClick={this.deleteUpdate}>Delete</div>
                     <Modal
                            isOpen={this.state.modalIsOpen}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={customStyles} >

                            <div className="ui grid">
                                <div className="header sixteen wide column"><h2>Update</h2></div>

<div className="ui sixteen wide column form">
                            <form onSubmit={this.handleSubmit}>
                <div className="ui row">
                            <div className="sixteen wide column">
                                <input type="hidden" name="step" value={this.props.stepId}/>
                                <ValidatedInput
                                        type="text"
                                        name="measuringWhat"
                                        label="What are you measuring?"
                                        id="id_measuringWhat"
                                        placeholder="distance, weight, time, etc"
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
                                <select id="id_format" name="format" value={this.state.format} onChange={this.handleFormatChange}>
                                                <option value="text" >text</option>
                                                <option value="decimal">decimal</option>
                                                <option value="integer">integer</option>
                                                <option value="time">time</option>
                                                <option value="url">url</option>
                                                <option value="picture">picture</option>
                                                <option value="video">video</option>
                                        `       <option value="audio">audio</option>

                                </select>
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
                                        initialValue={this.state.metricLabel}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleMetricLabelChange}
                                    />
                                </div>
                    </div>
                                                                <div className="ui row">&nbsp;</div>


                                                                                                <div className="ui row">&nbsp;</div>

                                <div className="ui two column grid">
                                    <div className="ui row">
                                         <div className="ui column">
                                             <a className="ui fluid button" onClick={this.closeModal}>Cancel</a>
                                        </div>
                                        <div className="ui  column">
                                            <button type="submit" className="ui primary fluid button">Save</button>
                                        </div>
                                    <div className="ui row">&nbsp;</div>
                             </div>
                         </div>


                            </form>
    </div>
                                </div>
                    </Modal>

                </div>
)
        }
            else {


    return (
        <div>
            <a className="ui orange fluid button plus icon" onClick={this.openModal}>+</a>

                     <Modal
                            isOpen={this.state.modalIsOpen}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={customStyles} >

                            <div className="ui grid">
                                <div className="header sixteen wide column"><h2>Update</h2></div>

<div className="ui sixteen wide column form">
                            <form onSubmit={this.handleSubmit}>
                <div className="ui row">
                            <div className="sixteen wide column">
                                <input type="hidden" name="step" value={this.props.stepId}/>
                                <ValidatedInput
                                        type="text"
                                        name="measuringWhat"
                                        label="What are you measuring?"
                                        id="id_measuringWhat"
                                        placeholder="distance, weight, time, etc"

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
                                <select id="id_format" name="format" value={this.state.format} onChange={this.handleFormatChange}>
                                                <option value="text">text</option>
                                                <option value="decimalNumber">decimal number</option>
                                                <option value="integer">whole number</option>
                                                <option value="time">time</option>
                                                <option value="url">url</option>
                                                <option value="picture">picture</option>
                                                <option value="video">video</option>
                                        `       <option value="audio">audio</option>

                                </select>
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
                                        initialValue={this.state.metricLabel}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleMetricLabelChange}
                                    />
                                </div>
                    </div>
                                                                <div className="ui row">&nbsp;</div>


                                                                                                <div className="ui row">&nbsp;</div>

                                <div className="ui two column grid">
                                    <div className="ui row">
                                         <div className="ui column">
                                             <a className="ui fluid button" onClick={this.closeModal}>Cancel</a>
                                        </div>
                                        <div className="ui  column">
                                            <button type="submit" className="ui primary fluid button">Save</button>
                                        </div>
                                    <div className="ui row">&nbsp;</div>
                             </div>
                         </div>


                            </form>
    </div>
                                </div>
                    </Modal>

                </div>



    )
    }
}});

var UpdateFormAction = React.createClass({

    componentDidMount: function() {
        var self = this;
        console.log("this update" + this.props.update)


    },

    getInitialState: function() {
        return {data: []};

    },

    handleSubmit: function(e) {

        e.preventDefault();
        var metric = this.state.metric;
        var metricLabel = this.state.metricLabel;

        this.props.onFormSubmit({
            metric: metric,
            metricLabel: metricLabel
        },
            );
    },



    handleMetricChange: function(e) {

        this.setState({metric: e.target.value});
    },

    handleMetricLabelChange: function(e) {
        this.setState({metricLabel: e.target.value});
    },


    render: function() {
        console.log("inside render2 " + this.props.update);

        if (this.props.update) {

        return (
            <div className="ui row">
                <div className="six wide column">Update 1
                    <div  className="field fluid">
                            <MetricSelectButton name="metric" id="id_metric" initialValue={this.state.metric} />
                    </div>
                    <div  className="field fluid">
                        <ValidatedInput
                            type="text"
                            name="metricLabel"
                            label="Label for Metric:"
                            id="id_metricLabel"
                            value={this.state.metricLabel}
                            initialValue={this.state.metricLabel}
                            validators='"!isEmpty(str)"'
                            onChange={this.validate}
                            stateCallback={this.setMetricLabel}
                            />
                    </div>
                    </div>
                </div>
        );

    }
    else {
            return null;
        }
    }
});

var MetricSelectButton = React.createClass({
    loadObjectsFromServer: function () {
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({data: data.results});
              console.log(data);

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

var UpdateItem = React.createClass({
    componentDidMount: function() {
        var self = this;

    },

    getInitialState:function() {
        return {
            id: this.props.updateData.id,
            measuringWhat:this.props.updateData.measuringWhat,
            units:this.props.updateData.units,
            format: this.props.updateData.format,
            metricLabel: this.props.updateData.metricLabel,
            step: this.props.stepId,
        }
    },


    render: function() {
        return (
            <div className="ui tinyPadding row">
                    <div className="sixteen wide column">
 <div className="ui top attached orange large button " >


                        <UpdateAddAndEditItemForm edit="true" updateData={this.props.updateData} stepId={this.props.stepId} onFormSubmit={this.handleFormSubmit} />

                                </div>



                        <div className="ui noTopMargin segment">

                            <div className="field">
                                <label>Label:</label>
                                <div>{this.state.metricLabel}</div>
                            </div>
                            <div className="field">

                                <label>Metric:</label>

                                <div>{this.state.measuringWhat} in {this.state.units} using {this.state.format}</div>
                            </div>
                        </div>


                    </div>
                 </div>


        )
    }
})

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

module.exports = UpdatesList;