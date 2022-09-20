import {
	RawExternalLinkNavItem,
	RawSidebarNavItem,
} from 'components/sidebar/types'

function isNavDirectLink(
	value: RawSidebarNavItem
): value is RawExternalLinkNavItem {
	return value ? value.hasOwnProperty('href') : false
}

export { isNavDirectLink }
