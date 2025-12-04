import { Schema, model, Document } from 'mongoose';

export interface IInformUser extends Document {
    firstname: string;
    lastname: string;
    gender: string;
    username: string;
    email: string;
    password: string;
    phonenumber: number;
    admin: boolean;
}

const UserSchema = new Schema<IInformUser>(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },
        gender: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            minLength: 6,
            maxLength: 50,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            minLength: 10,
            maxLength: 50,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 10,
        },
        phonenumber: {
            type: Number,
            required: true,
            minLength: 10,
        },
        admin: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

const UserModel = model('User', UserSchema);
export default UserModel;
