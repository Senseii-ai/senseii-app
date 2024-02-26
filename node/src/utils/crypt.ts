import bcrypt from 'bcryptjs';

const getSalt = (): string => {
  return bcrypt.genSaltSync(10);
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, getSalt());
};
