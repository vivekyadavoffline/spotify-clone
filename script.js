console.log('java started');

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
            songs.push(`songs/${fileName}`);
        }
    }
    return songs;
}
   
async function main() {
    const songs = await getsongs();
    console.log(songs);
  
    if (!songs.length) {
        console.error('No songs found in songs/ directory.');
        return;
    }

    const audio = new Audio(songs[0]);
    await audio.play();
}

main().catch(console.error);
