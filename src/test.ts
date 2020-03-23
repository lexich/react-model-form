import { SForm, IProps } from './types';
import { createRenderer, field, createTouched } from './form';
import React, { FunctionComponent } from 'react';
import { renderToString } from 'react-dom/server';
import set from 'lodash/set';

// DEFINE model external, only pure data
@field({ name: 'subform' })
class SubForm extends SForm {
  title = 'title';
}

@field({ name: 'form' })
class Form extends SForm {
  @field({
    name: 'customname',
    validation: (val: string) => (!val ? 'missing value' : undefined)
  })
  name = '';
  amount = 999;
  isAmount = false;
  date = new Date();
  sub = new SubForm();
  test = {};
}

enum ERenderer {
  string,
}

// DEFINE renderers, we need only type of models
const touched = createTouched<Form>();
touched.name = true;

const R = createRenderer<Form, ERenderer>({
  set,
  touched,
  resolveComponent(type) {
    switch (type) {
      case ERenderer.string:
      default:
        const Component: FunctionComponent<IProps<any, Form>> = ({
          form,
          value,
          meta,
          name,
          error,
          path,
          isTouched
        }) => {
          return React.createElement('input', {
            key: name,
            value,
            name,
            'data-error': error,
            'data-touched': isTouched,
            onChange(e: any) {
              meta.set(form, path, e.target.value);
            },
            onFocus() {
              meta.set(meta.touched, path, false);
            },
            onBlur() {
              meta.set(meta.touched, path, true);
            }
          });
        };
        return Component;
    }
  }
});

// CREATE INSTANCE of form
const model = new Form();

// RENDER form
const result = renderToString(
  React.createElement('div', {}, [
    R.amount.render(model),
    R.isAmount.render(model),
    R.name.render(model),
    R.date.render(model),
    R.sub.title.render(model)
  ])
);
console.log('OUT', result);
