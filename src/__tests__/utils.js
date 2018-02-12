import { encodePath } from '../utils';

describe('encodePath', () => {
  it('should encode a path with special characters', () => {
    expect(encodePath('a ? & # b/c d.e')).toBe('a%20%3F%20%26%20%23%20b/c%20d.e');
  });
});