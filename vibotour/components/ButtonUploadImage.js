import React from "react";
import { Button, Image, StyleSheet, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import * as firebase from "firebase";

console.disableYellowBox = true;

export default class ButtonUploadImage extends React.Component {
  state = {
    image: this.props.image,
    uploading: false,
    email: this.props.email,
  };

  async componentDidMount() {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.image !== this.props.image) {
      this.setState({ email: this.props.email, image: this.props.image });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageBox}>
          <View style={styles.imageArea}>
            <Image source={{ uri: this.state.image }} style={styles.image} />
          </View>
          <View style={styles.btnContainer}>
            <View style={styles.button}>
              <Button onPress={this._pickImage} title="Chọn ảnh" />
            </View>
            <View style={styles.button}>
              <Button onPress={this._takePhoto} title="Chụp ảnh" />
            </View>
          </View>
        </View>
      </View>
    );
  }

  _takePhoto = async () => {
    let pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    this._handleImagePicked(pickerResult);
  };

  _pickImage = async () => {
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 4],
    });

    this._handleImagePicked(pickerResult);
  };

  _handleImagePicked = async (pickerResult) => {
    try {
      this.setState({ uploading: true });

      if (!pickerResult.cancelled) {
        let uploadUrl = await uploadImageAsync(
          pickerResult.uri,
          this.state.email
        );
        this.setState({ image: uploadUrl });
        this.props.setImage(uploadUrl);
      }
    } catch (e) {
      console.log(e);
      alert("Tải ảnh thất bại. Vui lòng thử lại sau!!!");
    } finally {
      this.setState({ uploading: false });
    }
  };
}

async function uploadImageAsync(uri, fileName) {
  // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child("user-image/" + fileName);
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();

  return await snapshot.ref.getDownloadURL();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBox: {
    marginTop: 20,
    width: 250,
    borderRadius: 3,
    elevation: 2,
  },
  imageArea: {
    borderTopRightRadius: 3,
    borderTopLeftRadius: 3,
    backgroundColor: "#bdc3c7",
  },
  image: { width: 250, height: 250 },
  btnContainer: {
    flexDirection: "row",
  },
  button: {
    borderColor: "#ccc",
    borderStyle: "solid",
    borderWidth: 1,
    width: "50%",
    height: 37,
  },
});
