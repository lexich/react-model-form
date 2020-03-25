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

const TestComponent = observer<{ model: ReturnType<typeof createForm> }>(
  ({ model }) => {
    return (
      <Form>
        {userRenderer.purchase.money(model)}
        {userRenderer.isUser(model)}
        {userRenderer.age(model)}
        {userRenderer.name(model)}
        {moneyRenderer.currency(model.partial('purchase'))}
      </Form>
    );
  }
);

export const ToStorybook = () => {
  const form = createForm();
  return <TestComponent model={form} />;
};
