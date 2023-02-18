<template>
  <div>
    <div class="appBarCustom">
      <div class="left">
        <v-btn icon @click="routerBack">
          <v-icon size="30" color="#fff">mdi-arrow-left-bold-circle-outline</v-icon>
        </v-btn>
      </div>
      <div class="right">
        <v-btn icon @click="routerHome">
          <v-icon size="30" color="#fff">mdi-home-circle-outline</v-icon>
        </v-btn>
      </div>
    </div>
    <div v-if="visible" class="message">
      <div>
        <strong>{{ message }}</strong>
      </div>
    </div>
    <div v-if="visible" class="splash">
      <ul v-if="visible">
        <li v-for="(index) in 5" :key="index"></li>
      </ul>
      <ul v-if="visible">
        <li v-for="(index) in 128" :key="index+10"></li>
      </ul>
    </div>

    <section>
      <div class="snow s1"></div>
      <div class="snow s2"></div>
      <!-- <div class="snow s3"></div> -->
    </section>
  </div>
</template>

<script>
export default {
  name: "SplashTree",
  data() {
    return {
      visible: true,
      message: ''
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
    routerBack() {
      this.$router.back();
    },
    routerHome() {
      this.$router.push({ name: "Main" });
    },
  },
}
</script>

<style scoped>
section {
  position: relative;
  width: 100%;
  height: 100vh;
  z-index: 10;
  /* background: url('https://64.media.tumblr.com/36135ae7f8925c158965895aaa96a0f0/tumblr_mxi0emkijd1rbrg5uo1_500.gifv');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover; */
}

.snow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('http://www.pngmart.com/files/5/Snow-PNG-Transparent-Image.png');
  background-repeat: repeat;
}

.snow.s1 {
  animation: snow1 10s linear infinite;
  filter: blur(.5px);
  background-size: 1200px;
}

.snow.s2 {
  animation: snow2 12s linear infinite;
  background-size: 800px;
  filter: blur(2px);
}

.snow.s3 {
  animation: snow3 14s linear infinite;
  filter: blur(1px);
  background-size: 100px;
}

@keyframes snow1 {
  0% {
    background-position: 0 0;
  }

  100% {
    background-position: 100px 500px;
  }
}


@keyframes snow2 {
  0% {
    background-position: 0px -100px;
  }

  100% {
    background-position: 0 640px;
  }
}


@keyframes snow3 {
  0% {
    background-position: 100px 400px;
  }

  100% {
    background-position: 200px 640px;
  }
}
</style>

<style lang="scss" scoped>
.appBarCustom {
  z-index: 50;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100vw;
  padding-top: 10px;
  .left {
    padding-left: 10px;
  }
  .right {
    padding-right: 10px;
  }
}
.message {
  z-index: 10;
  color: white;  
  position: absolute;
  top: 50px;
  left: 50%;
  transform: translate(-50%, -50%);

  strong {
    font-family: 'Humanbumsuk';
    font-weight: 100;
    font-size: 25px;
  }
}
$elements:128;
$layers:7;
.splash {
  overflow: hidden;
  z-index: 9;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  background: #1f243a;
	ul {
		padding:0;
		li {
			list-style:none;
		}
	}
	ul:nth-child(1) {
		position: absolute;
		top:calc(20vh - 1.6rem);
		left:50%;
		width:1rem;
		height:1rem;
		border-radius:100%;
		//background:#FFCE54;
		transform:translate(-50%, -50%);
		li {
			position: absolute;
			width:0;
			height:0;
			border-width:0 0.5rem 1rem 0.5rem;
			border-style:solid;
			border-color:transparent;
			border-bottom-color:#FFCE54;
			transform-origin:0.5rem 1rem;
			@for $i from 0 through 4 {
				&:nth-child(#{$i}) {
					transform:rotate($i*72deg);
				}
			}
		}
	}
	ul:nth-child(2) {
		padding:0;
		li {
			position: absolute;
			top:20vh;
			right:50%;
			width:0.0625rem;
			background: linear-gradient(rgba(46,204,113, 0), rgba(46,204,113, 0.25));
			list-style:none;
			transform-origin:50% 0;
			animation: swing 12s ease-in-out infinite;
			
			@for $i from 1 through $elements {
				&:nth-child(#{$i}) {
					height:60vh*(($i+4)/($elements+4)); 
						//Create gaps with the +4, remove +4 to stack up layers - effectively 4 invisible dots at the top
					animation-delay:-12s*($i/($elements/$layers));
				}
			}
			&:before {
				content: '';
				position: absolute;
				left:-1px;
				bottom:1px;
				width:3px;
				height:3px;
			}
			
			&:nth-child(4n):before {
				background:#D8334A;
			} 
			&:nth-child(4n+1):before {
				background:#FFCE54;
			} 
			&:nth-child(4n+2):before {
				background:#2ECC71;
			} 
			&:nth-child(4n+3):before {
				background:#5D9CEC;
			} 
		}
	}
}

@keyframes swing {
	0%, 100% {
		transform:rotate(-30deg);
	}
	5%, 45% {
		opacity:0.25;
	}
	50%, 100%, 0% {
		opacity:1;
	}
	50% {
		transform:rotate(30deg);
	}
}
</style>