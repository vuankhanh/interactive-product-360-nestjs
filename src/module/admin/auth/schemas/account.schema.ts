import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
const roleEnums = ['user', 'admin'];

export type AccountDocument = HydratedDocument<Account>;

@Schema({
  collection: 'account',
  timestamps: true
})
export class Account {
  @Prop({
    unique: [true, 'Username must be unique'],
    required: [true, 'Username is required']
  })
  username: string;

  @Prop({
    required: [true, 'Password is required']
  })
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ unique: [true, 'Email must be unique'] })
  email: string;

  @Prop({
    enum: roleEnums, default: roleEnums[0],
    required: [true, 'Role is required']
  })
  role: string;

  constructor(
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    role: 'user' | 'admin',
    email: string
  ) {
    this.username = username;
    this.password = password;
    this.firstName = firstName;
    this.lastName = lastName;
    this.role = role;
    this.email = email;
  }
}

export const accountSchema = SchemaFactory.createForClass(Account);