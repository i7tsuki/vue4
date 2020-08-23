
import Firebase from './config/firebase-config'
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueRouter)

const dataList = 'users';

const store = new Vuex.Store({
  state: {
    userName: null,
    mail: null,
    password: null,
    wallet: null,
    loginStatus: false,
    isMailAddress: null,
  },
  mutations: {
    setUser(state, argument) {
      state.userName = argument.userName;
      state.mail = argument.mail;
      state.password = argument.passwords;
      state.wallet = 100,
      state.loginStatus = true;
    },
    setIsMailAddress(state, isMailAddress) {
      if (isMailAddress) {
        state.loginStatus = false;
        state.isMailAddress = true;
      } else {
        state.isMailAddress = false;
      }
    }
  }, 
  actions: {
    async readUserByEmail(context, mail) {
     return new Promise((resolve) => {
        Firebase.database().ref(dataList)
          .orderByChild('mail')
          .startAt(mail).endAt(mail)
          .once('value', function(snapshot) {  
            //既にメールアドレスが登録済みのユーザでないかどうか確認    
            if (snapshot.exists()) { //登録済みの場合
              context.commit('setIsMailAddress', true);
            } else { //未登録の場合
              context.commit('setIsMailAddress', false);
            }
          }).catch(error => alert(error));
        resolve();
      });
    },
    async createUserAccount(context, argument) {
      await context.dispatch('readUserByEmail', argument.mail
      ).then(function() {
        if (context.getters.getStateIsMailAddress) {
          throw new Error('既にメールアドレスが登録済みです!');
        } else {
          return new Promise(function (resolve) {
            Firebase
              .auth()
              .createUserWithEmailAndPassword(argument.mail, argument.password)
              .then(() => {
                context.commit('setUser', {
                  'userName': argument.userName,
                  'mail': argument.mail,
                  'password': argument.password, 
                });
                resolve();
              });
          }).then(function() {
            Firebase.database().ref(dataList).push({
              'userName': argument.userName,
              'mail': argument.mail,
              'password': argument.password,
              'wallet': 100,
            }).then(() => {
              alert("Create Account");
            });
          });
        }
      }).catch(error => alert(error));
    },
    login(context, argument) {
      let userName;
      return new Promise((resolve) => {
        Firebase
          .auth()
          .signInWithEmailAndPassword(argument.mail, argument.password)
          .then(() => {
            resolve();
          });
      }).then(function() {
        return new Promise((resolve) => {
          Firebase.database().ref(dataList)
            .orderByChild('mail')
            .startAt(argument.mail).endAt(argument.mail)
            .once('value', function(snapshot) {
              snapshot.forEach(function(childSnapshot) {
                userName = childSnapshot.val().userName;
                resolve();
              });
            });
        });
      }).then(function() {
        context.commit('setUser', {
          'userName': userName,
          'mail': argument.mail,
          'password': argument.password
        });
      }).catch(error => alert(error));
    }
  },
  getters: {
    getStateIsMailAddress: function(state) {
      return state.isMailAddress
    }
  }
});

const router = new VueRouter({
  mode: 'history',
  routes: App.routes
});

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
