"use client";

import React from "react";

type Tab = {
  value: string;
  label: string;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
  className?: string;
};

export function Tabs({ tabs, activeTab, onTabChange, className = "" }: TabsProps) {
  return (
    <div
      className={[
        "flex overflow-x-auto no-scrollbar border-b border-border",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={[
              "px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer",
              "border-b-2 -mb-px",
              isActive
                ? "text-primary border-primary"
                : "text-text-secondary border-transparent hover:text-text-primary hover:border-gray-300",
            ].join(" ")}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
