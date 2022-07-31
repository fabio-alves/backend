// eslint-disable-next-line max-classes-per-file
import { UserModel } from '../../../domain/models/userModel';
import { AddUserModel } from '../../../domain/useCase/addUser';
import { Encrypter } from '../../protocols/encrypter';
import { DbAddUser } from './dbAddUser';
import { AddUserRepository } from '../../protocols/addUserRepository';

interface SutTypes {
  sut: DbAddUser,
  encrypterStub: Encrypter,
  addUserRepositoryStub: AddUserRepository,
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypter(value: string): Promise<string> {
      return new Promise(resolve => resolve('hasehdPassword'));
    }
  }
  return new EncrypterStub();
};

const makeAddUserRepository = (): AddUserRepository => {
  class AddUserRepositoryStub implements AddUserRepository {
    async addUserRepository(userData: AddUserModel): Promise<UserModel> {
      const fakeUser = {
        id: 'validId',
        name: 'validName',
        password: 'hasehdPassword',
      };
      return new Promise(resolve => resolve(fakeUser));
    }
  }
  return new AddUserRepositoryStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const addUserRepositoryStub = makeAddUserRepository();
  const sut = new DbAddUser(encrypterStub, addUserRepositoryStub);
  return {
    sut,
    encrypterStub,
    addUserRepositoryStub,
  };
};

describe('DbAddUserUseCase', () => {
  test('should call encrypter with correct password', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypter');
    const userData = {
      name: 'validName',
      password: 'validPassword',
    };
    await sut.addUser(userData);
    expect(encryptSpy).toHaveBeenCalledWith('validPassword');
  });

  test('should throw encrypter error', async () => {
    const { sut, encrypterStub } = makeSut();
    jest.spyOn(encrypterStub, 'encrypter').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error)));
    const userData = {
      name: 'validName',
      password: 'validPassword',
    };
    const promiseUser = sut.addUser(userData);
    await expect(promiseUser).rejects.toThrow();
  });

  test('should call addUserRepository with correct values', async () => {
    const { sut, addUserRepositoryStub } = makeSut();
    const addUserRepositorySpy = jest.spyOn(addUserRepositoryStub, 'addUserRepository');
    const userData = {
      name: 'validName',
      password: 'validPassword',
    };
    await sut.addUser(userData);
    expect(addUserRepositorySpy).toHaveBeenCalledWith({
      name: 'validName',
      password: 'hasehdPassword',
    });
  });
});
