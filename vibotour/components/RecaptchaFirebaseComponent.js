import * as React from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as FirebaseRecaptcha from "expo-firebase-recaptcha";
import * as firebase from "firebase";
import { FIREBASE_CONFIG } from "../config/FirebaseConfig";

export default function RecaptchaFirebaseComponent(props) {
  const recaptchaVerifier = React.useRef(null);
  const verificationCodeTextInput = React.useRef(null);
  const phoneNumber = props.phoneNumber;
  const [verificationId, setVerificationId] = React.useState("");
  const [verifyError, setVerifyError] = React.useState();
  const [verifyInProgress, setVerifyInProgress] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState("");
  const [confirmError, setConfirmError] = React.useState();
  const [confirmInProgress, setConfirmInProgress] = React.useState(false);
  const isConfigValid = !!FIREBASE_CONFIG.apiKey;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <FirebaseRecaptcha.FirebaseRecaptchaVerifierModal
          ref={recaptchaVerifier}
          firebaseConfig={FIREBASE_CONFIG}
        />
        <TextInput
          style={[styles.textInput, { display: "none" }]}
          autoFocus={isConfigValid}
          autoCompleteType="tel"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          placeholder="+1 999 999 9999"
          editable={!verificationId}
          value={phoneNumber}
        />
        <Button
          title={`${verificationId ? "Gửi lại" : "Gửi"} mã xác nhận`}
          disabled={!phoneNumber}
          onPress={async () => {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            try {
              setVerifyError(undefined);
              setVerifyInProgress(true);
              setVerificationId("");
              const verificationId = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                // @ts-ignore
                recaptchaVerifier.current
              );
              setVerifyInProgress(false);
              setVerificationId(verificationId);
              verificationCodeTextInput.current?.focus();
            } catch (err) {
              setVerifyError(err);
              setVerifyInProgress(false);
            }
          }}
        />
        {verifyError && (
          <Text style={styles.error}>{`Error: ${verifyError.message}`}</Text>
        )}
        {verifyInProgress && <ActivityIndicator style={styles.loader} />}
        {verificationId ? (
          <Text style={styles.success}>
            Kiểm tra tin nhắn của bạn để xác nhận số điện thoại
          </Text>
        ) : undefined}
        <Text style={styles.text}>Nhập mã xác nhận</Text>
        <TextInput
          ref={verificationCodeTextInput}
          style={styles.textInput}
          editable={!!verificationId}
          placeholder="123456"
          onChangeText={(verificationCode) =>
            setVerificationCode(verificationCode)
          }
        />
        <Button
          title="Xác nhận số điện thoại"
          disabled={!verificationCode}
          onPress={async () => {
            try {
              setConfirmError(undefined);
              setConfirmInProgress(true);
              const credential = firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                verificationCode
              );
              const authResult = await firebase
                .auth()
                .signInWithCredential(credential);
              setConfirmInProgress(false);
              setVerificationId("");
              setVerificationCode("");
              verificationCodeTextInput.current?.clear();
              Alert.alert("Xác nhận số điện thoại thành công!");
              props.setConfirmPhone(true);
            } catch (err) {
              setConfirmError(err);
              setConfirmInProgress(false);
            }
          }}
        />
        {confirmError && (
          <Text style={styles.error}>{`Lỗi: ${confirmError.message}`}</Text>
        )}
        {confirmInProgress && <ActivityIndicator style={styles.loader} />}
      </View>
      {!isConfigValid && (
        <View style={styles.overlay} pointerEvents="none">
          <Text style={styles.overlayText}>
            To get started, set a valid FIREBASE_CONFIG in App.tsx.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    marginTop: 0,
  },
  title: {
    marginBottom: 2,
    fontSize: 29,
    fontWeight: "bold",
  },
  subtitle: {
    marginBottom: 10,
    opacity: 0.35,
    fontWeight: "bold",
  },
  text: {
    marginTop: 30,
    marginBottom: 4,
  },
  textInput: {
    marginBottom: 8,
    fontSize: 17,
    fontWeight: "bold",
  },
  error: {
    marginTop: 10,
    fontWeight: "bold",
    color: "red",
  },
  success: {
    marginTop: 10,
    fontWeight: "bold",
    color: "blue",
  },
  loader: {
    marginTop: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFFC0",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    fontWeight: "bold",
  },
});
