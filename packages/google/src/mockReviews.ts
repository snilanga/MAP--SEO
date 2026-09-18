import type { ReviewAuditMetrics, ReviewItem } from '../../types/src/index.ts';

export const MOCK_REVIEWS_SAMPLE: ReviewItem[] = [
  {
    id: 'rev-1',
    authorName: 'Sunil Perera',
    rating: 5,
    text: 'Outstanding experience at ABC Dental Clinic! The dental cleaning was completely painless and the friendly staff made me feel comfortable from the reception onward. Highly recommend Dr. Silva.',
    publishTime: '2026-09-08T10:15:00Z',
    replyText: 'Thank you so much Sunil! We take great pride in gentle care and our team will be delighted to hear your feedback.',
    replyTime: '2026-09-08T16:20:00Z',
    sentimentLabel: 'Positive',
  },
  {
    id: 'rev-2',
    authorName: 'Dilani Fernando',
    rating: 5,
    text: 'I got teeth whitening done before my wedding day. Superb results! Clear instructions given and modern clinic atmosphere with friendly staff.',
    publishTime: '2026-08-25T14:30:00Z',
    replyText: 'Congratulations Dilani! It was an absolute pleasure having you with us. Wishing you the best!',
    replyTime: '2026-08-26T09:12:00Z',
    sentimentLabel: 'Positive',
  },
  {
    id: 'rev-3',
    authorName: 'Kasun Wickramasinghe',
    rating: 4,
    text: 'Professional dental treatment and very competent doctors. Only small issue is waiting time was around 20 minutes past appointment schedule, but the actual procedure was top notch.',
    publishTime: '2026-08-10T11:45:00Z',
    replyText: 'Hi Kasun, thank you for your review. We sincerely apologize for the brief delay on the day due to an emergency patient before your slot. We appreciate your patience!',
    replyTime: '2026-08-11T08:00:00Z',
    sentimentLabel: 'Positive',
  },
  {
    id: 'rev-4',
    authorName: 'Ruwan Jayawardena',
    rating: 3,
    text: 'Good dentist but parking was very difficult on Galle Road during peak hours. Had to circle around twice.',
    publishTime: '2026-07-19T17:00:00Z',
    replyText: 'Thank you for your feedback Ruwan. We have reserved parking slots at the rear basement entrance — our security desk is happy to direct you on your next visit.',
    replyTime: '2026-07-20T10:30:00Z',
    sentimentLabel: 'Neutral',
  },
  {
    id: 'rev-5',
    authorName: 'Nadeeka Senanayake',
    rating: 5,
    text: 'Dr. Silva is very thorough with dental cleaning and checkups. Clean premises and very kind assistants.',
    publishTime: '2026-07-02T13:10:00Z',
    replyText: 'Thank you Nadeeka for trusting ABC Dental!',
    replyTime: '2026-07-03T11:05:00Z',
    sentimentLabel: 'Positive',
  },
];

export const MOCK_REVIEW_AUDIT_METRICS: ReviewAuditMetrics = {
  totalReviews: 247,
  averageRating: 4.7,
  ratingDistribution: {
    5: 198,
    4: 31,
    3: 10,
    2: 4,
    1: 4,
  },
  responseRate: 91, // 91% response rate
  unansweredCount: 22,
  averageResponseTimeDays: 1.2,
  frequentlyMentionedTopics: [
    {
      topic: 'Dental cleaning',
      count: 38,
      sentiment: 'positive',
      sampleSnippet: 'Painless scaling and comprehensive cleaning procedures',
    },
    {
      topic: 'Friendly staff',
      count: 31,
      sentiment: 'positive',
      sampleSnippet: 'Front desk and dental nurses were welcoming and attentive',
    },
    {
      topic: 'Waiting time',
      count: 12,
      sentiment: 'neutral',
      sampleSnippet: 'Slight appointment delays during busy evening hours',
    },
    {
      topic: 'Parking',
      count: 9,
      sentiment: 'negative',
      sampleSnippet: 'Roadside parking congestion along Galle Road during rush hour',
    },
  ],
  recentTrend: [
    { month: 'Apr 2026', count: 18, averageRating: 4.8 },
    { month: 'May 2026', count: 21, averageRating: 4.6 },
    { month: 'Jun 2026', count: 24, averageRating: 4.9 },
    { month: 'Jul 2026', count: 22, averageRating: 4.7 },
    { month: 'Aug 2026', count: 27, averageRating: 4.8 },
    { month: 'Sep 2026', count: 16, averageRating: 4.7 },
  ],
  transparencyNote:
    'Based on available review text. Topic categorization and sentiment indicators are AI-generated topic analysis and should be interpreted as assistive insights, not verified factual statements.',
};
