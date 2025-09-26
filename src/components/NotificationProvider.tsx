import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthProvider'
import { toast } from 'sonner@2.0.3'

export interface Notification {
  id: string
  title: string
  message: string
  type: 'expense_approval' | 'payment_received' | 'milestone' | 'general'
  status: 'unread' | 'read'
  created_at: string
  data?: any
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  addNotification: (notification: Omit<Notification, 'id' | 'status' | 'created_at'>) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

// Mock notifications data
const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Expense Approval Required',
    message: 'Steel and cement delivery expense of PKR 1.5M needs approval',
    type: 'expense_approval',
    status: 'unread',
    created_at: new Date().toISOString(),
    data: { expenseId: '2', amount: 15000 }
  },
  {
    id: '2',
    title: 'Payment Received',
    message: 'Customer John Smith made installment payment of PKR 2.5M',
    type: 'payment_received',
    status: 'unread',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    data: { customerId: 'customer1', amount: 25000 }
  },
  {
    id: '3',
    title: 'Budget Milestone',
    message: '75% of construction budget has been utilized',
    type: 'milestone',
    status: 'read',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    data: { percentage: 75 }
  }
]

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Load role-based notifications
    if (user?.role === 'investor') {
      setNotifications(mockNotifications.filter(n => n.type === 'expense_approval' || n.type === 'milestone'))
    } else if (user?.role === 'marketing') {
      setNotifications(mockNotifications.filter(n => n.type === 'payment_received'))
    } else {
      setNotifications(mockNotifications)
    }
  }, [user?.role])

  const unreadCount = notifications.filter(n => n.status === 'unread').length

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, status: 'read' as const } : n)
    )
  }

  const addNotification = (notification: Omit<Notification, 'id' | 'status' | 'created_at'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      status: 'unread',
      created_at: new Date().toISOString()
    }
    
    setNotifications(prev => [newNotification, ...prev])
    
    // Show toast notification
    toast(notification.title, {
      description: notification.message,
      duration: 5000
    })
  }

  const clearAll = () => {
    setNotifications([])
  }

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    addNotification,
    clearAll
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}