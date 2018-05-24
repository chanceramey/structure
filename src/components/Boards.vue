<template>
  <div>
      <div v-for="(board, index) in boards">{{index+1}}. {{board['title']}}: {{board['description'] && board['description']}}</div>
  </div>
</template>

<script>
export default {
  name: "Boards",
  computed: {
      boards: function() {
        console.log("boards changed")
        return this.$store.getters.boards;
      },
  },
  created: function() {
      this.getBoards();
  },
  methods: {
      getBoards() {
          this.$store.dispatch('getBoards');
      }
  }
};
</script>

<style scoped>
</style>