# OpsOh v27.59 — Rename Photos 3.0 website refresh

- Refreshes the Rename Photos product page for the live v3.0 release.
- Adds the v3 naming-rule workflow, Before → After previews, reusable recipes, Files rename-in-place support, Original/JPEG/PNG export, ZIP sharing, metadata preservation, Dark Mode, and privacy-safe diagnostics.
- Replaces the five website product-tour images with the finalized v3.0 App Store creatives.
- Updates Rename Photos structured data, FAQ copy, catalog summaries, search index entry, and sitemap lastmod.
- Built from v27.58 without overwriting the prior source package.

# OpsOh v27.58 — Homepage branding correction

- Restored the visible homepage headline to `Focused apps built with purpose & privacy.`
- Removed iOS-only wording from the homepage hero, portfolio note, studio summary, and footer tagline without claiming Android availability before Google approval.
- Left current iOS-specific app/catalog references and platform-specific SEO metadata unchanged because the Android apps are not yet live.
- Synced `data/homepage.json` to the corrected homepage headline and v27.58.
- Preserves all v27.57 Export Calendar AI discovery work unchanged.

# OpsOh v27.56 — Rename Photos AI discovery pass

- Strengthened Rename Photos around high-intent queries such as “bulk rename photos on iPhone” and “rename multiple iPhone photos.”
- Added answer-first batch-renaming copy and FAQPage structured data to the product page.
- Expanded SoftwareApplication structured data with custom naming, numbering, screenshot support, preview, and App Store linkage.
- Repaired weak placeholder FAQ structured data on the primary Rename Photos guide and refreshed its metadata/date.
- Updated app/entity/search indexes and sitemap freshness for the product and guide.
- Preserves GA4 tracking and the v27.54/v27.55 crawler and Export Reminders work.

# OpsOh.com v27.48 — Source of Truth

Definitive deployable website package as of 2026-08-16.

Key properties:
- Static, crawlable HTML with canonical URLs and structured data
- Valid sitemap and open robots.txt
- Explicitly open to Googlebot, Bingbot, OAI-SearchBot/GPTBot, and Anthropic Claude crawlers
- Concise llms.txt and ai.txt convenience summaries
- Machine-readable app, guide, entity, site, and search indexes synchronized to v27.48
- Export Health product page + 3 Health guides
- Premium Games page
- Date Stamp Photos replaces SunPath in homepage featured placement
- Historical QA/audit artifacts removed from production package

This ZIP is intended for Cloudflare Pages direct upload.

## v27.47 SEO title hardening
- Expanded short top-level page titles flagged by Bing while keeping them concise and descriptive for Google.
- Updated Apps, Guides, Studio, Videos, Support, and Privacy title metadata plus matching machine-readable indexes.
- No visual layout or content changes.


## v27.48 structured-data and search repair
- Added the supplied 2048×2048 transparent OpsOh logo to Organization structured data sitewide.
- Repaired copied/mismatched Article and Breadcrumb schema URLs so each page describes its own canonical URL.
- Added Article/BlogPosting image, datePublished, and dateModified fields using existing page metadata and known content/sitemap dates.
- Normalized article author/publisher references to the canonical OpsOh Organization entity.
- Tightened metadata on a small set of high-value pages specifically flagged by the Search Console audit; no visual layout changes.
- Preserved expected trailing-slash redirects and existing canonical architecture.

## v27.51
- Updated homepage SEO title to: `OpsOh — Focused Apps Built with Purpose & Privacy`.
- Kept visible iOS-specific homepage copy unchanged pending Android approval.
- Synced the new homepage title across HTML title, Open Graph, Twitter, and WebPage structured data.


## v27.54 AI discovery pass (2026-09-14)

- Explicitly allows `Google-Extended` in `robots.txt` while preserving existing crawler policy.
- Refreshes sitemap `lastmod` to 2026-09-14 for priority product pages: Export Calendar, Export Reminders, and Rename Photos.
- Preserves the GA4 installation introduced in v27.53.


## v27.55 — Export Reminders AI discovery pass
- Strengthened Export Reminders intent language around Apple Reminders, CSV, and JSON.
- Added answer-first FAQ content and FAQPage structured data.
- Improved SoftwareApplication structured data and OpsOh publisher linkage.
- Strengthened Export Reminders copy in the app catalog.


## v27.57 — Export Calendar AI discovery pass
- Strengthened Export Calendar product metadata around high-intent CSV/ICS export queries.
- Added richer SoftwareApplication and FAQPage structured data.
- Reworked visible FAQs to answer common iPhone calendar export questions directly.
- Refreshed the calendar export guide and sitemap freshness.
- Corrected Export Calendar lightbox alt text.

## v27.60 — Rename Photos deployment consistency fix
- Preserves the v27.59 Rename Photos v3.0 page/content refresh.
- Replaces the shared `/assets/img/apps/rename-photos-v3-20260915.png` asset with the current Rename Photos v3 icon so Support/catalog surfaces no longer use the old icon.
- Updates Rename Photos screenshot lightbox targets to the same v3 PNG assets used by the visible product tour.
- Adds small HTML build comments to `/apps/rename-photos/` and `/support/` for deployment verification.


## v27.61 — Rename Photos v3 cache-bust
- No product-copy redesign.
- Added never-before-used filenames for the Rename Photos v3 icon and all five v3 screenshots.
- Updated Rename Photos page to those new URLs.
- Updated shared Rename Photos icon references to a new versioned filename to prevent stale edge/browser asset reuse.
- Kept prior asset files for backward compatibility.


## v27.62 — Rename Photos final v3 screenshots
Replaced the mistakenly reused pre-v3 Rename Photos tour artwork with the six finalized v3.0 App Store creatives from 2026-09-14. Updated the product-tour captions and hero preview to match the live v3 workflow.
## v27.63 — Google Play launch + platform-neutral brand pass
- Added OpsOh X profile to sitewide social links and Organization structured data.
- Added the verified OpsOh Google Play developer profile to Organization structured data.
- Added Google Play availability and store links for Export Calendar only.
- Updated Export Calendar page, catalog surfaces, support copy, and structured data for iPhone + Android availability.
- Replaced company-wide iOS-only wording with platform-neutral OpsOh wording while keeping iPhone/iOS-specific app and guide language intact.
- Original v27.62 source preserved; this build is a derived update.



## v27.63.1 — Google Play badge visual balance

- Adjusted only Google Play badge display sizing to compensate for transparent padding in Google’s official PNG.
- No copy, links, page structure, App Store badge sizing, or social links changed.

## v27.63.3 cleanup
- Platform-neutral support landing page wording.
- Platform-neutral privacy landing page title.
- Refreshed internal search-index entries for company-wide pages and Export Calendar.
- Updated llms.txt freshness date to September 17, 2026.
