var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
var validator = require('validator');
var TinyMCE = require('react-tinymce')
var theServer = 'https://192.168.1.156:8000/'

import autobind from 'class-autobind'
var auth = require('./auth')
var Global = require('react-global');
import Select from 'react-select'




export class App extends React.Component {

    constructor (props) {
        super(props)
        autobind(this)
        this.state = {
            'user': [],
        }
    }


    componentDidMount() {
        this.loadUserData()
    }


    logoutHandler(){
        store.dispatch(reduxLogout())
        auth.logout()
        hashHistory.push('/account/login/')

    }

    loadUserData() {
        $.ajax({
            method: 'GET',
            url: '/api/users/i/',
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
            }.bind(this)
        })
    }

    render() {
        return (
            <div><div className="spacer"></div>
            <h1>You are now logged in, {this.state.user.username}</h1>
            <button onClick={this.logoutHandler}>Log out</button>
            </div>
        )
    }
}


String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};
//<ValidatedInput type="text" options={option1Value:option1Text, option2Value:option2Text,} validators={validators list
String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

export class KRCheckBox extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            serverErrors:"",
            errors:"",
            value:"",
            labelHTML:""
        }
    }

    handleChangeValue = (event) => {
        if (this.state.value = true) {
            this.setState({
                value: event.target.checked
            })
        } else {
            this.setState({
                value: event.target.checked

            })
        }
        this.props.stateCallback(event.target.checked);
    }

    componentDidMount() {
        this.setState({
            value:this.props.value,
            serverErrors: this.props.serverErrors
        })
    }

    componentWillReceiveProps = (nextProps) => {
        if (this.state.value != nextProps.value) {
            this.setState({
                    value: nextProps.value,
                })

        }

        if (this.state.serverErrors != nextProps.serverErrors) {
            this.setState({
                serverErrors:nextProps.serverErrors
            })
        }
    }

    buildErrors = () => {
        var i;
        var errorsHTML = "";
        if (this.state.serverErrors) {
            for (i = 0; i < this.state.serverErrors.length; i++) {
                errorsHTML += "<div>" + this.state.serverErrors[i] + "</div>"
            }
        } else {
            if (typeof this.state.errors !== 'undefined' && this.state.errors.length > 0) {
                for (i = 0; i < this.state.errors.length; i++) {
                    errorsHTML += "<div>" + this.state.errors[i] + "</div>"
                }
            }
        }
        return errorsHTML

    }

    render () {
        var errorsHTML = this.buildErrors()
         if (errorsHTML != "") {
                return (
                    <div className="ui row">
                 <div className="ui checkbox">
                     <input type="checkbox" defaultChecked={this.state.value} onChange={this.handleChangeValue}/>
                     <label>I have read and agree to Kiterope's <Link to="tos">Terms of Service.</Link></label>
                     <div className="errorText" dangerouslySetInnerHTML={{__html: errorsHTML}}/>


</div></div>


                )
            }
            else {
        return (
             <div className="ui row">
                 <div className="ui checkbox">
                     <input type="checkbox" value={this.state.value} onChange={this.handleChangeValue}/>
                     <label>I have read and agree to Kiterope's <Link to="tos">Terms of Service.</Link></label>

</div></div>
        )
    }}

}

export class KSSelect extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            serverErrors:"",
            errors:"",
            value:""
        }
    }

    componentDidMount () {
        this.setState({
            value: this.props.value
        })
    }



    handleValueChange(option){
        this.setState({value: option.value});
        this.props.valueChange(option)
    }



    buildErrors = () => {
        var i;
        var errorsHTML = "";
        if (this.state.serverErrors) {
            for (i = 0; i < this.state.serverErrors.length; i++) {
                errorsHTML += "<div>" + this.state.serverErrors[i] + "</div>"
            }
        } else {
            if (typeof this.state.errors !== 'undefined' && this.state.errors.length > 0) {
                for (i = 0; i < this.state.errors.length; i++) {
                    errorsHTML += "<div>" + this.state.errors[i] + "</div>"
                }
            }
        }
        return errorsHTML

    }

    render= () => {

        var errorsHTML = this.buildErrors()
            if (errorsHTML != "") {

        return (
             <div className="field error">
                 <label htmlFor={this.props.name}>{this.props.label}</label>
                 <Select value={this.state.value}
                                              onChange={this.handleValueChange} name={this.props.name}
                                              options={this.props.options} clearable={this.props.isClearable} />
                 <div className="errorText" dangerouslySetInnerHTML={{__html: errorsHTML}}/>

                 </div>
        )
    } else {
    return (
             <div className="field">
                 <label htmlFor={this.props.name}>{this.props.label}</label>
                 <Select value={this.state.value}
                                              onChange={this.handleValueChange} name={this.props.name}
                                              options={this.props.options} clearable={this.props.isClearable} />
                 </div>
        )}
    }
}

export class ValidatedInput extends React.Component{
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
        }
    }

    componentDidMount () {
        this.setState({
            initialValue: this.props.initialValue,
            value: this.props.initialValue,
        })

    }


    componentWillReceiveProps = (nextProps) => {
        if (this.state.value != nextProps.value) {
            this.setState({
                    value: nextProps.value,
                })

        }

        if (this.state.serverErrors != nextProps.serverErrors) {
            this.setState({
                serverErrors:nextProps.serverErrors
            })
        }
    }

    getError = (failedEvalString) => {
        var i=0;
        var error;
        var errorArray = {
            "isEmail": "Please enter a valid email address.",
            "isEmpty": "This cannot be empty.",
            "isDate": "This needs to be a valid date of format.",
            "isTime": "This needs to be a valid time of format.",
            "isInt":"This needs to be a whole number.",
            "isDecimal":"This needs to be a number."

        };
        for(var key in errorArray) {


            if (failedEvalString.includes(key) ){

                error = errorArray[key];
                break;

            }
            i++;
        }

        return error;

    }

    validate = (e) => {
        this.setState({value: e.target.value});
        this.props.stateCallback(e.target.value);

        this.state.errors = [];


        var validatorString = this.props.validators;

        var validatorStringCurrentValue = validatorString.replaceAll("(str", ("('" + validator.escape(e.target.value) + "'"));
        //console.log(validatorStringCurrentValue )
        var stringArray = (new Function("return [" + validatorStringCurrentValue + "];")());


        var i;
        for (i=0; i < stringArray.length; i ++) {
            var currentValidationString = stringArray[i];

            if (String(currentValidationString).charAt(0) == "!") {
                var validationString = String(currentValidationString).slice(1);
                var evalString = "validator." + validationString;
                if (eval(evalString)) {
                //if ("validator.isEmpty('Here's a new ')") {
                    var theError = this.getError(evalString);

                    this.state.errors.push(theError);

                }

            } else {

                var evalString = "validator." + currentValidationString;

                if (!eval(evalString)) {
                    var theError = this.getError(evalString);


                    this.state.errors.push(theError);


                }
            }


        }




        return this.state.errors;
    }

    updateState = (targetValue) => {
        this.setState({value: targetValue});

    }

    buildErrors = () => {
        var i;
        var errorsHTML = "";
        if (this.state.serverErrors) {
            for (i = 0; i < this.state.serverErrors.length; i++) {
                errorsHTML += "<div>" + this.state.serverErrors[i] + "</div>"
            }
        } else {
            if (typeof this.state.errors !== 'undefined' && this.state.errors.length > 0) {
                for (i = 0; i < this.state.errors.length; i++) {
                    errorsHTML += "<div>" + this.state.errors[i] + "</div>"
                }
            }
        }
        return errorsHTML

    }




    render = () => {
        var errorsHTML = this.buildErrors()

        if (this.props.isEnabled == null) {


        }
        if (this.props.type == "text") {

            if (errorsHTML != "") {
                return (
                    <div className="field error">
                        <label htmlFor={this.props.id}>{this.props.label}</label>
                        <input  type="text" placeholder={this.props.placeholder} name={this.props.name} id={this.props.id} value={this.state.value}
                               onChange={this.validate} disabled={this.props.isDisabled}/>
                        <div className="errorText" dangerouslySetInnerHTML={{__html: errorsHTML}}/>
                    </div>

                )
            }
            else {
                return (
                    <div className="field">
                    <label htmlFor={this.props.id}>{this.props.label}</label>
                     <input type="text" placeholder={this.props.placeholder} name={this.props.name} id={this.props.id} value={this.state.value} onChange={this.validate} disabled={this.props.isDisabled}/>
                    </div>

                )

            }
        } else if (this.props.type=="textarea") {
            if (errorsHTML != "") {
                return (
                    <div className="fluid field error">
                        <label htmlFor={this.props.id}>{this.props.label}</label>
                        <textarea  placeholder={this.props.placeholder}  type="textarea" rows={this.props.rows} name={this.props.name} id={this.props.id} value={this.state.value}
                               onChange={this.validate} disabled={this.props.isDisabled} />
                        <div className="errorText" dangerouslySetInnerHTML={{__html: errorsHTML}}/>
                    </div>

                )
            }
            else {
                return (
                    <div className="fluid field">
                    <label htmlFor={this.props.id}>{this.props.label}</label>
                     <textarea placeholder={this.props.placeholder}  rows={this.props.rows} name={this.props.name} id={this.props.id} value={this.state.value} onChange={this.validate} disabled={this.props.isDisabled}/>
                    </div>

                )

            }


        }
         else if (this.props.type == "password") {

            if (errorsHTML != "") {
                return (
                    <div className="field error">
                        <label htmlFor={this.props.id}>{this.props.label}</label>
                        <input  type="password" placeholder={this.props.placeholder} name={this.props.name} id={this.props.id} value={this.state.value}
                               onChange={this.validate} disabled={this.props.isDisabled}/>
                        <div className="errorText" dangerouslySetInnerHTML={{__html: errorsHTML}}/>
                    </div>

                )
            }
            else {
                return (
                    <div className="field">
                    <label htmlFor={this.props.id}>{this.props.label}</label>
                     <input type="password" placeholder={this.props.placeholder} name={this.props.name} id={this.props.id} value={this.state.value} onChange={this.validate} disabled={this.props.isDisabled}/>
                    </div>

                )

            }
        }

    }

}

ValidatedInput.propTypes = {
        stateCallback: React.PropTypes.func,
    };

App.contextTypes = {
  router: React.PropTypes.object.isRequired
};

module.exports =  { App, ValidatedInput, KSSelect, KRCheckBox }
