<template>
  <div class="boardCard">
      <div class="title">{{title}}</div>
      <div class="description">{{description}}</div>
      <div class="controls">
          <div class="edit" v-on:click="editBoard()">Edit</div>
          <div class="delete" v-on:click="deleteBoard()">Delete</div>
      </div>
  </div>
</template>

<script>
export default {
  name: "BoardCard",
  components: {},
  props: ["board"],
  computed: {
      title: function() {
          return JSON.parse(this.board.structure).root.title;
      },
      description: function() {
          return JSON.parse(this.board.structure).root.description;
      }
  },
  methods: {
    editBoard() {
      this.$store.commit("setCurrentBoard", this.board);
    },
    deleteBoard: function() {
      return this.$store.dispatch("deleteBoard", this.board.id);
    }
  }
};
</script>

<style scoped>
    .boardCard {
        width: 200px;
        height: 200px;
        margin: 20px;
        display: flex;
        flex-direction: column;
        border: 1pt solid #CFCFCF;
        border-radius: 2px;
        box-sizing: border-box;
        color: #CFCFCF;
    }
    .title {
        padding: 15px;
        height: 25%;
        box-sizing: border-box;
        font-weight: bold;
    }
    .description {
        padding: 0 15px;
        height: 50%;
        box-sizing: border-box;
        overflow: scroll;
    }
    .controls {
        display: flex;
        flex-direction: row;
        height: 25%;
        border-top: 1pt solid #CFCFCF;
        text-align: center;
    }
    .edit {
        padding-top: 10px;
        width: 50%;
        height: 100%;
        border-right: 1pt solid #CFCFCF;
        box-sizing: border-box;
    }
    .delete {
        padding-top: 10px;
        width: 50%;
        height: 100%;
        box-sizing: border-box;
    }
</style>