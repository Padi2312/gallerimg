// See https://kit.svelte.dev/docs/types#app

import type { ImageDto } from "$lib/types";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
			showUploadModal?: boolean
			showEditModal?: boolean
			image?: ImageDto
		}
		// interface Platform {}
	}
}

export { };
