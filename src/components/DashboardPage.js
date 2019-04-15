import React from 'react';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import { startAnswerPoll, startGetPoll } from '../actions/polls';
import { updateUser, getUser } from '../actions/auth';
import getPoll from '../selectors/get-poll';
import PhoneNumber from './PhoneNumber';
import ViewPollsCreated from './ViewPollCreated';
import ViewPollsAnswered from './ViewPollAnswered';

let UID;
let user = firebase.auth();

class DashboardPage extends React.Component {
    constructor (props) {
        super(props)
        this.saveProfileData = this.saveProfileData.bind(this)
        this.renderSelectedSection = this.renderSelectedSection.bind(this)
        this.selectPollsSection = this.selectPollsSection.bind(this)
        this.userData = {
            phone_number: user.phone_number
        }
        this.SECTIONS = {
            CREATED_BY_USER: 0,
            ANSWERED_BY_USER: 1
        }
        this.state = {
            selectedPollsSection: this.SECTIONS.CREATED_BY_USER
        }
    }
    componentDidMount () {
        getUser(this.props.uid, (err, user) => {
            this.setState({
                user
            })
        })
    }

    selectPollsSection (e) {
        this.setState({
            selectedPollsSection: +e.target.dataset.section
        })
    }

    renderSelectedSection () {

        let polls = null
        switch (this.state.selectedPollsSection) {
            case this.SECTIONS.CREATED_BY_USER:
                polls = <ViewPollsCreated />
                break;
            case this.SECTIONS.ANSWERED_BY_USER:
                polls = <ViewPollsAnswered />
                break;
        }

        return <div>
            <button className={`button ${this.state.selectedPollsSection === this.SECTIONS.CREATED_BY_USER ? "active" : ""}`} data-section={this.SECTIONS.CREATED_BY_USER} onClick={this.selectPollsSection}>
                Created by me
            </button>
            <button className={`button ${this.state.selectedPollsSection === this.SECTIONS.ANSWERED_BY_USER ? "active" : ""}`} data-section={this.SECTIONS.ANSWERED_BY_USER} onClick={this.selectPollsSection}>
                Answered by me
            </button>
            {polls}
        </div>
    }
    onUserDataChange (field, value) {
        this.userData[field] = value
    }
    saveProfileData () {
        updateUser(this.props.uid, this.userData).then(() => {
            location.reload();
        })
    }
    render() {
        user = this.state.user 

        if (!user) {
            return null
        }

        return (
            <div>

                <h1 id="my-dashboard">My Dashboard</h1>
                    <img
                    src={user.photo_url}
                    alt={user.display_name + "'s profile picture"}
                    width="70"
                    height="70"/>
                <br/>
                    {user.display_name}'s Dashboard
                <p>Email:           {user.email}</p>
                <p>User ID:         {user.id}</p>
                <p>Phone number:</p>
                <PhoneNumber
                    phoneNumber={user.phone_number}
                    onChange={this.onUserDataChange.bind(this, "phone_number")}
                />
                <br/>
                <button onClick={this.saveProfileData} className="button">Save</button>
                <br /><br />
                {this.renderSelectedSection()}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
	const poll = getPoll(state.poll);
	// console.log("State:");
	// console.log(state);
	const uid = state.auth.uid;
    UID = uid;
	return { poll, uid };
};

export default connect(mapStateToProps)(DashboardPage);
