import axios from "axios";
import type {
  ChatMessage,
  ChatResponse,
  Major,
  University,
  UniversityCreate,
  UniversityFilters,
  UniversityUpdate,
  VisaStep,
} from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || "http://localhost:8000",
  timeout: 30000,
});

export function setAdminKey(key: string | null) {
  if (key) {
    api.defaults.headers.common["X-Admin-Key"] = key;
  } else {
    delete api.defaults.headers.common["X-Admin-Key"];
  }
}

export async function sendChatMessage(
  messages: Array<Pick<ChatMessage, "role" | "content"> | ChatMessage>,
  language: "en" | "ar" = "en"
): Promise<ChatResponse> {
  const { data } = await api.post<ChatResponse>("/api/chat", {
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    language,
  });
  return data;
}

export async function fetchMajors(lang: string = "en"): Promise<Major[]> {
  const { data } = await api.get<Major[]>("/api/majors", { params: { lang } });
  return data;
}

export async function fetchUniversities(filters: UniversityFilters = {}, lang: string = "en"): Promise<University[]> {
  const { data } = await api.get<University[]>("/api/universities", { params: { ...filters, lang } });
  return data;
}

export async function fetchUniversity(id: number, lang: string = "en"): Promise<University> {
  const { data } = await api.get<University>(`/api/universities/${id}`, { params: { lang } });
  return data;
}

export async function fetchVisaSteps(lang: string = "en"): Promise<VisaStep[]> {
  const { data } = await api.get<VisaStep[]>("/api/visa-steps", { params: { lang } });
  return data;
}

export async function createUniversity(payload: UniversityCreate): Promise<University> {
  const { data } = await api.post<University>("/api/admin/universities", payload);
  return data;
}

export async function updateUniversity(id: number, payload: UniversityUpdate): Promise<University> {
  const { data } = await api.put<University>(`/api/admin/universities/${id}`, payload);
  return data;
}

export async function deleteUniversity(id: number): Promise<void> {
  await api.delete(`/api/admin/universities/${id}`);
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (error.message === "Network Error") return "Cannot reach the API. Is the backend running?";
    return error.message;
  }
  return "Something went wrong";
}
