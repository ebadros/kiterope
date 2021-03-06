var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import autobind from 'class-autobind'
import DatePicker  from 'react-datepicker';
import moment from 'moment-timezone';
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
import {UpdateOccurrenceList } from './updateOccurrence'
import {SaveButton } from './settings'


import {ImageUploader,   Breadcrumb, ViewEditDeleteItem, StepViewEditDeleteItem, PlanViewEditDeleteItem, FormAction, Sidebar, Header, FormHeaderWithActionButton, DetailPage} from './base';
import { Menubar, StandardSetOfComponents, Footer, ErrorReporter } from './accounts'
import { KRInput, KRSelect, KRRichText, KRCheckBox } from './inputElements'

import { IconLabelCombo, ClippedImage, ContextualMenuItem, ChoiceModal, ChoiceModalButtonsList } from './elements'
import { makeEditable, ProgramCalendar } from './calendar'
import { UpdatesList } from './update'
import { Provider, connect, dispatch } from 'react-redux'
import  {store} from "./redux/store";

import { mapStateToProps, mapDispatchToProps } from './redux/containers2'



import { TINYMCE_CONFIG, theServer, mobileModalStyle, s3IconUrl, formats, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, times, durations,  } from './constants'
import Measure from 'react-measure'
BigCalendar.momentLocalizer(moment);
import { updateStepOccurrence, setCurrentUser, setPlans,  setUpdateOccurrences, setUpdates, setVisualizations, removeStepFromUpdate, addStepToUpdate, editUpdate, reduxLogout, setProfile, setSettings, setForMobile, showSidebar, setContacts, setMessageWindowVisibility, setOpenThreads, setGoals, setPrograms, setMessageThreads,  setStepOccurrences } from './redux/actions'

import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

@connect(mapStateToProps, mapDispatchToProps)
export class StepOccurrenceList extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: [],


        }
    }

    componentDidMount() {
        this.setState({
            data: this.props.data,
            status: this.props.status,
        })




    }

    componentWillReceiveProps(nextProps) {
        if (this.state.data != nextProps.data) {

            this.setState({data: nextProps.data})
        }

        if (this.state.status != nextProps.status) {
            this.setState({
            status: nextProps.status,
        })
        }
    }

    render() {
        if ((this.state.data != undefined) && (this.state.data.length != 0 )){
            var someCompleted = false
            var someToDo = false
            var someNeverCompleted = false

            var objectNodes = this.state.data.map(function (objectData) {
                if ((this.state.status == "COMPLETED") && (objectData.wasCompleted == true)) {
                    someCompleted = true

                    return (
                        <StepOccurrenceItem key={`ref_stepOccurrenceItem_${objectData.id}`}
                                            stepOccurrenceData={objectData}/>
                    )
                } else if ((this.state.status == "TODO") && (objectData.wasCompleted == false)) {
                    someToDo = true
                    return (
                        <StepOccurrenceItem key={`ref_stepOccurrenceItem_${objectData.id}`}
                                            stepOccurrenceData={objectData}/>
                    )
                } else if ((this.state.status == "NEVER_COMPLETED") && (objectData.wasCompleted == false) && (objectData.date < moment())) {
                    someNeverCompleted = true
                    return (
                        <StepOccurrenceItem key={`ref_stepOccurrenceItem_${objectData.id}`}
                                            stepOccurrenceData={objectData}/>
                    )
                }
            }.bind(this));
        } else {
            if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }

        if (forMobile){
var objectNodes = <div style={{padding:'0px'}}><div className="largeItalic" style={{fontSize:'1.25em', lineHeight:'1.25em'}}>You don't have any steps to accomplish today.<Link to={"/search/"}> Find a program that fits your needs.</Link></div>
</div>



        } else {
            var objectNodes = <div><div className="largeItalic">You don't have any steps to accomplish today.<Link to={"/search/"}> Find a program that fits your needs.</Link></div>
                </div>
        }
        }

        return (
            //<div className="ui divided link items">
                    <div className="centeredContent">

                      <div className='ui three column  stackable grid'>
                          {someToDo == false && this.state.status == "TODO" ? <div><div className="largeItalic">Congratulations! You've completed all your steps for this period.</div>
                </div>: null}
                          {someCompleted == false && this.state.status == "COMPLETED" ? <div><div className="largeItalic">You've not completed any steps for this period.</div>
                </div>: null}
                          {someNeverCompleted == false && this.state.status == "NEVER_COMPLETED" ? <div><div className="largeItalic">No steps are locked and uncompleted for this period.</div>
                </div>: null}

                {objectNodes}
            </div>
                        </div>
        )
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class StepOccurrenceItem extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[],
            showingDetail:false,
            description:"",
            image:"",
            title:"",
            id:"",
            date:"",
            updateOccurrences:[],
            doneSaving: true,
            stepOccurrenceDoneSaving:true,
            updateOccurrenceDoneSaving:true,
            saved: "Save",




        }
    }

    toggleDetail () {
        if (this.state.showingDetail) {
            $(this.refs["ref_detail"]).slideUp();

            this.setState({showingDetail:false})

        } else {
            $(this.refs["ref_detail"]).slideDown();

            this.setState({showingDetail:true})


        }
    }


    componentDidMount = () => {
        if (this.props.stepOccurrenceData.previouslySaved == true) {
            this.setState({saved:"Saved"})
        } else {
            this.setState({saved:"Save"})
        }
        this.setState({
            id: this.props.stepOccurrenceData.id,
            title: this.props.stepOccurrenceData.step.title,
            image:this.props.stepOccurrenceData.step.image,
            description: this.props.stepOccurrenceData.step.description,
                            date: moment(this.props.stepOccurrenceData.date).format("MM/DD/YYYY HH:mm:SS"),

            updateOccurrences: this.props.stepOccurrenceData.updateOccurrences,
            data:this.props.stepOccurrenceData,


            showingDetail:false,
        },       () =>  {$(this.refs["ref_detail"]).hide()}
)




    };



    componentWillReceiveProps(nextProps) {
        if (this.state.data != nextProps.stepOccurrenceData) {
            this.setState({
                data: nextProps.stepOccurrenceData,
                id: nextProps.stepOccurrenceData.id,
                title: nextProps.stepOccurrenceData.step.title,
                date: moment(nextProps.stepOccurrenceData.date).format("MM/DD/YYYY hh:mm:ss"),
                image:nextProps.stepOccurrenceData.step.image,
                description: nextProps.stepOccurrenceData.step.description,
                updateOccurrences: nextProps.stepOccurrenceData.updateOccurrences,

            })
            if (nextProps.stepOccurrenceData.previouslySaved == true) {
            this.setState({saved:"Saved"})
        } else {
            this.setState({saved:"Save"})
        }
        }
    }





    handleAllSaved() {
        var theUrl = "/api/stepOccurrences/" + this.state.id + "/";
            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'GET',
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {

                    store.dispatch(updateStepOccurrence(data))
                    //if (this.state.stepOccurrenceDoneSaving) {
                    //    this.setState({doneSaving: true})
                    //}


                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                        saved: "Unsaved",
                    })

                }.bind(this)
            });

    }


    handleSubmit(updateOccurrence) {
        this.setState({doneSaving:false});
        this.setState({
            saved: "Saving"
        });
        /*var stepOccurrence = {
            id:this.state.id,
            wasCompleted: this.state.wasCompleted
        };

        var theUrl = "/api/stepOccurrences/" + this.state.id + "/";
            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'PUT',
                data: stepOccurrence,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    this.setState({
                        stepOccurrenceDoneSaving:true,
                    saved: "Saved"});
                    if (this.state.updateOccurrenceDoneSaving) {
                        this.setState({doneSaving:true})
                    }




                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                        saved:"Unsaved",
                    })

                }.bind(this)
            });*/
        if (updateOccurrence != undefined) {
            var theUrl = "/api/updateOccurrences/" + updateOccurrence.id + "/";
            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'PATCH',
                data: updateOccurrence,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    this.setState({
                        updateOccurrenceDoneSaving: true,
                        saved: "Saved",
                        doneSaving: true
                    });

                    //if (this.state.stepOccurrenceDoneSaving) {
                    //    this.setState({doneSaving: true})
                    //}


                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                        saved: "Unsaved",
                    })

                }.bind(this)
            });
        }

    }

    getInputs() {
        if ((this.state.updateOccurrences != undefined) && (this.state.updateOccurrences.length != 0)){

            return (
                <div>
<UpdateOccurrenceList data={this.state.updateOccurrences} allUpdateOccurrencesHaveBeenSaved={() => this.handleAllSaved()} />
                    </div>)
        } else {
            return(
            <div>
            </div>
            )

        }
    }



    render () {


        var theInputs = this.getInputs()
        if (this.state.data.step != undefined) {
            return (
                <div key={`ref_stepOccurrenceItem_${this.state.data.id}`}
                     className="column">

                    <div className="ui segment noBottomMargin noTopMargin">
                        <div onClick={this.toggleDetail}><ClippedImage item="plan" src={this.state.image}/>
                        </div>

                        <div className="stepOccurrenceTitle"
                             onClick={this.toggleDetail}>{this.state.title}{this.state.showingDetail ?
                            <i className="chevron up icon" style={{float: "right"}}></i> :
                            <i className="chevron down icon" style={{float: "right"}}></i>}
                        </div>
                        <div ref="ref_detail">
                            {this.state.data.step.type == "TIME" ? <div>{moment(this.state.date).format("dddd, MMMM Do, h:mma")}</div> : null}
                            <div className="itemDetailSmall">
                                <div dangerouslySetInnerHTML={{__html: this.state.description}}></div>
                            </div>
                        </div>
                        {theInputs}


                    </div>
                </div>
            )
        } else {
            return <div></div>
        }
        }


}

@connect(mapStateToProps, mapDispatchToProps)
export class StepOccurrenceDetailPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:"",

        }
    }




    loadStepOccurrence() {
    $.ajax({
      url: "/api/stepOccurrences/" + this.props.params.stepOccurrence_id + "/",
      dataType: 'json',
        type: 'GET',

      cache: false,
      success: function(stepOccurrenceData) {
        this.setState({
            data: stepOccurrenceData});

      }.bind(this),
      error: function(xhr, status, err) {
        console.error( "/api/stepOccurrences/" + this.props.params.program_id + "/", status, err.toString());
      }.bind(this),

    });
  };


    componentWillUnmount = () => {
        //clearInterval(this.state.stepsIntervalId);

    };






  componentDidMount() {
      this.loadStepOccurrence()

  }












    render() {
        if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }

        if (forMobile){

                var listNodeOrMobile = true}

        if (this.state.data != "") {
            return (
                <div>
                    <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen}/>

                    <div className="ui container footerAtBottom">
                        <div className="spacer">&nbsp;</div>
                        <div className="ui alert"></div>
                        <Breadcrumb values={[
                            {url: "/plan/view/" + this.props.params.program_id, label: "Plan Detail"},

                        ]}/>
                        <div>&nbsp;</div>
                                              <div className="ui three column stackable grid">


                        <StepOccurrenceItem stepOccurrenceData={this.state.data} />
                                                  </div>


                    </div>
                    <Footer />
                </div>

            )
        } else {
            return (<div></div>)
        }
    }
}

module.exports = { StepOccurrenceItem, StepOccurrenceList, StepOccurrenceDetailPage };