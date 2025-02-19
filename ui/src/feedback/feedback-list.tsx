import {useEffect, useState} from "react";
import {Feedback, feedbacksQuery, numFeedbacks} from "./api.ts";


export default function FeedbackList() {
  const [page, setPage] = useState(1);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [expandedFeedback, setExpandedFeedback] = useState<number | null>(null);
  const [totalFeedbacks, setTotalFeedbacks] = useState<number | null>(null);


  useEffect(() => {
    feedbacksQuery(page, itemsPerPage).then((result) => setFeedbacks(result.feedbacks.values));
    console.log("fetching feedbacks");
  }, [page, itemsPerPage]);

  useEffect(() => {
    const fetchNumFeedbacks = async () => {
      try {
        const result = await numFeedbacks();

        setTotalFeedbacks(result.numFeedbacks);
      } catch (error) {
        console.error("Error fetching number of feedbacks:", error);
      }
    };

    fetchNumFeedbacks();
  }, []);

  const toggleFeedbackDetails = (id: number) => {
    if (expandedFeedback === id) {
      setExpandedFeedback(null);
    } else {
      setExpandedFeedback(id);
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Feedback</h1>
      {totalFeedbacks !== null ? (
        <p className="text-white">Total number of feedback: {totalFeedbacks}</p>
      ) : (
        <p className="text-white">Loading total number of feedbacks</p>
      )}
      {feedbacks.map((feedback) => (
          <div key={feedback.id}  className="bg-slate-700 bg-opacity-20 hover:bg-opacity-20 hover:bg-opacity-30">
              <div className="flex justify-between items-center p-4">
                  <p className="text-red-300">Feedback: {feedback.text}</p>
                    <div onClick={() => toggleFeedbackDetails(feedback.id)}>
                      {expandedFeedback === feedback.id ? <span className="text-white">&#9650;</span> : <span className="text-white">&#9660;</span>}
                    </div>
            </div>
            {expandedFeedback === feedback.id && feedback.highlights && feedback.highlights.length > 0 && (
                <div className="p-4 bg-slate-700 bg-opacity-20">
                    <h2 className="text-m font-semibold">Highlights</h2>
                    {feedback.highlights.map((highlight) => (
                        <div key={highlight.id} className="p-2 bg-slate-700 bg-opacity-30">
                            <p className="text-blue-300">Quote: {highlight.quote}</p>
                            <p className="text-green-300">Summary: {highlight.summary}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
      ))}

      <div className="flex justify-between mt-4">
        <button onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1} className="px-4 py-2 bg-gray-700 text-white disabled:opacity-50">Previous</button>
        <span className="text-white">Page {page}</span>
        <button onClick={() => setPage((prev) => prev + 1)} disabled={feedbacks.length < itemsPerPage} className="px-4 py-2 bg-gray-700 text-white">Next</button>
      </div>

     <div className="mt-4">
        <label className="text-white">Items per page:</label>
        <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
            className="ml-2 px-2 py-1 bg-gray-700 text-white"
        >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
        </select>
     </div>

    </div>
  );
}