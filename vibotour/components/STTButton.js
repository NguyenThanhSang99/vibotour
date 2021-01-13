import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import { Audio } from "expo-av";
import axios from "axios";

const recordingOptions = {
  android: {
    extension: ".m4a",
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
  },
  ios: {
    extension: ".wav",
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
    sampleRate: 44100,
    numberOfChannels: 2,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#1e88e5",
    paddingVertical: 20,
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
    padding: 8,
    marginTop: 20,
  },
  text: {
    color: "#fff",
  },
});

export default class SpeechToTextButton extends Component {
  constructor(props) {
    super(props);
    this.recording = null;
    this.state = {
      isFetching: false,
      isRecording: false,
      transcript: "",
      timeStart: null,
      timeFinish: null,
    };
  }

  deleteRecordingFile = async () => {
    try {
      const info = await FileSystem.getInfoAsync(this.recording.getURI());
      await FileSystem.deleteAsync(info.uri);
    } catch (error) {
      console.log("There was an error deleting recorded file", error);
    }
  };

  getTranscription = async () => {
    this.setState({ isFetching: true });
    try {
      const time = this.state.timeFinish - this.state.timeStart;
      if (time <= 800) {
        this.setState({ transcript: "Chậm lại một chút bạn ơi!" });
      } else if (time > 15000) {
        this.setState({
          transcript:
            "Bạn có thể nâng account VIP để có thể nói nhiều hơn 15 giây!",
        });
      } else {
        const { uri } = await FileSystem.getInfoAsync(this.recording.getURI());

        const formData = new FormData();
        formData.append("file", {
          uri,
          type: Platform.OS === "ios" ? "audio/x-wav" : "audio/m4a",
          name:
            Platform.OS === "ios" ? `${Date.now()}.wav` : `${Date.now()}.m4a`,
        });

        const { data } = await axios.post(
          process.env.SPEECH_SERVER_URL,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        this.props.handleClick(data.transcript);
        this.setState({ transcript: data.transcript });
      }
    } catch (error) {
      console.log("There was an error reading file", error);
      this.state.transcript = "Xin lỗi bạn, lần này tôi nghe không được!!!";
      this.resetRecording();
    }
    this.setState({ isFetching: false });
  };

  startRecording = async () => {
    this.state.timeStart = new Date();
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.state.transcript = "";
    if (status !== "granted") return;

    this.setState({ isRecording: true });
    /*
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: true,
    })
    */

    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(recordingOptions);
      await recording.startAsync();
    } catch (error) {
      console.log(error);
      this.state.transcript = "Gặp lỗi rồi, thử lại bạn nhé!!!";
    }
    this.recording = recording;
  };

  stopRecording = async () => {
    this.setState({ isRecording: false });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      this.state.transcript = "Gặp lỗi rồi, thử lại bạn nhé!!!";
      console.log(error);
    }
  };

  resetRecording = () => {
    this.deleteRecordingFile();
    this.recording = null;
  };

  handleOnPressOut = () => {
    this.state.timeFinish = new Date();
    setTimeout(() => {
      this.stopRecording();
      this.getTranscription();
    }, 500);
  };

  render() {
    const { isRecording, transcript, isFetching } = this.state;
    return (
      <View style={styles.container}>
        <View>
          <TouchableOpacity
            style={styles.button}
            onPressIn={
              this.state.isRecording === true
                ? this.handleOnPressOut
                : this.startRecording
            }
            onPressOut={
              this.state.isRecording === true ? this.handleOnPressOut : null
            }
          >
            {isFetching && <ActivityIndicator color="#ffffff" />}
            {!isFetching && (
              <Text style={styles.text}>
                {isRecording ? "Đang ghi..." : "Giữ để nói"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <Text>{`${transcript}`}</Text>
      </View>
    );
  }
}
