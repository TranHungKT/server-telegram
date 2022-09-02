export interface BaseUserReturnFromFacebook {
  id: string
  name: string
}

export interface IFacebookService {
  getUserData(id: string): Promise<BaseUserReturnFromFacebook>
}
