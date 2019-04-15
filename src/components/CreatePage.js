import React from 'react';
import { connect } from 'react-redux';
import CreateForm from './CreateForm.js';
import { startAddPoll } from '../actions/polls';

class CreatePage extends React.Component {
	constructor(props) {
		super(props);
	}
	componentDidMount () {

		listAllPolls()(data => {
		
		const createdPollsCount = data.polls.reduce((acc, c) => {
		if (c.author === this.props.uid) {
		return acc + 1
		}
		return acc;
		}, 0)
		
		const answeredPollsCount = data.polls.reduce((acc, c) => {
		if (c.responses && c.responses[this.props.uid]) {
		return acc + 1
		}
		return acc;
		}, 0)
		
		const ratio = answeredPollsCount / createdPollsCount
		
		console.log(ratio)
		
		if (data.polls.length > 5 && ratio < 0.5) {
		this.setState({
		loading: false,
		error: "You have to answer some polls. You will be redirected."
		})
		setTimeout(function () {
		window.location = "/welcome"
		}, 2000)
		} else {
		this.setState({ loading: false })
		}
		})
		}
	createPoll(poll) {
		this.props.startAddPoll(poll);
		this.props.history.push('/welcome');
	}
	render() {
		return (
			<div className="create-a-poll">
				<h1>Create a Poll</h1>
				<CreateForm onSubmit={poll => this.createPoll(poll)}/>
			</div>
		);
	}
}

const mapDispatchToProps = (dispatch) => ({
	startAddPoll: (poll) => dispatch(startAddPoll(poll))
});

	
	
	export default connect(undefined, mapDispatchToProps)(CreatePage);
