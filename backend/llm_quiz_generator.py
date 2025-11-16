import os
import json
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    generation_config={
        "temperature": 0.3,
        "max_output_tokens": 4000,
        "top_p": 0.9,
        "response_mime_type": "application/json"
    }
)

SYSTEM_PROMPT = """
You are an expert quiz generator. Your output MUST be valid JSON only.

You will receive:
1. TITLE: The Wikipedia article title
2. CONTENT: Full cleaned article text

You must return a JSON object EXACTLY in the following structure:

{
  "title": "<string>",
  "description": "<2–4 sentence summary of the article>",
  "key_entities": {
      "people": [ ... ],
      "organizations": [ ... ],
      "locations": [ ... ]
  },
  "topics": [ "<topic1>", "<topic2>", "<topic3>" ],
  "questions": [
      {
        "question": "<string>",
        "options": {
          "A": "<string>",
          "B": "<string>",
          "C": "<string>",
          "D": "<string>"
        },
        "answer": "<correct option text>",
        "explanation": "<1–2 sentences explaining the answer>",
        "difficulty": "easy | medium | hard"
      }
  ]
}

STRICT RULES:
- Output ONLY JSON (no markdown, no commentary)
- 5 to 20 questions depending on article length
- EXACTLY 4 options per question (A, B, C, D)
- "answer" must be the option TEXT, not the letter
- All fields must exist — NO missing fields
- "topics" must contain 3–6 related Wikipedia topics
- Keep the JSON clean, no trailing commas
- Do NOT wrap inside ```json blocks
"""


def clean_llm_output(output: str):
    """
    Removes markdown, text, and safely extracts JSON.
    Prevents malformed JSON crashes.
    """

    # Remove code fences
    if "```" in output:
        output = output.replace("```json", "").replace("```", "").strip()

    # Find first { ... }
    start = output.find("{")
    end = output.rfind("}")

    if start == -1 or end == -1:
        raise ValueError("LLM did not return valid JSON.")

    json_str = output[start:end + 1]

    try:
        return json.loads(json_str)
    except Exception as e:
        print("❌ JSON PARSE ERROR:", e)
        raise ValueError("Failed to parse AI-generated JSON.")


def generate_quiz_with_llm(title: str, content: str):
    """Generate a fully validated quiz JSON safely."""

    final_prompt = f"""
{SYSTEM_PROMPT}

TITLE:
{title}

CONTENT:
{content}
"""

    try:
        response = model.generate_content(final_prompt)
        raw_output = response.text.strip()

        return clean_llm_output(raw_output)

    except Exception as e:
        print("❌ LLM ERROR:", e)
        raise Exception("Quiz generation failed due to model error.")
