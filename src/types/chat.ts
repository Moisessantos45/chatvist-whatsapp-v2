export interface Message {
  id: number
  text: string
  time: string
  sent: boolean
  read: boolean
}

export interface Contact {
  id: number
  name: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  online: boolean
  lastSeen: string
  messages: Message[]
}
