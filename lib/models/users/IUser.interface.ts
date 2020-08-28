import { Document } from 'mongoose';
import { UserState } from './User.enum';

export interface IUser {
  uuid: string;
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  appScopedData: { [key: string]: IappScopedData };
}

export interface IappScopedData {
  roles?: Array<{ name: string }>;
  isConfirmed: boolean;
  connections?: Date[];
  state?: UserState;
}

export interface IUserModel extends IUser, Document {
  toJSONFor: (clientId: string) => IUserModel;
}
