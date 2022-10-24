export const normalizeUnReadMessage = (memberIds: string[]) =>
  memberIds.map((memberId) => ({
    userId: memberId,
    numberOfUnReadMessages: 0,
  }));
