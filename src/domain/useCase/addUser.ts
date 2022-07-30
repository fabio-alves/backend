import { UserModel } from '../models/userModel';

export interface AddUserModel {
  name: string,
  password: string
}
export interface AddUser {
  addUser(user: AddUserModel): Promise<UserModel>
}
