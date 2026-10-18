/* eslint-disable @next/next/no-img-element */
export function ImageInput({ current, name = "image", label = "Image", removeName = "removeImage" }: { current?: string | null; name?: string; label?: string; removeName?: string }) {
  return (
    <div>
      <label className="a-label">{label}</label>
      <div className="flex flex-wrap items-center gap-3">
        {current && <img src={current} alt="" className="h-16 w-24 rounded-lg border border-slate-200 object-cover" />}
        <input type="file" name={name} accept="image/jpeg,image/png,image/webp" className="text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold" />
        {current && (
          <label className="flex items-center gap-1.5 text-xs text-slate-600">
            <input type="checkbox" name={removeName} /> Remove
          </label>
        )}
      </div>
      <p className="mt-1 text-xs text-slate-400">JPG/PNG/WebP. Automatically compressed.</p>
    </div>
  );
}
