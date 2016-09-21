var React = require('react')
var ReactDOM = require('react-dom')
var $  = require('jquery');
global.rsui = require('react-semantic-ui')
var forms = require('newforms')



var ObjectListAndUpdate = React.createClass({
    loadObjectsFromServer: function () {
        $.ajax({
          url: this.props.url,
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

    getInitialState: function() {
        return {data: []};
    },

    componentDidMount: function() {
        this.loadObjectsFromServer()
        //setInterval(this.loadObjectsFromServer, this.props.pollInterval);

        var self = this;
    },
    render:function() {

        var model = this.props.model

        return (
            <div>
                <FormAction pageHeadingLabel={this.props.pageHeadingLabel} actionButtonLabel={this.props.actionButtonLabel} actionFormRef={this.props.actionFormRef} modelForm={this.props.modelForm}/>

                <ObjectList data={this.state.data}  pollInterval={2000} />

            </div>
        );
    }
});


var ObjectList = React.createClass({

    render: function() {

        if (this.props.data) {
            var objectNodes = this.props.data.map(function (objectData) {
                return (
                    <div className="ui fluid column" key={objectData.id}>{objectData.title}</div>
                )
            });
            console.log(objectNodes)
        };




        return (
            <div>
                {objectNodes}
            </div>
            )
}});

var FormAction = React.createClass({
    componentDidMount: function() {
        $(this.refs[this.props.actionFormRef]).hide()
    },
    toggle: function() {
        $(this.refs[this.props.actionFormRef]).slideToggle()
        $(this.refs['clickToToggleButton']).hide()
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var title = this.state.title;
        var deadline = this.state.deadline;
        var why = this.state.why;
        var votes = this.state.votes;
        var viewableBy = this.state.viewableBy;
        var image = this.state.image;
        var description = this.state.description;


        if (!description || !title ) {
        return;
        }
        this.props.onGoalSubmit({title: title, deadline:deadline, why:why, votes:votes, viewableBy:viewableBy, image:image, description: description});
        this.setState({title: '',  deadline: '', why: '', votes:0, image:'', description: '', viewableBy: 'Only me', });
    },

    render: function() {
        console.log("Modelform is" + this.props.modelForm)
        switch(this.props.modelForm) {
            case "PlanForm":
                var theForm = new PlanForm();
                break;
            case "StepForm":
                var theForm = new StepForm();
                break;
            default:
                break;
        }
        return (
            <div>
            <div className="ui grid">
                <div className="ui four wide column header"><h1>{this.props.pageHeadingLabel}</h1></div>
                <div className="ui right floated four wide column">
                    <button className="ui right floated primary large fluid button" ref="clickToToggleButton" onClick={this.toggle}>{this.props.actionButtonLabel}</button>
                </div>
            </div>
            <div ref={`${this.props.actionFormRef}`}><div className="ui form"><form onSubmit={this.handleSubmit}>
        <forms.RenderForm form={theForm} enctype="multipart/form-data" ref="theFormRef" />
                </form></div>
                <div className="ui grid">
                                        <div className="ui row">&nbsp;</div>

                    <div className="ui row">
                        <div className="ui eight wide column">&nbsp;</div>


                                <div className="ui four wide column"><button className="ui fluid button">Cancel</button></div>
                                <div className="ui  four wide column"><button type="submit" type="submit" form={theForm} className="ui primary fluid button">Save</button></div>


                    </div></div>

            </div></div>
        )
    }
})

var PlanForm = forms.Form.extend({

        rowCssClass: 'field',
        title: forms.CharField(),
        description:forms.CharField({widget: forms.Textarea()}),
        viewableBy:forms.ChoiceField({choices:["Only me": "ONLY_ME", "Just people I've shared this goal with": "SHARED", "Just my Pros": "MY_PROS", "All Pros": "ALL_PROS", "Everyone": "EVERYONE"]}),
        startDate: forms.CharField({widget: forms.DateTimeInput()}),
        endDate: forms.CharField({widget: forms.DateTimeInput()}),
        duration: forms.IntegerField(),
        durationMetric: forms.ChoiceField({choices:["weeks": "weeks", "days":"days", "months":"months", "years":"years"]}),
        calendar:forms.FileField({widget: forms.FileInput({attrs: {className: 'ui button', css:'opacity:0;'}}), label: "Import Calendar (.ics) File", css:"ui button"}),

    })


var StepForm = forms.Form.extend({
            rowCssClass: 'field',

        title: forms.CharField(),
        description: forms.CharField(),
        frequency: forms.MultipleChoiceField(),
        onMonday:forms.BooleanField(),
        onTuesday:forms.BooleanField(),
        onWednesday:forms.BooleanField(),
        onThursday:forms.BooleanField(),
        onFriday:forms.BooleanField(),
        onSaturday:forms.BooleanField(),
        onSunday:forms.BooleanField(),
        startDate: forms.MultipleChoiceField(),
        endDate: forms.MultipleChoiceField(),
    })


module.exports = {FormAction, ObjectList, ObjectListAndUpdate}
