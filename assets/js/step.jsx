var React = require('react')
var ReactDOM = require('react-dom')
var $  = require('jquery');
global.rsui = require('react-semantic-ui')
var forms = require('newforms')
import {ObjectList, ObjectListAndUpdate, FormAction } from './base'


{/*
TopFrame
    StepFormAction
    StepList

BottomFrame
    PlanCalendar
        WeekView
            DayView
                StepItem
                */}

var ObjectPage = React.createClass( {
    render:function() {
        console.log("the modelform is" + this.props.modelForm)
        return (
            <div>
            <div className="spacer">&nbsp;</div>
            <div className="ui alert"></div>
                <ObjectListAndUpdate url={this.props.url} pageHeadingLabel={this.props.pageHeadingLabel} actionButtonLabel={this.props.actionButtonLabel} actionFormRef={this.props.actionFormRef} modelForm={this.props.modelForm} />

            </div>
        );
    }
});




module.exports = ObjectPage;