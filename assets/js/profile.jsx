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
var moment = require('moment');
import { MessageWindowContainer } from './message'
require('react-datepicker/dist/react-datepicker.css');
import TinyMCE from 'react-tinymce';
import { ValidatedInput}  from './app'
import autobind from 'class-autobind'
import { ClippedImage, ChoiceModal , IconLabelCombo } from './elements'
import { ImageUploader, Breadcrumb, FormHeaderWithActionButton, ProfileViewEditDeleteItem, } from './base'
import { StandardSetOfComponents, ErrorReporter } from './accounts'

import { PlanForm, PlanList } from './plan'
import { Caller, CallManager } from './call'
import TinyMCEInput from 'react-tinymce-input';

import { theServer, s3IconUrl, formats, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, times, durations, } from './constants'

import { OTSession, OTPublisher, OTStreams, OTSubscriber, createSession } from 'opentok-react';



function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}


export class ProfileListPage extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            data: [],
            activePage:1,
            serverErrors:"",
            formIsOpen:false,
            headerActionButtonLabel:"Add Profile"


        }
    }

    handleError = (theError) => {
        this.setState({
            error:theError,
        })

    }



  loadProfilesFromServer = () => {

      if (this.props.myContacts) {

          if (this.state.activePage != 1) {
              var theUrl = theServer + "api/contacts/?page=" + this.state.activePage
          } else {
              var theUrl = theServer + "api/contacts/"
          }
      } else {
          if (this.state.activePage != 1) {
              var theUrl = theServer + "api/profiles/?page=" + this.state.activePage
          } else {
              var theUrl = theServer + "api/profiles/"
          }
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
          console.log(data.results)
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(theUrl, status, err.toString());

      }.bind(this),

    });
  }

  handleGoalSubmit (goal) {
    $.ajax({
        url: theServer + "api/profiles/",
        dataType: 'json',
        type: 'POST',
        data: goal,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
        success: function(data) {
            this.loadProfilesFromServer()
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
                    $(this.refs['ref_whichProfileForm']).slideUp();

                }
            }.bind(this)
    });
  }
handleToggleForm = () => {
        $(this.refs['ref_whichProfileForm']).slideToggle()
    }

    componentDidMount() {
        this.loadProfilesFromServer();
        //var intervalID = setInterval(this.loadCommentsFromServer, 2000);
        //this.setState({intervalID: intervalID});
        var self = this;
        $(this.refs['ref_whichProfileForm']).hide();


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
        this.setState({activePage: pageNumber}, () => this.loadProfilesFromServer());

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
        }, () => {$(this.refs['ref_whichProfileForm']).slideDown()} )


    }
    handleReloadItem = () => {
        this.loadStepsFromServer()
    }
handleCancelClicked = () => {
      $(this.refs['ref_whichProfileForm']).slideUp()
      this.setState({
          formIsOpen:false,
          headerActionButtonLabel: "Create Profile"
      })

  }


  handleCloseForm = () => {
        this.setState({
            headerActionButtonLabel: "Create Profile",
            formIsOpen:false,
        }, () => $(this.refs['ref_whichProfileForm']).slideUp())

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
        $(this.refs['ref_whichProfileForm']).slideToggle()
    }

  render() {
      var pagination = this.getPagination()

    return (

<div>               <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen} />





        <div className="fullPageDiv">
            <div className="ui page container">


            <div className="spacer">&nbsp;</div>
            <div className="ui large breadcrumb">
                <Link to={`/#`}><div className="section">Home</div></Link>

                  <i className="right chevron icon divider"></i>
                  <Link to={`/#`}><div className="active section">Users</div></Link>
            </div>
            <div>&nbsp;</div>
                <FormHeaderWithActionButton actionClick={this.handleActionClick} headerLabel="Users" color="blue" buttonLabel={this.state.headerActionButtonLabel} toggleForm={this.handleToggleForm}/>
        <div ref="ref_whichProfileForm">
            <ProfileForm cancelClicked={this.handleCancelClicked} onProfileSubmit={this.handleProgileSubmit} serverErrors={this.state.serverErrors} />
            </div>

                    <ProfileList data={this.state.data} />
                <div className="spacer">&nbsp;</div>
                {pagination}
            </div>
            </div>
</div>
    );
  }
}
export class ProfileForm extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
           files:[],
            id:"",
            firstName: "",
            lastName: "",
            bio: "",
            zipCode: "",
            notificationChannel:"",
            editable:false,
            data:"",
        }
    }


    componentDidMount () {
        $(this.refs['id_whichGoalForm']).hide()
        this.checkIfUser()
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.data != nextProps.data) {
            if (nextProps.data != undefined) {
            this.setState({
                id: nextProps.data.id,
                firstName: nextProps.data.firstName,
                lastName: nextProps.data.lastName,
                bio: nextProps.data.bio,
                zipCode: nextProps.data.zipCode,
                profilePhoto: nextProps.data.profilePhoto,
                notificationChannel: nextProps.data.notificationChannel,

            })
            }



        }

    }

    handleFirstNameChange(value)   {
        this.setState({firstName: value});
  }

    handleLastNameChange(value)   {
        this.setState({lastName: value});
  }

  handleZipCodeChange(value)   {
        this.setState({zipCode: value});
  }


    handleEditorChange(e)  {

        this.setState({bio: e});
  }



    handleViewableByChange(value) {

            this.setState({viewableBy: value})
    }


    getDescriptionEditor () {
         if (this.props.isListNode) {
                var wideColumnWidth = "sixteen wide column"
            var mediumColumnWidth = "sixteen wide column"
            var smallColumnWidth = "eight wide column"

            } else {


            var wideColumnWidth = "ten wide column"
            var mediumColumnWidth = "four wide column"
            var smallColumnWidth = "three wide column"
        }
                if (this.state.bio == null) {
                    return ("")
                } else {
                    return (<div className="ui row">
                        <div className={wideColumnWidth}>
                            <div className="field fluid">
                                <label htmlFor="id_description">Bio:</label>
                                <TinyMCEInput name="bio"
                                         value={this.state.bio}
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

        if (this.props.isListNode) {
                var wideColumnWidth = "sixteen wide column"
            var mediumColumnWidth = "sixteen wide column"
            var smallColumnWidth = "eight wide column"

            } else {


            var wideColumnWidth = "ten wide column"
            var mediumColumnWidth = "four wide column"
            var smallColumnWidth = "three wide column"
        }
            var theImage = s3ImageUrl + this.state.profilePhoto
            var theFilename = theImage.replace("https://kiterope.s3.amazonaws.com/", "");

            return (
                <div className="ui row">

                    <div className={mediumColumnWidth}>
                       <ImageUploader imageReturned={this.handleImageChange}
                                       label="Select an image that will help motivate you." defaultImage={imageUrl}/>
                    </div>
                </div>
            )

        }


    handleFinishedUpload (value) {
            var fullUrl = value.signedUrl;
            var urlForDatabase = fullUrl.split("?")[0];
            urlForDatabase = urlForDatabase.replace(s3ImageUrl, "");
            this.setState({profilePhoto: urlForDatabase});
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

    handleImageChange = (callbackData) => {
        this.setState({
            profilePhoto: callbackData.image
        })
    }

    resetForm = () => {
        this.setState({
                firstName: "",
            lastName: "",
            bio: "",
            zipCode: "",
            editable:false,
            data:"",
            image:null,
            notificationChannel:""
            })

    }

    handleSubmit(e) {
        e.preventDefault();
        this.checkIfUser()

if (this.state.user) {
        var id = this.state.id
        var firstName = this.state.firstName;
        var lastName = this.state.lastName;
        var zipCode = this.state.zipCode;
        var profilePhoto = this.state.profilePhoto;
        var bio = this.state.bio;
    var notificationChannel = this.state.notificationChannel



        this.props.onSubmit({
            id: id,
            firstName: firstName,
            lastName: lastName,
            zipCode: zipCode,
            bio: bio,
            profilePhoto: profilePhoto,
            notificationChannel: notificationChannel


        }, this.resetForm)




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
                var buttonText = "Save"

            } else {
                var buttonText = "Create"
            }

            var imageUrl = s3ImageUrl + this.state.profilePhoto

            var descriptionEditor = this.getDescriptionEditor()

            if (this.props.isListNode) {
                var wideColumnWidth = "sixteen wide column"
            var mediumColumnWidth = "sixteen wide column"
            var smallColumnWidth = "eight wide column"

            } else {


            var wideColumnWidth = "ten wide column"
            var mediumColumnWidth = "four wide column"
            var smallColumnWidth = "three wide column"
        }
          return (
              <div className="ui page container">
                  <div>{this.props.planHeaderErrors}</div>
                  <div className="ui row">&nbsp;</div>


                      <div className="ui three column grid">

                          <ImageUploader imageReturned={this.handleImageChange}
                                         label="Select an image that will help motivate you." defaultImage={imageUrl}/>


                          <div className="ui row">
                              <div className={wideColumnWidth}>

                                  <ValidatedInput
                                      type="text"
                                      name="firstName"
                                      label="First Name"
                                      id="id_firstName"
                                      placeholder="First Name"
                                      value={this.state.firstName}
                                      initialValue={this.state.firstName}
                                      validators='"!isEmpty(str)"'
                                      onChange={this.validate}
                                      stateCallback={this.handleFirstNameChange}

                                  />
                                  <ValidatedInput
                                      type="text"
                                      name="lastName"
                                      label="Last Name"
                                      id="id_lastName"
                                      placeholder="Last Name"
                                      value={this.state.lastName}
                                      initialValue={this.state.lastName}
                                      validators='"!isEmpty(str)"'
                                      onChange={this.validate}
                                      stateCallback={this.handleLastNameChange}

                                  />
 </div>
                              </div>


                          {descriptionEditor}


                          <div className="ui row">
                              <div className={smallColumnWidth}>
                                  <ValidatedInput
                                      type="text"
                                      name="zipCode"
                                      label="Zip Code"
                                      id="id_zipCode"
                                      placeholder="Zip Code"
                                      value={this.state.zipCode}
                                      initialValue={this.state.zipCode}
                                      validators='"!isEmpty(str)"'
                                      onChange={this.validate}
                                      stateCallback={this.handleZipCodeChange}

                                  />

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

export class ProfileViewAndEditPage extends React.Component {

    constructor (props) {
        super(props)
        autobind(this)
        this.state = {
            data: [],
        }
    }

    componentDidMount = () => {

        this.loadObjectsFromServer()

    }

    loadObjectsFromServer = () => {
        var theUrl = theServer + "api/myProfile"
        console.log(theUrl)
        $.ajax({
          url: theServer + "api/myProfile",
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  data: data.results[0],})

          }.bind(this),
          error: function(xhr, status, err) {
            console.error(theUrl, status, err.toString());
          }.bind(this)
        });
      }




    render() {
            return (
                <div className="fullPageDiv">
                    <div className="ui page container">
                    <div className="spacer">&nbsp;</div>
                    <div className="ui alert"></div>
                    <div className="ui large breadcrumb">
                         <Link to={`/`}><div className="section">Home</div></Link>
                            <i className="right chevron icon divider"></i>
                            <Link to="myProfile"><div className=" section">Profile</div></Link>

                    </div>
                    <div>&nbsp;</div>
                        <ProfileView data={this.state.data}/>



 </div>
                     </div>
            )}

}



export class ProfileViewPage extends React.Component {

    constructor (props) {
        super(props)
        autobind(this)
        this.state = {
            data: [],
        }
    }


    componentDidMount = () => {

        this.loadObjectsFromServer()

    }

    loadObjectsFromServer = () => {

        console.log("inside loadObjectsFromServer")
        var myUrl = theServer + "api/profiles/" + this.props.params.profile_id + "/"
        $.ajax({
          url: myUrl,
          dataType: 'json',
          cache: false,
          success: function(data) {
              this.setState({
                  data: data,
              })



          }.bind(this),
          error: function(xhr, status, err) {
            console.error(myUrl, status, err.toString());
          }.bind(this)
        });
      }

    render() {


            return (

                <div className="fullPageDiv">
                    <div className="ui page container">
                        <div className="spacer">&nbsp;</div>
                        <div className="ui alert"></div>
                        <div className="ui large breadcrumb">
                            <Link to={`/`}>
                                <div className="section">Home</div>
                            </Link>
                            <i className="right chevron icon divider"></i>
                                <div className=" section">Profile</div>

                        </div>
                        <div>&nbsp;</div>
                        <ProfileView data={this.state.data}/>

                    </div>
                </div>
            )
        }


}



export class ProfileDetailPage extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            data:[],
            editable:false,
            openModal:false,
            formIsOpen:false,
            headerActionButtonLabel: "Add Plan"
        }
    }



    loadDetailFromServer = () => {

        var theURL = theServer + "api/profiles/" + this.props.params.profile_id + "/"


    $.ajax({
      url: theURL,
      dataType: 'json',
      cache: false,
        headers: {
                'Authorization': 'Token ' + localStorage.token
            },
      success: function(data) {
        this.setState({
            data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(theURL, status, err.toString());
      }.bind(this),

    });
  }

  handleFormActionClick = () => {
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

}

    handleOpenModal = () => {
        this.setState({openModal:true})
        //$(this.refs['id_whichPlanForm']).slideToggle()
    }

    handleOpenForm = () => {;
        this.setState({
            openModal:false,
            headerActionButtonLabel: "Close Form",
            formIsOpen:true,
        }, () => {$(this.refs['id_whichPlanForm']).slideDown()} )


    }


    handleCloseForm = () => {
        this.setState({
            headerActionButtonLabel: "Add Plan",
            formIsOpen:false,
        }, $(this.refs['id_whichPlanForm']).slideUp())

    }

  determineOptions = () => {
            var theUrl = theServer + "api/profiles/" + this.props.params.profile_id + "/"
      $.ajax({
      url: theUrl,
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

          }}
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(theUrl, status, err.toString());
      }.bind(this),


    });
  }

  componentDidMount() {
    this.determineOptions()
      this.loadDetailFromServer()
      $(this.refs['id_whichPlanForm']).hide()


  }


  handleModalClick = (callbackData) => {
      switch(callbackData.action) {
          case ("existing"):
              hashHistory.push("/search")
              break;
          case ("create"):
              this.handleOpenForm()
              break;
          case ("kiterope"):
              hashHistory.push("/goalEntry")
              break;
      }
  }

    render () {

        return (
            <div>
                <ChoiceModal  click={this.handleModalClick} modalIsOpen={this.state.openModal} header="Add a plan" description="You can subscribe to a plan created by a coach, create your own plan, or let Kiterope create a plan for you." buttons={[
                            {text:"Use an existing plan", action:"existing", color:"purple"},
                            {text:"Create your own plan", action:"create", color:"" },
                            {text:"Have Kiterope build you a plan", action:"kiterope", color:""},
                        ]} />
                <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen}/>


                <div className="fullPageDiv">
                    <div className="ui page container footerAtBottom">
                        <div className="spacer">&nbsp;</div>

                         <Breadcrumb values={[
                                    {url:"/profiles/" + this.props.params.profile_id + "/plans/", label:"Profile Detail"},

                        ]}/>
                        <div>&nbsp;</div>
                        <ProfileViewEditDeleteItem isListNode={false}
                                                   showCloseButton={false}
                                                   apiUrl="api/profiles/"
                                                   id={this.props.params.profile_id}
                                                   data={this.state.data}
                                                   currentView="Basic"/>
                        <div>&nbsp;</div>
                        <div>&nbsp;</div>
                <FormHeaderWithActionButton formActionClick={this.handleFormActionClick} showingForm={this.state.formIsOpen} headerLabel="Plans" color="green" buttonLabel={this.state.headerActionButtonLabel} closeForm={this.handleCloseForm} openForm={this.handleOpenForm} openModal={this.handleOpenModal}/>
        <div ref="id_whichPlanForm">
            </div>



                    </div>
                </div>

            </div>

            )
    }
}

export class ProfileBasicView extends React.Component {
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

    goToDetail() {
        hashHistory.push("/profiles/" + this.state.data.id + "/")

}
    render() {
        if (this.props.isListNode) {
            return (
                <div onClick={this.goToDetail}>
                    <ClippedImage item="profile" src={s3ImageUrl + this.state.data.profilePhoto} />


                <div className="ui grid" >
                    <div className="sixteen wide column">

                        <div className="row">&nbsp;</div>
                        <div className="planTitle"> {this.state.data.firstName} {this.state.data.lastName} </div>




                    </div>
                    </div></div>

            )
        }
        else {
            return (
                <div className="ui grid">
                    <div className="two wide column">
                        <img className="ui circular image" src={s3ImageUrl + this.state.data.profilePhoto}></img>
                    </div>
                    <div className="eight wide column">
                        <div className="fluid row">
                            <h3>{this.state.data.firstName} {this.state.data.lastName} </h3>
                        </div>
                        <div className="fluid row" dangerouslySetInnerHTML={{__html: this.state.data.bio}}/>
                    </div>
                    <div className="right aligned six wide column">
                        <IconLabelCombo size="extramini" orientation="right" text="100% Success" icon="success" background="Light" link="/goalEntry" />
                                    <IconLabelCombo size="extramini" orientation="right" text={this.state.data.zipCode} icon="deadline" background="Light" link="/goalEntry" />
                                  </div>

                </div>

            )
        }

    }
}

export class ProfileItemMenu extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
     }

     handleClick = (callbackData) => {
         this.props.click(callbackData)
     }

     render () {
         var myStyle = { display: "block"}
         return(

                  <div className="ui simple dropdown item" >
                      <div className="ui extramini image controlButtonMargin">
                      <img src={`${s3IconUrl}menuDark.svg`} /></div>
                      <div className="menu">

                          <div className="ui item">
                              <IconLabelCombo size="extramini" orientation="left" text="Add as Coach" icon="goal" background="Light" click={this.handleClick} />
                              </div>
                          <div className="ui item">
                            <IconLabelCombo size="extramini" orientation="left" text="Add as Client" icon="step" background="Light" click={this.handleClick} />
                            </div>

                      </div>
                  </div>


         )
     }

}

export class ProfileView extends React.Component {
    constructor (props) {
        super(props)
        autobind(this)
        this.state = {
            data: [],
            streams: []
        }
    }

    componentWillReceiveProps (nextProps)  {
            if (this.props.data != nextProps.data ) {
                    this.state.data = nextProps.data
                }

    }





    render() {

        return (
            <div>
                <div className="ui four wide column header"><h1>Profile</h1></div>
                <div className="ui top attached primary button">
                    Profile
                </div>
                <div className="ui segment noTopMargin grid">

                    <div className="four wide column">
                        <img className="ui image" src={this.state.data.profilePhoto}></img>
                    </div>

                    <div className="eight wide column">
                        <div className="row">
                            <h1> {this.state.data.firstName} {this.state.data.lastName} </h1>
                        </div>
                        <div className="row">

                            <div > {this.state.data.zipCode} </div>


                        </div>


                        <div className="row">

                            <div > {this.state.data.bio} </div>
                        </div>
                    </div>
                    <div className="four wide column">
                        <Caller userProfileBeingCalledId={this.state.data.id}/>
                    </div>
                    <CallManager />
                </div>
                {/*

<div>
        <OTPublisher session={this.sessionHelper.session} />

        {this.state.streams.map(stream => {
          return (
            <OTSubscriber
              key={stream.id}
              session={this.sessionHelper.session}
              stream={stream}
            />
          );
        })}
      </div>*/}
                    </div>

            )
    }
}


export class ProfileList extends React.Component {
    constructor(props) {
        super(props)
        autobind(this)
        this.state = {
            data:[],
            user:""
        }
    }

    componentDidMount () {
        this.checkIfUser()
        this.loadFromServer()
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

    loadFromServer = () => {
        var theURL = theServer + "api/profiles"

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
        console.error(theUrl, status, err.toString());
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

    render () {
        var placeholderImageStyle = {
            backgroundImage: "url('http://semantic-ui.com/images/avatar2/large/kristy.png')",
            width: '300px',
            height: '300px',
        }

        if (this.state.data && this.state.user) {

        var profileList = this.state.data.map((profile) => {

            if (profile.id != this.state.user.profileId) {
            return (
                    <ProfileViewEditDeleteItem key={profile.id}
                                            isListNode={true}
                                            showCloseButton={false}
                                            apiUrl="api/profiles/"
                                            id={profile.id}
                                            data={profile}
                                            currentView="Basic"/>


)}

            //return (<PlanListNode key={plan.id} plan={plan}/>)
        })
    }


    return (
          <div className='ui three column doubling stackable grid'>
        {profileList}
      </div>
    );
  }

}


module.exports = { ProfileViewPage, ProfileItemMenu, ProfileView, ProfileViewAndEditPage, ProfileDetailPage, ProfileBasicView, ProfileForm, ProfileListPage , ProfileList }