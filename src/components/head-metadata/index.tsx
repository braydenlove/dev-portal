import { useRouter } from 'next/router'
import HashiHead from '@hashicorp/react-head'
import { useCurrentProduct } from 'contexts'
import getDeployedUrl from 'lib/get-deployed-url'
import { HeadMetadataProps } from './types'
import SelfReferentialCanonicalTag from 'components/self-referential-canonical-tag'

/**
 * Builds up the the necessary meta tags for the site. Rendered in `_app`, where it receives `pageProps.metadata` as props
 *
 * We build up a page title that looks like {props.title} | {currentProduct} | {root title}
 */
export default function HeadMetadata(props: HeadMetadataProps) {
	const { name: productName, slug: productSlug } = useCurrentProduct() ?? {}

	const router = useRouter()

	// do not render any meta tags if serving an io page
	if (router.pathname.includes('_proxied-dot-io')) {
		return null
	}

	const titleParts = [__config.dev_dot.meta.title]
	const description = props.description ?? __config.dev_dot.meta.description

	// We're using .unshift() to add the following elements to the beginning of the array
	if (productName) {
		titleParts.unshift(productName)
	}

	if (props.title) {
		titleParts.unshift(props.title)
	}

	const title = titleParts.join(' | ')

	const finalDescription = description.replace(
		'{product}',
		productName ?? 'HashiCorp'
	)

	const ogImageUrl = `${getDeployedUrl(props.host)}/og-image/${
		productSlug ?? 'base'
	}.jpg`

	return (
		// TODO: OpenGraph image to be passed as the image prop here
		<>
			<SelfReferentialCanonicalTag />
			<HashiHead
				title={title}
				siteName={title}
				pageName={title}
				description={finalDescription}
				image={ogImageUrl}
			>
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="icon" href="/icon.svg" type="image/svg+xml" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<meta
					name="google-site-verification"
					content="zRQZqfAsOX-ypXfU0mzAIzb5rUvj5fA4Zw2jWJRN-JI"
				/>

				{/* Some og tags do not get picked up for twitter's share cards, so we need these tags as well */}
				<meta name="twitter:image" key="twitter:image" content={ogImageUrl} />
			</HashiHead>
		</>
	)
}
