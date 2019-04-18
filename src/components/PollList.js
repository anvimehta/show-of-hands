import React from 'react';
import { connect } from 'react-redux';
import PollListItem from './PollListItem';
import selectPolls from '../selectors/polls';
import firebase from 'firebase/app'

class PollList extends React.Component {
	render () {
		const props = this.props;

		if (!props.polls || props.polls == undefined || props.polls.length === 0) {
			return <p>No polls</p>;
		}

		const pollItems = (
			props.userPolls ? props.polls.filter(c => c.author === props.uid) :
			props.answeredByUser ? props.polls.filter(c => (c.responses || {})[props.uid]) : props.polls
		).map((poll) => {
			return <PollListItem uid={props.uid} key={poll.id} data={poll} />;
		})

		return <div className="poll-list">{pollItems}</div>;
	}
}

const mapStateToProps = (state) => {
	const polls = selectPolls(state.polls, state.filters);
	return {
		polls,
		uid: state.auth.uid
	};
};

export default connect(mapStateToProps)(PollList);
