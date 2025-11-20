import React from 'react'
import styles from './Question.module.css'

type QuestionProps = {
	question: {
		number: number
		text: string
		imageUrl?: string
		leftColumn: {
			title: string
			items: Array<{ label: string; value: number }>
		}
		rightColumn: {
			title: string
			items: Array<{ label: string; value: number }>
		}
	}
	answer: [number, number, number]
	onAnswerChange: (answer: [number, number, number]) => void
}

const Question: React.FC<QuestionProps> = ({
	question,
	answer,
	onAnswerChange,
}) => {
	const handleAnswerChange = (index: number, value: number) => {
		const newAnswer = [...answer] as [number, number, number]
		newAnswer[index] = value
		onAnswerChange(newAnswer)
	}

	const getImageUrl = (url: string | undefined): string => {
		if (!url) return ''

		const base = import.meta.env.BASE_URL

		if (url.startsWith(base)) {
			return url
		}

		return `${base}${url}`
	}

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
					<div className={styles.answerRow}>
						<span className={styles.answerLabel}>А:</span>
						<select
							value={answer[0]}
							onChange={e => handleAnswerChange(0, Number(e.target.value))}
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

					<div className={styles.answerRow}>
						<span className={styles.answerLabel}>Б:</span>
						<select
							value={answer[1]}
							onChange={e => handleAnswerChange(1, Number(e.target.value))}
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

					<div className={styles.answerRow}>
						<span className={styles.answerLabel}>В:</span>
						<select
							value={answer[2]}
							onChange={e => handleAnswerChange(2, Number(e.target.value))}
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
				</div>

				<div className={styles.answerPreview}>
					<strong>Ваш ответ:</strong>
					<div className={styles.answerTable}>
						<div className={styles.tableHeader}>
							<div className={styles.tableCell}>А</div>
							<div className={styles.tableCell}>Б</div>
							<div className={styles.tableCell}>В</div>
						</div>
						<div className={styles.tableRow}>
							<div className={styles.tableCell}>{answer[0] || '—'}</div>
							<div className={styles.tableCell}>{answer[1] || '—'}</div>
							<div className={styles.tableCell}>{answer[2] || '—'}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Question
