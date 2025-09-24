"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);

    try {
      const form = e.currentTarget;
      const data = new FormData(form);

      // IMPORTANT for Netlify Forms (v5 runtime):
      // post to "/__forms.html" with urlencoded body,
      // include a hidden "form-name" matching the form "name"
      const res = await fetch("/__forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data as any).toString(),
      });

      if (!res.ok) throw new Error(`Form submit failed: ${res.status}`);

      setStatus("success");
      form.reset();
    } catch (err: unknown) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl bg-white p-6 ring-1 ring-black/5">
      <h2 className="font-serif text-2xl tracking-tight">Let’s talk about your project</h2>
      <p className="mt-1 text-sm text-neutral-600">
        Tell us a bit about your space and goals. We’ll get back to you shortly.
      </p>

      <form
        name="contact"
        onSubmit={handleSubmit}
        className="mt-6 grid grid-cols-1 gap-4"
      >
        {/* Required by Netlify Forms */}
        <input type="hidden" name="form-name" value="contact" />

        {/* Honeypot (anti-spam): keep it hidden from users */}
        <label className="hidden">
          Don’t fill this out if you’re human:
          <input name="bot-field" />
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              name="name"
              required
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Phone (optional)</label>
          <input
            name="phone"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Project Type</label>
          <select
            name="projectType"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
            defaultValue="Kitchen"
          >
            <option>Kitchen</option>
            <option>Bathroom</option>
            <option>Built-ins</option>
            <option>Closets</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Message</label>
          <textarea
            name="message"
            required
            rows={5}
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-neutral-900/10"
            placeholder="Tell us about your space, timeline, and any inspiration."
          />
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
          >
            {status === "loading" ? "Sending…" : "Send message"}
          </button>

          {status === "success" && (
            <span className="text-sm text-green-700">Thanks — we’ll be in touch shortly.</span>
          )}
          {status === "error" && (
            <span className="text-sm text-red-700">Couldn’t send. {error ?? "Please try again."}</span>
          )}
        </div>
      </form>
    </div>
  );
}
