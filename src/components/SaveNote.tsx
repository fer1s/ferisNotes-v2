import { motion } from 'framer-motion'
import { useEffect, useState, useRef } from 'react'
import { writeTextFile, createDir, BaseDirectory } from '@tauri-apps/api/fs';
import '../Modal.css'

export default function SaveNote(props: any) {
   const [isOpen, setIsOpen] = useState(false)
   const [noteName, setNoteName] = useState('')
   const [errorMsg, setErrorMsg] = useState('')
   const input = useRef(null as any);

   useEffect(() => {
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
            saveNote()
            setIsOpen(false)
            setNoteName('')
         }
      }
      const handleToggle = (event: any) => {
         if (event.ctrlKey && (event.key === 'S' || event.key === 's')) {
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

   const saveNote = () => {
      const noteJSON = props.editor.getJSON();
      writeTextFile({ path: `ferisNotes/${noteName}.json`, contents: JSON.stringify(noteJSON)}, { dir: BaseDirectory.Document }).then((c) => {}).catch(() => {
         try {
            createDir('ferisNotes', {dir: BaseDirectory.Document, recursive: true}).then(() => {
               writeTextFile({ path: `ferisNotes/${noteName}.json`, contents: JSON.stringify(noteJSON)}, { dir: BaseDirectory.Document }).then((c) => {}).catch((err) => {
                  console.error(err)
               })
            }).catch((err) => {
               console.error(err)
            })
         } catch (err) {
            console.error(err)
         }
      })
   }

   return (
      <>
         <motion.div className="modal-bg" animate={isOpen ? 'open' : 'closed'} variants={{ open: { opacity: 1, display: 'flex' }, closed: { opacity: 0, transitionEnd: { display: 'none' } } }} transition={{ stiffness: 0 }}>
            {errorMsg !== '' && (
               <motion.p className='error' initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}>
                  {errorMsg}
               </motion.p>
            )}
            <motion.input
               autoFocus
               ref={input}
               placeholder="Save note (filename)"
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
