import s from './style.module.css'
import { useState, useEffect } from 'react'
import BaseLayout from 'layouts/base-new'
import BreadcrumbBar from 'components/breadcrumb-bar'
import FacetedIntegrationList from './components/faceted-integrations-list'

// TODO, hardcoding this for now but will need to adjust later
const INTEGRATIONS_API_BASE_URL =
	'https://5nw9rm117f.execute-api.us-east-1.amazonaws.com'

export default function ProductIntegrationsLanding({ product }) {
	// Fetch integrations
	const [integrations, setIntegrations] = useState(null)
	useEffect(() => {
		fetch(
			`${INTEGRATIONS_API_BASE_URL}/products/${product.slug}/integrations`,
			{
				method: 'GET',
				mode: 'cors',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		)
			.then((res) => res.json())
			.then((res) => {
				setIntegrations(res.result)
			})
	}, [])

	return (
		<BaseLayout showFooterTopBorder>
			<div className={s.integrationsLandingPage}>
				<div className={s.sidebar}></div>
				<div className={s.mainArea}>
					<div className={s.contentWrapper}>
						<BreadcrumbBar
							links={[
								{
									title: 'Developer',
									url: '/',
									isCurrentPage: false,
								},
								{
									title: product.name,
									url: `/${product.slug}`,
									isCurrentPage: false,
								},
								{
									title: 'Integrations',
									url: `/${product.slug}/integrations`,
									isCurrentPage: true,
								},
							]}
						/>
						{integrations && (
							<FacetedIntegrationList integrations={integrations} />
						)}
					</div>
				</div>
			</div>
		</BaseLayout>
	)
}
