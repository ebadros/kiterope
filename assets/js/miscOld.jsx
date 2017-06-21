// tutorial20.js
var GoalBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: "api/goals/",
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

  handleGoalSubmit: function(goal) {
    $.ajax({
        url: "api/goals/",
        dataType: 'json',
        type: 'POST',
        data: goal,
        success: function(data) {
            this.setState({data: data});
        }.bind(this),
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
                            this.props.theError({err})

        }.bind(this)
    });
  },

  getInitialState: function() {
    return {data: []};
  },
    componentDidMount: function() {
        this.loadCommentsFromServer();
        //var intervalID = setInterval(this.loadCommentsFromServer, 2000);
        //this.setState({intervalID: intervalID});
        var self = this;
        $(this.refs['id_whichGoalForm']).hide();


    $(window).on('modal.visible', function(ev){
      self.setState({visible: true});
    });
    $(window).on('modal.hidden', function(ev){
      self.setState(self.getInitialState());
    });
    },

    handleClick: function(ev){
    if (ev.target == this.getDOMNode()){
      $(window).trigger('modal.hidden');
    }
  },

componentWillUnmount: function() {
   // use intervalId from the state to clear the interval
   //clearInterval(this.state.intervalId);
},
    toggle: function() {
        $(this.refs['id_whichGoalForm']).slideToggle()
    },

  render: function() {

    return (

<div> <Menubar />
        <div className="fullPageDiv">
            <div className="ui page container">


            <div className="spacer">&nbsp;</div>
            <div className="ui alert"></div>

            <div className="ui large breadcrumb">
                <Link to={`/#`}><div className="section">Home</div></Link>

                  <i className="right chevron icon divider"></i>
                  <Link to={`/#`}><div className="active section">My Goals</div></Link>
            </div>
            <div>&nbsp;</div>
            <GoalForm onGoalSubmit={this.handleGoalSubmit} serverErrors={this.state.serverErrors}/>

                    <GoalList data={this.state.data} />
            </div>
            </div>
</div>
    );
  }
});


var StepObjectListAndUpdate = React.createClass({

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
        return {
            data: [],
        view:"calendar"
        };
    },

    handleFormSubmit: function(step, callback) {
    $.ajax({
        url: ("api/steps/"),
        dataType: 'json',
        type: 'POST',
        data: step,
        success: callback,
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
  },


    handleCalendarViewClick: function() {
        this.showCalendar()





    },

    showCalendar: function() {
        $(this.refs['ref_calendarView']).slideDown();
        $(this.refs['ref_listView']).slideUp();
    },

    showList: function() {
        $(this.refs['ref_calendarView']).slideUp();
        $(this.refs['ref_listView']).slideDown();
    },

    handleListViewClick: function() {
this.showList()
    },


    componentDidMount: function() {
        this.loadObjectsFromServer();
        this.showCalendar()


        $(".fullPageDiv").hide();
        $(".fullPageDiv").slideToggle();



          //var intervalID = setInterval(this.loadObjectsFromServer, 2000);
        //this.setState({intervalID:intervalID});

        var self = this;
    },

    componentWillUnmount: function() {
   // use intervalId from the state to clear the interval
   //clearInterval(this.state.intervalId);
},

    render:function() {
        var model = this.props.model;

        return (
            <div>
                <div className="ui grid">
                    <div className="ui row">
                        <div className="ui header two wide column">
                            <h1>Steps</h1>
                        </div>
                        <div className="ui thirteen wide column">&nbsp;</div>
                        <div className="two right floated wide column">
                        <div className="ui right floated menu">
                            <a className="active item" onClick={this.handleCalendarViewClick}>
                                <i className="calendar icon"></i>
                            </a>
                            <a className="item" onClick={this.handleListViewClick}>
                                <i className="tasks icon"></i>
                            </a>
                        </div>
                    </div>
            </div>

                </div>
                 <div ref="ref_calendarView">

                    <PlanCalendar planId={this.props.planId} events={this.state.data}/>
                    <div className="ui row">&nbsp;</div>

                </div>
                <div ref="ref_listView">
                <StepFormAction onFormSubmit={this.handleFormSubmit} planId={this.props.planId} pageHeadingLabel="Steps" actionButtonLabel="Add Step" actionFormRef="stepForm" modelForm="StepForm"/>
                <div>&nbsp;</div>
                <div>&nbsp;</div>

                <StepObjectList planId={this.props.planId} data={this.state.data}   />

            </div>

                </div>
        );
    }
});

export class ObjectCreationPage extends React.Component {
    componentWillMount() {

    }
    componentDidMount() {
        $(".fullPageDiv").hide();
        $(".fullPageDiv").slideToggle();


    }

    render() {

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
                    <PlanHeader url={`api/plans/${this.props.params.plan_id}`} />
                    <div>&nbsp;</div>

                    <ObjectPage url={`api/steps/`}
                                                               pageHeadingLabel="Steps"
                                                               actionButtonLabel="Add Step"
                                                               actionFormRef="stepForm"
                                                               modelForm="StepForm"/>


                </div></div>

            )
        }
        else if (this.props.params.goal_id) {
            return (
<div>
                <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen} />

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
};

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
        <forms.RenderForm form={PlanForm2} ref="planForm" />
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
export class ObjectListAndUpdate extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            data:"",
        }
    }

    loadObjectsFromServer () {
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
      }

    handleFormSubmit (formData) {
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
  }



    componentDidMount() {
        this.loadObjectsFromServer();
        var intervalID = setInterval(this.loadObjectsFromServer, 2000);
        this.setState({intervalID:intervalID});

        var self = this;
    }

    componentWillUnmount() {
   // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
    }
    render() {

        var model = this.props.model;

        return (
<div>
                <FormAction onFormSubmit={this.handleFormSubmit} pageHeadingLabel={this.props.pageHeadingLabel} actionButtonLabel={this.props.actionButtonLabel} actionFormRef={this.props.actionFormRef} modelForm={this.props.modelForm}/>

                <ObjectList data={this.state.data}  />

            </div>
        );
    }
}






var StepObjectList = React.createClass({



    toggle: function(planId) {
        $(this.refs["stepFormRef_" + planId]).slideToggle()
    },

    loadObjectsFromServer: function () {
        $.ajax({
          url: theServer + "api/plans/" + this.props.planId + "/",
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  planStartDate:data.startDate,

              })


          }.bind(this),
          error: function(xhr, status, err) {
            console.error("https://127.0.0.1:8000/api/plans/" + this.props.params.plan_id, status, err.toString());
          }.bind(this)
        });
      },

    getInitialState: function() {
        return ({
           data:[],
        })

    },

    componentDidMount: function() {
        $(this.refs[this.props.actionFormRef]).slideToggle();
        this.loadObjectsFromServer();


    },

    componentDidUpdate: function() {
        $(".formForHiding").hide();

    },




    clearPage: function(plan_id) {
        $(".fullPageDiv").slideToggle("slow", function () {
        hashHistory.push('/plans/' + plan_id + '/steps')
            });

    },

    handleFormSubmit: function(step, callback) {
    $.ajax({
        url: (theServer + "api/steps/" + step.id + "/"),
        dataType: 'json',
        type: 'PATCH',
        data: step,
        success: callback,
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
  },



    render: function() {
        var planScheduleMetric = "Week";

        var theForm = new StepForm();

        if (this.props.data) {
            var objectNodes = this.props.data.map(function (objectData) {

                return (
                        <StepObjectEditForm  planStartDate={this.state.planStartDate} key={objectData.id} planId={this.props.planId} onFormSubmit={this.handleFormSubmit} stepData={objectData} />

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

var ObjectPage = React.createClass({


    componentDidMount: function() {


    },

    getInitialState: function() {
        return ({data:[]});
    },

    handleFormSubmit: function(plan, callback) {
    $.ajax({
        url: (theServer + "api/plans/" + this.props.params.plan_id + "/"),
        dataType: 'json',
        type: 'PATCH',
        data: plan,
        success: callback,
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }.bind(this)
    });
  },



    render: function () {
        if (this.props.params.plan_id) {
            return (

                <div className="fullPageDiv">
                    <div className="ui page container">
                    <div className="spacer">&nbsp;</div>
                    <div className="ui alert"></div>
                    <div className="ui large breadcrumb">
                         <Link to={`/`}><div className="section">Home</div></Link>
                            <i className="right chevron icon divider"></i>
                            <Link to={`/`}><div className=" section">My Goals</div></Link>
                        <i className="right chevron icon divider"></i>
                            <Link to={`/plans/${this.props.params.plan_id}`}><div className="active section">Plan Detail</div></Link>

                    </div>
                    <div>&nbsp;</div>
                    <PlanHeader onFormSubmit={this.handleFormSubmit} planId={this.props.params.plan_id} />
            <div>&nbsp;</div>
                    <StepObjectListAndUpdate url={`${theServer}api/plans/${this.props.params.plan_id}/steps`} planId={this.props.params.plan_id} />

 </div>
                     </div>

        )}

    }
});


// tutorial10.js
var GoalList2 = React.createClass({

    clearPage: function(goal_id) {
        $(".fullPageDiv").slideToggle("slow", function () {

                hashHistory.push('/goals/' + goal_id + '/plans')

            });


    },

    getInitialState: function() {
        return {
            data:[],
        }
    },




    componentDidMount: function() {
        var self = this



    },

    render: function() {
    var placeholderImageStyle = {
        backgroundImage:"url('http://semantic-ui.com/images/avatar2/large/kristy.png')",
        width:'300px',
        height:'300px',


        };


        {/* var goalNodes2 = this.props.data.map((goal) => {
            return (<GoalNode goal={goal} />)
        })


*/}
        var goalNodes = this.props.data.map(function (goal) {
            if (goal.image) {
                var goalImage = <img src={goal.image}/>

            } else {
                var goalImage = <div className="image" style={placeholderImageStyle}>{goal.title}</div>
            }
            return (


                <div key={goal.id} className="column">
                    <div className="ui fluid card overlayedImageContainer">
                        <div className="image overlayedImage"><img
                            src='http://semantic-ui.com/images/avatar2/large/kristy.png'></img>
                            <div className="overlayText">{goal.title}</div>
                        </div>

                        <div className="extra content">
                            <a>
                                <i className="user icon"></i>
                                22 Friends
                            </a>
                        </div>
                        <div className="ui bottom attached green button" onClick={this.clearPage.bind(this, goal.id)}>

                            Plans
                        </div>
                        <div className="ui bottom attached red button">
                            Angels
                        </div>

                    </div>

                </div>
            );
        }.bind(this));

    return (
          <div className='ui three column grid'>

        {goalNodes}
      </div>
    );
  }
});

var Goal = React.createClass({
  render: function() {
    return (
      <div className="goal">

        {this.props.children}
      </div>
    );
  }
});

// tutorial19.js
var GoalForm = React.createClass({
    componentDidMount: function() {
        var self = this;
        $(this.refs['id_whichGoalForm']).hide()
    },

    getInitialState: function() {
        return {
            title: "",
            deadline: "",
            description: "",
            why: "",
            image: null,
            votes: null,
            viewableBy: "ONLY_ME",
            priority: null,
            user: null,
            coaches: [],
            updates: [],
            wasAchieved: false,
            hasMetric: false,
            plans: [],
        };
    },

    handleToggleForm: function () {
        $(this.refs['id_whichGoalForm']).slideToggle()
    },

    toggle: function() {
        $(this.refs['id_whichGoalForm']).slideToggle()
    },

    handleTitleChange: function(e) {
        this.setState({title: e.target.value});
    },

    handleDeadlineChange: function(e) {
        this.setState({deadline: e.target.value});
    },

    handleWhyChange: function(e) {
        this.setState({why: e.target.value});
    },

    handleVotesChange: function(e) {
        this.setState({votes: e.target.value});
    },

    handleViewableByChange: function(e) {
        this.setState({viewableBy: e.target.value});
    },

    handleDescriptionChange: function(e) {
        this.setState({description: e.target.value});
    },

    handleSubmit: function(e) {

        e.preventDefault();
        var title = this.state.title;
        var description = this.state.description;

        var deadline = this.state.deadline;
        var why = this.state.why;
        var image = this.state.image;
        var viewableBy = this.state.viewableBy;
        var priority = this.state.priority;

        //var image = this.state.image;



        if (!description || !title ) {
        return;
        }
        this.props.onGoalSubmit({
            title: title,
            description: description,
            deadline: deadline,
            why: why,
            image: null,
            votes: null,
            viewableBy: "ONLY_ME",
            priority: null,
            user: null,
            coaches: [],
            updates: [],
            wasAchieved: false,
            hasMetric: false,
            plans: []});

        //this.props.onGoalSubmit({title: title, viewableBy:viewableBy, description: description});
        this.setState({
            title: "",
            deadline: "",
            description: "",
            why: "",
            image: null,
            votes: null,
            viewableBy: "ONLY_ME",
            priority: null,
            user: null,
            coaches: [],
            updates: [],
            wasAchieved: false,
            hasMetric: false,
            plans: []});

        this.toggle();
    },

  render: function() {
    return (
        <div>
            <FormHeaderWithActionButton headerLabel="Goals" color="blue" buttonLabel="Create Goal" toggleForm={this.handleToggleForm}/>
        <div ref="id_whichGoalForm">
        <div className='ui form'>
            <form className="goalForm" onSubmit={this.handleSubmit}>
                <div className='field'>
                  <label>Title</label>

                    <input
                      type="text"
                      placeholder="Title"
                      value={this.state.title}
                      onChange={this.handleTitleChange}
                    />
                  </div>
                <div className='field'>
                  <label>Description</label>

                    <input
                      type="text"
                      placeholder="Description"
                      value={this.state.description}
                      onChange={this.handleDescriptionChange}
                    />
                  </div>
                <div className='field'>
                  <label>Deadline</label>
                    <Datetime placeholder="Deadline" onChange={this.handleDeadlineChange} value={this.state.deadline} viewMode='days' className="ui small input" name="deadline" id="id_deadline"/>

                  </div>
                <div className='field'>
                  <label>Why</label>

                    <input
                      type="text"
                      placeholder="Why"
                      value={this.state.why}
                      onChange={this.handleWhyChange}
                    />
                  </div>
                <div className='field'>
                    <label>Image</label>

                    <input
                      type="text"
                      placeholder="Image"
                      value={this.state.image}
                      onChange={this.handleImageChange}
                    />
                  </div>
                <div className='field'>
                    <label>ViewableBy</label>

                    <select name="viewableBy" id="id_viewableBy" value={this.state.viewableBy} onChange={this.handleViewableByChange}>
                                                <option value="ONLY_ME">ONLY_ME</option>
                                                <option value="SHARED">Just people I've shared this goal with</option>
                                                <option value="MY_COACHES">Just my coaches</option>
                                                <option value="ALL_COACHES">All coaches</option>
                                                <option value="ANYONE">Anyone</option>

                                            </select>


                  </div>

              <div className="ui three column grid">
                                        <div className="ui row">&nbsp;</div>

                    <div className="ui row">
                        <div className="ui column">&nbsp;</div>


                                <div className="ui  column"><button className="ui fluid button" onClick={this.toggle}>Cancel</button></div>
                                <div className="ui  column"><button type="submit" className="ui primary fluid button">Save</button></div>


                    </div></div>
      </form>
                    <div className="ui row">&nbsp;</div>

                          </div>
            </div>
      </div>

    );
  },

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
        var theForm = new PlanForm2();

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

var HelloModal = React.createClass({
  getInitialState: function() {
    return {
      visible: false
    };
  },
  componentDidMount: function() {
    var self = this;
    $(window).on('modal.visible', function(ev){
      self.setState({visible: true});
    });
    $(window).on('modal.hidden', function(ev){
      self.setState(self.getInitialState());
    });
  },
  render: function() {
    var modal_classes = (this.state.visible)? 'ui small modal transition visible active' : 'ui small modal transition hidden';
    return (
      <div className={modal_classes}>
          <div className="ui container">
              <div className="header"><h1>Create Goal</h1></div>
              <div className="ui grid">
                  <div className="ui eight wide column">
                      <GoalForm onGoalSubmit={this.handleSubmit} serverErrors={this.state.serverErrors}/>
                  </div>
              </div>
          </div>
      </div>

    );
  }
});

var StepObjectEditForm = React.createClass({
    componentDidMount: function() {
        var self = this;
        if (!this.state.editFormIsOpen) {
            $(this.refs["stepFormRef_" + this.props.stepData.id]).hide();
            $(this.refs['id_whichDays_' + this.props.stepData.id]).hide();
            $(this.refs['id_whichDate_' + this.props.stepData.id]).hide();

        }
        this.showAndHideUIElements(this.state.frequency)

    },


    getInitialState: function() {

        var startDateInIntegerForm = this.props.stepData.startDate;

        var endDateInIntegerForm = this.props.stepData.endDate;

        var planStartDateInDateForm = this.props.planStartDate;
        var planStartDateInMomentForm = moment(planStartDateInDateForm)

        var calculatedStartDate = moment(planStartDateInMomentForm, "DD-MM-YYYY").add(startDateInIntegerForm, 'days');
        var calculatedEndDate = moment(planStartDateInMomentForm, "DD-MM-YYYY").add(endDateInIntegerForm, 'days');



        return {
            id: this.props.stepData.id,
            title: this.props.stepData.title,
            description:this.props.stepData.description,
            frequency: this.props.stepData.frequency,
            day01:this.props.stepData.day01,
            day02:this.props.stepData.day02,
            day03:this.props.stepData.day03,
            day04:this.props.stepData.day04,
            day05:this.props.stepData.day05,
            day06:this.props.stepData.day06,
            day07:this.props.stepData.day07,
            startDate:calculatedStartDate,
            endDate:calculatedEndDate,
            absoluteStartDate:calculatedStartDate,
            absoluteEndDate:calculatedEndDate,

            startTime:this.props.stepData.startTime,
            duration:this.props.stepData.duration,
            durationMetric:this.props.stepData.durationMetric,
            editFormIsOpen: false,
            editFormButtonText:"Edit",
            plan: this.props.planId,
            formSubmittedSuccessfully:false,
            monthlyDates: this.props.stepData.monthlyDates

        }
    },



    handleSubmit: function(e) {

        e.preventDefault();

        var id = this.state.id;
        var title = this.state.title;
        var description = this.state.description;
        var frequency = this.state.frequency;
        var day01 = this.state.day01;
        var day02 = this.state.day02;
        var day03 = this.state.day03;
        var day04 = this.state.day04;
        var day05 = this.state.day05;
        var day06 = this.state.day06;
        var day07 = this.state.day07;
        var startTime = this.state.startTime;
        var duration = this.state.duration;
        var durationMetric = this.state.durationMetric;
        var plan = this.props.planId;
        var monthlyDates = this.state.monthlyDates;

        var absoluteStartDate = moment(this.state.absoluteStartDate).format("YYYY-MM-DD");
        var absoluteEndDate = moment(this.state.absoluteEndDate).format("YYYY-MM-DD");

        var absoluteStartDateInMomentForm = moment(absoluteStartDate);
        var absoluteEndDateInMomentForm = moment(absoluteEndDate);

        var planStartDateInDateForm = this.props.planStartDate;
        var planStartDateInMomentForm = moment(planStartDateInDateForm)
        var startDate = absoluteStartDateInMomentForm.diff(planStartDateInMomentForm, 'days') +2;
        var endDate = absoluteEndDateInMomentForm.diff(planStartDateInMomentForm, 'days') + 2;

        if (!description || !title ) {
        return;
        }

        this.props.onFormSubmit({
            id:id,
            title: title,
            description:description,
            frequency:frequency,
            day01:day01,
            day02:day02,
            day03:day03,
            day04:day04,
            day05:day05,
            day06:day06,
            day07:day07,
            monthlyDates:monthlyDates,
            absoluteStartDate:absoluteStartDate,
            absoluteEndDate:absoluteEndDate,
            startDate:startDate,
            endDate:endDate,
            startTime:startTime,
            duration:duration,
            durationMetric:durationMetric,
            plan:this.props.planId,},
            function(data){
                this.setState({editFormIsOpen: false});
                this.setState({editFormButtonText:"Edit"});

            this.setState({formSubmittedSuccessfully:true});
        }.bind(this));

    },

    editButtonClicked: function() {
        if (this.state.editFormIsOpen) {
            this.closeForm();
        }
        else {
            this.openForm()
        }
    },
    openForm: function() {
        this.setState({editFormIsOpen: true});
        this.setState({editFormButtonText:"Cancel"})
    },

    closeForm: function() {
        this.setState({editFormIsOpen: false});
        this.setState({editFormButtonText:"Edit"})

    },

    toggleForm: function() {


        if (this.state.formSubmittedSuccessfully == true ){
            this.setState({formSubmittedSuccessfully: false})

        }


        $(this.refs["stepFormRef_" + this.state.id]).slideToggle();
        $(this.refs["editButtonRef_" + this.state.id]).toggle();
        $(this.refs["deleteButtonRef_" + this.state.id]).toggle();

        $(this.refs["ref_stepExistingInfo_" + this.state.id]).slideToggle();

    },

    showAndHideUIElements: function() {
        var frequencyValue = this.state.frequency;
        if (frequencyValue == "WEEKLY") {
            $(this.refs['id_whichDays_' + this.props.stepData.id]).show();
            $(this.refs['id_whichDate_' + this.props.stepData.id]).hide();
            $(this.refs['ref_dateSet_' + this.props.stepData.id]).show();
            $(this.refs['ref_date_' + this.props.stepData.id]).hide();



        } else if (frequencyValue == "ONCE") {
            $(this.refs['id_whichDays_' + this.props.stepData.id]).hide();
            $(this.refs['id_whichDate_' + this.props.stepData.id]).hide();
            $(this.refs['ref_dateSet_' + this.props.stepData.id]).hide();
            $(this.refs['ref_date_' + this.props.stepData.id]).show();


        } else if (frequencyValue == "MONTHLY") {
            $(this.refs['id_whichDays_' + this.props.stepData.id]).hide();
            $(this.refs['id_whichDate_' + this.props.stepData.id]).show();
            $(this.refs['ref_dateSet_' + this.props.stepData.id]).show();
            $(this.refs['ref_date_' + this.props.stepData.id]).hide();


        } else if (frequencyValue == "DAILY") {
            $(this.refs['id_whichDays_' + this.props.stepData.id]).hide();
            $(this.refs['id_whichDate_' + this.props.stepData.id]).hide();
            $(this.refs['ref_dateSet_' + this.props.stepData.id]).show();
            $(this.refs['ref_date_' + this.props.stepData.id]).hide();


        }
    },

    handleFrequencyChange: function(e) {
        this.setState({frequency: e.target.value});


    },


    handleTitleChange: function(value) {
        //if (validator.isEmail(e.target.value)) {
        //} else {
            this.setState({title: value});

        //}
    },

    handleDescriptionChange: function(value) {
        this.setState({description: value});
    },

   handleStartDateChange: function(date) {
        this.setState({startDate: date});
  },
    handleEndDateChange: function(date) {
        this.setState({endDate: date});
  },


    handleAbsoluteStartDateChange: function(date) {
        this.setState({absoluteStartDate: date});
  },
    handleAbsoluteEndDateChange: function(date) {
        this.setState({absoluteEndDate: date});
  },
    setTitle: function(stateValueFromChild) {
        this.state.title = stateValueFromChild;
    },

    handleEditorChange: function(e) {
        this.setState({description: e.target.getContent()});
  },
    handleDay01Change: function(e) {
        this.setState({day01: e.target.value});
    },

    handleDay02Change: function(e) {
        this.setState({day02: e.target.value});
    },

    handleDay03Change: function(e) {
        this.setState({day03: e.target.value});
    },

    handleDay04Change: function(e) {
        this.setState({day04: e.target.value});
    },

    handleDay05Change: function(e) {

        this.setState({day05: e.target.value});
    },

    handleDay06Change: function(e) {

        this.setState({day06: e.target.value});
    },

    handleDay07Change: function(e) {

        this.setState({day07: e.target.value});
    },


    handleStartTimeChange: function(e) {

        this.setState({startTime:e.target.value});
    },
    handleDurationChange: function(e) {

        this.setState({duration: e.target.value});
    },

    handleDurationMetricChange: function(e) {
        this.setState({durationMetric: e.target.value});
    },

    handleMonthlyDatesChange: function(e) {
        this.setState({monthlyDates: e.target.value});
    },


    deleteStep: function() {
            $(this.refs["ref_step_" + this.state.id]).slideToggle();

        $.ajax({
        url: theServer + "api/steps/" + this.state.id + "/",
        dataType: 'json',
        type: 'DELETE',
        //data: step,
        success: function() {

        },
        error: function(xhr, status, err) {
            console.error(this.props.url, status, err.toString());
        }
    });


    },

    componentDidUpdate(){
        let selectNode = $(this.refs["ref_frequency_" + this.state.id]);
        selectNode.value = this.state.frequency;
                this.showAndHideUIElements();

    },

    render: function () {
        var planScheduleMetric = "Week";
        //if (this.state.formSubmittedSuccessfully == true ){
        //    this.toggleForm();

        //}
        if (this.state.editFormIsOpen) {

            $(this.refs["stepFormRef_" + this.state.id]).show();
           // $(this.refs["editButtonRef_" + this.state.id]).show();
            //$(this.refs["deleteButtonRef_" + this.state.id]).show();
            $(this.refs["ref_stepExistingInfo_" + this.state.id]).hide();
        }
        else {
            $(this.refs["stepFormRef_" + this.state.id]).hide();
            //$(this.refs["editButtonRef_" + this.state.id]).hide();
            //$(this.refs["deleteButtonRef_" + this.state.id]).hide();
            $(this.refs["ref_stepExistingInfo_" + this.state.id]).show();
        }
        return (
            <div ref={`ref_step_${this.state.id}`} className="stackable column " key={this.state.id} >
                        <div className="ui top attached purple large button " onClick={this.clearPage}>
                            <div className="ui grid">

                            <div className="left aligned nine wide column">Step</div>
                            <div ref={`editButtonRef_${this.state.id}`} className="ui three wide column tiny smallPadding middle aligned purple-inverted button"  onClick={this.editButtonClicked}>{this.state.editFormButtonText}</div>
                            <div ref={`deleteButtonRef_${this.state.id}`}className="ui three wide column tiny smallPadding middle aligned purple-inverted button"  onClick={this.deleteStep}>Delete</div>

                                </div></div>
                    <div className="ui segment noBottomMargin noTopMargin">

<div ref={`ref_stepExistingInfo_${this.state.id}`}>
                            <div className="row">
                                <h3>{this.state.title}</h3>
                            </div>
                            <div className="fluid row">Length: {this.state.scheduleLength} {this.state.timeMetric}</div>
                            <div className="fluid row" dangerouslySetInnerHTML={{__html: this.state.description}} />

                        <div className="two wide column"><Link to={`/plans/${this.state.id}/steps`}>

</Link></div>
                    </div>
                    <div className="sixteen wide row">
                    <div>
            <div ref={`stepFormRef_${this.state.id}`}  className="ui form">
                <form onSubmit={this.handleSubmit}>

                    <div className="ui grid">

                    <div className="ui row">
                            <div className="sixteen wide column">
                                              <input type="hidden" name="plan" id="id_plan" value={this.props.planId}/>

                                <ValidatedInput
                                        type="text"
                                        name="title"
                                        label="Title"
                                        id="id_title"
                                        value={this.state.title}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleTitleChange}

                                    />





                            </div>
                        </div>
                        <div className="ui row">
                            <div className="sixteen wide column">
                                                                <div className="field">


                                                                            <label htmlFor="id_description">Description:</label>

                               <TinyMCE name="description" id={`id_description_${this.state.id}`}
        content={this.state.description}
        config={{
          plugins: 'link image code media',
          menubar: "insert",
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | media'
        }}
        onChange={this.handleEditorChange}
      />


                            </div>
                        </div>
                                        </div>


                        <div className="ui row">
                            <div className="sixteen wide column">
                                <div className="field">
                                            <label htmlFor="id_frequency">Repeat?:</label>
                                            <select ref={`ref_frequency_${this.state.id}`} id="id_frequency" name="frequency" value={this.state.frequency} onChange={this.handleFrequencyChange}>
                                                <option value="ONCE">Don't repeat</option>
                                                <option value="DAILY">Daily</option>
                                                <option value="WEEKLY">Weekly</option>
                                                <option value="MONTHLY">Monthly</option>
                                            </select>
                                        </div>
                            </div>
                        </div>
                         <div ref={`ref_dateSet_${this.state.id}`} className="ui row">
                                    <div className="eight wide column">
                                        <div className="field">
                                            <label htmlFor="id_absoluteStartDate">Start Date:</label>

                                            <DatePicker selected={this.state.absoluteStartDate} onChange={this.handleAbsoluteStartDateChange} />
                                            </div>
                                        </div>
                                    <div className="eight wide column">
                                        <div className="field">
                                            <label htmlFor="id_absoluteEndDate">End Date:</label>

                                            <DatePicker selected={this.state.absoluteEndDate} onChange={this.handleAbsoluteEndDateChange} />
                                            </div>
                                        </div>
                                    </div>
                                <div ref={`ref_date_${this.state.id}`} className="ui row">
                                    <div className="eight wide column">
                                        <div className="field">
                                            <label htmlFor="id_absoluteStartDate">Date:</label>

                                            <DatePicker selected={this.state.absoluteStartDate} onChange={this.handleAbsoluteStartDateChange} />
                                            </div>
                                        </div>
                                    </div>
                        <div className="ui row">
                            <div className="eight wide column">
                                <div className="field">
                                    <label htmlFor="id_startTime">Start Time:</label>

                                    <TimeInput className="ui small input" name="startTime" id="id_startTimeNumber"
                                               onChange={this.handleStartTimeChange}/>
                                </div>
                            </div>
                            <div className="eight wide column">
                                <div className="field">
                                    <label>&nbsp;</label>

                                    <select className="ui massive input middle aligned" name="amOrPm" id="id_amOrPm"
                                            onChange={this.handleStartTimeChange}>
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="ui row">
                            <div className="eight wide column">
                                <div className="field">
                                    <label htmlFor="id_duration">For how long:</label>

                                    <input value={this.state.duration} className="ui mini input" name="duration" id="id_duration"
                                           onChange={this.handleDurationChange}/>
                                </div>
                                                            </div>

                                <div className="eight wide column">
                                    <div className="field">
                                        <label>&nbsp;</label>

                                        <select className="ui massive input middle aligned" value={this.state.durationMetric} name="durationMetric" id="id_durationMetric"
                                                onChange={this.handleDurationMetricChange}>

                                            <option value="MINUTES">Minutes</option>
                                            <option value="HOURS">Hours</option>
                                        </select>
                                    </div>
                                </div>


                            </div>
                        <div ref={`id_whichDays_${this.props.stepData.id}`} className="ui row">

                            <div className="sixteen wide column">
                                <div className="field fluid">
                                    <label>Select which days to schedule each week (based on
                                        a Monday start):</label>

                                    <div className="ui equal width tiny buttons ">
                                        <ToggleButton id="id_day01" label="M" value={this.state.day01} callback={this.handleDay01Change.bind(this)} />
                                        <ToggleButton id="id_day02" label="T" value={this.state.day02} callback={this.handleDay02Change.bind(this)} />
                                        <ToggleButton id="id_day03" label="W" value={this.state.day03} callback={this.handleDay03Change.bind(this)} />
                                        <ToggleButton id="id_day04" label="Th" value={this.state.day04} callback={this.handleDay04Change.bind(this)} />
                                        <ToggleButton id="id_day05" label="F" value={this.state.day05} callback={this.handleDay05Change.bind(this)} />
                                        <ToggleButton id="id_day06" label="Sa" value={this.state.day06} callback={this.handleDay06Change.bind(this)} />
                                        <ToggleButton id="id_day07" label="Su" value={this.state.day07} callback={this.handleDay07Change.bind(this)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div ref={`id_whichDate_${this.props.stepData.id}`} className="ui row">

                            <div className="sixteen wide column">

                                <div className="field fluid">

                                    <label htmlFor="id_date">What date(s) in a month would you like this to occur
                                        (1-30)?</label>
                                    <input type="text" name="monthlyDates" id="id_monthlyDates" value={this.state.monthlyDates} onChange={this.handleMonthlyDatesChange}/>

                                </div>

                            </div>
                        </div>





                        </div>
                    <UpdatesList stepId={this.state.id} updates={this.state.updates}/>



                    <div className="ui two column grid">
                        <div className="ui row">
                            <div className="ui column">
                                <a className="ui fluid button" onClick={this.closeForm}>Cancel</a>
                            </div>
                            <div className="ui  column">
                                <button type="submit" className="ui primary fluid button">Save</button>
                            </div>
                            <div className="ui row">&nbsp;</div>
                        </div>
                    </div>

                </form >

            </div>
                        </div>
                </div>

                        </div>


                        </div>
        )
    }


});

var ModalPage = React.createClass({
  getInitialState: function() {
    return {
      visible: false
    };
  },
  componentDidMount: function() {
    var self = this;
    $(window).on('modal.visible', function(ev){
      self.setState({visible: true});
    });
    $(window).on('modal.hidden', function(ev){
      self.setState(self.getInitialState());
    });
  },
  handleClick: function(ev){
    if (ev.target == ReactDOM.findDOMNode(this)){
      $(window).trigger('modal.hidden');
    }
  },
  render: function() {
    var modal_classes = (this.state.visible)? 'ui dimmer modals page transition visible active' : 'ui dimmer modals page transition hidden';
    return (
      <div className={modal_classes} onClick={this.handleClick}>
        <HelloModal />
      </div>
    );
  }
});

var StepFormAction = React.createClass({
    componentDidMount: function() {
        var self = this;
        this.loadObjectsFromServer();
        $(this.refs[this.props.actionFormRef]).hide();
        $(this.refs['id_whichDate']).hide();
        this.showAndHideUIElements()

    },



    loadObjectsFromServer: function () {
        $.ajax({
          url: theServer + "api/plans/" + this.props.planId + "/",
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  planStartDate:data.startDate,

              })



          }.bind(this),
          error: function(xhr, status, err) {
            console.error(theServer + "api/plans/" + this.props.planId + "/", status, err.toString());
          }.bind(this)
        });
      },



    getInitialState: function() {



        return {
            title: '',
            description:'',
            frequency:'ONCE',
            day01:"false",
            day02:"false",
            day03:"false",
            day04:"false",
            day05:"false",
            day06:"false",
            day07:"false",
            monthlyDates:"",
            absoluteStartDate:moment(this.props.planStartDate, "YYYY-MM-DD"),
            absoluteEndDate: moment(this.props.planStartDate, "YYYY-MM-DD"),

            startTime:"",
            duration:"1",
            durationMetric:"Hour",

        }
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var title = this.state.title;
        var description = this.state.description;
        var frequency = this.state.frequency;

        var day01 = this.state.day01;
        var day02 = this.state.day02;
        var day03 = this.state.day03;
        var day04 = this.state.day04;
        var day05 = this.state.day05;
        var day06 = this.state.day06;
        var day07 = this.state.day07;
        var monthlyDates = this.state.monthlyDates;


        var absoluteStartDate = moment(this.state.absoluteStartDate).format("MMM DD, YYYY");
        var absoluteEndDate = moment(this.state.absoluteEndDate).format("MMM DD, YYYY");

        var absoluteStartDateInMomentForm = moment(absoluteStartDate);
        var absoluteEndDateInMomentForm = moment(absoluteEndDate);

        var planStartDateInDateForm = this.props.planStartDate;
        var planStartDateInMomentForm = moment(planStartDateInDateForm)
        var startDate = absoluteStartDateInMomentForm.diff(planStartDateInMomentForm, 'days') +2;
        var endDate = absoluteEndDateInMomentForm.diff(planStartDateInMomentForm, 'days') + 2;
        var startTime = this.state.startTime;

        var duration = this.state.duration;
        var durationMetric = this.state.durationMetric;
        var plan = this.props.planId;

        this.props.onFormSubmit({
            title: title,
            description:description,
            frequency:frequency,
            day01:day01,
            day02:day02,
            day03:day03,
            day04:day04,
            day05:day05,
            day06:day06,
            day07:day07,
            monthlyDates:monthlyDates,
            startTime:startTime,
            startDate:startDate,
            endDate: endDate,
            absoluteStartDate: absoluteStartDate,
            absoluteEndDate: absoluteEndDate,
            duration:duration,
            durationMetric:durationMetric,

            plan:this.props.planId,},
            function(data){
                this.toggleForm()

                this.setState({
                    title: '',
                    description:'',
                    frequency:'ONCE',
                    day01:"false",
                    day02:"false",
                    day03:"false",
                    day04:"false",
                    day05:"false",
                    day06:"false",
                    day07:"false",
                    monthlyDates:"",
                    absoluteStartDate:this.props.planStartDate,
                    absoluteEndDate:this.props.planStartDate,
                    startTime:"",
                    duration:"1",
                    durationMetric:"Hour",
                    formSubmittedSuccessfully:true
        })
        }.bind(this));



    },


    toggleForm: function() {
        $(this.refs[this.props.actionFormRef]).slideToggle();
        $(this.refs['clickToToggleButton']).toggle();
        if (this.state.formSubmittedSuccessfully == true ){
            this.setState({formSubmittedSuccessfully:false})
        }
        this.clearForm();
    },

    clearForm: function() {
        this.setState({
                    title: '',
                    description:'',
                    frequency:'ONCE',
                    day01:"false",
                    day02:"false",
                    day03:"false",
                    day04:"false",
                    day05:"false",
                    day06:"false",
                    day07:"false",
                    monthlyDates:"",
                    absoluteStartDate:this.props.planStartDate,
                    absoluteEndDate:this.props.planStartDate,
                    endDate:"",
                    startTime:"",
                    duration:"1",
                    durationMetric:"Hour",
                    formSubmittedSuccessfully:true
        })
    },

    handleTitleChange: function(e) {

        this.setState({title: e.target.value});
    },

    handleDescriptionChange: function(e) {
        this.setState({description: e.target.value});
    },

    handleFrequencyChange: function(e) {
        this.setState({frequency: e.target.value});

    },
    showAndHideUIElements: function() {
        var frequencyValue = this.state.frequency;
        if (frequencyValue == "WEEKLY") {
            $(this.refs['id_whichDays']).show();
            $(this.refs['id_whichDate']).hide();
            $(this.refs['ref_dateSet']).show();
            $(this.refs['ref_date']).hide();



        } else if (frequencyValue == "ONCE") {
            $(this.refs['id_whichDays']).hide();
            $(this.refs['id_whichDate']).hide();
            $(this.refs['ref_dateSet']).hide();
            $(this.refs['ref_date']).show();


        } else if (frequencyValue == "MONTHLY") {
            $(this.refs['id_whichDays']).hide();
            $(this.refs['id_whichDate']).show();
            $(this.refs['ref_dateSet']).show();
            $(this.refs['ref_date']).hide();


        } else if (frequencyValue == "DAILY") {
            $(this.refs['id_whichDays']).hide();
            $(this.refs['id_whichDate']).hide();
            $(this.refs['ref_dateSet']).show();
            $(this.refs['ref_date']).hide();


        }
    },

    handleEditorChange: function(e) {
        this.setState({description: e.target.getContent()});
  },

    handleDay01Change: function(e) {
        this.state();
        this.setState({day01: e.target.value});
    },

    handleDay02Change: function(e) {
        this.setState({day02: e.target.value});
    },

    handleDay03Change: function(e) {
        this.setState({day03: e.target.value});
    },

    handleDay04Change: function(e) {
        this.setState({day04: e.target.value});
    },

    handleDay05Change: function(e) {

        this.setState({day05: e.target.value});
    },

    handleDay06Change: function(e) {

        this.setState({day06: e.target.value});
    },

    handleDay07Change: function(e) {

        this.setState({day07: e.target.value});
    },

    handleMonthlyDatesChange: function(e) {

        this.setState({monthlyDates: e.target.value});
    },


    handleStartTimeChange: function(e) {

        this.setState({startTime:e.target.value});
    },

    handleDurationChange: function(e) {

        this.setState({duration: e.value});
    },


    handleStartDateChange: function(date) {
        this.setState({startDate: date});
  },
    handleEndDateChange: function(date) {
        this.setState({endDate: date});
  },

     handleAbsoluteStartDateChange: function(date) {
        this.setState({absoluteStartDate: date});

  },
    handleAbsoluteEndDateChange: function(date) {
        this.setState({absoluteEndDate: date});

  },

    componentDidUpdate(){
        let selectNode = $(this.refs["ref_frequency"]);
        selectNode.value = this.state.frequency;
        this.showAndHideUIElements();

    },


    render: function() {
        var planScheduleMetric = "Week";
        switch(this.props.modelForm) {
            case "PlanForm":
                var theForm = new PlanForm2();
                break;
            case "StepForm":
                var theForm = new StepForm();
                break;
            default:
                break;
        }
        //if (this.state.formSubmittedSuccessfully == true ){
        //    this.toggleForm()
        //}
        return (
            <div>
                <div className="ui three column grid">
                    <div className="ui right floated column">
                        <button className="ui right floated purple large fluid button" ref="clickToToggleButton"
                                onClick={this.toggleForm}>{this.props.actionButtonLabel}</button>
                    </div>
                </div>

                <div ref={`${this.props.actionFormRef}`}>

                    <div className="ui form">
                        <form onSubmit={this.handleSubmit}>

                            <div className="ui grid">
                                <div className="ui row">
                                    <div className="ten wide column">
                                        <div className="field">
                                            <ValidatedInput
                                        type="text"
                                        name="title"
                                        label="Title"
                                        id="id_title"
                                        value={this.state.title}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleTitleChange}

                                    />
                                            <input type="hidden" name="plan" id="id_plan" value={this.props.planId} />
                                        </div>
                                    </div>
                                    <div className="six wide column">&nbsp;</div>
                                </div>

                                <div className="ui row">
                                    <div className="ten wide column">

                                        <div className="field fluid" data-inverted="" data-tooltip="Add users to your feed" data-position="right center">
                                            <label htmlFor="id_description">Description:</label>

                                        <TinyMCE name="description" id="id_description"
        content={this.state.description}
        config={{
          plugins: 'link image code media',
          menubar: "insert",
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | media'
        }}
        onChange={this.handleEditorChange}
      />

                                        </div>
                                    </div>
                                </div>
                                <div className="ui row">
                                    <div className="three wide column">
                                        <div className="field">
                                            <label htmlFor="id_frequency">Repeat?:</label>
                                            <select ref="ref_frequency" id="id_frequency" name="frequency" value={this.state.frequency} onChange={this.handleFrequencyChange}>
                                                <option value="ONCE">Don't repeat</option>
                                                <option value="DAILY">Daily</option>
                                                <option value="WEEKLY">Weekly</option>
                                                <option value="MONTHLY">Monthly</option>
                                            </select>
                                        </div>
                                    </div>
                                    </div>
                                <div ref="ref_dateSet"className="ui row">
                                    <div className="three wide column">
                                        <div className="field">
                                            <label htmlFor="id_absoluteStartDate">Start Date:</label>

                                            <DatePicker selected={this.state.absoluteStartDate} onChange={this.handleAbsoluteStartDateChange} />
                                            </div>
                                        </div>
                                    <div className="three wide column">
                                        <div className="field">
                                            <label htmlFor="id_absoluteEndDate">End Date:</label>

                                            <DatePicker selected={this.state.absoluteEndDate} onChange={this.handleAbsoluteEndDateChange} />
                                            </div>
                                        </div>
                                    </div>
                                <div ref="ref_date" className="ui row">
                                    <div className="four wide column">
                                        <div className="field">
                                            <label htmlFor="id_absoluteStartDate">Date:</label>

                                            <DatePicker  selected={this.state.absoluteStartDate} onChange={this.handleAbsoluteStartDateChange} />
                                            </div>
                                        </div>
                                    </div>
                                <div className="ui row">
                                    <div className="three wide column">
                                        <div className="field">
                                            <label htmlFor="id_startTime">Start Time:</label>
                                            <TimeInput value={this.state.startTime} className="ui small input" name="startTime" id="id_startTimeNumber" onChange={this.handleStartTimeChange}/>
                                        </div>
                                        </div>
                                     <div className="two wide column">
                                        <div className="field">
                                            <label>&nbsp;</label>

                                            <select className="ui massive input middle aligned" name="amOrPm" id="id_amOrPm" onChange={this.handleStartTimeChange}>
                                                <option value="AM">AM</option>
                                                <option value="PM">PM</option>
                                            </select>
                                            </div>
                                         </div>
                                    <div className="two wide column">
                                        <div className="field">
                                            <label htmlFor="id_duration">For how long:</label>
                                            <input className="ui mini input" name="duration" id="id_duration" value={this.state.duration} onChange={this.handleDurationChange}/>
                                        </div>
                                    </div>
                                    <div className="three wide column">
                                        <div className="field">
                                            <label >&nbsp;</label>

                                            <select className="ui massive input middle aligned" name="durationMetric" id="id_durationMetric" onChange={this.handleDurationMetricChange}>

                                                <option value="MINUTES">Minutes</option>
                                                <option value="HOURS">Hours</option>
                                            </select>
                                        </div>
                                    </div>


                                                                                    </div>






                                <div ref="id_whichDays" className="ui row">

                                    <div  className="ten wide column">
                                        <div  className="field fluid">
                                            <label>Select which days to schedule each week (based on
                                                a Monday start):</label>

                                            <div className="ui equal width buttons ">
                                                <ToggleButton id="id_day01" label="M" value={this.state.day01} callback={this.handleDay01Change.bind(this)} />
                                        <ToggleButton id="id_day02" label="T" value={this.state.day02} callback={this.handleDay02Change.bind(this)} />
                                        <ToggleButton id="id_day03" label="W" value={this.state.day03} callback={this.handleDay03Change.bind(this)} />
                                        <ToggleButton id="id_day04" label="Th" value={this.state.day04} callback={this.handleDay04Change.bind(this)} />
                                        <ToggleButton id="id_day05" label="F" value={this.state.day05} callback={this.handleDay05Change.bind(this)} />
                                        <ToggleButton id="id_day06" label="Sa" value={this.state.day06} callback={this.handleDay06Change.bind(this)} />
                                        <ToggleButton id="id_day07" label="Su" value={this.state.day07} callback={this.handleDay07Change.bind(this)} />
                                            </div>
                                        </div>
                                    </div>
                                    </div>
                                <div ref="id_whichDate" className="ui row">

                                    <div  className="six wide column">

                                                <div  className="field fluid">

                                                <label htmlFor="id_monthlyDates">What date(s) in a month would you like this to occur
                                                (e.g. "1, 3-9, 21")?</label>
                                            <input type="text" name="monthlyDates" id="id_monthlyDates" onChange={this.handleMonthlyDatesChange}/>

                                        </div>

                                    </div>
                                </div>



                                </div>



                            <div className="ui three column grid">
                    <div className="ui row">&nbsp;</div>
                    <div className="ui row">
                        <div className="ui  column">&nbsp;</div>
                        <div className="ui  column"><a className="ui fluid button" onClick={this.toggleForm}>Cancel</a></div>
                        <div className="ui  column"><button type="submit"  className="ui primary fluid button">Save</button></div>
                                        <div className="ui row">&nbsp;</div>
</div>
                </div>

                    </form >

                                </div>




            </div>
                            </div>


        )

    }
});

var React = require('react');
let ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {FormAction, Sidebar } from './base'
var Datetime = require('react-datetime');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
var MaskedInput = require('react-maskedinput');
var classNames = require('classnames');
import validator from 'validator';
var UpdatesList = require('./update');
var Modal = require('react-modal');
var DatePicker = require('react-datepicker');
var moment = require('moment')
var ValidatedInput = require('./app')

var TinyMCEInput = require('react-tinymce-input');


require('react-datepicker/dist/react-datepicker.css');

export class StepCalendarComponent2 extends React.Component {
    constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>StepCalendarComponent2</div>
    );
  }
}

export class StepCalendarComponent3 extends StepCalendarComponent2 {
    render() {
        return (
            <div>StepCalendarComponent3</div>
        )
    }
}

// Component for adding, editing, deleting, and viewing Step objects
var StepCalendarComponent = React.createClass({


    setStepData: function() {
            console.log("inside setStepData")
            console.log("title is " + this.props.stepData.title)
            var startDateInIntegerForm = this.props.stepData.startDate;
            var endDateInIntegerForm = this.props.stepData.endDate;

            var planStartDateInDateForm = this.props.planStartDate;
            var planStartDateInMomentForm = moment(planStartDateInDateForm)

            var calculatedStartDate = moment(planStartDateInMomentForm, "DD-MM-YYYY").add(startDateInIntegerForm, 'days');
            var calculatedEndDate = moment(planStartDateInMomentForm, "DD-MM-YYYY").add(endDateInIntegerForm, 'days');
            this.setState({
            id: this.props.stepData.id,
            title: this.props.stepData.title,
            description: this.props.stepData.description,
            frequency: this.props.stepData.frequency,
            day01:this.props.stepData.day01,
            day02:this.props.stepData.day02,
            day03:this.props.stepData.day03,
            day04:this.props.stepData.day04,
            day05:this.props.stepData.day05,
            day06:this.props.stepData.day06,
            day07:this.props.stepData.day07,
            startDate:this.props.stepData.startDate,
            endDate:this.props.stepData.endDate,
            absoluteStartDate:calculatedStartDate,
            absoluteEndDate:calculatedEndDate,

            startTime:this.props.stepData.startTime,
            duration: this.props.stepData.duration,
            durationMetric: this.props.stepData.durationMetric,
            editFormIsOpen: false,
            editFormButtonText:"Edit",
            plan: this.props.planId,
            formSubmittedSuccessfully:false,
            monthlyDates: this.props.stepData.monthlyDates
        })
            clearInterval(this.state.intervalID);



      },

    componentWillReceiveProps: function() {

        if (this.props.stepData && this.props.method=="edit") {
            if (this.props.stepData.id != this.state.id) {
                $(this.refs["ref_stepForm"]).hide();

                $(this.refs["ref_createMenuBar"]).hide();

                this.setStepData()
                $(this.refs["ref_editMenuBar"]).slideDown();

                $(this.refs["ref_stepExistingInfo"]).slideDown();



            }
        } else if (this.props.method=="create") {

            if (this.props.eventInfo != this.state.eventInfo) {

                this.getInitialState()
                this.setState({eventInfo: this.props.eventInfo})
                this.setState({
                    absoluteStartDate: moment(this.props.eventInfo.start, "YYYY-MM-DD"),
                    absoluteEndDate: moment(this.props.eventInfo.start, "YYYY-MM-DD"),
                })

                $(this.refs["ref_editMenuBar"]).hide();
                $(this.refs["ref_createMenuBar"]).show();
                $(this.refs["ref_stepExistingInfo"]).hide();
                $(this.refs["ref_stepForm"]).slideDown();




            }
        }

    },


    componentDidMount: function() {
        $(this.refs["ref_step"]).hide();

        $(this.refs["ref_stepForm"]).hide();
        $(this.refs["ref_stepExistingInfo"]).hide();
        $(this.refs["ref_createMenuBar"]).hide();
        $(this.refs["ref_editMenuBar"]).hide();





        var self = this;
        //var intervalID = setInterval(this.setStepData, 2000);

        //this.setState({ intervalID:intervalID });


        if (this.props.method=="edit") {
            var refSuffix = "_" + this.props.stepId;

        }
        else if (this.props.method=="create") {
            var refSuffix = "";


        }

        if (!this.state.editFormIsOpen) {
            //$(this.refs["ref_stepForm" + refSuffix]).hide();
            //$(this.refs['ref_whichDays' + refSuffix]).hide();
            //$(this.refs['ref_whichDate' + refSuffix]).hide();

        }
        this.showAndHideUIElements(this.state.frequency)

    },




    getInitialState: function() {

            return {
                title: '',
                description:'',
                frequency:'ONCE',
                day01:"false",
                day02:"false",
                day03:"false",
                day04:"false",
                day05:"false",
                day06:"false",
                day07:"false",
                monthlyDates:"",
                absoluteStartDate:moment(this.props.planStartDate, "YYYY-MM-DD"),
                absoluteEndDate: moment(this.props.planStartDate, "YYYY-MM-DD"),
                stepData:[],

                startTime:"",
                duration:"1",
                durationMetric:"Hour",

            }
        }
    ,



    handleSubmit: function(e) {

        e.preventDefault();

        var title = this.state.title;
        var description = this.state.description;
        var frequency = this.state.frequency;
        var day01 = this.state.day01;
        var day02 = this.state.day02;
        var day03 = this.state.day03;
        var day04 = this.state.day04;
        var day05 = this.state.day05;
        var day06 = this.state.day06;
        var day07 = this.state.day07;
        var startTime = this.state.startTime;
        var duration = this.state.duration;
        var durationMetric = this.state.durationMetric;
        var plan = this.props.planId;
        var monthlyDates = this.state.monthlyDates;

        var absoluteStartDate = moment(this.state.absoluteStartDate).format("YYYY-MM-DD");
        var absoluteEndDate = moment(this.state.absoluteEndDate).format("YYYY-MM-DD");

        var absoluteStartDateInMomentForm = moment(absoluteStartDate);
        var absoluteEndDateInMomentForm = moment(absoluteEndDate);

        var planStartDateInDateForm = this.props.planStartDate;
        var planStartDateInMomentForm = moment(planStartDateInDateForm)
        var startDate = absoluteStartDateInMomentForm.diff(planStartDateInMomentForm, 'days') +2;
        var endDate = absoluteEndDateInMomentForm.diff(planStartDateInMomentForm, 'days') + 2;

        var formData = {
                title: title,
                description:description,
                frequency:frequency,
                day01:day01,
                day02:day02,
                day03:day03,
                day04:day04,
                day05:day05,
                day06:day06,
                day07:day07,
                monthlyDates:monthlyDates,
                startTime:startTime,
                startDate:startDate,
                endDate: endDate,
                absoluteStartDate: absoluteStartDate,
                absoluteEndDate: absoluteEndDate,
                duration:duration,
                durationMetric:durationMetric,
                plan:this.props.planId,
            }


        if (this.props.method=="edit") {
            formData.id = this.state.id
        }


        this.props.onFormSubmit(
            formData,
            function(data){

                if (this.props.method=="create") {
                    this.toggleForm()

                    this.setState({
                        title: '',
                        description:'',
                        frequency:'ONCE',
                        day01:"false",
                        day02:"false",
                        day03:"false",
                        day04:"false",
                        day05:"false",
                        day06:"false",
                        day07:"false",
                        monthlyDates:"",
                        absoluteStartDate:this.props.planStartDate,
                        absoluteEndDate:this.props.planStartDate,
                        startTime:"",
                        duration:"1",
                        durationMetric:"Hour",
                        formSubmittedSuccessfully:true
                    })
                }

                else if (this.props.method=="edit") {
                    this.setState({editFormIsOpen: false});
                    this.setState({editFormButtonText: "Edit"});
                    this.setState({formSubmittedSuccessfully: true});
                }
        }.bind(this));

    },

    editButtonClicked: function() {
        if (this.state.editFormIsOpen) {
            this.closeForm();
        }
        else {
            this.openForm()
        }
    },
    openForm: function() {
        this.setState({editFormIsOpen: true});
        this.setState({editFormButtonText:"Cancel"})
    },

    closeForm: function() {
        this.setState({editFormIsOpen: false});
        this.setState({editFormButtonText:"Edit"})

    },

    toggleForm: function() {

    if (this.props.method=="edit") {
            var refSuffix = "_" + this.props.stepId;
        }
        else if (this.props.method=="create") {
            var refSuffix = "";
        }
        if (this.state.formSubmittedSuccessfully == true ){
            console.log(this.state.formSubmittedSuccessfully);
            this.setState({formSubmittedSuccessfully: false})

        }

        if (this.props.method=="edit") {
            $(this.refs["ref_stepForm" + refSuffix]).slideToggle();
            $(this.refs["ref_editButton" + refSuffix]).toggle();
            $(this.refs["ref_deleteButton" + refSuffix]).toggle();
            $(this.refs["ref_stepExistingInfo" + refSuffix]).slideToggle();
        } else if (this.props.method=="create") {
            $(this.refs["ref_stepForm"]).slideToggle();
        }
    },

    showAndHideUIElements: function() {
        var frequencyValue = this.state.frequency;

        if (this.props.method=="edit") {
            var refSuffix = "_" + this.props.stepId;
        }

        else if (this.props.method=="create") {
            var refSuffix = "";
        }
        if (frequencyValue == "WEEKLY") {
            $(this.refs['ref_whichDays' + refSuffix]).show();
            $(this.refs['ref_whichDate' + refSuffix]).hide();
            $(this.refs['ref_dateSet' + refSuffix]).show();
            $(this.refs['ref_date' + refSuffix]).hide();



        } else if (frequencyValue == "ONCE") {
            $(this.refs['ref_whichDays' + refSuffix]).hide();
            $(this.refs['ref_whichDate' + refSuffix]).hide();
            $(this.refs['ref_dateSet' + refSuffix]).hide();
            $(this.refs['ref_date' + refSuffix]).show();


        } else if (frequencyValue == "MONTHLY") {
            $(this.refs['ref_whichDays' + refSuffix]).hide();
            $(this.refs['ref_whichDate' + refSuffix]).show();
            $(this.refs['ref_dateSet' + refSuffix]).show();
            $(this.refs['ref_date' + refSuffix]).hide();


        } else if (frequencyValue == "DAILY") {
            $(this.refs['ref_whichDays' + refSuffix]).hide();
            $(this.refs['ref_whichDate' + refSuffix]).hide();
            $(this.refs['ref_dateSet' + refSuffix]).show();
            $(this.refs['ref_date' + refSuffix]).hide();


        }
    },

    handleFrequencyChange: function(e) {
        this.setState({frequency: e.target.value});


    },


    handleTitleChange: function(value) {
        //if (validator.isEmail(e.target.value)) {
        //} else {
            this.setState({title: value});

        //}
    },

    handleDescriptionChange: function(value) {
        this.setState({description: value});
    },

   handleStartDateChange: function(date) {
        this.setState({startDate: date});
  },
    handleEndDateChange: function(date) {
        this.setState({endDate: date});
  },


    handleAbsoluteStartDateChange: function(date) {
        this.setState({absoluteStartDate: date});
  },
    handleAbsoluteEndDateChange: function(date) {
        this.setState({absoluteEndDate: date});
  },
    setTitle: function(stateValueFromChild) {
        this.state.title = stateValueFromChild;
    },


    handleEditorChange: function(e) {
        this.setState({description: e});
  },

    handleDay01Change: function(e) {
        this.setState({day01: e.target.value});
    },

    handleDay02Change: function(e) {
        this.setState({day02: e.target.value});
    },

    handleDay03Change: function(e) {
        this.setState({day03: e.target.value});
    },

    handleDay04Change: function(e) {
        this.setState({day04: e.target.value});
    },

    handleDay05Change: function(e) {

        this.setState({day05: e.target.value});
    },

    handleDay06Change: function(e) {

        this.setState({day06: e.target.value});
    },

    handleDay07Change: function(e) {

        this.setState({day07: e.target.value});
    },


    handleStartTimeChange: function(e) {

        this.setState({startTime:e.target.value});
    },
    handleDurationChange: function(e) {

        this.setState({duration: e.target.value});
    },

    handleDurationMetricChange: function(e) {
        this.setState({durationMetric: e.target.value});
    },

    handleMonthlyDatesChange: function(e) {
        this.setState({monthlyDates: e.target.value});
    },


    deleteStep: function() {
        if (this.props.stepMethod=="edit") {
            $(this.refs["ref_step"]).slideToggle();

            $.ajax({
                url: (theServer + "api/steps/" + this.state.id + "/"),
                dataType: 'json',
                type: 'DELETE',
                //data: step,
                success: function () {

                },
                error: function (xhr, status, err) {
                    console.error("https://127.0.0.1:8000/api/steps/" + this.state.id + "/", status, err.toString());
                }
            });
        }


    },
     clearPage: function(plan_id) {
        $(".fullPageDiv").slideToggle("slow", function () {
        hashHistory.push('/plans/' + this.props.stepId + '/steps')
            });

    },

    closeWindowButtonClicked: function() {
        this.getInitialState();
        $(this.refs["ref_step"]).slideUp();

    },


    componentDidUpdate(){
        if (this.props.method=="edit") {
            var refSuffix = "_" + this.props.stepId;
        }
        else if (this.props.method=="create") {
            var refSuffix = "";
        }
        let selectNode = $(this.refs["ref_frequency" + refSuffix]);
        selectNode.value = this.state.frequency;
                this.showAndHideUIElements();

    },

    render: function () {

        var planScheduleMetric = "Week";


        //if (this.state.formSubmittedSuccessfully == true ){
        //    this.toggleForm();

        //}
                let renderUpdatesList=React.createElement("");


        if (this.props.method=="edit") {
            var refSuffix = "_" + this.props.stepId;
            renderUpdatesList = React.createElement(<UpdatesList stepId={this.props.stepId}/>);


        }
        else if (this.props.method=="create") {
            var refSuffix = "";
        }

        if (this.state.editFormIsOpen) {

            //$(this.refs["ref_stepForm" + refSuffix]).slideDown();
            //$(this.refs["ref_stepExistingInfo" + refSuffix]).slideUp();

        }
        else {
            //$(this.refs["ref_stepForm" + refSuffix]).slideUp();
            //$(this.refs["ref_stepExistingInfo" + refSuffix]).slideDown();
        }
        return (
            <div ref='ref_step' key={refSuffix} >


                        <div ref="ref_createMenuBar" className="ui top attached purple large button" >
                            <div  className="ui grid">

                            <div className="left aligned eleven wide column">Step</div>
                                <div className="ui two wide column small smallPadding middle aligned" >&nbsp;</div>

                            <div ref={`ref_cancelButton`} className="ui two wide column small smallPadding middle aligned purple-inverted button"  onClick={this.cancelButtonClicked} >Cancel</div>
                                <div className="ui closeWindow" onClick={this.closeWindowButtonClicked}><i className="remove icon"></i></div>


                                </div>
                            </div>
                        <div ref="ref_editMenuBar"  className="ui top attached purple large button" >

                            <div className="ui grid">

                            <div className="left aligned eleven wide column">Step</div>
                            <div ref={`ref_editButton${refSuffix}`} className="ui two wide column small smallPadding middle aligned purple-inverted button"  onClick={this.editButtonClicked} >{this.state.editFormButtonText}</div>
                            <div ref={`ref_deleteButton${refSuffix}`} className="ui two wide column  small smallPadding middle aligned purple-inverted button"  onClick={this.deleteStep} >Delete</div>
                                <div className="ui closeWindow" onClick={this.closeWindowButtonClicked}><i className="remove icon"></i></div>


                                </div></div>
                    <div className="ui segment noBottomMargin noTopMargin">

<div ref="ref_stepExistingInfo">
                            <div className="row">
                                <h3>{this.state.title}</h3>
                            </div>
                            <div className="fluid row">Length: {this.state.durationMetric}</div>
                            <div className="fluid row" dangerouslySetInnerHTML={{__html: this.state.description}}/>

                        <div className="two wide column"><Link to={`/plans/${this.props.planId}/steps`}>

</Link></div>
                    </div>
                    <div className="sixteen wide row">

                    <div>

            <div ref="ref_stepForm"  className="ui form">
                <form onSubmit={this.handleSubmit}>

                    <div className="ui grid">

                    <div className="ui row">
                            <div className="ten wide column">
                                <input type="hidden" name="plan" id="id_plan" value={this.props.planId}/>

                                <ValidatedInput
                                        type="text"
                                        name="title"
                                        label="Title"
                                        id="id_title"
                                        value={this.state.title}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleTitleChange}

                                    />


                            </div>
                        <div className="six wide column">&nbsp;</div>

                        </div>

                        <div className="ui row">
                            <div className="ten wide column">
                                <div className="field fluid">
                                    <label htmlFor="id_description">Description:</label>

                                    <TinyMCEInput name="description" id="id_description"
                                            value={this.state.description}
                                            tinymceConfig={{
                                              plugins: 'link image code media',
                                              menubar: "insert",
                                              toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | media'
                                            }}
                                            onChange={this.handleEditorChange}
                                          />


                            </div>
                        </div>
                            <div className="six wide column">&nbsp;</div>

                                        </div>


                        <div className="ui row">
                            <div className="three wide column">
                                <div className="field">
                                            <label htmlFor="id_frequency">Repeat?:</label>
                                            <select ref={`ref_frequency${refSuffix}`} id="id_frequency" name="frequency" value={this.state.frequency} onChange={this.handleFrequencyChange}>
                                                <option value="ONCE">Don't repeat</option>
                                                <option value="DAILY">Daily</option>
                                                <option value="WEEKLY">Weekly</option>
                                                <option value="MONTHLY">Monthly</option>
                                            </select>
                                        </div>
                            </div>
                        </div>

                         <div ref={`ref_dateSet${refSuffix}`} className="ui row">
                                    <div className="three wide column">
                                        <div className="field">
                                            <label htmlFor="id_absoluteStartDate">Start Date:</label>

                                            <DatePicker selected={this.state.absoluteStartDate} onChange={this.handleAbsoluteStartDateChange} />
                                            </div>
                                        </div>
                                    <div className="three wide column">
                                        <div className="field">
                                            <label htmlFor="id_absoluteEndDate">End Date:</label>

                                            <DatePicker selected={this.state.absoluteEndDate} onChange={this.handleAbsoluteEndDateChange} />
                                            </div>
                                        </div>
                                    </div>
                                <div ref={`ref_date${refSuffix}`} className="ui row">
                                    <div className="four wide column">
                                        <div className="field">
                                            <label htmlFor="id_absoluteStartDate">Date:</label>

                                            <DatePicker selected={this.state.absoluteStartDate} onChange={this.handleAbsoluteStartDateChange} />
                                            </div>
                                        </div>
                                    </div>
                        <div className="ui row">
                            <div className="three wide column">
                                <div className="field">
                                    <label htmlFor="id_startTime">Start Time:</label>
                                     <TimeInput value={this.state.startTime} className="ui small input" name="startTime" id="id_startTimeNumber"
                                               onChange={this.handleStartTimeChange}/>
                                </div>
                            </div>
                            <div className="two wide column">
                                <div className="field">
                                    <label>&nbsp;</label>

                                    <select className="ui massive input middle aligned" name="amOrPm" id="id_amOrPm"
                                            onChange={this.handleStartTimeChange}>
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </select>
                                </div>
                            </div>
                            <div className="two wide column">
                                <div className="field">
                                    <label htmlFor="id_duration">For how long:</label>

                                    <input value={this.state.duration} className="ui mini input" name="duration" id="id_duration"
                                           onChange={this.handleDurationChange}/>
                                </div>
                                                            </div>

                                <div className="three wide column">
                                    <div className="field">
                                        <label>&nbsp;</label>

                                        <select className="ui massive input middle aligned" value={this.state.durationMetric} name="durationMetric" id="id_durationMetric"
                                                onChange={this.handleDurationMetricChange}>

                                            <option value="MINUTES">Minutes</option>
                                            <option value="HOURS">Hours</option>
                                        </select>
                                    </div>
                                </div>


                            </div>
                        <div ref={`ref_whichDays${refSuffix}`} className="ui row">

                            <div className="ten wide column">
                                <div className="field fluid">
                                    <label>Select which days to schedule each week (based on
                                        a Monday start):</label>

                                    <div className="ui equal width  buttons ">
                                        <ToggleButton id="id_day01" label="M" value={this.state.day01} callback={this.handleDay01Change} />
                                        <ToggleButton id="id_day02" label="T" value={this.state.day02} callback={this.handleDay02Change} />
                                        <ToggleButton id="id_day03" label="W" value={this.state.day03} callback={this.handleDay03Change} />
                                        <ToggleButton id="id_day04" label="Th" value={this.state.day04} callback={this.handleDay04Change} />
                                        <ToggleButton id="id_day05" label="F" value={this.state.day05} callback={this.handleDay05Change} />
                                        <ToggleButton id="id_day06" label="Sa" value={this.state.day06} callback={this.handleDay06Change} />
                                        <ToggleButton id="id_day07" label="Su" value={this.state.day07} callback={this.handleDay07Change} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div ref={`ref_whichDate${refSuffix}`} className="ui row">

                            <div className="six wide column">

                                <div className="field fluid">

                                    <label htmlFor="id_monthlyDates">What date(s) in a month would you like this to occur
                                        (1-30)?</label>
                                    <input type="text" name="monthlyDates" id="id_monthlyDates" value={this.state.monthlyDates} onChange={this.handleMonthlyDatesChange}/>

                                </div>

                            </div>
                        </div>


                        </div>




                    <div className="ui three column grid">
                                            <div className="ui row">&nbsp;</div>

                        <div className="ui row">
                            <div className="ui column">&nbsp;</div>

                            <div className="ui column"><a className="ui fluid button" onClick={this.closeForm}>Cancel</a></div>
                            <div className="ui column">
                                <button type="submit" className="ui primary fluid button">Save</button>
                            </div>
                            <div className="ui row">&nbsp;</div>
                        </div>
                    </div>

                </form >

            </div>
                        </div>
                </div>

                        </div>


                        </div>

        )
    }


});

var ToggleButton = React.createClass({
    componentDidMount: function() {
        var self = this;
    },

    getInitialState: function() {
        return { checked: this.props.value };
    },

    handleChange: function(e) {
        var currentState = this.state.checked;

        if (currentState == "true") {
            this.setState({ checked: "false"});
        } else {
            this.setState({ checked: "true"});

        }
    },


  render: function () {
    var btnClass = 'ui toggle button';
    if (this.state.checked == "true") btnClass += ' active';
    return <button className={btnClass}  onClick={this.handleChange}>{this.props.label}</button>;
  }
});

export class PlanCalendar2 extends React.Component{
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            events:[],
            stepMethod:"",
            currentStepData:"",
            modalIsOpen: false,
        }
    }


    getPlanStartDate = () => {
        $.ajax({
          url: theServer + "api/plans/" + this.props.planId + "/",
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  planStartDate:data.startDate,

              })


          }.bind(this),
          error: function(xhr, status, err) {
            console.error(theServer + "api/plans/" + this.props.planId + "/", status, err.toString());
          }.bind(this)
        });
      }

      componentWillReceiveProps = (nextProps) => {
          if (this.state.events != nextProps.events) {
              this.setState({
                  events:nextProps.events
              })
          }
      }


    componentDidMount = () => {
        var self = this;
        $(this.refs["ref_create"]).hide();
        $(this.refs["ref_edit"]).hide();
        this.getPlanStartDate()

    }


    selectEvent = () => {
        this.setState({
            stepMethod: "edit",
            currentStepData: event,
        },
            () => this.showEdit())

    }

    createEvent = (slotInfo) => {
        this.setState({
            eventInfo:slotInfo,
                stepMethod: "create",


        },
            () => this.showCreate())
    }

    showCreate = () => {
                $(this.refs["ref_edit"]).hide()
        $(this.refs["ref_create"]).slideDown()
    }

    showEdit = () => {
        $(this.refs["ref_create"]).hide()
        $(this.refs["ref_edit"]).slideDown()
    }

    handleStepEditCloseWindowClick = (toDisplay) => {
                    $(this.refs["ref_edit"]).slideUp()

        if (!toDisplay.display) {
            $(this.refs["ref_edit"]).slideUp()

        }
    }

    handleStepCloseWindowClick = (toDisplay) => {
            $(this.refs["ref_create"]).slideUp()

        if (!toDisplay.display) {
            $(this.refs["ref_create"]).slideUp()


        }
    }







    handleFormSubmit = (step, callback) => {
        if (this.state.stepMethod == 'edit') {
            $.ajax({
                url: (theServer + "api/steps/" + step.id + "/"),
                dataType: 'json',
                type: 'PATCH',
                data: step,
                success: callback,
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        }
        else if (this.state.stepMethod=='create') {
            $.ajax({
                url: (theServer + "api/steps/"),
                dataType: 'json',
                type: 'POST',
                data: step,
                success: callback,
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });

        }
  }


    render = () => {
        return (
            <div>

                <div className="ui row">&nbsp;</div>
                <div ref="ref_edit">

                    <StepEditCalendarComponent
                planStartDate={this.state.planStartDate}
                planId={this.props.planId}
                stepData={this.state.currentStepData}
                onFormSubmit={this.handleFormSubmit}
                method="edit"
                methodChange={this.handleStepEditCloseWindowClick}
            />
            </div>
                <div ref="ref_create">
                <StepCalendarComponent
                    planStartDate={this.state.planStartDate}
                    planId={this.props.planId}
                    eventInfo={this.state.eventInfo}
                    onFormSubmit={this.handleFormSubmit}
                    stepMethod="create"
                    methodChange={this.handleStepCloseWindowClick}

            /></div>


                <div className="ui row">&nbsp;</div>

                <div className="calendarContainer">

                    <BigCalendar
                        className="calendarPadding"
                        popup
                        selectable
                        events={this.state.events}
                        startAccessor='absoluteStartDate'
                        endAccessor='absoluteEndDate'
                        step={30}
                        timeslots={4}
                        formats={formats}
                        onSelectEvent={event => this.selectEvent(event)}
                        onSelectSlot={(slotInfo) => this.createEvent(slotInfo)}
                        views={"month", {"week", "day", "agenda"}
                    />

                </div>

                                </div>


        )
    }
}

var PlanCalendar3 = React.createClass({

    getPlanStartDate: function () {
        $.ajax({
          url: theServer + "api/plans/" + this.props.planId + "/",
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  planStartDate:data.startDate,

              })


          }.bind(this),
          error: function(xhr, status, err) {
            console.error("https://127.0.0.1:8000/api/plans/" + this.props.planId + "/", status, err.toString());
          }.bind(this)
        });
      },


    componentDidMount: function() {
        var self = this;
        $(this.refs["ref_create"]).hide();
        $(this.refs["ref_edit"]).hide();
        this.getPlanStartDate()

    },

    getInitialState: function() {
        return ({
            events:[],
            stepMethod:"",
            currentStepData:"",
            modalIsOpen: false,
        })
    },

    selectEvent:function (event) {
        this.setState({
            stepMethod: "edit",
            currentStepData: event,
        },
            () => this.showEdit())

    },

    createEvent: function(slotInfo) {
        this.setState({
            eventInfo:slotInfo,
                stepMethod: "create",


        },
            () => this.showCreate())
    },

    showCreate: function () {
                $(this.refs["ref_edit"]).hide()
        $(this.refs["ref_create"]).slideDown()
    },

    showEdit: function () {
        $(this.refs["ref_create"]).hide()
        $(this.refs["ref_edit"]).slideDown()
    },

    handleStepEditCloseWindowClick: function (toDisplay) {
                    $(this.refs["ref_edit"]).slideUp()

        if (!toDisplay.display) {
            $(this.refs["ref_edit"]).slideUp()

        }
    },

    handleStepCloseWindowClick: function (toDisplay) {
            $(this.refs["ref_create"]).slideUp()

        if (!toDisplay.display) {
            $(this.refs["ref_create"]).slideUp()


        }
    },







    handleFormSubmit: function(step, callback) {
        if (this.state.stepMethod == 'edit') {
            $.ajax({
                url: (theServer + "api/steps/" + step.id + "/"),
                dataType: 'json',
                type: 'PATCH',
                data: step,
                success: callback,
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });
        }
        else if (this.state.stepMethod=='create') {
            $.ajax({
                url: (theServer + "api/steps/"),
                dataType: 'json',
                type: 'POST',
                data: step,
                success: callback,
                error: function (xhr, status, err) {
                    console.error(this.props.url, status, err.toString());
                }.bind(this)
            });

        }
  },


    render: function() {
        return (
            <div>

                <div className="ui row">&nbsp;</div>
                <div ref="ref_edit">

                    <StepEditCalendarComponent
                planStartDate={this.state.planStartDate}
                planId={this.props.planId}
                stepData={this.state.currentStepData}
                onFormSubmit={this.handleFormSubmit}
                method="edit"
                methodChange={this.handleStepEditCloseWindowClick}
            />
            </div>
                <div ref="ref_create">
                <StepCalendarComponent
                    planStartDate={this.state.planStartDate}
                    planId={this.props.planId}
                    eventInfo={this.state.eventInfo}
                    onFormSubmit={this.handleFormSubmit}
                    stepMethod="create"
                    methodChange={this.handleStepCloseWindowClick}

            /></div>


                <div className="ui row">&nbsp;</div>

                <div className="calendarContainer">

                    <BigCalendar
                        className="calendarPadding"
                        popup
                        selectable
                        events={this.props.events}
                        startAccessor='absoluteStartDate'
                        endAccessor='absoluteEndDate'
                        step={30}
                        timeslots={4}
                        formats={formats}
                        onSelectEvent={event => this.selectEvent(event)}
                        onSelectSlot={(slotInfo) => this.createEvent(slotInfo)}
                    />

                </div>

                                </div>


        )
    }
})

var UpdatesList2 = React.createClass({
    componentDidMount: function() {
        var self = this;

        self.loadObjectsFromServer();

      //var intervalID = setInterval(this.loadObjectsFromServer, 2000);
        //this.setState({intervalID:intervalID});

    },

    componentWillUnmount: function() {
   // use intervalId from the state to clear the interval
   //clearInterval(this.state.intervalId);
    },



    getInitialState: function() {
        return {
            data: [],
        modalIsOpen: false,
        };

    },

    handleFormSubmit: function (update, callback) {
        if (this.props.updateId) {
            var theUrl = theServer + "api/updates/" + this.props.updateId + "/";
            var theType = 'PATCH';

        }
        else {
            var theUrl = theServer + "api/updates/";
            var theType = 'POST';
        }
        $.ajax({
            url: theUrl,
            dataType: 'json',
            type: theType,
            data: update,
            success: callback,
            error: function (xhr, status, err) {
                console.error(theURL, status, err.toString());
            }.bind(this)
        });
    },

    loadObjectsFromServer: function () {
        console.log("update loadObjectsFromServer " + theServer)
        $.ajax({
          url: theServer + "api/steps/" + this.props.stepId + "/updates",
          dataType: 'json',
          cache: false,
          success: function(data) {

          }.bind(this),
          error: function(xhr, status, err) {
            console.error(theServer + "api/steps/" + this.props.stepId + "/updates", status, err.toString());
          }.bind(this)
        });
      },




    render: function() {

    if (this.state.data) {
        var objectNodes = this.state.data.map(function (objectData) {

            return (
                <UpdateItem ref={`ref_update_${objectData.id}`} key={objectData.id} updateData={objectData} stepId={this.props.stepId} onFormSubmit={this.handleFormSubmit} />

            )
        }.bind(this));
    }
        return (
        <div className="ui grid">
            <div className="ui row">
                <div className="ui header eight wide column">Updates</div>
                <div className="four wide column">&nbsp;</div>
                <div className="four wide column">
                     <UpdateAddAndEditItemForm edit="false" stepId={this.props.stepId} onFormSubmit={this.handleFormSubmit} reloadItem={this.handleReloadItem} />

                </div>
                </div>

                {objectNodes}



        </div>

    )
    }
});

                    var UpdateFormAction = React.createClass({

    componentDidMount: function() {
        var self = this;
        console.log("this update" + this.props.update)


    },

    getInitialState: function() {
        return {data: []};

    },

    handleSubmit: function(e) {

        e.preventDefault();
        var metric = this.state.metric;
        var metricLabel = this.state.metricLabel;

        this.props.onFormSubmit({
            metric: metric,
            metricLabel: metricLabel
        },
            );
    },



    handleMetricChange: function(e) {

        this.setState({metric: e.target.value});
    },

    handleMetricLabelChange: function(e) {
        this.setState({metricLabel: e.target.value});
    },


    render: function() {
        console.log("inside render2 " + this.props.update);

        if (this.props.update) {

        return (
            <div className="ui row">
                <div className="six wide column">Update 1
                    <div  className="field fluid">
                            <MetricSelectButton name="metric" id="id_metric" initialValue={this.state.metric} />
                    </div>
                    <div  className="field fluid">
                        <ValidatedInput
                            type="text"
                            name="metricLabel"
                            label="Label for Metric:"
                            id="id_metricLabel"
                            value={this.state.metricLabel}
                            initialValue={this.state.metricLabel}
                            validators='"!isEmpty(str)"'
                            onChange={this.validate}
                            stateCallback={this.setMetricLabel}
                            />
                    </div>
                    </div>
                </div>
        );

    }
    else {
            return null;
        }
    }
});

var TimeInput = React.createClass({
  render() {
    return (
      <MaskedInput
          mask="11:11"
          placeholder="     "
          size="5"
          {...this.props}

          formatCharacters={{
              'W': {
                  validate(char) {
                      return /\w/.test(char)
                  },
                  transform(char) {
                      return char.toUpperCase()
                  }
              }
          }
          }
      />

    )
  }
});



export class ProgramHeader extends React.Component {

    constructor (props) {
        super(props)
        autobind(this)
        this.state = {
            data:[],
            editButtonText:"Edit",
            files:[],
            id:this.props.programId,
            image: "",
            title: "",
            description: "",
            startDate:moment(),
            scheduleLength:"3m",
            viewableBy: "ONLY_ME",
            timeCommitment: "1h",
            cost:"0.0",
            costFrequencyMetric: "MONTH",

        }
    }

    loadObjectsFromServer() {
        $.ajax({
          url: theServer + "api/programs/" + this.props.programId + "/",
          dataType: 'json',
          cache: false,
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
          success: function(data) {
              this.setState({
                  data:data,
                  id:this.props.programId,
                  image: data.image,
                  title: data.title,
                  description: data.description,
                  startDate:moment(data.startDate, "YYYY-MM-DD"),
                  scheduleLength:data.scheduleLength,
                  viewableBy: data.viewableBy,
                  timeCommitment: data.timeCommitment,
                  cost:data.cost,
                  costFrequencyMetric: data.costFrequencyMetric,
              })


          }.bind(this),
          error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
          }.bind(this)
        });


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

    handleScheduleLengthChange (value){
        this.setState({scheduleLength: value});
    }

    handleCostFrequencyMetricChange(value) {

            this.setState({costFrequencyMetric: value})
    }

    handleViewableByChange(value) {

            this.setState({viewableBy: value})
    }



    handleTimeCommitmentChange(selection){
        this.setState({timeCommitment: selection.value});
    }

    getDescriptionEditor = () =>  {
                if (this.state.description == null) {
                    return ("")
                } else {
                    return (<div className="ui row">
                        <div className="ten wide column">
                            <div className="field fluid">
                                <label htmlFor="id_description">Description:</label>
                                <TinyMCEInput name="description"
                                         value={this.state.description}
                                         config={{
          plugins: 'link image code media',
          menubar: "insert",
          toolbar: 'undo redo | bold italic | alignleft aligncenter alignright | code | media'
        }}
                                         onChange={this.handleEditorChange}
                                />


                            </div>
                        </div>
                        <div className="six wide column">&nbsp;</div>

                    </div>)
                }
            }



    getImageEditSection() {
        if (false) {
            var theImage = this.state.image
            var theFilename = theImage.replace("https://kiterope.s3.amazonaws.com:443/images/", "");

            return (
                <div className="ui row">

                    <div className="four wide column">
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

                    <div className="four wide column">
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




    handlePlanSubmit(e) {
        e.preventDefault();

        var title = this.state.title;
        var description = this.state.description;
        var viewableBy = this.state.viewableBy;
        var image = this.state.image;

        var scheduleLength = this.state.scheduleLength
        var startDate = moment(this.state.startDate).format("YYYY-MM-DD")
        var timeCommitment = this.state.timeCommitment
        var cost = this.state.cost;
        var costFrequencyMetric = this.state.costFrequencyMetric;

        this.props.onFormSubmit({
            id: this.props.planId,
            title: title,
            image: image,
            description: description,
            viewableBy: viewableBy,
            scheduleLength: scheduleLength,
            startDate: startDate,
            timeCommitment: timeCommitment,
            cost: cost,
            costFrequencyMetric: costFrequencyMetric,
        }, function (data) {
            this.loadObjectsFromServer()
            $(this.refs['ref_planForm']).slideUp();
            $(this.refs['ref_existingInfo_plan']).slideDown();
            this.setState({editButtonText:"Edit"})


        }.bind(this));
    }

    getForm = () => {
        var descriptionEditor = this.getDescriptionEditor()
    var imageEditSection = this.getImageEditSection()


          return (<div ref="ref_planForm" className="ui form">
                  <div>{this.props.planHeaderErrors}</div>
                <form onSubmit={this.handlePlanSubmit} >

                    <div className="ui grid">

                                    {imageEditSection}


                    <div className="ui row">
                            <div className="ten wide column">

                                 <ValidatedInput
                                        type="text"
                                        name="title"
                                        label="Title"
                                        id="id_title"
                                        value={this.state.title}
                                        initialValue={this.state.title}
                                        validators='"!isEmpty(str)"'
                                        onChange={this.validate}
                                        stateCallback={this.handleTitleChange}
                                    />

                            </div>
                        <div className="six wide column">&nbsp;</div>

                        </div>

                        {descriptionEditor}




                         <div  className="ui row">
                             <div className="three wide column">
                                        <div className="field"> <label htmlFor="id_lengthOfSchedule" >Length of Schedule:</label>

                             <Select value={this.state.scheduleLength}  onChange={this.handleScheduleLengthChange} name="scheduleLength" options={planScheduleLengths} />
                                            </div>
                                 </div>

                                    <div className="three wide column">
                                       <div className="field">

                                            <label className="tooltip" htmlFor="id_startDate">Start Date:<i className="info circle icon"></i>
                                                <span className="tooltiptext">A start date for your plan makes scheduling your plan's steps easier. Your users can choose whatever start date they would like.</span>
                                           </label>

                                            <DatePicker selected={this.state.startDate} onChange={this.handleStartDateChange} />
                                            </div>
                                        </div>
                                    <div className="three wide column">&nbsp;</div>
                                    </div>
                        <div  className="ui row">
                             <div className="three wide column">
                                        <div className="field"> <label htmlFor="timeCommitment" >Time Commitment:</label>

                             <Select value={this.state.timeCommitment}  onChange={this.handleTimeCommitmentChange} name="timeCommitment" options={timeCommitmentOptions} />
                                            </div>
                                 </div>


                                    <div className="six wide column">&nbsp;</div>
                                    </div>
                        <div  className="ui row">
                             <div className="three wide column">
                                        <div className="field">
                                            <label htmlFor="id_startDate" >Cost (in US dollars):</label>

                <CurrencyInput value={this.state.cost} onChange={this.handleCostChange}/>
                                            </div>
                                 </div>

                                    <div className="three wide column">
                                       <div className="field">

                                            <label htmlFor="id_costFrequencyMetric">Frequency:</label>
                             <Select value={this.state.costFrequencyMetric} onChange={this.handleCostFrequencyMeticChange} name="costFrequencyMetric" options={costFrequencyMetricOptions} />


                                            </div>
                                        </div>
                                    <div className="three wide column">&nbsp;

                                    </div>
                            </div>

<div className="ui row">
                            <div className="six wide column">
                                 <div className='field'>
                    <label>Who should be able to see this?:</label>

                                                 <Select value={this.state.viewableBy} onChange={this.handleViewableByChange} name="viewableBy" options={viewableByOptions} />



                  </div>
                            </div>
                        </div>



                        </div>




                    <div className="ui three column grid">
                                            <div className="ui row">&nbsp;</div>

                        <div className="ui row">
                            <div className="ui column">&nbsp;</div>

                            <div className="ui column"><a className="ui fluid button" onClick={this.cancelButtonClicked}>Cancel</a></div>
                            <div className="ui column">
                                <button type="submit" className="ui primary fluid button">Save</button>
                            </div>
                            <div className="ui row">&nbsp;</div>
                        </div>
                    </div>

                </form >

            </div>
          )

    }

    editButtonClicked() {
                if($(this.refs["ref_existingInfo_plan"]).is(":visible")) {
                    $(this.refs['ref_planForm']).slideDown();

                    $(this.refs['ref_existingInfo_plan']).slideUp();
                    this.setState({editButtonText:"Cancel"})
                }
                else {
                    $(this.refs['ref_planForm']).slideUp();

                    $(this.refs['ref_existingInfo_plan']).slideDown();
                                        this.setState({editButtonText:"Edit"})


                }



    }

    cancelButtonClicked(e) {
        e.preventDefault()
         $(this.refs['ref_planForm']).slideUp();

                    $(this.refs['ref_existingInfo_plan']).slideDown();
                                        this.setState({editButtonText:"Edit"})
    }



    componentDidMount() {
        this.loadObjectsFromServer();
        $(this.refs['ref_planForm']).hide();


      //var intervalID = setInterval(this.loadObjectsFromServer, 2000);
        //this.setState({intervalID:intervalID});

        var self = this;
    }

    componentWillUnmount() {
   // use intervalId from the state to clear the interval
   //clearInterval(this.state.intervalId);
}

    getImageSection = () => {

        if (this.state.image != null) {
            var theImageUrl = s3ImageUrl + this.state.image;
            return (<div className="two wide column">
                <img className="ui image"
                     src={theImageUrl}>
                </img>
            </div>)
        } else {
            return (
                <div className="two wide column">
                    <img className="ui image"
                         src='http://semantic-ui.com/images/avatar2/large/kristy.png'></img>
                </div>)
        }
    }

    render() {
        var myForm = this.getForm()
        var imageSection = this.getImageSection()

        return (

            <div>
                <div className="ui four wide column header"><h1>Plan</h1></div>
                <div className="ui top attached green button">
                    <div className="ui grid">

                        <div className="left aligned eleven wide column">Plan</div>
                        <div className="ui two wide column small smallPadding middle aligned">&nbsp;</div>

                        <div className="ui right floated two wide column">

                        <div ref="ref_editButton"
                             className="ui fluid small smallPadding right floated middle aligned raspberry-inverted button"
                             onClick={this.editButtonClicked}>{this.state.editButtonText}</div>
                        </div>


                    </div>
                </div>

                <div className="ui segment noTopMargin">
                    <div ref="ref_existingInfo_plan">
                        <div className="ui two column grid">
                            {imageSection}



                    <div className="fourteen wide column">
                        <div className="row">
                            <div className="sixteen wide column">
                                <h1>{this.state.data.title}</h1></div>
                        </div>


                        <div className="row">

                            <div className="sixteen wide column" dangerouslySetInnerHTML={{__html: this.state.description}}></div>


                        </div>
                        <div className="row">

                            <div className="sixteen wide column"> Start Date: {this.state.data.startDate}</div>


                        </div>
                    </div>
                    </div></div>

                    {myForm}
                    </div>
                </div>

            )
}
};



module.exports = StepCalendarComponent;

var showModal = function(){
  $(window).trigger('modal.visible');
};

var StepForm2 = forms.Form.extend({
        rowCssClass: 'field',

        title: forms.CharField(),
        description: forms.CharField({widget: forms.Textarea()}),
        frequency: forms.ChoiceField({choices:["ONCE": "Once", "DAILY": "Daily", "WEEKLY": "Weekly","MONTHLY": "Monthly"]}),

        day01:forms.BooleanField(),
        day02:forms.BooleanField(),
        day03:forms.BooleanField(),
        day04:forms.BooleanField(),
        day05:forms.BooleanField(),
        day06:forms.BooleanField(),
        day07:forms.BooleanField(),
        monthlyDates:forms.CharField(),
        startTime:forms.DateTimeField(),
        duration: forms.IntegerField(),
        durationMetric: forms.CharField(),



    })