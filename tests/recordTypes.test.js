import { EMPTY_RECORD, WELL_KNOWN_RECORD, MIME_MEDIA_RECORD, ABSOLUTE_URI_RECORD, EXTERNAL_RECORD, UNKNOWN_RECORD, UNCHANGED_RECORD } from '../index';

describe('Record Types', () => {
  test('exports EMPTY_RECORD constant', () => {
    expect(EMPTY_RECORD).toBeDefined();
  });

  test ('exports WELL_KNOWN_RECORD constant', () => {
    expect(WELL_KNOWN_RECORD).toBeDefined();
  });

  test('exports MIME_MEDIA_RECORD constant', () => {
    expect(MIME_MEDIA_RECORD).toBeDefined();
  });

  test('exports ABSOLUTE_URI_RECORD constant', () => {
    expect(ABSOLUTE_URI_RECORD).toBeDefined();
  });

  test('exports EXTERNAL_RECORD constant', () => {
    expect(EXTERNAL_RECORD).toBeDefined();
  });

  test('exports UNKNOWN_RECORD constant', () => {
    expect(UNKNOWN_RECORD).toBeDefined();
  });

  test('exports UNCHANGED_RECORD constant', () => {
    expect(UNCHANGED_RECORD).toBeDefined();
  });
});