import express from 'express';
import { SignupController } from '../presentation/controllers/signUpController';
import { DbAddUser } from '../data/useCases/addUser/dbAddUser';
import { UserMongoRepository } from '../infra/db/mongoDb/userRepository/user';
import { BcryptAdapter } from '../infra/cripto/bcryptAdapter';
import  bodyParser  from 'body-parser'

const app = express();
app.use(bodyParser.json());
app.listen(3333, () => console.log('Server Up'));

app.post('/signup', async (req, res) => {
  try{
  const userMongoRepository = new UserMongoRepository();
  const bcryptAdapter = new BcryptAdapter(12);

  const dbAddUser = new DbAddUser(bcryptAdapter, userMongoRepository);
  const signUpController = new SignupController(dbAddUser);
  const result = await signUpController.handle(req);
  res.status(result.statusCode).send(result.body);
  } catch (err){
    console.log(err);
  }
});
