/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { getGrpApiHttpClient } from "@/lib/grp-api-http-client";
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

interface Credentials {
    id: string,
    name: string,
    inviteeId: string,
    accessToken: string,
    password: string,
}

const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 1 * 24 * 60 * 60,
    },
    pages: { signIn: "/" },
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                name: { label: "Name", type: "text" },
                password: { label: "Password", type: "password"},
            },
            async authorize(credentials) {
                try {
                    const client = getGrpApiHttpClient();

                    if (credentials) {
                            const loginResponse = await client.loginUser({
                            name: credentials.name,
                            password: credentials.password,
                        });

                        if (loginResponse.status > 300) {
                            return null;
                        }
                        const { data } = loginResponse;

                        return {
                            id: data.inviteeId,
                            name: data.name,
                            inviteeId: data.inviteeId,
                            accessToken: loginResponse.data.token,
                        };
                    };

                    return null;

                } catch (e) {
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            session.user.name = token.name as string;
            session.user.inviteeId = token.inviteeId as string;
            session.accessToken = token.accessToken as string;

            return session;
        },
        async jwt({ user, token }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.name = user.name;
                token.inviteeId = user.inviteeId;
            }
            return token;
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };