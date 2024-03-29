// pushNotificationService.ts
import { PushNotifications } from '@capacitor/push-notifications';
import { Capacitor } from '@capacitor/core';

const initializePushNotifications = async () => {
  // Check if push notifications are supported on the device
  if (Capacitor.isPluginAvailable('PushNotifications')) {
    // Request permission to use push notifications
    const permission = await PushNotifications.requestPermissions();

    if (permission.receive === 'granted') {
      // Register with the push notification service
      await PushNotifications.register();

      // Listener for when the registration succeeds
      PushNotifications.addListener('registration', 
        (token) => {
          console.log(`Push registration success, token: ${token.value}`);
          // Here is a good place to ensure the token gets logged.
          alert(`Token received: ${token.value}`);
          // You could also send the token to your backend here.
        }
      );

      // Listener for registration errors
      PushNotifications.addListener('registrationError', 
        (error) => {
          console.error(`Error on push notification registration: ${JSON.stringify(error)}`);
        }
      );

      // Listener for when a push notification is received
      PushNotifications.addListener('pushNotificationReceived', 
        (notification) => {
          console.log(`Push notification received: ${JSON.stringify(notification)}`);
          // Handle the received notification
        }
      );

      // Listener for when a push notification is performed (the user taps on it)
      PushNotifications.addListener('pushNotificationActionPerformed', 
        (notification) => {
          console.log(`Push notification action performed: ${JSON.stringify(notification)}`);
          // Handle the notification action
        }
      );
    } else {
      console.error('Push notifications permission was denied');
    }
  } else {
    console.error('Push Notifications plugin is not available on this device');
  }
};

export default initializePushNotifications;
