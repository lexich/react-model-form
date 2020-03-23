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
      Reflect.metadata(FORM_VALIDATION_NAME, opts?.validation)(
        target,
        propertyKey
      );
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

function getInputName(
  form: any,
  list: string[],
  sep = '.'
) {
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

function getProto(model: any, pathForm: string | undefined, pathProp: string | undefined) {
  if (pathForm !== undefined) {
    const field = get(model, pathForm);
    if (field instanceof SForm) {
      return Object.getPrototypeOf(field);
    }
  }
  return Object.getPrototypeOf(model);
}

function getProtoProps(
  PROP: string,
  form: any,
  pathForm: string | undefined,
  pathProp: string | undefined
) {
  const proto = getProto(form, pathForm, pathProp);
  const propName = pathProp ?? pathForm
  return Reflect.getMetadata(PROP, proto, propName || '');
}

function getTitle(
  form: any,
  pathForm: string | undefined,
  pathProp: string | undefined
): string | undefined {
  return getProtoProps(FORM_TITLE_FIELD, form, pathForm, pathProp);
}

function getComponentType<TResolver>(
  form: any,
  pathForm: string | undefined,
  pathProp: string | undefined
): TResolver | undefined {
  return getProtoProps(FORM_TYPE_FIELD, form, pathForm, pathProp);
}

function getValidation<T>(
  form: any,
  pathForm: string | undefined,
  pathProp: string | undefined
): TValidation<T> | undefined {
  return getProtoProps(FORM_VALIDATION_NAME, form, pathForm, pathProp);
}

function createRenderer$<TForm extends SForm, TResolver>(
  meta: IMetaProps<TForm, TResolver>,
  pathForm: string | undefined,
  pathProp: string | undefined
): any {
  const handler = {
    get(target: any, method: string) {
      if (has(target, method)) {
        return get(target, method);
      }
      const path = pathProp ? (
        pathForm ? `${pathForm}.${pathProp}` : pathProp
      ) : pathForm;

      const newPathForm = path ?? method;
      const newPathProp = path ? method : undefined;
      return createRenderer$<TForm, TResolver>(meta, newPathForm, newPathProp);
    }
  };
  if (pathForm === undefined) {
    return new Proxy({}, handler);
  }
  const pathAccessor: string[] = [];
  if (pathForm) {
    pathAccessor.push(pathForm);
    if (pathProp) {
      pathAccessor.push(pathProp);
    }
  }

  const renderer: TReact<any, any> = {
    render(model: FormModel<any>) {
      const value = get(model.form, pathAccessor);
      const isTouched = get(model.touched, pathAccessor) as any;
      const name = getInputName(model.form, pathAccessor);
      const validation = isTouched
        ? getValidation<any>(model.form, pathForm, pathProp)
        : undefined;
      const error = isTouched ? validation?.(value) : undefined;
      const resolverType = getComponentType<TResolver>(
        model.form,
        pathForm,
        pathProp
      );
      const Component = meta.resolveComponent(resolverType);
      const title = getTitle(model.form, pathForm, pathProp);
      return React.createElement(Component, {
        model,
        title,
        name,
        path: pathAccessor.join('.'),
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
  return createRenderer$<T, TResolver>(props, undefined, undefined);
}
