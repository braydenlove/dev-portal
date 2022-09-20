import { RawSidebarNavItem, RawSubmenuNavItem } from 'components/sidebar/types'

function isNavBranch(value: RawSidebarNavItem): value is RawSubmenuNavItem {
	return value ? value.hasOwnProperty('routes') : false
}

export { isNavBranch }
