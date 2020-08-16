<template>
  <div class="Signup">
    <h1>新規登録画面</h1>
    <p><label>ユーザー名<input type="text" placeholder="userName" v-model="userName"></label></p>
    <p><label>メールアドレス<input type="email" placeholder="E-mail" v-model="mail"></label></p>
    <p><label>パスワード<input type="text" placeholder="Password" v-model="password"></label></p>
    <p><button @click="signup">新規登録</button></p>
    <a @click="GotoLogin"><small>ログインはこちらから</small></a>
  </div>
</template>

<script>
import { isMailAdress, isPassword } from '../plugin/definiton';

export default {
  name: 'Signup',
  data: function() {
    return {
      userName: '',
      mail: '',
      password: ''  
    }
  },
  methods: {
    signup: function() {
      if (this.userName.trim().length < 1) {
        alert('ユーザー名を入力してください。');
        return;
      }
      if (!(isMailAdress(this.mail))) {
        alert('メールアドレスを正しく入力してください。');
        return;
      }
      if (!(isPassword(this.password))) {
        alert('パスワードは6文字以上で入力してください。');
        return;
      } 
      this.$store.dispatch('createUserAccount', {
        'userName': this.userName.trim(), 'mail': this.mail.trim(), 'password': this.password.trim()
      });
    },
    GotoLogin: function () {
      this.$router.push('/');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #4a42b9;
}
</style>
