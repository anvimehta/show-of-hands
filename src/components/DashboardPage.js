import React from 'react';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import { startAnswerPoll, startGetPoll } from '../actions/polls';
import { updateUser, getUser } from '../actions/auth';
import getPoll from '../selectors/get-poll';
import PhoneNumber from './PhoneNumber';

let UID;
let user = firebase.auth();

class DashboardPage extends React.Component {
    constructor (props) {
        super(props)
        this.saveProfileData = this.saveProfileData.bind(this)
        this.userData = {
            phone_number: user.phone_number
        }
        this.state = {}
    }
    componentDidMount () {
        getUser(this.props.uid, (err, user) => {
            this.setState({
                user
            })
        })
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
                    {user.display_name}'s Dashboard
                <p>Email:           {user.email}</p>
                <p>User ID:         {user.id}</p>
                <p>Phone number:    {user.phoneNumber ? user.phone_number : "None provided"}</p>
                <PhoneNumber
                    phoneNumber={user.phone_number}
                    onChange={this.onUserDataChange.bind(this, "phone_number")}
                />
                <br/>
                <button onClick={this.saveProfileData} className="button">Save</button>
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
