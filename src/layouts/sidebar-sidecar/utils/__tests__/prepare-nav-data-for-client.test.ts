import prepareNavDataForClient from '../prepare-nav-data-for-client'

describe('prepareNavDataForClient', () => {
	test('thing', async () => {
		const result = await prepareNavDataForClient({ basePaths: [], nodes: [] })
		expect(result).toEqual({
			preparedItems: [],
			traversedNodes: 0,
		})
	})

	test('thing', async () => {
		const result = await prepareNavDataForClient({
			basePaths: [],
			nodes: [{ title: 'A Link', path: '/docs/some-path' }],
		})
		expect(result).toEqual({
			preparedItems: [
				{ title: 'A Link', path: '/docs/some-path', id: 'sidebar-nav-item-0' },
			],
			traversedNodes: 1,
		})
	})
})
