import { HttpRequest, HttpResponse } from "./protocols/http";
import { MissingParamsError } from "../erros/missingParamsError";
import { badRequest, serverError, sucessRequest } from "../helpers/httpHelper";
import { Controller } from "./protocols/controller";
import { AddUser } from "../../domain/useCase/addUser";

export class SignupController implements Controller {
  private readonly addUser: AddUser;

  constructor(addUser: AddUser) {
    this.addUser = addUser;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ["name", "password"];
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
        return badRequest(new MissingParamsError(field));
        }
      }
      const { name, password } = httpRequest.body;

      const user = await this.addUser.addUser({
        name,
        password,
      });
      return sucessRequest(user);
    } catch (error) {
      return serverError();
    }
  }
}
