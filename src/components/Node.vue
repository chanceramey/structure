<template>
    <div class="offspring">
        <div class="sibling-space">
        <div class="perimeter">
            <div class="box">
                <input class="title" v-model="dataTitle" v-on:change="update(node, {title: dataTitle})"/>
                <textarea class="description" type="textarea" v-model="dataDescription" />
            </div>
            <div class="controls">
            </div>
        </div>
        </div>
        <div class="children">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
  name: "Node",
  components: {},
  data: function() {
    return {
      dataTitle: this.node.title.slice(0),
      dataDescription: this.node.description.slice(0)
    };
  },
  computed: {},
  props: ["node", "update"]
};
</script>

<style scoped>
/* TODO: Fix overflow of offspring and children when there are 4+ grandchildren*/

input,
textarea {
  border: none;
  background: none;
  font-size: 14px;
}

input:focus,
textarea:focus {
  outline: none;
}

.box {
  margin: 5px;
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  text-align: center;
  overflow: hidden;
  background-color: #ffffffbb;
}
.children {
  margin: 5px;
  display: flex;
  justify-content: center;
  flex-direction: row;
}
.controls {
  width: 25px;
  margin: 5px;
}
.description {
  flex-grow: 2;
  padding: 10px;
  font-weight: lighter;
}
.offspring {
  margin: 5px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.perimeter {
  margin: 5px;
  display: flex;
  justify-content: center;
}
.sibling-space {
  margin: 5px;
  display: flex;
  justify-content: center;
}
.title {
  overflow: hidden;
  flex-grow: 0;
  padding: 10px;
  background-color: #fff;
  font-weight: bold;
}

.alt .box {
  border: 1pt solid red;
}
.alt .children {
  border: 1pt solid blue;
}
.alt .controls {
  border: 1pt solid pink;
}
.alt .description {
  background-color: aquamarine;
}
.alt .offspring {
  border: 1pt solid green;
}
.alt .perimeter {
  border: 1pt solid yellow;
}
.alt .sibling-space {
  border: 1pt solid orange;
}
.alt .title {
  background-color: aqua;
}
</style>