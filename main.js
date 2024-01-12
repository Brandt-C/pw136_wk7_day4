// work on getting our access token!

// btoa() and atob() -  base 64 encoding!

const getAuth = async () => {
    const clientID = "10b8aedb31d341c9ac6a23a7fc579c01";
    const clientSecret = "b409ea0d928d4fee8c6f7b7ae027c317";
    const response = await fetch('https://accounts.spotify.com/api/token',
    {
        method : 'POST',
        headers : {
            'Authorization': `Basic ${btoa(clientID + ":" + clientSecret)}`,
            'Content-Type' : 'application/x-www-form-urlencoded' 
        },
        body : 'grant_type=client_credentials'
    });
    const token = await response.json();
    console.log(token);
    return token.access_token
}
// getAuth()
//   Just did this 
const getSong = async (songname, artist, token) => {

    const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=track:${songname}+artist:${artist}`,{
        method: 'GET',
        headers: {
            "Content-Type": 'application/json',
            "Authorization": `Bearer ${token}`
            // f"{}"
        }
    });
    let data = await response.json();
    // console.log(data);
    console.log(data.tracks.items[0]);
    return data.tracks.items[0]

}
// Authorization: 'Bearer ' + accessToken


getSong('flowers','Mile')

let music = [
    {id:0, track: 'Flowers', artist: "Miley"},
    {id:1, track: 'Pardon Me', artist: 'Incubus' },
    {id:2, track: 'TNT', artist: 'AC-DC'},
    {id:3, track: 'Burden in my hand', artist: 'Soundgarden' },
    {id:4, track: 'Rats', artist: 'Pearl Jam' },
    {id:5, track: 'Black', artist: 'Sevendust'},
    {id:6, track: 'Bother', artist: 'Stone Sour'},
    {id:7, track: 'The ghost of tom joad', artist: 'Rage against the machine'},
    {id:8, track: 'Electric Worry', artist: 'Clutch'}
];

let playing;
let stopbtn = document.getElementById('stopbtn');
let headertitle = document.getElementById('headertitle');


const setupTrackList = async () => {
    const token = await getAuth();
    for (let i = 0; i < music.length; i++){


        let data = await getSong(music[i].track, music[i].artist, token);

        music[i]['preview_url'] = new Audio(data.preview_url);
        music[i].preview_url.volume = .5;
                music[i]['album_cover'] = data.album.images[0].url;

        let img = document.getElementById(`${i}`);
        img.src = music[i].album_cover;
        img.hidden = false;
    }
    console.log(music)
}
setupTrackList();


let clickEvent = (id) => {
    console.log(id);
    let track = music[id.slice(-1)];
    console.log(track);

    if (playing && !playing.preview_url.paused) {
        if (playing == track) {
            pauseTrack();
            return
        }
        else {
            playing.preview_url.pause();
            let playingbtn = document.getElementById(`playbtn${playing.id}`);
            playingbtn.innerHTML = 'Play';
        }
    }

    console.log(`PLAYING---> ${track.track} by ${track.artist}. . . `);
    track.preview_url.play();
    playing = track;
    let playingbtn = document.getElementById(`playbtn${playing.id}`);

    playingbtn.innerHTML = 'Pause';
    playingbtn.className = 'btn btn-dark';

    stopbtn.disabled = false
    stopbtn.innerHTML = 'Pause';
    headertitle.innerHTML = `${track.track} | ${track.artist}`;

}

let pauseTrack = () => {
    console.log('PAUSED. . . ');
    playing.preview_url.pause();

    let playingbtn = document.getElementById(`playbtn${playing.id}`)

    playingbtn.innerHTML = 'Play';
    playingbtn.className = 'btn btn-success'

    stopbtn.diabled = true;
    stopbtn.innerHTML = 'Nothing playing';

    headertitle.innerHTML = ' PADAWANS!!! | SpottyAPI';
}

let btnShow = (id) => {
    let btn = document.getElementById(`playbtn${id}`);
    btn.hidden = false;
}

