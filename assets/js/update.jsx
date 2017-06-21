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

import { addThread, addOpenThread, closeOpenThread, addMessage, setMessageWindowVisibility, setCurrentUser, setCurrentContact, reduxLogout, showSidebar, setCurrentThread, setOpenThreads, showMessageWindow } from './redux/actions'
import { Provider, connect, dispatch } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './redux/containers'
import  {store} from "./redux/store";

import { theServer, s3IconUrl, formats, s3ImageUrl, customStepModalStyles, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, metricFormatOptions} from './constants'

$.ajaxSetup({
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

@connect(mapStateToProps, mapDispatchToProps)
export class UpdatesList extends React.Component {

    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            data: [],
        modalIsOpen: false,
            stepId:"",
        }
    }
    componentDidMount = () => {
        //this.loadObjectsFromServer(this.props.stepId)
        this.setState({stepId: this.props.stepId})

      //var intervalID = setInterval(this.loadObjectsFromServer, 2000);
        //this.setState({intervalID:intervalID});

    }

    componentWillUnmount = () => {
   // use intervalId from the state to clear the interval
   //clearInterval(this.state.intervalId);
    }


    componentWillReceiveProps = (nextProps) => {
        if (this.state.stepId != nextProps.stepId) {
            this.setState({ stepId: nextProps.stepId})

           // this.setState({ stepId: nextProps.stepId}, this.loadObjectsFromServer(nextProps.stepId))

        }
        if ((this.state.data != nextProps.updates) && (nextProps.updates != undefined)) {
            this.setState({data: nextProps.updates})
        }
    }
    handleUpdateAdded= (data) => {
        this.props.updateAdded(data)
    }



    handleFormSubmit = (update, callback) => {
        if (this.props.updateId) {
            var theUrl = "api/updates/" + this.props.updateId + "/";
            var theType = 'PATCH';

        }
        else {
            var theUrl = "api/updates/";
            var theType = 'POST';
        }
        $.ajax({
            url: theUrl,
            dataType: 'json',
            type: theType,
            data: update,
            success: function (data) {
                this.props.updateAdded(data)
                callback
                console.log("callback called")

            }.bind(this),
        error: function (xhr, status, err) {
                console.error(theURL, status, err.toString());
            }.bind(this)
        });
    }

    loadObjectsFromServer = (theStepId) => {

        if (theStepId != undefined) {
            var theUrl = "api/steps/" + theStepId + "/updates/"

            $.ajax({
                url: theUrl ,
                dataType: 'json',
                cache: false,
                headers: {
                'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    this.setState({
                        data:data
                    })

                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }.bind(this)
            });
        }
      }


    handleReloadItem = () => {
        //this.loadObjectsFromServer(this.state.stepId)
    }



    render = () => {

    if (this.state.data) {
        var objectNodes = this.state.data.map(function (objectData) {

            return (
<UpdateItem ref={`ref_update_${objectData.id}`} key={objectData.id} updateData={objectData} updateAdded={this.handleUpdateAdded} stepId={this.state.stepId} onFormSubmit={this.handleFormSubmit} reloadItem={this.handleReloadItem.bind(this)}/>

            )
        }.bind(this));
    }
        return (
        <div className="ui grid">
            <div className="ui row">
                <div className="ui header eight wide column">Updates</div>
                <div className="four wide column">&nbsp;</div>
                <div className="four wide column">
                     <UpdateAddAndEditItemForm edit="true"  currentView="UpdateBasic" stepId={this.state.stepId} onFormSubmit={this.handleFormSubmit} reloadItem={this.handleReloadItem.bind(this)} />

                </div>
                </div>

                {objectNodes}



        </div>

    )
    }
}


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
            units: "",
            metricLabel: "",
            measuringWhat: "",
            format: "",
            updateData: ""


        }
    }
    componentDidMount() {
        this.setState({
            data: this.props.updateData,
        })
        if (this.props.updateData != undefined) {
            this.setState({
                id: this.props.updateData.id,
                units: this.props.updateData.units,
                format: this.props.updateData.format,
                metricLabel: this.props.updateData.metricLabel,
                measuringWhat: this.props.updateData.measuringWhat,
                currentView: this.props.currentView,

            })


        }
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.state.data != nextProps.updateData) {
            this.setState({data: nextProps.updateData})
            if (nextProps.updateData != undefined) {
                this.setState({
                    id: nextProps.updateData.id,
                    units: nextProps.updateData.units,
                    format: nextProps.updateData.format,
                    metricLabel: nextProps.updateData.metricLabel,
                    measuringWhat: nextProps.updateData.measuringWhat,
                })
            }
        }


            if (this.state.currentView != nextProps.currentView) {
                this.setState({currentView: nextProps.currentView})
            }

    }

    openModal() {
        this.setState({
            modalIsOpen: true});

        if (this.state.data) {
            this.setState({
                id: this.state.data.id,
                units: this.state.data.units,
                format: this.state.data.format,
                metricLabel: this.state.data.metricLabel,
                measuringWhat: this.state.data.measuringWhat,
            })
        }

    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        //this.refs.subtitle.style.color = '#f00';
    }

    closeModal() {
        if (this.props.edit == "true") {
            this.setState({modalIsOpen:false});
            this.setState({
                format: "",
                modalIsOpen: false,
                units: "",
                metricLabel: "",
                measuringWhat: "",
            });
        }
        else {
            this.setState({
                format: "",
                modalIsOpen: false,
                units: "",
                metricLabel: "",
                measuringWhat: "",
            });
        }

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

    handleSubmit(e) {
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
          this.finishSubmit());

    }

    finishSubmit = () => {
                this.closeModal()
                this.props.reloadItem()
    }

    deleteUpdate() {

        var theUrl = "api/updates/" + this.state.data.id + "/"

        $.ajax({
        url: theUrl,
        dataType: 'json',
        type: 'DELETE',
        success: () => {
            //$(this.refs['ref_update_form_' + this.state.data.id]).slideUp();

            this.props.reloadItem()

        },
        error: function(xhr, status, err) {
            console.error(theUrl, status, err.toString());
        }
    });


    }
    handleClick (theClick) {
        switch(theClick) {
            case ("Edit"):
                this.openModal()
                break;
            case ("Delete"):
                this.deleteUpdate()
                break;
        }

    }

    render() {
 if (this.state.data ) {
return (
    <div>
        <ItemControlBar myRef="ref_itemControlBar"
                        label="Update" click={this.handleClick}
                        currentView="UpdateBasic"
                        editable={true}
                        showCloseButton={false} />




    <div className="ui noTopMargin segment">

                            <div className="field">
                                <label>Label:</label>
                                <div>{this.state.data.metricLabel}</div>
                            </div>
                            <div className="field">

                                <label>Metric:</label>

                                <div>{this.state.data.measuringWhat} in {this.state.data.units} using {this.state.data.format}</div>
                            </div>
                        </div>

            {/*  <div className="ui two column grid">

                <div className="column left aligned">{this.props.label}</div>
                <div className="column right aligned noRightPadding">

                        <ItemControlBarButton myRef="ref_cancelButton" label="Cancel"
                                              click={this.handleCancelClicked}/>
                    {menuButton}
                    {closeButton}

                    </div>
                </div><div className="left aligned nine wide column">Update</div>
            <div ref={`editButtonRef_${this.state.id}`} className="ui three wide column tiny smallPadding middle aligned purple-inverted button"  onClick={this.openModal}>Edit</div>
            <div ref={`deleteButtonRef_${this.state.id}`} className="ui three wide column tiny smallPadding middle aligned purple-inverted button"  onClick={this.deleteUpdate}>Delete</div>*/}
                     <Modal
                            isOpen={this.state.modalIsOpen}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={customModalStyles} >

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
                                        value={this.state.measuringWhat}
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
                                        value={this.state.units}
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
                                    <Select value={this.state.format}  onChange={this.handleFormatChange} name="format" options={metricFormatOptions} clearable={false}/>


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


                                                                                                <div className="ui row">&nbsp;</div>

                                <div className="ui two column grid">
                                    <div className="ui row">
                                         <div className="ui column">
                                             <a className="ui fluid button" onClick={this.closeModal}>Cancel</a>
                                        </div>
                                        <div className="ui  column">
                                            <div className="ui primary fluid button" onClick={this.handleSubmit}>Save</div>
                                        </div>
                                    <div className="ui row">&nbsp;</div>
                             </div>
                         </div>


                            </form>
    </div>
                                </div>
                    </Modal>

                </div>
)} else


            {


    return (
        <div>
            <a className="ui orange fluid button plus icon" onClick={this.openModal}>+</a>

                     <Modal
                            isOpen={this.state.modalIsOpen}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={customModalStyles} >

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
                                        value={this.state.measuringWhat}

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
                                        value={this.state.units}

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
                                                                    <Select value={this.state.format}  onChange={this.handleFormatChange} name="format" options={metricFormatOptions} clearable={false}/>

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
}}



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

export class UpdateItemMenu extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
     }

     handleClick = (callbackData) => {
         this.props.click(callbackData)
     }

     getProfileMenu () {

     }

     render () {
         var myStyle = { display: "block"}
         return(

                  <div className="ui simple dropdown item" >
                      <div className="ui extramini image controlButtonMargin">
                      <img src={`${s3IconUrl}menuDark.svg`} /></div>
                      <div className="menu">

                          <div className="ui item">
                              <IconLabelCombo size="extramini" orientation="left" text="Delete" icon="trash" background="Light" click={this.handleClick} />
                              </div>

                      </div>
                  </div>


         )
     }

}



export class UpdateItem extends React.Component{
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            id: "",
            measuringWhat: "",
            units: "",
            format: "",
            metricLabel: "",
            step: "",
            updateData:{}
        }
    }

    componentDidMount () {
            this.setState({updateData: this.props.updateData})

        this.setState({
            id: this.props.updateData.id,
            measuringWhat:this.props.updateData.measuringWhat,
            units:this.props.updateData.units,
            format: this.props.updateData.format,
            metricLabel: this.props.updateData.metricLabel,
            step: this.props.stepId,
        })

    }

    handleFormSubmit = (update, callback) => {
        if (this.state.id) {
            var theUrl = "api/updates/" + this.state.id + "/";
            var theType = 'PATCH';

        }
        else {
            var theUrl = "api/updates/";
            var theType = 'POST';
        }
        $.ajax({
            url: theUrl,
            dataType: 'json',
            type: theType,
            data: update,
            success: function (data) {
                this.props.updateAdded(data)
                callback
                console.log("callback called")

            }.bind(this),
        error: function (xhr, status, err) {
                console.error(theURL, status, err.toString());
            }.bind(this)
        });
    }

    handleReloadItem() {
        this.props.reloadItem()
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.state.updateData != nextProps.updateData ) {
            this.setState({updateData: nextProps.updateData})
        }

    }



    render () {
        return (
            <div ref={`ref_update_${this.state.updateData.id}`} className="ui tinyPadding row">
                    <div className="sixteen wide column">

                        {/*<div className="ui top attached orange large button " >*/}


                        <UpdateAddAndEditItemForm edit="true" currentView="UpdateBasic" updateData={this.state.updateData} stepId={this.state.updateData.step} onFormSubmit={this.handleFormSubmit} reloadItem={this.handleReloadItem}/>

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

module.exports = { UpdatesList, UpdateItemMenu };