import { ReactNode, FunctionComponent } from 'react';
import 'reflect-metadata';
import { FormModel } from './formModel';
export const formSymbol = Symbol('TFORM');
export abstract class SForm {
  [formSymbol]() {}
}

export type SFormKeys<T> = RemoveTNullProperties<
  {
    [P in keyof T]: T[P] extends SForm ? T[P] : undefined;
  }
>;

export type RemoveTNull<Type, TNull = undefined> = {
  [Key in keyof Type]: TNull extends Type[Key] ? never : Key;
}[keyof Type];

export type RemoveTNullProperties<Type, TNull = undefined> = {
  [Key in RemoveTNull<Type, TNull>]: Type[Key];
};

export type TWrapID<T> = T;
export type TWrapForm<T> = Record<string, T>;

export interface IMetaProps<T, TResolver> {
  set(target: any, key: string, value: any): void;
  resolveComponent(type?: TResolver): FunctionComponent<IProps<any, any>>;
}

type TypeFilterRenderer<
  TTypeLongName,
  TOrigin,
  TLeftType = TTypeLongName
> = TTypeLongName extends string
  ? TLeftType
  : TTypeLongName extends boolean
  ? TLeftType
  : TTypeLongName extends number
  ? TLeftType
  : TTypeLongName extends Date
  ? TLeftType
  : TTypeLongName extends SForm
  ? Renderers<TTypeLongName, TOrigin>
  : undefined;

export type TValidation<T> = (val: T) => string | undefined;

export interface IProps<TValue, TForm> {
  model: FormModel<TForm>;
  value: TValue;
  name: string;
  path: string;
  meta: IMetaProps<TForm, any>;
  type: any;
  title?: string;
  isTouched: boolean | undefined;
  error: string | undefined;
}

export type TReact<T, TForm> = {
  render(form: FormModel<TForm>): ReactNode;
};

export type Renderers<
  T extends any,
  TOrigin = T,
  TKeys extends any = keyof T
> = RemoveTNullProperties<
  {
    [P in TKeys]: TypeFilterRenderer<T[P], TOrigin, TReact<T[P], TOrigin>>;
  },
  undefined
>;

export type TypeFilter<
  TTypeLongName,
  TLeftType = TTypeLongName,
  TRightType = TTypeLongName
> = TTypeLongName extends string
  ? TLeftType
  : TTypeLongName extends boolean
  ? TLeftType
  : TTypeLongName extends number
  ? TLeftType
  : TTypeLongName extends Date
  ? TLeftType
  : TTypeLongName extends SForm
  ? TLeftType
  : TRightType;

export type ClassFlags<
  T extends any,
  TKeys extends any = keyof T,
  TDefType = boolean
> = {
  [P in TKeys]: Partial<
    TypeFilter<T[P], TDefType, ClassFlags<T[P], keyof T[P], TDefType>>
  >;
};
