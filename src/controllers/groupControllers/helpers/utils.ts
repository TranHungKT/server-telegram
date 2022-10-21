export const normalizeUnreadMessage = (memberIds: string[]) =>
  memberIds.map((memberId) => ({
    userId: memberId,
    numberOfUnReadMessages: 0,
  }));
