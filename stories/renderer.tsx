import { observer } from 'mobx-react-lite';
import { Checkbox, InputNumber, Input, Form } from 'antd';
import React from 'react';
import set from 'lodash/set';
import get from 'lodash/get';

import 'antd/dist/antd.css';

import meta, { ERenderer, IFormInputProps } from './factory';
import { IProps, reconsiler } from '../src';

import { UserForm, MoneyForm, NameForm } from './models';

const InputComponentData = observer<IProps<UserForm, IFormInputProps>>(
  ({ model, options, name, path, type }) => {
    const touched = model.form.validation.touched;
    const value = get(model.form, path);
    switch (type) {
      case ERenderer.nameField: {
        const form: NameForm = value;
        const pathFirstName = path.concat('firstName');
        const pathLastName = path.concat('lastName');
        return (
          <p>
            <Input
              key={`${name}.firstName`}
              value={form.firstName}
              name={`${name}.firstName`}
              onChange={(e: any) => (form.firstName = e.target.value)}
              onFocus={() => {
                options.set(touched, pathFirstName, false);
              }}
              onBlur={() => {
                options.set(touched, pathFirstName, true);
              }}
            />

            <Input
              key={`${name}.lastName`}
              value={form.lastName}
              name={`${name}.lastName`}
              onChange={(e: any) => (form.lastName = e.target.value)}
              onFocus={() => {
                options.set(touched, pathLastName, false);
              }}
              onBlur={() => {
                options.set(touched, pathLastName, true);
              }}
            />
          </p>
        );
      }
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
            onFocus={() => {
              options.set(touched, path, false);
            }}
            onBlur={() => {
              options.set(touched, path, true);
            }}
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
            onFocus={() => {
              options.set(touched, path, false);
            }}
            onBlur={() => {
              options.set(touched, path, true);
            }}
          />
        );
    }
  },
);

const ResolvingComponent = observer<IProps<UserForm, IFormInputProps>>(props => {
  const {
    model: { form },
    path,
  } = props;
  const value = get(form, path);
  const error = form.validation.getError(value, path);
  return (
    <Form.Item
      label={props.meta.title || props.name}
      help={error}
      style={{
        backgroundColor: form.validation.isTouched(path) ? '#ddd' : 'auto',
      }}
    >
      <InputComponentData {...props} />
    </Form.Item>
  );
});

const resolveComponent = (ttype?: ERenderer, _meta?: IFormInputProps) => {
  if (!ttype) {
    return null;
  }
  return ResolvingComponent;
};

export const userRenderer = meta.createRender<UserForm>(
  props => reconsiler<UserForm, ERenderer, IFormInputProps>(props),
  {
    set,
    resolveComponent,
  },
);
