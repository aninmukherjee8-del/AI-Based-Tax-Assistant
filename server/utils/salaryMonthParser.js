const MONTHS = {
    JAN: 1,
    JANUARY: 1,

    FEB: 2,
    FEBRUARY: 2,

    MAR: 3,
    MARCH: 3,

    APR: 4,
    APRIL: 4,

    MAY: 5,

    JUN: 6,
    JUNE: 6,

    JUL: 7,
    JULY: 7,

    AUG: 8,
    AUGUST: 8,

    SEP: 9,
    SEPT: 9,
    SEPTEMBER: 9,

    OCT: 10,
    OCTOBER: 10,

    NOV: 11,
    NOVEMBER: 11,

    DEC: 12,
    DECEMBER: 12,
};

function normalizeYear(year) {
    year = Number(year);
    if (year < 100) {
        return year >= 70 ? 1900 + year : 2000 + year;
    }
    return year;
}

export function parseSalaryMonth(monthString) {
    if (!monthString || typeof monthString !== "string") {
        return null;
    }

    let text = monthString
        .toUpperCase()
        .trim()
        .replace(/[,]/g, "")
        .replace(/[_.]/g, "-")
        .replace(/\//g, "-")
        .replace(/\s+/g, " ");

    // -----------------------------
    // Case 1:
    // AUGUST 2023
    // AUG-2023
    // AUGUST - 2023
    // -----------------------------

    const monthRegex = Object.keys(MONTHS).join("|");
    let match = text.match(
        new RegExp(`(${monthRegex}).*?(\\d{2,4})`)
    );
    if (match) {
        const month = MONTHS[match[1]];
        const year = normalizeYear(match[2]);
        return `${year}-${String(month).padStart(2, "0")}`;
    }

    // -----------------------------
    // Case 2:
    // 08-2023
    // 8-2023
    // 08/23
    // -----------------------------

    match = text.match(/(\d{1,2})[- ](\d{2,4})/);
    if (match) {
        const month = Number(match[1]);
        if (month >= 1 && month <= 12) {
            const year = normalizeYear(match[2]);
            return `${year}-${String(month).padStart(2, "0")}`;
        }
    }

    // -----------------------------
    // Case 3:
    // 2023-08
    // 2023/8
    // -----------------------------

    match = text.match(/(\d{4})[- ](\d{1,2})/);
    if (match) {
        const year = Number(match[1]);
        const month = Number(match[2]);
        if (month >= 1 && month <= 12) {
            return `${year}-${String(month).padStart(2, "0")}`;
        }
    }

    // -----------------------------
    // Fallback
    // -----------------------------

    return null;
}