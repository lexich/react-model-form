import { $P, resolverName, resolverPath } from './helpers';

describe('helpers', () => {
  describe('resolverName', () => {
    it('empty', () => {
      expect(resolverName($P<'name'>([]))).toBe('');
    });

    it('invalid path', () => {
      const test = () => resolverName($P<'name'>(['a', 'b', 'c']));
      expect(test).toThrowError(Error);
    });

    it('[a, b]', () => {
      expect(resolverName($P<'name'>(['a', 'b']))).toBe('a.b');
    });

    it('[_, b]', () => {
      expect(resolverName($P<'name'>(['', 'b']))).toBe('b');
    });

    it('[a, _]', () => {
      expect(resolverName($P<'name'>(['a', '']))).toBe('a');
    });

    it('[a,b,c,d]', () => {
      expect(resolverName($P<'name'>(['a', 'b', 'c', 'd']))).toBe('a.b.d');
    });

    it('[a,_,c,d]', () => {
      expect(resolverName($P<'name'>(['a', '', 'c', 'd']))).toBe('a.c.d');
    });
  });

  describe('resolverPath', () => {
    it('empty', () => {
      expect(resolverPath($P<'path'>([]))).toBe('');
    });

    it('invalid path', () => {
      const test = () => resolverPath($P<'path'>(['a', 'b', 'c']));
      expect(test).toThrowError(Error);
    });

    it('[a, b]', () => {
      expect(resolverPath($P<'path'>(['a', 'b']))).toBe('b');
    });

    it('[_, b]', () => {
      expect(resolverPath($P<'path'>(['', 'b']))).toBe('b');
    });

    it('[a, _]', () => {
      expect(resolverPath($P<'path'>(['a', '']))).toBe('');
    });

    it('[a,b,c,d]', () => {
      expect(resolverPath($P<'path'>(['a', 'b', 'c', 'd']))).toBe('b.d');
    });

    it('[a,_,c,d]', () => {
      expect(resolverPath($P<'path'>(['a', '', 'c', 'd']))).toBe('.d');
    });
  });
});
