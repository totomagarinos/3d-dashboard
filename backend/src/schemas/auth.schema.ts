import {
  email,
  minLength,
  nonEmpty,
  object,
  pipe,
  string,
  type InferOutput,
} from "valibot";

export const RegisterSchema = object({
  name: pipe(string(), minLength(2), nonEmpty()),
  email: pipe(string(), email(), nonEmpty()),
  password: pipe(string(), minLength(8), nonEmpty()),
});

export const LoginSchema = object({
  email: pipe(string(), email(), nonEmpty()),
  password: pipe(string(), nonEmpty()),
});

export type RegisterDTO = InferOutput<typeof RegisterSchema>;
export type LoginDTO = InferOutput<typeof LoginSchema>;
