import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Menubar from './Menubar'
import SaveNote from './SaveNote'
import OpenNote from './OpenNote'
import { useEffect, useState } from 'react'
import fs from 'fs'

export default function MainEditor() {

   const [isInputOpen, setIsInputOpen] = useState(false)
   const [inputValue, setInputValue] = useState("")

   const editor = useEditor({
      extensions: [StarterKit],
      content: `<h2>
      Hi there 👋, how are you?
    </h2>
    `,
   })

   return (
      <>
         <SaveNote editor={editor} />
         <OpenNote editor={editor} />
         {editor ? <Menubar editor={editor} /> : null}
         <EditorContent editor={editor} />
      </>
   )
}
