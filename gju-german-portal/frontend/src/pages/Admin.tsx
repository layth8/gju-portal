import { FormEvent, useEffect, useState } from "react";
import { Lock, Pencil, Plus, Trash2 } from "lucide-react";
import {
  createUniversity,
  deleteUniversity,
  fetchMajors,
  fetchUniversities,
  getErrorMessage,
  setAdminKey,
  updateUniversity,
} from "../api/client";
import { useToast } from "../components/Toast";
import type { Major, University, UniversityCreate } from "../types";

const KEY_STORAGE = "gju-admin-key";

const EMPTY: UniversityCreate = {
  name: "",
  city: "",
  state: "",
  min_german_level: "B1",
  min_english_level: "B2",
  website_url: "https://",
  description: "",
  major_ids: [],
};

export function Admin() {
  const { notify } = useToast();
  const [key, setKey] = useState(sessionStorage.getItem(KEY_STORAGE) || "");
  const [unlocked, setUnlocked] = useState(Boolean(sessionStorage.getItem(KEY_STORAGE)));
  const [universities, setUniversities] = useState<University[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [form, setForm] = useState<UniversityCreate>(EMPTY);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (unlocked && key) setAdminKey(key);
  }, [unlocked, key]);

  async function load() {
    try {
      const [uni, majorList] = await Promise.all([fetchUniversities(), fetchMajors()]);
      setUniversities(uni);
      setMajors(majorList);
    } catch (error) {
      notify(getErrorMessage(error), "error");
    }
  }

  useEffect(() => {
    if (unlocked) void load();
  }, [unlocked]);

  function unlock(event: FormEvent) {
    event.preventDefault();
    if (!key.trim()) {
      notify("Enter the admin key", "error");
      return;
    }
    sessionStorage.setItem(KEY_STORAGE, key.trim());
    setAdminKey(key.trim());
    setUnlocked(true);
    notify("Admin session started", "success");
  }

  function startEdit(university: University) {
    setEditingId(university.id);
    setForm({
      name: university.name,
      city: university.city,
      state: university.state,
      min_german_level: university.min_german_level,
      min_english_level: university.min_english_level,
      website_url: university.website_url,
      description: university.description,
      major_ids: university.majors.map((major) => major.id),
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      if (editingId) {
        await updateUniversity(editingId, form);
        notify("University updated", "success");
      } else {
        await createUniversity(form);
        notify("University created", "success");
      }
      resetForm();
      await load();
    } catch (error) {
      notify(getErrorMessage(error), "error");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id: number) {
    if (!window.confirm("Delete this university?")) return;
    try {
      await deleteUniversity(id);
      notify("University deleted", "success");
      if (editingId === id) resetForm();
      await load();
    } catch (error) {
      notify(getErrorMessage(error), "error");
    }
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-stone-200 bg-white p-8 dark:border-white/10 dark:bg-white/5">
        <Lock className="mb-4 h-8 w-8 text-gju-crimson dark:text-gju-gold" />
        <h1 className="font-display text-3xl">Admin access</h1>
        <p className="mt-2 text-sm text-stone-500">Enter the X-Admin-Key from the backend .env file.</p>
        <form onSubmit={unlock} className="mt-6 space-y-4">
          <input
            type="password"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            placeholder="Admin API key"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 dark:border-white/10 dark:bg-slate-900"
          />
          <button type="submit" className="w-full rounded-full bg-gju-crimson py-2.5 font-medium text-white">
            Unlock panel
          </button>
        </form>
      </div>
    );
  }

  return (
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-gju-crimson dark:text-gju-gold">Staff</p>
          <h1 className="font-display text-4xl">University admin</h1>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm text-white dark:bg-white dark:text-slate-900"
        >
          <Plus className="h-4 w-4" /> Add university
        </button>
      </div>

      <form onSubmit={onSubmit} className="mb-8 grid gap-3 rounded-2xl border border-stone-200 bg-white p-5 dark:border-white/10 dark:bg-white/5 md:grid-cols-2">
        <input
          required
          value={form.name}
          onChange={(event) => setForm({ ...form, name: event.target.value })}
          placeholder="Name"
          className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
        />
        <input
          required
          value={form.city}
          onChange={(event) => setForm({ ...form, city: event.target.value })}
          placeholder="City"
          className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
        />
        <input
          required
          value={form.state}
          onChange={(event) => setForm({ ...form, state: event.target.value })}
          placeholder="State"
          className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
        />
        <input
          required
          value={form.website_url}
          onChange={(event) => setForm({ ...form, website_url: event.target.value })}
          placeholder="Website URL"
          className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
        />
        <select
          value={form.min_german_level}
          onChange={(event) => setForm({ ...form, min_german_level: event.target.value })}
          className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
        >
          <option>B1</option>
          <option>B2</option>
          <option>TestDaF</option>
        </select>
        <input
          required
          value={form.min_english_level}
          onChange={(event) => setForm({ ...form, min_english_level: event.target.value })}
          placeholder="Min English level"
          className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
        />
        <textarea
          required
          minLength={10}
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
          placeholder="Description"
          className="md:col-span-2 min-h-24 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 dark:border-white/10 dark:bg-slate-900"
        />
        <div className="md:col-span-2">
          <p className="mb-2 text-sm text-stone-500">Compatible majors</p>
          <div className="flex flex-wrap gap-2">
            {majors.map((major) => {
              const selected = form.major_ids.includes(major.id);
              return (
                <button
                  key={major.id}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      major_ids: selected
                        ? form.major_ids.filter((id) => id !== major.id)
                        : [...form.major_ids, major.id],
                    })
                  }
                  className={`rounded-full px-3 py-1 text-xs ${
                    selected
                      ? "bg-gju-crimson text-white"
                      : "bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-stone-300"
                  }`}
                >
                  {major.name}
                </button>
              );
            })}
          </div>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-gju-crimson py-2.5 text-sm font-medium text-white disabled:opacity-60 md:col-span-2"
        >
          {busy ? "Saving…" : editingId ? "Save changes" : "Create university"}
        </button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-stone-200 dark:border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-stone-100 text-stone-500 dark:bg-white/5">
            <tr>
              <th className="px-4 py-3 font-medium">University</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">German</th>
              <th className="px-4 py-3 font-medium">Majors</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {universities.map((university) => (
              <tr key={university.id} className="border-t border-stone-200 dark:border-white/10">
                <td className="px-4 py-3 font-medium">{university.name}</td>
                <td className="px-4 py-3">
                  {university.city}, {university.state}
                </td>
                <td className="px-4 py-3">{university.min_german_level}</td>
                <td className="px-4 py-3 text-stone-500">{university.majors.map((major) => major.name).join(", ") || "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => startEdit(university)} className="rounded-full p-2 hover:bg-stone-100 dark:hover:bg-white/10">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => onDelete(university.id)} className="rounded-full p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
