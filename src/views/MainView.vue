<template>
  <div>
    <SplashTreeVue ref="SplashTreeVue" />
    
    <div class="appMain">
      <div class="appName">크리스마스⛄ 카드 보내기🎅</div>
      <div class="subTitle"></div>

      <div class="btns">
        <a class="button" @click="onClickWriteCard">카드 쓰기</a>
        <a class="button" @click="onClickMyCard">마이페이지</a>
      </div>
    </div>
  </div>
</template>

<script>
import SplashTreeVue from "@/components/SplashTree.vue";

export default {
  name: "MainView",
  components: {
    SplashTreeVue,
  },
  async mounted() {
    this.$refs.SplashTreeVue.show("");
    const subTitle = document.querySelector(".subTitle");
    await this.type(subTitle, "크리스마스 카드로 마음을 전해주세요", 75);
    subTitle.innerHTML += "💛";
  },
  methods: {
    onClickLogin() {
      const { Kakao } = window;
      Kakao.Auth.authorize({
        redirectUri: process.env.VUE_APP_KAKAO_REDIRECT_URI,
      });
    },
    toKorChars(str) {
      var cCho = [
          "ㄱ",
          "ㄲ",
          "ㄴ",
          "ㄷ",
          "ㄸ",
          "ㄹ",
          "ㅁ",
          "ㅂ",
          "ㅃ",
          "ㅅ",
          "ㅆ",
          "ㅇ",
          "ㅈ",
          "ㅉ",
          "ㅊ",
          "ㅋ",
          "ㅌ",
          "ㅍ",
          "ㅎ",
        ],
        // cJung = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'],
        cJong = [
          "",
          "ㄱ",
          "ㄲ",
          "ㄳ",
          "ㄴ",
          "ㄵ",
          "ㄶ",
          "ㄷ",
          "ㄹ",
          "ㄺ",
          "ㄻ",
          "ㄼ",
          "ㄽ",
          "ㄾ",
          "ㄿ",
          "ㅀ",
          "ㅁ",
          "ㅂ",
          "ㅄ",
          "ㅅ",
          "ㅆ",
          "ㅇ",
          "ㅈ",
          "ㅊ",
          "ㅋ",
          "ㅌ",
          "ㅍ",
          "ㅎ",
        ],
        cho,
        jung,
        jong;
      var cnt = str.length,
        chars = [],
        cCode;
      for (var i = 0; i < cnt; i++) {
        cCode = str.charCodeAt(i);
        if (cCode == 32) {
          chars.push(" ");
          continue;
        } // 한글이 아닌 경우
        if (cCode < 0xac00 || cCode > 0xd7a3) {
          chars.push(str.charAt(i));
          continue;
        }
        cCode = str.charCodeAt(i) - 0xac00;
        jong = cCode % 28;
        jung = ((cCode - jong) / 28) % 21;
        cho = ((cCode - jong) / 28 - jung) / 21;
        chars.push(cCho[cho]);
        chars.push(String.fromCharCode(44032 + cho * 588 + jung * 28));
        if (cJong[jong] !== "") {
          chars.push(String.fromCharCode(44032 + cho * 588 + jung * 28 + jong));
        }
      }
      return chars;
    },
    async type(target, msg, ms) {
      const splitedMsg = msg.split('\n');
      for(let k=0; k<splitedMsg.length; k++) {
        let str = splitedMsg[k];
        let typeing1 = [];
        str = str.split("");

        for (let i = 0; i < str.length; i++) {
          typeing1[i] = this.toKorChars(str[i]);
        }
        const length = str.length;

        for (let i = 0; i < length; i++) {
          const oneChar = typeing1[i];

          const originHTML = target.innerHTML;
          for (let j = 0; j < oneChar.length - 1; j++) {
            target.innerHTML = originHTML + oneChar[j];
            await this.delay(ms);
          }
          target.innerHTML = originHTML + oneChar[oneChar.length - 1];
          await this.delay(ms);
        }
        if(k !== splitedMsg.length - 1) target.innerHTML += '<br />';
      }
    },
    delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    },
    onClickMyCard() {
      if(this.checkLogin()) {
        this.$router.push({ name: "MyPage" });
      }
    },
    onClickWriteCard() {
      if(this.checkLogin()) {
        this.$router.push({ name: "Write" });
      }
    },
    checkLogin() {
      if(!this.$store.state.user) {
        const result = confirm("카카오톡 간편로그인으로 서비스 이용가능합니다.\n로그인 하시겠습니까 ?");
        if(result) this.onClickLogin();
      } else {
        return true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.appMain {
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  z-index: 15;
  top: 0;
  left: 0;
  .appName {
    color: white;
    font-size: 30px;
    text-align: center;
    margin-top: 50px;
    background: rgba(54, 107, 43, 0.4);
  }

  .subTitle {
    color: white;
    font-size: 20px;
    text-align: center;
    margin-top: 10px;
    background: rgba(54, 107, 43, 0.4);
    height: 28px;
  }

  .btns {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%, -25%);
    .button {
      margin-top: 20px;
      display: inline-block;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      min-width: 100px;
      padding: 22px 33px;
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
        url(data:image/png;base64,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)
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
  }
}
</style>