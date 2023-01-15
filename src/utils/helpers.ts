import * as bcrypt from 'bcrypt';

export async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(password, salt);
}

export async function compare(password: string, hashedPassword: string) {
  console.log(password, hashPassword);
  return bcrypt.compare(password, hashedPassword);
}
