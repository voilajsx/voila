import { Request, Response } from 'express';
import { authClass, eventClass } from '@voilajsx/appkit';
import { GreetingLogModel } from './logs.models.js';

const auth = authClass.get();
const event = eventClass.get('greeting_logs');

export async function getGreetingLogs(req: Request, res: Response) {
  try {
    const user = auth.user(req);
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const endpoint = req.query.endpoint as string;
    const userId = req.query.userId as string;

    const logs = await GreetingLogModel.findMany({
      page,
      limit,
      endpoint,
      userId,
    });

    const total = await GreetingLogModel.count({
      endpoint,
      userId,
    });

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error fetching greeting logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch greeting logs',
    });
  }
}

export async function getGreetingLogById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const log = await GreetingLogModel.findById(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        error: 'Greeting log not found',
      });
    }

    res.json({
      success: true,
      data: { log },
    });
  } catch (error) {
    console.error('Error fetching greeting log:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch greeting log',
    });
  }
}

export async function updateGreetingLog(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { message, endpoint, userName } = req.body;

    const existingLog = await GreetingLogModel.findById(id);
    
    if (!existingLog) {
      return res.status(404).json({
        success: false,
        error: 'Greeting log not found',
      });
    }

    const updatedLog = await GreetingLogModel.updateById(id, {
      message: message || existingLog.message,
      endpoint: endpoint || existingLog.endpoint,
      userName: userName || existingLog.userName,
    });

    res.json({
      success: true,
      data: updatedLog,
    });
  } catch (error) {
    console.error('Error updating greeting log:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update greeting log',
    });
  }
}

export async function deleteGreetingLog(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const log = await GreetingLogModel.findById(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        error: 'Greeting log not found',
      });
    }

    await GreetingLogModel.deleteById(id);

    res.json({
      success: true,
      message: 'Greeting log deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting greeting log:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete greeting log',
    });
  }
}

export async function createGreetingLog(req: Request, res: Response) {
  try {
    const { message, level, metadata } = req.body;
    const user = auth.user(req);

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required',
      });
    }

    // Get client IP and user agent
    const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
    const userAgent = req.get('User-Agent') || 'unknown';

    const logData = {
      endpoint: '/logs/create',
      message: `[${level?.toUpperCase() || 'INFO'}] ${message}`,
      userName: user?.name || 'Anonymous',
      userId: user?.id || null,
      userRole: user?.role || undefined,
      ipAddress,
      userAgent,
    };

    const log = await GreetingLogModel.create(logData);

    res.status(201).json({
      success: true,
      data: log,
    });
  } catch (error) {
    console.error('Error creating greeting log:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create greeting log',
    });
  }
}

export async function searchGreetingLogs(req: Request, res: Response) {
  try {
    const query = req.query.q as string;
    const level = req.query.level as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    // For now, we'll do a simple search by message content
    // In a real app, you'd use full-text search or Elasticsearch
    const logs = await GreetingLogModel.findMany({
      page,
      limit,
    });

    // Filter results based on query and level
    const filteredLogs = logs.filter(log => {
      const matchesQuery = log.message.toLowerCase().includes(query.toLowerCase()) ||
                          log.endpoint.toLowerCase().includes(query.toLowerCase()) ||
                          (log.userName && log.userName.toLowerCase().includes(query.toLowerCase()));
      
      const matchesLevel = !level || log.message.toLowerCase().includes(`[${level.toLowerCase()}]`);
      
      return matchesQuery && matchesLevel;
    });

    const total = filteredLogs.length;

    res.json({
      success: true,
      data: {
        logs: filteredLogs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Error searching greeting logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search greeting logs',
    });
  }
}

export async function clearAllGreetingLogs(req: Request, res: Response) {
  try {
    const deletedCount = await GreetingLogModel.deleteMany();

    res.json({
      success: true,
      message: `Cleared ${deletedCount.count} greeting logs`,
      data: { deletedCount: deletedCount.count },
    });
  } catch (error) {
    console.error('Error clearing greeting logs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear greeting logs',
    });
  }
}

export function initializeEventListeners() {
  const climateEvent = eventClass.get('climate_weather');
  
  climateEvent.on('weather.data.fetched', async (eventData: any) => {
    try {
      console.log('Received weather.data.fetched event:', eventData);
      
      await GreetingLogModel.create({
        endpoint: eventData.endpoint,
        message: `Weather data fetched for ${eventData.weatherData.city}: ${eventData.weatherData.temperature}°${eventData.weatherData.units[0].toUpperCase()} - ${eventData.weatherData.condition}`,
        userName: `Weather-${eventData.weatherData.city}`,
        ipAddress: 'climate-app',
        userAgent: 'Climate-Weather-Service'
      });
      
      console.log('Weather trigger log created successfully');
    } catch (error) {
      console.error('Failed to create weather trigger log:', error);
    }
  });
}