/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react'
import Question from '../Question/Question'
import { questions } from '../../data/questions'
import type { TestState, UserAnswer } from '../../types/test'
import styles from './TestComponent.module.css'

const TestComponent: React.FC = () => {
	const [testState, setTestState] = useState<TestState>({
		currentQuestion: 0,
		answers: {},
		showResults: false,
		timeSpent: 0,
		mode: 'test',
		mistakeQuestions: [],
	})

	const [showAnswers, setShowAnswers] = useState<boolean>(false)
	const testContainerRef = useRef<HTMLDivElement>(null)

	const scrollToTop = () => {
		if (testContainerRef.current) {
			testContainerRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			})
		} else {
			window.scrollTo({ top: 0, behavior: 'smooth' })
		}
	}

	useEffect(() => {
		scrollToTop()
	}, [testState.currentQuestion])

	useEffect(() => {
		if (testState.showResults) {
			scrollToTop()
		}
	}, [testState.showResults])

	useEffect(() => {
		if (!testState.showResults) {
			const timer = setInterval(() => {
				setTestState(prev => ({
					...prev,
					timeSpent: prev.timeSpent + 1,
				}))
			}, 1000)
			return () => clearInterval(timer)
		}
	}, [testState.showResults])

	const handleAnswer = (
		answer: [number, number, number] | [number, number]
	) => {
		const currentQuestionData = getCurrentQuestion()

		let isCorrect: boolean
		if (currentQuestionData.correctAnswer.length === 2) {
			const userAnswer = answer as [number, number]
			const correctAnswer = currentQuestionData.correctAnswer as [
				number,
				number
			]
			isCorrect =
				userAnswer[0] === correctAnswer[0] && userAnswer[1] === correctAnswer[1]
		} else {
			const userAnswer = answer as [number, number, number]
			const correctAnswer = currentQuestionData.correctAnswer as [
				number,
				number,
				number
			]
			isCorrect =
				userAnswer[0] === correctAnswer[0] &&
				userAnswer[1] === correctAnswer[1] &&
				userAnswer[2] === correctAnswer[2]
		}

		setTestState(prev => ({
			...prev,
			answers: {
				...prev.answers,
				[testState.currentQuestion]: {
					answer,
					isCorrect,
				},
			},
		}))
	}

	const getCurrentQuestion = () => {
		if (testState.mode === 'mistakes') {
			return questions[testState.mistakeQuestions[testState.currentQuestion]]
		}
		return questions[testState.currentQuestion]
	}

	const getTotalQuestions = () => {
		if (testState.mode === 'mistakes') {
			return testState.mistakeQuestions.length
		}
		return questions.length
	}

	const nextQuestion = () => {
		const total = getTotalQuestions()
		if (testState.currentQuestion < total - 1) {
			setTestState(prev => ({
				...prev,
				currentQuestion: prev.currentQuestion + 1,
			}))
		} else {
			if (testState.mode === 'test') {
				calculateResults()
			} else {
				setTestState(prev => ({
					...prev,
					showResults: true,
				}))
			}
		}
	}

	const prevQuestion = () => {
		if (testState.currentQuestion > 0) {
			setTestState(prev => ({
				...prev,
				currentQuestion: prev.currentQuestion - 1,
			}))
		}
	}

	const goToQuestion = (index: number) => {
		setTestState(prev => ({
			...prev,
			currentQuestion: index,
		}))
	}

	const calculateResults = () => {
		const mistakes: number[] = []

		questions.forEach((_, index) => {
			const answer = testState.answers[index]
			if (!answer || !answer.isCorrect) {
				mistakes.push(index)
			}
		})

		setTestState(prev => ({
			...prev,
			showResults: true,
			mistakeQuestions: mistakes,
		}))
	}

	const startMistakesReview = () => {
		if (testState.mistakeQuestions.length === 0) {
			alert('У вас нет ошибок для повторения! 🎉')
			return
		}

		setTestState({
			currentQuestion: 0,
			answers: {},
			showResults: false,
			timeSpent: 0,
			mode: 'mistakes',
			mistakeQuestions: testState.mistakeQuestions,
		})
		setShowAnswers(false)
	}

	const restartTest = () => {
		setTestState({
			currentQuestion: 0,
			answers: {},
			showResults: false,
			timeSpent: 0,
			mode: 'test',
			mistakeQuestions: [],
		})
		setShowAnswers(false)
	}

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60)
		const secs = seconds % 60
		return `${mins}:${secs < 10 ? '0' : ''}${secs}`
	}

	const toggleShowAnswers = () => {
		setShowAnswers(prev => !prev)
	}

	const getQuestionStatus = (
		index: number
	): 'correct' | 'incorrect' | 'unanswered' | 'current' => {
		if (testState.mode === 'mistakes') {
			const originalIndex = testState.mistakeQuestions[index]
			if (index === testState.currentQuestion) return 'current'
			if (!testState.answers[originalIndex]) return 'unanswered'
			return testState.answers[originalIndex].isCorrect
				? 'correct'
				: 'incorrect'
		}

		if (index === testState.currentQuestion) return 'current'
		if (!testState.answers[index]) return 'unanswered'
		return testState.answers[index].isCorrect ? 'correct' : 'incorrect'
	}

	const getQuestionNumber = (index: number): number => {
		if (testState.mode === 'mistakes') {
			return testState.mistakeQuestions[index] + 1
		}
		return index + 1
	}

	const renderQuestionGrid = () => {
		const totalQuestions = getTotalQuestions()

		if (testState.mode === 'mistakes') {
			return (
				<div className={styles.questionGridCompact}>
					{Array.from({ length: totalQuestions }, (_, index) => (
						<button
							key={index}
							onClick={() => goToQuestion(index)}
							className={`
								${styles.questionButton} 
								${styles[getQuestionStatus(index)]}
							`}
							title={`Вопрос ${getQuestionNumber(index)}`}
						>
							{getQuestionNumber(index)}
						</button>
					))}
				</div>
			)
		}

		return (
			<div className={styles.questionGridFull}>
				{Array.from({ length: totalQuestions }, (_, index) => (
					<button
						key={index}
						onClick={() => goToQuestion(index)}
						className={`
							${styles.questionButton} 
							${styles[getQuestionStatus(index)]}
						`}
						title={`Вопрос ${getQuestionNumber(index)}`}
					>
						{getQuestionNumber(index)}
					</button>
				))}
			</div>
		)
	}

	const renderMatchingAnswerComparison = (
		question: any,
		userAnswer: UserAnswer,
		isCorrect: boolean
	) => {
		const isTwoAnswer = question.correctAnswer.length === 2
		const answerLabels = isTwoAnswer ? ['А', 'Б'] : ['А', 'Б', 'В']
		const columns = isTwoAnswer ? 2 : 3

		return (
			<div className={styles.matchingAnswer}>
				<div className={styles.answerComparison}>
					<div className={styles.answerColumn}>
						<strong>Ваш ответ:</strong>
						<div className={styles.answerTable} data-columns={columns}>
							<div className={styles.tableHeader}>
								{answerLabels.map(label => (
									<div key={label} className={styles.tableCell}>
										{label}
									</div>
								))}
							</div>
							<div className={styles.tableRow}>
								{userAnswer.answer.map((value: number, index: number) => (
									<div
										key={index}
										className={`
										${styles.tableCell} 
										${
											!isCorrect && value !== question.correctAnswer[index]
												? styles.wrongAnswer
												: ''
										}
									`}
									>
										{value || '—'}
									</div>
								))}
							</div>
						</div>
					</div>

					{(!isCorrect || !userAnswer) && (
						<div className={styles.answerColumn}>
							<strong className={styles.correctAnswerTitle}>
								Правильный ответ:
							</strong>
							<div className={styles.answerTable} data-columns={columns}>
								<div className={styles.tableHeader}>
									{answerLabels.map(label => (
										<div key={label} className={styles.tableCell}>
											{label}
										</div>
									))}
								</div>
								<div className={styles.tableRow}>
									{question.correctAnswer.map(
										(value: number, index: number) => (
											<div
												key={index}
												className={`${styles.tableCell} ${styles.correctAnswer}`}
											>
												{value}
											</div>
										)
									)}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		)
	}

	if (testState.showResults) {
		const total = questions.length
		const correct = total - testState.mistakeQuestions.length
		const percentage = Math.round((correct / total) * 100)

		return (
			<div className={styles.results} ref={testContainerRef}>
				<h2>Результаты теста</h2>
				<div className={styles.resultStats}>
					<div className={styles.resultItem}>
						<span className={styles.resultLabel}>Правильных ответов:</span>
						<span className={styles.resultValue}>
							{correct} из {total}
						</span>
					</div>
					<div className={styles.resultItem}>
						<span className={styles.resultLabel}>Процент выполнения:</span>
						<span
							className={styles.resultValue}
							style={{
								color:
									percentage >= 80
										? '#27ae60'
										: percentage >= 60
										? '#f39c12'
										: '#e74c3c',
							}}
						>
							{percentage}%
						</span>
					</div>
					<div className={styles.resultItem}>
						<span className={styles.resultLabel}>Время выполнения:</span>
						<span className={styles.resultValue}>
							{formatTime(testState.timeSpent)}
						</span>
					</div>
					<div className={styles.resultItem}>
						<span className={styles.resultLabel}>Ошибок:</span>
						<span className={styles.resultValue}>
							{testState.mistakeQuestions.length}
						</span>
					</div>
				</div>

				<div className={styles.resultsActions}>
					{testState.mistakeQuestions.length > 0 && (
						<button
							onClick={startMistakesReview}
							className={styles.mistakesButton}
						>
							Проработать ошибки
						</button>
					)}
					<button
						onClick={toggleShowAnswers}
						className={styles.showAnswersButton}
					>
						{showAnswers ? 'Скрыть ответы' : 'Показать ответы'}
					</button>

					<button onClick={restartTest} className={styles.restartButton}>
						Начать заново
					</button>
				</div>

				{showAnswers && (
					<div className={styles.answersReview}>
						<h3>Проверка ответов</h3>
						<div className={styles.answersList}>
							{questions.map((question, index) => {
								const userAnswer = testState.answers[index]
								const isCorrect = userAnswer?.isCorrect
								const isMistake = testState.mistakeQuestions.includes(index)

								return (
									<div
										key={question.id}
										className={`${styles.answerItem} ${
											isMistake ? styles.mistakeItem : ''
										}`}
									>
										<div className={styles.answerHeader}>
											<span className={styles.questionNumber}>
												Вопрос {index + 1}
											</span>
											<span
												className={`
													${styles.answerStatus} 
													${
														userAnswer
															? isCorrect
																? styles.correct
																: styles.incorrect
															: styles.unanswered
													}
												`}
											>
												{userAnswer
													? isCorrect
														? '✓ Правильно'
														: '✗ Неправильно'
													: 'Не отвечено'}
											</span>
										</div>

										<div className={styles.questionText}>{question.text}</div>

										<div className={styles.questionColumnsPreview}>
											<div className={styles.previewColumn}>
												<strong>{question.leftColumn.title}</strong>
												{question.leftColumn.items.map(item => (
													<div key={item.value} className={styles.previewItem}>
														{item.label}
													</div>
												))}
											</div>
											<div className={styles.previewColumn}>
												<strong>{question.rightColumn.title}</strong>
												{question.rightColumn.items.map(item => (
													<div key={item.value} className={styles.previewItem}>
														{item.label}
													</div>
												))}
											</div>
										</div>

										<div className={styles.answerComparison}>
											<div className={styles.answerColumn}>
												<div className={styles.answerValues}>
													{userAnswer ? (
														renderMatchingAnswerComparison(
															question,
															userAnswer,
															isCorrect
														)
													) : (
														<div className={styles.noAnswer}>— Не отвечено</div>
													)}
												</div>
											</div>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				)}
			</div>
		)
	}

	const currentQuestionData = getCurrentQuestion()
	const currentAnswer =
		testState.answers[
			testState.mode === 'mistakes'
				? testState.mistakeQuestions[testState.currentQuestion]
				: testState.currentQuestion
		]?.answer ||
		(currentQuestionData.correctAnswer.length === 2 ? [0, 0] : [0, 0, 0])

	const totalQuestions = getTotalQuestions()
	const currentNumber =
		testState.mode === 'mistakes'
			? testState.mistakeQuestions[testState.currentQuestion] + 1
			: testState.currentQuestion + 1

	return (
		<div className={styles.testContainer} ref={testContainerRef}>
			<div className={styles.header}>
				<h1>
					{testState.mode === 'mistakes'
						? 'Работа над ошибками'
						: 'Тест по физике 1'}
					{testState.mode === 'mistakes' && (
						<span className={styles.mistakesBadge}>
							{testState.mistakeQuestions.length} вопросов
						</span>
					)}
				</h1>
				<div className={styles.stats}>
					<div className={styles.progress}>
						Вопрос {currentNumber} из{' '}
						{testState.mode === 'mistakes'
							? testState.mistakeQuestions.length
							: questions.length}
					</div>
					<div className={styles.timer}>
						Время: {formatTime(testState.timeSpent)}
					</div>
				</div>
			</div>

			<div className={styles.progressBar}>
				<div
					className={styles.progressFill}
					style={{
						width: `${
							((testState.currentQuestion + 1) / totalQuestions) * 100
						}%`,
					}}
				></div>
			</div>

			<Question
				question={{
					...currentQuestionData,
					number: currentNumber,
				}}
				answer={currentAnswer}
				onAnswerChange={handleAnswer}
			/>

			<div className={styles.navigation}>
				<button
					onClick={prevQuestion}
					disabled={testState.currentQuestion === 0}
					className={styles.navButton}
				>
					← Назад
				</button>

				{renderQuestionGrid()}

				<button onClick={nextQuestion} className={styles.navButton}>
					{testState.currentQuestion === totalQuestions - 1
						? 'Завершить'
						: 'Далее →'}
				</button>
			</div>

			{testState.mode === 'mistakes' && (
				<div className={styles.mistakesInfo}>
					<strong>Режим работы над ошибками:</strong>
					<br />
					Вы повторяете вопросы, в которых допустили ошибки в основном тесте
				</div>
			)}
		</div>
	)
}

export default TestComponent
