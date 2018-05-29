<template>
    <div class="offspring" v-if="node">
        <div class="sibling-space">
        <div class="perimeter">
            <div class="box">
                <input class="title" v-model="dataTitle" v-on:change="update(node, {title: dataTitle})"/>
                <textarea class="description" type="textarea" v-model="dataDescription" v-on:change="update(node, {description: dataDescription})"/>
            </div>
            <div class="controls">
                <div class="addChild" v-on:click="deleteNode(node)">
                  --
                </div>
                <div class="addChild" v-on:click="addChild(node)">
                    +
                </div>
            </div>
        </div>
        </div>
        <div class="children">
            <slot></slot>
        </div>
    </div>
</template>

<script>
import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
export default {
  name: "Node",
  components: { FontAwesomeIcon },
  data: function() {
    return {
      dataTitle: this.node.title.slice(0),
      dataDescription: this.node.description.slice(0)
    };
  },
  computed: {},
  props: ["node", "update", "addChild", "deleteNode"]
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

.addChild {
  margin: 5px 0;
  box-sizing: border-box;
  text-align: center;
  min-width: 30px;
  padding-top: 2.5px;
  min-height: 30px;
  border-radius: 20px;
  font-weight: bold;
  background-color: #ffffff;
}

.addChild:hover {
  cursor: pointer;
  background-color: #ffffffbb;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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