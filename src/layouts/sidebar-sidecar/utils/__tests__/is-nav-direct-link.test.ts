import { isNavDirectLink } from '../is-nav-direct-link'

describe('isNavDirectLink', () => {
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
		[{ title: 'Title', href: 'href' }, true],
		[{ heading: 'Heading' }, false],
		[{ title: 'Title', routes: [] }, false],
		[{ title: 'Title', routes: [{ title: 'Title', path: 'path' }] }, false],
	])(
		'isNavDirectLink(%p) returns %p',
		(input: any, expectedOutput: boolean) => {
			expect(isNavDirectLink(input)).toBe(expectedOutput)
		}
	)
})
