'use client';

import React from 'react';
import { Search, Filter, Trash2, Globe, ShieldAlert, Monitor } from 'lucide-react';
import { AnalyticsEvent } from '@/types';

interface AnalyticsEventStreamTabProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  eventTypeFilter: string;
  onEventTypeFilterChange: (value: string) => void;
  filteredEvents: AnalyticsEvent[];
  onDeleteEvent: (id?: string) => void;
  getEventBadgeColor: (type: string) => string;
}

export const AnalyticsEventStreamTab: React.FC<AnalyticsEventStreamTabProps> = ({
  searchTerm,
  onSearchChange,
  eventTypeFilter,
  onEventTypeFilterChange,
  filteredEvents,
  onDeleteEvent,
  getEventBadgeColor,
}) => {
  return (
    <div className="space-y-3">
      {/* Search and Filters */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-slate-100 dark:bg-slate-800 border-2 border-black text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events by IP, country, section, or action..."
            className="w-full bg-transparent outline-none text-xs text-black dark:text-white placeholder:text-slate-400 font-mono"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={eventTypeFilter}
            onChange={(e) => onEventTypeFilterChange(e.target.value)}
            className="px-2 py-1 bg-white dark:bg-slate-900 border border-black text-xs font-mono font-bold text-black dark:text-white"
          >
            <option value="all">All Event Types</option>
            <option value="page_view">Page Views</option>
            <option value="resume_download">CV Downloads</option>
            <option value="contact_click">Contact Clicks</option>
            <option value="project_click">Project Clicks</option>
            <option value="social_click">Social Clicks</option>
            <option value="section_dwell">Section Dwell</option>
            <option value="scroll_depth">Scroll Depth</option>
            <option value="chat_interaction">Chatbot</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-2 max-h-[50vh] overflow-y-auto">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((evt, idx) => (
            <div
              key={evt.id || idx}
              className="p-3 bg-slate-50 dark:bg-slate-800 border-2 border-black dark:border-slate-700 space-y-2 shadow-[2px_2px_0px_0px_#000]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`font-extrabold uppercase px-1.5 py-0.5 border border-black text-[10px] ${getEventBadgeColor(
                      evt.type
                    )}`}
                  >
                    {evt.type.replace('_', ' ')}
                  </span>

                  {(evt.visitCount || 1) > 1 && (
                    <span className="px-1.5 py-0.5 bg-emerald-300 text-black border border-black text-[9px] font-extrabold">
                      VISIT #{evt.visitCount}
                    </span>
                  )}

                  {evt.section && (
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">
                      📁 {evt.section}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-500">
                    {new Date(evt.timestamp).toLocaleString()}
                  </span>

                  {/* Individual Delete Button */}
                  <button
                    onClick={() => onDeleteEvent(evt.id || evt._id)}
                    className="p-1 bg-red-500 text-white border border-black hover:bg-red-600 cursor-pointer transition-colors"
                    title="Delete this event entry"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Event Details Row */}
              {(evt.targetTitle || evt.details || evt.duration || evt.scrollDepth) && (
                <div className="text-[11px] font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-1.5 border border-black/30">
                  {evt.targetTitle && <span className="font-extrabold mr-1">{evt.targetTitle}</span>}
                  {evt.details && <span>{evt.details}</span>}
                  {evt.duration ? <span className="ml-1 text-emerald-600 font-bold">({evt.duration}s active)</span> : null}
                  {evt.scrollDepth ? <span className="ml-1 text-orange-600 font-bold">({evt.scrollDepth}% depth)</span> : null}
                </div>
              )}

              {/* Visitor Tech and Geo metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-1.5">
                <div className="flex items-center gap-1 truncate text-black dark:text-slate-200 font-bold">
                  <Globe className="w-3 h-3 text-cyan-500 shrink-0" />
                  <span className="truncate">
                    {evt.city || 'Unknown City'}, {evt.country || 'Global'}
                  </span>
                </div>

                <div className="flex items-center gap-1 truncate">
                  <ShieldAlert className="w-3 h-3 text-rose-500 shrink-0" />
                  <span className="truncate">IP: {evt.ip || '127.0.0.1'}</span>
                </div>

                <div className="flex items-center gap-1 truncate font-bold text-emerald-600 dark:text-emerald-400">
                  <Monitor className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    {evt.device || 'Desktop'} • {evt.browser || 'Browser'}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-500 text-xs italic py-8 text-center">
            No events matching criteria.
          </p>
        )}
      </div>
    </div>
  );
};
