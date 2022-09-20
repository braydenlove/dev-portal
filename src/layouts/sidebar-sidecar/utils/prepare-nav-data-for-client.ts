import isAbsoluteUrl from 'lib/is-absolute-url'
import { EnrichedNavItem, RawSidebarNavItem } from 'components/sidebar/types'
import {
	PrepareNavNodeForClientOptions,
	PrepareNavNodeForClientResult,
} from '../types'
import {
	fullPathFromRelativeHref,
	isNavBranch,
	isNavLeaf,
	isNavDirectLink,
} from '.'
import {
	getIsRewriteableDocsLink,
	getIsRewriteableLearnLink,
	getTutorialMap,
	rewriteExternalDocsLink,
} from 'lib/remark-plugins/rewrite-tutorial-links/utils'
import { rewriteExternalLearnLink } from 'lib/remark-plugins/rewrite-tutorial-links/utils/rewrite-external-learn-link'

let TUTORIAL_MAP

/**
 * Prepares all sidebar nav items for client-side rendering. Keeps track of the
 * index of each node using `startingIndex` and the `traversedNodes` property
 * returned from `prepareNavNodeForClient`. Also returns its own
 * `traversedNodes` since it is recursively called in `prepareNavDataForClient`.
 */
async function prepareNavDataForClient({
	basePaths,
	nodes,
	startingIndex = 0,
}: {
	basePaths: string[]
	nodes: RawSidebarNavItem[]
	startingIndex?: number
}): Promise<{ preparedItems: EnrichedNavItem[]; traversedNodes: number }> {
	TUTORIAL_MAP = await getTutorialMap()

	const preparedNodes = []

	let count = 0
	for (let i = 0; i < nodes.length; i += 1) {
		const node = nodes[i]
		const result = await prepareNavNodeForClient({
			basePaths,
			node,
			nodeIndex: startingIndex + count,
		})
		if (result) {
			const { preparedItem, traversedNodes } = result
			preparedNodes.push(preparedItem)
			count += traversedNodes
		}
	}

	return { preparedItems: preparedNodes, traversedNodes: count }
}

/**
 * Prepares a single sidebar nav item for client-side rendering. All items will
 * have an auto-generated `id` added to them based on `nodeIndex` (which is the
 * index of the current node being prepared) unless they have the "hidden"
 * property set to TRUE. Returns the number of nodes it has traversed
 * (`traversedNodes`) to help `prepareNavDataForClient` keep track of node
 * indices.
 *
 * How different types of items are prepared:
 *  - If the item is a submenu, its child items will be prepared as well.
 *  - If the item is a link with the `path` property, then its `fullPath`
 *    property will be generated from `basePaths` and `path`.
 *  - If the item is a link with the `href` property and the `href` is an
 *    internal path, then the object is "reset" to have the `path` and
 *    `fullPath` properties.
 *  - Otherwise, nothing is added to an item but a unique `id`.
 */
export async function prepareNavNodeForClient({
	basePaths,
	node,
	nodeIndex,
}: PrepareNavNodeForClientOptions): Promise<PrepareNavNodeForClientResult> {
	/**
	 * TODO: we need aligned types that will work here. NavNode (external import)
	 * does not allow the `hidden` property.
	 *
	 * ref: https://app.asana.com/0/1201010428539925/1201602267333015/f
	 */
	if ((node as any).hidden) {
		return null
	}

	// Generate a unique ID from `nodeIndex`
	const id = `sidebar-nav-item-${nodeIndex}`

	if (isNavBranch(node)) {
		// For nodes with routes, add fullPaths to all routes, and `id`
		const { preparedItems, traversedNodes } = await prepareNavDataForClient({
			basePaths,
			nodes: node.routes,
			startingIndex: nodeIndex + 1,
		})
		const preparedItem = {
			...node,
			id,
			routes: preparedItems,
		}
		return {
			preparedItem,
			traversedNodes: traversedNodes + 1,
		}
	} else if (isNavLeaf(node) && basePaths.length > 0) {
		/**
		 * For nodes with paths, add fullPath to the node, and `id`
		 * Note: pathWithIndexFix is a stopgap, `index` items should
		 * really be fixed up in content. At some point in the future,
		 * we could add a warning or error here, or resolve this
		 * through content conformance efforts.
		 */
		const pathWithIndexFix = node.path == 'index' ? '' : node.path
		const preparedItem = {
			...node,
			path: pathWithIndexFix,
			fullPath: `/${basePaths.join('/')}/${pathWithIndexFix}`,
			id,
		} as EnrichedNavItem
		return { preparedItem, traversedNodes: 1 }
	} else if (isNavDirectLink(node)) {
		// Check if there is data that disagrees with DevDot's assumptions.
		// This can happen because in the context of dot-io domains,
		// authors may write NavDirectLinks with href values that are
		// internal to the site, but outside the current docs route.
		// For example, an author working in the Consul sidebar may
		// create a NavDirectLink with an href of "/downloads".
		// Here in DevDot, we want this URL to be "/consul/downloads",
		// and we want to use an internal rather than external link.
		const hrefIsNotAbsolute = !isAbsoluteUrl(node.href)
		if (hrefIsNotAbsolute && basePaths.length > 0) {
			/**
			 * If we have a non-absolute NavDirectLink,
			 * convert it to a NavLeaf node, and treat it similarly.
			 */
			const fullPath = fullPathFromRelativeHref(node.href, basePaths)
			const preparedItem = {
				...node,
				fullPath,
				href: null,
				id,
				path: node.href,
			}
			return { preparedItem, traversedNodes: 1 }
		} else {
			let newHref
			if (getIsRewriteableLearnLink(node.href)) {
				newHref = rewriteExternalLearnLink(new URL(node.href), TUTORIAL_MAP)
			} else if (getIsRewriteableDocsLink(node.href)) {
				newHref = rewriteExternalDocsLink(new URL(node.href))
			}

			// Otherwise, this is a genuinely external NavDirectLink,
			// so we only need to add an `id` to it.
			const preparedItem = {
				...node,
				href: newHref || node.href,
				id,
			} as EnrichedNavItem
			return { preparedItem, traversedNodes: 1 }
		}
	} else {
		// Otherwise return the node unmodified
		const preparedItem = { ...node, id } as EnrichedNavItem
		return { preparedItem, traversedNodes: 1 }
	}
}

export default prepareNavDataForClient
