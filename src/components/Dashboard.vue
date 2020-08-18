<template>
  <div class="dashboard">
    <div id="header">
      <p>{{ userName }}さんようこそ！！</p>
      <p>残高：{{ wallet }}</p>
      <p><button>ログアウト</button></p>
    </div>
    <h1>ユーザー一覧</h1>
    <table>
        <tr><th>ユーザー名</th></tr>
        <tr>
            <td></td>
            <td><button>walletを見る</button></td>
            <td><button>送る</button></td>
        </tr>
    </table>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data: function() {
    return {
      userName: this.$store.state.userName,
      wallet: this.$store.state.wallet,
    }
  },
  methods: {
    openWallet: function() {
    },
    send: function() {
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
#header {
  display: flex;
  justify-content: space-between;
  width: 80%;
}
</style>
