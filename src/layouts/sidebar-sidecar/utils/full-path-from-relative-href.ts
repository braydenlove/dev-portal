import path from 'path'

/**
 * Given a relative `href`, expected to be constructed for dot-io contexts,
 * as well as the current `basePaths`,
 * Return a `fullPath` for use with the Dev Dot URL structure.
 *
 * @param href A relative URL
 * @param basePaths The current set of basePaths
 */
function fullPathFromRelativeHref(href: string, basePaths: string[]): string {
	let fullPath
	if (href.startsWith(`/${basePaths[0]}/`)) {
		/**
		 * If the path already starts with the basePaths[0], the product slug,
		 * we use the href as the fullPath directly.
		 */
		fullPath = href
	} else if (href.startsWith('/')) {
		/**
		 * If the path starts with a slash, we treat it as relative
		 * to the previous dot-io setup. We prefix it with basePaths[0],
		 * which should be the product slug.
		 */
		fullPath = `/${path.join(basePaths[0], href)}`
	} else {
		/**
		 * If the path does not start with a slash, we treat it as relative
		 * to the combined current basePath.
		 */
		fullPath = `/${path.join(basePaths.join('/'), href)}`
	}
	return fullPath
}

export { fullPathFromRelativeHref }
