var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
var Datetime = require('react-datetime');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'

import {ClippedImage , ClippedImageOverlayedText } from './elements'

import {Sidebar} from './base'
import autobind from 'class-autobind'
var Select = require('react-select');

import { ValidatedInput } from './app'
import DatePicker  from 'react-datepicker';
import moment from 'moment';

import { NewImageUploader, ImageUploader, FormHeaderWithActionButton, GoalViewEditDeleteItem, Breadcrumb, ErrorWrapper } from './base'
import { Menubar, StandardSetOfComponents, ErrorReporter } from './accounts'
import { PlanForm, PlanList } from './plan'
import {ChoiceModal, IconLabelCombo} from './elements'
import { Textfit } from 'react-textfit';

import { theServer, s3IconUrl, formats, s3BaseUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, userSharingOptions } from './constants'

import Measure from 'react-measure'

import Pagination from "react-js-pagination";

import { Provider, connect, dispatch } from 'react-redux'
import  {store} from "./redux/store";

import { mapStateToProps, mapDispatchToProps } from './redux/containers2'

import { setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, addGoal, updateGoal, deleteGoal, setContacts, setStepOccurrences } from './redux/actions'
import PropTypes from 'prop-types';

import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'

export const isThisReasonableOptions = [
        {value:null, label: ""},

    {value:true, label: "Yes, this is a realistic goal that challenges me."},
    {value:false, label: "This is not a realistic goal. I should rethink my goal."},
    ];

export const goalInAlignmentWithCoreValuesOptions = [
        {value:null, label: ""},

    {value:true, label: "Yes, this goal aligns with my core values."},
    {value:false, label: "No, this goal does not align with my core values. I should rethink my goal."},
    ];

$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Connection', 'keep-alive');
        xhr.setRequestHeader('Authorization', 'Token ' + localStorage.token);

    }
});

export class GoalEntryPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: []
        }
    }

    handleError = (theError) => {
        this.setState({
            error:theError,
        })

    };

    handleCancelClicked = () => {
        $(this.refs['ref_goalForm']).slideUp();
        $(this.refs['ref_goalsStepsHeader']).slideDown();
    };

     handleGoalSubmit (goal) {
    $.ajax({
        url: "/api/goals/",
        dataType: 'json',
        type: 'POST',
        data: goal,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
        success: function(data) {
            this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
            var serverErrors = xhr.responseJSON;
            this.setState({
                serverErrors:serverErrors,
            })

        }.bind(this)
    });
  }

    componentDidMount() {
        $(this.refs['ref_goalForm']).hide();

    }
    showGoalEntryForm() {
        $(this.refs['ref_goalForm']).slideDown();
        $(this.refs['ref_goalsStepsHeader']).slideUp();

    }

    render() {
        return(
            <div>
                <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen} />
            <div className="fullPageDiv">
                <div className="ui page container">
                    <div className="spacer">&nbsp;</div>
                </div>
                <div ref="ref_goalsStepsHeader">
                <GoalStepsHeader goalEntryFormClicked={this.showGoalEntryForm} /></div>
                <div ref="ref_goalForm">
                    <div className="ui row">
                                    <div className="centered hugeType">Create a goal that is SMART</div>
                                </div>
                        <GoalForm cancelClicked={this.handleCancelClicked} serverErrors={this.state.serverErrors}/>
                    </div>
                </div>
                </div>
        )
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class GoalListPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            activePage:1,
            serverErrors:"",
            formIsOpen:false,
            headerActionButtonLabel:"Add Goal"


        }
    }

    handleError = (theError) => {
        this.setState({
            error:theError,
        })

    };


/*
  loadCommentsFromServer = () => {
      if (this.state.activePage != 1) {
                var theUrl = "api/goals/?page=" + this.state.activePage
      }  else {
          var theUrl = "api/goals/"
      }
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
  }*/

  handleGoalSubmit (goal, callback) {
    $.ajax({
        url: "/api/goals/",
        dataType: 'json',
        type: 'POST',
        data: goal,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
        success: function(data) {
                                 this.handleCloseForm();

                                 store.dispatch(addGoal(data));

                                     //this.loadCommentsFromServer()
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
            var serverErrors = xhr.responseJSON;
            this.setState({
                serverErrors:serverErrors,
            })

        }.bind(this),
        complete: function (jqXHR, textStatus){
                if (textStatus == "success"){
                    $(this.refs['ref_whichGoalForm']).slideUp();
                    callback

                }
            }.bind(this)
    });
  }
handleToggleForm = () => {
        $(this.refs['ref_whichGoalForm']).slideToggle()
    };

    componentDidMount() {
        //this.loadCommentsFromServer();
        //var intervalID = setInterval(this.loadCommentsFromServer, 2000);
        //this.setState({intervalID: intervalID});
        $(this.refs['ref_whichGoalForm']).hide();


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
        this.setState({activePage: pageNumber}, () => this.loadCommentsFromServer());

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
        }, () => {$(this.refs['ref_whichGoalForm']).slideDown()} )


    };
    handleReloadItem = () => {
        this.loadStepsFromServer()
    };
handleCancelClicked = () => {
      $(this.refs['ref_whichGoalForm']).slideUp();
      this.setState({
          formIsOpen:false,
          headerActionButtonLabel: "Add Goal"
      })

  };


  handleCloseForm = () => {
        this.setState({
            headerActionButtonLabel: "Add Goal",
            formIsOpen:false,
        }, () => $(this.refs['ref_whichGoalForm']).slideUp())

    };

  handleActionClick = () => {
      if (this.state.formIsOpen == true) {
        this.handleCloseForm()

      }
      else {
          this.handleOpenForm()
      }
    };


componentWillUnmount() {
   // use intervalId from the state to clear the interval
   //clearInterval(this.state.intervalId);
}
    toggle() {
        $(this.refs['ref_whichGoalForm']).slideToggle()
    }

  render() {
      var pagination = this.getPagination();

    return (

<div>               <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen} />





        <div className="fullPageDiv">
            <div className="ui page container footerAtBottom">


            <div className="spacer">&nbsp;</div>
            <div className="ui large breadcrumb">
                <Link to={`/`}><div className="section">Home</div></Link>

                  <i className="right chevron icon divider"></i>
                  <Link to={`/`}><div className="active section">My Goals</div></Link>
            </div>
            <div>&nbsp;</div>
                <FormHeaderWithActionButton actionClick={this.handleActionClick} headerLabel="Goals" color="blue" buttonLabel={this.state.headerActionButtonLabel} toggleForm={this.handleToggleForm}/>
        <div ref="ref_whichGoalForm">
            <GoalForm cancelClicked={this.handleCancelClicked} onGoalSubmit={this.handleGoalSubmit} serverErrors={this.state.serverErrors} />
            </div>

                    <GoalList data={this.props.storeRoot.goals} />
                <div className="spacer">&nbsp;</div>
                {pagination}
            </div>
            </div>
</div>
    );
  }
}

@connect(mapStateToProps, mapDispatchToProps)
export class GoalList extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[]
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.data != nextProps.data) {
            this.setState({
                data:nextProps.data
            })
        }
    }

    render () {
    var placeholderImageStyle = {
        backgroundImage: "url('http://semantic-ui.com/images/avatar2/large/kristy.png')",
        width: '300px',
        height: '300px',
    };

    var goalNodes = () => { return(<div></div>)};
    if (this.state.data != undefined) {

        var theData = this.state.data;
        var values = Object.keys(theData).map(function(key){
        return theData[key];
        });
        var goalNodes = values.map((goal) => {
            return (<GoalNode key={goal.id} goal={goal}/>)
        })
    }

    return (
                <div className="centeredContent">

          <div className='ui three column stackable grid'>
        {goalNodes}
      </div>
                    </div>
    );
  }

}

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
export class GoalDetailPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[],
            editable:false,
            serverErrors:"",
            openModal:false,
            formIsOpen:false,
            headerActionButtonLabel: "Add Plan"
        }
    }

    componentWillReceiveProps(nextProps) {
       if (this.state.data != nextProps.storeRoot.goals) {
           if (nextProps.storeRoot.goals != undefined) {
               var theGoals = nextProps.storeRoot.goals;
               var theGoal = theGoals[this.props.params.goal_id];
                         this.setState({data: theGoal});

               if (theGoal.user == nextProps.storeRoot.user.id) {
                   this.setState({editable:true})
               }

               //var theGoal = getArrayObjectById(theGoals, nextProps.params.goal_id)
               //this.setState({data: theGoal })
           }
       }


        }

    handleGoalSubmit (goal, callback) {
        $.ajax({
                url: "/api/goals/" + goal.id +"/",
                dataType: 'json',
                type: 'PUT',
                data: goal,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    store.dispatch(updateGoal(data));
                    //this.setState({data: data});
                }.bind(this),
                error: function (xhr, status, err) {
            var serverErrors = xhr.responseJSON;
                    this.setState({
                serverErrors:serverErrors,
            })

                }.bind(this)
            });

  }


  handleActionClick = () => {
      if (this.state.formIsOpen == true) {
          this.setState({
              headerActionButtonLabel: "Add Plan",
            formIsOpen:false,
        }, () => {$(this.refs['id_whichPlanForm']).slideUp()})

      } else if (this.state.formIsOpen == false && this.state.openModal == false) {
          this.setState({
              openModal:true
          })

      }

};
    handleCloseModalClicked = () => {
        this.setState({openModal:false})
    };

    handleOpenModal = () => {
        this.setState({openModal:true});
        //$(this.refs['id_whichPlanForm']).slideToggle()
    };

    handleOpenForm = () => {
        this.setState({
            openModal:false,
            headerActionButtonLabel: "Close Form",
            formIsOpen:true,
        }, () => {$(this.refs['id_whichPlanForm']).slideDown()} )


    };


    handleCloseForm = () => {
        this.setState({
            headerActionButtonLabel: "Add Plan",
            formIsOpen:false,
        }, $(this.refs['id_whichPlanForm']).slideUp())

    };



  componentDidMount() {
           if (this.props.storeRoot.goals != undefined) {
               var theGoals = this.props.storeRoot.goals;
                         this.setState({data: theGoals[this.props.params.goal_id]});

           }

      $(this.refs['id_whichPlanForm']).hide()


  }


  handleModalClick = (callbackData) => {
      switch(callbackData.action) {
          case ("existing"):
              store.dispatch(push("/search"));
              break;
          case ("create"):
              this.handleOpenForm();
              break;
          case ("kiterope"):
              store.dispatch(push("/goalEntry"));
              break;
      }
  };

    render () {


        return (
            <div>
                <ChoiceModal  closeModalClicked={this.handleCloseModalClicked} click={this.handleModalClick} modalIsOpen={this.state.openModal} header="Add a plan" description="You can subscribe to a plan created by a coach, create your own plan, or let Kiterope create a plan for you." buttons={[
                            {text:"Use an existing plan", action:"existing", color:"purple"},
                            {text:"Create your own plan", action:"create", color:"" },
                            {text:"Have Kiterope build you a plan", action:"kiterope", color:""},
                        ]} />
                <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen}/>


                <div className="fullPageDiv">
                    <div className="ui page container footerAtBottom">
                        <div className="spacer">&nbsp;</div>
                        <div className="ui alert"></div>
                        <Breadcrumb values={[
                                    {url:"/goals", label:"My Goals"},
                                    {url:"/goals/" + this.props.params.goal_id + "/plans/", label:"Goal Detail"},

                        ]}/>


                        <div>&nbsp;</div>
                        <GoalViewEditDeleteItem key={this.props.params.goal_id}
                                                showCloseButton={false}
                                                apiUrl="/api/goals/"
                                                id={this.props.params.goal_id}
                                                data={this.state.data}
                                                currentView="Basic"/>
                        <div>&nbsp;</div>
                        <div>&nbsp;</div>
                <FormHeaderWithActionButton actionClick={this.handleActionClick} showingForm={this.state.formIsOpen} headerLabel="Plans" color="green" buttonLabel={this.state.headerActionButtonLabel} closeForm={this.handleCloseForm} openForm={this.handleOpenForm} openModal={this.handleOpenModal}/>
        <div ref="id_whichPlanForm">
            <PlanForm onSubmit={this.handlePlanSubmit} serverErrors={this.state.serverErrors} />
            </div>
                        <PlanList goalId={this.props.params.goal_id} />
                        <div className="ui three column grid">




                    </div>
                </div>

            </div>
                </div>

            )
    }
}






export class GoalNode extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            wasCompleted:""
        }

    }
    componentDidMount() {
        this.setState({wasCompleted: this.props.goal.wasCompleted})

    }

    componentWillReceiveProps(nextProps) {
        if (this.state.wasCompleted != nextProps.goal.wasCompleted) {
            this.setState({
                wasCompleted: nextProps.goal.wasCompleted
            })
        }
    }

    clearPage = () => {

        store.dispatch(push('/goals/' + this.props.goal.id + '/plans') )


    };

    handleWasCompletedChange(e) {
        if (this.state.wasCompleted) {
            this.setState({
                wasCompleted:false
            })

        } else {
            this.setState({
                wasCompleted:true
            })

        }
    }


    render () {

        if (this.props.goal.image) {
            var theImage =  <Link to={`/goals/${this.props.goal.id}/plans/`}><ClippedImageOverlayedText item="goal" src={s3BaseUrl + this.props.goal.image} text={this.props.goal.title} /></Link>


        } else {
            var theImage = <Link to={`/goals/${this.props.goal.id}/plans/`}><ClippedImageOverlayedText item="goal" src={s3BaseUrl + "icons/goalItem.svg"} text={this.props.goal.title} /></Link>
        }
        return(
            <div key={this.props.goal.id} className="column">
                                    <div className="ui segment noBottomMargin noTopMargin">

                {theImage}
                <div className="ui center aligned middle aligned grid height-75" style={{marginTop:20, marginBottom:10}}>


                            <div className="pretty primary circle smooth huge-checkbox noRightPadding">
                                <input type="checkbox" id="id_wasCompleted" checked={this.state.wasCompleted} onChange={this.handleWasCompletedChange} />
                                <label><i className="mdi mdi-check"></i> </label>
                            </div>
                        </div>

                </div>
                </div>

        )
    }

}



export class GoalStepsHeader extends React.Component {
    constructor(props) {
        super(props);
        autobind(this)
    }

    showGoalEntryForm() {
        console.log("showGoalEntryForm");
        this.props.goalEntryFormClicked()

    }

    render() {
        return(
        <div>

        <div className="centered hugeType">Achieving a goal is hard work</div>

                <div className="ui page container footerAtBottom">
                    <div className="ui center aligned three column grid">
                                                <div className="ui row">&nbsp;</div>
                        <div className="ui largeType row">
                            <div className="column">Step 1

                                </div>
                            <div className="column">Step 2
                                </div>
                            <div className="column">Step 3

                                </div>

                            </div>

                        <div className="ui row">
                            <div className="column">
                                <img width="50%" src="/static/images/goal.svg" />
                                </div>
                            <div className="column">
                                <img width="50%" src="/static/images/strategy.svg" />
                                </div>
                            <div className="column">
                                <img width="50%" src="/static/images/bar-chart.svg" />
                                </div>

                            </div>

                                                    <div className="ui row">

                        <div className="column">Create a goal that is SMART
                        </div>
                        <div className="column">Follow a detailed and realistic plan designed to achieve that goal
                        </div>
                        <div className="column">Measure your progress and revise your plan to meet your specific needs
                        </div>
                                                        </div>
                                                         <div className="ui row">

                        <div className="column"><div className="ui fluid purple large button" onClick={this.showGoalEntryForm}>Let's do it</div>
                        </div>
                        <div className="column">&nbsp;
                        </div>
                        <div className="column">&nbsp;
                        </div>
</div>
                    </div>
                        </div>
            </div>
        )

    }
}



@connect(mapStateToProps, mapDispatchToProps)
export class GoalForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            title: "",
            deadline: moment(),
            description: "",
            metric: "",
            why: "",
            obstacles:"",
            image: "",
            viewableBy: "ONLY_ME",
            user: null,
            coaches: [],
            updates: [],
            wasAchieved: false,
            plans: [],
            editable:true,
            data:"",
            serverErrors: "",
        }
    }


    componentDidMount () {
        $(this.refs['id_whichGoalForm']).hide();
        //this.checkIfUser()
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.data != nextProps.data) {
            if (nextProps.data != undefined) {
            this.setState({
                id: nextProps.data.id,
                title: nextProps.data.title,
                deadline: moment(nextProps.data.deadline, "YYYY-MM-DD"),
                description: nextProps.data.description,
                metric: nextProps.data.metric,
                why: nextProps.data.why,
                obstacles: nextProps.data.obstacles,
                image: nextProps.data.image,
                viewableBy: nextProps.data.viewableBy,
                wasAchieved: nextProps.data.wasAchieved,
            })
            }



        }
        if (this.state.serverErrors != nextProps.serverErrors) {
            this.setState({
                serverErrors:nextProps.serverErrors
            })
        }

    }



    handleTitleChange(value) {
        this.setState({title: value});
    }

    handleDeadlineChange = (value)  => {
        this.setState({deadline: value});
    };

    handleDescriptionChange(e) {
        this.setState({description: e});
    }


    handleMetricChange(value) {
        this.setState({metric: value});
    }

    handleWhyChange(value) {
        this.setState({why: value});
    }
    handleObstaclesChange(value) {
        this.setState({obstacles: value});
    }


    handleImageChange = (callbackData) => {
        this.setState({
            image: callbackData.image
        })
    };
    handleViewableByChange(e) {
        this.setState({viewableBy: e.value});
    }


    checkIfUser() {
        var theUrl =    '/api/users/i/';
        $.ajax({
            method: 'GET',
            url: theUrl,
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(res) {
                if (res.id != null) {
                    this.setState({
                        'user': res
                    })
                }
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(theUrl, status, err.toString());
        }
        })
    }


    handleCancelClicked() {
        this.props.cancelClicked()
    }

    getServerErrors(fieldName) {
        if (this.state.serverErrors == undefined) {
            return ""
        } else {
            return this.state.serverErrors[fieldName]
        }
    }


    handleSubmit(e) {


            e.preventDefault();
        this.checkIfUser();

        if (this.state.user) {

            var title = this.state.title;
            var deadline = moment(this.state.deadline).format("YYYY-MM-DD");
            var image = this.state.image;
            var description = this.state.description;
            var metric = this.state.metric;


            var why = this.state.why;
            var obstacles = this.state.obstacles;

            var viewableBy = this.state.viewableBy;
            var goalData = {
                title: title,
                deadline: deadline,
                description: description,
                metric: metric,
                why: why,
                obstacles: obstacles,
                image: image,
                viewableBy: viewableBy,
                coaches: [],
                updates: [],
                wasAchieved: false,
                plans: []
            };

            if (this.state.id != "") {
                goalData.id = this.state.id
            }
            this.props.onGoalSubmit(goalData, this.resetForm);
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
                title: "",
                deadline: moment(),
                description: "",
                metric: "",
                why: "",
                obstacles:"",
                image: null,
                viewableBy: "ONLY_ME",
                user: null,
                coaches: [],
                updates: [],
                wasAchieved: false,
                plans: []
            });
        };

        getForm = () => {
            if (this.state.id) {
                var buttonText = "Save Goal"

            } else {
                var buttonText = "Create Goal"
            }
            var forMobile = false;

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




            if (this.state.image) {
                var imageUrl = this.state.image


            } else {
                var imageUrl = "goalItem.svg"
            }
        return (
            <div className="ui page container footerAtBottom">
                <div className="ui grid">
                    <div className="ui row">
                                                      <Measure onMeasure={(dimensions) => {this.setState({dimensions})}}>

                        <div className={mediumColumnWidth}>

                        <ImageUploader imageReturned={this.handleImageChange} dimensions={this.state.dimensions}
                                       label="Select an image that will help motivate you." defaultImage={imageUrl}/>
                    </div></Measure></div>

                    <div className="ui row">
                        <div className={mediumColumnWidth}>
                            <ValidatedInput
                                type="text"
                                name="title"
                                label="What is your goal? (Required)"
                                id="id_title"
                                placeholder="I will run a five minute mile, I will learn to speak Chinese fluently"
                                value={this.state.title}
                                initialValue={this.state.title}
                                validators='"!isEmpty(str)"'
                                onChange={this.validate}
                                stateCallback={this.handleTitleChange}
                                isDisabled={!this.state.editable}
                                serverErrors={this.getServerErrors("title")}
                            />

                        </div>
                    </div>
                    <div className="ui row">
                        <div className={mediumColumnWidth}>

                            <ValidatedInput
                                type="textarea"
                                name="why"
                                label="Why do you want to achieve this goal? What good will happen if you achieve it? What bad will happen if you don't achieve it? (Required)"
                                id="id_why"
                                placeholder="I want to make something of myself, I want to be around to see my daughter graduate from college."
                                value={this.state.why}
                                initialValue={this.state.why}
                                validators='"!isEmpty(str)"'
                                onChange={this.validate}
                                stateCallback={this.handleWhyChange}
                                rows={3}
                                isDisabled={!this.state.editable}
                                serverErrors={this.getServerErrors("why")}


                            />
                        </div>


                    </div>
                    <div className="ui row">
                        <div className={mediumColumnWidth}>

                            <ValidatedInput
                                type="textarea"
                                name="obstacles"
                                label="What are some obstacles that could stand in your way? What obstacles do you envision encountering? (Required)"
                                id="id_obstacles"
                                placeholder="My family doesn't believe in me. I don't have the money"
                                value={this.state.obstacles}
                                initialValue={this.state.obstacles}
                                validators='"!isEmpty(str)"'
                                onChange={this.validate}
                                stateCallback={this.handleObstaclesChange}
                                rows={3}
                                isDisabled={!this.state.editable}
                                serverErrors={this.getServerErrors("obstacles")}


                            />
                        </div>


                    </div>
                    <div className="ui row">
                        <div className={mediumColumnWidth}>

                            <ValidatedInput
                                type="textarea"
                                name="description"
                                label="Tell us a little more about this goal."
                                id="id_description"
                                placeholder=""
                                value={this.state.description}
                                initialValue={this.state.description}
                                validators=''
                                onChange={this.validate}
                                stateCallback={this.handleDescriptionChange}
                                rows={3}
                                isDisabled={!this.state.editable}
                                serverErrors={this.getServerErrors("description")}


                            />
                        </div>


                    </div>

                    <div className="ui row">


                        <div className={mediumColumnWidth + ' field'}>

                            <label htmlFor="id_deadline">What is your deadline for achieving this goal? (Required)</label>

                            <DatePicker selected={this.state.deadline} onChange={this.handleDeadlineChange}/>

                        </div>


                    </div>




                    <div className="ui row">
                        <div className={mediumColumnWidth}>

                            <ValidatedInput
                                type="text"
                                name="metric"
                                label="How will you measure your progress? (Required)"
                                id="id_title"
                                placeholder="time per mile, judgments of third party observers"
                                value={this.state.metric}
                                initialValue={this.state.metric}
                                validators='"!isEmpty(str)"'
                                onChange={this.validate}
                                stateCallback={this.handleMetricChange}
                                isDisabled={!this.state.editable}
                                serverErrors={this.getServerErrors("metric")}


                            />
                        </div>


                    </div>
                    <div className="ui  row">
                        <div className={mediumColumnWidth + ' field'}>
                    <label htmlFor="id_lengthOfSchedule">Who should be able to see this goal?</label>
                    <Select value={this.state.viewableBy} clearable={false}
                                              onChange={this.handleViewableByChange} name="viewingOptions"
                                              options={userSharingOptions}/>
                            </div>
                        </div>





    <div className="ui row">&nbsp;</div>
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

export class GoalSMARTForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            title: "",
            deadline: moment(),
            description: "",
            coreValues: "",
            goalInAlignmentWithCoreValues: null,
            obstacles: "",
            isThisReasonable: null,
            metric: "",
            why: "",
            obstacles:"",
            image: null,
            viewableBy: "ONLY_ME",
            user: null,
            coaches: [],
            updates: [],
            wasAchieved: false,
            plans: [],
            editable:false,
            data:"",
        }
    }


    componentDidMount () {
        $(this.refs['id_whichGoalForm']).hide();
        this.checkIfUser()
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.data != nextProps.data) {
            if (nextProps.data != undefined) {
            this.setState({
                id: nextProps.data.id,
                title: nextProps.data.title,
                deadline: moment(nextProps.data.deadline, "YYYY-MM-DD"),
                description: nextProps.data.description,
                coreValues: nextProps.data.coreValues,
                goalInAlignmentWithCoreValues: nextProps.data.goalInAlignmentWithCoreValues,
                obstacles: nextProps.data.obstacles,
                isThisReasonable: nextProps.data.isThisReasonable,
                metric: nextProps.data.metric,
                why: nextProps.data.why,
                obstacles: nextProps.data.obstacles,
                image: nextProps.data.image,
                viewableBy: nextProps.data.viewableBy,
                wasAchieved: nextProps.data.wasAchieved,
            })
            }



        }

    }



    handleTitleChange(value) {
        this.setState({title: value});
    }

    handleDeadlineChange = (value)  => {
        this.setState({deadline: value});
    };

    handleDescriptionChange(e) {
        this.setState({description: e.target.value});
    }

    handleCoreValuesChange(value) {
        this.setState({coreValues: value});
    }

    handleGoalInAlignmentWithCoreValuesChange(value) {
        this.setState({goalInAlignmentWithCoreValues: value});
    }

    handleObstaclesChange(value) {
        this.setState({obstacles: value});
    }

    handleIsThisReasonableChange(value) {
        this.setState({isThisReasonable: value});
    }

    handleMetricChange(value) {
        this.setState({metric: value});
    }

    handleWhyChange(value) {
        this.setState({why: value});
    }

    handleObstaclesChange(value) {
        this.setState({obstacles: value});
    }

    handleImageChange = (callbackData) => {
        this.setState({
            image: callbackData.image
        })
    };
    handleViewableByChange(e) {
        this.setState({viewableBy: e.target.value});
    }


    handleVotesChange(e) {
        this.setState({votes: e.target.value});
    }


    checkIfUser() {

        var theUrl = '/api/users/i/';
        $.ajax({
            method: 'GET',
            url: theUrl,
            datatype: 'json',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function(res) {
                if (res.id != null)
                this.setState({
                    'user': res
                })
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(theUrl, status, err.toString());
        }
        })
    }


    handleCancelClicked() {
        this.props.cancelClicked()
    }

    resetForm() {
        this.setState({
                title: "",
                deadline: moment(),
                description: "",
                coreValues: "",
                goalInAlignmentWithCoreValues: false,
                obstacles: "",
                isThisReasonable: false,
                metric: "",
                why: "",
                obstacles: "",
                image: null,
                viewableBy: "ONLY_ME",
                user: null,
                coaches: [],
                updates: [],
                wasAchieved: false,
                plans: []
            });
    }


    handleSubmit(e) {


            e.preventDefault();
        this.checkIfUser();

        if (this.state.user) {

            var title = this.state.title;
            var deadline = moment(this.state.deadline).format("MMM DD, YYYY");
            var image = this.state.image;

            var description = this.state.description;
            var coreValues = this.state.coreValues;
            var goalInAlignmentWithCoreValues = this.state.goalInAlignmentWithCoreValues;
            var obstacles = this.state.obstacles;
            var isThisReasonable = this.state.isThisReasonable;
            var metric = this.state.metric;


            var why = this.state.why;
            var image = this.state.image;
            var viewableBy = this.state.viewableBy;
            var goalData = {
                title: title,
                deadline: deadline,
                description: description,
                coreValues: coreValues,
                goalInAlignmentWithCoreValues: goalInAlignmentWithCoreValues,
                obstacles: obstacles,
                isThisReasonable: isThisReasonable,
                metric: metric,
                why: why,
                image: image,
                viewableBy: "ONLY_ME",
                coaches: [],
                updates: [],
                wasAchieved: false,
                plans: []
            };

            if (this.state.id != "") {
                goalData.id = this.state.id
            }
            this.props.onGoalSubmit(goalData, this.resetForm);

            //this.props.onGoalSubmit({title: title, viewableBy:viewableBy, description: description});


        }
    else {
            this.setState({
                    signInOrSignUpModalFormIsOpen: true,
                }
            )

            }
        }

        getForm = () => {
            if (this.state.id) {
                var buttonText = "Save Goal"

            } else
            {
                var buttonText = "Create Goal"
            }

            var imageUrl = s3BaseUrl + this.state.image;
        return ( <div className="ui page container footerAtBottom">
                                <div className="ui row">&nbsp;</div>

                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="center aligned five wide column blue ">
                                            <div className="ui ginormousType row">S</div>
                                            <div className="ui largeType row">Specific</div>
                                            <div className="ui row">
                                                <div className="left aligned">Your goal should be
                                                    well-defined and clear. Make it as concise as possible.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="eleven wide column">
                                            <div className="ui row bold">
                                                <ValidatedInput
                                                    type="text"
                                                    name="title"
                                                    label="What is your goal? (Required)"
                                                    id="id_title"
                                                    placeholder="I will run a five minute mile, I will learn to speak Chinese fluently"
                                                    value={this.state.title}
                                                    initialValue={this.state.title}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleTitleChange}
                                                    isDisabled={!this.state.editable}
                                            />

                                            </div>
                                                                                        <div className="ui row">&nbsp;</div>

                                            <div className="ui row">
                                            <NewImageUploader imageReturned={this.handleImageChange} label="Select an image that will help motivate you." defaultImage={imageUrl} />
                                                </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="center aligned five wide column blue ">
                                            <div className="ui ginormousType row">M</div>
                                            <div className="ui largeType row">Measurable</div>
                                            <div className="ui row">
                                                <div className="">A goal should be measurable so you can judge your progress and know when it's been achieved.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="eleven wide column">
                                            <div className="ui row">
                                                <ValidatedInput
                                                    type="text"
                                                    name="metric"
                                                    label="How will you measure your progress?"
                                                    id="id_title"
                                                    placeholder="time per mile, judgments of third party observers"
                                                    value={this.state.metric}
                                                    initialValue={this.state.metric}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleMetricChange}
                                                    isDisabled={!this.state.editable}

                                            />
                                            </div>


                                        </div>
                                    </div>
                                </div>
                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="center aligned five wide column blue ">
                                            <div className="ui ginormousType row">A</div>
                                            <div className="ui largeType row">Achievable</div>
                                            <div className="ui row">
                                                <div className="">To progress as fast and far as possible, you should choose a goal that stretches your abilities while being realistic so you stay motivated.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="eleven wide column">
                                        <div className="ui field row">
                                            <label htmlFor="id_isThisReasonable">Does your goal challenge you while still being realistic?</label>
<Select value={this.state.isThisReasonable}  onChange={this.handleIsThisReasonableChange} name="isThisReasonable" options={isThisReasonableOptions} /></div>
<div className="ui row">&nbsp;</div>

                                            <div className="ui row">
                                                <ValidatedInput
                                                    type="textarea"
                                                    name="obstacles"
                                                    label="What obstacles have you encountered in the past or do you foresee encountering?"
                                                    id="id_obstacles"
                                                    placeholder="I sometimes skip practice if I've had a late night, My friends aren't supportive"
                                                    value={this.state.obstacles}
                                                    initialValue={this.state.obstacles}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleObstaclesChange}
                                                    rows={3}
                                                    isDisabled={!this.state.editable}

                                            />
                                            </div>


                                        </div>
                                    </div>
                                </div>

                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="center aligned five wide column blue ">
                                            <div className="ui ginormousType row">R</div>
                                            <div className="ui largeType row">Relevant</div>
                                            <div className="ui row">
                                                <div className="">The goal should matter to you and should align with your other goals and core values. Staying motivated is much easier when you believe in what you're doing
                                                </div>
                                            </div>
                                        </div>
                                            <div className="eleven wide column">


                                            <div className="ui row">
                                                <ValidatedInput
                                                    type="textarea"
                                                    name="coreValues"
                                                    label="What are your core values and beliefs? What is important to you? What is the purpose of life to you?"
                                                    id="id_coreValues"
                                                    placeholder="Providing for my friends and family are the most important to me. I believe self-actualization is my highest goal."
                                                    value={this.state.coreValues}
                                                    initialValue={this.state.coreValues}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleCoreValuesChange}
                                                    rows={3}
                                                    isDisabled={!this.state.editable}

                                            />
                                            </div>
                                            <div className="ui row">&nbsp;</div>

                                            <div className="ui field row">
                                            <label htmlFor="id_goalInAlignmentWithCoreValues">Is this goal in alignment with your core values?</label>
<Select value={this.state.goalInAlignmentWithCoreValues}  onChange={this.handleGoalInAlignmentWithCoreValuesChange} name="goalInAlignmentWithCoreValues" options={goalInAlignmentWithCoreValuesOptions} /></div>
<div className="ui row">&nbsp;</div><div className="ui row">
                                                <ValidatedInput
                                                    type="textarea"
                                                    name="why"
                                                    label="Why do you want to achieve this goal?"
                                                    id="id_why"
                                                    placeholder="I want to make something of myself, I want to be around to see my daughter graduate from college."
                                                    value={this.state.why}
                                                    initialValue={this.state.why}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleWhyChange}
                                                    rows={3}
                                                    isDisabled={!this.state.editable}

                                            />
                                            </div>



                                        </div>
                                    </div>
                                </div>

                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="center aligned five wide column blue ">
                                            <div className="ui ginormousType row">T</div>
                                            <div className="ui largeType row">Time-Bound</div>
                                            <div className="ui row">
                                                <div className="">Your goal should have a definite end date for best results.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="eleven wide column">


                                            <div className="ui row field">
                                                <label htmlFor="id_deadline">What is your deadline for achieving this goal?</label>

                                                <DatePicker selected={this.state.deadline} onChange={this.handleDeadlineChange} />

                                            </div>


                                        </div>
                                    </div>
                                </div>
                                <div className="ui three column stackable grid">
                                    <div className="column">&nbsp;</div>
                                    <div className="column"><div className="ui large fluid button" onClick={this.handleCancelClicked} >Cancel</div></div>
                                    <div className="column"><div className="ui large fluid blue button" onClick={this.handleSubmit} >{buttonText}</div></div>
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

/*export class SimpleGoalForm extends GoalForm {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            title: "",
            deadline: moment(),
            description: "",
            coreValues: "",
            goalInAlignmentWithCoreValues: null,
            obstacles: "",
            isThisReasonable: null,
            metric: "",
            why: "",
            image: null,
            viewableBy: "ONLY_ME",
            user: null,
            coaches: [],
            updates: [],
            wasAchieved: false,
            plans: [],
            editable:false,
            data:"",
        }
    }

    getForm = () => {

            var imageUrl = s3BaseUrl + this.state.image;
        var theDeadline = moment(this.state.deadline).format("MMM DD, YYYY");
        return (
            <div className="ui page container footerAtBottom">
                <div className="ui grid">
                    <div className="two wide column">
                        <img className="ui small image" src={s3BaseUrl + this.state.image}/></div>

                    <div className="eleven wide column">
                        <div className="ui row">
                            <div className="header">
                                <h1>{this.state.title}</h1>
                                </div>


                        </div>
                        <div className="ui row">&nbsp;</div>
                        <div className="ui row">
                            <div className="field">
                                <label htmlFor="id_metric">Metric</label>
                                <div>{this.state.metric}</div>
                                </div>


                        </div>





                            <div className="ui row">&nbsp;</div>
                        <div className="ui row">
                            <div className="field">
                                <label htmlFor="id_metric">Obstacles</label>
                                <div>{this.state.obstacles}</div>
                                </div>


                        </div>
                        <div className="ui row">&nbsp;</div>
                        <div className="ui row">
                            <div className="field">
                                <label htmlFor="id_metric">Core Values</label>
                                <div>{this.state.coreValues}</div>
                                </div>


                        </div>


                            <div className="ui row">&nbsp;</div>
                        <div className="ui row">
                            <div className="field">
                                <label htmlFor="id_why">Why is this your goal?</label>
                                <div>{this.state.why}</div>
                                </div>


                        </div>
                        <div className="ui row">&nbsp;</div>









                            <div className="ui row field">
                                <label htmlFor="id_deadline">Deadline</label>

                                <div>{theDeadline}</div>

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


}*/
export class GoalBasicView extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: "",

        }
    }

    componentDidMount() {
        this.setState({
            data: this.props.data,
        })
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.data != nextProps.data) {
            this.setState({
                data: nextProps.data
            })
        }
    }

    render() {
        if (this.state.data) {
            var theDeadline = moment(this.state.data.deadline).format("MMM DD, YYYY");
            if (this.state.data.image != "") {
                var theImage = this.state.data.image
            } else {
                var theImage = "uploads/goalItem.svg"

            }
            return (
                <div className="ui grid">
                    <div className="two wide column">
                        <img className="ui image" src={s3BaseUrl + theImage}></img>
                    </div>
                    <div className="eight wide column">
                        <div className="fluid row">
                            <h1>{this.state.data.title}</h1>
                        </div>
                        <div className="fluid row">
                            {this.state.data.coreValues}
                        </div>
                    </div>
                    <div className="right aligned six wide column">
                        <IconLabelCombo size="extramini" orientation="right" text={theDeadline} icon="deadline"
                                        background="Light" link="/goalEntry"/>
                        <IconLabelCombo size="extramini" orientation="right" text={this.state.data.metric} icon="metric"
                                        background="Light" link="/goalEntry"/>
                    </div>
                </div>

            )

        } else {
            return (<div></div>)
        }
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



module.exports = { GoalForm, GoalListPage , GoalEntryPage, GoalDetailPage, GoalBasicView,  };
