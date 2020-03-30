import { getMetadata, Factory, FormModel, SForm } from './';

enum ERenderer {
  test1,
  test2,
}

const factory = new Factory<ERenderer>();

const D = {
  test1: factory.createDecorator<ERenderer.test1, {}>(ERenderer.test1),
  test2: factory.createDecorator<ERenderer.test2, {}>(ERenderer.test2)
};

describe('form', () => {
  describe('getMetadata', () => {
    it('simple model', () => {
      @D.test2({ name: 'test2' })
      class Form extends SForm {
        @D.test1({ name: 'test1' })
        field1 = 'field1';

        field2 = 'field2';
      }

      const form = new FormModel(new Form());
      const meta = getMetadata(form, []);
      expect(meta).not.toBeUndefined();
      expect(meta?.name).toBe('test2');

      const meta2 = getMetadata(form, ['field1']);
      expect(meta2).not.toBeUndefined();
      expect(meta2?.name).toBe('test1');

      const meta3 = getMetadata(form, ['field2']);
      expect(meta3).toBeUndefined();
    });

    it('tree model', () => {
      @D.test2({ name: 'form2' })
      class Form2 extends SForm {
        @D.test2({ name: 'field3' })
        field3 = 'field3';
      }
      class Form extends SForm {
        @D.test1({ name: 'field1' })
        field1 = new Form2();

        field2 = new Form2();
      }
      const form = new FormModel(new Form());
      const meta = getMetadata(form, ['field1']);
      expect(meta).not.toBeUndefined();
      expect(meta?.name).toBe('field1');

      const meta1 = getMetadata(form, ['field2']);
      expect(meta1).not.toBeUndefined();
      expect(meta1?.name).toBe('form2');

      const meta2 = getMetadata(form, ['field1', 'field3']);
      expect(meta2).not.toBeUndefined();
      expect(meta2?.name).toBe('field3');

      const meta3 = getMetadata(form, ['field1', 'field3']);
      expect(meta3).not.toBeUndefined();
      expect(meta3?.name).toBe('field3');
    });
  });
});
