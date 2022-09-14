import React, {
	useContext,
	createContext,
	useMemo,
	useState,
	useRef,
	MouseEvent,
} from 'react'
import shortid from 'shortid'
import Button from 'components/button'

import {
	FeedbackFormContext as FeedbackFormContextType,
	FeedbackQuestion,
	FeedbackFormProps,
	FeedbackFormStatus,
} from './types'

import s from './feedback-form.module.css'
import { IconCheckCircle24 } from '@hashicorp/flight-icons/svg-react/check-circle-24'
import classNames from 'classnames'

/**
 * Largely copied from: https://github.com/hashicorp/react-components/tree/main/packages/feedback-form
 */

const MAX_TRANSITION_DURATION_MS = 200

const wait = (delay: number) =>
	new Promise((resolve) => setTimeout(resolve, delay))

const FeedbackFormContext = createContext<FeedbackFormContextType>({})

const Question: React.FC<FeedbackQuestion> = ({
	id,
	type,
	label,
	labelSecondary,
	labelIcon,
	optional,
	...rest
}: FeedbackQuestion) => {
	const [inputValue, setInputValue] = useState('')
	const feedbackContext = useContext(FeedbackFormContext)

	if (feedbackContext.activeQuestion !== id) {
		return null
	}

	let inputs: React.ReactNode

	switch (type) {
		case 'choice': {
			if ('answers' in rest) {
				inputs = (
					<div className={s.buttonWrapper}>
						{rest.answers.map((answer) => (
							<Button
								type={answer.nextQuestion ? 'button' : 'submit'}
								disabled={feedbackContext.isTransitioning}
								aria-label={answer.display}
								key={answer.display}
								text={answer.display}
								size="small"
								color="secondary"
								onClick={(e: MouseEvent<HTMLElement>) =>
									feedbackContext.submitQuestion(e, { id, ...answer })
								}
								icon={answer.icon}
								data-heap-track={`feedback-form-button-${id}-${answer.value}`}
							/>
						))}
					</div>
				)
			}

			break
		}
		case 'text': {
			const isButtonDisabled =
				!optional && (inputValue === '' || feedbackContext.isTransitioning)

			inputs = (
				<>
					<div
						className={classNames(s.textAreaContainer, optional && s.optional)}
					>
						<textarea
							id={id}
							value={inputValue}
							onChange={(e) => setInputValue(e.currentTarget.value)}
							className={s.textArea}
							placeholder="Your feedback..."
						/>
					</div>
					<Button
						className={s.submitButton}
						type={'nextQuestion' in rest ? 'button' : 'submit'}
						aria-label={'buttonText' in rest ? rest.buttonText : null}
						text={'buttonText' in rest ? rest.buttonText : null}
						size="small"
						disabled={isButtonDisabled}
						onClick={(e: MouseEvent<HTMLElement>) =>
							feedbackContext.submitQuestion(e, { id, value: inputValue })
						}
					/>
				</>
			)

			break
		}
	}

	return (
		<div className={s.question}>
			<label htmlFor={id} className={s.labelWrapper}>
				{labelIcon && <div className={s.labelIcon}>{labelIcon}</div>}
				<span className={s.label}>
					<strong>{label}</strong>
					{` ${labelSecondary}` || ''}
				</span>
			</label>
			{inputs}
		</div>
	)
}

const Finished: React.FC<{ text: string }> = ({ text }: { text: string }) => (
	<div className={s.finished}>
		<IconCheckCircle24 color="var(--token-color-foreground-success-on-surface)" />
		<span>{text}</span>
	</div>
)

export default function FeedbackForm({
	questions,
	thankYouText,
	onQuestionSubmit = () => void 0,
}: FeedbackFormProps): React.ReactElement {
	const [status, setStatus] = useState<FeedbackFormStatus>(
		FeedbackFormStatus.inProgress
	)
	const [isTransitioning, setIsTransitioning] = useState(false)
	const [responses, setResponses] = useState<
		{
			id: string
			value: string
		}[]
	>([])
	const [activeQuestion, setActiveQuestion] = useState(questions[0].id)
	const sessionId = useRef<string | undefined>()

	const getSessionId = () => {
		if (!sessionId.current) {
			sessionId.current = shortid.generate() as string
		}
		return sessionId.current
	}

	const contextValue: FeedbackFormContextType = useMemo(
		() => ({
			isTransitioning,
			activeQuestion,
			submitQuestion(e, answer) {
				e.preventDefault()

				const newResponses = [
					...responses,
					{ id: answer.id, value: answer.value },
				]

				setResponses(newResponses)

				// Set a transitioning state so we can disable buttons while submission is happening
				setIsTransitioning(true)
				// Set a max transition time by using Promise.race to ensure there isn't a delay in user interaction
				Promise.race([
					onQuestionSubmit(newResponses, getSessionId()),
					wait(MAX_TRANSITION_DURATION_MS),
				]).finally(() => {
					setIsTransitioning(false)
					if (answer.nextQuestion) {
						setActiveQuestion(answer.nextQuestion)
					} else {
						setStatus(FeedbackFormStatus.finished)
					}
				})
			},
		}),
		[activeQuestion, responses]
	)

	return (
		<FeedbackFormContext.Provider value={contextValue}>
			<form id="feedback-panel">
				{status === FeedbackFormStatus.inProgress
					? questions.map((question) => (
							<Question key={question.id} {...question} />
					  ))
					: null}
				{status === FeedbackFormStatus.finished ? (
					<Finished text={thankYouText} />
				) : null}
			</form>
		</FeedbackFormContext.Provider>
	)
}
