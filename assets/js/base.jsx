var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
var ObjectPage = require('./step');
import autobind from 'class-autobind'
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'



var Global = require('react-global');

<Global values={{
  isSidebarVisible: 'false'
}} />

var theServer = 'https://192.168.1.156:8000/'



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
    handleFormSubmit: function (formData) {
    $.ajax({
        url: this.props.url,
        dataType: 'json',
        contentType: "application/json",

        type: 'POST',
        data: formData,

        success: function(data) {
            this.setState({data: data});
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
    render:function() {

        var model = this.props.model;

        return (
<div>
                <FormAction onFormSubmit={this.handleFormSubmit} pageHeadingLabel={this.props.pageHeadingLabel} actionButtonLabel={this.props.actionButtonLabel} actionFormRef={this.props.actionFormRef} modelForm={this.props.modelForm}/>

                <ObjectList data={this.state.data}  />

            </div>
        );
    }
});


var ObjectList = React.createClass({
    toggle: function(planId) {
        $(this.refs["planFormRef_" + planId]).slideToggle()
    },

    editPlan: function(planId) {
        $(this.refs["planFormRef_" + planId]).slideToggle();

    },

    componentDidMount: function() {
        $(this.refs[this.props.actionFormRef]).slideToggle();


    },

    componentDidUpdate: function() {
        $(".formForHiding").hide();

    },


    hideForm: function(planId) {
        console.log("hidden");
        $(this.refs["planFormRef_" + planId]).hide();

    },
    clearPage: function(plan_id) {
        $(".fullPageDiv").slideToggle("slow", function () {
        hashHistory.push('/plans/' + plan_id + '/steps')
            });

    },

    handleSubmit2: function(e) {
        console.log("handleSubmit called");
        e.preventDefault();
        var title = this.state.title;
        var viewableBy = this.state.viewableBy;
        var description = this.state.description;


        if (!description || !title ) {
        return;
        }
        this.props.onFormSubmit({title: title, viewableBy:viewableBy, description: description});
        this.setState({title: '',   description: '', viewableBy: 'Only me', });
    },

    render: function() {
        var theForm = new PlanForm();

        if (this.props.data) {
            var objectNodes = this.props.data.map(function (objectData) {

                return (
                    <div className="column " key={objectData.id} >
                        <div className="ui top attached green button" onClick={this.clearPage.bind(this, objectData.id)}>
                                  Plan
                                </div>
                    <div className="ui segment noBottomMargin noTopMargin">

                            <div className="row">
                                <button className="right floated ui small green button"  onClick={this.editPlan.bind(this, objectData.id)}>Edit Plan</button>
                                <h3>{objectData.title}</h3>
                            </div>
                            <div className="fluid row">Start Date (just as reference): {objectData.startDate}</div>
                            <div className="fluid row">Length: {objectData.scheduleLength} </div>
                            <div className="fluid row">{objectData.description}</div>

                        <div className="two wide column"><Link to={`/#/plans/${objectData.id}/steps`}>

</Link>
                    </div>
                    <div ref={`planFormRef_${objectData.id}`} className="sixteen wide row formForHiding">
                    <div ref="planForm1">
                        <div className="ui form">
                            <form onSubmit={this.handleSubmit}>
                                <forms.RenderForm form={theForm} enctype="multipart/form-data" ref="theFormRef"/>

                                <div className="ui grid">
                                    <div className="ui row">&nbsp;</div>

                                    <div className="ui row">


                                        <div className="eight wide column">
                                            <button className="ui fluid button" onClick={this.toggle.bind(this, objectData.id)}>Cancel</button>
                                        </div>
                                        <div className="eight wide column">
                                            <button className="ui primary fluid button" type="submit">Save</button>
                                        </div>


                                    </div>
                                                                        <div className="ui row">&nbsp;</div>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                        </div>

                        <div className="ui bottom attached purple button" onClick={this.clearPage.bind(this, objectData.id)}>
                                Steps
                                </div>
                        </div>









                )
            }.bind(this));
        }
        return (
            //<div className="ui divided link items">
            <div className="ui three column grid">
                {objectNodes}
            </div>
            )
}});



var FormAction = React.createClass({
    componentDidMount: function() {
        $(this.refs[this.props.actionFormRef]).hide()
    },
    toggle: function() {
        $(this.refs[this.props.actionFormRef]).slideToggle();
        $(this.refs['clickToToggleButton']).toggle()
    },

    handleSubmit: function(e) {
        console.log("handleSubmit called");
        e.preventDefault();
        var title = this.state.title;
        var viewableBy = this.state.viewableBy;
        var description = this.state.description;


        if (!description || !title ) {
        return;
        }
        this.props.onFormSubmit({title: title, viewableBy:viewableBy, description: description});
        this.setState({title: '',   description: '', viewableBy: 'Only me', });
    },


    render: function() {
        var buttonColor;
         switch(this.props.modelForm) {
            case "PlanForm":
                var theForm = new PlanForm();
                 buttonColor = "green";
                break;
            case "StepForm":
                var theForm = new StepForm();
                 buttonColor = "purple";

                break;
            default:
                 buttonColor = "blue";

                break;
        }
        return (
            <div>
            <div className="ui three column grid">
                <div className="ui column header"><h1>{this.props.pageHeadingLabel}</h1></div>
                <div className="ui right floated column">
                    <button className={`ui right floated  large fluid button ${buttonColor}`} ref="clickToToggleButton" onClick={this.toggle}>{this.props.actionButtonLabel}</button>
                </div>
            </div>
            <div ref={`${this.props.actionFormRef}`}><div className="ui form"><form onSubmit={this.handleSubmit}>
        <forms.RenderForm form={theForm} enctype="multipart/form-data" ref="theFormRef" />

                <div className="ui three column grid">
                                        <div className="ui row">&nbsp;</div>

                    <div className="ui row">
                        <div className="ui column">&nbsp;</div>


                                <div className="ui column"><button className="ui fluid button" onClick={this.toggle}>Cancel</button></div>
                                <div className="ui  column"><button type="submit" className="ui primary fluid button">Save</button></div>


                    </div></div>
</form></div>
            </div>
            </div>
        )
    }
});

var DynamicSelectButton2 = React.createClass({
    componentDidMount: function() {
        var self = this;
    },

    getInitialState: function() {
        return {
            value: this.props.initialValue,
        }
    },

  render: function () {
      var htmlToRender = "<div className='field'><label htmlFor='" + this.props.id + "'>" + this.props.label + "</label>";
      htmlToRender += "<select id='" + this.props.id + "' name='" + this.props.initialValue + "' >" ;

      for(var currentItem in this.props.items) {
          if (this.props.initialValue == currentItem){
              htmlToRender += "<option selected='selected' value='";
          }
          else {
              htmlToRender += "<option value='";
          }
          htmlToRender += "<option value='";
          htmlToRender += String(this.props[currentItem]);
          htmlToRender += "'>";
          htmlToRender += String(currentItem);
          htmlToRender += "</option>";

      }
      htmlToRender += "</select>";
    htmlToRender += "</div>";
    return (
<div dangerouslySetInnerHTML={{__html: htmlToRender}} />
      );

  }
});

var TimePicker = React.createClass({
    render: function(){
        return <Datetime
            renderDay={ this.renderDay }
            renderMonth={ this.renderMonth }
            renderYear={ this.renderYear }
        />;
    },
    renderDay: function( props, currentDate, selectedDate ){
        return "";
    },
    renderMonth: function( props, month, year, selectedDate){
        return "";
    },
    renderYear: function( props, year, selectedDate ){
        return "";
    }
});

var PlanForm = forms.Form.extend({

        rowCssClass: 'field',
        title: forms.CharField(),
        description:forms.CharField({widget: forms.Textarea()}),
        viewableBy:forms.ChoiceField({choices:["Only me": "ONLY_ME", "Just people I've shared this goal with": "SHARED", "Just my Pros": "MY_PROS", "All Pros": "ALL_PROS", "Everyone": "EVERYONE"]}),
        startDate: forms.CharField({widget: forms.DateTimeInput()}),
            endDate: forms.CharField({widget: forms.DateTimeInput()}),
        scheduleLength: forms.IntegerField(),
        //calendar:forms.FileField({widget: forms.FileInput({attrs: {className: 'ui button', css:'opacity:0;'}}), label: "Import Calendar (.ics) File", css:"ui button"}),


    })


var Sidebar = React.createClass({
    render: function() {

        if (Global.get('sidebarVisible') == 'true') {
            var isSidebarVisible = "";
        } else {
            var isSidebarVisible = "";
    }
        return (

            <div className={`ui left vertical inverted labeled icon ${isSidebarVisible} sidebar menu`}>
                            <div className="sidebar-spacer">&nbsp;</div>

                <Link className="item" to="/">
        <i className="home icon"></i>
        Home
    </Link>
    <Link className="item" to="/goals">
        <i className="block layout icon"></i>
        Goals
    </Link>
    <a className="item">
        <i className="smile icon"></i>
        Friends
    </a>
    <a className="item">
        <i className="calendar icon"></i>
        History
    </a>
    <a className="item">
        <i className="mail icon"></i>
        Messages
    </a>
    <a className="item">
        <i className="chat icon"></i>
        Discussions
    </a>
    <a className="item">
        <i className="trophy icon"></i>
        Achievements
    </a>
    <a className="item">
        <i className="shop icon"></i>
        Store
    </a>
    <a className="item">
        <i className="settings icon"></i>
        Settings
    </a>
  </div>
        )
    }
});


const dropzoneS3Style = {
    height: 200,
    border: 'dashed 2px #999',
    borderRadius: 5,
    position: 'relative',
    cursor: 'pointer',
  }

  const uploaderProps = {
    dropzoneS3Style,
    maxFileSize: 1024 * 1024 * 50,
    server: theServer,
    s3Url: 'https://kiterope.s3.amazonaws.com/images',
    signingUrlQueryParams: {uploadType: 'avatar'},
      uploadRequestHeaders: {'x-amz-acl': 'public-read','Access-Control-Allow-Origin':'*' },
      signingUrl: "signS3Upload",
  }

const s3ImageUrl = "https://kiterope.s3.amazonaws.com:443/"

export class ImageUploader extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            image:"",
        }
    }

    componentDidMount() {
        this.setState({
            defaultImage: this.props.defaultImage,
        })
    }

    handleFinishedUpload (value) {
            var fullUrl = value.signedUrl;
            var urlForDatabase = fullUrl.split("?")[0];
            urlForDatabase = urlForDatabase.replace(s3ImageUrl, "");
            this.setState({image: urlForDatabase});
    }

    render() {
                    var theImage = this.state.image

                    var theFilename = theImage.replace("https://kiterope.s3.amazonaws.com:443/images/", "");

        return (
            <div className="field">
            <label htmlFor="id_image">{this.props.label}</label>
            <DropzoneS3Uploader filename={theFilename} onFinish={this.handleFinishedUpload} {...uploaderProps} />
                </div>
        )
    }
}





module.exports = {
    FormAction,
    ObjectList,
    ObjectListAndUpdate,
    TimePicker,
    Sidebar,
    DynamicSelectButton2,
    ImageUploader,
}
