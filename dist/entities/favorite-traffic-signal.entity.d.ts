import { User } from './user.entity.js';
export declare class FavoriteTrafficSignal {
    id: string;
    userId: string;
    user: User;
    signalId: string;
    signalName: string;
    signalType: string;
    signalImageUrl: string | null;
    createdAt: Date;
}
