var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
var Datetime = require('react-datetime');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'

import {ClippedImage , ClippedImageOverlayedText } from './elements'

import {Sidebar} from './base'
import autobind from 'class-autobind'
var Select = require('react-select');

import { KRInput, KRSelect, KRRichText, KRCheckBox } from './inputElements'
import DatePicker  from 'react-datepicker';
import moment from 'moment';

import { ImageUploader, FormHeaderWithActionButton, GoalViewEditDeleteItem, Breadcrumb, ErrorWrapper, Header } from './base'
import { Menubar, StandardSetOfComponents, ErrorReporter } from './accounts'
import { PlanForm, PlanList } from './plan'
import {ChoiceModal, IconLabelCombo} from './elements'
import { Textfit } from 'react-textfit';

import { theServer, s3IconUrl, formats, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, userSharingOptions } from './constants'

import Measure from 'react-measure'

import Pagination from "react-js-pagination";

import { Provider, connect, dispatch } from 'react-redux'
import  {store} from "./redux/store";

import { mapStateToProps, mapDispatchToProps } from './redux/containers2'

import { setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, addGoal, updateGoal, deleteGoal, setContacts, setStepOccurrences } from './redux/actions'
import PropTypes from 'prop-types';
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'



export class BlogPage extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: [],
            prerenderReady: false

        }
    }

    componentDidMount() {
        this.getPosts();
        this.setState({prerenderReady: false})
    }

    getPosts = () => {
        var theUrl = '/api/blogPosts/';
        $.ajax({
            method: 'GET',
            url: theUrl,
            datatype: 'json',
            headers: {
            },
            success: function(data) {
                this.setState({
                    data: data.results,
                    prerenderReady: true
                })
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(theUrl, status, err.toString());
            //var serverErrors = xhr.responseJSON;
            //this.setState({
            //    serverErrors:serverErrors,
            //})
        }
        })

    };

    render() {
        if (this.state.data != undefined) {
            return (
                <div>
                    <StandardSetOfComponents />
                    <div className="fullPageDiv">
                        <div className="ui  container footerAtBottom">


                            <div className="spacer">&nbsp;</div>
                            <div className="ui large breadcrumb">
                                <Link to={`/`}>
                                    <div className="section">Home</div>
                                </Link>

                                <i className="right chevron icon divider"></i>
                                <Link to={`/blog`}>
                                    <div className="active section">Blog</div>
                                </Link>
                            </div>
                            <div>&nbsp;</div>
                            <Header headerLabel="Blog"/>
                            <div className="ui grid">

                                <BlogPostList data={this.state.data}/>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div>
                    <StandardSetOfComponents />
                    <div className="fullPageDiv">
                    </div>
                </div>
            )

        }
    }

}

export class BlogPostList extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: []

        }
    }

    componentDidMount (){
        this.setState({
            data: this.props.data
        })

}

    componentWillReceiveProps(nextProps) {
        if (this.state.data != nextProps.data) {
            this.setState({
                data:nextProps.data
            })
        }
    }
    getBlogPosts () {
        var theBlogPosts = null;

                if (this.state.data != null) {

        theBlogPosts = this.state.data.map(function(post)  {
            return (
                <BlogPost key={`ref_blogPost_${post.id}`} title={post.title} description={post.description} authorName={post.authorName} date={post.modified}/>
            )
        })}
        return theBlogPosts
    }
    render() {
        var theBlogPosts = this.getBlogPosts();
        return(<div className="ui grid" style={{marginLeft:0}}>
            {theBlogPosts}
            </div>)
    }
}


export class BlogPost extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            title: "",
            description: "",
            authorName: "",
            date: "",
        }
    }

    render() {
        var theDate = moment(this.props.date).format('MMMM Do YYYY');
        return (
            <div className="ui row">

                <div className="ui header"><h2>{this.props.title}</h2></div>
                <div className="ui grid">
                    <div className="ui row">
                        <div className="ui eight wide column">
                            <div className="fluid row" dangerouslySetInnerHTML={{__html: this.props.description}}/>
                        </div>
                        </div>

                        <div className="ui row">
                            <div className="ui eight wide column">



                            <div style={{color:'gray', fontStyle:'italic'}}>By {this.props.authorName} on {theDate}</div>
                                                        </div>
                        </div>

                    </div>
                <div className="ui spacer">&nbsp;</div>
                </div>


        )
    }

}

module.exports = {BlogPage};
