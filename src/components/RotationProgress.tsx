import { useAppStore } from '@/state.ts/defaultState';

export function RotationProgress({ className }: { className?: string }) {
  const { rotationsPerBreak, currentRotation } = useAppStore((state) => ({
    currentRotation: state.currentRotation,
    rotationsPerBreak: state.rotationsPerBreak,
  }));

  return (
    <>
      <div className={className}>
        <div className='flex'>
        {new Array(rotationsPerBreak).fill(undefined).map((_, index) => {
          const backgroundColor =
            index < currentRotation ? 'bg-emerald-500' : 'bg-zinc-700';
          return (
            <div
              key={index}
              className={'w-5 h-5 rounded-md  ' + backgroundColor}
            ></div>
          );
        })}
        </div>
      </div>
    </>
  );
}
