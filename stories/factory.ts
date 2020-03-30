import { Factory } from '../src';

export enum ERenderer {
  form,
  string,
  bool,
  number,
  nameField,
}

export default new Factory<ERenderer>();
