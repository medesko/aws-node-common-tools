import { Document } from 'mongoose';
import { UserState } from './User.enum';

export interface IUser {
  uuid: string;
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  jobTitle: string;
  avatar: string;
  appScopedData: { [key: string]: IappScopedData };
}

export interface IProfile {
  username: string;
  email: string;
  jobTitle: string;
  avatar: string;
}

export interface IappScopedData {
  roles?: Array<{ name: string }>;
  isConfirmed: boolean;
  connections?: Date[];
  state?: UserState;
}

export interface IUserModel extends IUser, Document {
  toJSONFor: (clientId: string) => IUserModel;
  toProfileJSONFor: (user?: IUser) => IProfile;
}
