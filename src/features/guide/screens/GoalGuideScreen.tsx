import React from 'react';
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, Screen, SectionHeader } from '../../../shared/components';
import { useTheme } from '../../../shared/theme/ThemeProvider';

type Block =
  | { kind: 'h2'; text: string }
  | { kind: 'h3'; text: string }
  | { kind: 'p'; text: string }
  | { kind: 'ask'; text: string }
  | { kind: 'bullets'; items: string[] }
  | { kind: 'numbered'; items: string[] }
  | { kind: 'table'; headers: string[]; rows: string[][] }
  | { kind: 'code'; text: string }
  | { kind: 'divider' };

const CONTENT: Block[] = [
  { kind: 'p', text: 'Most goals fail not because people lack discipline — but because the goal was poorly defined from the start. "Get fit" is not a goal. It\'s a wish. This guide shows you how to turn wishes into plans your future self can actually execute.' },
  { kind: 'divider' },
  { kind: 'h2', text: 'What Makes a Goal SMART?' },
  { kind: 'p', text: 'A SMART goal is Specific, Measurable, Achievable, Relevant, and Time-bound. Each of these isn\'t a box to tick — it\'s a question to honestly answer before you commit to a goal.' },
  { kind: 'p', text: 'The good news: Goal Planner is built around this exact framework. Every field in the goal creation screen maps to one of these five qualities.' },
  { kind: 'divider' },

  { kind: 'h2', text: 'S — Specific' },
  { kind: 'ask', text: 'If I described this goal to a stranger, would they know exactly what I\'m trying to accomplish?' },
  { kind: 'p', text: 'Vague goals give your brain an escape hatch. "Get healthier" can mean anything — which means it means nothing. A specific goal removes ambiguity.' },
  { kind: 'h3', text: 'The Test' },
  { kind: 'p', text: 'Read your goal title out loud. If someone could reasonably ask "but what does that mean, exactly?" — it needs to be more specific.' },
  { kind: 'table', headers: ['Too Vague', 'Specific'], rows: [
    ['Get fit', 'Run a 5K in under 28 minutes'],
    ['Learn coding', 'Build and deploy a personal portfolio website'],
    ['Grow my business', 'Acquire 10 paying customers at $50/month'],
    ['Read more', 'Read 12 non-fiction books this year'],
    ['Save money', 'Save PKR 500,000 by December 31'],
  ] },
  { kind: 'h3', text: 'How to Make a Goal Specific' },
  { kind: 'numbered', items: [
    'What exactly do I want to accomplish?',
    'How much or how many?',
    'What does success look like on the final day?',
  ] },
  { kind: 'p', text: 'Example → What: lose weight. How much: 10 kg. Success: reach 75 kg and maintain for 2 weeks. Result: "Reach and maintain 75 kg by May 31".' },
  { kind: 'p', text: 'In the app: your goal title is the most important field. Write it last — after you\'ve thought through the KPIs and timeline.' },
  { kind: 'divider' },

  { kind: 'h2', text: 'M — Measurable' },
  { kind: 'ask', text: 'How will I know, unambiguously, that I\'ve succeeded?' },
  { kind: 'p', text: 'A goal without measurement is just a direction. Measurement transforms direction into destination. In Goal Planner, every goal should have at least one KPI: "What number am I moving, and from where to where?"' },
  { kind: 'code', text: 'Name:   Body Weight\nUnit:   kg\nStart:  85\nTarget: 75' },
  { kind: 'h3', text: 'Types of KPIs' },
  { kind: 'bullets', items: [
    'Numeric: weight 85→75 kg, revenue $0→$5,000/mo, books 0→12',
    'Binary: did I complete the certification? launch the product?',
    'Percentage: portfolio return 0%→15%, course 0%→100%',
  ] },
  { kind: 'h3', text: 'One KPI Is Not Always Enough' },
  { kind: 'p', text: 'A single metric can be gamed. Add a balancing KPI that captures the quality of the outcome.' },
  { kind: 'table', headers: ['Goal', 'Primary KPI', 'Balancing KPI'], rows: [
    ['Lose weight', 'Body weight (kg)', 'Body fat %'],
    ['Grow followers', 'Follower count', 'Engagement rate'],
    ['Read more', 'Books finished', 'Notes per book'],
    ['Earn more', 'Monthly revenue', 'Client satisfaction'],
  ] },
  { kind: 'h3', text: 'Milestones Are Checkpoints, Not Optional' },
  { kind: 'p', text: 'After adding a KPI, add 2-3 milestones. A milestone answers: "Where should I be at this intermediate date if I\'m on track?"' },
  { kind: 'code', text: 'Start:       85 kg (Jan 1)\nMilestone 1: 82 kg by Feb 15\nMilestone 2: 79 kg by Mar 31\nMilestone 3: 76 kg by Apr 30\nTarget:      75 kg by May 31' },
  { kind: 'p', text: 'In the app: open any goal → tap a KPI section → Add milestone. Set them every 2-4 weeks for short goals, or quarterly for multi-year goals. The KPI chart shows actual progress against these checkpoints.' },
  { kind: 'divider' },

  { kind: 'h2', text: 'A — Achievable' },
  { kind: 'ask', text: 'Is this genuinely possible within my real-life constraints — not my most optimistic self\'s constraints?' },
  { kind: 'p', text: 'Most people set goals for an idealized version of themselves who has more time, energy, and willpower. That person doesn\'t show up. You do.' },
  { kind: 'h3', text: 'The Two Failure Modes' },
  { kind: 'bullets', items: [
    'Too easy: "Read 1 book this year." You\'ll feel no pull and learn nothing.',
    'Too hard: "Lose 20 kg in 4 weeks." Impossible; you\'ll fail and stop tracking.',
    'Target zone: challenging but doable with consistent effort.',
  ] },
  { kind: 'h3', text: 'Reference Points (baselines, not limits)' },
  { kind: 'bullets', items: [
    'Sustainable fat loss: 0.5–1 kg per week',
    'Beginner 5K: 8–12 weeks of training',
    'New programming language basics: 3–6 months of daily practice',
    'Conversational new language: 6–12 months at 1+ hr/day',
    'Organic social growth: 1–5% follower growth per month',
  ] },
  { kind: 'h3', text: 'The Real-Life Constraints Test' },
  { kind: 'numbered', items: [
    'Time: how many hours/week can I realistically dedicate?',
    'Resources: do I have the money, tools, access, skills to start today?',
    'Energy: does this overlap with other major life events?',
    'Track record: done something similar before? If new, double your estimate.',
    'Dependencies: does this require others? What\'s the plan if they don\'t cooperate?',
  ] },
  { kind: 'p', text: 'If you answered "no" or "not sure" to more than two, adjust the goal before you start — not after you fail.' },
  { kind: 'h3', text: 'When the Goal Seems Too Far Away' },
  { kind: 'p', text: 'Break it into a parent-child hierarchy. Goal Planner supports unlimited sub-goal nesting.' },
  { kind: 'code', text: 'Become financially independent (10 yrs)\n└─ Year 1: Pay off debt (PKR 300,000)\n   └─ Q1: Pay PKR 25,000/month\n      └─ Month 1: Track every expense' },
  { kind: 'divider' },

  { kind: 'h2', text: 'R — Relevant' },
  { kind: 'ask', text: 'Why does this goal matter to me — and is this the right time for it?' },
  { kind: 'h3', text: 'The "Why" Stack' },
  { kind: 'p', text: 'For every goal, ask "why" at least three times. If you can\'t get past the first "why," the goal is borrowed — from social media or what you think you should want. Borrowed goals don\'t survive the first hard month.' },
  { kind: 'h3', text: 'Timing' },
  { kind: 'p', text: '"Learn to cook" is great. "Learn to cook while moving cities, starting a new job, and planning a wedding" will fail — not a bad goal, a bad time.' },
  { kind: 'h3', text: 'Set Habit Importance Honestly' },
  { kind: 'bullets', items: [
    'Critical: if I miss this consistently, the goal will definitely fail.',
    'Important: if I miss this consistently, progress is severely impacted.',
    'Supporting: this helps, but the goal can succeed without it.',
  ] },
  { kind: 'p', text: 'If every habit is "critical," you have too many dependencies. Simplify.' },
  { kind: 'divider' },

  { kind: 'h2', text: 'T — Time-Bound' },
  { kind: 'ask', text: 'What is the exact date by which this will be done — and what happens if I miss it?' },
  { kind: 'h3', text: 'How to Choose a Deadline' },
  { kind: 'numbered', items: [
    'What does the finished state look like?',
    'How long does each stage take (realistically, with buffer)?',
    'Add the stages up — that\'s your minimum timeline.',
    'Add 15–20% buffer for life happening.',
  ] },
  { kind: 'code', text: 'Run a 5K under 28 min\nHabit (3w) + Distance (4w) + Pace (4w) + Taper (1w)\n= 12 weeks min, ~14-15 weeks with buffer' },
  { kind: 'h3', text: 'Long Timelines Need Intermediate Deadlines' },
  { kind: 'p', text: 'The brain doesn\'t feel urgency from a deadline 18 months away. Milestones create urgency you can actually feel.' },
  { kind: 'h3', text: 'If You Miss the Deadline' },
  { kind: 'numbered', items: [
    'Don\'t delete the goal. Update it.',
    'Reflect: was the timeline unrealistic? Did something change?',
    'Adjust the due date, note why in the goal notes, and continue.',
  ] },
  { kind: 'divider' },

  { kind: 'h2', text: 'Worked Example: 5,000 Twitter Followers' },
  { kind: 'numbered', items: [
    'Title: "Reach 5,000 Twitter followers by December 31".',
    'KPI: Twitter Followers, unit followers, start 380, target 5,000.',
    'Milestones: 1,000 (Mar 31), 2,500 (Jun 30), 4,000 (Sep 30), 5,000 (Dec 31).',
    'Achievability: ~385/mo; organic realistic is 100–500/mo → plausible.',
    'Habits: "1 thread/week" (critical, measured 4/mo); "15 min/day engaging" (important, binary).',
    'Relevance: building in public aligns with career; no major life events → timing right.',
    'Note: "Growth from genuine value, not gaming the algorithm. Review at each milestone."',
  ] },
  { kind: 'divider' },

  { kind: 'h2', text: 'Quick Reference: Warning Signs' },
  { kind: 'table', headers: ['Warning Sign', 'What to Do'], rows: [
    ['Title says "be better at" / "improve my"', 'Rewrite with a specific target and number'],
    ['No KPI added', 'Add at least one measurable metric'],
    ['No milestones added', 'Add at least 2 checkpoints'],
    ['No habits linked', 'Create or link at least 1 supporting habit'],
    ['Deadline > 3 years away', 'Break into a hierarchy with annual sub-goals'],
    ['Can\'t explain why it matters', 'Reconsider whether you want this now'],
    ['More than 5 active goals', 'Pause the lowest-priority ones; focus is scarce'],
    ['All habits marked "critical"', 'Too many dependencies — simplify'],
  ] },
  { kind: 'divider' },

  { kind: 'h2', text: 'A Note on Habit Streaks' },
  { kind: 'p', text: 'The streak counter is a tool, not a score. A broken streak is data, not failure. When you miss, ask "what made today different?" not "what\'s wrong with me?" Use the log notes to write one sentence when you miss — patterns emerge over time. Restart freely; "3 times restarted" is a record of someone who kept coming back.' },
  { kind: 'divider' },

  { kind: 'h2', text: 'Summary' },
  { kind: 'table', headers: ['Dimension', 'Key Question', 'App Feature'], rows: [
    ['Specific', 'Would a stranger understand it?', 'Goal title'],
    ['Measurable', 'What number, from where to where?', 'KPIs'],
    ['Achievable', 'Realistic for my actual life?', 'Milestones + timeline'],
    ['Relevant', 'Aligns with what I value now?', 'Notes + habit linking'],
    ['Time-bound', 'Exact date with checkpoints?', 'Due date + milestones'],
  ] },
  { kind: 'p', text: 'The app handles the tracking. You handle the thinking. This guide is the thinking part.' },
];

function GuideBlock({ block }: { block: Block }) {
  const theme = useTheme();
  switch (block.kind) {
    case 'h2':
      return <Text style={{ color: theme.colors.textPrimary, fontSize: theme.typography.sizes.xl, fontWeight: '800', marginTop: theme.spacing.sm }}>{block.text}</Text>;
    case 'h3':
      return <Text style={{ color: theme.colors.textPrimary, fontWeight: '800', marginTop: theme.spacing.xs }}>{block.text}</Text>;
    case 'p':
      return <Text style={{ color: theme.colors.textSecondary, lineHeight: 22 }}>{block.text}</Text>;
    case 'ask':
      return <Card style={{ backgroundColor: theme.colors.infoLight }}><Text style={{ color: theme.colors.info, fontStyle: 'italic' }}>{block.text}</Text></Card>;
    case 'bullets':
      return (
        <View style={{ gap: theme.spacing.xs }}>
          {block.items.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
              <Text style={{ color: theme.colors.primary, fontWeight: '800' }}>•</Text>
              <Text style={{ color: theme.colors.textSecondary, flex: 1, lineHeight: 21 }}>{item}</Text>
            </View>
          ))}
        </View>
      );
    case 'numbered':
      return (
        <View style={{ gap: theme.spacing.xs }}>
          {block.items.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
              <Text style={{ color: theme.colors.primary, fontWeight: '800' }}>{i + 1}.</Text>
              <Text style={{ color: theme.colors.textSecondary, flex: 1, lineHeight: 21 }}>{item}</Text>
            </View>
          ))}
        </View>
      );
    case 'table':
      return (
        <Card style={{ gap: theme.spacing.xs }}>
          <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
            {block.headers.map((header, i) => (
              <Text key={i} style={{ flex: 1, color: theme.colors.textPrimary, fontWeight: '800', fontSize: theme.typography.sizes.sm }}>{header}</Text>
            ))}
          </View>
          {block.rows.map((row, ri) => (
            <View key={ri} style={{ flexDirection: 'row', gap: theme.spacing.sm, borderTopWidth: 1, borderTopColor: theme.colors.borderSubtle, paddingTop: theme.spacing.xs }}>
              {row.map((cell, ci) => (
                <Text key={ci} style={{ flex: 1, color: theme.colors.textSecondary, fontSize: theme.typography.sizes.sm }}>{cell}</Text>
              ))}
            </View>
          ))}
        </Card>
      );
    case 'code':
      return <Card style={{ backgroundColor: theme.colors.surface }}><Text style={{ color: theme.colors.textPrimary, fontFamily: 'monospace', fontSize: theme.typography.sizes.sm, lineHeight: 20 }}>{block.text}</Text></Card>;
    case 'divider':
      return <View style={{ height: 1, backgroundColor: theme.colors.border, marginVertical: theme.spacing.xs }} />;
    default:
      return null;
  }
}

export default function GoalGuideScreen() {
  const navigation = useNavigation();
  const theme = useTheme();
  return (
    <Screen>
      <SectionHeader title="How to Create Goals That Work" actionLabel="Done" onAction={() => navigation.goBack()} />
      <Text style={{ color: theme.colors.textTertiary, fontWeight: '700' }}>A guide to SMART goal-setting in Goal Planner</Text>
      <View style={{ gap: theme.spacing.sm }}>
        {CONTENT.map((block, index) => <GuideBlock key={index} block={block} />)}
      </View>
    </Screen>
  );
}
