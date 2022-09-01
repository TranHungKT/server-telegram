export interface Chat {
  id: string
  content: string
  contentType: string // TODO: CHECK TYPE OF FILE, URL?
  sentTime: string
  sentBy: string
  readBy: string[]
}

export enum TypeOfGroup {
  ALL = 'ALL',
  IMPORTANT = 'IMPORTANT',
  READ = 'READ',
  UNREAD = 'UNREAD',
}
