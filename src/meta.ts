import 'reflect-metadata';
import { RemoveTNullProperties, IMetaProps, Renderers } from './types';
import { $Proto, $ProtoForm } from './proto';
const FIELD_PROP = 'fieldprop';

export interface IFieldProps {
  name: string;
  type: any;
}

export const getMetadataField = <T = {}>(
  proto: $Proto,
  propName: string,
): (Partial<IFieldProps> & T) | undefined =>
  Reflect.getMetadata(FIELD_PROP, proto as any, propName);

export const getMetadataForm = <T = {}>(
  proto: $ProtoForm,
): (T & Partial<IFieldProps>) | undefined => Reflect.getMetadata(FIELD_PROP, proto as any);

type TFunc<TInterface> = (
  opts: Partial<IFieldProps> & TInterface,
) => {
  (target: Function): void;
  (target: Object, propertyKey: string | symbol): void;
};

export type TWrap<TType, TInterface, TSchema> = RemoveTNullProperties<
  {
    [K in keyof TSchema]: TSchema[K] extends TType ? TFunc<TInterface> : undefined;
  }
>;

export class Factory<TType, TInterface> {
  create<TSchema>(schema: TSchema): TWrap<TType, TInterface, TSchema> {
    return Object.keys(schema).reduce((memo, key) => {
      memo[key] = (opts: any) =>
        Reflect.metadata(FIELD_PROP, { ...opts, type: (schema as any)[key] });
      return memo;
    }, {} as any);
  }
  createRender<T>(
    reconsiler: (props: IMetaProps<TType, TInterface>) => Renderers<T>,
    props: IMetaProps<TType, TInterface>,
  ): Renderers<T> {
    return reconsiler(props);
  }
}
