var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {ObjectList, ObjectListAndUpdate, FormAction, Sidebar} from './base';
import {ObjectPage, PlanHeader} from './step';
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router';



$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    }
});


var theServer = 'https://192.168.1.156:8000/'


var ObjectCreationPage = React.createClass({
    componentWillMount: function() {

    },
    componentDidMount: function() {
        $(".fullPageDiv").hide();
        $(".fullPageDiv").slideToggle();


    },

    render:function() {

        if (this.props.params.plan_id) {
            return (

                <div className="fullPageDiv ">
                                        <div className="ui page container">

                <div className="spacer">&nbsp;</div>
                <div className="ui alert"></div>
                    <div className="ui large breadcrumb">
                         <Link to={`/`}><div className="section">Home</div></Link>
                            <i className="right chevron icon divider"></i>
                            <Link to={`/goals`}><div className="active section">My Goals</div></Link>
                        <i className="right chevron icon divider"></i>
                            <Link to={`/plans/${this.props.params.plan_id}/`}><div className="active section">Plan Detail</div></Link>
                    </div>
            <div>&nbsp;</div>
                    <PlanHeader url={`${theServer}api/plans/${this.props.params.plan_id}`} />
                    <div>&nbsp;</div>

                    <ObjectPage url={`${theServer}api/steps/`}
                                                               pageHeadingLabel="Steps"
                                                               actionButtonLabel="Add Step"
                                                               actionFormRef="stepForm"
                                                               modelForm="StepForm"/>


                </div></div>

            )
        }
        else if (this.props.params.goal_id) {
            return (


                <div className="fullPageDiv">
                    <div className="ui page container">
                <div className="spacer">&nbsp;</div>
                <div className="ui alert"></div>
                    <div className="ui large breadcrumb">
                         <Link to={`/`}><div className="section">Home</div></Link>
                            <i className="right chevron icon divider"></i>
                            <Link to={`/goals`}><div className="active section">My Goals</div></Link>
                        <i className="right chevron icon divider"></i>
                            <Link to={`/goals/${this.props.params.goal_id}/plans/`}><div className="active section">Goal Detail</div></Link>
                    </div>
                    <div>&nbsp;</div>
                    <GoalHeader url={`${theServer}api/goals/${this.props.params.goal_id}`} />
                    <div>&nbsp;</div>

                    <ObjectListAndUpdate url={`${theServer}api/plans/`} pageHeadingLabel="Plans" actionButtonLabel="Add Plan" actionFormRef="planForm" modelForm="PlanForm" />
                    {/*<PlanHeader url={`http://127.0.0.1:8000/api/goals/${this.props.params.goal_id}/plans`} />*/}


                </div>
    </div>

            )

        }
        else {
            return (

                <div className="fullPageDiv">
                                        <div className="ui page container">

                <div className="spacer">&nbsp;</div>
                <div className="ui alert"></div>
                    <div className="ui large breadcrumb">
                         <Link to={`/`}><div className="section">Home</div></Link>
                            <i className="right chevron icon divider"></i>
                            <Link to={`/goals/`}><div className="active section">My Goals</div></Link>
                        <i className="right chevron icon divider"></i>
                            <Link to={`/plans/`}><div className="active section">My Plans</div></Link>
                    </div>
                    <div>&nbsp;</div>
                    <ObjectListAndUpdate url={`${theServer}api/plans/`} pageHeadingLabel="Plans" actionButtonLabel="Add Plan" actionFormRef="planForm" modelForm="PlanForm" />
</div></div>

            );
        }
    }
});






var GoalHeader = React.createClass({
    loadObjectsFromServer: function () {
        console.log(this.props.url);
        $.ajax({
          url: this.props.url,
          dataType: 'json',
          cache: false,
          success: function(data) {

                  this.setState({
                      title:data.title,
                      description:data.description,
                      data: data});


          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      },

    getInitialState: function() {

        return {data: []};
    },

    componentDidMount: function() {
        this.loadObjectsFromServer();
          var intervalID = setInterval(this.loadObjectsFromServer, 2000);
        this.setState({intervalID:intervalID});

        var self = this;
    },

    componentWillUnmount: function() {
   // use intervalId from the state to clear the interval
   clearInterval(this.state.intervalId);
},

    render: function() {

        return (
            <div>
                        <div className="ui four wide column header"><h1>Goal</h1></div>
<div className="ui top attached primary button" >
                                  Goal
                                </div>
                <div className="ui segment noTopMargin two column grid">

                <div className="four wide column">
                    <img className="ui image" src='http://semantic-ui.com/images/avatar2/large/kristy.png'></img>
                    </div>

                        <div className="twelve wide column">
                            <div className="row">
                            <div className="sixteen wide column">
                                <h1>{this.state.title}</h1></div>
                        </div>


                            <div className="row">

                            <div className="sixteen wide column"> {this.state.description}</div>



                    </div>
                </div>
            </div>
                </div>
            )
}});




var StepContainer = React.createClass({
    render: function() {
        return (
        <ObjectListAndUpdate url={`${theServer}api/steps/`} pageHeadingLabel="Steps" actionButtonLabel="Add Step" actionFormRef="stepForm" model="step" />



        )
    }
});


var PlanFormAction = React.createClass({
    componentDidMount: function() {
        $(this.refs[this.props.actionFormRef]).hide()
    },
    toggle: function() {
        $(this.refs[this.props.actionFormRef]).slideToggle()
    },

    render: function() {
        return (
            <div>
            <div className="ui grid">
                <div className="ui four wide column header"><h1>{this.props.pageHeadingLabel}</h1></div>
                <div className="ui right floated four wide column">
                    <button className="ui right floated primary large fluid button" onClick={this.toggle}>{this.props.actionButtonLabel}</button>
                </div>
            </div>
            <div ref={`${this.props.actionFormRef}`}><div className="ui form"><form onSubmit={this._onSubmit}>
        <forms.RenderForm form={PlanForm} ref="planForm" />
        <button>Sign Up</button>
        </form></div></div>
            </div>
        )
    }
});

var FormRenderer = React.createClass({
        render:function() {
            var theModel = this.props.model;
            var theRef = this.props.divReference;
            var theActionLabel = this.props.actionLabel;
            var formClass = "ui form";

            return (
                                    <div className="ui form">

                <form onSubmit={this._onSubmit}>

                <forms.RenderForm  form={theModel} ref={theRef}/>
                <button>{theActionLabel}</button>

                </form></div>
            )
        },
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



module.exports = ObjectCreationPage, GoalHeader;