import {
  SForm,
  TReact,
  Renderers,
  ClassFlags,
  IMetaProps,
  TValidation
} from './types';
import React from 'react';
import get from 'lodash/get';
import has from 'lodash/has';
import 'reflect-metadata';

const FORM_INPUT_NAME = 'formname';
const FORM_VALIDATION_NAME = 'formvalidation';
const FORM_TYPE_FIELD = 'fieldtype';
const FORM_TITLE_FIELD = 'fieldtitle';

export const field = (opts: {
  name?: string;
  validation?: TValidation<any>;
  type?: any;
  title?: string;
}) => {
  function wrap(target: Function, key?: any): void;
  function wrap(target: Object, propertyKey: string | symbol): void {
    if (opts.name) {
      Reflect.metadata(FORM_INPUT_NAME, opts.name)(target, propertyKey);
    }
    if (opts.type) {
      Reflect.metadata(FORM_TYPE_FIELD, opts?.type)(target, propertyKey);
    }
    if (opts.validation) {
      Reflect.metadata(FORM_VALIDATION_NAME, opts?.validation)(target, propertyKey);
    }
    if (opts.title) {
      Reflect.metadata(FORM_TITLE_FIELD, opts?.title)(target, propertyKey);
    }
  }
  return wrap as {
    (target: Function): void;
    (target: Object, propertyKey: string | symbol): void;
  };
};

function getInputName(form: any, path: string, sep = '.') {
  const list = path.split('.');
  const result: string[] = [];
  for (let i = 0, iLen = list.length, field = form; i < iLen; i++) {
    const proto = Object.getPrototypeOf(field);
    const name = list[i];
    const formName: string | undefined = Reflect.getMetadata(
      FORM_INPUT_NAME,
      proto.constructor
    );
    if (formName) {
      result.push(formName);
    }
    const propName: string | undefined = Reflect.getMetadata(
      FORM_INPUT_NAME,
      proto,
      name
    );
    result.push(propName ?? name);
    field = field[name];
  }
  return result.join(sep);
}

function getComponentType<TResolver>(form: any, path: string): TResolver | undefined {
  return getProtoProps(FORM_TYPE_FIELD, form, path);
}

function getValidation<T>(form: any, path: string): TValidation<T> | undefined {
  return getProtoProps(FORM_VALIDATION_NAME, form, path);
}

function getTitle(form: any, path: string): string | undefined {
  return getProtoProps(FORM_TITLE_FIELD, form, path);
}

function getProto(form: any, path: string, list = path.split('.')) {
  const formIndex = list.length - 2;
  const formPath = formIndex >= 0 ? list.slice(formIndex) : undefined;
  const model = formPath !== undefined ? get(form, formPath) : form;
  return Object.getPrototypeOf(model);
}

function getProtoProps(PROP: string, form: any, path: string, list = path.split('.')) {
  const proto = getProto(form, path, list);
  return Reflect.getMetadata(
    PROP,
    proto,
    list[list.length - 1]
  );
}

function createRenderer$<TForm extends SForm, TResolver>(
  meta: IMetaProps<TForm, TResolver>,
  path: string | undefined
): any {
  const handler = {
    get(target: any, method: string) {
      if (has(target, method)) {
        return get(target, method);
      }
      const forwardName = path ? `${path}.${method}` : method;
      return createRenderer$<TForm, TResolver>(meta, forwardName);
    }
  };
  if (path === undefined) {
    return new Proxy({}, handler);
  }


  const renderer: TReact<any, any> = {
    render(form: any) {
      const value = get(form, path);
      const isTouched = get(meta.touched, path);
      const name = getInputName(form, path);
      const validation = isTouched ? getValidation<any>(form, path) : undefined;
      const error = isTouched ? validation?.(value) : undefined;
      const resolverType = getComponentType<TResolver>(form, path)
      const Component = meta.resolveComponent(resolverType);
      const title = getTitle(form, path);
      return React.createElement(Component, {
        form,
        title,
        name,
        path,
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
  return createRenderer$<T, TResolver>(props, undefined);
}
