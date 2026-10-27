import { LayoutDashboard, Package, ArrowUpRight, ArrowLeftRight, ChartNoAxesColumn, Settings } from 'lucide-react';

export const primaryLinks = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Inventory', icon: Package },
  { label: 'Restock planner', icon: ArrowUpRight },
  { label: 'Transactions', icon: ArrowLeftRight },
  { label: 'Reports', icon: ChartNoAxesColumn },
];

export const systemLinks = [
  { label: 'Settings', icon: Settings },
];

export const allViewLabels = [...primaryLinks, ...systemLinks].map((link) => link.label);
