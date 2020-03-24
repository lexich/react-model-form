import get from 'lodash/get';

export class $Path<T = 'name' | 'path'> {
  constructor(path: string[]) {
    (this as any).path = path;
  }
}

function getPath<T = 'name' | 'path'>(p: $Path<T>): string[] {
  return (p as any).path;
}

function getPropName(p: $Path<'path'>): string | undefined {
   const path = getPath(p);
   return path.length ? path[path.length - 1] : undefined;
}

export function $P<T = 'name' | 'path'>(path: string[]) {
  return new $Path<T>(path);
}

export function resolverName(p: $Path<'name'>): string {
  const path = getPath(p);
  const res: string[] = [];
  const iLen = path.length;
  if (iLen % 2 !== 0) {
    throw new Error('invalid path');
  }
  for (let i = 0; i < iLen; i++) {
    const formPath = path[i];
    const propPath = path[i + 1];
    if (formPath && i === 0) {
      res.push(formPath);
    }
    if (propPath) {
      res.push(propPath);
    } else {
      if (i + 2 < iLen) {
        res.push(path[i + 2]);
      }
    }
    i++;
  }
  return res.join('.');
}

export function resolverPath(p: $Path<'path'>): string {
  const path = getPath(p);
  const iLen = path.length;
  if (iLen % 2 !== 0) {
    throw new Error('invalid path');
  }
  return path.filter((_, i) => i % 2 === 1).join('.');
}

export function getProto(model: any, $path: $Path<'path'>) {
  const path = resolverPath($path);
  const form = path ? get(model, path) : model;
  return Object.getPrototypeOf(form);
}

export function getProtoProps(PROP: string, form: any, $path: $Path<'path'>) {
  const proto = getProto(form, $path);
  const propName = getPropName($path);
  return Reflect.getMetadata(PROP, proto, propName!);
}
