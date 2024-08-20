import { env } from '$env/dynamic/private';
import { SvelteKitAuth, type User } from "@auth/sveltekit";
import type { Provider } from '@auth/sveltekit/providers';
import Credentials from '@auth/sveltekit/providers/credentials';

const providers: Provider[] = [
    Credentials({
        // You can specify which fields should be submitted, by adding keys to the `credentials` object.
        credentials: {
            username: {},
            password: {},
        },
        authorize: (credentials, request: Request) => {
            if (credentials.username === env.ADMIN_EMAIL && credentials.password === env.ADMIN_PASSWORD) {
                request.redirect
                return {
                    id: "1",
                    name: "Admin",
                } as User
            } else {
                throw new Error("Invalid credentials")
            }
        },
    }),
]

export const { handle, signIn, signOut } = SvelteKitAuth({
    trustHost: true,
    providers: providers,
    callbacks: {
        session({ session }) {
            // Rewrite data here so we can get userId
            const data = {
                user: {
                    id: session.user.id,
                    name: session.user.name,
                },
                expires: session.expires
            }
            return data
        },
        redirect({ url }) {
            return "/admin/dashboard"
        }
    },
    // pages: {
    //     signIn: "/auth/signin",
    //     signOut: "/auth/signout",
    //     error: "/auth/error",
    // },
});