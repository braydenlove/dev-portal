import { NavNode } from '@hashicorp/react-docs-sidenav/types'
import { ReactElement } from 'react'
import { VersionSelectItem } from '@hashicorp/react-docs-page/server/loaders/remote-content'
import { TableOfContentsHeading } from 'layouts/sidebar-sidecar/components/table-of-contents'
import { BreadcrumbLink } from 'components/breadcrumb-bar'
import { SidebarProps } from 'components/sidebar'
import { EnrichedNavItem, RawSidebarNavItem } from 'components/sidebar/types'

/**
 * @TODO Export NavBranch and NavLeaf types from react-docs-sidenav. isNavBranch
 * & isNavLeaf might also make sense to include in the react-docs-sidenav
 * component, maybe in the types.ts file as well. Or maybe we should move those
 * types into code within this repo, and consolidate them with the MenuItem
 * type?
 */
interface NavBranch {
	title: string
	routes: NavNode[]
}

interface NavLeaf {
	title: string
	path: string
}

/**
 * A NavDirectLink allows linking outside the content subpath.
 *
 * This includes links on the same domain, for example, where the content
 * subpath is `/docs`, one can create a direct link with href `/use-cases`.
 *
 * This also allows for linking to external URLs, for example, one could link to
 * `https://hashiconf.com/`.
 */
interface NavDirectLink {
	title: string
	href: string
}

interface PrepareNavNodeForClientOptions {
	node: RawSidebarNavItem
	basePaths: string[]
	nodeIndex: number
}

interface PrepareNavNodeForClientResult {
	preparedItem: EnrichedNavItem
	traversedNodes: number
}

/**
 * `BaseProps` represents the props that are defined for every usage of
 * `SidebarSidecarLayout`.
 */
interface BaseProps {
	breadcrumbLinks?: BreadcrumbLink[]
	children: React.ReactNode
	githubFileUrl?: string
	sidebarNavDataLevels: SidebarProps[]
	/** @TODO determine the minimum set of props that all Sidebars should have */
	AlternateSidebar?: (props: any) => ReactElement
	optInOutSlot?: ReactElement
	versions?: VersionSelectItem[]
}

/**
 * `PropsForSidecar` defines the properties that represent `Sidecar` behavior.
 * This approach allows us to require either (not both) `headings` and
 * `sidecarSlot` since providing both of these props is not a case that this
 * component handles.
 */
type PropsForSidecar =
	| {
			headings: TableOfContentsHeading[]
			sidecarSlot?: never
	  }
	| {
			headings?: never
			sidecarSlot: ReactElement
	  }

/**
 * This is the final exported type, combining all types defined above into one.
 */
type SidebarSidecarLayoutProps = BaseProps & PropsForSidecar

export type {
	NavBranch,
	NavDirectLink,
	NavLeaf,
	PrepareNavNodeForClientOptions,
	PrepareNavNodeForClientResult,
	SidebarSidecarLayoutProps,
}
