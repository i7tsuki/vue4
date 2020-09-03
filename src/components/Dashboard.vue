<template>
  <div class="dashboard">
    <div id="header">
      <p>{{ loginUserName }}さんようこそ！！</p>
      <p>残高：{{ nowWallet }}</p>
      <p><button @click="logout">ログアウト</button></p>
    </div>
    <h1>ユーザー一覧</h1>
    <table>
        <tr><th>ユーザー名</th></tr>
        <tr v-for="user in users" v-bind:key="user.mail">
            <td>{{ user.userName }}</td>
            <td><button @click="showModalWallet(user.userName, user.wallet)">walletを見る</button></td>
            <ModalWallet v-if="IsShowModalWallet" @close="IsShowModalWallet = false">
              <h3 slot="header">{{ selectedUserName }}さんの残高</h3>
              <h3 slot="body">{{ selectedUserWallet }}</h3>
            </ModalWallet>
            <td><button @click="showModalSend(user.wallet, user.mail)">送る</button></td>
            <ModalWallet v-if="IsShowModalSend" @close="IsShowModalSend = false">
              <h3 slot="header">あなたの残高：{{ nowWallet }}</h3>
              <h3 slot="body">
                <p>送る金額</p>
                <p><input type="text" v-model="sendWallet"></p>
              </h3>
              <h3 slot="footer">
                <button @click="submit">送信</button>
              </h3>
            </ModalWallet>
        </tr>
    </table>
  </div>
</template>

<script>
import ModalWallet from './ModalWallet.vue';

export default {
  name: 'Dashboard',
  components: { ModalWallet },
  data: function() {
    return {
      loginUserName: this.$store.state.userName,
      users: this.$store.state.users,
      IsShowModalWallet: false,
      IsShowModalSend: false,
      selectedUserName: null,
      selectedUserWallet: null,
      selectedUserMail: null,
      sendWallet: 0,
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    },
    showModalWallet(userName, wallet) {
      this.selectedUserName = userName;
      this.selectedUserWallet = wallet;
      this.IsShowModalWallet = true;
    },
    showModalSend(wallet, mail) {
      this.selectedUserWallet = wallet;
      this.selectedUserMail = mail;
      this.IsShowModalSend = true;
    },
    submit() {
      if (this.sendWallet <= 0) {
        console.log('入力値が0以下のため、送信しませんでした。')
      } else {
        this.$store.dispatch('setUsersWallet', {
          sendingUserMail: this.selectedUserMail,
          sendingWallet: this.sendWallet,
        });
      }
      this.IsShowModalSend = false;
    },
  },
  async beforeCreate() {
    if(this.$store.state.mail === null) {
      this.$router.push('/login');
    }
    try {
      await this.$store.dispatch('getUsers');
    } catch(error) {
      console.log({ error });
    }
  },
  computed: {
    nowWallet: function() {
      return this.$store.state.wallet;
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
