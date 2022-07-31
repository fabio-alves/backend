import { AddUserModel } from '../../domain/useCase/addUser';
import { UserModel } from '../../domain/models/userModel';

export interface AddUserRepository {
  addUserRepository(UserData: AddUserModel): Promise<UserModel>
}
