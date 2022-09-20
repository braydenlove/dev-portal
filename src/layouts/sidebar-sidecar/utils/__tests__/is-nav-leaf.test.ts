import { isNavLeaf } from '../is-nav-leaf'

describe('isNavLeaf', () => {
	test.each([
		[null, false],
		[undefined, false],
		[true, false],
		[false, false],
		[[], false],
		['', false],
		['not-a-branch', false],
		[12345, false],
		[{ divider: true }, false],
		[{ title: 'Title', path: 'path' }, true],
		[{ title: 'Title', href: 'href' }, false],
		[{ heading: 'Heading' }, false],
		[{ title: 'Title', routes: [] }, false],
		[{ title: 'Title', routes: [{ title: 'Title', path: 'path' }] }, false],
	])('isNavLeaf(%p) returns %p', (input: any, expectedOutput: boolean) => {
		expect(isNavLeaf(input)).toBe(expectedOutput)
	})
})
