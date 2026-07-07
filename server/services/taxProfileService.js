import TaxProfile from "../models/taxProfile.js";
import { parseSalaryMonth } from "../utils/salaryMonthParser.js";
import { generateRecommendations } from "./recommendationService.js";

const FINANCIAL_YEAR = "2026-27";

function safeNumber(value) {
    if (value === null || value === undefined) return 0;
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const cleaned = value.replace(/,/g, "").trim();
        const num = Number(cleaned);
        return isNaN(num) ? 0 : num;
    }
    return 0;
}

function safeMax(existing, incoming) {
    return Math.max(
        safeNumber(existing),
        safeNumber(incoming)
    );
}

function sumMapValues(map) {
    if (!map) return 0;
    let total = 0;
    for (const value of map.values()) {
        total += safeNumber(value);
    }
    return total;
}

export async function findOrCreateProfile(userId) {
    let profile = await TaxProfile.findOne({
        user: userId,
        financialYear: FINANCIAL_YEAR
    });
    if (!profile) {
        profile = await TaxProfile.create({
            user: userId,
            financialYear: FINANCIAL_YEAR
        });
    }

    return profile;
}

export function updatePayslip(profile, extractedData) {
    const tax = extractedData.taxProfile || {};
    const documentData = extractedData.documentData || {};
    console.log("Inside updatePayslip");
    console.log(extractedData);
    console.log("Salary Month:", documentData.salaryMonth);
    console.log("Gross Income:", tax.grossIncome);
    console.log("EPF:", documentData.epf);
    
    const monthKey = parseSalaryMonth(
        documentData.salaryMonth
    );
    console.log("Parsed Month:", monthKey);
    /* ---------------- Salary ---------------- */

    if (monthKey) {
        const currentSalary =
            profile.salaryBreakdown.get(monthKey) || 0;
        const newSalary =
            safeNumber(tax.grossIncome);
        profile.salaryBreakdown.set(
            monthKey,
            Math.max(currentSalary, newSalary)
        );
        console.log(profile.salaryBreakdown);
        console.log(profile.income.salary);
        profile.income.salary =
            sumMapValues(profile.salaryBreakdown);
    }
   /* ---------------- 80C (EPF) ---------------- */

    if (monthKey) {
        const epfContribution = safeNumber(
            documentData.epf
        );
        const currentEPF =
            profile.epfBreakdown.get(monthKey) || 0;
        profile.epfBreakdown.set(
            monthKey,
            Math.max(currentEPF, epfContribution)
        );
        profile.deductions.section80C =
            sumMapValues(profile.epfBreakdown);
    }
    /* ---------------- HRA ---------------- */

    if (tax.hraExemption != null) {
        profile.expenses.rent = safeMax(
            profile.expenses.rent,
            tax.hraExemption
        );
    }

    /* ---------------- TDS ---------------- */

    if (tax.tds != null) {
        profile.taxes.tds = safeMax(
            profile.taxes.tds,
            tax.tds
        );
    }

    /* ---------------- NPS ---------------- */

    if (tax.npsContribution != null) {
        profile.deductions.nps = safeMax(
            profile.deductions.nps,
            tax.npsContribution
        );
        profile.investments.nps = safeMax(
            profile.investments.nps,
            tax.npsContribution
        );
    }

    /* ---------------- 80D ---------------- */

    if (tax.deduction80D != null) {
        profile.deductions.section80D = safeMax(
            profile.deductions.section80D,
            tax.deduction80D
        );
    }

}

export function updateForm16(profile, extractedData) {
    const tax = extractedData.taxProfile || {};
    profile.income.salary = safeMax(
        profile.income.salary,
        tax.grossIncome
    );
    profile.deductions.section80C = safeMax(
        profile.deductions.section80C,
        tax.deduction80C
    );
    profile.deductions.section80D = safeMax(
        profile.deductions.section80D,
        tax.deduction80D
    );
    profile.deductions.nps = safeMax(
        profile.deductions.nps,
        tax.npsContribution
    );
    profile.taxes.tds = safeMax(
        profile.taxes.tds,
        tax.tds
    );
    if (tax.hraExemption != null) {
        profile.expenses.rent = safeMax(
            profile.expenses.rent,
            tax.hraExemption
        );
    }
}

export function updateBankStatement(profile, extractedData) {
    const tax = extractedData.taxProfile || {};
    const documentData = extractedData.documentData || {};
    if (tax.interestIncome != null) {
        profile.income.interestIncome += safeNumber(
            tax.interestIncome
        );
    }
    if (documentData.interestEarned != null) {
        profile.income.interestIncome += safeNumber(
            documentData.interestEarned
        );
    }
}

export function updateProfileCompletion(profile) {
    let completed = 0;
    // Income
    if (
        profile.income.salary > 0 ||
        profile.income.business > 0 ||
        profile.income.capitalGains > 0 ||
        profile.income.rentalIncome > 0 ||
        profile.income.interestIncome > 0 ||
        profile.income.otherIncome > 0
    ) {
        completed += 20;
    }

    // Deductions
    if (
        profile.deductions.section80C > 0 ||
        profile.deductions.section80D > 0 ||
        profile.deductions.section80E > 0 ||
        profile.deductions.section80G > 0 ||
        profile.deductions.homeLoanInterest > 0 ||
        profile.deductions.nps > 0
    ) {
        completed += 20;
    }

    // Taxes
    if (
        profile.taxes.tds > 0 ||
        profile.taxes.advanceTax > 0 ||
        profile.taxes.selfAssessmentTax > 0
    ) {
        completed += 20;
    }

    // Investments
    if (
        profile.investments.ppf > 0 ||
        profile.investments.elss > 0 ||
        profile.investments.ulip > 0 ||
        profile.investments.nps > 0 ||
        profile.investments.fd5Year > 0
    ) {
        completed += 20;
    }

    // Expenses
    if (
        profile.expenses.rent > 0 ||
        profile.expenses.education > 0 ||
        profile.expenses.medical > 0 ||
        profile.expenses.insurance > 0
    ) {
        completed += 20;
    }

    profile.profileStatus.percentage = completed;
    profile.profileStatus.completed = completed === 100;
}

export async function updateTaxProfile({
    userId,
    document,
    extractedData,
    originalFileName
}) {
    const profile =
        await findOrCreateProfile(userId);
        console.log("Document Type:", document.documentType);
        switch(document.documentType){
            case "payslip":
                updatePayslip(profile, extractedData);
                break;
            case "form16":
                updateForm16(profile, extractedData);
                break;
            case "bank_statement":
                updateBankStatement(profile, extractedData);
                break;
        }
        if(
            !profile.documents.some(
                id => id.equals(document._id)
            )
        ){
            profile.documents.push(document._id);
        }
        profile.lastUpdatedFrom =
            originalFileName;
        profile.profileVersion++;
        updateProfileCompletion(profile);

        await profile.save();

        console.log("Profile saved");

        await generateRecommendations(profile);

        console.log("Recommendations generated");

        return profile;
    }