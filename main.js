/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play/ pause/ seek
 * 4. CD rotale
 * 5. Next/ prew
 * 6. Random
 * 7. Next/ Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const audio = $('#audio')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')

const app = {
    randomActive: false,
    repeatActive: false,
    curentIndex: 0,
    songs : [
    {
      name: "Hẹn Em Ở Lần Yêu Thứ 2",
      singer: "Nguyenn, Đặng Tuấn Vũ",
      path: "./music/song1.mp3",
      image: "./img/img1.jpg"
    },
    {
      name: "Mùa Gió Cũ",
      singer: "Trung Quân, Vũ Đặng Quốc Việt",
      path: "./music/song2.mp3",
      image: "./img/img2.jpg"
    },
    {
      name: "Tình Bằng Không",
      singer: "Czee",
      path: "./music/song3.mp3",
      image: "./img/img3.jpg"
    },
    {
      name: "Hơn Em Chỗ Nào",
      singer: "Thùy Chi",
      path: "./music/song4.mp3",
      image: "./img/img4.jpg"
    },
    {
      name: "Chuyện chúng ta sau này",
      singer: "Hai Dang Doo ft. Erik",
      path: "./music/song5.mp3",
      image: "./img/img5.jpg"
    },
    {
      name: "Rồi Ta Sẽ Ngắm Pháo Hoa Cùng Nhau",
      singer: "O.lew",
      path: "./music/song6.mp3",
      image: "./img/img6.jpg"
    },
    {
      name: "Tình Yêu Đến Sau",
      singer: "Myra Trần",
      path: "./music/song7.mp3",
      image: "./img/img7.jpg"
    },
    {
        name: "Có Ai Đợi Anh Đâu",
        singer: "Vương Anh Tú",
        path: "./music/song8.mp3",
        image: "./img/img8.jpg"
    },
    {
        name: "Hồi Kết",
        singer: "Hà Nhi",
        path: "./music/song9.mp3",
        image: "./img/img9.jpg"
    },
    {
        name: "Kẻ Vô Tâm",
        singer: "Mars Anh Tú",
        path: "./music/song10.mp3",
        image: "./img/img10.jpg"
    }
  ],
    //1. Render songs 
  render: function(){
    const htmls = this.songs.map(function(song, index){
      return`<div class="song ${index === app.curentIndex ? 'active': ''}"data-index = ${index}>
        <div class="thumb" style="background-image: url('${song.image}')">
        </div>
        <div class="body">
          <h3 class="title">${song.name}</h3>
          <p class="author">${song.singer}</p>
        </div>
        <div class="option">
          <i class="fas fa-ellipsis-h"></i>
        </div>
      </div>`
    }).join('')
    $('.playlist').innerHTML = htmls
  },
  defineProperties:function(){
    Object.defineProperty(this, 'currentSong', {
      get: function(){
        return this.songs[this.curentIndex]
      }
    })
  },
  handleEvents: function(){
    const cdWidth = cd.offsetWidth
    // Xử lý phóng to thu nhỏ
    document.onscroll = function(){
        const scroll = window.scrollY
        if(Math.floor(scroll/2) >= cdWidth){
            cd.style.width = '0px' 
        }
        const newCdWidth = cdWidth - Math.floor(scroll/2)
        cd.style.width = newCdWidth +'px'
    }
    // Xử lý quay CD thumb
    const cdAnimate  = cd.animate([
      {transform : 'rotate(360deg)'}],
      {
        duration: 10000, // 10seconds
        iterations : Infinity
      })
      cdAnimate.pause() 
    // Xử lý khi click play
    playBtn.onclick = function(){
      if(player.classList.toggle('playing')){
        audio.play()
        cdAnimate.play()
      }
      else{
        audio.pause()
        cdAnimate.pause()
      }
    }
    // Xử lý khi bài hát thay đổi
    audio.ontimeupdate = function(){
      if(audio.currentTime){
      progress.value = (audio.currentTime*100/audio.duration).toFixed(2)
      if(progress.value == 100){
        if(app.repeatActive){
          //progress.value = 0
          audio.play()
        }
        else
        app.nextSong()
        cdAnimate.play()}
      }
    }
     // Xử lý khi tua audio 
    progress.onchange = function(){
      audio.currentTime = progress.value*audio.duration/100
    }
     // Xử lý khi next and prev song
    nextBtn.onclick = function(){
      app.nextSong()
      cdAnimate.play()
    }
    prevBtn.onclick = function(){
      app.prevSong()
      cdAnimate.play()
    }
    // Xử lý khi random song
    randomBtn.onclick = function(){
      if(randomBtn.classList.toggle('active')){
        app.randomActive = true
        repeatBtn.classList.remove('active')
        app.repeatActive = false
      }
      else
        app.randomActive = false
    }
    // Xử lý khi repeat song
    repeatBtn.onclick = function(){
      if(repeatBtn.classList.toggle('active')){
        app.repeatActive = true
        randomBtn.classList.remove('active')
        app.randomActive = false
      }
      else
        app.repeatActive = false
    }
    // Lắng nghe hành vi click vào playlist
    playlist.onclick = function(e){
      const songElement = e.target.closest('.song:not(.active)')
      if(songElement || e.target.closest('.option')){
        // Xử lý khi click option
        if(e.target.closest('.option')){
          console.log(e.target)
        }
        // Xử lý khi click playlist song
        else{
          //app.curentIndex = songElement.getAttribute('data-index')
          app.curentIndex = Number(songElement.dataset.index)
          app.loadCurrentSong()
          app.render()
          app.scrollToActiveSong()
          player.classList.add('playing')
          audio.play()
          cdAnimate.play()

        }     
      }
    }
  },
  loadCurrentSong: function(){
    $('header h2').textContent = this.currentSong.name
    $('.cd-thumb').style.backgroundImage = `url('${this.currentSong.image}')`
    $('#audio').src = this.currentSong.path
  },
  nextSong: function(){
    if(this.randomActive){
      app.random()
    }
    else{
    this.curentIndex += 1
    if(this.curentIndex >= this.songs.length){
      this.curentIndex = 0
    }}
    this.loadCurrentSong()
    //progress.value = 0
    player.classList.add('playing')
    audio.play()
    this.render()
    this.scrollToActiveSong()
    
  },
  prevSong: function(){
    if(this.randomActive){
      app.random()
    }
    else{
    this.curentIndex -=1
    if(this.curentIndex < 0){
      this.curentIndex = this.songs.length-1
    }}
    this.loadCurrentSong()
    //progress.value = 0
    player.classList.add('playing')
    audio.play()
    this.render()
    this.scrollToActiveSong()
  },
  random: function(){
    let randomSong
    do{randomSong = Math.floor((Math.random())*app.songs.length)}
    while(this.curentIndex === randomSong)
    this.curentIndex = randomSong
  },
  scrollToActiveSong: function(){
    setTimeout(()=>{
      $('.song.active').scrollIntoView({
        behavior : 'smooth',
        block: 'nearest'
      })
    }, 300)
  },
  start: function(){
    // Định nghĩa các thuộc tính cho object
    this.defineProperties()
    // Lắng nghe, xử lý các sự kiện( DOM event)
    this.handleEvents()
    // Render playlist
    this.render()
    // Render bài hát đang phát len UI
    this.loadCurrentSong() 
  },
}
app.start()


 
  