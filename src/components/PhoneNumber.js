import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { isValidPhoneNumber } from 'react-phone-number-input'
import React from 'react';

class PhoneNumber extends React.Component {

	constructor (props) {
		super(props)
		this.inputOnChange = this.inputOnChange.bind(this)
		this.state = {
			phone: this.props.phoneNumber
		}
	}

	inputOnChange (phone) {
		this.setState({ phone }) 
		this.props.onChange(phone)
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
		    onChange={this.inputOnChange} />
		)
	}
}
 
export default PhoneNumber;