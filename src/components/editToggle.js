import React from "react"
import { useInlineForm } from "react-tinacms-inline"
import { EditButton } from "./style"

export function EditToggle({refreshDisqus}) {
  const { status, deactivate, activate } = useInlineForm()
  refreshDisqus(status !== "active");
  return (
    <EditButton
      onClick={() => {
        status === "active" ? deactivate() : activate()
      }}
    >
      {status === "active" ? "Preview" : "Edit"}
    </EditButton>
  )
}
