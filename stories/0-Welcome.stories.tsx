import React from 'react';
import { Welcome } from '@storybook/react/demo';
import { observer } from 'mobx-react-lite';
import { Form } from 'antd';
import createForm from './models';
import R from './renderer';

export default {
  title: 'Welcome',
  component: Welcome
};

const TestComponent = observer<{ model: ReturnType<typeof createForm> }>(({ model }) => {
  return (
    <Form>
      {R.age.render(model)}
      {R.isUser.render(model)}
      {R.name.render(model)}
      {R.purchase.money.render(model)}
    </Form>
  );
});

export const ToStorybook = () => {
  const form = createForm();
  return <TestComponent model={form} />;
};
