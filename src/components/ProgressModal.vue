<template>
  <v-dialog v-model="visible" fullscreen persistent>
    <div class="progressModal">
      <v-progress-circular
        indeterminate
        color="#fff"
        size="50"
      ></v-progress-circular>
      <h2>{{ message }}</h2>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: "ProgressModal",
  data() {
    return {
      visible: false,
      message: '로딩 중 입니다.',
    };
  },
  methods: {
    show(message) {
      this.message = message;
      this.visible = true;
    },
    close() {
      this.visible = false;
    },
  },
}
</script>

<style lang="scss" scoped>
.progressModal {
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  h2 {
    margin-top: 10px;
    color: #fff;
  }
}
</style>