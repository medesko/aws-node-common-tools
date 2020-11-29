import { Schema, Model, model } from 'mongoose';
import { IUserModel } from './IUser.interface';
import { UserState, AllUserStates } from './User.enum';

export const AppScopedDataSchema = new Schema(
  {
    roles: [],
    connections: {
      type: [Date],
      default: [],
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
UserSchema.methods.toProfileJSONFor = function (user: IUserModel) {
  return {
    userId: this.userId,
    displayName: `${user.firstName} ${user.lastName}`,
    jobTitle: this.jobTitle,
    avatar: this.avatar || 'https://static.productionready.io/images/smiley-cyrus.jpg',
  };
};
export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
