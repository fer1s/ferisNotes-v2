import { Editor } from '@tiptap/react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import SettingsModal from '../components/SettingsModal'

interface IMenubarProp {
   editor: Editor
}

export default function Menubar({ editor }: IMenubarProp) {
   const [isOpen, setIsOpen] = useState(true)
   const [infoModal, setInfoModal] = useState(false)

   useEffect(() => {
      const handleKeyDown = (event: any) => {
         if (event.ctrlKey && (event.key === 'H' || event.key === 'h')) {
            event.preventDefault()
            setIsOpen(!isOpen)
         }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => {
         window.removeEventListener('keydown', handleKeyDown)
      }
   }, [isOpen])

   const getFocus = () => editor.chain().focus()
   const isActive = (type: string, options?: any) => {
      return editor.isActive(type, options ?? {}) ? 'is-active' : ''
   }

   const variants = {
      open: { scale: 1, opacity: 1, y: 0 },
      closed: { scale: 0, opacity: 0, y: '-100%' },
   }

   const menus = [
      [
         { icon: 'bold', onClick: () => getFocus().toggleBold().run(), isActive: isActive('bold') },
         { icon: 'italic', onClick: () => getFocus().toggleItalic().run(), isActive: isActive('italic') },
         { icon: 'strikethrough', onClick: () => getFocus().toggleStrike().run(), isActive: isActive('strikethrough') },
         { icon: 'code-line', onClick: () => getFocus().toggleCode().run(), isActive: isActive('code') },
      ],
      [
         { icon: 'h-1', onClick: () => getFocus().toggleHeading({ level: 1 }).run(), isActive: isActive('heading', { level: 1 }) },
         { icon: 'h-2', onClick: () => getFocus().toggleHeading({ level: 2 }).run(), isActive: isActive('heading', { level: 2 }) },
         { icon: 'list-unordered', onClick: () => getFocus().toggleBulletList().run(), isActive: isActive('bulletList') },
         { icon: 'list-ordered', onClick: () => getFocus().toggleOrderedList().run(), isActive: isActive('orderedList') },
         { icon: 'code-box-line', onClick: () => getFocus().toggleCodeBlock().run(), isActive: isActive('codeBlock') },
      ],
      [
         { icon: 'double-quotes-l', onClick: () => getFocus().toggleBlockquote().run(), isActive: isActive('blockquote') },
         { icon: 'separator', onClick: () => getFocus().setHorizontalRule().run() },
         { icon: 'information-line', onClick: () => setInfoModal(true) },
      ],
   ]

   return (
      <>
         <SettingsModal editor={editor} infoModal={infoModal} setInfoModal={setInfoModal} />
         <motion.div animate={isOpen ? 'open' : 'closed'} variants={variants} className="menu">
            {menus.map((group, i) => {
               return (
                  <div key={i} className="group-item">
                     {group.map((item, i) => {
                        return (
                           <button key={i} className="menu-item" onClick={item.onClick}>
                              <i className={`ri-${item.icon} ${item.isActive}`}></i>
                           </button>
                        )
                     })}
                  </div>
               )
            })}
         </motion.div>
      </>
   )
}
