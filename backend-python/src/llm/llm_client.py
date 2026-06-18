from typing import List

import google.generativeai as genai

from src.core.config import get_settings
from src.prompts.prompt_templates import build_study_answer_prompt
from src.schemas.chat import ContextDocument


class GeminiService:
    def __init__(self):
        self.settings = get_settings()
        self.enabled = bool(self.settings.gemini_api_key)
        if self.enabled:
            genai.configure(api_key=self.settings.gemini_api_key)
            self.model = genai.GenerativeModel(self.settings.gemini_model)
        else:
            self.model = None

    def generate(self, prompt: str) -> tuple[str, bool]:
        if not self.enabled:
            return "Demo mode is active because GEMINI_API_KEY is not configured. This is a mock AI response.", True

        try:
            response = self.model.generate_content(prompt)
            return response.text or "Gemini did not return any content.", False
        except Exception as exc:
            return self._mock_answer_for_ai_error(str(exc), []), True

    def answer(self, question: str, hits: List[ContextDocument]) -> tuple[str, bool]:
        if not hits:
            return "I could not find a document summary that matches this question. Please select a more specific subject or document.", True

        prompt = build_study_answer_prompt(question, hits)

        if not self.enabled:
            names = ", ".join(hit.document_name for hit in hits)
            return (
                "Demo mode is active because GEMINI_API_KEY is not configured. "
                f"I found these related documents: {names}. "
                "After Gemini is configured, the question will be sent with these summaries to generate a real answer."
            ), True

        try:
            response = self.model.generate_content(prompt)
            return response.text or "Gemini did not return any content.", False
        except Exception as exc:
            return self._mock_answer_for_ai_error(str(exc), hits), True

    def _mock_answer_for_ai_error(self, error_message: str, hits: List[ContextDocument]) -> str:
        lower_error = error_message.lower()
        if "quota" in lower_error or "429" in lower_error or "resourceexhausted" in lower_error:
            reason = "Gemini quota/rate limit has been reached."
        else:
            reason = "Gemini is temporarily unavailable."

        if not hits:
            return (
                f"Mock mode is active because {reason} "
                "No matching document context was provided for this request."
            )

        best_hit = hits[0]
        related = "\n".join(f"- {hit.document_name}" for hit in hits[:3])
        return (
            f"Mock mode is active because {reason}\n\n"
            f"Based on {best_hit.document_name}: {best_hit.summary_content[:360]}\n\n"
            f"Related documents:\n{related}"
        )
