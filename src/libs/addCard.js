import { parse } from "csv-parse/sync";

const SHEET_CVS_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRgr6kfKA4yPul4otwdDKjT_JgHm-dRP9XjRazAmGjUCF6JFkSk0lswo7chVZupi7EZ3986v1mTeBYH/pub?output=csv";

// Plain URL strings, not Image objects
const images = import.meta.glob("/src/assets/**/*.{jpg,jpeg,png,webp}", {
    eager: true,
    query: "?url",
    import: "default",
  });
  
function resolveImage(imageName) {
    if (!imageName) return null;
    const key = `/src/assets/${imageName}`;
    return images[key] ?? null;
}

// Get API
export async function getCards() {
    const res = await fetch (SHEET_CVS_URL);

    if (!res.ok) {
        throw new Error(`Failed to fetch sheet: ${res.status}`);
    }

    const csvText = await res.text();
    const rows = parse(csvText, {columns: true, skip_empty_lines: true, trim: true})

    return rows.filter((r) => r.name).map((r) => ({
        name: r.name,
        image: resolveImage(r.image),
        description: r.description ?? ""
    }));
}
  
