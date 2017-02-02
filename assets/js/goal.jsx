var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
var Datetime = require('react-datetime');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'

import {Sidebar} from './base'
import autobind from 'class-autobind'
var Select = require('react-select');

var ValidatedInput = require('./app')
import DatePicker  from 'react-datepicker';
import moment from 'moment';
import {ImageUploader} from './base'


export const isThisReasonableOptions = [
        {value:null, label: ""},

    {value:true, label: "Yes, this is a realistic goal that challenges me."},
    {value:false, label: "This is not a realistic goal. I should rethink my goal."},
    ]

export const goalInAlignmentWithCoreValuesOptions = [
        {value:null, label: ""},

    {value:true, label: "Yes, this goal aligns with my core values."},
    {value:false, label: "No, this goal does not align with my core values. I should rethink my goal."},
    ]
$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
    }
});

var theServer = 'https://192.168.1.156:8000/'


var Goal = React.createClass({
  render: function() {
    return (
      <div className="goal">

        {this.props.children}
      </div>
    );
  }
});

// tutorial20.js
var GoalBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: theServer + "api/goals/",
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
        url: theServer + "api/goals/",
        dataType: 'json',
        type: 'POST',
        data: goal,
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
            <GoalForm onGoalSubmit={this.handleGoalSubmit} />

                    <GoalList data={this.state.data} />
            </div>
            </div>

    );
  }
});

// tutorial10.js
var GoalList = React.createClass({

    clearPage: function(goal_id) {
        $(".fullPageDiv").slideToggle("slow", function () {

                hashHistory.push('/goals/' + goal_id + '/plans')

            });


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

    var goalNodes = this.props.data.map (function(goal) {
        if (goal.image) {
            var goalImage = <img src={goal.image}/>

        } else {
            var goalImage = <div className="image" style={placeholderImageStyle}>{goal.title}</div>
        }
      return (


                        <div key={goal.id} className="column">
                            <div className="ui fluid card overlayedImageContainer">
                                <div className="image overlayedImage"><img src='http://semantic-ui.com/images/avatar2/large/kristy.png'></img>
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
                                <div className="ui bottom attached red button" >
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

export class UpdatedGoalForm extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)
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
        }
    }


    componentDidMount () {
        $(this.refs['id_whichGoalForm']).hide()
    }

    handleTitleChange(value) {
        this.setState({title: value});
    }

    handleDeadlineChange(value) {
        this.setState({deadline: value});
    }

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

    handleImageChange(e) {
        console.log("check handleImageChange method")
    }
    handleViewableByChange(e) {
        this.setState({viewableBy: e.target.value});
    }


    handleVotesChange(e) {
        this.setState({votes: e.target.value});
    }






    handleSubmit(e) {

        e.preventDefault();
        var title = this.state.title;
        var deadline = moment(this.state.deadline).format("YYYY-MM-DD");

        var description = this.state.description;
        var coreValues = this.state.coreValues;
        var goalInAlignmentWithCoreValues = this.state.goalInAlignmentWithCoreValues
        var obstacles = this.state.obstacles
        var isThisReasonable = this.state.isThisReasonable
        var metric = this.state.metric


        var why = this.state.why;
        var image = this.state.image;
        var viewableBy = this.state.viewableBy;

        this.props.onGoalSubmit({
            title: title,
            deadline: deadline,
            description: description,
            coreValues: coreValues,
            goalInAlignmentWithCoreValues:goalInAlignmentWithCoreValues,
            obstacles:obstacles,
            isThisReasonable: isThisReasonable,
            metric: metric,
            why: why,
            image: null,
            viewableBy: "ONLY_ME",
            coaches: [],
            updates: [],
            wasAchieved: false,
            plans: []});

        //this.props.onGoalSubmit({title: title, viewableBy:viewableBy, description: description});
        this.setState({
            title: "",
            deadline: "",
            description: "",
            coreValues: "",
            goalInAlignmentWithCoreValues:false,
            obstacles:"",
            isThisReasonable: false,
            metric: "",
            why: "",
            image: null,
            viewableBy: "ONLY_ME",
            user: null,
            coaches: [],
            updates: [],
            wasAchieved: false,
            plans: []});

        this.toggle();
    }

    render() {
        return(
            <div className="fullPageDiv">
                <div className="ui page container">
                    <div className="spacer">&nbsp;</div>
                    <div className="ui alert"></div>
                    <div className="ui three column stackable grid">
                                    <div className="column">&nbsp;</div>
                                    <div className="column">&nbsp;</div>
                                    <div className="column">
                                        <div className="ui row">
                                            <div className="">Not your first time creating a goal at Kiterope?</div>
                                        </div>
                                        <div className="ui row">

                                    <div className="ui large fluid purple button">Use Advanced Goal Entry</div></div>
                    </div>

                    </div>
                </div>

            <div>
                <div className="centered hugeType topPadding">Achieving a goal is hard work</div>

                <div className="ui page container">
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
                                <img width="50%" src="/static/images/goal.svg"></img>
                                </div>
                            <div className="column">
                                <img width="50%" src="/static/images/strategy.svg"></img>
                                </div>
                            <div className="column">
                                <img width="50%" src="/static/images/bar-chart.svg"></img>
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

                        <div className="column"><div className="ui fluid purple large button">Let's do it</div>
                        </div>
                        <div className="column">&nbsp;
                        </div>
                        <div className="column">&nbsp;
                        </div>
</div>
                    </div>
                        </div>
                        <form className="ui form" onSubmit={this.handleSubmit} >

                            <div className="ui page container">
                                <div className="ui row">
                                    <div className="centered hugeType topPadding">Create a goal that is SMART</div>
                                </div>
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
                                            <div className="ui row">
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
                                            />

                                            </div>
                                            <div className="ui row">
                                            <ImageUploader label="Select an image that will help motivate you." defaultImage="" />
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
                                    <div className="column"><div className="ui large fluid button">Cancel</div></div>
                                    <div className="column"><div className="ui large fluid blue button" onClick={this.handleSubmit} >Create Goal</div></div>
                                    </div>
                            </div>
                        </form>
            </div>
                <div className="splashPageSection"></div>
</div>







                    )
    }

}

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
    <div className="ui three column grid">

        <div className="ui column header"><h1>Goals</h1></div>
                    <div className="ui right floated column">
                        <button className="ui right floated primary large fluid button" onClick={this.toggle}>Create Goal</button>
                    </div>
                        </div>
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
                      <GoalForm onGoalSubmit={this.handleSubmit}/>
                  </div>
              </div>
          </div>
      </div>

    );
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

var showModal = function(){
  $(window).trigger('modal.visible');
};


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



module.exports = UpdatedGoalForm, GoalBox;
