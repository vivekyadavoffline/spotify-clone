console.log('java started');
 let currentsong = new Audio();
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
const playMusic = (track) => {
    currentsong.pause();
    currentsong.currentTime = 0;
    currentsong.src = "songs/" + track.trim();
    currentsong.play();
}
async function main() {
   
    const songs = await getsongs();
    console.log(songs);

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

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        });
    });
}

main().catch(console.error);
