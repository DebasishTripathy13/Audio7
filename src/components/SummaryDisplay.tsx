import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Summary } from '../types';
import { Link, FileText, Bookmark, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface SummaryDisplayProps {
  summary: Summary | null;
}

export function SummaryDisplay({ summary }: SummaryDisplayProps) {
  if (!summary) return null;

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    let currentY = margin;

    // Add title
    doc.setFontSize(16);
    doc.text('SmartSummarize Report', margin, currentY);
    currentY += 15;

    // Add timestamp
    doc.setFontSize(10);
    doc.text(`Generated: ${summary.timestamp}`, margin, currentY);
    currentY += 15;

    // Process markdown content
    const markdownSections = summary.text.split('\n\n');
    doc.setFontSize(12);

    markdownSections.forEach(section => {
      // Handle headers
      if (section.startsWith('#')) {
        const headerLevel = section.match(/^#+/)[0].length;
        const headerText = section.replace(/^#+\s/, '');
        doc.setFontSize(14 - headerLevel);
        doc.setFont('helvetica', 'bold');
        const lines = doc.splitTextToSize(headerText, maxWidth);
        doc.text(lines, margin, currentY);
        currentY += (lines.length * 7);
        doc.setFont('helvetica', 'normal');
      } else {
        // Handle regular text
        doc.setFontSize(11);
        const lines = doc.splitTextToSize(section.replace(/[*_]/g, ''), maxWidth);
        
        // Check if we need a new page
        if (currentY + (lines.length * 7) > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          currentY = margin;
        }
        
        doc.text(lines, margin, currentY);
        currentY += (lines.length * 7) + 5;
      }
    });

    // Add references if they exist
    if (summary.references.length > 0) {
      // Check if we need a new page for references
      if (currentY > doc.internal.pageSize.getHeight() - 60) {
        doc.addPage();
        currentY = margin;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('References', margin, currentY);
      currentY += 10;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);

      summary.references.forEach(ref => {
        const refText = `${ref.title}${ref.url ? ` - ${ref.url}` : ''}`;
        const lines = doc.splitTextToSize(refText, maxWidth);
        
        if (currentY + (lines.length * 7) > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          currentY = margin;
        }
        
        doc.text(lines, margin, currentY);
        currentY += (lines.length * 7) + 5;
      });
    }

    // Save the PDF
    doc.save(`smart-summarize-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Summary</h2>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{summary.timestamp}</span>
          <button
            onClick={downloadPDF}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>
      
      <div className="prose prose-sm max-w-none">
        <ReactMarkdown>{summary.text}</ReactMarkdown>
      </div>

      {summary.references.length > 0 && (
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-medium mb-3">References</h3>
          <ul className="space-y-2">
            {summary.references.map((ref, index) => (
              <li key={index} className="flex items-center gap-2 text-sm">
                {ref.type === 'link' && <Link className="w-4 h-4 text-blue-500" />}
                {ref.type === 'document' && <FileText className="w-4 h-4 text-green-500" />}
                {ref.type === 'note' && <Bookmark className="w-4 h-4 text-purple-500" />}
                {ref.url ? (
                  <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    {ref.title}
                  </a>
                ) : (
                  <span>{ref.title}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}