import { useEffect } from 'react';
import { RendererWindowBrowser } from '../communicationBridge/fakeWindowBrowser';
import {
  getCurrentDriver,
  getCurrentNavigator,
  useAppStore,
} from '../state.ts/defaultState';
import { Badge } from '@/components/ui/badge';
import { CloseIcon, MinusIcon, NavigatorIcon, PlusIcon, WheelIcon } from '@/components/icons/icons';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RotationProgress } from '@/components/RotationProgress';
import { Separator } from '@/components/ui/separator';

export function EditEnsemble() {
  useEffect(() => {
    RendererWindowBrowser.setOpacity(1.0);
    RendererWindowBrowser.maximize();
    RendererWindowBrowser.setAlwaysOnTop(false);
    RendererWindowBrowser.setIgnoreMouseEvents(false);
  }, []);

  const { startProgramming } = useAppStore((state) => ({
    ensembleMembers: state.ensembleMembers,
    removeMember: state.removeMember,
    addMember: state.addMember,
    newMemberName: state.newMemberName,
    setNewMemberName: state.setNewMemberName,
    startProgramming: state.startTurn,
  }));

  return (
    <>
      <div className="p-5">
        <RotationProgress className="" />
        <div className="flex mt-5">
          <EnsembleOptions />
          <RosterEdit />
        </div>
        <Separator className="my-10" />
        <Button
          onClick={() => {
            startProgramming();
          }}
        >
          Start
        </Button>
      </div>
    </>
  );
}

function EnsembleOptions() {
  const {
    timerLength,
    setTimerLength,
    breakLength,
    setBreakLength,
    rotationsPerBreak,
    setRotationsPerBreak,
  } = useAppStore((state) => ({
    timerLength: state.timerLength,
    setTimerLength: state.setTimerLength,
    breakLength: state.breakLength,
    setBreakLength: state.setBreakLength,
    rotationsPerBreak: state.rotationsPerBreak,
    setRotationsPerBreak: state.setRotationsPerBreak,
  }));

  const timerLengthInMinutes = Math.round(timerLength / (60 * 1000));
  const breakLengthInMinutes = Math.round(breakLength / (60 * 1000));
  return (
    <>
      <Card className="bg-zinc-800 text-zinc-200">
        <CardHeader>
          <CardTitle>Options</CardTitle>
        </CardHeader>
        <CardContent>
          <h1>Timer</h1>
          <div>
            <Button
              onClick={() => {
                setTimerLength(timerLength - 60 * 1000);
              }}
              disabled={timerLengthInMinutes <= 1}
            >
              <MinusIcon />
            </Button>
            <span className="w-5 h-5">{timerLengthInMinutes}</span>
            <Button
              onClick={() => {
                setTimerLength(timerLength + 60 * 1000);
              }}
            >
              <PlusIcon />
            </Button>
            <span>Minutes</span>
          </div>
          <h1>Breaks</h1>
          <div>
            <Button
              onClick={() => {
                setBreakLength(breakLength - 60 * 1000);
              }}
              disabled={breakLengthInMinutes <= 1}
            >
              <MinusIcon />
            </Button>
            <span className="w-5 h-5">{breakLengthInMinutes}</span>
            <Button
              onClick={() => {
                setBreakLength(breakLength + 60 * 1000);
              }}
            >
              <PlusIcon />
            </Button>
            <span>Minutes</span>
          </div>
          <div>
            <Button
              onClick={() => {
                setRotationsPerBreak(rotationsPerBreak - 1);
              }}
              disabled={rotationsPerBreak <= 1}
            >
              <MinusIcon />
            </Button>
            <span className="w-5 h-5">{rotationsPerBreak}</span>
            <Button
              onClick={() => {
                setRotationsPerBreak(rotationsPerBreak + 1);
              }}
            >
              <PlusIcon />
            </Button>
            <span>
              Every {rotationsPerBreak * timerLengthInMinutes} Minutes
            </span>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

function RosterEdit() {
  const {
    ensembleMembers,
    removeMember,
    addMember,
    newMemberName,
    setNewMemberName,
    currentRotation,
  } = useAppStore((state) => ({
    ensembleMembers: state.ensembleMembers,
    removeMember: state.removeMember,
    addMember: state.addMember,
    newMemberName: state.newMemberName,
    setNewMemberName: state.setNewMemberName,
    currentRotation: state.currentRotation,
  }));

  const currentDriver = getCurrentDriver({ ensembleMembers, currentRotation });
  const currentNavigator = getCurrentNavigator({
    ensembleMembers,
    currentRotation,
  });

  return (
    <>
      <Card className="bg-zinc-800 text-zinc-200 ml-5 flex-grow p-3">
        <div>
          {ensembleMembers.map((member) => (
            <Badge key={member.id} className="text-3xl mr-2 mb-2">
              {member.id === currentDriver.id && <WheelIcon className='w-6 h-6'/>}
              {member.id === currentNavigator.id && <NavigatorIcon className='w-6 h-6'/>}
              <span className="text-zinc-200 ml-2">{member.name}</span>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  removeMember({ id: member.id });
                }}
                className="w-8 h-8 p-1 ml-2"
              >
                <CloseIcon
                  className="w-6 h-6 bg-zinc-700 rounded-full text-zinc-200"
                  strokeWidth={2}
                />
              </Button>
            </Badge>
          ))}
        </div>
        <form>
          <Input
            value={newMemberName}
            placeholder="Name"
            onChange={(e) => setNewMemberName(e.target.value)}
            className="w-30 bg-zinc-800 text-3xl h-13 mt-5"
          ></Input>
          <Button
            className="mt-5"
            onClick={(e) => {
              e.preventDefault();
              addMember({ name: newMemberName });
              setNewMemberName('');
            }}
            disabled={!newMemberName}
          >
            Add
          </Button>
        </form>
      </Card>
    </>
  );
}
