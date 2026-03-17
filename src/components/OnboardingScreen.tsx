import { useState, useEffect } from 'react';
import type { Program } from '../types/program.ts';
import type { Equipment } from '../types/onboarding.ts';
import { useOnboarding } from '../hooks/useOnboarding.ts';

interface Props {
  onComplete: (program: Program) => void;
  onSkip: () => void;
  userId: string | null;
}

function StepDots({ current, total }: { current: number; total: number }) {
  return (
    <div className="onboarding-dots">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`onboarding-dot ${i === current ? 'active' : ''} ${i < current ? 'done' : ''}`}
        />
      ))}
    </div>
  );
}

function OptionChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`onboarding-chip ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      {selected && <span className="onboarding-chip-check">&#10003;</span>}
      {label}
    </button>
  );
}

const WEEKDAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function ReviewScreen({
  program,
  onAccept,
  onRegenerate,
  onUseDefault,
}: {
  program: Program;
  onAccept: () => void;
  onRegenerate: () => void;
  onUseDefault: () => void;
}) {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  return (
    <div className="onboarding-screen fade-in">
      <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 'var(--space-2)' }}>
        Your Program
      </h2>
      <p style={{ color: 'var(--text-body)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-5)' }}>
        {program.name}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        {program.schedule.map(({ dayKey, weekday }) => {
          const day = program.days[dayKey];
          if (!day) return null;
          const isExpanded = expandedDay === dayKey;

          return (
            <div key={dayKey} className="onboarding-review-card">
              <button
                className="onboarding-review-header"
                onClick={() => setExpandedDay(isExpanded ? null : dayKey)}
              >
                <div
                  className="onboarding-review-bar"
                  style={{ background: day.color }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 'var(--text-md)' }}>
                    {WEEKDAY_NAMES[weekday]} — {day.subtitle}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: 2 }}>
                    {day.sections.length} sections, {day.sections.reduce((n, s) => n + s.exercises.length, 0)} exercises
                  </div>
                </div>
                <span className={`session-map-chevron ${isExpanded ? 'open' : ''}`}>
                  &#8250;
                </span>
              </button>

              {isExpanded && (
                <div className="onboarding-review-body fade-in">
                  {day.sections.map((section, si) => (
                    <div key={si} style={{ marginBottom: 'var(--space-3)' }}>
                      <div className="sec-label" style={{ color: day.color, marginBottom: 'var(--space-1)' }}>
                        {section.label}
                      </div>
                      <div className="sec-meta" style={{ marginBottom: 'var(--space-2)' }}>
                        {section.type === 'superset' ? 'Superset' : 'Straight'} &middot; {section.rounds} rounds &middot; {section.rest}s rest
                      </div>
                      {section.exercises.map((ex, ei) => (
                        <div key={ei} style={{
                          padding: 'var(--space-2) var(--space-3)',
                          background: 'var(--bg-subtle)',
                          borderRadius: 'var(--radius-md)',
                          marginBottom: 'var(--space-1)',
                        }}>
                          <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{ex.name}</div>
                          <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-xs)' }}>
                            {ex.detail} &middot; {ex.target}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className="btn-primary" onClick={onAccept}
        style={{ background: 'linear-gradient(135deg, #FF6B35, #4ECDC4)', marginBottom: 'var(--space-3)' }}>
        Start Training
      </button>
      <button className="btn-ghost" onClick={onRegenerate}
        style={{ width: '100%', marginBottom: 'var(--space-3)' }}>
        Start Over
      </button>
      <button onClick={onUseDefault}
        style={{
          background: 'none', border: 'none', color: 'var(--text-faint)',
          fontSize: 'var(--text-sm)', cursor: 'pointer', width: '100%',
          padding: 'var(--space-2)',
        }}>
        Use default program instead
      </button>
    </div>
  );
}

const LOADING_MESSAGES = [
  'Building your program...',
  'Selecting exercises...',
  'Setting up progressions...',
  'Arranging your schedule...',
  'Almost there...',
];

function LoadingScreen() {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex(i => (i + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="onboarding-screen onboarding-loading fade-in">
      <div className="onboarding-spinner" />
      <p style={{
        fontSize: 'var(--text-md)', fontWeight: 600, color: 'var(--text-muted)',
        marginTop: 'var(--space-5)', transition: 'opacity .3s',
      }}>
        {LOADING_MESSAGES[msgIndex]}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', width: '100%', marginTop: 'var(--space-6)' }}>
        {[1, 0.7, 0.4].map((opacity, i) => (
          <div key={i} className="coaching-skeleton-line" style={{ width: `${100 - i * 15}%`, height: 48, borderRadius: 'var(--radius-lg)', opacity }} />
        ))}
      </div>
    </div>
  );
}

export function OnboardingScreen({ onComplete, onSkip, userId }: Props) {
  const ob = useOnboarding(onComplete, onSkip, userId);

  if (ob.phase === 'generating') {
    return <LoadingScreen />;
  }

  if (ob.phase === 'review' && ob.generatedProgram) {
    return (
      <ReviewScreen
        program={ob.generatedProgram}
        onAccept={ob.accept}
        onRegenerate={ob.regenerate}
        onUseDefault={ob.useDefault}
      />
    );
  }

  if (ob.phase === 'error') {
    return (
      <div className="onboarding-screen fade-in">
        <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 800, marginBottom: 'var(--space-3)' }}>
          Something went wrong
        </h2>
        <p style={{ color: 'var(--text-body)', fontSize: 'var(--text-base)', marginBottom: 'var(--space-5)' }}>
          {ob.error}
        </p>
        <button className="btn-primary" onClick={ob.regenerate}
          style={{ background: 'linear-gradient(135deg, #FF6B35, #4ECDC4)', marginBottom: 'var(--space-3)' }}>
          Try Again
        </button>
        <button onClick={ob.useDefault}
          style={{
            background: 'none', border: 'none', color: 'var(--text-faint)',
            fontSize: 'var(--text-sm)', cursor: 'pointer', width: '100%',
            padding: 'var(--space-2)',
          }}>
          Use default program instead
        </button>
      </div>
    );
  }

  // Questionnaire
  const equipmentOptions: { value: Equipment; label: string }[] = [
    { value: 'pullup_bar', label: 'Pull-up bar' },
    { value: 'rings', label: 'Rings' },
    { value: 'parallettes', label: 'Parallettes' },
    { value: 'dip_station', label: 'Dip station' },
    { value: 'resistance_bands', label: 'Bands' },
    { value: 'none', label: 'None' },
  ];

  const toggleEquipment = (eq: Equipment) => {
    const current = ob.answers.equipment || [];
    if (eq === 'none') {
      ob.setEquipment(['none']);
      return;
    }
    const filtered = current.filter(e => e !== 'none');
    if (filtered.includes(eq)) {
      ob.setEquipment(filtered.filter(e => e !== eq));
    } else {
      ob.setEquipment([...filtered, eq]);
    }
  };

  return (
    <div className="onboarding-screen fade-in">
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{
          fontSize: 'var(--text-3xl)', fontWeight: 900, letterSpacing: -1,
          background: 'linear-gradient(135deg,#FF6B35,#4ECDC4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 'var(--space-1)',
        }}>
          PARK IRON
        </h1>
        <p style={{ color: 'var(--text-body)', fontSize: 'var(--text-base)' }}>
          Let&apos;s build your program
        </p>
      </div>

      <StepDots current={ob.step} total={5} />

      <div className="onboarding-question fade-in" key={ob.step}>
        {ob.step === 0 && (
          <>
            <h2 className="onboarding-title">How long have you been training?</h2>
            <div className="onboarding-options">
              {([
                ['beginner', 'Just starting out'],
                ['6-12mo', '6-12 months'],
                ['1-3yr', '1-3 years'],
                ['3yr+', '3+ years'],
              ] as const).map(([value, label]) => (
                <OptionChip
                  key={value}
                  label={label}
                  selected={ob.answers.experience === value}
                  onClick={() => ob.setExperience(value)}
                />
              ))}
            </div>
          </>
        )}

        {ob.step === 1 && (
          <>
            <h2 className="onboarding-title">What do you have access to?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              Select all that apply
            </p>
            <div className="onboarding-options">
              {equipmentOptions.map(({ value, label }) => (
                <OptionChip
                  key={value}
                  label={label}
                  selected={(ob.answers.equipment || []).includes(value)}
                  onClick={() => toggleEquipment(value)}
                />
              ))}
            </div>
            <button
              className="btn-primary"
              style={{
                background: (ob.answers.equipment?.length || 0) > 0
                  ? 'linear-gradient(135deg, #FF6B35, #4ECDC4)'
                  : 'var(--bg-surface)',
                marginTop: 'var(--space-4)',
                opacity: (ob.answers.equipment?.length || 0) > 0 ? 1 : 0.4,
              }}
              disabled={!ob.answers.equipment?.length}
              onClick={ob.advanceFromEquipment}
            >
              Continue
            </button>
          </>
        )}

        {ob.step === 2 && (
          <>
            <h2 className="onboarding-title">What&apos;s your main goal?</h2>
            <div className="onboarding-options">
              {([
                ['muscle', 'Build muscle'],
                ['strength', 'Get stronger'],
                ['lean', 'Get lean'],
                ['fitness', 'All-around fitness'],
              ] as const).map(([value, label]) => (
                <OptionChip
                  key={value}
                  label={label}
                  selected={ob.answers.goal === value}
                  onClick={() => ob.setGoal(value)}
                />
              ))}
            </div>
          </>
        )}

        {ob.step === 3 && (
          <>
            <h2 className="onboarding-title">How many days can you train?</h2>
            <div className="onboarding-options">
              {([2, 3, 4, 5] as const).map(v => (
                <OptionChip
                  key={v}
                  label={`${v} days / week`}
                  selected={ob.answers.days === v}
                  onClick={() => ob.setDays(v)}
                />
              ))}
            </div>
          </>
        )}

        {ob.step === 4 && (
          <>
            <h2 className="onboarding-title">How long per session?</h2>
            <div className="onboarding-options">
              {([
                ['20-30', '20-30 min'],
                ['30-45', '30-45 min'],
                ['45-60', '45-60 min'],
                ['60+', '60+ min'],
              ] as const).map(([value, label]) => (
                <OptionChip
                  key={value}
                  label={label}
                  selected={ob.answers.sessionLength === value}
                  onClick={() => ob.setSessionLength(value)}
                />
              ))}
            </div>
            {ob.answers.sessionLength && (
              <button
                className="btn-primary"
                style={{
                  background: 'linear-gradient(135deg, #FF6B35, #4ECDC4)',
                  marginTop: 'var(--space-4)',
                }}
                onClick={ob.generate}
              >
                Generate My Program
              </button>
            )}
          </>
        )}
      </div>

      {ob.step > 0 && (
        <button
          onClick={() => ob.goToStep((ob.step - 1) as 0 | 1 | 2 | 3 | 4)}
          style={{
            background: 'none', border: 'none', color: 'var(--text-secondary)',
            fontSize: 'var(--text-sm)', cursor: 'pointer', marginTop: 'var(--space-3)',
            fontWeight: 600,
          }}
        >
          &#8249; Back
        </button>
      )}

      <button onClick={ob.useDefault}
        style={{
          background: 'none', border: 'none', color: 'var(--text-faint)',
          fontSize: 'var(--text-sm)', cursor: 'pointer', marginTop: 'var(--space-5)',
          padding: 'var(--space-2)',
        }}>
        Skip — use default program
      </button>
    </div>
  );
}
