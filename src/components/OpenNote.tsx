import { motion } from 'framer-motion'
import { JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal, useEffect, useRef, useState } from 'react'
import { readTextFile, readDir, removeFile, BaseDirectory } from '@tauri-apps/api/fs'
import '../Modal.css'

export default function OpenNote(props: any) {
   const [isOpen, setIsOpen] = useState(false)
   const [notes, setNotes] = useState([] as any)
   const [noteName, setNoteName] = useState('')
   const [errorMsg, setErrorMsg] = useState('')
   const input = useRef(null as any)

   const openNote = (noteN: string) => {
      readTextFile(`ferisNotes/${noteN}.json`, { dir: BaseDirectory.Document })
         .then((c) => {
            const json = JSON.parse(c)
            props.editor.commands.setContent(json)

            setTimeout(() => {
               setIsOpen(false)
               setErrorMsg('')
            }, 100)
         })
         .catch((err) => {
            console.error(err)
            setErrorMsg("Can't find note!")
         })
   }

   const deleteNote = (noteN: string) => {
      removeFile(`ferisNotes/${noteN}.json`, { dir: BaseDirectory.Document })
         .then((c) => {
            setErrorMsg('')
            getNotes()
         })
         .catch((err) => {
            console.error(err);
            setErrorMsg('Error')
         })
   }

   const getNotes = () => {
      let notesArray = []
      readDir('ferisNotes', { dir: BaseDirectory.Document, recursive: true })
         .then((entries) => {
            notesArray = []
            for (const entry of entries) {
               const name = (entry.name as any).split('.')[0]
               notesArray.push({
                  name: name,
               })
            }
            setNotes(notesArray as any)
         })
         .catch((err) => {
            console.error(err)
         })
   }

   useEffect(() => {
      getNotes()
      const listener = (event: any) => {
         if (event.code === 'Enter' && isOpen == true) {
            event.preventDefault()

            if (noteName == '') {
               return setErrorMsg('Input is empty!')
            }
            if (noteName.includes(' ')) {
               return setErrorMsg('Input includes space!')
            }
            setErrorMsg('')
            openNote(noteName)
         }
      }
      const handleToggle = (event: any) => {
         if (event.ctrlKey && (event.key === 'O' || event.key === 'o')) {
            event.preventDefault()
            setIsOpen(true)
            input.current.focus()
         } else if (event.keyCode == 27) {
            event.preventDefault()
            setIsOpen(false)
            setErrorMsg('')
         }
      }

      document.addEventListener('keydown', listener)
      document.addEventListener('keydown', handleToggle)
      return () => {
         document.removeEventListener('keydown', listener)
         document.removeEventListener('keydown', handleToggle)
      }
   }, [isOpen, setIsOpen, noteName, setErrorMsg])

   const list = {
      open: { opacity: 1 },
      closed: { opacity: 0 },
   }
   const item = {
      open: (i: number) => ({
         opacity: 1,
         y: 0,
         scale: 1,
         transition: {
            delay: i * 0.04 + 0.1,
         },
      }),
      closed: {
         opacity: 0,
         y: '-100%',
         scale: 0,
      },
   }

   return (
      <>
         <motion.div
            className="modal-bg"
            animate={isOpen ? 'open' : 'closed'}
            variants={{ open: { opacity: 1, display: 'flex' }, closed: { opacity: 0, transitionEnd: { display: 'none' } } }}
            transition={{ stiffness: 0 }}
         >
            {errorMsg !== '' && (
               <motion.p initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className='error'>
                  {errorMsg}
               </motion.p>
            )}
            {notes.length > 0 && (
               <motion.div
                  className="modal-select"
                  animate={isOpen ? 'open' : 'closed'}
                  // variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: '-100%' } }}
                  variants={list}
               >
                  {notes.map((note: { name: string }, i: number) => {
                     return (
                        <motion.div className="note-item" key={i} variants={item} custom={i as any}>
                           <div
                              className="open"
                              onClick={() => {
                                 openNote(note.name)
                              }}
                           >
                              {note.name}
                           </div>
                           <div className="delete" onClick={() => {deleteNote(note.name)}}>
                              <i className="ri-delete-bin-5-line"/>
                           </div>
                        </motion.div>
                     )
                  })}
               </motion.div>
            )}
            <motion.input
               autoFocus
               ref={input}
               placeholder="Open note (filename)"
               animate={isOpen ? 'open' : 'closed'}
               variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: '-100%' } }}
               transition={{ type: 'spring', stiffness: 100 }}
               onChange={(e) => {
                  setNoteName(e.target.value)
               }}
               value={noteName}
            ></motion.input>
         </motion.div>
      </>
   )
}
