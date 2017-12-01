<template>
  <div>
    <div class="vux-demo">
      <router-link to="/login">
        <img class="logo" src="../../assets/vux_logo.png" >
      </router-link>
    </div>
    <group title="cell demo">
      <cell title="VUX" value="cool" is-link></cell>
      <cell title="VUX2" value="vue-router to hello" link="/Hello"></cell>

    </group>
  </div>
</template>

<script>
import { Group, Cell } from 'vux'

export default {
  components: {
    Group,
    Cell
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello World!'
    }
  },
    methods: {
        toLogin() {
            alert(11111111)
        }
    }
}
</script>

<style>
.vux-demo {
  text-align: center;
}
.logo {
  width: 100px;
  height: 100px
}
</style>
