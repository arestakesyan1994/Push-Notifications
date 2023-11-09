import { useEffect, useRef, useState } from "react";
import * as Device from 'expo-device';
import * as Notifitcations from 'expo-notifications';
import Constants from "expo-constants";
import { Platform } from "react-native";

export interface PushNotificationState {
    expoPushToken?: Notifitcations.ExpoPushToken,
    notification?: Notifitcations.Notification
}

export const usePushNotifications = (): PushNotificationState => {
    Notifitcations.setNotificationHandler({
        handleNotification: async () => ({
            shouldPlaySound: false,
            shouldShowAlert: true,
            shouldSetBadge: false
        })
    })
    const [expoPushToken, setEpoPushToken] = useState<Notifitcations.ExpoPushToken | undefined>()
    const [notification, setNotification] = useState<Notifitcations.Notification | undefined>()

    const notificationListener = useRef<Notifitcations.Subscription>()
    const responseListener = useRef<Notifitcations.Subscription>()

    async function registerForPushNotificationsAsync() {
        let token;
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifitcations.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== "granted") {
                const { status } = await Notifitcations.requestPermissionsAsync();
                finalStatus = status;
            }
            if (finalStatus !== 'granted') {
                alert("failed to get push token for push notification")
                return;
            }
            token = await Notifitcations.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas.projectId
            })
        }else{
            alert("Must be using a physical device for push notifications")
        }

        if(Platform.OS == "android"){
            Notifitcations.setNotificationChannelAsync("default", {
                name:"default",
                importance:Notifitcations.AndroidImportance.MAX,
                vibrationPattern:[0,250,250,250],
                lightColor:"#ff231f7c"
            })
        }
        return token;
    }
    useEffect(()=>{
        registerForPushNotificationsAsync()
        .then((token)=>{
            setEpoPushToken(token)
        })
        notificationListener.current = Notifitcations.addNotificationReceivedListener((notification)=>{
            setNotification(notification)
        })

        responseListener.current = Notifitcations.addNotificationResponseReceivedListener((response)=>{
            console.log(response);
        })

        return ()=>{
            Notifitcations.removeNotificationSubscription(
                notificationListener.current!
            )
            Notifitcations.removeNotificationSubscription(responseListener.current!)
        }
    }, [])
    return {
        expoPushToken,
        notification
    }

}