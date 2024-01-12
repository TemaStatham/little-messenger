export type User = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  imageURL: string;
  contacts: ContactType[];
};

export type ContactType = {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  image: string;
};
