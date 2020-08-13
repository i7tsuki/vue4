import Firebase from 'firebase'
import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueRouter)

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUt5FGqhpPwZboGxhcm5jG-QzR-mAfm5c",
  authDomain: "vue4-93291.firebaseapp.com",
  databaseURL: "https://vue4-93291.firebaseio.com",
  projectId: "vue4-93291",
  storageBucket: "vue4-93291.appspot.com",
  messagingSenderId: "92673480718",
  appId: "1:92673480718:web:0afd52257dfd99b8a6045f"
};
// Initialize Firebase
Firebase.initializeApp(firebaseConfig);

const store = new Vuex.Store({
  state: {
    userName: null,
    mail: null,
    password: null,
  },
  mutations: {
    createUserAccount(state, argument) {
      if (argument.userName.trim().length < 1) {
        alert('ユーザー名を入力してください。');
        return;
      }
      if ((/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/).test(argument.mail) === false) {
        alert('メールアドレスを正しく入力してください。');
        return;
      }
      if ((argument.password).trim().length < 6) {
        alert('パスワードは6文字以上で入力してください。');
        return;
      } 
      const userName = argument.userName.trim();
      const mail = argument.mail.trim();
      const password = argument.password.trim();
      const dataList = 'users';

      new Promise((resolve) => {
        Firebase.database().ref(dataList)
          .orderByChild('mail')
          .startAt(mail).endAt(mail)
          .once('value', function(snapshot) {      
            //既にメールアドレスが登録済みのユーザでないかどうか確認    
            if (snapshot.exists()) { //登録済みの場合
              alert('既にメールアドレスが登録済みです');
              resolve(false); 
            } else { //未登録の場合
              resolve(true); 
            }
          });
        })
        .then(function(isRegister) {
          if (isRegister) {
            Firebase
              .auth()
              .createUserWithEmailAndPassword(mail, password)
              .then(() => {
                state.userName = userName;
                state.mail = mail;
                state.password = password;
              });
            Firebase.database().ref(dataList).push({
              'userName': userName,
              'mail': mail,
              'password': password,
            });
            alert("Create Account");
          }
        });
    },
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
