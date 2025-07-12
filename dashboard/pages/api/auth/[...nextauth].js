import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";

export default NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: "identify guilds" } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;


        try {
          const res = await fetch("https://discord.com/api/users/@me", {
            headers: {
              Authorization: `Bearer ${account.access_token}`,
            },
          });
          const user = await res.json();

          token.discordUser = {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
          };

          token.isOwner = user.id === process.env.DISCORD_OWNER_ID;
        } catch (err) {
          console.error("Failed to fetch user from Discord:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.user.accessToken = token.accessToken;

      if (token.discordUser) {
        session.user.id = token.discordUser.id;
        session.user.name = token.discordUser.username;
        session.user.image = token.discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${token.discordUser.id}/${token.discordUser.avatar}.png`
          : null;
      }

      session.isOwner = token.isOwner || false;

      return session;
    },
  },
});
