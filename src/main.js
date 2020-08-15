
import Firebase from './config/firebase-config'
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueRouter)

const store = new Vuex.Store({
  state: {
    userName: null,
    mail: null,
    password: null,
  },
  mutations: {
    setUser(state, argument) {
      state.userName = argument.userName;
      state.mail = argument.mail;
      state.password = argument.passwords;
    },
  }, 
  actions: {
    createUserAccount(context, argument) {
      const dataList = 'users';
      new Promise((resolve, reject) => {
        Firebase.database().ref(dataList)
          .orderByChild('mail')
          .startAt(argument.mail).endAt(argument.mail)
          .once('value', function(snapshot) {      
            //既にメールアドレスが登録済みのユーザでないかどうか確認    
            if (snapshot.exists()) { //登録済みの場合
              reject(new Error('既にメールアドレスが登録済みです!'));
            } else { //未登録の場合
              resolve(); 
            }
          });
        })
        .then(function() {
          Firebase
            .auth()
            .createUserWithEmailAndPassword(argument.mail, argument.password)
            .then(() => {
              context.commit('setUser', {
                'userName': argument.userName,
                'mail': argument.mail,
                'password': argument.password
              });
            });
          Firebase.database().ref(dataList).push({
            'userName': argument.userName,
            'mail': argument.mail,
            'password': argument.password,
          });
          alert("Create Account");
        })
        .catch(error => alert(error));
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
