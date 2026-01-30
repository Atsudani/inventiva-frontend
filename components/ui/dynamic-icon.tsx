"use client";

import type { LucideIcon, LucideProps } from "lucide-react";
import {
  // Fallback
  FileText,
  Folder,

  // Módulos principales (agregá los que uses)
  ShoppingCart,
  ShoppingBag,
  Package,
  DollarSign,
  CreditCard,
  Calculator,
  BarChart3,
  BarChart2,
  PieChart,
  LineChart,
  TrendingUp,
  TrendingDown,

  // Acciones comunes
  Plus,
  Minus,
  Edit,
  Trash2,
  Save,
  Search,
  Filter,
  Download,
  Upload,
  Printer,
  Eye,
  EyeOff,
  Check,
  X,
  RefreshCw,

  // Documentos y archivos
  File,
  FileSpreadsheet,
  FileCheck,
  FilePlus,
  FileQuestion,
  ClipboardList,
  ClipboardCheck,
  Receipt,
  ScrollText,

  // Navegación y UI
  Home,
  Settings,
  Menu,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,

  // Usuarios y permisos
  User,
  Users,
  UserPlus,
  UserCheck,
  Shield,
  Lock,
  Unlock,
  Key,

  // Inventario y stock
  Boxes,
  Box,
  Warehouse,
  Truck,
  PackageCheck,
  PackagePlus,
  PackageMinus,
  PackageSearch,

  // Finanzas
  Banknote,
  Wallet,
  Building2,
  Landmark,
  CircleDollarSign,
  BadgeDollarSign,
  Coins,

  // Fechas y tiempo
  Calendar,
  CalendarDays,
  Clock,
  History,

  // Otros útiles
  Tag,
  Tags,
  Bookmark,
  Star,
  AlertCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Bell,
  Mail,
  Send,
  MessageSquare,
  List,
  ListOrdered,
  Table,
  Grid3X3,
  LayoutDashboard,
  Layers,
  Database,
  Server,
  Globe,
  MapPin,
  Phone,
  Building,
  Factory,
  Store,
  Briefcase,
  Award,
  Target,
  Zap,
  Activity,
  Hash,
  Percent,
  Binary,
  Code,
  Terminal,
  Cog,
  Wrench,
  Hammer,
  NotepadText,
  BookDown,
  ChevronsUp,
  WalletCards,
} from "lucide-react";

// Mapa de iconos: nombre en BD (kebab-case) -> componente
const iconMap: Record<string, LucideIcon> = {
  //Propios
  "chevrons-up": ChevronsUp,
  "wallet-cards": WalletCards,

  // Fallback
  "file-text": FileText,
  folder: Folder,

  // Módulos principales
  "shopping-cart": ShoppingCart,
  "shopping-bag": ShoppingBag,
  package: Package,
  "dollar-sign": DollarSign,
  "credit-card": CreditCard,
  calculator: Calculator,
  "bar-chart-3": BarChart3,
  "bar-chart-2": BarChart2,
  "pie-chart": PieChart,
  "line-chart": LineChart,
  "trending-up": TrendingUp,
  "trending-down": TrendingDown,
  "notepad-text": NotepadText,

  // Acciones comunes
  plus: Plus,
  minus: Minus,
  edit: Edit,
  "trash-2": Trash2,
  save: Save,
  search: Search,
  filter: Filter,
  download: Download,
  upload: Upload,
  printer: Printer,
  eye: Eye,
  "eye-off": EyeOff,
  check: Check,
  x: X,
  "refresh-cw": RefreshCw,

  // Documentos y archivos
  file: File,
  "file-spreadsheet": FileSpreadsheet,
  "file-check": FileCheck,
  "file-plus": FilePlus,
  "file-question": FileQuestion,
  "clipboard-list": ClipboardList,
  "clipboard-check": ClipboardCheck,
  receipt: Receipt,
  "scroll-text": ScrollText,
  "book-down": BookDown,

  // Navegación y UI
  home: Home,
  settings: Settings,
  menu: Menu,
  "chevron-right": ChevronRight,
  "chevron-left": ChevronLeft,
  "chevron-down": ChevronDown,
  "chevron-up": ChevronUp,
  "arrow-right": ArrowRight,
  "arrow-left": ArrowLeft,

  // Usuarios y permisos
  user: User,
  users: Users,
  "user-plus": UserPlus,
  "user-check": UserCheck,
  shield: Shield,
  lock: Lock,
  unlock: Unlock,
  key: Key,

  // Inventario y stock
  boxes: Boxes,
  box: Box,
  warehouse: Warehouse,
  truck: Truck,
  "package-check": PackageCheck,
  "package-plus": PackagePlus,
  "package-minus": PackageMinus,
  "package-search": PackageSearch,

  // Finanzas
  banknote: Banknote,
  wallet: Wallet,
  "building-2": Building2,
  landmark: Landmark,
  "circle-dollar-sign": CircleDollarSign,
  "badge-dollar-sign": BadgeDollarSign,
  coins: Coins,

  // Fechas y tiempo
  calendar: Calendar,
  "calendar-days": CalendarDays,
  clock: Clock,
  history: History,

  // Otros útiles
  tag: Tag,
  tags: Tags,
  bookmark: Bookmark,
  star: Star,
  "alert-circle": AlertCircle,
  "alert-triangle": AlertTriangle,
  info: Info,
  "help-circle": HelpCircle,
  bell: Bell,
  mail: Mail,
  send: Send,
  "message-square": MessageSquare,
  list: List,
  "list-ordered": ListOrdered,
  table: Table,
  "grid-3x3": Grid3X3,
  "layout-dashboard": LayoutDashboard,
  layers: Layers,
  database: Database,
  server: Server,
  globe: Globe,
  "map-pin": MapPin,
  phone: Phone,
  building: Building,
  factory: Factory,
  store: Store,
  briefcase: Briefcase,
  award: Award,
  target: Target,
  zap: Zap,
  activity: Activity,
  hash: Hash,
  percent: Percent,
  binary: Binary,
  code: Code,
  terminal: Terminal,
  cog: Cog,
  wrench: Wrench,
  hammer: Hammer,
};

interface DynamicIconProps extends LucideProps {
  name: string | undefined;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const Icon = name ? (iconMap[name] ?? FileText) : FileText;
  return <Icon {...props} />;
}

// Exportar el tipo por si lo necesitás en otro lugar
export type IconName = keyof typeof iconMap;

// Exportar lista de iconos disponibles (útil para selectores en admin)
export const availableIcons = Object.keys(iconMap);
