import { observable } from 'mobx';
import { SForm, FormModel } from '../src';
import meta, { ERenderer } from './factory';
import Validation from './validation';

const D = {
  form: meta.createDecorator<ERenderer.form, {}>(ERenderer.form),
  string: meta.createDecorator<
    ERenderer.string,
    {
      title?: string;
    }
  >(ERenderer.string),
  bool: meta.createDecorator<
    ERenderer.bool,
    {
      title?: string;
    }
  >(ERenderer.bool),
  number: meta.createDecorator<
    ERenderer.number,
    {
      title?: string;
      validation?(val: any): string | undefined | Promise<string | undefined>;
    }
  >(ERenderer.number),
  nameField: meta.createDecorator<
    ERenderer.nameField,
    {
      title: string;
    }
  >(ERenderer.nameField),
};

export type DTypes =
  | typeof D.form['$$type']
  | typeof D.string['$$type']
  | typeof D.bool['$$type']
  | (typeof D.number['$$type'] | typeof D.nameField['$$type']);

@D.form({ name: 'money' })
export class MoneyForm extends SForm {
  @D.number({
    title: '*Money',
    validation(val: number): Promise<string | undefined> {
      return new Promise(resolve => setTimeout(resolve, 10)).then(() => {
        if (val < 100) {
          return 'Not enougth money';
        }
        return undefined;
      });
    },
  })
  @observable
  money = 100;

  @D.string({ title: '*Currency' })
  @observable
  currency = '$';

  validation = new Validation<MoneyForm>(this);
}

@D.nameField({ title: 'User Name' })
export class NameForm extends SForm {
  @observable
  firstName = 'John';

  @observable
  lastName = 'Gold';
}

@D.form({ name: 'form' })
export class UserForm extends SForm {
  @observable
  name = new NameForm();

  @D.number({
    title: '*Age',
    validation(val: number) {
      if (val <= 0) {
        return 'Age should be more zero';
      }
      return undefined;
    },
  })
  @observable
  age = 0;

  @observable
  @D.bool({ title: '*Are you user?' })
  isUser = true;

  @observable
  purchase = new MoneyForm();

  validation = new Validation<UserForm>(this);
}

export default function () {
  const user = new UserForm();
  return new FormModel(user);
}
