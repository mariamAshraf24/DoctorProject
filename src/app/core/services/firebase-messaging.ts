import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { initializeApp } from 'firebase/app';
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from 'firebase/messaging';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FirebaseMessaging {
  private messaging: Messaging;

  constructor(private http: HttpClient) {
    const app = initializeApp(environment.firebase);
    this.messaging = getMessaging(app);
  }

  async requestPermissionAndGetToken(): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('📛 لم يتم منح الإذن بالإشعارات');
        return null;
      }

      const token = await getToken(this.messaging, {
        vapidKey:
          'BPpmjXX-HyVXu5ett5T_JpXrWR4WhwE9MLx6913LCWDyXusC8jOS6T48GKCrSWp2C4Tou0kx4RRIjGf3cU8ab1M',
      });

      return token;
    } catch (error) {
      console.error('❌ خطأ في الحصول على FCM Token:', error);
      return null;
    }
  }

  sendTokenToBackend(token: string, authToken: string) {
    console.log('Token before sending to backend:', localStorage.getItem('token'));
    return this.http.post(
      `${environment.apiBaseUrl}/Notifications`,
      { deviceToken: token },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  }

  listenForMessages() {
    onMessage(this.messaging, (payload) => {
      console.log('📩 تم استقبال رسالة:', payload);
      // يمكنك عرض إشعار أو تحديث UI هنا
    });
  }
}
