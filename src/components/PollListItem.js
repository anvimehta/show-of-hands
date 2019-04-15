import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import numeral from 'numeral';
import CATEGORIES from '../util/categories'
function ChoiceListItem(props) {
	// console.log(props.text);
	const span = props.isVisible ? <span> - {props.votes || 0} votes</span> : null;
	return <span>{props.text} {span}</span>;
}

class PollListItem extends React.Component {
	constructor(props) {
		super(props);
		this.poll = this.props.data;
		this.categories = CATEGORIES;
	}

	render() {
		// If the public_results is:
		//. - false: the results wqill never be disaplyed
		//. - true: the results will be visible after the user responded

		// public_results:
		//.		true.		false
		//.		 |.				|
		//.	 user responded?	 |
		//.	 |yes		|no	 |
		//.	DISPLAY.	 +----- DO NOT DISPLAY
		//.	RESULTS.			THE RESULTS



		const choicesList = (this.poll.choices || []).map((choice, index) =>
			<li key={index}>
				<ChoiceListItem
					text={choice.text}
					votes={choice.votes}
					isVisible={
						this.props.uid === this.poll.author || (
							this.poll.public_results && Object(this.poll.responses)[this.props.uid]
						)
					}
				/>
			</li>
		);

		let total_votes = 0;
		for (let i = 0; i < this.poll.choices.length; i++) {
			total_votes += this.poll.choices[i].votes;
		}
		return (
			<Link className="poll-title" to={`/polls/${this.poll.id}`}>
				<div id="poll-card">
					<h1>{this.poll.title}</h1>

					<h3>Category: {this.categories[this.poll.category]}</h3>
					<p>{this.poll.description}</p>
					<label>Choices:</label>
					<ul>{choicesList}</ul>
					<p>Expire{(new Date() >= this.poll.end_date ? 'd' : 's')} on: {moment(new Date(this.poll.end_date)).format("YYYY-MM-DD")}</p>
				</div>
			</Link>

		);
	}
}

export default PollListItem;
