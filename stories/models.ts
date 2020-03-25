import { observable } from 'mobx';
import { SForm, FormModel, field } from '../src';

export enum ERenderer {
  string,
  bool,
  number
}

export class MoneyForm extends SForm {
  @field({ type: ERenderer.number, title: '*Money' })
  @observable
  money = 100;

  @field({ type: ERenderer.string, title: '*Currency' })
  @observable
  currency = '$'
}

@field({ name: 'form' })
export class UserForm extends SForm {
  @field({ type: ERenderer.string, title: '*Name' })
  @observable
  name = 'Lexich';

  @field({
    title: '*Age',
    type: ERenderer.number,
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
  @field({ type: ERenderer.bool, title: '*Are you user?' })
  isUser = true;

  purchase = new MoneyForm();
}

export default function() {
  const user = new UserForm();
  return new FormModel(user, observable.object<any>({}));
}
