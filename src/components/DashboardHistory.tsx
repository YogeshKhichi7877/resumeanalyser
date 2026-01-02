import React, { useState, useEffect } from 'react';
import { Calendar, Star, TrendingUp, Eye, Trash2, Download } from 'lucide-react';
import { AnalysisReport } from '../types/analysis';

let ApiUrl = 'http://localhost:3011'

interface DashboardHistoryProps {
  userEmail: string;
  onViewReport: (report: AnalysisReport) => void;
  onDeleteReport: (reportId: string) => void;
  onExportReport: (report: AnalysisReport) => void;
}

const DashboardHistory: React.FC<DashboardHistoryProps> = ({ 
  userEmail, 
  onViewReport, 
  onDeleteReport,
  onExportReport 
}) => {
  const [reports, setReports] = useState<AnalysisReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchReports();
  }, [userEmail]);

  const fetchReports = async () => {
    try {
      const response = await fetch(`${ApiUrl}/api/reports?userEmail=${encodeURIComponent(userEmail)}`);
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDomainLabel = (domain: string) => {
    const labels: { [key: string]: string } = {
      'software-engineer': 'Software Engineer',
      'data-scientist': 'Data Scientist',
      'marketing': 'Marketing',
      'product-manager': 'Product Manager',
      'design': 'UI/UX Designer',
      'sales': 'Sales'
    };
    return labels[domain] || domain;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-400';
    if (score >= 60) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const filteredReports = reports.filter(report => {
    if (filter === 'all') return true;
    return report.target_domain === filter;
  });

  const domains = [...new Set(reports.map(r => r.target_domain))];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-black" />
            <h2 className="text-2xl font-black text-black uppercase">ANALYSIS HISTORY</h2>
          </div>
          
          <div className="text-black font-bold">
            {filteredReports.length} of {reports.length} reports
          </div>
        </div>

        {/* Domain Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 border-2 border-black font-bold text-sm uppercase transition-colors ${
              filter === 'all' ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
            }`}
          >
            ALL ({reports.length})
          </button>
          {domains.map(domain => (
            <button
              key={domain}
              onClick={() => setFilter(domain)}
              className={`px-4 py-2 border-2 border-black font-bold text-sm uppercase transition-colors ${
                filter === domain ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'
              }`}
            >
              {getDomainLabel(domain)} ({reports.filter(r => r.target_domain === domain).length})
            </button>
          ))}
        </div>
      </div>

      {/* Reports Grid */}
      {filteredReports.length === 0 ? (
        <div className="bg-gray-100 p-12 border-4 border-black text-center">
          <p className="text-black font-bold text-lg">
            {filter === 'all' 
              ? 'No analyses found. Upload your first resume to get started!' 
              : `No analyses found for ${getDomainLabel(filter)}.`
            }
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report) => (
            <div key={report.id} className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 mr-1 text-black" />
                    <span className="font-black text-black uppercase text-sm">
                      {getDomainLabel(report.target_domain)}
                    </span>
                  </div>
                  {report.version_name && (
                    <div className="text-xs font-bold text-gray-600 uppercase">
                      {report.version_name}
                    </div>
                  )}
                </div>
                
                <div className={`${getScoreColor(report.analysis_results.score)} px-3 py-1 border-2 border-black`}>
                  <span className="font-black text-black text-lg">
                    {report.analysis_results.score}
                  </span>
                </div>
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-center">
                  <div className="text-xs font-black text-black uppercase">ATS</div>
                  <div className="text-lg font-black text-black">{report.analysis_results.ats_compatibility}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs font-black text-black uppercase">Match</div>
                  <div className="text-lg font-black text-black">
                    {report.jd_match_results?.match_percentage || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="text-xs font-bold text-gray-600 mb-4">
                {formatDate(report.created_at)}
              </div>

              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => onViewReport(report)}
                  className="flex-1 px-3 py-2 bg-blue-400 text-black font-black border-2 border-black
                    hover:bg-blue-500 transition-colors text-xs uppercase"
                >
                  <Eye className="w-3 h-3 inline mr-1" />
                  VIEW
                </button>
                
                <button
                  onClick={() => onExportReport(report)}
                  className="px-3 py-2 bg-green-400 text-black font-black border-2 border-black
                    hover:bg-green-500 transition-colors"
                >
                  <Download className="w-3 h-3" />
                </button>
                
                <button
                  onClick={() => onDeleteReport(report.id)}
                  className="px-3 py-2 bg-red-400 text-black font-black border-2 border-black
                    hover:bg-red-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardHistory;