import { json } from '@sveltejs/kit'
import packageJson from '../../../../package.json'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
    return json({ version: packageJson.version })
}