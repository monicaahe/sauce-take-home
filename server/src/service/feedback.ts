import feedbackStore from "../store/feedback";
import prompt from "../ai/prompt";

/**
 * Creates a feedback entry and runs analysis on it.
 * @param text The feedback to create
 */
const createFeedback = async (text: string) => {
  const feedback = await feedbackStore.createFeedback(text);
  const analysisResult = await prompt.runFeedbackAnalysis(feedback.text);
  const highlights = analysisResult.highlights.map((highlight) => {
      feedbackStore.createHighlight(
          {
              feedbackId: feedback.id,
              highlightSummary: highlight.summary,
              highlightQuote: highlight.quote
          }
      )
  })

  await Promise.all(highlights);

  return feedback;
}

/**
 * Gets a page of feedback entries
 * @param page The page number
 * @param perPage The number of entries per page
 */
const getFeedbackPage = async (page: number, perPage: number) => {
  const values = await feedbackStore.getFeedbackPage(page, perPage);
  const count = values.length;
  return {values, count};
}

export default {
  createFeedback,
  getFeedbackPage,
}