import firebase from 'firebase/app'

export default {
  actions: {
    async login(_, { email, password }) {
      await firebase.auth().signInWithEmailAndPassword(email, password)
    },
    async logout() {
      await firebase.auth().signOut()
    },
    async register({ dispatch }, { name, email, password }) {
      await firebase.auth().createUserWithEmailAndPassword(email, password)
      const uid = await dispatch('getUid')
      await firebase
        .database()
        .ref(`/users/${uid}/info`)
        .set({ name })
    },
    getUid() {
      const user = firebase.auth().currentUser
      return user ? user.uid : null
    }
  }
}
