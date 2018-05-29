<template>
    <div class="offspring" v-if="node">
        <div class="sibling-space">
        <div class="perimeter" v-if="!dragging">
            <div class="box" 
              draggable="true" 
              v-on:drag="drag()"
              @keydown.shift.space="addChild(node)"                  
               @keydown.shift.enter="addSibling(parent)">
                <input class="title" 
                  v-model="dataTitle" 
                  v-on:change="update(node, {title: dataTitle})"
                  @keydown.shift.tab.prevent="toggleDescription(true)"
                  @click="toggleDescription(false)"
                  :disabled="!parent"/>
                <textarea class="description" 
                  type="textarea" 
                  v-if="showDescription || dataDescription" 
                  v-model="dataDescription" 
                  v-on:change="update(node, {description: dataDescription})"
                  @click="toggleDescription(true)"
                  disabled="!parent"/>
            </div>
            <div class="controls">
                <div class="addChild" v-if="parent" v-on:click="addSibling(parent)">
                  >
                </div>
                <div class="addChild" v-if="parent" v-on:click="deleteNode(parent, index)">
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
  created: function () {

  },
  data: function() {
    return {
      dataTitle: this.node.title.slice(0),
      dataDescription: this.node.description.slice(0),
      dragging: false,
      showDescription: false,
      titleId: ''
    };
  },
  methods: {
    toggleDescription (value) {
      if (!this.dataDescription && this.showDescription) {
        this.showDescription = value;
      } else if (!this.showDescription) {
        this.showDescription = value;
      }
    },
    drag (ev){
      // this.dragging = true;
    },
    drop (ev) {
      this.dragging = false;
    }
  },
  computed: {},
  props: [
    "node",
    "update",
    "addChild",
    "deleteNode",
    "parent",
    "addSibling",
    "index"
  ]
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
  min-height: 50px;
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
  flex-grow: 1;
  padding: 10px;
  background-color: #fff;
  font-weight: bold;
  text-align: center;
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