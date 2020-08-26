<template>
  <div class="signup">
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
      password: '',
      isMailAddress: null,  
    }
  },
  methods: {
    async signup() {
      if (
        this.userName.trim().length < 1 ||
        !isMailAdress(this.mail) ||
        !isPassword(this.password)
      ) {
        console.log('バリデーションエラー');
        return;
      }
      const user = {
        userName: this.userName.trim(), 
        mail: this.mail.trim(), 
        password: this.password.trim()
      };
      try {
        await this.$store.dispatch('createUserAccount', user);
        await this.$store.dispatch('login', user);
        await this.$router.push('/dashboard');
      } catch(error) {
        console.log({ error });
      }
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
