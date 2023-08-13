import { defineStore } from 'pinia'
import { MessageSchema } from '@/main'

export const uwvMaximumDagloon = Math.round(256.54)
export const seventyPercentOfMax = Math.round(.7 * uwvMaximumDagloon)
export const officalAverageWorkingDaysPerYear = 261

export interface Week {
	daysOffMom: number
	daysOffSecondParent: number
}

export interface YearMonth {
	year: number
	month: number
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

export enum CalendarBrushes {
	mom,
	partner,
	eraser
}

interface Leave {
	personal: {
		dueDate: Date | null
		daysPerWeek: number | null
		grossYearlySalaryMom: number | null
		grossYearlySalarySecondParent: number | null
		workDaysMom: number[]
		workDaysPartner: number[]
	}
	facts: {
		maxDaySalary: number
	}
	regulations: Regulation[]
	// Array of working days (monday to friday), true is day off, false is working day
	daysOffMom: boolean[]
	daysOffPartner: boolean[]
	// weeks: Week[]
	hasDragged: boolean
	activeBrush: CalendarBrushes
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
		dailySalaryMax: seventyPercentOfMax,
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
		dailySalaryMax: seventyPercentOfMax,
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

interface DaysUsedPerRegulationPerYearMonth {
	[yearMonth: string]: {
		[regulationId: string]: {
			mom: number
			secondParent: number
		}
	}
}

interface DaysUsedForAllRegulations {
	[regulationId: string]: {
		mom: number
		secondParent: number
	}
}

export enum DayTypes {
	Working = 'Working',
	PartTimer= 'PartTimer',
	ParentalLeave = 'ParentalLeave',
	Weekend = 'Weekend',
}

export interface YearMonthLeaveDays {
	[yearMonth: string]: number
}

export interface YearMonthIncome {
	[yearMonth: string]: number
}

export interface YearMonthRegulations {
	[yearMonth: string]: {
		[regulationId: string]: number
	}
}

export const useLeaveStore = defineStore('leave', {
	state: (): Leave => ({
		personal: {
			dueDate: null,
			daysPerWeek: null,
			grossYearlySalaryMom: null,
			grossYearlySalarySecondParent: null,
			workDaysMom: [1, 2, 3, 4, 5],
			workDaysPartner: [1, 2, 3, 4, 5],
		},
		facts: {
			maxDaySalary: 256,
		},
		regulations: defaultRegulations,
		daysOffMom: Array(25).fill(true).concat(Array(245).fill(false)),
		daysOffPartner: Array(5).fill(true).concat(Array(265).fill(false)),
		// weeks: [], // getWeeksForPreset(defaultPresets[0]),
		hasDragged: false,
		activeBrush: CalendarBrushes.mom,
	}),
	getters: {
		isDayOff(state): (mom: boolean, date: Date) => null | DayTypes {
			return (mom, date) => {
				if (!state.personal.dueDate) {
					return null
				}

				if (date.getTime() < state.personal.dueDate.getTime()) {
					// To do: not correct for mom, she's on pregnancy leave
					return DayTypes.Working
				}

				const dayOfWeek = date.getDay()

				if (dayOfWeek === 0 || dayOfWeek === 6) {
					return DayTypes.Weekend
				}

				if (mom && !state.personal.workDaysMom.includes(dayOfWeek)) {
					return DayTypes.PartTimer
				}

				if (!mom && !state.personal.workDaysPartner.includes(dayOfWeek)) {
					return DayTypes.PartTimer
				}

				const daysOff = mom ? state.daysOffMom : state.daysOffPartner
				const workdays = mom ? state.personal.workDaysMom : state.personal.workDaysPartner
				const businessDaysInBetween = calculateWorkingDaysInBetween(state.personal.dueDate, date, workdays)

				if (daysOff[businessDaysInBetween]) {
					return DayTypes.ParentalLeave
				} else {
					return DayTypes.Working
				}
			}
		},
		totalDaysUsed(state): (mom: boolean) => number {
			return (mom: boolean) =>
				(mom ? state.daysOffMom : state.daysOffPartner)
				.filter(dayOff => dayOff).length
		},
		daysUsedForAllRegulations(state): DaysUsedForAllRegulations {
			const result: DaysUsedForAllRegulations = {}
			const calculate = (regulationId: string, mom: boolean): number => {
				const currentRegulation = state.regulations.find(regulation =>
					regulation.id === regulationId
				)

				if (mom && !currentRegulation!!.mom) {
					return 0
				}

				if (!mom && !currentRegulation!!.secondParent) {
					return 0
				}

				const totalDaysUsed: number = this.totalDaysUsed(mom)

				const relevantRegulations = state.regulations.filter(regulation =>
					mom ? regulation.mom : regulation.secondParent
				)

				const normalHoursPerWeek = (mom ? state.personal.workDaysMom : state.personal.workDaysPartner).length * 8
				let daysUsedByOtherRegulations = 0
				let currentIndex: number = 0
				while (relevantRegulations[currentIndex] && relevantRegulations[currentIndex].id !== regulationId) {
					daysUsedByOtherRegulations = Math.min(
						totalDaysUsed,
						daysUsedByOtherRegulations + relevantRegulations[currentIndex].daysOff(normalHoursPerWeek)
					)
					currentIndex++
				}

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
		regulationsFullyPaid(state): Regulation[] {
			return state.regulations.filter(regulation =>
				regulation.percentageOfSalary === 100
				&& regulation.dailySalaryMax === null
			)
		},
		daysOffFullyPaid(state): (mom: boolean) => number {
			return (mom: boolean) => {
				const regulations = this.regulationsFullyPaid.filter(regulation =>
					(mom && regulation.mom) || (!mom && regulation.secondParent)
				)

				return this.daysOffByMultipleRegulations(regulations, mom)
			}
		},
		regulationsMaxUwv(state): Regulation[] {
			return state.regulations.filter(regulation =>
				regulation.percentageOfSalary === 100
				&& regulation.dailySalaryMax === uwvMaximumDagloon
			)
		},
		daysOffAtMaxUwv(state): (mom: boolean) => number {
			return (mom: boolean) => {
				const regulations = this.regulationsMaxUwv.filter(regulation =>
					(mom && regulation.mom) || (!mom && regulation.secondParent)
				)

				return this.daysOffByMultipleRegulations(regulations, mom)
			}
		},
		regulations70Percent(state): Regulation[] {
			return state.regulations.filter(regulation =>
				regulation.percentageOfSalary === 70
				&& regulation.dailySalaryMax === seventyPercentOfMax
			)
		},
		daysOffAt70Percent(state): (mom: boolean) => number {
			return (mom: boolean) => {
				const regulations = this.regulations70Percent.filter(regulation =>
					(mom && regulation.mom) || (!mom && regulation.secondParent)
				)

				return this.daysOffByMultipleRegulations(regulations, mom)
			}
		},
		regulationsUnpaid(state): Regulation[] {
			return state.regulations.filter(regulation =>
				regulation.percentageOfSalary === 0
			)
		},
		daysOffUnpaid(state): (mom: boolean) => number {
			return (mom: boolean) => {
				const regulations = this.regulationsUnpaid.filter(regulation =>
					(mom && regulation.mom) || (!mom && regulation.secondParent)
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

				const hoursPerWeek = (mom ? state.personal.workDaysMom : state.personal.workDaysPartner).length * 8

				return Math.round((40 / hoursPerWeek) * (yearly / officalAverageWorkingDaysPerYear))
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

				return missedIncomeForParametersPerDay(70, seventyPercentOfMax, dailySalary)
			}
		},
		payoutAt70Percent(state): (mom: boolean) => number | null {
			return (mom: boolean) => {
				const daily = this.dailySalary(mom)

				if (daily === null) {
					return null
				}

				return payoutPerDayForParameters(70, seventyPercentOfMax, daily)
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
				const normalHoursPerWeek = (mom ? state.personal.workDaysMom : state.personal.workDaysPartner).length * 8

				return defaultRegulations
						.filter(regulation => mom ? regulation.mom : regulation.secondParent)
						.reduce((prev: number, regulation: Regulation) => prev + regulation.daysOff(normalHoursPerWeek), 0)
					- this.getTotalMinimumDays(mom)
			}
		},
		normalDaysPerWeek(state): (mom: boolean) => number {
			return (mom: boolean) => {
				return (mom ? state.personal.workDaysMom : state.personal.workDaysPartner).length
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
						divideOverWeeks(this.totalFlexibleDays(true), this.normalDaysPerWeek(true))
					),
					secondParent: this.getCombinedMinimumDays(false).concat(
						divideOverWeeks(this.totalFlexibleDays(false), this.normalDaysPerWeek(false))
					)
				},
				{
					title: 'presetMonthlySwitch',
					mom: this.getCombinedMinimumDays(true).concat(
						monthlySwitch(this.totalFlexibleDays(true), this.normalDaysPerWeek(true))
					),
					secondParent: this.getCombinedMinimumDays(false).concat(5).concat(
						monthlySwitch(this.totalFlexibleDays(false) - 5, this.normalDaysPerWeek(false))
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

				const normalHoursPerWeek = this.normalDaysPerWeek(mom) * 8

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

		normalMonthlyIncome(state): (mom: boolean) => number | null {
			return (mom) => {
				const yearly = mom ? state.personal.grossYearlySalaryMom : state.personal.grossYearlySalarySecondParent

				if (!yearly) {
					return null
				}

				return Math.round(yearly / 12)
			}
		},
		yearMonths(state): YearMonth[] | null {
			if (!state.personal.dueDate) {
				return null
			}

			const date = new Date(state.personal.dueDate.valueOf())
			const result: YearMonth[] = []

			for (let i = 0; i < 12; i ++) {
				const yearMonth = {
					year: date.getFullYear(),
					month: date.getMonth()
				}

				date.setMonth(date.getMonth() + 1)
				result.push(yearMonth)
			}

			return result
		},
		yearMonthLeaveDays(state): (mom: boolean) => YearMonthLeaveDays | null {
			return (mom) => {
				if (!this.yearMonths) {
					return null
				}

				const result: YearMonthLeaveDays = {}

				this.yearMonths.forEach(yearMonth => {
					const date = new Date(yearMonth.year, yearMonth.month, 1)
					let leaveDaysThisMonth = 0

					for (let day = 0; day < 31; day ++) {
						const dayType = this.isDayOff(mom, date)

						if (dayType === DayTypes.ParentalLeave) {
							leaveDaysThisMonth ++
						}

						date.setDate(date.getDate() + 1)

						if (date.getMonth() !== yearMonth.month) {
							break
						}
					}

					result[yearMonthKey(yearMonth.year, yearMonth.month)] = leaveDaysThisMonth
				})

				return result
			}
		},
		yearMonthRegulations(state): (mom: boolean) => YearMonthRegulations | null {
			return (mom) => {
				const leaveDays = this.yearMonthLeaveDays(mom)
				if (!leaveDays) {
					return null
				}

				const result: YearMonthRegulations = {}
				const counter: { [regulationId: string] : number } = {}
				Object.keys(this.daysUsedForAllRegulations).forEach(regulationId => {
					if (mom) {
						counter[regulationId] = this.daysUsedForAllRegulations[regulationId].mom
					} else {
						counter[regulationId] = this.daysUsedForAllRegulations[regulationId].secondParent
					}
				})

				Object.keys(leaveDays).forEach(yearMonth => {
					let leaveDaysThisMonth = leaveDays[yearMonth]
					result[yearMonth] = {}

					this.regulations.forEach(regulation => {
						if (counter[regulation.id] > 0) {
							const use = Math.min(counter[regulation.id], leaveDaysThisMonth)
							counter[regulation.id] = counter[regulation.id] - use

							if (use > 0) {
								result[yearMonth][regulation.id] = use
								leaveDaysThisMonth = leaveDaysThisMonth - use
							}
						}
					})
				})

				return result
			}
		},
		yearMonthIncome(state): (mom: boolean) => YearMonthIncome | null {
			return (mom) => {
				const yearMonthRegulations = this.yearMonthRegulations(mom)
				if (!yearMonthRegulations) {
					return null
				}

				const dailySalary = this.dailySalary(mom)
				if (!dailySalary) {
					return null
				}

				const normalMonthly = this.normalMonthlyIncome(mom)
				if (!normalMonthly) {
					return null
				}

				const income: YearMonthIncome = {}

				Object.keys(yearMonthRegulations).forEach(yearMonth => {
					const perRegulation = yearMonthRegulations[yearMonth]
					let incomeThisMonth = normalMonthly

					Object.keys(perRegulation).forEach(regulationId => {
						const days = perRegulation[regulationId]
						const missedIncome = missedIncomeForRegulationPerDay(
							this.regulations.find(find => find.id === regulationId)!!,
							dailySalary
						)

						incomeThisMonth = incomeThisMonth - days * missedIncome
					})

					income[yearMonth] = Math.max(0, Math.round(incomeThisMonth))
				})

				return income
			}
		}
	},
	actions: {
		setDay(date: Date, off: boolean, mom: boolean) {
			if (!this.personal.dueDate) {
				return
			}

			if (date.getDay() === 6 || date.getDay() === 0) {
				return
			}

			const workdays = mom ? this.personal.workDaysMom : this.personal.workDaysPartner
			const businessDays = calculateWorkingDaysInBetween(this.personal.dueDate, date, workdays)

			if (mom) {
				this.daysOffMom[businessDays] = off
			} else {
				this.daysOffPartner[businessDays] = off
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
		setWorkDays(mom: boolean, workDays: number[]) {
			if (mom) {
				this.personal.workDaysMom = workDays
			} else {
				this.personal.workDaysPartner = workDays
			}
		},
		setDueDate(dueDate: Date) {
			if (dueDate.getFullYear() > 2000) {
				this.personal.dueDate = dueDate
			}
		},
		setDragged() {
			this.hasDragged = true
		},
		setDaysOff(mom: boolean, daysOff: boolean[]) {
			if (mom) {
				this.daysOffMom = daysOff
			} else {
				this.daysOffPartner = daysOff
			}
		},
		setActiveBrush(brush: CalendarBrushes) {
			this.activeBrush = brush
		}
	}
})

function payoutPerDayForParameters(
	percentageOfSalary: number,
	dailySalaryMax: number | null,
	normalIncomePerDay: number
): number {
	const percentageWise = Math.round(percentageOfSalary / 100 * normalIncomePerDay)

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

export function calculateWorkingDaysInBetween(startDate: Date, endDate: Date, workdays: number[]): number {
	const endTime = endDate.getTime()
	const startTime = startDate.getTime()
	if (endTime < startTime) {
		return 0
	}

	const diff = endTime - startTime
	const millisecondsPerDay = 86400 * 1000
	const diffDays = Math.ceil(diff / millisecondsPerDay)

	let counter = 0
	let currentWeekDay = startDate.getDay()

	for (let i = 0; i < diffDays; i ++) {
		if (currentWeekDay === 6) {
			currentWeekDay = 0
		} else {
			currentWeekDay ++
		}

		if (workdays.includes(currentWeekDay)) {
			counter ++
		}
	}

	return counter
}

export function yearMonthKey(year: number, month: number): string {
	return year + '-' + month
}