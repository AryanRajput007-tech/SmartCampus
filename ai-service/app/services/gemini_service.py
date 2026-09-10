import os

from typing import Tuple

from dotenv import load_dotenv

load_dotenv()


class GeminiAssistantService:
    """
    Handles AI placement assistant conversations using Google Gemini API,
    with an automated, robust fallback system.
    """

    _client = None
    _initialized = False

    SYSTEM_INSTRUCTION = (
        "You are the SmartCampus Placement & Career Assistant, helping undergraduate "
        "computer science and engineering students prepare for campus placements, "
        "technical interviews, resume building, and software engineering roles. "
        "Provide clear, concise, actionable advice with concrete technical examples. "
        "Keep responses encouraging, well-structured, realistic, and easy for students "
        "to understand."
    )

    @classmethod
    def _init_gemini(cls):
        if cls._initialized:
            return

        api_key = os.getenv("GEMINI_API_KEY", "").strip()

        if not api_key:
            print("[GeminiAssistant] GEMINI_API_KEY not configured.")
            cls._initialized = True
            return

        try:
            from google import genai

            cls._client = genai.Client(api_key=api_key)

            cls._initialized = True

            print("[GeminiAssistant] Gemini API initialized successfully.")

        except Exception as e:
            print(f"[GeminiAssistant] Failed to configure Gemini API: {e}")
            cls._initialized = True

    @classmethod
    def generate_response(
        cls,
        message: str,
        context: str = ""
    ) -> Tuple[str, str]:
        """
        Generates response using Gemini if configured,
        otherwise returns curated fallback advice.

        Returns:
            (response_text, source)
            source is either 'gemini' or 'fallback'.
        """

        cls._init_gemini()

        if cls._client:
            try:
                prompt = (
                    f"Context:\n{context}\n\n"
                    f"Student Query:\n{message}\n\n"
                    "Answer the student's query directly. "
                    "Use practical examples where helpful. "
                    "Use short headings, bullet points, and code examples "
                    "when appropriate."
                )

                response = cls._client.models.generate_content(
                    model="gemini-3.8-flash",
                    contents=prompt,
                    config={
                        "system_instruction": cls.SYSTEM_INSTRUCTION,
                    },
                )

                if response and response.text:
                    print("[GeminiAssistant] Response generated using Gemini.")
                    return response.text.strip(), "gemini"

            except Exception as e:
                print(
                    f"[GeminiAssistant] API call failed: {e}. "
                    "Falling back to placement engine."
                )

        return cls._get_placement_fallback(message), "fallback"

    @classmethod
    def _get_placement_fallback(cls, message: str) -> str:
        lower = message.lower()

        if any(w in lower for w in ["resume", "cv", "ats"]):
            return (
                "### 📄 SmartCampus Placement Guidance: Resume Best Practices\n\n"
                "1. **Single-Page Rule**: For undergrad campus placements, "
                "strictly keep your resume to 1 page.\n"
                "2. **Google XYZ Formula**: Format bullet points as: "
                "\"Accomplished [X], as measured by [Y], by doing [Z]\".\n"
                "3. **Key Sections**: Education, Technical Skills, Projects, "
                "and Internships/Leadership.\n"
                "4. **ATS Friendly**: Avoid multi-column graphics, text boxes, "
                "or tables that confuse automated parsers."
            )

        if any(w in lower for w in ["dsa", "leetcode", "coding", "algorithm"]):
            return (
                "### 💻 Technical Coding & DSA Preparation Strategy\n\n"
                "1. **Core Patterns**: Two Pointers, Sliding Window, BFS/DFS, "
                "Dynamic Programming, and Heap/Priority Queues.\n"
                "2. **Interview Execution**: Explain the brute-force approach "
                "first, then optimize using the appropriate data structure.\n"
                "3. **Edge Cases**: Test empty arrays, single elements, duplicates, "
                "and extreme bounds."
            )

        if any(
            w in lower
            for w in [
                "hr",
                "behavioral",
                "introduce",
                "tell me about yourself",
                "star",
            ]
        ):
            return (
                "### 🗣️ Behavioral & HR Interview Strategy (STAR Method)\n\n"
                "Structure situational answers using **STAR**:\n"
                "- **Situation**: Briefly set the scene.\n"
                "- **Task**: Explain the challenge or responsibility.\n"
                "- **Action**: Explain specifically what you did.\n"
                "- **Result**: Explain the measurable outcome."
            )

        if any(
            w in lower
            for w in ["mern", "react", "node", "fullstack", "system design"]
        ):
            return (
                "### 🛠️ Full-Stack Interview Essentials (MERN / REST)\n\n"
                "- **Frontend**: React rendering, state management, and custom hooks.\n"
                "- **Backend**: Express middleware, JWT, bcrypt, and error handling.\n"
                "- **Database**: SQL vs NoSQL, MongoDB indexing, and replica sets.\n"
                "- **REST APIs**: HTTP status codes and idempotent operations."
            )

        return (
            "### 🎓 SmartCampus AI Placement Assistant\n\n"
            "I'm here to help you prepare for campus placements! You can ask me about:\n"
            "- **Resume building & review**\n"
            "- **Technical interview questions**\n"
            "- **DSA and coding preparation**\n"
            "- **Behavioral and HR interviews**\n"
            "- **Role-specific skill roadmaps**"
        )

        return (
            "### 🎓 SmartCampus AI Placement Assistant\n\n"
            "I'm here to help you ace your campus placement season! "
            "You can ask me about:\n"
            "- **Resume building & review** (Action verbs, project descriptions, ATS formatting)\n"
            "- **Technical interview questions** (MERN, Python, DSA, DBMS, OS, Networks)\n"
            "- **Coding round preparation tips** (Algorithmic patterns and complexity analysis)\n"
            "- **Behavioral rounds** (STAR framework, failure questions, and self-introduction)\n"
            "- **Role-specific skill roadmaps** (SDE-1, Full-Stack, AI/ML, Backend)"
        )