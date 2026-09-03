<template>
  <div class="live-stream-wrapper">
    <div class="stream-main-content">
      <div class="artwork">
        <img
          :src="currentArtwork"
          class="image-fit"
          alt="Live Stream Artwork"
        />
      </div>
      <div class="infoContainer">
        <div class="playerContainer">
          <div class="player">
            <div class="playContainer">
              <button class="play" @click="playPause(liveShow)">
                <PlayIcon v-if="!isThisPlaying(liveShow.id)" :size="60"></PlayIcon>
                <PauseIcon v-else :size="60"></PauseIcon>
              </button>
            </div>
            <div class="info">
                <div class="on-air">
                    ON AIR
                    <span class="blink">
                        <div class="dot" />
                    </span>
                </div>
                <h1 class="live-title">
                    {{ nowPlaying?.now_playing?.song?.title || 'Loading Stream...' }}
                    -
                    {{ nowPlaying?.now_playing?.song?.artist || 'Loskop Radio' }}
                </h1>
            </div>
          </div>
        </div>
        <div class="recent-tracks" v-if="nowPlaying?.song_history?.length">
          <h3>history</h3>
          <ul class="history">
            <li v-for="(track, index) in nowPlaying.song_history.slice(0, 5)" :key="index">
                <span class="title">{{ track.song.title }}</span>
                -
                <span v-if="track.song.artist"> {{ track.song.artist}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
 import { ref, computed, onMounted, onBeforeUnmount } from "vue";
 import PauseIcon from "vue-material-design-icons/Pause.vue";
 import PlayIcon from "vue-material-design-icons/Play.vue";
 import type { Show } from "~/schema";
 import { usePlayerStore } from "~/store";

 const STREAM_URL = "https://loazuracast.stinpriza.eu/listen/loskop/radio.mp3"; 
 const DEFAULT_IMAGE = "/loskop_face.jpg"; // Fallback image
 const { playPause, isThisPlaying, setCurrentSong } = usePlayerStore();

 const nowPlaying = ref<any>(null);
 let pollingInterval: ReturnType<typeof setInterval> | null = null;

 // Construct a pseudo-Show object so it plays nicely with your existing usePlayerStore
 const liveShow = computed(() => {
     return {
         id: "live-stream",
         title: "Live Broadcast",
         live: true,
         link: STREAM_URL, 
         description: "Live stream from Loskop Radio",
         date: new Date().toISOString(),
         producers: [],
         audio: null, 
         artwork: {
             id: "", 
         },
     } as unknown as Show;
 });

 const currentArtwork = computed(() => {
     return nowPlaying.value?.now_playing?.song?.art || DEFAULT_IMAGE;
 });

 const fetchNowPlaying = async () => {
     try {
         const response = await fetch('/api/nowplaying');
         if (response.ok) {
             nowPlaying.value = await response.json();
             
             // Push song info directly into the global store
             const activeSong = nowPlaying.value?.now_playing?.song;
             if (activeSong) {
                 setCurrentSong({
                     title: activeSong.title,
                     artist: activeSong.artist,
                 });
             }
         }
     } catch (error) {
         console.error("Failed to fetch from internal API:", error);
     }
 };

 onMounted(() => {
     fetchNowPlaying();
     // Poll every 15 seconds to keep "Recently Played" and "Now Playing" updated
     pollingInterval = setInterval(fetchNowPlaying, 15000);
 });

 onBeforeUnmount(() => {
     if (pollingInterval) clearInterval(pollingInterval);
 });
</script>

<style scoped>
 .live-stream-wrapper {
     width: 100%;
     margin-bottom: calc(2 * var(--standard-spacing));
 }

 .stream-main-content {
     width: 100%;
     overflow: hidden; /* Contains the floated artwork properly */
 }

 .artwork {
     aspect-ratio: 1/1;
     overflow: hidden;
     width: 50%;
     float: left;
     border: var(--border-width) solid var(--text-color);
     margin-right: calc(2 * var(--standard-spacing));
     margin-bottom: calc(2 * var(--standard-spacing));
 }

 .image-fit {
     width: 100%;
     height: 100%;
     object-fit: cover;
 }

 .playerContainer {
     display: flex;
     margin-bottom: calc(var(--standard-spacing) * 3);
 }

 .player {
     width: 100%;
     display: flex;
     align-items: flex-start;
 }

 .play {
     display: flex;
     justify-content: center;
     align-items: center;
     width: 100%;
     height: 100%;
     background-color: var(--main-color);
     border: none;
     cursor: pointer;
 }

 .playContainer {
     aspect-ratio: 1/1;
     width: 70px;
     border: var(--border-width) solid var(--text-color);
     margin-right: var(--standard-spacing);
 }

 .info {
     display: flex;
     justify-content: space-between;
     flex-direction: column;
     flex: 1;
     width: 50%;
     margin: 0 calc(4 * var(--standard-spacing));
 }

 .info .on-air {
     font-size: 1.4em;
     font-weigh: 800;
 }

 .info h1 {
     font-size: 1.2rem;
     font-weight: 600;
     letter-spacing: 0;
     text-wrap: auto;
     text-wrap-style: pretty;
     line-height: 1.5;
 }

 .producers {
     font-size: 1rem;
     font-weight: 300;
     letter-spacing: 0.05em;
 }

 .recent-tracks {
     width: 100%;
     margin-top: calc(8 * var(--standard-spacing));
     padding-top: var(--standard-spacing);
 }

 .recent-tracks h3 {
     font-size: 1.2rem;
     margin-bottom: 1rem;
 }

 .history {
     list-style-type: disc;
     list-style-position: inside;
     padding: 0;
     margin: 0;
 }

 .recent-tracks li {
     font-size: 0.9rem;
     margin-bottom: 1rem;
     letter-spacing: 0.04em;
 }

 .artist {
     font-weight: bold;
 }

 @keyframes blink {
     0%,
     100% {
         opacity: 0;
     }

     50% {
         opacity: 1;
     }
 }

 .blink {
     animation: blink 2s linear infinite both;
 }

 .dot {
     display: inline-block;
     width: 0.7em;
     height: 0.7em;
     background-color: red;
     border-radius: 50%;
     margin: auto;
 }

 @media screen and (max-width: 650px) {
     .stream-main-content {
         display: flex;
         flex-direction: column;
         align-items: center;
     }

     .artwork {
         width: 100%;
         margin-right: 0;
         margin-bottom: var(--standard-spacing);
     }

     .infoContainer {
         width: 100%;
     }

     .playerContainer {
         margin-top: var(--standard-spacing);
         margin-bottom: var(--standard-spacing);
     }
 }
</style>
