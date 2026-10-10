import React, { useState, useRef, useEffect, Component } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { arabic, challenges, isCorrect, doors } from "./math";
import "./style.css";

function Block({ position, scale, color, ...props }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow {...props}>
      <boxGeometry />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
function Tower({ x, z }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 3.5, 0]} castShadow>
        <cylinderGeometry args={[1.6, 1.9, 7, 10]} />
        <meshStandardMaterial color="#e5c7ff" />
      </mesh>
      <mesh position={[0, 8, 0]} castShadow>
        <coneGeometry args={[2.3, 3, 10]} />
        <meshStandardMaterial color="#7c5ce7" />
      </mesh>
      <Block
        position={[0, 4, 1.65]}
        scale={[0.65, 1.2, 0.12]}
        color="#51499b"
      />
      <mesh position={[0, 10, 0]}>
        <sphereGeometry args={[0.23, 12, 12]} />
        <meshStandardMaterial color="#ffd45c" />
      </mesh>
      <Block
        position={[0.6, 9.6, 0]}
        scale={[1.2, 0.65, 0.08]}
        color="#ff8cbb"
      />
    </group>
  );
}
function Door({ index, opened }) {
  const ref = useRef();
  const { x, z, color } = doors[index];
  useFrame((_, dt) => {
    if (ref.current)
      ref.current.rotation.y = THREE.MathUtils.damp(
        ref.current.rotation.y,
        opened ? -Math.PI / 2 : 0,
        4,
        dt,
      );
  });
  return (
    <group position={[x, 0, z]}>
      <Block position={[-1.5, 2, 0]} scale={[0.5, 4, 0.8]} color="#fff1c9" />
      <Block position={[1.5, 2, 0]} scale={[0.5, 4, 0.8]} color="#fff1c9" />
      <mesh position={[0, 4, 0]}>
        <sphereGeometry args={[1.75, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#fff1c9" />
      </mesh>
      <group ref={ref} position={[-1.2, 0, 0.45]}>
        <Block
          position={[1.2, 1.9, 0]}
          scale={[2.4, 3.8, 0.24]}
          color={color}
        />
        <Block
          position={[1.2, 2, 0.15]}
          scale={[1.9, 3, 0.06]}
          color={opened ? "#c5f7df" : color}
        />
        <mesh position={[2, 1.8, 0.25]}>
          <sphereGeometry args={[0.16]} />
          <meshStandardMaterial
            color="#ffe18b"
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
        <mesh position={[1.2, 3, 0.2]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[0.45, 0.45, 0.08]} />
          <meshStandardMaterial
            color="#fff9bd"
            emissive="#ffcc55"
            emissiveIntensity={0.5}
          />
        </mesh>
      </group>
      <mesh position={[0, 0.04, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.6, 40]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
function Student({ player }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    const p = player.current;
    ref.current.position.set(p.x, 0, p.z);
    ref.current.rotation.y = p.angle;
    const wave = p.moving ? Math.sin(clock.elapsedTime * 10) * 0.3 : 0;
    ref.current.children[0].rotation.x = wave;
    ref.current.children[1].rotation.x = -wave;
  });
  return (
    <group ref={ref}>
      <Block
        position={[-0.22, 0.25, 0]}
        scale={[0.26, 0.5, 0.4]}
        color="#775339"
      />
      <Block
        position={[0.22, 0.25, 0]}
        scale={[0.26, 0.5, 0.4]}
        color="#775339"
      />
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.55, 1.45, 12]} />
        <meshStandardMaterial color="#fffdf5" />
      </mesh>
      <mesh position={[0, 1.98, 0]} castShadow>
        <sphereGeometry args={[0.36, 20, 20]} />
        <meshStandardMaterial color="#bc855e" />
      </mesh>
      <mesh position={[0, 2.27, 0]}>
        <cylinderGeometry args={[0.36, 0.36, 0.32, 20]} />
        <meshStandardMaterial color="#fff8e6" />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 2.18 + i * 0.09, 0]}>
          <torusGeometry args={[0.362, 0.018, 6, 24]} />
          <meshStandardMaterial color="#bd9958" />
        </mesh>
      ))}
      <Block
        position={[-0.44, 1.3, 0]}
        scale={[0.2, 0.9, 0.25]}
        color="#fffdf5"
      />
      <Block
        position={[0.44, 1.3, 0]}
        scale={[0.2, 0.9, 0.25]}
        color="#fffdf5"
      />
      <mesh position={[-0.12, 2.03, 0.32]}>
        <sphereGeometry args={[0.04]} />
        <meshStandardMaterial color="#2c2240" />
      </mesh>
      <mesh position={[0.12, 2.03, 0.32]}>
        <sphereGeometry args={[0.04]} />
        <meshStandardMaterial color="#2c2240" />
      </mesh>
    </group>
  );
}
function World({ opened, onNear, paused, movement, won }) {
  const player = useRef({ x: 0, z: 10, angle: Math.PI, moving: false });
  const keys = useRef({});
  const lastNear = useRef(-2);
  useEffect(() => {
    const down = (e) => {
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      )
        e.preventDefault();
      keys.current[e.key.toLowerCase()] = true;
    };
    const up = (e) => (keys.current[e.key.toLowerCase()] = false);
    const reset = () => (keys.current = {});
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", reset);
    };
  }, []);
  useFrame(({ camera }, dt) => {
    const p = player.current,
      k = keys.current;
    let dx =
      (k.d || k.arrowright ? 1 : 0) - (k.a || k.arrowleft ? 1 : 0) + movement.x;
    let dz =
      (k.s || k.arrowdown ? 1 : 0) - (k.w || k.arrowup ? 1 : 0) + movement.z;
    const length = Math.hypot(dx, dz);
    p.moving = !!length && !paused;
    if (p.moving) {
      const speed = Math.min(dt, 0.05) * 5;
      p.x = THREE.MathUtils.clamp(p.x + (dx / length) * speed, -15, 15);
      p.z = THREE.MathUtils.clamp(p.z + (dz / length) * speed, -6.9, 14);
      p.angle = Math.atan2(dx, dz);
    }
    camera.position.lerp(
      new THREE.Vector3(p.x, 9, p.z + 12),
      1 - Math.exp(-4 * dt),
    );
    camera.lookAt(p.x, 1, p.z - 3);
    const near = doors.findIndex(
      (d, i) =>
        !opened.includes(i) && Math.hypot(p.x - d.x, p.z - (d.z + 2)) < 2.2,
    );
    if (near !== lastNear.current) {
      lastNear.current = near;
      onNear(near);
    }
  });
  return (
    <>
      <color attach="background" args={["#b8e4fb"]} />
      <fog attach="fog" args={["#b8e4fb", 38, 90]} />
      <ambientLight intensity={1.5} />
      <directionalLight
        position={[8, 20, 10]}
        intensity={2.5}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[180, 180]} />
        <meshStandardMaterial color="#89cd99" />
      </mesh>
      <Block position={[0, -0.05, 3]} scale={[32, 0.15, 26]} color="#f5deb7" />
      <Block position={[0, 0.02, 4]} scale={[3, 0.06, 20]} color="#fff0d5" />
      {doors.map((d, i) => (
        <group key={i}>
          <Block
            position={[d.x, 0.03, -2]}
            scale={[2.8, 0.05, 12]}
            color="#fff0d5"
          />
          <Door index={i} opened={opened.includes(i)} />
        </group>
      ))}
      <Block position={[0, 2, -11]} scale={[32, 4, 1]} color="#c7b4ed" />
      {[-16, 16].map((x) => (
        <group key={x}>
          <Block position={[x, 1.5, 1]} scale={[1, 3, 25]} color="#c7b4ed" />
          <Tower x={x} z={-11} />
          <Tower x={x} z={13} />
        </group>
      ))}
      {Array.from({ length: 17 }, (_, i) => (
        <Block
          key={i}
          position={[-16 + i * 2, 4.4, -11]}
          scale={[1, 0.8, 1]}
          color="#e5c7ff"
        />
      ))}
      {[-10, -5, 5, 10].map((x) => (
        <group key={x} position={[x, 0, 10]}>
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.2, 0.3, 1.2]} />
            <meshStandardMaterial color="#a47b55" />
          </mesh>
          <mesh position={[0, 1.7, 0]} castShadow>
            <sphereGeometry args={[1.2, 12, 12]} />
            <meshStandardMaterial color="#48b78d" />
          </mesh>
        </group>
      ))}
      <Student player={player} />
      {won && (
        <group position={[0, 0, -5]}>
          <Block position={[0, 0.55, 0]} scale={[2, 1, 1.4]} color="#efb82f" />
          <mesh position={[0, 1.1, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.7, 0.7, 2, 16, 1, false, 0, Math.PI]} />
            <meshStandardMaterial
              color="#ffd75c"
              metalness={0.65}
              roughness={0.3}
            />
          </mesh>
          <Block
            position={[0, 0.7, 0.75]}
            scale={[0.35, 0.5, 0.1]}
            color="#fff0a0"
          />
          <pointLight position={[0, 2, 0]} color="#ffd65c" intensity={8} />
        </group>
      )}
    </>
  );
}
class SceneError extends Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <div className="error">
        تعذّر تشغيل الرسومات الثلاثية الأبعاد. يرجى استخدام متصفح حديث وتفعيل
        تسريع الرسومات، ثم إعادة تحميل الصفحة.
      </div>
    ) : (
      this.props.children
    );
  }
}
function App() {
  const [started, setStarted] = useState(false),
    [opened, setOpened] = useState([]),
    [near, setNear] = useState(-1),
    [feedback, setFeedback] = useState(""),
    [movement, setMovement] = useState({ x: 0, z: 0 }),
    [dismissed, setDismissed] = useState(false),
    [session, setSession] = useState(0);
  const won = opened.length === 5;
  const question = started && near >= 0 && !opened.includes(near) && !won;
  const stop = () => setMovement({ x: 0, z: 0 });
  useEffect(() => {
    setFeedback("");
    stop();
  }, [near]);
  function answer(value) {
    if (isCorrect(challenges[near], value)) {
      setOpened((prev) => [...prev, near]);
      setFeedback("");
    } else
      setFeedback(
        "حاول مرة أخرى! عند الضرب في ١٠ نضيف صفرًا، وفي ١٠٠ نضيف صفرين.",
      );
  }
  function restart() {
    setOpened([]);
    setNear(-1);
    setFeedback("");
    setDismissed(false);
    stop();
    setSession((s) => s + 1);
    setStarted(true);
  }
  return (
    <main>
      <SceneError>
        <Canvas
          key={session}
          shadows
          camera={{ position: [0, 9, 22], fov: 55 }}
        >
          <World
            opened={opened}
            onNear={setNear}
            paused={!started || question || (won && !dismissed)}
            movement={movement}
            won={won}
          />
        </Canvas>
      </SceneError>
      <header>
        <div className="brand">
          <span className="logo">♜</span>
          <div>
            <h1>قلعة مغامرات الرياضيات</h1>
            <p>رحلة أبطال الصف الرابع • سلطنة عُمان</p>
          </div>
        </div>
        <div className="score">
          <span>⭐</span>
          <strong>{arabic(opened.length * 10)}</strong>
          <small>نجمة</small>
        </div>
      </header>
      <aside className="journey">
        <span className="eyebrow">خريطة المغامرة</span>
        <h2>الأبواب السحرية</h2>
        <p>افتح الأبواب الخمسة واكتشف الكنز!</p>
        <div className="door-list">
          {doors.map((d, i) => (
            <div key={i} className={opened.includes(i) ? "done" : ""}>
              <span style={{ background: d.color }}>
                {opened.includes(i) ? "✓" : arabic(i + 1)}
              </span>
              <b>
                الباب {["البنفسجي", "الأزرق", "الذهبي", "الوردي", "الأخضر"][i]}
              </b>
              <small>{opened.includes(i) ? "مفتوح" : "مغلق"}</small>
            </div>
          ))}
        </div>
        <div className="progress">
          <i style={{ width: `${opened.length * 20}%` }} />
        </div>
        <small>{arabic(opened.length)} من ٥ أبواب</small>
      </aside>
      <div className="hint">
        ✦{" "}
        {won
          ? "الكنز الذهبي بانتظارك في وسط القلعة!"
          : "سر نحو الدوائر المضيئة أمام الأبواب"}
      </div>
      <footer>
        <span>
          تحرّك بالأسهم أو <b dir="ltr">W A S D</b>
        </span>
        <button onClick={restart}>ابدأ من جديد ↻</button>
      </footer>
      <div className="touch" aria-label="أزرار الحركة">
        {[
          ["↑", 0, -1, "إلى الأمام"],
          ["←", -1, 0, "إلى اليسار"],
          ["↓", 0, 1, "إلى الخلف"],
          ["→", 1, 0, "إلى اليمين"],
        ].map(([icon, x, z, label]) => (
          <button
            key={label}
            aria-label={label}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setMovement({ x, z });
            }}
            onPointerUp={stop}
            onPointerCancel={stop}
            onLostPointerCapture={stop}
          >
            {icon}
          </button>
        ))}
      </div>
      {!started && (
        <div className="overlay">
          <section className="modal welcome">
            <span className="badge">مغامرة تعليمية ثلاثية الأبعاد</span>
            <div className="hero-icon">🏰</div>
            <h2>أهلًا بك يا بطل!</h2>
            <p>
              خمسة أبواب سحرية، وخمسة تحديات رياضية.
              <br />
              ساعد طالبنا العُماني على الوصول إلى الكنز!
            </p>
            <div className="lesson">
              نتعلّم ضرب الأعداد في <b>١٠</b> و<b>١٠٠</b>
              <br />
              <small>كل إجابة صحيحة تمنحك ١٠ نجوم ⭐</small>
            </div>
            <button className="primary" onClick={() => setStarted(true)}>
              لنبدأ المغامرة ←
            </button>
            <small>استخدم الأسهم أو أزرار الحركة على الشاشة</small>
          </section>
        </div>
      )}
      {question && (
        <div className="overlay">
          <section
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="question-title"
          >
            <span className="badge">تحدي الباب {arabic(near + 1)} من ٥</span>
            <h2 id="question-title">افتح الباب بذكائك! ✨</h2>
            <p>ما ناتج عملية الضرب؟</p>
            <div className="equation" dir="ltr">
              {arabic(challenges[near].number)} ×{" "}
              {arabic(challenges[near].multiplier)} = ؟
            </div>
            <div className="answers">
              {challenges[near].choices.map((value) => (
                <button key={value} onClick={() => answer(value)}>
                  {arabic(value)}
                </button>
              ))}
            </div>
            <p className="feedback" role="status">
              {feedback || "اختر الإجابة الصحيحة لتحصل على ١٠ نجوم"}
            </p>
          </section>
        </div>
      )}
      {won && !dismissed && (
        <div className="overlay">
          <section
            className="modal victory"
            role="dialog"
            aria-modal="true"
            aria-labelledby="victory-title"
          >
            <div className="hero-icon">🏆</div>
            <span className="badge">اكتملت المغامرة!</span>
            <h2 id="victory-title">بطل الرياضيات</h2>
            <p>
              أحسنت! فتحت الأبواب الخمسة
              <br />
              وحصلت على الكنز الذهبي.
            </p>
            <div className="total">⭐ ٥٠ نجمة ⭐</div>
            <button className="primary" onClick={() => setDismissed(true)}>
              استكشف الكنز
            </button>
            <button className="secondary" onClick={restart}>
              العب من جديد
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
createRoot(document.getElementById("root")).render(<App />);
