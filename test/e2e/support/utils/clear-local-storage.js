/**
 * Clear localStorage
 */
export async function clearLocalStorage() {
	await page.evaluate( () => window.localStorage.clear() );
}
