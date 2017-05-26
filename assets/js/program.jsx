var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {ImageUploader, Breadcrumb, PlanForm2, ProgramViewEditDeleteItem, FormAction, Sidebar, FormHeaderWithActionButton, DetailPage} from './base';
import {PlanHeader, StepList, ToggleButton, StepForm, SimpleStepForm} from './step';
import {PlanCalendar } from './calendar'
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router';
import { Menubar, StandardSetOfComponents, ErrorReporter } from './accounts'
import autobind from 'class-autobind'
import {StandardSetOfComponentsContainer} from './redux/containers'
import Measure from 'react-measure'


import { ValidatedInput, KSSelect } from './app'
import DatePicker  from 'react-datepicker';
import moment from 'moment';
import Pagination from "react-js-pagination";
import Select from 'react-select'
import TinyMCEInput from 'react-tinymce-input';
import CurrencyInput from 'react-currency-input';
import { Test , IconLabelCombo , ItemMenu, ClippedImage, ChoiceModal, ChoiceModalButton, ContextualMenuItem, ChoiceModalButtonsList,  } from './elements'
import { Textfit } from 'react-textfit';
import ShowMore from 'react-show-more';
import Modal from 'react-modal';


import { makeEditable, StepCalendarComponent, StepEditCalendarComponent,  } from './calendar'
import { MessageWindowContainer } from './message'

import { Provider, connect, store, dispatch } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './redux/containers'



import { theServer, s3IconUrl, formats, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, programScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, viewableByOptions, customStepModalStyles, notificationSendMethodOptions, TINYMCE_CONFIG } from './constants'

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
export class ProgramListPage extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            data: [],
            activePage:1,
            serverErrors:"",
            formIsOpen:false,
            headerActionButtonLabel:"Create Program"


        }
    }

    handleError = (theError) => {
        this.setState({
            error:theError,
        })

    }

    reload = () => {
        this.loadProgramsFromServer
    }

    handleProgramSubmit (program, callback) {

             var theUrl = theServer + "api/programs/"

             $.ajax({
                 url: theUrl,
                 dataType: 'json',
                 type: 'POST',
                 data: program,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     this.handleCloseForm()
                                          this.loadProgramsFromServer()

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



  loadProgramsFromServer = () => {
      console.log("loadProgramsFromServer")
      if (this.state.activePage != 1) {
                var theUrl = theServer + "api/programs/?page=" + this.state.activePage
      }  else {
          var theUrl = theServer + "api/programs/"
      }
      console.log(theUrl)
    $.ajax({
      url: theUrl,
      dataType: 'json',
      cache: false,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
      success: function(data) {
        this.setState({
            count: data.count,
            next:data.next,
            previous:data.previous,
            data: data.results});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());

      }.bind(this),

    });
  }


handleToggleForm = () => {
        $(this.refs['ref_whichProgramForm']).slideToggle()
    }

    componentDidMount() {
        this.loadProgramsFromServer();
        //var intervalID = setInterval(this.loadCommentsFromServer, 2000);
        //this.setState({intervalID: intervalID});
        var self = this;
        $(this.refs['ref_whichProgramForm']).hide();


    $(window).on('modal.visible', function(ev){
      self.setState({visible: true});
    });
    $(window).on('modal.hidden', function(ev){
      self.setState(self.getInitialState());
    });
    }

    handleClick(ev){
    if (ev.target == this.getDOMNode()){
      $(window).trigger('modal.hidden');
    }
  }
  handlePageChange = (pageNumber) => {
        this.setState({activePage: pageNumber}, () => this.loadProgramsFromServer());

    }

  getPagination()  {
          if (this.state.next != null || this.state.previous != null) {
              return (
                  <div className="ui center aligned one column grid">
                  <Pagination activePage={this.state.activePage}
                              itemsCountPerPage={9}
                              totalItemsCount={this.state.count}
                              pageRangeDisplayed={5}
                              onChange={this.handlePageChange}/>
                      </div>
              )
          } else {
          return ("")
          }
      }

      handleOpenForm = () => {
        this.setState({
            openModal:false,
            headerActionButtonLabel: "Close Form",
            formIsOpen:true,
        }, () => {$(this.refs['ref_whichProgramForm']).slideDown()} )


    }
    handleReloadItem = () => {
        this.loadProgramsFromServer()
    }
handleCancelClicked = () => {
      $(this.refs['ref_whichProgramForm']).slideUp()
      this.setState({
          formIsOpen:false,
          headerActionButtonLabel: "Create Program"
      })

  }

  handleNeedsLogin = () => {
      this.setState({
          signInOrSignUpModalFormIsOpen: true
      })
  }

  handleCloseForm = () => {
        this.setState({
            headerActionButtonLabel: "Create Program",
            formIsOpen:false,
        }, () => $(this.refs['ref_whichProgramForm']).slideUp())

    }

  handleActionClick = () => {
      if (this.state.formIsOpen == true) {
        this.handleCloseForm()

      }
      else {
          this.handleOpenForm()
      }
    }


componentWillUnmount() {
   // use intervalId from the state to clear the interval
   //clearInterval(this.state.intervalId);
}
    toggle() {
        $(this.refs['ref_whichProgramForm']).slideToggle()
    }

  render() {
      var pagination = this.getPagination()

    return (

<div>
    <StandardSetOfComponents  modalIsOpen={this.state.signInOrSignUpModalFormIsOpen}/>





        <div className="fullPageDiv">
            <div className="ui page container">


            <div className="spacer">&nbsp;</div>
            <div className="ui large breadcrumb">
                <Link to={`/#`}><div className="section">Home</div></Link>

                  <i className="right chevron icon divider"></i>
                  <Link to={`/#`}><div className="active section">My Programs</div></Link>
            </div>
            <div>&nbsp;</div>
                <FormHeaderWithActionButton actionClick={this.handleActionClick} headerLabel="Programs" color="green" buttonLabel={this.state.headerActionButtonLabel} toggleForm={this.handleToggleForm}/>
        <div ref="ref_whichProgramForm">
            <ProgramForm cancelClicked={this.handleCancelClicked} onProgramSubmit={this.handleProgramSubmit} serverErrors={this.state.serverErrors} />
            </div>

                    <ProgramList data={this.state.data} needsLogin={this.handleNeedsLogin} reloadItem={this.handleReloadItem}/>
                <div className="spacer">&nbsp;</div>
                {pagination}
            </div>
            </div>
</div>
    );
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export class ProgramDetailPage extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            data:[],
            editable:false,
            openModal:false,
            formIsOpen:false,
            stepData:[],
            activePage:1,
            selectedView:"list",
            headerActionButtonLabel:"Add Step"
        }
    }

    loadStepsFromServer = () => {
        var theUrl = theServer + "api/programs/" + this.props.params.program_id + "/steps"
        $.ajax({
          url: theUrl ,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({stepData: data.results});

          }.bind(this),
          error: function(xhr, status, err) {
            console.error(theUrl, status, err.toString());
          }.bind(this)
        });
      }


    loadProgramsFromServer = () => {
    $.ajax({
      url: theServer + "api/programs/" + this.props.params.program_id + "/",
      dataType: 'json',
      cache: false,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
      success: function(programData) {
        this.setState({
            data: programData});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(theServer + "api/programs/" + this.props.params.program_id + "/", status, err.toString());
      }.bind(this),

    });
  }

  handleStepSubmit (step, callback) {

             $.ajax({
                 url: theServer + "api/steps/",
                 dataType: 'json',
                 type: 'POST',
                 data: step,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     callback
                     this.handleCancelClicked()

                 }.bind(this),
                 error: function (xhr, status, err) {
                     console.error(theServer + "api/steps/", status, err.toString());
                     this.setState({
                         error: err,
                     })

                 }.bind(this)
             });
         }

    componentWillUnmount = () => {
        //clearInterval(this.state.stepsIntervalId);

    }



  determineOptions = () => {
              //var theUrl = theServer + "api/goals/" + this.props.params.goal_id + "/"

      $.ajax({
      url: theServer + "api/programs/" + this.props.params.program_id + "/",
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
        console.error(theServer + "api/programs/" + this.props.params.program_id + "/", status, err.toString());
      }.bind(this),


    });
  }



    handleFormSubmit = (step, callback) => {
        var theUrl = theServer + "api/steps/"
    $.ajax({
        url: theUrl,
        dataType: 'json',
        type: 'POST',
        data: step,
        success: callback,
        error: function(xhr, status, err) {
            console.error(theUrl, status, err.toString());
        }.bind(this)
    });
  }

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
        })
        this.selectView(selectedView)

    }

    selectView = (selectedView) => {
        if (selectedView == "calendar") {
            this.showCalendar()
        } else if (selectedView == "list") {
            this.showList()
        }
    }

  componentDidMount() {
      this.determineOptions()
      this.loadProgramsFromServer()
      //var stepsIntervalId = setInterval(this.loadStepsFromServer, 800)
      //this.setState({stepsIntervalId:stepsIntervalId})
      this.loadStepsFromServer()
      $(this.refs['ref_whichStepForm']).hide()
    this.selectView(this.state.selectedView)

        $(".fullPageDiv").hide();
        $(".fullPageDiv").slideToggle();

  }

  handleCancelClicked = () => {
      $(this.refs['ref_whichStepForm']).slideUp()
      this.setState({
          formIsOpen:false,
          headerActionButtonLabel: "Add Step"
      })

  }
  handleOpenForm = () => {
        this.setState({
            openModal:false,
            headerActionButtonLabel: "Close Form",
            formIsOpen:true,
        }, () => {$(this.refs['ref_whichStepForm']).slideDown()} )


    }
    handleReloadItem = () => {
        this.loadStepsFromServer()
    }



  handleCloseForm = () => {
        this.setState({
            headerActionButtonLabel: "Add Step",
            formIsOpen:false,
        }, () => $(this.refs['ref_whichStepForm']).slideUp())

    }

  handleActionClick = () => {
      if (this.state.formIsOpen == true) {
        this.handleCloseForm()

      }
      else {
          this.handleOpenForm()
      }
    }

    render() {

        return (
            <div>
                <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen}/>

                <div className="fullPageDiv">
                    <div className="ui page container">
                        <div className="spacer">&nbsp;</div>
                        <div className="ui alert"></div>
                         <Breadcrumb values={[
                                    {url:"/programs", label:"My Programs"},
                                    {url:"/programs/" + this.props.params.program_id + "/steps/", label:"Program Detail"},

                        ]}/>
                        <div>&nbsp;</div>

                        <ProgramViewEditDeleteItem isListNode={false}
                                                showCloseButton={false}
                                                apiUrl="api/programs/"
                                                id={this.props.params.program_id}
                                                data={this.state.data}
                                                currentView="Basic"
                        />

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

                            <PlanCalendar planId={this.props.params.program_id} events={this.state.stepData} reloadItem={this.handleReloadItem}/>
                            <div className="ui row">&nbsp;</div>

                        </div>
                        <div ref="ref_listView">
                            <FormHeaderWithActionButton actionClick={this.handleActionClick}
                                                        showingForm={this.state.formIsOpen} headerLabel=""
                                                        color="raspberry" buttonLabel={this.state.headerActionButtonLabel}
                                                        closeForm={this.handleCloseForm}
                                                        openForm={this.handleOpenForm}/>

                            <div ref="ref_whichStepForm">

                                <StepForm parentId={this.props.params.program_id}
                                          onSubmit={this.handleStepSubmit}
                                          cancelClicked={this.handleCancelClicked}
                                            serverErrors={this.state.serverErrors} />

                            </div>
                            <div>&nbsp;</div>
                            <div>&nbsp;</div>

                            <StepList programId={this.props.params.program_id} reloadItem={this.handleReloadItem} />

                        </div>





                    </div>
                </div>
            </div>

        )
    }
}

export class ViewSelector extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            selectedView:"list"

        }
    }

    handleCalendarViewClick = () => {
        this.props.viewClick("calendar")
    }

    handleListViewClick = () => {
        this.props.viewClick("list")
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.state.selectedView != nextProps.selectedView) {
            this.setState({
                selectedView: nextProps.selectedView
            })
        }
    }

    render = () => {

        if (this.state.selectedView == "calendar") {
            var calendarSelected = "active raspberry  item"
            var listSelected = " item "
            var calendarIconColor = "Dark"
            var listIconColor = "Light"
        } else if (this.state.selectedView == "list") {
            var listSelected = "active raspberry  item "
            var calendarSelected = " item "
                        var calendarIconColor = "Light"
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

export class ProgramSubscriptionModal extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            modalIsOpen: false,
            program:""
        }
    }

    openModal () {
        this.setState({modalIsOpen: true});
    }

    componentWillReceiveProps(nextProps) {

        if (this.state.modalIsOpen != nextProps.modalIsOpen) {
            this.setState({
                modalIsOpen: nextProps.modalIsOpen
            })
        }

        if (this.state.program != nextProps.program) {
            this.setState({
                program: nextProps.program
            })
        }
    }

    afterOpenModal () {
        // references are now sync'd and can be accessed.
        //this.refs.subtitle.style.color = '#f00';
    }

    closeModal = () => {
            this.setState({
                modalIsOpen: false,
            })
        this.props.closeModalClicked()

    }

    handleFormSubmitted () {
        this.closeModal()
    }



    getButtons() {
        var buttonHtml = ""
        for (var i = 0; i < this.props.buttons.length; i++) {
            var currentButton = this.props.buttons[i]
            buttonHtml = buttonHtml
            return (buttonHtml)
        }
    }

    handleClick = (callbackData ) => {
        this.props.click({action:callbackData.action})
    }

    render() {
        return (<Modal
                            isOpen={this.state.modalIsOpen}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={customStepModalStyles} >
            <div className="ui grid">
                <div className="right floated column noPaddingBottom ">
                <div className="ui right floated button absolutelyNoMargin" onClick={this.closeModal}><i className="large remove icon button "></i></div>
                    </div>
                </div>

            <div className="ui center aligned grid">
                    <div className="ten wide column noPaddingTop noPaddingBottom">
                        <div className="left aligned header  "><h2>{this.props.header}</h2></div>
                    </div>

                    <div className="row"><div className="eight wide column">

                        <ProgramSubscriptionForm program={this.state.program} formSubmitted={this.handleFormSubmitted} />
                        </div></div>
                    </div>


            </Modal>
    )
    }
}

export class ProgramSubscriptionForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            program:"",
            notificationSendMethod:"",
            goalsData:"",
            goal:"",
            planOccurrenceStartDate:moment(),
            goalOptions:[],
        }
    }

    componentDidMount = () => {
        this.getGoals()
        this.setState({
            program: this.props.program
        })
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.state.program != nextProps.program) {
            this.setState({program: nextProps.program})
        }
    }

    getGoals = () => {
        console.log("geGoals")
        var theUrl = theServer + 'api/goals/'
        $.ajax({
            method: 'GET',
            url: theUrl,
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(goalsData) {
                console.log("succes")
                this.setState({
                    goalsData: goalsData.results
                }, () => this.convertGoalDataToGoalOptions())


            }.bind(this),
            error: function(xhr, status, err) {
                console.error(theUrl, status, err.toString());
            //var serverErrors = xhr.responseJSON;
            //this.setState({
            //    serverErrors:serverErrors,
            //})
        }
        })

    }
    handleClick() {
        this.props.click()
    }

    handleSubscribeClicked = () => {
        var theUrl = theServer + "api/planOccurrences/"
        var planOccurrence = {
            program: this.state.program.id,
            goal: this.state.goal,
            startDate: moment(this.state.planOccurrenceStartDate).format("YYYY-MM-DD"),
            isSubscribed:true,
        }
        $.ajax({
                 url: theUrl,
                 dataType: 'json',
                 type: 'POST',
                 data: planOccurrence,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     this.setState({data: data});

                     this.props.formSubmitted()


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

    convertGoalDataToGoalOptions () {
        console.log("convertGoalData")
        var i
        var goalsData = this.state.goalsData
        var goalOptions = []
        for (i=0; i < goalsData.length; i++) {
            console.log(goalsData[i].id + " " + goalsData[i].title)
            var aGoalOption = {value: goalsData[i].id, label: goalsData[i].title}
            goalOptions.push(aGoalOption)

        }
        this.setState({
            goalOptions: goalOptions
        })
    }

    handlePlanOccurrenceStartDateChange(date)   {
        this.setState({startDate: date});
  }


  handleGoalChange(option){
        this.setState({goal: option.value});
      console.log(option.value)
    }

    handleNotificationSendMethodChange(option){
        this.setState({notificationSendMethod: option.value});
    }

    render () {
        return (
            <div className="ui left aligned grid form">
                <div className="ui row">
                        <div className="ui sixteen wide column">


                     <div className="field">

                                      <label htmlFor="id_startDate">Start Date:</label>

                                      <DatePicker selected={this.state.planOccurrenceStartDate}
                                                  onChange={this.handleStartDateChange}/>
                                  </div></div>
                    </div>

<div className="ui row">
    <div className="ui sixteen wide column">
                <div className="fluid field">
                    <KSSelect value={this.state.goal}
                                            valueChange={this.handleGoalChange}
                                            label="Which goal is this plan for?:"
                                            isClearable={false}
                                            name="goal"
                                            options={this.state.goalOptions}
                                            />
                    </div></div>
    </div>
                <div className="ui row">
                        <div className="ui sixteen wide column">

                <div className="fluid field">
                <KSSelect value={this.state.notificationSendMethod}
                                            valueChange={this.handleNotificationSendMethodChange}
                                            label="How would you like your notifications sent?"
                                            isClearable={false}
                                            name="notificationSendMethod"
                                            options={notificationSendMethodOptions}
                                            />

                    </div></div>
                    </div>
                <div className="ui row">
                        <div className="ui sixteen wide column">

                <div className="fluid field">
                <ChoiceModalButton key="key_subscribeButton" click={this.handleSubscribeClicked} color="purple" action="subscribe"
                                       text="Subscribe"/>
                </div>
                            </div>
                    </div>
                </div>


        )
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class ProgramForm extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)
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

        $(this.refs['ref_whichProgramForm']).hide()

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
                startDate: moment(nextProps.data.startDate, "YYYY-MM-DD"),
                scheduleLength:nextProps.data.scheduleLength,


                viewableBy: nextProps.data.viewableBy,
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




    handleEditorChange(e)  {

        this.setState({description: e});
  }

    handleCostChange (newValue){
        this.setState({cost: newValue});
    }

    handleScheduleLengthChange (option) {
        this.setState({scheduleLength: option.value});
    }

    handleCostFrequencyMetricChange(option) {

            this.setState({costFrequencyMetric: option.value})
    }

    handleViewableByChange(option) {

            this.setState({viewableBy: option.value})
    }



    handleTimeCommitmentChange(option){
        this.setState({timeCommitment: option.value});
    }

    getDescriptionEditor () {
         //if (this.props.isListNode) {
             var wideColumnWidth = "sixteen wide column"
            var mediumColumnWidth = "sixteen wide column"
            var smallColumnWidth = "eight wide column"

           // } else {


           // var wideColumnWidth = "ten wide column"
           // var mediumColumnWidth = "four wide column"
          //  var smallColumnWidth = "three wide column"
        //}
        if (this.state.description == null) {
            return ("")
        } else {
            return (<div className="ui row">
                <div className={wideColumnWidth}>
                    <div className="field fluid">
                        <label htmlFor="id_description">Description:</label>
                        <TinyMCEInput name="description"
                                      value={this.state.description}
                                      tinymceConfig={TINYMCE_CONFIG}
                                      onChange={this.handleEditorChange}
                        />


                    </div>
                </div>
                <div className="six wide column">&nbsp;</div>

            </div>)
        }
    }



    getImageEditSection() {
        console.log(this.state.width)

        if (this.props.isListNode) {
            var wideColumnWidth = "sixteen wide column"
            var mediumColumnWidth = "sixteen wide column"
            var smallColumnWidth = "eight wide column"
            }

        else if (this.state.width > 800) {
            var wideColumnWidth = "ten wide column"
            var mediumColumnWidth = "four wide column"
            var smallColumnWidth = "three wide column"
        }

        if (false) {
            var theImage = this.state.image
            var theFilename = theImage.replace("https://kiterope.s3.amazonaws.com:443/images/", "");

            return (
                <div className="ui row">

                    <div className={mediumColumnWidth}>
                        <div className="field">
                            <label htmlFor="id_image">Program's Poster Image:</label>
                            <DropzoneS3Uploader filename={theFilename}
                                                onFinish={this.handleFinishedUpload} {...uploaderProps} />


                        </div>
                    </div>
                </div>
            )

        } else {
            return (
                <div className="ui row">

                    <div className={mediumColumnWidth}>
                        <div className="field">
                            <label htmlFor="id_image">Program's Poster Image:</label>
                            <DropzoneS3Uploader
                                                onFinish={this.handleFinishedUpload} {...uploaderProps} />


                        </div>
                    </div>
                </div>
            )
        }
    }

    handleFinishedUpload (value) {
            var fullUrl = value.signedUrl;
            var urlForDatabase = fullUrl.split("?")[0];
            urlForDatabase = urlForDatabase.replace(s3ImageUrl, "");
            this.setState({image: urlForDatabase});
    }


    handleTitleChange(value) {

            this.setState({title: value})
    }







    checkIfUser() {
        $.ajax({
            method: 'GET',
            url: '/api/users/i/',
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(res) {
                this.setState({
                    'user': res
                })
            }.bind(this),
            error: function(xhr, status, err) {
                console.error("this is bad", status, err.toString());
        }
        })
    }


    handleCancelClicked() {
        this.props.cancelClicked()
    }

    handleSubmit(e) {
        e.preventDefault();
        this.checkIfUser()

        if (this.props.storeRoot.user) {
            var author = this.props.storeRoot.user.id
            var title = this.state.title;
            var description = this.state.description;
            var viewableBy = this.state.viewableBy;
            var image = this.state.image;
            var scheduleLength = this.state.scheduleLength;
            var startDate = moment(this.state.startDate).format("YYYY-MM-DD")
            var timeCommitment = this.state.timeCommitment;
            var cost = this.state.cost;
            var costFrequencyMetric = this.state.costFrequencyMetric;

            var programData = {
                author: author,
                title: title,
                image: image,
                description: description,
                viewableBy: viewableBy,
                scheduleLength: scheduleLength,
                timeCommitment: timeCommitment,
                cost: cost,
                startDate:startDate,
                costFrequencyMetric: costFrequencyMetric,
            }

            if (this.state.id != "") {
                programData.id = this.state.id
            }
            this.props.onProgramSubmit(programData, this.resetForm)


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
        }

        handleImageChange = (callbackData) => {
        this.setState({
            image: callbackData.image
        })
    }


        getForm = () => {


            if (this.state.id) {
                var buttonText = "Save"

            } else {
                var buttonText = "Create"
            }


            if (this.state.image) {
                var imageUrl = this.state.image


            } else {
                var imageUrl = "goalItem.svg"
            }


            var descriptionEditor = this.getDescriptionEditor()

            if (this.props.isListNode) {
                var wideColumnWidth = "sixteen wide column"
            var mediumColumnWidth = "sixteen wide column"
            var smallColumnWidth = "eight wide column"

            } else{


            var wideColumnWidth = "sixteen wide column"
            var mediumColumnWidth = "eight wide column"
            var smallColumnWidth = "four wide column"
        }
          return (
              <div className="ui page container">

                  <div>{this.props.programHeaderErrors}</div>
                  <div className="ui row">&nbsp;</div>


                      <div className="ui three column grid">

                          <div className="ui row">
                              <Measure onMeasure={(dimensions) => {this.setState({dimensions})}}>

<div className={mediumColumnWidth}>


<ImageUploader imageReturned={this.handleImageChange} dimensions={this.state.dimensions}
                                         label="Select an image that will help motivate you." defaultImage={imageUrl}/></div></Measure></div>


                          <div className="ui row">
                              <div className={wideColumnWidth}>

                                  <ValidatedInput
                                      type="text"
                                      name="title"
                                      label="Title"
                                      id="id_title"
                                      placeholder="Program's title"
                                      value={this.state.title}
                                      initialValue={this.state.title}
                                      validators='"!isEmpty(str)"'
                                      onChange={this.validate}
                                      stateCallback={this.handleTitleChange}
                                      serverErrors={this.state.serverErrors.title}

                                  />
 </div>
                              </div>


                          {descriptionEditor}


                          <div className="ui row">
                              <div className={smallColumnWidth}>
                                  <div className="field"><label htmlFor="id_lengthOfSchedule">Length of
                                      Schedule:</label>

                                      <Select value={this.state.scheduleLength}
                                              onChange={this.handleScheduleLengthChange} name="scheduleLength"
                                              options={programScheduleLengths}   clearable={false}/>
                                  </div>
                              </div>

                              <div className={smallColumnWidth}>
                                  <div className="field">

                                      <label className="tooltip" htmlFor="id_startDate">Start Date:<i
                                          className="info circle icon"></i>
                                          <span className="tooltiptext">A start date for your program makes scheduling its steps easier. Your users can choose whatever start date they would like.</span>
                                      </label>

                                      <DatePicker selected={this.state.startDate}
                                                  onChange={this.handleStartDateChange}/>
                                  </div>
                              </div>
                          </div>
                          <div className="ui row">
                              <div className={smallColumnWidth}>
                                  <KSSelect value={this.state.timeCommitment}
                                            valueChange={this.handleTimeCommitmentChange}
                                            label="Time Commitment:"
                                            isClearable={false}
                                            name="timeCommitment"
                                            options={timeCommitmentOptions}
                                            serverErrors={this.state.serverErrors.timeCommitment}
                                            />
                                  </div>
                              </div>


                          <div className="ui row">
                              <div className={smallColumnWidth}>
                                  <div className="field">
                                      <label htmlFor="id_startDate">Cost (in US dollars):</label>

                                      <CurrencyInput value={this.state.cost} onChange={this.handleCostChange}/>
                                  </div>
                              </div>

                              <div className={smallColumnWidth}>
                                  <div className="field">

                                      <label htmlFor="id_costFrequencyMetric">Frequency:</label>
                                      <Select value={this.state.costFrequencyMetric}
                                              onChange={this.handleCostFrequencyMetricChange} name="costFrequencyMetric"
                                              options={costFrequencyMetricOptions} clearable={false}/>


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
          )

    }





    render() {

    var theForm = this.getForm()

            return(
                <div >
                    <form className="ui form" onSubmit={this.handleSubmit}>
                        {theForm}
                    </form>
                </div>

            )
        }



}

export class SimpleProgramForm extends ProgramForm {
    constructor(props) {
        super(props)
        autobind(this)
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

        var imageUrl = s3ImageUrl + this.state.image
        var startDate = moment(this.state.startDate).format("MMM DD, YYYY")
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

        )}

    render() {
    var theForm = this.getForm()

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

export class ProgramList extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            data:[]
        }
    }

    componentDidMount () {
        this.loadProgramsFromServer()
    }

    handleReloadItem = () => {
        this.loadProgramsFromServer
    }

    loadProgramsFromServer = () => {
        var theURL = theServer + "api/goals/" + this.props.parentId + "/programs"

      $.ajax({
      url: theURL,
      dataType: 'json',
      cache: false,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
      success: function(data) {
        this.setState({
            count: data.count,
            next:data.next,
            previous:data.previous,
            data: data.results});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this),

    });
  }

    componentWillReceiveProps(nextProps) {
        if (this.state.data != nextProps.data && nextProps.data != null) {

            this.setState({
                data:nextProps.data
            })
        }
    }

     handleNeedsLogin = () => {
         this.props.needsLogin()
     }


    render () {
        var placeholderImageStyle = {
            backgroundImage: "url('http://semantic-ui.com/images/avatar2/large/kristy.png')",
            width: '300px',
            height: '300px',
        }

        if (this.state.data) {

        var programList = this.state.data.map((program) => {
            return (
                    <ProgramViewEditDeleteItem key={program.id}
                                            isListNode={true}
                                            showCloseButton={false}
                                            apiUrl="api/programs/"
                                            id={program.id}
                                            data={program}
                                            currentView="Basic"
                                               needsLogin={this.handleNeedsLogin}
                                               reloadItem={this.handleReloadItem}
                    />

)

            //return (<PlanListNode key={plan.id} plan={plan}/>)
        })
    }


    return (
          <div className='ui three column doubling stackable grid'>
        {programList}
      </div>
    );
  }

}


export class ProgramListNode extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)

    }
    componentDidMount() {

    }

    clearPage = () => {

        hashHistory.push('/programs/' + this.props.program.id + '/steps')


    }

    render () {

        if (this.props.program.image) {
            var theImage = <img className="clippedImage" src={s3ImageUrl + this.props.program.image}/>

        } else {
            var theImage = <img className="clippedImage" src='http://semantic-ui.com/images/avatar2/large/kristy.png' />
        }
        return(
            <div  className="column">
                            <div className="ui fluid card overlayedImageContainer" onClick={this.clearPage}>
                                <div className="image overlayedImage">{theImage}
                                    <div className="overlayText">{this.props.program.title}</div>
                                </div>

                            </div>

                </div>

        )
    }

}

export class ProgramBasicView extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:"",
        }
    }

    componentDidMount() {
        this.setState({
            data:this.props.data,
        })
    }
    componentWillReceiveProps (nextProps) {
        if (this.state.data != nextProps.data) {
            this.setState({
                data:nextProps.data
            })
        }
    }

    findLabel (theValue, theArray) {
        var returnValue = "Not available"
        if (theValue) {
            for (var i = 0; i < theArray.length; i++) {
                if (theValue == theArray[i].value) {
                    returnValue =  theArray[i].label
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
        hashHistory.push("/programs/" + this.state.data.id + "/steps")

}
    render() {

        if (this.state.data.image) {
            var imageUrl = s3ImageUrl + this.state.data.image
        } else {
            var imageUrl = s3ImageUrl + "images/goalItem.svg"
        }
        var theCost
            if (this.state.data.cost == 0.00 || this.state.data.costFrequencyMetric == "FREE") {
                theCost = "Free"
            }
            else {
                theCost =  this.state.data.cost + " " + this.findLabel(this.state.data.costFrequencyMetric, costFrequencyMetricOptions)
            }
            var theScheduleLength = this.findLabel(this.state.data.scheduleLength, programScheduleLengths)
            var theTimeCommitment = this.findLabel(this.state.data.timeCommitment, timeCommitmentOptions)

        if (this.props.isListNode) {

            return (
                <div onClick={this.goToDetail}>
                    <ClippedImage item="plan" src={imageUrl} />


                <div className="ui grid" >
                    <div className="sixteen wide column">

                        <div className="planTitle">                {this.state.data.title}

                        </div>
                        <div className="row">&nbsp;</div>

                        <div className="row" >
                            <div className="ui two column grid">
                                <div className="ui left aligned column">
                                    <IconLabelCombo size="extramini" orientation="left" text="100% Success" icon="success" background="Light" link="/goalEntry" />
</div>
                                <div className="ui right aligned column">
                                    <IconLabelCombo size="extramini" orientation="right" text={theScheduleLength} icon="deadline" background="Light" link="/goalEntry" />
</div></div>
                            </div>
                        <div className="row" >

                            <div className="ui two column grid">
                                <div className="ui left aligned column">
                                    <IconLabelCombo size="extramini" orientation="left" text={theCost} icon="cost" background="Light" link="/goalEntry" />
</div>
                                <div className="ui right aligned column">
                                    <IconLabelCombo size="extramini" orientation="right" text={theTimeCommitment} icon="timeCommitment" background="Light" link="/goalEntry" />
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
                        <img className="ui image" src={imageUrl}></img>
                    </div>
                    <div className="eight wide column">
                        <div className="fluid row">
                            <h3>{this.state.data.title}</h3>
                        </div>
                        <div className="fluid row" dangerouslySetInnerHTML={{__html: this.state.data.description}}/>
                    </div>
                    <div className="right aligned six wide column">
                        <IconLabelCombo size="extramini" orientation="right" text="100% Success" icon="success" background="Light" link="/goalEntry" />
                                    <IconLabelCombo size="extramini" orientation="right" text={theScheduleLength} icon="deadline" background="Light" link="/goalEntry" />
                                    <IconLabelCombo size="extramini" orientation="right" text={theCost}  icon="cost" background="Light" link="/goalEntry" />
                                    <IconLabelCombo size="extramini" orientation="right" text={theTimeCommitment} icon="timeCommitment" background="Light" link="/goalEntry" />
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



module.exports = { GoalHeader, ProgramDetailPage, SimpleProgramForm, ProgramForm, ProgramBasicView , ProgramList, ProgramListPage, ProgramSubscriptionForm, ProgramSubscriptionModal};