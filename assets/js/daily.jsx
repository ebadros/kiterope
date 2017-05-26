var React = require('react');
let ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {ImageUploader, Breadcrumb, PlanForm2, ProgramViewEditDeleteItem, FormAction, Sidebar, FormHeaderWithActionButton, DetailPage} from './base';
import autobind from 'class-autobind'


var Datetime = require('react-datetime');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
var MaskedInput = require('react-maskedinput');
var classNames = require('classnames');
import validator from 'validator';
import ValidatedInput from './app'
import Funnybar  from './search'

import { StandardSetOfComponents, ErrorReporter } from './accounts'

import { Provider, connect, store, dispatch } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './redux/containers'
import {StepOccurrenceItem, StepOccurrenceList } from './stepOccurrence'

import { theServer, s3IconUrl, formats, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, programScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, viewableByOptions, customStepModalStyles, notificationSendMethodOptions, TINYMCE_CONFIG } from './constants'
var moment = require('moment');
import {
  ShareButtons,
  ShareCounts,
  generateShareIcon
} from 'react-share';

const {
  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
  VKShareButton
} = ShareButtons;

const FacebookIcon = generateShareIcon('facebook');
const TwitterIcon = generateShareIcon('twitter');
const GooglePlusIcon = generateShareIcon('google');
const LinkedinIcon = generateShareIcon('linkedin');
const PinterestIcon = generateShareIcon('pinterest');
const VKIcon = generateShareIcon('vk');

$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    }
});

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
export class DailyList extends React.Component{
     constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            data:[]


        }
    }

    loadObjectsFromServer () {
        var periodRangeStart = new Date();
        var periodRangeEnd = new Date();
        periodRangeStart = moment(periodRangeStart).format('YYYY-MM-DD');
        periodRangeEnd = moment(periodRangeEnd).format('YYYY-MM-DD');
        var theUrl = theServer + "api/period/" + periodRangeStart + "/" + periodRangeEnd + "/"
        console.log("checking this url " + theUrl)

        $.ajax({
            url: theUrl,
            dataType: 'json',
            cache: false,
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                this.setState({data: data});

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(theUrl, status, err.toString());
            }.bind(this)
        });
    }

    componentDidMount () {
        this.loadObjectsFromServer();

        //var intervalID = setInterval(this.loadObjectsFromServer, 2000);
        //this.setState({intervalID: intervalID});

    }




    render () {
        var dateData, dateObject, readableDate;
        dateObject = new Date();
        readableDate = dateObject.toDateString();



        return (
           <div>
    <StandardSetOfComponents  modalIsOpen={this.state.signInOrSignUpModalFormIsOpen}/>





        <div className="fullPageDiv">
            <div className="ui page container footerAtBottom">


            <div className="spacer">&nbsp;</div>
            <div className="ui large breadcrumb">
                <Link to={`/#`}><div className="section">Home</div></Link>

                  <i className="right chevron icon divider"></i>
                  <Link to={`/#`}><div className="active section">Today's Work</div></Link>
            </div>
            <div>&nbsp;</div>
<div className="ui column header">
            <h1>{readableDate}</h1>
        </div>                    <StepOccurrenceList data={this.state.data}/>

                </div>
            </div>
    </div>


        )
    }
}



export class StepOccurrenceList2 extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            data: []


        }
    }


    componentDidMount() {
        this.setState({data: this.props.data})


    }

    componentWillReceiveProps(nextProps) {
        if (this.state.data != nextProps.data) {
            this.setState({data: nextProps.data})
        }
    }

    render() {

        if (this.state.data) {
            var objectNodes = this.state.data.map(function (objectData) {

                return (
                    <div key={objectData.id}>
                        <StepOccurrenceItem stepOccurrenceData={objectData}/>
                        <div>&nbsp;</div>
                    </div>
                )
            }.bind(this));
        } else {
            var objectNodes = () => {return (<div>You don't have any steps to accomplish today.</div>)}
        }
        return (
            //<div className="ui divided link items">
            <div className="sixteen wide column">
                {objectNodes}
            </div>
        )
    }
}

export class StepOccurrenceItem2 extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            data:[]


        }
    }


    componentDidMount() {
        this.setState({
            id: this.props.stepOccurrenceData.id,
            title: this.props.stepOccurrenceData.step.title,
            description: this.props.stepOccurrenceData.step.description,
            wasCompleted: this.props.stepOccurrenceData.wasCompleted,
        })


    }

    componentWillReceiveProps(nextProps) {
        if (this.state.data != nextProps.data) {
            this.setState({data: this.props.data})
        }
    }




    render () {

        return (
            <div>
                        <div className="ui top attached purple large button">Step</div>
                                        <div className="ui fluid noTopMargin segment">

                <div className="ui sixteen wide column">
                    <div className="ui grid">
                        <div className="three wide column">
                            <div className="ui center aligned middle aligned grid height-100">
                                <div className="ui sixteen wide column">
                            <div className="pretty success circle smooth huge-checkbox">
                            <input type="checkbox" id="id_wasCompleted" />
                                <label><i className="mdi mdi-check"></i> </label>
                        </div>
                        </div></div></div>

                        <div className="eight wide column">

                        <div className="header"><h1>{this.state.title}</h1></div>
                        <div className="header"><h3 dangerouslySetInnerHTML={{__html: this.state.description}} /></div>


                        </div>
                        <div className="four wide column">

                        <UpdateOccurrenceList stepOccurrenceId={this.props.stepOccurrenceData.id}/>
                    </div>
                    <div className="one wide center aligned column ">
                        <FacebookShareButton url="http://ericbadros.com" title="Eric Badros Page" description="Here's the description of the page"><FacebookIcon size={40} round={true} /></FacebookShareButton>
                        <TwitterShareButton url="http://ericbadros.com" title="Eric Badros Page" description="Here's the description of the page"><TwitterIcon size={40} round={true} /></TwitterShareButton>
                        <GooglePlusShareButton url="http://ericbadros.com" title="Eric Badros Page" description="Here's the description of the page"><GooglePlusIcon size={40} round={true} /></GooglePlusShareButton>
                        <LinkedinShareButton url="http://ericbadros.com" title="Eric Badros Page" description="Here's the description of the page"><LinkedinIcon size={40} round={true} /></LinkedinShareButton>
                    </div>
                </div>
                    </div></div></div>
        )
    }
}

export class UpdateOccurrenceList extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            data:[]


        }
    }

    loadObjectsFromServer () {
        //var periodRangeStart = new Date();
        //var periodRangeEnd = new Date();
        //periodRangeStart = moment(periodRangeStart).format('YYYY-MM-DD');
        //periodRangeEnd = moment(periodRangeEnd).format('YYYY-MM-DD');
        $.ajax({
            url: theServer + "api/stepOccurrences/" + this.state.stepOccurrenceId + "/updateOccurrences/",
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data.results});


            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    }

    componentDidMount () {
        this.setState({
            stepOccurrenceId: this.props.stepOccurrenceId,
        }, this.loadObjectsFromServer())


    }
    componentWillReceiveProps (nextProps) {
        if (this.state.stepOccurrenceId != nextProps.stepOccurrenceId)
            this.setState({stepOccurrenceId:nextProps.stepOccurrenceId})
    }



    render () {

        if (this.state.data) {
            var objectNodes = this.state.data.map(function (objectData) {

                return (
                        <div className="column">
                            <UpdateOccurrenceForm data={objectData}/>
                        </div>
                )
            }.bind(this));
        }
        return (
            //<div className="ui divided link items">
            <form className="ui form">

            <div className="ui one column grid">

                {objectNodes}
    <div className="ui row">
        <div className="sixteen wide column"><a className="ui orange fluid button">Update</a></div>
</div>
            </div>
                </form>

        )
}


}


var UpdateOccurrenceForm = React.createClass({



    componentDidMount: function() {
        var self = this;

    },

    getInitialState: function() {
      return {
          format:this.props.data.update.format,
          metricLabel:this.props.data.update.metricLabel,
          units:this.props.data.update.units,
          measuringWhat:this.props.data.update.measuringWhat,
      }
    },

    render: function() {

        return (
            //<div className="ui divided link items">
                <div className="ui row">
                    <ValidatedInput
                                        type="text"
                                        name="something"
                                        label={this.state.metricLabel}
                                        id="id_text"
                                        initialValue=""
                                        placeholder={this.state.measuringWhat}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleTextChange}

                                    />
                    {this.state.units}



</div>
        )
}


});

module.exports = DailyList, StepOccurrenceList;