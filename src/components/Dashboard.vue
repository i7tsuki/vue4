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
            <td><button @click="showWalletModal(user.userName, user.wallet)">walletを見る</button></td>
            <WalletModal v-if="isShowWalletModal" @close="isShowWalletModal = false">
              <h3 slot="header">{{ selectedUserName }}さんの残高</h3>
              <h3 slot="body">{{ selectedUserWallet }}</h3>
            </WalletModal>
            <td><button @click="showSendModal(user.wallet, user.mail)">送る</button></td>
            <WalletModal v-if="isShowSendModal" @close="isShowSendModal = false">
              <h3 slot="header">あなたの残高：{{ nowWallet }}</h3>
              <h3 slot="body">
                <p>送る金額</p>
                <p><input type="text" v-model="sendingWallet"></p>
              </h3>
              <h3 slot="footer">
                <button @click="sendWalletToUser">送信</button>
              </h3>
            </WalletModal>
        </tr>
    </table>
  </div>
</template>

<script>
import WalletModal from './WalletModal.vue';

export default {
  name: 'Dashboard',
  components: { WalletModal },
  data: function() {
    return {
      loginUserName: this.$store.state.userName,
      isShowWalletModal: false,
      isShowSendModal: false,
      selectedUserName: null,
      selectedUserWallet: null,
      selectedUserMail: null,
      sendingWallet: null,
      users: this.$store.state.users,
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    },
    showWalletModal(userName, wallet) {
      this.selectedUserName = userName;
      this.selectedUserWallet = wallet;
      this.isShowWalletModal = true;
    },
    showSendModal(wallet, mail) {
      this.selectedUserWallet = wallet;
      this.selectedUserMail = mail;
      this.isShowSendModal = true;
    },
    async sendWalletToUser() {
      if (this.sendingWallet <= 0 || this.sendingWallet === null) {
        console.log('入力値が0以下のため、送信しませんでした。')
      } else {
        try {
          await this.$store.dispatch('setUsersWallet', {
            sendingUserMail: this.selectedUserMail,
            sendingWallet: this.sendingWallet,
          });
          await this.$store.dispatch('getUsers');
          this.users = this.$store.state.users;
        } catch(error) {
          console.log(error);
        }
      }
      this.isShowSendModal = false;
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
    },
  },
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
