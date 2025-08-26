import { Request, Response } from 'express';
import { authClass } from '@voilajsx/appkit';
import { GreetingLogModel } from './logs.models.js';

const auth = authClass.get();

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

export async function deleteGreetingLog(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const user = auth.user(req);

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

export async function clearAllGreetingLogs(req: Request, res: Response) {
  try {
    const user = auth.user(req);

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