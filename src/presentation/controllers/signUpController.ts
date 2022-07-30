import { HttpRequest, HttpResponse } from "./protocols/http";
import { MissingParamsError } from "../erros/missingParamsError";
import { badRequest, serverError } from "../helpers/httpHelper";
import { Controller } from "./protocols/controller";
import { AddUser } from "../../domain/useCase/addUser";

export class SignupController implements Controller {
  private readonly addUser: AddUser;

  constructor(addUser: AddUser) {
    this.addUser = addUser;
  }

  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = ["name", "password"];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
        return badRequest(new MissingParamsError(field));
        }
      }
      const { name, password } = httpRequest.body;

      const user = this.addUser.addUser({
        name,
        password,
      });
      return {
        statusCode: 200,
        body: user,
      };
    } catch (error) {
      return serverError();
    }
  }
}
