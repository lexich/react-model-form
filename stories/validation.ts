import { SForm, Validation, Touched, Errored } from '../src';
import { observable } from 'mobx';
import { get, set } from 'lodash';
import { DTypes } from './models';

export default class ValidationImpl<T extends SForm> extends Validation<T, ValidationImpl<T>> {
  @observable.deep touched: Touched<T> = {} as any;
  @observable.deep error: Errored<T> = {} as any;

  getTouched(instance: ValidationImpl<T>): Touched<T> {
    return instance.touched;
  }

  getErrorMessage(value: any, path: string[]): string | undefined {
    const meta: any = this.getFieldMetadata<T, DTypes>(this.form, path);

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
        (res: any) => set(this.error, path, res),
        (err: Error) => set(this.error, path, err.message),
      );
      return get(this.error, path);
    }
  }
}
