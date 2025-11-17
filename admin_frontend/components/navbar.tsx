"use client"

import { Search } from "lucide-react"

export function Navbar() {
  return (
    <nav className="sticky top-0 z-30 bg-card border-b border-border">
      <div className="h-16 px-6 flex items-center justify-between">
        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 bg-input px-4 py-2 rounded-lg flex-1 max-w-sm">
          <Search size={18} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        {/* Right side - placeholder for future notifications */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-primary rounded-full"></div>
          </div>
        </div>
      </div>
    </nav>
  )
}
