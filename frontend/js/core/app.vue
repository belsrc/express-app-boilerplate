<template>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import * as types from './store/action_types';

export default {
  components: { },

  props: [ ],

  data() {
    return { };
  },

  created() {
    // EventBus example
    // this.$bus.$on('message', msg => {
    //   console.log(msg);
    // });
    // this.$bus.$emit('message', 'Component created');
  },

  watch: { },

  computed: {
    ...mapState([
      'name',
    ]),

    ...mapGetters({
      name: types.GETTER_NAME,
    }),
  },

  methods: {
    ...mapMutations({
      name: types.MUTATION_NAME,
    }),

    ...mapActions({
      name: types.ACTION_NAME,
    }),
  },
};
</script>

<style lang="scss" scoped>
</style>
