<template>
  <div class="login">
    <h1>ログイン画面</h1>
    <p><label>メールアドレス<input type="email" placeholder="E-mail"></label></p>
    <p><label>パスワード<input type="text" placeholder="Password"></label></p>
    <p><button @click="login">ログイン</button></p>
    <a @click="GotoSignup"><small>新規登録はこちらから</small></a>
  </div>
</template>

<script>
export default {
  name: 'Login',
  methods: {
    login: function() {
      alert('まだ実装していません。');
    },
    GotoSignup: function() {
      this.$router.push('/signup');
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
