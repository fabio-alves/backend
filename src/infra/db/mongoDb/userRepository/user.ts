import { AddUserRepository } from '../../../../data/protocols/addUserRepository';
import { AddUserModel } from '../../../../domain/useCase/addUser';
import { UserModel } from '../../../../domain/models/userModel';
import { MongoHelper } from '../helpers/mongoHelper';

export class UserMongoRepository implements AddUserRepository {
  async addUserRepository(UserData: AddUserModel): Promise<UserModel> {
    const userCollection = MongoHelper.getCollection('users');
    const result = await userCollection.insertOne(UserData);
    const user = result.ops[0];
    return user;
  }
}
