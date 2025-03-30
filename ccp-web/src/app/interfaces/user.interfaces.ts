export interface Role {
  id_role: string;
  name: string;
}

export interface Status {
  code: string;
  name: string;
}

export interface CreateUser {
  name: string;
  mail: string;
  password: string;
  role: { id_role : string };
  status: { code: string };
}

export interface User extends Omit<CreateUser, 'role' | 'status'> {
  id_user: string;
  name: string;
  mail: string;
  password: string;
  role: Role;
  status: Status;
}
