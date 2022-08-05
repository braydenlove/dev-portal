/**
 * Returns a fully qualified URL to the deployed app for preview deployments and
 * the production deployment. Useful if you need to build a full URL in the
 * context of the app.
 */
export default function getDeployedUrl(host?: string) {
	// preview deployments should derive the url from Vercel's env var
	if (process.env.HASHI_ENV === 'preview') {
		return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
	}

	if (process.env.HASHI_ENV === 'development') {
		return host ? `http://${host}` : 'http://localhost:3000'
	}

	// use our canonical URL for production
	return __config.dev_dot.canonical_base_url
}
