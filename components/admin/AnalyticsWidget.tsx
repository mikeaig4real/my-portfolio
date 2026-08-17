'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AnalyticsEvent,
  VisitorLead,
  ChatTranscript,
  AnalyticsData,
  VisitorIntentAnalysis as AIAnalysisResult,
  VisitorSessionOption,
} from '@/types';
import { AnalyticsHeader } from './analytics/AnalyticsHeader';
import { AnalyticsTabsNav, TabType } from './analytics/AnalyticsTabsNav';
import { AnalyticsConfirmBanner } from './analytics/AnalyticsConfirmBanner';
import { AnalyticsOverviewTab } from './analytics/AnalyticsOverviewTab';
import { AnalyticsEventStreamTab } from './analytics/AnalyticsEventStreamTab';
import { AnalyticsLeadsTab } from './analytics/AnalyticsLeadsTab';
import { AnalyticsAiSynthesisTab } from './analytics/AnalyticsAiSynthesisTab';

interface AnalyticsWidgetProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalyticsWidget: React.FC<AnalyticsWidgetProps> = ({ isOpen, onClose }) => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('metrics');
  const [searchTerm, setSearchTerm] = useState('');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');
  const [confirmAction, setConfirmAction] = useState<'clear_events' | 'reset_all' | null>(null);
  const [selectedVisitorForChat, setSelectedVisitorForChat] = useState<string | null>(null);

  // AI Intent Analysis state
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [selectedVisitorIdForAnalysis, setSelectedVisitorIdForAnalysis] = useState<string>('all');


  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/analytics');
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchAnalytics();
      setAiAnalysis(null);
    }
  }, [isOpen]);

  // Handle granular deletion of individual events
  const handleDeleteEvent = async (eventId?: string) => {
    if (!eventId) return;

    // Optimistic UI update
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        recentEvents: prev.recentEvents.filter((e) => e.id !== eventId && e._id !== eventId),
      };
    });

    try {
      await fetch('/api/analytics', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_event', id: eventId }),
      });
    } catch {
      fetchAnalytics();
    }
  };

  // Handle deletion of lead/chat
  const handleDeleteLead = async (visitorId: string) => {
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        visitorLeads: (prev.visitorLeads || []).filter((l) => l.visitorId !== visitorId),
        chatTranscripts: (prev.chatTranscripts || []).filter((c) => c.visitorId !== visitorId),
      };
    });

    try {
      await fetch('/api/analytics', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_lead', visitorId }),
      });
    } catch {
      fetchAnalytics();
    }
  };

  // Handle bulk clear / reset
  const handleExecuteBulkAction = async (action: 'clear_events' | 'reset_all') => {
    try {
      await fetch('/api/analytics', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (action === 'clear_events') {
        setData((prev) => (prev ? { ...prev, recentEvents: [] } : prev));
      } else {
        setData({
          totalViews: 0,
          totalResumeDownloads: 0,
          totalContactClicks: 0,
          totalSocialClicks: 0,
          totalProjectClicks: 0,
          projectClicks: {},
          sectionEngagement: {},
          visitorLeads: [],
          chatTranscripts: [],
          recentEvents: [],
        });
      }
      setConfirmAction(null);
    } catch {
      fetchAnalytics();
    }
  };

  // Extract and group unique visitor sessions for selector
  const visitorSessions = useMemo<VisitorSessionOption[]>(() => {
    const map = new Map<string, VisitorSessionOption>();
    const events = data?.recentEvents || [];
    const leads = data?.visitorLeads || [];

    events.forEach((e) => {
      const vid = e.visitorId || e.ip || 'anonymous';
      const existing = map.get(vid);
      const loc =
        e.city && e.country ? `${e.city}, ${e.country}` : e.country || e.city || 'Unknown Location';
      const dev = e.device ? `${e.device} (${e.browser || ''} on ${e.os || ''})` : 'Desktop Browser';
      const leadMatch = leads.find((l) => l.visitorId === vid);

      if (!existing) {
        map.set(vid, {
          visitorId: vid,
          ip: e.ip,
          location: loc,
          device: dev,
          eventCount: 1,
          totalDwellSeconds: e.duration || 0,
          leadName: leadMatch?.name,
          leadEmail: leadMatch?.email,
          leadCompany: leadMatch?.company,
          lastActive: e.timestamp,
        });
      } else {
        existing.eventCount += 1;
        existing.totalDwellSeconds += e.duration || 0;
        if (!existing.ip && e.ip) existing.ip = e.ip;
        if (existing.location === 'Unknown Location' && loc !== 'Unknown Location') {
          existing.location = loc;
        }
      }
    });

    // Also include leads that might not have recent event logs
    leads.forEach((l) => {
      if (!map.has(l.visitorId)) {
        map.set(l.visitorId, {
          visitorId: l.visitorId,
          ip: l.ip,
          location: l.city && l.country ? `${l.city}, ${l.country}` : l.country || 'Unknown Location',
          device: 'Chatbot Lead',
          eventCount: 1,
          totalDwellSeconds: 0,
          leadName: l.name,
          leadEmail: l.email,
          leadCompany: l.company,
          lastActive: l.lastActive,
        });
      }
    });

    return Array.from(map.values());
  }, [data?.recentEvents, data?.visitorLeads]);

  // Run AI Intent Synthesis
  const handleRunAiAnalysis = async (specificVisitorId?: string) => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    const targetId = specificVisitorId ?? selectedVisitorIdForAnalysis;

    try {
      const isSingle = targetId && targetId !== 'all';
      const payload: {
        mode: 'single_visitor' | 'aggregate_traffic';
        visitorId?: string;
      } = {
        mode: isSingle ? 'single_visitor' : 'aggregate_traffic',
        visitorId: isSingle ? targetId : undefined,
      };

      const res = await fetch('/api/ai/analyze-visitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setAiAnalysis(json.data);
        setActiveTab('ai_synthesis');
      } else {
        throw new Error(json.error || 'Failed to synthesize intent.');
      }
    } catch (err: unknown) {
      const error = err as Error;
      setAnalysisError(error.message || 'AI Synthesis encountered an issue.');
    } finally {
      setIsAnalyzing(false);
    }
  };


  // Computed summary metrics
  const uniqueVisitorsCount = useMemo(() => {
    const ids = new Set((data?.recentEvents || []).map((e) => e.visitorId || e.ip));
    return ids.size;
  }, [data?.recentEvents]);

  const returningVisitorsCount = useMemo(() => {
    const returning = (data?.recentEvents || []).filter((e) => (e.visitCount || 1) > 1);
    return new Set(returning.map((e) => e.visitorId)).size;
  }, [data?.recentEvents]);

  const avgSessionDuration = useMemo(() => {
    const durationEvents = (data?.recentEvents || []).filter((e) => e.duration && e.duration > 0);
    if (durationEvents.length === 0) return 0;
    const total = durationEvents.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    return Math.round(total / durationEvents.length);
  }, [data?.recentEvents]);

  const maxScrollAvg = useMemo(() => {
    const scrollEvents = (data?.recentEvents || []).filter((e) => e.scrollDepth && e.scrollDepth > 0);
    if (scrollEvents.length === 0) return 0;
    const total = scrollEvents.reduce((acc, curr) => acc + (curr.scrollDepth || 0), 0);
    return Math.round(total / scrollEvents.length);
  }, [data?.recentEvents]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return (data?.recentEvents || []).filter((e) => {
      const matchesSearch =
        searchTerm === '' ||
        e.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.city && e.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (e.country && e.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (e.ip && e.ip.includes(searchTerm)) ||
        (e.targetTitle && e.targetTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (e.section && e.section.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesType = eventTypeFilter === 'all' || e.type === eventTypeFilter;

      return matchesSearch && matchesType;
    });
  }, [data?.recentEvents, searchTerm, eventTypeFilter]);

  const getEventBadgeColor = (type: string) => {
    switch (type) {
      case 'page_view':
        return 'bg-yellow-300 text-black';
      case 'resume_download':
        return 'bg-pink-400 text-white';
      case 'contact_click':
        return 'bg-emerald-400 text-black';
      case 'social_click':
        return 'bg-purple-300 text-black';
      case 'project_click':
        return 'bg-cyan-300 text-black';
      case 'section_dwell':
        return 'bg-lime-300 text-black';
      case 'scroll_depth':
        return 'bg-orange-300 text-black';
      case 'chat_interaction':
        return 'bg-indigo-400 text-white';
      default:
        return 'bg-slate-200 text-black';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-80 cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.92, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.92, opacity: 0 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-90 w-[95vw] max-w-4xl max-h-[90vh] p-4 sm:p-6 bg-white dark:bg-slate-900 border-4 border-black dark:border-white shadow-[12px_12px_0px_0px_#70d6ff] font-mono flex flex-col overflow-hidden"
          >
            {/* Header */}
            <AnalyticsHeader
              loading={loading}
              onRefresh={fetchAnalytics}
              onClose={onClose}
            />

            {/* Navigation Tabs & Actions */}
            <AnalyticsTabsNav
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setActiveTab(tab);
                if (tab === 'ai_synthesis' && !aiAnalysis) {
                  handleRunAiAnalysis();
                }
              }}
              eventsCount={data?.recentEvents?.length || 0}
              leadsCount={data?.visitorLeads?.length || 0}
              onClearLogsClick={() => setConfirmAction('clear_events')}
              onResetAllClick={() => setConfirmAction('reset_all')}
            />

            {/* Confirmation Banner */}
            <AnalyticsConfirmBanner
              confirmAction={confirmAction}
              onConfirm={() => confirmAction && handleExecuteBulkAction(confirmAction)}
              onCancel={() => setConfirmAction(null)}
            />

            {/* Tab Content Body */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {loading && !data ? (
                <div className="py-20 text-center uppercase text-xs font-extrabold animate-pulse">
                  Retrieving Real-Time Visitor Telemetry...
                </div>
              ) : null}

              {/* 1. OVERVIEW & METRICS TAB */}
              {activeTab === 'metrics' && (
                <AnalyticsOverviewTab
                  data={data}
                  uniqueVisitorsCount={uniqueVisitorsCount}
                  avgSessionDuration={avgSessionDuration}
                  maxScrollAvg={maxScrollAvg}
                  returningVisitorsCount={returningVisitorsCount}
                  isAnalyzing={isAnalyzing}
                  onRunAiAnalysis={() => handleRunAiAnalysis()}
                />
              )}

              {/* 2. LIVE EVENT LOG STREAM TAB */}
              {activeTab === 'events' && (
                <AnalyticsEventStreamTab
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  eventTypeFilter={eventTypeFilter}
                  onEventTypeFilterChange={setEventTypeFilter}
                  filteredEvents={filteredEvents}
                  onDeleteEvent={handleDeleteEvent}
                  getEventBadgeColor={getEventBadgeColor}
                />
              )}

              {/* 3. VISITOR LEADS & CHAT TRANSCRIPTS TAB */}
              {activeTab === 'leads' && (
                <AnalyticsLeadsTab
                  leads={data?.visitorLeads || []}
                  chatTranscripts={data?.chatTranscripts || []}
                  selectedVisitorForChat={selectedVisitorForChat}
                  onToggleChatVisitor={(id) =>
                    setSelectedVisitorForChat(selectedVisitorForChat === id ? null : id)
                  }
                  onRunAiAnalysis={(id) => {
                    setSelectedVisitorIdForAnalysis(id);
                    handleRunAiAnalysis(id);
                  }}
                  onDeleteLead={handleDeleteLead}
                />
              )}

              {/* 4. AI INTENT SYNTHESIS TAB */}
              {activeTab === 'ai_synthesis' && (
                <AnalyticsAiSynthesisTab
                  aiAnalysis={aiAnalysis}
                  isAnalyzing={isAnalyzing}
                  analysisError={analysisError}
                  selectedVisitorId={selectedVisitorIdForAnalysis}
                  visitorOptions={visitorSessions}
                  onSelectVisitor={(vid) => setSelectedVisitorIdForAnalysis(vid)}
                  onRunAiAnalysis={(vid) => handleRunAiAnalysis(vid)}
                />
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
