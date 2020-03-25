import {
  SForm,
  TReact,
  Renderers,
  ClassFlags,
  IMetaProps,
  TValidation,
  FormModel
} from './types';
import React from 'react';
import get from 'lodash/get';
import has from 'lodash/has';
import 'reflect-metadata';

const FIELD_PROP = 'fieldprop';

export interface IFieldProps {
  name: string;
  validation: TValidation<any>;
  type: any;
  title: string;
}

export const field = (opts: Partial<IFieldProps>) =>
  Reflect.metadata(FIELD_PROP, opts);

abstract class $Proto {}

abstract class $ProtoForm {}

const getProtoForm = (proto: $Proto): $ProtoForm => (proto as any).constructor;
const getSubProto = (proto: $Proto, propName: string): $Proto | undefined => {
  const nextProto = (proto as any)[propName];
  if (nextProto instanceof SForm) {
    return nextProto;
  }
  return undefined;
}

function getProto<T extends SForm>(model: FormModel<T>, realPath: string[]): $Proto | undefined {
  const realFormPath = realPath.length <= 1 ? [] : realPath.slice(0, realPath.length - 1);
  if (!realFormPath.length) {
    return model.form as any;
  }
  return get(model.form, realFormPath);
}

const getMetadataField = (
  proto: $Proto,
  propName: string
): Partial<IFieldProps> | undefined =>
  Reflect.getMetadata(FIELD_PROP, proto as any, propName);

const getMetadataForm = (proto: $ProtoForm): Partial<IFieldProps> | undefined =>
  Reflect.getMetadata(FIELD_PROP, proto as any);

const getInputName$ = (proto: $Proto, realPath: string[], i = 0): string[] => {
  const protoForm = getProtoForm(proto);
  const formMeta = getMetadataForm(protoForm);
  if (realPath.length === 0) {
    return [formMeta?.name || ''];
  }
  const propsName = realPath[i];
  const fieldMeta = getMetadataField(proto, propsName);

  const nextProto = getSubProto(proto, propsName);

  const result = [formMeta?.name || '', fieldMeta?.name || propsName];
  if (!nextProto) {
    return result
  } else {
    const tailResult = getInputName$(nextProto, realPath, i + 1);
    return result.concat(tailResult);
  }
};

const getInputName = (proto: $Proto, realPath: string[]) =>
  getInputName$(proto, realPath).filter(p => p).join('.')

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
    render(model: FormModel<any>) {
      const value = get(model.form, realPath);
      const isTouched = get(model.touched, realPath) as any;
      const name = getInputName(model.form, realPath);
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
