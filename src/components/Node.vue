<template>
  <div class="perimeter">
      <div class="box">
          <div class="title-area">My Title</div>
          <div class="description-area">Sample description.</div>
      </div>
  </div>
</template>

<script>
export default {
  name: "Node",
  components: { },
  computed: {
  }
};
</script>

<style scoped>
.perimeter {
    width: 250px;
    height: 200px;
    border: 1pt solid yellow;
    display: flex;
    justify-content: center;
}

.box {
    width: 150px;
    height: 150px;
    border: 1pt solid red;
    border-radius: 20px;
    text-align: center;
}
</style>