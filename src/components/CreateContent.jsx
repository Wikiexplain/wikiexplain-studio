//https://github.com/tinacms/tinacms/blob/master/packages/@tinacms/react-toolbar/src/components/CreateContentMenu.tsx
import * as React from 'react'
import styled, { css } from 'styled-components'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalActions,
  ModalPopup,
} from '@tinacms/react-modals'
import { FormBuilder, FieldsBuilder } from '@tinacms/form-builder'
import { useMemo } from 'react'
import { Form } from '@tinacms/forms'
import { AddIcon } from '@tinacms/icons'
import { Button } from '@tinacms/styles'
import { useCMS, useSubscribable } from '@tinacms/react-core'

// Custom imports not from copied code
import { mix, transparentize } from "polished"
import { Link, navigate } from 'gatsby'
import { isLoggedIn } from "../utils/auth"

//
export const CreateContentButton = ({ plugin }) => {
  const [open, setOpen] = React.useState(false)
  const click = evt => {
   if (!isLoggedIn()) {
      navigate(`/app/login`, { replace: true })
      return null
   } else {
      setOpen(true)
   }
  }
  return (
    <>
      <CreateButton
        onClick={(evt) => {
          click(evt)
        }}
      >
        {plugin.name}
      </CreateButton>
      {open && <FormModal plugin={plugin} close={() => setOpen(false)} />}
    </>
  )
}

const FormModal = ({ plugin, close }) => {
  const cms = useCMS()
  const form = useMemo(
    () =>
      new Form({
        label: 'create-form',
        id: 'create-form-id',
        actions: [],
        fields: plugin.fields,
        onSubmit(values) {
          plugin.onSubmit(values, cms).then(() => {
            close()
          })
        },
      }),
    [close, cms, plugin]
  )
  return (
    <Modal>
      <FormBuilder form={form}>
        {({ handleSubmit }) => {
          return (
            <ModalPopup>
              <ModalHeader close={close}>{plugin.name}</ModalHeader>
              <ModalBody
                onKeyPress={e =>
                  e.charCode === 13 ? (handleSubmit()) : null
                }
              >
                <FieldsBuilder form={form} fields={form.fields} />
              </ModalBody>
              <ModalActions>
                <Button onClick={close}>Cancel</Button>
                <Button onClick={handleSubmit} primary>
                  Create
                </Button>
              </ModalActions>
            </ModalPopup>
          )
        }}
      </FormBuilder>
    </Modal>
  )
}
export const CreateButton = styled(({children, ...styleProps }) => {
  return (
    <button {...styleProps}>
      <span>{children}</span>
    </button>
  )
})`
  border: 0;
  background: transparent;
  cursor: pointer;
  margin-left: 1rem;
  align-self: stretch;

  flex: 1 0 auto;
  line-height: ${props => props.theme.header.height};
  padding: 0 0.75rem;
  display: flex;
  align-items: center;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 0.5px;
  text-decoration: none;
  color: inherit !important;
  opacity: 0.5;
  overflow: visible;
  transition: all 150ms ${p => p.theme.easing};
  z-index: 1;
`