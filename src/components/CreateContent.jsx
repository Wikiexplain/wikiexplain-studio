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
import {AddCircle } from '@styled-icons/material'


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

export const CreateButton = styled(({ children, ...styleProps }) => {
  return (
    <button {...styleProps}>
      <i><AddCircle className="add-circle" /></i>
      <span>{children}</span>
    </button>
  )
})`
  padding: 0;
  border: 0;
  background: transparent;
  cursor: pointer;
  text-transform: uppercase;
  color: #555;
  transition: all 150ms cubic-bezier(0.215,0.610,0.355,1.000);
  display: flex;
  flex: 1 1;
  flex-direction: column;
  align-items: center;
  margin-right: 14px;
  margin-bottom: 0.3rem;
  i .add-circle {
    flex: 1 1;
    padding-top: 0.8rem;
    padding-bottom: 0.2rem;
    transition: all 0.25s linear;
    width: 37px;
    line-height: 1;

  }
  @media (max-width: 600px) {
    span {
      display: none
    }
    i .add-circle {
      flex: 1 1;
      padding-top: 0.8rem;
      padding-bottom: 0.2rem;
      transition: all 0.25s linear;
      width: 32px;
      line-height: 1;

    }    
  }

`