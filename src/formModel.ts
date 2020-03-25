import get from 'lodash/get';
import set from 'lodash/set';
import { ClassFlags, SFormKeys } from './types';
import { getInputName, join } from './helpers';

export class FormModel<
  TForm,
  TTouched = ClassFlags<TForm, keyof TForm, boolean>
> {
  constructor(
    public form: TForm,
    public touched: TTouched,
    public parentFormName: string = '',
  ) {}
  partial<TField extends keyof SFormKeys<TForm>>(
    field: TField
  ): FormModel<TForm[typeof field]> {
    const model = this.form[field];
    const touched = new Proxy<any>(this.touched, {
      get(target, key) {
        return get(target, [field, key]);
      },
      set(target, key, value) {
        return set(target, [field, key], value);
      }
    });
    const formName = getInputName(this.form, [field as string]);
    return new FormModel(model, touched as any, join([this.parentFormName, formName]));
  }
}
