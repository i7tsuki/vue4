<template>
  <div class="dashboard">
    <div id="header">
      <p>{{ loginUserName }}さんようこそ！！</p>
      <p>残高：{{ loginUserWallet }}</p>
      <p><button @click="logout">ログアウト</button></p>
    </div>
    <h1>ユーザー一覧</h1>
    <table>
        <tr><th>ユーザー名</th></tr>
        <tr v-for="user in users" v-bind:key="user.mail">
            <td>{{ user.userName }}</td>
            <td><button @click="showModal(user.userName, user.wallet)">walletを見る</button></td>
            <ModalWallet v-if="IsShowModal" @close="IsShowModal = false">
              <h3 slot="header">{{ selectedUserName }}さんの残高</h3>
              <h3 slot="body">{{ selectedUserWallet }}</h3>
            </ModalWallet>
            <td><button>送る</button></td>
        </tr>
    </table>
  </div>
</template>

<script>
import ModalWallet from './ModalWallet.vue'

export default {
  name: 'Dashboard',
  components: { ModalWallet },
  data: function() {
    return {
      loginUserName: this.$store.state.userName,
      loginUserWallet: this.$store.state.wallet,
      users: this.$store.state.users,
      IsShowModal: false,
      selectedUserName: null,
      selectedUserWallet: null,
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    },
    openModal() {
      this.modal = true;
    },
    closeModal() {
      this.modal = false;
    },
    showModal(userName, wallet) {
      this.selectedUserName = userName;
      this.selectedUserWallet = wallet;
      this.IsShowModal = true;
    }
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
