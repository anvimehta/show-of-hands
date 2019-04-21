import React from 'react';
import CATEGORIES, { getCategoryOptions } from '../util/categories.js';
import moment from 'moment';

// Component for one choice in the poll
function Choice(props) {
	return (
		<input
			type="text"
			className="choice-title"
			placeholder={"Choice "+props.num}
			value={props.text}
			onChange={(e) => props.onChange(e, props.num-1)}/>
	);
}

class CreateForm extends React.Component {
	constructor(props) {
		super(props);

		this.categories = CATEGORIES;

		this.state = {
			title: '',
			description: '',
			textChoices: ['', ''],
			choices: [{
				text: '',
				votes: 0
			}, {
				text: '',
				votes: 0
			}],
			category: 0,
			newChoiceText: '',
			start_date: new Date(),
			end_date: this.getDate(0),
			public_results: true
		};
		this.updateChoiceValue = this.updateChoiceValue.bind(this);
		this.updateValue = this.updateValue.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}


	componentDidMount () {
	const props = this.props;
	if (props.poll && props.poll.id) {
		this.setState({
			title: props.poll.title,
			description: props.poll.description,
			textChoices: (props.poll.choices || []).map(c => c.text),
			choices: props.poll.choices || [],
			category: props.poll.category,
			newChoiceText: '',
			start_date: props.poll.start_date,
			end_date: moment(new Date(props.poll.end_date)).format("YYYY-MM-DD"),
			public_results: props.poll.public_results
		})
	}
	}

	// Methods to update variables when the form is changed by user
	updateValue(e, attr) {
		if (attr === 'title') {
			this.setState({
				title: e.target.value
			});
		} else if (attr === 'description') {
			this.setState({
				description: e.target.value
			});
		} else if (attr === 'newChoiceText') {
			this.setState({
				newChoiceText: e.target.value
			});
		} else if (attr === 'category') {
			this.setState({
				category: e.target.value
			});
		} else if (attr === 'end_date') {
			this.setState({
				end_date: e.target.value
			});
		}
	}
	updateChoiceValue(e, index) {
		// console.log(e.target.value);
		let tc = this.state.textChoices;
		tc[index] = e.target.value;
		let c = this.state.choices;
		c[index].text = e.target.value;
		// console.log(c);
		this.setState({
			textChoices: tc,
			choices: c
		});
	}
	handleNewChoiceClick(e) {
		this.setState({
			textChoices: this.state.textChoices.concat([this.state.newChoiceText]),
			choices: this.state.choices.concat([{
				text: this.state.newChoiceText,
				votes: 0
			}]),
			newChoiceText: ''
		})
	}
	removeChoice(text) {
		let index = 2;
		let tc = this.state.textChoices.slice();
		for (let i = 2; i < tc.length; i++) {
			if (tc[i] === text) {
				index = i;
				break;
			}
		}
		// console.log("Remove " + text + ": index " + index);
		// console.log(tc);
		tc.splice(index, 1);
		// console.log(tc);
		let c = this.state.choices.slice();
		c.splice(index, 1);
		this.setState({
			textChoices: tc,
			choices: c
		});
	}
	updatePublicResults(e) {
		this.setState({
			public_results: !e.target.checked
		})
	}

	// Get current date in YYYY-MM-DD format with an offset of months
	getDate(month_offset, date_offset) {
		let date = new Date();
		date.setMonth(date.getMonth() + month_offset);
		if (date_offset) date.setDate(date.getDate() + date_offset);
		return date.toISOString().substring(0,10);
	}

	// Send form data to backend API
	handleSubmit(e) {
		e.preventDefault()
		this.props.onSubmit({
			title: this.state.title,
			description: this.state.description,
			category: this.state.category,
			choices: this.state.choices,
			end_date: this.state.end_date,
			public_results: this.state.public_results,
			responders: [],
			user_id:0
		});
	}
	render() {
		let i = 1;
		const textChoicesList = this.state.textChoices.map((choice) =>
		<div>
			<li className="choices-list" key={i}>
				<Choice num={i++} text={choice} onChange={this.updateChoiceValue}/>
				{ i >= 4 ? (
					<input type="button" value="-" onClick={() => this.removeChoice(choice)}/>
				) : null
				}
			</li>
			<br/></div>
		);
		i = 0;
		const categories = getCategoryOptions()
		return (
			<form className="create-form" onSubmit={this.handleSubmit} >

				{/* Title input */}
				<label>Title:</label>
				<br/>
				<input required
				maxLength="40" type="text"
				id="title-input"
				placeholder="Enter title"
				value={this.state.title}
				onChange={e => this.updateValue(e, 'title')}/>
				<br/>
				<br />

				{/* Description input */}
				<label>Description:</label>
				<input required maxLength="250" type="text"
				id="description-input"
				placeholder="Enter description"
				value={this.state.description}
				onChange={e => this.updateValue(e, 'description')}></input>
				<br/>
				<br/>

				{/* Choice input */}
				<label>Answer Choices:</label>
				<ul className="choices-list">{textChoicesList}</ul>

				<input
					type="text"
					id="choice-input"
					value={this.state.newChoiceText}
					onChange={e => this.updateValue(e, 'newChoiceText')}
					placeholder="Add another choice"/>
				<input type="button" onClick={e => this.handleNewChoiceClick(e)} value="+"></input>
				<br/>
				<br/>

				<label>Poll Category:</label>
				<br/>
				<select id="select-category" value={this.state.category}
				onChange={e => this.updateValue(e, 'category')}>
					{categories}
				</select>
				<br/>
				<br/>
				{/* Lifespan input */}
				<label>This poll will end on:</label>
				<br/>
				<input
					type="date"
					value={this.state.end_date}
					min={this.getDate(0, 0)}
					max={this.getDate(1, 0)}
					onChange={e => this.updateValue(e, 'end_date')}/>
				<br/>
				<br/>

				{/* Public results input */}
				<label>Make end results private?</label>
				<input type="checkbox"
				id="private-results" checked={!this.state.public_results}
				onChange={e => this.updatePublicResults(e)}/>
				<br/>

				<input type="submit" value="Save Poll"/>
				<br/>
				<br/>
			</form>
		);
	}
}

export default CreateForm;
