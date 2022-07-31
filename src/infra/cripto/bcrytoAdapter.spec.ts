import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcryptAdapter';

describe('bcryptAdapter', () => {
  test('should call bcrypt withh correct value', async () => {
    const salt = 12;
    const sut = new BcryptAdapter(salt);
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypter('anyValue');
    expect(hashSpy).toHaveBeenCalledWith('anyValue', salt);
  });
});
