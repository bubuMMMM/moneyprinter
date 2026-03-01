"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Loader2, X } from "lucide-react";

const VOICES = [
  { value: "en_us_ghostface", label: "Ghost Face" },
  { value: "en_us_chewbacca", label: "Chewbacca" },
  { value: "en_us_c3po", label: "C3PO" },
  { value: "en_us_stitch", label: "Stitch" },
  { value: "en_us_stormtrooper", label: "Stormtrooper" },
  { value: "en_us_rocket", label: "Rocket" },
  { value: "en_au_001", label: "English AU - Female" },
  { value: "en_au_002", label: "English AU - Male" },
  { value: "en_uk_001", label: "English UK - Male 1" },
  { value: "en_uk_003", label: "English UK - Male 2" },
  { value: "en_us_001", label: "English US - Female (Int. 1)" },
  { value: "en_us_002", label: "English US - Female (Int. 2)" },
  { value: "en_us_006", label: "English US - Male 1" },
  { value: "en_us_007", label: "English US - Male 2" },
  { value: "en_us_009", label: "English US - Male 3" },
  { value: "en_us_010", label: "English US - Male 4" },
  { value: "fr_001", label: "French - Male 1" },
  { value: "fr_002", label: "French - Male 2" },
  { value: "de_001", label: "German - Female" },
  { value: "de_002", label: "German - Male" },
  { value: "es_002", label: "Spanish - Male" },
  { value: "es_mx_002", label: "Spanish MX - Male" },
  { value: "br_001", label: "Portuguese BR - Female 1" },
  { value: "br_003", label: "Portuguese BR - Female 2" },
  { value: "br_004", label: "Portuguese BR - Female 3" },
  { value: "br_005", label: "Portuguese BR - Male" },
  { value: "id_001", label: "Indonesian - Female" },
  { value: "jp_001", label: "Japanese - Female 1" },
  { value: "jp_003", label: "Japanese - Female 2" },
  { value: "jp_005", label: "Japanese - Female 3" },
  { value: "jp_006", label: "Japanese - Male" },
  { value: "kr_002", label: "Korean - Male 1" },
  { value: "kr_003", label: "Korean - Female" },
  { value: "kr_004", label: "Korean - Male 2" },
  { value: "en_female_f08_salut_damour", label: "Alto" },
  { value: "en_male_m03_lobby", label: "Tenor" },
  { value: "en_female_f08_warmy_breeze", label: "Warmy Breeze" },
  { value: "en_male_m03_sunshine_soon", label: "Sunshine Soon" },
  { value: "en_male_narration", label: "Narrator" },
  { value: "en_male_funny", label: "Wacky" },
  { value: "en_female_emotional", label: "Peaceful" },
];

const SUBTITLE_POSITIONS = [
  { value: "center,top", label: "Center - Top" },
  { value: "center,bottom", label: "Center - Bottom" },
  { value: "center,center", label: "Center - Center" },
  { value: "left,center", label: "Left - Center" },
  { value: "left,bottom", label: "Left - Bottom" },
  { value: "right,center", label: "Right - Center" },
  { value: "right,bottom", label: "Right - Bottom" },
];

const SUBTITLE_COLORS = [
  { value: "#FFFF00", label: "Yellow (Default)" },
  { value: "#f4a261", label: "Orange" },
  { value: "#e63946", label: "Red" },
  { value: "#1d3557", label: "Blue" },
  { value: "#fff", label: "White" },
  { value: "#03071e", label: "Black" },
];

type Status = "idle" | "generating" | "success" | "error";

interface FormState {
  videoSubject: string;
  aiModel: string;
  voice: string;
  paragraphNumber: number;
  threads: number;
  zipUrl: string;
  customPrompt: string;
  subtitlesPosition: string;
  subtitlesColor: string;
  automateYoutubeUpload: boolean;
  useMusic: boolean;
}

const defaultForm: FormState = {
  videoSubject: "",
  aiModel: "g4f",
  voice: "en_us_001",
  paragraphNumber: 1,
  threads: 2,
  zipUrl: "",
  customPrompt: "",
  subtitlesPosition: "center,bottom",
  subtitlesColor: "#FFFF00",
  automateYoutubeUpload: false,
  useMusic: false,
};

export function GenerateForm() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
          ? Number(value)
          : value,
    }));
  };

  const handleGenerate = async () => {
    if (!form.videoSubject.trim()) {
      setMessage("Veuillez entrer un sujet pour la vidéo.");
      setStatus("error");
      return;
    }

    setStatus("generating");
    setMessage("");

    try {
      const res = await fetch("http://localhost:8080/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          videoSubject: form.videoSubject,
          aiModel: form.aiModel,
          voice: form.voice,
          paragraphNumber: form.paragraphNumber,
          threads: form.threads,
          zipUrl: form.zipUrl,
          customPrompt: form.customPrompt,
          subtitlesPosition: form.subtitlesPosition,
          color: form.subtitlesColor,
          automateYoutubeUpload: form.automateYoutubeUpload,
          useMusic: form.useMusic,
        }),
      });

      const data = await res.json();
      setStatus(data.status === "success" ? "success" : "error");
      setMessage(data.message ?? "Une erreur est survenue.");
    } catch {
      setStatus("error");
      setMessage(
        "Impossible de contacter le serveur. Vérifiez que le backend Flask tourne sur le port 8080."
      );
    }
  };

  const handleCancel = async () => {
    try {
      await fetch("http://localhost:8080/api/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // ignore
    }
    setStatus("idle");
    setMessage("Génération annulée.");
  };

  const isGenerating = status === "generating";

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-6">
      {/* Subject */}
      <Field label="Sujet de la vidéo">
        <textarea
          name="videoSubject"
          rows={3}
          value={form.videoSubject}
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !isGenerating) {
              e.preventDefault();
              handleGenerate();
            }
          }}
          placeholder="Ex: Les 5 secrets des millionnaires..."
          className="input-base resize-none"
          disabled={isGenerating}
        />
      </Field>

      {/* Advanced toggle */}
      <button
        type="button"
        onClick={() => setShowAdvanced((v) => !v)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
      >
        {showAdvanced ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
        {showAdvanced ? "Masquer les options avancées" : "Options avancées"}
      </button>

      {showAdvanced && (
        <div className="flex flex-col gap-5 p-4 rounded-lg border border-border bg-surface">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field label="Modèle IA">
              <select
                name="aiModel"
                value={form.aiModel}
                onChange={handleChange}
                className="input-base"
                disabled={isGenerating}
              >
                <option value="g4f">g4f (Gratuit)</option>
                <option value="gpt3.5-turbo">OpenAI GPT-3.5</option>
                <option value="gpt4">OpenAI GPT-4</option>
                <option value="gemmini">Gemini Pro</option>
              </select>
            </Field>

            <Field label="Voix">
              <select
                name="voice"
                value={form.voice}
                onChange={handleChange}
                className="input-base"
                disabled={isGenerating}
              >
                {VOICES.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Position des sous-titres">
              <select
                name="subtitlesPosition"
                value={form.subtitlesPosition}
                onChange={handleChange}
                className="input-base"
                disabled={isGenerating}
              >
                {SUBTITLE_POSITIONS.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Couleur des sous-titres">
              <select
                name="subtitlesColor"
                value={form.subtitlesColor}
                onChange={handleChange}
                className="input-base"
                disabled={isGenerating}
              >
                {SUBTITLE_COLORS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Threads">
              <input
                type="number"
                name="threads"
                value={form.threads}
                onChange={handleChange}
                min={1}
                max={100}
                className="input-base"
                disabled={isGenerating}
              />
            </Field>

            <Field label="Nombre de paragraphes">
              <input
                type="number"
                name="paragraphNumber"
                value={form.paragraphNumber}
                onChange={handleChange}
                min={1}
                max={100}
                className="input-base"
                disabled={isGenerating}
              />
            </Field>
          </div>

          <Field label="ZIP URL (optionnel)">
            <input
              type="text"
              name="zipUrl"
              value={form.zipUrl}
              onChange={handleChange}
              placeholder="https://..."
              className="input-base"
              disabled={isGenerating}
            />
          </Field>

          <Field label="Prompt personnalisé (optionnel)">
            <textarea
              name="customPrompt"
              rows={3}
              value={form.customPrompt}
              onChange={handleChange}
              placeholder="Laissez vide pour utiliser le prompt par défaut..."
              className="input-base resize-none"
              disabled={isGenerating}
            />
          </Field>

          <div className="flex flex-col gap-3">
            <Toggle
              id="automateYoutubeUpload"
              name="automateYoutubeUpload"
              checked={form.automateYoutubeUpload}
              onChange={handleChange}
              label="Upload automatique sur YouTube"
              disabled={isGenerating}
            />
            <Toggle
              id="useMusic"
              name="useMusic"
              checked={form.useMusic}
              onChange={handleChange}
              label="Ajouter de la musique"
              disabled={isGenerating}
            />
          </div>
        </div>
      )}

      {/* Status message */}
      {message && (
        <div
          className={`flex items-start gap-3 p-4 rounded-lg border text-sm ${
            status === "success"
              ? "bg-accent/10 border-accent/30 text-accent"
              : status === "error"
              ? "bg-destructive/10 border-destructive/30 text-destructive"
              : "bg-muted border-border text-muted-foreground"
          }`}
        >
          <span className="flex-1 leading-relaxed">{message}</span>
          <button
            onClick={() => setMessage("")}
            className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!isGenerating ? (
          <button
            type="button"
            onClick={handleGenerate}
            className="flex-1 min-h-[44px] flex items-center justify-center gap-2 bg-accent text-accent-foreground font-semibold rounded-lg hover:bg-accent/90 transition-colors text-sm"
          >
            Generer
          </button>
        ) : (
          <>
            <div className="flex-1 min-h-[44px] flex items-center justify-center gap-2 bg-surface border border-border rounded-lg text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin text-accent" />
              Generation en cours...
            </div>
            <button
              type="button"
              onClick={handleCancel}
              className="min-h-[44px] px-5 flex items-center justify-center gap-2 bg-destructive/10 border border-destructive/30 text-destructive font-semibold rounded-lg hover:bg-destructive/20 transition-colors text-sm"
            >
              Annuler
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function Toggle({
  id,
  name,
  checked,
  onChange,
  label,
  disabled,
}: {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer select-none group"
    >
      <div className="relative">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only peer"
        />
        <div className="w-9 h-5 rounded-full border border-border bg-muted peer-checked:bg-accent peer-checked:border-accent transition-colors" />
        <div className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-muted-foreground peer-checked:bg-accent-foreground peer-checked:translate-x-4 transition-all" />
      </div>
      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
        {label}
      </span>
    </label>
  );
}
