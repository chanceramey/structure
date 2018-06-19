<template>
  <nav>
    <ul id="menu">
      <li class="logo"><router-link to="/">STRUCTURE</router-link></li>
      <!-- <li><router-link to="/">Home</router-link></li> -->
      <li class="right" v-if="loggedIn"><a @click="logout" href="#">Logout</a></li>
      <li class="right" v-if="loggedIn">Hi {{user.first_name}}!</li>
      <form v-else class="right" v-on:submit.prevent="login">
        <transition name="slide-fade">
          <div v-if="showLogin">
	          <input type="email" v-model="email" placeholder="Email Address" />
	          <input type="password" v-model="password" placeholder="Password" />
          </div>
        </transition>
	      <button class="alternate" type="submit">Login</button>
      </form>
    </ul>
    <div class="flexWrapper errorPlace">
      <p v-if="loginError" class="flexRight error">{{loginError}}</p>
    </div>
  </nav>
</template>

<script>
export default {
  name: "AppHeader",
  data() {
    return {
      email: "",
      password: "",
      showLogin: false
    };
  },
  computed: {
    user: function() {
      return this.$store.getters.user;
    },
    loggedIn: function() {
      return this.$store.getters.loggedIn;
    },
    loginError: function() {
      return this.$store.getters.loginError;
    }
  },
  methods: {
    login: function() {
      if (!this.showLogin) this.showLogin = true;
      else this.$store
        .dispatch("login", {
          email: this.email,
          password: this.password
        })
        .then(user => {
          this.email = "";
          this.password = "";
        });
    },
    logout: function() {
      this.$store.dispatch("logout");
    },

  }
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
/* Strip the ul of padding and list styling */
nav {
  display: grid;
  margin-bottom: 20px;
}
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}
/* Create a horizontal list with spacing */
li {
  display: inline-block;
  margin-right: 20px;
  height: 50px;
  text-align: center;
  line-height: 50px;
}

.logo {
  font-style: italic;
  font-size: 24px;
  letter-spacing: .1em;
  border: 1pt solid #CFCFCF;
  border-radius: 2px;
  padding: 10px;
  color: #CFCFCF;
}

.logo:hover {
  border: 1pt solid #CFCFCF;
  color: #CFCFCF;
}

form {
  display: flex;
  align-items: center;
}
li a {
  text-decoration: none;
  color: #CFCFCF;
}

li a:hover {
  color: inherit;
}
/*Active color*/
li a:active {
  color: inherit;
}
/*Hover state for top level links*/
li a:hover {
  text-shadow: 0 0 #000;
  color: inherit;
}
.right {
  float: right;
}
.errorPlace {
  height: 20px;
}
img {
  width: 50px;
}
</style>