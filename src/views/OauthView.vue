<template>
  <div>
    <SplashTreeVue ref="splashTreeVue" />
  </div>
</template>

<script>
import axios from 'axios';
import { writeUserData } from '../plugins/db';
import SplashTreeVue from "@/components/SplashTree.vue";

export default {
  name: "OauthView",
  components: {
    SplashTreeVue,
  },
  computed: {
    code() {
      return this.$route.query.code;
    },
  },
  async mounted() {
    this.$refs.splashTreeVue.show('로그인 중...');
    await this.delay(1000);
    if(this.code) {
      const { Kakao } = window;
      try {
        const { data } = await axios.post('https://kauth.kakao.com/oauth/token', {
          grant_type: 'authorization_code',
          client_id: '8aa9344339c66387c5608c480d0e64fd',
          redirect_uri: process.env.VUE_APP_KAKAO_REDIRECT_URI,
          code: this.code,
        }, {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          }
        });
        Kakao.Auth.setAccessToken(data.access_token);
        const user = await Kakao.API.request({
          url: '/v2/user/me',
        });
        this.$store.commit('SET_USER', user);
        await writeUserData(user.id, user);
        this.$router.push({ path: this.$store.state.beforeFullPath });
      } catch (error) {
        alert('로그인 정보 찾기 실패.. 메인으로 돌아갑니다.');
      this.$router.push({ name: "Main" });  
      }
    } else {
      alert('로그인 정보 찾기 실패.. 메인으로 돌아갑니다.');
      this.$router.push({ name: "MainView" });
    }
  },
  methods: {
    delay(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
  }
}
</script>