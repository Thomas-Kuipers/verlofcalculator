import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test } from 'vitest'
import {
    getWeeksForPreset,
    officalAverageWorkingDaysPerYear,
    seventyPercentOfMax,
    useLeaveStore,
    uwvMaximumDagloon
} from './leave'

describe('Leave store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    test('Calculate daily salary for mom', () => {
        const store= useLeaveStore()
        store.setGrossYearlySalary(100_000, true)
        expect(store.dailySalary(true)).toBe(Math.round(100_000 / officalAverageWorkingDaysPerYear))
    })

    test('Calculate payout at max UWV for high-earning mom', () => {
        const store= useLeaveStore()
        store.setGrossYearlySalary(100_000, true)
        expect(store.payoutAtMaxUwv(true)).toBe(uwvMaximumDagloon)
    })

    test('Calculate payout at max UWV for low-earning mom', () => {
        const store= useLeaveStore()
        store.setGrossYearlySalary(20_000, true)
        expect(store.payoutAtMaxUwv(true)).toBe(store.dailySalary(true))
    })

    test('Calculate missed income at max UWV for high-earning mom', () => {
        const store= useLeaveStore()
        store.setGrossYearlySalary(100_000, true)
        expect(store.missedIncomeAtMaxUwv(true)).toBe(store.dailySalary(true)!! - uwvMaximumDagloon)
    })

    test('Calculate missed income at max UWV for low-earning mom', () => {
        const store= useLeaveStore()
        store.setGrossYearlySalary(20_000, true)
        expect(store.missedIncomeAtMaxUwv(true)).toBe(0)
    })

    test('Calculate payout at 70% of UWV for high-earning mom', () => {
        const store= useLeaveStore()
        store.setGrossYearlySalary(100_000, true)
        expect(store.payoutAt70Percent(true)).toBe(seventyPercentOfMax)
    })

    test('Calculate payout at 70% of UWV for low-earning mom', () => {
        const store= useLeaveStore()
        store.setGrossYearlySalary(20_000, true)
        expect(store.payoutAt70Percent(true)).toBe(Math.round(store.dailySalary(true)!! * .7))
    })

    test('Calculate missed income at 70% of UWV for high-earning mom', () => {
        const store= useLeaveStore()
        store.setGrossYearlySalary(100_000, true)
        expect(store.missedIncomeAt70Percent(true)).toBe(store.dailySalary(true)!! - seventyPercentOfMax)
    })

    test('Calculate number of days off fully paid for mom', () => {
        const store= useLeaveStore()
        store.setDaysOff(true, Array(25).fill(true))
        expect(store.daysOffAtMaxUwv(true)).toBe(25)
    })

    test('Calculate days off when taking the entire year off for mom', () => {
        const store= useLeaveStore()
        store.setDaysOff(true, Array(260).fill(true))
        expect(store.daysUsedByRegulation('delivery', true)).toBe(60)
        expect(store.daysUsedByRegulation('birth', true)).toBe(0)
        expect(store.daysUsedByRegulation('additionalBirth', true)).toBe(0)
        expect(store.daysUsedByRegulation('paidParental', true)).toBe(45)
        expect(store.daysUsedByRegulation('unpaidParental', true)).toBe(85)
        expect(store.daysOffAtMaxUwv(true)).toBe(60)
        expect(store.daysOffAt70Percent(true)).toBe(45)
        expect(store.daysOffUnpaid(true)).toBe(85)
        expect(store.totalDaysUsed(true)).toBe(5 * 52)
    })

    test('Calculate days off when taking the entire year off for partner', () => {
        const store= useLeaveStore()
        store.setDaysOff(false, Array(260).fill(true))
        expect(store.daysUsedByRegulation('delivery', false)).toBe(0)
        expect(store.daysUsedByRegulation('birth', false)).toBe(5)
        expect(store.daysUsedByRegulation('additionalBirth', false)).toBe(25)
        expect(store.daysUsedByRegulation('paidParental', false)).toBe(45)
        expect(store.daysUsedByRegulation('unpaidParental', false)).toBe(85)
        expect(store.daysOffFullyPaid(false)).toBe(5)
        expect(store.daysOffAtMaxUwv(false)).toBe(0)
        expect(store.daysOffAt70Percent(false)).toBe(70)
        expect(store.daysOffUnpaid(false)).toBe(85)
    })

    test('Calculate days off when taking the entire year off for partner who works 4 days a week', () => {
        const store= useLeaveStore()
        store.setDaysOff(false, Array(260).fill(true))
        store.setWorkDays(false, [1, 2, 3, 4])
        expect(store.daysUsedByRegulation('delivery', false)).toBe(0)
        expect(store.daysUsedByRegulation('birth', false)).toBe(4)
        expect(store.daysUsedByRegulation('additionalBirth', false)).toBe(20)
        expect(store.daysUsedByRegulation('paidParental', false)).toBe(36)
        expect(store.daysUsedByRegulation('unpaidParental', false)).toBe(68)
        expect(store.daysOffFullyPaid(false)).toBe(4)
        expect(store.daysOffAtMaxUwv(false)).toBe(0)
        expect(store.daysOffAt70Percent(false)).toBe(56)
        expect(store.daysOffUnpaid(false)).toBe(68)
    })

    test('Calculate missed income when taking the entire year off for mom', () => {
        const store= useLeaveStore()
        store.setDaysOff(true, Array(260).fill(true))
        store.setGrossYearlySalary(100_000, true)
        const daily = store.dailySalary(true)!!
        const missedAtMaxUwv = daily - uwvMaximumDagloon
        const missedAt70Percent = daily - seventyPercentOfMax
        const totalMissed =
            missedAtMaxUwv * store.daysOffAtMaxUwv(true)
            + missedAt70Percent * store.daysOffAt70Percent(true)
            + daily * store.daysOffUnpaid(true)

        expect(store.totalMissedIncome(true)).toBe(totalMissed)
    })

    test('Number of days on leave for mom in january 2023', () => {
        const store= useLeaveStore()
        store.setDaysOff(true, Array(260).fill(true))
        store.setDueDate(new Date(2023, 0, 1))

        const businessDaysInJanuary2023 = 22
        expect(store.yearMonthLeaveDays(true)!!['2023-0']).toBe(businessDaysInJanuary2023)
    })

    test('Number of days on leave for mom in february 2023', () => {
        const store= useLeaveStore()
        store.setDaysOff(true, Array(260).fill(true))
        store.setDueDate(new Date(2023, 0, 1))

        const businessDaysInFebruary2023 = 20
        expect(store.yearMonthLeaveDays(true)!!['2023-1']).toBe(businessDaysInFebruary2023)
    })

    test('Number of days on leave for mom in march 2023', () => {
        const store= useLeaveStore()
        store.setDaysOff(true, Array(260).fill(true))
        store.setDueDate(new Date(2023, 0, 1))

        const businessDaysInMarch2023 = 23
        expect(store.yearMonthLeaveDays(true)!!['2023-2']).toBe(businessDaysInMarch2023)
    })

    test('Number of days on leave for mom in april 2023', () => {
        const store= useLeaveStore()
        store.setDaysOff(true, Array(260).fill(true))
        store.setDueDate(new Date(2023, 0, 1))

        const businessDaysInApril2023 = 20
        expect(store.yearMonthLeaveDays(true)!!['2023-3']).toBe(businessDaysInApril2023)
    })

    test('Number of days using delivery leave for mom in january 2023', () => {
        const store= useLeaveStore()
        store.setDaysOff(true, Array(260).fill(true))
        store.setDueDate(new Date(2023, 0, 1))

        const businessDaysInJanuary2023 = 22
        expect(store.yearMonthRegulations(true)!!['2023-0']['delivery']).toBe(businessDaysInJanuary2023)
        expect(store.yearMonthRegulations(true)!!['2023-0']['birth']).toBeFalsy()
        expect(store.yearMonthRegulations(true)!!['2023-0']['additionalBirth']).toBeFalsy()
        expect(store.yearMonthRegulations(true)!!['2023-0']['paidParental']).toBeFalsy()
        expect(store.yearMonthRegulations(true)!!['2023-0']['unpaidParental']).toBeFalsy()
    })

    test('Number of days using delivery leave for mom in february 2023', () => {
        const store= useLeaveStore()
        store.setDaysOff(true, Array(260).fill(true))
        store.setDueDate(new Date(2023, 0, 1))

        const businessDaysInFebruary2023 = 20
        expect(store.yearMonthRegulations(true)!!['2023-1']['delivery']).toBe(businessDaysInFebruary2023)
    })

    test('Number of days using delivery leave for mom in march 2023', () => {
        const store= useLeaveStore()
        store.setDaysOff(true, Array(260).fill(true))
        store.setDueDate(new Date(2023, 0, 1))
        const deliveryLeaveMarch = 18
        expect(store.yearMonthRegulations(true)!!['2023-2']['delivery']).toBe(deliveryLeaveMarch)
    })

    test('Number of days using paid parental leave for mom in march 2023', () => {
        const store= useLeaveStore()
        store.setDaysOff(true, Array(260).fill(true))
        store.setDueDate(new Date(2023, 0, 1))
        const deliveryLeaveMarch = 18
        const businessDaysInMarch2023 = 23
        const paidParentalLeaveInMarch = businessDaysInMarch2023 - deliveryLeaveMarch

        expect(store.yearMonthRegulations(true)!!['2023-2']['paidParental']).toBe(paidParentalLeaveInMarch)
    })

    test('Income for mom in first month', () => {
        const store= useLeaveStore()
        store.setDaysOff(true, Array(260).fill(true))
        const grossYearly = 100_000
        const grossMonthly = grossYearly / 12
        store.setGrossYearlySalary(grossYearly, true)
        store.setDueDate(new Date(2023, 0, 1))
        const daily = store.dailySalary(true)!!

        const missedAtMaxUwv = daily - uwvMaximumDagloon
        const businessDaysInJanuary2023 = 22
        const totalMissed = businessDaysInJanuary2023 * missedAtMaxUwv
        const income = store.yearMonthIncome(true)

        expect(income!!['2023-0']).toBe(Math.round(grossMonthly - totalMissed))
    })

    test('Income for mom in march', () => {
        const store= useLeaveStore()
        store.setDaysOff(true, Array(260).fill(true))
        const grossYearly = 100_000
        const grossMonthly = Math.round(grossYearly / 12)
        store.setGrossYearlySalary(grossYearly, true)
        store.setDueDate(new Date(2023, 0, 1))
        const daily = store.dailySalary(true)!!

        const missedAtMaxUwv = daily - uwvMaximumDagloon
        const businessDaysInJanuary2023 = 22
        const totalMissed = businessDaysInJanuary2023 * missedAtMaxUwv
        const income = store.yearMonthIncome(true)

        const deliveryLeaveMarch = 18
        const paidParentalLeaveInMarch = 5
        const missedPerDeliveryDay = Math.round(daily - uwvMaximumDagloon)
        const missedPerParentalDay = Math.round(daily - uwvMaximumDagloon * .7)

        expect(income!!['2023-2']).toBe(Math.round(grossMonthly -
            (deliveryLeaveMarch * missedPerDeliveryDay
                + paidParentalLeaveInMarch * missedPerParentalDay))
        )
    })

    test('Income for partner in january', () => {
        const store= useLeaveStore()
        store.setDaysOff(false, Array(260).fill(true))
        const grossYearly = 100_000
        const grossMonthly = Math.round(grossYearly / 12)
        store.setGrossYearlySalary(grossYearly, false)
        store.setDueDate(new Date(2023, 0, 1))
        const daily = store.dailySalary(false)!!
        const income = store.yearMonthIncome(false)

        const birthLeave = 5
        const additionalBirthLeave = 17
        const missedPerBirthDay = 0
        const missedPerAdditionalDay = Math.round(daily - seventyPercentOfMax)

        expect(income!!['2023-0']).toBe(Math.round(grossMonthly -
            (birthLeave * missedPerBirthDay
                + additionalBirthLeave * missedPerAdditionalDay))
        )
    })
})