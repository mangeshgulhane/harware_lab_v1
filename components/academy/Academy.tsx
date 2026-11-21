
import React, { useState } from 'react';
import { ACADEMY_TOPICS } from '../../data/academyData';
import type { AcademyTopic, AcademySubTopic } from '../../types';

interface AcademyPageProps {
  onBack: () => void;
}

const AcademyPage: React.FC<AcademyPageProps> = ({ onBack }) => {
    const [activeTopic, setActiveTopic] = useState<AcademyTopic>(ACADEMY_TOPICS[0]);
    const [activeSubTopic, setActiveSubTopic] = useState<AcademySubTopic>(ACADEMY_TOPICS[0].subTopics[0]);

    const handleSelectSubTopic = (topic: AcademyTopic, subTopic: AcademySubTopic) => {
        setActiveTopic(topic);
        setActiveSubTopic(subTopic);
    };

    const { AnimationComponent } = activeSubTopic;

    return (
        <div className="flex h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Sidebar Navigation */}
            <aside className="w-80 h-full bg-gray-50 dark:bg-gray-800 p-6 flex flex-col shrink-0 overflow-y-auto hidden md:flex">
                <button onClick={onBack} className="flex items-center text-sm font-semibold text-cyan-600 dark:text-cyan-400 hover:underline mb-6">
                    &larr; Back to Home
                </button>
                <h1 className="text-2xl font-bold mb-6">Academy</h1>

                <nav className="space-y-6">
                    {ACADEMY_TOPICS.map(topic => (
                        <div key={topic.id}>
                            <h2 className="text-xs font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-2">{topic.title}</h2>
                            <ul className="space-y-1">
                                {topic.subTopics.map(subTopic => (
                                    <li key={subTopic.id}>
                                        <button
                                            onClick={() => handleSelectSubTopic(topic, subTopic)}
                                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                activeSubTopic.id === subTopic.id 
                                                ? 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-200' 
                                                : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            {subTopic.title}
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
                        <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400">{activeTopic.title}</p>
                        <h1 className="text-5xl font-extrabold mt-1">{activeSubTopic.title}</h1>
                    </header>
                    <article className="prose prose-lg dark:prose-invert max-w-none prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-li:text-gray-600 dark:prose-li:text-gray-300">
                        <style>{`
                            .code-block {
                                background-color: #f3f4f6;
                                color: #111827;
                                padding: 1rem;
                                border-radius: 0.5rem;
                                font-family: monospace;
                                font-size: 0.9em;
                                margin: 1.5em 0;
                            }
                            .dark .code-block {
                                background-color: #1f2937;
                                color: #d1d5db;
                            }
                        `}</style>
                        <div dangerouslySetInnerHTML={{ __html: activeSubTopic.content }} />
                    </article>

                    {AnimationComponent && (
                      <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                          <AnimationComponent />
                      </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AcademyPage;
