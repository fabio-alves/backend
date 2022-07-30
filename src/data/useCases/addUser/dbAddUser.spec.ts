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
});
