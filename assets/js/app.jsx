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


export class App extends React.Component {

    constructor (props) {
        super(props);
        autobind(this);
        this.state = {
            'user': [],
        }
    }


    componentDidMount() {
        this.loadUserData()
    }


    logoutHandler(){
        store.dispatch(reduxLogout());
        auth.logout();

        store.dispatch(push('/'))

    }

    loadUserData() {
        console.log("loadUserData");
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
//<KRInput type="text" options={option1Value:option1Text, option2Value:option2Text,} validators={validators list
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



@connect(mapStateToProps, mapDispatchToProps)
export class TestComponent extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        }
        componentDidMount() {
            store.dispatch(setCurrentUser({id:1}))
        }

    render() {
        return (
            <div>

            </div>
        )
    }


}

@connect(mapStateToProps, mapDispatchToProps)
export class TestPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

        }

        componentDidMount() {


        }

        handleClick() {
            console.log("handleClick")
                var theData = {modalIsOpen:true, data:{}}

            store.dispatch(setModalFormData("bird", theData))
        }
    render() {
        return (
            <div><StandardSetOfComponents />
                <div className="spacer">&nbsp;</div>
                <div className="ui button" onClick={this.handleClick}>Click Me</div>
                <FormFactory form={testForm} />


            </div>
        )
    }


}

export class TestPage2 extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        var theImage
        this.state = {
            dimensions: {
                width: -1,
                height: -1
            },

            theCompressedImageBlob:"",
            finalImage:"",
        }

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

    handleImageChange() {
        console.log("handleImageChange")
    }


        handleVideoChange = (callbackData) => {
        this.setState({
            video: callbackData.video
        })
    };

    _getFiles(obj){
        console.log("have the files been gotten")
    console.log(obj);
  }

  handleChange(e) {
      console.log("handleChange Called")
      const file = e.target.files[0];

  if (!file) {
    return;
  }
  const imageCompressor = new ImageCompressor();


  imageCompressor.compress(file, {quality:0.8})
  .then((result) => {
      let url = URL.createObjectURL(result)

      this.setState({theCompressedImageBlob: url})
            var imageNaturalWidth = this.refs.cropper.getImageData().width
        var imageNaturalHeight = this.refs.cropper.getImageData().width
      this.setState({
          "imageNaturalWidth": imageNaturalWidth,
          "imageNaturalHeight": imageNaturalHeight,

      }, () => this.getContainerDimensions())






      //window.URL = window.URL || window.webkitURL;


      //this.setState({theCompressedImageBlob: url1})
  })
  .catch((err) => {
        console.log("errors")

  })
  }

  getContainerDimensions() {

  }


_crop(){
    // image in dataUrl
    let theFinalImage = this.refs.cropper.getCroppedCanvas().toDataURL()
    this.setState({finalImage: theFinalImage})
  }
  callGetData() {
  }


    getTestHTML() {
        var selectImageStyle =  {
    overflow: 'hidden',
    display: 'block',
    backgroundColor: '#2199e8',
    color: 'white',
    fontSize: '1rem',
    border: '1px solid #2199e8',
    borderRadius: '4px',
    position: 'relative',
    cursor: 'pointer',
    textAlign: 'center',
    lineHeight: '20px',
            paddingTop:'60px',
            fontWeight:'bold',
    width: '225px',
    height: '225px'
}

        return (
            <div className="ui four column grid">

                <div className="ui row"> &nbsp;</div>
                <div className="ui row">&nbsp;

                <div className="ui column">

                    </div>
                                <div className="ui column">&nbsp;



                                    </div>
                </div>


                {this.state.theCompressedImageBlob != "" ?

                    <Cropper
                        viewMode={2}
                        ref='cropper'
                        src={this.state.theCompressedImageBlob}
                        background={false}
                        style={{width:'225px', height:'225px'}}
        // Cropper.js options

                        aspectRatio={16 / 9}
                        guides={false}
                        scaleX={.5}
                        scaleY={.5}
                        crop={this._crop.bind(this)} /> : <div style={selectImageStyle}>Drag and Drop or Click to Select Image<input style={{paddingTop:'300px', cursor:'pointer'}} type='file' id="file" accept="image/*"
onChange={this.handleChange.bind(this)}></input></div>}


        {this.state.finalImage != "" ? <div style={{marginLeft:'10px'}}><img style={{width:'400px', height:'225px'}} src={this.state.finalImage}/></div> : <div></div>}
                <button onClick={this.callGetData.bind(this)} />
                </div>


        )
    }

    render() {
        var theTestHTML = this.getTestHTML();
        return (
            <div>
                <NewImageUploader />


            </div>
        )
    }
}


App.contextTypes = {
  router: PropTypes.object.isRequired
};

module.exports =  { App, TestPage};
