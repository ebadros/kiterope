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
import { KRInput, KRSelect, KRRichText, KRCheckBox } from './inputElements'

var Modal = require('react-modal');
var DatePicker = require('react-datepicker');
var moment = require('moment');
import { MessageWindowContainer } from './message'
require('react-datepicker/dist/react-datepicker.css');
import TinyMCE from 'react-tinymce';
import autobind from 'class-autobind'
import { ClippedImage, ChoiceModal , IconLabelCombo } from './elements'
import { ImageUploader, Header, Breadcrumb, FormHeaderWithActionButton, ContactViewEditDeleteItem, ProfileViewEditDeleteItem, } from './base'
import { StandardSetOfComponents, Footer, ErrorReporter } from './accounts'

import { PlanForm, PlanList } from './plan'
import { Caller, CallManager } from './call'
import TinyMCEInput from 'react-tinymce-input';

import { theServer, s3IconUrl, formats, cardPaymentModalStyle, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, times, durations, } from './constants'

import { OTSession, OTPublisher, OTStreams, OTSubscriber, createSession } from 'opentok-react';

import { Provider, connect, dispatch } from 'react-redux'

import  {store} from "./redux/store";

import { mapStateToProps, mapDispatchToProps } from './redux/containers2'

import { setCurrentUser, reduxLogout, addContactGroup, setSelectedContactGroup, showSidebar, setModalFormData, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, setContacts, setStepOccurrences } from './redux/actions'
import Measure from 'react-measure'

import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'
import { Creatable } from 'react-select';
import {FormFactory} from './formFactory'

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

export const newContactGroup = {
    formName: "newContactGroup",
    formLabel: "New Contact Group",
    reduxKey: "contactGroups",
    reduxModelKey: "name",
    formFields: {

        id: {
            fieldType: "TextField",
            fieldName: 'id',
            default:"",

        },
        name: {
            fieldName: "name",
            fieldType: "TextField",
            fieldValidation: '"!isEmpty(str)"',
            fieldLabel:"Group Name",
            fieldPlaceholder: "Name of Group",
            default:"",
        },
    },
    order: ['name'],
    submissionUrl: "/api/contactGroups/",
        overrideSaveFunction: false,

    saveStatuses:["Create", "Saving", "Saved"],
    mobileModalStyle: cardPaymentModalStyle,
    fullscreenModalStyle: cardPaymentModalStyle,
        includeDeleteButton: false


}



export const editContactGroup = {
    formName: "editContactGroup",
    formLabel: "Edit Contact Group",
    reduxKey: "contactGroups",
    reduxModelKey: "name",
    formFields: {

        id: {
            fieldType: "IdField",
            fieldName: 'id',
            default:"",

        },
        name: {
            fieldName: "name",
            fieldType: "TextField",
            fieldValidation: '"!isEmpty(str)"',
            fieldLabel:"Group Name",
            fieldPlaceholder: "Name of Group",
            default:"",
        },
    },
    order: ['id', 'name'],
    submissionUrl: "/api/contactGroups/",
    saveStatuses:["Save", "Saving...", "Saved"],
    overrideSaveFunction: false,

    mobileModalStyle: cardPaymentModalStyle,
    fullscreenModalStyle: cardPaymentModalStyle,
    includeDeleteButton: true

}



export const addToContactGroup = {
    formName: "addToContactGroup",
    formLabel: "Add Contact to Group",
    reduxKey: "contactGroups",
    reduxModelKey: "name",
    formFields: {
        id: {
            fieldType: "IdField",
            fieldName: 'id',
            default:"",

        },

        contactGroups: {
            fieldName: "contactGroups",
            fieldType: "MultiSelectField",
            fieldValidation: '"!isEmpty(str)"',
            fieldLabel:"Group Name",
            fieldPlaceholder: "Name of Groups",
            fieldOptions:"contactGroupOptions",
            default:"",
        }
    },
    order: ['id', 'contactGroups'],
    submissionUrl: "/api/contactGroups/",
    saveStatuses:["Save", "Saving...", "Saved"],
    overrideSaveFunction: true,
    mobileModalStyle: cardPaymentModalStyle,
    fullscreenModalStyle: cardPaymentModalStyle,
    includeDeleteButton: false

}




@connect(mapStateToProps, mapDispatchToProps)
export class ContactListPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: [],
            selectedContactGroup: "All",
            contactGroups:{},
            contactGroupOptions:[],

        }

    }

    componentDidMount() {
        if (this.state.contactGroups != this.props.storeRoot.contactGroups) {
            this.setState({contactGroups: this.props.storeRoot.contactGroups}, () => this.buildContactGroupOptions(this.props.storeRoot.contactGroups))
        }
    }

    componentWillReceiveProps (nextProps) {
        if (this.state.contactGroups != nextProps.storeRoot.contactGroups) {
            this.setState({contactGroups: nextProps.storeRoot.contactGroups},() => this.buildContactGroupOptions(nextProps.storeRoot.contactGroups) )
        }
    }

    buildContactGroupOptions (theContactGroups) {

        var theContactGroupOptions =[]
        var theContactGroupOptionsForRemoval = []


        for (var key in theContactGroups) {
            theContactGroupOptions.push({value:theContactGroups[key].name, label:theContactGroups[key].name, id:theContactGroups[key].id})
            if (theContactGroups[key].isDefault == false) {
                theContactGroupOptionsForRemoval.push({value:theContactGroups[key].name, label:theContactGroups[key].name, id:theContactGroups[key].id})
            }
        }

        this.setState({contactGroupOptions: theContactGroupOptions,
        contactGroupOptionsForRemoval: theContactGroupOptionsForRemoval})
    }

    handleSelectedContactGroupChange(option) {
        //if (this.state.contactGroups[option.value] == undefined) {
          //  this.submitContactGroup(option.value)
        //}

        this.setState({selectedContactGroup: option.value})
        store.dispatch(setSelectedContactGroup(option))
    }





    submitContactGroup = (theContactGroupName) => {

            var theUrl = "/api/contactGroups/"

            $.ajax({
                url: theUrl,
                dataType: 'json',
                type:'POST',
                cache: false,
                data: {name:theContactGroupName},

                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    store.dispatch(addContactGroup(data))


                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }.bind(this)
            });

    };



    createNewContactGroup() {
        console.log("createNewContactGroup")
    }

    handleCreateGroup() {
            store.dispatch(setModalFormData("newContactGroup", {modalIsOpen:true, data:{name:""}}))
    }

    handleEditGroup() {
            store.dispatch(setModalFormData("editContactGroup", {modalIsOpen:true, data:{
                name:this.state.selectedContactGroup,
                id: this.state.contactGroups[this.state.selectedContactGroup].id}}))
    }

    handleAddToContactGroup(theCallback) {
        var theContactGroupsContacts =[]
        theContactGroupsContacts =  this.props.storeRoot.contactGroups[theCallback.contactGroups.label].contacts_ids.slice()
        theContactGroupsContacts.push(this.props.storeRoot.addToContactGroupModalData.data.contactId)

        var theUrl = "/api/contactGroups/" + theCallback.contactGroups.id + "/"
        $.ajax({
                url: theUrl,
                dataType: 'json',
                type:'PATCH',
                cache: false,
                data: {contacts_ids:theContactGroupsContacts},

                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    store.dispatch(addContactGroup(data))
                    store.dispatch(setModalFormData("addToContactGroup", {modalIsOpen:false, data:{}}))



                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }.bind(this)
            });

    }

    render() {

        var dateData, dateObject, readableDate;
        dateObject = new Date();

        var readableStartDate = "";
        var readableEndDate = "";

        if (this.state.periodRangeStart != undefined) {
            readableStartDate = this.state.periodRangeStartString;
            readableEndDate = this.state.periodRangeEndString
        }

        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.gui != undefined) {
                var forMobile = this.props.storeRoot.gui.forMobile
            }
        }

        if (forMobile) {

            var listNodeOrMobile = true
        }
        if (this.state.data != undefined) {
            return (
                <div>
                    <StandardSetOfComponents modalIsOpen={this.state.signInOrSignUpModalFormIsOpen}/>

                    <div className="fullPageDiv">
                        <div className="ui page container footerAtBottom">


                            <div className="spacer">&nbsp;</div>
                            <div className="ui large breadcrumb">
                                <Link to={`/`}>
                                    <div className="section">Home</div>
                                </Link>

                                <i className="right chevron icon divider"></i>
                                <Link to={`/`}>
                                    <div className="active section">Today's Work</div>
                                </Link>
                            </div>
                            <div>&nbsp;</div>
                            <div className="ui three column stackable grid">
                                <div className="ui row">
        <div className="ui column header"><h1>My Contacts</h1></div>
                                                                        <div className="ui column ">&nbsp;</div>


                                    <div className="ui column">
                                        <div className="ui grid">
                                            <div className="sixteen wide column"><div className="ui purple large fluid button"  onClick={this.handleCreateGroup}>Create Group</div></div>



                                            <div className="eleven wide column"> <KRSelect
                                                           valueChange={this.handleSelectedContactGroupChange}
                                                           value={this.state.selectedContactGroup}
                                                           options={this.state.contactGroupOptions}
                                                           isClearable={false}
                                                /></div>

                                        <div className="five wide column">{this.state.selectedContactGroup != "All" && this.state.selectedContactGroup != "Received Requests" && this.state.selectedContactGroup != "Sent Requests" ?
                                            <div className="ui purple medium fluid button"  onClick={this.handleEditGroup}>Edit</div>:
                                            <div className="ui grey medium fluid button"  >Edit</div>}
                                            </div>


                                            </div>
                                    </div>





                                    </div>
                            </div>

                            {this.state.contactGroups != undefined && this.state.contactGroups[this.state.selectedContactGroup] != undefined ? <ContactList data={this.state.contactGroups[this.state.selectedContactGroup].contacts} />: null }

                            </div>






                    </div>
                <FormFactory form={newContactGroup}  />
                    <FormFactory form={editContactGroup} />
                    <FormFactory form={addToContactGroup} overriddenSaveFunction={this.handleAddToContactGroup} contactGroupOptions={this.state.contactGroupOptionsForRemoval} />



                    <Footer />
                </div>


            )
        }
        else {
            return (
                <div></div>
            )
        }


    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class ContactList extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data:[],
            user:"",
            cleanedUpData:[],
            userProfile:"",

        }
    }

    componentDidMount () {
        if (this.state.data != this.props.data) {
            this.setState({
                data:this.props.data
            }, )
        }
        if (this.props.storeRoot != undefined ) {
            if (this.props.storeRoot.profile != undefined) {
                if (this.state.userProfile != this.props.storeRoot.profile.id) {

                    this.setState({
                        userProfile: this.props.storeRoot.profile.id
                    },)
                }
            }
        }
        //this.checkIfUser()
        //this.loadFromServer()
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.data != nextProps.data) {

            this.setState({
                data:nextProps.data
            }, () => this.cleanUpData())
        }
                        if (this.state.userProfile != nextProps.storeRoot.profile.id) {


                            if (this.state.userProfile != nextProps.storeRoot.profile.id) {

                                this.setState({
                                    userProfile: nextProps.storeRoot.profile.id
                                }, () => this.cleanUpData())
                            }
                        }




    }

    cleanUpData () {
        var allCleanedData = []
        for (var key in this.state.data) {
            var cleanedData = {}
            var theData = this.state.data[key]
            if (theData.receiver == this.state.userProfile) {

                cleanedData = Object.assign({}, theData.senderProfile)
            } else if (theData.sender == this.state.userProfile) {
                cleanedData = Object.assign({}, theData.receiverProfile)
            }
            cleanedData['wasConfirmed'] = theData.wasConfirmed
            allCleanedData.push(cleanedData)

        }
        this.setState({cleanedUpData: allCleanedData})
    }






    render () {
        var placeholderImageStyle = {
            backgroundImage: "url('http://semantic-ui.com/images/avatar2/large/kristy.png')",
            width: '300px',
            height: '300px',
        };

        if (this.state.cleanedUpData) {
        var profileList = this.state.data.map(function(aContact){




            return (

                    <ContactViewEditDeleteItem key={aContact.id}
                                            isListNode={true}
                                            showCloseButton={false}
                                            apiUrl="/api/contacts/"
                                            id={aContact.connectionId}
                                            data={aContact}
                                               contact={aContact.connectionId}
                                            currentView="Basic"/>


);

            //return (<PlanListNode key={plan.id} plan={plan}/>)
        })
    }


    return (

          <div className='ui three column stackable grid'>
        {profileList}
      </div>
    );
  }

}

export class ContactBasicView extends React.Component {
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
        store.dispatch(push("/profiles/" + this.state.data.id + "/"))

}
    render() {
        if (this.props.isListNode) {
            return (
                <div onClick={this.goToDetail} >
                    <ClippedImage item="profile" src={this.state.data.image} />

                <div className="ui grid" >
                    <div className="sixteen wide column">

                        <div className="row">&nbsp;</div>
                        <div className="profileTitle">{this.state.data.fullName}</div>

                    </div>
                    </div></div>

            )
        }
        else {
            return (
                <div className="ui grid">
                    <div className="two wide column">
                        <img className="ui circular image" src={this.state.data.image}></img>
                    </div>
                    <div className="eight wide column">
                        <div className="fluid row">
                            <h3>{this.state.data.firstName} {this.state.data.lastName} </h3>
                        </div>
                        <div className="fluid row" dangerouslySetInnerHTML={{__html: this.state.data.bio}}/>
                    </div>
                    <div className="right aligned six wide column">
                        {/* TODO: Include member since, # of clients, Location
                        <IconLabelCombo size="extramini" orientation="right" text="100% Success" icon="success" background="Light" link="/goalEntry" />
                                    <IconLabelCombo size="extramini" orientation="right" text={this.state.data.zipCode} icon="deadline" background="Light" link="/goalEntry" />
                              */}    </div>

                </div>

            )
        }

    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class ContactItemMenu extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
     }

     handleClick = (callbackData) => {
         this.props.click(callbackData)
     };



     render () {
         var myStyle = {display: "block"};
         var allowRemoveContact = false
         if (this.props.storeRoot != undefined) {
             if (this.props.storeRoot.contactGroups != undefined && this.props.storeRoot.selectedContactGroup != undefined) {
                 if (this.props.storeRoot.contactGroups[this.props.storeRoot.selectedContactGroup.value].isDefault) {
                     allowRemoveContact = true

                 }
             }
         }

         return(

                  <div className="ui simple  dropdown  item" >
                      <div className="ui extramini image controlButtonMargin">
                      <img src={`${s3IconUrl}menuDark.svg`} /></div>
                      <div className="menu" style={{right: '0',left: 'auto'}}>
                         {this.props.data != undefined && this.props.data== 'sender' ? <div className="ui item">
                              <IconLabelCombo size="extramini" orientation="left" text="Confirm Contact" icon="goal" background="Light" click={this.handleClick} /></div>:null}

                          <div className="ui item">

                              <IconLabelCombo size="extramini" orientation="left" text="Add Contact to Group" icon="goal" background="Light" click={this.handleClick} />
                              </div>
                          {/*
                          <div className="ui item">
                            <IconLabelCombo size="extramini" orientation="left" text="Add as Client" icon="step" background="Light" click={this.handleClick} />
                            </div>*/}
                          {allowRemoveContact ? null :
                              <div className="ui item">
                                  <IconLabelCombo size="extramini" orientation="left" text="Remove Contact from Group"
                                                  icon="trash" background="Light" click={this.handleClick}/>
                              </div>
                          }

                      </div>
                  </div>


         )
     }

}



module.exports = { ContactListPage, ContactBasicView, ContactItemMenu, ContactList };