import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';

export interface CareTeamMember {
  name: string;
  role: string;
  status: string;
  contact?: string;
  hospital?: string;
  department?: string;
  availableTime?: string;
  notes?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  member: CareTeamMember | null;
  onSave: (member: CareTeamMember) => void;
}

const CareTeamEditSheet = ({ open, onOpenChange, member, onSave }: Props) => {
  const { t } = useLanguage();

  const [form, setForm] = useState({
    name: '',
    role: '',
    contact: '',
    hospital: '',
    department: '',
    availableTime: '',
    notes: '',
  });

  useEffect(() => {
    if (member) {
      setForm({
        name: member.name,
        role: member.role === '神经内科' || member.role === '医生' ? 'doctor' : 'pharmacist',
        contact: member.contact || '',
        hospital: member.hospital || '',
        department: member.department || '',
        availableTime: member.availableTime || '',
        notes: member.notes || '',
      });
    }
  }, [member]);

  const handleSave = () => {
    if (!member) return;
    onSave({
      ...member,
      name: form.name,
      role: form.role === 'doctor' ? '神经内科' : '临床药师',
      contact: form.contact,
      hospital: form.hospital,
      department: form.department,
      availableTime: form.availableTime,
      notes: form.notes,
    });
    onOpenChange(false);
  };

  const fieldClass = "text-sm";
  const labelClass = "text-xs text-gray-500 mb-1";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto rounded-t-2xl">
        <SheetHeader className="text-left mb-4">
          <SheetTitle className="text-base">{t('care.editTeam.title')}</SheetTitle>
          <SheetDescription className="text-xs text-gray-500">
            {member?.name}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4">
          <div>
            <p className={labelClass}>{t('care.editTeam.name')}</p>
            <Input className={fieldClass} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>

          <div>
            <p className={labelClass}>{t('care.editTeam.role')}</p>
            <Select value={form.role} onValueChange={v => setForm(f => ({ ...f, role: v }))}>
              <SelectTrigger className={fieldClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="doctor">{t('care.editTeam.roleDoctor')}</SelectItem>
                <SelectItem value="pharmacist">{t('care.editTeam.rolePharmacist')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className={labelClass}>{t('care.editTeam.contact')}</p>
            <Input className={fieldClass} value={form.contact} onChange={e => setForm(f => ({ ...f, contact: e.target.value }))} placeholder="021-5555-0101" />
          </div>

          <div>
            <p className={labelClass}>{t('care.editTeam.hospital')}</p>
            <Input className={fieldClass} value={form.hospital} onChange={e => setForm(f => ({ ...f, hospital: e.target.value }))} />
          </div>

          <div>
            <p className={labelClass}>{t('care.editTeam.department')}</p>
            <Input className={fieldClass} value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))} />
          </div>

          <div>
            <p className={labelClass}>{t('care.editTeam.availableTime')}</p>
            <Input className={fieldClass} value={form.availableTime} onChange={e => setForm(f => ({ ...f, availableTime: e.target.value }))} placeholder="周一至周五 9:00-17:00" />
          </div>

          <div>
            <p className={labelClass}>{t('care.editTeam.notes')}</p>
            <Textarea className={fieldClass} rows={2} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          </div>

          <button
            onClick={handleSave}
            className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold"
          >
            {t('care.editTeam.save')}
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CareTeamEditSheet;
