<template>
  <div>
      <button v-on:click="backToBoards()" class="alternate narrow">Back to my boards</button>
      <title></title>
      <Structure></Structure>
  </div>
</template>

<script>
import Node from "./Node";
import Vue from "vue";
import Structure from "./Structure";
export default {
  name: "Board",
  components: { Node },
  created: function() {},
  computed: {
    currentBoard() {
      return this.$store.getters.currentBoard;
    }
  },
  methods: {
    backToBoards: function() {
      return this.$store.commit("setCurrentBoard", undefined);
    }
  }
};
</script>

<style scoped>
.structure {
  background-color: #222;
}

.alt .structure {
  background-color: #fff;
}
</style>