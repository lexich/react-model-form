import React, { FunctionComponent } from 'react';
import { Welcome } from '@storybook/react/demo';
import { observe } from 'mobx';

import { Form } from 'antd';
import createForm from './models';
import { moneyRenderer, userRenderer } from './renderer';
import { observer } from 'mobx-react-lite';

export default {
  title: 'Welcome',
  component: Welcome
};

const TestComponent = observer<{
  model: ReturnType<typeof createForm>;
}>(({ model }) => {
  return (
    <Form>
      {userRenderer.purchase.money(model)}
      {userRenderer.isUser(model)}
      {userRenderer.age(model)}
      {userRenderer.name(model)}
      {moneyRenderer.currency(model.partial('purchase'))}
    </Form>
  );
});

export const ToStorybook = () => {
  const form = createForm();
  observe(form.form, change => {
    console.log('XXX', change);
  })
  return <TestComponent model={form} />;
};
