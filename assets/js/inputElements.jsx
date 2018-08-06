import TinyMCEInput from 'react-tinymce-input';
var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
var validator = require('validator');
var TinyMCE = require('react-tinymce');
var theServer = 'https://192.168.1.156:8000/';

import autobind from 'class-autobind'
var auth = require('./auth');
var Global = require('react-global');
import Select from 'react-select'
import PropTypes from 'prop-types';
var ReactS3Uploader = require('react-s3-uploader');
import Measure from 'react-measure'
import {NewImageUploader, ImageUploader, VideoUploader } from './base'
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'
import ImageCompressor from '@xkeshi/image-compressor';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

import ReduxDataGetter from './reduxDataGetter'
import SplashGoalEntry from './splashGoalEntry'

import { Provider, connect, dispatch } from 'react-redux'
import { mapStateToProps, mapDispatchToProps} from './redux/containers2'
import { Menubar, StandardSetOfComponents, ErrorReporter, Footer } from './accounts'



import  {store} from "./redux/store"
import { setCurrentUser, setPlans,  setCurrentFormValue, setModalFormData, setUpdateOccurrences, setUpdates, setVisualizations, removeStepFromUpdate, addStepToUpdate, editUpdate, reduxLogout, setProfile, setSettings, setForMobile, showSidebar, setContacts, setMessageWindowVisibility, setOpenThreads, setGoals, setPrograms, setMessageThreads,  setStepOccurrences } from './redux/actions'

import {testForm, FormFactory} from './formFactory'

export class FormErrorMessage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            errors:""

        }
    }

    componentDidMount() {
        this.setState({errors:this.props.errors})

    }

    componentWillReceiveProps(nextProps) {
        if (this.state.errors != nextProps.errors) {
            this.setState({errors:nextProps.errors})
        }
    }

    render () {
        if (this.state.errors)
        {
            var errorKeys = Object.keys(this.state.errors)
            var errorString = errorKeys.join().replace(",",", ")
        }
        return (<div className="ui grid"><div className="sixteen wide center aligned column">
        { this.state.errors ? <div className="ui error segment" style={{borderTop:'none'}}>You have errors with the following fields above: {errorString}</div>: null}
            </div>
            </div>
        )
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class KRInput extends React.Component{
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            value:"",
            initialValue:""
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
    };

    getError = (failedEvalString) => {

        var i=0;
        var error;
        var errorArray = {
            "isEmail": "Please enter a valid email address.",
            "isEmpty": "This cannot be empty.",
            "isDate": "This needs to be a valid date.",
            "isTime": "This needs to be a valid time.",
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

    };

    validate = (e) => {
        this.setState({value: e.target.value});
        //this.props.stateCallback(e);

        this.props.stateCallback(e.target.value);

        this.state.errors = []


        var validatorString = this.props.validators;

        var validatorStringCurrentValue = validatorString.replaceAll("(str", ("('" + validator.escape(e.target.value) + "'"));
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
    };

    updateState = (targetValue) => {
        this.setState({value: targetValue});

    };

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


    onUploadStart() {
        console.log("onUploadStart")
    }

    onUploadProgress() {
        console.log("onUploadProgress")
    }
    onUploadFinish() {
        console.log("onUploadFinish")
    }

    onUploadError() {
                console.log("onUploadError")


    }

    handleVideoChange = (callbackData) => {
        this.props.stateCallback(callbackData)

    };

    handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();


      this.props.keyPressCallback()
    }
  };





    render = () => {
        var errorsHTML = this.buildErrors();

        if (this.props.isEnabled == null) {


        }
        if (this.props.type == "text") {

            if (errorsHTML != "") {
                return (
                    <div className="field error">
                        <label htmlFor={this.props.id}>{this.props.label}</label>
                        <input onKeyPress={this.handleKeyPress.bind(this)} type="text" placeholder={this.props.placeholder} name={this.props.name} id={this.props.id} value={this.state.value}
                               onChange={this.validate} disabled={this.props.isDisabled}/>
                        <div className="errorText" dangerouslySetInnerHTML={{__html: errorsHTML}}/>
                    </div>

                )
            }
            else {
                return (
                    <div className="field">
                    <label htmlFor={this.props.id}>{this.props.label}</label>
                     <input onKeyPress={this.handleKeyPress.bind(this)} type="text" placeholder={this.props.placeholder} name={this.props.name} id={this.props.id} value={this.state.value} onChange={this.validate} disabled={this.props.isDisabled}/>
                    </div>

                )

            }
        } else if (this.props.type == "video") {

            if (errorsHTML != "") {
                return (
                    <Measure onMeasure={(dimensions) => {
                this.setState({dimensions})
            }}>
                    <div className="field error">
                        <label htmlFor={this.props.id}>{this.props.label}</label>
                                     <VideoUploader videoReturned={this.handleVideoChange} dimensions={this.state.dimensions} label="Drag and Drop or Click to Add Video" />

                        <div className="errorText" dangerouslySetInnerHTML={{__html: errorsHTML}}/>
                    </div>
                        </Measure>

                )
            }
            else {
                return (
                    <Measure onMeasure={(dimensions) => {
                this.setState({dimensions})
            }}>
                    <div className="field">
                    <label htmlFor={this.props.id}>{this.props.label}</label>
                        <VideoUploader videoReturned={this.handleVideoChange} dimensions={this.state.dimensions} label="Drag and Drop or Click to Add Video" />
  </div></Measure>

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
                        <input  onKeyPress={this.handleKeyPress.bind(this)} type="password" placeholder={this.props.placeholder} name={this.props.name} id={this.props.id} value={this.state.value}
                               onChange={this.validate} disabled={this.props.isDisabled}/>
                        <div className="errorText" dangerouslySetInnerHTML={{__html: errorsHTML}}/>
                    </div>

                )
            }
            else {
                return (
                    <div className="field">
                    <label htmlFor={this.props.id}>{this.props.label}</label>
                     <input onKeyPress={this.handleKeyPress.bind(this)} type="password" placeholder={this.props.placeholder} name={this.props.name} id={this.props.id} value={this.state.value} onChange={this.validate} disabled={this.props.isDisabled}/>
                    </div>

                )

            }
        }

    }

}


@connect(mapStateToProps, mapDispatchToProps)
export class KRSelect extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            serverErrors:"",
            errors:"",
            value:"",
            options:"",
            formattedOptions:"",
        }
    }

    componentDidMount () {
        this.setState({
            value: this.props.value
        })

        if (this.props.options != this.state.options) {
            this.setState({
                options:this.props.options,
                formattedOptions:this.props.options
            })
                        if (this.props.valueKey != undefined && this.props.labelKey != undefined) {

                            this.buildOptions(this.props.options)
                        }
        }

        if (this.state.serverErrors != this.props.serverErrors) {
            this.setState({serverErrors: this.props.serverErrors})
        }
    }

    buildOptions(theOptions) {
        var theFormattedOptions = []
        for (var anOption in theOptions) {
            theFormattedOptions.unshift({value:anOption[this.props.valueKey], label:anOption[this.props.labelKey]})
        }
        this.setState({
            formattedOptions: theFormattedOptions
        })
    }





    handleValueChange(option){

        this.setState({value: option.value});
        this.props.valueChange(option)

    }

    componentWillReceiveProps (nextProps) {
        if (this.state.value != nextProps.value) {
            this.setState({
                value:nextProps.value
            })
        }
        if (this.state.serverErrors != nextProps.serverErrors) {
            this.setState({serverErrors: nextProps.serverErrors})
        }

        if (nextProps.options != this.state.options) {
            this.setState({
                options:nextProps.options,
                formattedOptions:nextProps.options
            }
            )
            if (nextProps.valueKey != undefined && nextProps.labelKey != undefined) {
                this.buildOptions(nextProps.options)
            }
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

    };

    render= () => {

        var errorsHTML = this.buildErrors();
            if (errorsHTML != "") {

        return (
             <div className="field error">
                 <label htmlFor={this.props.name}>{this.props.label}</label>
                 <Select value={this.state.value}
                         onChange={this.handleValueChange}
                         name={this.props.name}
                         searchable={this.props.searchable}
                         valueKey={this.props.valueKey}
                         labelKey={this.props.labelKey}

                         options={this.props.options}
                         clearable={this.props.isClearable} />
                 <div className="errorText" dangerouslySetInnerHTML={{__html: errorsHTML}}/>

                 </div>
        )
    } else {
    return (
             <div className="field">
                 <label htmlFor={this.props.name}>{this.props.label}</label>
                 <Select value={this.state.value}
                         onChange={this.handleValueChange}
                         name={this.props.name}
                         searchable={this.props.searchable}
                         options={this.props.options}
                         valueKey={this.props.valueKey}
                         labelKey={this.props.labelKey}
                         clearable={this.props.isClearable} />
                 </div>
        )}
    }
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
    };

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
    };

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

    };

    render () {
        var errorsHTML = this.buildErrors();
         if (errorsHTML != "") {
                return (
                    <div className="ui row">
                 <div className="ui checkbox">
                     <input type="checkbox" defaultChecked={this.state.value} onChange={this.handleChangeValue}/>
                     <label>I have read and agree to Kiterope's <Link to="/tos">Terms of Service.</Link></label>
                     <div className="errorText" dangerouslySetInnerHTML={{__html: errorsHTML}}/>


</div></div>


                )
            }
            else {
        return (
             <div className="ui row">
                 <div className="ui checkbox">
                     <input type="checkbox" value={this.state.value} onChange={this.handleChangeValue}/>
                     <label>I have read and agree to Kiterope's <Link to="/tos">Terms of Service.</Link></label>

</div></div>
        )
    }}

}


export class KRRichText extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            value:"",
        }
    }

    handleEditorChange(e)  {

        this.setState({value: e});
  }

  componentDidMount () {
        this.setState({
            value: this.props.value,
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
    };

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

    };

    validate = (e) => {
        this.setState({value: e});
        //this.props.stateCallback(e);

        this.props.stateCallback(e);
        {/*

this.setState({errors:[]})

        var validatorString = this.props.validators;


        var validatorStringCurrentValue = validatorString.replaceAll("(str", ("('" + validator.escape(e) + "'"));

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
                    var theErrors = []
                    theErrors = this.state.errors.slice()
                    theErrors.push(theError)
                    this.setState({errors: theErrors})

                    //this.state.errors.push(theError);

                }

            } else {

                var evalString = "validator." + currentValidationString;

                if (!eval(evalString)) {
                    var theError = this.getError(evalString);
                    var theErrors = []
                    theErrors = this.state.errors.slice()
                    theErrors.push(theError)
                    this.setState({errors: theErrors})




                }
            }


        }




        return this.state.errors;*/}
    };

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

    };

    render() {
                var errorsHTML = this.buildErrors();
        if (errorsHTML != "") {
            var errorCSSClass = "error"
        } else {
            var errorCSSClass = ""
        }
    return (
                            <div className={`field ${errorCSSClass}`}>
                                <label htmlFor="id_description">{this.props.label}</label>
                                <TinyMCEInput name={this.props.name}
                                         value={this.state.value}
                                         config={this.props.config}
                                         onChange={this.validate}
                                />
                                                        <div className="errorText" dangerouslySetInnerHTML={{__html: errorsHTML}}/>



                            </div>
    )
    }
}

KRInput.propTypes = {
        stateCallback: PropTypes.func,
    };

module.exports = {KRInput, KRSelect, KRCheckBox, KRRichText, FormErrorMessage }