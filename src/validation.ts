import { Touched, SForm } from './types';
import { getProto, getProtoForm } from './proto';
import { getMetadataField, getMetadataForm } from './meta';
import get from 'lodash/get';

export abstract class Validation<TForm, TInstance> {
  constructor(protected form: TForm) {}

  protected abstract getTouched(instance: TInstance): Touched<TForm>;
  protected abstract getErrorMessage(value: any, path: string[]): string | undefined;

  public isTouched(path: string[]) {
    const touched = this.getTouched(this as any);
    return !!get(touched, path);
  }

  public getError(val: any, path: string[]) {
    const isTouched = this.isTouched(path);
    return isTouched ? this.getErrorMessage(val, path) : undefined;
  }

  protected getFieldMetadata<TForm extends SForm, TMeta>(form: TForm, path: string[]) {
    const proto = getProto(form, path);
    if (!proto) {
      return;
    }
    const propName = path.length ? path[path.length - 1] : undefined;
    return propName
      ? getMetadataField<TMeta>(proto, propName)
      : getMetadataForm<TMeta>(getProtoForm(proto));
  }
}
