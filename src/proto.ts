import { SForm } from './types';
import { get } from 'lodash';

export abstract class $Proto {
  [Symbol('$PROTO')]() {}
}

export abstract class $ProtoForm {
  [Symbol('$PROTOFORM')]() {}
}

export const getProtoForm = (proto: $Proto): $ProtoForm => (proto as any).constructor;

export const getSubProto = (proto: $Proto, propName: string): $Proto | undefined => {
  const nextProto = (proto as any)[propName];
  if (nextProto instanceof SForm) {
    return nextProto;
  }
  return undefined;
};

export function getProto<T extends SForm>(model: T, realPath: string[]): $Proto | undefined {
  const realFormPath = realPath.length <= 1 ? [] : realPath.slice(0, realPath.length - 1);
  if (!realFormPath.length) {
    return model as any;
  }
  return get(model, realFormPath);
}
