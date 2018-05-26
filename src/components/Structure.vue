<template>
  <div>
      <button v-on:click="backToBoards()" class="alternate narrow">Back to my boards</button>
      <title></title>
      <h1>{{currentBoard.title}}</h1>
      <h3>{{currentBoard.description}}</h3>
      <node/>
  </div>
</template>

<script>
import Node from './Node'
export default {
  name: "Structure",
  components: { Node },
  created: function() {
      console.log(this.currentBoard);
  },
  computed: {
      currentBoard() {
          return this.$store.getters.currentBoard;
      }
  },
  methods: {
      backToBoards: function() {
          return this.$store.commit('setCurrentBoard', undefined);
      }
  }
};
</script>

<style scoped>
</style>