import { AppError } from "../errors/AppError.js";
import { MIN_PASSWORD_LENGTH , passwordSaltRounds} from '../constants/constants.js'
import { createUser, findUserByEmail, findUserByEmailWithPassword } from "../repositories/user.repository.js";
import bcrypt from "bcryptjs";
import { signAccessToken } from "../lib/jwt.js";

export async function registerUser(
  email:string,
  password: string
): Promise<void>{
  if(!email || !password){
    throw new AppError(400, "Email and password are required");
  }

  // create one more folder called constants and keep this 6
  // in constant and use it here

  if(password.length < MIN_PASSWORD_LENGTH){
    throw new AppError(400, "Password must be at least 6 characters long");
  }

  const normalizeEmail = email.toLowerCase().trim()

  // find the user if its already present in db or not 
  // if present will not allow to register again with same email
  
  const existingUser = await findUserByEmail(normalizeEmail);

  if(existingUser){
    throw new AppError(409, 'Email already Exists');
  }

  const passwordHash = await bcrypt.hash(password, passwordSaltRounds);

  await createUser(normalizeEmail, passwordHash);
}


export async function loginUser(email: string , password: string): Promise<{accessToken: string}> {
  if(!email || !password){
    throw new AppError(400, "Email and password are required");
  }

  const normalizeEmail = email.toLowerCase().trim();
  const user = await findUserByEmailWithPassword(normalizeEmail);
  if(!user?.password_hash){
    throw new AppError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if(!isPasswordValid){
    throw new AppError(401, 'Invalid email or password');
  }

  const accessToken = signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role
  })

  return { accessToken }
}