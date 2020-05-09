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
	}
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
			required: true,
			unique: true,
		},
		firstName: {
			type: String,
		},
		lastName: {
			type: String,
		},
		appScopedData: {
			type: Schema.Types.Mixed,
			default: {}
		},
	},
	{ timestamps: true }
);

UserSchema.methods.toJSONFor = function (clientId: string) {
	return {
		uuid: this.uuid,
		userId: this.userId,
		email: this.email,
		firstName: this.firstName,
		lastName: this.lastName,
		appScopedData: this.appScopedData[clientId],
		createdAt: this.createdAt,
		updatedAt: this.updatedAt,
	};
};

export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
