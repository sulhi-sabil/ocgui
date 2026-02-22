import * as Tabs from '@radix-ui/react-tabs'
import { cn } from '@utils/cn'
import { colors, transitions } from '@styles/tokens'

export type AppTabValue = 'agents' | 'skills' | 'settings'

interface AppTabsProps {
  defaultValue?: AppTabValue
  value?: AppTabValue
  onValueChange?: (value: AppTabValue) => void
  children: React.ReactNode
}

interface AppTabsListProps {
  children: React.ReactNode
}

interface AppTabTriggerProps {
  value: AppTabValue
  children: React.ReactNode
  icon?: React.ReactNode
}

interface AppTabsContentProps {
  value: AppTabValue
  children: React.ReactNode
}

function AppTabsList({ children }: AppTabsListProps) {
  return (
    <Tabs.List
      className={cn(
        'flex items-center gap-1 p-1',
        colors.gray[100],
        'rounded-lg'
      )}
    >
      {children}
    </Tabs.List>
  )
}

function AppTabTrigger({ value, children, icon }: AppTabTriggerProps) {
  return (
    <Tabs.Trigger
      value={value}
      className={cn(
        'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md',
        transitions.default,
        'text-gray-600 dark:text-gray-400',
        'hover:text-gray-900 dark:hover:text-white',
        'data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800',
        'data-[state=active]:text-gray-900 dark:data-[state=active]:text-white',
        'data-[state=active]:shadow-sm',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
      )}
    >
      {icon}
      {children}
    </Tabs.Trigger>
  )
}

function AppTabsContent({ value, children }: AppTabsContentProps) {
  return (
    <Tabs.Content value={value} className="focus:outline-none">
      {children}
    </Tabs.Content>
  )
}

export function AppTabs({
  defaultValue = 'agents',
  value,
  onValueChange,
  children,
}: AppTabsProps) {
  return (
    <Tabs.Root
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange as (value: string) => void}
      className="w-full"
    >
      {children}
    </Tabs.Root>
  )
}

AppTabs.List = AppTabsList
AppTabs.Trigger = AppTabTrigger
AppTabs.Content = AppTabsContent
