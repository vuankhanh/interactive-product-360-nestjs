import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Account } from "./account.schema";

@Schema({
  collection: 'user_token',
  timestamps: true
})
export class RefreshToken {
  @Prop({ required: true, unique: true, ref: Account.name })
  accountId: mongoose.Types.ObjectId;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true })
  expiresAt: Date;

  constructor(accountId: mongoose.Types.ObjectId, token: string, expiresAt: Date) {
    this.accountId = accountId;
    this.token = token;
    this.expiresAt = expiresAt;
  }
}

export const refreshTokenSchema = SchemaFactory.createForClass(RefreshToken);