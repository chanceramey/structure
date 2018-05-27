<template>
  <div>
      <button v-on:click="backToBoards()" class="alternate narrow">Back to my boards</button>
      <title></title>
      <h1>{{currentBoard.title}}</h1>
      <h3>{{currentBoard.description}}</h3>
      <Tree></Tree>
  </div>
</template>

<script>
import Node from "./Node";
import Vue from "vue";
import Tree from "./Tree"
export default {
  name: "Structure",
  components: { Node },
  created: function() {
  },
  computed: {
    currentBoard() {
      return this.$store.getters.currentBoard;
    },
    generateTree() {}
  },
  methods: {
    backToBoards: function() {
      return this.$store.commit("setCurrentBoard", undefined);
    }
  }
};
</script>

<style scoped>
</style>