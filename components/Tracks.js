import Track from "./Track";

export default function Tracks({tracks}){
    return (
        tracks.map((track, index) => <Track ranking={index + 1} key={track.songurl} {...track} />)
    )
}