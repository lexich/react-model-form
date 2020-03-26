import { Factory } from '../src';

export enum ERenderer {
  form,
  string,
  bool,
  number,
  nameField
}

export interface IFormInputProps {
  title?: string;
  validation?(val: any): string | undefined | Promise<string | undefined>
}

export default new Factory<ERenderer, IFormInputProps>();
