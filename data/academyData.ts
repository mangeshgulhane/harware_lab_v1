import type { AcademyTopic } from '../types';
import {
  WaterAnalogyAnimation,
  OhmLawTriangleAnimation,
  SeriesCircuitAnimation,
  ParallelCircuitAnimation,
  BreadboardAnimation,
  MultimeterAnimation,
  ResistorColorCodeAnimation,
  PowerLawAnimation,
  ShortCircuitAnimation,
  CapacitorAnimation,
  InductorAnimation,
  DiodeAnimation,
  TransistorSwitchAnimation,
  SensorAnimation,
  AnalogVsDigitalAnimation,
  LogicLevelsAnimation,
  LogicGatesAnimation,
  IcAnd555TimerAnimation,
} from '../components/academy/animations';

export const ACADEMY_TOPICS: AcademyTopic[] = [
  {
    id: 'what-is-electricity',
    title: 'What is Electricity?',
    subTopics: [
      {
        id: 'voltage-current-resistance',
        title: 'Voltage, Current & Resistance',
        content: `
          <p>At the heart of electronics are three fundamental concepts that work together. Understanding them is the key to understanding everything else.</p>
          <ul>
            <li><strong>Voltage (V):</strong> Think of this as electrical "pressure" or the force pushing electricity forward. It's the potential energy difference between two points. It is measured in <strong>Volts (V)</strong>.</li>
            <li><strong>Current (I):</strong> This is the "flow" of electricity. It's the rate at which electric charge moves through a conductor. It is measured in <strong>Amperes (A)</strong>, or "Amps".</li>
            <li><strong>Resistance (R):</strong> This is an obstacle that "resists" or slows down the flow of current. Every component has some resistance. It is measured in <strong>Ohms (Ω)</strong>.</li>
          </ul>
        `,
        AnimationComponent: null,
      },
      {
        id: 'water-analogy',
        title: 'The Water Analogy',
        content: `
          <p>A very popular and effective way to visualize these concepts is to compare an electrical circuit to a system of water pipes.</p>
          <ul>
            <li><strong>Voltage</strong> is like the <strong>water pressure</strong> from a pump. Higher pressure pushes the water with more force.</li>
            <li><strong>Current</strong> is like the <strong>flow rate</strong> of the water. It's how much water is moving through the pipe per second.</li>
            <li><strong>Resistance</strong> is like a <strong>narrow section</strong> in the pipe. It restricts the flow, allowing less water to pass through.</li>
          </ul>
          <p>In the animation, notice how increasing pressure (Voltage) makes the water flow faster (Current). Adding a restriction (Resistance) slows the flow down, even if the pressure stays the same.</p>
        `,
        AnimationComponent: WaterAnalogyAnimation,
      },
    ],
  },
  {
    id: 'your-first-components',
    title: 'Your First Components & Tools',
    subTopics: [
      {
        id: 'breadboard-basics',
        title: 'The Breadboard',
        content: `
          <p>A breadboard is your best friend when prototyping. It's a plastic board with a grid of holes that lets you build and test circuits without any soldering.</p>
          <h3>How it Works</h3>
          <p>The magic of a breadboard is in its internal connections. The holes aren't just random; they are connected in specific patterns:</p>
          <ul>
            <li><strong>Terminal Strips (Rows):</strong> The main area is split by a central channel. On each side, the five holes in each numbered row are electrically connected. For example, pin A1 is connected to B1, C1, D1, and E1. However, row 1 is <strong>not</strong> connected to row 2, and column A is <strong>not</strong> connected to column F across the channel.</li>
            <li><strong>Power Rails (Columns):</strong> The long lines on the top and bottom are power rails. All the holes in the red (+) rail are connected horizontally, and all the holes in the blue (-) rail are connected. This provides a convenient way to supply power and ground to your entire circuit.</li>
          </ul>
          <p>In the animation below, hover over different holes to see which other holes they are connected to.</p>
        `,
        AnimationComponent: BreadboardAnimation,
      },
      {
        id: 'multimeter-basics',
        title: 'The Multimeter',
        content: `
          <p>A multimeter is an essential diagnostic tool that acts as your "eyes" for seeing electricity. It can measure several key properties of a circuit.</p>
          <h3>The Three Key Measurements</h3>
          <ul>
            <li><strong>Measuring Voltage (V):</strong> To measure voltage, you connect the multimeter probes <strong>in parallel</strong> with the component you want to measure. Think of it as measuring the "pressure difference" between two points.</li>
            <li><strong>Measuring Current (A):</strong> This is the tricky one. To measure current, you must <strong>break the circuit</strong> and insert the multimeter <strong>in series</strong>. The current must flow *through* the meter to be measured, just like a water meter.</li>
            <li><strong>Measuring Resistance (Ω):</strong> To measure the resistance of a component, you must first <strong>remove it from the circuit</strong> so it has no power running through it. Then you can connect the probes to each end.</li>
          </ul>
        `,
        AnimationComponent: MultimeterAnimation,
      },
       {
        id: 'basic-components',
        title: 'Basic Components',
        content: `
          <p>Let's meet a few of the most common "actors" you'll use in your electronic projects.</p>
          <h3>Resistors</h3>
          <p>A resistor is a component that limits the flow of current. They are essential for protecting more sensitive components, like LEDs. Their value is measured in Ohms (Ω) and is indicated by a series of colored bands on their body.</p>
          <h3>LEDs (Light Emitting Diodes)</h3>
          <p>An LED is a special type of diode that lights up when current flows through it. Because it's a diode, it has <strong>polarity</strong>—it only works in one direction!
            <ul>
              <li>The <strong>Anode</strong> is the positive (+) side, which is the longer leg.</li>
              <li>The <strong>Cathode</strong> is the negative (-) side, which is the shorter leg.</li>
            </ul>
          If you connect an LED backward, it won't light up (but it usually won't break).
          </p>
          <h3>Switches & Buttons</h3>
          <p>These are the simplest input devices. A push button is a "momentary" switch—it completes the circuit only as long as you are pressing it. When you let go, an internal spring breaks the connection again.</p>
        `,
        AnimationComponent: ResistorColorCodeAnimation,
      },
    ],
  },
  {
    id: 'fundamental-laws',
    title: 'The Fundamental Laws',
    subTopics: [
      {
        id: 'ohms-law',
        title: "Ohm's Law",
        content: `
          <p>The concepts of Voltage, Current, and Resistance are mathematically linked by the most fundamental rule in electronics: <strong>Ohm's Law</strong>.</p>
          <p>The law states:</p>
          <div class="code-block">Voltage = Current × Resistance</div>
          <p>Or simply, <strong>V = I × R</strong>.</p>
          <p>This simple formula is incredibly powerful. If you know any two of the values, you can always calculate the third. This is essential for practical tasks, like figuring out what size resistor you need to protect an LED from burning out.</p>
        `,
        AnimationComponent: OhmLawTriangleAnimation,
      },
      {
        id: 'series-circuits',
        title: 'Series Circuits',
        content: `
          <p>In a series circuit, components are connected end-to-end, creating a single path for the current to flow. Think of it like a single-lane road where all the cars must follow the same path.</p>
          <ul>
            <li>The <strong>current</strong> is the <strong>same</strong> through all components.</li>
            <li>The total <strong>resistance</strong> is the <strong>sum</strong> of all individual resistances (R_total = R1 + R2 + ...).</li>
            <li>The total <strong>voltage</strong> supplied by the source is <strong>split</strong> or "dropped" across each component.</li>
          </ul>
        `,
        AnimationComponent: SeriesCircuitAnimation,
      },
      {
        id: 'parallel-circuits',
        title: 'Parallel Circuits',
        content: `
          <p>In a parallel circuit, components are connected across the same two points, creating multiple paths for the current to flow. Imagine a river splitting into several smaller streams and then rejoining.</p>
          <ul>
            <li>The <strong>voltage</strong> is the <strong>same</strong> across all components.</li>
            <li>The total <strong>current</strong> from the source is the <strong>sum</strong> of the currents flowing through each individual branch.</li>
            <li>The total <strong>resistance</strong> is always less than the smallest individual resistance, because there are more paths for the current to take.</li>
          </ul>
        `,
        AnimationComponent: ParallelCircuitAnimation,
      },
    ],
  },
  {
    id: 'power-and-safety',
    title: 'Power and Safety',
    subTopics: [
      {
        id: 'electrical-power',
        title: 'Electrical Power',
        content: `
          <p>While Voltage is the pressure and Current is the flow, <strong>Power (P)</strong> is the rate at which electrical energy is used to do work, like creating light or heat. It's measured in <strong>Watts (W)</strong>.</p>
          <p>Power is calculated with a formula similar to Ohm's Law:</p>
          <div class="code-block">Power = Voltage × Current</div>
          <p>Or simply, <strong>P = V × I</strong>.</p>
          <p>This is very important for selecting components. For example, a common resistor might be rated for "1/4 Watt". If you put too much power through it (by having too high a voltage or current), it will overheat and burn out!</p>
        `,
        AnimationComponent: PowerLawAnimation,
      },
      {
        id: 'short-circuits',
        title: 'Short Circuits',
        content: `
          <p>A short circuit is a dangerous situation where there is a very low-resistance path from a power source directly to ground. This bypasses the actual "load" of the circuit (like the LED and resistor).</p>
          <p>Remember Ohm's Law (I = V / R)? If the resistance (R) is close to zero, the current (I) will become extremely high—much higher than the wires or power source are designed to handle.</p>
          <p>This massive flow of current can cause:</p>
          <ul>
              <li>Wires to overheat and melt.</li>
              <li>Batteries to get dangerously hot or even explode.</li>
              <li>Power supplies and sensitive electronic components to be permanently damaged.</li>
          </ul>
          <p><strong>Always double-check your wiring to make sure power is never connected directly to ground.</strong></p>
        `,
        AnimationComponent: ShortCircuitAnimation,
      },
      {
        id: 'basic-safety',
        title: 'Basic Safety',
        content: `
          <p>The low-voltage DC circuits you'll build with Arduino and Raspberry Pi are generally safe to touch. You won't get a shock from a 5V pin. However, it's crucial to build good safety habits from the start.</p>
          <ul>
            <li><strong>Never Work on a Powered Circuit:</strong> Always disconnect the USB or power supply before changing wires or components.</li>
            <li><strong>Double-Check Your Connections:</strong> Before plugging in the power, quickly trace your power (+) and ground (-) wires to make sure you don't have a short circuit.</li>
            <li><strong>Capacitor Caution:</strong> Some larger components called capacitors can store an electrical charge even after the power is off. Be careful when handling them.</li>
            <li><strong>Wall Power is Different:</strong> NEVER try to connect your projects directly to a wall outlet. The high-voltage AC power is extremely dangerous and requires completely different knowledge and components to handle safely.</li>
          </ul>
        `,
        AnimationComponent: null,
      },
    ]
  },
  {
    id: 'expanding-your-toolbox',
    title: 'Expanding Your Component Toolbox',
    subTopics: [
      {
        id: 'capacitors',
        title: 'Capacitors: Tiny Batteries',
        content: `
          <p>A capacitor is a component that stores electrical energy in an electric field. You can think of it like a very small, very fast-acting rechargeable battery.</p>
          <p>Its ability to store energy is called <strong>capacitance</strong>, which is measured in <strong>Farads (F)</strong>. A Farad is a very large unit, so you will almost always see capacitors measured in microfarads (µF), nanofarads (nF), or picofarads (pF).</p>
          <h3>Common Uses</h3>
          <ul>
            <li><strong>Decoupling (Filtering):</strong> Capacitors are excellent at smoothing out noisy or fluctuating voltages. They are often placed next to an integrated circuit (IC) to provide a small, stable reservoir of power, filtering out tiny dips in the main power supply.</li>
            <li><strong>Timing:</strong> When combined with a resistor, a capacitor can be used to create a timer. The time it takes for the capacitor to charge or discharge through the resistor can be precisely calculated, which is the basis for many oscillator and timing circuits (like the classic 555 Timer).</li>
          </ul>
          <p>In the animation, watch how the capacitor charges when connected to the battery, and then discharges its stored energy to light the LED.</p>
        `,
        AnimationComponent: CapacitorAnimation,
      },
      {
        id: 'inductors',
        title: 'Inductors: Resisting Change',
        content: `
          <p>An inductor is typically a coil of wire, sometimes wrapped around a magnetic core. It stores energy not in an electric field, but in a <strong>magnetic field</strong> that is created when current flows through it.</p>
          <p>Its primary property is that it <strong>resists changes in current</strong>. When you try to start or stop the flow of current through an inductor, it pushes back. This property is called <strong>inductance</strong> and is measured in <strong>Henrys (H)</strong>.</p>
          <h3>Common Uses</h3>
          <ul>
            <li><strong>Filtering:</strong> Just as capacitors resist changes in voltage, inductors resist changes in current. This makes them very useful in power supplies and signal filters to smooth out the flow of current.</li>
            <li><strong>Energy Conversion:</strong> Inductors are fundamental to "switching" power supplies, such as buck and boost converters, which efficiently change one DC voltage level to another.</li>
          </ul>
          <p>Watch the animation to see how the inductor causes the current to ramp up slowly, making the LED fade in instead of turning on instantly.</p>
        `,
        AnimationComponent: InductorAnimation,
      },
       {
        id: 'diodes',
        title: 'Diodes: One-Way Streets',
        content: `
          <p>A diode is one of the simplest semiconductor components. Its job is to act as a one-way valve for electricity. It allows current to flow freely in one direction but blocks it from flowing in the opposite direction.</p>
          <ul>
            <li>The "arrow" part of the symbol is the <strong>Anode (+)</strong>, and the "line" is the <strong>Cathode (-)</strong>. Current can flow from the Anode to the Cathode.</li>
            <li><strong>Forward Bias:</strong> When voltage is applied so that current flows in the correct direction (Anode to Cathode), the diode allows it to pass (with a small voltage drop).</li>
            <li><strong>Reverse Bias:</strong> When voltage is applied in the opposite direction, the diode blocks the flow of current.</li>
          </ul>
          <p>This property is extremely useful for protecting circuits from being damaged if a battery or power supply is accidentally connected backward.</p>
        `,
        AnimationComponent: DiodeAnimation,
      },
       {
        id: 'transistors',
        title: 'Transistors: The Electronic Switch',
        content: `
          <p>The transistor is arguably the most important invention of the 20th century. It is the fundamental building block of all modern electronics, from microchips to computers. At its core, a transistor can be understood as an <strong>electronically controlled switch</strong> or an amplifier.</p>
          <p>The most common type to start with is the Bipolar Junction Transistor (BJT), which has three pins:</p>
          <ul>
            <li><strong>Base (B):</strong> The "control" pin.</li>
            <li><strong>Collector (C):</strong> The "input" pin for the main current.</li>
            <li><strong>Emitter (E):</strong> The "output" pin for the main current.</li>
          </ul>
          <h3>How it Works as a Switch</h3>
          <p>The main principle is simple: <strong>a tiny current flowing from the Base to the Emitter allows a much larger current to flow from the Collector to the Emitter.</strong></p>
          <p>In the animation, closing the small switch allows a small control current to flow to the Base. This "opens the gate" of the transistor, completing the main circuit and allowing the powerful motor to run. When the control switch is opened, the Base current stops, the "gate" closes, and the motor stops.</p>
        `,
        AnimationComponent: TransistorSwitchAnimation,
      },
      {
        id: 'simple-sensors',
        title: 'Simple Analog Sensors',
        content: `
          <p>Many simple sensors are just special types of resistors whose resistance changes in response to the environment. Two common examples are:</p>
          <ul>
            <li><strong>Photoresistor (LDR):</strong> A Light-Dependent Resistor. Its resistance is very high in the dark but drops to a low value in bright light.</li>
            <li><strong>Thermistor:</strong> A thermal resistor. Its resistance changes predictably with temperature.</li>
          </ul>
          <h3>The Voltage Divider</h3>
          <p>A microcontroller can't directly measure resistance. It can only measure voltage. So how do we use these sensors? We use them in a circuit called a <strong>voltage divider</strong>.</p>
          <p>A voltage divider consists of two resistors in series. By combining our sensor (a variable resistor) with a fixed resistor, we can create a circuit where the voltage at the point between them changes as the sensor's resistance changes. This changing voltage can be read by an analog input pin on a microcontroller!</p>
          <p>Use the slider in the animation to change the "Light Level". As the light increases, the photoresistor's resistance drops, and the output voltage rises.</p>
        `,
        AnimationComponent: SensorAnimation,
      }
    ]
  },
  {
    id: 'digital-electronics',
    title: 'Introduction to Digital Electronics',
    subTopics: [
      {
        id: 'analog-vs-digital',
        title: 'Analog vs. Digital Signals',
        content: `
          <p>The world around us is analog. Sound, light, and temperature are all continuous signals that can have an infinite number of values. A sound wave, for example, is a smooth, flowing curve.</p>
          <p>Computers, however, don't work that way. They work with <strong>digital signals</strong>. A digital signal is discrete, meaning it can only have a specific, limited number of values. In most electronics, there are only two values: ON or OFF.</p>
          <p>To process an analog signal, a computer must first convert it into a digital signal by measuring (or "sampling") it at regular intervals and rounding the value to the nearest level it understands. This process is what allows a microphone's analog signal to be turned into a digital audio file.</p>
        `,
        AnimationComponent: AnalogVsDigitalAnimation,
      },
      {
        id: 'binary-logic-levels',
        title: 'The Language of Computers',
        content: `
          <p>Since digital signals have only two states, they are perfectly represented by the <strong>binary</strong> number system. Unlike our familiar base-10 system (with digits 0-9), binary is a base-2 system that only uses two digits: <strong>0</strong> and <strong>1</strong>.</p>
          <p>In a circuit, these binary digits are represented by voltage levels:</p>
          <ul>
            <li><strong>HIGH / 1:</strong> Represents the presence of a voltage, typically the main voltage of the system (e.g., +5V or +3.3V). This is the "ON" state.</li>
            <li><strong>LOW / 0:</strong> Represents the absence of a voltage, typically a connection to Ground (0V). This is the "OFF" state.</li>
          </ul>
          <p>Everything a computer does, from complex calculations to displaying images, is ultimately broken down into operations on these simple HIGH and LOW signals.</p>
        `,
        AnimationComponent: LogicLevelsAnimation,
      },
      {
        id: 'logic-gates',
        title: 'Logic Gates',
        content: `
          <p>Logic gates are the fundamental building blocks of all digital circuits, including the processor in your computer. Each gate is a simple electronic circuit that performs a basic logical operation on one or more binary inputs to produce a single binary output.</p>
          <p>The behavior of each gate is defined by its <strong>truth table</strong>, which shows the output for every possible combination of inputs.</p>
          <h3>The Basic Gates</h3>
          <ul>
            <li><strong>NOT Gate (Inverter):</strong> The simplest gate. It has one input and one output. The output is simply the opposite of the input. If the input is 1, the output is 0.</li>
            <li><strong>AND Gate:</strong> Has two inputs. The output is 1 <strong>only if</strong> Input A AND Input B are both 1.</li>
            <li><strong>OR Gate:</strong> Has two inputs. The output is 1 <strong>if</strong> Input A OR Input B (or both) are 1.</li>
          </ul>
          <p>By combining these simple gates in vast numbers, we can build circuits that perform complex tasks like addition, subtraction, and data storage. Use the interactive animation below to test out the gates yourself!</p>
        `,
        AnimationComponent: LogicGatesAnimation,
      },
      {
        id: 'integrated-circuits',
        title: 'Integrated Circuits (ICs)',
        content: `
          <p>An Integrated Circuit, also known as an IC or "chip," is a miniature electronic circuit consisting of thousands, millions, or even billions of transistors, resistors, and capacitors fabricated onto a single, tiny piece of semiconductor material (usually silicon).</p>
          <p>ICs are what made modern electronics possible. Instead of building a complex circuit from thousands of individual components, we can use a single chip that has all of that functionality pre-built inside. They come in a standard package with pins that allow us to connect to the internal circuit.</p>
          <h3>The 555 Timer IC</h3>
          <p>A classic and beloved example is the <strong>555 Timer</strong>. It's a simple but incredibly versatile IC used for creating timing delays and oscillations. One of its most common uses is in "astable mode," where it acts as an oscillator, producing a continuous stream of HIGH and LOW pulses at a predictable frequency. This makes it perfect for tasks like blinking an LED, creating simple sounds, or providing a clock signal for other digital circuits.</p>
        `,
        AnimationComponent: IcAnd555TimerAnimation,
      }
    ]
  },
  {
    id: 'microcontrollers',
    title: 'Microcontrollers - Giving Your Circuits a Brain',
    subTopics: [
      {
        id: 'what-is-a-microcontroller',
        title: 'What is a Microcontroller?',
        content: `
          <p>A microcontroller (often abbreviated as MCU) is a small, programmable computer on a single integrated circuit (IC). Think of it as the 'brain' of an electronic device. Unlike the powerful processor in your laptop, which is designed for general-purpose tasks, a microcontroller is designed for a specific, dedicated task: reading inputs from sensors and switches, and controlling outputs like lights, motors, and displays. It's the silent hero inside your TV remote, your microwave, and your digital watch.</p>
        `,
        AnimationComponent: IcAnd555TimerAnimation,
      },
      {
        id: 'arduino-environment',
        title: 'The Arduino Environment',
        content: `
          <h3>The Hardware: Arduino Uno</h3>
          <p>The Arduino Uno is one of the most popular microcontroller boards for beginners. It includes the main microcontroller chip plus all the supporting circuitry to make it easy to use:</p>
          <ul>
            <li><strong>USB Port:</strong> For uploading code and powering the board.</li>
            <li><strong>Power Jack:</strong> For an external power supply.</li>
            <li><strong>Digital & Analog Pins:</strong> These are the connection points where you will wire up your components.</li>
          </ul>
          <h3>The Software: Arduino IDE</h3>
          <p>The Arduino IDE (Integrated Development Environment) is a free application where you write your code. Code for Arduino is called a "sketch." The IDE allows you to write your sketch, check it for errors (compile), and upload it directly to the board through the USB cable.</p>
        `,
        AnimationComponent: null,
      },
      {
        id: 'fundamental-programming',
        title: 'Fundamental Programming for Hardware',
        content: `
          <p>Arduino sketches have a simple, mandatory structure with two main functions:</p>
          <ul>
            <li><div class="code-block" style="display: inline;">void setup() { ... }</div>: This function runs once, right when the Arduino first powers on or is reset. You use it for initialization tasks, like telling the board which pins will be inputs and which will be outputs.</li>
            <li><div class="code-block" style="display: inline;">void loop() { ... }</div>: After <code>setup()</code> is finished, this function runs over and over again, forever. This is where you put the main logic of your program that you want to happen continuously.</li>
          </ul>
          <h3>Key Functions</h3>
          <ul>
            <li><strong>Digital I/O:</strong> Use <div class="code-block" style="display: inline;">pinMode(pin, OUTPUT)</div> in setup, then <div class="code-block" style="display: inline;">digitalWrite(pin, HIGH)</div> to turn something on. Use <div class="code-block" style="display: inline;">pinMode(pin, INPUT)</div> and <div class="code-block" style="display: inline;">digitalRead(pin)</div> to check a button's state.</li>
            <li><strong>Analog Input:</strong> Use <div class="code-block" style="display: inline;">analogRead(pin)</div> on one of the 'A' pins to get a value from 0 to 1023, representing a voltage from 0V to 5V.</li>
            <li><strong>Analog Output (PWM):</strong> Use <div class="code-block" style="display: inline;">analogWrite(pin, value)</div> on a PWM pin (~) to output a simulated analog signal. The value can be from 0 (off) to 255 (fully on). This is perfect for fading LEDs.</li>
            <li><strong>Serial Monitor:</strong> <div class="code-block" style="display: inline;">Serial.begin(9600)</div> in setup, then <div class="code-block" style="display: inline;">Serial.println(value)</div> in the loop to print data back to your computer. This is an essential tool for debugging!</li>
          </ul>
        `,
        AnimationComponent: LogicLevelsAnimation,
      },
      {
        id: 'first-mcu-projects',
        title: 'Your First Microcontroller Projects',
        content: `
          <p>The best way to learn is by doing. Here are the three classic beginner projects that teach you the core concepts:</p>
          <ul>
            <li><strong>Blink:</strong> The "Hello, World!" of hardware. This teaches you <code>pinMode()</code>, <code>digitalWrite()</code>, and <code>delay()</code> to make the built-in LED blink.</li>
            <li><strong>Button-Controlled LED:</strong> This project introduces inputs. You'll learn to use <code>digitalRead()</code> in an <code>if/else</code> statement to turn an LED on only when a button is pressed.</li>
            <li><strong>Reading a Potentiometer:</strong> This is your first analog project. You'll use <code>analogRead()</code> to get a value from a potentiometer (a variable resistor) and use that value to control something, like the blink rate of an LED or the brightness of an LED using <code>analogWrite()</code>.</li>
          </ul>
        `,
        AnimationComponent: SensorAnimation,
      },
    ]
  },
  {
    id: 'next-steps',
    title: 'Next Steps and Specializations',
    subTopics: [
       {
        id: 'comm-protocols',
        title: 'Communication Protocols',
        content: `
          <p>As your projects get more complex, you'll use components that need to exchange more data than just a simple HIGH or LOW signal. These components use standardized communication protocols, which are like languages that electronic devices use to talk to each other.</p>
          <ul>
            <li><strong>UART (Serial):</strong> The simplest protocol. It uses two wires, TX (Transmit) and RX (Receive), to send data one bit at a time. It's great for communication between two devices, like an Arduino and a computer or a GPS module.</li>
            <li><strong>I2C (Inter-Integrated Circuit):</strong> A clever protocol that uses only two wires (SDA for data and SCL for clock) to communicate with multiple devices on the same "bus." Each device has a unique address, so the microcontroller can talk to them individually.</li>
            <li><strong>SPI (Serial Peripheral Interface):</strong> A faster, more complex protocol that uses four wires (MOSI, MISO, SCLK, and CS). It's often used for components that need to transfer a lot of data quickly, like SD card modules and some types of displays.</li>
          </ul>
        `,
        AnimationComponent: null,
      },
      {
        id: 'advanced-platforms',
        title: 'More Advanced Platforms',
        content: `
          <p>Once you're comfortable with Arduino, you might want more processing power or features like Wi-Fi, Bluetooth, or the ability to run a full operating system.</p>
          <ul>
            <li><strong>Raspberry Pi:</strong> Unlike an Arduino, a Raspberry Pi is a full-fledged single-board computer (SBC). It runs a version of Linux and can be programmed in languages like Python. It's not as good at real-time control as an Arduino, but it's perfect for projects that require networking, video processing, or running complex software.</li>
            <li><strong>ESP32 / ESP8266:</strong> These are low-cost microcontrollers with built-in Wi-Fi and Bluetooth. They are a fantastic next step from Arduino for building Internet of Things (IoT) projects. You can even program them using the Arduino IDE!</li>
          </ul>
        `,
        AnimationComponent: null,
      },
      {
        id: 'motors',
        title: 'Motors',
        content: `
          <p>Making things move is one of the most exciting parts of electronics. There are several types of motors, each with its own purpose and control method.</p>
          <ul>
            <li><strong>DC Motors:</strong> The simplest type. Apply power and they spin. You can reverse the polarity to make them spin backward. Their speed is controlled by the voltage, often using PWM and a transistor or motor driver IC.</li>
            <li><strong>Servo Motors:</strong> These motors don't spin continuously. You can tell them to move to a specific angle (e.g., 90 degrees) and hold that position. They are perfect for things like robot arms or steering.</li>
            <li><strong>Stepper Motors:</strong> These motors move in precise, discrete "steps." This allows for very accurate position control, making them ideal for 3D printers and CNC machines.</li>
          </ul>
          <p><strong>Important:</strong> Motors often require more current than a microcontroller pin can provide. You will almost always need a separate power supply and a driver circuit (using transistors or a dedicated motor driver IC like the L298N) to control them safely.</p>
        `,
        AnimationComponent: TransistorSwitchAnimation,
      },
       {
        id: 'power-electronics-advanced',
        title: 'Power Electronics',
        content: `
          <p>As you move beyond simple LED projects, managing power becomes critical. Power electronics is the field of converting and controlling electrical power efficiently.</p>
          <ul>
            <li><strong>Voltage Regulators:</strong> These are components (often ICs) that take a variable or higher input voltage and produce a stable, constant lower output voltage. A 7805 regulator, for example, will take any input from ~7V to 25V and output a steady 5V.</li>
            <li><strong>Power Supplies:</strong> Understanding the difference between AC and DC, and how wall adapters (which convert AC to DC) work.</li>
            <li><strong>Safety:</strong> Learning how to safely work with circuits that use more power, including the importance of fuses, proper wire gauges, and heat sinks to dissipate waste heat from components like regulators and motor drivers.</li>
          </ul>
        `,
        AnimationComponent: PowerLawAnimation,
      },
      {
        id: 'soldering',
        title: 'Soldering',
        content: `
          <p>The breadboard is perfect for prototyping, but it's not a permanent solution. For a final, durable project, you'll need to learn how to solder.</p>
          <p>Soldering is the process of joining electronic components together by melting a special metal alloy called solder. It creates a strong, permanent, and electrically conductive connection. It's a fundamental skill for any electronics hobbyist. With a good soldering iron, some solder, and a bit of practice, you can move your breadboard creations to a permanent "perfboard" or a custom-designed Printed Circuit Board (PCB).</p>
        `,
        AnimationComponent: null,
      }
    ]
  }
];