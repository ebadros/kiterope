var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import { Router, Route, Link, browserHistory } from 'react-router'
var validator = require('validator');
var TinyMCE = require('react-tinymce')
var theServer = 'https://192.168.1.156:8000/'




const App = React.createClass({
  render() {
    return (
      <div>
        <h1>App</h1>
        <ul>
          <li><Link to="/goals">Goal</Link></li>
          <li><Link to="/plans">Plan</Link></li>
                      <li><Link to="/plans/2">Plan</Link></li>

            <li><Link to="/steps">Step</Link></li>


        </ul>
        {this.props.children}
      </div>
    )
  }
});

String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};
//<ValidatedInput type="text" options={option1Value:option1Text, option2Value:option2Text,} validators={validators list
String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
};

var ValidatedInput = React.createClass({

    componentDidMount: function() {

        var self = this;
    },

    getInitialState: function() {
        return {
            initialValue: this.props.initialValue,
            value: "",

        }
    },

    componentWillReceiveProps: function(nextProps) {
                this.setState({
                    value: nextProps.value,
                })
    },

    getError: function(failedEvalString) {
        var i=0;
        var error;
        var errorArray = {
            "isEmail": "Please enter a valid email address.",
            "isEmpty": "This cannot be empty.",
            "isDate": "This needs to be a valid date of format.",
            "isTime": "This needs to be a valid time of format.",

        };
        for(var key in errorArray) {


            if (failedEvalString.includes(key) ){

                error = errorArray[key];
                break;

            }
            i++;
        }

        return error;

    },

    validate: function(e) {
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

            }
            var evalString = "validator." + currentValidationString;


            if (!eval('"' + evalString + '"')) {
                var theError = this.getError(evalString);

                this.state.errors.push(theError);
                        console.log("this state erorrs" + this.state.errors)


            }


        }




        return this.state.errors;
    },

    updateState: function(targetValue) {
        this.setState({value: targetValue});

    },

    render: function() {
        var i;
        var errorsHTML = "";
        if (typeof this.state.errors !== 'undefined' && this.state.errors.length > 0) {
            for (i = 0; i < this.state.errors.length; i++) {
                errorsHTML += "<div>" + this.state.errors[i] + "</div>"
            }
        }
        if (this.props.type == "text") {

            if (errorsHTML != "") {
                return (
                    <div className="field error">
                        <label htmlFor={this.props.id}>{this.props.label}</label>
                        <input  type="text" placeholder={this.props.placeholder} name={this.props.name} id={this.props.id} value={this.state.value}
                               onChange={this.validate}/>
                        <div className="errorText" dangerouslySetInnerHTML={{__html: errorsHTML}}/>
                    </div>

                )
            }
            else {
                return (
                    <div className="field">
                    <label htmlFor={this.props.id}>{this.props.label}</label>
                     <input type="text" placeholder={this.props.placeholder} name={this.props.name} id={this.props.id} value={this.state.value} onChange={this.validate} />
                    </div>

                )

            }
        } else if (this.props.type=="textarea") {
            if (errorsHTML != "") {
                return (
                    <div className="fluid field error">
                        <label htmlFor={this.props.id}>{this.props.label}</label>
                        <textarea  placeholder={this.props.placeholder}  type="textarea" rows={this.props.rows} name={this.props.name} id={this.props.id} value={this.state.value}
                               onChange={this.validate}></textarea>
                        <div className="errorText" dangerouslySetInnerHTML={{__html: errorsHTML}}/>
                    </div>

                )
            }
            else {
                return (
                    <div className="fluid field">
                    <label htmlFor={this.props.id}>{this.props.label}</label>
                     <textarea placeholder={this.props.placeholder}  rows={this.props.rows} name={this.props.name} id={this.props.id} value={this.state.value} onChange={this.validate} ></textarea>
                    </div>

                )

            }


        }

    }

});

ValidatedInput.propTypes = {
        stateCallback: React.PropTypes.func,
    };


module.exports = App;
module.exports = ValidatedInput;
