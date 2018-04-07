var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
var Datetime = require('react-datetime');
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router'
var Modal = require('react-modal');

import {ClippedImage , ClippedImageOverlayedText } from './elements'

import {Sidebar} from './base'
import autobind from 'class-autobind'
var Select = require('react-select');
import TinyMCE from 'react-tinymce';
import TinyMCEInput from 'react-tinymce-input';

import { ValidatedInput, KSSelect } from './app'
import DatePicker  from 'react-datepicker';
import moment from 'moment';

import {GoalViewEditDeleteItem, ImageUploader,  Breadcrumb, NewImageUploader, PlanForm2, ViewEditDeleteItem, StepViewEditDeleteItem, PlanViewEditDeleteItem, FormAction,  Header, FormHeaderWithActionButton, DetailPage} from './base';
import { Menubar, StandardSetOfComponents, ErrorReporter } from './accounts'
import { PlanForm, PlanList } from './plan'
import {ChoiceModal, IconLabelCombo} from './elements'
import { Textfit } from 'react-textfit';

import { defaultGoalCroppableImage, mobileModalStyle, TINYMCE_CONFIG, theServer, s3IconUrl, userSharingOptions, loginJoinModalStyleMobile, loginJoinModalStyle, s3BaseUrl, stepModalStyle, updateModalStyle, customStepModalStyles, formats, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, planScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, times, durations, stepTypeOptions, } from './constants'

import Measure from 'react-measure'
import {SaveButton} from './settings'


import Pagination from "react-js-pagination";

import { Provider, connect, dispatch } from 'react-redux'
import  {store} from "./redux/store";

import { mapStateToProps, mapDispatchToProps } from './redux/containers2'

import { setCurrentUser, setSignInOrSignupModalData, reduxLogout, setGoalModalData, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, addGoal, updateGoal, deleteGoal, setContacts, setStepOccurrences } from './redux/actions'
import PropTypes from 'prop-types';

import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'

export const isThisReasonableOptions = [
        {value:null, label: ""},

    {value:true, label: "Yes, this is a realistic goal that challenges me."},
    {value:false, label: "This is not a realistic goal. I should rethink my goal."},
    ];

export const goalInAlignmentWithCoreValuesOptions = [
        {value:null, label: ""},

    {value:true, label: "Yes, this goal aligns with my core values."},
    {value:false, label: "No, this goal does not align with my core values. I should rethink my goal."},
    ];


$.ajaxSetup({
    beforeSend: function(xhr) {
        xhr.setRequestHeader('X-CSRFToken', getCookie('csrftoken'));
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Connection', 'keep-alive');
        xhr.setRequestHeader('Authorization', 'Token ' + localStorage.token);

    }
});

@connect(mapStateToProps, mapDispatchToProps)
export class GoalSMARTForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            title: "",
            deadline: moment(),
            description: "",
            metric: "",
            why: "",
            obstacles:"",
            image: "",
            viewableBy: "ONLY_ME",
            user: null,
            coaches: [],
            updates: [],
            wasAchieved: false,
            plans: [],
            editable:true,
            data:"",
            serverErrors: "",
            image:defaultGoalCroppableImage.image,
            croppableImage: defaultGoalCroppableImage,
            coreValues:"",
            goalInAlignmentWithCoreValues: {label:"", value:false},
            isThisReasonable:{label:"", value:false},
        }
    }

    componentDidMount() {

        this.resetForm();
        this.setState({
            serverErrors:this.props.serverErrors,
        });


        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.smartGoalFormData != undefined) {
                this.setState({smartGoalFormData:this.props.storeRoot.smartGoalFormData})
                    this.setStateToData(this.props.storeRoot.smartGoalFormData)


            }
        }

    }

    setStateToData (smartGoalFormData) {
        this.setState({
            modalIsOpen: smartGoalFormData.modalIsOpen,

        })
        if (smartGoalFormData.data != undefined ) {

            var data = smartGoalFormData.data



            var description = ""

             if (data.description != undefined) {
               description = data.description
            }



            if (data.id != undefined) {
                this.setState({
                    id: data.id,
                    saved:"Saved"
                })
            } else {
                this.setState({
                    id:"",
                    saved:"Create"
                })
            }

            if (data.croppableImageData != undefined) {
                this.setState({
                    croppableImage: data.croppableImageData
                })
            }

            if (data.deadline != undefined) {
                this.setState({
                deadline: moment(data.deadline, "YYYY-MM-DD"),
                })
            }

            this.setState({
                id: data.id,
                description: description,
                title: data.title,
                deadline: moment(),
                metric: data.metric,
                why: data.why,
                obstacles: data.obstacles,
                image: data.image,
                viewableBy: data.viewableBy,
                wasAchieved: data.wasAchieved,
                 goalInAlignmentWithCoreValues : data.goalInAlignmentWithCoreValues,
                 isThisReasonable : data.isThisReasonable

            },() => {

            });



        }
    }

    componentWillReceiveProps(nextProps) {

        if (this.state.serverErrors != nextProps.serverErrors) {
            this.setState({serverErrors: nextProps.serverErrors})
        }

        if (nextProps.storeRoot.smartGoalFormData != undefined ) {
            if (this.state.smartGoalFormData != nextProps.storeRoot.smartGoalFormData) {
                this.setState({smartGoalFormData:nextProps.storeRoot.smartGoalFormData })

                    this.setStateToData(nextProps.storeRoot.smartGoalFormData)

                }


            }





    }





    handleTitleChange(value) {
        this.setState({title: value, saved:"Save"});

    }

    handleDeadlineChange = (value)  => {
        this.setState({deadline: value, saved:"Save"});
    };

    handleDescriptionChange(e) {
        this.setState({description: e, saved:"Save"});
    }


    handleMetricChange(value) {
        this.setState({metric: value, saved:"Save"});
    }

    handleWhyChange(value) {
        this.setState({why: value, saved:"Save"});
    }
    handleObstaclesChange(value) {
        this.setState({obstacles: value, saved:"Save"});
    }

    handleDescriptionChange(value) {
        this.setState({description: value, saved:"Save"});

    }



    handleCoreValuesChange(value) {
        this.setState({coreValues: value, saved:"Save"});
    }

    handleImageChange = (callbackData) => {
        this.setState({
            image: callbackData.image,
            saved: "Save",
            croppableImage: callbackData

        })
    }
    handleViewableByChange(e) {
        this.setState({viewableBy: e.value, saved:"Save"});
    }



    handleCancelClicked() {
        store.dispatch(setGoalModalData({modalIsOpen:false, data:{}}))
        this.props.cancelClicked()
    }

    getServerErrors(fieldName) {
        if (this.state.serverErrors == undefined) {
            return ""
        } else {
            return this.state.serverErrors[fieldName]
        }
    }



    handleSubmit() {


        if (this.state.goalInAlignmentWithCoreValues && this.state.isThisReasonable) {

            if (this.props.storeRoot.user) {
                this.setState({saved: "Saving"})
                var title = this.state.title;
                var deadline = moment(this.state.deadline).format("YYYY-MM-DD");
                var image = this.state.image;
                var description = this.state.description;
                var metric = this.state.metric;


                var why = this.state.why;
                var obstacles = this.state.obstacles;
                var croppableImage = this.state.croppableImage.id;
                var coreValues = this.state.coreValues;

var goalInAlignmentWithCoreValues = this.state.goalInAlignmentWithCoreValues
                var isThisReasonable = this.state.isThisReasonable
                var viewableBy = this.state.viewableBy;
                var goalData = {
                    title: title,
                    deadline: deadline,
                    description: description,
                    metric: metric,
                    why: why,
                    obstacles: obstacles,
                    image: image,
                    croppableImage: croppableImage,
                    coreValues: coreValues,
                    goalInAlignmentWithCoreValues: goalInAlignmentWithCoreValues,
                    isThisReasonable: isThisReasonable,

                    viewableBy: viewableBy,
                    coaches: [],
                    updates: [],
                    wasAchieved: false,
                    plans: []
                };

                if (this.state.id != "") {
                    goalData.id = this.state.id
                }
                this.handleGoalSubmit(goalData)

            }
            else {
                store.dispatch(setSignInOrSignupModalData({modalIsOpen: true, form: "SignIn", data: {}}))

                this.setState({
                        signInOrSignUpModalFormIsOpen: true,
                    }
                )

            }
        } else {
            if (this.state.goalInAlignmentWithCoreValues == null) {
                this.setState({serverErrors: {goalInAlignmentWithCoreValues: ["You must confirm that the goal fits with your core values."]}})


            } else if (this.state.goalInAlignmentWithCoreValues == false) {
                this.setState({serverErrors: {goalInAlignmentWithCoreValues: ["A goal should fit within your core values. Either rethink your core values or your goal."]}})


            }

            if (this.state.isThisReasonable == null) {
                this.setState({serverErrors: {isThisReasonable: ["You must confirm that the goal is reasonable."]}})


            } else if (this.state.isThisReasonable == false)
                this.setState({serverErrors:{isThisReasonable: ["A goal should stretch you, but should be within the realm of possibility."]}})

        }
    }

        resetForm = () => {
            this.setState({
                title: "",
                deadline: moment(),
                description: "",
                metric: "",
                why: "",
                obstacles:"",
                image: null,
                viewableBy: "ONLY_ME",
                user: null,
                coaches: [],
                updates: [],
                wasAchieved: false,
                plans: [],
                image: defaultGoalCroppableImage.image,
                croppableImage:defaultGoalCroppableImage,
                goalInAlignmentWithCoreValues: null,
                isThisReasonable: null,
            },           () =>        { store.dispatch(setGoalModalData(this.state))});
        };

         handleGoalInAlignmentWithCoreValuesChange(option) {

        this.setState({goalInAlignmentWithCoreValues: option.value, saved:"Save"});
             if (option.value == null) {
                this.setState({serverErrors: Object.assign({}, this.state.serverErrors, {goalInAlignmentWithCoreValues: ["You must confirm that the goal fits with your core values."]})})


            } else if (option.value == false) {
                this.setState({serverErrors: Object.assign({}, this.state.serverErrors,  {goalInAlignmentWithCoreValues: ["A goal should fit within your core values. Either rethink your core values or your goal."]})})


            } else {
                this.setState({serverErrors: Object.assign({}, this.state.serverErrors,  {goalInAlignmentWithCoreValues: []})})
             }
    }

     handleIsThisReasonableChange(option) {
         this.setState({isThisReasonable: option.value, saved:"Save"});
         if (option.value == null) {
             //this.setState({serverErrors: {isThisReasonable: ["You must confirm that the goal is reasonable."]}})
                this.setState({serverErrors: Object.assign({}, this.state.serverErrors, {isThisReasonable: ["You must confirm that the goal is reasonable."]})})


         } else if (option.value == false) {
            // this.setState({serverErrors: {isThisReasonable: ["A goal should stretch you, but should be within the realm of possibility."]}})
                             this.setState({serverErrors: Object.assign({}, this.state.serverErrors, {isThisReasonable:  ["A goal should stretch you, but should be within the realm of possibility."]})})

         } else {
                this.setState({serverErrors: Object.assign({}, this.state.serverErrors,  {isThisReasonable: []})})
             }


    }

        getDescriptionEditor () {
            if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if (forMobile) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";

           } else {


            var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }


                if (this.state.description == null) {
                    return ("")
                } else {
                    return (<div className="ui row">
                        <div className={wideColumnWidth}>
                            <div className="field fluid">
                                <label htmlFor="id_description">Visualize your goal. Describe it as clearly as possible.</label>
                                <TinyMCEInput name="description"
                                      value={this.state.description}
                                      tinymceConfig={TINYMCE_CONFIG}
                                      onChange={this.handleEditorChange}
                        />


                            </div>
                        </div>
                        <div className="six wide column">&nbsp;</div>

                    </div>)
                }
            }

            getForm = () => {

            if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if (forMobile) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";
           } else {


            var wideColumnWidth = "twelve wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }




            if (this.state.image) {
                var imageUrl = this.state.image


            } else {
                var imageUrl = "goalItem.svg"
            }

                    var descriptionEditor = this.getDescriptionEditor();

        return ( <div className="ui page container footerAtBottom">

                                            <div className="ui form">

                                <div className="ui row">&nbsp;</div>

                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="ui blue row">
                                            <div className="ui largeType center aligned middle aligned four wide column  ">Specific</div>
                                                <div className="twelve wide column left aligned  largeType">Your goal should be
                                                    well-defined and clear. Make it as concise as possible.
                                                </div>
                                            </div>
                                            <div className="ui row bold">
                                                <div className={wideColumnWidth}>
                                                <ValidatedInput
                                                    type="text"
                                                    name="title"
                                                    label="What is your goal? (Required)"
                                                    id="id_title"
                                                    placeholder="I will run a five minute mile, I will learn to speak Chinese fluently"
                                                    value={this.state.title}
                                                    initialValue={this.state.title}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleTitleChange}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("title")}

                                            />

                                            </div>
                                                </div>

                                            {descriptionEditor}


                                        </div>
                                    </div>
                                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="ui  blue row">
                                            <div className="ui largeType center aligned middle aligned four wide column ">Measureable</div>
                                                <div className="twelve wide column left aligned  largeType">A goal should be measurable so you can judge your progress and know when it's been achieved.
                                                </div>
                                            </div>
                                            <div className="ui row">
                                                                                                <div className={wideColumnWidth}>

                                                <ValidatedInput
                                                    type="text"
                                                    name="metric"
                                                    label="How will you measure your progress?"
                                                    id="id_metric"
                                                    placeholder="time per mile, pounds, pictures, audio recording, etc. "
                                                    value={this.state.metric}
                                                    initialValue={this.state.metric}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleMetricChange}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("metric")}

                                            />
                                                                                                    </div>
                                            </div>


                                        </div>
                                    </div>
                                                 <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="ui blue row">
                                            <div className="ui largeType center aligned middle aligned four wide column ">Achievable</div>
                                                <div className="twelve wide column left aligned  largeType">To progress as fast and far as possible, you should choose a goal that stretches your abilities while being realistic so you stay motivated.
                                                </div>
                                            </div>
                                            <div className="ui row">
                                                                                                <div className={wideColumnWidth + " field"}>
                                            <label htmlFor="id_isThisReasonable">Does your goal challenge you while still being realistic?</label>
                            <KSSelect value={this.state.isThisReasonable}
                                      valueChange={this.handleIsThisReasonableChange}
                                      name="isThisReasonable" options={isThisReasonableOptions}
                                      serverErrors={this.getServerErrors("isThisReasonable")}
                                      isClearable={false}
                            /></div>
                                                </div>

                                            <div className="ui row">
                                                <div className={wideColumnWidth}>
                                                <ValidatedInput
                                                    type="textarea"
                                                    name="obstacles"
                                                    label="What obstacles have you encountered in the past or do you foresee encountering?"
                                                    id="id_obstacles"
                                                    placeholder="I sometimes skip practice if I've had a late night, My friends aren't supportive"
                                                    value={this.state.obstacles}
                                                    initialValue={this.state.obstacles}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleObstaclesChange}
                                                    rows={3}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("obstacles")}

                                            />
                                                    </div>
                                            </div>


                                        </div>
                                    </div>
                                                 <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="ui blue row">
                                            <div className="ui largeType center aligned middle aligned four wide column">Relevant</div>
                                                <div className="twelve wide column left aligned largeType">The goal should matter to you and should align with your other goals and core values. Staying motivated is much easier when you believe in what you're doing.
                                                </div>
                                            </div>
                                            <div className="ui row">
                                                                                                <div className={wideColumnWidth}>



                                                <ValidatedInput
                                                    type="textarea"
                                                    name="coreValues"
                                                    label="What are your core values and beliefs? What is important to you? What is the purpose of life to you?"
                                                    id="id_coreValues"
                                                    placeholder="Providing for my friends and family are the most important to me. I believe self-actualization is my highest goal."
                                                    value={this.state.coreValues}
                                                    initialValue={this.state.coreValues}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleCoreValuesChange}
                                                    rows={3}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("coreValues")}

                                            />
                                                                                                </div>
                                            </div>

                                            <div className="ui row ">
                                                <div className={wideColumnWidth + " field"}>

                                            <label  htmlFor="id_goalInAlignmentWithCoreValues">Is this goal in alignment with your core values?</label>
                        <KSSelect value={this.state.goalInAlignmentWithCoreValues}
                                valueChange={this.handleGoalInAlignmentWithCoreValuesChange}
                                name="goalInAlignmentWithCoreValues"
                                options={goalInAlignmentWithCoreValuesOptions}
                                  isClearable={false}

                        serverErrors={this.getServerErrors("goalInAlignmentWithCoreValues")}/>
                                            </div></div>
                                                <div className="ui row">
                                                    <div className={wideColumnWidth}>

                                                <ValidatedInput
                                                    type="textarea"
                                                    name="why"
                                                    label="Why do you want to achieve this goal?"
                                                    id="id_why"
                                                    placeholder="I want to make something of myself, I want to be around to see my daughter graduate from college."
                                                    value={this.state.why}
                                                    initialValue={this.state.why}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleWhyChange}
                                                    rows={3}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("why")}

                                            />
                                                                                                                                                        </div>
                                            </div>



                                        </div>
                                    </div>
                                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="ui blue row">
                                            <div className="ui largeType center aligned middle aligned four wide column ">Time-Bound</div>
                                                <div className="twelve wide column left aligned   largeType">Your goal should have a definite end date for best results.
                                                </div>
                                            </div>
                                            <div className="ui row">
                                                                                                <div className={wideColumnWidth + " field"}>


                                                <label htmlFor="id_deadline">What is your deadline for achieving this goal?</label>

                                                <DatePicker selected={this.state.deadline} onChange={this.handleDeadlineChange} />
                                                                                                    </div>

                                            </div>


                                        </div>
                                    </div>
                                            <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="ui blue row">
                                            <div className="ui largeType center aligned middle aligned four wide column ">Memorable</div>
                                                <div className="twelve wide column left aligned  largeType">It helps to make goals memorable.
                                                </div>
                                            </div>
                                            <div className="ui row">

                        <div className={wideColumnWidth + ' field'} >
                    <label htmlFor="id_croppableImage">Please choose a picture that will help motivate you.</label>


<NewImageUploader imageReturned={this.handleImageChange}
                  defaultImage={defaultGoalCroppableImage.image}
                  forMobile={forMobile}
                  aspectRatio="square"
                  label="Select an image that will help motivate you."
                  croppableImage={this.state.croppableImage} /></div>
            </div>

                                            <div className="ui row">
                        <div className={wideColumnWidth + ' field'}>
                    <label htmlFor="id_lengthOfSchedule">Who should be able to see this goal?</label>
                    <Select value={this.state.viewableBy} clearable={false}
                                              onChange={this.handleViewableByChange} name="viewingOptions"
                                              options={userSharingOptions}/>
                            </div>
                        </div>
                                            </div>
                                        </div>
                    </div>
                                            <div className="ui row">&nbsp;</div>

                                <div className="ui three column stackable grid">
                                    <div className="column">&nbsp;</div>
                                    <div className="column"><div className="ui large fluid button" onClick={this.handleCancelClicked} >Cancel</div></div>
                                    <div className="column">                             <SaveButton saved={this.state.saved} clicked={this.handleSubmit} />
</div>
                                    </div>
                                                </div>

        )};



        getForm2 = () => {

            if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if (forMobile) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";
           } else {


            var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }




            if (this.state.image) {
                var imageUrl = this.state.image


            } else {
                var imageUrl = "goalItem.svg"
            }

                    var descriptionEditor = this.getDescriptionEditor();

        return (
            <div className="ui page container footerAtBottom">
                                <div className="ui row">&nbsp;</div>

                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="center aligned five wide column blue ">
                                            <div className="ui ginormousType row">S</div>
                                            <div className="ui largeType row">Specific</div>
                                            <div className="ui row">
                                                <div className="left aligned">Your goal should be
                                                    well-defined and clear. Make it as concise as possible.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="eleven wide column">
                                            <div className="ui row bold">
                                                <ValidatedInput
                                                    type="text"
                                                    name="title"
                                                    label="What is your goal? (Required)"
                                                    id="id_title"
                                                    placeholder="I will run a five minute mile, I will learn to speak Chinese fluently"
                                                    value={this.state.title}
                                                    initialValue={this.state.title}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleTitleChange}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("title")}

                                            />

                                            </div>

                                                                                        <div className="ui row">&nbsp;</div>
                                            {descriptionEditor}


                                        </div>
                                    </div>
                                </div>
                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="center aligned five wide column blue ">
                                            <div className="ui ginormousType row">M</div>
                                            <div className="ui largeType row">Measurable</div>
                                            <div className="ui row">
                                                <div className="">A goal should be measurable so you can judge your progress and know when it's been achieved.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="eleven wide column">
                                            <div className="ui row">
                                                <ValidatedInput
                                                    type="text"
                                                    name="metric"
                                                    label="How will you measure your progress?"
                                                    id="id_metric"
                                                    placeholder="time per mile, pounds, pictures, audio recording, etc. "
                                                    value={this.state.metric}
                                                    initialValue={this.state.metric}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleMetricChange}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("metric")}

                                            />
                                            </div>


                                        </div>
                                    </div>
                                </div>
                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="center aligned five wide column blue ">
                                            <div className="ui ginormousType row">A</div>
                                            <div className="ui largeType row">Achievable</div>
                                            <div className="ui row">
                                                <div className="">To progress as fast and far as possible, you should choose a goal that stretches your abilities while being realistic so you stay motivated.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="eleven wide column">
                                        <div className="ui field row">
                                            <label htmlFor="id_isThisReasonable">Does your goal challenge you while still being realistic?</label>
                            <KSSelect value={this.state.isThisReasonable}
                                      valueChange={this.handleIsThisReasonableChange}
                                      name="isThisReasonable" options={isThisReasonableOptions}
                                      serverErrors={this.getServerErrors("isThisReasonable")}
                                      isClearable={false}
                            /></div>
<div className="ui row">&nbsp;</div>

                                            <div className="ui row">
                                                <ValidatedInput
                                                    type="textarea"
                                                    name="obstacles"
                                                    label="What obstacles have you encountered in the past or do you foresee encountering?"
                                                    id="id_obstacles"
                                                    placeholder="I sometimes skip practice if I've had a late night, My friends aren't supportive"
                                                    value={this.state.obstacles}
                                                    initialValue={this.state.obstacles}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleObstaclesChange}
                                                    rows={3}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("obstacles")}

                                            />
                                            </div>


                                        </div>
                                    </div>
                                </div>

                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="center aligned five wide column blue ">
                                            <div className="ui ginormousType row">R</div>
                                            <div className="ui largeType row">Relevant</div>
                                            <div className="ui row">
                                                <div className="">The goal should matter to you and should align with your other goals and core values. Staying motivated is much easier when you believe in what you're doing
                                                </div>
                                            </div>
                                        </div>
                                            <div className="eleven wide column">


                                            <div className="ui row">
                                                <ValidatedInput
                                                    type="textarea"
                                                    name="coreValues"
                                                    label="What are your core values and beliefs? What is important to you? What is the purpose of life to you?"
                                                    id="id_coreValues"
                                                    placeholder="Providing for my friends and family are the most important to me. I believe self-actualization is my highest goal."
                                                    value={this.state.coreValues}
                                                    initialValue={this.state.coreValues}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleCoreValuesChange}
                                                    rows={3}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("coreValues")}

                                            />
                                            </div>
                                            <div className="ui row">&nbsp;</div>

                                            <div className="ui field row">
                                            <label htmlFor="id_goalInAlignmentWithCoreValues">Is this goal in alignment with your core values?</label>
                        <KSSelect value={this.state.goalInAlignmentWithCoreValues}
                                valueChange={this.handleGoalInAlignmentWithCoreValuesChange}
                                name="goalInAlignmentWithCoreValues"
                                options={goalInAlignmentWithCoreValuesOptions}
                                                                        isClearable={false}

                        serverErrors={this.getServerErrors("goalInAlignmentWithCoreValues")}/>
                                            </div>
<div className="ui row">&nbsp;</div><div className="ui row">
                                                <ValidatedInput
                                                    type="textarea"
                                                    name="why"
                                                    label="Why do you want to achieve this goal?"
                                                    id="id_why"
                                                    placeholder="I want to make something of myself, I want to be around to see my daughter graduate from college."
                                                    value={this.state.why}
                                                    initialValue={this.state.why}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleWhyChange}
                                                    rows={3}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("why")}

                                            />
                                            </div>



                                        </div>
                                    </div>
                                </div>

                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="center aligned five wide column blue ">
                                            <div className="ui ginormousType row">T</div>
                                            <div className="ui largeType row">Time-Bound</div>
                                            <div className="ui row">
                                                <div className="">Your goal should have a definite end date for best results.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="eleven wide column">


                                            <div className="ui row field">
                                                <label htmlFor="id_deadline">What is your deadline for achieving this goal?</label>

                                                <DatePicker selected={this.state.deadline} onChange={this.handleDeadlineChange} />

                                            </div>


                                        </div>
                                    </div>
                                </div>
                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="center aligned five wide column  ">
                                            <div className="ui ginormousType row">&nbsp;</div>
                                            <div className="ui largeType row">Kiterope</div>
                                            <div className="ui row field">
                                                <div className="">Personalize how your goal appears.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="eleven wide column">
            <div className="ui row field">
                        <div className={wideColumnWidth + ' field'}>
                    <label htmlFor="id_croppableImage">Please choose a picture that will help motivate you.</label>


<NewImageUploader imageReturned={this.handleImageChange}
                  defaultImage={defaultGoalCroppableImage.image}
                  forMobile={forMobile}
                  aspectRatio="square"
                  label="Select an image that will help motivate you."
                  croppableImage={this.state.croppableImage} /></div>
            </div>

                                            <div className="ui row">
                        <div className={mediumColumnWidth + ' field'}>
                    <label htmlFor="id_lengthOfSchedule">Who should be able to see this goal?</label>
                    <Select value={this.state.viewableBy} clearable={false}
                                              onChange={this.handleViewableByChange} name="viewingOptions"
                                              options={userSharingOptions}/>
                            </div>
                        </div>
                                            </div>
                                        </div>
                    </div>

                                <div className="ui three column stackable grid">
                                    <div className="column">&nbsp;</div>
                                    <div className="column"><div className="ui large fluid button" onClick={this.handleCancelClicked} >Cancel</div></div>
                                    <div className="column">                             <SaveButton saved={this.state.saved} clicked={this.handleSubmit} />
</div>
                                    </div>
                            </div>

        )}

     openModal() {
        this.setState({
            modalIsOpen: true
        });

        if (this.state.data) {
            this.setState({
                modalIsOpen: true,


            })
        }

    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        //this.refs.subtitle.style.color = '#f00';
    }

    closeModal() {
            this.setState({modalIsOpen: false});
            this.resetForm()


        }

        handleGoalSubmit = (goal) => {

        if (goal.id != "" && goal.id != undefined) {

            var theUrl = "/api/goals/" + goal.id + "/";
            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'PATCH',
                data: goal,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    this.setState({
                         saved: "Saved"
                    });
                    store.dispatch(updateGoal( data));
                    var redirectUrl = "/goals/" + data.id + "/plans"
                    store.dispatch(push(redirectUrl));




                    this.closeModal();


                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                         saved: "Save"
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
                    store.dispatch(addGoal( data));
                    var redirectUrl = "/goals/" + data.id + "/plans"
                    store.dispatch(push(redirectUrl));

                    this.closeModal();


                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                         saved: "Save"
                    })

                }.bind(this)
            });
        }


    }





    render() {
    var theForm = this.getForm();

        if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }

                if(this.state.modalIsOpen) {


                    return (
                        <div>

                            <div className="ui one column grid container">
                                <div className="ui centered row  massiveType">Great news! We can help you with that!
                                </div>
                            </div>
                            <div className="ui one column grid">

                                <div className="ui centered row largeType">We just need a little more information.
                                </div>

                            </div>
                            <div className="ui form">

                                {theForm}

                            </div>
                        </div>

                    )
                } else {
                    return(null)
                }
        }

}


@connect(mapStateToProps, mapDispatchToProps)
export class GoalModalSMARTForm extends React.Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            title: "",
            deadline: moment(),
            description: "",
            metric: "",
            why: "",
            obstacles:"",
            image: "",
            viewableBy: "ONLY_ME",
            user: null,
            coaches: [],
            updates: [],
            wasAchieved: false,
            plans: [],
            editable:true,
            data:"",
            serverErrors: "",
            image:defaultGoalCroppableImage.image,
            croppableImage: defaultGoalCroppableImage,
            coreValues:"",
            goalInAlignmentWithCoreValues: {label:"", value:false},
            isThisReasonable:{label:"", value:false},
        }
    }

    componentDidMount() {

        this.resetForm();
        this.setState({
            serverErrors:this.props.serverErrors,
        });


        if (this.props.storeRoot != undefined) {
            if (this.props.storeRoot.goalModalData != undefined) {
                this.setState({goalModalData:this.props.storeRoot.goalModalData})
                    this.setStateToData(this.props.storeRoot.goalModalData)


            }
        }
    }

    setStateToData (smartGoalFormData) {
        this.setState({
            modalIsOpen: smartGoalFormData.modalIsOpen,

        })
        if (smartGoalFormData.data != undefined ) {

            var data = smartGoalFormData.data



            var description = ""

             if (data.description != undefined) {
               description = data.description
            }



            if (data.id != undefined) {
                this.setState({
                    id: data.id,
                    saved:"Saved"
                })
            } else {
                this.setState({
                    id:"",
                    saved:"Create"
                })
            }

            if (data.croppableImageData != undefined) {
                this.setState({
                    croppableImage: data.croppableImageData
                })
            }

            if (data.deadline != undefined) {
                this.setState({
                deadline: moment(data.deadline, "YYYY-MM-DD"),
                })
            }

            this.setState({
                id: data.id,
                description: description,
                title: data.title,
                deadline: moment(),
                metric: data.metric,
                why: data.why,
                obstacles: data.obstacles,
                image: data.image,
                viewableBy: data.viewableBy,
                wasAchieved: data.wasAchieved,
                goalInAlignmentWithCoreValues: data.goalInAlignmentWithCoreValues,
                isThisReasonable: data.isThisReasonable,

            },() => {

            });



        }
    }

    componentWillReceiveProps(nextProps) {

        if (this.state.serverErrors != nextProps.serverErrors) {
            this.setState({serverErrors: nextProps.serverErrors})
        }

        if (nextProps.storeRoot.goalModalData != undefined ) {
            if (this.state.goalModalData != nextProps.storeRoot.goalModalData) {
                this.setState({goalModalData:nextProps.storeRoot.goalModalData })

                    this.setStateToData(nextProps.storeRoot.goalModalData)

                }


            }




    }

handleTitleChange(value) {
        this.setState({title: value, saved:"Save"});
    }

    handleDeadlineChange = (value)  => {
        this.setState({deadline: value, saved:"Save"});
    };

    handleDescriptionChange(e) {
        this.setState({description: e, saved:"Save"});
    }


    handleMetricChange(value) {
        this.setState({metric: value, saved:"Save"});
    }

    handleWhyChange(value) {
        this.setState({why: value, saved:"Save"});
    }
    handleObstaclesChange(value) {
        this.setState({obstacles: value, saved:"Save"});
    }

    handleDescriptionChange(value) {
        this.setState({description: value, saved:"Save"});

    }



    handleCoreValuesChange(value) {
        this.setState({coreValues: value, saved:"Save"});
    }

    handleImageChange = (callbackData) => {
        this.setState({
            image: callbackData.image,
            saved: "Save",
            croppableImage: callbackData

        })
    }
    handleViewableByChange(e) {
        this.setState({viewableBy: e.value, saved:"Save"});
    }



    handleCancelClicked() {
        store.dispatch(setGoalModalData({modalIsOpen:false, data:{}}))
        //this.props.cancelClicked()
    }

    getServerErrors(fieldName) {
        if (this.state.serverErrors == undefined) {
            return ""
        } else {
            return this.state.serverErrors[fieldName]
        }
    }

    handleSubmit() {



        if (this.state.goalInAlignmentWithCoreValues && this.state.isThisReasonable) {

            if (this.props.storeRoot.user) {
                this.setState({saved: "Saving"})
                var title = this.state.title;
                var deadline = moment(this.state.deadline).format("YYYY-MM-DD");
                var image = this.state.image;
                var description = this.state.description;
                var metric = this.state.metric;


                var why = this.state.why;
                var obstacles = this.state.obstacles;
                var croppableImage = this.state.croppableImage.id;
                var coreValues = this.state.coreValues;
                var goalInAlignmentWithCoreValues = this.state.goalInAlignmentWithCoreValues
                var isThisReasonable = this.state.isThisReasonable


                var viewableBy = this.state.viewableBy;
                var goalData = {
                    title: title,
                    deadline: deadline,
                    description: description,
                    metric: metric,
                    why: why,
                    obstacles: obstacles,
                    image: image,
                    croppableImage: croppableImage,
                    coreValues: coreValues,
                    goalInAlignmentWithCoreValues: goalInAlignmentWithCoreValues,
                    isThisReasonable: isThisReasonable,

                    viewableBy: viewableBy,
                    coaches: [],
                    updates: [],
                    wasAchieved: false,
                    plans: []
                };

                if (this.state.id != "") {
                    goalData.id = this.state.id
                }
                this.handleGoalSubmit(goalData)

            }
            else {
                store.dispatch(setSignInOrSignupModalData({modalIsOpen: true, form: "SignIn", data: {}}))

                this.setState({
                        signInOrSignUpModalFormIsOpen: true,
                    }
                )

            }
        } else {
            if (this.state.goalInAlignmentWithCoreValues == null) {
                this.setState({serverErrors: {goalInAlignmentWithCoreValues: ["You must confirm that the goal fits with your core values."]}})


            } else if (this.state.goalInAlignmentWithCoreValues == false) {
                this.setState({serverErrors: {goalInAlignmentWithCoreValues: ["A goal should fit within your core values. Either rethink your core values or your goal."]}})


            }

            if (this.state.isThisReasonable == null) {
                this.setState({serverErrors: {isThisReasonable: ["You must confirm that the goal is reasonable."]}})


            } else if (this.state.isThisReasonable == false)
                this.setState({serverErrors:{isThisReasonable: ["A goal should stretch you, but should be within the realm of possibility."]}})

        }
    }








        resetForm = () => {
            this.setState({
                title: "",
                deadline: moment(),
                description: "",
                metric: "",
                why: "",
                obstacles:"",
                image: null,
                viewableBy: "ONLY_ME",
                user: null,
                coaches: [],
                updates: [],
                wasAchieved: false,
                plans: [],
                image: defaultGoalCroppableImage.image,
                croppableImage:defaultGoalCroppableImage,
                goalInAlignmentWithCoreValues: null,
                isThisReasonable: null,
            },           () =>        { store.dispatch(setGoalModalData(this.state))});
        };

         handleGoalInAlignmentWithCoreValuesChange(option) {

        this.setState({goalInAlignmentWithCoreValues: option.value, saved:"Save"});
             if (option.value == null) {
                this.setState({serverErrors: Object.assign({}, this.state.serverErrors, {goalInAlignmentWithCoreValues: ["You must confirm that the goal fits with your core values."]})})


            } else if (option.value == false) {
                this.setState({serverErrors: Object.assign({}, this.state.serverErrors,  {goalInAlignmentWithCoreValues: ["A goal should fit within your core values. Either rethink your core values or your goal."]})})


            } else {
                this.setState({serverErrors: Object.assign({}, this.state.serverErrors,  {goalInAlignmentWithCoreValues: []})})
             }
    }

     handleIsThisReasonableChange(option) {
         this.setState({isThisReasonable: option.value, saved:"Save"});
         if (option.value == null) {
             //this.setState({serverErrors: {isThisReasonable: ["You must confirm that the goal is reasonable."]}})
                this.setState({serverErrors: Object.assign({}, this.state.serverErrors, {isThisReasonable: ["You must confirm that the goal is reasonable."]})})


         } else if (option.value == false) {
            // this.setState({serverErrors: {isThisReasonable: ["A goal should stretch you, but should be within the realm of possibility."]}})
                             this.setState({serverErrors: Object.assign({}, this.state.serverErrors, {isThisReasonable:  ["A goal should stretch you, but should be within the realm of possibility."]})})

         } else {
                this.setState({serverErrors: Object.assign({}, this.state.serverErrors,  {isThisReasonable: []})})
             }


    }

        getDescriptionEditor () {
            if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if (forMobile) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";

           } else {


            var wideColumnWidth = "twelve wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }


                if (this.state.description == null) {
                    return ("")
                } else {
                    return (<div className="ui row">
                        <div className={wideColumnWidth}>
                            <div className="field fluid">
                                <label htmlFor="id_description">Visualize your goal. Describe it as clearly as possible.</label>
                                <TinyMCEInput name="description"
                                      value={this.state.description}
                                      tinymceConfig={TINYMCE_CONFIG}
                                      onChange={this.handleEditorChange}
                        />


                            </div>
                        </div>
                        <div className="six wide column">&nbsp;</div>

                    </div>)
                }
            }
getForm2 = () => {

            if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if (forMobile) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";
           } else {


            var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }




            if (this.state.image) {
                var imageUrl = this.state.image


            } else {
                var imageUrl = "goalItem.svg"
            }

                    var descriptionEditor = this.getDescriptionEditor();

        return ( <div className="ui page container footerAtBottom">
                                  <Header headerLabel={this.state.id != "" & this.state.id != undefined ? "Edit Goal" : "Create Goal"} />

                                            <div className="ui form">

                                <div className="ui row">&nbsp;</div>

                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="center aligned five wide column blue ">
                                            <div className="ui ginormousType row">S</div>
                                            <div className="ui largeType row">Specific</div>
                                            <div className="ui row">
                                                <div className="left aligned">Your goal should be
                                                    well-defined and clear. Make it as concise as possible.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="eleven wide column">
                                            <div className="ui row bold">
                                                <ValidatedInput
                                                    type="text"
                                                    name="title"
                                                    label="What is your goal? (Required)"
                                                    id="id_title"
                                                    placeholder="I will run a five minute mile, I will learn to speak Chinese fluently"
                                                    value={this.state.title}
                                                    initialValue={this.state.title}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleTitleChange}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("title")}

                                            />

                                            </div>

                                                                                        <div className="ui row">&nbsp;</div>
                                            {descriptionEditor}


                                        </div>
                                    </div>
                                </div>
                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="center aligned five wide column blue ">
                                            <div className="ui ginormousType row">M</div>
                                            <div className="ui largeType row">Measurable</div>
                                            <div className="ui row">
                                                <div className="">A goal should be measurable so you can judge your progress and know when it's been achieved.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="eleven wide column">
                                            <div className="ui row">
                                                <ValidatedInput
                                                    type="text"
                                                    name="metric"
                                                    label="How will you measure your progress?"
                                                    id="id_metric"
                                                    placeholder="time per mile, pounds, pictures, audio recording, etc. "
                                                    value={this.state.metric}
                                                    initialValue={this.state.metric}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleMetricChange}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("metric")}

                                            />
                                            </div>


                                        </div>
                                    </div>
                                </div>
                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="center aligned five wide column blue ">
                                            <div className="ui ginormousType row">A</div>
                                            <div className="ui largeType row">Achievable</div>
                                            <div className="ui row">
                                                <div className="">To progress as fast and far as possible, you should choose a goal that stretches your abilities while being realistic so you stay motivated.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="eleven wide column">
                                        <div className="ui field row">
                                            <label htmlFor="id_isThisReasonable">Does your goal challenge you while still being realistic?</label>
                            <KSSelect value={this.state.isThisReasonable}
                                      valueChange={this.handleIsThisReasonableChange}
                                      name="isThisReasonable" options={isThisReasonableOptions}
                                      serverErrors={this.getServerErrors("isThisReasonable")}
                                      isClearable={false}
                            /></div>
<div className="ui row">&nbsp;</div>

                                            <div className="ui row">
                                                <ValidatedInput
                                                    type="textarea"
                                                    name="obstacles"
                                                    label="What obstacles have you encountered in the past or do you foresee encountering?"
                                                    id="id_obstacles"
                                                    placeholder="I sometimes skip practice if I've had a late night, My friends aren't supportive"
                                                    value={this.state.obstacles}
                                                    initialValue={this.state.obstacles}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleObstaclesChange}
                                                    rows={3}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("obstacles")}

                                            />
                                            </div>


                                        </div>
                                    </div>
                                </div>

                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="center aligned five wide column blue ">
                                            <div className="ui ginormousType row">R</div>
                                            <div className="ui largeType row">Relevant</div>
                                            <div className="ui row">
                                                <div className="">The goal should matter to you and should align with your other goals and core values. Staying motivated is much easier when you believe in what you're doing
                                                </div>
                                            </div>
                                        </div>
                                            <div className="eleven wide column">


                                            <div className="ui row">
                                                <ValidatedInput
                                                    type="textarea"
                                                    name="coreValues"
                                                    label="What are your core values and beliefs? What is important to you? What is the purpose of life to you?"
                                                    id="id_coreValues"
                                                    placeholder="Providing for my friends and family are the most important to me. I believe self-actualization is my highest goal."
                                                    value={this.state.coreValues}
                                                    initialValue={this.state.coreValues}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleCoreValuesChange}
                                                    rows={3}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("coreValues")}

                                            />
                                            </div>
                                            <div className="ui row">&nbsp;</div>

                                            <div className="ui field row">
                                            <label htmlFor="id_goalInAlignmentWithCoreValues">Is this goal in alignment with your core values?</label>
                        <KSSelect value={this.state.goalInAlignmentWithCoreValues}
                                valueChange={this.handleGoalInAlignmentWithCoreValuesChange}
                                name="goalInAlignmentWithCoreValues"
                                options={goalInAlignmentWithCoreValuesOptions}
                                                                        isClearable={false}

                        serverErrors={this.getServerErrors("goalInAlignmentWithCoreValues")}/>
                                            </div>
<div className="ui row">&nbsp;</div><div className="ui row">
                                                <ValidatedInput
                                                    type="textarea"
                                                    name="why"
                                                    label="Why do you want to achieve this goal?"
                                                    id="id_why"
                                                    placeholder="I want to make something of myself, I want to be around to see my daughter graduate from college."
                                                    value={this.state.why}
                                                    initialValue={this.state.why}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleWhyChange}
                                                    rows={3}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("why")}

                                            />
                                            </div>



                                        </div>
                                    </div>
                                </div>

                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="center aligned five wide column blue ">
                                            <div className="ui ginormousType row">T</div>
                                            <div className="ui largeType row">Time-Bound</div>
                                            <div className="ui row">
                                                <div className="">Your goal should have a definite end date for best results.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="eleven wide column">


                                            <div className="ui row field">
                                                <label htmlFor="id_deadline">What is your deadline for achieving this goal?</label>

                                                <DatePicker selected={this.state.deadline} onChange={this.handleDeadlineChange} />

                                            </div>


                                        </div>
                                    </div>
                                </div>
                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="center aligned five wide column  ">
                                            <div className="ui ginormousType row">&nbsp;</div>
                                            <div className="ui largeType row">Kiterope</div>
                                            <div className="ui row field">
                                                <div className="">Personalize how your goal appears.
                                                </div>
                                            </div>
                                        </div>
                                        <div className="eleven wide column">
            <div className="ui row field">
                        <div className={wideColumnWidth + ' field'}>
                    <label htmlFor="id_croppableImage">Please choose a picture that will help motivate you.</label>


<NewImageUploader imageReturned={this.handleImageChange}
                  defaultImage={defaultGoalCroppableImage.image}
                  forMobile={forMobile}
                  aspectRatio="square"
                  label="Select an image that will help motivate you."
                  croppableImage={this.state.croppableImage} /></div>
            </div>

                                            <div className="ui row">
                        <div className={mediumColumnWidth + ' field'}>
                    <label htmlFor="id_lengthOfSchedule">Who should be able to see this goal?</label>
                    <Select value={this.state.viewableBy} clearable={false}
                                              onChange={this.handleViewableByChange} name="viewingOptions"
                                              options={userSharingOptions}/>
                            </div>
                        </div>
                                            </div>
                                        </div>
                    </div>

                                <div className="ui three column stackable grid">
                                    <div className="column">&nbsp;</div>
                                    <div className="column"><div className="ui large fluid button" onClick={this.handleCancelClicked} >Cancel</div></div>
                                    <div className="column">                             <SaveButton saved={this.state.saved} clicked={this.handleSubmit} />
</div>
                                    </div>
                                                </div>
                            </div>

        )};


getForm = () => {

            if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if (forMobile) {
             var wideColumnWidth = "sixteen wide column";
            var mediumColumnWidth = "sixteen wide column";
            var smallColumnWidth = "eight wide column";
           } else {


            var wideColumnWidth = "twelve wide column";
            var mediumColumnWidth = "eight wide column";
            var smallColumnWidth = "four wide column"
        }




            if (this.state.image) {
                var imageUrl = this.state.image


            } else {
                var imageUrl = "goalItem.svg"
            }

                    var descriptionEditor = this.getDescriptionEditor();

        return ( <div className="ui page container footerAtBottom">
                                  <Header headerLabel={this.state.id != "" & this.state.id != undefined ? "Edit Goal" : "Create Goal"} />

                                            <div className="ui form">

                                <div className="ui row">&nbsp;</div>

                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="ui blue row">
                                            <div className="ui largeType center aligned middle aligned four wide column  ">Specific</div>
                                                <div className="twelve wide column left aligned  largeType">Your goal should be
                                                    well-defined and clear. Make it as concise as possible.
                                                </div>
                                            </div>
                                            <div className="ui row bold">
                                                <div className={wideColumnWidth}>
                                                <ValidatedInput
                                                    type="text"
                                                    name="title"
                                                    label="What is your goal? (Required)"
                                                    id="id_title"
                                                    placeholder="I will run a five minute mile, I will learn to speak Chinese fluently"
                                                    value={this.state.title}
                                                    initialValue={this.state.title}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleTitleChange}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("title")}

                                            />

                                            </div>
                                                </div>

                                            {descriptionEditor}


                                        </div>
                                    </div>
                                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="ui  blue row">
                                            <div className="ui largeType center aligned middle aligned four wide column ">Measureable</div>
                                                <div className="twelve wide column left aligned  largeType">A goal should be measurable so you can judge your progress and know when it's been achieved.
                                                </div>
                                            </div>
                                            <div className="ui row">
                                                                                                <div className={wideColumnWidth}>

                                                <ValidatedInput
                                                    type="text"
                                                    name="metric"
                                                    label="How will you measure your progress?"
                                                    id="id_metric"
                                                    placeholder="time per mile, pounds, pictures, audio recording, etc. "
                                                    value={this.state.metric}
                                                    initialValue={this.state.metric}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleMetricChange}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("metric")}

                                            />
                                                                                                    </div>
                                            </div>


                                        </div>
                                    </div>
                                                 <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="ui blue row">
                                            <div className="ui largeType center aligned middle aligned four wide column ">Achievable</div>
                                                <div className="twelve wide column left aligned  largeType">To progress as fast and far as possible, you should choose a goal that stretches your abilities while being realistic so you stay motivated.
                                                </div>
                                            </div>
                                            <div className="ui row">
                                                                                                <div className={wideColumnWidth + " field"}>
                                            <label htmlFor="id_isThisReasonable">Does your goal challenge you while still being realistic?</label>
                            <KSSelect value={this.state.isThisReasonable}
                                      valueChange={this.handleIsThisReasonableChange}
                                      name="isThisReasonable" options={isThisReasonableOptions}
                                      serverErrors={this.getServerErrors("isThisReasonable")}
                                      isClearable={false}
                            /></div>
                                                </div>

                                            <div className="ui row">
                                                <div className={wideColumnWidth}>
                                                <ValidatedInput
                                                    type="textarea"
                                                    name="obstacles"
                                                    label="What obstacles have you encountered in the past or do you foresee encountering?"
                                                    id="id_obstacles"
                                                    placeholder="I sometimes skip practice if I've had a late night, My friends aren't supportive"
                                                    value={this.state.obstacles}
                                                    initialValue={this.state.obstacles}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleObstaclesChange}
                                                    rows={3}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("obstacles")}

                                            />
                                                    </div>
                                            </div>


                                        </div>
                                    </div>
                                                 <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="ui blue row">
                                            <div className="ui largeType center aligned middle aligned four wide column">Relevant</div>
                                                <div className="twelve wide column left aligned largeType">The goal should matter to you and should align with your other goals and core values. Staying motivated is much easier when you believe in what you're doing.
                                                </div>
                                            </div>
                                            <div className="ui row">
                                                                                                <div className={wideColumnWidth}>



                                                <ValidatedInput
                                                    type="textarea"
                                                    name="coreValues"
                                                    label="What are your core values and beliefs? What is important to you? What is the purpose of life to you?"
                                                    id="id_coreValues"
                                                    placeholder="Providing for my friends and family are the most important to me. I believe self-actualization is my highest goal."
                                                    value={this.state.coreValues}
                                                    initialValue={this.state.coreValues}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleCoreValuesChange}
                                                    rows={3}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("coreValues")}

                                            />
                                                                                                </div>
                                            </div>

                                            <div className="ui row ">
                                                <div className={wideColumnWidth + " field"}>

                                            <label  htmlFor="id_goalInAlignmentWithCoreValues">Is this goal in alignment with your core values?</label>
                        <KSSelect value={this.state.goalInAlignmentWithCoreValues}
                                valueChange={this.handleGoalInAlignmentWithCoreValuesChange}
                                name="goalInAlignmentWithCoreValues"
                                options={goalInAlignmentWithCoreValuesOptions}
                                  isClearable={false}

                        serverErrors={this.getServerErrors("goalInAlignmentWithCoreValues")}/>
                                            </div></div>
                                                <div className="ui row">
                                                    <div className={wideColumnWidth}>

                                                <ValidatedInput
                                                    type="textarea"
                                                    name="why"
                                                    label="Why do you want to achieve this goal?"
                                                    id="id_why"
                                                    placeholder="I want to make something of myself, I want to be around to see my daughter graduate from college."
                                                    value={this.state.why}
                                                    initialValue={this.state.why}
                                                    validators='"!isEmpty(str)"'
                                                    onChange={this.validate}
                                                    stateCallback={this.handleWhyChange}
                                                    rows={3}
                                                    isDisabled={!this.state.editable}
                                                    serverErrors={this.getServerErrors("why")}

                                            />
                                                                                                                                                        </div>
                                            </div>



                                        </div>
                                    </div>
                                                <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="ui blue row">
                                            <div className="ui largeType center aligned middle aligned four wide column ">Time-Bound</div>
                                                <div className="twelve wide column left aligned   largeType">Your goal should have a definite end date for best results.
                                                </div>
                                            </div>
                                            <div className="ui row">
                                                                                                <div className={wideColumnWidth + " field"}>


                                                <label htmlFor="id_deadline">What is your deadline for achieving this goal?</label>

                                                <DatePicker selected={this.state.deadline} onChange={this.handleDeadlineChange} />
                                                                                                    </div>

                                            </div>


                                        </div>
                                    </div>
                                            <div className="ui segment">
                                    <div className="ui grid">
                                        <div className="ui blue row">
                                            <div className="ui largeType center aligned middle aligned four wide column ">Memorable</div>
                                                <div className="twelve wide column left aligned  largeType">It helps to make goals memorable.
                                                </div>
                                            </div>
                                            <div className="ui row">

                        <div className={wideColumnWidth + ' field'} >
                    <label htmlFor="id_croppableImage">Please choose a picture that will help motivate you.</label>


<NewImageUploader imageReturned={this.handleImageChange}
                  defaultImage={defaultGoalCroppableImage.image}
                  forMobile={forMobile}
                  aspectRatio="square"
                  label="Select an image that will help motivate you."
                  croppableImage={this.state.croppableImage} /></div>
            </div>

                                            <div className="ui row">
                        <div className={mediumColumnWidth + ' field'}>
                    <label htmlFor="id_lengthOfSchedule">Who should be able to see this goal?</label>
                    <Select value={this.state.viewableBy} clearable={false}
                                              onChange={this.handleViewableByChange} name="viewingOptions"
                                              options={userSharingOptions}/>
                            </div>
                        </div>
                                            </div>
                                        </div>
                    </div>
                                            <div className="ui row">&nbsp;</div>

                                <div className="ui three column stackable grid">
                                    <div className="column">&nbsp;</div>
                                    <div className="column"><div className="ui large fluid button" onClick={this.handleCancelClicked} >Cancel</div></div>
                                    <div className="column">                             <SaveButton saved={this.state.saved} clicked={this.handleSubmit} />
</div>
                                    </div>
                                                </div>

        )};

     openModal() {
        this.setState({
            modalIsOpen: true
        });

        if (this.state.data) {
            this.setState({
                modalIsOpen: true,


            })
        }

    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        //this.refs.subtitle.style.color = '#f00';
    }

    closeModal() {
            this.setState({modalIsOpen: false});
            this.resetForm()


        }

        handleGoalSubmit = (goal) => {

        if (goal.id != "") {

            var theUrl = "/api/goals/" + goal.id + "/";
            $.ajax({
                url: theUrl,
                dataType: 'json',
                type: 'PATCH',
                data: goal,
                headers: {
                    'Authorization': 'Token ' + localStorage.token
                },
                success: function (data) {
                    this.setState({
                         saved: "Saved"
                    });
                    store.dispatch(updateGoal( data));
                    var redirectUrl = "/goals/" + data.id + "/plans"
                    store.dispatch(push(redirectUrl));



                    this.closeModal();


                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                         saved: "Save"
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
                    store.dispatch(addGoal( data));
                    var redirectUrl = "/goals/" + data.id + "/plans"
                    store.dispatch(push(redirectUrl));
                    this.closeModal();


                }.bind(this),
                error: function (xhr, status, err) {
                    var serverErrors = xhr.responseJSON;
                    this.setState({
                        serverErrors: serverErrors,
                         saved: "Save"
                    })

                }.bind(this)
            });
        }


    };





    render() {
    var theForm = this.getForm();

        if (this.props.storeRoot != undefined ) {
                if (this.props.storeRoot.gui != undefined) {
                    var forMobile = this.props.storeRoot.gui.forMobile
                    }
                }



            if (forMobile) {
             var modalStyle = mobileModalStyle

           } else {


                var modalStyle = stepModalStyle

        }

            return(
                <div>
                    <Modal
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



module.exports = { GoalSMARTForm , GoalModalSMARTForm}