# GenteQ

Website voor GenteQ — energieoplossingen. Gebouwd op Next.js 15 + Payload CMS 3 met Supabase (Postgres + Storage), Upstash Redis voor rate limiting en Resend voor transactional email.

## Stack

- **Framework:** Next.js 15 (App Router) + React 19
- **CMS:** Payload 3 (shared Postgres pooler via Supabase)
- **Database:** Supabase Postgres (pooled, eu-west-3)
- **Media:** Supabase S3-compatible Storage
- **Rate limiting:** Upstash Redis
- **Email:** Resend (`noreply@feitsma.be`)
- **Hosting:** Vercel
- **Testing:** Playwright (e2e) + Vitest (unit)

## Lokaal draaien

**Vereisten:** Node 22.x, pnpm 9 of 10.

```bash
pnpm install
cp .env.example .env   # vul secrets in (zie HANDLEIDING.md voor bronnen)
pnpm dev
```

Admin: `http://localhost:3000/admin` — Frontend: `http://localhost:3000`.

## Branches

- `main` → productie (Vercel project `genteq-2`)
- `dev` → preview-omgeving, alle feature-werk gaat hier eerst

## Meer info

- [docs/HANDLEIDING.md](docs/HANDLEIDING.md) — klant-handleiding admin panel
- [docs/meeting-2026-04-14-design-kickoff.md](docs/meeting-2026-04-14-design-kickoff.md) — design kickoff notes
