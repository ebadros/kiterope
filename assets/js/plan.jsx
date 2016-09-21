var React = require('react')
var ReactDOM = require('react-dom')
var $  = require('jquery');
global.rsui = require('react-semantic-ui')
var forms = require('newforms')
import {ObjectList, ObjectListAndUpdate, FormAction } from './base'

{/*
ObjectCreationPage
    ObjectListAndUpdate()
        PageHeadingBar('Plans', 'Add Plan' PlanForm)
        ObjectList('Plan')
        PlanContainer
            FormRenderer
                PlanForm
                    CharField('title');
                    CharField('description')
                    Charfield('viewableBy', withChoices="VIEWABLE_CHOICES")
                    DateTimeField('duration')
                    FormSubmissionActionButtons(planForm)
            StepContainer
                ObjectListAndUpdate()
                    PageHeadingBar('Steps', 'Add Step': StepForm)
                    ObjectListWithSubCreation('Step')
                    StepForm
                        CharField('description')
                        CharField('frequency')
                        WeeklyBooleanSet('onSunday', 'onMonday', etc.)
                        FormSubmissionActionButtons(stepForm)
                        */}

var ObjectCreationPage = React.createClass({
    render:function() {
        return (
            <div>
            <div className="spacer">&nbsp;</div>
            <div className="ui alert"></div>
                <ObjectListAndUpdate url="http://127.0.0.1:8000/api/plans/" pageHeadingLabel="Plans" actionButtonLabel="Add Plan" actionFormRef="planForm" modelForm="PlanForm" />
            </div>
        );
    }
});












var StepContainer = React.createClass({
    render: function() {
        return (
        <ObjectListAndUpdate url="http://127.0.0.1:8000/api/steps/" pageHeadingLabel="Steps" actionButtonLabel="Add Step" actionFormRef="stepForm" model="step" />



        )
    }
})


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
})

var FormRenderer = React.createClass({
        render:function() {
            var theModel = this.props.model;
            var theRef = this.props.divReference;
            var theActionLabel = this.props.actionLabel;
            var formClass = "ui form"

            return (
                                    <div className="ui form">

                <form onSubmit={this._onSubmit}>

                <forms.RenderForm  form={theModel} ref={theRef}/>
                <button>{theActionLabel}</button>

                </form></div>
            )
        },
    });






module.exports = ObjectCreationPage;