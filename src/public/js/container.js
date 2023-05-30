const playDOM = document.getElementById("play");
const volumeDOM = document.getElementById("volume");
const videoDOM = document.getElementById("video");
const volumeRangeDOM = document.getElementById("volumeRange");
const currentTimeDOM = document.getElementById("currentTime");
const entireTimeDOM = document.getElementById("entireTime");
const expandDOM = document.getElementById("expand");
const containerDOM = document.getElementById("container");
const containerInteractionDOM = document.getElementById("containerInteraction");
let volume = volumeRangeDOM.value;

playDOM.addEventListener("click", async () => {
  if (videoDOM.paused) {
    videoDOM.play();
    playDOM.classList.remove("fa-play");
    playDOM.classList.add("fa-pause");
  } else {
    videoDOM.pause();
    playDOM.classList.remove("fa-pause");
    playDOM.classList.add("fa-play");
  }
});

volumeDOM.addEventListener("click", () => {
  if (!videoDOM.muted) {
    videoDOM.muted = true;
    volumeDOM.classList.add("fa-volume-xmark");
    volumeRangeDOM.value = 0;
  } else {
    videoDOM.muted = false;
    volumeDOM.classList.remove("fa-volume-xmark");
    volumeRangeDOM.value = volume;
  }
});

volumeRangeDOM.addEventListener("input", (e) => {
  videoDOM.volume = e.target.value / 100;

  if (videoDOM.volume >= 0.6) {
    volumeDOM.classList.remove("fa-volume-off", "fa-volume-low");
    volumeDOM.classList.add("fa-volume-high");
  } else if (videoDOM.volume >= 0.3 && videoDOM.volume < 0.6) {
    volumeDOM.classList.remove("fa-volume-high", "fa-volume-off");
    volumeDOM.classList.add("fa-volume-low");
  } else {
    volumeDOM.classList.remove("fa-volume-high", "fa-volume-low");
    volumeDOM.classList.add("fa-volume-off");
  }
});

const updateTime = (time, timeDOM) => {
  const { hours, minutes, seconds } = time;
  timeDOM.innerText = `${hours ? `${hours >= 10 ? hours : `0${hours}`}:` : ""}${
    minutes ? `${minutes >= 10 ? minutes : `0${minutes}`}:` : "00:"
  }${seconds >= 10 ? seconds : `0${seconds}`}`;
};

videoDOM.addEventListener("loadedmetadata", (e) => {
  currentTimeDOM.innerText = `00:00`;
  const seconds = Math.floor(videoDOM.duration % 60);
  const minutes = Math.floor(videoDOM.duration / 60);
  const hours = Math.floor(videoDOM.duration / 3600);
  const time = { seconds, minutes, hours };
  updateTime(time, entireTimeDOM);
});

videoDOM.addEventListener("timeupdate", () => {
  const seconds = Math.floor(videoDOM.currentTime % 60);
  const minutes = Math.floor(videoDOM.currentTime / 60);
  const hours = Math.floor(videoDOM.currentTime / 3600);
  const time = { seconds, minutes, hours };
  updateTime(time, currentTimeDOM);
});

expandDOM.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    containerDOM.requestFullscreen();
    expandDOM.classList.remove("fa-expand");
    expandDOM.classList.add("fa-compress");
    videoDOM.classList.add("video-expand");
    containerDOM.classList.add("container-expand");
    containerInteractionDOM.classList.add("container-interaction-expand");
  } else {
    document.exitFullscreen();
    expandDOM.classList.remove("fa-compress");
    expandDOM.classList.add("fa-expand");
    videoDOM.classList.remove("video-expand");
    containerDOM.classList.remove("container-expand");
    containerInteractionDOM.classList.remove("container-interaction-expand");
  }
});

let moveTimeout;
let leaveTimeout;
const handlecontainerInteractionDOM = () => {
  if (moveTimeout) {
    clearTimeout(moveTimeout);
    moveTimeout = null;
  }
  containerInteractionDOM.style.display = "grid";
  containerInteractionDOM.style.backgroundColor = "black";
  moveTimeout = setTimeout(() => {
    containerInteractionDOM.style.display = "none";
  }, 3000);
};

containerDOM.addEventListener("mousemove", handlecontainerInteractionDOM);
