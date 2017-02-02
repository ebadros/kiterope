var React = require('react');
let ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {ObjectList, ObjectListAndUpdate, FormAction, Sidebar } from './base'

var Datetime = require('react-datetime');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
var MaskedInput = require('react-maskedinput');
var classNames = require('classnames');
import validator from 'validator';
import ValidatedInput from './app'
import Funnybar  from './search'


var theServer = 'https://192.168.1.156:8000/'

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

var DailyList = React.createClass({

    loadObjectsFromServer: function () {
        //var periodRangeStart = new Date();
        //var periodRangeEnd = new Date();
        //periodRangeStart = moment(periodRangeStart).format('YYYY-MM-DD');
        //periodRangeEnd = moment(periodRangeEnd).format('YYYY-MM-DD');
        $.ajax({
            url: theServer + "api/period/2016-11-16/2016-12-20/",
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data.results});
                console.log("data.results " + data.results)


            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function () {
        this.loadObjectsFromServer();

        //var intervalID = setInterval(this.loadObjectsFromServer, 2000);
        //this.setState({intervalID: intervalID});

        var self = this;
    },

    getInitialState: function() {
        return {data: []};
    },

    render: function () {
        var dateData, dateObject, dateReadable;
        dateObject = new Date();
        dateReadable = dateObject.toDateString();



        return (
            <div>

            <div className="fullPageDiv">
                <div className="ui page container">

                <div className="spacer">&nbsp;</div>
                <div className="ui alert"></div>
                <div className="ui grid">
                    <div className="header"><h1>{dateReadable}</h1></div>
                    <StepOccurrenceList data={this.state.data}/>
                </div>
            </div>
    </div>
                </div>


        )
    }
});



var StepOccurrenceList = React.createClass({


    componentDidMount: function() {

        var self = this;
    },

    render: function() {

        if (this.props.data) {
            var objectNodes = this.props.data.map(function (objectData) {

                return (
                        <div key={objectData.id}>
                            <StepOccurrenceItem  stepOccurrenceData={objectData} />
                            <div>&nbsp;</div>
                        </div>
                )
            }.bind(this));
        }
        return (
            //<div className="ui divided link items">
            <div className="sixteen wide column">
                {objectNodes}
            </div>
            )
}});

var StepOccurrenceItem = React.createClass({

    componentDidMount:function() {
        var self = this;


    },

    getInitialState: function() {
                    console.log("stepOccurrence id " + this.props.key)

        return {
            id: this.props.stepOccurrenceData.id,
            title: this.props.stepOccurrenceData.step.title,
            description: this.props.stepOccurrenceData.step.description,
            wasCompleted: this.props.stepOccurrenceData.wasCompleted,




        };


    },


    render: function() {

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
});

var UpdateOccurrenceList = React.createClass({

    loadObjectsFromServer: function () {
        //var periodRangeStart = new Date();
        //var periodRangeEnd = new Date();
        //periodRangeStart = moment(periodRangeStart).format('YYYY-MM-DD');
        //periodRangeEnd = moment(periodRangeEnd).format('YYYY-MM-DD');
        $.ajax({
            url: theServer + "api/stepOccurrences/" + this.props.stepOccurrenceId + "/updateOccurrences/",
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({data: data.results});


            }.bind(this),
            error: function (xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function() {
        this.loadObjectsFromServer();
        var self = this;

    },

    getInitialState: function() {
      return {
          data:[],
      }
    },

    render: function() {

        if (this.state.data) {
            console.log("inside this.state.data")
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


});


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