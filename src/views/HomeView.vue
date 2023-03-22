<template>
  <div class="home">
    <the-demo></the-demo>
  </div>
</template>

<script>
// @ is an alias to /src
import {TheDemo} from 'lib'

export default {
  name: 'HomeView',
  components: {
    TheDemo
  }
}
</script>
