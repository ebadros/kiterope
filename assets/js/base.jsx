var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'

import autobind from 'class-autobind'
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'
import { GoalForm, GoalBasicView, SimpleGoalForm } from './goal'
import { UpdateItemMenu } from './update'

import { PlanForm, PlanBasicView, SimplePlanForm } from './plan'
import { ProgramForm, ProgramBasicView, SimpleProgramForm, ProgramSubscriptionModal, ProgramSubscriptionForm } from './program'

import { StepForm, StepBasicView, StepDetailView, SimpleStepForm, StepItemMenu } from './step'
import { ProfileItemMenu, ProfileForm, ProfileBasicView } from './profile'

import { ItemMenu } from './elements'
import  {store} from "./redux/store";


import { updateStep, removePlan, deleteContact, addPlan, addStep, updateProgram, deleteStep, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, addGoal, updateGoal, deleteGoal, setContacts, setStepOccurrences } from './redux/actions'

import { Provider, connect,  dispatch } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './redux/containers'
import Measure from 'react-measure'



import { Menubar, SignInOrSignUpModalForm, StandardSetOfComponents, ErrorReporter } from './accounts'

import {  theServer, s3IconUrl, s3ImageUrl, frequencyOptions, programScheduleLengths, timeCommitmentOptions, costFrequencyMetricOptions, viewableByOptions, formats, customStepModalStyles,TINYMCE_CONFIG, times, durations, userSharingOptions, notificationSendMethodOptions,metricFormatOptions } from './constants'

import { ContactItemMenu } from './contact'
function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}
var Global = require('react-global');

<Global values={{
  isSidebarVisible: 'false'
}} />;



export class Header extends React.Component {
     constructor(props) {
        super(props);
        autobind(this);
        this.state = {

        }
     }






    render() {
        return (
            <div className="ui three column grid">

        <div className="ui column header"><h1>{this.props.headerLabel}</h1></div>

                        </div>
        )
}
}

export class FormHeaderWithActionButton extends React.Component {
     constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            buttonLabel:"",
            showingForm:false

        }
     }

    componentDidMount() {
        this.setState({
                buttonLabel: this.props.buttonLabel
            })
    }



    handleActionClick = () => {
        this.props.actionClick()


    };

    componentWillReceiveProps(nextProps) {
        if (this.state.buttonLabel != nextProps.buttonLabel) {
            this.setState({
                buttonLabel: nextProps.buttonLabel
            })
        }



        if (this.state.showingForm != nextProps.formIsOpen) {
            this.setState({
                showingForm: nextProps.showingForm
            })
        }
    }





    render() {
        return (
            <div className="ui three column grid">

        <div className="ui column header">
            <h1>{this.props.headerLabel}</h1>
        </div>
                    <div className="ui right floated column">
                        <div className={`ui right floated ${this.props.color} medium fluid button`} onClick={this.handleActionClick}>{this.state.buttonLabel}</div>
                    </div>
                        </div>
        )
}
}





var FormAction = React.createClass({
    componentDidMount: function() {
        $(this.refs[this.props.actionFormRef]).hide()
    },
    toggle: function() {
        $(this.refs[this.props.actionFormRef]).slideToggle();
        $(this.refs['clickToToggleButton']).toggle()
    },

    handleSubmit: function(e) {
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

function getImageDimensions(imageNode) {
  var source = imageNode.src;
  var imgClone = document.createElement("img");
  imgClone.src = source;
  return {width: imgClone.width, height: imgClone.height}
}


export class ImageUploader extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            image:"",
            dimensions:{
                width:"",
                height:"",
            }

        }
    }

    componentDidMount() {
        this.setState({
            image: this.props.defaultImage,
            dimensions:this.props.dimensions

        })
    }

    handleGetImage () {
        var dom = ReactDOM.findDOMNode(this).children[0];


    }

    componentWillReceiveProps (nextProps) {
        if (this.state.defaultImage != nextProps.defaultImage) {
            this.setState({
                image: nextProps.defaultImage,
            })
        }

        if (this.state.dimensions != nextProps.dimensions) {
            this.setState({dimensions:nextProps.dimensions})
        }
    }

    handleFinishedUpload (value) {
            var fullUrl = value.signedUrl;
            var urlForDatabase = fullUrl.split("?")[0];
            urlForDatabase = urlForDatabase.replace(s3ImageUrl, "");
            this.setState({image: urlForDatabase});
        this.props.imageReturned({
            image:urlForDatabase
        })
    }

    render() {
        var theImage = this.state.image;

        var theFilename = theImage.replace("images/", "");
        if (this.state.dimensions) {
            var {width, height} = this.state.dimensions
        }
        var style = {
            width: (width - 28),
            height: 9 * (width - 28) / 16,
            border: 'dashed 2px #999',
            borderRadius: 0,
            position: 'relative',
            cursor: 'pointer',
        };


        var theClipping = "rect(0px," + (width - 32) + "px," + ((9 * (width - 32) / 16) - 2) + "px, 0px)";

        var imageStyle = {
            width: (width - 32),
            height: "auto",
            position: "absolute",
            clip: theClipping

        };

        var imageUploaderProps = {
            style,
            imageStyle,
            maxFileSize: 1024 * 1024 * 50,
            server: theServer,
            s3Url: 'https://kiterope-static.s3.amazonaws.com/images',
            signingUrlQueryParams: {uploadType: 'avatar'},
            uploadRequestHeaders: {'x-amz-acl': 'public-read', 'Access-Control-Allow-Origin': '*'},
            signingUrl: "signS3Upload",
        };


        return (


            <DropzoneS3Uploader filename={theFilename} onFinish={this.handleFinishedUpload} {...imageUploaderProps} >
            </DropzoneS3Uploader>

        )
    }
}




export class ViewEditDeleteItem extends React.Component {
     constructor(props) {
        super(props);
        autobind(this);
         this.state = {
             id:"",
             data:"",
             currentView:"",
             editable:false,
             serverErrors:""

         }
     }



     componentDidMount = () => {
         this.determineOptions();

         $(this.refs["ref_form"]).hide();
         $(this.refs["ref_detail"]).hide();

         if (this.props.currentView != undefined) {
             this.setState({
             data:this.props.data,
             currentView: this.props.currentView,
                 id: this.props.id,

         })}
         else {
             this.setState({
             data:this.props.data,
             currentView: "Basic",
                 id: this.props.id,

         })


             }
         this.handleComponentDidMountSpecificActions();

         this.showHideUIElements(this.props.currentView)


         };
         handleComponentDidMountSpecificActions() {

         }




    showHideUIElements = (callbackData) => {
        switch (callbackData) {

            case "Basic":

                this.switchToBasicView();
                break;
            case "Cancel":

                this.switchToBasicView();
                break;
            case "Detail":

                this.switchToDetailView();
                break;

            case "Edit":

                this.switchToEditView();
                break;
            case "Delete":
                this.deleteItem();
                break;
            case "Close":

                this.switchToClosedView();
                break;
            case "Duplicate":

                this.duplicateItem();
                break;

            case "Author":
                this.goToAuthorPage();
                break;

            default:
                break;


        }

    };



    duplicateItem = () => {
        var theUrl = this.props.apiUrl + this.props.id + "/duplicate";
        $.ajax({
            url: theUrl,
            dataType: 'json',
            cache: false,
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                this.reload()

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(theUrl, status, err.toString());
            }.bind(this),


        });

    };

    determineOptions = () => {

        var theURL = this.props.apiUrl + this.props.id +"/";
      $.ajax({
      url: theURL,
      dataType: 'json',
      cache: false,
          type: 'OPTIONS',
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
      success: function(data) {

          if (data.actions) {
              if (data.actions["PUT"]) {
                  this.setState({
                      editable: true
                  });
              }
          }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(theURL, status, err.toString());
      }.bind(this),


    });
  };

    componentWillReceiveProps = (nextProps) => {
        if (this.state.data != nextProps.data) {
            this.setState({
                data:nextProps.data,
            })
        }

        if (this.state.currentView != nextProps.currentView) {
            this.setState({
                currentView:nextProps.currentView,
            });
            this.showHideUIElements(nextProps.currentView)
        }

        if (this.state.serverErrors != nextProps.serverErrors) {
            this.setState({
                serverErrors:nextProps.serverErrors
            })
        }

    this.handleComponentWillReceivePropsSpecificActions(nextProps)



    };

    handleComponentWillReceivePropsSpecificActions = (nextProps) => {

    };

    cancelClicked = () => {
        this.switchToBasicView()
    };

    handleClick = (callbackData) => {
        this.setState({
            currentView:callbackData
        },this.showHideUIElements(callbackData))

    };

    switchToDetailView = () => {
        $(this.refs["ref_form"]).hide();
        $(this.refs["ref_detail"]).slideDown()

        };

    switchToEditView = () => {
        $(this.refs["ref_basic"]).hide();
        $(this.refs["ref_form"]).slideDown()


        };
    switchToClosedView = () => {
        $(this.refs["ref_basic"]).show();


        $(this.refs["ref_form"]).slideUp()
    };



     switchToBasicView = () => {
         $(this.refs["ref_detail"]).hide();
         $(this.refs["ref_form"]).slideUp();
         $(this.refs["ref_basic"]).slideDown()

    };

    getControlBar = () => {
        return(
        <ItemControlBar myRef="ref_itemControlBar"
                        label="Goal" click={this.handleClick}
                        currentView={this.state.currentView}
                        editable={this.state.editable}
                        showCloseButton={this.props.showCloseButton} />
        )
    };


    getBasicView = () => {
        return (
                        <div ref="ref_basic">

            <GoalBasicView data={this.state.data} />
                            </div>
        )
    };

    getEditView = () => {
        return(
                        <div ref="ref_form">

        <GoalForm myRef="ref_form"
                  editable={true}
                  onGoalSubmit={this.handleGoalSubmit}
                  cancelClicked={this.cancelClicked}
                  data={this.state.data}
                  serverErrors={this.state.serverErrors} />
                            </div>
        )
    };

    getDetailView = () => {
        return (
            <div ref="ref_detail">
        <SimpleGoalForm  editable={false} data={this.state.data} />
                </div>
        )


    };


    hideComponent = () => {
        //this.props.methodChange({isVisible:false})
        $(this.refs['ref_item']).slideUp();


    };


deleteItem = () => {
        var apiUrl = this.props.apiUrl;
        var theUrl = apiUrl + this.props.id + "/";

            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'DELETE',
                headers: {
                'Authorization': 'Token ' + localStorage.token
                },
                success: () => {
                    this.hideComponent();
                    this.callDeleteReducer();
                    //this.reload()
                },
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }
            });
        };






    closeWindowButtonClicked = () => {
        this.props.methodChange({isVisible:false});


         $(this.refs["ref_form"]).slideUp();
        $(this.refs["ref_basic"]).slideDown();
            this.setState ({ editButtonLabel: "Edit"});
                this.clearState();

    };

    reload = () => {
        this.props.reloadItem()
    };

    render() {


        var controlBar = this.getControlBar();
        var detailView = this.getDetailView();
        var basicView = this.getBasicView();
        var editView = this.getEditView();


        return (
            <div ref="ref_item">

                {controlBar}


                <div className="ui segment noBottomMargin noTopMargin">
                    {basicView}
                    {detailView}

                    <div className="sixteen wide row">

                        <div>

                            {editView}
                        </div>
                    </div>

                </div>

            </div>

        )
    }

}

export class GoalViewEditDeleteItem extends ViewEditDeleteItem {
    constructor(props) {
        super(props);
        autobind(this);
         this.state = {
             id:"",
             data:"",
             currentView:"Basic",
             serverErrors:""
         }
     }

     callDeleteReducer() {
      store.dispatch(deleteGoal(this.props.id))

  }




     handleGoalSubmit (goal, callback) {

         if (goal.id != "") {

             $.ajax({
                 url: "api/goals/" + goal.id +"/",
                 dataType: 'json',
                 type: 'PUT',
                 data: goal,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     store.dispatch(updateGoal(data));

                     this.setState({

                     currentView:"Basic",
                         serverErrors:""
                     });
                     this.switchToBasicView();
                     callback



                 }.bind(this),
                 error: function (xhr, status, err) {
                     console.error(this.props.url, status, err.toString());
                      var serverErrors = xhr.responseJSON;
                     this.setState({
                            serverErrors:serverErrors,
                })

                 }.bind(this)
             });
         }
         else {
             $.ajax({
                 url: "api/goals/",
                 dataType: 'json',
                 type: 'POST',
                 data: goal,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                                          store.dispatch(addGoal(data));

                     this.setState({
                         data: data,
                     currentView:"Basic",
                         serverErrors:""
                     });
                     this.switchToBasicView();
                     callback

                 }.bind(this),
                 error: function (xhr, status, err) {
                     console.error(this.props.url, status, err.toString());
                      var serverErrors = xhr.responseJSON;
                     this.setState({
                            serverErrors:serverErrors,
                })

                 }.bind(this)
             });
         }


  }

    getControlBar = () => {
        return(
        <ItemControlBar myRef="ref_itemControlBar"
                        label="Goal"
                        click={this.handleClick}
                        currentView={this.state.currentView}
                        editable={this.state.editable}
                        showCloseButton={this.props.showCloseButton} />
        )
    };


    getBasicView = () => {
        return (
                        <div ref="ref_basic">

            <GoalBasicView data={this.state.data} />
                            </div>
        )
    };

    getEditView = () => {
        return(
                        <div ref="ref_form">

        <GoalForm myRef="ref_form"
                  editable={true}
                  onGoalSubmit={this.handleGoalSubmit}
                  cancelClicked={this.cancelClicked}
                  data={this.state.data}
                  serverErrors={this.state.serverErrors}/>
                            </div>
        )
    };

    getDetailView = () => {
        return (
            <div ref="ref_detail">
        <SimpleGoalForm  editable={false} data={this.state.data} />
                </div>
        )


    };

    render() {

        var controlBar = this.getControlBar();
        var detailView = this.getDetailView();
        var basicView = this.getBasicView();
        var editView = this.getEditView();

        return (
            <div>
                {controlBar}


                <div className="ui segment noBottomMargin noTopMargin">
                    <div onClick={this.handleClick}>{basicView}</div>
                    {detailView}

                    <div className="sixteen wide row">

                        <div>

                            {editView}
                        </div>
                    </div>

                </div>

            </div>

        )
    }

}

@connect(mapStateToProps, mapDispatchToProps)
export class ProgramViewEditDeleteItem extends ViewEditDeleteItem {
    constructor(props) {
        super(props);
        autobind(this);
         this.state = {
             id:"",
             data:"",
             currentView:"Basic",
             serverErrors:"",
             openModal:false,
             modalShouldClose:false,
             userPlanOccurrenceId:"",

         }
     }

     goToAuthorPage() {

         hashHistory.push("/profiles/" + this.state.data.author)

     }

     callDeleteReducer() {
      store.dispatch(deleteProgram(this.props.id))

  }



     handleComponentDidMountSpecificActions() {
         if (this.props.userPlanOccurrenceId) {
             this.setState({userPlanOccurrenceId: this.props.userPlanOccurrenceId})
         }

         }


     reload = () => {
         this.props.reloadItem()
     };

     handleModalClick = (callbackData) => {
      switch(callbackData.action) {
          case ("existing"):
              hashHistory.push("/search");
              break;
          case ("create"):
              this.handleOpenForm();
              break;
          case ("kiterope"):
              hashHistory.push("/goalEntry");
              break;
      }
  };



  handleComponentWillReceivePropsSpecificActions = (nextProps) => {
       if (this.state.userPlanOccurrenceId != nextProps.userPlanOccurrenceId) {
          this.setState({userPlanOccurrenceId: nextProps.userPlanOccurrenceId})
      }

    };




    handleProgramSubmit (program, callback) {
         if (program.id != "") {
             var theUrl = "api/programs/" + program.id +"/";

             $.ajax({
                 url: theUrl,
                 dataType: 'json',
                 type: 'PUT',
                 data: program,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     this.switchToBasicView();

                     store.dispatch(updateProgram(data));

                     this.setState({
                        serverErrors:"",
                         currentView:"Basic"
                     });
                     callback

                 }.bind(this),
                 error: function (xhr, status, err) {
                     var serverErrors = xhr.responseJSON;
            this.setState({
                serverErrors:serverErrors,
            })

                 }.bind(this)
             });
         }
         else {
             var theUrl = "api/programs/" + program.id +"/";

             $.ajax({
                 url: theUrl,
                 dataType: 'json',
                 type: 'POST',
                 data: program,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     this.setState({data: data});
                     this.switchToBasicView();
                     callback

                 }.bind(this),
                 error: function (xhr, status, err) {
                     console.error(theUrl, status, err.toString());
                     var serverErrors = xhr.responseJSON;
            this.setState({
                serverErrors:serverErrors,
            })

                 }.bind(this)
             });
         }


  }



    getControlBar = () => {
        return(
        <ItemControlBar myRef="ref_itemControlBar"
                        label="Program"
                        click={this.handleClick}
                        currentView={this.state.currentView}
                        editable={this.state.editable}
                        showCloseButton={this.props.showCloseButton} />
        )
    };


    getBasicView = () => {
        return (
                        <div ref="ref_basic">

            <ProgramBasicView data={this.state.data} isListNode={this.props.isListNode} />
                            </div>
        )
    };

    getEditView = () => {
        return(
                        <div ref="ref_form">

        <ProgramForm isListNode={this.props.isListNode}
                  myRef="ref_form" editable={true}
                  onProgramSubmit={this.handleProgramSubmit}
                  cancelClicked={this.cancelClicked}
                  data={this.state.data}
                  serverErrors={this.state.serverErrors} />
                            </div>
        )
    };

    getDetailView = () => {

        if (this.state.data != null) {
            return (
                <div ref="ref_detail">
                    <div className="itemDetailSmall">
                        <div dangerouslySetInnerHTML={{__html: this.state.data.description}}></div>
                    </div>
                </div>
            )
        }
        else return (<div></div>)


    };

    handleModalClosed = () =>  {
        this.setState({
            signInOrSignUpModalFormIsOpen:false,
        })
    };

    handleSubscribeClick = () => {
        if (this.props.storeRoot.user != undefined) {
            this.setState({
                    openModal: true
                })

            }
         else {
            this.setState({
                    signInOrSignUpModalFormIsOpen: true
                })
        }

    };


    handleCloseModalClicked = () => {
        this.setState({openModal:false})
    };


hideComponent = () => {
        //this.props.methodChange({isVisible:false})
        $(this.refs['ref_programItem_' + this.props.id]).slideUp();


    };

    handleUnsubscribeClick = () => {
        if (this.state.userPlanOccurrenceId) {
            var theUrl = "api/planOccurrences/" + this.state.userPlanOccurrenceId + "/";
            var planOccurrence = {
                isSubscribed: false,

            };
            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'PATCH',
                data: planOccurrence,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    console.log("success");
                    this.state.data.isSubscribed = false;
                    store.dispatch(removePlan(this.state.userPlanOccurrenceId))


                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                    //var serverErrors = xhr.responseJSON;
                    //   this.setState({
                    //       serverErrors:serverErrors,
                    //})

                }.bind(this)
            });
        }

    };




    render() {

        var controlBar = this.getControlBar();
        var detailView = this.getDetailView();
        var basicView = this.getBasicView();
        var editView = this.getEditView();


        if (this.state.data) {
            if (this.state.data.isSubscribed) {
                var subscribeButton = <div className="ui purple bottom attached large button"
                                           onClick={this.handleUnsubscribeClick}>Unsubscribe</div>

            } else if (!this.state.data.isSubscribed) {

                var subscribeButton = <div className="ui purple bottom attached large button"
                                           onClick={this.handleSubscribeClick}>Subscribe</div>
            }

        }
        if (this.props.storeRoot.user) {
            if (this.state.data.author == this.props.storeRoot.user.id) {
                subscribeButton = null
            }
        }








        return (

            <div ref={`ref_programItem_${this.props.id}`} className="column">
                <SignInOrSignUpModalForm modalIsOpen={this.state.signInOrSignUpModalFormIsOpen} modalShouldClose={this.handleModalClosed} />

                                {this.props.hideControlBar ? null : controlBar}

<ProgramSubscriptionModal  closeModalClicked={this.handleCloseModalClicked}
              click={this.handleModalClick}
              modalIsOpen={this.state.openModal}
              header="Subscribe to a plan"
              description="You can subscribe to a plan created by a coach, create your own plan, or let Kiterope create a plan for you."
              program={this.state.data}
/>

                <div className="ui segment noBottomMargin noTopMargin">
                    <div>{basicView}</div>
                    {detailView}

                    <div className="sixteen wide row">

                        <div>

                            {editView}
                        </div>
                    </div>

                </div>{subscribeButton}

            </div>

        )
    }

}

export class PlanViewEditDeleteItem extends ViewEditDeleteItem {
    constructor(props) {
        super(props);
        autobind(this);
         this.state = {
             id:"",
             data:"",
             currentView:"Basic",
             serverErrors:"",
             openModal:false,

         }
     }
     goToAuthorPage() {

         hashHistory.push("/profiles/" + this.state.data.author)

     }


     handleModalClick = (callbackData) => {
      switch(callbackData.action) {
          case ("existing"):
              hashHistory.push("/search");
              break;
          case ("create"):
              this.handleOpenForm();
              break;
          case ("kiterope"):
              hashHistory.push("/goalEntry");
              break;
      }
  };



     handlePlanSubmit (planOccurrence, callback) {

         if (plan.id != "") {

             $.ajax({
                 url: "api/planOccurrences/" + planOccurrence.id +"/",
                 dataType: 'json',
                 type: 'PUT',
                 data: plan,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     this.setState({
                         data: data,
                        serverErrors:"",
                         currentView:"Basic"
                     });
                     this.switchToBasicView();
                     callback




                 }.bind(this),
                 error: function (xhr, status, err) {
                     console.error(this.props.url, status, err.toString());
                     var serverErrors = xhr.responseJSON;
            this.setState({
                serverErrors:serverErrors,
            })

                 }.bind(this)
             });
         }
         else {
             $.ajax({
                 url: "api/plans/",
                 dataType: 'json',
                 type: 'POST',
                 data: plan,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     this.setState({data: data});
                     this.switchToBasicView();
                     callback

                 }.bind(this),
                 error: function (xhr, status, err) {
                     console.error(this.props.url, status, err.toString());
                     var serverErrors = xhr.responseJSON;
            this.setState({
                serverErrors:serverErrors,
            })

                 }.bind(this)
             });
         }


  }



    getControlBar = () => {
        return(
        <ItemControlBar myRef="ref_itemControlBar"
                        label="Plan"
                        click={this.handleClick}
                        currentView={this.state.currentView}
                        editable={this.state.editable}
                        showCloseButton={this.props.showCloseButton} />
        )
    };


    getBasicView = () => {
        return (
                        <div ref="ref_basic">

            <PlanBasicView data={this.state.data} isListNode={this.props.isListNode} />
                            </div>
        )
    };

    getEditView = () => {
        return(
                        <div ref="ref_form">

        <PlanForm isListNode={this.props.isListNode}
                  myRef="ref_form" editable={true}
                  onSubmit={this.handlePlanSubmit}
                  cancelClicked={this.cancelClicked}
                  data={this.state.data}
                  serverErrors={this.state.serverErrors} />
                            </div>
        )
    };

    getDetailView = () => {

        if (this.state.data != null) {
            return (
                <div ref="ref_detail">
                    <div className="itemDetailSmall">
                        <div dangerouslySetInnerHTML={{__html: this.state.data.description}}></div>
                    </div>
                </div>
            )
        }
        else return (<div></div>)


    };

    handleUnsubscribeClick = () => {
      if (this.state.openModal == false) {
          this.setState({
              openModal:true
          })

      }

    };


    handleCloseModalClicked = () => {
        this.setState({openModal:false})
    };


hideComponent = () => {
        //this.props.methodChange({isVisible:false})
        $(this.refs['ref_planOccurrenceItem_' + this.props.id]).slideUp();


    };



    render() {

        var controlBar = this.getControlBar();
        var detailView = this.getDetailView();
        var basicView = this.getBasicView();
        var editView = this.getEditView();


        return (
            <div ref={`ref_planOccurrenceItem_${this.props.id}`} className="column">
                                {this.props.hideControlBar ? null : controlBar}

<ProgramSubscriptionModal  closeModalClicked={this.handleCloseModalClicked}
              click={this.handleModalClick}
              modalIsOpen={this.state.openModal}
              header="Subscribe to a plan"
              description="You can subscribe to a plan created by a coach, create your own plan, or let Kiterope create a plan for you."
              program={this.state.data}
/>

                <div className="ui segment noBottomMargin noTopMargin">
                    <div>{basicView}</div>
                    {detailView}
                    {editView}

                </div><div className="ui purple bottom attached large button" onClick={this.handleUnsubscribeClick}>Unsubscribe</div>

            </div>

        )
    }

}

@connect(mapStateToProps, mapDispatchToProps)
export class ProfileViewEditDeleteItem extends ViewEditDeleteItem {
    constructor(props) {
        super(props);
        autobind(this);
         this.state = {
             id:"",
             data:"",
             currentView:"Basic",
             serverErrors:"",
         }
     }

     callDeleteReducer() {
        store.dispatch(deleteContact(this.props.contact))
    }

     removeContact = () => {
        var theUrl = "api/contacts/" + this.props.contact + "/";

            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'DELETE',
                headers: {
                'Authorization': 'Token ' + localStorage.token
                },
                success: () => {
                    this.hideComponent();
                    this.callDeleteReducer();
                    //this.reload()
                },
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }
            });
        };



     handleProfileSubmit (profile, callback) {

            var theURL =  "api/profiles/" + profile.id +"/";
             $.ajax({
                 url: theURL ,
                 dataType: 'json',
                 type: 'PUT',
                 data: profile,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     this.setState({
                         data: data,
                     currentView:"Basic"
                     });
                     this.switchToBasicView();


                     callback



                 }.bind(this),
                 error: function (xhr, status, err) {
                     console.error(theURL, status, err.toString());
                     var serverErrors = xhr.responseJSON;
            this.setState({
                serverErrors:serverErrors,
            })

                 }.bind(this)
             });
         }

     componentWillReceiveProps = (nextProps) => {
        if (this.state.data != nextProps.data) {
            this.setState({
                data:nextProps.data,
            })
        }

        if (this.state.currentView != nextProps.currentView) {
            this.setState({
                currentView:nextProps.currentView,
            });
            this.showHideUIElements(nextProps.currentView)
        }

        if (this.state.id != nextProps.id) {
            this.setState({
                id:nextProps.id,
            });
            this.determineOptions()
        }
        if (nextProps.storeRoot != undefined) {
            if (this.state.user != nextProps.storeRoot.user) {
                this.setState({
                    user: nextProps.storeRoot.user
                })
            }
        }



    };



    handleClick = (callbackData) => {
        switch (callbackData) {
            case("Add Contact"):
                this.addAsCoach();
                break;
            case("Add as Client"):
                this.addAsClient();
                break;
            case("Remove Contact"):
                this.removeContact();
                break;
            default:
                this.setState({
                    currentView: callbackData
                }, this.showHideUIElements(callbackData));
                break;

        }
    };


    addAsCoach = () => {
        var theUrl = "api/contacts/";
        var theContact = {
            sender:this.state.user.id,
            receiver: this.state.data.user,
            relationship: "coach",
            wasConfirmed:"sender",
        };
        $.ajax({
                 url: theUrl,
                 dataType: 'json',
                 type: 'POST',
                 data: theContact,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     store.dispatch(addContact(data))



                 }.bind(this),
                 error: function (xhr, status, err) {
                     var serverErrors = xhr.responseJSON;
            this.setState({
                serverErrors:serverErrors,
            })

                 }.bind(this)
             });

    };




    getControlBar = () => {
        if (this.props.contact != undefined) {
            var theLabel = "Contact"
        } else {
            var theLabel = "Profile"
        }
        return(
        <ItemControlBar myRef="ref_itemControlBar"
                        label={theLabel}
                        click={this.handleClick}
                        currentView={this.state.currentView}
                        editable={this.state.editable}
                        showCloseButton={this.props.showCloseButton} />
        )
    };


    getBasicView = () => {
        return (
                        <div ref="ref_basic">

            <ProfileBasicView data={this.state.data} isListNode={this.props.isListNode} />
                            </div>
        )
    };

    getEditView = () => {
        return(
                        <div ref="ref_form">

        <ProfileForm isListNode={this.props.isListNode}
                     myRef="ref_form" editable={true}
                     onSubmit={this.handleProfileSubmit}
                     cancelClicked={this.cancelClicked}
                     data={this.state.data}
        serverErrors={this.state.serverErrors} />
                            </div>
        )
    };

    getDetailView = () => {

        return (
            <div ref="ref_detail">
                            <div className="itemDetailSmall">
                                <div dangerouslySetInnerHTML={{__html: this.state.data.bio}} ></div>
                            </div>
                </div>
        )


    };
    handleContactClicked =() => {

    };


hideComponent = () => {
        //this.props.methodChange({isVisible:false})
        $(this.refs['ref_profileItem_' + this.props.id]).slideUp();


    };


    render() {

        var controlBar = this.getControlBar();
        var detailView = this.getDetailView();
        var basicView = this.getBasicView();
        var editView = this.getEditView();

        if (this.props.storeRoot.user) {
        return (

            <div ref={`ref_profileItem_${this.props.id}`} className="column">
                {controlBar}


                <div className="ui segment noBottomMargin noTopMargin">
                    <div>{basicView}</div>
                    {detailView}

                    <div className="sixteen wide row">

                        <div>

                            {editView}
                        </div>
                    </div>

                </div>{ this.props.storeRoot.user.id != this.state.data.user ? <div className="ui purple bottom attached large button" onClick={this.handleContactClicked}>Contact</div>:null}

            </div>

        )}
        else return (

            <div ref={`ref_profileItem_${this.props.id}`} className="column">
                {controlBar}


                <div className="ui segment noBottomMargin noTopMargin">
                    <div>{basicView}</div>
                    {detailView}

                    <div className="sixteen wide row">

                        <div>

                            {editView}
                        </div>
                    </div>

                </div><div className="ui purple bottom attached large button">Contact</div>

            </div>

        )
    }

}
export class StepViewEditDeleteItem extends ViewEditDeleteItem {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            id: "",
            data: "",
            currentView: "",
            editable: false,
            serverErrors: ""

        }
    }

    duplicateItem = () => {
        var theUrl = this.props.apiUrl + this.props.id + "/duplicate/";
        $.ajax({
            url: theUrl,
            dataType: 'json',
            cache: false,
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                store.dispatch(addStep(this.props.parentId, data));

                this.reload()

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(theUrl, status, err.toString());
            }.bind(this),


        });

    };

    callDeleteReducer() {
        store.dispatch(deleteStep(this.props.parentId, this.props.id))
    }

    switchToEditView = () => {
        $(this.refs["ref_basic"]).hide();
        $(this.refs["ref_form"]).slideDown();
        this.props.currentViewChanged("Edit")


    };

    switchToBasicView = () => {
        $(this.refs["ref_detail"]).hide();
        $(this.refs["ref_form"]).slideUp();
        $(this.refs["ref_basic"]).slideDown();
        this.props.currentViewChanged("Basic")

    };

    componentDidMount = () => {

        $(this.refs["ref_form"]).hide();
        $(this.refs["ref_detail"]).hide();

        if (this.props.currentView != undefined) {
            this.setState({
                data: this.props.data,
                currentView: this.props.currentView,

            })
        }
        else {
            this.setState({
                data: this.props.data,
                currentView: "Basic",
                serverErrors: this.props.serverErrors

            })

        }

        this.showHideUIElements(this.props.currentView)

    };


    reload = () => {
        this.props.reloadItem()
    };

    handleStepSubmit = (step, callback) => {
        if (step.id != undefined) {

            var theUrl = "api/steps/" + step.id + "/";
            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'PUT',
                data: step,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    store.dispatch(updateStep(data.program, data));

                    this.setState({
                        updates:[],
                    });

                    this.switchToBasicView();
                    callback;
                    this.reload()


                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                    })

                }.bind(this)
            });
        }
        else {

            $.ajax({
                url: "api/steps/",
                dataType: 'json',
                type: 'POST',
                data: step,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    store.dispatch(addStep(data.program, data));
                    this.switchToBasicView();
                    callback;
                    //this.reload()


                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                    })

                }.bind(this)
            });
        }


    };

    switchToClosedView = () => {
        this.props.closeClicked();
        this.switchToBasicView();

        //$(this.refs["ref_basic"]).show()


        //$(this.refs["ref_form"]).slideUp()
    };


    getControlBar = () => {

        var thePermissions = false;
        if (this.state.data) {
            thePermissions = this.state.data.permissions
        }

        return (
            <ItemControlBar myRef="ref_itemControlBar"
                            label="Step"
                            click={this.handleClick}
                            currentView={this.state.currentView}
                            editable={thePermissions}
                            showCloseButton={this.props.showCloseButton}/>
        )
    };


    getBasicView = () => {
        return (
            <div ref="ref_basic" >

                <StepBasicView data={this.state.data}
                               isListNode={this.props.isListNode}/>
            </div>
        )
    };

    getEditView = () => {

            return (
                <div ref="ref_form">

                    <StepForm parentId={this.props.parentId}
                              isListNode={this.props.isListNode}
                              myRef="ref_form"
                              editable={true}
                              onSubmit={this.handleStepSubmit}
                              cancelClicked={this.cancelClicked}
                              data={this.state.data}
                              serverErrors={this.state.serverErrors}/>
                </div>
            )

    };


    getDetailView = () => {
        return (
            <div ref="ref_detail">
                <div className="row">&nbsp;</div>
                <StepDetailView data={this.state.data}
                                isListNode={this.props.isListNode}/>
                {/* <SimpleStepForm  parentId={this.props.parentId} isListNode={this.props.isListNode} editable={false} data={this.state.data} />*/}
            </div>
        )


    };

     /*handleClick() {
         if (this.props.id) {
             hashHistory.push("/steps/" + this.props.id + "/updates")
         }
     }*/

    render() {
        var controlBar = this.getControlBar();
        var detailView = this.getDetailView();
        var basicView = this.getBasicView();
        var editView = this.getEditView();


        return (
            <div ref={`ref_stepItem_${this.props.id}`} className="column">
                {controlBar}


                <div className="ui segment noBottomMargin noTopMargin">
                    <div >{basicView}</div>
                    {detailView}

                    <div className="sixteen wide row">

                        <div>

                            {editView}
                        </div>
                    </div>

                </div>

            </div>
        )


    }
}

// <ItemControlBarButton myRef="ref_editButton" label="Edit" clicked={this.handleEditClicked} />
export class ItemControlBarButton extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
         this.state = {

         }
     }

     handleClick = (callbackData) => {
         this.props.click(callbackData)
     };



    render() {
        var theMarkup;
        switch(this.props.label) {
            case("Detail"):
                return (<div className="ui dropdown item controlButtonMargin"><div className="ui extramini image"><img className="menuIcon" src={`${s3IconUrl}viewDark.svg`} onClick={this.handleClick} /></div></div>);
            case("Edit"):
                return (<div className="ui dropdown item controlButtonMargin"><div className="ui extramini image"><img className="" src={`${s3IconUrl}editDark.svg`} onClick={this.handleClick} /></div></div>);
            case("Cancel"):
                return (<div className="ui dropdown item controlButtonMargin"><div className="ui extramini image"><img className="menuIcon"  src={`${s3IconUrl}hideDark.svg`} onClick={this.handleClick} /></div></div>);
            case("Menu"):
                switch(this.props.menuType) {
                    case("Contact"):
                        return (<ContactItemMenu click={this.handleClick}/>);
                    case("Profile"):
                        return (<ProfileItemMenu click={this.handleClick}/>);
                    case("Goal"):
                        return (<ItemMenu click={this.handleClick}/>);
                    case("Plan"):
                        return (<ItemMenu click={this.handleClick}/>);
                    case("Program"):
                        return (<ItemMenu click={this.handleClick}/>);
                    case("Step"):
                        return (<StepItemMenu click={this.handleClick}/>);
                    case("Update"):
                        return (<UpdateItemMenu click={this.handleClick}/>)


                }
             case("Close"):
                return (<div className="ui dropdown item controlButtonMargin"><div className="ui extramini image"><img className="menuIcon"  src={`${s3IconUrl}closeDark.svg`} onClick={this.handleClick} /></div></div>)


        }




    }
    render2() {


            return (
                <div ref={this.props.myRef}
                     className="ui column small smallPadding center aligned raspberry-inverted button"
                     onClick={this.clicked}><i className="edit icon"/></div>
            )

    }
}

export class ItemControlBarButtonSpacer extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {}
    }

    render() {

        return (

            <div ref={this.props.myRef} className="ui column">&nbsp;</div>

        )
    }
}


export class ControlBarButtonConfiguration extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            editable: false,
            currentView: "Basic", // basicView, detailView, editView
        }

    }
    componentWillReceiveProps = (nextProps) => {

            if (this.state.currentView != nextProps.currentView ) {
                    this.setState({
                        currentView:nextProps.currentView,
                    })
                }

    };

    handleCancelClicked = () => {
        this.props.click("Basic")
    };

    handleDetailClicked = () => {

        this.props.click("Detail")
    };

    handleEditClicked = () =>  {

        this.props.click("Edit")
    };

    handleDeleteClicked = () =>  {

        this.props.click("Delete")
    };

    handleMenuClicked = (callbackData) => {

        this.props.click(callbackData)
    };

    handleCloseClicked = (callbackData) => {

        this.props.click("Close")
    };



    render() {
        return(
        <div>&nbsp;</div>
        )
    }

}
export class CancelControlBar extends ControlBarButtonConfiguration {
    constructor(props) {
        super(props);
        autobind(this);

    }

    render() {
        if (this.props.showCloseButton) {
            var closeButton =  <ItemControlBarButton myRef="ref_closeButton" label="Close"
                                              click={this.handleCloseClicked}/>

        }
             var menuButton =  <ItemControlBarButton myRef="ref_menuButton" label="Menu" menuType={this.props.label}
                                              click={this.handleMenuClicked}/>;


        return (
            <div className="ui two column grid">

                <div className="column left aligned">{this.props.label}</div>
                <div className="column right aligned noRightPadding">

                        <ItemControlBarButton myRef="ref_cancelButton" label="Cancel"
                                              click={this.handleCancelClicked}/>
                    {menuButton}
                    {closeButton}

                    </div>
                </div>


        )

    }
}

export class DetailControlBar extends ControlBarButtonConfiguration {
    constructor(props) {
        super(props);
        autobind(this);

    }

    render() {
        if (this.props.showCloseButton) {
             var closeButton =  <ItemControlBarButton myRef="ref_closeButton" label="Close"
                                              click={this.handleCloseClicked}/>

        }

             var menuButton =  <ItemControlBarButton myRef="ref_menuButton" label="Menu" menuType={this.props.label}
                                              click={this.handleMenuClicked}/>;


        return (
            <div className="ui two column grid">

                <div className="column left aligned">{this.props.label}</div>
                <div className="column right aligned noRightPadding"  >


                    <ItemControlBarButton myRef="ref_detailButton" label="Detail"
                                              click={this.handleDetailClicked}/>
                    {menuButton}

                    {closeButton}

</div>



                </div>
        )

    }
}

export class MenuControlBar extends ControlBarButtonConfiguration {
    constructor(props) {
        super(props);
        autobind(this);

    }

    render() {

        var menuButton =  <ItemControlBarButton myRef="ref_menuButton" label="Menu" menuType={this.props.label}
                                              click={this.handleMenuClicked}/>;


        return (
<div className="ui two column grid">

                <div className="column left aligned">{this.props.label}</div>
                <div className="column right aligned noRightPadding"  >


                    {menuButton}

</div>



                </div>


        )

    }
}


export class EditDeleteControlBar extends ControlBarButtonConfiguration {
    constructor(props) {
        super(props);
        autobind(this);

    }

    render() {

        var menuButton =  <ItemControlBarButton myRef="ref_menuButton" label="Menu" menuType={this.props.label}
                                              click={this.handleMenuClicked}/>;


        return (
<div className="ui two column grid">

                <div className="column left aligned">{this.props.label}</div>
                <div className="column right aligned noRightPadding"  >

                    <ItemControlBarButton myRef="ref_editButton" label="Edit" click={this.handleEditClicked}/>

                    {menuButton}

</div>



                </div>


        )

    }
}

export class DetailEditDeleteControlBar extends ControlBarButtonConfiguration {
    constructor(props) {
        super(props);
        autobind(this);

    }

    render() {


        if (this.props.showCloseButton) {
             var closeButton =  <ItemControlBarButton myRef="ref_closeButton" label="Close"
                                              click={this.handleCloseClicked}/>

        }
             var menuButton =  <ItemControlBarButton myRef="ref_menuButton" label="Menu" menuType={this.props.label}
                                              click={this.handleMenuClicked}/>;


        return (
<div className="ui two column grid">

                <div className="column left aligned">{this.props.label}</div>
                <div className="column right aligned noRightPadding"  >


                    <ItemControlBarButton myRef="ref_editButton" label="Edit" click={this.handleEditClicked}/>
                    <ItemControlBarButton myRef="ref_detailButton" label="Detail"
                                              click={this.handleDetailClicked}/>
                    {menuButton}
                    {closeButton}

</div>



                </div>


        )

    }
}

// <ItemControlBar myRef="ref_itemControlBar" label="Step" click={this.handleClicked} currentView="basic" />
export class ItemControlBar extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            editable: false,
            currentView: this.props.currentView, // basic, detail, edit
        }
    }
        componentDidMount() {
            this.setState({
                editable: this.props.editable,
            currentView: this.props.currentView
            })
        }


    componentWillReceiveProps(nextProps) {
        if (this.state.editable != nextProps.editable) {
            this.setState({
                editable: nextProps.editable,
            })
        }

        if (this.state.currentView != nextProps.currentView) {
            this.setState({
                currentView: nextProps.currentView,
            })
        }

    }

    handleClick = (callbackData) => {

        this.setState({currentView:callbackData});
        this.props.click(callbackData)
    };

    getButtonConfiguration = () => {
        var buttonConfiguration;

        if (this.state.editable) {
            if (this.state.currentView == "Basic") {
                buttonConfiguration = <DetailEditDeleteControlBar click={this.handleClick} label={this.props.label}/>

            } else if (this.state.currentView == "UpdateBasic" ) {
                buttonConfiguration = <EditDeleteControlBar click={this.handleClick} label={this.props.label}/>

            } else {
                buttonConfiguration = <CancelControlBar click={this.handleClick} label={this.props.label}/>
            }
        } else {
            if (this.state.currentView == "Basic") {
                buttonConfiguration = <DetailControlBar click={this.handleClick} label={this.props.label}/>
            } else if (this.state.currentView == "UpdateBasic" ) {
                buttonConfiguration = <MenuControlBar click={this.handleClick} label={this.props.label}/>

            }else {
                buttonConfiguration = <CancelControlBar click={this.handleClick} label={this.props.label}/>
            }

        }
        return buttonConfiguration
    };

    getButtonConfigurationIncludingCloseButton = () => {
        var buttonConfiguration;

        if (this.state.editable) {
            if (this.state.currentView == "Basic") {
                buttonConfiguration = <DetailEditDeleteControlBar click={this.handleClick} label={this.props.label} showCloseButton={true} />
            } else {
                buttonConfiguration = <CancelControlBar click={this.handleClick} label={this.props.label} showCloseButton={true}  />
            }
        } else {
            if (this.state.currentView == "Basic") {
                buttonConfiguration = <DetailControlBar click={this.handleClick} label={this.props.label} showCloseButton={true} />
            } else {
                buttonConfiguration = <CancelControlBar click={this.handleClick} label={this.props.label} showCloseButton={true}  />
            }

        }
        return buttonConfiguration
    };


    render() {
        if (!this.props.showCloseButton) {
            var buttonConfiguration = this.getButtonConfiguration()
        } else {
            var buttonConfiguration = this.getButtonConfigurationIncludingCloseButton()
        }

        switch(this.props.label) {
            case("Goal"):
                var color = "blue";
                break;
            case("Plan"):
                var color = "green";
                break;
            case("Program"):
                var color = "green";
                break;
            case("Step"):
                var color = "raspberry";
                break;
            case("Profile"):
                var color = "cyan";
                break;
            case("Update"):
                var color = "orange";
                break;

        }


        return (
            <div ref={this.props.myRef} className={`ui top attached ${color} button`}>

                    {buttonConfiguration}


            </div>
        )


    }
}


export class Breadcrumb extends React.Component {
    constructor (props) {
        super(props);
        autobind(this);
        this.state = {
            values: ""
        }
    }

    componentDidMount() {
    this.setState({
        values:this.props.values
    })
    }

    buildBreadcrumb = () => {
        var theBreadcrumb = '<div class="ui large breadcrumb"><a href="#/"><div class="section">Home</div></a>';
        for (var i=0; i < this.state.values.length; i++) {
            theBreadcrumb = theBreadcrumb + '<i class="right chevron icon divider"></i>';
            theBreadcrumb = theBreadcrumb + '<a href=#' + this.state.values[i].url + ' >';
            theBreadcrumb = theBreadcrumb + '<div class="section">' + this.state.values[i].label + '</div></a>'
        }
        theBreadcrumb = theBreadcrumb + '</div>';

        return theBreadcrumb

        };


    render() {
            var theBreadcrumb = this.buildBreadcrumb();
            return (
                            <div dangerouslySetInnerHTML={{__html: theBreadcrumb}} />

            )
    }
}

export class ErrorWrapper extends React.Component {
    constructor (props) {
        super(props);
        autobind(this);
        this.state = {
            errorMessage: "",

        }
    }

    render() {
        return (
      <div >

          {this.props.children}

      </div>
    )

    }

}



module.exports = {
    TimePicker,
    Sidebar,
    DynamicSelectButton2,
    GoalViewEditDeleteItem,
    PlanViewEditDeleteItem,
    ProgramViewEditDeleteItem,

    StepViewEditDeleteItem,
    ProfileViewEditDeleteItem,
    ImageUploader,
    FormHeaderWithActionButton,
    FormAction,
    Header

};
