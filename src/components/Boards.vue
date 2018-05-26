<template>
  <div>
      <h1>You are logged in! Here is a list of your boards:</h1>
      <div v-for="(board, index) in boards" v-on:click="choose(board)">{{index+1}}. {{board['title']}}: {{board['description'] && board['description']}}</div>
      <div>
          <input type="text" placeholder="Title" v-model="title"/>
          <input type="textarea" placeholder="Description" v-model="description"/>
          <button v-on:click="createBoard()" class="alternate narrow">Create Board</button>
      </div>
  </div>
</template>

<script>
export default {
  name: "Boards",
  computed: {
    boards: function() {
      console.log("boards changed");
      return this.$store.getters.boards;
    }
  },
  created: function() {
    this.getBoards();
  },
  data: function() {
    return {
      title: "",
      description: ""
    };
  },
  methods: {
    getBoards() {
      this.$store.dispatch("getBoards");
    },
    createBoard() {
      const title = this.title;
      const description = this.description;
      this.$store.dispatch("createBoard", { title, description });
      this.title = "";
      this.description = "";
    },
    choose(board) {
        this.$store.commit('setCurrentBoard', board);
    }
  }
};
</script>

<style scoped>
</style>