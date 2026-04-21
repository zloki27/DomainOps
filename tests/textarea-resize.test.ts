import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

interface TextareaSource {
  file: URL;
  name: string;
}

const TEXTAREA_SOURCES: TextareaSource[] = [
  {
    file: new URL('../app/components/RepeatableSection.tsx', import.meta.url),
    name: 'repeatable section multiline rows',
  },
  {
    file: new URL('../app/components/FixedQuestionSection.tsx', import.meta.url),
    name: 'fixed question comments',
  },
  {
    file: new URL('../app/brands/[brand]/BrandForm.tsx', import.meta.url),
    name: 'additional information',
  },
];

test('all questionnaire textareas allow vertical resize', () => {
  for (const source of TEXTAREA_SOURCES) {
    const contents = fs.readFileSync(source.file, 'utf8');

    assert.match(
      contents,
      /<textarea[\s\S]*?className="[^"]*\bresize-y\b/,
      `${source.name} should use resize-y`
    );

    assert.doesNotMatch(
      contents,
      /<textarea[\s\S]*?className="[^"]*\bresize-none\b/,
      `${source.name} should not disable resizing`
    );
  }
});
