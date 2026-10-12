export const ExternalLink = {
  koFi: "https://ko-fi.com/R5R028MD8Y",
} as const;

export type ExternalLink = (typeof ExternalLink)[keyof typeof ExternalLink];
