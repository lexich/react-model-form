import React from 'react';
import { Welcome } from '@storybook/react/demo';
import { observer } from 'mobx-react-lite';
import { Form } from 'antd';
import createForm from './models';
import { moneyRenderer, userRenderer } from './renderer';

export default {
  title: 'Welcome',
  component: Welcome
};

const TestComponent = observer<{ model: ReturnType<typeof createForm> }>(({ model }) => {
  return (
    <Form>
      {userRenderer.purchase.money.render(model)}
      {userRenderer.isUser.render(model)}
      {userRenderer.age.render(model)}
      {userRenderer.name.render(model)}
      {moneyRenderer.currency.render(model.partial('purchase'))}
    </Form>
  );
});

export const ToStorybook = () => {
  const form = createForm();
  return <TestComponent model={form} />;
};
