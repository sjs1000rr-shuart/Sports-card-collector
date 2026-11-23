# Sports Card Collector

A React Native (Expo) app for tracking a sports card collection: add cards
by camera photo or manual entry, see an estimated value next to each card's
photo, and import/export your whole collection as an Excel file.

## What's included

- **Collection screen** — search, total collection value, per-card value
- **Scan Card** — opens the camera, captures a photo of the card
- **Add Card** — manual entry form (player, year, brand, set, card #,
  condition, grading, parallel, quantity, purchase price, notes, photo)
- **Card Detail** — full-size photo shown together with the current
  estimated value
- **Import/Export** — pick an .xlsx/.xls/.csv to bulk-import cards; export
  the full collection (with values) to a shareable .xlsx file
- Local, on-device storage via AsyncStorage — no backend required to run it

## Important: pricing is mocked

There's no free public API for sports card market values. `estimateCardValue`
in `src/services/pricingService.ts` generates a deterministic mock value
based on player/year/set/condition/grading so the rest of the app (sorting,
totals, export) works today. That one function is the single place to swap
in a real pricing source later — see the comment block at the top of that
file.

Realistic options when you're ready to connect real data:
- A paid card-pricing API (e.g. a 130point/Card Ladder–style provider)
- eBay's sold-listings API (requires an eBay developer account)
- A scraping pipeline you run yourself and put behind your own API

## Camera "scanning" today

`ScanCardScreen.tsx` captures a photo of the card and carries it into the
Add Card form as the image — it does **not** auto-read the player, year, or
set off the card yet. There's a marked spot in `AddCardScreen.tsx` where you
can call an OCR/vision API (e.g. Claude's vision capability, or a dedicated
card-ID service) to auto-fill the form fields from the photo.

## Setup

Requires Node.js and either the Expo Go app on your phone, or Xcode/Android
Studio for simulators.

```bash
npm install
npx expo start
```

Then either:
- Scan the QR code with the **Expo Go** app on your iPhone/Android phone, or
- Press `i` for the iOS simulator / `a` for the Android emulator

## Excel import format

Expected columns (header names are matched flexibly, case-insensitive):

| Column | Required |
|---|---|
| Player Name | Yes |
| Year, Brand, Set Name, Card Number, Sport | No |
| Condition | No (defaults to "Ungraded") |
| Is Graded, Grading Company, Grade Value | No |
| Parallel | No |
| Quantity | No (defaults to 1) |
| Purchase Price | No |
| Notes | No |

Rows without a Player Name are skipped and reported after import.

## Project structure

```
App.tsx
src/
  types/card.ts            Card data model
  services/
    storageService.ts      AsyncStorage CRUD for the collection
    pricingService.ts       Mock valuation logic (swap point for real API)
    excelService.ts         Import/export via the xlsx library
  screens/                  One file per screen
  components/               Reusable list item + stats header
  navigation/AppNavigator.tsx
  theme/theme.ts            Shared colors/spacing
```

## Suggested next steps

1. Wire up a real pricing API in `pricingService.ts`.
2. Add OCR/vision auto-fill after camera capture in `AddCardScreen.tsx`.
3. Add cloud sync/backup (e.g. Supabase or Firebase) if you want the
   collection to survive a device change, since it's currently local-only.
4. Add barcode/QR scanning for cards or slabs that have one, using
   `expo-camera`'s barcode scanning mode as a faster add path.
