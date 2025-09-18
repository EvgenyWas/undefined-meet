import type { IUserData } from 'undefined-meet-shared';

export interface IJwtPayload {
  context: {
    user: IUserData & { affiliation?: 'admin' | 'member' };
  };
  room?: string;
}
