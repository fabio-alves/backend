import { UserModel } from '../../../domain/models/userModel';
import { AddUser, AddUserModel } from '../../../domain/useCase/addUser';
import { Encrypter } from '../../protocols/encrypter';

export class DbAddUser implements AddUser {
  private readonly encrypter: Encrypter;

  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }

  async addUser(user: AddUserModel): Promise<UserModel> {
    await this.encrypter.encrypter(user.password);
    return new Promise(resolve => resolve(null));
  }
}
