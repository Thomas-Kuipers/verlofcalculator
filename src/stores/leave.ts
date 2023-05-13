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
	daysOff: (normalHoursPerWeek: number) => number
	fixedDaysOff: (normalHoursPerWeek: number) => number[]
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
		normalHoursPerWeekMom: number
		normalHoursPerWeekSecondParent: number
	}
	facts: {
		maxDaySalary: number
	}
	regulations: Regulation[]
	weeks: Week[]
	hasDragged: boolean
}

const defaultRegulations: Regulation[] = [
	{
		id: 'delivery',
		title: 'regulationDeliveryTitle',
		daysOff: normalHoursPerWeek => 12 * normalHoursPerWeek / 8,
		fixedDaysOff: normalHoursPerWeek => Array(5).fill(normalHoursPerWeek / 8),
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
		daysOff: normalHoursPerWeek => normalHoursPerWeek / 8,
		fixedDaysOff: normalHoursPerWeek => [normalHoursPerWeek / 8],
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
		daysOff: normalHoursPerWeek => 5 * normalHoursPerWeek / 8,
		fixedDaysOff: normalHoursPerWeek => [],
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
		daysOff: normalHoursPerWeek => 9 * normalHoursPerWeek / 8,
		fixedDaysOff: normalHoursPerWeek => [],
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
		daysOff: normalHoursPerWeek => 17 * normalHoursPerWeek / 8,
		fixedDaysOff: normalHoursPerWeek => [],
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

interface DaysUsedForAllRegulations {
	[regulationId: string]: {
		mom: number
		secondParent: number
	}
}

export const useLeaveStore = defineStore('leave', {
	state: (): Leave => ({
		personal: {
			dueDate: null,
			daysPerWeek: null,
			grossYearlySalaryMom: null,
			grossYearlySalarySecondParent: null,
			normalHoursPerWeekMom: 40,
			normalHoursPerWeekSecondParent: 40
		},
		facts: {
			maxDaySalary: 256,
		},
		regulations: defaultRegulations,
		weeks: [], // getWeeksForPreset(defaultPresets[0]),
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
		daysUsedForAllRegulations(state): DaysUsedForAllRegulations {
			const result: DaysUsedForAllRegulations = {}
			const calculate = (regulationId: string, mom: boolean): number => {
				const totalDaysUsed: number = state.weeks.reduce((total: number, week: Week) =>
						total + (mom ? week.daysOffMom : week.daysOffSecondParent)
					, 0)

				const relevantRegulations = state.regulations.filter(regulation =>
					mom ? regulation.mom : regulation.secondParent
				)

				const normalHoursPerWeek = mom ? state.personal.normalHoursPerWeekMom : state.personal.normalHoursPerWeekSecondParent
				let daysUsedByOtherRegulations = 0
				let currentIndex: number = 0
				while (relevantRegulations[currentIndex] && relevantRegulations[currentIndex].id !== regulationId) {
					daysUsedByOtherRegulations = Math.min(
						totalDaysUsed,
						daysUsedByOtherRegulations + relevantRegulations[currentIndex].daysOff(normalHoursPerWeek)
					)
					currentIndex++
				}

				const currentRegulation = state.regulations.find(regulation =>
					regulation.id === regulationId
				)

				return Math.min(currentRegulation!!.daysOff(normalHoursPerWeek), totalDaysUsed - daysUsedByOtherRegulations)
			}

			this.regulations.forEach(regulation => {
				result[regulation.id] = {
					mom: calculate(regulation.id, true),
					secondParent: calculate(regulation.id, false)
				}
			})

			return result
		},
		daysUsedByRegulation(state): (regulationId: string, mom: boolean) => number {
			return (regulationId: string, mom: boolean): number => {
				const result = this.daysUsedForAllRegulations[regulationId]

				if (!result) {
					return 0
				}

				if (mom) {
					return result.mom
				} else {
					return result.secondParent
				}
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

				const hoursPerWeek = mom ? state.personal.normalHoursPerWeekMom : state.personal.normalHoursPerWeekSecondParent

				return (40 / hoursPerWeek) * (yearly / officalAverageWorkingDaysPerYear)
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
				const dailySalary = this.dailySalary(mom)

				if (dailySalary === null) {
					return null
				}

				return missedIncomeForParametersPerDay(100, uwvMaximumDagloon, dailySalary)
			}
		},
		missedIncomeAt70Percent(state): (mom: boolean) => number | null {
			return (mom: boolean) => {
				const dailySalary = this.dailySalary(mom)

				if (dailySalary === null) {
					return null
				}

				return missedIncomeForParametersPerDay(70, 0.7 * uwvMaximumDagloon, dailySalary)
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
				const dailySalary = this.dailySalary(mom)

				if (dailySalary === null) {
					return null
				}

				return missedIncomeForParametersPerDay(0, 0, dailySalary)
			}
		},
		totalMissedIncome(state): (mom: boolean) => number | null {
			return (mom: boolean) => {
				const dailySalary = this.dailySalary(mom)

				if (dailySalary === null) {
					return null
				}

				return state.regulations.reduce((total: number, regulation: Regulation) => {
					const usedDays = this.daysUsedByRegulation(regulation.id, mom)
					const missedIncomePerDay = missedIncomeForRegulationPerDay(regulation, dailySalary!!)
					return total + usedDays * missedIncomePerDay
				}, 0)
			}
		},
		totalFlexibleDays(state): (mom: boolean) => number {
			return (mom: boolean) => {
				const normalHoursPerWeek = mom ? state.personal.normalHoursPerWeekMom : state.personal.normalHoursPerWeekSecondParent

				return defaultRegulations
						.filter(regulation => mom ? regulation.mom : regulation.secondParent)
						.reduce((prev: number, regulation: Regulation) => prev + regulation.daysOff(normalHoursPerWeek), 0)
					- this.getTotalMinimumDays(mom)
			}
		},
		presets(state): Preset[] {
			return [
				{
					title: 'presetAsLittleAsPossible',
					mom: this.getCombinedMinimumDays(true),
					secondParent: this.getCombinedMinimumDays(false),
				},
				{
					title: 'presetEverythingImmediately',
					mom: this.getCombinedMinimumDays(true).concat(
						divideOverWeeks(this.totalFlexibleDays(true), 5)
					),
					secondParent: this.getCombinedMinimumDays(false).concat(
						divideOverWeeks(this.totalFlexibleDays(false), 5)
					)
				},
				{
					title: 'presetMonthlySwitch',
					mom: this.getCombinedMinimumDays(true).concat(
						monthlySwitch(this.totalFlexibleDays(true), 5)
					),
					secondParent: this.getCombinedMinimumDays(false).concat(5).concat(
						monthlySwitch(this.totalFlexibleDays(false) - 5, 5)
					),
				},
				{
					title: 'presetPartTimersMom',
					mom: this.getCombinedMinimumDays(true).concat(
						divideOverWeeks(this.totalFlexibleDays(true), 2)
					),
					secondParent: this.getCombinedMinimumDays(false).concat(
						divideOverWeeks(this.totalFlexibleDays(false), 3)
					),
				},
				{
					title: 'presetPartTimersPartner',
					mom: this.getCombinedMinimumDays(true).concat(
						divideOverWeeks(this.totalFlexibleDays(true), 3)
					),
					secondParent: this.getCombinedMinimumDays(false).concat(
						divideOverWeeks(this.totalFlexibleDays(false), 2)
					),
				},
				{
					title: 'presetEqualPartTimers',
					mom: this.getCombinedMinimumDays(true).concat(
						divideOverWeeks(this.totalFlexibleDays(true), 2)
					),
					secondParent: this.getCombinedMinimumDays(false).concat(
						divideOverWeeks(this.totalFlexibleDays(false), 2)
					),
				}
			]
		},

		getCombinedMinimumDays(state): (mom: boolean) => number[] {
			return (mom: boolean) => {
				const regulations = defaultRegulations.filter(regulation =>
					mom ? regulation.mom : regulation.secondParent
				)

				const normalHoursPerWeek = mom ? state.personal.normalHoursPerWeekMom : state.personal.normalHoursPerWeekSecondParent

				return regulations.reduce((combined: number[], regulation) => {
					regulation.fixedDaysOff(normalHoursPerWeek).forEach((fixed, i) => {
						if (combined[i]) {
							combined[i] += fixed
						} else {
							combined[i] = fixed
						}
					})
					return combined
				}, [])
			}
		},

		getTotalMinimumDays(state): (mom: boolean) => number {
			return (mom: boolean) => {
				return this.getCombinedMinimumDays(mom).reduce((total: number, days: number) =>
					total + days, 0
				)
			}
		},

		getMinimumDaysInWeek(state): (mom: boolean, weekNumber: number) => number | null {
			return (mom: boolean, weekNumber: number) => {
				return this.getCombinedMinimumDays(mom)[weekNumber - 1] || null
			}
		},

		childCareDaysPerWeek(state): (week: Week) => number {
			return (week: Week) => {
				const freeWeekDaysMom = (40 - state.personal.normalHoursPerWeekMom) / 8
				const freeWeekDaysSecondParent = (40 - state.personal.normalHoursPerWeekSecondParent) / 8

				return Math.max(0,
					5
					- week.daysOffMom
					- week.daysOffSecondParent
					- freeWeekDaysMom
					- freeWeekDaysSecondParent
				)
			}
		},

		totalChildcareDays(state): number {
			return state.weeks.reduce(
				(total, week) => total + this.childCareDaysPerWeek(week)
				, 0
			)
		}
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
		setNormalHoursPerWeek(hoursPerWeek: number, mom: boolean) {
			if ((hoursPerWeek < 1) || isNaN(hoursPerWeek)) {
				return
			}

			if (mom) {
				this.personal.normalHoursPerWeekMom = hoursPerWeek
			} else {
				this.personal.normalHoursPerWeekSecondParent = hoursPerWeek
			}
		},
		setDueDate(dueDate: Date) {
			this.personal.dueDate = dueDate
		},
		setDragged() {
			this.hasDragged = true
		},
		setWeeks(weeks: Week[]) {
			this.weeks = weeks
		}
	}
})

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
	dailySalary: number
): number {
	const payout = payoutPerDayForParameters(percentageOfSalary, dailySalaryMax, dailySalary)
	return dailySalary - payout
}

export function missedIncomeForRegulationPerDay(regulation: Regulation, dailySalary: number): number {
	return missedIncomeForParametersPerDay(
		regulation.percentageOfSalary,
		regulation.dailySalaryMax,
		dailySalary
	)
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


export function getWeeksForPreset(preset: Preset): Week[] {
	return Array(52).fill(null).map((value, i) => ({
		daysOffMom: preset.mom[i] || 0,
		daysOffSecondParent: preset.secondParent[i] || 0
	}))
}
