//Buisness Logic Tier Code

export async function postMessage({name, email, message}) {
    const scriptURL = import.meta.env.CONTACT_SCRIPT_URL
    const scriptSecret = import.meta.env.CONTACT_SCRIPT_SECRET

    if (!scriptURL){
        throw new Error("URL is invalid");
    }

    const res = await fetch(scriptURL, {
        method: "POST",
        redirect: "follow",
        headers: {"Content-Type": "text/plain"},
        body: JSON.stringify({
            name,
            email,
            message,
            secret: scriptSecret,
        }),
    });

    const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok !== true) {
    const detail = data.error || (res.statusText ? `HTTP ${res.status} (${res.statusText})` : `HTTP ${res.status}`);
    throw new Error(`Failed to save message: ${detail}`);
  }

    return data;
}