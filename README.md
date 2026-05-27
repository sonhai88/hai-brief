# Hai Brief

Daily tech digest auto-curated by Claude. Live: [hai-brief.vercel.app](https://hai-brief.vercel.app).

```
7h sáng → bot tele-claude-bridge fetch tin tech (HN, GH, AI labs, EU/CN)
        → ghi data/<date>.json + git push
        → Vercel auto-build (~30s)
        → Telegram link cho anh
```

## Stack
- Next.js 16 (App Router, RSC, ISR revalidate 60s)
- Tailwind v4 + Geist
- Static JSON data (`data/*.json`) — bot push qua git

## Data schema (`data/YYYY-MM-DD.json`)
```json
{
  "date": "2026-05-27",
  "generated_at": "ISO",
  "summary": "1-2 dòng tổng quan ngày",
  "sections": [
    {
      "id": "top-stories",
      "icon": "🔥",
      "title": "Top Stories",
      "subtitle": "Hacker News",
      "items": [
        {
          "title": "...",
          "source": "HN",
          "source_url": "https://...",
          "summary": "1-2 dòng tóm tắt",
          "why_care": "1 câu why care cho dev (optional)"
        }
      ]
    }
  ]
}
```

## Dev
```bash
npm run dev    # localhost:3000
npm run build
```

Bot source: `/Volumes/hai/tele-claude-bridge/`
