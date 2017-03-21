<template>
<div id="app">
    
<!-- header -->
    <header v-bind:style="{background : skinColor}">
        <div class="add-music" v-on:click="isShowAdd = !isShowAdd">
            <i class="iconfont">&#xe6cf;</i>
        </div>
        <div class="music-title">
            <p>{{ muscicTitle }}</p>
        </div>
        <div class="musicList" v-on:click="isShowList = !isShowList">
            <i class="iconfont">&#xe64d;</i>
        </div>
    </header>

  <div class="content" v-on:click = "isShowList = false">
      <audio v-bind:src="muscicSrc" preload>Your browser does not support the audio element.</audio>

        <div class="bgImg">
            <img v-bind:src="musicImgSrc">
        </div>
        <div class="contentHeader"></div>
        <div class="img">
            <img class="rotateImg" v-bind:src="musicImgSrc" v-bind:class="{ animetion : isAnimetion}">
        </div>
        <div class="contentFooter"></div>

        <div class="skin" v-bind:style="{color: skinSrc}" v-on:click='isShowColor = !isShowColor'>
            <i class="iconfont">&#xe60c;</i>
        </div>

    <!-- music list -->
    <transition name='fade'>
      <ol class="playerList" v-show='isShowList'>
        <li v-for='(item,index) in musics' v-on:click='toggleMusic(item,index)' v-bind:class="{atvice : item.src === (DOM.audio && DOM.audio.src)}">
          <span>{{ item.name }}</span>
          <i class="iconfont" v-on:click.stop.prevent = "delMusic(index)">&#xe600;</i>
        </li>
      </ol>
    </transition>
    <!-- skin -->
    <transition name='fade'>
      <ul class="select-skin" v-if='isShowColor' v-on:click.capture="isShowColor = false">
          <li class="one" v-bind:class="{active : skinColor == '#b72712'}" v-on:click='skinColor = "#b72712"'></li>
          <li class="two" v-bind:class="{active :skinColor == '#1565c0'}" v-on:click='skinColor = "#1565c0"'></li>
          <li class="three" v-bind:class="{active :skinColor == '#212121'}" v-on:click = 'skinColor = "#212121";'></li>
          <li class="four" v-bind:class="{active :skinColor == '#1b5e20'}" v-on:click = 'skinColor = "#1b5e20";'></li>
      </ul>
    </transition>
    <!-- add music -->
    <transition name="fade">
      <div v-show="isShowAdd" class="add-music">
        <div class="form">

          <div class="input-music-name input">
            <label for="music-name">歌曲名称</label>
            <input v-model.trim="newMusicName" v-on:keyup.enter="addMusic" id="music-name" type="text" placeholder="请输入要显示的歌曲名(必填)">
            <img v-on:click.stop.prevent="newMusicName=''" src="http://omratag7g.bkt.clouddn.com/del2.png" alt="microzz.com">
          </div>

          <div class="input-music-src input">
            <label for="music-src">歌曲链接</label>
            <input v-model.trim="newMusicSrc" v-on:keyup.enter="addMusic" id="music-src" type="text" placeholder="请输入歌曲超链接(必填)">
            <img v-on:click.stop.prevent="newMusicSrc=''" src="http://omratag7g.bkt.clouddn.com/del2.png" alt="microzz.com">
          </div>

          <div class="input-music-img-src input">
            <label for="music-img-src">照片链接</label>
            <input v-model.trim="newMusicImgSrc" v-on:keyup.enter="addMusic" id="music-img-src" type="text" placeholder="请输入歌曲写真照片链接">
            <img v-on:click.stop.prevent="newMusicImgSrc=''" src="http://omratag7g.bkt.clouddn.com/del2.png" alt="microzz.com">
          </div>

          <div class="input-btn input">
            <button v-on:click.stop.prevent="addMusic">添加音乐</button>
            <button v-on:click.stop.prevent="isShowAdd=false">取消操作</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- msg -->
    <transition name="fade">
      <div class="msg" v-show="isShowMsg">
        <i class="iconfont">&#xe603;</i>
        <p>{{ msg }}</p>
      </div>
    </transition>

  </div>
  <footer v-bind:style = "{ background : skinColor}">
      <div class="prev" v-on:click.stop.prevent="toChange('prev')"><i class="iconfont icon-prev"></i></div>
      <div class="start-pause" v-on:click.stop.prevent="startPause"><i class="iconfont" v-bind:class="playBtnSrc"></i></div>
      <div class="next" v-on:click.stop.prevent="toChange('next')"><i class="iconfont icon-next"></i></div>
  </footer>
</div>

</template>

<script>
import MusicData from './music-data';

export default {
  name : 'player',
  mounted(){
    this.DOM = {
        audio : document.querySelector('audio'),
        rotateImg : document.querySelector('.rotateImg')
    };
    this.muscicTitle = this.musics[this.index].name;
    this.muscicSrc = this.musics[this.index].src;
    this.musicImgSrc = this.musics[this.index].musicImgSrc;

  },
  data () {
    return {
        musics: Object.assign([], MusicData),
        muscicTitle : '',
        muscicSrc : '',
        musicImgSrc : '',
        musicSrcDefault: 'http://omratag7g.bkt.clouddn.com/music-bg.jpg',
        isShowAdd : false,
        isShowList : false,
        isShowColor : false,
        isShowMsg : false,
        msg : '',
        newMusicName: '',
        newMusicSrc: '',
        newMusicImgSrc: '',
        DOM : {},
        index : 0 ,
        isAnimetion : false,
        playBtnSrc : 'icon-bofang',
        skinColor: '#1b5e20',
        skinSrc : "#fff" 
    }
  },
  watch : {
    isShowColor : {
        handler (isShowColor) {
            this.skinSrc = isShowColor ? '#000' : '#fff';
        }
    }
  },
  methods : {
    // 播放|暂停
    startPause () {
        this.DOM.audio.paused ? this.DOM.audio.play() : this.DOM.audio.pause();
        this.DOM.rotateImg.style.animationPlayState = this.DOM.audio.paused ? 'paused' : 'running';
        this.isAnimetion = true;

        this.playBtnSrc = this.DOM.audio.paused ? 'icon-bofang' : "icon-zanting";
    },
    toChange (changeType) {
        if(changeType == 'prev') {
            this.index -= 1;
            this.index = this.index < 0 ? this.musics.length-1 : this.index;
        }else if(changeType == 'next'){
            this.index += 1;
            this.index = this.index >= this.musics.length ? 0 : this.index;
        }
        this.DOM.audio.autoplay = true;
        this.playBtnSrc = 'icon-zanting';
        this.muscicTitle = this.musics[this.index].name;
        this.muscicSrc = this.musics[this.index].src;
        this.musicImgSrc = this.musics[this.index].musicImgSrc || this.musicSrcDefault;
    },
    // 从列表切换音乐
    toggleMusic (item , index ) {
        this.index = index;
        this.muscicTitle = item.name;
        this.muscicSrc = item.src;
        this.musicImgSrc = item.musicImgSrc || this.musicSrcDefault;
        this.isShowList = false;
        this.DOM.audio.autoplay =  true;
        this.playBtnSrc = 'icon-zanting';
        this.isAnimetion = true;
    },
    showMsg (msg) {
        this.isShowMsg = true;
        this.msg = msg;
        setTimeout(() => {
            this.isShowMsg = false;
        },2000);
    },
    addMusic(){
      if(this.newMusicName !== '' && this.newMusicSrc !== '') {
        var newMsuic =  {
          name : this.newMusicName , 
          src : this.newMusicSrc ,
          musicImgSrc : this.newMusicImgSrc || this.musicSrcDefault
        }
        this.musics.push(newMsuic);
        this.newMusicName = '' ;
        this.newMusicSrc = '';
        this.newMusicImgSrc = '';
        this.isShowAdd = false;
        this.showMsg('添加音乐成功');
      } else {
        this.showMsg('请填写完整信息');
      }
    },
    delMusic (index) {

    }
  }
}
</script>

<style>
@import url('//at.alicdn.com/t/font_u62ig03cahflayvi.css');
ul {
  list-style: none;
}
p {
    margin: 0;
}
body,html {
    margin: 0;
    height: 100%;
    width: 100%;
    overflow: hidden;
}

#app {
    margin: 0;
    width: 100%;
    height: 100%;
    /*max-width: 665px;*/
    margin : 0 auto;
    display: flex;
    flex-direction: column;
    width: 100%;
    height : 100%;
}

header {
  flex : 1;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
header .iconfont {
    font-size: 20px;
}
.music-title {
    flex: 5;
    text-align: center;
}
.add-music,.musicList {
    flex-grow: 1;
    text-align: center;
}
.content {
    position: relative;
    flex: 11;
    display: flex;
    flex-direction: column;
    width: 100%;
}
.content .bgImg img{
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    filter: blur(10px);
}
.content .contentHeader {
    flex : 1;
}
.content .img {
    flex : 5;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
}
.content .img img {
    position: relative;
    z-index: 10;
    width: 240px;
    height: 240px;
    border-radius: 50%;
}
.content .contentFooter {
    flex: 1;
}
.skin {
    position: absolute;
    right: 20px;
    bottom: 20px;
}
.skin .iconfont {
    font-size: 30px;
}
.content .playerList {
    z-index: 10;
    background : rgba(0,0,0,.6);
    position: absolute;
    border-radius: 10px 0 0 10px;
    padding: 20px 10px 20px 40px;
    top: 0;
    right: 0;
    margin: 0;
    font-size: 14px;
}
.content .playerList li {
    line-height: 20px;
    border-bottom: 1px solid #fff;
    color: #fff;
    padding: 10px 0;
}
.content .playerList li.atvice {
    color : #FF6E40;
}
.content .playerList li .iconfont {
    float: right;
    margin-left: 10px;
}
.content .select-skin {
    z-index: 10;
    position: absolute;
    padding: 0;
    margin: 0;
    right: 24px;
    bottom: 55px;
}
.content .select-skin li {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #000;
    margin-bottom: 10px;
}
.content .select-skin li.active {
    box-shadow: 0px 0px 3px #ddd600;
    border: 1px solid #e0e0e0;
}
.content .select-skin li.one {
    background: #b72712;
}
.content .select-skin li.two {
    background: #1565c0;
}
.content .select-skin li.three {
    background: #212121;
}
.content .select-skin li.four {
    background: #1b5e20;
}

.content .add-music {
  background: rgba(0, 0, 0, .5);
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.content .add-music .form {
  background: rgba(0, 0, 0, .7);
  position: absolute;
  left: 0;
  width: 100%;
  height: 78.5%;
  flex: 1;
  color: white;
  display: flex;
  flex-direction: column;
  padding-top: 110px;
}

.content .add-music .form img {
  width: 20px;
  height: 20px;
  position: relative;
  margin-left: -29px;
  top: 6px;
  border-radius: 11px;
}

input {
  border: none;
  border-bottom: 2px solid #C6FF00;
  outline: none;
  padding: 5px;
  width: 200px;
  border-radius: 3px;
  box-shadow: 0 0 10px #FF5722;
  padding-right: 25px;
}

.content .add-music .form .input-music-name {
  flex: 1;
  margin: auto;
}

.content .add-music .form .input-music-src {
  flex: 1;
  margin: auto;
}

.content .add-music .form .input-music-img-src {
  flex: 1;
  margin: auto;
}

.content .add-music .form .input-btn {
  flex: 3;
  margin: auto;
}

.content .add-music .form .input-btn button {
  background: white;
  border: none;
  border-radius: 5px;
  box-shadow: 1px 1px 9px #FF5722;
  margin: auto 5px;
  font-size: 1rem;
  font-weight: bold;
  color: #263238;
}

.content .msg {
    position: absolute;
    background: #000;
    padding: 5px 10px;
    margin: 0 auto;
    color: #fff;
    border-radius: 5px;
    margin: auto;
    top: 0;
    left: 0;
    right: 0;
    z-index: 10;
    text-align: center;
}
.content .msg .iconfont {
    color : #0099ff;
}
.content .msg p {
    display: inline-block;
}
.animetion {
    animation: rotateAnimation 18s linear infinite;
}
@keyframes rotateAnimation {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
.fade-enter-active, .fade-leave-active {
  transition: all .3s
}
.fade-enter, .fade-leave-active {
    transform: translateX(10px);
  opacity: 0
}
footer {
    flex: 1.8;
    display: flex;
    align-items: center;
    border-top: 1px solid #fff;
}
footer .iconfont {
    font-size: 30px;
    color: #fff;
}
footer .prev,footer .next {
    flex: 5;
    text-align: center;
}
footer .start-pause .iconfont{
    font-size: 40px;
}

</style>
