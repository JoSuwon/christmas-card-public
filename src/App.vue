<template>
  <v-app>
    <router-view />
    <ProgressModal ref="progressModal" />
  </v-app>
</template>

<script>
import ProgressModal from "@/components/ProgressModal.vue";
import { ProgressEventBus } from './main';

export default {
  name: "App",
  components: {
    ProgressModal,
  },
  mounted() {
    ProgressEventBus.$on('progress-show', (message) => {
      console.log('progress show');
      this.$refs.progressModal.show(message);
    });
    ProgressEventBus.$on('progress-close', () => {
      console.log('progress close');
      this.$refs.progressModal.close();
    });
  },
  beforeDestroy() {
    ProgressEventBus.$off('progress-show');
    ProgressEventBus.$off('progress-close');
  },
};
</script>
