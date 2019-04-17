import React from 'react';
import { connect } from 'react-redux';
import PollList from './PollList';
import PollListFilters from './PollListFilters';
import PollsSummary from './PollsSummary';
import { listAllPolls } from '../actions/polls';

class ViewPage extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                filters: {}
            };
            this.rerenderList = this.rerenderList.bind(this);
        }

        rerenderList(filters) {
            this.setState({
                filters
            });
            this.props.refresh();
        }
	render () {
		return <div>
			<h3>Polls Answered by Me</h3>
			<PollList answeredByUser={true} filters={this.state.filters} />
		</div>;
	}
}


const mapDispatchToProps = (dispatch) => {
	dispatch(listAllPolls());
	return {
		refresh: () => dispatch(listAllPolls())
	};
};

export default connect(undefined, mapDispatchToProps)(ViewPage);
