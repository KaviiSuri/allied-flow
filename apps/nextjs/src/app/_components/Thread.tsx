"use client"
import { useOptimistic, useRef } from "react";
import type { Message } from "../_providers/ThreadProvider";
import { useThreads } from "../_providers/ThreadProvider";
import { useFormState, useFormStatus } from "react-dom";
import { FaSpinner } from "react-icons/fa";

export default function Thread() {
  const formRef = useRef<HTMLFormElement>(null);
  const { messages, sendMessage } = useThreads();

  async function action(_prevState: null, formData: FormData) {
    const message = formData.get("message") as string
    addOptimisticMessage(message);
    formRef.current?.reset();
    await sendMessage(message);
    return null;
  }

  const [_err, formAction] = useFormState<null, FormData>(action, null)

  const [optimisticMessages, addOptimisticMessage] = useOptimistic<Message[], string>(
    messages,
    (state, newMessage) => ([
      ...state,
      {
        text: newMessage,
        sending: true,
        key: Math.random()
      }
    ]),
  )
  return (
    <>
      {
        optimisticMessages.map((message, index) => (
          <div key={index}>
            {message.text}
            {!!message.sending && <small> (Sending...)</small>}
          </div>
        ))
      }
      <form action={formAction} ref={formRef}>
        <input type="text" name="message" placeholder="Hello!" />
        <button type="submit">Send</button>
        <Pending>
          <FaSpinner />
        </Pending>
      </form>
    </>
  )
}

function Pending({ children }: React.PropsWithChildren) {
  const status = useFormStatus();
  return (
    <>
      {status.pending && children}
    </>
  )
}
