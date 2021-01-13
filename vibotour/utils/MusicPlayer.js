import { Audio } from "expo-av";

export default class MusicPlayer {

    constructor(list, initialState = { speed: 1, autoPlay: true }) {
        // Create new object from Expo.Audio.Sound
        this.soundObject = new Audio.Sound();

        // Set speed value
        this.speed = initialState.speed;

        this.list = list;
    }

    /**
     * Get current item name.
     * @return {string} Current item name.
     */
    getCurrentItemName = () => {
        return this.list[this.index].name;
    };

    /**
     * Start or stop audio.
     * @param {number} index - Index of playing item.
     * @param {boolean} playing - Is audio playing now or no.
     * @return {Promise}
     */
    startPlay = async () => {
        
        let index = Math.floor(Math.random() * 6);
        let path = this.list[index].path;
        // Checking if now playing music, if yes stop that
        // Checking if item already loaded, if yes just play, else load music before play
        await this.soundObject.loadAsync({ uri: path },
            { shouldPlay: true });
        await this.soundObject.playAsync();
        
    };

    stopMusic = async () => {
        await this.soundObject.unloadAsync();
    }
    /**
     * Set speed of playing music.
     * @param {number} speed - Speed of now playing music.
     */
    setSpeed = (speed) => {
        this.soundObject.setRateAsync(speed);
    };
}