var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
import autobind from 'class-autobind'
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'
import Measure from 'react-measure'
var Modal = require('react-modal');
import moment from 'moment';
import { ValidatedInput, KSSelect } from './app'


import DatePicker  from 'react-datepicker';


import { theServer, s3IconUrl, formats, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, viewableByOptions, notificationSendMethodOptions, customStepModalStyles } from './constants'
import { Textfit } from 'react-textfit';

const customModalStyles2 = {
    overlay : {

    backgroundColor   : 'rgba(0, 0, 0, 0.75)'
  },

  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    transform             : 'translate(-50%, -50%)',
      overflow                   : 'hidden',

    WebkitOverflowScrolling    : 'touch',
    borderRadius               : '4px',
    outline                    : 'none',
    padding                    : '10px 10px 30px 10px',
  }
};

function printObject(o) {
  var out = '';
  for (var p in o) {
    out += p + ': ' + o[p] + '\n';
  }
  alert(out);
}

// Component for icon or avatar + label
// Can be small or large, right or left, light or dark
// Tooltips
// <IconLabelCombo size="large" orientation="left" text="Steps" icon="plan" background="Light" link="/global"/>
export class IconLabelCombo extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

    }

    handleClick = () => {
        this.props.click(this.props.text)
    }

    render() {

        var iconName = this.props.icon


        var icon = s3IconUrl + iconName + this.props.background + ".svg"

        if (this.props.orientation == "left") {
            return (
                <div onClick={this.handleClick}>

                <img className={`ui middle aligned ${this.props.size} image`} src={icon} />
                    <span className="iconLabel">{this.props.text}</span>
                </div>

            )

        }
        else {
            return (
                <div onClick={this.handleClick}>

                <span className="iconLabel">{this.props.text}</span>
                    <img className={`ui middle aligned ${this.props.size} image`} src={icon} />

                </div>

            )

        }


    }
}

export class ContextualMenuItem extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

    }

    handleClick = () => {
        this.props.click({
            myId:this.props.myId,
            text:this.props.text
        })
    }

    render() {
        return (
                     <div className="ui item">

                <div onClick={this.handleClick} className="iconLabel">{this.props.text}</div>
            </div>

        )
    }
}


export class ItemMenu extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
     }

     handleClick = (callbackData) => {
         this.props.click(callbackData)
     }

     getProfileMenu () {

     }

     render () {
         var myStyle = { display: "block"}
         return(

                  <div className="ui simple dropdown item" >
                      <div className="ui extramini image controlButtonMargin">
                      <img src={`${s3IconUrl}menuDark.svg`} /></div>
                      <div className="menu">

                          <div className="ui item">
                              <IconLabelCombo size="extramini" orientation="left" text="Goals" icon="goal" background="Light" click={this.handleClick} />
                              </div>
                          <div className="ui item">
                            <IconLabelCombo size="extramini" orientation="left" text="Steps" icon="step" background="Light" click={this.handleClick} />
                            </div>
                          <div className="ui item">
                            <IconLabelCombo size="extramini" orientation="left" text="Author" icon="author" background="Light" click={this.handleClick} />
                            </div>
    <div className="divider"></div>

                          <div className="ui item">
                              <IconLabelCombo size="extramini" orientation="left" text="Share" icon="share" background="Light" click={this.handleClick} />
                              </div>
                          <div className="ui item">
                              <IconLabelCombo size="extramini" orientation="left" text="Delete" icon="trash" background="Light" click={this.handleClick} />
                              </div>

                      </div>
                  </div>


         )
     }

}

export class ClippedImageOverlayedText extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            dimensions: {
                width: -1,
                height: -1
            }
        }
    }

    onImgLoad({target:img}) {
        this.setState({imageHeight:img.height,
                                   imageWidth:img.width});
    }

    render () {
         var {width, height} = this.state.dimensions
         var isCircular = ""


             var width = width
             var height = height
             var containerHeight = height
             var classDescriptor = ""
             var position = "absolute"


         var heightString = containerHeight + "px !important"

         var containerStyle = {
             height: containerHeight,

         }

         var minWidthString = width + "px !important"
         var minHeightString = containerHeight + "px !important"
         var rectString = "rect(0px," + width + "px," + containerHeight + "px, 0px)"

         if (this.state.imageHeight) {
             if (this.state.imageHeight >= this.state.imageWidth) {
                 var myStyle = {
                     position: position,
                     width: width,
                     height: "auto",
                     clip: rectString,

                 }

             }
                 else {
                     var myStyle = {
                         width: width,
                         position: position,
                         clip: rectString,


                         height: containerHeight,

                     }
                 }
             }


         return(
                          <Measure onMeasure={(dimensions) => {this.setState({dimensions})}}>

             <div className="ui fluid card overlayedImageContainer" onClick={this.clearPage}>


                 <div className="image overlayedImage">
                     <div className={classDescriptor} style={containerStyle} >
                         <img className={`clippedImage ${isCircular}`} src={this.props.src} onLoad={this.onImgLoad} style={myStyle} />
                    </div>

                                    </div>
                                     <Textfit className="overlayText" style={{height:"100%"}} mode="multi">{this.props.text}</Textfit>


                            </div></Measure>
         )

     }

}

export class ClippedImage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            dimensions: {
                width: -1,
                height: -1
            }
        }
    }

    onImgLoad({target:img}) {
        this.setState({imageHeight:img.height,
                                   imageWidth:img.width});
    }
     render () {
         var {width, height} = this.state.dimensions
         var isCircular = ""

         if (this.props.item == 'plan') {
             var width = width + 30
             var height = height + 15
             var containerHeight = 9 / 16 * width
             var classDescriptor = "reverseSegmentMargin"
             var position = "absolute"

         } else if (this.props.item =='goal') {
             var width = width
             var height = height
             var containerHeight = height
             var classDescriptor = ""
             var position = "absolute"

         } else if (this.props.item =='profile') {
             var width = width - 40
             var height = width
             var containerHeight = width
             var classDescriptor = "center aligned"
             var isCircular = "ui circular image"
             var position = "relative"
         }
         var heightString = containerHeight + "px !important"

         var containerStyle = {
             height: containerHeight,

         }

         var minWidthString = width + "px !important"
         var minHeightString = containerHeight + "px !important"
         var rectString = "rect(0px," + width + "px," + containerHeight + "px, 0px)"

         if (this.state.imageHeight) {
             if (this.state.imageHeight >= this.state.imageWidth) {
                 var myStyle = {
                     position: position,
                     width: width,
                     height: "auto",
                     clip: rectString,

                 }

             } else {


                 if (this.props.item=='goal') {

                      var myStyle = {
                         position: position,
                         clip: rectString,
                         height: containerHeight,
                          width: "auto",


                     }

                 }
                 else {
                     var myStyle = {
                         width: width,
                         position: position,
                         clip: rectString,


                         height: containerHeight,

                     }
                 }
             }
         }

         return(
             <Measure onMeasure={(dimensions) => {this.setState({dimensions})}}>
                <div className={classDescriptor} style={containerStyle} >
                <img className={`clippedImage ${isCircular}`} src={this.props.src} onLoad={this.onImgLoad} style={myStyle} />
                    </div>
                </Measure>
         )

     }
}

export class ChoiceModalButton extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

    }

    handleClick() {
    this.props.click(
        {action: this.props.action}
    )
}


    render () {
        return (
            <div className={`ui fluid button choiceModalMargins ${this.props.color}`} onClick={this.handleClick} >{this.props.text}</div>


        )
    }
}

export class ChoiceModalButtonsList extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);

    }

    handleClick = (callbackData ) => {
        this.props.click({action:callbackData.action})
    }

    render() {
        var buttonList = ""

        if (this.props.buttons) {

            var buttonList = this.props.buttons.map((aButton) => {
                return (
                    <ChoiceModalButton key={aButton.text} click={this.handleClick} color={aButton.color} action={aButton.action}
                                       text={aButton.text} />
                )
            })
        }

        return (
            <div>
                {buttonList}
            </div>
        )




    }
}





export class ChoiceModal extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            modalIsOpen: false
        }
    }

    openModal () {
        this.setState({modalIsOpen: true});
    }

    componentWillReceiveProps(nextProps) {

        if (this.state.modalIsOpen != nextProps.modalIsOpen) {
            this.setState({
                modalIsOpen: nextProps.modalIsOpen
            })
        }
    }

    afterOpenModal () {
        // references are now sync'd and can be accessed.
        //this.refs.subtitle.style.color = '#f00';
    }

    closeModal = () => {
            this.setState({
                modalIsOpen: false,
            })
        this.props.closeModalClicked()

    }

    getButtons() {
        var buttonHtml = ""
        for (var i = 0; i < this.props.buttons.length; i++) {
            var currentButton = this.props.buttons[i]
            buttonHtml = buttonHtml
            return (buttonHtml)
        }
    }

    handleClick = (callbackData ) => {
        this.props.click({action:callbackData.action})
    }

    render() {
        return (<Modal
                            isOpen={this.state.modalIsOpen}
                            onAfterOpen={this.afterOpenModal}
                            onRequestClose={this.closeModal}
                            style={customModalStyles} >
            <div className="ui grid">
                <div className="right floated column noPaddingBottom ">
                <div className="ui right floated button absolutelyNoMargin" onClick={this.closeModal}><i className="large remove icon button "></i></div>
                    </div>
                </div>

            <div className="ui center aligned grid">
                    <div className="ten wide column noPaddingTop noPaddingBottom">
                        <div className="left aligned header  "><h2>{this.props.header}</h2></div>
                    </div>
                    <div className="row">
                        <div className="ten wide column noPaddingTop">
                            <div className="leftAligned" >{this.props.description}</div>
                        </div>
                        </div>
                    <div className="row"><div className="eight wide column">

                        <ChoiceModalButtonsList buttons={this.props.buttons} click={this.handleClick} />
                        </div></div>
                    </div>


            </Modal>
    )
    }
}


export class Test extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
     }

     render() {
         return(

                        <ChoiceModal header="Add a plan" description="You can subscribe to a plan created by a coach, create your own plan, or let Kiterope create a plan for you." buttons={[
                            {text:"Use an existing plan", action:"existing", color:"purple"},
                            {text:"Create your own plan", action:"create", color:"" },
                            {text:"Have Kiterope build you a plan", action:"kiterope", color:""},
                        ]} />

         )

     }
}

module.exports = { Test , IconLabelCombo , ItemMenu, ClippedImage, ChoiceModal, ContextualMenuItem, ChoiceModalButton, ChoiceModalButtonsList, ClippedImageOverlayedText }