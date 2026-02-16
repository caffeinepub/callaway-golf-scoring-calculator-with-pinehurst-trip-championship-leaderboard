import { type CallawayResultData } from '../../state/eventTypes';

interface ExportPdfOptions {
  eventTitle: string;
  courseName?: string;
  results: CallawayResultData[];
  coursePar: number;
}

/**
 * Exports the final standings to a PDF file using browser print functionality.
 * This creates a print-optimized view and triggers the browser's print dialog.
 */
export function exportStandingsToPdf({ eventTitle, courseName, results, coursePar }: ExportPdfOptions): void {
  // Create a new window for printing
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('Please allow pop-ups to download the PDF');
    return;
  }

  // Use fallback title for document metadata if empty
  const documentTitle = eventTitle.trim() || 'Tournament Results';
  const hasTitle = eventTitle.trim().length > 0;

  // Generate HTML content for the PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${escapeHtml(documentTitle)} - Final Standings</title>
        <style>
          @media print {
            @page {
              margin: 0.75in;
              size: letter portrait;
            }
            body {
              margin: 0;
              padding: 0;
            }
          }
          
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.5;
            color: #1a1a1a;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 20px;
          }
          
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2d5016;
            padding-bottom: 20px;
          }
          
          .header h1 {
            font-size: 28px;
            font-weight: bold;
            margin: 0 0 10px 0;
            color: #2d5016;
          }
          
          .header .course-name {
            font-size: 18px;
            color: #4a4a4a;
            margin: 5px 0;
          }
          
          .header .subtitle {
            font-size: 14px;
            color: #6a6a6a;
            margin: 5px 0;
          }
          
          .standings-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          
          .standings-table thead {
            background-color: #2d5016;
            color: white;
          }
          
          .standings-table th {
            padding: 12px 8px;
            text-align: left;
            font-weight: 600;
            font-size: 13px;
            border: 1px solid #2d5016;
          }
          
          .standings-table th.rank {
            width: 60px;
            text-align: center;
          }
          
          .standings-table th.score {
            width: 80px;
            text-align: center;
          }
          
          .standings-table td {
            padding: 10px 8px;
            border: 1px solid #d0d0d0;
            font-size: 12px;
          }
          
          .standings-table td.rank {
            text-align: center;
            font-weight: bold;
            color: #2d5016;
          }
          
          .standings-table td.score {
            text-align: center;
            font-weight: 600;
          }
          
          .standings-table tbody tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          
          .standings-table tbody tr:hover {
            background-color: #f0f0f0;
          }
          
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #d0d0d0;
            text-align: center;
            font-size: 11px;
            color: #6a6a6a;
          }
          
          .medal {
            display: inline-block;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            text-align: center;
            line-height: 20px;
            font-size: 11px;
            font-weight: bold;
            margin-right: 5px;
          }
          
          .medal.gold {
            background-color: #ffd700;
            color: #1a1a1a;
          }
          
          .medal.silver {
            background-color: #c0c0c0;
            color: #1a1a1a;
          }
          
          .medal.bronze {
            background-color: #cd7f32;
            color: white;
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${hasTitle ? `<h1>${escapeHtml(eventTitle)}</h1>` : ''}
          ${courseName ? `<div class="course-name">${escapeHtml(courseName)}</div>` : ''}
          <div class="subtitle">Final Standings - Callaway Scoring System</div>
          <div class="subtitle">Generated on ${new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</div>
        </div>
        
        <table class="standings-table">
          <thead>
            <tr>
              <th class="rank">Rank</th>
              <th>Player Name</th>
              <th class="score">Net Score</th>
              <th class="score">Gross Score</th>
              <th class="score">Deduction</th>
              <th class="score">Adjustment</th>
            </tr>
          </thead>
          <tbody>
            ${results.map((result, index) => {
              const rank = index + 1;
              let medalHtml = '';
              
              if (rank === 1) {
                medalHtml = '<span class="medal gold">🥇</span>';
              } else if (rank === 2) {
                medalHtml = '<span class="medal silver">🥈</span>';
              } else if (rank === 3) {
                medalHtml = '<span class="medal bronze">🥉</span>';
              }
              
              return `
                <tr>
                  <td class="rank">${medalHtml}${rank}</td>
                  <td>${escapeHtml(result.name)}</td>
                  <td class="score">${result.net}</td>
                  <td class="score">${result.gross}</td>
                  <td class="score">${result.deduction}</td>
                  <td class="score">${result.adjustment >= 0 ? '+' : ''}${result.adjustment}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
        
        <div class="footer">
          <p>Callaway Scoring System - Professional Tournament Results</p>
          <p>Net Score Calculation: When gross score is at or below par (${coursePar}), net equals gross.</p>
          <p>When gross score is above par: Net Score = Gross Score - Deduction + Adjustment</p>
        </div>
        
        <script>
          // Auto-trigger print dialog when page loads
          window.onload = function() {
            window.print();
            // Close window after printing or canceling
            window.onafterprint = function() {
              window.close();
            };
          };
        </script>
      </body>
    </html>
  `;

  // Write content to the new window
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

/**
 * Escapes HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
