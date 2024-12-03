export default function getBaseURL() {
    if (typeof window !== "undefined") return ""
    if (process.env.VERCEL_URL) return `http://${process.env.DOMAIN_URL}`;
    return ("http://localhost:3000")
}