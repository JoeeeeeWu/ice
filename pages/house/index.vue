<template lang="pug">
.container
  .house-media
    .desc
      .words {{ house.words }}
      .name {{ house.name }}
  .house-body
    .title {{ house.cname }}
    .body {{ house.intro }}
    .title 主要角色
    .body(v-for="item in house.swornMembers" :key="item._id")
      .members(v-if="item.character")
        img(:src="item.character.profile" @click="showCharacter(item)")
        .desc
          .cname {{ item.character.cname }}
          .intro {{ item.text }}
    .house-history(v-for="item in house.sections" :key="item.title")
      .title {{ item.title }}
      .content(v-for="text in item.content") {{ text }}
</template>

<script>
import {
  mapState,
  mapActions,
} from 'vuex';

export default {
  computed: {
    ...mapState({
      house: 'currentHouse',
    }),
  },
  methods: {
    ...mapActions([
      'showHouse',
    ]),
    showCharacter(item) {
      this.$router.push({
        path: '/character',
        query: {
          id: item.character._id,
        },
      });
    },
  },
  created() {
    const {
      id,
    } = this.$route.query;
    this.showHouse(id);
  },
};
</script>

<style lang="sass" scoped src='static/sass/house.sass'>

</style>


