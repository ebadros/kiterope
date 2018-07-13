// CardSection.js
import React from 'react';
import {CardElement} from 'react-stripe-elements';

class CardSection extends React.Component {
  render() {
    return (

      <div className="field">
        <CardElement style={{base: {fontSize: '18px'}}} />
      </div>
    );
  }
}

export default CardSection;