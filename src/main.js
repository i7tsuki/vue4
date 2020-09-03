
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
    users: null
  },
  mutations: {
    setUser(state, argument) {
      state.userName = argument.userName;
      state.mail = argument.mail;
      state.password = argument.password;
      state.wallet = argument.wallet;
    },
    clearUsers(state) {
      state.users = [];
    },
    openUsers(state, argument) {
      state.users.push(
        {
          userName: argument.userName,
          mail: argument.mail,
          wallet: argument.wallet,
        }
      );
    },
    setWallet(state, wallet) {
      state.wallet = wallet;
    }
  }, 
  actions: {
    readUserByEmail(context, mail) {
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
        }).catch(error => alert(error));
    },
    createUserEmailAndPassword(context, argument) {
      const localSetUser = 
        Firebase
          .auth()
          .createUserWithEmailAndPassword(argument.mail, argument.password)
          .then(() => {
            context.commit('setUser', {
              userName: argument.userName,
              mail: argument.mail,
              password: argument.password, 
            });
        });
      const dbSetUser = 
        Firebase.database().ref(dataList).push({
          userName: argument.userName,
          mail: argument.mail,
          password: argument.password,
          wallet: 100,
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
    login(context, argument) {
      let userName, wallet;
      const signIn = 
        Firebase
          .auth()
          .signInWithEmailAndPassword(argument.mail, argument.password);
      const getUserName = 
        Firebase.database().ref(dataList)
          .orderByChild('mail')
          .startAt(argument.mail).endAt(argument.mail)
          .once('value', function(snapshot) {
            snapshot.forEach(function(childSnapshot) {
              userName = childSnapshot.val().userName;
              wallet = childSnapshot.val().wallet;
            });
          });
      return Promise.all([signIn, getUserName])
        .then(function() {
          context.commit('setUser', {
            userName: userName,
            mail: argument.mail,
            password: argument.password,
            wallet: wallet,
          });
        });
    },
    logout(context) {
      Firebase.auth().signOut().then(function() {
        context.commit('setUser', {
          userName: null,
          mail: null,
          password: null,
        });
      }).catch(function(error) {
        console.log(error);
      });
    },
    getUsers(context) {
      context.commit('clearUsers');
      Firebase.database().ref(dataList)
        .once('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            if (context.getters.mail !== childSnapshot.val().mail) {
              context.commit('openUsers', {
                userName: childSnapshot.val().userName,
                mail: childSnapshot.val().mail,
                wallet: childSnapshot.val().wallet,
              });
            }
          });
        });
    },
    setUsersWallet(context, argument) {
      Firebase.database().ref(dataList)
        .once('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            if (context.getters.mail === childSnapshot.val().mail) {
              let wallet = +childSnapshot.val().wallet - +argument.sendingWallet;
              Firebase.database().ref(dataList).child(childSnapshot.key).update({
                wallet: wallet
              });
              context.commit('setWallet', wallet);
            }
          });
        });
      Firebase.database().ref(dataList)
        .once('value', function(snapshot) {
          snapshot.forEach(function(childSnapshot) {
            if (argument.sendingUserMail === childSnapshot.val().mail) {
              Firebase.database().ref(dataList).child(childSnapshot.key).update({
                wallet: +childSnapshot.val().wallet + +argument.sendingWallet
              });
            }
          });
        });
    },
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
