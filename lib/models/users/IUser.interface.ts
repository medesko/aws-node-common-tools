import { Document } from 'mongoose';
import { UserState, Civility, Roles } from './User.enum';

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
  roles: string[];
  isConfirmed: boolean;
  lastConnections?: IlastConnections[];
  state: UserState;
}

export interface IRole {
  name: Roles;
  resource?: string;
}

export interface IlastConnections {
  connectAt: Date;
}

export interface IappScopedData {
  roles: IRole[];
  isConfirmed: boolean;
  lastConnections?: IlastConnections[];
  state: UserState;
}

export interface IUserModel extends IUser, Document {
  toJSONFor: (clientId: string) => IUserModel;
  toProfileJSONFor: (clientId: string, user?: IUser) => IProfile;
}
