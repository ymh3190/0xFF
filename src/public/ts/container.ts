const playDOM = document.getElementById("play") as HTMLElement;
const volumeDOM = document.getElementById("volume") as HTMLElement;
const videoDOM = document.getElementById("video") as HTMLVideoElement;
const volumeRangeDOM = document.getElementById(
  "volumeRange"
) as HTMLInputElement;
const currentTimeDOM = document.getElementById(
  "currentTime"
) as HTMLSpanElement;
const entireTimeDOM = document.getElementById("entireTime") as HTMLSpanElement;
const expandDOM = document.getElementById("expand") as HTMLElement;
const containerDOM = document.getElementById("container") as HTMLDivElement;
const containerInteractionDOM = document.getElementById(
  "containerInteraction"
) as HTMLDivElement;
const timelineDOM = document.getElementById("timeline") as HTMLInputElement;

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
    volumeRangeDOM.value = "0";
  } else {
    videoDOM.muted = false;
    volumeDOM.classList.remove("fa-volume-xmark");
    volumeRangeDOM.value = volume;
  }
});

volumeRangeDOM.addEventListener("input", (e: Event) => {
  videoDOM.volume = parseInt((e.target as HTMLInputElement).value) / 100;

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

const updateTime = (
  time: { seconds: number; minutes: number; hours: number },
  timeDOM: HTMLSpanElement
) => {
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
  timelineDOM.max = String(Math.floor(videoDOM.duration));
});

videoDOM.addEventListener("timeupdate", () => {
  const seconds = Math.floor(videoDOM.currentTime % 60);
  const minutes = Math.floor(videoDOM.currentTime / 60);
  const hours = Math.floor(videoDOM.currentTime / 3600);
  const time = { seconds, minutes, hours };
  updateTime(time, currentTimeDOM);
  timelineDOM.value = String(Math.floor(videoDOM.currentTime));
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

let moveTimeout: NodeJS.Timeout | null;
containerDOM.addEventListener("mousemove", () => {
  if (moveTimeout) {
    clearTimeout(moveTimeout);
    moveTimeout = null;
  }
  containerInteractionDOM.style.display = "grid";
  moveTimeout = setTimeout(() => {
    containerInteractionDOM.style.display = "none";
  }, 3000);
});

timelineDOM.addEventListener("input", (e: Event) => {
  videoDOM.currentTime = parseInt((e.target as HTMLInputElement).value);
});
