-- Attach the narrated videos to the How to Grow Cassava lessons (production data).
-- Only fills lessons that have no video yet, so admin edits are never overwritten.
UPDATE "lessons" AS l SET "video_url" = '/videos/grow-cassava/choosing-a-good-site.mp4', "video_poster" = '/videos/grow-cassava/choosing-a-good-site.jpg', "video_captions" = '/videos/grow-cassava/choosing-a-good-site.vtt', "video_duration_sec" = 51, "video_size_bytes" = 416621, "video_credit" = 'Narrated illustration video by JesTech. Synthetic voice: Piper TTS (LibriTTS voice, CC BY 4.0).'
FROM "course_modules" AS m, "courses" AS c
WHERE l."module_id" = m."id" AND m."course_id" = c."id" AND c."slug" = 'grow-cassava' AND l."slug" = 'choosing-a-good-site' AND l."video_url" IS NULL;
--> statement-breakpoint
UPDATE "lessons" AS l SET "video_url" = '/videos/grow-cassava/healthy-stems-make-healthy-plants.mp4', "video_poster" = '/videos/grow-cassava/healthy-stems-make-healthy-plants.jpg', "video_captions" = '/videos/grow-cassava/healthy-stems-make-healthy-plants.vtt', "video_duration_sec" = 50, "video_size_bytes" = 425567, "video_credit" = 'Narrated illustration video by JesTech. Synthetic voice: Piper TTS (LibriTTS voice, CC BY 4.0).'
FROM "course_modules" AS m, "courses" AS c
WHERE l."module_id" = m."id" AND m."course_id" = c."id" AND c."slug" = 'grow-cassava' AND l."slug" = 'healthy-stems-make-healthy-plants' AND l."video_url" IS NULL;
--> statement-breakpoint
UPDATE "lessons" AS l SET "video_url" = '/videos/grow-cassava/preparing-the-land.mp4', "video_poster" = '/videos/grow-cassava/preparing-the-land.jpg', "video_captions" = '/videos/grow-cassava/preparing-the-land.vtt', "video_duration_sec" = 37, "video_size_bytes" = 313899, "video_credit" = 'Narrated illustration video by JesTech. Synthetic voice: Piper TTS (LibriTTS voice, CC BY 4.0).'
FROM "course_modules" AS m, "courses" AS c
WHERE l."module_id" = m."id" AND m."course_id" = c."id" AND c."slug" = 'grow-cassava' AND l."slug" = 'preparing-the-land' AND l."video_url" IS NULL;
--> statement-breakpoint
UPDATE "lessons" AS l SET "video_url" = '/videos/grow-cassava/planting-your-cuttings.mp4', "video_poster" = '/videos/grow-cassava/planting-your-cuttings.jpg', "video_captions" = '/videos/grow-cassava/planting-your-cuttings.vtt', "video_duration_sec" = 39, "video_size_bytes" = 352583, "video_credit" = 'Narrated illustration video by JesTech. Synthetic voice: Piper TTS (LibriTTS voice, CC BY 4.0).'
FROM "course_modules" AS m, "courses" AS c
WHERE l."module_id" = m."id" AND m."course_id" = c."id" AND c."slug" = 'grow-cassava' AND l."slug" = 'planting-your-cuttings' AND l."video_url" IS NULL;
--> statement-breakpoint
UPDATE "lessons" AS l SET "video_url" = '/videos/grow-cassava/caring-for-young-cassava.mp4', "video_poster" = '/videos/grow-cassava/caring-for-young-cassava.jpg', "video_captions" = '/videos/grow-cassava/caring-for-young-cassava.vtt', "video_duration_sec" = 32, "video_size_bytes" = 289126, "video_credit" = 'Narrated illustration video by JesTech. Synthetic voice: Piper TTS (LibriTTS voice, CC BY 4.0).'
FROM "course_modules" AS m, "courses" AS c
WHERE l."module_id" = m."id" AND m."course_id" = c."id" AND c."slug" = 'grow-cassava' AND l."slug" = 'caring-for-young-cassava' AND l."video_url" IS NULL;
--> statement-breakpoint
UPDATE "lessons" AS l SET "video_url" = '/videos/grow-cassava/spotting-and-managing-problems.mp4', "video_poster" = '/videos/grow-cassava/spotting-and-managing-problems.jpg', "video_captions" = '/videos/grow-cassava/spotting-and-managing-problems.vtt', "video_duration_sec" = 47, "video_size_bytes" = 400375, "video_credit" = 'Narrated illustration video by JesTech. Synthetic voice: Piper TTS (LibriTTS voice, CC BY 4.0).'
FROM "course_modules" AS m, "courses" AS c
WHERE l."module_id" = m."id" AND m."course_id" = c."id" AND c."slug" = 'grow-cassava' AND l."slug" = 'spotting-and-managing-problems' AND l."video_url" IS NULL;
--> statement-breakpoint
UPDATE "lessons" AS l SET "video_url" = '/videos/grow-cassava/when-and-how-to-harvest.mp4', "video_poster" = '/videos/grow-cassava/when-and-how-to-harvest.jpg', "video_captions" = '/videos/grow-cassava/when-and-how-to-harvest.vtt', "video_duration_sec" = 41, "video_size_bytes" = 353785, "video_credit" = 'Narrated illustration video by JesTech. Synthetic voice: Piper TTS (LibriTTS voice, CC BY 4.0).'
FROM "course_modules" AS m, "courses" AS c
WHERE l."module_id" = m."id" AND m."course_id" = c."id" AND c."slug" = 'grow-cassava' AND l."slug" = 'when-and-how-to-harvest' AND l."video_url" IS NULL;
--> statement-breakpoint
UPDATE "lessons" AS l SET "video_url" = '/videos/grow-cassava/handling-and-processing.mp4', "video_poster" = '/videos/grow-cassava/handling-and-processing.jpg', "video_captions" = '/videos/grow-cassava/handling-and-processing.vtt', "video_duration_sec" = 39, "video_size_bytes" = 357527, "video_credit" = 'Narrated illustration video by JesTech. Synthetic voice: Piper TTS (LibriTTS voice, CC BY 4.0).'
FROM "course_modules" AS m, "courses" AS c
WHERE l."module_id" = m."id" AND m."course_id" = c."id" AND c."slug" = 'grow-cassava' AND l."slug" = 'handling-and-processing' AND l."video_url" IS NULL;
--> statement-breakpoint
UPDATE "lessons" AS l SET "video_url" = '/videos/grow-cassava/selling-your-produce.mp4', "video_poster" = '/videos/grow-cassava/selling-your-produce.jpg', "video_captions" = '/videos/grow-cassava/selling-your-produce.vtt', "video_duration_sec" = 41, "video_size_bytes" = 346926, "video_credit" = 'Narrated illustration video by JesTech. Synthetic voice: Piper TTS (LibriTTS voice, CC BY 4.0).'
FROM "course_modules" AS m, "courses" AS c
WHERE l."module_id" = m."id" AND m."course_id" = c."id" AND c."slug" = 'grow-cassava' AND l."slug" = 'selling-your-produce' AND l."video_url" IS NULL;
