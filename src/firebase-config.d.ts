import { Analytics } from 'firebase/analytics';
import { Messaging, MessagePayload } from 'firebase/messaging';

export const analytics: Analytics;
export const messaging: Messaging;
export function getFCMToken(): Promise<string | null>;
export function onMessage(messaging: Messaging, nextOrObserver: (payload: MessagePayload) => void): () => void;
