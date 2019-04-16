import React from 'react';
import { connect } from 'react-redux';
import PollListItem from './PollListItem';
import selectPolls from '../selectors/polls';
import firebase from 'firebase/app'

// import 'firebase/firestore'

/*
const db = firebase.firestore();
db.collection("cities").doc("LA").set({
	name: "Los Angeles",
	state: "CA",
	country: "USA"
})
.then(function() {
	// console.log("Document successfully written!");
})
.catch(function(error) {
	console.error("Error writing document: ", error);
});
*/

class PollList extends React.Component {

	render () {

		const props = this.props;

		if (!props.polls || props.polls.length === 0) {
			return <p>No polls</p>;
		}

		const pollItems = (
			
			props.userPolls ? props.polls.filter(c => c.author === props.uid) : 
			props.answeredByUser ? props.polls.filter(c => (c.responses || {})[props.uid]) : props.polls
		).map((poll) => {
			return <PollListItem uid={props.uid} key={poll.id} data={poll} />;
		});

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
