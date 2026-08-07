import { defineStore } from "pinia";
import type { Show } from "~/schema";

export const usePlayerStore = defineStore("player", () => {
  const show = ref<Show | undefined>();
  const isPlaying = ref<boolean>(false);
  const currentSong = ref<{ title: string; artist: string } | null>(null);

  const play = (playState: boolean): void => {
    isPlaying.value = playState;
  };

  const playPause = (newShow?: Show): void => {
    const hasNewShow = newShow && (!show.value || show.value.id !== newShow.id);
    if (hasNewShow) show.value = newShow;
    play(hasNewShow ? true : !isPlaying.value);
  };

  const isThisPlaying = (id: string): boolean => {
    if (!show.value) return false;
    return isPlaying.value ? show.value.id == id : false;
  };

  const setCurrentSong = (song: { title: string; artist: string } | null) => {
    currentSong.value = song;
  };

  return {
    show,
    isPlaying,
    currentSong,
    play,
    playPause,
    isThisPlaying,
    setCurrentSong,
  };
});
