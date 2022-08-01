import { AddUserRepository } from '../../../../data/protocols/addUserRepository';
import { AddUserModel } from '../../../../domain/useCase/addUser';
import { UserModel } from '../../../../domain/models/userModel';
import { MongoHelper } from '../helpers/mongoHelper';

export class UserMongoRepository implements AddUserRepository {
  async addUserRepository(UserData: AddUserModel): Promise<UserModel> {
    await MongoHelper.connect(process.env.MONGO_CONNECTION);
    const userCollection = MongoHelper.getCollection('users');
    const result = await userCollection.insertOne(UserData);
    return {
      id: result.insertedId.toString(),
      name: UserData.name,
      password: UserData.password,
    };
  }
}
