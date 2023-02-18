<template>
  <div>
    <SplashTreeVue ref="splashTreeVue" />

    <div class="myPage">

      <v-card class="tabContent" width="90vw">
        <v-tabs v-model="tabIndex" right color="red" background-color="rgba(255, 255, 255, 0.5)">
          <v-tab class="tabName">내가 쓴 카드</v-tab>
          <v-tab class="tabName">보관한 카드</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabIndex" class="tabItems">
          <v-tab-item>
            <div class="item">
              <div v-if="myPostList.length === 0" class="noItem">
                <h3>내가 쓴 카드가 없습니다..</h3>
              </div>

              <div v-for="(post, index) in myPostList" :key="'myPost_' + index" class="postItem">
                <div class="postTitle">
                  {{ post.title }}
                </div>
                <div class="messageBox">
                  <div class="to">Dear, {{ post.to }}</div>
                  <div class="message" v-html="post.message.replace(/\n/g, ' ')"></div>
                  <div class="from">{{ post.at }}, {{ post.from }}</div>
                </div>
                <div class="right">
                  작성일 : {{ post.createdAt }}
                </div>
                <v-btn class="btn" icon @click="onClickPost(post)"><v-icon>mdi-eye</v-icon></v-btn>
              </div>
            </div>
          </v-tab-item>
          <v-tab-item>
            <div class="item">
              <div v-if="myReceivePostList.length === 0" class="noItem">
                <h3>보관한 카드가 없습니다..</h3>
              </div>

              <div v-for="(post, index) in myReceivePostList" :key="'myReceivePost' + index" class="postItem">
                <div class="postTitle">
                  {{ post.title }}
                </div>
                <div class="messageBox">
                  <div class="to">Dear, {{ post.to }}</div>
                  <div class="message" v-html="post.message.replace(/\n/g, ' ')"></div>
                  <div class="from">{{ post.at }}, {{ post.from }}</div>
                </div>
                <div class="right">
                  작성일 : {{ post.createdAt }}
                </div>
                <v-btn class="btn" icon @click="onClickPost(post)"><v-icon>mdi-eye</v-icon></v-btn>
              </div>
            </div>
          </v-tab-item>
        </v-tabs-items>
      </v-card>
    </div>
  </div>
</template>

<script>
import SplashTreeVue from "@/components/SplashTree.vue";
import { readPostsByUserId, readReceivePostId, readPost, writeReceivePostId } from '../plugins/db';
import { ProgressEventBus } from '../main';

export default {
  name: "MyPageView",
  components: {
    SplashTreeVue,
  },
  data() {
    return {
      myPostList: [],
      myReceivePostList: [],
      tabIndex: 0,
    };
  },
  mounted() {
    this.$refs.splashTreeVue.show("마이페이지");
    // this.$refs.splashTreeVue.close();

    if (!this.$store.state.user) this.kakaoLogin();
    else {
      this.initMypage();
    }
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    postId() {
      return this.$route.query?.postId ?? null;
    },
  },
  methods: {
    kakaoLogin() {
      const { Kakao } = window;
      Kakao.Auth.authorize({
        redirectUri: process.env.VUE_APP_KAKAO_REDIRECT_URI,
      });
    },
    async initMypage() {
      try {
        ProgressEventBus.$emit('progress-show', '내 정보를 불러오는 중...');

        if (this.postId) {
          await writeReceivePostId(this.user.id, this.postId);
        }

        const myPosts = await readPostsByUserId(this.user.id);
        if (myPosts !== null) {
          const values = Object.values(myPosts);
          console.log(values);
          values.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          this.myPostList = values;
        }
        const myReceivePosts = await readReceivePostId(this.user.id);
        if (myReceivePosts?.length > 0) {
          this.myReceivePostList = [];
          for (let i = 0; i < myReceivePosts.length; i++) {
            const post = await readPost(myReceivePosts[i]);
            if(post) this.myReceivePostList.push(post);
          }
          this.myReceivePostList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          this.myReceivePostList = [...this.myReceivePostList];
        }
      } catch (error) {
        console.log(error);
        alert('정보 불러오기에 실패하였습니다. 메인으로 돌아갑니다.');
        this.$router.push({ name: 'Main' });
      } finally {
        ProgressEventBus.$emit('progress-close');
      }
    },
    onClickPost(post) {
      this.$router.push({ path: `/post/${post.id}` });
    },
  },
}
</script>

<style lang="scss" scoped>
.myPage {
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 15;
  top: 0;
  left: 0;

  .tabContent {
    background-color: rgba(255, 255, 255, 0.5);
    margin-top: 30%;
    margin-left: 5%;
    margin-right: 5%;
    .tabName {
      font-weight: 600;
      font-size: 20px;
    }
    .tabItems {
      background-color: rgba(255, 255, 255, 0.5);
      .item {
        padding: 10px;
        height: 60vh;
        overflow-x: hidden;
        overflow-y: scroll;
        .noItem {
          text-align: center;
        }
        .postItem {
          width: 84vw;
          /* padding-bottom: 10px; */
          margin-top: 10px;
          border-bottom: 1px solid #929292;
          .postTitle {
            padding-left: 5px;
            font-size: 22px;
            font-weight: 600;
          }
          .messageBox {
            background-color: ivory;
            padding: 10px;
            box-shadow: 0px 0px 10px 0px whitesmoke;
          }
          .message {
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          }
          .right {
            text-align: right;
          }
          .btn {
            position: relative;
            top: -147px;
            height: 0;
            left: 70vw;
          }
        }
      }
    }
  }
}
</style>