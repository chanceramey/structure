<template>
  <div>
    <div v-if="loggedIn">
      <workspace v-if="!currentBoard"/>
      <board v-else />
    </div>
    <div v-else>
      <welcome-page/>
    </div>
  </div>
</template>

<script>
import WelcomePage from './WelcomePage';
import Board from './Board'
import Workspace from './Workspace'
export default {
  name: "HomePage",
  components: { WelcomePage, Board, Workspace },
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