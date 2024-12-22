import { FilterQuery, FlattenMaps, HydratedDocument } from "mongoose";
import { IPaging } from "./paging.interface";

//T is the DTO, M is the Model
export interface IBasicService<T> {
  create(data: T): Promise<HydratedDocument<T>>;
  getAll(filterQuery: FilterQuery<T>, page: number, size: number): Promise<{data: FlattenMaps<T>[], paging: IPaging}>;
  getDetail(filterQuery: FilterQuery<T>): Promise<HydratedDocument<T>>;
  replace(filterQuery: FilterQuery<T>, data: T): Promise<HydratedDocument<T>>;
  modify(filterQuery: FilterQuery<T>, data: Partial<T>): Promise<HydratedDocument<T>>;
  remove(filterQuery: FilterQuery<T>): Promise<HydratedDocument<T>>;
}