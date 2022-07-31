import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcryptAdapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  },
}));

describe('bcryptAdapter', () => {
  test('should call bcrypt withh correct value', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypter('anyValue');
    expect(hashSpy).toHaveBeenCalledWith('anyValue', salt);
  });

  test('should return a hash on sucess', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const resutlHash = await sut.encrypter('anyValue');
    expect(resutlHash).toBe('hash');
  });
});
