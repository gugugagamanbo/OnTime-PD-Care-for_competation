import React, { createContext, useContext, useEffect, useState } from 'react';

type Lang = 'zh' | 'en';

const translations = {
  // Tab names
  'tab.medication': { zh: '用药', en: 'Medication' },
  'tab.careCircle': { zh: '照护圈', en: 'Care Circle' },
  'tab.scan': { zh: '扫码录入', en: 'Scan Rx' },
  'tab.profile': { zh: '我的', en: 'Profile' },

  // Medication tab
  'med.title': { zh: '今日用药', en: "Today's Medication" },
  'med.subtitle': { zh: '按时服药，帮助医生了解真实波动', en: 'Take meds on time to help your doctor track fluctuations' },
  'med.nextDose': { zh: '下一次服药', en: 'Next Dose' },
  'med.dose': { zh: '1片', en: '1 tablet' },
  'med.minutesLeft': { zh: '还有32分钟', en: '32 min left' },
  'med.todayProgress': { zh: '已完成 3/5 次', en: 'Completed 3/5 doses' },
  'med.timeline': { zh: '今日用药时间轴', en: "Today's Medication Timeline" },
  'med.taken': { zh: '已服用', en: 'Taken' },
  'med.late': { zh: '延迟', en: 'Late' },
  'med.pending': { zh: '待服用', en: 'Pending' },
  'med.missed': { zh: '未服用', en: 'Missed' },
  'med.markTaken': { zh: '已服用', en: 'Taken' },
  'med.remindLater': { zh: '稍后提醒', en: 'Remind Later' },
  'med.markMissed': { zh: '未服用', en: 'Missed' },
  'med.remindToast': { zh: '将在15分钟后再次提醒', en: 'Will remind again in 15 minutes' },
  'med.weekTrend': { zh: '本周用药趋势', en: 'This Week Trends' },
  'med.onTimeRate': { zh: '按时服药率', en: 'On-time Rate' },
  'med.missedCount': { zh: '漏服', en: 'Missed' },
  'med.avgDelay': { zh: '平均延迟', en: 'Avg Delay' },
  'med.stock': { zh: '药物库存', en: 'Medication Stock' },
  'med.stockDays': { zh: '预计还剩 5 天', en: 'Est. 5 days remaining' },
  'med.notifyFamily': { zh: '提醒家属补药', en: 'Notify Family to Refill' },
  'med.beforeMeal': { zh: '餐前30分钟', en: '30 min before meal' },
  'med.afterMeal': { zh: '餐后', en: 'After meal' },
  'med.beforeSleep': { zh: '睡前', en: 'Before bed' },

  // Care Circle tab
  'care.title': { zh: '照护圈', en: 'Care Circle' },
  'care.subtitle': { zh: '把关键症状同步给家属和医生', en: 'Sync key symptoms with family and doctors' },
  'care.team': { zh: '照护团队', en: 'Care Team' },
  'care.quickLog': { zh: '快速记录症状', en: 'Quick Symptom Log' },
  'care.severity': { zh: '严重程度', en: 'Severity' },
  'care.mild': { zh: '轻', en: 'Mild' },
  'care.moderate': { zh: '中', en: 'Moderate' },
  'care.severe': { zh: '重', en: 'Severe' },
  'care.notePlaceholder': { zh: '补充一句情况，例如：下午药效过去后明显僵硬', en: 'Add a note, e.g.: stiffness worsens after afternoon dose wears off' },
  'care.syncFamily': { zh: '同步给家属', en: 'Sync to Family' },
  'care.syncDoctor': { zh: '同步给医生', en: 'Sync to Doctor' },
  'care.saveSync': { zh: '保存并同步', en: 'Save & Sync' },
  'care.recentLogs': { zh: '最近记录', en: 'Recent Logs' },
  'care.doctorSummary': { zh: '生成给医生的摘要', en: 'Doctor Summary' },
  'care.doctorSummaryText': { zh: '过去7天内，患者共记录5次下午僵硬，主要发生在14:00-16:00；同期有3次服药延迟记录。建议医生评估是否存在 wearing-off 可能。', en: 'In the past 7 days, patient recorded 5 afternoon stiffness episodes, mainly 14:00-16:00; 3 delayed doses in the same period. Suggest evaluating possible wearing-off.' },
  'care.sendToDoctor': { zh: '发送给医生', en: 'Send to Doctor' },
  'care.copySummary': { zh: '复制摘要', en: 'Copy Summary' },
  'care.sent': { zh: '已发送，等待医生查看', en: 'Sent, awaiting doctor review' },
  'care.familyAlerts': { zh: '家属会收到的提醒', en: 'Family Alert Rules' },
  'care.caregiverStatus': { zh: '照护者状态', en: 'Caregiver Status' },
  'care.stressQuestion': { zh: '最近照护压力是否增加？', en: 'Has caregiving stress increased recently?' },
  'care.fallQuestion': { zh: '是否经常担心患者跌倒？', en: 'Do you often worry about patient falls?' },
  'care.sleepQuestion': { zh: '是否睡眠不足？', en: 'Are you sleep-deprived?' },
  'care.visitQuestion': { zh: '是否需要护士或医生回访？', en: 'Do you need a nurse/doctor follow-up?' },
  'care.stable': { zh: '本周状态稳定', en: 'Stable This Week' },
  'care.needSupport': { zh: '需要支持', en: 'Need Support' },
  'care.supportSent': { zh: '已将照护者支持需求加入周报', en: 'Caregiver support request added to weekly report' },

  // Symptom names
  'symptom.tremor': { zh: '震颤', en: 'Tremor' },
  'symptom.rigidity': { zh: '僵硬', en: 'Rigidity' },
  'symptom.slowMovement': { zh: '动作变慢', en: 'Slow Movement' },
  'symptom.dyskinesia': { zh: '异动症', en: 'Dyskinesia' },
  'symptom.freezing': { zh: '冻结步态', en: 'Freezing of Gait' },
  'symptom.unsteady': { zh: '走路不稳', en: 'Unsteady Walking' },
  'symptom.dizziness': { zh: '头晕', en: 'Dizziness' },
  'symptom.nausea': { zh: '恶心', en: 'Nausea' },
  'symptom.swallowing': { zh: '吞咽困难', en: 'Swallowing Difficulty' },
  'symptom.depression': { zh: '情绪低落', en: 'Low Mood' },
  'symptom.anxiety': { zh: '焦虑', en: 'Anxiety' },
  'symptom.hallucination': { zh: '幻觉/意识混乱', en: 'Hallucination/Confusion' },
  'symptom.sleep': { zh: '睡眠问题', en: 'Sleep Issues' },
  'symptom.constipation': { zh: '便秘', en: 'Constipation' },
  'symptom.fall': { zh: '跌倒/近跌倒', en: 'Fall/Near Fall' },

  // Scan tab
  'scan.title': { zh: '扫码录入', en: 'Scan Rx' },
  'scan.subtitle': { zh: '拍摄处方或药盒，自动生成用药提醒', en: 'Scan prescription or medicine box to auto-generate reminders' },
  'scan.prescription': { zh: '扫描处方', en: 'Scan Prescription' },
  'scan.medicineBox': { zh: '扫描药盒', en: 'Scan Medicine Box' },
  'scan.manual': { zh: '手动添加', en: 'Add Manually' },
  'scan.importHistory': { zh: '从历史处方导入', en: 'Import from History' },
  'scan.hint': { zh: '将处方或药盒置于框内', en: 'Place prescription or medicine box in frame' },
  'scan.analyzing': { zh: '正在识别药物信息...', en: 'Identifying medication info...' },
  'scan.resultTitle': { zh: '待确认用药计划', en: 'Medication Plan to Confirm' },
  'scan.strength': { zh: '规格', en: 'Strength' },
  'scan.dosage': { zh: '每次剂量', en: 'Dosage' },
  'scan.times': { zh: '服药时间', en: 'Times' },
  'scan.instruction': { zh: '说明', en: 'Instructions' },
  'scan.confidence': { zh: '识别可信度', en: 'Confidence' },
  'scan.confidenceHigh': { zh: '高', en: 'High' },
  'scan.confidenceMedium': { zh: '中', en: 'Medium' },
  'scan.toConfirm': { zh: '待确认', en: 'To Confirm' },
  'scan.confirmGenerate': { zh: '确认并生成提醒', en: 'Confirm & Generate Reminders' },
  'scan.rescan': { zh: '重新扫描', en: 'Rescan' },
  'scan.sendPharmacist': { zh: '发送给药师确认', en: 'Send to Pharmacist' },
  'scan.safetyNote': { zh: 'AI 识别结果仅用于减少手动录入。保存前请核对处方原文，药物调整请遵医嘱。', en: 'AI results are for reducing manual entry only. Verify against original prescription before saving. Medication changes require doctor approval.' },
  'scan.uncertainNote': { zh: '剂量或时间识别不确定，请确认后保存。', en: 'Dosage or timing uncertain, please verify before saving.' },
  'scan.generated': { zh: '已生成用药提醒！', en: 'Medication reminders generated!' },
  'scan.sentToPharmacist': { zh: '已发送给药师，等待确认', en: 'Sent to pharmacist, awaiting confirmation' },
  'scan.followDoctor': { zh: '遵医嘱', en: 'Follow doctor orders' },

  // Profile tab
  'profile.title': { zh: '我的', en: 'Profile' },
  'profile.editProfile': { zh: '编辑资料', en: 'Edit Profile' },
  'profile.identity': { zh: '帕金森患者', en: 'Parkinson\'s Patient' },
  'profile.diagnosisTime': { zh: '诊断时间', en: 'Diagnosis Date' },
  'profile.primaryDoctor': { zh: '主治医生', en: 'Primary Doctor' },
  'profile.parkinsonProfile': { zh: '帕金森档案', en: 'Parkinson\'s Profile' },
  'profile.mainSymptoms': { zh: '主要症状', en: 'Main Symptoms' },
  'profile.swallowingDiff': { zh: '是否有吞咽困难', en: 'Swallowing Difficulty' },
  'profile.fallHistory': { zh: '是否有跌倒史', en: 'Fall History' },
  'profile.wearWatch': { zh: '是否佩戴手表', en: 'Wearable Device' },
  'profile.emergencyContact': { zh: '紧急联系人', en: 'Emergency Contact' },
  'profile.currentMeds': { zh: '当前药物清单', en: 'Current Medications' },
  'profile.manageMeds': { zh: '管理药物', en: 'Manage Medications' },
  'profile.exportCard': { zh: '生成就诊信息', en: 'Generate Visit Info' },
  'profile.sharePermissions': { zh: '共享权限', en: 'Sharing Permissions' },
  'profile.familyViewMissed': { zh: '家属可查看漏服提醒', en: 'Family can view missed dose alerts' },
  'profile.doctorViewReport': { zh: '医生可查看周报', en: 'Doctor can view weekly report' },
  'profile.pharmacistViewMeds': { zh: '药师可查看药物清单', en: 'Pharmacist can view medication list' },
  'profile.emergencyShare': { zh: '紧急情况下共享用药护照', en: 'Share medication passport in emergencies' },
  'profile.settings': { zh: '设置', en: 'Settings' },
  'profile.reminderSettings': { zh: '提醒设置', en: 'Reminder Settings' },
  'profile.privacy': { zh: '隐私与授权', en: 'Privacy & Authorization' },
  'profile.exportMedCard': { zh: '生成就诊信息', en: 'Generate Visit Info' },
  'profile.accountSecurity': { zh: '账号安全', en: 'Account Security' },
  'profile.language': { zh: '语言切换', en: 'Language' },
  'profile.about': { zh: '关于与免责声明', en: 'About & Disclaimer' },
  'profile.lang.zh': { zh: '中文', en: '中文' },
  'profile.lang.en': { zh: 'English', en: 'English' },
  'profile.exportReport': { zh: '一键导出近期报告', en: 'Export Recent Report' },
  'profile.exportReportToast': { zh: '近期报告已生成', en: 'Recent report generated' },
  'profile.visitInfo': { zh: '生成就诊信息', en: 'Visit Info' },

  // Care Team Edit
  'care.editTeam.title': { zh: '编辑联系人信息', en: 'Edit Contact Info' },
  'care.editTeam.name': { zh: '姓名', en: 'Name' },
  'care.editTeam.role': { zh: '身份', en: 'Role' },
  'care.editTeam.roleDoctor': { zh: '医生', en: 'Doctor' },
  'care.editTeam.rolePharmacist': { zh: '药剂师', en: 'Pharmacist' },
  'care.editTeam.contact': { zh: '联系方式', en: 'Contact' },
  'care.editTeam.hospital': { zh: '医院', en: 'Hospital' },
  'care.editTeam.department': { zh: '科室', en: 'Department' },
  'care.editTeam.availableTime': { zh: '可沟通时间', en: 'Available Time' },
  'care.editTeam.notes': { zh: '备注', en: 'Notes' },
  'care.editTeam.save': { zh: '保存', en: 'Save' },
  'care.editTeam.saved': { zh: '已保存联系人信息', en: 'Contact info saved' },

  // Apple Watch Data
  'care.watch.title': { zh: 'Apple Watch 数据', en: 'Apple Watch Data' },
  'care.watch.tremorDuration': { zh: '震颤时长', en: 'Tremor Duration' },
  'care.watch.dyskinesiaDuration': { zh: '异动症时长', en: 'Dyskinesia Duration' },
  'care.watch.steps': { zh: '步数/活动量', en: 'Steps/Activity' },
  'care.watch.restingHR': { zh: '静息心率', en: 'Resting HR' },
  'care.watch.sleepDuration': { zh: '睡眠时长', en: 'Sleep Duration' },
  'care.watch.nightActivity': { zh: '夜间活动次数', en: 'Night Activity' },
  'care.watch.possibleOff': { zh: '可能的 OFF 时间段', en: 'Possible OFF Periods' },
  'care.watch.disclaimer': { zh: '数据来自 Apple Watch，仅供参考，不能单独作为临床判断依据', en: 'Data from Apple Watch, for reference only, not for clinical decisions alone' },

  // AI Analysis
  'care.ai.title': { zh: 'AI 辅助分析', en: 'AI Analysis' },
  'care.ai.insight': { zh: 'AI 判断：今日 14:00-16:00 震颤和活动减少同时出现，且距离上次服药超过 3 小时，可能存在药效减退。建议在就诊时与医生讨论该时间段的用药安排。', en: 'AI Assessment: Today 14:00-16:00, tremor and reduced activity occurred simultaneously, more than 3 hours after last dose, suggesting possible wearing-off. Recommend discussing this time period\'s medication schedule with your doctor at the next visit.' },
  'care.ai.disclaimer': { zh: '以上分析为辅助判断，不构成医疗建议。建议就诊时与医生讨论。', en: 'The above analysis is for reference only and does not constitute medical advice. Please discuss with your doctor at visits.' },

  // Enhanced Doctor Summary
  'care.doctorAi.generate': { zh: 'AI 生成医生摘要', en: 'AI Generate Summary' },
  'care.doctorAi.copy': { zh: '复制摘要', en: 'Copy Summary' },
  'care.doctorAi.addToReport': { zh: '加入近期报告', en: 'Add to Report' },
  'care.doctorAi.addedToReport': { zh: '已加入近期报告', en: 'Added to report' },
  'care.doctorAi.copied': { zh: '已复制到剪贴板', en: 'Copied to clipboard' },
  'care.doctorAi.sectionMeds': { zh: '本周用药情况', en: 'This Week Medication' },
  'care.doctorAi.sectionMedsText': { zh: '当前方案包含多巴丝肼、恩他卡朋、普拉克索缓释片、雷沙吉兰和睡前控释片。本周按时率 86%，漏服 1 次，延迟服药 3 次（平均延迟 18 分钟），主要延迟发生在午间剂量。', en: 'Current regimen includes levodopa/benserazide, entacapone, pramipexole ER, rasagiline, and bedtime controlled-release levodopa/carbidopa. This week: 86% on-time rate, 1 missed dose, and 3 delayed doses averaging 18 minutes late, mainly around midday.' },
  'care.doctorAi.sectionSymptoms': { zh: '主要症状变化', en: 'Key Symptom Changes' },
  'care.doctorAi.sectionSymptomsText': { zh: '本周记录僵硬 5 次（主要在 14:00-16:00），震颤 3 次（晨起轻微），异动症 1 次。下午僵硬频率较上周增加。', en: 'This week: rigidity 5 times (mainly 14:00-16:00), tremor 3 times (mild mornings), dyskinesia once. Afternoon rigidity increased vs. last week.' },
  'care.doctorAi.sectionWatch': { zh: 'Apple Watch 观察', en: 'Apple Watch Observations' },
  'care.doctorAi.sectionWatchText': { zh: '本周日均震颤时长 42 分钟，异动症 15 分钟。步数日均 3200 步（较上周下降 12%）。静息心率 68 bpm。睡眠日均 6.5 小时，夜间活动平均 3 次。14:00-16:00 活动量持续偏低，与患者报告的 OFF 期吻合。', en: 'This week avg daily tremor 42 min, dyskinesia 15 min. Avg 3200 steps/day (down 12% from last week). Resting HR 68 bpm. Avg sleep 6.5h, 3 night activities. 14:00-16:00 consistently low activity, matching reported OFF periods.' },
  'care.doctorAi.sectionAttention': { zh: '需要医生关注的问题', en: 'Issues for Doctor Attention' },
  'care.doctorAi.sectionAttentionText': { zh: '1. 下午 wearing-off 表现明显，建议评估是否需要调整午间剂量间隔\n2. 夜间活动次数增加，可能影响睡眠质量\n3. 本周有 1 次近跌倒记录，步态稳定性需关注', en: '1. Afternoon wearing-off is notable, consider adjusting midday dose interval\n2. Increased nighttime activity may affect sleep quality\n3. One near-fall recorded this week, gait stability needs attention' },

  // Caregiver AI
  'care.caregiverAi.generate': { zh: '生成照护者状态总结', en: 'Generate Caregiver Summary' },
  'care.caregiverAi.addToReport': { zh: '加入近期报告', en: 'Add to Report' },
  'care.caregiverAi.summary': { zh: 'AI 总结：本周夜间活动次数增加，患者有 2 次近跌倒记录，照护者选择了"需要支持"。建议在下次就诊时向医生说明夜间照护压力和跌倒担忧。', en: 'AI Summary: This week nighttime activity increased, patient had 2 near-fall records, caregiver selected "Need Support". Recommend discussing nighttime care burden and fall concerns with the doctor at next visit.' },
  'care.caregiverAi.addedToReport': { zh: '已加入近期报告', en: 'Added to report' },

  // Settings - Reminder
  'settings.reminder.title': { zh: '提醒设置', en: 'Reminder Settings' },
  'settings.reminder.medReminder': { zh: '服药提醒', en: 'Medication Reminder' },
  'settings.reminder.advanceTime': { zh: '提前提醒时间', en: 'Advance Reminder' },
  'settings.reminder.min10': { zh: '提前10分钟', en: '10 min before' },
  'settings.reminder.min15': { zh: '提前15分钟', en: '15 min before' },
  'settings.reminder.min30': { zh: '提前30分钟', en: '30 min before' },
  'settings.reminder.missedReRemind': { zh: '漏服后再次提醒', en: 'Re-remind After Missed' },
  'settings.reminder.missedReRemindDesc': { zh: '漏服超过30分钟后再次提醒', en: 'Re-remind 30 min after missed dose' },
  'settings.reminder.familyNotify': { zh: '通知共同使用账号的家属', en: 'Notify Family on Same Account' },
  'settings.reminder.nightMode': { zh: '夜间免打扰', en: 'Night Mode (Do Not Disturb)' },
  'settings.reminder.nightModeDesc': { zh: '22:00 - 07:00 不发送提醒', en: 'No reminders 22:00 - 07:00' },
  'settings.reminder.ringtone': { zh: '提醒铃声', en: 'Reminder Ringtone' },
  'settings.reminder.vibration': { zh: '震动提醒', en: 'Vibration' },
  'settings.reminder.largeFont': { zh: '大字体提醒', en: 'Large Font Reminder' },
  'settings.reminder.largeFontDesc': { zh: '弹出提醒时使用更大字体，方便阅读', en: 'Use larger font in reminder popups for easier reading' },
  'settings.reminder.voiceReminder': { zh: '语音提醒', en: 'Voice Reminder' },
  'settings.reminder.voiceReminderDesc': { zh: '播报药物名称和剂量', en: 'Read out medication name and dosage' },

  // Settings - Privacy
  'settings.privacy.title': { zh: '隐私与授权', en: 'Privacy & Authorization' },
  'settings.privacy.reportGen': { zh: '允许生成近期报告', en: 'Allow Report Generation' },
  'settings.privacy.watchData': { zh: '允许 Apple Watch 数据加入分析', en: 'Allow Apple Watch Data in Analysis' },
  'settings.privacy.exportToDoctor': { zh: '允许将报告导出给医生查看', en: 'Allow Report Export for Doctor' },
  'settings.privacy.savePrescription': { zh: '保存处方图片', en: 'Save Prescription Images' },
  'settings.privacy.dataExport': { zh: '数据导出说明', en: 'Data Export Info' },
  'settings.privacy.dataExportDesc': { zh: '登录账号的数据会保存在云端，访客模式仅保存在当前设备。导出报告时，报告由您主动生成并分享给医生，医生和药剂师没有独立端口访问您的数据。', en: 'Signed-in account data is saved in the cloud; guest mode stays on this device. Reports are generated and shared by you; doctors and pharmacists do not have independent access to your data.' },
  'settings.privacy.deleteLocal': { zh: '删除本地记录', en: 'Delete Local Records' },
  'settings.privacy.deleteConfirm': { zh: '确认删除所有本地数据？此操作不可恢复。', en: 'Delete all local data? This cannot be undone.' },
  'settings.privacy.deleteConfirmBtn': { zh: '确认删除', en: 'Confirm Delete' },
  'settings.privacy.cancel': { zh: '取消', en: 'Cancel' },
  'settings.privacy.deleted': { zh: '本地记录已清空', en: 'Local records cleared' },
  'settings.privacy.consent': { zh: '知情同意说明', en: 'Informed Consent' },
  'settings.privacy.consentText': { zh: '本应用仅用于帕金森药物提醒和照护信息整理，不提供医疗诊断或治疗建议。AI 功能仅辅助整理信息，不能替代专业医疗判断。使用本应用即表示您了解并同意以上说明。医生和药剂师没有独立端口，所有报告均由患者/家属主动导出或展示。', en: 'This app is for Parkinson\'s medication reminders and care info only, not for diagnosis or treatment. AI features assist in organizing information and cannot replace professional medical judgment. By using this app, you acknowledge the above. Doctors and pharmacists have no independent access; all reports are exported or shown by the patient/family.' },

  // Settings - Visit Info (renamed from Export Med Card)
  'settings.visitInfo.title': { zh: '生成就诊信息', en: 'Generate Visit Info' },
  'settings.visitInfo.currentMeds': { zh: '当前药物清单', en: 'Current Medications' },
  'settings.visitInfo.adherence': { zh: '用药依从性', en: 'Medication Adherence' },
  'settings.visitInfo.days7': { zh: '近7天', en: 'Last 7 Days' },
  'settings.visitInfo.days14': { zh: '近14天', en: 'Last 14 Days' },
  'settings.visitInfo.days30': { zh: '近30天', en: 'Last 30 Days' },
  'settings.visitInfo.recentSymptoms': { zh: '最近症状摘要', en: 'Recent Symptom Summary' },
  'settings.visitInfo.watchSummary': { zh: 'Apple Watch 数据摘要', en: 'Apple Watch Data Summary' },
  'settings.visitInfo.caregiverSummary': { zh: '照护者状态摘要', en: 'Caregiver Status Summary' },
  'settings.visitInfo.doctorContacts': { zh: '医生/药剂师联系人', en: 'Doctor/Pharmacist Contacts' },
  'settings.visitInfo.generate': { zh: '生成并导出就诊信息', en: 'Generate & Export Visit Info' },
  'settings.visitInfo.generated': { zh: '就诊信息已生成', en: 'Visit info generated' },

  // Settings - Account Security
  'settings.security.title': { zh: '账号安全', en: 'Account Security' },
  'settings.security.boundPhone': { zh: '当前绑定手机号', en: 'Bound Phone Number' },
  'settings.security.changePhone': { zh: '更换手机号', en: 'Change Phone Number' },
  'settings.security.getCode': { zh: '获取验证码', en: 'Get Code' },
  'settings.security.resend': { zh: '重新发送', en: 'Resend' },
  'settings.security.inputCode': { zh: '输入验证码', en: 'Enter Code' },
  'settings.security.verifyAndSave': { zh: '验证并保存', en: 'Verify & Save' },
  'settings.security.deviceInfo': { zh: '登录设备', en: 'Login Devices' },
  'settings.security.currentDevice': { zh: '当前设备', en: 'Current Device' },
  'settings.security.lastLogin': { zh: '上次登录', en: 'Last Login' },
  'settings.security.logout': { zh: '退出登录', en: 'Log Out' },
  'settings.security.logoutConfirm': { zh: '确认退出登录？', en: 'Confirm log out?' },
  'settings.security.verified': { zh: '验证成功', en: 'Verified' },

  // Settings - About
  'settings.about.title': { zh: '关于与免责声明', en: 'About & Disclaimer' },
  'settings.about.appName': { zh: '帕金森照护助手', en: 'Parkinson\'s Care Assistant' },
  'settings.about.version': { zh: '版本 1.0.0', en: 'Version 1.0.0' },
  'settings.about.positioning': { zh: '应用定位', en: 'App Purpose' },
  'settings.about.positioningText': { zh: '本应用是一款帕金森药物提醒、症状记录和照护信息整理工具，旨在帮助患者和家属更好地管理日常用药、记录症状变化、整理就诊信息，并与照护团队保持沟通。', en: 'This app is a Parkinson\'s medication reminder, symptom tracker, and care information organizer, designed to help patients and families manage daily medications, record symptom changes, organize visit information, and stay connected with the care team.' },
  'settings.about.medDisclaimer': { zh: '医疗免责声明', en: 'Medical Disclaimer' },
  'settings.about.medDisclaimerText': { zh: '本工具不提供医疗诊断，不自动调整药物剂量，不能替代医生建议。所有药物调整请遵循主治医生的指导。应用中的用药提醒基于用户手动录入或处方扫描结果，使用前请核对处方原文。', en: 'This tool does not provide medical diagnosis, does not automatically adjust medication dosages, and cannot replace doctor\'s advice. All medication changes should follow your doctor\'s guidance. Medication reminders are based on manual entry or prescription scans; please verify against original prescriptions.' },
  'settings.about.aiDisclaimer': { zh: 'AI 功能免责声明', en: 'AI Feature Disclaimer' },
  'settings.about.aiDisclaimerText': { zh: 'AI 总结和分析功能仅用于辅助整理信息，可能不完整或存在误差。AI 生成的内容不构成医疗建议，不应作为诊断或治疗的唯一依据。请在就诊时将 AI 总结作为参考资料与医生讨论。', en: 'AI summary and analysis features are for organizing information only and may be incomplete or contain errors. AI-generated content does not constitute medical advice and should not be the sole basis for diagnosis or treatment. Please use AI summaries as reference material when discussing with your doctor.' },
  'settings.about.watchDisclaimer': { zh: 'Apple Watch 数据免责声明', en: 'Apple Watch Data Disclaimer' },
  'settings.about.watchDisclaimerText': { zh: 'Apple Watch 采集的运动、震颤、心率、睡眠等数据仅作为参考信息，不能单独作为临床判断依据。设备数据可能受佩戴方式、环境等因素影响，存在一定误差。', en: 'Apple Watch data on movement, tremor, heart rate, sleep, etc. is for reference only and cannot serve as the sole basis for clinical judgment. Device data may be affected by wearing position, environment, and other factors.' },
  'settings.about.privacyNote': { zh: '隐私说明', en: 'Privacy Notice' },
  'settings.about.privacyNoteText': { zh: '本应用中的信息由患者和家属共同账号管理。登录账号数据会保存在云端，访客模式数据仅保存在当前设备。导出报告或展示给医生需由用户主动操作，医生和药剂师没有独立端口访问您的数据。', en: 'Information in this app is managed under a shared patient-family account. Signed-in data is saved in the cloud; guest-mode data stays on this device. Exporting reports or showing them to doctors requires user action; doctors and pharmacists do not have independent access to your data.' },
  'settings.about.emergency': { zh: '紧急情况提示', en: 'Emergency Notice' },
  'settings.about.emergencyText': { zh: '如出现以下情况，请立即就医或拨打急救电话：严重吞咽困难、跌倒受伤、意识混乱或幻觉加重、胸痛、呼吸困难、突发高热。本应用不具备紧急救助功能，紧急情况请直接联系医疗机构。', en: 'If any of the following occur, seek immediate medical attention: severe swallowing difficulty, fall with injury, worsening confusion or hallucinations, chest pain, breathing difficulty, sudden high fever. This app does not provide emergency services; contact medical institutions directly in emergencies.' },
} as const;

type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>(() => {
    const saved = localStorage.getItem('pd_care_language');
    return saved === 'en' || saved === 'zh' ? saved : 'zh';
  });

  useEffect(() => {
    localStorage.setItem('pd_care_language', lang);
  }, [lang]);

  const t = (key: TranslationKey) => translations[key]?.[lang] || key;
  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
};
