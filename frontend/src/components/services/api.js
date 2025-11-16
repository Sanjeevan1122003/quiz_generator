const BASE_URL = "http://127.0.0.1:8000";

// Helper to handle errors safely
async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);

    if (!res.ok) {
      // Server responded but with error status
      const text = await res.text();
      throw new Error(text || `Server error: ${res.status}`);
    }

    return res.json();
  } catch (err) {
    throw new Error(err.message || "Network error");
  }
}

export async function generateQuiz(url) {
  return safeFetch(`${BASE_URL}/generate_quiz`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url })
  });
}

export async function getHistory() {
  return safeFetch(`${BASE_URL}/history`);
}

export async function getQuizById(id) {
  return safeFetch(`${BASE_URL}/quiz/${id}`);
}
