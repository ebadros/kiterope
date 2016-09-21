var React = require('react')
var ReactDOM = require('react-dom')
var $  = require('jquery');
global.rsui = require('react-semantic-ui')
var forms = require('newforms')

$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
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

// tutorial20.js
var GoalBox = React.createClass({
  loadCommentsFromServer: function() {
    $.ajax({
      url: "http://127.0.0.1:8000/api/goals/",
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
      url: this.props.url,
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
        setInterval(this.loadCommentsFromServer, 2000);
        var self = this;
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
    makeTogglable: function(element) {
    $element = $(element);
        $element.hide();

  this.toggle = function() {
    $element.slideToggle();
  };
},
  render: function() {

    return (
        <div>
            <div className="spacer">&nbsp;</div>
            <div className="ui alert"></div>
                        <div className="ui grid">

            <div className="ui four wide column header"><h1>Goals</h1></div>
                    <div className="ui right floated four wide column">
                        <button className="ui right floated primary large fluid button" onClick={this.toggle}>Create Goal</button>
                    </div>
                        </div>
            <div ref={this.makeTogglable}><GoalForm onGoalSubmit={GoalBox.handleGoalSubmit} /></div>

                    <GoalList data={this.state.data} />
            </div>

    );
  }
});

// tutorial10.js
var GoalList = React.createClass({
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


                        <div className="column">
                            <div className="ui fluid card overlayedImageContainer">
                                <div className="image overlayedImage"><img src='http://semantic-ui.com/images/avatar2/large/kristy.png'></img>
                                    <div className="overlayText">I will help 1 million people achieve their goals by 2018</div>
                                </div>

                              <div className="extra content">
                                <a>
                                  <i className="user icon"></i>
                                  22 Friends
                                </a>
                              </div>
                                <div className="ui bottom attached button">
                                  <i className="add icon"></i>
                                  Select a Plan
                                </div>
                                <div className="ui bottom attached button">
                                  <i className="add icon"></i>
                                  Select a Pro
                                </div>

                            </div>

                </div>
      );
    });
    return (
      <div className="goalList">
          <div className='ui three column grid'>

        {goalNodes}
      </div>
          </div>
    );
  }
});


// tutorial19.js
var GoalForm = React.createClass({

    getInitialState: function() {
        return {title: '',  deadline: '', why: '', votes:0, image:'', description: '', viewableBy: 'Only me', };
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
    return (
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
                  <label>Deadline</label>

                    <input
                      type="text"
                      placeholder="Deadline"
                      value={this.state.deadline}
                      onChange={this.handleDeadlineChange}
                    />
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

                    <input
                      type="text"
                      placeholder="Image"
                      value={this.state.viewableBy}
                      onChange={this.handleViewableByChange}
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
              <div className='ui row'>
        <button className="ui button" type="submit">Create Goal</button>
                  </div>
      </form>
                    <div className="ui row">&nbsp;</div>

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



module.exports = GoalBox;
