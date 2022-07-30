import { Encrypter } from '../../protocols/encrypter';
import { DbAddUser } from './dbAddUser';

interface SutTypes {
  sut: DbAddUser,
  encrypterStub: Encrypter,
}

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypter(value: string): Promise<string> {
      return new Promise(resolve => resolve('hasehdPassword'));
    }
  }
  return new EncrypterStub();
};

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter();
  const sut = new DbAddUser(encrypterStub);
  return {
    sut,
    encrypterStub,
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
});
