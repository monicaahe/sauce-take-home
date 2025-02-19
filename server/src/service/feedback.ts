import feedbackStore from "../store/feedback";
import prompt from "../ai/prompt";

/**
 * Creates a feedback entry and runs analysis on it.
 * @param text The feedback to create
 */
const createFeedback = async (text: string) => {
  const feedback = await feedbackStore.createFeedback(text);
  const analysisResult = await prompt.runFeedbackAnalysis(feedback.text);
  storeHighlights({ id: Number(feedback.id), text: feedback.text });
  return feedback;
}

/**
 * Creates multiple feedback entries and runs analysis on them asynchronously.
 * @param texts - array of feedback
 */
const createBulkFeedbacks = async (texts: string[]) => {
  const feedbacks = await Promise.all(texts.map(text => feedbackStore.createFeedback(text)));
  feedbacks.forEach(feedback => storeHighlights({id: Number(feedback.id), text: feedback.text}));
  return feedbacks;
}

const storeHighlights = async (feedback: { id: number, text: string }) => {
  const analysisResult = await prompt.runFeedbackAnalysis(feedback.text);
  const highlights = analysisResult.highlights.map((highlight) => {
    return feedbackStore.createHighlight({
      feedbackId: feedback.id,
      highlightSummary: highlight.summary,
      highlightQuote: highlight.quote
    });
  });

  await Promise.all(highlights);
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

const getNumFeedbacks = async () => {
    return feedbackStore.countFeedback();
}

export default {
  createFeedback,
  getFeedbackPage,
  getNumFeedbacks,
  createBulkFeedbacks
}