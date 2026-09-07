import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const baseInput = "tap-target w-full rounded-xl border border-desk-line bg-white px-3.5 py-3 text-[0.98rem] leading-5 text-desk-ink shadow-[0_1px_2px_rgba(0,0,0,0.03)] outline-none transition placeholder:text-desk-ink/35 hover:border-desk-ink/20 focus:border-desk-green focus:ring-4 focus:ring-desk-green/10";

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) { return <input {...props} className={`${baseInput} ${props.className ?? ""}`} />; }
export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) { return <textarea {...props} className={`${baseInput} min-h-20 resize-y ${props.className ?? ""}`} />; }
export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) { return <select {...props} className={`${baseInput} appearance-none bg-white ${props.className ?? ""}`}>{props.children}</select>; }

export function Checkbox({ id, label, checked, onChange }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-desk-line bg-desk-paper/45 p-3.5 transition hover:bg-desk-paper"><input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 rounded border-desk-line text-desk-green focus:ring-desk-green/30" /><span className="text-sm leading-5 text-desk-ink">{label}</span></label>;
}

export function CheckboxGroup({ options, value, onChange }: { options: readonly string[]; value: string[]; onChange: (v: string[]) => void }) {
  function toggle(opt: string) { if (value.includes(opt)) onChange(value.filter((v) => v !== opt)); else onChange([...value, opt]); }
  return <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">{options.map((opt) => <label key={opt} className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-desk-line bg-white p-3 text-sm text-desk-ink"><input type="checkbox" checked={value.includes(opt)} onChange={() => toggle(opt)} className="h-4 w-4 rounded border-desk-line text-desk-green focus:ring-desk-green/30" />{opt}</label>)}</div>;
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`tap-target w-full rounded-xl bg-desk-green px-4 py-3.5 text-base font-extrabold text-white shadow-sm transition hover:-translate-y-px hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-desk-green/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 ${props.className ?? ""}`} />;
}
export function SecondaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className={`tap-target w-full rounded-xl border border-desk-green bg-white px-4 py-3.5 text-base font-extrabold text-desk-green transition hover:bg-desk-paper focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-desk-green/15 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${props.className ?? ""}`} />;
}
