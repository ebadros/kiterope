// SubscriptionForm.js
import React from 'react';
import {Elements} from 'react-stripe-elements';

import InjectedCardInputForm from './CardInputForm';

import  {store} from "../redux/store";

import { mapStateToProps, mapDispatchToProps } from '../redux/containers2'
import { Provider, connect, dispatch } from 'react-redux'

import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'
import { setProfileModalData, updateProfile, submitEvent, clearTempProfile, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, setContacts, setStepOccurrences } from '../redux/actions'
import autobind from 'class-autobind'
var Modal = require('react-modal');
import {NewImageUploader, ImageUploader, Breadcrumb,  PlanViewEditDeleteItem, ProgramViewEditDeleteItem, FormAction, Sidebar, Header, FormHeaderWithActionButton, DetailPage} from '../base';



var ReactDOM = require('react-dom');
var $  = require('jquery');
import { theServer, s3IconUrl, s3ImageUrl, cardPaymentModalStyle, customModalStyles, stepModalStyle, loginJoinModalStyleMobile, loginJoinModalStyle, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions } from '../constants'

@connect(mapStateToProps, mapDispatchToProps)
class SubscriptionForm extends React.Component {
  constructor(props) {
        super(props);
        autobind(this);
        this.state = {

        }
    }

    componentDidMount = () => {


       if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.currentEvent == "addOrUpdateCard") {
                this.setState({modalIsOpen:true})
              store.dispatch(submitEvent(""))


            }
        }
    }

    componentWillReceiveProps = (nextProps) => {


       if (nextProps.storeRoot != undefined) {
            if (nextProps.storeRoot.currentEvent == "addOrUpdateCard") {
                this.setState({modalIsOpen:true})
              store.dispatch(submitEvent(""))


            } else if (nextProps.storeRoot.currentEvent == "clearCardInfo") {
              this.setState({modalIsOpen:false})
              store.dispatch(submitEvent(""))

            } else if (nextProps.storeRoot.currentEvent == "deleteCard") {
              this.deleteCard()
                            store.dispatch(submitEvent(""))


            }

        }
    }

    deleteCard = () => {
      console.log("deleteCard")
      var theUrl = "/api/profiles/" + this.props.storeRoot.profile.id + "/";

            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'PATCH',
                data: {stripeSourceId:""},
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    store.dispatch(updateProfile(data));
                    store.dispatch(submitEvent(""))


                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                    })

                }.bind(this)
            });
    }







  getForm() {
    return (
         <div className="ui page container form">
           <div className="ui row">&nbsp;</div>
                      <div className="ui row">&nbsp;</div>

                             <Header headerLabel="Add Card" />

        <Elements>
          <InjectedCardInputForm closeModal={this.handleCloseModal} />
        </Elements>

           </div>
    )
  }

  handleCloseModal() {
        this.setState({modalIsOpen: false})
        this.resetForm()


    }

    resetForm = () => {
    this.setState({

                    modalIsOpen: false,

                },            () =>        { store.dispatch(submitEvent("clearCardInfo"))}


            )

        }











  render() {

    var theForm = this.getForm();
    if (this.props.storeRoot != undefined) {
      if (this.props.storeRoot.gui != undefined) {
        var forMobile = this.props.storeRoot.gui.forMobile
      }
    }


    if (forMobile) {
      var modalStyle = stepModalStyle

    } else {


      var modalStyle = cardPaymentModalStyle

    }

    return (


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

export default SubscriptionForm;