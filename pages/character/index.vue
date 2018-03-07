<template lang="pug">
.container
  .character-header
    .media
      img(v-if="character.profile", :src="character.profile")
      .desc
        .names
          p.cname {{ character.cname }}
          p.name {{ character.name }}
  .character-body
    .intro
      p(v-for="item in character.intro") {{ item }}
    .stills
      img(v-for="(item, index) in character.images", :src="item", :key="index")
    .items(v-for="item in character.sections")
      .title {{ item.title }}
      .body(v-for="text in item.content") {{ text }}
</template>

<script>
import {
  mapState,
  mapActions,
} from 'vuex';

export default {
  computed: {
    ...mapState({
      character: 'currentCharacter',
    }),
  },
  methods: {
    ...mapActions([
      'showCharacter',
    ]),
  },
  created() {
    const {
      id,
    } = this.$route.query;
    this.showCharacter(id);
  },
};
</script>

<style lang="sass" scoped src="static/sass/character.sass">

</style>


