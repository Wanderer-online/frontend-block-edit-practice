// Function to pause all videos in carousel except the current one
function pauseAllVideosInCarousel(currentVideo, carousel) {
  if (!carousel) return;
  
  const allVideos = carousel.querySelectorAll('video');
  const allPlayBtns = carousel.querySelectorAll('.play-btn');
  
  allVideos.forEach(v => {
    if (v !== currentVideo && !v.paused) {
      v.pause();
    }
  });
  
  allPlayBtns.forEach(btn => {
    const btnWrapper = btn.closest('.video-wrapper');
    const btnVideo = btnWrapper ? btnWrapper.querySelector('video') : null;
    if (btnVideo && btnVideo !== currentVideo) {
      btn.style.display = 'block';
    }
  });
}

document.querySelectorAll('.video-wrapper').forEach(wrapper => {
  const video = wrapper.querySelector('video');
  const playBtn = wrapper.querySelector('.play-btn');
  const bestTimeExpert = document.querySelector('.best-time-expert')
  const carousel = wrapper.closest('.positive-reviews-video-blocks');
  let mouseDownTime = 0;
  let mouseDownX = 0;

  if (!video || !playBtn) return; // якщо щось відсутнє — пропускаємо

  // Track mouse down to detect drag
  if (carousel) {
    carousel.addEventListener('mousedown', (e) => {
      mouseDownTime = Date.now();
      mouseDownX = e.pageX;
    }, true);
  }

  // Check if click was actually a drag
  const wasDrag = (e) => {
    if (!carousel) return false;
    const timeDiff = Date.now() - mouseDownTime;
    const xDiff = Math.abs(e.pageX - mouseDownX);
    // If mouse moved more than 5px or time is too long, it was likely a drag
    return timeDiff > 200 || xDiff > 5;
  };

  // Натискання на кнопку ▶️
  playBtn.addEventListener('click', (e) => {
    if (wasDrag(e)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    // Pause all other videos in carousel before playing this one
    pauseAllVideosInCarousel(video, carousel);
    video.play();
    playBtn.style.display = 'none';
    if (bestTimeExpert) {
      bestTimeExpert.style.display = 'none';
    }
  });

  // Натискання на саме відео — пауза / відтворення
  video.addEventListener('click', (e) => {
    if (wasDrag(e)) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (video.paused) {
      // Pause all other videos in carousel before playing this one
      pauseAllVideosInCarousel(video, carousel);
      video.play();
      playBtn.style.display = 'none';
      if (bestTimeExpert) {
      bestTimeExpert.style.display = 'none';
    }
    } else {
      video.pause();
      playBtn.style.display = 'block';
      if (bestTimeExpert) {
      bestTimeExpert.style.display = 'block';
    }
    }
  });

  // Додатково — коли відео закінчиться, показати кнопку знову
  video.addEventListener('ended', () => {
    playBtn.style.display = 'block';
    if (bestTimeExpert) {
      bestTimeExpert.style.display = 'block';
    }
  });
});