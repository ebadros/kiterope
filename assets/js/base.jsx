var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'

var ReactS3Uploader = require('react-s3-uploader');
var S3Upload = require('react-s3-uploader/s3upload')

import {SaveButton } from './settings'

import autobind from 'class-autobind'
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'
import { GoalForm, GoalBasicView } from './goal'
import { UpdateItemMenu } from './update'


import { VisualizationItemMenu, VisualizationBasicView } from './visualization'


import { PlanForm, PlanBasicView, SimplePlanForm } from './plan'
import { ProgramBasicView, ProgramSubscriptionModal, ProgramItemMenu, ProgramSubscriptionForm } from './program'

import { StepModalForm, StepBasicView, StepDetailView, StepItemMenu } from './step'
import { ProfileItemMenu, ProfileForm, ProfileBasicView } from './profile'


import { ItemMenu } from './elements'
import  {store} from "./redux/store";


import { updateStep, setGoalModalData, setProfileModalData, setStepModalData, removePlan, deleteContact, setProgramModalData, setVisualizationModalData, setMessageWindowVisibility, setCurrentContact, addPlan, addStep, updateProgram, deleteStep, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, addGoal, updateGoal, deleteGoal, setContacts, setStepOccurrences } from './redux/actions'

import { Provider, connect,  dispatch } from 'react-redux'
import { mapStateToProps, mapDispatchToProps } from './redux/containers2'
import Measure from 'react-measure'


import { Menubar, SignInOrSignUpModalForm, StandardSetOfComponents, ErrorReporter } from './accounts'

import {  selectImageStyle, cropImageStyle, theServer, s3BaseUrl, s3IconUrl,  frequencyOptions, programScheduleLengths, timeCommitmentOptions, costFrequencyMetricOptions, viewableByOptions, formats, customStepModalStyles,TINYMCE_CONFIG, times, durations, userSharingOptions, notificationSendMethodOptions,metricFormatOptions } from './constants'

import { ContactItemMenu } from './contact'
function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'
import ImageCompressor from '@xkeshi/image-compressor';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';

const uuidv4 = require('uuid/v4');

var Global = require('react-global');

$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Connection', 'keep-alive');
        xhr.setRequestHeader('Authorization', 'Token ' + localStorage.token);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '* ' );


    }
});

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

<Global values={{
  isSidebarVisible: 'false'
}} />;


export class Header extends React.Component {
     constructor(props) {
        super(props);
        autobind(this);
        this.state = {

        }
     }






    render() {
        return (
            <div className="ui one column grid" >

        <div className="ui column header"><h1>{this.props.headerLabel}</h1></div>


                        </div>
        )
}
}

export class FormHeaderWithActionButton extends React.Component {
     constructor(props) {
        super(props);
        autobind(this);

        this.state = {
            buttonLabel:"",
            showingForm:false

        }
     }

    componentDidMount() {
        this.setState({
                buttonLabel: this.props.buttonLabel
            })
    }



    handleActionClick = () => {
        this.props.actionClick()


    };

    componentWillReceiveProps(nextProps) {
        if (this.state.buttonLabel != nextProps.buttonLabel) {
            this.setState({
                buttonLabel: nextProps.buttonLabel
            })
        }



        if (this.state.showingForm != nextProps.formIsOpen) {
            this.setState({
                showingForm: nextProps.showingForm
            })
        }
    }





render() {

        return (
            <div className="ui three column stackable grid" >

        <div className="ui column header">
            <h1>{this.props.headerLabel}</h1>
        </div>
                    <div className="ui right floated column">
                        <div className={`ui right floated ${this.props.color} medium fluid button`} onClick={this.handleActionClick}>{this.state.buttonLabel}</div>
                    </div>
                        </div>
        )

}




}





var FormAction = React.createClass({
    componentDidMount: function() {
        $(this.refs[this.props.actionFormRef]).hide()
    },
    toggle: function() {
        $(this.refs[this.props.actionFormRef]).slideToggle();
        $(this.refs['clickToToggleButton']).toggle()
    },

    handleSubmit: function(e) {
        e.preventDefault();
        var title = this.state.title;
        var viewableBy = this.state.viewableBy;
        var description = this.state.description;


        if (!description || !title ) {
        return;
        }
        this.props.onFormSubmit({title: title, viewableBy:viewableBy, description: description});
        this.setState({title: '',   description: '', viewableBy: 'Only me', });
    },


    render: function() {
        var buttonColor;
         switch(this.props.modelForm) {
            case "PlanForm":
                var theForm = new PlanForm();
                 buttonColor = "green";
                break;
            case "StepForm":
                var theForm = new StepForm();
                 buttonColor = "purple";

                break;
            default:
                 buttonColor = "blue";

                break;
        }
        return (
            <div>
            <div className="ui three column grid">
                <div className="ui column header"><h1>{this.props.pageHeadingLabel}</h1></div>
                <div className="ui right floated column">
                    <button className={`ui right floated  large fluid button ${buttonColor}`} ref="clickToToggleButton" onClick={this.toggle}>{this.props.actionButtonLabel}</button>
                </div>
            </div>
            <div ref={`${this.props.actionFormRef}`}><div className="ui form"><form onSubmit={this.handleSubmit}>
        <forms.RenderForm form={theForm} enctype="multipart/form-data" ref="theFormRef" />

                <div className="ui three column grid">
                                        <div className="ui row">&nbsp;</div>

                    <div className="ui row">
                        <div className="ui column">&nbsp;</div>


                                <div className="ui column"><button className="ui fluid button" onClick={this.toggle}>Cancel</button></div>
                                <div className="ui  column"><button type="submit" className="ui primary fluid button">Save</button></div>


                    </div></div>
</form></div>
            </div>
            </div>
        )
    }
});



var DynamicSelectButton2 = React.createClass({
    componentDidMount: function() {
        var self = this;
    },

    getInitialState: function() {
        return {
            value: this.props.initialValue,
        }
    },

  render: function () {
      var htmlToRender = "<div className='field'><label htmlFor='" + this.props.id + "'>" + this.props.label + "</label>";
      htmlToRender += "<select id='" + this.props.id + "' name='" + this.props.initialValue + "' >" ;

      for(var currentItem in this.props.items) {
          if (this.props.initialValue == currentItem){
              htmlToRender += "<option selected='selected' value='";
          }
          else {
              htmlToRender += "<option value='";
          }
          htmlToRender += "<option value='";
          htmlToRender += String(this.props[currentItem]);
          htmlToRender += "'>";
          htmlToRender += String(currentItem);
          htmlToRender += "</option>";

      }
      htmlToRender += "</select>";
    htmlToRender += "</div>";
    return (
<div dangerouslySetInnerHTML={{__html: htmlToRender}} />
      );

  }
});

var TimePicker = React.createClass({
    render: function(){
        return <Datetime
            renderDay={ this.renderDay }
            renderMonth={ this.renderMonth }
            renderYear={ this.renderYear }
        />;
    },
    renderDay: function( props, currentDate, selectedDate ){
        return "";
    },
    renderMonth: function( props, month, year, selectedDate){
        return "";
    },
    renderYear: function( props, year, selectedDate ){
        return "";
    }
});




var Sidebar = React.createClass({
    render: function() {

        if (Global.get('sidebarVisible') == 'true') {
            var isSidebarVisible = "";
        } else {
            var isSidebarVisible = "";
    }
        return (

            <div className={`ui left vertical inverted labeled icon ${isSidebarVisible} sidebar menu`}>
                            <div className="sidebar-spacer">&nbsp;</div>

                <Link className="item" to="/">
        <i className="home icon"></i>
        Home
    </Link>
    <Link className="item" to="/goals">
        <i className="block layout icon"></i>
        Goals
    </Link>
    <a className="item">
        <i className="smile icon"></i>
        Friends
    </a>
    <a className="item">
        <i className="calendar icon"></i>
        History
    </a>
    <a className="item">
        <i className="mail icon"></i>
        Messages
    </a>
    <a className="item">
        <i className="chat icon"></i>
        Discussions
    </a>
    <a className="item">
        <i className="trophy icon"></i>
        Achievements
    </a>
    <a className="item">
        <i className="shop icon"></i>
        Store
    </a>
    <a className="item">
        <i className="settings icon"></i>
        Settings
    </a>
  </div>
        )
    }
});

function getImageDimensions(imageNode) {
  var source = imageNode.src;
  var imgClone = document.createElement("img");
  imgClone.src = source;
  return {width: imgClone.width, height: imgClone.height}
}

export class VideoDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        fileUrl:"",
        s3Url:"",
        filename:"",
        progress:"",
        error:"",
        videoStyle:""}
    }



    componentDidMount() {
        this.setState({
            fileUrl:this.props.fileUrl,
        s3Url:this.props.s3Url,
        filename:this.props.filename,
        progress:this.props.progress,
        error:this.props.error,
        videoStyle:this.props.videoStyle

        })
    }

    handleGetImage () {
        var dom = ReactDOM.findDOMNode(this).children[0];


    }

    componentWillReceiveProps (nextProps) {
        if (this.state.fileUrl != nextProps.fileUrl) {
            this.setState({
                fileUrl:nextProps.fileUrl,

            })}
        if (this.state.s3Url != nextProps.s3Url) {
            this.setState({
                s3Url:nextProps.s3Url,

            })}
        if (this.state.filename != nextProps.filename) {
            this.setState({
                filename:nextProps.filename,

            })}
        if (this.state.progress != nextProps.progress) {
            this.setState({
                progress:nextProps.progress,

            })}
        if (this.state.error != nextProps.error) {
            this.setState({
                error:nextProps.error,

            })}
        if (this.state.videoStyle != nextProps.videoStyle) {
            this.setState({
                videoStyle:nextProps.videoStyle,

            })}

    }
    render() {
        return (
            <div>
                <video  style={this.props.videoStyle}  src={this.state.s3Url + "/" + this.state.filename} controls />
            </div>
        )
    }


}

export class AudioDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        fileUrl:"",
        s3Url:"",
        filename:"",
        progress:"",
        error:"",
        audioStyle:""}
    }



    componentDidMount() {
        this.setState({
            fileUrl:this.props.fileUrl,
        s3Url:this.props.s3Url,
        filename:this.props.filename,
        progress:this.props.progress,
        error:this.props.error,
        audioStyle:this.props.audioStyle

        })
    }

    handleGetImage () {
        var dom = ReactDOM.findDOMNode(this).children[0];


    }

    componentWillReceiveProps (nextProps) {
        if (this.state.fileUrl != nextProps.fileUrl) {
            this.setState({
                fileUrl:nextProps.fileUrl,

            })}
        if (this.state.s3Url != nextProps.s3Url) {
            this.setState({
                s3Url:nextProps.s3Url,

            })}
        if (this.state.filename != nextProps.filename) {
            this.setState({
                filename:nextProps.filename,

            })}
        if (this.state.progress != nextProps.progress) {
            this.setState({
                progress:nextProps.progress,

            })}
        if (this.state.error != nextProps.error) {
            this.setState({
                error:nextProps.error,

            })}
        if (this.state.audioStyle != nextProps.audioStyle) {
            this.setState({
                audioStyle:nextProps.audioStyle,

            })}

    }
    render() {
        return (
            <div>
                <audio  style={this.props.audioStyle}  src={this.state.s3Url + "/" + this.state.filename} controls />
            </div>
        )
    }


}

export class ImageDisplay extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        fileUrl:"",
        s3Url:"",
        filename:"",
        progress:"",
        error:"",
        imageStyle:""}
    }



    componentDidMount() {
        this.setState({
            fileUrl:this.props.fileUrl,
        s3Url:this.props.s3Url,
        filename:this.props.filename,
        progress:this.props.progress,
        error:this.props.error,
        imageStyle:this.props.imageStyle

        })
    }

    handleGetImage () {
        var dom = ReactDOM.findDOMNode(this).children[0];


    }

    componentWillReceiveProps (nextProps) {
        if (this.state.fileUrl != nextProps.fileUrl) {
            this.setState({
                fileUrl:nextProps.fileUrl,

            })}
        if (this.state.s3Url != nextProps.s3Url) {
            this.setState({
                s3Url:nextProps.s3Url,

            })}
        if (this.state.filename != nextProps.filename) {
            this.setState({
                filename:nextProps.filename,

            })}
        if (this.state.progress != nextProps.progress) {
            this.setState({
                progress:nextProps.progress,

            })}
        if (this.state.error != nextProps.error) {
            this.setState({
                error:nextProps.error,

            })}
        if (this.state.imageStyle != nextProps.imageStyle) {
            this.setState({
                imageStyle:nextProps.imageStyle,

            })}

    }
    render() {
        return (
            <div>
                <img style={this.props.imageStyle} src={this.state.s3Url + "/" + this.state.filename} />
            </div>
        )
    }


}

export class VideoUploader extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            video:"",
            dimensions:{
                width:"",
                height:"",
            }

        }
    }

    componentDidMount() {
        this.setState({
            //video: this.props.defaultVideoPosterImage,
            dimensions:this.props.dimensions,
            video:this.props.video

        })
    }

    handleGetImage () {
        var dom = ReactDOM.findDOMNode(this).children[0];


    }

    componentWillReceiveProps (nextProps) {
        if (this.state.video != nextProps.video) {
            this.setState({video: nextProps.video})
        }




        if (this.state.dimensions != nextProps.dimensions) {
            this.setState({dimensions:nextProps.dimensions})
        }




    }

    handleFinishedUpload (value) {
            var fullUrl = value.signedUrl;
            var fileUrl = fullUrl.split("?")[0];


            var urlForDatabase = fileUrl.replace(s3BaseUrl, "");
        this.setState({
            video:urlForDatabase.replace("uploads/", ""),
            fileUrl:fileUrl
        });



            this.setState({video: urlForDatabase});
        this.props.videoReturned({
            video:urlForDatabase
        })
    }






    render() {
        console.log("theServer " + theServer)
        var theVideo = this.state.video;
        var theFilename = theVideo.replace("uploads/", "");
        if (this.state.dimensions) {
            var {width, height} = this.state.dimensions
        }
        if (theFilename != "") {
            var style = {
            width: (width),
            height: 'auto',

            //minHeight:40,
            //backgroundColor: '#2199e8',
            //color: 'white',
            //fontSize: '1rem',
            //border: '1px solid #2199e8',
            //borderRadius: '4px',
            position: 'relative',
            cursor: 'pointer',
            textAlign:'center',
            //lineHeight:'36px',
        }

        } else {
            var style = {
                width: (width),
                height: "auto",

                minHeight: 40,
                backgroundColor: '#2199e8',
                color: 'white',
                fontSize: '1rem',
                border: '1px solid #2199e8',
                borderRadius: '4px',
                position: 'relative',
                cursor: 'pointer',
                textAlign: 'center',
                lineHeight: '36px',
            };
        }


        //var theClipping = "rect(0px," + (width - 32) + "px," + ((9 * (width - 32) / 16) - 2) + "px, 0px)";

        var videoStyle = {
            width: (width),
            textAlign:'center',
            height: "auto",
            //position: "absolute",
            //clip: theClipping

        };

        var videoUploaderProps = {
            style,
            videoStyle,
            maxFileSize: 1024 * 1024 * 50,
            server: theServer,
            s3Url: 'https://kiterope-static.s3.amazonaws.com/uploads',
            signingUrlQueryParams: {uploadType: 'avatar'},
            uploadRequestHeaders: {'x-amz-acl': 'public-read', 'Access-Control-Allow-Origin': '*'},
            signingUrl: "signS3Upload",

        };

        console.log("video " + this.state.video);


        return (
            <div>


        { this.state.video != "" ?
                    <div>
                <DropzoneS3Uploader filename={theFilename}
                                    onFinish={this.handleFinishedUpload} {...videoUploaderProps} >
                    <VideoDisplay
                        filename={theFilename} {...videoUploaderProps} /></DropzoneS3Uploader> </div >
                        :

                    <div>
                        <DropzoneS3Uploader filename={theFilename}
                                            onFinish={this.handleFinishedUpload} {...videoUploaderProps} >
                            {this.props.label}

                        </DropzoneS3Uploader></div>
        }
                </div>

        )
    }
}

export class AudioUploader extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            audio:"",
            dimensions:{
                width:"",
                height:"",
            }

        }
    }

    componentDidMount() {
        this.setState({
            //video: this.props.defaultVideoPosterImage,
            dimensions:this.props.dimensions,
            audio:this.props.audio

        })
    }

    handleGetImage () {
        var dom = ReactDOM.findDOMNode(this).children[0];


    }

    componentWillReceiveProps (nextProps) {
        if (this.state.audio != nextProps.audio) {
            this.setState({audio: nextProps.audio})
        }




        if (this.state.dimensions != nextProps.dimensions) {
            this.setState({dimensions:nextProps.dimensions})
        }




    }

    handleFinishedUpload (value) {
            var fullUrl = value.signedUrl;
            var fileUrl = fullUrl.split("?")[0];


            var urlForDatabase = fileUrl.replace(s3BaseUrl, "");
        this.setState({
            audio:urlForDatabase.replace("uploads/", ""),
            fileUrl:fileUrl
        });



            this.setState({audio: urlForDatabase});
        this.props.audioReturned({
            audio:urlForDatabase
        })
    }






    render() {
        var theAudio = this.state.audio;
        var theFilename = theAudio.replace("uploads/", "");
        if (this.state.dimensions) {
            var {width, height} = this.state.dimensions
        }
        if (theFilename != "") {
            var style = {
            width: (width),
            height: 'auto',

            //minHeight:40,
            //backgroundColor: '#2199e8',
            //color: 'white',
            //fontSize: '1rem',
            //border: '1px solid #2199e8',
            //borderRadius: '4px',
            position: 'relative',
            cursor: 'pointer',
            textAlign:'center',
            //lineHeight:'36px',
        }

        } else {
            var style = {
                width: (width),
                height: "auto",

                minHeight: 40,
                backgroundColor: '#2199e8',
                color: 'white',
                fontSize: '1rem',
                border: '1px solid #2199e8',
                borderRadius: '4px',
                position: 'relative',
                cursor: 'pointer',
                textAlign: 'center',
                lineHeight: '36px',
            };
        }


        //var theClipping = "rect(0px," + (width - 32) + "px," + ((9 * (width - 32) / 16) - 2) + "px, 0px)";

        var audioStyle = {
            width: (width),
            textAlign:'center',
            height: "auto",
            //position: "absolute",
            //clip: theClipping

        };

        var audioUploaderProps = {
            style,
            audioStyle,
            maxFileSize: 1024 * 1024 * 50,
            server: theServer,
            s3Url: 'https://kiterope-static.s3.amazonaws.com/uploads',
            //signingUrlQueryParams: {uploadType: 'avatar'},
            uploadRequestHeaders: {'x-amz-acl': 'public-read', 'Access-Control-Allow-Origin': '*'},
            signingUrl: "signS3Upload",

        };

        console.log("audio " + this.state.audio);


        return (
            <div>


        { this.state.audio != "" ?
                    <div>
                <DropzoneS3Uploader filename={theFilename}
                                    onFinish={this.handleFinishedUpload} {...audioUploaderProps} >
                    <AudioDisplay
                        filename={theFilename} {...audioUploaderProps} /></DropzoneS3Uploader> </div >
                        :

                    <div>
                        <DropzoneS3Uploader filename={theFilename}
                                            onFinish={this.handleFinishedUpload} {...audioUploaderProps} >
                            {this.props.label}

                        </DropzoneS3Uploader></div>
        }
                </div>

        )
    }
}

function srcToFile(src, fileName, mimeType){
    return (fetch(src)
        .then(function(res){return res.arrayBuffer();})
        .then(function(buf){return new File([buf], fileName, {type:mimeType});})
    );
}

function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    return new Blob([ab], {type: mimeString});


}
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
}

export class MyReactS3Uploader extends ReactS3Uploader {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            originalUncompressedImage:"",
            croppedImage:"",
            originalFilename:"",
            saved: "",
        }


    }

    componentDidMount() {
        this.setState({
            originalUncompressedImage:this.props.originalUncompressedImage,
            croppedImage:this.props.croppedImage,
            originalFilename: this.props.originalFilename,
            saved: this.props.saved,
        })
    }




    componentWillReceiveProps(nextProps) {
        if (this.state.originalUncompressedImage != nextProps.originalUncompressedImage) {
            this.setState({originalUncompressedImage:nextProps.originalUncompressedImage })
        }

        if (this.state.croppedImage != nextProps.croppedImage) {
            this.setState({croppedImage:nextProps.croppedImage })
        }
        if (this.state.originalFilename != nextProps.originalFilename) {
            this.setState({originalFilename:nextProps.originalFilename })
        }
        if (this.state.saved != nextProps.saved) {
            this.setState({saved: nextProps.saved})
        }
    }

    uploadFile ()   {
        this.setState({
            buttonText:"Saving..."
        })

        var theFiles = []
        var baseFilename = uuidv4()

        var croppedImageFilename = baseFilename + "-crpcmp.png"
        var fileExt = this.state.originalFilename.split('.').pop();
        var theFullFilename = baseFilename + "." + fileExt

        theFiles.push(dataURLtoFile(this.state.croppedImage, croppedImageFilename))
        theFiles.push(dataURLtoFile(this.state.originalUncompressedImage, theFullFilename))

                theFiles.push( )

        this.myUploader = new S3Upload({
            files: theFiles,
            signingUrl: this.props.signingUrl,
            getSignedUrl: this.props.getSignedUrl,
            preprocess: this.props.preprocess,
            onProgress: this.props.onProgress,
            onFinishS3Put: this.props.onFinish,
            onError: this.props.onError,
            signingUrlMethod: this.props.signingUrlMethod,
            signingUrlHeaders: this.props.signingUrlHeaders,
            signingUrlQueryParams: this.props.signingUrlQueryParams,
            signingUrlWithCredentials: this.props.signingUrlWithCredentials,
            uploadRequestHeaders: this.props.uploadRequestHeaders,
            contentDisposition: this.props.contentDisposition,
            server: this.props.server,
            scrubFilename: this.props.scrubFilename,
            s3path: this.props.s3path
        });
    }
    handleCancelEdit() {
        this.props.cancelEdit()
    }

    render() {
        if(this.props.theDataForFile != "") {
            var leftButtonStyle = {
             overflow: 'hidden',
             display: 'inline-block',
             color: 'white',
             border: '1px solid #C3C4C6',
             borderRadius: '4px',
             position: 'relative',
             cursor: 'pointer',
             textAlign: 'center',

             fontWeight: 'bold',
             width: '195px',
             height: '50px',
            marginRight:'10px'
         }

         var rightButtonStyle = {
             overflow: 'hidden',
             display: 'inline-block',
             color: 'white',
             border: '1px solid #2199e8',
             borderRadius: '4px',
             position: 'relative',
             cursor: 'pointer',
             textAlign: 'center',

             fontWeight: 'bold',
             width: '195px',
             height: '50px',
         }


            return (<div><div className="ui large fluid grey button" style={leftButtonStyle} onClick={this.handleCancelEdit}>Cancel</div>
                <SaveButton style={rightButtonStyle} saved={this.state.saved} clicked={this.uploadFile} />
</div>)
        } else return(
            <div></div>
        )
    }
}

function readFileAsDataURL(file){
    var reader = new FileReader();

        reader.onload = (function (file) {
        return function (e) {
         var data = this.result;
            this.setState({originalUncompressedImage:data})
     }
})(file);

    reader.readAsDataURL(file)

}

function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name and extension
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?'+ // port
  '(\\/[-a-z\\d%@_.~+&:]*)*'+ // path
  '(\\?[;&a-z\\d%@_.,~+&:=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

export class NewImageUploader extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        var theImage
        this.state = {
            croppableImage:"",
            image:"",
            originalUncompressedImage:"",
            cropperCropboxData:"",
            originalFilename:"",
            theCompressedImageBlob:"",
            finalImage:"",
            editMode:false,
            saved: "Saved"
        }
    }

    componentDidMount() {
        if (this.props.croppableImage != undefined) {
            this.setState({
                croppableImage: this.props.croppableImage,
                image: this.props.croppableImage.image,
                originalUncompressedImage: this.props.croppableImage.originalUncompressedImage,

                cropperCropboxData: this.props.croppableImage.cropperCropboxData,

            }, () => {
                if (this.props.croppableImage.cropperCropboxData != undefined) {
                    this.refs.cropper.setCropBoxData(this.state.croppableImage.cropperCropboxData)
                }

            })
        }
    }

    componentWillReceiveProps (nextProps) {
         if (nextProps.croppableImage != undefined) {
             if (this.state.croppableImage != nextProps.croppableImage) {
                 this.setState({
                     croppableImage: nextProps.croppableImage,
                     image: nextProps.croppableImage.image,
                     originalUncompressedImage: nextProps.croppableImage.originalUncompressedImage,

                     cropperCropboxData: nextProps.croppableImage.cropperCropboxData,


                 }, () => {
                                     if (nextProps.croppableImage.cropperCropboxData != undefined) {

                                         this.refs.cropper.setCropBoxData(this.state.croppableImage.cropperCropboxData)
                                     }


                 })


             }
         }



    }

    readFileAsDataURL(file){
    var reader = new FileReader();
    const scope = this
        reader.onload = function (e) {
            scope.setState({originalUncompressedImage:e.target.result})


     }
    reader.readAsDataURL(file)
    }


  handleReplaceFile (e) {
      const file = e.target.files[0];
        if (!file) {
            return;
     }
     this.setState({
          originalFilename: file.name,
          saved: "Save"
      })
     let url = URL.createObjectURL(file)
      this.readFileAsDataURL(file)
      this.setState({originalUncompressedImage: url}, () => {
          this.refs.cropper.setCropBoxData(this.state.cropperCropboxData)

      })

  }


    crop(){

        console.log("cropbox data")
        console.log(this.state.cropperCropboxData)

        var theCurrentCropboxData = this.refs.cropper.getCropBoxData()
        let theFinalImage = this.refs.cropper.getCroppedCanvas().toDataURL()
        if (this.state.cropperCropboxData != undefined ) {
            if (theCurrentCropboxData.left != this.state.cropperCropboxData.left
                || theCurrentCropboxData.right != this.state.cropperCropboxData.right
                || theCurrentCropboxData.width != this.state.cropperCropboxData.width
                || theCurrentCropboxData.height != this.state.cropperCropboxData.height) {
                this.setState({
                    saved: "Save"
                })
            } else {
                this.setState({
                    saved: "Saved"
                })
            }
        } else {
            this.setState({
                    saved: "Saved"
                })
        }



        //var cropboxData = this.refs.cropper.getCropBoxData()

      this.setState({
          finalImage: theFinalImage,
          //cropperCropboxData: cropboxData,

      })

    }




    onProgress = (progress, textState, file) => {
    this.props.onProgress && this.props.onProgress(progress, textState, file)
    this.setState({progress})
  }

  onError = err => {
    this.props.onError && this.props.onError(err)
    this.setState({error: err, progress: null})
  }

  onFinish = (info, file) => {
    const filenames = this.state.filenames || []
    const filename = file.name
    filenames.push(filename)
    const newState = {filename, filenames, error: null, progress: null}
    this.setState(newState, () => this.props.onFinish && this.props.onFinish(info, file))
  }

  onUploadStart(file, next) {
      var cropboxData = this.refs.cropper.getCropBoxData()
      console.log("upload Start cropboxData")
      console.log(cropboxData)



      this.setState({cropperCropboxData:cropboxData}, () => console.log("this.state.cropboxData " + this.state.cropperCropboxData))



       const imageCompressor = new ImageCompressor();


  imageCompressor.compress(file, {quality:0.8})
  .then((result) => {
      let url = URL.createObjectURL(result)

              next(result)


      })

  .catch((err) => {
        console.log("errors")

  })



  }

  handleSwitchToEditMode() {
      var theFilenameURLSplit = this.state.originalUncompressedImage.split('/')
var theFilename = theFilenameURLSplit.pop() || theFilenameURLSplit.pop()
      this.setState({originalFilename: theFilename})
      this.setState({editMode:true})
      this.refs.cropper.crop()
      if(this.state.cropperCropboxData == undefined) {
          this.refs.cropper.setCropBoxData(this.state.cropperCropboxData)
      }




      var xhr = new XMLHttpRequest();


// Use JSFiddle logo as a sample image to avoid complicating
// this example with cross-domain issues.
      if ((this.state.originalUncompressedImage != undefined ) && (this.state.originalUncompressedImage != "" ) ) {
          xhr.open("GET", this.state.originalUncompressedImage, true);
      } else {
          xhr.open("GET", this.props.defaultImage, true);

      }



// Ask for the result as an ArrayBuffer.
xhr.responseType = "arraybuffer";
      const scope = this

xhr.onload = function( e ) {
    // Obtain a blob: URL for the image data.
    var arrayBufferView = new Uint8Array( this.response );
    var blob = new Blob( [ arrayBufferView ], { type: "image/jpeg" } );
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL( blob );
          scope.readFileAsDataURL(blob)



};

xhr.send();






  }



  handleFinishedUpload (value) {
      var fullUrl = value.signedUrl;
      var fileUrl = fullUrl.split("?")[0];

      var theCropboxData = this.state.cropperCropboxData




      var theData

      if (fileUrl.includes("-crpcmp")) {
          var mergingData = {image: fileUrl, cropperCropboxData:theCropboxData }

         theData = Object.assign({}, this.state.croppableImagePostingData, mergingData )
          this.setState({croppableImagePostingData: theData})


      } else {
          var mergingData =  {originalUncompressedImage: fileUrl, cropperCropboxData:theCropboxData}
          theData = Object.assign({}, this.state.croppableImagePostingData, mergingData)
          this.setState({croppableImagePostingData: theData})
      }

      if (this.state.croppableImagePostingData.image != "" && this.state.croppableImagePostingData.originalUncompressedImage != "" && this.state.croppableImagePostingData.cropperCropboxData != undefined && this.state.croppableImagePostingData.cropperCropboxData != "") {
          var theUrl = "/api/croppableImages/";
          var theStringData = JSON.stringify(theData)



          $.ajax({
              url: theUrl,
              dataType: 'json',
              type: 'POST',
              data: theStringData,
              contentType: 'application/json',
              headers: {
                  'Authorization': 'Token ' + localStorage.token

              },
              success: function (data) {
                  this.props.imageReturned(data)
                  this.setState({
                      editMode: false,
                      saved: "Saved"
                  })


              }.bind(this),
              error: function (xhr, status, err) {

                  console.error(theUrl, status, err.toString());
                  var serverErrors = xhr.responseJSON;
                  this.setState({
                      serverErrors: serverErrors,
                  })

              }.bind(this)
          })


      }


    }





    handleCancelEdit() {

        this.setState({editMode:false,
            croppableImagePostingData: {image:"", originalUncompressedImage:"",  cropperCropboxData:"", }})

    }
    handleCropperReady() {

        if(this.state.cropperCropboxData != "") {
            console.log("inside cropper ready")
            console.log(this.state.cropperCropboxData)

            this.refs.cropper.setCropBoxData(this.state.cropperCropboxData)
        }
    }



    render() {

        if ((this.state.image != "") && (this.state.image != undefined)){
                    var theImage = this.state.image

        } else {
            var theImage = this.props.defaultImage
        }
        //var theFilename = theImage.replace("uploads/", "");


        if (this.props.forMobile) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";

           } else {


            var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }

        if (this.state.editMode == true) {
            var editInterfaceStyle = {
                visibility: 'block'
            }
            var viewInterfaceStyle = {
                display: 'none'
            }
        }
            else {
                var editInterfaceStyle = {
                display: 'none'
            }
            var viewInterfaceStyle = {
                display: 'block'
            }
            }

if (this.props.aspectRatio == 'square') {
    var theAspectRatio = 1
    var theCropperWidth = '225px'
    var theImageHeight = '400px'

} else {
    var theAspectRatio = 16/9
    var theCropperWidth = '270px'
    var theImageHeight = '225px'
}


return(
            <div className="ui grid">
                          <div className="ui row" style={editInterfaceStyle}>

                <div className={wideColumnWidth}>
<div style={{width: '225px', height: theCropperWidth, display: 'inline-block', marginBottom: '5px'}}>

            <Cropper
                ready={this.handleCropperReady}
                viewMode={2}
                ref='cropper'
                src={this.state.originalUncompressedImage}
                background={true}
                style={{width: '225px', height: '225px', float: 'left', marginBottom: '5px'}}
                aspectRatio={theAspectRatio}
                minContainerWidth={225}
                minContainerHeight={225}

                guides={false}
                scaleX={.5}
                scaleY={.5}
                autoCrop={true}
                autoCropArea={1.0}
                crop={this.crop.bind(this)}/>
     <div className="ui large fluid grey button" style={selectImageStyle}>Replace Image<input style={{
                            cursor: 'pointer',
                            opacity: '0.0',
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            bottom: '0',
                            right: '0',
                            width: '100%',
                            height: '100%'
                        }} type='file' id="file" accept="image/*" onChange={this.handleReplaceFile.bind(this)}/>
                        </div>
        </div>





                    <div style={{
                        marginLeft: '20px',
                        display: 'inline-block',
                        cursor: 'pointer',
                    }}>{this.state.finalImage != "" ?
                        <img style={{width: '400px', height: theImageHeight}} src={this.state.finalImage}/> : <div></div>}
                        <MyReactS3Uploader
                            style={cropImageStyle}
                            cancelEdit={this.handleCancelEdit}
                            originalUncompressedImage={this.state.originalUncompressedImage}
                            originalFilename={this.state.originalFilename}
                            croppedImage={this.state.finalImage}
                            signingUrl="signS3Upload"
                            signingUrlMethod="GET"
                            accept="image/*"
                            preprocess={this.onUploadStart}
                            onFinish={this.handleFinishedUpload}
                            signingUrlQueryParams={{uploadType: 'avatar'}}
                            uploadRequestHeaders={{'x-amz-acl': 'public-read', 'Access-Control-Allow-Origin': '*'}}
                            signingUrlWithCredentials={ true }
                            contentDisposition="auto"
                            scrubFilename={(filename) => filename.replace(/[^\w\d_\-.]+/ig, '')}
                            server={theServer}

                            saved={this.state.saved}
                        />
                    </div>
                </div></div>

            <div className="ui row" style={viewInterfaceStyle}>
                                       <div className={smallColumnWidth} >
                                           <div className="ui fluid image" >
                                                 <div className="ui right corner purple large label" onClick={this.handleSwitchToEditMode}>
<i className="large edit icon"></i>
                                               </div>
                                           <img style={{width: '100%', height: 'auto'}} src={theImage}/>
                                       </div>
                              </div>
                </div>
                </div>


            )

    }
}


export class ImageUploader extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            image:"",
            dimensions:{
                width:"",
                height:"",
            }

        }
    }

    componentDidMount() {
        this.setState({
            image: this.props.defaultImage,
            dimensions:this.props.dimensions

        })
    }

    handleGetImage () {
        var dom = ReactDOM.findDOMNode(this).children[0];


    }

    componentWillReceiveProps (nextProps) {
        if (this.state.image != nextProps.defaultImage) {
            this.setState({image: nextProps.defaultImage})
        }




        if (this.state.dimensions != nextProps.dimensions) {
            this.setState({dimensions:nextProps.dimensions})
        }




    }

    handleFinishedUpload (value) {
            var fullUrl = value.signedUrl;
            var fileUrl = fullUrl.split("?")[0];


            var urlForDatabase = fileUrl.replace(s3BaseUrl, "");
        this.setState({
            image:urlForDatabase.replace("uploads/", ""),
            fileUrl:fileUrl
        });



            this.setState({image: urlForDatabase});
        this.props.imageReturned({
            image:urlForDatabase
        })
    }






    render() {

        var theImage = this.state.image;
        var theFilename = theImage.replace("uploads/", "");
        if (this.state.dimensions) {
            var {width, height} = this.state.dimensions
        }
        var style = {
            width: (width - 28),
            height: 9 * (width - 28) / 16,
            border: 'dashed 2px #999',
            borderRadius: 0,
            position: 'relative',
            cursor: 'pointer',
        };


        var theClipping = "rect(0px," + (width - 32) + "px," + ((9 * (width - 32) / 16) - 2) + "px, 0px)";

        var imageStyle = {
            width: (width - 32),
            height: "auto",
            position: "absolute",
            clip: theClipping

        };

        var imageUploaderProps = {
            style,
            imageStyle,
            maxFileSize: 1024 * 1024 * 50,
            server: theServer,
            s3Url: 'https://kiterope-static.s3.amazonaws.com/uploads',
            signingUrlQueryParams: {uploadType: 'avatar'},
            uploadRequestHeaders: {'x-amz-acl': 'public-read', 'Access-Control-Allow-Origin': '*'},
            signingUrl: "signS3Upload",

        };


        return (


            <DropzoneS3Uploader filename={theFilename} onFinish={this.handleFinishedUpload} {...imageUploaderProps} >
        <ImageDisplay filename={theFilename} {...imageUploaderProps} />
            </DropzoneS3Uploader>

        )
    }
}




export class ViewEditDeleteItem extends React.Component {
     constructor(props) {
        super(props);
        autobind(this);
         this.state = {
             id:"",
             data:"",
             currentView:"",
             editable:false,
             serverErrors:""

         }
     }



     componentDidMount = () => {
         this.determineOptions();

         $(this.refs["ref_form"]).hide();
         $(this.refs["ref_detail"]).hide();

         if (this.props.currentView != undefined) {
             this.setState({
             data:this.props.data,
             currentView: this.props.currentView,
                 id: this.props.id,

         })}
         else {
             this.setState({
             data:this.props.data,
             currentView: "Basic",
                 id: this.props.id,

         })


             }
         this.handleComponentDidMountSpecificActions();

         this.showHideUIElements(this.props.currentView)


         };
         handleComponentDidMountSpecificActions() {

         }




    showHideUIElements = (callbackData) => {
        switch (callbackData) {

            case "Basic":
                this.switchToBasicView();
                break;
            case "Cancel":
                this.switchToBasicView();
                break;
            case "Detail":

                this.switchToDetailView();
                break;

            case "Edit":

                this.switchToEditView();
                break;
            case "Delete":
                this.deleteItem();
                break;
            case "Close":

                this.switchToClosedView();
                break;
            case "Duplicate":

                this.duplicateItem();
                break;

            case "Author":
                this.goToAuthorPage();
                break;

            default:
                break;


        }

    };



    duplicateItem = () => {
        var theUrl = this.props.apiUrl + this.props.id + "/duplicate";
        $.ajax({
            url: theUrl,
            dataType: 'json',
            cache: false,
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                //this.reload()

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(theUrl, status, err.toString());
            }.bind(this),


        });

    };

    determineOptions = () => {
        if (this.props.storeRoot.user != undefined) {
            if (this.props.data != undefined) {

                if (this.props.data.author != undefined) {
                    if (this.props.data.author == this.props.storeRoot.user.id) {
                        this.setState({editable: true})

                    }
                }
                else {
                    if (this.props.data.user != undefined) {
                        if (this.props.data.user == this.props.storeRoot.user.id) {
                            this.setState({editable: true})

                        }
                    }

            }

        }
    }



/*
        var theURL = this.props.apiUrl + this.props.id +"/";
      $.ajax({
      url: theURL,
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
              }
          }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(theURL, status, err.toString());
      }.bind(this),


    });*/
  };

    componentWillReceiveProps = (nextProps) => {
        if (this.state.data != nextProps.data) {
            this.setState({
                data:nextProps.data,
            })
        }

        if (this.state.currentView != nextProps.currentView) {
            this.setState({
                currentView:nextProps.currentView,
            });
            this.showHideUIElements(nextProps.currentView)
        }

        if (this.state.serverErrors != nextProps.serverErrors) {
            this.setState({
                serverErrors:nextProps.serverErrors
            })
        }

    this.handleComponentWillReceivePropsSpecificActions(nextProps)



    };

    handleComponentWillReceivePropsSpecificActions = (nextProps) => {

    };

    cancelClicked = () => {
        this.switchToBasicView()
    };

    handleClick = (callbackData) => {
        this.setState({
            currentView:callbackData
        },this.showHideUIElements(callbackData))

    };

    switchToDetailView = () => {
        $(this.refs["ref_form"]).hide();
        $(this.refs["ref_detail"]).slideDown();
                         this.setState({currentView:'Detail'})


        };

    switchToEditView = () => {
        $(this.refs["ref_basic"]).hide();
        $(this.refs["ref_form"]).slideDown();
                 this.setState({currentView:'Edit'})



        };
    switchToClosedView = () => {
        $(this.refs["ref_basic"]).show();


        $(this.refs["ref_form"]).slideUp()
    };



     switchToBasicView = () => {
         $(this.refs["ref_detail"]).hide();
         $(this.refs["ref_form"]).slideUp();
         $(this.refs["ref_basic"]).slideDown();
         this.setState({currentView:'Basic'})

    };

    getControlBar = () => {
        return(
        <ItemControlBar myRef="ref_itemControlBar"
                        label="Goal" click={this.handleClick}
                        currentView={this.state.currentView}
                        editable={this.state.editable}
                        showCloseButton={this.props.showCloseButton} />
        )
    };


    getBasicView = () => {
        return (
                        <div ref="ref_basic">

            <GoalBasicView data={this.state.data} />
                            </div>
        )
    };

    getEditView = () => {
        return(
                        <div ref="ref_form">

        <GoalForm myRef="ref_form"
                  editable={true}
                  onGoalSubmit={this.handleGoalSubmit}
                  cancelClicked={this.cancelClicked}
                  data={this.state.data}
                  serverErrors={this.state.serverErrors} />
                            </div>
        )
    };

    getDetailView = () => {
         if (this.state.data != null) {
            return (
                <div ref="ref_detail">
                    <div className="itemDetailSmall">
                        <div dangerouslySetInnerHTML={{__html: this.state.data.description}}></div>
                    </div>
                </div>
            )
        }
        else return (<div></div>)

    };


    hideComponent = () => {
        //this.props.methodChange({isVisible:false})
        $(this.refs['ref_item']).slideUp();


    };


deleteItem = () => {
        var apiUrl = this.props.apiUrl;
        var theUrl = apiUrl + this.props.id + "/";

            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'DELETE',
                headers: {
                'Authorization': 'Token ' + localStorage.token
                },
                success: () => {
                    this.hideComponent();
                    this.callDeleteReducer();
                    //this.reload()
                },
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }
            });
        };






    closeWindowButtonClicked = () => {
        this.props.methodChange({isVisible:false});


         $(this.refs["ref_form"]).slideUp();
        $(this.refs["ref_basic"]).slideDown();
            this.setState ({ editButtonLabel: "Edit"});
                this.clearState();

    };

    reload = () => {
        this.props.reloadItem()
    };

    render() {


        var controlBar = this.getControlBar();
        var detailView = this.getDetailView();
        var basicView = this.getBasicView();
        //var editView = this.getEditView();


        return (
            <div ref="ref_item">

                {controlBar}


                <div className="ui segment noBottomMargin noTopMargin noTopRadius">
                    {basicView}
                    {detailView}

                    <div className="sixteen wide row">

                        <div>

                            {editView}
                        </div>
                    </div>

                </div>

            </div>

        )
    }

}

@connect(mapStateToProps, mapDispatchToProps)
export class GoalViewEditDeleteItem extends ViewEditDeleteItem {
    constructor(props) {
        super(props);
        autobind(this);
         this.state = {
             id:"",
             data:"",
             currentView:"Basic",
             serverErrors:""
         }
     }

     callDeleteReducer() {
      store.dispatch(deleteGoal(this.props.id))

  }

  switchToEditView = () => {

        this.setState({
            modalIsOpen:true,
        }, () => {store.dispatch(setStepModalData(this.state))})
        //$(this.refs["ref_basic"]).hide();
        //$(this.refs["ref_form"]).slideDown();
        //this.props.currentViewChanged("Edit")


    };



/*
     handleGoalSubmit (goal, callback) {

         if (goal.id != "") {

             $.ajax({
                 url: "/api/goals/" + goal.id +"/",
                 dataType: 'json',
                 type: 'PUT',
                 data: goal,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     store.dispatch(updateGoal(data));

                     this.setState({

                     currentView:"Basic",
                         serverErrors:""
                     });
                     this.switchToBasicView();
                     callback



                 }.bind(this),
                 error: function (xhr, status, err) {
                     console.error(this.props.url, status, err.toString());
                      var serverErrors = xhr.responseJSON;
                     this.setState({
                            serverErrors:serverErrors,
                })

                 }.bind(this)
             });
         }
         else {
             $.ajax({
                 url: "/api/goals/",
                 dataType: 'json',
                 type: 'POST',
                 data: goal,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                                          store.dispatch(addGoal(data));

                     this.setState({
                         data: data,
                     currentView:"Basic",
                         serverErrors:""
                     });
                     this.switchToBasicView();
                     callback

                 }.bind(this),
                 error: function (xhr, status, err) {
                     console.error(this.props.url, status, err.toString());
                      var serverErrors = xhr.responseJSON;
                     this.setState({
                            serverErrors:serverErrors,
                })

                 }.bind(this)
             });
         }


  }*/

    getControlBar = () => {
        return(
        <ItemControlBar myRef="ref_itemControlBar"
                        label="Goal"
                        click={this.handleClick}
                        currentView={this.state.currentView}
                        editable={this.state.editable}
                        showCloseButton={this.props.showCloseButton} />
        )
    };


    getBasicView = () => {
        return (
                        <div ref="ref_basic">

            <GoalBasicView data={this.state.data} />
                            </div>
        )
    };

    getEditView = () => {
        return(
                        <div ref="ref_form">

        <GoalForm myRef="ref_form"
                  editable={true}
                  onGoalSubmit={this.handleGoalSubmit}
                  cancelClicked={this.cancelClicked}
                  data={this.state.data}
                  serverErrors={this.state.serverErrors}/>
                            </div>
        )
    };

    getDetailView = () => {
          if (this.state.data != null) {
            return (
                <div ref="ref_detail">
                    <div className="itemDetailSmall">
                        <div dangerouslySetInnerHTML={{__html: this.state.data.description}}></div>
                    </div>
                </div>
            )
        }
        else return (<div></div>)


    };

    render() {

        var controlBar = this.getControlBar();
        var detailView = this.getDetailView();
        var basicView = this.getBasicView();
        //var editView = this.getEditView();

        return (
            <div>
                {controlBar}


                <div className="ui segment noBottomMargin noTopMargin noTopRadius">
                    <div onClick={this.handleClick}>{basicView}</div>
                    {detailView}

                    <div className="sixteen wide row">

                        <div>

                            {editView}
                        </div>
                    </div>

                </div>

            </div>

        )
    }

}



@connect(mapStateToProps, mapDispatchToProps)
export class ProgramViewEditDeleteItem extends ViewEditDeleteItem {
    constructor(props) {
        super(props);
        autobind(this);
         this.state = {
             id:"",
             data:"",
             currentView:"Basic",
             serverErrors:"",
             openModal:false,
             modalShouldClose:false,
             userPlanOccurrenceId:"",


         }
     }

     goToAuthorPage() {

         store.dispatch(push("/profiles/" + this.state.data.author))

     }

     callDeleteReducer() {
      store.dispatch(deleteProgram(this.props.id))

  }

  deleteItem = () => {
      console.log("deleteItem patch")
        var apiUrl = this.props.apiUrl;
        var theUrl = apiUrl + this.props.id + "/";

            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'PATCH',
                data: {isActive: "false"},
                headers: {
                'Authorization': 'Token ' + localStorage.token
                },
                success: () => {
                    this.hideComponent();
                    this.callDeleteReducer();
                    //this.reload()
                },
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }
            });
        };

  switchToEditView = () => {

        this.setState({
            modalIsOpen:true,
        }, () => {store.dispatch(setProgramModalData(this.state))})
        //$(this.refs["ref_basic"]).hide();
        //$(this.refs["ref_form"]).slideDown();
        //this.props.currentViewChanged("Edit")


    };

  duplicateItem = () => {
        var theUrl = this.props.apiUrl + this.props.id + "/duplicate/";
        $.ajax({
            url: theUrl,
            dataType: 'json',
            cache: false,
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                store.dispatch(addProgram(data));

                //this.reload()

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(theUrl, status, err.toString());
            }.bind(this),


        });

    };

    handleGetDetailOnPlan = () => {
        console.log("inside here");
      store.dispatch(push("/plan/view/" + this.props.id))

};



     handleComponentDidMountSpecificActions() {
         if (this.props.userPlanOccurrenceId) {
             this.setState({userPlanOccurrenceId: this.props.userPlanOccurrenceId})
         }

         }


     reload = () => {
         this.props.reloadItem()
     };

     handleModalClick = (callbackData) => {
      switch(callbackData.action) {
          case ("existing"):
              store.dispatch(push("/search"));
              break;
          case ("create"):
              this.handleOpenForm();
              break;
          case ("kiterope"):
              store.dispatch(push("/goalEntry"));
              break;
      }
  };



  handleComponentWillReceivePropsSpecificActions = (nextProps) => {
       if (this.state.userPlanOccurrenceId != nextProps.userPlanOccurrenceId) {
          this.setState({userPlanOccurrenceId: nextProps.userPlanOccurrenceId})
      }

    };




    handleProgramSubmit (program, callback) {
         if (program.id != "") {
             var theUrl = "/api/programs/" + program.id +"/";

             $.ajax({
                 url: theUrl,
                 dataType: 'json',
                 type: 'PUT',
                 data: program,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     console.log("here's a success");
                     this.switchToBasicView();

                     store.dispatch(updateProgram(data));

                     this.setState({
                        serverErrors:"",
                         currentView:"Basic"
                     });
                     callback

                 }.bind(this),
                 error: function (xhr, status, err) {
                                          console.log("here's failer");

                     var serverErrors = xhr.responseJSON;
            this.setState({
                serverErrors:serverErrors,
            })

                 }.bind(this)
             });
         }
         else {
             var theUrl = "/api/programs/";

             $.ajax({
                 url: theUrl,
                 dataType: 'json',
                 type: 'POST',
                 data: program,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     this.setState({data: data});
                     this.switchToBasicView();
                     callback

                 }.bind(this),
                 error: function (xhr, status, err) {
                     console.error(theUrl, status, err.toString());
                     var serverErrors = xhr.responseJSON;
            this.setState({
                serverErrors:serverErrors,
            })

                 }.bind(this)
             });
         }


  }



    getControlBar = () => {
        var label;
        if (this.props.extendedBasic == true) {
            label = "Plan"
        }
        else {
            label = "Program"
        }

            return (
                <ItemControlBar myRef="ref_itemControlBar"
                                label={label}
                                click={this.handleClick}
                                currentView={this.state.currentView}
                                editable={this.state.editable}
                                showCloseButton={this.props.showCloseButton}
                                extendedBasic={this.props.extendedBasic}
                />
            )

    };


    getBasicView = () => {
            return (
                <div ref="ref_basic" >

                    <ProgramBasicView data={this.state.data} forSearch={this.props.forSearch} isListNode={this.props.isListNode}  />
                </div>
            )
        };


/*
    getEditView = () => {
        return(
                        <div ref="ref_form">

        <ProgramForm isListNode={this.props.isListNode}
                  myRef="ref_form" editable={true}
                  onProgramSubmit={this.handleProgramSubmit}
                  cancelClicked={this.cancelClicked}
                  data={this.state.data}
                  serverErrors={this.state.serverErrors} />
                            </div>
        )
    };
*/
    getDetailView = () => {

        if (this.state.data != null) {
            return (
                <div ref="ref_detail">
                    <div className="itemDetailSmall">
                        <div dangerouslySetInnerHTML={{__html: this.state.data.description}}></div>
                    </div>
                </div>
            )
        }
        else return (<div></div>)


    };

    handleModalClosed = () =>  {
        this.setState({
            signInOrSignUpModalFormIsOpen:false,
        })
    };

    handleSubscribeClick = () => {
        if (this.props.storeRoot.user != undefined) {
            this.setState({
                    openModal: true
                })

            }
         else {
            this.setState({
                    signInOrSignUpModalFormIsOpen: true
                })
        }

    };


    handleCloseModalClicked = () => {
        this.setState({openModal:false})
    };


hideComponent = () => {
        //this.props.methodChange({isVisible:false})
        $(this.refs['ref_programItem_' + this.props.id]).slideUp();


    };

    handleUnsubscribeClick = () => {
        if (this.state.userPlanOccurrenceId) {
            var theUrl = "/api/planOccurrences/" + this.state.userPlanOccurrenceId + "/";
            var planOccurrence = {
                isSubscribed: false,

            };
            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'PATCH',
                data: planOccurrence,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    console.log("success");
                    this.state.data.isSubscribed = false;
                    store.dispatch(removePlan(this.state.userPlanOccurrenceId))


                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                    //var serverErrors = xhr.responseJSON;
                    //   this.setState({
                    //       serverErrors:serverErrors,
                    //})

                }.bind(this)
            });
        }

    };




    render() {

        var controlBar = this.getControlBar();
        var detailView = this.getDetailView();
        var basicView = this.getBasicView();
        //var editView = this.getEditView();


        if (this.state.data) {
            if (this.state.data.isSubscribed) {
                var subscribeButton = <div className="ui purple bottom attached large button"
                                           onClick={this.handleUnsubscribeClick}>Unsubscribe</div>

            } else if (!this.state.data.isSubscribed) {

                var subscribeButton = <div className="ui purple bottom attached large button"
                                           onClick={this.handleSubscribeClick}>Subscribe</div>
            }

        }
        if (this.props.storeRoot.user) {
            if ((this.state.data.author == this.props.storeRoot.user.id) && (this.props.extendedBasic != true)){
                subscribeButton = null
            }
        }








        return (

            <div ref={`ref_programItem_${this.props.id}`} className="ui column" >
                <SignInOrSignUpModalForm modalIsOpen={this.state.signInOrSignUpModalFormIsOpen} modalShouldClose={this.handleModalClosed} />

                                {this.props.hideControlBar ? null : controlBar}

                <ProgramSubscriptionModal  closeModalClicked={this.handleCloseModalClicked}
              click={this.handleModalClick}
              modalIsOpen={this.state.openModal}
              header="Subscribe to a plan"
              description="You can subscribe to a plan created by a coach, create your own plan, or let Kiterope create a plan for you."
              program={this.state.data}
/>
                <div className="ui segment noBottomMargin noTopMargin noTopRadius">
                    <div>{basicView}</div>
                    {detailView}



                </div>{subscribeButton}

                </div>

        )
    }

}

@connect(mapStateToProps, mapDispatchToProps)
export class PlanViewEditDeleteItem extends ViewEditDeleteItem {
    constructor(props) {
        super(props);
        autobind(this);
         this.state = {
             id:"",
             data:"",
             occurrenceData:"",
             currentView:"Basic",
             serverErrors:"",
             openModal:false,

         }
     }

     handleComponentDidMountSpecificActions() {
     this.setState({
         data:this.props.data,
         occurrenceData:this.props.data,
     })
}
    handleComponentWillReceivePropsSpecificActions(nextProps) {
    if (this.state.occurrenceData != nextProps.occurrenceData) {
        if (nextProps.occurrenceData != undefined) {
            this.setState({
                occurrenceData: nextProps.occurrenceData,
            })

        }
    }

    if (this.state.data != nextProps.data) {
        if (nextProps.data != undefined) {
            this.setState({
                data: nextProps.data,
            })

        }
    }

}
     goToAuthorPage() {

         store.dispatch(push("/profiles/" + this.state.data.programInfo.author))

     }


     handleModalClick = (callbackData) => {
      switch(callbackData.action) {
          case ("existing"):
              store.dispatch(push("/search"));
              break;
          case ("create"):
              this.handleOpenForm();
              break;
          case ("kiterope"):
              store.dispatch(push("/goalEntry"));
              break;
      }
  };



     handlePlanSubmit (planOccurrence, callback) {

         if (planOccurrence.id != "") {
             var theUrl = "/api/planOccurrences/" + planOccurrence.id +"/";
             console.log(planOccurrence);


             $.ajax({
                 url: theUrl,
                 dataType: 'json',
                 type: 'PATCH',
                 data: planOccurrence,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     this.setState({
                         data: data.programInfo,
                         occurrenceData: data,
                        serverErrors:"",
                         currentView:"Basic"
                     });
                     this.switchToBasicView();
                     callback




                 }.bind(this),
                 error: function (xhr, status, err) {
                     console.error(theUrl, status, err.toString());
                     var serverErrors = xhr.responseJSON;
            this.setState({
                serverErrors:serverErrors,
            })

                 }.bind(this)
             });
         }
         else {
             $.ajax({
                 url: "/api/plans/",
                 dataType: 'json',
                 type: 'POST',
                 data: plan,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     this.setState({
                         data: data
                     });
                     this.switchToBasicView();

                     callback

                 }.bind(this),
                 error: function (xhr, status, err) {
                     console.error(this.props.url, status, err.toString());
                     var serverErrors = xhr.responseJSON;
            this.setState({
                serverErrors:serverErrors,
            })

                 }.bind(this)
             });
         }


  }




    getControlBar = () => {
        return(
        <ItemControlBar myRef="ref_itemControlBar"
                        label="Plan"
                        click={this.handleClick}
                        currentView={this.state.currentView}
                        editable={this.state.editable}
                        showCloseButton={this.props.showCloseButton}
                        extendedBasic={this.props.extendedBasic}
                        />

        )
    };




    getBasicView = () => {

            return (
                <div ref="ref_basic" >

                    <PlanBasicView data={this.state.data} occurrenceData={this.state.occurrenceData} isListNode={this.props.isListNode}/>
                </div>
            )


    };

    getEditView = () => {
        return(
                        <div ref="ref_form">

        <PlanForm isListNode={this.props.isListNode}
                  myRef="ref_form" editable={true}
                  onSubmit={this.handlePlanSubmit}
                  cancelClicked={this.cancelClicked}
                  data={this.state.data}
                  occurrenceData={this.state.occurrenceData}
                  serverErrors={this.state.serverErrors} />
                            </div>
        )
    };

    getDetailView = () => {

        if (this.state.data != null) {
            return (
                <div ref="ref_detail">
                    <div className="itemDetailSmall">
                        <div dangerouslySetInnerHTML={{__html: this.state.data.description}}></div>
                    </div>
                </div>
            )
        } else return (<div></div>)


    };

    handleSubscribeClick = () => {
        if (this.props.storeRoot.user != undefined) {
            this.setState({
                    openModal: true
                })

            }
         else {
            this.setState({
                    signInOrSignUpModalFormIsOpen: true
                })
        }

    };

    handleUnsubscribeClick = () => {
        console.log("handleSubscribeclicke");
        if (this.state.id) {
            var theUrl = "/api/planOccurrences/" + this.state.id + "/";
            var planOccurrence = {
                isSubscribed: false,

            };
            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'PATCH',
                data: planOccurrence,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    this.state.data.isSubscribed = false;
                    store.dispatch(removePlan(this.state.id))



                }.bind(this),
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                    //var serverErrors = xhr.responseJSON;
                    //   this.setState({
                    //       serverErrors:serverErrors,
                    //})

                }.bind(this)
            });
        }

    };


    handleCloseModalClicked = () => {
        this.setState({openModal:false})
    };


hideComponent = () => {
        //this.props.methodChange({isVisible:false})
        $(this.refs['ref_planOccurrenceItem_' + this.props.id]).slideUp();


    };



    render() {

        var controlBar = this.getControlBar();
        var detailView = this.getDetailView();
        var basicView = this.getBasicView();
        var editView = this.getEditView();
        var subscribeButton = <div className="ui purple bottom attached large button"
                                           onClick={this.handleSubscribeClick}>Subscribe</div>;

        if (this.state.data) {
            if (this.state.data.isSubscribed) {
                 subscribeButton = <div className="ui purple bottom attached large button"
                                           onClick={this.handleUnsubscribeClick}>Unsubscribe</div>

            }

        }


        return (
            <div ref={`ref_planOccurrenceItem_${this.props.id}`} className="column">
                                {this.props.hideControlBar ? null : controlBar}

<ProgramSubscriptionModal  closeModalClicked={this.handleCloseModalClicked}
              click={this.handleModalClick}
              modalIsOpen={this.state.openModal}
              header="Subscribe to a plan"
              description="You can subscribe to a plan created by a coach, create your own plan, or let Kiterope create a plan for you."
              program={this.state.data.programInfo}
/>

                <div className="ui segment noBottomMargin noTopMargin noTopRadius">
                    <div>{basicView}</div>
                    {detailView}
                    {editView}

                </div>{subscribeButton}

            </div>

        )
    }

}



@connect(mapStateToProps, mapDispatchToProps)
export class ProfileViewEditDeleteItem extends ViewEditDeleteItem {
    constructor(props) {
        super(props);
        autobind(this);
         this.state = {
             id:"",
             data:"",
             currentView:"Basic",
             serverErrors:"",
             editable: false,

         }
     }

     callDeleteReducer() {
        store.dispatch(deleteContact(this.props.contact))
    }

    componentDidMount = () => {

        //$(this.refs["ref_form"]).hide();
        $(this.refs["ref_detail"]).hide();

        if (this.props.currentView != undefined) {
            this.setState({
                data: this.props.data,
                currentView: this.props.currentView,

            })
        }
        else {
            this.setState({
                data: this.props.data,
                currentView: "Basic",
                serverErrors: this.props.serverErrors

            })

        }

        this.showHideUIElements(this.props.currentView)

    };

    switchToEditView = () => {

        this.setState({
            modalIsOpen:true,
        }, () => {store.dispatch(setProfileModalData(this.state))})



    };

     removeContact = () => {
        var theUrl = "/api/contacts/" + this.props.contact + "/";

            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'DELETE',
                headers: {
                'Authorization': 'Token ' + localStorage.token
                },
                success: () => {
                    this.hideComponent();
                    this.callDeleteReducer();
                    //this.reload()
                },
                error: function (xhr, status, err) {
                    console.error(theUrl, status, err.toString());
                }
            });
        };



     handleProfileSubmit (profile, callback) {

            var theURL =  "/api/profiles/" + profile.id +"/";
             $.ajax({
                 url: theURL ,
                 dataType: 'json',
                 type: 'PUT',
                 data: profile,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                              console.log("success");

                     this.switchToBasicView();

                     this.setState({
                         data: data,
                     currentView:"Basic"
                     });


                     callback



                 }.bind(this),
                 error: function (xhr, status, err) {
                                                   console.log("error");

                     console.error(theURL, status, err.toString());
                     var serverErrors = xhr.responseJSON;
            this.setState({
                serverErrors:serverErrors,
            })

                 }.bind(this),
                 complete: function (jqXHR, textStatus){
                if (textStatus == "success"){
                     this.switchToBasicView();

                }
            }.bind(this)
             });
         }



    handleComponentWillReceivePropsSpecificActions = (nextProps) => {
       if (this.state.data != nextProps.data) {
            this.setState({
                data:nextProps.data,
            })
        }



        if (this.state.id != nextProps.id) {
            this.setState({
                id:nextProps.id,
            });
            this.determineOptions()
        }
        if (nextProps.storeRoot != undefined) {
            if (this.state.user != nextProps.storeRoot.user) {
                this.setState({
                    user: nextProps.storeRoot.user
                })
            }
        }if (this.state.userPlanOccurrenceId != nextProps.userPlanOccurrenceId) {
          this.setState({userPlanOccurrenceId: nextProps.userPlanOccurrenceId})
      }

    };



    handleClick = (callbackData) => {
        switch (callbackData) {
            case("Add Contact"):
                this.addAsCoach();
                break;
            case("Add as Client"):
                this.addAsClient();
                break;
            case("Remove Contact"):
                this.removeContact();
                break;
            default:
                this.setState({
                    currentView: callbackData
                }, this.showHideUIElements(callbackData));
                break;

        }
    };


    addAsCoach = () => {
        var theUrl = "/api/contacts/";
        var theContact = {
            sender:this.state.user.id,
            receiver: this.state.data.user,
            relationship: "coach",
            wasConfirmed:"sender",
        };
        $.ajax({
                 url: theUrl,
                 dataType: 'json',
                 type: 'POST',
                 data: theContact,
                 headers: {
                     'Authorization': 'Token ' + localStorage.token
                 },
                 success: function (data) {
                     store.dispatch(addContact(data))



                 }.bind(this),
                 error: function (xhr, status, err) {
                     var serverErrors = xhr.responseJSON;
            this.setState({
                serverErrors:serverErrors,
            })

                 }.bind(this)
             });

    };





    getControlBar = () => {
        if (this.props.contact != undefined) {
            var theLabel = "Contact"
        } else {
            var theLabel = "Profile"
        }

        var thePermissions = false;
        if (this.state.data) {
            thePermissions = this.state.data.permissions
        }
        return(
        <ItemControlBar myRef="ref_itemControlBar"
                        label={theLabel}
                        click={this.handleClick}
                        currentView={this.state.currentView}
                        editable={thePermissions}
                        showCloseButton={this.props.showCloseButton} />
        )
    };


    getBasicView = () => {
        return (
                        <div ref="ref_basic">

            <ProfileBasicView data={this.state.data} isListNode={this.props.isListNode} />
                            </div>
        )
    };

    /*getEditView = () => {
        return(
                        <div ref="ref_form">

        <ProfileForm isListNode={this.props.isListNode}
                     myRef="ref_form" editable={true}
                     onSubmit={this.handleProfileSubmit}
                     cancelClicked={this.cancelClicked}
                     data={this.state.data}
        serverErrors={this.state.serverErrors} />
                            </div>
        )
    };*/

    getDetailView = () => {

        return (
            <div ref="ref_detail">
                            <div className="itemDetailSmall">
                                <div dangerouslySetInnerHTML={{__html: this.state.data.bio}} ></div>
                            </div>
                </div>
        )


    };
    handleContactClicked =() => {
        store.dispatch(setMessageWindowVisibility(true));
                store.dispatch(setCurrentContact(this.state.data));


    };


hideComponent = () => {
        //this.props.methodChange({isVisible:false})
        $(this.refs['ref_profileItem_' + this.props.id]).slideUp();


    };


    render() {

        var controlBar = this.getControlBar();
        var detailView = this.getDetailView();
        var basicView = this.getBasicView();

        if (this.props.storeRoot.user) {
        return (

            <div className="ui column" ref={`ref_profileItem_${this.props.id}`}  >
                {controlBar}


                <div className="ui segment noBottomMargin noTopMargin noTopRadius">
                    <div>{basicView}</div>
                    {detailView}



                </div>{ this.props.storeRoot.user.id != this.state.data.user ? <div className="ui purple bottom attached large button" onClick={this.handleContactClicked}>Contact</div>:null}

            </div>

        )}
        else return (

            <div ref={`ref_profileItem_${this.props.id}`} className="ui column">
                {controlBar}


                <div className="ui segment noBottomMargin noTopMargin noTopRadius">
                    <div>{basicView}</div>
                    {detailView}



                </div><div className="ui purple bottom attached large button" onClick={this.handleContactClicked}>Contact</div>

            </div>

        )
    }

}

@connect(mapStateToProps, mapDispatchToProps)
export class StepViewEditDeleteItem extends ViewEditDeleteItem {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            id: "",
            data: "",
            currentView: "",
            editable: false,
            serverErrors: ""

        }
    }

    duplicateItem = () => {
        var theUrl = this.props.apiUrl + this.props.id + "/duplicate/";
        $.ajax({
            url: theUrl,
            dataType: 'json',
            cache: false,
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                store.dispatch(addStep(this.props.parentId, data));

                this.reload()

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(theUrl, status, err.toString());
            }.bind(this),


        });

    };

    callDeleteReducer() {
        store.dispatch(deleteStep(this.props.parentId, this.props.id))
    }

    switchToEditView = () => {

        this.setState({
            modalIsOpen:true,
        }, () => {store.dispatch(setStepModalData(this.state))})
        //$(this.refs["ref_basic"]).hide();
        //$(this.refs["ref_form"]).slideDown();
        //this.props.currentViewChanged("Edit")


    };

    switchToBasicView = () => {
        $(this.refs["ref_detail"]).hide();
        //$(this.refs["ref_form"]).slideUp();
        $(this.refs["ref_basic"]).slideDown();
        this.props.currentViewChanged("Basic")

    };

    componentDidMount = () => {

        //$(this.refs["ref_form"]).hide();
        $(this.refs["ref_detail"]).hide();

        if (this.props.currentView != undefined) {
            this.setState({
                data: this.props.data,
                currentView: this.props.currentView,

            })
        }
        else {
            this.setState({
                data: this.props.data,
                currentView: "Basic",
                serverErrors: this.props.serverErrors

            })

        }

        this.showHideUIElements(this.props.currentView)

    };


    reload = () => {
        this.props.reloadItem()
    };

    /*
    handleStepSubmit = (step, callback) => {
        if (step.id != undefined) {

            var theUrl = "/api/steps/" + step.id + "/";
            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'PUT',
                data: step,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    store.dispatch(updateStep(data.program, data));

                    this.setState({
                        updates:[],
                    });

                    this.switchToBasicView();
                    callback;
                    this.reload()


                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                    })

                }.bind(this)
            });
        }
        else {

            $.ajax({
                url: "/api/steps/",
                dataType: 'json',
                type: 'POST',
                data: step,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    store.dispatch(addStep(data.program, data));
                    this.switchToBasicView();
                    callback;
                    //this.reload()


                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                    })

                }.bind(this)
            });
        }


    };*/

    switchToClosedView = () => {
        this.props.closeClicked();
        this.switchToBasicView();

        //$(this.refs["ref_basic"]).show()


        //$(this.refs["ref_form"]).slideUp()
    };


    getControlBar = () => {

        var thePermissions = false;
        if (this.state.data) {
            thePermissions = this.state.data.permissions
        }

        return (
            <ItemControlBar myRef="ref_itemControlBar"
                            label="Step"
                            click={this.handleClick}
                            currentView={this.state.currentView}
                            editable={thePermissions}
                            showCloseButton={this.props.showCloseButton}/>
        )
    };


    getBasicView = () => {
        return (
            <div ref="ref_basic" >

                <StepBasicView data={this.state.data}
                               isListNode={this.props.isListNode}/>
            </div>
        )
    };

/*getEditView = () => {

            return (
                <div ref="ref_form">

                    <StepForm parentId={this.props.parentId}
                              isListNode={this.props.isListNode}
                              myRef="ref_form"
                              editable={true}
                              onSubmit={this.handleStepSubmit}
                              cancelClicked={this.cancelClicked}
                              data={this.state.data}
                              serverErrors={this.state.serverErrors}/>
                </div>
            )

    };*/


    getDetailView = () => {
        return (
            <div ref="ref_detail">
                <div className="row">&nbsp;</div>
                <StepDetailView data={this.state.data}
                                isListNode={this.props.isListNode}/>
                {/* <SimpleStepForm  parentId={this.props.parentId} isListNode={this.props.isListNode} editable={false} data={this.state.data} />*/}
            </div>
        )


    };

     /*handleClick() {
         if (this.props.id) {
             hashHistory.push("/steps/" + this.props.id + "/updates")
         }
     }*/

    render() {
        var controlBar = this.getControlBar();
        var detailView = this.getDetailView();
        var basicView = this.getBasicView();
        //var editView = this.getEditView();


        return (
            <div ref={`ref_stepItem_${this.props.id}`} className="column">
                {controlBar}


                <div className="ui segment noBottomMargin noTopMargin noTopRadius">
                    <div>{basicView}</div>
                    {detailView}

                    <div className="sixteen wide row">

                        <div>

                            {/*{editView}*/}
                        </div>
                    </div>

                </div>


            </div>
        )


    }
}


@connect(mapStateToProps, mapDispatchToProps)
export class VisualizationViewEditDeleteItem extends ViewEditDeleteItem {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            id: "",
            data: "",
            currentView: "",
            editable: false,
            serverErrors: ""

        }
    }

    duplicateItem = () => {
        var theUrl = this.props.apiUrl + this.props.id + "/duplicate/";
        $.ajax({
            url: theUrl,
            dataType: 'json',
            cache: false,
            type: 'GET',
            headers: {
                'Authorization': 'Token ' + localStorage.token
            },
            success: function (data) {
                store.dispatch(addVisualization(this.props.parentId, data));

                this.reload()

            }.bind(this),
            error: function (xhr, status, err) {
                console.error(theUrl, status, err.toString());
            }.bind(this),


        });

    };

    callDeleteReducer() {
        store.dispatch(deleteVisualization(this.props.parentId, this.props.id))
    }

    switchToEditView = () => {

        this.setState({
            modalIsOpen:true,
        }, () => {store.dispatch(setVisualizationModalData(this.state))})
        //$(this.refs["ref_basic"]).hide();
        //$(this.refs["ref_form"]).slideDown();
        //this.props.currentViewChanged("Edit")


    };

    switchToBasicView = () => {
        //$(this.refs["ref_form"]).slideUp();
        $(this.refs["ref_basic"]).slideDown();
        this.props.currentViewChanged("Basic")

    };

    componentDidMount = () => {


        if (this.props.currentView != undefined) {
            this.setState({
                data: this.props.data,
                currentView: this.props.currentView,

            })
        }
        else {
            this.setState({
                data: this.props.data,
                currentView: "Basic",
                serverErrors: this.props.serverErrors

            })

        }

        this.showHideUIElements(this.props.currentView)

    };


    reload = () => {
        this.props.reloadItem()
    };



    switchToClosedView = () => {
        this.props.closeClicked();
        this.switchToBasicView();

        //$(this.refs["ref_basic"]).show()


        //$(this.refs["ref_form"]).slideUp()
    };


    getControlBar = () => {

        var thePermissions = false;
        if (this.state.data) {
            thePermissions = this.state.data.permissions
        }

        return (
            <ItemControlBar myRef="ref_itemControlBar"
                            label="Visualization"
                            click={this.handleClick}
                            currentView="UpdateBasic"
                            editable={thePermissions}
                            showCloseButton={this.props.showCloseButton}/>
        )
    };


    getBasicView = () => {
        return (
            <div ref="ref_basic" >

                <VisualizationBasicView data={this.state.data}
                               isListNode={this.props.isListNode}/>
            </div>
        )
    };



    render() {
        var controlBar = this.getControlBar();
        var basicView = this.getBasicView();
        //var editView = this.getEditView();


        return (
            <div ref={`ref_stepItem_${this.props.id}`} className="column">
                {controlBar}


                <div className="ui segment noBottomMargin noTopMargin noTopRadius">
                    <div>{basicView}</div>

                    <div className="sixteen wide row">

                        <div>

                        </div>
                    </div>

                </div>


            </div>
        )


    }
}

// <ItemControlBarButton myRef="ref_editButton" label="Edit" clicked={this.handleEditClicked} />
export class ItemControlBarButton extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
         this.state = {

         }
     }

     handleClick = (callbackData) => {
         this.props.click(callbackData)
     };



    render() {
        var theMarkup;
        switch(this.props.label) {
            case("Detail"):
                return (<div className="ui dropdown item controlButtonMargin"><div className="ui extramini image"><img className="menuIcon" src={`${s3IconUrl}viewDark.svg`} onClick={this.handleClick} /></div></div>);
            case("Edit"):
                return (<div className="ui dropdown item controlButtonMargin"><div className="ui extramini image"><img className="" src={`${s3IconUrl}editDark.svg`} onClick={this.handleClick} /></div></div>);
            case("Cancel"):
                return (<div className="ui dropdown item controlButtonMargin"><div className="ui extramini image"><img className="menuIcon"  src={`${s3IconUrl}hideDark.svg`} onClick={this.handleClick} /></div></div>);
            case("Menu"):
                switch(this.props.menuType) {
                    case("Contact"):
                        return (<ContactItemMenu click={this.handleClick}/>);
                    case("Profile"):
                        return (<ProfileItemMenu click={this.handleClick}/>);
                    case("Goal"):
                        return (<ItemMenu click={this.handleClick}/>);
                    case("Plan"):
                        return (<ItemMenu click={this.handleClick}/>);
                    case("Program"):
                        return (<ProgramItemMenu click={this.handleClick}/>);
                    case("Step"):
                        return (<StepItemMenu click={this.handleClick}/>);
                    case("Update"):
                        return (<UpdateItemMenu click={this.handleClick}/>)
                    case("Visualization"):
                        return (<VisualizationItemMenu click={this.handleClick}/>)


                }
             case("Close"):
                return (<div className="ui dropdown item controlButtonMargin"><div className="ui extramini image"><img className="menuIcon"  src={`${s3IconUrl}closeDark.svg`} onClick={this.handleClick} /></div></div>)


        }




    }
    render2() {


            return (
                <div ref={this.props.myRef}
                     className="ui column small smallPadding center aligned raspberry-inverted button"
                     onClick={this.clicked}><i className="edit icon"/></div>
            )

    }
}

export class ItemControlBarButtonSpacer extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {}
    }

    render() {

        return (

            <div ref={this.props.myRef} className="ui column">&nbsp;</div>

        )
    }
}


export class ControlBarButtonConfiguration extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            editable: false,
            currentView: "Basic", // basicView, detailView, editView
        }

    }
    componentWillReceiveProps = (nextProps) => {

            if (this.state.currentView != nextProps.currentView ) {
                    this.setState({
                        currentView:nextProps.currentView,
                    })
                }

    };

    handleCancelClicked = () => {
        this.props.click("Basic")
    };

    handleDetailClicked = () => {

        this.props.click("Detail")
    };

    handleEditClicked = () =>  {

        this.props.click("Edit")
    };

    handleDeleteClicked = () =>  {

        this.props.click("Delete")
    };

    handleMenuClicked = (callbackData) => {

        this.props.click(callbackData)
    };

    handleCloseClicked = (callbackData) => {

        this.props.click("Close")
    };



    render() {
        return(
        <div>&nbsp;</div>
        )
    }

}
export class CancelControlBar extends ControlBarButtonConfiguration {
    constructor(props) {
        super(props);
        autobind(this);

    }

    render() {
        if (this.props.showCloseButton) {
            var closeButton =  <ItemControlBarButton myRef="ref_closeButton" label="Close"
                                              click={this.handleCloseClicked}/>

        }
             var menuButton =  <ItemControlBarButton myRef="ref_menuButton" label="Menu" menuType={this.props.label}
                                              click={this.handleMenuClicked}/>;


        return (
<div style={{display:'inline-flex',  width:'100%', justifyContent:'space-between' }}>

                <div >{this.props.label}</div>
                <div>

                        {this.props.extendedBasic ? null : <ItemControlBarButton myRef="ref_cancelButton" label="Cancel"
                                              click={this.handleCancelClicked}/>  }

                    {this.props.extendedBasic ? null : menuButton }

                    {closeButton}

                    </div>
                </div>


        )

    }
}

export class DetailControlBar extends ControlBarButtonConfiguration {
    constructor(props) {
        super(props);
        autobind(this);

    }

    render() {
        if (this.props.showCloseButton) {
             var closeButton =  <ItemControlBarButton myRef="ref_closeButton" label="Close"
                                              click={this.handleCloseClicked}/>

        }

             var menuButton =  <ItemControlBarButton myRef="ref_menuButton" label="Menu" menuType={this.props.label}
                                              click={this.handleMenuClicked}/>;


        return (
<div style={{display:'inline-flex',  width:'100%',  justifyContent:'space-between' }}>

                <div >{this.props.label}</div>
                <div  >


                    {this.props.extendedBasic ? null : <ItemControlBarButton myRef="ref_detailButton" label="Detail"
                                              click={this.handleDetailClicked}/>   }
                                        {this.props.extendedBasic ? null : menuButton }


                    {closeButton}

</div>



                </div>
        )

    }
}

export class MenuControlBar extends ControlBarButtonConfiguration {
    constructor(props) {
        super(props);
        autobind(this);

    }

    render() {

        var menuButton =  <ItemControlBarButton myRef="ref_menuButton" label="Menu" menuType={this.props.label}
                                              click={this.handleMenuClicked}/>;


        return (
<div style={{display:'inline-flex',  width:'100%',  justifyContent:'space-between' }}>

                <div >{this.props.label}</div>
                <div >


                    {menuButton}

</div>



                </div>


        )

    }
}


export class EditDeleteControlBar extends ControlBarButtonConfiguration {
    constructor(props) {
        super(props);
        autobind(this);

    }

    render() {

        var menuButton =  <ItemControlBarButton myRef="ref_menuButton" label="Menu" menuType={this.props.label}
                                              click={this.handleMenuClicked}/>;


        return (
<div style={{display:'inline-flex',  width:'100%',  justifyContent:'space-between' }}>

                <div>{this.props.label}</div>
                <div>

                    <ItemControlBarButton myRef="ref_editButton" label="Edit" click={this.handleEditClicked}/>

                    {menuButton}

</div>



                </div>


        )

    }
}

export class DetailEditDeleteControlBar extends ControlBarButtonConfiguration {
    constructor(props) {
        super(props);
        autobind(this);

    }

    render() {


        if (this.props.showCloseButton) {
             var closeButton =  <ItemControlBarButton myRef="ref_closeButton" label="Close"
                                              click={this.handleCloseClicked}/>

        }
             var menuButton =  <ItemControlBarButton myRef="ref_menuButton" label="Menu" menuType={this.props.label}
                                              click={this.handleMenuClicked} style={{display:'block', width:'100%'}}/>;


        return (

<div style={{display:'inline-flex',  width:'100%', justifyContent:'space-between' }}>

                <div>{this.props.label}</div>

                <div >


                    {this.props.extendedBasic ? null : <ItemControlBarButton myRef="ref_editButton" label="Edit" click={this.handleEditClicked}/>}
                    {this.props.extendedBasic ? null : <ItemControlBarButton myRef="ref_detailButton" label="Detail"
                                              click={this.handleDetailClicked}/>}
                    {this.props.extendedBasic ? null : menuButton}
                    {closeButton}

</div>



                </div>


        )

    }
}

// <ItemControlBar myRef="ref_itemControlBar" label="Step" click={this.handleClicked} currentView="basic" />
export class ItemControlBar extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            editable: false,
            currentView: this.props.currentView, // basic, detail, edit
        }
    }
        componentDidMount() {
            this.setState({
                editable: this.props.editable,
            currentView: this.props.currentView
            })
        }


    componentWillReceiveProps(nextProps) {
        if (this.state.editable != nextProps.editable) {
            this.setState({
                editable: nextProps.editable,
            })
        }

        if (this.state.currentView != nextProps.currentView) {
            this.setState({
                currentView: nextProps.currentView,
            })
        }

    }

    handleClick = (callbackData) => {

        this.setState({currentView:callbackData});
        this.props.click(callbackData)
    };

    getButtonConfiguration = () => {
        var buttonConfiguration;

        if (this.state.editable) {
            if (this.state.currentView == "Basic" || this.state.currentView == "Edit") {
                buttonConfiguration = <DetailEditDeleteControlBar click={this.handleClick} label={this.props.label} extendedBasic={this.props.extendedBasic}/>

            } else if (this.state.currentView == "UpdateBasic" ) {
                buttonConfiguration = <EditDeleteControlBar click={this.handleClick} label={this.props.label} extendedBasic={this.props.extendedBasic}/>

            } else {
                buttonConfiguration = <CancelControlBar click={this.handleClick} label={this.props.label} extendedBasic={this.props.extendedBasic}/>
            }
        } else {
            if (this.state.currentView == "Basic" || this.state.currentView == "Edit") {
                buttonConfiguration = <DetailControlBar click={this.handleClick} label={this.props.label} extendedBasic={this.props.extendedBasic}/>
            } else if (this.state.currentView == "UpdateBasic" ) {
                buttonConfiguration = <MenuControlBar click={this.handleClick} label={this.props.label} extendedBasic={this.props.extendedBasic}/>

            }else {
                buttonConfiguration = <CancelControlBar click={this.handleClick} label={this.props.label} extendedBasic={this.props.extendedBasic}/>
            }

        }
        return buttonConfiguration
    };

    getButtonConfigurationIncludingCloseButton = () => {
        var buttonConfiguration;

        if (this.state.editable) {
            if (this.state.currentView == "Basic") {
                buttonConfiguration = <DetailEditDeleteControlBar click={this.handleClick} label={this.props.label} showCloseButton={true} extendedBasic={this.props.extendedBasic}/>
            } else {
                buttonConfiguration = <CancelControlBar click={this.handleClick} label={this.props.label} showCloseButton={true}  extendedBasic={this.props.extendedBasic}/>
            }
        } else {
            if (this.state.currentView == "Basic") {
                buttonConfiguration = <DetailControlBar click={this.handleClick} label={this.props.label} showCloseButton={true} extendedBasic={this.props.extendedBasic} />
            } else {
                buttonConfiguration = <CancelControlBar click={this.handleClick} label={this.props.label} showCloseButton={true}  extendedBasic={this.props.extendedBasic}/>
            }

        }
        return buttonConfiguration
    };


    render() {
        if (!this.props.showCloseButton) {
            var buttonConfiguration = this.getButtonConfiguration()
        } else {
            var buttonConfiguration = this.getButtonConfigurationIncludingCloseButton()
        }

        switch(this.props.label) {
            case("Goal"):
                var color = "blue";
                break;
            case("Plan"):
                var color = "green";
                break;
            case("Program"):
                var color = "green";
                break;
            case("Step"):
                var color = "red";
                break;
            case("Profile"):
                var color = "cyan";
                break;
            case("Update"):
                var color = "orange";
                break;
            case("Visualization"):
                var color = "raspberry"
                break;

        }


        return (
            <div ref={this.props.myRef} className={`ui top attached ${color} button`} style={{display:'flex',}}>

                    {buttonConfiguration}


            </div>
        )


    }
}


@connect(mapStateToProps, mapDispatchToProps)
export class Breadcrumb extends React.Component {
    constructor (props) {
        super(props);
        autobind(this);
        this.state = {
            values: ""
        }
    }

    componentDidMount() {

    }
    handleGoToURL(theUrl) {
        store.dispatch(push(theUrl))
    }

    buildBreadcrumb = () => {
        //var theBreadcrumb = '<div class="ui large breadcrumb"><a href="/"><div class="section">Home</div></a>';
        //for (var i = 0; i < this.state.values.length; i++) {
          //  <BreadcrumbElement url={this.state.values[i].url} label={this.state.values[i].label} />
            //theBreadcrumb = theBreadcrumb + '<i class="right chevron icon divider"></i>';
            //theBreadcrumb = theBreadcrumb + '<a href=#' + this.state.values[i].url + ' >';
            //theBreadcrumb = theBreadcrumb + '<div class="section">' + this.state.values[i].label + '</div></a>'
        //}
        //theBreadcrumb = theBreadcrumb + '</div>';
        if (this.props.values != undefined) {

            var theBreadcrumbs = this.props.values.map(function (value) {
                return (<BreadcrumbElement key={value.url + value.label} url={value.url} label={value.label}/>)
            });

            return theBreadcrumbs
        } else {
            return (<div></div>)
        }
    };




    render() {
            var theBreadcrumbs = this.buildBreadcrumb();
            return (
                <div className="ui large breadcrumb"><a href='javascript:;' onClick={() => this.handleGoToURL("/")}><div className="section">Home</div></a>
                    {theBreadcrumbs}
                    </div>
            )
    }
}

@connect(mapStateToProps, mapDispatchToProps)
export class BreadcrumbElement extends React.Component {
    constructor (props) {
        super(props);
        autobind(this);

    }
    handleGoToURL() {
        store.dispatch(push(this.props.url))
    }

    render() {
        return (
         <a href='javascript:;' onClick={() => this.handleGoToURL("/")}><i className="right chevron icon divider"></i><div className='section' > {this.props.label}</div></a>
     )
}
}

export class ErrorWrapper extends React.Component {
    constructor (props) {
        super(props);
        autobind(this);
        this.state = {
            errorMessage: "",

        }
    }

    render() {
        return (
      <div >

          {this.props.children}

      </div>
    )

    }

}



module.exports = {
    TimePicker,
    Sidebar,
    DynamicSelectButton2,
    GoalViewEditDeleteItem,
    PlanViewEditDeleteItem,
    Breadcrumb,


    ProgramViewEditDeleteItem,
    VideoUploader,
    AudioUploader,
    ItemControlBar,
        VisualizationViewEditDeleteItem,


    StepViewEditDeleteItem,
    ProfileViewEditDeleteItem,
    ImageUploader,
    FormHeaderWithActionButton,
    FormAction,
    Header,
    NewImageUploader

};
