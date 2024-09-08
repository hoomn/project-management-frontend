export type TokenProps = string | null;

export type UserProps = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  initial: string;
  notification: boolean;
  is_staff: boolean;
};
