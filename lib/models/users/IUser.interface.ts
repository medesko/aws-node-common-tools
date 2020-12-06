import { Document } from 'mongoose';
import { UserState, Civility } from './User.enum';

export interface IUser {
  uuid: string;
  userId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  jobTitle: string;
  civility?: Civility;
  avatar: string;
  appScopedData: { [key: string]: IappScopedData };
}

export interface IProfile {
  userId: string;
  displayName: string;
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
