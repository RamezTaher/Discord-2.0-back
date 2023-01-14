export type CreateUserParams = {
  email: string;
  firstName: string;
  lastName: string;
  userName: string;
  password: string;
};

export type LoginUserParams = {
  email: string;
  password: string;
};

export type FindUserParams = Partial<{
  email: string;
  id: number;
}>;
