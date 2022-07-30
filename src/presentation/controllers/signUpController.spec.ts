import { SignupController } from './signUpController';
import { MissingParamsError } from '../erros/missingParamsError';
import { AddUser, AddUserModel} from '../../domain/useCase/addUser';
import { UserModel } from '../../domain/models/userModel';
import { ServerError } from '../erros/serverError';

interface SutTypes {
  sut: SignupController,
  addUserStub: AddUser
}

const makeAddUser = (): AddUser => {
  class AddUserStub implements AddUser {
    async addUser(user: AddUserModel): Promise<UserModel> {
      const fakeUser = {
        id: 'validId',
        name: 'validName',
        password: 'validPassword',
      };
      return new Promise((resolve) => resolve(fakeUser));
    }
  }
  return new AddUserStub();
};

// factory
const makeSut = (): SutTypes => {
  const addUserStub = makeAddUser();
  // sut = system uder test
  const sut = new SignupController(addUserStub);
  return {
    sut,
    addUserStub,
  };
};

describe('signupController', () => {
  test('should return 400 if no name is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@live.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError('name'));
  });

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'anyName',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError('password'));
  });

  test('should call AddUser with correct values', async () => {
    const { sut, addUserStub } = makeSut();
    const addUserSpy = jest.spyOn(addUserStub, 'addUser');
    const httpRequest = {
      body: {
        name: 'anyName',
        password: 'anyPassword',
      },
    };
    await sut.handle(httpRequest);
    expect(addUserSpy).toHaveBeenCalledWith({
      name: 'anyName',
      password: 'anyPassword',
    });
  });

  test('should return 500 if AddUser throws', async () => {
    const { sut, addUserStub } = makeSut();
    jest.spyOn(addUserStub, 'addUser').mockImplementationOnce(() => {
     return new Promise((resolve, reject) => reject(new Error()))
    });
    const httpRequest = {
      body: {
        name: 'anyName',
        password: 'anyPassword',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('should return 200 if valid data provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'anyName',
        password: 'validPassword',
      },
    };
    const httpResponse = await sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 'validId',
      name: 'validName',
      password: 'validPassword',
    });
  });
});
