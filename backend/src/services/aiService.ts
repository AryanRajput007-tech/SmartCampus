import axios from 'axios';
import { config } from '../config/env';

export interface MatchResult {
  match_score: number;
  matched_skills: string[];
  missing_skills: string[];
  recommendation: string;
}

export interface ChatResult {
  response: string;
  source: 'gemini' | 'fallback';
}

/**
 * Communicates with the Python FastAPI AI Service.
 * Implements resilient error handling and graceful fallbacks.
 */
export class AiService {
  private static client = axios.create({
    baseURL: config.aiServiceUrl,
    timeout: 10000 // 10 second timeout
  });

  /**
   * Request job-to-profile matching from the Python FastAPI AI service.
   */
  public static async matchProfileWithJob(
    studentSkills: string[],
    studentProfileText: string,
    requiredSkills: string[],
    jobDescription: string
  ): Promise<MatchResult> {
    try {
      const response = await this.client.post('/ai/match', {
        student_skills: studentSkills,
        student_profile_text: studentProfileText,
        required_skills: requiredSkills,
        job_description: jobDescription
      });

      return response.data;
    } catch (error: any) {
      console.warn(`[AiService] FastAPI matching unavailable (${error.message}). Using local rule-based fallback.`);
      return this.localFallbackMatch(studentSkills, requiredSkills);
    }
  }

  /**
   * Request placement assistance chat response.
   */
  public static async chatWithAssistant(
    message: string,
    context?: string
  ): Promise<ChatResult> {
    try {
      const response = await this.client.post('/ai/chat', {
        message,
        context: context || 'Placement and career interview assistance'
      });

      return {
        response: response.data.response,
        source: response.data.source || 'gemini'
      };
    } catch (error: any) {
      console.warn(`[AiService] FastAPI chat unavailable (${error.message}). Using fallback placement knowledge.`);
      return {
        response: this.localFallbackChat(message),
        source: 'fallback'
      };
    }
  }

  /**
   * Local skill-overlap fallback if Python service is unreachable.
   */
  private static localFallbackMatch(studentSkills: string[], requiredSkills: string[]): MatchResult {
    const normStudent = studentSkills.map((s) => s.trim().toLowerCase());
    const normReq = requiredSkills.map((s) => s.trim().toLowerCase());

    const matched = requiredSkills.filter((req) =>
      normStudent.includes(req.trim().toLowerCase())
    );

    const missing = requiredSkills.filter((req) =>
      !normStudent.includes(req.trim().toLowerCase())
    );

    const score = requiredSkills.length > 0
      ? Math.round((matched.length / requiredSkills.length) * 100)
      : 50;

    let recommendation = '';
    if (score >= 80) {
      recommendation = 'Strong match! Your skill set aligns closely with the core requirements. Prepare to discuss relevant project examples in your interview.';
    } else if (score >= 50) {
      recommendation = `Good potential match. You meet ${matched.length} of ${requiredSkills.length} key skills. Consider brushing up on: ${missing.slice(0, 3).join(', ')}.`;
    } else {
      recommendation = `Growth opportunity. Prioritize learning foundational concepts in: ${missing.slice(0, 3).join(', ')} before applying.`;
    }

    return {
      match_score: score,
      matched_skills: matched,
      missing_skills: missing,
      recommendation
    };
  }

  /**
   * Local smart fallback for common placement questions if Gemini API is unreachable.
   */
  private static localFallbackChat(message: string): string {
    const lower = message.toLowerCase();

    if (lower.includes('resume') || lower.includes('cv')) {
      return (
        'Resume Preparation Tips:\n' +
        '1. Keep it to a clean 1-page format (ATS-friendly, no multi-column graphics).\n' +
        '2. Use the XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".\n' +
        '3. Highlight measurable project impact (e.g. reduced load times, handled 500+ items).\n' +
        '4. Place your strongest tech stack and GitHub links at the top.'
      );
    }

    if (lower.includes('interview') || lower.includes('dsa') || lower.includes('prep')) {
      return (
        'Placement Interview Strategy:\n' +
        '1. Core CS Fundamentals: Practice OOP, DBMS (indexing, ACID, normalization), Operating Systems (processes vs threads), and Computer Networks.\n' +
        '2. Live Coding: Verbalize your thought process before writing code. Analyze time/space complexity upfront.\n' +
        '3. Behavioral (STAR method): Situation, Task, Action, Result for leadership and teamwork questions.\n' +
        '4. Project Deep Dive: Be ready to explain your architecture decisions, database choices, and trade-offs.'
      );
    }

    return (
      'The SmartCampus AI Placement Assistant is operating in standby mode. ' +
      'Here are key tips for your placement preparation: Ensure your profile skills and projects are fully updated, ' +
      'tailor your resume to each job description, and practice explaining your full-stack architecture and trade-offs clearly.'
    );
  }
}
