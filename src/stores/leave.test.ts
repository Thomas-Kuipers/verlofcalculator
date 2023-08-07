import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, test } from 'vitest'
import { officalAverageWorkingDaysPerYear, useLeaveStore, uwvMaximumDagloon } from './leave'

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
})