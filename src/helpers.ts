import { $Proto, getProtoForm, getSubProto } from './proto';
import { getMetadataForm, getMetadataField } from './meta';

const getInputName$ = <T extends $Proto>(proto: T, realPath: string[], i = 0): string[] => {
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
    return result;
  } else {
    const tailResult = getInputName$(nextProto, realPath, i + 1);
    return result.concat(tailResult);
  }
};

export const join = (names: string[]) => names.filter(p => p).join('.');

export const getInputName = <T extends $Proto>(proto: T, realPath: string[]) =>
  join(getInputName$<T>(proto, realPath));
