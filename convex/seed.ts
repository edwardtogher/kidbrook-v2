import { query } from "./_generated/server";

export const hasAdmin = query({
  args: {},
  handler: async (ctx) => {
    const first = await ctx.db.query("users").first();
    return first !== null;
  },
});
