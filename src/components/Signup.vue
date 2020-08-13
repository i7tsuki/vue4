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
      this.$store.commit('createUserAccount', {
        'userName': this.userName, 'mail': this.mail, 'password': this.password
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
