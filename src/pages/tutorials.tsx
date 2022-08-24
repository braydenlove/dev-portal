import algoliasearch from 'algoliasearch/lite'
import { InstantSearch } from 'react-instantsearch-hooks-web'
import { history } from 'instantsearch.js/es/lib/routers'
import { useRouter } from 'next/router'

import SidebarSidecarLayout from 'layouts/sidebar-sidecar'
import TutorialsLibraryView from 'views/tutorial-library'
import { TutorialLibraryFilters } from 'views/tutorial-library/components/filters'
import { INDEX_NAME } from 'views/tutorial-library/constants'
import {
	routerStateToSearchState,
	searchStateToRouteState,
} from 'views/tutorial-library/utils/router-state'

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID

const searchClient = algoliasearch(appId, 'bf27a047ba263cba01ee9b4081965a1a')

export default function TutorialsLibraryPage({ layoutProps }) {
	const router = useRouter()

	return (
		<InstantSearch
			searchClient={searchClient}
			initialUiState={routerStateToSearchState(router.query)}
			indexName={INDEX_NAME}
			routing={{
				router: history(),
				stateMapping: {
					stateToRoute: searchStateToRouteState,
					routeToState: routerStateToSearchState,
				},
			}}
		>
			<SidebarSidecarLayout
				{...layoutProps}
				AlternateSidebar={TutorialLibraryFilters}
				sidecarSlot={null}
			>
				<TutorialsLibraryView />
			</SidebarSidecarLayout>
		</InstantSearch>
	)
}

export function getStaticProps() {
	return {
		props: {
			layoutProps: {
				headings: [],
				sidebarNavDataLevels: [],
				breadcrumbLinks: [
					{ title: 'Developer', url: '/' },
					{ title: 'Tutorials', url: '/tutorials', isCurrentPage: true },
				],
			},
		},
	}
}
