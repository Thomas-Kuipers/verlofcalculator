import { defineStore } from 'pinia'

const uwvMaximumDagloon = 256.54
const officalAverageWorkingDaysPerYear = 261

export interface Week {
	daysOffMom: number
	daysOffSecondParent: number
}

export interface Regulation {
	id: string
	title: string
	daysOff: number
	fixedDaysOff: number[]
	mom: boolean
	secondParent: boolean
	percentageOfSalary: number
	dailySalaryMax: number | null
	url: string
	officialTitle: string
	description: string[]
}

export interface Preset {
	title: string
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
}

const defaultRegulations: Regulation[] = [
	{
		id: 'delivery',
		title: 'Birth leave for mom',
		daysOff: 12 * 5,
		fixedDaysOff: [5, 5, 5, 5, 5, 5],
		mom: true,
		secondParent: false,
		percentageOfSalary: 100,
		dailySalaryMax: uwvMaximumDagloon,
		officialTitle: 'Bevallingsverlof',
		description: [
			'For the mom, who has given birth.',
			'Between 10 and 12 weeks, depending on when you use your zwangerschapsverlof. If you\'ve used 4 weeks zwangerschapsverlof, you get 12 weeks bevallingsverlof. If you\'ve used 5, you get 13. If you\'ve used 6, you get 12. In this calculator, 12 is assumed.',
			'Paid by UWV, at 100% of your normal salary, but capped at the UWV maximum of ' + uwvMaximumDagloon + ' euros per day.'
		],
		url: 'https://www.rijksoverheid.nl/onderwerpen/zwangerschapsverlof-en-bevallingsverlof/vraag-en-antwoord/zwangerschapsverlof-en-bevallingsverlof-berekenen'
	},
	{
		id: 'birth',
		title: 'Birth leave for partner',
		daysOff: 5,
		fixedDaysOff: [5],
		mom: false,
		secondParent: true,
		percentageOfSalary: 100,
		dailySalaryMax: null,
		officialTitle: 'Geboorteverlof (voor partners)',
		description: [
			'1 Week for the second parent.',
			'Paid by your employer, at 100% of your normal salary.'
		],
		url: 'https://www.rijksoverheid.nl/onderwerpen/geboorteverlof-en-partnerverlof/geboorteverlof-voor-partners'
	},
	{
		id: 'additionalBirth',
		title: 'Additional birth leave',
		daysOff: 5 * 5,
		fixedDaysOff: [],
		mom: false,
		secondParent: true,
		percentageOfSalary: 70,
		dailySalaryMax: 0.7 * uwvMaximumDagloon,
		officialTitle: 'Aanvullend geboorteverlof',
		description: [
			'5 Weeks for the second parent.',
			'Paid by UWV, at 70% of your normal salary. It\'s also capped at 70% of the UWV maximum, so it can never be higher than ' + Math.round(0.7 * uwvMaximumDagloon) + ' per day.'
		],
		url: 'https://www.rijksoverheid.nl/onderwerpen/geboorteverlof-en-partnerverlof/geboorteverlof-voor-partners',
	},
	{
		id: 'paidParental',
		title: 'Paid parental leave',
		daysOff: 9 * 5,
		fixedDaysOff: [],
		mom: true,
		secondParent: true,
		percentageOfSalary: 70,
		dailySalaryMax: 0.7 * uwvMaximumDagloon,
		officialTitle: 'Betaald ouderschapsverlof',
		description: [
			'9 Weeks total.',
			'Valid for both mom and second parent.',
			'Paid by UWV, at 70% of your normal salary. It\'s also capped at 70% of the UWV maximum, so it can never be higher than ' + Math.round(0.7 * uwvMaximumDagloon) + ' per day.',
			'Must be used within 1 year of the birth.'
		],
		url: 'https://www.rijksoverheid.nl/onderwerpen/ouderschapsverlof/vraag-en-antwoord/wanneer-heb-ik-recht-op-betaald-ouderschapsverlof'
	},
	{
		id: 'unpaidParental',
		title: 'Unpaid parental leave',
		daysOff: 17 * 5,
		fixedDaysOff: [],
		mom: true,
		secondParent: true,
		percentageOfSalary: 0,
		dailySalaryMax: null,
		officialTitle: 'Onbetaald ouderschapsverlof',
		description: [
			'17 Weeks total.',
			'Valid for both mom and second parent.',
			'Not paid at all.'
		],
		url: 'https://www.rijksoverheid.nl/onderwerpen/ouderschapsverlof/vraag-en-antwoord/wanneer-heb-ik-recht-op-betaald-ouderschapsverlof'
	}
]

const defaultPresets: Preset[] = [
	{
		title: 'As little as possible',
		mom: getCombinedMinimumDays(true),
		secondParent: getCombinedMinimumDays(false),
	},
	{
		title: 'Everything immediately',
		mom: getCombinedMinimumDays(true).concat(
			divideOverWeeks(totalFlexibleDays(true), 5)
		),
		secondParent: getCombinedMinimumDays(false).concat(
			divideOverWeeks(totalFlexibleDays(false), 5)
		)
	},
	{
		title: 'Monthly switch',
		mom: getCombinedMinimumDays(true).concat(
			monthlySwitch(totalFlexibleDays(true), 5)
		),
		secondParent: getCombinedMinimumDays(false).concat(5).concat(
			monthlySwitch(totalFlexibleDays(false) - 5, 5)
		),
	},
	{
		title: 'Part-timers, mom works most',
		mom: getCombinedMinimumDays(true).concat(
			divideOverWeeks(totalFlexibleDays(true), 2)
		),
		secondParent: getCombinedMinimumDays(false).concat(
			divideOverWeeks(totalFlexibleDays(false), 3)
		),
	},
	{
		title: 'Part-timers, second parent works most',
		mom: getCombinedMinimumDays(true).concat(
			divideOverWeeks(totalFlexibleDays(true), 3)
		),
		secondParent: getCombinedMinimumDays(false).concat(
			divideOverWeeks(totalFlexibleDays(false), 2)
		),
	},
	{
		title: 'Equal part-timers, one day per week babysitter',
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
		}
	}
})

function missedIncomeForParametersPerDay(
	percentageOfSalary: number,
	dailySalaryMax: number | null,
	grossYearlySalary: number
): number {
	const dagloon = grossYearlySalary / officalAverageWorkingDaysPerYear
	const percentageWise = percentageOfSalary / 100 * dagloon

	if (dailySalaryMax === null) {
		return dagloon - percentageWise
	} else {
		return dagloon - Math.min(dailySalaryMax, percentageWise)
	}
}

function missedIncomeForRegulationPerDay(regulation: Regulation, grossYearlySalary: number): number {
	return missedIncomeForParametersPerDay(regulation.percentageOfSalary, regulation.dailySalaryMax, grossYearlySalary)
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
