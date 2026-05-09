/* ============================================
   CAPEO — BUSINESS ROOM · CHAT
   Discussion privée entre vendeur et
   acquéreurs dans la room.
   Supabase Realtime sera branché ici.
   ============================================ */

   import { useState, useEffect, useRef } from 'react'
   import './RoomChat.css'
   
   const MESSAGES_MOCK = [
     {
       id: '1',
       author: 'Jean-Marc D.',
       initials: 'J',
       role: 'vendeur',
       text: 'Bonjour à tous. Je suis disponible pour répondre à vos questions sur le bien. Les documents sont en cours d\'upload dans l\'onglet Documents.',
       time: '09:14',
       isVendeur: true,
     },
     {
       id: '2',
       author: 'Marc D.',
       initials: 'M',
       role: 'acquéreur',
       text: 'Bonjour. Quelle est la situation locative exacte ? Tous les lots sont occupés ?',
       time: '09:22',
       isVendeur: false,
     },
     {
       id: '3',
       author: 'Jean-Marc D.',
       initials: 'J',
       role: 'vendeur',
       text: '5 lots sur 6 sont loués. Le 6ème (T2 au 3ème) est libre depuis janvier. Bail 3/6/9 pour tous les autres, échéances en mars.',
       time: '09:31',
       isVendeur: true,
     },
     {
       id: '4',
       author: 'Sophie L.',
       initials: 'S',
       role: 'acquéreur',
       text: 'Avez-vous les derniers relevés de charges ? Je veux vérifier les charges réelles vs estimées.',
       time: '09:45',
       isVendeur: false,
     },
     {
       id: '5',
       author: 'Jean-Marc D.',
       initials: 'J',
       role: 'vendeur',
       text: 'Je les uploade ce soir dans Documents. Charges réelles 2024 : 17 800€. Légèrement sous l\'estimation.',
       time: '09:52',
       isVendeur: true,
     },
   ]
   
   export default function RoomChat({ actifId, seller }) {
     const [messages, setMessages] = useState(MESSAGES_MOCK)
     const [newMsg, setNewMsg] = useState('')
     const [sending, setSending] = useState(false)
     const bottomRef = useRef(null)
     const inputRef = useRef(null)
   
     useEffect(() => {
       bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
     }, [messages])
   
     const handleSend = () => {
       if (!newMsg.trim()) return
       setSending(true)
   
       const msg = {
         id: Date.now().toString(),
         author: 'Vous',
         initials: 'Y',
         role: 'acquéreur',
         text: newMsg.trim(),
         time: new Date().toLocaleTimeString('fr-FR', {
           hour: '2-digit',
           minute: '2-digit',
         }),
         isVendeur: false,
         isSelf: true,
       }
   
       setTimeout(() => {
         setMessages((prev) => [...prev, msg])
         setNewMsg('')
         setSending(false)
         inputRef.current?.focus()
       }, 200)
     }
   
     const handleKeyDown = (e) => {
       if (e.key === 'Enter' && !e.shiftKey) {
         e.preventDefault()
         handleSend()
       }
     }
   
     return (
       <div className="broom-chat">
   
         {/* En-tête */}
         <div className="broom-chat__header">
           <div className="broom-chat__header-title">
             Discussion privée
           </div>
           <div className="broom-chat__header-note">
             Visible uniquement par les participants de cette room
           </div>
         </div>
   
         {/* Messages */}
         <div className="broom-chat__messages">
           {messages.map((msg, index) => {
   
             const showDate = index === 0 ||
               messages[index - 1].time !== msg.time
   
             return (
               <div key={msg.id}>
                 <div className={`broom-msg
                   ${msg.isVendeur ? 'broom-msg--vendeur' : ''}
                   ${msg.isSelf ? 'broom-msg--self' : ''}
                 `}>
                   {!msg.isSelf && (
                     <div className={`broom-msg__avatar
                       ${msg.isVendeur ? 'broom-msg__avatar--vendeur' : ''}
                     `}>
                       {msg.initials}
                     </div>
                   )}
   
                   <div className="broom-msg__content">
                     {!msg.isSelf && (
                       <div className="broom-msg__meta">
                         <span className="broom-msg__author">
                           {msg.author}
                         </span>
                         <span className={`broom-msg__role
                           ${msg.isVendeur ? 'broom-msg__role--vendeur' : ''}
                         `}>
                           {msg.role}
                         </span>
                         <span className="broom-msg__time">
                           {msg.time}
                         </span>
                       </div>
                     )}
                     <div className={`broom-msg__bubble
                       ${msg.isVendeur ? 'broom-msg__bubble--vendeur' : ''}
                       ${msg.isSelf ? 'broom-msg__bubble--self' : ''}
                     `}>
                       {msg.text}
                     </div>
                     {msg.isSelf && (
                       <div className="broom-msg__time broom-msg__time--self">
                         {msg.time}
                       </div>
                     )}
                   </div>
                 </div>
               </div>
             )
           })}
           <div ref={bottomRef}></div>
         </div>
   
         {/* Input */}
         <div className="broom-chat__input-area">
           <div className="broom-chat__input-wrap">
             <textarea
               ref={inputRef}
               className="broom-chat__input"
               placeholder="Votre message..."
               value={newMsg}
               onChange={(e) => setNewMsg(e.target.value)}
               onKeyDown={handleKeyDown}
               rows={2}
             />
             <div className="broom-chat__input-actions">
               <span className="broom-chat__input-hint">
                 Entrée pour envoyer · Maj+Entrée pour nouvelle ligne
               </span>
               <button
                 className="broom-chat__send"
                 onClick={handleSend}
                 disabled={!newMsg.trim() || sending}
               >
                 {sending ? (
                   <span className="spinner"></span>
                 ) : (
                   <>
                     Envoyer
                     <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                       <path d="M2 6h8M7 3l3 3-3 3"
                         stroke="currentColor" strokeWidth="1.2"
                         strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                   </>
                 )}
               </button>
             </div>
           </div>
         </div>
   
       </div>
     )
   }