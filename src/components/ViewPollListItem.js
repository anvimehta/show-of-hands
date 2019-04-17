import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import numeral from 'numeral';
import CATEGORIES from '../util/categories';

function ChoiceListItem(props) {
	// console.log(props.text);
	const span = props.isVisible ? <span> - {props.votes || 0} votes</span> : null;
	return <span className="view-ul">{props.text} {span}</span>;
}

class ViewPollListItem extends React.Component {
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
			 <div id="poll-cards">
				<h1 className="trending-polls">{this.poll.title}</h1>
		
				<h3 className="view-category">Category: {this.categories[this.poll.category]}</h3>
				<p className="view-description">{this.poll.description}</p>
				<label className="view-choices">Choices:</label>
				<ul>{choicesList}</ul>
				<p className="view-expiry">Expire{(new Date() >= this.poll.end_date ? 'd' : 's')} on: {moment(new Date(this.poll.end_date)).format("YYYY-MM-DD")}</p>
				<p className="view-like">{this.poll.like_count} likes </p>
			</div>
			</Link>

		);
	}
}

export default ViewPollListItem;