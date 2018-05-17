<template>
  <div>
    <div v-if="loggedIn">
      You are logged in!
    </div>
    <div v-else>
      <welcome-page/>
    </div>
  </div>
</template>

<script>
 import WelcomePage from './WelcomePage';
 export default {
   name: 'HomePage',
   components: {WelcomePage},
   computed: {
     loggedIn: function() {
       return this.$store.getters.loggedIn;
     },
   },
 }
</script>

<style scoped>
</style>