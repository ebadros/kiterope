var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {ImageUploader, Header, Breadcrumb, PlanForm2, PlanViewEditDeleteItem, FormAction, Sidebar, FormHeaderWithActionButton, DetailPage} from './base';
import {PlanHeader, StepList, StepModalForm, ToggleButton, } from './step';
import {ProgramCalendar } from './calendar'
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router';
import { Menubar, StandardSetOfComponents, ErrorReporter } from './accounts'
import autobind from 'class-autobind'
import Modal from 'react-modal'

import { KRInput, KRSelect, KRRichText, KRCheckBox } from './inputElements'
import DatePicker  from 'react-datepicker';
import moment from 'moment';
import Pagination from "react-js-pagination";
import Select from 'react-select'
import TinyMCE from 'react-tinymce';
import TinyMCEInput from 'react-tinymce-input';
import CurrencyInput from 'react-currency-input';
import { IconLabelCombo, ClippedImage } from './elements'
import { Textfit } from 'react-textfit';
import ShowMore from 'react-show-more';
import {SaveButton, StandardInteractiveButton, SettingsForm } from './settings'


import { makeEditable,  } from './calendar'
import { MessageWindowContainer } from './message'

import { addPlan, removePlan,  setDisplayAlert, shouldReload, setPlan, setPlanModalData, addStep, deleteStep, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, setContacts, setStepOccurrences } from './redux/actions'

import { theServer, s3IconUrl, formats, s3ImageUrl, stepModalStyle, mobileModalStyle, smallDesktopModalStyle, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, programScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, viewableByOptions } from './constants'
import { Provider, connect, dispatch } from 'react-redux'
import  {store} from "./redux/store";

import { mapStateToProps, mapDispatchToProps } from './redux/containers2'

import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'

$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Connection', 'keep-alive');
        xhr.setRequestHeader('Authorization', 'Token ' + localStorage.token);

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
export class PlanSettingsForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            program:"",
            notificationMethod:"",
            goalsData:"",
            goal:"",
            startDateTime:moment(),
            goalOptions:[],
            modalIsOpen: false,
            saved:"Save",
        }
    }

    componentDidMount = () => {



         if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.planModalData != undefined) {
                this.setState({planModalData:this.props.storeRoot.planModalData})
                    this.setStateToData(this.props.storeRoot.planModalData)


            }
        }

        if (this.props.storeRoot) {
            if (this.props.storeRoot.goals) {
                this.setState({
                    goalsData: this.props.storeRoot.goals
                },  this.convertGoalDataToGoalOptions )
            }
            if (this.props.storeRoot.settings) {
                this.setState({
                    notificationMethod: this.props.storeRoot.settings.defaultNotificationMethod,
                    notificationPhone:this.props.storeRoot.settings.defaultNotificationPhone,
                    notificationEmail:this.props.storeRoot.settings.defaultNotificationEmail,
                    notificationSendTime:this.props.storeRoot.settings.defaultNotificationSendTime,



                })

            }
        }
    };



    setStateToData (planModalData) {
         this.setState({
            modalIsOpen: planModalData.modalIsOpen,

        })
        if (planModalData.data != undefined ) {

            this.setState({
                    data: planModalData.data
                }
            )
        }

    }

    componentWillReceiveProps = (nextProps) => {

         if (this.state.serverErrors != nextProps.serverErrors) {
            this.setState({
                serverErrors: nextProps.serverErrors
            })
        }

        if (nextProps.storeRoot.planModalData != undefined ) {
            if (this.state.planModalData != nextProps.storeRoot.planModalData) {
                this.setState({planModalData:nextProps.storeRoot.planModalData })

                    this.setStateToData(nextProps.storeRoot.planModalData)

                }


            }

        if (nextProps.storeRoot) {
            if (this.state.goalsData != nextProps.storeRoot.goals) {
                this.setState({
                    goalsData: nextProps.storeRoot.goals
                }, this.convertGoalDataToGoalOptions
                )
            }
        }
    }

    getGoals = () => {
        var theUrl = '/api/goals/';
        $.ajax({
            method: 'GET',
            url: theUrl,
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(goalsData) {
                this.setState({
                    goalsData: goalsData.results
                }, () => this.convertGoalDataToGoalOptions())


            }.bind(this),
            error: function(xhr, status, err) {
                console.error(theUrl, status, err.toString());
            var serverErrors = xhr.responseJSON;
            this.setState({
                serverErrors:serverErrors,
            })
        }
        })

    };
    handleClick() {
        this.props.click()
    }

    handleSaveClicked = () => {
        this.setState({saved: "Saving"});

        if (this.state.data.id) {
            var theUrl = "/api/planOccurrences/" + this.state.data.id + "/";
            var planOccurrence = {
                id: this.state.data.id,
                program: this.state.data.program,
                goal: this.state.goal,
                user: this.props.storeRoot.user.id,
                startDateTime: moment.utc(this.state.startDateTime).format('YYYY-MM-DD HH:mm'),
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
                    this.setState({
                        data: data,
                        subscribed: "Subscribed"
                    });


                    store.dispatch(addPlan(data));
                                    store.dispatch(setDisplayAlert({showAlert:true, text:"You've subscribed to the plan", style:{backgroundColor:'purple', color:'white'}}))

                    store.dispatch(shouldReload("subscribed"));
                    this.resetForm()
                    var goalURL = "/goals/" + data.goal + "/plans"
                    store.dispatch(push(goalURL))


                    //this.props.formSubmitted()


                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                        subscribed: "Subscribe"
                    })


                }.bind(this)
            });
        } else {
             var planOccurrence = {

            program: this.state.data.program,
            //goal: this.state.goal,
            user: this.props.storeRoot.user.id,
            isSubscribed:true,
            notificationSendTime: this.state.notificationSendTime,
            notificationEmail: this.state.notificationEmail,
            notificationPhone: this.state.notificationPhone,
                 goal: this.state.goal,
                startDateTime: moment.utc(this.state.startDateTime).format('YYYY-MM-DD HH:mm'),
            //notificationMethod: this.state.notificationMethod
        };
                        var theUrl = "/api/planOccurrences/"

             $.ajax({

                 url: theUrl,
                 dataType: 'json',
                 type: 'POST',
                 data: planOccurrence,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (theData) {
                     this.setState({
                         data: theData,
                         subscribed: "Subscribed"
                     });
                     this.closeModal()



                    store.dispatch(addPlan(theData));
                                     store.dispatch(setDisplayAlert({showAlert:true, text:"You've subscribed to the plan.", style:{backgroundColor:'purple', color:'white'}}))

                    store.dispatch(shouldReload("subscribed"));
                    this.resetForm()
                    var goalURL = "/goals/" + theData.goal + "/plans"
                    store.dispatch(push(goalURL))






                 }.bind(this),
                 error: function (xhr, status, err) {
                     console.error(theUrl, status, err.toString());
                     var serverErrors = xhr.responseJSON;
                        this.setState({
                            serverErrors:serverErrors,
                            subscribed: "Subscribe"
                    })


                 }.bind(this)
             });
        }

    };

    getServerErrors(fieldName) {
        if (this.state.serverErrors == undefined) {
            return ""
        } else {
            return this.state.serverErrors[fieldName]
        }
    }

    convertGoalDataToGoalOptions () {
        var i;
        var goalsData = this.state.goalsData;
        var goalOptions = [];

        for (var key in goalsData) {
            var aGoalOption = {value: goalsData[key].id, label: goalsData[key].title};
            goalOptions.push(aGoalOption)

        }
        /*for (i=0; i < goalsData.length; i++) {
            var aGoalOption = {value: goalsData[i].id, label: goalsData[i].title}
            goalOptions.push(aGoalOption)

        }*/
        this.setState({
            goalOptions: goalOptions
        })
    }

    handleStartDateTimeChange(dateTime)   {
        this.setState({startDateTime: dateTime});
  }


  handleGoalChange(option){
        this.setState({goal: option.value});
    }

    handleNotificationMethodChange(option){
        this.setState({notificationMethod: option.value});
    }

    handleNotificationPhoneChange(value){
        this.setState({notificationPhone: value});
    }

    handleNotificationEmailChange(value){
        this.setState({notificationEmail: value});
    }

    handleNotificationSendTimeChange(option){
        this.setState({notificationSendTime: option.value});
    }

    getServerErrors(fieldName) {
        if (this.state.serverErrors == undefined) {
            return ""
        } else {
            return this.state.serverErrors[fieldName]
        }
    }

    closeModal() {
        this.setState({modalIsOpen: false});
        this.resetForm()


    }

    resetForm = () => {
    this.setState({
                    program: "",
                    startDateTime: moment(),
                    modalIsOpen: false,

                },            () =>        { store.dispatch(setPlanModalData(this.state))}


            )

        }


    handleCancelClicked() {
        this.closeModal()
    }

    getForm = () => {
         if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if ((this.props.isListNode) || (forMobile)) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";

           } else {


            var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }

        return (
                          <div className="ui page container form">
 <div className="ui row">&nbsp;</div>
                  <Header headerLabel="Plan Settings" />
                                  <div className="ui three column grid">
                                           <div className="ui row">&nbsp;</div>


     <div className="ui field row">
         <div className={wideColumnWidth}>




             <label htmlFor="id_startDate">Start Date:</label>
             <DatePicker showTimeSelect
                                                        showTime = {{ use12hours: true }}
                                                        allowClear={false}
                                                        timeFormat='hh:mm a'
                                                        timeIntervals={15}
                                                        dateFormat="LLL"
                                                        timeCaption="time"
                                                        selected={this.state.startDateTime}
                                                        onChange={this.handleStartDateTimeChange} />


                                  </div></div>
                        <div className="ui field row">
                                <div className="ui ten wide column">
<KRSelect value={this.state.goal}
                                            valueChange={this.handleGoalChange}
                                            label="Which goal is this plan for?:"
                                            isClearable={false}
                                            name="goal"
                                            options={this.state.goalOptions}
                                            serverErrors={this.getServerErrors("goal")}

                                            />
                                    </div>
                            <div className="ui six wide column" >                <div className="fluid field"><label>&nbsp;</label>

            <div className="ui right floated fluid primary button" onClick={() => store.dispatch(push('/goals/'))} style={{marginTop:'-1px'}} >Add Goal</div>
        </div>
    </div>
                            </div>



                                  </div>











                                      <div className="ui three column stackable grid">
                                          <div className="column">&nbsp;</div>

                          <div className="column">
                              <div className="ui large fluid button" onClick={this.handleCancelClicked}>Cancel</div>
                          </div>
                          <div className="column">
                              <StandardInteractiveButton color="purple" initial="Save" processing="Saving" completed="Saved" current={this.state.saved} clicked={this.handleSaveClicked}  />

                          </div>
                      </div>
                              </div>








        )

    }

    render() {

    var theForm = this.getForm();
        if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if (forMobile) {
             var modalStyle = mobileModalStyle

           } else {


                var modalStyle = stepModalStyle

        }

            return(


                 <div className="ui form"><Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={modalStyle}>
                        {theForm}

                    </Modal>
                </div>

            )
        }



}


export class PlanDetailPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[],
            editable:false,
            openModal:false,
            formIsOpen:false,
            stepData:[],
            selectedView:"calendar",
            headerActionButtonLabel:"Add Step"
        }
    }

    loadStepsFromServer = () => {
        $.ajax({
          url: "/api/plans/" + this.props.params.plan_id + "/steps" ,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({stepData: data.results});

          }.bind(this),
          error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
          }.bind(this)
        });
      };

    loadFromServer = () => {
    $.ajax({
      url: "/api/plans/" + this.props.params.plan_id + "/",
      dataType: 'json',
      cache: false,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
      success: function(planData) {
        this.setState({
            data: planData});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error("/api/plans/" + this.props.params.plan_id + "/", status, err.toString());
      }.bind(this),

    });
  };

  handleStepSubmit (step, callback) {

             $.ajax({
                 url: "/api/steps/",
                 dataType: 'json',
                 type: 'POST',
                 data: step,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     callback;
                     this.handleCancelClicked()

                 }.bind(this),
                 error: function (xhr, status, err) {
                     console.error("/api/steps/", status, err.toString());
                     this.setState({
                         error: err,
                     })

                 }.bind(this)
             });
         }

    componentWillUnmount = () => {
        //clearInterval(this.state.stepsIntervalId);

    };

  determineOptions = () => {
              //var theUrl = theServer + "api/goals/" + this.props.params.goal_id + "/"

      $.ajax({
      url: "/api/plans/" + this.props.params.plan_id + "/",
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
        console.error("/api/plans/" + this.props.params.plan_id + "/", status, err.toString());
      }.bind(this),


    });
  };



    handleFormSubmit = (step, callback) => {
    $.ajax({
        url: ("/api/steps/"),
        dataType: 'json',
        type: 'POST',
        data: step,
        success: callback,
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
  };

    showCalendar() {
        $(this.refs['ref_calendarView']).slideDown();
        $(this.refs['ref_listView']).slideUp();
    }

    showList() {
        $(this.refs['ref_calendarView']).slideUp();
        $(this.refs['ref_listView']).slideDown();
    }



    handleViewClick = (selectedView) => {
        this.setState({
            selectedView:selectedView
        });
        this.selectView(selectedView)

    };

    selectView = (selectedView) => {
        if (selectedView == "calendar") {
            this.showCalendar()
        } else if (selectedView == "list") {
            this.showList()
        }
    };

  componentDidMount() {
      this.determineOptions();
      this.loadFromServer();
      //var stepsIntervalId = setInterval(this.loadStepsFromServer, 800)
      //this.setState({stepsIntervalId:stepsIntervalId})
      this.loadStepsFromServer();
      //$(this.refs['ref_whichStepForm']).hide();
    this.selectView(this.state.selectedView);

        $(".fullPageDiv").hide();
        $(".fullPageDiv").slideToggle();

  }

  handleCancelClicked = () => {
      //$(this.refs['ref_whichStepForm']).slideUp();
      this.setState({
          formIsOpen:false,
          headerActionButtonLabel: "Add Step"
      })

  };
  handleOpenForm = () => {
        this.setState({
            openModal:false,
            headerActionButtonLabel: "Close Form",
            formIsOpen:true,
        }, () => {$(this.refs['ref_whichStepForm']).slideDown()} )


    };
    handleReloadItem = () => {
        this.loadStepsFromServer()
    };



  handleCloseForm = () => {
        this.setState({
            headerActionButtonLabel: "Add Step",
            formIsOpen:false,
        }, () => $(this.refs['ref_whichStepForm']).slideUp())

    };

  handleActionClick = () => {
      if (this.state.formIsOpen == true) {
        this.handleCloseForm()

      }
      else {
          this.handleOpenForm()
      }
    };

    render() {
        return (
            <div>
                <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen}/>

                <div className="fullPageDiv">
                    <div className="ui page container">
                        <div className="spacer">&nbsp;</div>
                        <div className="ui alert"></div>
                         <Breadcrumb values={[
                                    {url:"/plans", label:"My Plans"},
                                    {url:"/plans/" + this.props.params.plan_id + "/steps/", label:"Plan Detail"},

                        ]}/>
                        <div>&nbsp;</div>

                        <PlanViewEditDeleteItem isListNode={false}
                                                showCloseButton={false}
                                                apiUrl="/api/plans/"
                                                id={this.props.params.plan_id}
                                                data={this.state.data}
                                                currentView="Basic" />

                        <div>&nbsp;</div>
                        <div className="ui grid">
                            <div className="ui row">
                                <div className="ui header two wide column">
                                    <h1>Steps</h1>
                                </div>
                                <div className="ui eleven wide column">&nbsp;</div>
                                <div className="four right floated wide column">
                                    <ViewSelector selectedView={this.state.selectedView} viewClick={this.handleViewClick} />

                                </div>
                            </div>

                        </div>
                        <div ref="ref_calendarView">

                            <ProgramCalendar planId={this.props.params.plan_id} events={this.state.stepData} reloadItem={this.handleReloadItem}/>
                            <div className="ui row">&nbsp;</div>

                        </div>
                        <div ref="ref_listView">
                            <FormHeaderWithActionButton actionClick={this.handleActionClick}
                                                        showingForm={this.state.formIsOpen} headerLabel=""
                                                        color="raspberry" buttonLabel={this.state.headerActionButtonLabel}
                                                        closeForm={this.handleCloseForm}
                                                        openForm={this.handleOpenForm}/>

                            {/*<div ref="ref_whichStepForm">


                                <StepForm parentId={this.props.params.plan_id}
                                          onSubmit={this.handleStepSubmit}
                                          cancelClicked={this.handleCancelClicked}
                                            serverErrors={this.state.serverErrors} />

                            </div>*/}
                            <div>&nbsp;</div>
                            <div>&nbsp;</div>

                            <StepList planId={this.props.params.plan_id} reloadItem={this.handleReloadItem} />
                             <StepModalForm
                                parentId={this.props.params.plan_id}
                              isListNode={false}
                              serverErrors={this.state.serverErrors}/>

                        </div>





                    </div>
                </div>
            </div>

        )
    }
}



export class ViewSelector extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            selectedView:"calendar"

        }
    }

    handleCalendarViewClick = () => {
        this.props.viewClick("calendar")
    };

    handleListViewClick = () => {
        this.props.viewClick("list")
    };

    componentWillReceiveProps = (nextProps) => {
        if (this.state.selectedView != nextProps.selectedView) {
            this.setState({
                selectedView: nextProps.selectedView
            })
        }
    };

    render = () => {

        if (this.state.selectedView == "calendar") {
            var calendarSelected = "active raspberry  item";
            var listSelected = " item ";
            var calendarIconColor = "Dark";
            var listIconColor = "Light"
        } else if (this.state.selectedView == "list") {
            var listSelected = "active raspberry  item ";
            var calendarSelected = " item ";
                        var calendarIconColor = "Light";
                        var listIconColor = "Dark"


        }
        return (
        <div className="ui right floated icon menu">
            <a className={calendarSelected} onClick={this.handleCalendarViewClick} >
                {/*              <img src={s3IconUrl + "calendar" + calendarIconColor + ".svg"} className="ui middle aligned extramini image" />
*/}<i className={"calendar icon " + calendarIconColor }></i>
                </a>
            <a className={listSelected} onClick={this.handleListViewClick}>
<i className={"list icon " + listIconColor }></i>
                {/* <img src={s3IconUrl + "list" + listIconColor + ".svg"} className="ui middle aligned extramini image"  />
        */}
            </a>
        </div>
        )
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class PlanForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
           files:[],
            image: "",
            title: "",
            description: "",
            startDate:moment(),
            scheduleLength:"3m",
            viewableBy: "ONLY_ME",
            timeCommitment: "1h",
            cost:"0.0",
            costFrequencyMetric: "MONTH",
            editable:false,
            data:"",
            serverErrors:""
        }
    }


    componentDidMount () {
        $(this.refs['id_whichGoalForm']).hide()
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.data != nextProps.data) {
            if (nextProps.data != undefined) {
            this.setState({
                id: nextProps.data.id,
                title: nextProps.data.title,
                deadline: moment(nextProps.data.deadline, "YYYY-MM-DD"),
                description: nextProps.data.description,
                image: nextProps.data.image,
                timeCommitment: nextProps.data.timeCommitment,
                cost: nextProps.data.cost,
                costFrequencyMetric: nextProps.data.costFrequencyMetric,
                //startDate: moment(nextProps.data.startDate, "YYYY-MM-DD"),
                scheduleLength:nextProps.data.scheduleLength,


                //viewableBy: nextProps.data.viewableBy,
            })
            }




        }
                if (this.state.occurrenceData != nextProps.occurrenceData) {
                    if (nextProps.occurrenceData != undefined) {
                        this.setState({
                            startDate: moment(nextProps.occurrenceData.startDate, "YYYY-MM-DD"),
                            viewableBy: nextProps.occurrenceData.viewableBy
                        })

                    }
                }


        if (this.state.serverErrors != nextProps.serverErrors) {
            this.setState({
                serverErrors: nextProps.serverErrors
            })
        }

    }

    handleStartDateChange(date)   {
        this.setState({startDate: date});
  }


    handleViewableByChange(option) {

            this.setState({viewableBy: option.value})
    }


    handleCancelClicked() {
        this.props.cancelClicked()
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.props.storeRoot.user) {
            var viewableBy = this.state.viewableBy;
            var startDate = moment(this.state.startDate).format("YYYY-MM-DD");

            var planData = {

                viewableBy: viewableBy,
                startDate: startDate,

            };

            if (this.state.id != "") {
                planData.id = this.state.id
            }
            this.props.onSubmit(planData, this.resetForm)


        }
        else {
            this.setState({
                    signInOrSignUpModalFormIsOpen: true,
                }
            )

        }
        }

        resetForm = () => {
            this.setState({
                    image: "",
                    title: "",
                    description: "",
                    startDate: moment(),
                    scheduleLength: "3m",
                    viewableBy: "ONLY_ME",
                    timeCommitment: "1h",
                    cost: "0.0",
                    costFrequencyMetric: "MONTH",
                    editable: false,
                    serverErrors:"",
                    data: "",
                }
            );
        };


        getForm = () => {
            if (this.state.id) {
                var buttonText = "Save"

            } else {
                var buttonText = "Create"
            }

            var imageUrl = this.state.image;


                var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";


          return (
              <div>
                                            <ClippedImage item="plan" src={imageUrl} />

              <div className="ui page container">
                      <div className="ui grid">


                            <div className="sixteen wide column">

                        <div className="planTitle">                {this.state.title}

                        </div>
                                </div>

                            <div className="ui row">
                              <div className={smallColumnWidth}>
                                  <div className="field">

                                      <label  htmlFor="id_startDate">Start Date:
                                      </label>

                                      <DatePicker selected={this.state.startDate}
                                                  onChange={this.handleStartDateChange}/>
                                  </div>
                              </div>
                          </div>

                          <div className="ui row">
                              <div className={mediumColumnWidth}>
                                  <div className='field'>
                                      <label>Who should be able to see this?:</label>

                                      <Select value={this.state.viewableBy} onChange={this.handleViewableByChange}
                                              name="viewableBy" options={viewableByOptions} clearable={false}/>


                                  </div>
                              </div>
                          </div>



</div>
                      <div className="ui three column stackable grid">
                          <div className="column">&nbsp;</div>
                          <div className="column">
                              <div className="ui large fluid button" onClick={this.handleCancelClicked}>Cancel</div>
                          </div>
                          <div className="column">
                              <div className="ui large fluid blue button" onClick={this.handleSubmit}>{buttonText}</div>
                          </div>
                      </div>

              </div>
                  </div>
          )

    };





    render() {
    var theForm = this.getForm();

            return(
                <div >
                    <form className="ui form" onSubmit={this.handleSubmit}>
                        {theForm}
                    </form>
                </div>

            )
        }



}

export class SimplePlanForm extends PlanForm {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
           files:[],
            image: "",
            title: "",
            description: "",
            startDate:moment().format("MMM DD, YYYY"),
            scheduleLength:"3m",
            viewableBy: "ONLY_ME",
            timeCommitment: "1h",
            cost:"0.0",
            costFrequencyMetric: "MONTH",
            editable:false,
            data:"",
        }
    }

    findLabel (theValue, theArray) {
        for (var i=0; theArray.length; i++ ) {
            if (theArray[i].value == theValue) {
                return theArray[i].label
            }
        }
    }



    getForm = () => {

        var imageUrl = s3ImageUrl + this.state.image;
        var startDate = moment(this.state.startDate).format("MMM DD, YYYY");
        return (
            <div className="ui page container">
                <div className="ui grid">
                                        <div className="sixteen wide column">
                                                                    <div className="ui row">


                        <img className="listNodeImage" src={imageUrl}/></div>
                        <div className="ui row">
                            <div className="header">
                                <h1>{this.state.title}</h1>
                            </div>


                        </div>
                        <div className="ui row">&nbsp;</div>
                        <div className="ui row">
                            <div className="field">
                                <label htmlFor="id_description">Description</label>
                                <div className="fluid row" dangerouslySetInnerHTML={{__html: this.state.description}}/>
                            </div>


                        </div>


                        <div className="ui row">&nbsp;</div>
                        <div className="ui row">
                            <div className="field">
                                <label htmlFor="id_startDate">Start Date:</label>
                                <div>{this.state.startDate}</div>
                            </div>


                        </div>
                        <div className="ui row">&nbsp;</div>
                        <div className="ui row">
                            <div className="field">
                                <label htmlFor="id_scheduleLength">Schedule Length</label>
                                <div>{this.findLabel(this.state.scheduleLength, programScheduleLengths)}</div>
                            </div>


                        </div>
                        <div className="ui row">&nbsp;</div>
                        <div className="ui row">
                            <div className="field">
                                <label htmlFor="id_timeCommitment">Time Commitment</label>
                                <div>{this.findLabel(this.state.timeCommitment, timeCommitmentOptions)}</div>
                            </div>


                        </div>
                        <div className="ui row">&nbsp;</div>

                        <div className="ui row">
                            <div className="field">
                                <label htmlFor="id_cost">Cost</label>
                                <div>${this.state.cost} {this.findLabel(this.state.costFrequencyMetric, costFrequencyMetricOptions)}</div>
                            </div>


                        </div>







                    </div>
                </div>
            </div>

        )};

    render() {
    var theForm = this.getForm();

        if (this.state.editable) {
            return(
                <div >
                    <form className="ui form" onSubmit={this.handleSubmit}>
                        {theForm}
                    </form>
                </div>

            )
        }

        else {
            return (
                <div >
                    <div className="ui form disabledForm">
                        {theForm}
                    </div>
                </div>
)
        }

    }


}
@connect(mapStateToProps, mapDispatchToProps)
export class PlanList extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: []
        }
    }

    componentDidMount() {
        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.plans != undefined) {
                this.setState({data: this.props.storeRoot.plans})

            }

        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.storeRoot != undefined) {

            if (this.state.data != nextProps.storeRoot.plans) {
                this.setState({data: nextProps.storeRoot.plans})


            }


        }
    }

    render() {
        var placeholderImageStyle = {
            backgroundImage: "url('http://semantic-ui.com/images/avatar2/large/kristy.png')",
            width: '300px',
            height: '300px',
        };

        if (this.state.data != undefined) {
            var theData = this.state.data;

            var values = Object.keys(theData).map(function (key) {
                return theData[key];
            });


            var planList = values.map((planOccurrence) => {
                if ((planOccurrence.isSubscribed) && (planOccurrence.goal == this.props.goalId)) {
                    return (
                        <PlanViewEditDeleteItem key={planOccurrence.id}
                                                isListNode={true}
                                                showCloseButton={false}
                                                apiUrl="/api/plans/"
                                                id={planOccurrence.id}
                                                data={planOccurrence.programInfo}
                                                occurrenceData={planOccurrence}
                                                currentView="Basic"
                        />

                    );
                }

                //return (<PlanListNode key={plan.id} plan={plan}/>)
            })
        }


        return (
            <div className="centeredContent">

                <div className='ui three column doubling stackable grid'>
                    {planList}
                </div>
            </div>
        );
    }

}


export class PlanListNode extends React.Component {
    constructor(props) {
        super(props);
        autobind(this)

    }
    componentDidMount() {

    }

    clearPage = () => {

        store.dispatch(push('/plans/' + this.props.plan.id + '/steps'))


    };

    render () {

        if (this.props.plan.image) {
            var theImage = <img className="clippedImage" src={this.props.plan.image}/>

        } else {
            var theImage = <img className="clippedImage" src='http://semantic-ui.com/images/avatar2/large/kristy.png' />
        }
        return(
            <div  className="column">
                            <div className="ui fluid card overlayedImageContainer" onClick={this.clearPage}>
                                <div className="image overlayedImage">{theImage}
                                    <div className="overlayText">{this.props.plan.title}</div>
                                </div>

                            </div>

                </div>

        )
    }

}

export class PlanBasicView extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:"",
            occurrenceData:"",
        }
    }

    componentDidMount() {
        this.setState({
            data:this.props.data,
                        occurrenceData:this.props.occurrenceData,

        })
    }
    componentWillReceiveProps (nextProps) {
        if (this.state.data != nextProps.data) {
            this.setState({
                data:nextProps.data
            })
        }
        if (this.state.occurrenceData != nextProps.occurrenceData) {
            this.setState({
                occurrenceData:nextProps.occurrenceData
            })
        }
    }

    findLabel (theValue, theArray) {
        var returnValue = "Not available";
        if (theValue) {
            for (var i = 0; i < theArray.length; i++) {
                if (theValue == theArray[i].value) {
                    returnValue =  theArray[i].label;
                    return returnValue
                }
            }
            return returnValue
        }
        else {
            return returnValue
        }
    }

    goToDetail() {
        store.dispatch(push("/plans/" + this.state.data.id + "/steps"))

}
    render() {
        var theCost;
            if (this.state.data.cost == 0.00 || this.state.data.costFrequencyMetric == "FREE") {
                theCost = "Free"
            }
            else {
                theCost =  this.state.data.cost + " " + this.findLabel(this.state.data.costFrequencyMetric, costFrequencyMetricOptions)
            }
            var theScheduleLength = this.findLabel(this.state.data.scheduleLength, programScheduleLengths);
            var theTimeCommitment = this.findLabel(this.state.data.timeCommitment, timeCommitmentOptions);

        if (this.props.isListNode) {

            return (
                <div>
                    <ClippedImage item="plan" src={this.state.data.image} />


                <div className="ui grid" >
                    <div className="sixteen wide column">

                        <div className="planTitle">                {this.state.data.title}

                        </div>
                        <div className="row">&nbsp;</div>

                        <div className="row" >
                            <div className="ui two column grid">
                                <div className="ui left aligned column">
{this.state.occurrenceData != undefined ?
                                                <IconLabelCombo tooltip="Plan's Start Date"
                                                                size="extramini"
                                                                orientation="left"
                                                                text={this.state.occurrenceData.startDate} icon="calendar" background="Light" />
:
                                                <IconLabelCombo size="extramini" orientation="right" text="" icon="calendar" background="Light" />
}</div>
                                <div className="ui right aligned column">
                                    <IconLabelCombo size="extramini" tooltip="Length of Plan" orientation="right" text={theScheduleLength} icon="deadline" background="Light"  />
</div></div>
                            </div>
                        <div className="row" >

                            <div className="ui two column grid">
                                <div className="ui left aligned column">
                                    <IconLabelCombo tooltip="Cost" size="extramini" orientation="left" text={theCost} icon="cost" background="Light" link="/goalEntry" />
</div>
                                <div className="ui right aligned column">
                                    <IconLabelCombo tooltip="Time Commitment" size="extramini" orientation="right" text={theTimeCommitment} icon="timeCommitment" background="Light" link="/goalEntry" />
</div></div>
</div>


                    </div>
                    </div></div>

            )
        }
        else {

            return (
                <div className="ui grid">
                    <div className="two wide column">
                        <img className="ui image" src={this.state.data.image}></img>
                    </div>
                    <div className="eight wide column">
                        <div className="fluid row">
                            <h3>{this.state.data.title}</h3>
                        </div>
                        <div className="fluid row" dangerouslySetInnerHTML={{__html: this.state.data.description}}/>
                    </div>
                    <div className="right aligned six wide column">
                        {this.state.occurrenceData != undefined ?
                                                <IconLabelCombo tooltip="Plan's start date" size="extramini" orientation="right" text={this.state.occurrenceData.startDate} icon="calendar" background="Light" />
:
                                                <IconLabelCombo size="extramini" orientation="right" text="" icon="calendar" background="Light" />
}
                                    <IconLabelCombo tooltip="Length of schedule" size="extramini" orientation="right" text={theScheduleLength} icon="deadline" background="Light"  />
                                    <IconLabelCombo tooltip="Cost"
                                                    size="extramini" orientation="right" text={theCost}  icon="cost" background="Light" />
                                    <IconLabelCombo tooltip="Time commitment" size="extramini" orientation="right" text={theTimeCommitment} icon="timeCommitment" background="Light"  />
</div>

                </div>

            )
        }

    }
}







var GoalHeader = React.createClass({
    loadObjectsFromServer: function () {
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



module.exports = { PlanSettingsForm, GoalHeader, PlanDetailPage, SimplePlanForm, PlanForm, PlanBasicView , PlanList,  };