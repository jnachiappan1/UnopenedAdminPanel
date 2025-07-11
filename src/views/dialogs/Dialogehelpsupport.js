import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import { Typography, Box, Button, FormControl, DialogActions, FormLabel, FormHelperText } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Close from 'mdi-material-ui/Close'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { ApiEndPoints } from 'src/network/endpoints'
import { LoadingButton } from '@mui/lab'
import { axiosInstance } from 'src/network/adapter'
import { toastError, toastSuccess } from 'src/utils/utils'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"
import draftToHtml from "draftjs-to-html"
import { EditorState, convertFromRaw, convertToRaw } from "draft-js"
import { Editor } from "react-draft-wysiwyg"
import htmlToDraft from 'html-to-draftjs'
import Grid from '@mui/material/Grid'

const validationSchema = yup.object({
  content: yup.string().required('Content is required')
})

export default function DialogHelpSupport(props) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const [loading, setLoading] = useState(false)
  const { open, toggle, dataToEdit, onSuccess } = props

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      content: dataToEdit?.content || ''
    },
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  })

  const convertFromHTML = (html) => {
    try {
      if (!html) return EditorState.createEmpty()

      const blocksFromHTML = htmlToDraft(html)
      const { contentBlocks, entityMap } = blocksFromHTML

      if (contentBlocks && contentBlocks.length > 0) {
        const contentState = convertFromRaw({
          blocks: contentBlocks,
          entityMap: entityMap || {}
        })
        return EditorState.createWithContent(contentState)
      }
      return EditorState.createEmpty()
    } catch (error) {
      console.error('Error converting HTML to draft:', error)
      return EditorState.createEmpty()
    }
  }

  useEffect(() => {
    if (open) {
      setLoading(false)

      const contentValue = dataToEdit?.content || ''
      reset({
        content: contentValue
      })

      if (dataToEdit?.content) {
        setEditorState(convertFromHTML(dataToEdit.content))
      } else {
        setEditorState(EditorState.createEmpty())
      }
    }
  }, [dataToEdit, open, reset])

  const onSubmit = data => {
    let payload = {
      content: data.content
    }

    const type = dataToEdit?.type || 'help_support'

    if (!type) {
      console.error("Error: 'type' is not defined in dataToEdit");
      toastError("Configuration error: type is missing");
      return;
    }

    setLoading(true)
    axiosInstance
      .patch(ApiEndPoints.LEGAL_CONTENT.edit(type), payload)
      .then(response => {
        onSuccess?.()
        toastSuccess(response.data.message)
        toggle()
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Edit Help Support</Typography>
        <IconButton
          onClick={toggle}
          sx={{ top: 10, right: 10, position: "absolute", color: "grey.500" }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ pb: 8, px: { xs: 2, sm: 4 }, pt: { xs: 2, sm: 4 } }}>
        <form onSubmit={handleSubmit(onSubmit)} id="help-support-form">
          <Grid container spacing={3}>
            {/* Content Field */}
            <Grid item xs={12}>
              <FormControl fullWidth error={Boolean(errors.content)}>
                <FormLabel htmlFor="content">Content</FormLabel>
                <Controller
                  name="content"
                  control={control}
                  render={({ field }) => (
                    <Editor
                      editorState={editorState}
                      onEditorStateChange={(state) => {
                        setEditorState(state);
                        try {
                          const html = draftToHtml(
                            convertToRaw(state.getCurrentContent())
                          );
                          field.onChange(html);
                        } catch (error) {
                          console.error(
                            "Error converting draft to HTML:",
                            error
                          );
                          field.onChange("");
                        }
                      }}
                      toolbar={{
                        options: [
                          "inline",
                          "blockType",
                          "fontSize",
                          "list",
                          "textAlign",
                          "colorPicker",
                          "link",
                          "embedded",
                          "emoji",
                          "remove",
                          "history",
                        ],
                        inline: {
                          options: [
                            "bold",
                            "italic",
                            "underline",
                            "strikethrough",
                          ],
                        },
                        list: { options: ["unordered", "ordered"] },
                        textAlign: {
                          options: ["left", "center", "right", "justify"],
                        },
                        link: { options: ["link"] },
                      }}
                    />
                  )}
                />
                {errors.content && (
                  <FormHelperText>{errors.content.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <LoadingButton
          size="large"
          type="submit"
          form="help-support-form"
          variant="contained"
          loading={loading}
        >
          Submit
        </LoadingButton>
        <Button size="large" variant="outlined" onClick={toggle}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
