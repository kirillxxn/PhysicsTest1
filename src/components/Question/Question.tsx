import React from 'react'
import styles from './Question.module.css'
import type { Question as QuestionType } from '../../types/test'

type QuestionProps = {
	question: QuestionType & { number: number }
	answer: [number, number, number] | [number, number]
	onAnswerChange: (answer: [number, number, number] | [number, number]) => void
}

const Question: React.FC<QuestionProps> = ({
	question,
	answer,
	onAnswerChange,
}) => {
	const isTwoAnswer = question.correctAnswer.length === 2

	const handleAnswerChange = (index: number, value: number) => {
		if (isTwoAnswer) {
			const newAnswer = [...answer] as [number, number]
			newAnswer[index] = value
			onAnswerChange(newAnswer)
		} else {
			const newAnswer = [...answer] as [number, number, number]
			newAnswer[index] = value
			onAnswerChange(newAnswer)
		}
	}

	const getImageUrl = (url: string | undefined): string => {
		if (!url) return ''

		const base = import.meta.env.BASE_URL

		if (url.startsWith(base)) {
			return url
		}

		return `${base}${url}`
	}

	const answerLabels = isTwoAnswer ? ['А', 'Б'] : ['А', 'Б', 'В']

	return (
		<div className={styles.question}>
			<h3 className={styles.questionNumber}>Вопрос {question.number}</h3>
			<div className={styles.questionText}>{question.text}</div>

			{question.imageUrl && (
				<div className={styles.imageContainer}>
					<img
						src={getImageUrl(question.imageUrl)}
						alt='Иллюстрация к вопросу'
						onError={e => {
							const target = e.target as HTMLImageElement
							target.style.display = 'none'
							const parent = target.parentElement
							if (parent) {
								parent.style.display = 'none'
							}
						}}
						loading='lazy'
					/>
				</div>
			)}

			<div className={styles.matchingSection}>
				<div className={styles.columnsContainer}>
					<div className={styles.column}>
						<h4 className={styles.columnTitle}>{question.leftColumn.title}</h4>
						<div className={styles.columnItems}>
							{question.leftColumn.items.map(item => (
								<div key={item.value} className={styles.columnItem}>
									<span className={styles.itemLabel}>{item.label}</span>
								</div>
							))}
						</div>
					</div>

					<div className={styles.column}>
						<h4 className={styles.columnTitle}>{question.rightColumn.title}</h4>
						<div className={styles.columnItems}>
							{question.rightColumn.items.map(item => (
								<div key={item.value} className={styles.columnItem}>
									<span className={styles.itemLabel}>{item.label}</span>
								</div>
							))}
						</div>
					</div>
				</div>

				<div className={styles.answerInputs}>
					{answerLabels.map((label, index) => (
						<div key={label} className={styles.answerRow}>
							<span className={styles.answerLabel}>{label}:</span>
							<select
								value={answer[index] || 0}
								onChange={e =>
									handleAnswerChange(index, Number(e.target.value))
								}
								className={styles.answerSelect}
							>
								<option value={0}>Выберите ответ</option>
								{question.rightColumn.items.map(item => (
									<option key={item.value} value={item.value}>
										{item.value}
									</option>
								))}
							</select>
						</div>
					))}
				</div>

				<div className={styles.answerPreview}>
					<strong>Ваш ответ:</strong>
					<div
						className={styles.answerTable}
						data-columns={isTwoAnswer ? 2 : 3}
					>
						<div className={styles.tableHeader}>
							{answerLabels.map(label => (
								<div key={label} className={styles.tableCell}>
									{label}
								</div>
							))}
						</div>
						<div className={styles.tableRow}>
							{answer.map((value, index) => (
								<div key={index} className={styles.tableCell}>
									{value || '—'}
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Question
