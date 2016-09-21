var React = require('react')
var ReactDOM = require('react-dom')
var App = require('./app')
var Goal = require('./goal')
var $  = require('jquery');
import { Router, Route, Link, browserHistory } from 'react-router'
var ObjectCreationPage = require('./plan')
var ObjectPage = require('./step')





var data = [
  {id: 1, url: "Pete Hunt", text: "This is one comment"},
  {id: 2, author: "Jordan Wlke", text: "This is *another* comment"}
];

{/*ReactDOM.render(<App url="http://127.0.0.1:8000/api/goals/"
                       pollInterval={2000}/>, document.getElementById('react-app'))
ReactDOM.render(
    <ObjectCreationPage />, document.getElementById('react-app')

)*/}

ReactDOM.render((
    <Router history={browserHistory}>
      <Route path="/" component={App} >
          <Route path="goal" component={Goal} url="http://127.0.0.1:8000/api/goals/"  pollInterval={2000}/>

          <Route path="plan" component={ObjectCreationPage}/>
              <Route path="step" component={() => (<ObjectPage url="http://127.0.0.1:8000/api/steps/"
                                                               pageHeadingLabel="Steps"
                                                               actionButtonLabel="Add Step"
                                                               actionFormRef="stepForm"
                                                               modelForm="StepForm"/>)} />
    </Route>
      </Router>), document.getElementById('react-app')
)

