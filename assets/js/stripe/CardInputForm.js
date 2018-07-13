import React from 'react';
var ReactDOM = require('react-dom');

import {injectStripe} from 'react-stripe-elements';

import CardSection from './CardSection';
import  {store} from "../redux/store";

import { mapStateToProps, mapDispatchToProps } from '../redux/containers2'
import { Provider, connect, dispatch } from 'react-redux'

import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'
import { setProfileModalData, updateProfile, submitEvent, clearTempProfile, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, setContacts, setStepOccurrences } from '../redux/actions'
import autobind from 'class-autobind'

var ReactDOM = require('react-dom');
var $  = require('jquery');

@connect(mapStateToProps, mapDispatchToProps)
class CardInputForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            currentEvent: ""

        }
    }



    componentWillReceiveProps = (nextProps) => {
        if (nextProps.storeRoot != undefined ) {
        if (nextProps.storeRoot.currentEvent != this.state.currentEvent) {
            if (nextProps.storeRoot.currentEvent == "submitCardInfo") {

                //this.refs.formToSubmit.handleSubmit()
                this.refs.formToSubmit.submit();


                //React.findDOMNode(this.refs.formToSubmit).onSubmit()
                //$(this.refs['formToSubmit']).submit()
                //$(this.refs['formToSubmit']).submit()
                store.dispatch(submitEvent(""))


            } else {
                this.setState({currentEvent:nextProps.storeRoot.currentEvent})

            }

        }}

    }

    doSubmit() {
    this.props.handleSubmit()
  }
  handleSubmit = (ev) => {
      console.log("my handlesubmit called")
    // We don't want to let default form submission happen here, which would refresh the page.
    ev.preventDefault();

    // Within the context of `Elements`, this call to createToken knows which Element to
    // tokenize, since there's only one in this group.
    this.props.stripe.createToken({name: 'Jenny Rosen'}).then(({token}) => {
      console.log('Received Stripe token:', token);
    });

      this.props.stripe.createSource( {type: 'card' , owner: {name:"Eric Badros"}}).then((result) => {

          var theUrl = "/api/profiles/" + this.props.storeRoot.profile.id + "/";

            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'PATCH',
                data: {stripeSourceId:result.source.id},
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    store.dispatch(updateProfile(data));
                    store.dispatch(submitEvent("clearCardInfo"))


                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                    })

                }.bind(this)
            });
      console.log('Received Stripe source:', result.source, result.error);
    });
    // However, this line of code will do the same thing:
    //
    // this.props.stripe.createToken({type: 'card', name: 'Jenny Rosen'});

    // You can also use createSource to create Sources. See our Sources
    // documentation for more: https://stripe.com/docs/stripe-js/reference#stripe-create-source
    //
    // this.props.stripe.createSource({type: 'card', name: 'Jenny Rosen'});
  };

  render() {
    return (
      <form ref="formToSubmit" onSubmit={this.handleSubmit}>
        <CardSection />
                     <div className="ui row">&nbsp;</div>

        <div className="ui three column stackable grid">
                          <div className="column">&nbsp;</div>
                          <div className="column">
                              <div className="ui large fluid button" onClick={this.props.closeModal}>Cancel</div>
                          </div>
                          <div className="column">
                              <button className="ui large fluid blue button" >Save</button>
                          </div>
                      </div>
      </form>
    );
  }
}

export default injectStripe(CardInputForm);