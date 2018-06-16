<template>
    <div class="offspring" v-if="node">
        <div class="sibling-space">
        <div class="perimeter" v-if="!dragging">
            <div class="box" 
              draggable="true" 
              v-on:drag="drag()">
                <input class="title" 
                  v-model="dataTitle" 
                  v-on:change="update(node, {title: dataTitle})"
                  @keydown="create"
                  @click="toggleDescription(false)"
                  :ref="titleId"/>
                <textarea class="description" 
                  type="textarea" 
                  v-show="showDescription || dataDescription" 
                  v-model="dataDescription" 
                  v-on:change="update(node, {description: dataDescription})"
                  @click="toggleDescription(true)"
                  @keydown="navigate"
                  :ref="descriptionId"/>
            </div>
            <div class="controls">
                <div class="controlButton" v-if="parent" v-on:click="addSibling(parent)">
                  >
                </div>
                <div class="controlButton" v-if="parent" v-on:click="deleteNode(parent, index)">
                  -
                </div>
                <div class="controlButton" v-on:click="addChild(node)">
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
/****************** IP ******************/
/* ------ Creation ------ */
// X Enter -> New sibling
// X Shift + Enter  -> New child of first sibling
// 0 Shift + Space  -> New child of next sibling
// 0 Tab            -> Description -> Right -> Description -> Down -> Description -> Right ...
// X Shift + Tab    -> New child
/* ------ Navigation ------ */
// (with highlight/obvious effect on focus)
// 0 Left-arrow     -> Left sibling or last child of left uncle
// 0 Right-arrow    -> Right sibling or first child of right uncle
/****************************************/

import FontAwesomeIcon from "@fortawesome/vue-fontawesome";
import uid from "uid";

export default {
  name: "Node",
  components: { FontAwesomeIcon },
  created: function() {
    this.titleId = uid();
    this.descriptionId = uid();
  },
  mounted: function() {
    this.$refs[this.titleId].focus();
  },
  data: function() {
    return {
      dataTitle: this.node.title.slice(0),
      dataDescription: this.node.description.slice(0),
      dragging: false,
      showDescription: false,
      titleId: "",
      descriptionId: ""
    };
  },
  methods: {
    toggleDescription(value) {
      if (!this.dataDescription && this.showDescription) {
        this.showDescription = value;
        value && this.$refs[this.descriptionId].focus();
      } else if (!this.showDescription) {
        this.showDescription = value;
        value && this.$refs[this.descriptionId].focus();
      }
    },
    drag(ev) {
      // this.dragging = true;
    },
    drop(ev) {
      this.dragging = false;
    },
    create(e) {
      switch (e.key) {
        case "Enter":
          if (!e.shiftKey) this.addSibling(this.parent);
          else this.addChild(this.parent.children[0]);
          break;
        case " ":
          if (e.shiftKey) console.log("implement add cousin");
          break;
        case "Tab":
          e.preventDefault();
          if (e.shiftKey) this.addChild(this.node);
          else this.toggleDescription(true);
          console.log(e);
          break;
      }
    },
    navigate(e) {
      switch (e.key) {
        case "Enter":
          if (!e.shiftKey) this.addSibling(this.parent);
          else this.addChild(this.parent.children[0]);
          break;
        case " ":
          if (e.shiftKey) console.log("implement add cousin");
          break;
        case "Tab":
          if (e.shiftKey) this.addChild(this.node);
          else console.log("Implement navigate to cousin");
          break;
      }
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

.controlButton {
  margin: 5px 0;
  box-sizing: border-box;
  text-align: center;
  min-width: 30px;
  padding-top: 2.5px;
  min-height: 30px;
  border-radius: 20px;
  font-weight: bold;
  color: #CFCFCF;
}

.controlButton:hover {
  cursor: pointer;
  color: #fff;
}

.box {
  margin: 5px;
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column;
  border-radius: 2px;
  text-align: center;
  overflow: hidden;
  background-color: transparent;
  border: 1pt solid #CFCFCF;
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
  color: #CFCFCF;
  flex-grow: 2;
  padding: 10px;
  font-weight: lighter;
  resize: none;
  border-top: 1pt solid #CFCFCF;

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
  flex-grow: 1;
  padding: 10px;
  background-color: transparent;
  font-weight: bold;
  text-align: center;
  margin: 0px;
}
.title:focus {
  box-shadow: none;
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