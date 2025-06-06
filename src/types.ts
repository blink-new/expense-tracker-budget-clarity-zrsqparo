export interface Expense {
  id: string
  amount: number
  description: string
  category: Category
  accountId: string
  date: string
  createdAt: string
}

export interface Account {
  id: string
  name: string
  type: 'checking' | 'savings' | 'credit' | 'cash'
  balance: number
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export const CATEGORIES: Category[] = [
  { id: 'food', name: 'Food & Dining', icon: '🍽️', color: '#f59e0b' },
  { id: 'transportation', name: 'Transportation', icon: '🚗', color: '#3b82f6' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: '#ec4899' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
  { id: 'bills', name: 'Bills & Utilities', icon: '⚡', color: '#ef4444' },
  { id: 'health', name: 'Healthcare', icon: '🏥', color: '#10b981' },
  { id: 'education', name: 'Education', icon: '📚', color: '#06b6d4' },
  { id: 'travel', name: 'Travel', icon: '✈️', color: '#f97316' },
  { id: 'income', name: 'Income', icon: '💰', color: '#22c55e' },
  { id: 'other', name: 'Other', icon: '📦', color: '#6b7280' }
]