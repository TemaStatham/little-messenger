export type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  imageURL: string | null;
  contacts: Contact[];
};

export type Contact = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
};
