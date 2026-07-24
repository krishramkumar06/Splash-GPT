# Splash HQ

**One file. No installs, no accounts, no servers.** Splash HQ is the manual, the
semester calendar, and the email generator for running Splash & Sprout — all inside
`Splash HQ.html`.

*(New here, wondering why an app called Splash HQ lives in a repo called
Splash-GPT? [Here's the story.](#where-this-came-from))*

## What this is

[Yale Splash](https://yale.learningu.org) is Yale's largest educational outreach
organization: each semester, hundreds of local 7th–12th graders come to campus
for a day of classes taught by Yale students on whatever they're excited to
teach. Its sibling program, Sprout, does the same for 6th–9th graders over a
two-day weekend. Both are run by a small student board that turns over almost
completely every year — so every semester, someone new has to figure out how to
run a several-hundred-person program from scratch.

Splash HQ is how that knowledge survives the turnover. It packs a decade of
institutional how-to, a computed timeline of every deadline and email in the
semester, and twenty pre-filled email templates into a single dependency-free
HTML file. A brand-new director can double-click it and see exactly what to do
and when.

## How to use it

1. Open the live version at **https://yalesplashgpt.org** — or download
   `Splash HQ.html` (from this repo or the board Drive) and double-click
   it; it works offline either way.
2. Enter the board password (ask any current director).

This repo mirrors the `Handbook — Splash HQ` folder in the board Drive. After
editing the wiki and running `rebuild.py`, push the folder here — Vercel
redeploys yalesplashgpt.org automatically.

The password keeps casual visitors out, but it is **not** real security — the
handbook text lives inside the file for anyone who opens the source. Don't put
truly sensitive things (bank details, personal info) in the docs.

## What's inside

- **This semester** — a dated timeline of every deadline and every email to send,
  computed from Setup, with a "today" marker. Two buttons up top:
  **Download calendar (.ics)** imports the whole plan into the yalesplash Google
  Calendar, and **Copy meeting agenda** drafts your weekly directors' meeting
  agenda from whatever is due in the next two weeks.
- **Email studio** — 20 templates (semester emails plus panlist/Instagram blurbs),
  pre-filled from Setup. Edit the preview inline, then **Copy email (formatted)**
  into Gmail or the website's email panel. `{{user.first_name}}` tags stay as-is —
  the website fills those per recipient.
- **Handbook** — the Hitchhiker's Guide, website docs, and 2025 email archive,
  searchable (multi-word, ranked). For real semantic Q&A, use **Ask the handbook**:
  paste a free Gemini API key once (aistudio.google.com/apikey) and ask anything —
  the entire handbook is sent as context over the API. Why not just paste it into a
  chatbot yourself? The full pack is ~120k tokens, which overflows most chat paste
  boxes; that's also why there are per-source copy buttons (guide ~76k, website
  docs ~32k, email archive ~13k) and a download button for file-upload workflows.
- **Setup** — program date, deadlines, links, Zoom sessions. The **Estimate the
  empty deadlines** button fills every blank deadline from the program day using
  typical semester spacing — then sanity-check against breaks and midterms.
  Everything saves in your browser; **Download config file** and drop it in this
  folder so co-directors can **Load** the same one.
- **Dark mode** — toggle in the top right; it remembers your choice.

## Start of a new semester (directors' checklist)

1. **Setup** → **Start a fresh semester** → pick the program.
2. Enter the program day → **Estimate the empty deadlines** → adjust.
3. Paste in this semester's Google Form links as you create them.
4. **Download config file** → put it in this folder, named by semester.
5. **This semester** → **Download calendar (.ics)** → import into the shared
   Google Calendar. Live out of that tab all semester.

## The wiki (updating the handbook)

As of July 2026 the guide lives in `wiki/` as one small page per task, grouped
into sections S0–S7. Each page starts with an **Owner / Last reviewed / Status**
line. The old monolithic Hitchhiker's Guide was split into these pages
(original frozen in `archive/`).

To update the handbook:

1. Edit the page in `wiki/` (or add a new one — copy an existing page's header).
2. Update its "Last reviewed" line.
3. In a terminal, from this folder: `python3 rebuild.py`
   (it compiles every wiki page into the app and lists any pages whose review
   date has gone stale).
4. Re-upload `Splash HQ.html` to the Drive.

Steps 1–2 are the ones that matter — the wiki files are the source of truth,
so even if nobody around can run Python, edit the pages anyway and leave the
rebuild for later. Every program's Phil (see wiki S0.03) ends by assigning
wiki edits; that's how this handbook stays alive.

## Changing the password

The app stores only a SHA-256 hash. To change it, compute the new hash
(`python3 -c "import hashlib;print(hashlib.sha256(b'newpassword').hexdigest())"`)
and replace the value of `GATE_HASH` in `Splash HQ.html`.

## Folder contents

- `Splash HQ.html` — the app (this is the only file most people need)
- `wiki/` — the handbook source: one page per task, sections S0–S7
- `docs/` — source markdown for the website docs and email archive
- `reference/` — raw source material (e.g., every email a full fall cycle sent)
- `rebuild.py` — compiles `wiki/` + `docs/` into the app
- `archive/` — frozen earlier versions (v1, and the pre-wiki monolithic guide)

## Where this came from

This repo's first life was **SplashGPT**: an AI-powered email template editor
and RAG chatbot for the same org — a Next.js app that pre-filled the semester's
emails and answered questions over the handbook using OpenAI + Pinecone. It
worked, but it needed paid API accounts, a document-ingestion step, and a
server deployment — too much upkeep to hand off to a board that turns over
every year.

In 2026 it was retired and rebuilt as Splash HQ: everything moved into one
static HTML file, the AI Q&A became bring-your-own-Gemini-key, and the
send-date calendar, agenda generator, and calendar export the old app never
had were added. All of SplashGPT's templates and documents were carried over,
and the old app itself lives on in this repo's git history (every commit
before "Replace retired Splash-GPT app").
