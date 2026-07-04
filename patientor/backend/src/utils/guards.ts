import { Gender } from '../types.ts';

export const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

export const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

export const isGender = (gender: string): gender is Gender => {
  return (Object.values(Gender) as string[]).includes(gender);
};
