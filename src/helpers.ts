import { $Proto, getProtoForm, getSubProto } from './proto';
import { getMetadataForm, getMetadataField } from './meta';

const getInputName$ = <T extends $Proto>(proto: T, realPath: string[], parentFormName: string, i = 0): string[] => {
  const protoForm = getProtoForm(proto);
  const formMeta = parentFormName ? undefined : getMetadataForm(protoForm);
  if (realPath.length === 0) {
    return [formMeta?.name || ''];
  }
  const propsName = realPath[i];
  const fieldMeta = getMetadataField(proto, propsName);

  const nextProto = getSubProto(proto, propsName);

  const result = [
    i === 0 ? parentFormName : '',
    formMeta?.name || '',
    fieldMeta?.name || propsName
  ];
  if (!nextProto) {
    return result;
  } else {
    const tailResult = getInputName$(nextProto, realPath, parentFormName, i + 1);
    return result.concat(tailResult);
  }
};

export const join = (names: string[]) => names.filter(p => p).join('.');

export const getInputName = <T extends $Proto>(proto: T, realPath: string[], parentFormName: string) =>
  join(getInputName$<T>(proto, realPath, parentFormName));
