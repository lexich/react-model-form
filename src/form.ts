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
import { $Path, getProtoProps } from './helpers';

const FIELD_PROP = 'fieldprop';

export interface IFieldProps {
  name: string;
  validation: TValidation<any>;
  type: any;
  title: string;
}

export const field = (opts: Partial<IFieldProps>) =>
  Reflect.metadata(FIELD_PROP, opts.name);

function getField = (proto: any) => Reflect.getMetadata(FIELD_PROP, proto);


function getInputName(form: any, list: string[], sep = '.') {
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

const getTitle = (form: any, path: $Path<'path'>): string | undefined =>
  getProtoProps(FORM_TITLE_FIELD, form, path);

const getComponentType = <TResolver>(
  form: any,
  path: $Path<'path'>
): TResolver | undefined => getProtoProps(FORM_TYPE_FIELD, form, path);

const getValidation = <T>(
  form: any,
  path: $Path<'path'>
): TValidation<T> | undefined =>
  getProtoProps(FORM_VALIDATION_NAME, form, path);

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
      const path = pathProp
        ? pathForm
          ? `${pathForm}.${pathProp}`
          : pathProp
        : pathForm;

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
