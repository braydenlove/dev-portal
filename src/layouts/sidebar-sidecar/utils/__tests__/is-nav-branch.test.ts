import { isNavBranch } from '../is-nav-branch'

describe('isNavBranch', () => {
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
		[{ title: 'Title', path: 'path' }, false],
		[{ title: 'Title', href: 'href' }, false],
		[{ heading: 'Heading' }, false],
		[{ title: 'Title', routes: [] }, true],
		[{ title: 'Title', routes: [{ title: 'Title', path: 'path' }] }, true],
	])('isNavBranch(%p) returns %p', (input: any, expectedOutput: boolean) => {
		expect(isNavBranch(input)).toBe(expectedOutput)
	})
})
