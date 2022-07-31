import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcryptAdapter';

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise(resolve => resolve('hash'))
  },
}));

const SALT = 12;
const makeSut = (): BcryptAdapter => {
  const result = new BcryptAdapter(SALT);
  return result;
};

describe('bcryptAdapter', () => {
  test('should call bcrypt withh correct value', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    await sut.encrypter('anyValue');
    expect(hashSpy).toHaveBeenCalledWith('anyValue', SALT);
  });

  test('should return a hash on sucess', async () => {
    const sut = makeSut();
    const resutlHash = await sut.encrypter('anyValue');
    expect(resutlHash).toBe('hash');
  });

  test('should throw if bcrypt error', async () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash') as unknown as jest.Mock<
    ReturnType<(key: Error) => Promise<Error>>,
    Parameters<(key: Error) => Promise<Error>>
    >;
    hashSpy.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))

    const resultPromise = sut.encrypter('anyValue');
    await expect(resultPromise).rejects.toThrow();
  });
});
