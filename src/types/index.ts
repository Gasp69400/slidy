import { Client, Property, Match, SearchCriteria, Alert, User } from '@prisma/client'
import { PropertySource, SubscriptionStatus, AlertType } from '@prisma/client'
import type { Prisma } from '@prisma/client'

// Extended types with relations
export type ClientWithRelations = Client & {
  searchCriteria: SearchCriteria[]
  matches: MatchWithRelations[]
  alerts: Alert[]
  _count?: {
    matches: number
    alerts: number
  }
}

export type PropertyWithRelations = Property & {
  matches: Match[]
}

export type MatchWithRelations = Match & {
  client: Client
  property: Property
}

export type AlertWithRelations = Alert & {
  client: Client
  property?: Property | null
}

export type UserWithRelations = User & {
  clients: Client[]
  accounts: any[]
  sessions: any[]
}

// Form types
export interface CreateClientForm {
  firstName: string
  lastName: string
  email: string
  phone?: string
  notes?: string
}

export interface SearchCriteriaForm {
  budgetMin?: number
  budgetMax?: number
  cities: string[]
  surfaceMin?: number
  surfaceMax?: number
  roomsMin?: number
  roomsMax?: number
  mustHave: string[]
  mustNotHave: string[]
}

export interface RegisterForm {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginForm {
  email: string
  password: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Scraping types
export interface ScrapeRequest {
  criteria: {
    locations?: string[]
    budgetMin?: number
    budgetMax?: number
    surfaceMin?: number
    surfaceMax?: number
    roomsMin?: number
    roomsMax?: number
    propertyType?: string
    mustHave?: string[]
    mustNotHave?: string[]
    keywords?: string[]
  }
  source?: PropertySource
}

export interface ScrapeResult {
  source: PropertySource
  properties: Property[]
  duration: number
  error?: string
}

// Matching types
export interface MatchingCriteria {
  locations: string[]
  budgetMin?: number | null
  budgetMax?: number | null
  surfaceMin?: number | null
  surfaceMax?: number | null
  roomsMin?: number | null
  roomsMax?: number | null
  propertyType?: string | null
  mustHave: string[]
  mustNotHave: string[]
  keywords: string[]
}

export type ScrapingCriteria = MatchingCriteria & { cities: string[] }

export type PropertyCreateInput = Prisma.PropertyCreateInput

export interface ScrapingResult {
  properties: PropertyCreateInput[]
  errors: string[]
  duration: number
}

export interface MatchResult {
  score: number
  explanation: {
    budgetScore: number
    cityScore: number
    surfaceScore: number
    roomsScore: number
    semanticScore: number
    mustHaveBonus: number
    mustNotHavePenalty: number
    totalScore: number
  }
}

// Email types
export interface EmailData {
  to: string
  subject: string
  html: string
  text?: string
}

// Dashboard types
export interface DashboardStats {
  totalClients: number
  activeClients: number
  totalProperties: number
  recentMatches: number
  timeSaved: number
  averageMatchScore: number
  alertsSentToday: number
}

// Stripe types
export interface StripeSubscriptionData {
  id: string
  status: SubscriptionStatus
  current_period_start: number
  current_period_end: number
  trial_end?: number | null
}

// Notification types
export interface NotificationData {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read?: boolean
}

// Table types
export interface TableColumn<T = any> {
  key: keyof T | string
  header: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
}

export interface TableProps<T = any> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  emptyMessage?: string
  onRowClick?: (item: T) => void
  pagination?: {
    page: number
    limit: number
    total: number
    onPageChange: (page: number) => void
  }
}

// Chart types
export interface ChartDataPoint {
  label: string
  value: number
  color?: string
}

export interface ChartProps {
  data: ChartDataPoint[]
  type: 'bar' | 'line' | 'pie' | 'doughnut'
  title?: string
  height?: number
}

// Filter types
export interface FilterOption {
  value: string
  label: string
  count?: number
}

export interface FilterState {
  search?: string
  status?: string[]
  priority?: string[]
  dateRange?: {
    start: Date
    end: Date
  }
  [key: string]: any
}
