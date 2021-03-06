import * as assert from 'assert';

import * as tests from './tests';
import { EntryItem, ErrnoException } from './types';
import * as pkg from '.';

describe('Package', () => {
	describe('.sync', () => {
		it('should throw an error when input values can not pass validation', () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			assert.throws(() => pkg.sync(null as any), /TypeError: Patterns must be a string or an array of strings/);
		});

		it('should returns entries', () => {
			const expected: EntryItem[] = [
				'fixtures/file.md',
				'fixtures/first/file.md',
				'fixtures/first/nested/directory/file.md',
				'fixtures/first/nested/file.md',
				'fixtures/second/file.md',
				'fixtures/second/nested/directory/file.md',
				'fixtures/second/nested/file.md'
			];

			const actual = pkg.sync(['fixtures/**/*.md']);

			actual.sort((a, b) => a.localeCompare(b));

			assert.deepStrictEqual(actual, expected);
		});

		it('should returns entries (two sources)', () => {
			const expected: EntryItem[] = [
				'fixtures/first/file.md',
				'fixtures/first/nested/directory/file.md',
				'fixtures/first/nested/file.md',
				'fixtures/second/file.md',
				'fixtures/second/nested/directory/file.md',
				'fixtures/second/nested/file.md'
			];

			const actual = pkg.sync(['fixtures/first/**/*.md', 'fixtures/second/**/*.md']);

			actual.sort((a, b) => a.localeCompare(b));

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.async', () => {
		it('should throw an error when input values can not pass validation', async () => {
			try {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				await pkg(null as any);
				throw new Error('An unexpected error was found.');
			} catch (error) {
				assert.strictEqual((error as Error).toString(), 'TypeError: Patterns must be a string or an array of strings');
			}
		});

		it('should returns entries', async () => {
			const expected: EntryItem[] = [
				'fixtures/file.md',
				'fixtures/first/file.md',
				'fixtures/first/nested/directory/file.md',
				'fixtures/first/nested/file.md',
				'fixtures/second/file.md',
				'fixtures/second/nested/directory/file.md',
				'fixtures/second/nested/file.md'
			];

			const actual = await pkg(['fixtures/**/*.md']);

			actual.sort((a, b) => a.localeCompare(b));

			assert.deepStrictEqual(actual, expected);
		});

		it('should returns entries (two sources)', async () => {
			const expected: EntryItem[] = [
				'fixtures/first/file.md',
				'fixtures/first/nested/directory/file.md',
				'fixtures/first/nested/file.md',
				'fixtures/second/file.md',
				'fixtures/second/nested/directory/file.md',
				'fixtures/second/nested/file.md'
			];

			const actual = await pkg(['fixtures/first/**/*.md', 'fixtures/second/**/*.md']);

			actual.sort((a, b) => a.localeCompare(b));

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.stream', () => {
		it('should throw an error when input values can not pass validation', () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			assert.throws(() => pkg.stream(null as any), /TypeError: Patterns must be a string or an array of strings/);
		});

		it('should returns entries', (done) => {
			const expected: string[] = [
				'fixtures/file.md',
				'fixtures/first/file.md',
				'fixtures/first/nested/directory/file.md',
				'fixtures/first/nested/file.md',
				'fixtures/second/file.md',
				'fixtures/second/nested/directory/file.md',
				'fixtures/second/nested/file.md'
			];

			const actual: string[] = [];

			const stream = pkg.stream(['fixtures/**/*.md']);

			stream.on('data', (entry: string) => actual.push(entry));
			stream.once('error', (error: ErrnoException) => assert.fail(error));
			stream.once('end', () => {
				actual.sort((a, b) => a.localeCompare(b));

				assert.deepStrictEqual(actual, expected);
				done();
			});
		});

		it('should returns entries (two sources)', (done) => {
			const expected: EntryItem[] = [
				'fixtures/first/file.md',
				'fixtures/first/nested/directory/file.md',
				'fixtures/first/nested/file.md',
				'fixtures/second/file.md',
				'fixtures/second/nested/directory/file.md',
				'fixtures/second/nested/file.md'
			];

			const actual: string[] = [];

			const stream = pkg.stream(['fixtures/first/**/*.md', 'fixtures/second/**/*.md']);

			stream.on('data', (entry: string) => actual.push(entry));
			stream.once('error', (error: ErrnoException) => assert.fail(error));
			stream.once('end', () => {
				actual.sort((a, b) => a.localeCompare(b));

				assert.deepStrictEqual(actual, expected);
				done();
			});
		});
	});

	describe('.generateTasks', () => {
		it('should throw an error when input values can not pass validation', () => {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			assert.throws(() => pkg.generateTasks(null as any), /TypeError: Patterns must be a string or an array of strings/);
		});

		it('should return tasks', () => {
			const expected = [
				tests.task.builder().base('.').positive('*').build()
			];

			const actual = pkg.generateTasks(['*']);

			assert.deepStrictEqual(actual, expected);
		});

		it('should return tasks with negative patterns', () => {
			const expected = [
				tests.task.builder().base('.').positive('*').negative('*.txt').negative('*.md').build()
			];

			const actual = pkg.generateTasks(['*', '!*.txt'], { ignore: ['*.md'] });

			assert.deepStrictEqual(actual, expected);
		});
	});

	describe('.isDynamicPattern', () => {
		it('should return true for dynamic pattern', () => {
			assert.ok(pkg.isDynamicPattern('*'));
		});

		it('should return false for static pattern', () => {
			assert.ok(!pkg.isDynamicPattern('abc'));
		});
	});

	describe('.escapePath', () => {
		it('should return escaped path', () => {
			const expected = 'C:/Program Files \\(x86\\)';

			const actual = pkg.escapePath('C:/Program Files (x86)');

			assert.strictEqual(actual, expected);
		});
	});
});
