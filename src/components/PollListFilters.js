import React from 'react';
import { connect } from 'react-redux';
import { DateRangePicker } from 'react-dates';
import {
	setCategoryFilter, setTextFilter, triggerSort,
	setStartDate, setEndDate, setStatus
} from '../actions/filters';
import { listPolls } from '../actions/polls';
import { getCategoryOptions } from '../util/categories.js';

export class PollListFilters extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			calendarFocused: null
		};
		this.onDatesChange = this.onDatesChange.bind(this);
		this.onFocusChange = this.onFocusChange.bind(this);
		this.onTextChange = this.onTextChange.bind(this);
		this.onStatusChange = this.onStatusChange.bind(this);
		this.onSortChange = this.onSortChange.bind(this);
		this.onCategoryChange = this.onCategoryChange.bind(this);
	}
	onStatusChange (e) {
    	this.props.setStatus(e.target.value)
	};
	onDatesChange({ startDate, endDate }) {
    	this.props.setStartDate(startDate);
    	this.props.setEndDate(endDate);
	};
	onFocusChange(calendarFocused) {
	    this.setState({ calendarFocused });
	}
	onTextChange(e) {
    	this.setState({
    		textFilter: e.target.value
    	})
    	this.props.setTextFilter(e.target.value);
	}
	onCategoryChange (e) {
	    this.props.setCategoryFilter(e.target.value);
	}
	onSortChange(e) {
		this.props.triggerSort(e.target.value);
	}
	render() {
    	const { filters } = this.props;
    	return (
    		<div className="filters">
			<br/>
        		<span>Filter by</span><br/>
        		<select
        			id="select-category"
        			onChange={this.onCategoryChange}
        		>
        			<option value="">Select Category</option>
        			{getCategoryOptions()}
        		</select>
        		
        		<select
        			onChange={this.onStatusChange}
        		>
        			<option selected value="">Select Active Status</option>
        			<option value="ACTIVE">Active Polls</option>
        			<option value="INACTIVE">Inactive Polls</option>
        		</select>
        		<br/><br/>
				<input
        			type="text"
        			value={this.state.textFilter || ""}
        			onChange={this.onTextChange}
        			placeholder="Search by keyword"
        		/>
				<br/><br/>
        		<DateRangePicker
        			startDate={filters ? filters.startDate : null}
        			endDate={filters ? filters.endDate : null}
        			onDatesChange={this.onDatesChange}
        			focusedInput={this.state.calendarFocused}
        			onFocusChange={this.onFocusChange}
        			showClearDates={true}
        			numberOfMonths={1}
        			isOutsideRange={() => false}
        		/>
        		<br/><br/>
        		<span>Sort:</span>
				<br/>
        		<select
        			onChange={this.onSortChange}
        		>
					<option value ="">Sort by</option>
        			<option value="DATE_ASC">Date (oldest first)</option>
        			<option value="DATE_DESC">Date (newest first)</option>
        			<option value="NUMBER_OF_RESPONSES_ASC">Number of Responses (asc.)</option>
        			<option value="NUMBER_OF_RESPONSES_DESC">Number of Responses (desc.)</option>
        		</select>
				<br/>
        		<hr/>
				<br/>
    		</div>
    	);
	}
};

const mapStateToProps = (state) => ({
	filters: state.filters
});

const mapDispatchToProps = (dispatch, props) => {

	const actions = {
	setTextFilter: (text) => dispatch(setTextFilter(text)),
	setCategoryFilter: (text) => dispatch(setCategoryFilter(text)),
	triggerSort: sort => dispatch(triggerSort(sort)),
	setStartDate: (startDate) => dispatch(setStartDate(startDate)),
	setEndDate: (endDate) => dispatch(setEndDate(endDate)),
	setStatus: status => dispatch(setStatus(status))
	};

	Object.keys(actions).forEach(action => {
	const fn = actions[action];
	actions[action] = (...args) => {
		fn(...args);
		dispatch(listPolls());
		props.onChange();
	}
	})

	return actions;
};

export default connect(mapStateToProps, mapDispatchToProps)(PollListFilters);
