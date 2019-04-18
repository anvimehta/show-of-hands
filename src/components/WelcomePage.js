import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import TrendingList from './TrendingList';
import { listAllPolls } from '../actions/polls';

const WelcomePage = (props) => (
	<div>
		<link href="https://fonts.googleapis.com/css?family=PT+Sans" rel="stylesheet"/>
		<h1 className="trending-polls">Trending Polls</h1>
		<TrendingList />
	</div>
)


const mapDispatchToProps = (dispatch) => {
	dispatch(listAllPolls());
	return {
		refresh: () => dispatch(listAllPolls())
	};
};

export default connect(undefined, mapDispatchToProps)(WelcomePage);
