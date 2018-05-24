<template>
  <div class="column">
    <h1>Give your thoughts some structure.</h1>
    <h2>Get started. It's totally free.</h2>
    <form v-on:submit.prevent="register">
      <p>Create an account.</p>
      <input class="narrow" v-model="first_name" placeholder="First Name">
      <input class="narrow" v-model="last_name" placeholder="Last Name"><br/><br/>
      <input class="narrow" v-model="email" placeholder="Email Address">
      <input class="narrow" type="password" v-model="password" placeholder="Password"><br/><br/>
      <button class="alternate narrow" type="submit">Register</button>
    </form>
    <p class="error">{{registerError}}</p>
  </div>
</template>

<script>
export default {
  name: "WelcomePage",
  data() {
    return {
      username: "",
      email: "",
      password: "",
      first_name: "",
      last_name: ""
    };
  },
  computed: {
    registerError: function() {
      return this.$store.getters.registerError;
    }
  },
  methods: {
    register: function() {
      this.$store.dispatch("register", {
        username: this.username,
        email: this.email,
        password: this.password,
        first_name: this.first_name,
        last_name: this.last_name
      });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
img {
  width: 100px;
}

h1 {
  margin-bottom: 0px;
}
h2 {
  margin-top: 0px;
  font-size: 1.2em;
  font-weight: normal;
  margin-bottom: 50px;
}
.narrow {
  width: 170px;
}
.wide {
  width: 370px;
}
</style>