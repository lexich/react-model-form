import 'reflect-metadata';
import { IMetaProps, Renderers, IFieldProps } from './types';
import { $Proto, $ProtoForm } from './proto';
const FIELD_PROP = 'fieldprop';

export const getMetadataField = <T = {}>(
  proto: $Proto,
  propName: string,
): (Partial<IFieldProps> & T) | undefined =>
  Reflect.getMetadata(FIELD_PROP, proto as any, propName);

export const getMetadataForm = <T = {}>(
  proto: $ProtoForm,
): (T & Partial<IFieldProps>) | undefined => Reflect.getMetadata(FIELD_PROP, proto as any);

type TDecorator<TInterface> = (
  _: Partial<IFieldProps> & Omit<TInterface, 'type'>,
) => {
  (target: Function): void;
  (target: Object, propertyKey: string | symbol): void;
};

export class Factory<TType$> {
  createDecorator<TType extends TType$, TInterface>(
    ttype: TType,
  ): TDecorator<TInterface> & { $$type: { type: TType } & TInterface } {
    const fn: TDecorator<TInterface> = (opts: Partial<IFieldProps> & Omit<TInterface, 'type'>) =>
      Reflect.metadata(FIELD_PROP, { ...opts, type: ttype });
    return fn as any;
  }
  createRender<T>(
    reconsiler: (props: IMetaProps<TType$>) => Renderers<T>,
    props: IMetaProps<TType$>,
  ): Renderers<T> {
    return reconsiler(props);
  }
}
