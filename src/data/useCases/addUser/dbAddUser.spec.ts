import { Encrypter } from '../../protocols/encrypter';
import { DbAddUser } from './dbAddUser';

interface SutTypes {
  sut: DbAddUser,
  encrypterStub: Encrypter,
}

const makeSut = (): SutTypes => {
  class EncrypterStub {
    async encrypter(value: string): Promise<string> {
      return new Promise(resolve => resolve('hasehdPassword'));
    }
  }
  const encrypterStub = new EncrypterStub();
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
});
