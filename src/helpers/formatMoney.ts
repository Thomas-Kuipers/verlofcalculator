export function formatMoney(value: number | null): string {
    if (value === null) {
        return ''
    }

    const formatter = new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
        maximumFractionDigits: 0
    })

    return formatter.format(value)
}