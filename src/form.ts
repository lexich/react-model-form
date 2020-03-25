import React from 'react';
import {
  SForm,
  TReact,
  Renderers,
  ClassFlags,
  IMetaProps,
} from './types';
import { FormModel } from './formModel';
import get from 'lodash/get';
import has from 'lodash/has';
import { getProto } from './proto';
import { getMetadataField } from './meta';
import { getInputName } from './helpers';

function createRenderer$<TForm extends SForm, TResolver>(
  meta: IMetaProps<TForm, TResolver>,
  realPath: string[]
): any {
  const handler = {
    get(target: any, method: string) {
      if (has(target, method)) {
        return get(target, method);
      }
      const newRealPath = realPath.concat(method);
      return createRenderer$<TForm, TResolver>(meta, newRealPath);
    }
  };
  if (!realPath) {
    return new Proxy({}, handler);
  }
  const propName = realPath[realPath.length - 1];
  const renderer: TReact<any, any> = {
    render(model: FormModel<SForm>) {
      const value = get(model.form, realPath);
      const isTouched = !!get(model.touched, realPath);
      const name = getInputName(model.form, realPath, model.parentFormName);
      const proto = getProto(model, realPath);
      const metaInfo = proto ? getMetadataField(proto, propName) : undefined;
      const error = isTouched ? metaInfo?.validation?.(value) : undefined;
      const resolverType = metaInfo?.type;
      const Component = meta.resolveComponent(resolverType);
      const title = metaInfo?.title;
      return React.createElement(Component, {
        model,
        title,
        name,
        path: realPath.join('.'),
        value,
        meta,
        error,
        type: resolverType,
        isTouched
      });
    }
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

export function createRenderer<T extends SForm, TResolver>(
  props: IMetaProps<T, TResolver>
): Renderers<T> {
  return createRenderer$<T, TResolver>(props, []);
}
