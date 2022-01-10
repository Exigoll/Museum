let items = document.querySelectorAll('.carousel .item');
let currentItem = 0;
let isEnabled = true;
/* let dots = document.querySelectorAll('.dot'); */



function changeCurrentItem(n) {
	currentItem = (n + items.length) % items.length;
}

function hideItem(direction) {
	isEnabled = false;
	items[currentItem].classList.add(direction);
	items[currentItem].addEventListener('animationend', function() {
		this.classList.remove('active', direction);
	});
}

function showItem(direction) {
	items[currentItem].classList.add('next', direction);
	items[currentItem].addEventListener('animationend', function() {
		this.classList.remove('next', direction);
		this.classList.add('active');
		isEnabled = true;
	});
}

function nextItem(n) {
	hideItem('to-left');
	changeCurrentItem(n + 1);
	showItem('from-right');
}

function previousItem(n) {
	hideItem('to-right');
	changeCurrentItem(n - 1);
	showItem('from-left');
}

/* let activeDot = n => {
	for(dot of dots) {
		dot.classList.remove('active');
	}
	dots[n].classList.add('active');
} */

document.querySelector('.control.left').addEventListener('click', function() {
	if (isEnabled) {
		previousItem(currentItem);
	}
});

document.querySelector('.control.right').addEventListener('click', function() {
	if (isEnabled) {
		nextItem(currentItem);
	}
});

const swipedetect = (el) => {
  
	let surface = el;
	let startX = 0;
	let startY = 0;
	let distX = 0;
	let distY = 0;
	let startTime = 0;
	let elapsedTime = 0;

	let threshold = 150;
	let restraint = 100;
	let allowedTime = 300;

	surface.addEventListener('mousedown', function(e){
		startX = e.pageX;
		startY = e.pageY;
		startTime = new Date().getTime();
		e.preventDefault();
	}, false);

	surface.addEventListener('mouseup', function(e){
		distX = e.pageX - startX;
		distY = e.pageY - startY;
		elapsedTime = new Date().getTime() - startTime;
		if (elapsedTime <= allowedTime){
			if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
				if ((distX > 0)) {
					if (isEnabled) {
						previousItem(currentItem);
					}
				} else {
					if (isEnabled) {
						nextItem(currentItem);
					}
				}
			}
		}
		e.preventDefault();
	}, false);

	surface.addEventListener('touchstart', function(e){
		if (e.target.classList.contains('arrow') || e.target.classList.contains('control')) {
			if (e.target.classList.contains('left')) {
				if (isEnabled) {
					previousItem(currentItem);
				}
			} else {
				if (isEnabled) {
					nextItem(currentItem);
				}
			}
		}
			var touchobj = e.changedTouches[0];
			startX = touchobj.pageX;
			startY = touchobj.pageY;
			startTime = new Date().getTime();
			e.preventDefault();
	}, false);

	surface.addEventListener('touchmove', function(e){
			e.preventDefault();
	}, false);

	surface.addEventListener('touchend', function(e){
			var touchobj = e.changedTouches[0];
			distX = touchobj.pageX - startX;
			distY = touchobj.pageY - startY;
			elapsedTime = new Date().getTime() - startTime;
			if (elapsedTime <= allowedTime){
					if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
							if ((distX > 0)) {
								if (isEnabled) {
									previousItem(currentItem);
								}
							} else {
								if (isEnabled) {
									nextItem(currentItem);
								}
							}
					}
			}
			e.preventDefault();
	}, false);
}

var el = document.querySelector('.carousel');
swipedetect(el);

//& Gallery
const mixRand=(a,b)=>Math.random()-0.5;

let arrImg=Array.from(document.getElementsByClassName('images')), arrImgSrcMix=arrImg.map(e=>e.src).sort(mixRand);
arrImg.map((e,i)=>e.src=arrImgSrcMix[i]);

//? Video-player
const player = document.querySelector('.video__frame');
const video = player.querySelector('.video__content');
const controlPanel = player.querySelector('.video__control-panel');
const buttonPlayBig = player.querySelector('.button-play-big');
const buttonPrev = player.querySelector('.button-previous');
const buttonPlay = player.querySelector('.toogle-play-pause');
const buttonNext = player.querySelector('.button-next');
const buttonVolume = player.querySelector('.toggle-volume');
const buttonFullScr = player.querySelector('.button-full-screen');
const ranges = player.querySelectorAll('.range');
const currTime = player.querySelector('.curr-time');
const durationTime = player.querySelector('.duration-time');
const progressVideo = document.querySelector('.progress-video');
const rangeVolume = document.querySelector('.range-volume');

function togglePlay() {
  if (video.paused) 
    video.play();
  else 
    video.pause();
}

function updateButton() { // Меняем иконки Play или Pause
  if (!this.paused) {
    buttonPlayBig.classList.add('visually-hidden');
    buttonPlay.classList.remove('button-play');
    buttonPlay.classList.add('button-pause');
  } else {
    buttonPlayBig.classList.remove('visually-hidden');
    buttonPlay.classList.remove('button-pause');
    buttonPlay.classList.add('button-play');
  }
}

function videoMute() { // Убираем звук при клике на кнопку динамика
  if(video.volume == 0) {
    video.volume = rangeVolume.value / 100;
    buttonVolume.classList.remove('toggle-volume-mute');
    buttonVolume.classList.add('toggle-volume-volume');
  } else {
    video.volume = 0;
    buttonVolume.classList.remove('toggle-volume-volume');
    buttonVolume.classList.add('toggle-volume-mute');
  }
}

function volumeUpdate(e) { // Изменяем уровень громкости при использовании range
  let volume = e.offsetX / rangeVolume.offsetWidth;
  volume = Math.floor(volume * 100) / 100;
  if (volume < 0.95)
    volume += 0.05;
  else if (volume >= 0.95)
    volume = 1;
  else if (volume > 0.05)
    volume -= 0.05;
  if (volume <= 0.05) 
    volume = 0;
  video.volume = volume;
  rangeVolume.value = volume * 100
  rangeVolume.style.background = `linear-gradient(to right, #710707 0%, #710707 ${volume * 100}%, #ffffff ${volume * 100}%, #ffffff 100%)`;
  if(video.volume == 0) {
    buttonVolume.classList.remove('toggle-volume-volume');
    buttonVolume.classList.add('toggle-volume-mute');
  } else {
    buttonVolume.classList.remove('toggle-volume-mute');
    buttonVolume.classList.add('toggle-volume-volume');
  }
}

function volumeUpdate2(volume) { // Изменяем уровень громкости при использовании стрелок
  volume = Math.floor(volume * 100) / 100;
  video.volume = volume;
  rangeVolume.value = volume * 100
  rangeVolume.style.background = `linear-gradient(to right, #710707 0%, #710707 ${volume * 100}%, #ffffff ${volume * 100}%, #ffffff 100%)`;
  if(video.volume == 0) {
    buttonVolume.classList.remove('toggle-volume-volume');
    buttonVolume.classList.add('toggle-volume-mute');
  } else {
    buttonVolume.classList.remove('toggle-volume-mute');
    buttonVolume.classList.add('toggle-volume-volume');
  }
}


function videoProgress() { // Отображаем время воспроизведения
  progress = ((Math.floor(video.currentTime) / Math.floor(video.duration)) * 100);
  progressVideo.value = progress;
  currTime.innerHTML = videoTime(video.currentTime);
  /* durationTime.innerHTML = videoTime(video.duration); */
  progressVideo.style.background = `linear-gradient(to right, #710707 0%, #710707 ${progress}%, #ffffff ${progress}%, #ffffff 100%)`
}

function scrub(e) { // Перематываем
  const scrubTime = (e.offsetX / progressVideo.offsetWidth) * video.duration;
  video.currentTime = scrubTime;
}

function toggleFullScreen() { // Переключатель полноэкранного режима
  if (!document.fullscreenElement) {
    player.requestFullscreen();
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Задаём события при кажатии кнопок клавиатуры учитывая возможность активной русской раскладки
document.addEventListener("keypress", function(e) { 
  if (e.keyCode === 32 || e.key === 'k' || e.key === 'K' || e.key === 'л' || e.key === 'Л') { 
    togglePlay();
  } else if (e.key === 'm' || e.key === 'M' || e.key === 'ь' || e.key === 'Ь') { 
    videoMute();
  } else if (e.key === 'f' || e.key === 'F' || e.key === 'а' || e.key === 'А') { 
    toggleFullScreen();
  } else if (e.key === 'l' || e.key === 'L' || e.key === 'д' || e.key === 'Д') {
    video.currentTime += 10; 
  } else if (e.key === 'j' || e.key === 'J' || e.key === 'о' || e.key === 'О') {
    video.currentTime += -10;
  } else if (e.key === '>' || e.key === 'Ю') { 
    if (video.playbackRate >= 15.75) 
      video.playbackRate = 16;
    else 
      video.playbackRate += 0.25; 
  } else if (e.key === '<' || e.key === 'Б') { 
    if (video.playbackRate >= 0.5) {
      video.playbackRate -= 0.25;
    } else {
      video.playbackRate = 0.25;
    }
  } else if (e.key === 'n' || e.key === 'N' || e.key === 'т' || e.key === 'Т') {
    video.playbackRate = 1;
  } else if (e.key >= 0 && e.key <= 9) {
    video.currentTime = (video.duration / 10) * e.key;
  }
}, false);

// События для срелок клавиатуры
document.addEventListener('keydown', function(e) {
  let volume;
  if (e.keyCode === 39) { // Стрелка вправо
    video.currentTime += 5; 
  } else if (e.keyCode === 37) {  // Стрелка влево
    video.currentTime += -5;
  } else if (e.keyCode === 38) {  // Стрелка вверх
    if (video.volume < 0.95) {
      volume = video.volume += 0.05;
      volumeUpdate2(volume);
    } else if (video.volume >= 0.95) {
      volume = 1;
      volumeUpdate2(volume);
    }
  } else if (e.keyCode === 40) {  // Стрелка Вниз
    if (video.volume > 0.05) {
      volume = video.volume - 0.05;
      volumeUpdate2(volume);
    }
    else if (video.volume <= 0.05) {
      volume = 0;
      volumeUpdate2(volume)
    }
  }
}, false);


video.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', videoProgress);
// video.addEventListener('volumechange', volumeBar)

buttonPlay.addEventListener('click', togglePlay);
buttonVolume.addEventListener('click', videoMute);
buttonFullScr.addEventListener('click', toggleFullScreen);
buttonPlayBig.addEventListener('click', togglePlay);

let mousedown = false;
progressVideo.addEventListener('click', scrub);
progressVideo.addEventListener('mousemove', (e) => mousedown && scrub(e));
progressVideo.addEventListener('mousedown', () => mousedown = true);
progressVideo.addEventListener('mouseup', () => mousedown = false);

rangeVolume.addEventListener('click', volumeUpdate);
rangeVolume.addEventListener('mousemove', (e) => mousedown && volumeUpdate(e));
rangeVolume.addEventListener('mousedown', () => mousedown = true);
rangeVolume.addEventListener('mouseup', () => mousedown = false);


//? Input 
const progress = document.querySelector('.input');
const progresss = document.querySelector('.input-small');

progress.addEventListener('input', function() {
  const value = this.value;
  this.style.background = `linear-gradient(to right, #710707 0%, #710707 ${value}%, #fff ${value}%, #fff 100%)`
})
progresss.addEventListener('input-small', function() {
  const value = this.value;
  this.style.background = `linear-gradient(to right, #710707 0%, #710707 ${value}%, #fff ${value}%, #fff 100%)`
})

//?Explore
function imageComparison(selector) {

	let comparison = $(selector)
			.addClass('image-comparison')
			.prepend('<div class="image-comparison__before"></div>')
			.append('<button class="image-comparison__slider"></button>');

	let images = comparison
			.find('img')
			.addClass('image-comparison__image')
			.css('max-width', comparison.width());

	let before = comparison
			.find('.image-comparison__before')
			.append(images.eq(0));

	comparison
			.find('.image-comparison__slider')
			.on('dragstart', () => false) // отмена станд. drug&drop 
			.on('mousedown', function(e) {
					let slider = $(this);
					let doc = $(document).on('mousemove', (e) => {
							let offset = e.pageX - comparison.position().left;
							let width = comparison.width();

							// установим границы, чтобы ползунок не выходил 
							if (offset < 0) offset = 0;
							if (offset > width) offset = width;

							slider.css('left', offset + 'px');
							before.css('width', offset + 'px');
					});

					doc.on('mouseup', () => doc.off('mousemove'));
			});
};

imageComparison('#image-comparison');



/* (function() {
	var inputDown = ('ontouchstart' in document.documentElement) ? 'touchstart' : 'mousedown';
	var inputMove = ('ontouchmove' in document.documentElement) ? 'touchmove' : 'mousemove';
	var inputUp = ('ontouchend' in document.documentElement) ? 'touchend' : 'mouseup';

	var divider = document.querySelector('.explore__divider');
	var handle = document.querySelector('.explore__line');
	var beforeImg = document.querySelector('.explore__restavration');
	var handleClicked = false;
	
	var containerOffsetLeft = divider.offsetLeft;
	var containerWidth = divider.offsetWidth;

	window.addEventListener(inputUp, function() { return handleClicked = false });
	handle.addEventListener(inputDown, function() { return handleClicked = true });
	divider.addEventListener(inputMove, handleMove);

	function handleMove(e) {
		var relativeX, slidePercent;

		if (handleClicked) {
		  relativeX = (e.pageX) ? e.pageX : e.touches[0].pageX;
		  slidePercent = (((relativeX - containerOffsetLeft) / containerWidth) * 100) + '%';
	  	
	  	resizeBeforeImage(slidePercent);
		}

		return handleClicked;
	}

	function resizeBeforeImage(slidePercent) {
    beforeImg.style.width = slidePercent;
    handle.style.left = slidePercent;

	  return handleClicked;
	}
})(); */

//? Button
const buttons = document.querySelectorAll('.bankcardbtn')

buttons.forEach(button => {
    button.addEventListener('click', function (e) {
        const x = e.clientX
        const y = e.clientY

        const buttonTop = e.target.offsetTop
        const buttonLeft = e.target.offsetLeft

        const xInside = x - buttonLeft
        const yInside = y - buttonTop

        const circle = document.createElement('span')
        circle.classList.add('circle')
        circle.style.top = yInside + 'px'
        circle.style.left = xInside + 'px'

        this.appendChild(circle)

        setTimeout(() => circle.remove(), 500)
    })
})