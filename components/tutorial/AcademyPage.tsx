import React, { useState } from 'react';
import type { LearningPath, Module, Lesson, Step } from '../../types';
import { useTheme } from '../../ThemeContext';

const SvgIllustration: React.FC<{ illustration: string }> = ({ illustration }) => {
    // A simple component to render the SVG strings from tutorial data
    return <div className="my-4 p-4 bg-gray-200/50 dark:bg-gray-900/50 rounded-lg flex items-center justify-center" dangerouslySetInnerHTML={{ __html: illustration }} />;
};

const McqTask: React.FC<{ step: Step }> = ({ step }) => {
    const [selected, setSelected] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);
    const mcq = step.task?.validation.params.mcq;

    if (!mcq) return null;

    const checkAnswer = (index: number) => {
        setSelected(index);
        if (index === mcq.correctAnswerIndex) {
            setFeedback('Correct! Well done.');
        } else {
            setFeedback(step.task?.validation.errorMessage || 'Not quite, try again!');
        }
    };

    return (
        <div className="mt-4 p-4 border border-cyan-500/30 rounded-lg bg-white/30 dark:bg-gray-900/30">
            <p className="font-semibold mb-3">{mcq.question}</p>
            <div className="space-y-2">
                {mcq.options.map((option, index) => (
                    <button key={index} onClick={() => checkAnswer(index)} className={`w-full text-left p-2 rounded-md border-2 transition-colors ${selected === index ? 'border-cyan-500' : 'border-gray-300 dark:border-gray-600'}`}>
                        {option}
                    </button>
                ))}
            </div>
            {feedback && <p className={`mt-3 text-sm font-bold ${feedback.startsWith('Correct') ? 'text-green-500' : 'text-red-500'}`}>{feedback}</p>}
        </div>
    );
};

const LessonContent: React.FC<{ lesson: Lesson }> = ({ lesson }) => (
    <div className="space-y-8">
        {lesson.steps.map((step, index) => (
            <div key={index} className="prose prose-lg dark:prose-invert max-w-none">
                <h3 className="font-bold text-2xl border-b border-gray-300 dark:border-gray-600 pb-2">{step.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: step.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                {step.illustration && <SvgIllustration illustration={step.illustration} />}
                {step.task?.validation.type === 'mcq' && <McqTask step={step} />}
                {step.task?.validation.type !== 'mcq' && step.task && (
                    <div className="mt-4 p-4 border-l-4 border-cyan-500 bg-cyan-50 dark:bg-gray-800/50 rounded-r-lg">
                        <p className="font-bold text-cyan-800 dark:text-cyan-300">Try it out!</p>
                        <p>{step.task.instruction} in the Sandbox mode.</p>
                    </div>
                )}
            </div>
        ))}
    </div>
);

const TutorialViewer: React.FC<{ learningPath: LearningPath; onBack: () => void }> = ({ learningPath, onBack }) => {
    const [activeLesson, setActiveLesson] = useState<Lesson>(learningPath.modules[0].lessons[0]);
    const { theme } = useTheme();

    return (
        <div className={`flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
            {/* Sidebar Navigation */}
            <aside className="w-80 h-full bg-gray-50 dark:bg-gray-800 p-6 flex-col shrink-0 overflow-y-auto hidden md:flex">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline mb-6">
                    &larr; Back to Home
                </button>
                <h1 className="text-2xl font-bold mb-2">{learningPath.title}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{learningPath.description}</p>

                <nav className="space-y-6">
                    {learningPath.modules.map(module => (
                        <div key={module.id}>
                            <h2 className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-2">{module.title}</h2>
                            <ul className="space-y-1">
                                {module.lessons.map(lesson => (
                                    <li key={lesson.id}>
                                        <button
                                            onClick={() => setActiveLesson(lesson)}
                                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${activeLesson.id === lesson.id ? 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-200' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                                        >
                                            {lesson.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 h-full overflow-y-auto p-8 md:p-12">
                 <button onClick={onBack} className="flex items-center text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline mb-6 md:hidden">
                    &larr; Back to Home
                </button>
                <div className="max-w-4xl mx-auto">
                    <header className="mb-10">
                        <h1 className="text-5xl font-extrabold">{activeLesson.title}</h1>
                    </header>
                    <LessonContent lesson={activeLesson} />
                </div>
            </main>
        </div>
    );
};

export default TutorialViewer;