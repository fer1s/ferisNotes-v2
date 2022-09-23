import { motion } from 'framer-motion'
import { Editor } from '@tiptap/react'
import { useEffect, useState } from 'react'
import '../Modal.css'

interface IMenubarProp {
   editor: Editor
}

export default function SettingsModal(props: any) {
   const isOpen = props.infoModal as any
   const setIsOpen = props.setInfoModal as any
   const editor = props.editor as IMenubarProp

   useEffect(() => {
      const handleEscape = (event: any) => {
         if (event.keyCode == 27) {
            event.preventDefault()
            setIsOpen(false)
         }
      }

      document.addEventListener('keydown', handleEscape)
      return () => {
         document.removeEventListener('keydown', handleEscape)
      }
   }, [isOpen, setIsOpen])

   return (
      <>
         <motion.div
            className="modal-bg"
            animate={isOpen ? 'open' : 'closed'}
            variants={{ open: { opacity: 1, display: 'flex' }, closed: { opacity: 0, transitionEnd: { display: 'none' } } }}
            transition={{ stiffness: 0 }}
            // onClick={() => {setIsOpen(false)}}
         >
            <motion.div
               className="settings-modal"
               animate={isOpen ? 'open' : 'closed'}
               transition={{ type: 'spring', stiffness: 50 }}
               variants={{ open: { opacity: 1, y: 0 }, closed: { opacity: 0, y: '-100%' } }}
            >
               <section>
                  <h1>Shortcuts</h1>
                  <p>
                     <code>CTRL + H</code> Toggle menubar
                  </p>
                  <p>
                     <code>CTRL + S</code> Save note
                  </p>
                  <p>
                     <code>CTRL + O</code> Open note
                  </p>
               </section>
               <section>
                  <h1>Default path</h1>
                  <p>
                     <code>Documents/ferisNotes/</code>
                  </p>
               </section>
               <section>
                  <h1>Setting</h1>
                  <p>
                     <input type="checkbox" name='reducedAnimations' className='checkbox' />
                     Reduced animations (TODO)
                  </p>
               </section>
            </motion.div>
         </motion.div>
      </>
   )
}
