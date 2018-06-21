<template>
  <div class="modal" @click="onRequestClose">
      <div class="box" @click=""> 
        <slot></slot>
      </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  components: {},
  computed: {},
  methods: {
  },
  props: [
      'onRequestClose'
  ]
};
</script>

<style scoped>
.modal {
  position: fixed; /* Stay in place */
  z-index: 10; /* Sit on top */
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal .box {
  color: #222;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 2px;
  border: none;
  display: inline-flex;
  flex-direction: column;
}
</style>