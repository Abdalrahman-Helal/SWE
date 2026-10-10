import { AppError } from "../errors/AppError.js";
import { MIN_PASSWORD_LENGTH , passwordSaltRounds} from '../constants/constants.js'
import { createGoogleUser, createUser, findUserByEmail, findUserByEmailWithPassword, findUserByGoogleId, linkGoogleIdToUser } from "../repositories/user.repository.js";
import bcrypt from "bcryptjs";
import { signAccessToken } from "../lib/jwt.js";
import { getGoogleAuthUrl, getGoogleUserFromAuthCode } from "../lib/google.js";
import type { User } from "../types/user.js";

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


export function startGoogleLogin(): string {
  return getGoogleAuthUrl();
}

function createAccessTokenForUser(user: User): string {
  return signAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role
  })
}

export async function loginWithGoogle(code: string): Promise<{accessToken: string}> {
  const googleProfile = await getGoogleUserFromAuthCode(code);

  let user = await findUserByGoogleId(googleProfile.googleId);

  if(!user){
    user = await findUserByEmail(googleProfile.email);

    if(user){
      // link this google account to existing user
      user = await linkGoogleIdToUser(user.id, googleProfile.googleId);
    } else{
      // first time login - create the user in postgreDB
      user = await createGoogleUser(googleProfile.email, googleProfile.googleId);
    }
  }

  const accessToken = createAccessTokenForUser(user);
  return { accessToken };
}
