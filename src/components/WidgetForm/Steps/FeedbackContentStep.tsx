import { ArrowLeft } from "phosphor-react";
import { FormEvent, useState } from "react";

import { Loading } from "components/Loading";
import { CloseButton } from "components/CloseButton";
import { ScreenshotButton } from "../ScreenshotButton";

import { api } from "services/api";
import { FeedbackType } from '../index'
import { feedbackTypes } from 'data/feedbackTypes'

type FeedbackContentStep = {
  feedbackType: FeedbackType
  onFeedbackRestartRequested: () => void
  onFeedbackSent: () => void
}

export function FeedbackContentStep({
  feedbackType,
  onFeedbackRestartRequested,
  onFeedbackSent
}: FeedbackContentStep) {
  const feedbackTypeInfo = feedbackTypes[feedbackType]

  const [comment, setComment] = useState<string>('')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [isSendingFeedback, setIsSendingFeedback] = useState<boolean>(false)

  async function handleSubmitFeedback(event: FormEvent) {
    event.preventDefault()
    
    setIsSendingFeedback(true)

    await api.post('/feedbacks', {
      comment,
      screenshot,
      type: feedbackType,
    })

    setIsSendingFeedback(false)
    onFeedbackSent()
  }

  return (
    <>
      <header>
        <button
          type="button"
          className="absolute top-5 left-5 text-zinc-400 hover:text-zinc-100"
          onClick={onFeedbackRestartRequested}
        >
          <ArrowLeft weight="bold" className="w-4 h-4"/>
        </button>

        <span className="text-xl leading-6 flex items-center gap-2">
          <img src={feedbackTypeInfo.image.source} alt={feedbackTypeInfo.image.alt} className="w-6 h-6"/>
          {feedbackTypeInfo.title}
        </span>

        <CloseButton />

      </header>

      <form className="my-4 w-full" onSubmit={handleSubmitFeedback}>

        <textarea
          onChange={(e) => setComment(e.target.value)}
          placeholder="Conte com detalhes o que está acontecendo"
          className="min-w-[304px] w-full min-h-[112px] text-sm placeholder-zinc-400 text-zinc-100 border-zinc-600 bg-transparent rounded-md focus:border-brand-500 focus:ring-brand-500 focus:ring-1 resize-none focus:outline-none scrollbar scrollbar-thumb-zinc-700 scrollbar-track-transparent scrollbar-thin"
        />

        <footer className="flex gap-2 mt-2">

          <ScreenshotButton screenshot={screenshot} onScreenshotTook={setScreenshot}/>

          <button
            type="submit"
            disabled={comment.length === 0 || isSendingFeedback}
            className="p-2 bg-brand-500 rounded-md border-transparent flex-1 flex justify-center items-center text-sm hover:bg-brand-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-brand-500 transition-colors disabled:opacity-50 disabled:hover:bg-brand-500"
          >
            {isSendingFeedback ? <Loading /> : "Enviar Feedback" }
          </button>

        </footer>
      </form>
    </>
  )
}