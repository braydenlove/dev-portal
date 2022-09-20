import {
	RawInternalLinkNavItem,
	RawSidebarNavItem,
} from 'components/sidebar/types'

function isNavLeaf(value: RawSidebarNavItem): value is RawInternalLinkNavItem {
	return value ? value.hasOwnProperty('path') : false
}

export { isNavLeaf }
