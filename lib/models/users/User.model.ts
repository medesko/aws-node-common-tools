import { Schema, Model, model } from 'mongoose';
import { IUserModel } from './IUser.interface';
import { UserState, AllUserStates, AllUserRoles, Civility } from './User.enum';

const ConnectionSchema = new Schema(
  {
    connectAt: Date,
  },
  {
    versionKey: false,
    _id: false,
  },
);

const RoleSchema = new Schema(
  {
    name: String,
  },
  {
    versionKey: false,
    _id: false,
  },
);

export const AppScopedDataSchema = new Schema(
  {
    roles: [RoleSchema],
    connections: {
      type: [ConnectionSchema],
    },
    state: {
      type: String,
      enum: AllUserStates,
      default: UserState.ACTIVATING,
    },
  },
  {
    versionKey: false,
    _id: false,
  },
);

export const UserSchema = new Schema(
  {
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    firstName: String,
    lastName: String,
    civility: {
      type: Number,
      enum: [Civility.MR, Civility.MS, Civility.NOT_SPECIFIED],
      default: Civility.NOT_SPECIFIED,
    },
    jobTitle: String,
    avatar: String,
    appScopedData: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

UserSchema.methods.toJSONFor = function (clientId: string) {
  return {
    uuid: this.uuid,
    userId: this.userId,
    email: this.email,
    firstName: this.firstName,
    lastName: this.lastName,
    jobTitle: this.jobTitle,
    appScopedData: this.appScopedData[clientId],
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};
UserSchema.methods.toProfileJSONFor = function (clientId: string, user: IUserModel) {
  return {
    userId: this.userId,
    displayName: `${this.firstName} ${this.lastName}`,
    jobTitle: this.jobTitle,
    roles: this.appScopedData[clientId]?.roles.map(r => r.name),
    isConfirmed: this.appScopedData[clientId]?.isConfirmed,
    state: this.appScopedData[clientId]?.state,
    lastConnections: this.appScopedData[clientId]?.lastConnections,
    avatar: this.avatar || 'https://static.productionready.io/images/smiley-cyrus.jpg',
  };
};
export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
