<template>
  <div id="app" class="">
    <app-header/>
    <router-view/>
  </div>
</template>

<script>
 import AppHeader from './components/AppHeader';
 export default {
   name: 'App',
   components: { AppHeader }
 }
</script>

<style>
 /* https://color.adobe.com/CS04-color-theme-1994456/?showPublished=true */
 body {
     font-size: 18px;
     padding: 20px 100px 0px 100px;
     font-family: 'Avenir', Helvetica, Arial, sans-serif;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
    background-color: #222;
    color: #fff;

 }
 button {
     color: #fff;
     min-width: 100px;
     height: 43px;
     border: none;
     border-radius: 2px;
     text-align: center;
     text-decoration: none;
     font-size: 1.2rem;
     margin: 2.5px 2px;
 }
 button.primary {
     background-color: rgb(10, 135, 207);
 }
 button.alternate {
     border: 1pt solid rgb(10, 135, 207);
     color: rgb(10, 135, 207);
     background-color: transparent;
 }

 button.alternate:hover {
    background-color: rgb(10, 135, 207);
    color: #fff;
    border: none;
 }

 button.harsh {
     border: 1pt solid rgb(216, 73, 73);
     color: rgb(216, 73, 73);
     background-color: transparent;
 }

 button.harsh:hover {
     background-color: rgb(216, 73, 73);
     color: #fff;
     border: none;
 }

 button:focus {
     outline: none;
 }
 button:hover {
     box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
 }
 button:active {
     transform: translateY(4px);
 }
 input {
     font-family: 'Avenir', Helvetica, Arial, sans-serif;
     height: 20px;
     padding: 20px;
     border-radius: 2px;
     margin: 2.5px 2px;
     border: 1pt solid #CFCFCF;
     color: #CFCFCF;
     font-size: 1.2rem;
     background-color: transparent;
     box-sizing: border-box;
 }
 input:focus {
    box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2), 0 6px 20px 0 rgba(0,0,0,0.19);
    outline: none;
 }
 .flexWrapper {
     display:flex;
 }
 .flexRight {
     margin-left: auto;
 }
 .error {
     color: #F35537;
 }
 .column {
     width: 800px;
 }

 body .alt {
     background-color: #fff;
 }
</style>
