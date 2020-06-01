import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import firebase from 'firebase/app'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    info: undefined,
    contacts: undefined,
    currentContactId: undefined
  },
  mutations: {
    setInfo(state, payload) {
      state.info = payload
    },
    setContacts(state, payload) {
      state.contacts = payload
    },
    setCurrentContactId(state, payload) {
      state.currentContactId = payload
    }
  },
  getters: {
    info(state) {
      return state.info
    },
    contacts(state) {
      return state.contacts
    },
    currentContact(state) {
      return state.contacts.filter(c => c.id === state.currentContactId)[0]
    }
  },
  actions: {
    async createContact({ dispatch }, contact) {
      const uid = await dispatch('getUid')
      return await firebase
        .database()
        .ref(`/users/${uid}/contacts`)
        .push(contact)
    },
    async fetchInfo({ commit, dispatch }) {
      const uid = await dispatch('getUid')
      const info =
        (
          await firebase
            .database()
            .ref(`/users/${uid}/info`)
            .once('value')
        ).val() || {}
      commit('setInfo', info)
    },
    async fetchContacts({ commit, dispatch }) {
      const uid = await dispatch('getUid')
      const contacts =
        (
          await firebase
            .database()
            .ref(`/users/${uid}/contacts`)
            .once('value')
        ).val() || {}
      const arrayContacts = Object.keys(contacts).map(key => ({ ...contacts[key], id: key }))
      commit('setContacts', arrayContacts)
    },
    async updateContact({ dispatch }, contact) {
      const uid = await dispatch('getUid')
      await firebase
        .database()
        .ref(`/users/${uid}/contacts`)
        .child(contact.id)
        .update({ ...contact, id: null })
      await dispatch('fetchContacts')
    },
    async removeContact({ dispatch }, id) {
      const uid = await dispatch('getUid')
      await firebase
        .database()
        .ref(`/users/${uid}/contacts`)
        .child(id)
        .remove()
      await dispatch('fetchContacts')
    }
  },
  modules: {
    auth
  }
})
