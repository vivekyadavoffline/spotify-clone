console.log('java started');
let currentsong = new Audio();
let currentSongItem = null;
let currentSongIndex = 0;
function formatTime(totalSeconds) {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    // Add leading zero if needed
    minutes = minutes.toString().padStart(2, '0');
    seconds = seconds.toString().padStart(2, '0');

    return `${minutes}:${seconds}`;
}

async function getsongs() {
    const a = await fetch('songs/');
    const response = await a.text();
    const div = document.createElement('div');
    div.innerHTML = response;

    const as = div.getElementsByTagName('a');
    const songs = [];

    for (let index = 0; index < as.length; index++) {
        const href = as[index].getAttribute('href') || '';
        if (href.endsWith('.mp3')) {
            const decoded = decodeURIComponent(href);
            const fileName = decoded.split(/[\\/]/).pop();
            songs.push(`${fileName}`);
        }
    }
    return songs;
}
const playMusic = (track, pause = false, songItem = null) => {
    currentsong.pause();
    currentsong.currentTime = 0;
    const play = document.getElementById("play");
    currentsong.src = "songs/" + track.trim();
    if (songItem) {
        currentSongItem = songItem;
    }
    document.querySelectorAll(".songlist .play-now img").forEach(icon => {
        icon.src = "assets/play.svg";
    });
    document.querySelectorAll(".songlist .play-now span").forEach(label => {
        label.textContent = "Play Now";
    });
    if (!pause) {
        currentsong.play();
        play.src = "assets/pause.svg";
        if (currentSongItem) {
            currentSongItem.querySelector(".play-now img").src = "assets/pause.svg";
            currentSongItem.querySelector(".play-now span").textContent = "00:00 / 00:00";
        }
    } else {
        play.src = "assets/play.svg";
        if (currentSongItem) {
            currentSongItem.querySelector(".play-now img").src = "assets/play.svg";
            currentSongItem.querySelector(".play-now span").textContent = "Play Now";
        }
    }
    document.querySelector(".song-info").innerHTML = track
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00 "
}
async function main() {
   
    const songs = await getsongs();
    console.log(songs);
    const play = document.getElementById("play");
    const previous = document.getElementById("previous");
    const next = document.getElementById("next");
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const closeSidebarBtn = document.getElementById("closeSidebarBtn");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const leftPanel = document.querySelector(".left");
    const rightPanel = document.querySelector(".right");
   
    if (!songs.length) {
        console.error('No songs found in songs/ directory.');
        return;
    }
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0]

     for (const song of songs){
    songUl.innerHTML = songUl.innerHTML + `<li>
     <img class=" invert" src="assets/music.svg" alt="Music note icon ">
              <div class="info">
                <div>${song}</div>
              </div><div class="play-now flex">
                <span> Play Now</span>
              <img class=" invert"  src="assets//play.svg" alt=""></div></li>`}

    const songItems = Array.from(songUl.getElementsByTagName("li"));
    const firstItem = songItems[0];
    playMusic(songs[0], true, firstItem);

    songItems.forEach((e, index) => {
        e.addEventListener("click", () => {
            currentSongIndex = index;
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML, false, e);
        });
    });

    play.addEventListener("click", ()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src = "assets/pause.svg"
            if (currentSongItem) {
                currentSongItem.querySelector(".play-now img").src = "assets/pause.svg";
                currentSongItem.querySelector(".play-now span").textContent = `${formatTime(Math.floor(currentsong.currentTime))} / ${formatTime(Math.floor(currentsong.duration || 0))}`;
            }
        }
        else{
            currentsong.pause()
            play.src = "assets/play.svg"
            if (currentSongItem) {
                currentSongItem.querySelector(".play-now img").src = "assets/play.svg";
                currentSongItem.querySelector(".play-now span").textContent = "Play Now";
            }
        }
    })
    previous.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        playMusic(songs[currentSongIndex], false, songItems[currentSongIndex]);
    });

    next.addEventListener("click", () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playMusic(songs[currentSongIndex], false, songItems[currentSongIndex]);
    });

    currentsong.addEventListener("ended", () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        playMusic(songs[currentSongIndex], false, songItems[currentSongIndex]);
    });

    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".song-time").innerHTML = `${formatTime(Math.floor(currentsong.currentTime))} / ${formatTime(Math.floor(currentsong.duration || 0))}`;
        if (currentSongItem) {
            currentSongItem.querySelector(".play-now span").textContent = `${formatTime(Math.floor(currentsong.currentTime))} / ${formatTime(Math.floor(currentsong.duration || 0))}`;
        }
        if (currentsong.duration) {
            document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
        }
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        const rect = e.target.getBoundingClientRect();
        const percent = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
        document.querySelector(".circle").style.left = (percent * 100) + "%";
        if (currentsong.duration) {
            currentsong.currentTime = currentsong.duration * percent;
        }
    });

    const openSidebar = () => {
        leftPanel.classList.add("open");
        if (sidebarOverlay) {
            sidebarOverlay.classList.add("show");
        }
    };

    const closeSidebar = () => {
        leftPanel.classList.remove("open");
        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("show");
        }
    };

    if (hamburgerBtn && leftPanel) {
        hamburgerBtn.addEventListener("click", () => {
            if (leftPanel.classList.contains("open")) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener("click", closeSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", closeSidebar);
    }

    if (rightPanel && leftPanel) {
        rightPanel.addEventListener("click", () => {
            if (window.innerWidth <= 800) {
                closeSidebar();
            }
        });
    }

    window.addEventListener("resize", () => {
        if (leftPanel && window.innerWidth > 800) {
            closeSidebar();
        }
    });
}

main().catch(console.error);
