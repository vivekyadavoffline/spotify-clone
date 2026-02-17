
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".song-time").innerHTML = `${formatTime(Math.floor(currentsong.currentTime))} / ${formatTime(Math.floor(currentsong.duration || 0))}`;
        document.querySelector("circle").style.left = (currentsong.currentTime/currentsong)* 100 + "%";
    });
}

main().catch(console.error);