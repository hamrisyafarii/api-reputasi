import { Controller, Get } from '@nestjs/common';
import {
  Session,
  AllowAnonymous,
  OptionalAuth,
} from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';

@Controller('users')
export class UserController {
  // 🔒 Protected route - requires a valid session
  @Get('me')
  getProfile(@Session() session: UserSession) {
    return { user: session.user };
  }

  // 🌐 Public route - no authentication required
  @Get('public')
  @AllowAnonymous()
  getPublic() {
    return { message: 'This is a public route' };
  }

  // 🛡️ Optional auth - checks for session if present, but doesn't reject unauthenticated requests
  @Get('optional')
  @OptionalAuth()
  getOptional(@Session() session: UserSession | null) {
    return {
      message: 'Optional auth route',
      isAuthenticated: !!session,
      user: session?.user || null,
    };
  }
}
