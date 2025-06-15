import { Inngest } from "inngest";
import { connectDB } from "../config/db";// adjust path to your DB connector

export const inngest = new Inngest({ id: "AI-Edu-Guide" });

export const functions = [

  // Function 1: Save score to DB
  inngest.createFunction(
    { id: "save-score" },
    { event: "test/score.submitted" },
    async ({ event }) => {
      const { userId, domain, skillScores, submittedAt } = event.data;
      const db = await connectDB();
      await db.assessmentResults.create({
        data: {
          userId,
          domain,
          submittedAt,
          scores: skillScores
        }
      });

      return { message: "Score saved" };
    }
  ),


  // Function 3: Recommend courses for weak areas
  inngest.createFunction(
    { id: "recommend-courses" },
    { event: "test/score.submitted" },
    async ({ event }) => {
      const { userId, skillScores, domain } = event.data;

      const weakSkills = Object.entries(skillScores)
        .filter(([_, score]) => skillScores < 70)
        .map(([skill]) => skill);

      if (weakSkills.length === 0) return { message: "No recommendation needed" };

      // You can enqueue another event or trigger other logic here
      return {
        userId,
        recommended: weakSkills
      };
    }
  )

];
