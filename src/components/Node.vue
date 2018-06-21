<template>
    <div class="offspring" v-if="node">
        <div class="sibling-space">
        <div class="perimeter" v-if="!dragging">
            <div class="box"
              v-if="!isSmall" 
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
                  <div class="controls">
                    <div class="controlButton" v-if="parent && index > 0" v-on:click="reorder(parent, index)">
                      m
                    </div>
                    <div class="controlButton" v-on:click="addChild(node)">
                      &#43;
                    </div>
                    <div class="controlButton" v-if="parent" v-on:click="toggleModal(true, parent, index)">
                      &#10005;
                    </div>
                    <div class="controlButton" v-if="(parent && node.children.length)" v-on:click="showChildren = !showChildren">
                      {{showChildren ? 'H' : 'S'}}
                    </div>
                    <div class="controlButton" v-if="parent" v-on:click="addSibling(parent)">
                      &#8594;
                    </div>
                    <div class="controlButton" v-if="parent" v-on:click="isSmall = true">
                      &#8595;
                    </div>
                  </div>
            </div>
            <div class="smallBox" 
              @click="isSmall = false;"
              v-else>{{dataTitle}}</div>
        </div>
        </div>
        <div class="children" v-if="showChildren">
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
    console.log(JSON.stringify(this.node, undefined, 2))
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
      descriptionId: "",
      showChildren: true,
      isSmall: false
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
      console.log(e);
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
        case "Backspace":
          if (e.shiftKey) this.deleteNode(this.parent, this.index);
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
        case "Backspace":
          if (e.shiftKey) this.deleteNode(this.parent, this.index);
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
    "deleteThisNodeOnly",
    "parent",
    "addSibling",
    "index",
    "toggleModal",
    "reorder"
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
  border-radius: 20px;
  font-weight: bold;
  color: #cfcfcf;
  flex-grow: 1;
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
  align-items: center;
  border-radius: 2px;
  text-align: center;
  overflow: hidden;
  background-color: transparent;
  border: 1pt solid #cfcfcf;
}
.children {
  margin: 5px;
  display: flex;
  justify-content: center;
  flex-direction: row;
}
.controls {
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  z-index: 0;
}

.description {
  box-sizing: border-box;
  width: 100%;
  color: #cfcfcf;
  flex-grow: 2;
  padding: 10px;
  font-weight: lighter;
  resize: none;
  border-top: 1pt solid #cfcfcf;
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
.smallBox {
  padding: 5px;
  border: 1pt solid #cfcfcf;
  border-radius: 2px;
  margin: 5px;
}
.title {
  flex-grow: 1;
  padding: 10px;
  background-color: transparent;
  font-weight: bold;
  text-align: center;
  margin: 0px;
  overflow-wrap: break-word;
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