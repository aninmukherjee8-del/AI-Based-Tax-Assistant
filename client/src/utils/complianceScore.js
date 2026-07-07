export function calculateComplianceScore(profile) {

    if (!profile) {
        return {
            score: 100,
            level: "No Profile",
            color: "red",
            verifiedDocuments: [],
            missingDocuments: [],
            recommendations: [
                "Upload tax documents or fill your tax profile."
            ]
        };
    }

    let score = 0;

    const verifiedDocuments = [];
    const missingDocuments = [];
    const recommendations = [];

    const income = profile.income || {};
    const deductions = profile.deductions || {};
    const taxes = profile.taxes || {};

    const uploadedDocs = (profile.documents || []).map(doc => {
        if (typeof doc === "string")
            return doc.toLowerCase();
        if (doc.documentType)
            return doc.documentType.toLowerCase();
        return "";
    });

    const hasDocument = (...types) =>
        types.some(type => uploadedDocs.includes(type));

    /* -------------------------------------------------- */
    /* Salary */
    /* -------------------------------------------------- */

    if (income.salary > 0) {
        if (hasDocument("form16")) {
            verifiedDocuments.push("Form 16");
        } else {
            score += 20;
            missingDocuments.push("Form 16");
            recommendations.push(
                "Upload your Form 16 to verify salary income."
            );
        }
        if (hasDocument("payslip")) {
            verifiedDocuments.push("Payslip");
        } else {
            score += 10;
            missingDocuments.push("Payslip");
            recommendations.push(
                "Upload at least one payslip."
            );
        }
        if (taxes.tds > 0) {
            verifiedDocuments.push("TDS Information");
        } else {
            score += 10;
            recommendations.push(
                "Verify TDS information."
            );
        }
    }

    /* -------------------------------------------------- */
    /* Section 80C */
    /* -------------------------------------------------- */

    if (deductions.section80C > 0) {
        if (
            hasDocument(
                "investment_proof",
                "elss_statement"
            )
        ) {
            verifiedDocuments.push(
                "80C Investment Proof"
            );
        } else {
            score += 15;
            missingDocuments.push(
                "80C Investment Proof"
            );
            recommendations.push(
                "Upload ELSS statement or investment proof."
            );
        }
    }

    /* -------------------------------------------------- */
    /* Section 80D */
    /* -------------------------------------------------- */

    if (deductions.section80D > 0) {
        if (
            hasDocument("insurance_receipt")
        ) {
            verifiedDocuments.push(
                "Insurance Receipt"
            );
        } else {
            score += 10;
            missingDocuments.push(
                "Insurance Receipt"
            );
            recommendations.push(
                "Upload your health insurance receipt."
            );
        }
    }

    /* -------------------------------------------------- */
    /* NPS */
    /* -------------------------------------------------- */

    if (deductions.nps > 0) {
        if (
            hasDocument("nps_statement")
        ) {
            verifiedDocuments.push(
                "NPS Statement"
            );
        } else {
            score += 10;
            missingDocuments.push(
                "NPS Statement"
            );
            recommendations.push(
                "Upload your NPS transaction statement."
            );
        }
    }

    /* -------------------------------------------------- */
    /* Home Loan */
    /* -------------------------------------------------- */

    if (deductions.homeLoanInterest > 0) {
        if (
            hasDocument("loan_certificate")
        ) {
            verifiedDocuments.push(
                "Loan Certificate"
            );
        } else {
            score += 10;
            missingDocuments.push(
                "Loan Certificate"
            );
            recommendations.push(
                "Upload your home loan interest certificate."
            );
        }
    }

    /* -------------------------------------------------- */
    /* Rental Income */
    /* -------------------------------------------------- */

    if (income.rentalIncome > 0) {
        if (
            hasDocument("bank_statement")
        ) {
            verifiedDocuments.push(
                "Bank Statement"
            );
        } else {
            score += 10;
            missingDocuments.push(
                "Bank Statement"
            );
            recommendations.push(
                "Upload a bank statement supporting rental income."
            );
        }
    }

    /* -------------------------------------------------- */
    /* No documents uploaded */
    /* -------------------------------------------------- */

    if (uploadedDocs.length === 0) {

        score += 15;

        recommendations.push(
            "No supporting documents uploaded. Upload documents to improve compliance."
        );

    }

    /* -------------------------------------------------- */
    /* Clamp */
    /* -------------------------------------------------- */

    score = Math.min(score, 100);
    let level;
    let color;
    if (score <= 20) {
        level = "Excellent";
        color = "emerald";
    }
    else if (score <= 40) {
        level = "Good";
        color = "green";
    }
    else if (score <= 60) {
        level = "Moderate";
        color = "yellow";
    }
    else if (score <= 80) {
        level = "High";
        color = "orange";
    }
    else {
        level = "Critical";
        color = "red";
    }
    return {
        score,
        level,
        color,
        verifiedDocuments,
        missingDocuments,
        recommendations
    };
}