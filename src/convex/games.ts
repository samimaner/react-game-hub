import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const saveScore = mutation({
  args: {
    game: v.string(),
    score: v.number(),
    playerName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    
    await ctx.db.insert("scores", {
      game: args.game,
      score: args.score,
      playerName: args.playerName || user?.name || "Anonymous",
      userId: user?._id,
    });
  },
});

export const getHighScores = query({
  args: {
    game: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 10;
    
    const scores = await ctx.db
      .query("scores")
      .withIndex("by_game_and_score", (q) => q.eq("game", args.game))
      .order("desc")
      .take(limit);
    
    return scores;
  },
});

export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    
    const userScores = await ctx.db
      .query("scores")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
    
    const gameStats = userScores.reduce((acc, score) => {
      if (!acc[score.game]) {
        acc[score.game] = { plays: 0, bestScore: 0 };
      }
      acc[score.game].plays++;
      acc[score.game].bestScore = Math.max(acc[score.game].bestScore, score.score);
      return acc;
    }, {} as Record<string, { plays: number; bestScore: number }>);
    
    return gameStats;
  },
});
