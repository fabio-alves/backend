import { UserModel } from '../../../domain/models/userModel';
import { AddUser, AddUserModel } from '../../../domain/useCase/addUser';
import { AddUserRepository } from '../../protocols/addUserRepository';
import { Encrypter } from '../../protocols/encrypter';

export class DbAddUser implements AddUser {
  private readonly encrypter: Encrypter;

  private readonly addUserRepository: AddUserRepository;

  constructor(encrypter: Encrypter, addUserRepository: AddUserRepository) {
    this.encrypter = encrypter;
    this.addUserRepository = addUserRepository;
  }

  async addUser(userData: AddUserModel): Promise<UserModel> {
    const encryptPassword = await this.encrypter.encrypter(userData.password);
    const user = await this.addUserRepository
      .addUserRepository(Object.assign({}, userData, {password: encryptPassword }));
    return user;
  }
}
