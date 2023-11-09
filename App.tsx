import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { usePushNotifications } from "./usePushNotifications";

export default function App() {
  const {expoPushToken} = usePushNotifications();
  console.log(expoPushToken);
  

  const samples = [200, 300, 400, 500, 400, 350, 400, 500, 600, 450, 300, 500];

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <Text style = {styles.text}>Push Notifications</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  text:{
    color:"#FFF"
  }
});
