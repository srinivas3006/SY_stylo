# SY STYLO website

Next.js, TypeScript, Tailwind CSS, Framer Motion, GSAP and Lucide.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
npm test           # opening-hours and WhatsApp message logic
```

## Editing salon details

- **`src/config/salon.ts`**: phone, WhatsApp, address, map, hours, owner and social links.
- **`src/config/content.ts`**: services (name, description, photo, `price`, `duration`) and gallery photos.

### Still to confirm

1. **Morning opening time.** Set `openingTime` (for example `"06:15"`). Until then the site says
   "Before 7:00 AM", and it shows "Opens before 7:00 AM" instead of Open or Closed before 7 AM.
   Once you set it, the exact time appears everywhere and is added to the Google structured data.
2. **Prices and durations.** Fill in `price` / `duration` for each service. Services without a
   price show "Price on request".
3. **Real photos.** All service, gallery and hero photos are labelled stock images. Replace each
   file and set `source` / `imageSource` to `"salon"`. The "Illustrative" labels disappear by
   themselves once no stock photos are left. Sources are listed in `public/images/SOURCES.md`.
4. **Social links.** Add full URLs under `social`. Empty ones stay hidden.
5. **Live domain.** Set `NEXT_PUBLIC_SITE_URL` (see `.env.example`) so share previews and SEO use it.

The previous static site is kept unchanged in `_legacy-vite-site/`.
