# Asmeninio biudžeto planuoklis

Asmeninio biudžeto planuoklis – internetinė programa, skirta vienam vartotojui planuoti mėnesio biudžetą, registruoti išlaidas ir stebėti likutį. Tai CodeAcademy baigiamasis projektas.

**Veikianti programa:** https://asmeninio-biudzeto-planuoklis.vercel.app/

## Funkcijos

- Registracija, prisijungimas ir atsijungimas naudojant Supabase Auth.
- Atskiri kiekvieno prisijungusio vartotojo duomenys, apsaugoti Supabase Row Level Security (RLS).
- Mėnesio biudžeto sukūrimas, mėnesių perjungimas, išlaidų pridėjimas ir redagavimas.
- Automatinis išlaidų, likučio ir biudžeto panaudojimo apskaičiavimas.
- Šešios išlaidų kategorijos: Maistas, Transportas, Būstas, Pramogos, Sveikata ir Kita.
- Mėnesio išlaidų suvestinė pagal kategorijas su spalvotomis progreso juostomis.
- Įkėlimo, klaidos, tuščių duomenų ir sėkmės būsenos.
- Zapier automatizacija, reaguojanti į naujus išlaidų įrašus: mažoms išlaidoms taikomas įprastas kelias, o didelėms (nuo 50 €) – skubus el. pašto pranešimas. Redagavimo įvykiai filtruojami.

## Technologijos

- **Sąsaja:** React, Vite, JavaScript, CSS.
- **Autentifikacija ir duomenys:** Supabase Auth, PostgreSQL, RLS.
- **Automatizacija:** Supabase webhook ir Zapier.
- **Versijų valdymas:** Git ir GitHub, darbas per Pull Requests.
- **Publikavimas:** Vercel.
- **Dokumentacija ir užduočių valdymas:** Notion.

## Paleidimas vietiniame kompiuteryje

Reikalinga įdiegta Node.js ir npm bei veikiantis Supabase projektas.

1. Atsisiųskite arba nukopijuokite šią GitHub repozitoriją.
2. Projekto aplanke įdiekite priklausomybes:

   ```bash
   npm install
   ```

3. Projekto šakniniame aplanke sukurkite failą `.env.local` ir įrašykite **savo** Supabase projekto reikšmes:

   ```env
   VITE_SUPABASE_URL=JUSU_SUPABASE_PROJEKTO_URL
   VITE_SUPABASE_PUBLISHABLE_KEY=JUSU_SUPABASE_PUBLISHABLE_KEY
   ```

   Čia pateikti tik pavyzdiniai vietaženkliai, **ne tikri raktai**. Neįkelkite `.env.local` į GitHub.

4. Paleiskite kūrimo serverį:

   ```bash
   npm run dev
   ```

5. Atidarykite terminale parodytą vietinį adresą (paprastai `http://localhost:5173`).

**Patikrinimas prieš publikavimą:**

```bash
npm run build
```

## Duomenų struktūra ir saugumas

Supabase duomenų bazėje naudojamos dvi pagrindinės lentelės:

- `budgets` – vartotojo mėnesio biudžetai.
- `expenses` – biudžetui priskirtos išlaidos, sumos ir kategorijos.

Prieiga prie įrašų ribojama RLS taisyklėmis pagal prisijungusį vartotoją. Supabase lenteles, RLS taisykles, Auth ir automatizacijos webhook reikia sukonfigūruoti atskirai; vien tik `npm install` duomenų bazės nesukuria.

## Testavimas

Projekto kūrimo metu rankiniu būdu tikrinta registracija ir prisijungimas, mėnesio biudžetas, išlaidų išsaugojimas, kategorijų perskaičiavimas, Zapier mažų ir didelių išlaidų scenarijai bei UPDATE filtro veikimas. Testų įrodymai ir galutinio pateikimo kontrolinis sąrašas tvarkomi Notion.

## Projekto nuorodos

- [Veikianti Vercel programa](https://asmeninio-biudzeto-planuoklis.vercel.app/)
- [GitHub repozitorija](https://github.com/evelinapal/asmeninio-biudzeto-planuoklis)
- [Kategorijų suvestinės PR #6](https://github.com/evelinapal/asmeninio-biudzeto-planuoklis/pull/6)

## Projekto ribos

Tai mokomasis asmeninis biudžeto planuoklis. Šioje versijoje nėra šeimos paskyrų, mokėjimų integracijos ar atskirų biudžeto limitų kiekvienai kategorijai.
