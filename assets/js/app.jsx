var React = require('react')
var ReactDOM = require('react-dom')
var $  = require('jquery');
global.rsui = require('react-semantic-ui')
var forms = require('newforms')
import { Router, Route, Link, browserHistory } from 'react-router'


const App = React.createClass({
  render() {
    return (
      <div>
        <h1>App</h1>
        <ul>
          <li><Link to="/goal">Goal</Link></li>
          <li><Link to="/plan">Plan</Link></li>
            <li><Link to="/step">Step</Link></li>


        </ul>
        {this.props.children}
      </div>
    )
  }
})

module.exports = App