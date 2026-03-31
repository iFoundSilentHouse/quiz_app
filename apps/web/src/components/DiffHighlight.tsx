import { DiffCharDto } from '@spell/shared';

export const DiffHighlight = ({ diff }: { diff: DiffCharDto[] }) => {
  return (
    <div className="flex flex-wrap font-mono text-2xl tracking-widest uppercase">
      {diff.map((item, index) => {
        switch (item.type) {
          case 'correct':
            return <span key={index} className="text-green-600">{item.char}</span>;
          case 'incorrect':
            return <span key={index} className="text-red-600 bg-red-50 border-b-2 border-red-600">{item.char}</span>;
          case 'missing':
            return <span key={index} className="text-gray-400 border-b-2 border-gray-300">_</span>;
          case 'extra':
            return <span key={index} className="text-orange-500 line-through opacity-60">{item.char}</span>;
          default:
            return <span key={index}>{item.char}</span>;
        }
      })}
    </div>
  );
};