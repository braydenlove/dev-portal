import { prepareNavNodeForClient } from '../prepare-nav-data-for-client'

describe('prepareNavNodeForClient', () => {
	describe('NavBranch', () => {
		test('with no routes', async () => {
			const result = await prepareNavNodeForClient({
				basePaths: ['docs'],
				node: {
					title: 'Branch',
					routes: [],
				},
				nodeIndex: 0,
			})
			expect(result).toEqual({
				preparedItem: {
					id: 'sidebar-nav-item-0',
					title: 'Branch',
					routes: [],
				},
				traversedNodes: 1,
			})
		})

		test('with one route', async () => {
			const result = await prepareNavNodeForClient({
				basePaths: ['docs'],
				node: {
					title: 'Branch',
					routes: [{ title: 'Leaf', path: 'some-path' }],
				},
				nodeIndex: 0,
			})
			expect(result).toEqual({
				preparedItem: {
					id: 'sidebar-nav-item-0',
					title: 'Branch',
					routes: [
						{
							fullPath: '/docs/some-path',
							id: 'sidebar-nav-item-1',
							path: 'some-path',
							title: 'Leaf',
						},
					],
				},
				traversedNodes: 2,
			})
		})

		test('with many flat routes', async () => {
			const result = await prepareNavNodeForClient({
				basePaths: ['docs'],
				node: {
					title: 'Branch',
					routes: [
						{ title: 'Leaf 1', path: 'some-path-1' },
						{ title: 'Leaf 2', path: 'some-path-2' },
						{ title: 'Leaf 3', path: 'some-path-3' },
					],
				},
				nodeIndex: 0,
			})
			expect(result).toEqual({
				preparedItem: {
					id: 'sidebar-nav-item-0',
					title: 'Branch',
					routes: [
						{
							fullPath: '/docs/some-path-1',
							id: 'sidebar-nav-item-1',
							path: 'some-path-1',
							title: 'Leaf 1',
						},
						{
							fullPath: '/docs/some-path-2',
							id: 'sidebar-nav-item-2',
							path: 'some-path-2',
							title: 'Leaf 2',
						},
						{
							fullPath: '/docs/some-path-3',
							id: 'sidebar-nav-item-3',
							path: 'some-path-3',
							title: 'Leaf 3',
						},
					],
				},
				traversedNodes: 4,
			})
		})

		test('with many nested routes', async () => {
			const result = await prepareNavNodeForClient({
				basePaths: ['docs'],
				node: {
					title: 'Branch 1',
					routes: [
						{ title: 'Leaf 1', path: 'some-path-1' },
						{
							title: 'Branch 2',
							routes: [{ title: 'Leaf 2', path: 'some-path-2' }],
						},
						{ title: 'Leaf 3', path: 'some-path-3' },
					],
				},
				nodeIndex: 0,
			})
			expect(result).toEqual({
				preparedItem: {
					id: 'sidebar-nav-item-0',
					title: 'Branch 1',
					routes: [
						{
							fullPath: '/docs/some-path-1',
							id: 'sidebar-nav-item-1',
							path: 'some-path-1',
							title: 'Leaf 1',
						},
						{
							id: 'sidebar-nav-item-2',
							title: 'Branch 2',
							routes: [
								{
									fullPath: '/docs/some-path-2',
									id: 'sidebar-nav-item-3',
									path: 'some-path-2',
									title: 'Leaf 2',
								},
							],
						},
						{
							fullPath: '/docs/some-path-3',
							id: 'sidebar-nav-item-4',
							path: 'some-path-3',
							title: 'Leaf 3',
						},
					],
				},
				traversedNodes: 5,
			})
		})
	})

	describe('NavLeaf', () => {
		test('when no basePaths', async () => {
			const result = await prepareNavNodeForClient({
				basePaths: [],
				node: { title: 'Title', path: 'some-path' },
				nodeIndex: 0,
			})
			expect(result).toEqual({
				preparedItem: {
					id: 'sidebar-nav-item-0',
					path: 'some-path',
					title: 'Title',
				},
				traversedNodes: 1,
			})
		})

		test('when one basePath', async () => {
			const result = await prepareNavNodeForClient({
				basePaths: ['docs'],
				node: { title: 'Title', path: 'some-path' },
				nodeIndex: 0,
			})
			expect(result).toEqual({
				preparedItem: {
					fullPath: '/docs/some-path',
					id: 'sidebar-nav-item-0',
					path: 'some-path',
					title: 'Title',
				},
				traversedNodes: 1,
			})
		})

		test('when multiple basePaths', async () => {
			const result = await prepareNavNodeForClient({
				basePaths: ['waypoint', 'docs', 'test'],
				node: { title: 'Title', path: 'some-path' },
				nodeIndex: 0,
			})
			expect(result).toEqual({
				preparedItem: {
					fullPath: '/waypoint/docs/test/some-path',
					id: 'sidebar-nav-item-0',
					path: 'some-path',
					title: 'Title',
				},
				traversedNodes: 1,
			})
		})
	})

	describe('NavDirectLink', () => {
		test('with absolute href', async () => {
			const result = await prepareNavNodeForClient({
				basePaths: ['docs'],
				node: { title: 'Title', href: 'https://developer.hashicorp.com' },
				nodeIndex: 0,
			})
			expect(result).toEqual({
				preparedItem: {
					id: 'sidebar-nav-item-0',
					href: 'https://developer.hashicorp.com',
					title: 'Title',
				},
				traversedNodes: 1,
			})
		})

		test('with relative href and no basePaths', async () => {
			const result = await prepareNavNodeForClient({
				basePaths: [],
				node: { title: 'Title', href: '/some/relative/path' },
				nodeIndex: 0,
			})
			expect(result).toEqual({
				preparedItem: {
					id: 'sidebar-nav-item-0',
					title: 'Title',
					href: '/some/relative/path',
				},
				traversedNodes: 1,
			})
		})

		test('with relative href and one basePath', async () => {
			const result = await prepareNavNodeForClient({
				basePaths: ['docs'],
				node: { title: 'Title', href: '/some/relative/path' },
				nodeIndex: 0,
			})
			expect(result).toEqual({
				preparedItem: {
					id: 'sidebar-nav-item-0',
					href: null,
					title: 'Title',
					path: '/some/relative/path',
					fullPath: '/docs/some/relative/path',
				},
				traversedNodes: 1,
			})
		})
	})

	test('Hidden item', async () => {
		const result = await prepareNavNodeForClient({
			basePaths: ['docs'],
			node: { hidden: true },
			nodeIndex: 0,
		})
		expect(result).toEqual(null)
	})

	test('Divider', async () => {
		const result = await prepareNavNodeForClient({
			basePaths: ['docs'],
			node: { divider: true },
			nodeIndex: 0,
		})
		expect(result).toEqual({
			preparedItem: {
				id: 'sidebar-nav-item-0',
				divider: true,
			},
			traversedNodes: 1,
		})
	})

	test('Heading', async () => {
		const result = await prepareNavNodeForClient({
			basePaths: ['docs'],
			node: { heading: 'Heading' },
			nodeIndex: 0,
		})
		expect(result).toEqual({
			preparedItem: {
				id: 'sidebar-nav-item-0',
				heading: 'Heading',
			},
			traversedNodes: 1,
		})
	})
})
