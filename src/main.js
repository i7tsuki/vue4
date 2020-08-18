
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
  },
  mutations: {
    setUser(state, argument) {
      state.userName = argument.userName;
      state.mail = argument.mail;
      state.password = argument.passwords;
      state.wallet = 100,
      state.loginStatus = true;
    },
  }, 
  actions: {
    createUserAccount(context, argument) {
      return new Promise((resolve, reject) => {
        Firebase.database().ref(dataList)
          .orderByChild('mail')
          .startAt(argument.mail).endAt(argument.mail)
          .once('value', function(snapshot) {      
            //既にメールアドレスが登録済みのユーザでないかどうか確認    
            if (snapshot.exists()) { //登録済みの場合
              store.state.loginStatus = false;
              reject(new Error('既にメールアドレスが登録済みです!'));
            } else { //未登録の場合
              resolve(); 
            }
          });
        }).then(function() {
          return new Promise((resolve) => {
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
          });
        }).then(function() {
          return new Promise((resolve) => {
            Firebase.database().ref(dataList).push({
              'userName': argument.userName,
              'mail': argument.mail,
              'password': argument.password,
              'wallet': 100,
            }).then(() => {
              alert("Create Account");
              resolve();
            });
          })
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
        return new Promise((resolve) => {
          context.commit('setUser', {
          'userName': userName,
          'mail': argument.mail,
          'password': argument.password
          });
          resolve();
        });
      }).catch(error => alert(error));
    }
  },
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
