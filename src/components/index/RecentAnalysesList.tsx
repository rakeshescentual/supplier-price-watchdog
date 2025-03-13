
import { ReactNode } from "react";

interface SavedAnalysis {
  id: string;
  date: string;
  fileName: string;
  itemCount: number;
  summary: { increasedItems: number; decreasedItems: number }
}

interface RecentAnalysesListProps {
  savedAnalyses: SavedAnalysis[];
}

export const RecentAnalysesList = ({ savedAnalyses }: RecentAnalysesListProps) => {
  if (savedAnalyses.length === 0) return null;
  
  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-medium mb-4">Recent Analyses</h3>
      <div className="overflow-x-auto">
        <table className="w-full max-w-lg mx-auto text-sm">
          <thead>
            <tr>
              <th className="text-left px-4 py-2">Date</th>
              <th className="text-left px-4 py-2">File</th>
              <th className="text-right px-4 py-2">Items</th>
              <th className="text-right px-4 py-2">↑ Increases</th>
              <th className="text-right px-4 py-2">↓ Decreases</th>
            </tr>
          </thead>
          <tbody>
            {savedAnalyses.map(analysis => (
              <tr key={analysis.id} className="border-t hover:bg-muted/50">
                <td className="px-4 py-2">{new Date(analysis.date).toLocaleDateString()}</td>
                <td className="px-4 py-2 font-medium">{analysis.fileName}</td>
                <td className="px-4 py-2 text-right">{analysis.itemCount}</td>
                <td className="px-4 py-2 text-right text-red-600">{analysis.summary.increasedItems}</td>
                <td className="px-4 py-2 text-right text-green-600">{analysis.summary.decreasedItems}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
