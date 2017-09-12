var React = require('react');
var ReactDOM = require('react-dom');
var $  = require('jquery');
global.rsui = require('react-semantic-ui');
var forms = require('newforms');
import {ImageUploader, Breadcrumb, PlanForm2, ProgramViewEditDeleteItem, FormAction, Sidebar, FormHeaderWithActionButton, DetailPage} from './base';
import {PlanHeader, StepList, ToggleButton, StepForm, SimpleStepForm} from './step';
import {ProgramCalendar } from './calendar'
import { Router, Route, Link, browserHistory, hashHistory } from 'react-router';
import { Menubar, StandardSetOfComponents, ErrorReporter, Footer } from './accounts'
import autobind from 'class-autobind'
import {StandardSetOfComponentsContainer} from './redux/containers'
import Measure from 'react-measure'


import { ValidatedInput, KSSelect } from './app'
import DatePicker  from 'react-datepicker';
import moment from 'moment';
import Pagination from "react-js-pagination";
import Select from 'react-select'
import TinyMCEInput from 'react-tinymce-input';
import CurrencyInput from 'react-currency-input';
import { Test , IconLabelCombo , ItemMenu, ClippedImage, ChoiceModal, ChoiceModalButton, ContextualMenuItem, ChoiceModalButtonsList,  } from './elements'
import { Textfit } from 'react-textfit';
import ShowMore from 'react-show-more';
import Modal from 'react-modal';
import Phone from 'react-phone-number-input'
import rrui from 'react-phone-number-input/rrui.css'
import rpni from 'react-phone-number-input/style.css'



import { makeEditable, StepCalendarComponent, StepEditCalendarComponent,  } from './calendar'
import { MessageWindowContainer } from './message'

import { Provider, connect, dispatch } from 'react-redux'
import  {store} from "./redux/store";

import { mapStateToProps, mapDispatchToProps } from './redux/containers'

import { addPlan, removePlan, setPlan, addStep, deleteStep, setCurrentUser, reduxLogout, showSidebar, setOpenThreads, setCurrentThread, showMessageWindow, setPrograms, addProgram, deleteProgram, setGoals, setContacts, setStepOccurrences } from './redux/actions'

import { theServer, times, s3IconUrl, formats, s3ImageUrl, customModalStyles, dropzoneS3Style, uploaderProps, frequencyOptions, programScheduleLengths, timeCommitmentOptions,
    costFrequencyMetricOptions, viewableByOptions, customStepModalStyles, notificationSendMethodOptions, TINYMCE_CONFIG } from './constants'
import { syncHistoryWithStore, routerReducer, routerMiddleware, push } from 'react-router-redux'

export class TermsOfServicePage extends React.Component {

constructor(props) {
        super(props);
        autobind(this);
        this.state = {
            data: [],
            activePage:1,
            serverErrors:"",
            formIsOpen:false,
            headerActionButtonLabel:"Create Program"


        }
    }
    render () {
        return (<div>

        <StandardSetOfComponents  modalIsOpen={this.state.signInOrSignUpModalFormIsOpen}/>
        <div className="fullPageDiv">
            <div className="ui page container footerAtBottom">


            <div className="spacer">&nbsp;</div>

            <div>
                <h1>Kiterope Terms of Service</h1>


                <h2>Welcome to Kiterope!</h2>

                <div className="tosBody">Thanks for using our products and services (“Services”). The Services are
                    provided by Protogy Labs Inc. (“Kiterope”), located at 737 W. Mariposa Street, Altadena, CA 91001,
                    United States.

                    By using our Services, you are agreeing to these terms. Please read them carefully.

                    Our Services are very diverse, so sometimes additional terms or product requirements (including age
                    requirements) may apply. Additional terms will be available with the relevant Services, and those
                    additional terms become part of your agreement with us if you use those Services.

                </div>
                <h2>Using our Services</h2>

                <div className="tosBody">You must follow any policies made available to you within the Services.

                    Don’t misuse our Services. For example, don’t interfere with our Services or try to access them
                    using a method other than the interface and the instructions that we provide. You may use our
                    Services only as permitted by law, including applicable export and re-export control laws and
                    regulations. We may suspend or stop providing our Services to you if you do not comply with our
                    terms or policies or if we are investigating suspected misconduct.

                    Using our Services does not give you ownership of any intellectual property rights in our Services
                    or the content you access. You may not use content from our Services unless you obtain permission
                    from its owner or are otherwise permitted by law. These terms do not grant you the right to use any
                    branding or logos used in our Services. Don’t remove, obscure, or alter any legal notices displayed
                    in or along with our Services.

                    Our Services display some content that is not Kiterope’s. This content is the sole responsibility of
                    the entity that makes it available. We may review content to determine whether it is illegal or
                    violates our policies, and we may remove or refuse to display content that we reasonably believe
                    violates our policies or the law. But that does not necessarily mean that we review content, so
                    please don’t assume that we do.

                    In connection with your use of the Services, we may send you service announcements, administrative
                    messages, and other information. You may opt out of some of those communications.

                    Some of our Services are available on mobile devices. Do not use such Services in a way that
                    distracts you and prevents you from obeying traffic or safety laws.

                </div>
                <h2>Your Kiterope Account</h2>

                <div className="tosBody">You may need a Kiterope Account in order to use some of our Services. You may
                    create your own Kiterope Account, or your Kiterope Account may be assigned to you by an
                    administrator, such as your employer or educational institution. If you are using a Kiterope Account
                    assigned to you by an administrator, different or additional terms may apply and your administrator
                    may be able to access or disable your account.

                    To protect your Kiterope Account, keep your password confidential. You are responsible for the
                    activity that happens on or through your Kiterope Account. Try not to reuse your Kiterope Account
                    password on third-party applications. If you learn of any unauthorized use of your password or
                    Kiterope Account, follow these instructions.

                </div>
                <h2>Privacy and Copyright Protection</h2>

                <div className="tosBody">Kiterope’s privacy policies explain how we treat your personal data and protect
                    your privacy when you use our Services. By using our Services, you agree that Kiterope can use such
                    data in accordance with our privacy policies.

                    We respond to notices of alleged copyright infringement and terminate accounts of repeat infringers
                    according to the process set out in the U.S. Digital Millennium Copyright Act.

                    We provide information to help copyright holders manage their intellectual property online. If you
                    think somebody is violating your copyrights and want to notify us, you can find information about
                    submitting notices and Kiterope’s policy about responding to notices in our Help Center.

                </div>
                <h2>Your Content in our Services</h2>

                <div className="tosBody">Some of our Services allow you to upload, submit, store, send or receive
                    content. You retain ownership of any intellectual property rights that you hold in that content. In
                    short, what belongs to you stays yours.

                    When you upload, submit, store, send or receive content to or through our Services, you give
                    Kiterope (and those we work with) a worldwide license to use, host, store, reproduce, modify, create
                    derivative works (such as those resulting from translations, adaptations or other changes we make so
                    that your content works better with our Services), communicate, publish, publicly perform, publicly
                    display and distribute such content. The rights you grant in this license are for the limited
                    purpose of operating, promoting, and improving our Services, and to develop new ones. This license
                    continues even if you stop using our Services (for example, for a business listing you have added to
                    Kiterope Maps). Some Services may offer you ways to access and remove content that has been provided
                    to that Service. Also, in some of our Services, there are terms or settings that narrow the scope of
                    our use of the content submitted in those Services. Make sure you have the necessary rights to grant
                    us this license for any content that you submit to our Services.

                    Our automated systems analyze your content (including emails) to provide you personally relevant
                    product features, such as customized search results, tailored advertising, and spam and malware
                    detection. This analysis occurs as the content is sent, received, and when it is stored.

                    If you have a Kiterope Account, we may display your Profile name, Profile photo, and actions you
                    take on Kiterope or on third-party applications connected to your Kiterope Account (such as +1’s,
                    reviews you write and comments you post) in our Services, including displaying in ads and other
                    commercial contexts. We will respect the choices you make to limit sharing or visibility settings in
                    your Kiterope Account. For example, you can choose your settings so your name and photo do not
                    appear in an ad.

                    You can find more information about how Kiterope uses and stores content in the privacy policy or
                    additional terms for particular Services. If you submit feedback or suggestions about our Services,
                    we may use your feedback or suggestions without obligation to you.

                </div>
                <h2>About Software in our Services</h2>

                <div className="tosBody">When a Service requires or includes downloadable software, this software may
                    update automatically on your device once a new version or feature is available. Some Services may
                    let you adjust your automatic update settings.

                    Kiterope gives you a personal, worldwide, royalty-free, non-assignable and non-exclusive license to
                    use the software provided to you by Kiterope as part of the Services. This license is for the sole
                    purpose of enabling you to use and enjoy the benefit of the Services as provided by Kiterope, in the
                    manner permitted by these terms. You may not copy, modify, distribute, sell, or lease any part of
                    our Services or included software, nor may you reverse engineer or attempt to extract the source
                    code of that software, unless laws prohibit those restrictions or you have our written permission.

                    Open source software is important to us. Some software used in our Services may be offered under an
                    open source license that we will make available to you. There may be provisions in the open source
                    license that expressly override some of these terms.
                    </div>

                    <h2>Modifying and Terminating our Services</h2>

                    <div className="tosBody">We are constantly changing and improving our Services. We may add or remove
                        functionalities or features, and we may suspend or stop a Service altogether.

                        You can stop using our Services at any time, although we’ll be sorry to see you go. Kiterope may
                        also stop providing Services to you, or add or create new limits to our Services at any time.

                        We believe that you own your data and preserving your access to such data is important. If we
                        discontinue a Service, where reasonably possible, we will give you reasonable advance notice and
                        a chance to get information out of that Service.

                    </div>
                    <h2>Our Warranties and Disclaimers</h2>

                    <div className="tosBody">We provide our Services using a commercially reasonable level of skill and
                        care and we hope that you will enjoy using them. But there are certain things that we don’t
                        promise about our Services.

                        OTHER THAN AS EXPRESSLY SET OUT IN THESE TERMS OR ADDITIONAL TERMS, NEITHER KITEROPE NOR ITS
                        SUPPLIERS OR DISTRIBUTORS MAKE ANY SPECIFIC PROMISES ABOUT THE SERVICES. FOR EXAMPLE, WE DON’T
                        MAKE ANY COMMITMENTS ABOUT THE CONTENT WITHIN THE SERVICES, THE SPECIFIC FUNCTIONS OF THE
                        SERVICES, OR THEIR RELIABILITY, AVAILABILITY, OR ABILITY TO MEET YOUR NEEDS. WE PROVIDE THE
                        SERVICES “AS IS”.

                        SOME JURISDICTIONS PROVIDE FOR CERTAIN WARRANTIES, LIKE THE IMPLIED WARRANTY OF MERCHANTABILITY,
                        FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. TO THE EXTENT PERMITTED BY LAW, WE
                        EXCLUDE ALL WARRANTIES.
                        </div>

                        <h2>Liability for our Services</h2>
                    <div className="tosBody">

                            WHEN PERMITTED BY LAW, KITEROPE, AND KITEROPE’S SUPPLIERS AND DISTRIBUTORS, WILL NOT BE
                            RESPONSIBLE FOR LOST PROFITS, REVENUES, OR DATA, FINANCIAL LOSSES OR INDIRECT, SPECIAL,
                            CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES.

                            TO THE EXTENT PERMITTED BY LAW, THE TOTAL LIABILITY OF KITEROPE, AND ITS SUPPLIERS AND
                            DISTRIBUTORS, FOR ANY CLAIMS UNDER THESE TERMS, INCLUDING FOR ANY IMPLIED WARRANTIES, IS
                            LIMITED TO THE AMOUNT YOU PAID US TO USE THE SERVICES (OR, IF WE CHOOSE, TO SUPPLYING YOU
                            THE SERVICES AGAIN).

                            IN ALL CASES, KITEROPE, AND ITS SUPPLIERS AND DISTRIBUTORS, WILL NOT BE LIABLE FOR ANY LOSS
                            OR DAMAGE THAT IS NOT REASONABLY FORESEEABLE.


                        </div>
                        <h2>User Content</h2>
                        <div className="tosBody">Kiterope takes no responsibility for, we do not expressly or implicitly
                            endorse, and we do not assume any liability for any user content submitted to Kiterope.
</div>

                            <h2>The Site Does Not Provide Medical Advice</h2>

                            <div className="tosBody">The contents of the Kiterope Site, such as text, graphics, images,
                                information obtained from Kiterope's licensors, and other material contained on the
                                Kiterope Site ("Content") are for informational purposes only. The Content is not
                                intended to be a substitute for professional medical advice, diagnosis, or treatment.
                                Always seek the advice of your physician or other qualified health provider with any
                                questions you may have regarding a medical condition. Never disregard professional
                                medical advice or delay in seeking it because of something you have read on the Kiterope
                                Site!

                                If you think you may have a medical emergency, call your doctor or 911 immediately.
                                Kiterope does not recommend or endorse any specific tests, physicians, products,
                                procedures, opinions, or other information that may be mentioned on the Site. Reliance
                                on any information provided by Kiterope, Kiterope employees, others appearing on the
                                Site at the invitation of Kiterope, or other visitors to the Site is solely at your own
                                risk.
                                </div>

                                <h2>Business uses of our Services</h2>
<div className="tosBody">
                                If you are using our Services on behalf of a business, that business accepts these
                                terms. It will hold harmless and indemnify Kiterope and its affiliates, officers,
                                agents, and employees from any claim, suit or action arising from or related to the use
                                of the Services or violation of these terms, including any liability or expense arising
                                from claims, losses, damages, suits, judgments, litigation costs and attorneys’ fees.

                            </div>
                            <h2>About these Terms</h2>

                            <div className="tosBody">We may modify these terms or any additional terms that apply to a
                                Service to, for example, reflect changes to the law or changes to our Services. You
                                should look at the terms regularly. We’ll post notice of modifications to these terms on
                                this page. We’ll post notice of modified additional terms in the applicable Service.
                                Changes will not apply retroactively and will become effective no sooner than fourteen
                                days after they are posted. However, changes addressing new functions for a Service or
                                changes made for legal reasons will be effective immediately. If you do not agree to the
                                modified terms for a Service, you should discontinue your use of that Service.

                                If there is a conflict between these terms and the additional terms, the additional
                                terms will control for that conflict.

                                These terms control the relationship between Kiterop and you. They do not create any
                                third party beneficiary rights.

                                If you do not comply with these terms, and we don’t take action right away, this doesn’t
                                mean that we are giving up any rights that we may have (such as taking action in the
                                future).

                                If it turns out that a particular term is not enforceable, this will not affect any
                                other terms.

                                The laws of California, U.S.A., excluding California’s conflict of laws rules, will
                                apply to any disputes arising out of or relating to these terms or the Services. All
                                claims arising out of or relating to these terms or the Services will be litigated
                                exclusively in the federal or state courts of Los Angeles County, California, USA, and
                                you and Kiterope consent to personal jurisdiction in those courts.

                                For information about how to contact Kiterope, please visit our contact page.
                            </div>
                            <div className="spacer">&nbsp;</div>
                            <div className="spacer">&nbsp;</div>


                        </div>
        </div></div>
            <Footer /></div>
        )
    }
}

module.exports={ TermsOfServicePage };
