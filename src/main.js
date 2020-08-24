
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
      state.password = argument.password;
      state.wallet = 100,
      state.loginStatus = true;
    },
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
              context.commit('setUser', {
                mail: mail,
              });
            } else { //未登録の場合
              context.commit('setUser', {
                mail: null,
              });
            }
          }).then(function() {
            resolve();
          }).catch(error => alert(error));
      });
    },
    async createUserEmailAndPassword(context, argument) {
        const localSetUser = new Promise(resolve => {
          Firebase
            .auth()
            .createUserWithEmailAndPassword(argument.mail, argument.password)
            .then(() => {
              context.commit('setUser', {
                userName: argument.userName,
                mail: argument.mail,
                password: argument.password, 
              });
              resolve();
            });
        });
        const dbSetUser = new Promise(resolve => {
          Firebase.database().ref(dataList).push({
            userName: argument.userName,
            mail: argument.mail,
            password: argument.password,
            wallet: 100,
          }).then(() => {
            resolve();
          });
        });
        return Promise.all([localSetUser, dbSetUser]).then(() => {
          alert("Create Account");
        }).catch(error => alert(error));
    },
    async createUserAccount(context, argument) {
      await context.dispatch('readUserByEmail', argument.mail);
      if (context.getters.mail !== null) {
        throw new Error('既にメールアドレスが登録済みです!');
      } else {
        await context.dispatch('createUserEmailAndPassword', {
          userName: argument.userName,
          mail: argument.mail,
          password: argument.password, 
        });
      }
    },
    async login(context, argument) {
      await context.dispatch('loginEmailAndPassword', {
        mail: argument.mail,
        password: argument.password, 
      });
    },
    async loginEmailAndPassword(context, argument) {
      let userName;
      const signIn = new Promise((resolve) => {
        Firebase
          .auth()
          .signInWithEmailAndPassword(argument.mail, argument.password)
          .then(() => {
            resolve();
          });
      });
      const getUserName = new Promise((resolve) => {
        Firebase.database().ref(dataList)
          .orderByChild('mail')
          .startAt(argument.mail).endAt(argument.mail)
          .once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              userName = childSnapshot.val().userName;
              resolve();
            });
          })
      });
      return Promise.all([signIn, getUserName])
        .then(function() {
          context.commit('setUser', {
            userName: userName,
            mail: argument.mail,
            password: argument.password
          });
        }).catch(error => alert(error));
    }
  },
  getters: {
    mail: function(state) {
      return state.mail
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
