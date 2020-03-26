import { SFormKeys } from './types';
import { getInputName } from './helpers';

export class FormModel<TForm> {
  constructor(
    public form: TForm,
    public parentFormName = ''
  ) {}

  // Work in Progress
  private partial<TField extends keyof SFormKeys<TForm>>(
    field: TField
  ): FormModel<TForm[typeof field]> {
    const model = this.form[field];
    const formName = getInputName(
      this.form,
      [field as string],
      this.parentFormName
    );
    return new FormModel(model, formName);
  }
}
