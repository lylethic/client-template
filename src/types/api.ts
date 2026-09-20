/**
 * TypeScript types mirroring the FastAPI backend Pydantic schemas.
 * Keep in sync with: social-insight/app/schemas/
 */

// ─── Platform Account ────────────────────────────────────────────────────────

export interface PlatformAccountResponse {
  id: string;
  user_id: string;
  platform: string; // "youtube" | "facebook" | "instagram" | "threads"
  platform_account_id: string;
  account_name: string;
  account_handle: string | null;
  avatar_url: string | null;
  is_active: boolean;
  token_expires_at: string | null;
  metadata_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface OAuthAuthorizeUrlResponse {
  platform: string;
  authorization_url: string;
  state: string;
}

export interface OAuthCallbackRequest {
  code: string;
  state?: string;
  redirect_uri?: string;
}

export interface ConnectWithChannelIdRequest {
  channel_id: string;
}

export interface PlatformSyncResponse {
  platform_account_id: string;
  platform: string;
  channel_name: string;
  posts_synced_count: number;
  followers_count: number;
  views_count: number;
  synced_at: string;
}

export interface FacebookPageItem {
  id: string;
  name: string;
  category: string | null;
  avatar_url: string | null;
  instagram_business_account_id: string | null;
  instagram_username: string | null;
}

export interface FacebookConnectPageRequest {
  page_id: string;
  user_access_token?: string;
}

export interface InstagramConnectRequest {
  instagram_account_id: string;
  page_id?: string;
  user_access_token?: string;
}

// ─── Metric Snapshot ─────────────────────────────────────────────────────────

export interface MetricSnapshotResponse {
  id: string;
  entity_type: string;
  platform_account_id: string | null;
  post_id: string | null;
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  followers_count: number;
  total_videos_count: number;
  engagement_rate: number;
  watch_time_minutes: number;
  captured_at: string;
  created_at: string;
  updated_at: string;
}

export interface GrowthMetric {
  current: number;
  baseline: number;
  change: number;
  growth_rate: number;
  timeframe: string;
}

export interface ChannelGrowthResponse {
  channel_id: string;
  channel_name: string;
  platform: string;
  followers_wow: GrowthMetric;
  followers_mom: GrowthMetric;
  views_wow: GrowthMetric | null;
  views_mom: GrowthMetric | null;
}

export interface GrowthOverviewResponse {
  followers_wow: GrowthMetric;
  followers_mom: GrowthMetric;
  channels: ChannelGrowthResponse[];
}

export interface PlatformBreakdownItem {
  platform: string;
  accounts_count: number;
  followers_count: number;
  views_count: number;
  posts_count: number;
  interactions_count: number;
  engagement_rate: number;
}

export interface InsightsSummaryResponse {
  total_channels: number;
  total_posts: number;
  total_followers: number;
  total_views: number;
  total_interactions: number;
  average_engagement_rate: number;
  platforms: PlatformBreakdownItem[];
  growth: GrowthOverviewResponse | null;
  cached: boolean;
  generated_at: string;
}

export interface TopPostItem {
  id: string;
  platform: string;
  platform_post_id: string;
  platform_account_id: string;
  channel_name: string;
  title: string | null;
  content: string | null;
  url: string | null;
  thumbnail_url: string | null;
  post_type: string;
  published_at: string;
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  engagement_rate: number;
}

export interface TopContentResponse {
  total: number;
  sort_by: string;
  timeframe_days: number;
  items: TopPostItem[];
}

export interface TimeSeriesPoint {
  date: string;
  views_count: number;
  followers_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  saves_count: number;
  engagement_rate: number;
}

export interface TimeSeriesResponse {
  timeframe_days: number;
  platform: string | null;
  account_id: string | null;
  points: TimeSeriesPoint[];
}

export interface ChannelDetailResponse {
  id: string;
  platform: string;
  platform_account_id: string;
  account_name: string;
  account_handle: string | null;
  avatar_url: string | null;
  is_active: boolean;
  metadata_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  latest_snapshot: MetricSnapshotResponse | null;
  posts_count: number;
}

// ─── Posts ────────────────────────────────────────────────────────────────────

export interface PostWithMetricsResponse {
  id: string;
  platform_account_id: string;
  platform_post_id: string;
  post_type: string;
  title: string | null;
  content: string | null;
  url: string | null;
  thumbnail_url: string | null;
  published_at: string;
  metadata_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  channel_name: string | null;
  platform: string | null;
  latest_metrics: MetricSnapshotResponse | null;
}

export interface PostListResponse {
  total: number;
  page: number;
  page_size: number;
  items: PostWithMetricsResponse[];
}

// ─── AI Insights ─────────────────────────────────────────────────────────────

export interface SentimentBreakdown {
  positive: number;
  positive_percentage: number;
  neutral: number;
  neutral_percentage: number;
  negative: number;
  negative_percentage: number;
  toxic_or_spam: number;
  toxic_or_spam_percentage: number;
  overall_score: number;
  dominant_sentiment: string;
}

export interface TopicSentimentItem {
  topic: string;
  mentions_count: number;
  sentiment: string;
  sample_quote: string | null;
}

export interface PostAIInsightResponse {
  post_id: string;
  platform: string;
  platform_post_id: string;
  post_title: string | null;
  total_comments_analyzed: number;
  sentiment_breakdown: SentimentBreakdown;
  top_topics: TopicSentimentItem[];
  audience_feedback_summary: string;
  actionable_takeaway: string;
  analyzed_at: string;
}

export interface BestPostingTime {
  day_of_week: string;
  time_window: string;
  reasoning: string;
  average_engagement_multiplier: number;
}

export interface TrendingTopic {
  topic: string;
  growth_trend: string;
  engagement_potential: string;
  recommendation: string;
}

export interface ContentRecommendationsResponse {
  user_id: string;
  platform: string | null;
  best_times_to_post: BestPostingTime[];
  trending_topics: TrendingTopic[];
  actionable_recommendations: string[];
  generated_at: string;
}

export interface ExecutiveSummaryResponse {
  user_id: string;
  timeframe: string;
  summary_headline: string;
  summary_markdown: string;
  top_highlights: string[];
  key_concerns_or_risks: string[];
  generated_at: string;
}
