import database, { firebase, googleAuthProvider } from '../firebase/firebase';

export const login = (uid) => ({
  type: 'LOGIN',
  uid
});

export const startLogin = () => {
  return () => {
    return firebase.auth().signInWithPopup(googleAuthProvider);
  };
};

export const setUser = (userId, userData) => {
	return database.ref('users').child(userId || userData.id).set(userData);
}


export const getUser = (userId, cb) => {
	return database.ref('users').child(userId).once("value", user => {
		user = user && user.val()
		if (user) {
			return cb(null, user)
		}
		cb("User not found.")
	});
}

export const updateUser = (userId, userData) => {
	return database.ref('users').child(userId || userData.id).update(userData);
}

export const logout = () => ({
  type: 'LOGOUT'
});

export const startLogout = () => {
  return () => {
    return firebase.auth().signOut();
  };
};
