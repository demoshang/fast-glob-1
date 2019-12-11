import * as assert from 'assert';

import * as sinon from 'sinon';

import ReaderSync from '../readers/sync';
import Settings, { Options } from '../settings';
import * as tests from '../tests';
import ProviderSync from './sync';

class TestProvider extends ProviderSync {
	protected _reader: ReaderSync = sinon.createStubInstance(ReaderSync) as unknown as ReaderSync;

	constructor(options?: Options) {
		super(new Settings(options));
	}

	public get reader(): sinon.SinonStubbedInstance<ReaderSync> {
		return this._reader as unknown as sinon.SinonStubbedInstance<ReaderSync>;
	}
}

function getProvider(options?: Options): TestProvider {
	return new TestProvider(options);
}

describe('Providers → ProviderSync', () => {
	describe('Constructor', () => {
		it('should create instance of class', () => {
			const provider = getProvider();

			assert.ok(provider instanceof ProviderSync);
		});
	});

	describe('.read', () => {
		it('should return entries for dynamic task', () => {
			const provider = getProvider();
			const task = tests.task.builder().base('.').positive('*').build();
			const entry = tests.entry.builder().path('root/file.txt').file().build();

			provider.reader.getDynamic.returns([entry]);

			const expected = ['root/file.txt'];

			const actual = provider.read(task);

			assert.strictEqual(provider.reader.getDynamic.callCount, 1);
			assert.deepStrictEqual(actual, expected);
		});

		it('should return entries for static task', () => {
			const provider = getProvider();
			const task = tests.task.builder().base('.').static().positive('root/file.txt').build();
			const entry = tests.entry.builder().path('root/file.txt').file().build();

			provider.reader.getStatic.returns([entry]);

			const expected = ['root/file.txt'];

			const actual = provider.read(task);

			assert.strictEqual(provider.reader.getStatic.callCount, 1);
			assert.deepStrictEqual(actual, expected);
		});
	});
});
