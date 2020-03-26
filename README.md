# Introduction

At first we should define enum and interface for creation decorators.

```ts
enum ERenderer {
    string,
    number,
    bool
}

interface IFormInputProps {
    title?: string;
    validation?(val: any): string | undefined;
}
```

After that create `Factory` instance for generate decorators in renderers.

```ts
import { Factory } from 'react-model-renderer';
const factory = new Factory<ERenderer, IFormInputProps>();
```

## Definition decorators factory

```ts
const D = factory.create({
    string: ERenderer.string,
    number: ERenderer.number,
    bool: ERenderer.bool,
});
```

## Create models

Let's create model with mobx

```ts
import { observable } from 'mobx'
class Form {
    @D.string({ title: 'Name' })
    @observable
    name = '';

    @D.number({ title: 'Money' })
    @observable
    money = 0;
}
```

## Create renders
Define renderes

```ts
import { reconsiler } from 'react-model-renderer';
import set from 'lodash/set';
const renderer = factory.createRender<Form>(reconsiler, {
    set,
    resolveComponent
})
```

### Define resolveComponent

```ts
function resolveComponent(ttype?: ERenderer, _meta?: IFormInputProps) {
  if (!ttype) {
    return null;
  }
  return InputComponent;
}
```
