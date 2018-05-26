<template>
  <div>
    <div v-if="loggedIn">
      <boards v-if="!currentBoard"/>
      <structure v-else /></stucture> 
    </div>
    <div v-else>
      <welcome-page/>
    </div>
  </div>
</template>

<script>
import WelcomePage from './WelcomePage';
import Boards from './Boards'
import Structure from './Structure'
export default {
  name: "HomePage",
  components: { WelcomePage, Boards, Structure },
  computed: {
    loggedIn: function() {
      return this.$store.getters.loggedIn;
    },
    currentBoard: function() {
      return this.$store.getters.currentBoard;
    }
  }
};
</script>

<style scoped>
</style>