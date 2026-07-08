import {
  email,
  maxLength,
  minLength,
  nonEmpty,
  object,
  pipe,
  string,
  type InferOutput,
} from "valibot";

export const RegisterSchema = object({
  name: pipe(string(), minLength(2), maxLength(100), nonEmpty()),
  email: pipe(string(), email(), maxLength(254), nonEmpty()),
  password: pipe(string(), minLength(8), maxLength(128), nonEmpty()),
});

export const LoginSchema = object({
  email: pipe(string(), email(), nonEmpty()),
  password: pipe(string(), nonEmpty()),
});

export type RegisterDTO = InferOutput<typeof RegisterSchema>;
export type LoginDTO = InferOutput<typeof LoginSchema>;
