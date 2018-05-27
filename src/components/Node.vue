<template>
    <div class="offspring">
        <div class="sibling-space">
        <div class="perimeter">
            <div class="box">
                <div class="title-area">{{title}}</div>
                <div class="description-area">{{description}}</div>
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
  computed: {},
  props: ["title", "description"]
};
</script>

<style scoped>
.box {
  margin: 5px;
  width: 150px;
  height: 150px;
  border: 1pt solid red;
  border-radius: 20px;
  text-align: center;
}
.children {
  margin: 5px;
  border: 1pt solid blue;
  display: flex;
  justify-content: center;
  max-height: 500px;
  flex-direction: row;
}
.offspring {
  margin: 5px;
  border: 1pt solid green;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.perimeter {
  margin: 5px;
  width: 250px;
  border: 1pt solid yellow;
  display: flex;
  justify-content: center;
}
.sibling-space {
  margin: 5px;
  border: 1pt solid orange;
  display: flex;
  justify-content: center;
}
</style>