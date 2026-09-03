import { Controller, Get } from '@nestjs/common';

/**
 * Liveness check — unauthenticated, no dependencies queried (not even the
 * database), so a `200` only confirms the Nest process itself is up and
 * routing requests. Intended for infrastructure-level monitoring (load
 * balancer/orchestrator health probes), not as a database connectivity
 * check.
 */
@Controller('health')
export class HealthController {
  @Get()
  check(): { status: 'ok'; timestamp: string } {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
