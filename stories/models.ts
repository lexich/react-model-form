import { observable } from 'mobx';
import { SForm, FormModel } from '../src';
import meta, { ERenderer } from './meta';

const D = meta.create({
  form: ERenderer.form,
  string: ERenderer.string,
  bool: ERenderer.bool,
  number: ERenderer.number,
});

@D.form({ name: 'money' })
export class MoneyForm extends SForm {
  @D.number({ title: '*Money' })
  @observable
  money = 100;

  @D.string({ title: '*Currency' })
  @observable
  currency = '$'
}

@D.form({ name: 'form' })
export class UserForm extends SForm {
  @D.string({ title: '*Name' })
  @observable
  name = 'Lexich';

  @D.number({
    title: '*Age',
    validation(val: number) {
      if (val <= 0) {
        return 'Age should be more zero';
      }
      return undefined;
    }
  })
  @observable
  age = 0;

  @observable
  @D.bool({ title: '*Are you user?' })
  isUser = true;

  purchase = new MoneyForm();
}

export default function() {
  const user = new UserForm();
  return new FormModel(user, observable.object<any>({}));
}
