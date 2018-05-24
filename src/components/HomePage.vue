<template>
  <div>
    <div v-if="loggedIn">
      You are logged in! Here is a list of your boards:
      <boards />
    </div>
    <div v-else>
      <welcome-page/>
    </div>
  </div>
</template>

<script>
import WelcomePage from './WelcomePage';
import Boards from './Boards'
export default {
  name: "HomePage",
  components: { WelcomePage, Boards },
  computed: {
    loggedIn: function() {
      return this.$store.getters.loggedIn;
    }
  }
};
</script>

<style scoped>
</style>