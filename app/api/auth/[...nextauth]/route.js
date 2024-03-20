import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            credentials: {
                username: {},
                email: {},
                password: {}
            },
            async authorize(credentials, req) {
                const user = {};

                if (user) {
                    return user;
                } else {
                    return null;
                }
            }
        })
    ]
});

export { handler as GET, handler as POST };
