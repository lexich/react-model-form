import React, { FunctionComponent } from 'react';
import { Welcome } from '@storybook/react/demo';
import { createTouched, createRenderer, field } from '../src/form';
import set from 'lodash/set';
import { SForm, IProps } from '../src/types';
import { observable } from 'mobx';
import { observer } from 'mobx-react-lite';
import { Form, Input, Checkbox, InputNumber } from 'antd';
import 'antd/dist/antd.css';

export default {
  title: 'Welcome',
  component: Welcome
};

enum ERenderer {
  string,
  bool,
  number
}

class FormMoney extends SForm {
  @field({ type: ERenderer.number, title: 'Money' })
  @observable
  money = 100
}

class FormModel extends SForm {
  @field({ type: ERenderer.string, title: 'Name' })
  @observable
  name = '';

  @field({
    title: 'Age',
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
  @field({ type: ERenderer.bool, title: 'Are you user?' })
  isUser = true;

  purchase = new FormMoney();
}

const touched = createTouched<FormModel>(observable.object({} as any));

const InputComponent: FunctionComponent<IProps<any, FormModel>> = (props) => {
  return (
    <Form.Item label={props.title || props.name} help={props.error}>
      <InputComponentData {...props} />
    </Form.Item>
  );
}

const InputComponentData: FunctionComponent<IProps<any, FormModel>> = ({
  form,
  value,
  meta,
  name,
  path,
  type
}) => {
  switch (type) {
    case ERenderer.bool:
      return (
        <Checkbox
          key={name}
          value={value}
          checked={!!value}
          name={name}

          onChange={e => {
            meta.set(form, path, e.target.checked)
          }}
        />
      );

    case ERenderer.number:
      return (
        <InputNumber
          key={name}
          value={value}
          name={name}
          onChange={(value) => {
            meta.set(form, path, value)
          }}
          onFocus={() => meta.set(meta.touched, path, false)}
          onBlur={() => meta.set(meta.touched, path, true)}
        />
      );
    case ERenderer.string:
    default:
      return (
        <Input
          key={name}
          value={value}
          name={name}
          onChange={(e: any) => meta.set(form, path, e.target.value)}
          onFocus={() => meta.set(meta.touched, path, false)}
          onBlur={() => meta.set(meta.touched, path, true)}
        />
      );
  }
};

const R = createRenderer<FormModel, ERenderer>({
  set,
  touched,
  resolveComponent() {
    return InputComponent;
  }
});

const TestComponent = observer<{ form: FormModel }>(({ form }) => {
  return (
    <Form>
      {R.age.render(form)}
      {R.isUser.render(form)}
      {R.name.render(form)}
      {R.purchase.money.render(form)}
    </Form>
  );
});

export const ToStorybook = () => {
  const form = new FormModel();
  return <TestComponent form={form} />;
};
