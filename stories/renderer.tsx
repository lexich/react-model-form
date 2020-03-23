import { FunctionComponent } from 'react';
import { Checkbox, InputNumber, Input, Form } from 'antd';
import React from 'react';
import { set } from 'lodash';
import 'antd/dist/antd.css';

import { IProps, createRenderer } from '../src';

import { UserForm, ERenderer } from './models';

const InputComponentData: FunctionComponent<IProps<any, UserForm>> = ({
  model,
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
            meta.set(model.form, path, e.target.checked);
          }}
        />
      );

    case ERenderer.number:
      return (
        <InputNumber
          key={name}
          value={value}
          name={name}
          onChange={value => {
            meta.set(model.form, path, value);
          }}
          onFocus={() => meta.set(model.touched, path, false)}
          onBlur={() => meta.set(model.touched, path, true)}
        />
      );
    case ERenderer.string:
    default:
      return (
        <Input
          key={name}
          value={value}
          name={name}
          onChange={(e: any) => meta.set(model.form, path, e.target.value)}
          onFocus={() => meta.set(model.touched, path, false)}
          onBlur={() => meta.set(model.touched, path, true)}
        />
      );
  }
};

const InputComponent: FunctionComponent<IProps<any, UserForm>> = (props) => {
  return (
    <Form.Item label={props.title || props.name} help={props.error}>
      <InputComponentData {...props} />
    </Form.Item>
  );
}


export default createRenderer<UserForm, ERenderer>({
  set,
  resolveComponent() {
    return InputComponent;
  }
});
