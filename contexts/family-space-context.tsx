"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface FamilyMember {
  id: string
  name: string
  plan: string
  usage: string
  avatar: string
}

interface Comment {
  id: string
  sender: string
  avatar: string
  content: string
  timestamp: Date
}

interface MessageCard {
  id: string
  sender: string
  message: string
  design: string
  timestamp: Date
  comments: Comment[]
}

interface FamilySpaceContextType {
  hasFamilySpace: boolean
  familyMembers: FamilyMember[]
  messageCards: MessageCard[]
  createFamilySpace: (members: FamilyMember[]) => void
  addMessageCard: (card: Omit<MessageCard, "id" | "comments">) => void
  addComment: (cardId: string, comment: Omit<Comment, "id" | "timestamp">) => void
}

const FamilySpaceContext = createContext<FamilySpaceContextType | undefined>(undefined)

export function FamilySpaceProvider({ children }: { children: ReactNode }) {
  const [hasFamilySpace, setHasFamilySpace] = useState(false)
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([])
  const [messageCards, setMessageCards] = useState<MessageCard[]>([])

  useEffect(() => {
    // Load family space data from localStorage
    const storedMembers = localStorage.getItem("familyMembers")
    const storedCards = localStorage.getItem("messageCards")

    if (storedMembers) {
      const members = JSON.parse(storedMembers)
      setFamilyMembers(members)
      setHasFamilySpace(members.length > 0)
    }

    if (storedCards) {
      const cards = JSON.parse(storedCards)
      // Convert string timestamps back to Date objects
      const cardsWithDates = cards.map((card: any) => ({
        ...card,
        timestamp: new Date(card.timestamp),
        comments:
          card.comments?.map((comment: any) => ({
            ...comment,
            timestamp: new Date(comment.timestamp),
          })) || [],
      }))
      setMessageCards(cardsWithDates)
    }
  }, [])

  const createFamilySpace = (members: FamilyMember[]) => {
    setFamilyMembers(members)
    setHasFamilySpace(true)
    localStorage.setItem("familyMembers", JSON.stringify(members))
  }

  const addMessageCard = (card: Omit<MessageCard, "id" | "comments">) => {
    const newCard: MessageCard = {
      ...card,
      id: Date.now().toString(),
      comments: [],
    }

    const updatedCards = [newCard, ...messageCards]
    setMessageCards(updatedCards)
    localStorage.setItem("messageCards", JSON.stringify(updatedCards))
  }

  const addComment = (cardId: string, comment: Omit<Comment, "id" | "timestamp">) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      timestamp: new Date(),
    }

    const updatedCards = messageCards.map((card) => {
      if (card.id === cardId) {
        return {
          ...card,
          comments: [...(card.comments || []), newComment],
        }
      }
      return card
    })

    setMessageCards(updatedCards)
    localStorage.setItem("messageCards", JSON.stringify(updatedCards))
  }

  return (
    <FamilySpaceContext.Provider
      value={{
        hasFamilySpace,
        familyMembers,
        messageCards,
        createFamilySpace,
        addMessageCard,
        addComment,
      }}
    >
      {children}
    </FamilySpaceContext.Provider>
  )
}

export function useFamilySpace() {
  const context = useContext(FamilySpaceContext)
  if (context === undefined) {
    throw new Error("useFamilySpace must be used within a FamilySpaceProvider")
  }
  return context
}
