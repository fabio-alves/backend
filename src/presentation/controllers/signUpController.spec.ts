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
    addUser(user: AddUserModel): UserModel {
      const fakeUser = {
        id: 'validId',
        name: 'validName',
        email: 'validEmail@live.com',
        password: 'validPassword',
      };
      return fakeUser;
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
  test('should return 400 if no name is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email@live.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError('name'));
  });

  test('should return 400 if no password is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'anyName',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamsError('password'));
  });

  test('should call AddUser with correct values', () => {
    const { sut, addUserStub } = makeSut();
    const addUserSpy = jest.spyOn(addUserStub, 'addUser');
    const httpRequest = {
      body: {
        name: 'anyName',
        password: 'anyPassword',
      },
    };
    sut.handle(httpRequest);
    expect(addUserSpy).toHaveBeenCalledWith({
      name: 'anyName',
      password: 'anyPassword',
    });
  });

  test('should return 500 if AddUser throws', () => {
    const { sut, addUserStub } = makeSut();
    jest.spyOn(addUserStub, 'addUser').mockImplementationOnce(() => {
      throw new Error();
    });
    const httpRequest = {
      body: {
        name: 'anyName',
        password: 'anyPassword',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });
});
