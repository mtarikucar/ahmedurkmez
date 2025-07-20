import { Injectable, LoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

@Injectable()
export class WinstonLogger implements LoggerService {
  private readonly logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const logLevel = this.configService.get('LOG_LEVEL', isProduction ? 'warn' : 'debug');
    const logFormat = this.configService.get('LOG_FORMAT', isProduction ? 'json' : 'simple');

    // Define log format
    const format = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    );

    // Console format for development
    const consoleFormat = winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.ms(),
      nestWinstonModuleUtilities.format.nestLike('AhmedUrkmez', {
        colors: true,
        prettyPrint: true,
      }),
    );

    // Create transports
    const transports: winston.transport[] = [];

    // Console transport
    if (!isProduction || process.env.ENABLE_CONSOLE_LOGS === 'true') {
      transports.push(
        new winston.transports.Console({
          format: isProduction ? format : consoleFormat,
          level: logLevel,
        })
      );
    }

    if (isProduction || process.env.ENABLE_FILE_LOGS === 'true') {
      // Error log file
      transports.push(
        new winston.transports.DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          level: 'error',
          format,
          maxSize: this.configService.get('LOG_MAX_SIZE', '20m'),
          maxFiles: this.configService.get('LOG_MAX_FILES', '14d'),
          zippedArchive: true,
        })
      );

      // Combined log file
      transports.push(
        new winston.transports.DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          format,
          maxSize: this.configService.get('LOG_MAX_SIZE', '20m'),
          maxFiles: this.configService.get('LOG_MAX_FILES', '14d'),
          zippedArchive: true,
        })
      );

      // Access log file (for HTTP requests)
      transports.push(
        new winston.transports.DailyRotateFile({
          filename: 'logs/access-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json()
          ),
          maxSize: this.configService.get('LOG_MAX_SIZE', '20m'),
          maxFiles: this.configService.get('LOG_MAX_FILES', '14d'),
          zippedArchive: true,
        })
      );
    }

    this.logger = winston.createLogger({
      level: logLevel,
      format,
      transports,
      // Don't exit on handled exceptions
      exitOnError: false,
      // Handle exceptions and rejections
      exceptionHandlers: isProduction ? [
        new winston.transports.DailyRotateFile({
          filename: 'logs/exceptions-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
        })
      ] : [],
      rejectionHandlers: isProduction ? [
        new winston.transports.DailyRotateFile({
          filename: 'logs/rejections-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          maxSize: '20m',
          maxFiles: '14d',
        })
      ] : [],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, {
      trace,
      context,
      timestamp: new Date().toISOString(),
    });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  // Additional methods for structured logging
  logHTTPRequest(req: any, res: any, responseTime: number) {
    this.logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id,
      timestamp: new Date().toISOString(),
    });
  }

  logDatabaseOperation(operation: string, table: string, duration: number, success: boolean) {
    this.logger.info('Database Operation', {
      operation,
      table,
      duration: `${duration}ms`,
      success,
      timestamp: new Date().toISOString(),
    });
  }

  logSecurityEvent(event: string, details: any) {
    this.logger.warn('Security Event', {
      event,
      details,
      timestamp: new Date().toISOString(),
    });
  }

  logPerformanceMetric(metric: string, value: number, unit: string) {
    this.logger.info('Performance Metric', {
      metric,
      value,
      unit,
      timestamp: new Date().toISOString(),
    });
  }
}