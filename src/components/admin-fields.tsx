import type { Course, Resource } from "@/db/schema";
import type { StorageMode } from "@/lib/storage";
import { courseIcons } from "./brand";
import { FileUpload } from "./file-upload";
import { Field, Input, Select, Textarea } from "./ui";

export function CourseFields({ c, resources }: { c?: Course; resources: Array<{ id: string; title: string }> }) {
  return (
    <>
      <input type="hidden" name="id" value={c?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" htmlFor="title">
          <Input id="title" name="title" defaultValue={c?.title} required />
        </Field>
        <Field label="Web address (slug)" htmlFor="slug" hint="e.g. grow-cassava">
          <Input id="slug" name="slug" defaultValue={c?.slug} required pattern="[a-z0-9\-]+" />
        </Field>
      </div>
      <Field label="Summary" htmlFor="summary">
        <Textarea id="summary" name="summary" defaultValue={c?.summary} rows={2} required />
      </Field>
      <Field label="Audience" htmlFor="audience" hint="Who is this for and how is it delivered?">
        <Textarea id="audience" name="audience" defaultValue={c?.audience} rows={2} required />
      </Field>
      <Field label="Learning outcomes" htmlFor="outcomes" hint='Shown under "You will be able to"'>
        <Textarea id="outcomes" name="outcomes" defaultValue={c?.outcomes} rows={2} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Category" htmlFor="category">
          <Select id="category" name="category" defaultValue={c?.category ?? "Technology"}>
            {["Technology", "Agriculture", "Education", "Entrepreneurship"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        </Field>
        <Field label="Level" htmlFor="level">
          <Select id="level" name="level" defaultValue={c?.level ?? "BEGINNER"}>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </Select>
        </Field>
        <Field label="Format" htmlFor="format">
          <Select id="format" name="format" defaultValue={c?.format ?? "ONLINE"}>
            <option value="ONLINE">Online</option>
            <option value="HYBRID">Hybrid</option>
            <option value="OFFLINE_GUIDE">Offline guide</option>
          </Select>
        </Field>
        <Field label="Icon" htmlFor="icon">
          <Select id="icon" name="icon" defaultValue={c?.icon ?? "book"}>
            {Object.keys(courseIcons).map((k) => (
              <option key={k}>{k}</option>
            ))}
          </Select>
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Downloadable guide" htmlFor="guideResourceId">
          <Select id="guideResourceId" name="guideResourceId" defaultValue={c?.guideResourceId ?? ""}>
            <option value="">None</option>
            {resources.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Reviewer" htmlFor="reviewedBy" hint="Qualified subject reviewer">
          <Input id="reviewedBy" name="reviewedBy" defaultValue={c?.reviewedBy ?? ""} />
        </Field>
      </div>
      <Field label="Review note" htmlFor="reviewNote" hint='Shown in the "Reviewed by experts" box'>
        <Input id="reviewNote" name="reviewNote" defaultValue={c?.reviewNote ?? ""} />
      </Field>
      <div className="flex flex-wrap gap-6 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isPilot" defaultChecked={c?.isPilot} className="size-4 accent-brand" /> Pilot course
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="isFeatured" defaultChecked={c?.isFeatured} className="size-4 accent-brand" /> Feature on home page
        </label>
      </div>
    </>
  );
}

export function ResourceFields({ r, upload }: { r?: Resource; upload: { mode: StorageMode; maxBytes: number } }) {
  return (
    <>
      <input type="hidden" name="id" value={r?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" htmlFor="title">
          <Input id="title" name="title" defaultValue={r?.title} required />
        </Field>
        <Field label="Web address (slug)" htmlFor="slug">
          <Input id="slug" name="slug" defaultValue={r?.slug} required />
        </Field>
      </div>
      <Field label="Description" htmlFor="description">
        <Textarea id="description" name="description" defaultValue={r?.description} rows={2} required />
      </Field>
      <div className="grid gap-4 sm:grid-cols-4">
        <Field label="Subject" htmlFor="subject">
          <Select id="subject" name="subject" defaultValue={r?.subject ?? "Technology"}>
            {["Agriculture", "Education", "Technology", "Entrepreneurship"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        </Field>
        <Field label="Type" htmlFor="kind" hint="Guide, Workbook…">
          <Input id="kind" name="kind" defaultValue={r?.kind ?? "Guide"} required />
        </Field>
        <Field label="Format" htmlFor="format">
          <Select id="format" name="format" defaultValue={r?.format ?? "PDF"}>
            {["PDF", "EPUB", "VIDEO", "AUDIO", "WEB"].map((v) => (
              <option key={v}>{v}</option>
            ))}
          </Select>
        </Field>
        <Field label="Language" htmlFor="language">
          <Input id="language" name="language" defaultValue={r?.language ?? "English"} required />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Audiences" htmlFor="audiences" hint="Comma separated: Farmers, Teachers, Students">
          <Input id="audiences" name="audiences" defaultValue={r?.audiences.join(", ")} />
        </Field>
        <Field label="Author or source" htmlFor="source">
          <Input id="source" name="source" defaultValue={r?.source ?? "JesTech original"} required />
        </Field>
        <Field label="Published" htmlFor="publishedOn" hint="Leave empty if unknown">
          <Input id="publishedOn" name="publishedOn" defaultValue={r?.publishedOn ?? ""} />
        </Field>
      </div>
      <fieldset className="rounded-card border border-brand bg-brand-tint p-4">
        <legend className="px-1 text-sm font-semibold">Rights (required before publishing)</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[14rem_minmax(0,1fr)]">
          <Field label="Licence" htmlFor="licence">
            <Select id="licence" name="licence" defaultValue={r?.licence ?? ""} required>
              <option value="" disabled>
                Select
              </option>
              <option value="OWNED">Owned by JesTech</option>
              <option value="PERMISSION">Permission granted</option>
              <option value="OPEN_LICENCE">Open licence</option>
            </Select>
          </Field>
          <Field label="Licence details" htmlFor="licenceNote" hint="e.g. CC BY 4.0, or who granted permission and for what use">
            <Input id="licenceNote" name="licenceNote" defaultValue={r?.licenceNote} required />
          </Field>
        </div>
      </fieldset>
      <fieldset className="space-y-4">
        <legend className="mb-2 text-sm font-semibold">File</legend>
        <FileUpload mode={upload.mode} maxBytes={upload.maxBytes} />
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="File link" htmlFor="fileUrl" hint="Filled in by the upload, or paste https://… or /files/…">
            <Input id="fileUrl" name="fileUrl" defaultValue={r?.fileUrl ?? ""} />
          </Field>
          <Field label="File size (bytes)" htmlFor="sizeBytes" hint="Shown to users before download">
            <Input id="sizeBytes" name="sizeBytes" type="number" min={0} defaultValue={r?.sizeBytes ?? ""} />
          </Field>
          <Field label="Read-online link" htmlFor="readOnlineUrl">
            <Input id="readOnlineUrl" name="readOnlineUrl" defaultValue={r?.readOnlineUrl ?? ""} />
          </Field>
        </div>
      </fieldset>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Reviewed by" htmlFor="reviewedBy">
          <Input id="reviewedBy" name="reviewedBy" defaultValue={r?.reviewedBy ?? ""} />
        </Field>
        <label className="flex items-center gap-2 self-end pb-3 text-sm">
          <input type="checkbox" name="downloadable" defaultChecked={r?.downloadable ?? true} className="size-4 accent-brand" />
          Download permitted
        </label>
      </div>
    </>
  );
}
