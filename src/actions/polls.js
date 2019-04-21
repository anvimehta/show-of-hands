import uuid from 'uuid';
import database from '../firebase/firebase';
import firebase from '../firebase/firebase';

// Check if the poll is expired
const isExpired = poll => new Date(poll.end_date) < new Date()
const likeCount = poll => Object.keys(poll.likes || {}).length
const countResponses = r => Object.keys(r.responses || {}).length

export const listAllPolls = (pollData = {}) => {
  return (dispatch) => {
    database.ref('polls').once("value").then((polls) => {
      polls = polls.val()
      const pollsArray = Object.keys(polls).map(id => {
        polls[id].id = id
        polls[id].like_count = likeCount(polls[id])
        polls[id].response_count = countResponses(polls[id])
        if (typeof polls[id].end_date === "string") {
          polls[id].end_date = new Date(polls[id].end_date).getTime()
        }
        return polls[id]
      })
      dispatch(listPolls(pollsArray))
    });
  };
};


const pollBeforeSave = poll => {
    poll.start_date = new Date(poll.start_date).getTime()
    poll.end_date = new Date(poll.end_date);
    // Make the poll available till midnight
    poll.end_date.setUTCHours(24);
    poll.end_date = poll.end_date.getTime()
}

export const startAddPoll = (pollData = {}) => {
    return (dispatch, getState) => {
        const {
            title = '',
            description = '',
            category = 0,
            choices = [],
            start_date = new Date(),
            end_date = new Date(),
            public_results = false
        } = pollData;

        const poll = {
            title,
            description,
            category,
            choices,
            start_date,
            end_date,
            public_results
        };

        pollBeforeSave(poll);
        
        poll.author = getState().auth.uid

        database.ref('polls').push(poll).then((ref) => {
            dispatch(getPoll({
                id: ref.key
            }));
        });
    };
};

export const startGetPoll = (pollData = {}) => {
  return (dispatch, getState) => {
    database.ref('polls').child(pollData.id).once("value").then((ref) => {
      const poll = ref.val()
      poll.id = ref.key
      poll.editable = (poll.author === getState().auth.uid)
        if (pollData.edit && !poll.editable) {
        window.location = "/polls"
        return
      }
      poll.is_expired = isExpired(poll)
      poll.like_count = likeCount(poll)
      poll.response_count = countResponses(poll)
      dispatch(getPoll(poll));
    }).catch(e => console.error(e))
  };
};

export const startAnswerPoll = (id, answerIndex, userId, newVotesCount) => {
  return (dispatch) => {
    const pollRef = database.ref('polls').child(id);

    Promise.all([
      pollRef.child("choices").child(answerIndex).child("votes").set(newVotesCount),
      pollRef.child("responses").child(userId).set(answerIndex)
    ]).then(() => {
        dispatch(answerPoll({
            answer: answerIndex
        }));
    });
  };
};

export const startEditPoll = (id, newData) => {
    return (dispatch) => {
        pollBeforeSave(newData)
        delete newData.start_date
        database.ref('polls').child(id).update(newData).then(() => {
            dispatch(editPoll({
                id
            }));
        });
    };
};


export const startRemovePoll = (id) => {
    return (dispatch) => {
        database.ref('polls').child(id).remove().then(() => {
            dispatch(addPoll({
                id
            }));
        });
    };
};

// ADD_POLL
export const addPoll = (poll) => ({
  type: 'ADD_POLL',
  poll
});

// LIST POLL
export const listPolls = (polls) => ({
  type: 'LIST_POLLS',
  polls
});

// GET POLL
export const getPoll = (poll) => ({
  type: 'GET_POLL',
  poll
});

// REMOVE_POLL
export const removePoll = ({ id } = {}) => ({
  type: 'REMOVE_POLL',
  id
});

// EDIT_POLL
export const editPoll = (id, updates) => ({
    type: 'EDIT_POLL',
    id,
    updates
});

// ANSWER POLL
export const answerPoll = (id, updates) => ({
  type: 'ANSWER_POLL',
  id,
  updates
});
