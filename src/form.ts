import React from 'react';
import { SForm, TReact, Renderers, IMetaProps } from './types';
import { FormModel } from './formModel';
import get from 'lodash/get';
import { getProto } from './proto';
import { getMetadataField } from './meta';
import { getInputName } from './helpers';

function createReconsiler<TForm extends SForm, TResolver>(
  options: IMetaProps<TResolver, any>,
  realPath: string[]
): any {
  const handler = {
    get(_: any, method: string) {
      const newRealPath = realPath.concat(method);
      return createReconsiler<TForm, TResolver>(options, newRealPath);
    }
  };
  if (!realPath) {
    return new Proxy({}, handler);
  }
  const propName = realPath[realPath.length - 1];
  const renderer: TReact<any, any> = (model: FormModel<SForm>) => {
    const proto = getProto(model.form, realPath);
    const meta = proto ? getMetadataField(proto, propName) : undefined;
    const resolverType = meta?.type;
    const Component = options.resolveComponent(resolverType);
    if (!Component) {
      return null;
    }

    const name = getInputName(model.form, realPath, model.parentFormName);
    return React.createElement(Component, {
      model,
      name,
      path: realPath,

      options,
      meta: meta as any,
      type: resolverType
    });
  };

  return new Proxy(renderer, handler);
}

export function reconsiler<T, TType, TInterface>(
  props: IMetaProps<TType, TInterface>
): Renderers<T> {
  return createReconsiler(props, []);
}
