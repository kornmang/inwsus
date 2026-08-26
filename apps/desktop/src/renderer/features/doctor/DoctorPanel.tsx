import type { ReactElement } from 'react';
import type { DoctorReport, UiLocale } from '@inwsus/ipc-contracts';
import { createTranslator } from '../../i18n/index.js';
import { Button, Card, EmptyState, StatusDot, type BadgeTone } from '../../components/ui/index.js';
import { Refresh, Stethoscope } from '../../components/icons/index.js';

interface DoctorPanelProps {
  readonly locale?: UiLocale;
  readonly report: DoctorReport | null;
  readonly onRunDoctor: () => Promise<void>;
}

function statusTone(status: DoctorReport['checks'][number]['status']): BadgeTone {
  if (status === 'pass') return 'success';
  if (status === 'warn') return 'warning';
  return 'danger';
}

export function DoctorPanel({ locale = 'th', report, onRunDoctor }: DoctorPanelProps): ReactElement {
  const t = createTranslator(locale);
  return (
    <section className="panel doctor-panel" aria-label={t('doctor.title')}>
      <div className="doctor-panel__heading">
        <p className="page-subtitle">
          {locale === 'th' ? 'ตรวจสอบความพร้อมของระบบและการเชื่อมต่อทั้งหมด' : 'Verify system health and all required dependencies'}
        </p>
        <Button type="button" variant="secondary" size="sm" icon={<Refresh size={14} />} onClick={() => { void onRunDoctor(); }}>
          {t('doctor.run')}
        </Button>
      </div>
      {report === null ? (
        <EmptyState
          icon={<Stethoscope size={32} />}
          title={t('doctor.noReport')}
          description={locale === 'th' ? 'กด "รัน Doctor" เพื่อเริ่มตรวจสอบระบบ' : 'Run Doctor to check system health and dependencies.'}
        />
      ) : (
        <div className="doctor-list">
          {report.checks.map((check) => (
            <Card
              key={check.id}
              compact
              className={`doctor-check doctor-${check.status}`}
              data-testid={`doctor-check-${check.id}`}
            >
              <div className="doctor-check__row">
                <strong>{check.id}</strong>
                <StatusDot tone={statusTone(check.status)} label={check.status} />
              </div>
              <p className="doctor-check__message">{check.message}</p>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
