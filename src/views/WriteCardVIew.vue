<template>
  <div class="PostView">
    <SplashTreeVue ref="splashTreeVue" />
    <div :class="{ letter: true, 'letter-close': !isOpen, 'letter-open': isOpen }">
      <div class="envelope" @click="isOpen = true"></div>
      <h2 class="envelope-msg">카드 쓰기!</h2>
    </div>
    <div :class="{ letter: true, 'letter-close': isOpen, 'letter-open': !isOpen }">
      <div class="head">
        <h1>
          <input v-model="form.title" type="text" class="titleInput" placeholder="편지 제목.." @input="changeTitle" />
        </h1>
        <v-btn icon class="closeBtn" @click.stop="onClickClose">
          <v-icon color="#fff" size="30">mdi-close-circle-outline</v-icon>
        </v-btn>
      </div>
      <div class="msgbox">
        Dear,
        <input v-model="form.to" type="text" class="toInput" placeholder="받는이.." @input="changeTo" />
        <v-btn icon class="refreshBtn" @click="onClickRefreshForm">
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <br />
        <textarea v-model="form.message" class="msgInput" placeholder="카드에 담길 메세지를 작성해주세요!    메세지는 자동 저장되며, 페이지를 벗어나 다시 들어오시면 불러옵니다." @input="changeMessage" />
        <p class="from">
          {{ form.at }}
          <input v-model="form.from" type="text" class="fromInput" placeholder="보낸이.." @input="changeFrom" />
        </p>
      </div>

      <div class="footer">
        <a class="button" @click="onClickPostCard">카드 발행</a>
      </div>
    </div>
  </div>
</template>

<script>
import SplashTreeVue from "@/components/SplashTree.vue";
import moment from "moment";
import { throttle } from 'lodash';
import store from "@/store";
import { ProgressEventBus } from '../main';
import { writePost } from '../plugins/db';

export default {
  name: "WriteCardView",
  components: {
    SplashTreeVue,
  },
  data() {
    return {
      isOpen: false,
      form: {
        title: "",
        to: "",
        from: "",
        message: "",
        at: moment().format("YYYY. MM. DD"),
      },
    };
  },
  mounted() {
    this.$refs.splashTreeVue.show("카드쓰기");
    this.form = this.$store.state.form;
    this.form.at = moment().format("YYYY. MM. DD");

    if(!this.$store.state.user) this.kakaoLogin();

    setTimeout(() => {
      this.isOpen = true;
    }, 1000);
  },
  watch: {
    form: {
      deep: true,
      handler(newValue) {
        // console.log(newValue);
        this.saveForm(newValue);
      },
    },
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
  },
  methods: {
    onClickClose() {
      this.isOpen = false;
    },
    async onClickPostCard() {
      if(this.form.title.length === 0) {
        alert('카드 제목을 입력해주세요~').
        return;
      }
      if(this.form.to.length === 0) {
        alert('받는이를 입력해주세요~');
        return;
      }
      if(this.form.message.length === 0) {
        alert('메세지를 입력해주세요~');
        return;
      }
      if(this.form.from.length === 0) {
        alert('보낸이를 입력해주세요~');
        return;
      }

      try {
        ProgressEventBus.$emit('progress-show', '카드 발행 중 입니다..');
        const id = await writePost(this.user.id, this.form);
        this.form = {
          title: '',
          to: '',
          from: '',
          message: '',
          at: moment().format('YYYY. MM. DD'),
        };
        const result = confirm('카드발행이 완료되었습니다.\n카드를 확인하러 이동할까요?');
        if(result) {
          this.$router.push({ path: `post/${id}` });
        }
      } catch (error) {
        console.log(error);
        alert("카드 발행에 실패하였습니다.")
      } finally {
        ProgressEventBus.$emit('progress-close');
      }
    },
    kakaoLogin() {
      const { Kakao } = window;
      Kakao.Auth.authorize({
        redirectUri: process.env.VUE_APP_KAKAO_REDIRECT_URI,
      });
    },
    saveForm: throttle((form) => {
      store.commit('SET_FORM', form);
    }, 1000),
    changeTitle(e) {
      this.form.title = e.target.value;
    },
    changeTo(e) {
      this.form.to = e.target.value;
    },
    changeMessage(e) {
      this.form.message = e.target.value;
    },
    changeFrom(e) {
      this.form.from = e.target.value;
    },
    onClickRefreshForm() {
      const result = confirm("편지를 모두 초기화 하시겠습니까 ?");
      if(result) {
        this.form = {
          title: '',
          to: '',
          from: '',
          message: '',
          at: moment().format('YYYY. MM. DD'),
        };
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.PostView {
  overflow: hidden;
  width: 100vw;
  height: 100vh;
  background: #1f243a;

  .head {
    .titleInput {
      color: white;
      padding: 5px;
      text-align: center;
      width: 70%;
      border-radius: 5px;
      border: 1px solid rgba(255, 255, 255, 0.7);
    }
    .closeBtn {
      position: absolute;
      right: 0;
      top: 35px;
      z-index: 50;
    }
  }

  .letter {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 1.5s;
    z-index: 20;
  }

  .envelope {
    width: 200px;
    height: 200px;

    // background-image: url('https://pngimg.com/uploads/envelope/envelope_PNG18366.png');
    background-image: url("@/assets/img/christmas-card.png");
    background-size: cover;
    background-position: center;

    margin: 200px auto 0px auto;

    cursor: pointer;
  }

  .envelope-msg {
    color: white;
    text-align: center;
  }

  .letter-close {
    /* display: block; */
    /* visibility: visible; */
    opacity: 0.9;
  }

  .letter-open {
    /* display: none; */
    visibility: hidden;
    opacity: 0;
  }

  h1 {
    color: white;
    text-align: center;

    margin-top: 30px;
    margin-bottom: 30px;
  }

  .msgbox {
    background-color: ivory;
    max-height: 400px;
    overflow: scroll;

    width: 500px;
    margin: auto;

    color: brown;

    padding: 30px;

    font-size: 18px;
    line-height: 24px;

    box-shadow: 0px 0px 10px 0px whitesmoke;

    .msgInput {
      width: 250px;
      height: 250px;
      padding: 5px;
      margin-top: 5px;
      margin-bottom: 5px;
      resize: none;
      border-radius: 5px;
      border: 1px solid rgba(0, 0, 0, 0.5);
    }
    .refreshBtn {
      position: absolute;
      right: 13px;
      top: 117px;
    }
    .toInput,
    .fromInput {
      padding-left: 5px;
      border-radius: 5px;
      border: 1px solid rgba(0, 0, 0, 0.5);
      width: 50%;
    }
  }

  .from {
    text-align: right;
    margin-bottom: 0px;
  }

  @media screen and (max-width: 760px) {
    .msgbox {
      width: 300px;
      padding: 20px;
    }

    .rtan {
      width: 150px;
      height: 150px;
      margin-top: 30px;
      margin-bottom: 30px;
      font-size: 28px;
    }

    h1 {
      font-size: 28px;
    }

    .envelope {
      margin: 150px auto 0px auto;
    }
  }
}

.button {
  width: 100%;
  text-align: center;
  margin-top: 20px;
  display: inline-block;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  min-width: 100px;
  padding: 12px 23px;
  font-family: "Humanbumsuk";
  font-size: 26px;
  line-height: 26px;
  text-decoration: none;
  color: #fff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.75);
  background: #a61715;
  outline: none;
  border-radius: 15px;
  border: 1px solid #4c0300;

  box-shadow: inset 1px 1px 0px rgba(255, 255, 255, 0.25),
    /* highlight */ inset 0 0 6px #da3b2c,
    /* inner glow */ inset 0 80px 80px -40px #dd4330,
    /* gradient */ 1px 1px 3px rgba(0, 0, 0, 0.75); /* shadow */

  position: relative;
  overflow: visible; /* IE9 & 10 */
  -webkit-transition: 500ms linear;
  -moz-transition: 500ms linear;
  -o-transition: 500ms linear;
  transition: 500ms linear;
}

.button::before {
  content: "";
  display: block;
  position: absolute;
  top: -7px;
  left: -3px;
  right: 0;
  height: 23px;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACsAAAAXCAYAAACS5bYWAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABFpJREFUeNrUV0tIo1cUvpkYjQ4xxSA6DxuNqG0dtaUKOgs3s6i0dFd3pSsXdjeIixakiGA34sZuXCkoONLFwJTK4GMYLYXg29gatTpiXurkbd7vv9/5ub+IxuhA7eiFQ5Kbc8/57ne/e87/ywRBYLdl3GG3aNwqsLJ0k0tLS+fmcnNzWUVFBVMoFGx2djarvLxcm5OTw+bm5iytra2xc4ExNjY27iqVyvvwK6CpeDzuCYVC1urq6qDA9UcfPp+PHR4esmAwKK6tr68/l5/8rgQ2Ozub1dbWyiYmJooaGxt/VqvV38jlchX9l0qlwoFA4DWS/RKLxRxFRUVf5+XlPcaaT2AP0sVPJBL2SCRiAPBpu93+vKamZo/Ae71eZjabWV1dXVqw7CKwp43ksrCw8Bhg7MJ/PLDZ5PHx8cz29vYT5JGD/bSYLgTrcDgYdk6siSc6NjZWDaAe4ZoHQL+cmZnRpZPnhWDpD8kw7uKo9ML/NMCsd2tr61vkzboMrEyv138M7TyLRqMWMBsX3sMgaZhMpp+AR5EJrCocDpuEGzKg4x8khs+CVWxubvZfR9JkMik4nU7BarUKLpeLmLsKuwIqTLynp4fqmIzASrqQT09Pf1VVVfX0KsWZ6uHBwQHTaDSsoKAgo6/H4xHLEcrVyRwuEisrKzs5XrrIVAVwiUVDKRRrL+YI32ewdVhMApuHWvcj6vids6J2u90MF4yBHUZNgKoEBaRBQalJqFSqtJfUYrGIlQX+ydXVVTN+u0tKSjQNDQ1axJVl2iTypebn55d7e3v/kqoDgZU1NTU9LCws/Py0M+2ekuGincxJ3yF+18jIyHJLS0slQJUWFxczrBeBE0vE5tHRkbixlZWVfSR8gTX/0P5gH7S1tX3Z3t7+BW8qAvwSfr8/jA0EIRM/qoFtampqbW9vTw+XA+ojUruVd3Z2tvb19T2TQFEim81GgVJoCvvj4+NLOJZgaWmpemdn5y3a6BbcnJDAw8HBwac6ne6eqCW5XDwB3qVSqM9/DAwMUNy/eVLabT7sI25qwgujThCBhWE+mAt2yNc4SQKSZrOQQE1HS22VJkmPAGTr7+//fX19fRk+Zgq0trbGeFAKEAQT98BSqKOj47vm5uaa/Px8JeIk4GcaHh6eWlxcfAU/A8xG67BxAX3fwdcbYUpSDJ06Z49Ak8ZC3OL8f3YiA4PBYKdLQ2AJ9OTk5GpXV9cQiCVh79M94QtlPLDUE/1gPNrd3f0W33W4cBoco48zQuy/IZYAMnGqlSc4c66L9JruQUaSARXeT8HGKzxAqFBekni6+h46+pMzGiJGMgTOJh1yU/KNEGDvZWvfBawkA9ppwGg0mrRa7SOI2g+gxOgbJIpdFpj72PnxSnPX8vqRxTURgBQWKisrH+GThOm+CtAzoK/9/Uiqq/6hoaHfdnd3jaOjo7/yY7yxbwqkWy3sQzpS2C6YirwvUJk0y7hurfyGRrnduPGvAAMASmo8wzeVwfsAAAAASUVORK5CYII=)
      no-repeat 0 0,
    url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE0AAAAXCAYAAABOHMIhAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABiZJREFUeNrsWMtPlFcUvzPMwIDysLyRR4uATDHWCiVgSmRlios2DeiiXUFs0nRBd6arxqQhJDapkYXhP4BqDKTQhZaFNQSCaBEVJjwdHsNr5DUMDDPDzPT3u7nTDEgRKrKgc5KT+z3uufec33de99P4fD4RpL2RNgjB3kn35MkTeRERESFiYmLkGBoaKnQ6nWSNRvPPZFxr+vv7k6KioiIdDsfa8vLyQkFBgcP3Bnel3MDAQArWI0eFhISE87nb7bZ7PJ4VvLYuLi5O5+fnu9+kMNfq6+tLjIyMzMY6KeBEbK/XarXReI3lPDZMWcc4v7GxYV1dXR3Jy8ub2E5HPvJ6vRSSDH0ku1wuAfsEZOV1IEFHoeNFdHS0yMrK2knR0Lm5uR+hxLdQMjbwHTZbB41h8RGwCdc9MzMzneHh4bGJiYlf4SN8ijkfwqiIncCAAR7Iz2GPSShudjqdfeCeqampvwBQfFxc3JdYqwTv8gB8/F48A8BgKecE14V+L7ju2tpae05OzkuCCZvkPOj8mizmC6vVKtmPu+bx48cC3qI1mUyFUOyywWD4SHlELBaLJmCHNcwAghuAOujtuF4FqHO4nsX4EsAS3I4TJ04ME1h8PDE9PS09TYZoY2Pj1729vd6lpSVfkDYTPG0UkfNDRUWFgQ5Gb2Mh0N29e9eG/GQfHh4W8/PzwUy/ObQ/gMfVVlZW1iAiZdQxp3nv3LljRoL/5erVq1UIxzSiiVD9X4EDYATynCwAzGO858hCQRoaGmJFZNJz8YIcBc4BF966dau6sLAwBxVSJCUlCSThQwuU3W6XkYUok1Vzm5znQx5bbm9v77p+/frPeNSNRzZ/ISBwrG4ZR48eLamtrf2+uLjYSEG9Xi/wTISFhQlWGXohyzO/CJlVl23KQRLbABoaHx+/Z1lUZ/Hq1SsJFj3JT3hmHx8fnydPTEzMj46OziHPW2w22wxeD4Kfgadh/4YEzU8Az4DhffAn5eXlX1y6dKkEoCTspAQ9Mjs7+0BBo8Fms1lkZGTsOo0QLLRNkvnR+fEJzIMHD0xtbW39CL8JTFtSbAOvBIyLHIGVm9VzE2gKuDAMSSpcT6KXyT137lx2cnLyMXhcGDb3wq3XuWF3d/fCzZs3P0c4v5eSknJQbYLo7Ox0gC2lpaVZ3Be67Th/dnZWoAJKsJC3XA8fPhxoamp6hMb+BaaMgWcUMGtszZjiFDNmvcDI91pzG0iY4ARwkwrxkcHBwUdgNrRMbnrqoRbkVzDcvn3bl5qaWsmcgFH4G8XdEGUWFhak51AuISFBnkoCTyFbyWKxCJwIxlC0fq2rq7tcVFRkRKskjh8/Lr0+kBjCCDV/knfdv3//WX19/R8IRRNemxlu4AXwKqM+EJwdj1HbPYSwh3sCPAJDABm2LLchCjS+5/kirKGhwWk0GrMuXrxYQuX9hm/XXTMXMY+srKwI5ApZrbYmZh7deEJhAUKjLe/pLTzSsCuHrK+1tbUJVe3P6upq87Vr174rKysrYHVj/uW+OH3IfEuw4F3ee/fuPQfAvwOs5yyE4CnlFOu7BWrTCWlreO6FACpBZGwUw4BvkANLobReHb3kGZYGsGzTq/zlO8AT1ru6uoZbWlqeA6gINJAfnz59OlVLoX8Jtebm5raampqfcMvQYgTknz9//sKVK1c+y83NTdIEuCnaKMuNGzd+6+np6cCtSTkAw9D9X8Dyh+dbgaaAC1XAnUlPTy+qqqq6cPbs2UzkmWjNljiDJzpwHFnCkW2yo6NjCKW8H54wjlezKvRT09LSTsJrz5w6dSoN+Yp51ADAPUj8VoDbDq9pxrwuJcNIYQllJTIi/xopBw/VA7DJp0+f9hA78CgL5F5C8J2CpoCj8sfA6WCe/FPRhsRlZmbGIs8Y4FFO5CJgtrSsvrRVGW1V93b1myoGnKAKEcHgnwsWpg1lNI0fphwrmdqbckeU18WrnlOjqp5/j7W3BWvfQVPKa5SBkcrYCNVB65TRTlWZ1lXiXVU5xbtlDb2SPaLWYwrgHIcqPg6Vc7fbX69Yoyqfa7/AeiegbWOEVhmsVcWDwPn224iDJgla8Hd38Hd3ELQgaIeI/hZgAIPEp0vmQJdoAAAAAElFTkSuQmCC)
      no-repeat 50% 0,
    url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACEAAAAXCAYAAACFxybfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAodJREFUeNrsVb1rWlEUv2pN/GqspKRSKFYXWzEloIWif0Fn6dJChQ7OQil0qd3EzcEpg0OgdHDr4CQODk7VRlLMEIVqApX4We0zflR9/Z1Ui4T34ksaaAYP/Hzc673n/M6550PG8zz73yKjn0wm83fDYDAwo9HINBrNnwOQg4MDs0ql2lQqlfdAWont7ng8Pjw+Ps44nc4G1pI9EXWaSOzt7TGO42aH5Pv7+08ajUZ0MBiUeXEZd7vdL5VK5fX29rZ+5tQiEmdxKrlcjsEYczgcynK5/BKKv/IXFNz/XiqVXkHdjUuRIA9SqdRD8or/R8Ez9fr9fqHVakUR4c2z0REjIQuHw2ZcrPBXLCA0RHTezEdHjIQqkUhEr9I4HOILhQLf6/VoOUFEvDMiQiToDx1Cdz+bzZ6bUFarlel0OkkVUK/XWbvdPoVer5fh3ntsfwJ+CJ2XA4p0Op1bpBgJyxDehQQ6nQ5DZXHBYDBZq9V+EhFUndnr9drEqoc2bwJbwGPgtohuVSwWe2Gz2TZMJpNgRKi6qtUqg2EWj8dTgUDgo0KhWPN4PC70EvXOzs67fD6/S6kiRIKeZA1YJ2MiJNbdbvfTUCjkV6vVK2hcDF8GI2w0GrGTkxM2HA5PDxaLxSOfz/cWEfk81X0XIMMFgJJ/srBjCgk8IdcfuVyuZ36//7nFYtkQyAMumUzuRiKRD0jMFLa+AZOpYwqgB/ziBVqmVBKUO7eAB/R0WG/Z7XaTVqtdbTabHJL6EK2djBaBPHA0NSqpbUsiMUeEBgpF4Q5AbZrmSJ/yEWgBTaBNHl9kdkgmMUeG7qwAq9PqovceTA3zlxlgsuswyuXsGsiSxJLEkoSY/BZgAEjRodi+uBruAAAAAElFTkSuQmCC)
      no-repeat 100% 0;
}
.button:hover {
  background: #a61715;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.75), 0 0 40px #fff;
  box-shadow: inset 1px 1px 0px rgba(255, 255, 255, 0.25),
    /* highlight */ inset 0 0 6px #da3b2c,
    /* inner glow */ inset 0 80px 80px -40px #dd4330,
    /* gradient */ 1px 1px 3px rgba(0, 0, 0, 0.75); /* shadow */
}
.button:focus {
  outline: none; /*FF*/
}
.button:active {
  box-shadow: inset 1px 1px 0px rgba(255, 255, 255, 0.25),
    /* highlight */ inset 0 0 6px #da3b2c,
    /* inner glow */ inset 0 80px 80px -40px #dd4330,
    /* gradient */ 0px 1px 0px rgba(255, 255, 255, 0.25); /* shadow */

  -webkit-transition: 50ms linear;
  -moz-transition: 50ms linear;
  -o-transition: 50ms linear;
  transition: 50ms linear;
}
</style>