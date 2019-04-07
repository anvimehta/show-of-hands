import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input'
import React from 'react';

class PhoneNumber extends React.Component {

	constructor (props) {
		super(props)
		this.state = {
			phone: this.props.phoneNumber
		}
	}

	render () {
		/*
if (value) {
  isValidPhoneNumber(value) // `true` or `false`
}*/
		return (
		  <PhoneInput
		    placeholder="Enter phone number"
		    value={ this.state.phone }
		    onChange={ phone => this.setState({ phone }) } />
		)
	}
}
 
export default PhoneNumber;