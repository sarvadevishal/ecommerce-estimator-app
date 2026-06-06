import { NavLink } from "react-router-dom";
import {
  Sparkles,
  FileBarChart,
  LayoutDashboard,
  History,
  Settings,
} from "../../lib/icons";
import type { LucideIcon } from "../../lib/icons";

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  end?: boolean;
}

const NAV: NavItem[] = [
  { to: "/", label: "Create Estimate", icon: FileBarChart, end: true },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="sticky top-0 z-20 flex items-center gap-3 bg-ink px-4 py-3 text-canvas lg:h-screen lg:flex-col lg:items-stretch lg:gap-0 lg:py-5">
      {/* Brand */}
      <div className="flex items-center gap-2.5 lg:px-2 lg:pb-6">
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-accent text-white shadow-[0_8px_20px_-8px_rgba(34,81,255,0.9)]">
          <Sparkles className="h-[18px] w-[18px]" strokeWidth={2} />
        </span>
        <div className="leading-tight">
          <div className="text-[14px] font-semibold tracking-tight text-white">
            Delivery Estimator
          </div>
          <div className="hidden text-[11px] text-white/45 lg:block">
            AI effort intelligence
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="ml-auto flex items-center gap-1 lg:ml-0 lg:mt-2 lg:flex-col lg:items-stretch lg:gap-1">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              isActive ? "nav-item active" : "nav-item"
            }
            title={item.label}
          >
            <item.icon className="h-[18px] w-[18px] flex-none" strokeWidth={2} />
            <span className="hidden lg:inline">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="mt-auto hidden lg:block lg:px-2 lg:pt-6">
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-3">
          <div className="text-[11px] font-semibold text-white/80">
            TDM workspace
          </div>
          <div className="mt-0.5 text-[11px] leading-relaxed text-white/45">
            Other projects coming soon
          </div>
        </div>
      </div>
    </aside>
  );
}
