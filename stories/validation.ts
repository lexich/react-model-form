import { SForm, Validation, Touched, Errored } from '../src';
import { observable } from 'mobx';
import { IFormInputProps } from './factory';
import { get, set } from 'lodash';

export default class ValidationImpl<T extends SForm> extends Validation<T, ValidationImpl<T>> {
  @observable.deep touched: Touched<T> = {} as any;
  @observable.deep error: Errored<T> = {} as any;

  getTouched(instance: ValidationImpl<T>): Touched<T> {
    return instance.touched;
  }

  getErrorMessage(value: any, path: string[]): string | undefined {
    const meta = this.getFieldMetadata<T, IFormInputProps>(this.form, path);
    const validation = meta?.validation;
    if (!validation) {
      return undefined;
    }
    const result = validation(value);
    if (!result) {
      return undefined;
    }
    if (typeof result === 'string') {
      return result;
    } else {
      result.then(
        res => set(this.error, path, res),
        (err: Error) => set(this.error, path, err.message),
      );
      return get(this.error, path);
    }
  }
}
