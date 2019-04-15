import React from 'react';

class QuidProQuo extends React.Component {
    constructor (props) {
		super(props)
		this.inputOnChange = this.inputOnChange.bind(this)
		this.state = {
			score: this.props.score
		}
	}

	inputOnChange (phone) {
		this.setState({ phone }) 
		this.props.onChange(phone)
	}
}