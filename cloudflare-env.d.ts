declare namespace Cloudflare {
  interface Env {
    DB?: D1Database;
    BUCKET?: R2Bucket;
    OPENAI_API_KEY?: string;
    OPENAI_MODEL?: string;
    AI_PROVIDER?: 'gemini' | 'openai';
    GEMINI_API_KEY?: string;
    GEMINI_MODEL?: string;
    ADMIN_USER_ID?: string;
    AUTH_MODE?: 'password' | 'chatgpt';
  }
}
