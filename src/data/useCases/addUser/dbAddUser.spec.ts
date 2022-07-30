import { DbAddUser } from './dbAddUser';

describe('DbAddUserUseCase', () => {
  test('should call encrypter with correct password', async () => {
    class EncrypterStub {
      async encrypter(value: string): Promise<string> {
        return new Promise(resolve => resolve('hasehdPassword'));
      }
    }
    const encrypterStub = new EncrypterStub();
    const sut = new DbAddUser(encrypterStub);
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypter');
    const userData = {
      name: 'validName',
      password: 'validPassword',
    };
    await sut.addUser(userData);
    expect(encryptSpy).toHaveBeenCalledWith('validPassword');
  });
});
