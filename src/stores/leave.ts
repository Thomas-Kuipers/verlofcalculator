import { defineStore } from 'pinia'
import { MessageSchema } from '@/main'

export const uwvMaximumDagloon = 256.54
const officalAverageWorkingDaysPerYear = 261

export interface Week {
	daysOffMom: number
	daysOffSecondParent: number
}

export interface Regulation {
	id: string
	title: keyof MessageSchema
	daysOff: number
	fixedDaysOff: number[]
	mom: boolean
	secondParent: boolean
	percentageOfSalary: number
	dailySalaryMax: number | null
	url: string
	info: keyof MessageSchema
	infoList: keyof MessageSchema
	infoLink: keyof MessageSchema
}

export interface Preset {
	title: keyof MessageSchema
	mom: number[]
	secondParent: number[]
}

interface Leave {
	personal: {
		dueDate: Date | null
		daysPerWeek: number | null
		grossYearlySalaryMom: number | null
		grossYearlySalarySecondParent: number | null
	}
	facts: {
		maxDaySalary: number
	}
	regulations: Regulation[]
	weeks: Week[]
	presets: Preset[]
	hasDragged: boolean
}

const defaultRegulations: Regulation[] = [
	{
		id: 'delivery',
		title: 'regulationDeliveryTitle',
		daysOff: 12 * 5,
		fixedDaysOff: [5, 5, 5, 5, 5, 5],
		mom: true,
		secondParent: false,
		percentageOfSalary: 100,
		dailySalaryMax: uwvMaximumDagloon,
		info: 'regulationDeliveryInfoHtml',
		infoList: 'regulationDeliveryInfoListHtml',
		infoLink: 'regulationDeliveryInfoLinkHtml',
		url: 'https://www.rijksoverheid.nl/onderwerpen/zwangerschapsverlof-en-bevallingsverlof/vraag-en-antwoord/zwangerschapsverlof-en-bevallingsverlof-berekenen'
	},
	{
		id: 'birth',
		title: 'regulationBirthTitle',
		daysOff: 5,
		fixedDaysOff: [5],
		mom: false,
		secondParent: true,
		percentageOfSalary: 100,
		dailySalaryMax: null,
		info: 'regulationBirthInfoHtml',
		infoList: 'regulationBirthInfoListHtml',
		infoLink: 'regulationBirthInfoLinkHtml',
		url: 'https://www.rijksoverheid.nl/onderwerpen/geboorteverlof-en-partnerverlof/geboorteverlof-voor-partners'
	},
	{
		id: 'additionalBirth',
		title: 'regulationAdditionalBirthTitle',
		daysOff: 5 * 5,
		fixedDaysOff: [],
		mom: false,
		secondParent: true,
		percentageOfSalary: 70,
		dailySalaryMax: 0.7 * uwvMaximumDagloon,
		info: 'regulationAdditionalBirthInfoHtml',
		infoList: 'regulationAdditionalBirthInfoListHtml',
		infoLink: 'regulationAdditionalBirthInfoLinkHtml',
		url: 'https://www.rijksoverheid.nl/onderwerpen/geboorteverlof-en-partnerverlof/geboorteverlof-voor-partners',
	},
	{
		id: 'paidParental',
		title: 'regulationPaidParentalTitle',
		daysOff: 9 * 5,
		fixedDaysOff: [],
		mom: true,
		secondParent: true,
		percentageOfSalary: 70,
		dailySalaryMax: 0.7 * uwvMaximumDagloon,
		info: 'regulationPaidParentalInfoHtml',
		infoList: 'regulationPaidParentalInfoListHtml',
		infoLink: 'regulationPaidParentalInfoLinkHtml',
		url: 'https://www.rijksoverheid.nl/onderwerpen/ouderschapsverlof/vraag-en-antwoord/wanneer-heb-ik-recht-op-betaald-ouderschapsverlof'
	},
	{
		id: 'unpaidParental',
		title: 'regulationUnpaidParentalTitle',
		daysOff: 17 * 5,
		fixedDaysOff: [],
		mom: true,
		secondParent: true,
		percentageOfSalary: 0,
		dailySalaryMax: null,
		info: 'regulationUnpaidParentalInfoHtml',
		infoList: 'regulationUnpaidParentalInfoListHtml',
		infoLink: 'regulationUnpaidParentalInfoLinkHtml',
		url: 'https://www.rijksoverheid.nl/onderwerpen/ouderschapsverlof/vraag-en-antwoord/wanneer-heb-ik-recht-op-betaald-ouderschapsverlof'
	}
]

const defaultPresets: Preset[] = [
	{
		title: 'presetAsLittleAsPossible',
		mom: getCombinedMinimumDays(true),
		secondParent: getCombinedMinimumDays(false),
	},
	{
		title: 'presetEverythingImmediately',
		mom: getCombinedMinimumDays(true).concat(
			divideOverWeeks(totalFlexibleDays(true), 5)
		),
		secondParent: getCombinedMinimumDays(false).concat(
			divideOverWeeks(totalFlexibleDays(false), 5)
		)
	},
	{
		title: 'presetMonthlySwitch',
		mom: getCombinedMinimumDays(true).concat(
			monthlySwitch(totalFlexibleDays(true), 5)
		),
		secondParent: getCombinedMinimumDays(false).concat(5).concat(
			monthlySwitch(totalFlexibleDays(false) - 5, 5)
		),
	},
	{
		title: 'presetPartTimersMom',
		mom: getCombinedMinimumDays(true).concat(
			divideOverWeeks(totalFlexibleDays(true), 2)
		),
		secondParent: getCombinedMinimumDays(false).concat(
			divideOverWeeks(totalFlexibleDays(false), 3)
		),
	},
	{
		title: 'presetPartTimersPartner',
		mom: getCombinedMinimumDays(true).concat(
			divideOverWeeks(totalFlexibleDays(true), 3)
		),
		secondParent: getCombinedMinimumDays(false).concat(
			divideOverWeeks(totalFlexibleDays(false), 2)
		),
	},
	{
		title: 'presetEqualPartTimers',
		mom: getCombinedMinimumDays(true).concat(
			divideOverWeeks(totalFlexibleDays(true), 2)
		),
		secondParent: getCombinedMinimumDays(false).concat(
			divideOverWeeks(totalFlexibleDays(false), 2)
		),
	}
]

export const useLeaveStore = defineStore('leave', {
	state: (): Leave => ({
		personal: {
			dueDate: null,
			daysPerWeek: null,
			grossYearlySalaryMom: null,
			grossYearlySalarySecondParent: null,
		},
		facts: {
			maxDaySalary: 256,
		},
		regulations: defaultRegulations,
		weeks: getWeeksForPreset(defaultPresets[0]),
		presets: defaultPresets,
		hasDragged: false,
	}),
	getters: {
		totalDaysUsed(state): (mom: boolean) => number {
			return (mom: boolean) => state.weeks.reduce((total: number, week) =>
					total + (mom ? week.daysOffMom : week.daysOffSecondParent),
				0
			)
		},
		daysPerWeek(state): (mom: boolean) => number[] {
			return (mom: boolean) => state.weeks.reduce((total: number[], week) =>
					total.concat(mom ? week.daysOffMom : week.daysOffSecondParent),
				[]
			)
		},
		daysUsedByRegulation(state): (regulationId: string, mom: boolean) => number {
			return (regulationId: string, mom: boolean): number => {
				const totalDaysUsed: number = state.weeks.reduce((total: number, week: Week) =>
						total + (mom ? week.daysOffMom : week.daysOffSecondParent)
					, 0)

				const relevantRegulations = state.regulations.filter(regulation =>
					mom ? regulation.mom : regulation.secondParent
				)

				let daysUsedByOtherRegulations = 0
				let currentIndex: number = 0
				while (relevantRegulations[currentIndex] && relevantRegulations[currentIndex].id !== regulationId) {
					daysUsedByOtherRegulations = Math.min(
						totalDaysUsed,
						daysUsedByOtherRegulations + relevantRegulations[currentIndex].daysOff
					)
					currentIndex ++
				}

				const currentRegulation = state.regulations.find(regulation =>
					regulation.id === regulationId
				)

				return Math.min(currentRegulation!!.daysOff, totalDaysUsed - daysUsedByOtherRegulations)
			}
		},
		daysOffByMultipleRegulations(state): (regulations: Regulation[], mom: boolean) => number {
			return (regulations: Regulation[], mom: boolean) => regulations.reduce((total, regulation) =>
					total + this.daysUsedByRegulation(regulation.id, mom),
				0
			)
		},
		daysOffFullyPaid(state): (mom: boolean) => number {
			return (mom: boolean) => {
				const regulations = state.regulations.filter(regulation =>
					regulation.percentageOfSalary === 100
					&& regulation.dailySalaryMax === null
					&& (
						(mom && regulation.mom) || (!mom && regulation.secondParent)
					)
				)

				return this.daysOffByMultipleRegulations(regulations, mom)
			}
		},
		daysOffAtMaxUwv(state): (mom: boolean) => number {
			return (mom: boolean) => {
				const regulations = state.regulations.filter(regulation =>
					regulation.percentageOfSalary === 100
					&& regulation.dailySalaryMax === uwvMaximumDagloon
					&& (
						(mom && regulation.mom) || (!mom && regulation.secondParent)
					)
				)

				return this.daysOffByMultipleRegulations(regulations, mom)
			}
		},
		daysOffAt70Percent(state): (mom: boolean) => number {
			return (mom: boolean) => {
				const regulations = state.regulations.filter(regulation =>
					regulation.percentageOfSalary === 70
					&& regulation.dailySalaryMax === 0.7 * uwvMaximumDagloon
					&& (
						(mom && regulation.mom) || (!mom && regulation.secondParent)
					)
				)

				return this.daysOffByMultipleRegulations(regulations, mom)
			}
		},
		daysOffUnpaid(state): (mom: boolean) => number {
			return (mom: boolean) => {
				const regulations = state.regulations.filter(regulation =>
					regulation.percentageOfSalary === 0
					&& (
						(mom && regulation.mom) || (!mom && regulation.secondParent)
					)
				)

				return this.daysOffByMultipleRegulations(regulations, mom)
			}
		},
		yearlySalary(state): (mom: boolean) => number | null {
			return (mom: boolean) => {
				if (mom) {
					return state.personal.grossYearlySalaryMom
				} else {
					return state.personal.grossYearlySalarySecondParent
				}
			}
		},
		dailySalary(state): (mom: boolean) => number | null {
			return (mom: boolean) => {
				const yearly = this.yearlySalary(mom)

				if (yearly === null) {
					return null
				}

				return yearly / officalAverageWorkingDaysPerYear
			}
		},
		payoutAtMaxUwv(state): (mom: boolean) => number | null {
			return (mom: boolean) => {
				const daily = this.dailySalary(mom)

				if (daily === null) {
					return null
				}

				return payoutPerDayForParameters(100, uwvMaximumDagloon, daily)
			}
		},
		missedIncomeAtMaxUwv(state): (mom: boolean) => number | null {
			return (mom: boolean) => {
				const yearlySalary = this.yearlySalary(mom)

				if (yearlySalary === null) {
					return null
				}

				return missedIncomeForParametersPerDay(100, uwvMaximumDagloon, yearlySalary)
			}
		},
		missedIncomeAt70Percent(state): (mom: boolean) => number | null {
			return (mom: boolean) => {
				const yearlySalary = this.yearlySalary(mom)

				if (yearlySalary === null) {
					return null
				}

				return missedIncomeForParametersPerDay(70, 0.7 * uwvMaximumDagloon, yearlySalary)
			}
		},
		payoutAt70Percent(state): (mom: boolean) => number | null {
			return (mom: boolean) => {
				const daily = this.dailySalary(mom)

				if (daily === null) {
					return null
				}

				return payoutPerDayForParameters(70, 0.7 * uwvMaximumDagloon, daily)
			}
		},
		missedIncomeUnpaid(state): (mom: boolean) => number | null {
			return (mom: boolean) => {
				const yearlySalary = this.yearlySalary(mom)

				if (yearlySalary === null) {
					return null
				}

				return missedIncomeForParametersPerDay(0, 0, yearlySalary)
			}
		},
		totalMissedIncome(state): (mom: boolean) => number | null {
			return (mom: boolean) => {
				const yearlySalary = this.yearlySalary(mom)

				if (yearlySalary === null) {
					return null
				}

				return state.regulations.reduce((total: number, regulation: Regulation) => {
					const usedDays = this.daysUsedByRegulation(regulation.id, mom)
					const missedIncomePerDay = missedIncomeForRegulationPerDay(regulation, yearlySalary!!)
					return total + usedDays * missedIncomePerDay
				}, 0)
			}
		},
	},
	actions: {
		setDays(weekNumber: number, days: number, mom: boolean) {
			if (mom) {
				this.weeks[weekNumber - 1].daysOffMom = days
			} else {
				this.weeks[weekNumber - 1].daysOffSecondParent = days
			}
		},
		setGrossYearlySalary(salary: number | null, mom: boolean) {
			if ((salary !== null && salary < 1000) || isNaN(<number>salary)) {
				salary = null
			}

			if (mom) {
				this.personal.grossYearlySalaryMom = salary
			} else {
				this.personal.grossYearlySalarySecondParent = salary
			}
		},
		setDueDate(dueDate: Date) {
			this.personal.dueDate = dueDate
		},
		setDragged() {
			this.hasDragged = true
		}
	}
})

export function getNormalIncomePerDay(grossYearlySalary: number): number {
	return grossYearlySalary / officalAverageWorkingDaysPerYear
}

function payoutPerDayForParameters(
	percentageOfSalary: number,
	dailySalaryMax: number | null,
	normalIncomePerDay: number
): number {
	const percentageWise = percentageOfSalary / 100 * normalIncomePerDay

	if (dailySalaryMax === null) {
		return percentageWise
	} else {
		return Math.min(dailySalaryMax, percentageWise)
	}
}

export function payoutPerDayForRegulation(
	regulation: Regulation,
	normalIncomePerDay: number
): number {
	return payoutPerDayForParameters(
		regulation.percentageOfSalary,
		regulation.dailySalaryMax,
		normalIncomePerDay
	)
}

export function missedIncomeForParametersPerDay(
	percentageOfSalary: number,
	dailySalaryMax: number | null,
	grossYearlySalary: number
): number {
	const dagloon = getNormalIncomePerDay(grossYearlySalary)
	const payout = payoutPerDayForParameters(percentageOfSalary, dailySalaryMax, dagloon)
	return dagloon - payout
}

export function missedIncomeForRegulationPerDay(regulation: Regulation, grossYearlySalary: number): number {
	return missedIncomeForParametersPerDay(
		regulation.percentageOfSalary,
		regulation.dailySalaryMax,
		grossYearlySalary
	)
}

function totalFlexibleDays(mom: boolean): number {
	return defaultRegulations
		.filter(regulation => mom ? regulation.mom : regulation.secondParent)
		.reduce((prev: number, regulation: Regulation) => prev + regulation.daysOff, 0)
		- getTotalMinimumDays(mom)
}

function divideOverWeeks(daysAvailable: number, daysPerWeek: number): number[] {
	const fullWeeks = Math.floor(daysAvailable / daysPerWeek)
	return Array(fullWeeks).fill(daysPerWeek).concat(daysAvailable % daysPerWeek)
}

function monthlySwitch(daysAvailable: number, daysPerWeek: number): number[] {
	const fullWeeks = Math.floor(daysAvailable / daysPerWeek)
	const months = Math.floor(fullWeeks / 4)
	let result: number[] = []

	for (let i = 0; i < months; i ++) {
		result = result.concat(Array(4).fill(daysPerWeek))
		result = result.concat(Array(4).fill(0))
	}

	result = result.concat(Array(fullWeeks % 4).fill(daysPerWeek))
	result = result.concat([daysAvailable % daysPerWeek])

	return result
}

function getCombinedMinimumDays(mom: boolean): number[] {
	const regulations = defaultRegulations.filter(regulation =>
		mom ? regulation.mom : regulation.secondParent
	)

	return regulations.reduce((combined: number[], regulation) => {
		regulation.fixedDaysOff.forEach((fixed, i) => {
			if (combined[i]) {
				combined[i] += fixed
			} else {
				combined[i] = fixed
			}
		})
		return combined
	}, [])
}

function getTotalMinimumDays(mom: boolean): number {
	return getCombinedMinimumDays(mom).reduce((total: number, days: number) =>
		total + days, 0
	)
}

export function getMinimumDaysInWeek(mom: boolean, weekNumber: number): number | null {
	return getCombinedMinimumDays(mom)[weekNumber - 1] || null
}

function getWeeksForPreset(preset: Preset): Week[] {
	return Array(52).fill(null).map((value, i) => ({
		daysOffMom: preset.mom[i] || 0,
		daysOffSecondParent: preset.secondParent[i] || 0
	}))
}
