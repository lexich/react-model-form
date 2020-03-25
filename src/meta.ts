import 'reflect-metadata';
import { TValidation } from './types';
import { $Proto, $ProtoForm } from './proto';

const FIELD_PROP = 'fieldprop';

export interface IFieldProps {
  name: string;
  validation: TValidation<any>;
  type: any;
  title: string;
}

export const field = (opts: Partial<IFieldProps>) =>
  Reflect.metadata(FIELD_PROP, opts);

export const getMetadataField = (
  proto: $Proto,
  propName: string
): Partial<IFieldProps> | undefined =>
  Reflect.getMetadata(FIELD_PROP, proto as any, propName);

export const getMetadataForm = (proto: $ProtoForm): Partial<IFieldProps> | undefined =>
  Reflect.getMetadata(FIELD_PROP, proto as any);
