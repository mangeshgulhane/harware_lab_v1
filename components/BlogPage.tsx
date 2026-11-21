import React, { useState } from 'react';

// A simple SVG placeholder for screenshots
const ScreenshotPlaceholder: React.FC<{ text: string; width?: number; height?: number }> = ({ text, width = 600, height = 350 }) => (
    <div className="flex justify-center my-8">
        <div className="w-full max-w-2xl shadow-lg rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 text-xs text-gray-500 dark:text-gray-400 font-mono">
                {text}
            </div>
            <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="bg-gray-50 dark:bg-gray-700/50">
                <rect width={width} height={height} fill="currentColor" fillOpacity="0.05" />
                <text x={width / 2} y={height / 2} fontFamily="monospace" fontSize="16" textAnchor="middle" dominantBaseline="middle" className="fill-gray-400 dark:fill-gray-500 select-none">
                    [ Illustration ]
                </text>
            </svg>
        </div>
    </div>
);

const arduinoR3Content = (
    <>
        <p className="lead">
            The Arduino R3 is a fantastic microcontroller for beginners. It's the perfect starting point for learning electronics and coding. This guide will walk you through every step of uploading your first program—called a "sketch"—using the official Arduino IDE.
        </p>
        
        <h3>Step 1: Download & Install the Arduino IDE</h3>
        <p>The Arduino IDE (Integrated Development Environment) is the software you'll use to write, compile, and upload code to your board. It's free and available for Windows, macOS, and Linux.</p>
        <ol>
            <li>Visit the official Arduino Software page: <a href="https://www.arduino.cc/en/software" target="_blank" rel="noopener noreferrer">arduino.cc/en/software</a>.</li>
            <li>Download the version appropriate for your operating system.</li>
            <li>Run the installer and follow the on-screen instructions. Accept any prompts to install drivers.</li>
        </ol>

        <h3>Step 2: Connect Your Arduino R3</h3>
        <p>Use a standard USB-A to USB-B cable (the kind often used for printers) to connect your Arduino board to your computer. The board should power on, and you'll see a small green "ON" LED light up.</p>

        <h3>Step 3: Configure the IDE - Select Your Board</h3>
        <p>You need to tell the IDE which board you're using. The Arduino R3 is programmed as an "Arduino Uno".</p>
        <ol>
            <li>Open the Arduino IDE.</li>
            <li>Go to the menu bar and click <code>Tools &gt; Board &gt; Arduino AVR Boards</code>.</li>
            <li>Select <strong>Arduino Uno</strong> from the list.</li>
        </ol>
        <ScreenshotPlaceholder text="Arduino IDE Tools > Board > Arduino Uno menu selection" />

        <h3>Step 4: Configure the IDE - Select Your Port</h3>
        <p>Next, you must tell the IDE which communication port your computer has assigned to the Arduino. This is the most common point of confusion for beginners!</p>
        <ol>
            <li>Go to the menu bar and click <code>Tools &gt; Port</code>.</li>
            <li>You will see a list of available ports. The one for your Arduino will usually be labeled with "(Arduino Uno)".
                <ul>
                    <li><strong>Windows:</strong> It will look like <code>COM3 (Arduino Uno)</code>. The number may be different.</li>
                    <li><strong>macOS/Linux:</strong> It will look like <code>/dev/cu.usbmodem... (Arduino Uno)</code>.</li>
                </ul>
            </li>
            <li>If you're unsure, unplug your Arduino, check the list, then plug it back in and see which new port appears. That's the one!</li>
        </ol>
        <ScreenshotPlaceholder text="Arduino IDE Tools > Port menu with a COM port selected" />
        
        <h3>Step 5: Load an Example Sketch</h3>
        <p>The Arduino IDE comes with many built-in examples. The "Blink" sketch is the "Hello, World!" of microcontrollers.</p>
        <ol>
            <li>Go to <code>File &gt; Examples &gt; 01.Basics &gt; Blink</code>.</li>
            <li>A new window will open with the code for the Blink sketch. This code makes the built-in LED (marked with an "L" on the board) blink on and off.</li>
        </ol>

        <h3>Step 6: Verify and Upload Your Code</h3>
        <p>There are two main buttons at the top of the IDE:</p>
        <ul>
            <li><strong>Verify (✓):</strong> This compiles your code, checking it for any syntax errors before trying to upload.</li>
            <li><strong>Upload (→):</strong> This verifies your code and then sends it to the Arduino board.</li>
        </ul>
        <ScreenshotPlaceholder text="Arduino IDE interface with Verify and Upload buttons highlighted" height={150} />
        <ol>
            <li>Click the <strong>Upload</strong> button (the right-arrow).</li>
            <li>You'll see a progress bar and messages in the bottom console. The RX and TX LEDs on your Arduino will flash rapidly.</li>
            <li>Once it's finished, the console will display "Done uploading."</li>
        </ol>
        <p>Congratulations! Look at your Arduino board. The tiny orange LED marked "L" should now be blinking on for one second, then off for one second. You've successfully uploaded your first sketch!</p>
    </>
);

const esp8266Content = (
    <>
        <p className="lead">
            The ESP8266 is a powerful, low-cost microcontroller with built-in Wi-Fi. This makes it a favorite for Internet of Things (IoT) projects. While it's not an official Arduino, you can easily program it using the familiar Arduino IDE with a few setup steps. This guide focuses on the popular NodeMCU variant.
        </p>

        <h3>Step 1: Add ESP8266 Board Manager URL</h3>
        <p>First, you need to tell the Arduino IDE where to find the files for the ESP8266 boards.</p>
        <ol>
            <li>Open the Arduino IDE and go to <code>File &gt; Preferences</code>.</li>
            <li>Find the text box labeled "Additional Board Manager URLs".</li>
            <li>Paste the following URL into the box:
                <br/>
                <code>http://arduino.esp8266.com/stable/package_esp8266com_index.json</code>
            </li>
            <li>If there's already a URL in the box, add a comma and then paste the new URL after it.</li>
            <li>Click "OK".</li>
        </ol>
        <ScreenshotPlaceholder text="Arduino IDE Preferences window with Board Manager URL" />
        
        <h3>Step 2: Install the ESP8266 Core</h3>
        <p>Now you can download and install the actual board definitions.</p>
        <ol>
            <li>Go to <code>Tools &gt; Board &gt; Boards Manager...</code>.</li>
            <li>In the search box, type <strong>"esp8266"</strong>.</li>
            <li>You should see an entry for "esp8266 by ESP8266 Community". Click the "Install" button. This may take a few minutes.</li>
            <li>Once it's done, click "Close".</li>
        </ol>
        <ScreenshotPlaceholder text="Boards Manager window with 'esp8266' searched and ready to install" />
        
        <h3>Step 3: Connect Your ESP8266 and Install Drivers</h3>
        <p>Connect your ESP8266 board (like a NodeMCU) to your computer with a Micro-USB cable.</p>
        <p><strong>IMPORTANT:</strong> Most ESP8266 boards do not use the same USB-to-Serial chip as official Arduinos. You will likely need to install a driver. The two most common chips are the <strong>CH340</strong> and the <strong>CP2102</strong>. Look at the black chip near the USB port on your board to see which one you have, then search online for the appropriate driver for your operating system.</p>

        <h3>Step 4: Configure the IDE for Your Board</h3>
        <ol>
            <li>Go to <code>Tools &gt; Board</code>. You will now see a long list of "ESP8266 Boards".</li>
            <li>Scroll down and find the one that matches your hardware. A very common choice is <strong>"NodeMCU 1.0 (ESP-12E Module)"</strong>.</li>
            <li>Next, go to <code>Tools &gt; Port</code> and select the correct port for your device, just as you did for the Arduino R3. It might be labeled differently now.</li>
        </ol>
        <ScreenshotPlaceholder text="Arduino IDE Tools > Board menu showing ESP8266 board options" />

        <h3>Step 5: Load an Example and Upload</h3>
        <p>Let's use the Blink example again to test our setup.</p>
        <ol>
            <li>Go to <code>File &gt; Examples &gt; ESP8266 &gt; Blink</code>.</li>
            <li>Notice that the pin number might be different. The code often uses <code>LED_BUILTIN</code>, which is a constant that points to the correct pin for the board you selected.</li>
            <li>Click the <strong>Upload</strong> (→) button.</li>
            <li>The console will show "Connecting..." followed by a series of dots as it uploads. This process is often slower than with an Arduino Uno.</li>
        </ol>
        <p>Unlike some other microcontrollers, most NodeMCU boards can be put into programming mode automatically by the IDE, so you usually don't need to press any buttons.</p>
        <p>Success! The small blue built-in LED on your ESP8266 board should now be blinking. You're ready to start building Wi-Fi-connected projects!</p>
    </>
);


const blogPosts = [
    {
        id: 'arduino-r3-upload',
        title: 'Uploading to Arduino R3',
        subtitle: 'A step-by-step guide to your first sketch.',
        content: arduinoR3Content,
    },
    {
        id: 'esp8266-upload',
        title: 'Uploading to ESP8266',
        subtitle: 'Programming this popular IoT board with the Arduino IDE.',
        content: esp8266Content,
    }
];

const BlogPage: React.FC = () => {
    const [activePostId, setActivePostId] = useState(blogPosts[0].id);
    const activePost = blogPosts.find(p => p.id === activePostId);

    return (
        <div className="w-full max-w-7xl mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-3">The Hardware Lab Blog</h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">In-depth Tutorials and Guides for Makers</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                {/* Sidebar */}
                <aside className="md:w-1/4 lg:w-1/5 shrink-0">
                    <h2 className="text-sm font-bold uppercase text-gray-400 dark:text-gray-500 tracking-wider mb-4 px-2">Articles</h2>
                    <nav className="flex flex-col space-y-2">
                        {blogPosts.map(post => (
                            <button
                                key={post.id}
                                onClick={() => setActivePostId(post.id)}
                                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
                                    activePostId === post.id 
                                    ? 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-200' 
                                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-700/50'
                                }`}
                            >
                                <span className="font-semibold block">{post.title}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{post.subtitle}</span>
                            </button>
                        ))}
                    </nav>
                </aside>
                
                {/* Main Content */}
                <main className="flex-1 min-w-0">
                    {activePost && (
                        <article className="prose prose-lg dark:prose-invert max-w-none">
                            <h1>{activePost.title}</h1>
                            {activePost.content}
                        </article>
                    )}
                </main>
            </div>
        </div>
    );
};

export default BlogPage;