export type MatchingOption = {
	label: string
	value: number
}

export type MatchingQuestion = {
	id: string
	number: number
	text: string
	imageUrl?: string
	leftColumn: {
		title: string
		items: MatchingOption[]
	}
	rightColumn: {
		title: string
		items: MatchingOption[]
	}
	correctAnswer: [number, number, number] | [number, number]
}

export type Question = MatchingQuestion

export type UserAnswer = {
	answer: [number, number, number]
	isCorrect: boolean
}

export type TestState = {
	currentQuestion: number
	answers: { [key: number]: UserAnswer }
	showResults: boolean
	timeSpent: number
	mode: 'test' | 'review' | 'mistakes'
	mistakeQuestions: number[]
}

export type TestResults = {
	correct: number
	total: number
	percentage: number
	mistakes: number[]
}
