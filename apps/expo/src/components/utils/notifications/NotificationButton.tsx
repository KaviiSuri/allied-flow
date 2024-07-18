import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import NotificationList from "./NotificationList";
import type { NotificationProps } from "./Notification";

function NotificationButton(props: { data: NotificationProps[] }) {
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  return (
    <View style={{position: 'relative', width: 20, height: 20}}>
      <Pressable onPress={() => setNotificationsVisible(!notificationsVisible)}>
        <Image source={require('../../../app/assets/images/notification-button.png')} />
      </Pressable>
        <View style={{position: 'absolute', top: 28, width: 400, right: 0, display: notificationsVisible ? 'flex' : 'none', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', overflow: 'scroll', height: 376}}>
            <Text style={{fontFamily: 'Avenir', padding: 16, fontWeight: "800", backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E2E8F0'}}>Notifications</Text>
            <NotificationList data={props.data} />
        </View>
    </View>
  );
}

export default NotificationButton;