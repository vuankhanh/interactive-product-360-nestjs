import { Injectable } from "@nestjs/common";
import mongoose, { HydratedDocument } from "mongoose";

@Injectable()
export class SortUtil {
  static sortDocumentArrayByIndex<T>(array: Array<HydratedDocument<T>>, orderArr: Array<string | mongoose.Types.ObjectId>) {
    return orderArr.map((order) => {
      const index = array.findIndex(item => item._id.toString() === order.toString());
      return array[index];
    });
  }
}