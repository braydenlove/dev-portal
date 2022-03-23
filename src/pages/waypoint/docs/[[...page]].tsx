import { ReactElement } from 'react'
import waypointData from 'data/waypoint.json'
import { Product } from 'types/products'
import { getStaticGenerationFunctions } from 'layouts/sidebar-sidecar/server'
import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import DocsView from 'views/docs-view'
import Placement from 'components/author-primitives/shared/placement-table'
import NestedNode from 'components/author-primitives/waypoint/nested-node'

const basePath = 'docs'
const baseName = 'Docs'
const product = waypointData as Product
const additionalComponents = {
  Placement,
  NestedNode,
}

const WaypointDocsPage = ({ mdxSource }): ReactElement => {
  return <DocsView {...mdxSource} additionalComponents={additionalComponents} />
}

const { getStaticPaths, getStaticProps } = getStaticGenerationFunctions({
  product,
  basePath,
  baseName,
})

WaypointDocsPage.layout = SidebarSidecarLayout

export { getStaticPaths, getStaticProps }
export default WaypointDocsPage
