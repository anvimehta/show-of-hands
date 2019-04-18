import React from 'react';
import { connect } from 'react-redux';
import numeral from 'numeral';
import ViewPollListItem from './ViewPollListItem';
import getPoll from '../selectors/get-poll';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { startEditPoll } from '../actions/polls';
import ReactDOM from 'react-dom';
import { CopyToClipboard } from 'react-copy-to-clipboard';

export class ViewPollItem extends React.Component {
	constructor (props) {
		super(props)

		this.toggleLikePoll = this.toggleLikePoll.bind(this)
		this.likePoll = this.likePoll.bind(this)
		this.unlikePoll = this.unlikePoll.bind(this)
		this.likeCount = this.likeCount.bind(this)

		this.state = {
			poll_liked: this.isLikedAlready(),
			value: 'localhost:8080/polls/'+this.props.poll.id,
      copied: false,
		};

	}
	likeCount () {
		return Object.keys(this.props.poll.likes || {}).length
	}
	isLikedAlready () {
		return Object(this.props.poll.likes)[this.props.uid]
	}
	updateDb () {
		startEditPoll(this.props.poll.id, {
			likes: this.props.poll.likes
		})(function () {})

	}
	likePoll () {
		this.props.poll.likes = Object(this.props.poll.likes)
		this.props.poll.likes[this.props.uid] = Date.now()
		this.updateDb();
		this.setState({ poll_liked: true })
	}
	unlikePoll () {
		delete this.props.poll.likes[this.props.uid]
		this.updateDb();
		this.setState({ poll_liked: false })
	}
	toggleLikePoll () {
		if (this.isLikedAlready()) {
			this.unlikePoll()
		} else {
			this.likePoll()
		}
	}
	render () {
		const { poll } = this.props;
		if (!poll || !poll.id) { return null; }
		const {
			id, numberOfOptions, createdAt, description
		} = poll;
		this.state.value='localhost:8080/polls/'+poll.id

		return (
			<div>
				<ViewPollListItem uid={this.props.uid} data={poll} />
				{
					poll && poll.editable ? <div><Link to={`/polls/${id}/edit`}>
						<button className="button" id="view-edit">
							Edit
						</button>
					</Link><Link to={`/polls/${id}/answer`}>
					<button className="button" id="view-answer">
						Answer
					</button>
				</Link> <button className="button" onClick={this.toggleLikePoll} id="view-like">
					{ this.isLikedAlready() ? "Unlike" : "Like" }<br/>
				</button><CopyToClipboard text={this.state.value}
          onCopy={() => this.setState({copied: true})}>
          <button className="button" id="share-poll">
					  Share This Poll
					</button>
		</CopyToClipboard> </div> :  <div><Link to={`/polls/${id}/answer`}>
					<button className="button" id="view-answer-first">
						Answer
					</button>
				</Link> <button className="button" onClick={this.toggleLikePoll} id="view-like">
					{ this.isLikedAlready() ? "Unlike" : "Like" }<br/>
				</button><CopyToClipboard text={this.state.value}
          onCopy={() => this.setState({copied: true})}>
          <button className="button" id="share-poll">
					  Share This Poll
					</button>
        </CopyToClipboard></div>
				}
				

        
        {this.state.copied ? alert('Link has been copied to clipboard!') : null}
				{ " " }
			</div>


		);
	}
}

const mapStateToProps = (state) => {
	const poll = getPoll(state.poll);
	return { poll, uid: state.auth.uid };
};


export default connect(mapStateToProps)(ViewPollItem);
