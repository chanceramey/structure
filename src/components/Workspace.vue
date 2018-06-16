<template>
  <div class="workspace">
      <h1>Welcome to your workspace! Here is a list of your boards:</h1>
      <div class="boards">
      <div class="boardList">
      <div v-for="(board, index) in boards">
        <board-card v-bind:board="board"></board-card>
      </div>
      </div>
      <div class="creationStation">
          <input type="text" placeholder="Title" v-model="title"/>
          <input type="textarea" placeholder="Description" v-model="description"/>
          <button v-on:click="createBoard()" class="alternate narrow">Create Board</button>
      </div>
      </div>
  </div>
</template>

<script>
import BoardCard from './BoardCard'
export default {
  name: "Workspace",
  computed: {
    boards: function() {
      return this.$store.getters.boards;
    }
  },
  components: {
    BoardCard
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
      this.$store.dispatch("createBoard", {
        structure: { root: { title, description, children: [ {
          title: '',
          description: '',
          children: []
        } ] } }
      });
      this.title = "";
      this.description = "";
    },
    getBoard(board) {
      const id = board.id;
      const boardRoot = JSON.parse(board.structure).root;
      const title = boardRoot.title;
      const description = boardRoot.description;
      return {id, title, description};
    }
  }
};
</script>

<style scoped>
.boards {
  display: flex;
  flex-direction: row;
}
.boardList {
  display: grid;
  grid-template-columns: auto auto auto;
}
.creationStation {
  margin: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.workspace {
  display: flex;
  flex-direction: column;
}
</style>