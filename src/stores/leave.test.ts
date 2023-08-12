import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test } from 'vitest'
import { getWeeksForPreset, officalAverageWorkingDaysPerYear, useLeaveStore, uwvMaximumDagloon } from './leave'

describe('Leave store', () => {
    beforeEach(() => {
        setActivePinia(createPinia())
    })

    test('Calculate daily salary for mom', () => {
        const store= useLeaveStore()
        store.setGrossYearlySalary(100_000, true)
        expect(store.dailySalary(true)).toBe(100_000 / officalAverageWorkingDaysPerYear)
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
        expect(store.payoutAt70Percent(true)).toBe(uwvMaximumDagloon * .7)
    })

    test('Calculate payout at 70% of UWV for low-earning mom', () => {
        const store= useLeaveStore()
        store.setGrossYearlySalary(20_000, true)
        expect(store.payoutAt70Percent(true)).toBe(store.dailySalary(true)!! * .7)
    })

    test('Calculate missed income at 70% of UWV for high-earning mom', () => {
        const store= useLeaveStore()
        store.setGrossYearlySalary(100_000, true)
        expect(store.missedIncomeAt70Percent(true)).toBe(store.dailySalary(true)!! - uwvMaximumDagloon * .7)
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

    test('Calculate missed income when taking the entire year off for mom', () => {
        const store= useLeaveStore()
        store.setDaysOff(true, Array(260).fill(true))
        store.setGrossYearlySalary(100_000, true)
        const daily = store.dailySalary(true)!!
        const missedAtMaxUwv = daily - uwvMaximumDagloon
        const missedAt70Percent = daily - 0.7 * uwvMaximumDagloon
        const totalMissed =
            missedAtMaxUwv * store.daysOffAtMaxUwv(true)
            + missedAt70Percent * store.daysOffAt70Percent(true)
            + daily * store.daysOffUnpaid(true)

        expect(store.totalMissedIncome(true)).toBe(totalMissed)
    })
})