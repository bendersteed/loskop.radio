<template>
    <main>
        <LiveStream />
    </main>
    <div class="space" />
</template>

<script setup lang="ts">
 import { assets } from "~/assets/constants";
 import { imageFallback, removeFileExtension } from "~/assets/helpers";
 import LiveStream from "~/components/LiveStream.vue";

 useHead({
     title: "On Air",
     meta: [
         {
             property: "og:image",
             name: "og:image",
             content: "loskop_face.jpg",
         },
     ],
 });
</script>

<style>
.content {
  text-align: left;
  margin: auto;
  font-weight: 600;
}

.content span {
  color: var(--bg-color);
  font-size: 25px;
  box-shadow: 0 0 0 10px black;
  /* Tune line "padding" here */
  line-height: 2.2;
  /* Tune line "margin" here */
  background-color: black;
  -moz-box-shadow: 0 0 0 10px #000;
  -webkit-box-shadow: 0 0 0 10px #000;
  -ms-box-shadow: 0 0 0 10px #000;
  -o-box-shadow: 0 0 0 10px #000;
  box-decoration-break: clone;
}
</style>

<style scoped>
main {
    max-width: 1000px;
    display: flex;
    padding-y: 4em;
 }

img {
  width: 40vh;
}

@media screen and (max-width: 650px) {
  main {
    flex-direction: column;
    align-items: center;
  }

  img {
    width: 30vh;
    margin-bottom: 10px;
  }

  .content p {
    font-size: 16px;
    line-height: 2.7;
  }
}
</style>
