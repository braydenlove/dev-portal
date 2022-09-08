import { useState } from 'react'
import { useSearchBox, UseSearchBoxProps } from 'react-instantsearch-hooks-web'

import FilterInput from 'components/filter-input'
import Dialog from 'components/dialog'
import { CurrentFilters } from './components/current-filters'
import { TutorialLibraryResults } from './components/results'
import { SEARCH_TIMEOUT_MS } from './constants'
import { MobileFiltersButton } from './components/mobile-filters-button'

import s from './tutorial-library.module.css'
import { TutorialLibraryFilters } from './components/filters'
import Button from 'components/button'
import { ClearFilters } from './components/clear-filters'
import { useFiltersState } from './components/filters/use-filters-state'

let timerId = undefined
/**
 * Called when a search is triggered from the search input. This allows us to
 * throttle the number of network calls based on the SEARCH_TIMEOUT_MS constant.
 */
const queryHook: UseSearchBoxProps['queryHook'] = (query, search) => {
	if (timerId) {
		clearTimeout(timerId)
	}

	timerId = setTimeout(() => search(query), SEARCH_TIMEOUT_MS)
}

/**
 *
 * @TODO pagination
 */
export default function TutorialLibraryView() {
	const { query: searchQuery, refine } = useSearchBox({ queryHook })
	const [query, setQuery] = useState<string>(searchQuery)
	const [showMobileFilters, setShowMobileFilters] = useState(false)
	const filtersState = useFiltersState()

	return (
		<div>
			<h1>Tutorial Library</h1>
			<div className={s.inputFilterSection}>
				<FilterInput
					className={s.input}
					placeholder="Filter results"
					value={query}
					onChange={(value) => {
						setQuery(value)
						refine(value)
					}}
				/>
				<MobileFiltersButton onClick={() => setShowMobileFilters(true)} />
				<Dialog
					isOpen={showMobileFilters}
					label="Tutorial filters"
					onDismiss={() => setShowMobileFilters(false)}
					variant="bottom"
				>
					<div className={s.mobileFiltersControls}>
						<Button text="Done" onClick={() => setShowMobileFilters(false)} />
						<ClearFilters />
					</div>
					<TutorialLibraryFilters {...filtersState} />
				</Dialog>
			</div>
			<CurrentFilters />
			<TutorialLibraryResults />
		</div>
	)
}
