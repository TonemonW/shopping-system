export default function formatPrice(price: number) {
    return new Intl.NumberFormat("en", {
        style: "currency",
        currency: "AUD"
    }).format(price)
}