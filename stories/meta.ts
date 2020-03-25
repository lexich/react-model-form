import { Factory } from '../src';

export enum ERenderer {
  form,
  string,
  bool,
  number
}

export interface IFormInputProps {
  title?: string;
}

export default new Factory<ERenderer, IFormInputProps>();
