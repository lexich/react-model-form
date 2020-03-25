import React from 'react';
import { SForm, TReact, Renderers, ClassFlags, IMetaProps } from './types';
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
    const value = get(model.form, realPath);
    const isTouched = !!get(model.touched, realPath);
    const name = getInputName(model.form, realPath, model.parentFormName);
    const proto = getProto(model, realPath);
    const meta = proto ? getMetadataField(proto, propName) : undefined;
    const error = isTouched ? meta?.validation?.(value) : undefined;
    const resolverType = meta?.type;
    const Component = options.resolveComponent(resolverType);
    if (!Component) {
      return null;
    }
    return React.createElement(Component, {
      model,
      name,
      path: realPath,
      value,
      options,
      meta: meta as any,
      error,
      type: resolverType,
      isTouched
    });

  };

  return new Proxy(renderer, handler);
}

export function createErrors<T extends SForm>(
  init?: ClassFlags<T, keyof T, string>
): ClassFlags<T, keyof T, string> {
  return init ?? ({} as any);
}

export function createTouched<T extends SForm>(
  init?: ClassFlags<T, keyof T, boolean>
): ClassFlags<T, keyof T, boolean> {
  return init ?? ({} as any);
}

export function reconsiler<T, TType, TInterface>(
  props: IMetaProps<TType, TInterface>
): Renderers<T> {
  return createReconsiler(props, []);
}
