import React from 'react';
import { connect } from 'react-redux';
import PollForm from './CreateForm';
import { startAnswerPoll, startGetPoll } from '../actions/polls';
import getPoll from '../selectors/get-poll';

export class AnswerPollPage extends React.Component {
	constructor (props) {
		super(props);
		this.answerPoll = this.answerPoll.bind(this);
		this.handleAnswerChange = this.handleAnswerChange.bind(this);
	}

	answerPoll (poll) {
		const newVoteCount = ++this.props.poll.choices[this.state.selected_answer].votes;
		startAnswerPoll(this.props.poll.id, this.state.selected_answer, this.props.uid, newVoteCount)(() => {
			this.setState({
				poll_answered: true
			});
		});
	}

	handleAnswerChange (e) {
		this.setState({
			selected_answer: e.target.value
		});
	}

	render() {

		if (!this.props.poll || !this.props.poll.id) {
			return null;
		}

		if ((this.state && this.state.poll_answered) || Object(this.props.poll.responses)[this.props.uid]) {
			return (
				<div>
					<div className="content-container">
						<h3 className="answer-view">{this.props.poll.title}</h3>
						<p className="description-view">{this.props.poll.description}</p>
						<p className="you-have-answered"><strong>You have already answered this poll.</strong></p>
						<div className="answers">
							<a className="view-the-poll" href={`/polls/${this.props.poll.id}`}>
								
						<button className="view-view">View the poll</button>
							</a>
							
						</div>
					</div>
				</div>
			);
		}

		return (
			<div>
				<div className="content-container">
					<h3 className="answer-view">{this.props.poll.title}</h3>
					<p className="description-view">{this.props.poll.description}</p>
					<div className="answers">
						{
							this.props.poll.choices.map((choice, index) => {
								return <div className="answer-radio" key={index}>
									<label>
										<input
											type="radio"
											name="answer"
											value={index}
											onChange={this.handleAnswerChange}
										/>
										{"    "}
										<span>       {choice.text}</span>
									</label>
								</div>
							})
						}
					</div><br/>
					<button className="button button--secondary" id="answer-poll" onClick={this.answerPoll}>Answer Poll</button>
				</div>
			</div>
		);
	}
};

const mapStateToProps = (state) => {
	const poll = getPoll(state.poll);
	// console.log("State:");
	// console.log(state);
	const uid = state.auth.uid;
	return { poll, uid };
};

const mapDispatchToProps = (dispatch, route) => {
	const pollId = route.location.pathname.match(/\/polls\/(.*)\/answer\/?/)[1];
	return dispatch(startGetPoll({
		id: pollId
	}));
};

export default connect(mapStateToProps, mapDispatchToProps)(AnswerPollPage);
