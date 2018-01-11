var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {ImageUploader, Breadcrumb,  PlanViewEditDeleteItem, ProgramViewEditDeleteItem, FormAction, Sidebar, Header, FormHeaderWithActionButton, DetailPage} from './base';
import {PlanHeader, StepList, StepModalForm, ToggleButton} from './step';
import {ProgramCalendar } from './calendar'
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router';
import { Menubar, StandardSetOfComponents, ErrorReporter, Footer } from './accounts'
import autobind from 'class-autobind'
import {StandardSetOfComponentsContainer} from './redux/containers'
import Measure from 'react-measure'
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'


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
import Phone from 'react-phone-number-input'
import rrui from 'react-phone-number-input/rrui.css'
import rpni from 'react-phone-number-input/style.css'
import {VisualizationsList, VisualizationModalForm} from './visualization'

import {UserLink } from './profile'

import { UpdateModalForm } from './update'


import { makeEditable,   } from './calendar'
import { MessageWindowContainer } from './message'

import { Provider, connect, dispatch } from 'react-redux'
import  {store} from "./redux/store";

import { mapStateToProps, mapDispatchToProps } from './redux/containers'

import { addVisualization, deleteVisualization, setProgramModalData, editVisualization, addPlan, removePlan, updateProgram, shouldReload, setStepModalData, setPlan, addStep, deleteStep, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, setContacts, setStepOccurrences } from './redux/actions'

import { theServer, times, s3IconUrl, formats, s3BaseUrl, stepModalStyle, programCategoryOptions, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, programScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, viewableByOptions, subscribeModalStyle, customStepModalStyles, notificationSendMethodOptions, TINYMCE_CONFIG } from './constants'

$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Connection', 'keep-alive');
        //xhr.setRequestHeader('Authorization', 'Token ' + localStorage.token);

    }
});

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

function getArrayObjectById(theArray, theId) {
    var returnObject = "";
    for (var i = 0; i < theArray.length; i += 1) {
        var theArrayObject = theArray[i];
        if (theArrayObject.id == theId) {
            returnObject = theArrayObject;
        }
    }
    return returnObject
}

@connect(mapStateToProps, mapDispatchToProps)
export class ProgramModalForm extends React.Component {
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
            cost: "0.0",
            costFrequencyMetric: "MONTH",
            editable:false,
            data:"",
            category:"UNCATEGORIZED",
            serverErrors:{},
            modalIsOpen:false,

        }


    }




    componentDidMount () {

        $(this.refs['ref_whichProgramForm']).hide();
        this.setState({
            serverErrors: this.props.serverErrors,

            })

        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.programModalData != undefined) {
                this.setState({programModalData:this.props.storeRoot.programModalData})
                    this.setStateToData(this.props.storeRoot.programModalData)


            }
        }


    }

    setStateToData (programModalData) {
        this.setState({
            modalIsOpen: programModalData.modalIsOpen,

        })
        if (programModalData.data != undefined ) {

            var data = programModalData.data


             if (data.image != undefined) {
                var image = data.image
            }
            else {
                var image = this.state.image
            }

            if (data.title != undefined) {
                var title = data.title
            }
            else {
                var title = this.state.title
            }

            if (data.description != undefined) {
                var description = data.description
            }
            else {
                var description = this.state.description
            }


            if (data.startDate != null) {
                var startDate = moment(data.startDate, "YYYY-MM-DD")
            }
            else {
                var startDate = moment()
            }

             if (data.scheduleLength != undefined) {
                var scheduleLength = data.scheduleLength
            }
            else {
                var scheduleLength = this.state.scheduleLength
            }

            if (data.viewableBy != undefined) {
                var viewableBy = data.viewableBy
            }
            else {
                var viewableBy = this.state.viewableBy
            }


            if (data.timeCommitment != undefined) {
                var timeCommitment = data.timeCommitment
            }
            else {
                var timeCommitment = this.state.timeCommitment
            }


            if (data.cost != undefined) {
                var cost = data.cost
            }
            else {
                var cost = this.state.cost
            }

            if (data.costFrequencyMetric != undefined) {
                var costFrequencyMetric = data.costFrequencyMetric
            }
            else {
                var costFrequencyMetric = this.state.costFrequencyMetric
            }

            if (data.category != undefined) {
                var category = data.category
            }
            else {
                var category = this.state.category
            }


            //var startDate = data.startDate;

            ///var endDate = data.endDate;

            //var programStartDateInStringForm = data.programStartDate;
            //var programStartDateInMomentForm = moment(programStartDateInStringForm);
            //var calculatedStartDate = convertDate(programStartDateInMomentForm, startDate, "momentFormat", "relativeTime").format("YYYY-MM-DD");
            //var calculatedEndDate = convertDate(programStartDateInMomentForm, endDate, "momentFormat", "relativeTime").format("YYYY-MM-DD");
            //calculatedStartDate = moment(calculatedStartDate);
            //calculatedEndDate = moment(calculatedEndDate);



            if (data.id != undefined) {
                this.setState({
                    id: data.id,
                    saved:"Saved"
                })
            } else {
                this.setState({
                    id:"",
                    saved:"Create"
                })
            }

            this.setState({
                image: image,
                title: title,
                description: description,
                startDate: startDate,
                scheduleLength: scheduleLength,
                viewableBy: viewableBy,
                timeCommitment: timeCommitment,
                cost: cost,
                costFrequencyMetric: costFrequencyMetric,
                category: category,

            },() => {
                ///this.showAndHideTypeUIElements(this.state.type)
                //this.showAndHideFrequencyUIElements(this.state.frequency)
            });



        }
    }


    componentWillReceiveProps(nextProps) {


        if (this.state.serverErrors != nextProps.serverErrors) {
            this.setState({
                serverErrors: nextProps.serverErrors
            })
        }

         if (this.state.serverErrors != nextProps.serverErrors) {
            this.setState({serverErrors: nextProps.serverErrors})
        }

        if (nextProps.storeRoot.programModalData != undefined ) {
            if (this.state.programModalData != nextProps.storeRoot.programModalData) {
                this.setState({programModalData:nextProps.storeRoot.programModalData })

                    this.setStateToData(nextProps.storeRoot.programModalData)

                }


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

    handleCategoryChange(option){
        this.setState({category: option.value});
    }

    getDescriptionEditor () {
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





    handleFinishedUpload (value) {
            var fullUrl = value.signedUrl;
            var urlForDatabase = fullUrl.split("?")[0];
            urlForDatabase = urlForDatabase.replace(s3BaseUrl, "");
            this.setState({image: urlForDatabase});
    }


    handleTitleChange(value) {

            this.setState({title: value})
    }



closeModal() {
            this.setState({modalIsOpen: false});
            this.resetForm()


        }


    getServerErrors(fieldName) {
        if (this.state.serverErrors == undefined) {
            return ""
        } else {
            return this.state.serverErrors[fieldName]
        }
    }


    handleCancelClicked() {
this.closeModal()
    }

    handleProgramSubmitOld (program, callback) {

            var theUrl = "/api/programs/";

            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'POST',
                data: program,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    this.handleCloseForm();
                    store.dispatch(addProgram(data));

                    //this.loadProgramsFromServer()
                    callback

                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                    })

                }.bind(this)
            });


  }

    handleProgramSubmit = (program) => {

        if ((program.id != "" ) &&  (program.id != undefined )){

            var theUrl = "/api/programs/" + program.id + "/";
            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'PATCH',
                data: program,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    this.setState({
                        updates:[],
                         saved: "Saved"
                    });
                    store.dispatch(updateProgram(data));



                    this.closeModal();


                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                         saved: "Save"
                    })

                }.bind(this)
            });
        }
        else {

            $.ajax({
                url: "/api/programs/",
                dataType: 'json',
                type: 'POST',
                data: program,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    store.dispatch(addProgram(data));
                    this.closeModal();


                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                         saved: "Save"
                    })

                }.bind(this)
            });
        }


    };

    handleSubmit() {
        this.setState({saved:"Saving"})


        if (this.props.storeRoot.user) {
            var author = this.props.storeRoot.user.id;
            var title = this.state.title;
            var description = this.state.description;
            var viewableBy = this.state.viewableBy;
            var image = this.state.image;
            var scheduleLength = this.state.scheduleLength;
            var startDate = moment(this.state.startDate).format("YYYY-MM-DD");
            var timeCommitment = this.state.timeCommitment;
            var cost = this.state.cost;
            var costFrequencyMetric = this.state.costFrequencyMetric;
            var category = this.state.category;

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
                category : category
            };

            if (this.state.id != "") {
                programData.id = this.state.id
            }
            //this.props.onProgramSubmit(programData, this.resetForm)
            this.handleProgramSubmit(programData)


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
                    category:"UNCATEGORIZED",
                    modalIsOpen: false,

                },            () =>        { store.dispatch(setProgramModalData(this.state))}


            );

        };

        handleImageChange = (callbackData) => {
        this.setState({
            image: callbackData.image
        })
    };




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


            var descriptionEditor = this.getDescriptionEditor();

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

                  <div>{this.props.programHeaderErrors}</div>
                  <div className="ui row">&nbsp;</div>


                      <div className="ui three column grid">

                          <div className="ui row">
                              <Measure onMeasure={(dimensions) => {this.setState({dimensions})}}>

<div className={mediumColumnWidth}>


<ImageUploader imageReturned={this.handleImageChange} dimensions={this.state.dimensions}
                                         label="Select an image that will help motivate you." defaultImage={imageUrl}/></div></Measure></div>


                          <div className="ui field row">
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
                                      serverErrors={this.getServerErrors("title")}

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

                          <div className="ui row">
                              <div className={mediumColumnWidth}>
                                  <KSSelect value={this.state.category}
                                            valueChange={this.handleCategoryChange}
                                            label="Category:"
                                            isClearable={false}
                                            name="programCategory"
                                            options={programCategoryOptions}
                                            />
                                  </div>
                              </div>



                  </div>
                                    <VisualizationsList programId={this.state.id} />


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

    };





    render() {

    var theForm = this.getForm();
        if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if (forMobile) {
             var modalStyle = stepModalStyle

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


@connect(mapStateToProps, mapDispatchToProps)
export class ProgramListPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
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

    };

    reload = () => {
        this.loadProgramsFromServer
    };

    handleProgramSubmit (program, callback) {

            var theUrl = "/api/programs/";

            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'POST',
                data: program,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    this.handleCloseForm();
                    store.dispatch(addProgram(data));

                    //this.loadProgramsFromServer()
                    callback

                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                    })

                }.bind(this)
            });


  }







  loadProgramsFromServer = () => {
      //if (this.state.activePage != 1) {
        //        var theUrl = "api/programs/?page=" + this.state.activePage
      //}  else {
         var theUrl = "/api/programs/";
      //}
    $.ajax({
      url: theUrl,
      dataType: 'json',
      cache: false,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
      success: function(data) {
            store.dispatch(setPrograms(data.results))

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());

      }.bind(this),

    });
  };


handleToggleForm = () => {


        $(this.refs['ref_whichProgramForm']).slideToggle()
    };

    componentDidMount() {
        //this.loadProgramsFromServer();
        //var intervalID = setInterval(this.loadCommentsFromServer, 2000);
        //this.setState({intervalID: intervalID});
        //var self = this;
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

    };

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


    };
    handleReloadItem = () => {
        //this.loadProgramsFromServer()
    };
handleCancelClicked = () => {
      $(this.refs['ref_whichProgramForm']).slideUp();
      this.setState({
          formIsOpen:false,
          headerActionButtonLabel: "Create Program"
      })

  };

  handleNeedsLogin = () => {
      this.setState({
          signInOrSignUpModalFormIsOpen: true
      })
  };

  handleCloseForm = () => {
        this.setState({
            headerActionButtonLabel: "Create Program",
            formIsOpen:false,
        }, () => $(this.refs['ref_whichProgramForm']).slideUp())

    };

  handleActionClick = () => {

      console.log("setProgrmaModalData")
      store.dispatch(setProgramModalData({modalIsOpen:true, data:{}}))

      //store.dispatch(setStepModalData({modalIsOpen:true, data:{}}))

      /*
      if (this.state.formIsOpen == true) {

        this.handleCloseForm()

      }
      else {
          this.handleOpenForm()
      }*/
    };


componentWillUnmount() {
   // use intervalId from the state to clear the interval
   //clearInterval(this.state.intervalId);
}
    toggle() {
        $(this.refs['ref_whichProgramForm']).slideToggle()
    }

  render() {
      var pagination = this.getPagination();

    return (

<div>
    <StandardSetOfComponents  modalIsOpen={this.state.signInOrSignUpModalFormIsOpen}/>
        <div className="fullPageDiv">
            <div className="ui page container footerAtBottom">


            <div className="spacer">&nbsp;</div>
            <div className="ui large breadcrumb">
                <Link to={`/`}><div className="section">Home</div></Link>

                  <i className="right chevron icon divider"></i>
                  <Link to={`/`}><div className="active section">My Programs</div></Link>
            </div>
            <div>&nbsp;</div>
                <FormHeaderWithActionButton actionClick={this.handleActionClick} headerLabel="Programs" color="green" buttonLabel={this.state.headerActionButtonLabel} toggleForm={this.handleToggleForm}/>
        <div ref="ref_whichProgramForm">
             <ProgramModalForm />
            <ProgramForm cancelClicked={this.handleCancelClicked} onProgramSubmit={this.handleProgramSubmit} serverErrors={this.state.serverErrors} />
            </div>

                    <ProgramList data={this.props.storeRoot.programs} needsLogin={this.handleNeedsLogin} reloadItem={this.handleReloadItem}/>
                <div className="spacer">&nbsp;</div>
                {pagination}
            </div>
            </div>
    <Footer />
</div>
    );
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export class ProgramDetailPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[],
            editable:false,
            openModal:false,
            formIsOpen:false,
            stepData:[],
            activePage:1,
            selectedView:"list",
            headerActionButtonLabel:"Add Step",
            stepArray:[],
        }
    }

    loadStepsFromServer = () => {
        var theUrl = "/api/programs/" + this.props.params.program_id + "/steps";
        $.ajax({
          url: theUrl ,
          dataType: 'json',
          cache: false,
          success: function(data) {
            this.setState({
                stepData: data.results,
            });

          }.bind(this),
          error: function(xhr, status, err) {
            console.error(theUrl, status, err.toString());
          }.bind(this)
        });
      };





    componentWillUnmount = () => {
        //clearInterval(this.state.stepsIntervalId);

    };



  determineOptions = () => {
              //var theUrl = theServer + "api/goals/" + this.props.params.goal_id + "/"

      $.ajax({
      url:  "/api/programs/" + this.props.params.program_id + "/",
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
        console.error( "/api/programs/" + this.props.params.program_id + "/", status, err.toString());
      }.bind(this),


    });
  };



    handleFormSubmit = (step, callback) => {
        var theUrl =  "/api/steps/";
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
          var thePrograms = this.props.storeRoot.programs;
      if (thePrograms != undefined) {

          //this.setState({data: getArrayObjectById(thePrograms, this.props.params.program_id)})
          this.setState({data: thePrograms[this.props.params.program_id]}, this.convertStepsIntoArray()

)

      }




      this.determineOptions();
      //this.loadProgramsFromServer()
      //var stepsIntervalId = setInterval(this.loadStepsFromServer, 800)
      //this.setState({stepsIntervalId:stepsIntervalId})
      //this.loadStepsFromServer()
      //$(this.refs['ref_whichStepForm']).hide();
    this.selectView(this.state.selectedView);

        $(".fullPageDiv").hide();
        $(".fullPageDiv").slideToggle();

  }

  buildOptionsForProgramUpdates (programUpdatesData) {
        var theData = []
        theData.push({value:null, label:"Create New Update"})
        programUpdatesData.map(function (programUpdate) {
            var theDatum = {value:programUpdate.id, label:programUpdate.name}
            theData.push(theDatum)
        })

        return theData
    }

  componentWillReceiveProps(nextProps) {
       if (this.state.data != nextProps.storeRoot.programs) {
           if (nextProps.storeRoot.programs != undefined) {
               var thePrograms = nextProps.storeRoot.programs;
               //this.setState({data: getArrayObjectById(thePrograms, this.props.params.program_id)})
                         this.setState({data: thePrograms[this.props.params.program_id]}, this.convertStepsIntoArray(thePrograms[this.props.params.program_id].steps))

           }
       }





        }




    handleReloadItem = () => {
        //this.loadStepsFromServer()
    };



  handleActionClick = () => {
      console.log("handle action click")
                  store.dispatch(setStepModalData({modalIsOpen:true, data:{}}))
      /*if (this.state.formIsOpen == true) {
        this.handleCloseForm()

      }
      else {
          this.handleOpenForm()
      }*/
    };

    convertStepsIntoArray(theSteps) {
        var stepArray = [];
        for (var key in theSteps) {
            var theStep = theSteps[key];
            stepArray.push(theStep)
        }
        this.setState({
            stepArray: stepArray
        })

}


    render() {


        return (
            <div>
                <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen} />

                    <div className="ui container footerAtBottom">
                        <div className="spacer">&nbsp;</div>
                        <div className="ui alert"></div>
                         <Breadcrumb values={[
                                    {url:"/programs", label:"My Programs"},
                                    {url:"/programs/" + this.props.params.program_id + "/steps/", label:"Program Detail"},

                        ]}/>
                        <div>&nbsp;</div>


                        <ProgramViewEditDeleteItem isListNode={false}
                                                showCloseButton={false}
                                                apiUrl="/api/programs/"
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

                            <ProgramCalendar planId={this.props.params.program_id} events={this.state.stepArray} reloadItem={this.handleReloadItem}/>
                            <div className="ui row">&nbsp;</div>

                        </div>
                        <div ref="ref_listView">
                            <FormHeaderWithActionButton actionClick={this.handleActionClick}
                                                        headerLabel=""
                                                        color="red" buttonLabel={this.state.headerActionButtonLabel}/>

                            <div>&nbsp;</div>
                            <div>&nbsp;</div>

                            <StepList programId={this.props.params.program_id}  data={this.state.data.steps} reloadItem={this.handleReloadItem} />

                        </div>
                        <StepModalForm
                                parentId={this.props.params.program_id}
                              isListNode={false}
                              myRef="ref_form"
                              data={this.state.data}
                              serverErrors={this.state.serverErrors}/>
<UpdateModalForm programId={this.props.params.program_id} />
                        <VisualizationModalForm programId={this.props.params.program_id} />
                                     <ProgramModalForm />






                    </div>
                <Footer />
            </div>

        )
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class ProgramDetailPageNoSteps extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[],
            editable:false,
            openModal:false,
            formIsOpen:false,
            stepData:[],
            activePage:1,
            selectedView:"list",
            headerActionButtonLabel:"Add Step",
            stepArray:[],
            userPlanOccurrenceId:"",
        }
    }




    loadProgramsFromServer = () => {
        console.log("load plans from server");
    $.ajax({
      url: "/api/plan/view/" + this.props.params.program_id + "/",
      dataType: 'json',
        type: 'GET',

      cache: false,
      success: function(programData) {
        this.setState({
            data: programData[0]});

        store.dispatch(shouldReload(""))
      }.bind(this),
      error: function(xhr, status, err) {
        console.error( "/api/plan/view/" + this.props.params.program_id + "/", status, err.toString());
      }.bind(this),

    });
  };


    componentWillUnmount = () => {
        //clearInterval(this.state.stepsIntervalId);

    };

    componentWillReceiveProps(nextProps) {
        if (this.props.storeRoot) {
            if (this.props.storeRoot.gui.shouldReload != nextProps.storeRoot.gui.shouldReload) {
                if (nextProps.storeRoot.gui.shouldReload == "subscribed") {
                    this.loadProgramsFromServer()
                }
            }
        }
    }




  componentDidMount() {
      this.loadProgramsFromServer()

  }

  determineIfSubscribed() {


        if (this.state.data ) {


            if (this.props.storeRoot) {
                if (this.props.storeRoot.plans) {
                    for (var key in this.props.storeRoot.plans) {
                        if ((this.props.storeRoot.plans[key].program == this.state.data.id) && (this.props.storeRoot.plans[key].isSubscribed)) {
                            var theStateData = this.state.data;
                            theStateData.isSubscribed = this.props.storeRoot.plans[key].isSubscribed;
                            this.setState({data: theStateData});
                            this.setState({
                                userPlanOccurrenceId : key
                            })

                        }
                    }

                }
            }
        }
  }










    render() {
        if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }

        if (forMobile){

                var listNodeOrMobile = true}


        return (
            <div>
                <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen}/>

                    <div className="ui container footerAtBottom">
                        <div className="spacer">&nbsp;</div>
                        <div className="ui alert"></div>
                         <Breadcrumb values={[
                                    {url:"/plan/view/" + this.props.params.program_id , label:"Plan Detail"},

                        ]}/>
                        <div>&nbsp;</div>

                        <ProgramViewEditDeleteItem isListNode={listNodeOrMobile}
                                                showCloseButton={false}
                                                apiUrl="/api/programs/"
                                                id={this.props.params.program_id}
                                                data={this.state.data}
                                                currentView="Basic"
                                                   userPlanOccurrenceId = {this.state.userPlanOccurrenceId}

                                                   extendedBasic={true}
                        />








                    </div>
                <Footer />
            </div>

        )
    }
}

export class ViewSelector extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            selectedView:"list"

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
            var calendarSelected = "active red  item";
            var listSelected = " item ";
            var calendarIconColor = "Dark";
            var listIconColor = "Light"
        } else if (this.state.selectedView == "list") {
            var listSelected = "active red  item ";
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
            });
        this.props.closeModalClicked()

    };

    handleFormSubmitted () {
        this.closeModal()
    }



    getButtons() {
        var buttonHtml = "";
        for (var i = 0; i < this.props.buttons.length; i++) {
            var currentButton = this.props.buttons[i];
            buttonHtml = buttonHtml;
            return (buttonHtml)
        }
    }

    handleClick = (callbackData ) => {
        this.props.click({action:callbackData.action})
    };

    render() {
        return (<Modal
                            isOpen={this.state.modalIsOpen}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={subscribeModalStyle} >
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

@connect(mapStateToProps, mapDispatchToProps)
export class ProgramSubscriptionForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            program:"",
            notificationMethod:"",
            goalsData:"",
            goal:"",
            planOccurrenceStartDate:moment(),
            goalOptions:[],
        }
    }

    componentDidMount = () => {

        //this.getGoals()
        this.setState({
            program: this.props.program
        });

        if (this.props.storeRoot) {

            if (this.props.storeRoot.goals) {
                this.setState({
            goalsData: this.props.storeRoot.goals
        },     this.convertGoalDataToGoalOptions )
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

    componentWillReceiveProps = (nextProps) => {
        if (this.state.program != nextProps.program) {
            this.setState({program: nextProps.program})
        }

        if (this.props.storeRoot) {
            if (this.state.goalsData != this.props.storeRoot.goals) {
                console.log("inside the componetWill receive props");
                this.setState({
            goalsData: this.props.storeRoot.goals
        },     this.convertGoalDataToGoalOptions
)
            }
        }
    };

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

    handleSubscribeClicked = () => {
        var theUrl = "/api/planOccurrences/";
        var planOccurrence = {
            program: this.state.program.id,
            goal: this.state.goal,
            user: this.props.storeRoot.user.id,
            startDate: moment(this.state.planOccurrenceStartDate).format("YYYY-MM-DD"),
            isSubscribed:true,
            notificationSendTime: this.state.notificationSendTime,
            notificationEmail: this.state.notificationEmail,
            notificationPhone: this.state.notificationPhone,
            notificationMethod: this.state.notificationMethod
        };
        $.ajax({
                 url: theUrl,
                 dataType: 'json',
                 type: 'POST',
                 data: planOccurrence,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     console.log("handleSubscribeClicked");
                     this.setState({data: data});


                     store.dispatch(addPlan(data));
                     store.dispatch(shouldReload("subscribed"));

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

    };

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

    handlePlanOccurrenceStartDateChange(date)   {
        this.setState({startDate: date});
  }


  handleGoalChange(option){
        this.setState({goal: option.value});
      console.log(option.value)
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
    <div className="ui twelve wide column">
                <div className="fluid field">
                    <KSSelect value={this.state.goal}
                                            valueChange={this.handleGoalChange}
                                            label="Which goal is this plan for?:"
                                            isClearable={false}
                                            name="goal"
                                            options={this.state.goalOptions}
                                            />
                    </div>
    </div>
    <div className="ui four wide column" >                <div className="fluid field"><label>&nbsp;</label>

            <div className="ui right floated fluid primary button" onClick={() => store.dispatch(push('/goals/'))} style={{marginTop:'-1px'}} >Add Goal</div>
        </div>
    </div>     </div>
                <div className="ui row">
                        <div className="ui sixteen wide column">

                <div className="fluid field">
                <KSSelect value={this.state.notificationMethod}
                                            valueChange={this.handleNotificationMethodChange}
                                            label="How would you like your notifications sent?"
                                            isClearable={false}
                                            name="notificationSendMethod"
                                            options={notificationSendMethodOptions}
                                            />

                    </div></div>
                    </div>


                                { this.state.notificationMethod.includes("EMAIL") ?

                <div className="ui row">
                            <div className="sixteen wide column">
                <ValidatedInput
                                      type="text"
                                      name="title"
                                      label="At what email would you like to receive notifications?"
                                      id="id_title"
                                      placeholder="Email Address"
                                      value={this.state.notificationEmail}
                                      initialValue={this.state.notificationEmail}
                                      validators='"!isEmpty(str)"'
                                      onChange={this.validate}
                                      stateCallback={this.handleNotificationEmailChange}
                                      serverErrors={this.getServerErrors("notificationEmail")}

                                  />
                                </div>
                    </div>:<div></div>}

                                                { this.state.notificationMethod.includes("TEXT")  ?

                                <div className="ui row">
                            <div className="sixteen wide column">                <div className="fluid field"><label>At what phone number would you like to receive notification texts?</label>

                <Phone placeholder="At what mobile phone number would like to receive notification texts?"
                       value={ this.state.notificationPhone }
                       onChange={this.handleNotificationPhoneChange} />
                                </div>
                                    </div></div>:<div></div>}
                                                            { this.state.notificationMethod.includes("NO") || this.state.notificationMethod == "" ? <div></div>:

                <div className="ui row">
                        <div className="ui sixteen wide column">

                <div className="fluid field">
                <KSSelect value={this.state.notificationSendTime}
                                            valueChange={this.handleNotificationSendTimeChange}
                                            label="At what time would you like your notifications sent?"
                                            isClearable={false}
                                            name="notificationSendTime"
                                            options={times}
                                            />

                    </div></div>
                    </div>}
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
            category:"UNCATEGORIZED",
            serverErrors:{}
        }


    }




    componentDidMount () {

        $(this.refs['ref_whichProgramForm']).hide();
        this.setState({
            serverErrors: this.props.serverErrors,

            })


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
                category:nextProps.data.category,


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

    handleCategoryChange(option){
        this.setState({category: option.value});
    }

    getDescriptionEditor () {
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





    handleFinishedUpload (value) {
            var fullUrl = value.signedUrl;
            var urlForDatabase = fullUrl.split("?")[0];
            urlForDatabase = urlForDatabase.replace(s3BaseUrl, "");
            this.setState({image: urlForDatabase});
    }


    handleTitleChange(value) {

            this.setState({title: value})
    }



    getServerErrors(fieldName) {
        if (this.state.serverErrors == undefined) {
            return ""
        } else {
            return this.state.serverErrors[fieldName]
        }
    }


    handleCancelClicked() {
        this.props.cancelClicked()
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.props.storeRoot.user) {
            var author = this.props.storeRoot.user.id;
            var title = this.state.title;
            var description = this.state.description;
            var viewableBy = this.state.viewableBy;
            var image = this.state.image;
            var scheduleLength = this.state.scheduleLength;
            var startDate = moment(this.state.startDate).format("YYYY-MM-DD");
            var timeCommitment = this.state.timeCommitment;
            var cost = this.state.cost;
            var costFrequencyMetric = this.state.costFrequencyMetric;
            var category = this.state.category;

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
                category : category
            };

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
                    category:"UNCATEGORIZED"
                }
            );

        };

        handleImageChange = (callbackData) => {
        this.setState({
            image: callbackData.image
        })
    };


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


            var descriptionEditor = this.getDescriptionEditor();

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
                                      serverErrors={this.getServerErrors("title")}

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

                          <div className="ui row">
                              <div className={mediumColumnWidth}>
                                  <KSSelect value={this.state.category}
                                            valueChange={this.handleCategoryChange}
                                            label="Category:"
                                            isClearable={false}
                                            name="programCategory"
                                            options={programCategoryOptions}
                                            />
                                  </div>
                              </div>



                  </div>
                                    <VisualizationsList programId={this.state.id} />


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

export class SimpleProgramForm extends ProgramForm {
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

        var imageUrl = s3BaseUrl + this.state.image;
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

export class ProgramList extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[]
        }
    }

    componentDidMount () {
        //this.loadProgramsFromServer()
        this.setState({
                data:this.props.data
            })
    }

    handleReloadItem = () => {
        //this.loadProgramsFromServer
    };

    loadProgramsFromServer = () => {
        var theURL = "/api/goals/" + this.props.parentId + "/programs";

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
  };

    componentWillReceiveProps(nextProps) {
        if (this.state.data != nextProps.data && nextProps.data != null) {

            this.setState({
                data:nextProps.data
            })
        }
    }

     handleNeedsLogin = () => {
         this.props.needsLogin()
     };


    render () {
        var placeholderImageStyle = {
            backgroundImage: "url('http://semantic-ui.com/images/avatar2/large/kristy.png')",
            width: '300px',
            height: '300px',
        };

        if (this.state.data) {
            var theData = this.state.data;
        var values = Object.keys(theData).map(function(key){
        return theData[key];
        });
        var programList = values.map((program) => {
            return (
                    <ProgramViewEditDeleteItem key={program.id}
                                            isListNode={true}
                                            showCloseButton={false}
                                            apiUrl="/api/programs/"
                                            id={program.id}
                                            data={program}
                                            currentView="Basic"
                                               needsLogin={this.handleNeedsLogin}
                                               reloadItem={this.handleReloadItem}
                                                                                                  extendedBasic={false}

                    />

);

            //return (<PlanListNode key={plan.id} plan={plan}/>)
        })
    }


    return (
        <div className="centeredContent">
          <div className='ui three column stackable grid'>
        {programList}
      </div>
            </div>
    );
  }

}


export class ProgramListNode extends React.Component {
    constructor(props) {
        super(props);
        autobind(this)

    }
    componentDidMount() {

    }

    clearPage = () => {

        store.dispatch(push('/programs/' + this.props.program.id + '/steps'))


    };

    render () {

        if (this.props.program.image) {
            var theImage = <img className="clippedImage" src={s3BaseUrl + this.props.program.image}/>

        } else {
            var theImage = <img className="clippedImage" src='http://semantic-ui.com/images/avatar2/large/kristy.png' />
        }
        return(
            <div  className="ui column">
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
        if (this.props.forSearch) {
                    store.dispatch(push("/plan/view/" + this.state.data.id + "/"))

        } else {
            store.dispatch(push("/programs/" + this.state.data.id + "/steps") )
        }

}
    render() {
        var imageUrl = s3BaseUrl + "uploads/goalItem.svg";
        var theCost;


        if (this.state.data) {
            if (this.state.data.image) {
                var imageUrl = s3BaseUrl + this.state.data.image
            }
            if (this.state.data.cost == 0.00 || this.state.data.costFrequencyMetric == "FREE") {
                theCost = "Free"
            }
            else {
                theCost = this.state.data.cost + " " + this.findLabel(this.state.data.costFrequencyMetric, costFrequencyMetricOptions)
            }
            var theScheduleLength = this.findLabel(this.state.data.scheduleLength, programScheduleLengths);
            var theTimeCommitment = this.findLabel(this.state.data.timeCommitment, timeCommitmentOptions);
                        var startDate = moment(this.state.data.startDate).format("MMM DD YYYY")


            if (this.state.data.author_id) {
                            var authorLink = "/profiles/" + this.state.data.author_id;

            } else if (this.state.data.author) {
                                            var authorLink = "/profiles/" + this.state.data.author

            }


            if (this.props.isListNode) {

                return (
                    <div >
                        <div style={{cursor:"pointer"}} onClick={() => this.goToDetail()} ><ClippedImage item="plan" src={imageUrl}  /></div>


                        <div className="ui grid">
                            <div className="sixteen wide column">

                                <div className="planTitle" onClick={this.goToDetail} style={{cursor:"pointer"}}> {this.state.data.title}

                                </div>
                                <div className="row">&nbsp;</div>

                                <div className="row">
                                    <div className="ui two column grid">
                                        {this.props.forSearch ?

                                            <div className="ui left aligned column">
                                                <Link to={authorLink} >
                                            <UserLink
                                                            fullName={this.state.data.author_fullName}
                                                            profilePhoto={this.state.data.author_profilePhoto} /></Link>
                                        </div>


                                            :
                                            <div className="ui left aligned column">
                                            <IconLabelCombo size="extramini" orientation="left"
                                                            text={startDate} icon="deadline" background="Light"
                                                            link="/goalEntry"/>
                                        </div>



                                            }
                                        {this.props.forSearch ?

                                            <div className="ui right aligned column">
                                                <IconLabelCombo size="extramini" orientation="right"
                                                                text={this.state.data.scheduleLength}
                                                                icon="calendar" background="Light"/>
                                            </div> :
                                            <div className="ui right aligned column">
                                                <IconLabelCombo size="extramini" orientation="right"
                                                                text={theScheduleLength}
                                                                icon="calendar" background="Light"/>
                                            </div>
                                        }



                                    </div>
                                </div>
                                <div className="row">

                                    <div className="ui two column grid">
                                        <div className="ui left aligned column">
                                            <IconLabelCombo size="extramini" orientation="left" text={theCost}
                                                            icon="cost" background="Light" link="/goalEntry"/>
                                        </div>
                                        {this.props.forSearch ?
                                            <div className="ui right aligned column">
                                                <IconLabelCombo size="extramini" orientation="right"
                                                                text={this.state.data.timeCommitment} icon="timeCommitment"
                                                                background="Light" link="/goalEntry"/>
                                            </div> :
                                            <div className="ui right aligned column">
                                                <IconLabelCombo size="extramini" orientation="right"
                                                                text={theTimeCommitment} icon="timeCommitment"
                                                                background="Light" link="/goalEntry"/>
                                            </div>
                                        }

                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>

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
                            <Link to={authorLink} >
                                            <UserLink orientation="right" fullName={this.state.data.authorName}
                                                            profilePhoto={this.state.data.authorPhoto} /></Link>
                            <IconLabelCombo size="extramini" orientation="right" text={theScheduleLength}
                                            icon="deadline" background="Light" link="/goalEntry"/>
                            <IconLabelCombo size="extramini" orientation="right" text={theCost} icon="cost"
                                            background="Light" link="/goalEntry"/>
                            <IconLabelCombo size="extramini" orientation="right" text={theTimeCommitment}
                                            icon="timeCommitment" background="Light" link="/goalEntry"/>
                        </div>

                    </div>

                )
            }
        } else {
            return (<div></div>)
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



export class ProgramItemMenu extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
     }

     handleClick = (callbackData) => {
         this.props.click(callbackData)
     };

     render () {
         var myStyle = { display: "block"};
         return(

                  <div className="ui simple  dropdown item" >
                      <div className="ui extramini image controlButtonMargin">
                      <img src={`${s3IconUrl}menuDark.svg`} /></div>
                      <div className="menu" style={{right: '0',left: 'auto'}}>
                          <div className="ui item">
                              <IconLabelCombo size="extramini" orientation="left" text="Duplicate" icon="duplicate" background="Light" click={this.handleClick} />
                              </div>

                          <div className="ui item">
                            <IconLabelCombo size="extramini" orientation="left" text="Delete" icon="trash" background="Light" click={this.handleClick} />
                            </div>

                      </div>
                  </div>


         )
     }

}


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



module.exports = { GoalHeader, ProgramDetailPage, ProgramItemMenu, ProgramModalForm, SimpleProgramForm, ProgramForm, ProgramDetailPageNoSteps, ProgramBasicView , ProgramList, ProgramListPage, ProgramSubscriptionForm, ProgramSubscriptionModal};