import React, { useState } from 'react';
import type { LearningPath, Board, DroppedComponent, Connection } from '../../types';
import { useTheme } from '../../ThemeContext';

interface LessonPaneProps {
  learningPath: LearningPath;
  board: Board;
  droppedComponents: DroppedComponent[];
  connections: Connection[];
  code: string;
  onClear: () => void;
}

const LessonPane: React.FC<LessonPaneProps> = ({ learningPath, board, droppedComponents, connections, code, onClear }) => {
    const { theme } = useTheme();
    const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
    const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [stepValidated, setStepValidated] = useState(false);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [selectedMcqOption, setSelectedMcqOption] = useState<number | null>(null);

    const module = learningPath.modules[currentModuleIndex];
    const lesson = module.lessons[currentLessonIndex];
    const step = lesson.steps[currentStepIndex];

    const handleCheckWork = () => {
        if (!step.task) return;
        setValidationError(null);
        setSelectedMcqOption(null);

        const { validation } = step.task;
        let isCorrect = false;

        switch (validation.type) {
            case 'placeComponent':
                isCorrect = droppedComponents.some(c => c.id === validation.params.componentId);
                break;
            case 'createConnection':
                 const fromOwnerId = validation.params.from?.owner === 'board' ? `${board.id}-board` : validation.params.from?.owner;
                 const toOwnerId = validation.params.to?.owner === 'board' ? `${board.id}-board` : validation.params.to?.owner;
                
                 isCorrect = connections.some(c => 
                    (c.from.ownerId.startsWith(fromOwnerId!) && c.from.pin.includes(validation.params.from!.pin) && c.to.ownerId.startsWith(toOwnerId!) && c.to.pin.includes(validation.params.to!.pin)) ||
                    (c.to.ownerId.startsWith(fromOwnerId!) && c.to.pin.includes(validation.params.from!.pin) && c.from.ownerId.startsWith(toOwnerId!) && c.from.pin.includes(validation.params.to!.pin))
                );
                break;
            case 'mcq':
                if (selectedMcqOption === validation.params.mcq?.correctAnswerIndex) {
                    isCorrect = true;
                }
                break;
            // TODO: Add 'checkCode' validation
        }

        if (isCorrect) {
            setStepValidated(true);
        } else {
            setValidationError(validation.errorMessage);
        }
    };

    const handleNext = () => {
        setStepValidated(false);
        setValidationError(null);
        setSelectedMcqOption(null);
        
        if (currentStepIndex < lesson.steps.length - 1) {
            setCurrentStepIndex(i => i + 1);
        } else if (currentLessonIndex < module.lessons.length - 1) {
            setCurrentLessonIndex(i => i + 1);
            setCurrentStepIndex(0);
        } else if (currentModuleIndex < learningPath.modules.length - 1) {
            setCurrentModuleIndex(i => i + 1);
            setCurrentLessonIndex(0);
            setCurrentStepIndex(0);
        } else {
            // TODO: Show completion screen
            console.log("Learning Path Complete!");
        }
    };

    const totalStepsInLesson = lesson.steps.length;

    return (
        <aside className="bg-gray-100/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 flex flex-col h-full overflow-y-auto">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                <h2 className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">{learningPath.title}</h2>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-1">{lesson.title}</h3>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Step {currentStepIndex + 1} of {totalStepsInLesson}</p>
                    <div className="w-1/2 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div className="bg-cyan-500 h-1.5 rounded-full" style={{ width: `${((currentStepIndex + 1) / totalStepsInLesson) * 100}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="flex-grow space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{step.title}</h4>
                <div className="prose prose-sm dark:prose-invert max-w-none text-gray-600 dark:text-gray-300" dangerouslySetInnerHTML={{ __html: step.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                
                {step.illustration && (
                    <div className="my-4 p-4 bg-gray-200/50 dark:bg-gray-900/50 rounded-lg flex items-center justify-center">
                        {/* Placeholder for real illustrations */}
                        <div className="w-full h-32 text-gray-800 dark:text-gray-200" dangerouslySetInnerHTML={{ __html: step.illustration }} />
                    </div>
                )}
            </div>

            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                {step.type === 'task' && step.task && (
                    <div className="p-4 bg-white/50 dark:bg-gray-900/50 rounded-lg shadow">
                        <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Your Task:</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{step.task.instruction}</p>

                        {step.task.validation.type === 'mcq' && step.task.validation.params.mcq && (
                            <div className="mt-3 space-y-2">
                                {step.task.validation.params.mcq.options.map((opt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setSelectedMcqOption(i)}
                                        className={`w-full text-left p-2 rounded-md border-2 transition-colors ${selectedMcqOption === i ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/50' : 'border-gray-300 dark:border-gray-600 hover:border-cyan-400'}`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {validationError && (
                            <p className="mt-3 text-sm text-red-500">{validationError}</p>
                        )}
                    </div>
                )}

                {stepValidated ? (
                    <button onClick={handleNext} className="w-full px-4 py-3 text-base font-semibold text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors">
                        Correct! Next Step &rarr;
                    </button>
                ) : (
                    step.task && (
                        <button onClick={handleCheckWork} className="w-full px-4 py-3 text-base font-semibold text-white bg-cyan-600 hover:bg-cyan-700 rounded-md transition-colors">
                            Check My Work
                        </button>
                    )
                )}
            </div>
        </aside>
    );
};

export default LessonPane;
