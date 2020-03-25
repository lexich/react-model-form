import { FunctionComponent } from 'react';
import { Checkbox, InputNumber, Input, Form } from 'antd';
import React from 'react';
import { set } from 'lodash';
import 'antd/dist/antd.css';

import meta, { ERenderer, IFormInputProps } from './meta';
import { IProps, reconsiler } from '../src';

import { UserForm, MoneyForm } from './models';

const InputComponentData: FunctionComponent<IProps<any, UserForm, IFormInputProps>> = ({
  model,
  value,
  options,
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
            options.set(model.form, path, e.target.checked);
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
            options.set(model.form, path, value);
          }}
          onFocus={() => options.set(model.touched, path, false)}
          onBlur={() => options.set(model.touched, path, true)}
        />
      );
    case ERenderer.string:
    default:
      return (
        <Input
          key={name}
          value={value}
          name={name}
          onChange={(e: any) => options.set(model.form, path, e.target.value)}
          onFocus={() => options.set(model.touched, path, false)}
          onBlur={() => options.set(model.touched, path, true)}
        />
      );
  }
};

const InputComponent: FunctionComponent<IProps<
  any,
  UserForm,
  IFormInputProps
>> = props => {
  return (
    <Form.Item
      label={props.meta.title || props.name}
      help={props.error}
      style={{
        backgroundColor: props.isTouched ? '#ddd' : 'auto'
      }}
    >
      <InputComponentData {...props} />
    </Form.Item>
  );
};

const resolveComponent = (ttype?: ERenderer, _meta?: IFormInputProps) => {
  if (!ttype) {
    return null;
  }
  return InputComponent;
};

export const userRenderer = meta.createRender<UserForm>(
  props => reconsiler<UserForm, ERenderer, IFormInputProps>(props),
  {
    set,
    resolveComponent
  }
);

export const moneyRenderer = meta.createRender<MoneyForm>(
  props => reconsiler<MoneyForm, ERenderer, IFormInputProps>(props),
  {
    set,
    resolveComponent
  }
);
