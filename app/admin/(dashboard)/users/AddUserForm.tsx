"use client";

import { useActionState, useRef } from "react";
import { createUser, type UserFormState } from "@/lib/actions/users";
import { SpinnerIcon } from "@/components/icons";

const initialState: UserFormState = {};

export function AddUserForm() {
  const [state, formAction, pending] = useActionState(createUser, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="card-surface grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5 lg:items-end"
    >
      <div>
        <label htmlFor="name" className="field-label">
          Name
        </label>
        <input id="name" name="name" className="field-input" />
      </div>
      <div>
        <label htmlFor="email" className="field-label">
          Email
        </label>
        <input id="email" name="email" type="email" required className="field-input" />
      </div>
      <div>
        <label htmlFor="password" className="field-label">
          Password
        </label>
        <input id="password" name="password" type="password" required minLength={8} className="field-input" />
      </div>
      <div>
        <label htmlFor="role" className="field-label">
          Role
        </label>
        <select id="role" name="role" defaultValue="EDITOR" className="field-input">
          <option value="EDITOR">Editor</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>
      <button type="submit" disabled={pending} className="btn-primary">
        {pending && <SpinnerIcon width={14} height={14} />}
        {pending ? "Adding…" : "Add user"}
      </button>
      {state.error ? (
        <p role="alert" className="field-error sm:col-span-2 lg:col-span-5">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
